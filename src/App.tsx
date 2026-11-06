/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { sharedCameraManager } from './scanner/cameraManager';
import {
  preprocessMathCanvas,
  computeZoomCropRect,
  cropCanvasByZoom
} from './scanner/imagePreprocessor';
import {
  sharedOfflineOcr,
  sanitizeOcrMath,
  isReasonableMath,
  formatForMathpad
} from './scanner/ocrEngine';
import {
  classifyMathProblem,
  extractMathStatementFromText,
  normalizeMathSyntax
} from './scanner/formulaClassifier';
import {
  loadDataUrlToCanvas,
  runOfflineMathScannerPipeline
} from './scanner/mathScannerPipeline';
import { Solver } from './solver';

export interface MathScannerEngineBridge {
  camera: typeof sharedCameraManager;
  preprocessMathCanvas: typeof preprocessMathCanvas;
  computeZoomCropRect: typeof computeZoomCropRect;
  cropCanvasByZoom: typeof cropCanvasByZoom;
  loadDataUrlToCanvas: typeof loadDataUrlToCanvas;
  ocr: typeof sharedOfflineOcr;
  sanitizeOcrMath: typeof sanitizeOcrMath;
  isReasonableMath: typeof isReasonableMath;
  formatForMathpad: typeof formatForMathpad;
  classifyMathProblem: typeof classifyMathProblem;
  extractMathStatementFromText: typeof extractMathStatementFromText;
  normalizeMathSyntax: typeof normalizeMathSyntax;
  runPipeline: typeof runOfflineMathScannerPipeline;
  solver: typeof Solver;
}

declare global {
  interface Window {
    MathScannerEngine?: MathScannerEngineBridge;
  }
}

const bridgeInstance: MathScannerEngineBridge = {
  camera: sharedCameraManager,
  preprocessMathCanvas,
  computeZoomCropRect,
  cropCanvasByZoom,
  loadDataUrlToCanvas,
  ocr: sharedOfflineOcr,
  sanitizeOcrMath,
  isReasonableMath,
  formatForMathpad,
  classifyMathProblem,
  extractMathStatementFromText,
  normalizeMathSyntax,
  runPipeline: runOfflineMathScannerPipeline,
  solver: Solver
};

if (typeof window !== 'undefined') {
  window.MathScannerEngine = bridgeInstance;
}

export default function App() {
  useEffect(() => {
    window.MathScannerEngine = bridgeInstance;
  }, []);

  return null;
}
