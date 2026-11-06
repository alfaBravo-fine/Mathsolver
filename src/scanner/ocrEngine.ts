import { createWorker, Worker, PSM } from 'tesseract.js';

export interface OcrProgressUpdate {
  stage: 'initializing' | 'recognizing';
  progress: number; // 0..100
  message: string;
}

export interface OcrRecognitionResult {
  rawText: string;
  cleanedMath: string;
  confidence: number;
  elapsedMs: number;
}

/**
 * Known valid mathematical functions, constants, and command keywords.
 */
const ALLOWED_MATH_KEYWORDS = [
  'd/dx', 'd/dy', 'd/dz', 'd/dt', 'd/da', 'd/db',
  'diff', 'derivative', 'integral', 'integrate',
  'sqrt', 'cbrt', 'root',
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'arcsin', 'arccos', 'arctan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh',
  'log10', 'log2', 'log', 'ln', 'exp', 'abs',
  'pi', 'theta', 'delta', 'Delta'
];

/**
 * Validate whether a sanitized string contains a coherent, parseable mathematical expression
 * rather than random OCR garbage or noise.
 */
export function isReasonableMath(expr: string): boolean {
  if (!expr || expr.length < 1) return false;
  const trimmed = expr.trim();
  if (trimmed.length < 1) return false;

  // Count mathematical core components
  const digits = (trimmed.match(/\d/g) || []).length;
  const variables = (trimmed.match(/[a-zA-Z]/g) || []).length;
  const operators = (trimmed.match(/[+\-*/=^√∫]/g) || []).length;

  // Must have at least some numbers or variables
  if (digits + variables === 0) return false;

  // Check balanced parentheses/brackets
  let balance = 0;
  for (const ch of trimmed) {
    if (ch === '(') balance++;
    else if (ch === ')') {
      balance--;
      if (balance < 0) return false;
    }
  }
  if (balance !== 0) return false;

  // Reject isolated stray letters that are not known math tokens, variables, or functions
  // E.g. "x y z q w" or long text prose that wasn't cleaned
  const lettersOnly = trimmed.replace(/[^a-zA-Z]/g, '');
  if (lettersOnly.length > 25 && operators === 0 && !trimmed.includes('=')) {
    return false;
  }

  // Expression must have at least one operator, number, equals sign, or math function
  const hasKnownFn = ALLOWED_MATH_KEYWORDS.some(kw =>
    new RegExp(`\\b${kw.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(trimmed)
  );

  if (!hasKnownFn && operators === 0 && !trimmed.includes('=')) {
    // If no operators, must be a simple number or simple term like "5" or "3x" or "42"
    if (!/^\s*-?\s*\d*\.?\d+\s*[a-zA-Z]?\s*$/.test(trimmed)) {
      return false;
    }
  }

  return true;
}

/**
 * Format a sanitized equation string cleanly for Mathpad input:
 * - Proper spacing around operators (+, -, *, /, =)
 * - Canonical function brackets
 * - No redundant double spaces
 */
export function formatForMathpad(expr: string): string {
  if (!expr) return '';
  let formatted = expr.trim();

  // Normalize Unicode superscripts to caret exponents
  formatted = formatted
    .replace(/⁰/g, '^0')
    .replace(/¹/g, '^1')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁴/g, '^4')
    .replace(/⁵/g, '^5')
    .replace(/⁶/g, '^6')
    .replace(/⁷/g, '^7')
    .replace(/⁸/g, '^8')
    .replace(/⁹/g, '^9');

  // Space out operators cleanly: +, -, *, /, =, <=, >=, !=
  formatted = formatted
    .replace(/\s*([=])\s*/g, ' = ')
    .replace(/\s*([+])\s*/g, ' + ')
    .replace(/\s*([*×•])\s*/g, ' * ')
    .replace(/\s*([/÷])\s*/g, ' / ')
    .replace(/\s*([,;])\s*/g, ', ');

  // Handle minus sign spacing: distinguish negative numbers/terms from subtraction
  // E.g. " - 5x" vs "3x - 5"
  formatted = formatted.replace(/([0-9a-zA-Z\)])\s*-\s*([0-9a-zA-Z\(])/g, '$1 - $2');

  // Clean double spaces and spaces inside brackets
  formatted = formatted
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s*\^\s*/g, '^')
    .replace(/\s+/g, ' ')
    .trim();

  return formatted;
}

/**
 * Clean, sanitize, and repair raw OCR output for printed & handwritten mathematical formulas.
 * Strips stray punctuation, noise symbols, random letters, and isolates valid math expressions.
 */
export function sanitizeOcrMath(raw: string): string {
  if (!raw) return '';
  let s = raw;

  // 1. Convert Unicode superscripts (⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻ⁿ) into caret exponents (^0..^9, ^n)
  const superscripts: Record<string, string> = {
    '⁰': '^0',
    '¹': '^1',
    '²': '^2',
    '³': '^3',
    '⁴': '^4',
    '⁵': '^5',
    '⁶': '^6',
    '⁷': '^7',
    '⁸': '^8',
    '⁹': '^9',
    '⁺': '^+',
    '⁻': '^-',
    'ⁿ': '^n'
  };
  for (const [sup, rep] of Object.entries(superscripts)) {
    s = s.split(sup).join(rep);
  }

  // 2. Strip common textbook / worksheet prose instructions before math equations
  s = s
    .replace(/^(?:solve(?:\s+the)?(?:\s+quadratic|\s+linear|\s+simultaneous|\s+system\s+of)?(?:\s+equation[s]?|\s+system)?(?:\s+for\s+[a-zA-Z])?|find(?:\s+the\s+value\s+of|\s+roots\s+of|\s+the\s+derivative\s+of|\s+the\s+integral\s+of)?|evaluate|simplify|calculate|compute|factor(?:ize)?|differentiate|integrate)\b[:\s\-]*/i, '')
    .trim();

  // 3. Repair common handwriting/print OCR keyword misreads
  s = s
    .replace(/\b[s5][i1l]n\b/gi, 'sin')
    .replace(/\bc[o0]s\b/gi, 'cos')
    .replace(/\bt[a4]n\b/gi, 'tan')
    .replace(/\bc[o0]t\b/gi, 'cot')
    .replace(/\b[s5]ec\b/gi, 'sec')
    .replace(/\bc[s5]c\b/gi, 'csc')
    .replace(/\b[s5]qrt\b/gi, 'sqrt')
    .replace(/\b[1l]og\b/gi, 'log')
    .replace(/\b[1l]n\b/gi, 'ln')
    .replace(/\bd\s*\/\s*d\s*[×\*xX]\b/gi, 'd/dx');

  // 4. Join multi-line simultaneous equations with comma if 2 lines both contain '='
  const rawLines = s
    .split(/\r?\n+/)
    .map(l => l.trim())
    .filter(Boolean);
  if (rawLines.length === 2 && rawLines[0].includes('=') && rawLines[1].includes('=')) {
    s = `${rawLines[0]}, ${rawLines[1]}`;
  } else {
    s = rawLines.join(' ');
  }

  // 5. Normalize operators, brackets, and dashes
  s = s
    .replace(/[\u2012\u2013\u2014\u2212_~]/g, '-')
    .replace(/[\u00D7\u22C5•]/g, '*')
    .replace(/(\d)\s*[xX×]\s*(\d)/g, '$1 * $2')
    .replace(/[\u00F7]/g, '/')
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/\{/g, '(')
    .replace(/\}/g, ')')
    .replace(/==+/g, '=')
    .replace(/=\s*>/g, '>=')
    .replace(/<\s*=/g, '<=')
    .replace(/!\s*=/g, '!=');

  // 6. Fix common 'o' or 'O' misread as '0' around equals or isolated numbers
  s = s
    .replace(/=\s*[oO]\b/g, '= 0')
    .replace(/\b[oO]\s*=/g, '0 =')
    .replace(/\b([a-zA-Z0-9])\s+[tT]\s+([0-9a-zA-Z])/g, '$1 + $2');

  // 7. Convert implicit exponent digits after variables or closing parens (e.g., x2 -> x^2)
  // while preserving already-caret exponents like x^3, x^10, x^n
  s = s.replace(
    /([a-zA-Z\)])\s*([2-9])(?=\s*[\+\-\*\/\=\)]|\s+[a-zA-Z0-9]|\s*$)/g,
    '$1^$2'
  );
  s = s.replace(/([a-zA-Z0-9\)])\s*\^\s*([0-9a-zA-Z]+)/g, '$1^$2');

  // 8. STRICT OCR FILTER: Remove stray noise characters, unreadable Unicode symbols,
  // backticks, quotes, hashtags, dollar signs, tildes, pipes, slashes that aren't division
  s = s.replace(/[`~#$@&_|\\!?:;'"]/g, ' ');

  // 9. Remove isolated noise letters that are not valid mathematical variables
  // Allowed single variables: x, y, z, t, a, b, c, n, k, m, u, v, r, s
  // Strip stray multi-character OCR gibberish (e.g. "kljh", "oxq", "asdf")
  const tokens = s.split(/\s+/);
  const cleanedTokens: string[] = [];

  for (const token of tokens) {
    if (!token) continue;

    // Reject standalone stray operator or punctuation tokens that don't belong
    if (/^[+\-*/=,]$/.test(token)) {
      cleanedTokens.push(token);
      continue;
    }

    // Check if token matches a known math keyword
    const isKeyword = ALLOWED_MATH_KEYWORDS.some(
      kw => token.toLowerCase().startsWith(kw) || token.toLowerCase().endsWith(kw)
    );

    // Or contains valid math syntax (numbers, operators, standard variables)
    const hasMathContent = /[\d+\-*/=^()√∫πθΔ≤≥,]/.test(token);
    const isValidVarToken = /^[a-zA-Z]$/.test(token) || /^[a-zA-Z]\^[0-9a-zA-Z]+$/.test(token);

    if (isKeyword || hasMathContent || isValidVarToken) {
      cleanedTokens.push(token);
    } else if (/^[a-zA-Z]{1,3}$/.test(token)) {
      // Possible variable or short symbol, check if alphanumeric math term
      if (/^[xyztabcnkmruvrsXYZ]$/.test(token)) {
        cleanedTokens.push(token);
      }
    }
  }

  s = cleanedTokens.join(' ');

  // 10. Clean up duplicate operators (+ -, ++, --)
  s = s
    .replace(/\+\s*\+/g, '+')
    .replace(/-\s*-/g, '+')
    .replace(/\+\s*-|-\s*\+/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

  // Strip trailing punctuation noise, stray commas/colons, or dangling trailing operators
  s = s.replace(/[\.,:;]+$/, '').trim();
  s = s.replace(/[\+\-\*\/\=]+$/, '').trim();
  s = s.replace(/^[\+\*\/\=]+/, '').trim(); // note: leading minus is allowed for negative numbers

  // Format with clean typebar spacing
  return formatForMathpad(s);
}

/**
 * Resolve 100% local offline asset paths for Tesseract.js v5 worker, WASM core, and language data.
 * Zero CDN or external internet calls.
 */
export function getLocalTesseractPaths(origin?: string) {
  const base =
    origin ||
    (typeof window !== 'undefined' && window.location && window.location.origin !== 'null'
      ? window.location.origin
      : '');
  const prefix = base ? `${base}/vendor/tesseract` : './vendor/tesseract';
  return {
    workerPath: `${prefix}/worker.min.js`,
    corePath: prefix,
    langPath: `${prefix}/lang`
  };
}

/**
 * 100% Offline Tesseract.js v5 Worker Engine optimized for mathematical recognition.
 */
export class OfflineOcrEngine {
  private worker: Worker | null = null;
  private initPromise: Promise<Worker> | null = null;
  private progressCallback: ((update: OcrProgressUpdate) => void) | null = null;

  async getWorker(onProgress?: (update: OcrProgressUpdate) => void): Promise<Worker> {
    this.progressCallback = onProgress || null;

    if (this.worker) {
      return this.worker;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      const paths = getLocalTesseractPaths();
      this.progressCallback?.({
        stage: 'initializing',
        progress: 15,
        message: 'Initializing offline OCR worker...'
      });

      const worker = await createWorker('eng', 1, {
        workerPath: paths.workerPath,
        corePath: paths.corePath,
        langPath: paths.langPath,
        workerBlobURL: false,
        gzip: true,
        logger: m => {
          if (m.status === 'recognizing text' && typeof m.progress === 'number') {
            this.progressCallback?.({
              stage: 'recognizing',
              progress: Math.round(m.progress * 100),
              message: `Running Offline OCR (${Math.round(m.progress * 100)}%)...`
            });
          }
        }
      });

      // Configure Tesseract LSTM parameters specifically for math characters & formulas
      await worker.setParameters({
        tessedit_char_whitelist:
          '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=^()[]{}.,:;√∫πθΔ°%<>≤≥±×÷| ',
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        preserve_interword_spaces: '1'
      });

      this.worker = worker;
      return worker;
    })();

    try {
      return await this.initPromise;
    } catch (err) {
      this.initPromise = null;
      throw err;
    }
  }

  /**
   * Run 100% offline OCR recognition on a preprocessed HTMLCanvasElement.
   */
  async recognizeCanvas(
    canvas: HTMLCanvasElement,
    onProgress?: (update: OcrProgressUpdate) => void
  ): Promise<OcrRecognitionResult> {
    const start = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const worker = await this.getWorker(onProgress);

    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK
    });

    let res = await worker.recognize(canvas);
    let rawText = (res?.data?.text || '').trim();
    let confidence = typeof res?.data?.confidence === 'number' ? res.data.confidence : 0;

    // Adaptive fallback to SINGLE_LINE mode if block recognition yields empty or low-confidence text
    if (!rawText || confidence < 62) {
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_LINE
      });
      const lineRes = await worker.recognize(canvas);
      const lineText = (lineRes?.data?.text || '').trim();
      const lineConf = typeof lineRes?.data?.confidence === 'number' ? lineRes.data.confidence : 0;
      if (lineText && (!rawText || lineConf > confidence)) {
        rawText = lineText;
        confidence = lineConf;
      }
    }

    const cleanedMath = sanitizeOcrMath(rawText);
    const elapsedMs = Math.round(
      (typeof performance !== 'undefined' ? performance.now() : Date.now()) - start
    );

    return {
      rawText,
      cleanedMath,
      confidence,
      elapsedMs
    };
  }

  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.initPromise = null;
    }
  }
}

export const sharedOfflineOcr = new OfflineOcrEngine();
