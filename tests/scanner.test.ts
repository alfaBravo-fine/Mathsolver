import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  rgbaToGrayscale,
  computeLaplacianSharpness,
  normalizeBackgroundIllumination,
  sharpenAndStretchContrast,
  binarizeHandwritingAdaptive,
  computeZoomCropRect
} from '../src/scanner/imagePreprocessor';
import {
  sanitizeOcrMath,
  getLocalTesseractPaths,
  isReasonableMath,
  formatForMathpad
} from '../src/scanner/ocrEngine';
import {
  classifyMathProblem,
  normalizeMathSyntax,
  extractMathStatementFromText
} from '../src/scanner/formulaClassifier';
import { Solver } from '../src/solver';

describe('Offline Math Scanner & Dedicated Solver Pipeline', () => {
  describe('1. Bundled 100% Offline Tesseract.js v5 Assets & Local Paths', () => {
    it('resolves strict local /vendor/tesseract paths with zero external CDN URLs', () => {
      const paths = getLocalTesseractPaths('http://localhost:3000');
      expect(paths.workerPath).toBe('http://localhost:3000/vendor/tesseract/worker.min.js');
      expect(paths.corePath).toBe('http://localhost:3000/vendor/tesseract');
      expect(paths.langPath).toBe('http://localhost:3000/vendor/tesseract/lang');
      expect(JSON.stringify(paths)).not.toMatch(/jsdelivr|unpkg|cdnjs|googleapis|mathpix/i);
    });

    it('verifies local worker, WASM cores, and eng.traineddata.gz exist in public/vendor/tesseract', () => {
      const root = process.cwd();
      const requiredAssets = [
        'public/vendor/tesseract/worker.min.js',
        'public/vendor/tesseract/tesseract-core-simd-lstm.wasm.js',
        'public/vendor/tesseract/tesseract-core-lstm.wasm.js',
        'public/vendor/tesseract/tesseract-core-simd.wasm.js',
        'public/vendor/tesseract/tesseract-core.wasm.js',
        'public/vendor/tesseract/lang/eng.traineddata.gz',
        'vendor/tesseract/worker.min.js',
        'vendor/tesseract/lang/eng.traineddata.gz'
      ];
      for (const rel of requiredAssets) {
        expect(fs.existsSync(path.join(root, rel)), `Missing offline asset: ${rel}`).toBe(true);
      }
    });

    it('enforces zero external cloud AI APIs or gallery/file picker triggers in app code', () => {
      const root = process.cwd();
      const htmlContent = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
      const syncHtmlContent = fs.readFileSync(path.join(root, 'math_solver_app.html'), 'utf8');
      expect(syncHtmlContent).toBe(htmlContent);
      expect(htmlContent).not.toMatch(/ocrFileInput|pickGalleryOrFile|triggerFileUpload|handleFileSelected|Camera\.getPhoto/);
      expect(htmlContent).not.toMatch(/openai|anthropic|mathpix|generativelanguage\.googleapis/i);
    });
  });

  describe('2. Client-Side Image Preprocessing, Digital Zoom Crop & Sharpness Detection', () => {
    it('computes centered crop rectangles for digital zoom slider levels (1.0x - 4.0x)', () => {
      const full = computeZoomCropRect(1920, 1080, 1.0);
      expect(full).toEqual({ sx: 0, sy: 0, sw: 1920, sh: 1080, zoom: 1 });

      const z2 = computeZoomCropRect(1920, 1080, 2.0);
      expect(z2).toEqual({ sx: 480, sy: 270, sw: 960, sh: 540, zoom: 2 });

      const z4 = computeZoomCropRect(1600, 1200, 4.0);
      expect(z4).toEqual({ sx: 600, sy: 450, sw: 400, sh: 300, zoom: 4 });
    });

    it('converts RGBA pixels to perceptual luminance grayscale accurately', () => {
      const rgba = new Uint8ClampedArray([
        255, 0, 0, 255,   // pure red -> 76
        0, 255, 0, 255,   // pure green -> 149
        0, 0, 255, 255,   // pure blue -> 29
        255, 255, 255, 255 // white -> 255
      ]);
      const gray = rgbaToGrayscale(rgba, 4, 1);
      expect(gray[0]).toBe(76);
      expect(gray[1]).toBe(149);
      expect(gray[2]).toBe(29);
      expect(gray[3]).toBe(255);
    });

    it('distinguishes sharp stroke edges from flat/blurry frames via Laplacian variance', () => {
      const w = 80;
      const h = 80;
      const blurry = new Uint8Array(w * h).fill(200);
      const sharp = new Uint8Array(w * h).fill(230);

      // Draw crisp dark stroke block in center of sharp image
      for (let y = 25; y < 55; y++) {
        for (let x = 25; x < 55; x++) {
          sharp[y * w + x] = 20;
        }
      }

      const blurScore = computeLaplacianSharpness(blurry, w, h);
      const sharpScore = computeLaplacianSharpness(sharp, w, h);
      expect(blurScore).toBe(0);
      expect(sharpScore).toBeGreaterThan(200);
    });

    it('flattens uneven shadows & applies Sauvola handwriting thresholding + despeckling', () => {
      const w = 120;
      const h = 80;
      const unevenGray = new Uint8Array(w * h);

      // Simulate left-to-right paper shadow gradient (dark 110 on left to bright 235 on right)
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          unevenGray[y * w + x] = Math.round(110 + (x / w) * 125);
        }
      }

      // Draw dark handwritten stroke band in shadowed left side (x=25..40, y=25..55)
      for (let y = 25; y < 55; y++) {
        for (let x = 25; x < 40; x++) {
          unevenGray[y * w + x] = 28;
        }
      }

      // Add an isolated 1-pixel noise speckle at (90, 60)
      unevenGray[60 * w + 90] = 5;

      const flat = normalizeBackgroundIllumination(unevenGray, w, h);
      const stretched = sharpenAndStretchContrast(flat, w, h);
      const binary = binarizeHandwritingAdaptive(stretched, w, h, true);

      // Paper background on both shaded left and bright right should threshold to white (255)
      expect(binary[10 * w + 10]).toBe(255);
      expect(binary[10 * w + 105]).toBe(255);
      // Center of handwritten ink stroke should threshold to black ink (0)
      expect(binary[40 * w + 32]).toBe(0);
      // Isolated 1-pixel speckle should be despeckled back to white (255)
      expect(binary[60 * w + 90]).toBe(255);
    });
  });

  describe('3. Offline OCR Formula Sanitizer & Prose Extraction', () => {
    it('repairs implicit exponents and O/0 misreads in quadratic equations', () => {
      expect(sanitizeOcrMath('x2 - 5x + 6 = O')).toBe('x^2 - 5x + 6 = 0');
      expect(sanitizeOcrMath('2x² + 3x - 2 = o')).toBe('2x^2 + 3x - 2 = 0');
    });

    it('repairs trig, root, bracket, and simultaneous equation line breaks', () => {
      expect(sanitizeOcrMath('s1n(30)')).toBe('sin(30)');
      expect(sanitizeOcrMath('c0s(60)')).toBe('cos(60)');
      expect(sanitizeOcrMath('[2 + 3] × 4')).toBe('(2 + 3) * 4');
      expect(sanitizeOcrMath('2x + y = 10\nx - y = 2')).toBe('2x + y = 10, x - y = 2');
    });

    it('strips random punctuation, noise symbols, and OCR artifacts', () => {
      expect(sanitizeOcrMath('`#$ 3x + 5 = 20 @!~;')).toBe('3x + 5 = 20');
      expect(sanitizeOcrMath('x^2 - 4x + 4 = 0 |;:')).toBe('x^2 - 4x + 4 = 0');
      expect(sanitizeOcrMath('{2x + 3} * 5')).toBe('(2x + 3) * 5');
    });

    it('formats clean spacing for Mathpad typebar input', () => {
      const formatted = formatForMathpad('2x+5=15');
      expect(formatted).toBe('2x + 5 = 15');
      const formattedQuad = formatForMathpad('x^2-5x+6=0');
      expect(formattedQuad).toBe('x^2 - 5x + 6 = 0');
    });

    it('detects unparseable or noisy garbage OCR strings to prevent typebar pollution', () => {
      expect(isReasonableMath('!@#$%^&*')).toBe(false);
      expect(isReasonableMath('kljh oxq asdf qwer')).toBe(false);
      expect(isReasonableMath('(x + 2')).toBe(false); // unclosed parenthesis
      expect(isReasonableMath('x) + 2')).toBe(false); // unmatched closing paren
      expect(isReasonableMath('2x + 5 = 15')).toBe(true);
      expect(isReasonableMath('x^2 - 9 = 0')).toBe(true);
      expect(isReasonableMath('sin(30)')).toBe(true);
      expect(isReasonableMath('3/4 + 1/2')).toBe(true);
    });

    it('extracts canonical math statements from textbook/worksheet prose prompts', () => {
      expect(extractMathStatementFromText('Solve the quadratic equation: 2x^2 - 5x + 2 = 0')).toBe(
        '2x^2 - 5x + 2 = 0'
      );
      expect(extractMathStatementFromText('Find the derivative of x^4 - 3x^2 + 7')).toBe(
        'd/dx(x^4 - 3x^2 + 7)'
      );
      expect(extractMathStatementFromText('Evaluate the integral of 6x^2 + 4x dx')).toBe(
        'integral(6x^2 + 4x)dx'
      );
      expect(extractMathStatementFromText('Solve simultaneous system: 3x + y = 9 and x - y = 3')).toBe(
        '3x + y = 9, x - y = 3'
      );
    });
  });

  describe('4. Question Classifier, Dedicated Formula Solver Routing & Batch Solving', () => {
    it('classifies and solves quadratic equations extracting a, b, c, discriminant & roots', async () => {
      const cls = classifyMathProblem('2x^2 + 3x - 2 = 0');
      expect(cls.code).toBe('QUADRATIC_EQUATION');
      expect(cls.params.a).toBe(2);
      expect(cls.params.b).toBe(3);
      expect(cls.params.c).toBe(-2);
      expect(cls.params.discriminant).toBe(25);

      const res = await Solver.solve('2x^2 + 3x - 2 = 0');
      expect(res.error).toBeFalsy();
      expect(res.questionType).toBe('QUADRATIC_EQUATION');
      expect(res.extractedValues).toContain('a = 2');
      expect(res.extractedValues).toContain('b = 3');
      expect(res.extractedValues).toContain('c = -2');
      expect(res.answer).toContain('x = -2');
      expect(res.answer).toContain('x = 0.5');
    });

    it('routes prose-wrapped textbook prompts directly into dedicated formula solvers', async () => {
      const quadRes = await Solver.solve('Solve quadratic equation: x^2 - 5x + 6 = 0');
      expect(quadRes.error).toBeFalsy();
      expect(quadRes.questionType).toBe('QUADRATIC_EQUATION');
      expect(quadRes.answer).toContain('x = 2');
      expect(quadRes.answer).toContain('x = 3');

      const derivRes = await Solver.solve('Find the derivative of x^4 - 3x^2 + 7');
      expect(derivRes.error).toBeFalsy();
      expect(derivRes.questionType).toBe('CALCULUS_DERIVATIVE');
      expect(derivRes.answer.replace(/\s+/g, '')).toBe('4x^3-6x');
    });

    it('classifies and solves linear equations in one variable', async () => {
      const cls = classifyMathProblem('4x - 12 = 20');
      expect(cls.code).toBe('LINEAR_EQUATION');

      const res = await Solver.solve('4x - 12 = 20');
      expect(res.error).toBeFalsy();
      expect(res.questionType).toBe('LINEAR_EQUATION');
      expect(res.answer).toBe('x = 8');
    });

    it('classifies and solves simultaneous linear systems', async () => {
      const cls = classifyMathProblem('3x + 2y = 12, x - y = 1');
      expect(cls.code).toBe('LINEAR_SYSTEM');
      expect(cls.params.a1).toBe(3);
      expect(cls.params.b1).toBe(2);
      expect(cls.params.c1).toBe(12);

      const res = await Solver.solve('3x + 2y = 12, x - y = 1');
      expect(res.error).toBeFalsy();
      expect(res.questionType).toBe('LINEAR_SYSTEM');
      expect(res.answer).toBe('x = 2.8, y = 1.8');
    });

    it('classifies and solves calculus derivatives and multi-term power-rule integrals', async () => {
      const derivCls = classifyMathProblem('d/dx(3x^3 - 4x + 5)');
      expect(derivCls.code).toBe('CALCULUS_DERIVATIVE');

      const derivRes = await Solver.solve('d/dx(3x^3 - 4x + 5)');
      expect(derivRes.error).toBeFalsy();
      expect(derivRes.questionType).toBe('CALCULUS_DERIVATIVE');
      expect(derivRes.answer.replace(/\s+/g, '')).toBe('9x^2-4');

      const intCls = classifyMathProblem(normalizeMathSyntax('∫(3x^2 + 2x)dx'));
      expect(intCls.code).toBe('CALCULUS_INTEGRAL');

      const intRes = await Solver.solve('integral(3x^2 + 2x)dx');
      expect(intRes.error).toBeFalsy();
      expect(intRes.questionType).toBe('CALCULUS_INTEGRAL');
      expect(intRes.answer).toBe('x^3 + x^2 + C');
    });

    it('classifies and solves trigonometric and fraction arithmetic problems', async () => {
      const trigRes = await Solver.solve('cos(60)');
      expect(trigRes.error).toBeFalsy();
      expect(trigRes.questionType).toBe('TRIGONOMETRY');
      expect(trigRes.answer).toBe('0.5');

      const fracRes = await Solver.solve('(3/4) + (5/8)');
      expect(fracRes.error).toBeFalsy();
      expect(fracRes.questionType).toBe('ARITHMETIC');
      expect(fracRes.categoryLabel).toContain('Fractions');
      expect(fracRes.answer).toBe('1.375');
    });

    it('supports batch solving multiple past problems sequentially for single-PDF export', async () => {
      const batch = await Solver.solveBatch([
        'x^2 - 9 = 0',
        '2x + y = 7, x - y = 2',
        'd/dx(x^3)',
        'sin(30)'
      ]);
      expect(batch).toHaveLength(4);
      expect(batch[0].questionType).toBe('QUADRATIC_EQUATION');
      expect(batch[1].answer).toBe('x = 3, y = 1');
      expect(batch[2].answer.replace(/\s+/g, '')).toBe('3x^2');
      expect(batch[3].answer).toBe('0.5');
    });
  });
});
