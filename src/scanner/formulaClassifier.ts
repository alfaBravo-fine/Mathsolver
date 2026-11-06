import * as math from 'mathjs';

export type QuestionCategoryCode =
  | 'QUADRATIC_EQUATION'
  | 'LINEAR_SYSTEM'
  | 'LINEAR_EQUATION'
  | 'CALCULUS_DERIVATIVE'
  | 'CALCULUS_INTEGRAL'
  | 'TRIGONOMETRY'
  | 'ALGEBRAIC_EXPRESSION'
  | 'ARITHMETIC';

export interface ClassifiedProblem {
  code: QuestionCategoryCode;
  categoryLabel: string;
  formulaTitle: string;
  formulaLatex: string;
  normalizedExpr: string;
  variable?: string;
  variables?: string[];
  extractedSummary: string;
  extractedLatex: string;
  params: Record<string, any>;
}

const KNOWN_MATH_IDENTIFIERS = new Set([
  'sqrt', 'cbrt', 'log', 'ln', 'log10', 'log2', 'abs', 'exp', 'deg', 'rad',
  'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
  'arcsin', 'arccos', 'arctan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
  'pi', 'e', 'integral', 'integrate', 'int', 'diff', 'derivative', 'lim', 'sum',
  'infinity', 'inf', 'delta', 'dx', 'dy', 'dz', 'dt', 'da', 'db', 'dtheta'
]);

/**
 * Extract algebraic variable names while ignoring built-in math functions and constants.
 */
export function extractAlgebraVariables(exprStr: string): string[] {
  if (!exprStr) return [];
  const tokens = exprStr.match(/[a-zA-Z\u0370-\u03FF]+/g) || [];
  const vars: string[] = [];
  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (!KNOWN_MATH_IDENTIFIERS.has(lower) && !vars.includes(token)) {
      vars.push(token);
    }
  }
  return vars;
}

/**
 * Normalize Unicode math glyphs, superscripts, roots, and operator symbols into canonical parser syntax.
 */
export function normalizeMathSyntax(rawInput: string): string {
  if (!rawInput) return '';
  let clean = rawInput.trim();

  const superscripts: Record<string, string> = {
    '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4',
    '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9',
    '⁺': '^+', '⁻': '^-', 'ⁿ': '^n'
  };
  for (const [sup, rep] of Object.entries(superscripts)) {
    clean = clean.split(sup).join(rep);
  }

  return clean
    .replace(/[\u2012\u2013\u2014\u2212_]/g, '-')
    .replace(/[\u00D7\u22C5•]/g, '*')
    .replace(/[\u00F7]/g, '/')
    .replace(/π/g, 'pi')
    .replace(/\bPi\b/g, 'pi')
    .replace(/θ/g, 'theta')
    .replace(/Δ/g, 'Delta')
    .replace(/√\s*\(([^)]+)\)/g, 'sqrt($1)')
    .replace(/√([0-9a-zA-Z]+)/g, 'sqrt($1)')
    .replace(/√/g, 'sqrt')
    .replace(/∛\s*\(([^)]+)\)/g, 'cbrt($1)')
    .replace(/∛([0-9a-zA-Z]+)/g, 'cbrt($1)')
    .replace(/∛/g, 'cbrt')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract the core mathematical formula or equation from noisy/prose OCR text
 * (e.g., "Solve the quadratic equation: 2x^2 - 5x + 2 = 0" -> "2x^2 - 5x + 2 = 0",
 *  "Find the derivative of x^3 + 2x" -> "d/dx(x^3 + 2x)",
 *  "Integrate 3x^2 + 1 dx" -> "integral(3x^2 + 1)dx").
 */
export function extractMathStatementFromText(rawText: string): string {
  if (!rawText) return '';
  let text = rawText.trim();

  // 1. Keyword-guided calculus extraction ("Find the derivative of ...", "Differentiate ...")
  const derivProse = text.match(
    /^(?:find\s+(?:the\s+)?derivative\s+(?:of|for)|differentiate|derivative\s+of)\b[:\s]*(.+)$/i
  );
  if (derivProse && derivProse[1]) {
    let body = derivProse[1].trim();
    const eqAssign = body.match(/^(?:f\s*\(\s*([a-zA-Z])\s*\)|([a-zA-Z]))\s*=\s*(.+)$/);
    const wrtMatch = body.match(/\bwith\s+respect\s+to\s+([a-zA-Z])\b/i);
    body = body.replace(/\bwith\s+respect\s+to\s+[a-zA-Z]\b/i, '').trim();
    let variable = wrtMatch?.[1] || eqAssign?.[1] || 'x';
    if (eqAssign && eqAssign[3]) {
      body = eqAssign[3].trim();
    }
    const vars = extractAlgebraVariables(body);
    if (!wrtMatch && !eqAssign?.[1] && vars.length > 0) {
      variable = vars[0];
    }
    return `d/d${variable}(${body})`;
  }

  // 2. Keyword-guided integral extraction ("Evaluate the integral of ...", "Integrate ...")
  const intProse = text.match(
    /^(?:evaluate\s+(?:the\s+)?integral(?:\s+of)?|find\s+(?:the\s+)?(?:indefinite\s+)?integral(?:\s+of)?|integral\s+of|integrate)\b[:\s]*(.+)$/i
  );
  if (intProse && intProse[1]) {
    let body = intProse[1].trim();
    const diffEnd = body.match(/^(.*?)\s*d([a-zA-Z])$/i);
    let variable = 'x';
    if (diffEnd && diffEnd[1]) {
      body = diffEnd[1].trim();
      variable = diffEnd[2];
    } else {
      const vars = extractAlgebraVariables(body);
      if (vars.length > 0) variable = vars[0];
    }
    body = body.replace(/^∫\s*/, '').trim();
    return `integral(${body})d${variable}`;
  }

  // 3. Strip common textbook / worksheet command prefixes before equations/expressions
  text = text
    .replace(
      /^(?:solve(?:\s+the)?(?:\s+quadratic|\s+linear|\s+simultaneous|\s+system\s+of)?(?:\s+equation[s]?|\s+system)?(?:\s+for\s+[a-zA-Z])?|find(?:\s+the\s+value\s+of|\s+roots\s+of)?|evaluate|simplify|calculate|compute|factor(?:ize)?)\b[:\s\-]*/i,
      ''
    )
    .trim();

  // Replace prose "and" between two equations with ", "
  if (/\band\b/i.test(text) && (text.match(/=/g) || []).length === 2) {
    text = text.replace(/\s+\band\b\s+/gi, ', ');
  }

  return text;
}

/**
 * Offline Regex & AST-assisted Pattern Matcher & Question Classifier.
 * Identifies the exact question category, formula type, and extracts coefficients/parameters.
 */
export function classifyMathProblem(rawInput: string): ClassifiedProblem {
  const extracted = extractMathStatementFromText(rawInput);
  const clean = normalizeMathSyntax(extracted || rawInput);

  // 1. CALCULUS: DERIVATIVE PATTERN MATCHING
  const derivRegex = /^(?:d\/d([a-zA-Z])|diff|derivative)\s*\(?([^)]+?)\)?$/i;
  const primeDerivRegex = /^f'\(\s*([a-zA-Z])\s*\)\s*=\s*(.+)$/i;
  const derivMatch = clean.match(derivRegex) || clean.match(primeDerivRegex);
  if (derivMatch) {
    const respectTo = clean.match(primeDerivRegex)
      ? derivMatch[1]
      : derivMatch[1] || extractAlgebraVariables(derivMatch[2])[0] || 'x';
    const targetExpr = derivMatch[2].trim();
    return {
      code: 'CALCULUS_DERIVATIVE',
      categoryLabel: 'Calculus · Differentiation',
      formulaTitle: 'Derivative Power & Chain Rule',
      formulaLatex: `\\frac{d}{d${respectTo}}\\left[f(${respectTo})\\right]`,
      normalizedExpr: clean,
      variable: respectTo,
      extractedSummary: `Function f(${respectTo}) = ${targetExpr}, differentiate w.r.t. ${respectTo}`,
      extractedLatex: `f(${respectTo}) = ${targetExpr}, \\quad \\text{variable} = ${respectTo}`,
      params: { targetExpr, respectTo }
    };
  }

  // 2. CALCULUS: INTEGRAL PATTERN MATCHING
  const intFuncRegex = /^(?:integral|integrate|int)\s*\(([^)]+?)\)(?:\s*d([a-zA-Z]))?$/i;
  const intSymRegex = /^(?:∫|\\int)\s*(.+?)(?:\s*d([a-zA-Z]))?$/i;
  const intMatch = clean.match(intFuncRegex) || clean.match(intSymRegex);
  if (intMatch) {
    const integrand = intMatch[1].trim();
    const respectTo = intMatch[2] || extractAlgebraVariables(integrand)[0] || 'x';
    return {
      code: 'CALCULUS_INTEGRAL',
      categoryLabel: 'Calculus · Integration',
      formulaTitle: 'Indefinite Integral & Power Rule',
      formulaLatex: `\\int ${respectTo}^n \\, d${respectTo} = \\frac{${respectTo}^{n+1}}{n+1} + C`,
      normalizedExpr: clean,
      variable: respectTo,
      extractedSummary: `Integrand f(${respectTo}) = ${integrand}, integrate w.r.t. ${respectTo}`,
      extractedLatex: `\\text{Integrand} = ${integrand}, \\quad d${respectTo}`,
      params: { integrand, respectTo }
    };
  }

  // 3. SIMULTANEOUS LINEAR SYSTEM PATTERN MATCHING (2 equations)
  const splitEqs = clean
    .split(/[,;\n]|(?:\band\b)/i)
    .map(s => s.trim())
    .filter(Boolean);
  if (splitEqs.length === 2 && splitEqs[0].includes('=') && splitEqs[1].includes('=')) {
    const [eq1Str, eq2Str] = splitEqs;
    const vars = Array.from(
      new Set([...extractAlgebraVariables(eq1Str), ...extractAlgebraVariables(eq2Str)])
    );
    const v1 = vars[0] || 'x';
    const v2 = vars[1] || 'y';

    try {
      const parseLinearRow = (eqStr: string) => {
        const [lhs, rhs] = eqStr.split('=').map(s => s.trim());
        const diff = `(${lhs}) - (${rhs})`;
        const c = -Number(math.evaluate(diff, { [v1]: 0, [v2]: 0 }));
        const a = Number(math.evaluate(diff, { [v1]: 1, [v2]: 0 })) + c;
        const b = Number(math.evaluate(diff, { [v1]: 0, [v2]: 1 })) + c;
        return { a, b, c };
      };
      const row1 = parseLinearRow(eq1Str);
      const row2 = parseLinearRow(eq2Str);

      return {
        code: 'LINEAR_SYSTEM',
        categoryLabel: 'Algebra · Simultaneous Linear System',
        formulaTitle: '2×2 Linear System (Cramer / Elimination)',
        formulaLatex: `\\begin{cases} a_1${v1} + b_1${v2} = c_1 \\\\ a_2${v1} + b_2${v2} = c_2 \\end{cases}`,
        normalizedExpr: clean,
        variables: [v1, v2],
        extractedSummary: `Eq(1): a₁=${row1.a}, b₁=${row1.b}, c₁=${row1.c} | Eq(2): a₂=${row2.a}, b₂=${row2.b}, c₂=${row2.c}`,
        extractedLatex: `a_1=${row1.a},\\; b_1=${row1.b},\\; c_1=${row1.c}; \\quad a_2=${row2.a},\\; b_2=${row2.b},\\; c_2=${row2.c}`,
        params: {
          v1,
          v2,
          a1: row1.a,
          b1: row1.b,
          c1: row1.c,
          a2: row2.a,
          b2: row2.b,
          c2: row2.c
        }
      };
    } catch {
      // Fall through if parsing throws
    }
  }

  // 4. SINGLE-VARIABLE EQUATIONS WITH '=' (QUADRATIC vs LINEAR)
  if (clean.includes('=')) {
    const parts = clean.split('=');
    if (parts.length === 2) {
      const lhsStr = parts[0].trim() || '0';
      const rhsStr = parts[1].trim() || '0';
      const diffExpr = `(${lhsStr}) - (${rhsStr})`;
      const vars = extractAlgebraVariables(diffExpr);

      if (vars.length === 1) {
        const v = vars[0];
        try {
          const f0 = Number(math.evaluate(diffExpr, { [v]: 0 }));
          const f1 = Number(math.evaluate(diffExpr, { [v]: 1 }));
          const fn1 = Number(math.evaluate(diffExpr, { [v]: -1 }));

          const c = Number.isInteger(f0) ? f0 : parseFloat(f0.toFixed(6));
          const rawA = (f1 + fn1 - 2 * f0) / 2;
          const rawB = (f1 - fn1) / 2;
          const a = Number.isInteger(rawA) ? rawA : parseFloat(rawA.toFixed(6));
          const b = Number.isInteger(rawB) ? rawB : parseFloat(rawB.toFixed(6));

          // Check quadratic regex or non-zero x^2 coefficient
          const quadSyntaxRegex = new RegExp(`(${v}\\s*\\^\\s*2|\\(${v}[^)]*\\)\\s*\\*)`, 'i');
          if (Math.abs(a) >= 1e-6 || quadSyntaxRegex.test(clean)) {
            if (Math.abs(a) >= 1e-6) {
              const disc = parseFloat((b * b - 4 * a * c).toFixed(6));
              return {
                code: 'QUADRATIC_EQUATION',
                categoryLabel: 'Algebra · Quadratic Equation',
                formulaTitle: 'Quadratic Formula',
                formulaLatex: `${v} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
                normalizedExpr: clean,
                variable: v,
                extractedSummary: `Variable ${v}: a = ${a}, b = ${b}, c = ${c} (Δ = ${disc})`,
                extractedLatex: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
                params: { variable: v, a, b, c, discriminant: disc, lhsStr, rhsStr, diffExpr }
              };
            }
          }

          // Linear equation: a_lin * v + b_lin = c_lin (or standard B*v + C = 0)
          let lhsConst = 0;
          let lhsSlope = b;
          let rhsConst = -c;
          try {
            lhsConst = Number(math.evaluate(lhsStr, { [v]: 0 }));
            const lhsAt1 = Number(math.evaluate(lhsStr, { [v]: 1 }));
            lhsSlope = Number.isInteger(lhsAt1 - lhsConst)
              ? lhsAt1 - lhsConst
              : parseFloat((lhsAt1 - lhsConst).toFixed(6));
            rhsConst = Number(math.evaluate(rhsStr, { [v]: 0 }));
          } catch {
            // Keep default extracted values
          }

          return {
            code: 'LINEAR_EQUATION',
            categoryLabel: 'Algebra · Linear Equation',
            formulaTitle: 'Linear Equation Isolation (ax + b = c)',
            formulaLatex: `a${v} + b = c \\implies ${v} = \\frac{c - b}{a}`,
            normalizedExpr: clean,
            variable: v,
            extractedSummary: `Variable ${v}: coefficient = ${b}, constant = ${c}`,
            extractedLatex: `a = ${lhsSlope}, \\quad b = ${lhsConst}, \\quad c = ${rhsConst}`,
            params: {
              variable: v,
              coeff: b,
              constant: c,
              lhsSlope,
              lhsConst,
              rhsConst,
              lhsStr,
              rhsStr,
              diffExpr
            }
          };
        } catch {
          // Fall through to algebraic equation
        }
      }
    }
  }

  // 5. TRIGONOMETRY PATTERN MATCHING
  const trigRegex = /\b(arcsin|arccos|arctan|asin|acos|atan|sin|cos|tan|cot|sec|csc)\s*\(\s*([^)]+)\s*\)/i;
  const trigMatch = clean.match(trigRegex);
  if (trigMatch) {
    const func = trigMatch[1].toLowerCase();
    const arg = trigMatch[2].trim();
    const unit = /pi|π/i.test(arg) ? 'radians' : 'degrees';
    return {
      code: 'TRIGONOMETRY',
      categoryLabel: 'Trigonometry · Trigonometric Evaluation',
      formulaTitle: `Trigonometric Function (${func.toUpperCase()})`,
      formulaLatex: func.startsWith('a')
        ? `\\theta = \\${func.replace('arc', 'arc')}(x)`
        : `\\${func}(\\theta)`,
      normalizedExpr: clean,
      extractedSummary: `Function ${func}(${arg}) [${unit}]`,
      extractedLatex: `\\text{Function} = \\${func}, \\quad \\text{Argument} = ${arg}`,
      params: { func, arg, unit, isExactSingleCall: clean.trim().toLowerCase() === trigMatch[0].toLowerCase() }
    };
  }

  // 6. ALGEBRAIC / POLYNOMIAL SIMPLIFICATION PATTERN MATCHING
  const vars = extractAlgebraVariables(clean);
  if (vars.length > 0) {
    const hasPower = /\^\s*[0-9]+/.test(clean);
    return {
      code: 'ALGEBRAIC_EXPRESSION',
      categoryLabel: hasPower
        ? 'Algebra · Polynomial & Exponent Simplification'
        : 'Algebra · Algebraic Expression',
      formulaTitle: 'Polynomial Expansion & Like-Term Reduction',
      formulaLatex: `P(${vars.join(', ')})`,
      normalizedExpr: clean,
      variables: vars,
      extractedSummary: `Variables: ${vars.join(', ')} | Expression: ${clean}`,
      extractedLatex: `\\text{Variables}: ${vars.join(', ')}`,
      params: { variables: vars }
    };
  }

  // 7. ARITHMETIC & FRACTIONS PATTERN MATCHING
  const isFractionHeavy = /\//.test(clean);
  return {
    code: 'ARITHMETIC',
    categoryLabel: isFractionHeavy
      ? 'Arithmetic · Fractions & Rational Operations'
      : 'Arithmetic · Order of Operations (PEMDAS)',
    formulaTitle: isFractionHeavy
      ? 'Rational Fraction Evaluation'
      : 'Order of Operations (PEMDAS)',
    formulaLatex: isFractionHeavy ? `\\frac{p}{q}` : `a \\circ b`,
    normalizedExpr: clean,
    extractedSummary: `Numerical Expression: ${clean}`,
    extractedLatex: `\\text{Expression} = ${clean}`,
    params: { isFractionHeavy }
  };
}
