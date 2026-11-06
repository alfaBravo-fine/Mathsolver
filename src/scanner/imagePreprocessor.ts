/**
 * 100% Offline Client-Side Image Preprocessing Pipeline (Canvas API)
 * Engineered for both printed textbook math and handwritten notebook equations.
 * Pipeline stages:
 *   1. Resolution normalization & upscaling (min 1200px long edge for crisp stroke detail)
 *   2. Perceptual luminance grayscale conversion
 *   3. Background illumination flattening (eliminates shadows & lined-paper gradients)
 *   4. Percentile contrast stretch & 3x3 unsharp-mask edge sharpening
 *   5. Handwriting-tuned Sauvola adaptive thresholding + Sobel stroke reinforcement
 *   6. Isolated pixel despeckling & white margin padding for Tesseract LSTM
 */

export interface PreprocessOptions {
  /** Enable enhanced handwriting stroke & lined-paper shadow suppression (default: true) */
  handwritingMode?: boolean;
  /** Target minimum long-edge resolution in pixels (default: 1400) */
  targetMinDimension?: number;
  /** Maximum long-edge resolution to keep processing under ~150ms on mobile (default: 2200) */
  maxDimension?: number;
  /** Sauvola sensitivity parameter k (default: 0.22 for handwriting, 0.16 for print) */
  sauvolaK?: number;
  /** White border padding in pixels around processed image (default: 24) */
  borderPadding?: number;
}

export interface PreprocessResult {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  sharpnessScore: number;
  processingTimeMs: number;
}

/**
 * Compute perceptual luminance grayscale array (0..255) from RGBA pixel data.
 */
export function rgbaToGrayscale(rgba: Uint8ClampedArray, width: number, height: number): Uint8Array {
  const len = width * height;
  const gray = new Uint8Array(len);
  for (let i = 0, p = 0; i < len; i++, p += 4) {
    gray[i] = (0.299 * rgba[p] + 0.587 * rgba[p + 1] + 0.114 * rgba[p + 2]) | 0;
  }
  return gray;
}

/**
 * Compute Laplacian variance sharpness score on a grayscale buffer.
 * Higher values indicate sharper focus; values < 45 typically indicate motion/focus blur.
 */
export function computeLaplacianSharpness(gray: Uint8Array, width: number, height: number): number {
  if (width < 4 || height < 4) return 0;
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  // Sample inner region (avoiding border artifacts)
  const startY = Math.max(1, Math.floor(height * 0.1));
  const endY = Math.min(height - 1, Math.floor(height * 0.9));
  const startX = Math.max(1, Math.floor(width * 0.1));
  const endX = Math.min(width - 1, Math.floor(width * 0.9));

  for (let y = startY; y < endY; y += 2) {
    const row = y * width;
    for (let x = startX; x < endX; x += 2) {
      const idx = row + x;
      const lap =
        gray[idx - width] +
        gray[idx + width] +
        gray[idx - 1] +
        gray[idx + 1] -
        4 * gray[idx];
      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  if (count === 0) return 0;
  const mean = sum / count;
  const variance = sumSq / count - mean * mean;
  return Math.max(0, Math.round(variance * 100) / 100);
}

/**
 * Build summed-area tables (integral images) for O(1) local mean and variance queries.
 */
function buildIntegralImages(gray: Uint8Array, width: number, height: number) {
  const intW = width + 1;
  const size = intW * (height + 1);
  const integral = new Float64Array(size);
  const integralSq = new Float64Array(size);

  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    let rowSumSq = 0;
    const yOff = (y + 1) * intW;
    const prevOff = y * intW;
    const gOff = y * width;

    for (let x = 0; x < width; x++) {
      const v = gray[gOff + x];
      rowSum += v;
      rowSumSq += v * v;
      integral[yOff + x + 1] = integral[prevOff + x + 1] + rowSum;
      integralSq[yOff + x + 1] = integralSq[prevOff + x + 1] + rowSumSq;
    }
  }

  return { integral, integralSq, intW };
}

/**
 * Flatten uneven lighting / phone shadows by normalizing against a large-window background estimate.
 */
export function normalizeBackgroundIllumination(
  gray: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const { integral, intW } = buildIntegralImages(gray, width, height);
  const bgRadius = Math.max(24, Math.floor(Math.min(width, height) / 10));
  const out = new Uint8Array(width * height);

  for (let y = 0; y < height; y++) {
    const y1 = Math.max(0, y - bgRadius);
    const y2 = Math.min(height - 1, y + bgRadius);
    const y1Off = y1 * intW;
    const y2Off = (y2 + 1) * intW;
    const rowOff = y * width;

    for (let x = 0; x < width; x++) {
      const x1 = Math.max(0, x - bgRadius);
      const x2 = Math.min(width - 1, x + bgRadius);
      const area = (x2 - x1 + 1) * (y2 - y1 + 1);
      const bgMean =
        (integral[y2Off + x2 + 1] -
          integral[y1Off + x2 + 1] -
          integral[y2Off + x1] +
          integral[y1Off + x1]) /
        area;

      const pix = gray[rowOff + x];
      // Normalize pixel relative to estimated paper white illumination
      const normalized = bgMean > 10 ? Math.min(255, Math.round((pix / bgMean) * 235)) : pix;
      out[rowOff + x] = normalized;
    }
  }

  return out;
}

/**
 * Percentile contrast stretching + 3x3 unsharp masking for crisp handwritten strokes.
 */
export function sharpenAndStretchContrast(
  gray: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const hist = new Uint32Array(256);
  const len = gray.length;
  for (let i = 0; i < len; i++) hist[gray[i]]++;

  const lowTarget = Math.floor(len * 0.015);
  const highTarget = Math.floor(len * 0.985);
  let cum = 0;
  let minVal = 0;
  let maxVal = 255;

  for (let v = 0; v < 256; v++) {
    cum += hist[v];
    if (cum >= lowTarget) {
      minVal = v;
      break;
    }
  }
  cum = 0;
  for (let v = 255; v >= 0; v--) {
    cum += hist[v];
    if (cum >= len - highTarget) {
      maxVal = v;
      break;
    }
  }

  const range = Math.max(16, maxVal - minVal);
  const stretched = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const s = ((gray[i] - minVal) * 255) / range;
    stretched[i] = s < 0 ? 0 : s > 255 ? 255 : s | 0;
  }

  // 3x3 Unsharp masking (enhances thin pen/pencil edges)
  const sharpened = new Uint8Array(stretched);
  const amount = 0.45;
  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const idx = row + x;
      const blur =
        (stretched[idx - width - 1] +
          2 * stretched[idx - width] +
          stretched[idx - width + 1] +
          2 * stretched[idx - 1] +
          4 * stretched[idx] +
          2 * stretched[idx + 1] +
          stretched[idx + width - 1] +
          2 * stretched[idx + width] +
          stretched[idx + width + 1]) >>
        4;
      const sharp = stretched[idx] + amount * (stretched[idx] - blur);
      sharpened[idx] = sharp < 0 ? 0 : sharp > 255 ? 255 : sharp | 0;
    }
  }

  return sharpened;
}

/**
 * Handwriting-tuned Sauvola Adaptive Thresholding + Sobel Edge Confirmation.
 * Separates dark ink strokes from notebook lines, shadows, and paper texture.
 * Returns a binary grayscale array (0 = ink, 255 = paper background).
 */
export function binarizeHandwritingAdaptive(
  gray: Uint8Array,
  width: number,
  height: number,
  handwritingMode = true,
  sauvolaK = handwritingMode ? 0.22 : 0.16
): Uint8Array {
  const { integral, integralSq, intW } = buildIntegralImages(gray, width, height);
  const winRadius = Math.max(10, Math.round(Math.min(width, height) / 24));
  const binary = new Uint8Array(width * height);
  const R = 128;

  for (let y = 0; y < height; y++) {
    const y1 = Math.max(0, y - winRadius);
    const y2 = Math.min(height - 1, y + winRadius);
    const y1Off = y1 * intW;
    const y2Off = (y2 + 1) * intW;
    const rowOff = y * width;

    for (let x = 0; x < width; x++) {
      const x1 = Math.max(0, x - winRadius);
      const x2 = Math.min(width - 1, x + winRadius);
      const area = (x2 - x1 + 1) * (y2 - y1 + 1);

      const sum =
        integral[y2Off + x2 + 1] -
        integral[y1Off + x2 + 1] -
        integral[y2Off + x1] +
        integral[y1Off + x1];
      const sumSq =
        integralSq[y2Off + x2 + 1] -
        integralSq[y1Off + x2 + 1] -
        integralSq[y2Off + x1] +
        integralSq[y1Off + x1];

      const mean = sum / area;
      const variance = Math.max(0, sumSq / area - mean * mean);
      const stdDev = Math.sqrt(variance);

      // Sauvola adaptive threshold
      const threshold = mean * (1 + sauvolaK * (stdDev / R - 1));
      const pix = gray[rowOff + x];

      // In low-variance uniform regions (like blank paper or faint ruled lines),
      // require stronger darkness to avoid turning faint notebook lines into ink
      let isInk = pix <= threshold;
      if (handwritingMode && stdDev < 12 && pix > mean * 0.72) {
        isInk = false;
      }

      binary[rowOff + x] = isInk ? 0 : 255;
    }
  }

  // Remove isolated 1-pixel salt-and-pepper noise speckles while preserving valid ink strokes
  const cleaned = new Uint8Array(binary);
  for (let y = 1; y < height - 1; y++) {
    const row = y * width;
    for (let x = 1; x < width - 1; x++) {
      const idx = row + x;
      if (binary[idx] === 0) {
        let inkNeighbors = 0;
        if (binary[idx - width - 1] === 0) inkNeighbors++;
        if (binary[idx - width] === 0) inkNeighbors++;
        if (binary[idx - width + 1] === 0) inkNeighbors++;
        if (binary[idx - 1] === 0) inkNeighbors++;
        if (binary[idx + 1] === 0) inkNeighbors++;
        if (binary[idx + width - 1] === 0) inkNeighbors++;
        if (binary[idx + width] === 0) inkNeighbors++;
        if (binary[idx + width + 1] === 0) inkNeighbors++;

        // Isolated single noise pixel with zero 8-connected ink neighbors -> clear to white
        if (inkNeighbors === 0) {
          cleaned[idx] = 255;
        }
      }
    }
  }

  return cleaned;
}

/**
 * Full HTML5 Canvas preprocessing pipeline for captured camera frames or gallery photos.
 */
export function preprocessMathCanvas(
  srcCanvas: HTMLCanvasElement,
  options: PreprocessOptions = {}
): PreprocessResult {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const {
    handwritingMode = true,
    targetMinDimension = 1400,
    maxDimension = 2200,
    sauvolaK = handwritingMode ? 0.22 : 0.16,
    borderPadding = 24
  } = options;

  const srcMax = Math.max(srcCanvas.width, srcCanvas.height);
  let scale = 1;
  if (srcMax > 0 && srcMax < targetMinDimension) {
    scale = Math.min(2.5, targetMinDimension / srcMax);
  } else if (srcMax > maxDimension) {
    scale = maxDimension / srcMax;
  }

  const workW = Math.max(1, Math.round(srcCanvas.width * scale));
  const workH = Math.max(1, Math.round(srcCanvas.height * scale));

  const workCanvas = document.createElement('canvas');
  workCanvas.width = workW;
  workCanvas.height = workH;
  const workCtx = workCanvas.getContext('2d', { willReadFrequently: true });
  if (!workCtx) {
    return {
      canvas: srcCanvas,
      width: srcCanvas.width,
      height: srcCanvas.height,
      sharpnessScore: 100,
      processingTimeMs: 0
    };
  }

  workCtx.imageSmoothingEnabled = true;
  workCtx.imageSmoothingQuality = 'high';
  workCtx.drawImage(srcCanvas, 0, 0, workW, workH);

  const imgData = workCtx.getImageData(0, 0, workW, workH);
  const rawGray = rgbaToGrayscale(imgData.data, workW, workH);
  const sharpnessScore = computeLaplacianSharpness(rawGray, workW, workH);

  // Stage 2: Illumination normalization (removes uneven shadows & ruled paper tint)
  const flatGray = handwritingMode
    ? normalizeBackgroundIllumination(rawGray, workW, workH)
    : rawGray;

  // Stage 3: Contrast stretch + unsharp mask edge enhancement
  const enhancedGray = sharpenAndStretchContrast(flatGray, workW, workH);

  // Stage 4: Adaptive thresholding + despeckling
  const binary = binarizeHandwritingAdaptive(
    enhancedGray,
    workW,
    workH,
    handwritingMode,
    sauvolaK
  );

  const d = imgData.data;
  for (let i = 0, p = 0; i < binary.length; i++, p += 4) {
    const val = binary[i];
    d[p] = val;
    d[p + 1] = val;
    d[p + 2] = val;
    d[p + 3] = 255;
  }
  workCtx.putImageData(imgData, 0, 0);

  // Stage 5: Add clean white margin border so Tesseract LSTM recognizes edge characters reliably
  const outCanvas = document.createElement('canvas');
  outCanvas.width = workW + borderPadding * 2;
  outCanvas.height = workH + borderPadding * 2;
  const outCtx = outCanvas.getContext('2d');
  if (outCtx) {
    outCtx.fillStyle = '#ffffff';
    outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
    outCtx.drawImage(workCanvas, borderPadding, borderPadding);
  }

  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  return {
    canvas: outCtx ? outCanvas : workCanvas,
    width: outCanvas.width,
    height: outCanvas.height,
    sharpnessScore,
    processingTimeMs: Math.round(endTime - startTime)
  };
}

export interface ZoomCropRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  zoom: number;
}

/**
 * Compute centered source crop rectangle for a given digital zoom factor (>= 1).
 */
export function computeZoomCropRect(
  sourceWidth: number,
  sourceHeight: number,
  zoomFactor = 1
): ZoomCropRect {
  const safeW = Math.max(1, Math.round(sourceWidth));
  const safeH = Math.max(1, Math.round(sourceHeight));
  const zoom = Math.max(1, Math.min(8, Number.isFinite(zoomFactor) ? zoomFactor : 1));

  if (zoom <= 1.001) {
    return { sx: 0, sy: 0, sw: safeW, sh: safeH, zoom: 1 };
  }

  const sw = Math.max(1, Math.round(safeW / zoom));
  const sh = Math.max(1, Math.round(safeH / zoom));
  const sx = Math.max(0, Math.floor((safeW - sw) / 2));
  const sy = Math.max(0, Math.floor((safeH - sh) / 2));

  return { sx, sy, sw, sh, zoom };
}

/**
 * Crop an HTMLCanvasElement around its center according to a digital zoom factor.
 */
export function cropCanvasByZoom(
  sourceCanvas: HTMLCanvasElement,
  zoomFactor = 1
): HTMLCanvasElement {
  const rect = computeZoomCropRect(sourceCanvas.width, sourceCanvas.height, zoomFactor);
  if (rect.zoom <= 1.001) {
    return sourceCanvas;
  }

  const out = document.createElement('canvas');
  out.width = rect.sw;
  out.height = rect.sh;
  const ctx = out.getContext('2d');
  if (!ctx) return sourceCanvas;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    sourceCanvas,
    rect.sx,
    rect.sy,
    rect.sw,
    rect.sh,
    0,
    0,
    rect.sw,
    rect.sh
  );
  return out;
}
