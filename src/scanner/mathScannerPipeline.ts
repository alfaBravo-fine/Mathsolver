import { preprocessMathCanvas, PreprocessOptions } from './imagePreprocessor';
import { sharedOfflineOcr, OcrRecognitionResult, isReasonableMath, sanitizeOcrMath } from './ocrEngine';
import { classifyMathProblem, ClassifiedProblem } from './formulaClassifier';
import { Solver, SolveResult } from '../solver';

export type ScannerPipelineStage =
  | 'preprocessing'
  | 'ocr'
  | 'classifying_and_solving'
  | 'complete';

export interface ScannerStageEvent {
  stage: ScannerPipelineStage;
  progress: number;
  statusText: string;
}

export interface FullScannerPipelineResult {
  ocr: OcrRecognitionResult;
  classification: ClassifiedProblem;
  solution: SolveResult;
  preprocessedPreviewDataUrl?: string;
  sharpnessScore: number;
}

/**
 * Decode an image data URL (e.g. image/png snapshot) into an HTMLCanvasElement offline.
 */
export function loadDataUrlToCanvas(dataUrl: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not initialize 2D canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error('Failed to decode captured image data URL'));
    img.src = dataUrl;
  });
}

/**
 * End-to-End 100% Offline Camera Math Scanner & Dedicated Formula Solver Pipeline.
 * Accepts either a captured image/png data URL string or an HTMLCanvasElement.
 * Executes locally on-device with zero external network or AI API calls.
 */
export async function runOfflineMathScannerPipeline(
  sourceInput: HTMLCanvasElement | string,
  options: PreprocessOptions & {
    onStageChange?: (evt: ScannerStageEvent) => void;
    includePreprocessedPreview?: boolean;
  } = {}
): Promise<FullScannerPipelineResult> {
  const { onStageChange, includePreprocessedPreview = false, ...preprocessOpts } = options;

  // Stage 1: Decode data URL (if provided) & run Client-Side Canvas Preprocessing
  onStageChange?.({
    stage: 'preprocessing',
    progress: 15,
    statusText: 'Preprocessing Image...'
  });

  const sourceCanvas =
    typeof sourceInput === 'string'
      ? await loadDataUrlToCanvas(sourceInput)
      : sourceInput;

  const preprocessed = preprocessMathCanvas(sourceCanvas, preprocessOpts);
  let preprocessedPreviewDataUrl: string | undefined;
  if (includePreprocessedPreview) {
    try {
      preprocessedPreviewDataUrl = preprocessed.canvas.toDataURL('image/png');
    } catch {
      // Ignore tainted canvas errors if any
    }
  }

  // Stage 2: 100% Offline Tesseract.js v5 OCR Engine
  onStageChange?.({
    stage: 'ocr',
    progress: 40,
    statusText: 'Running Offline OCR...'
  });

  const ocr = await sharedOfflineOcr.recognizeCanvas(preprocessed.canvas, update => {
    const mapped = 40 + Math.round((update.progress / 100) * 40);
    onStageChange?.({
      stage: 'ocr',
      progress: mapped,
      statusText: `Running Offline OCR (${update.progress}%)...`
    });
  });

  // Stage 3: Offline Pattern Matching & Dedicated Formula Solver Execution
  onStageChange?.({
    stage: 'classifying_and_solving',
    progress: 85,
    statusText: 'Matching Formula & Solving...'
  });

  let targetExpression = ocr.cleanedMath || '';
  let isCoherent = isReasonableMath(targetExpression);

  if (!targetExpression || !isCoherent) {
    const rawTokens = (ocr.rawText.match(/[0-9xXyYzZaAbBcC+\-*/=^()√]+/g) || []).join(' ');
    const cleanedRaw = sanitizeOcrMath(rawTokens);
    if (cleanedRaw && isReasonableMath(cleanedRaw)) {
      targetExpression = cleanedRaw;
      isCoherent = true;
    } else if (targetExpression && targetExpression.trim().length > 0) {
      isCoherent = true;
    } else {
      targetExpression = ocr.cleanedMath || ocr.rawText.trim();
    }
  }

  const classification: ClassifiedProblem = classifyMathProblem(targetExpression);
  let solution: SolveResult = await Solver.solve(targetExpression);

  if (solution) {
    solution.questionType = solution.questionType || classification.code;
    solution.categoryLabel = solution.categoryLabel || classification.categoryLabel;
    solution.extractedValues = solution.extractedValues || classification.extractedSummary;
  }

  onStageChange?.({
    stage: 'complete',
    progress: 100,
    statusText: 'Solution Ready'
  });

  return {
    ocr,
    classification,
    solution,
    preprocessedPreviewDataUrl,
    sharpnessScore: preprocessed.sharpnessScore
  };
}
