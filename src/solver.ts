import * as math from 'mathjs';

export interface StepItem {
  title: string;
  expression: string;
  note: string;
}

export interface SolveResult {
  query: string;
  answer: string;
  formulaStatement?: {
    title: string;
    latex: string;
  };
  givenValues?: string;
  substitution?: string;
  intermediateSteps?: StepItem[];
  finalResult?: string;
  steps: StepItem[];
  error?: boolean;
  systemMethods?: {
    cramer?: StepItem[];
    factorization?: StepItem[];
    substitution?: StepItem[];
    elimination?: StepItem[];
  };
}

export const Solver = {
  extractVariables(exprStr: string): string[] {
    if (!exprStr) return [];
    const known = new Set([
      'sqrt', 'cbrt', 'log', 'ln', 'log10', 'log2', 'abs', 'exp', 'deg', 'rad',
      'sin', 'cos', 'tan', 'cot', 'sec', 'csc',
      'arcsin', 'arccos', 'arctan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh',
      'pi', 'e', 'integral', 'integrate', 'diff', 'derivative', 'lim', 'sum', 'infinity',
      'delta', 'dx', 'dy', 'dz', 'dt', 'da', 'db'
    ]);
    const tokens = exprStr.match(/[a-zA-Z\u0370-\u03FF]+/g) || [];
    const vars: string[] = [];
    for (const token of tokens) {
      const lower = token.toLowerCase();
      if (!known.has(lower) && !vars.includes(token)) {
        vars.push(token);
      }
    }
    return vars;
  },

  async solve(rawInput: string): Promise<SolveResult> {
    if (!rawInput || !rawInput.trim()) {
      return {
        query: rawInput,
        answer: "Empty Expression",
        error: true,
        steps: [{ title: "Input Error", expression: "", note: "Please enter a valid mathematical expression." }]
      };
    }

    let clean = rawInput.trim();

    // Normalize unicode superscripts to carets
    const superscripts: Record<string, string> = {
      '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4',
      '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9',
      '⁺': '^+', '⁻': '^-'
    };
    for (const [sup, rep] of Object.entries(superscripts)) {
      clean = clean.split(sup).join(rep);
    }

    clean = clean
      .replace(/[\u2012\u2013\u2014\u2212_]/g, '-')
      .replace(/[\u00D7\u22C5]/g, '*')
      .replace(/[\u00F7]/g, '/')
      .replace(/π/g, 'pi')
      .replace(/\bPi\b/g, 'pi')
      .replace(/θ/g, 'theta')
      .replace(/Δ/g, 'Delta');

    // 1. SIMULTANEOUS LINEAR EQUATIONS (Multiple equations separated by comma, semicolon, or "and")
    if (this.isSimultaneousSystem(clean)) {
      return this.solveSystemOfLinearEquations(rawInput, clean);
    }

    // 2. DERIVATIVE DETECTION: d/dx(...) or diff(...) or derivative(...)
    const derivMatch = clean.match(/^(?:d\/d([a-zA-Z])|diff|derivative)\s*\(?([^)]+?)\)?$/i);
    if (derivMatch) {
      return this.solveDerivative(rawInput, derivMatch[2].trim(), derivMatch[1] || null);
    }

    // 3. INTEGRAL DETECTION: integral(...) or integrate(...) or ∫...
    const intMatch = clean.match(/^(?:integral|integrate)\s*\(?([^)]+?)\)?(?:\s*d([a-zA-Z]))?$/i) || clean.match(/^(?:∫)\s*(.+?)(?:\s*d([a-zA-Z]))?$/i);
    if (intMatch) {
      return this.solveIntegral(rawInput, intMatch[1].trim(), intMatch[2] || null);
    }

    // 4. EQUATIONS WITH EQUALS SIGN (Linear, Quadratic, Multi-Variable)
    if (clean.includes('=')) {
      return this.solveEquation(rawInput, clean);
    }

    // 5. TRIGONOMETRIC EXPRESSIONS: sin(30), cos(45), tan(60)...
    const trigMatch = clean.match(/^(sin|cos|tan|cot|sec|csc)\s*\(\s*([^)]+)\s*\)$/i);
    if (trigMatch) {
      return this.solveTrig(rawInput, trigMatch[1].toLowerCase(), trigMatch[2].trim());
    }

    // 6. GENERAL POLYNOMIAL / ALGEBRAIC SIMPLIFICATION
    const stripped = clean.replace(/[a-zA-Z]+/g, m => ['sqrt','log','ln','abs','exp','pi','e'].includes(m.toLowerCase()) ? '' : m);
    if (/[a-zA-Z]/.test(stripped)) {
      return this.solveAlgebraic(rawInput, clean);
    }

    // 7. ARITHMETIC EVALUATION
    return this.solveArithmetic(rawInput, clean);
  },

  isSimultaneousSystem(clean: string): boolean {
    const splitEqs = clean.split(/[,;\n]|(?:\band\b)/i).map(s => s.trim()).filter(Boolean);
    return splitEqs.length === 2 && splitEqs[0].includes('=') && splitEqs[1].includes('=');
  },

  // Enhanced Simultaneous Linear Equations Solver with Division Method & Factorization Method
  solveSystemOfLinearEquations(raw: string, clean: string): SolveResult {
    const eqStrings = clean.split(/[,;\n]|(?:\band\b)/i).map(s => s.trim()).filter(Boolean);
    if (eqStrings.length !== 2) {
      return {
        query: raw,
        answer: "System Error",
        error: true,
        steps: [{ title: "Input Error", expression: raw, note: "Linear system requires exactly two equations." }]
      };
    }

    const [eq1Str, eq2Str] = eqStrings;
    const parseCoeffs = (eqStr: string, v1: string, v2: string) => {
      const parts = eqStr.split('=');
      const lhs = parts[0].trim();
      const rhs = parts[1].trim();
      const diff = `(${lhs}) - (${rhs})`;
      
      const c = -Number(math.evaluate(diff, { [v1]: 0, [v2]: 0 }));
      const a = Number(math.evaluate(diff, { [v1]: 1, [v2]: 0 })) + c;
      const b = Number(math.evaluate(diff, { [v1]: 0, [v2]: 1 })) + c;
      return { a, b, c };
    };

    const vars = Array.from(new Set([...this.extractVariables(eq1Str), ...this.extractVariables(eq2Str)]));
    const v1 = vars[0] || 'x';
    const v2 = vars[1] || 'y';

    try {
      const e1 = parseCoeffs(eq1Str, v1, v2);
      const e2 = parseCoeffs(eq2Str, v1, v2);

      const a1 = e1.a, b1 = e1.b, c1 = e1.c;
      const a2 = e2.a, b2 = e2.b, c2 = e2.c;

      // Determinants for Matrix Division / Cramer's Rule:
      // D = | a1  b1 | = a1*b2 - a2*b1
      //     | a2  b2 |
      const D = a1 * b2 - a2 * b1;
      const Dx = c1 * b2 - c2 * b1;
      const Dy = a1 * c2 - a2 * c1;

      if (Math.abs(D) < 1e-9) {
        const hasNoSolution = Math.abs(Dx) > 1e-9 || Math.abs(Dy) > 1e-9;
        const msg = hasNoSolution ? "Inconsistent System (No Solution — Parallel Lines)" : "Dependent System (Infinitely Many Solutions)";
        return {
          query: raw,
          answer: msg,
          error: true,
          steps: [{ title: "Determinant Evaluation", expression: `D = (${a1})(${b2}) - (${a2})(${b1}) = 0`, note: msg }]
        };
      }

      const valX = Dx / D;
      const valY = Dy / D;
      const cleanX = Number.isInteger(valX) ? valX : parseFloat(valX.toFixed(4));
      const cleanY = Number.isInteger(valY) ? valY : parseFloat(valY.toFixed(4));
      const answerStr = `${v1} = ${cleanX}, ${v2} = ${cleanY}`;

      // 1. Division Method / Cramer's Matrix Inversion Steps
      const divisionSteps: StepItem[] = [
        {
          title: "Matrix Representation (AX = B)",
          expression: `\\begin{pmatrix} ${a1} & ${b1} \\\\ ${a2} & ${b2} \\end{pmatrix} \\begin{pmatrix} ${v1} \\\\ ${v2} \\end{pmatrix} = \\begin{pmatrix} ${c1} \\\\ ${c2} \\end{pmatrix}`,
          note: "Set up the linear system in standard matrix form A X = B"
        },
        {
          title: "Coefficient Matrix Determinant (D)",
          expression: `D = \\det(A) = (${a1})(${b2}) - (${a2})(${b1}) = ${a1 * b2} - (${a2 * b1}) = ${D}`,
          note: "Calculate the base coefficient determinant"
        },
        {
          title: "First Variable Determinant (D_" + v1 + ")",
          expression: `D_{${v1}} = \\det\\begin{pmatrix} ${c1} & ${b1} \\\\ ${c2} & ${b2} \\end{pmatrix} = (${c1})(${b2}) - (${c2})(${b1}) = ${Dx}`,
          note: "Replace first column with the constant vector B"
        },
        {
          title: "Second Variable Determinant (D_" + v2 + ")",
          expression: `D_{${v2}} = \\det\\begin{pmatrix} ${a1} & ${c1} \\\\ ${a2} & ${c2} \\end{pmatrix} = (${a1})(${c2}) - (${a2})(${c1}) = ${Dy}`,
          note: "Replace second column with the constant vector B"
        },
        {
          title: "Matrix Division & Quotient Evaluation",
          expression: `${v1} = \\frac{D_{${v1}}}{D} = \\frac{${Dx}}{${D}} = ${cleanX}, \\quad ${v2} = \\frac{D_{${v2}}}{D} = \\frac{${Dy}}{${D}} = ${cleanY}`,
          note: "Divide modified determinants by main coefficient determinant"
        }
      ];

      // 2. Factorization / Systematic Elimination Steps
      const factorMultiplier = a1 !== 0 ? (a2 / a1) : 1;
      const cleanFactor = Number.isInteger(factorMultiplier) ? factorMultiplier : parseFloat(factorMultiplier.toFixed(4));
      const elimB = b2 - factorMultiplier * b1;
      const elimC = c2 - factorMultiplier * c1;
      const cleanElimB = Number.isInteger(elimB) ? elimB : parseFloat(elimB.toFixed(4));
      const cleanElimC = Number.isInteger(elimC) ? elimC : parseFloat(elimC.toFixed(4));

      const factorizationSteps: StepItem[] = [
        {
          title: "Align System Equations",
          expression: `(1): ${a1}${v1} + ${b1}${v2} = ${c1}, \\quad (2): ${a2}${v1} + ${b2}${v2} = ${c2}`,
          note: "Write equations in standard aligned form"
        },
        {
          title: "Determine Row Pivot Elimination Factor",
          expression: `m = \\frac{a_2}{a_1} = \\frac{${a2}}{${a1}} = ${cleanFactor}`,
          note: "Compute scalar factor to eliminate " + v1 + " from equation 2"
        },
        {
          title: "Triangular Factorization / Row Elimination",
          expression: `\\text{Eq(2)} - (${cleanFactor})\\text{Eq(1)} \\implies (${cleanElimB})${v2} = ${cleanElimC}`,
          note: "Produces an upper-triangular factorized system"
        },
        {
          title: "Back-Substitution for " + v2,
          expression: `${v2} = \\frac{${cleanElimC}}{${cleanElimB}} = ${cleanY}`,
          note: "Isolate and evaluate variable " + v2
        },
        {
          title: "Back-Substitution for " + v1,
          expression: `${a1}${v1} + (${b1})(${cleanY}) = ${c1} \\implies ${a1}${v1} = ${c1 - b1 * cleanY} \\implies ${v1} = ${cleanX}`,
          note: "Substitute " + v2 + " into equation 1 to solve for " + v1
        }
      ];

      return {
        query: raw,
        answer: answerStr,
        formulaStatement: {
          title: "Simultaneous Linear System (2 Equations, 2 Unknowns)",
          latex: `\\begin{cases} a_1${v1} + b_1${v2} = c_1 \\\\ a_2${v1} + b_2${v2} = c_2 \\end{cases}`
        },
        givenValues: `(1): ${a1}${v1} + ${b1}${v2} = ${c1}, \\quad (2): ${a2}${v1} + ${b2}${v2} = ${c2}`,
        substitution: `${v1} = \\frac{D_{${v1}}}{D} = \\frac{${Dx}}{${D}} = ${cleanX}, \\quad ${v2} = \\frac{D_{${v2}}}{D} = \\frac{${Dy}}{${D}} = ${cleanY}`,
        intermediateSteps: divisionSteps,
        finalResult: answerStr,
        steps: divisionSteps,
        systemMethods: {
          cramer: divisionSteps,
          factorization: factorizationSteps
        }
      };
    } catch (err: any) {
      return {
        query: raw,
        answer: "System Solving Error",
        error: true,
        steps: [{ title: "Evaluation Error", expression: raw, note: err.message }]
      };
    }
  },

  solveEquation(raw: string, clean: string): SolveResult {
    const parts = clean.split('=');
    if (parts.length !== 2) {
      return {
        query: raw,
        answer: "Invalid Equation Format",
        error: true,
        steps: [{ title: "Syntax Error", expression: raw, note: "Equations must have exactly one '=' sign." }]
      };
    }

    const lhsStr = parts[0].trim() || '0';
    const rhsStr = parts[1].trim() || '0';
    const diffExpr = `(${lhsStr}) - (${rhsStr})`;
    const vars = this.extractVariables(diffExpr);

    // Single Variable (e.g., 2x + 5 = 15 or x^2 - 5x + 6 = 0)
    if (vars.length === 1) {
      const v = vars[0];
      try {
        const f0 = Number(math.evaluate(diffExpr, { [v]: 0 }));
        const f1 = Number(math.evaluate(diffExpr, { [v]: 1 }));
        const fn1 = Number(math.evaluate(diffExpr, { [v]: -1 }));
        const f2 = Number(math.evaluate(diffExpr, { [v]: 2 }));

        const c = f0;
        const a = (f1 + fn1 - 2 * c) / 2;
        const b = (f1 - fn1) / 2;

        // Linear equation: b*v + c = 0 -> v = -c/b
        if (Math.abs(a) < 1e-6) {
          if (Math.abs(b) < 1e-6) {
            const isId = Math.abs(c) < 1e-6;
            const ans = isId ? "Identity (True for all " + v + ")" : "No Solution (Contradiction)";
            return {
              query: raw,
              answer: ans,
              formulaStatement: { title: "Linear Equation", latex: `a${v} + b = 0` },
              givenValues: `\\text{LHS} = ${lhsStr}, \\; \\text{RHS} = ${rhsStr}`,
              substitution: `${diffExpr} = 0`,
              intermediateSteps: [{ title: "Result", expression: ans, note: "" }],
              finalResult: ans,
              steps: [{ title: "Result", expression: ans, note: "" }]
            };
          }

          const root = -c / b;
          const cleanRoot = Number.isInteger(root) ? root : parseFloat(root.toFixed(4));
          const ans = `${v} = ${cleanRoot}`;
          const intermediate: StepItem[] = [
            { title: "Standard Form", expression: `${b}${v} ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`, note: "Linear equation in one variable" },
            { title: "Isolate Variable Term", expression: `${b}${v} = ${-c}`, note: `Move constant to right side` },
            { title: "Solve for " + v, expression: `${v} = \\frac{${-c}}{${b}} = ${cleanRoot}`, note: "Divide by coefficient of " + v }
          ];

          return {
            query: raw,
            answer: ans,
            formulaStatement: { title: "Linear Equation", latex: `${b}${v} + (${c}) = 0 \\implies ${v} = -\\frac{c}{b}` },
            givenValues: `b = ${b}, \\quad c = ${c}`,
            substitution: `${v} = \\frac{${-c}}{${b}}`,
            intermediateSteps: intermediate,
            finalResult: ans,
            steps: intermediate
          };
        }

        // Quadratic equation: a*v^2 + b*v + c = 0
        const disc = b * b - 4 * a * c;
        const cleanDisc = Number.isInteger(disc) ? disc : parseFloat(disc.toFixed(4));
        const intermediate: StepItem[] = [
          { title: "Standard Quadratic Form", expression: `${a}${v}^2 ${b >= 0 ? '+' : '-'} ${Math.abs(b)}${v} ${c >= 0 ? '+' : '-'} ${Math.abs(c)} = 0`, note: `Coefficients: a = ${a}, b = ${b}, c = ${c}` },
          { title: "Calculate Discriminant (Δ)", expression: `\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${cleanDisc}`, note: disc > 0 ? "Δ > 0: two distinct real roots" : disc === 0 ? "Δ = 0: one repeated real root" : "Δ < 0: complex roots" }
        ];

        let ans = "";
        if (disc >= 0) {
          const sq = Math.sqrt(disc);
          const r1 = (-b + sq) / (2 * a);
          const r2 = (-b - sq) / (2 * a);
          const cr1 = Number.isInteger(r1) ? r1 : parseFloat(r1.toFixed(4));
          const cr2 = Number.isInteger(r2) ? r2 : parseFloat(r2.toFixed(4));
          ans = r1 === r2 ? `${v} = ${cr1}` : `${v} = ${Math.min(cr1, cr2)}, ${v} = ${Math.max(cr1, cr2)}`;
          intermediate.push({
            title: "Quadratic Formula Application",
            expression: `${v} = \\frac{-(${b}) \\pm \\sqrt{${cleanDisc}}}{2(${a})}`,
            note: "Evaluate plus and minus root branches"
          });
          intermediate.push({
            title: "Roots Evaluated",
            expression: ans,
            note: "Both solutions verified"
          });
        } else {
          const real = parseFloat((-b / (2 * a)).toFixed(4));
          const img = parseFloat((Math.sqrt(-disc) / (2 * a)).toFixed(4));
          ans = `${v} = ${real} ± ${Math.abs(img)}i`;
          intermediate.push({
            title: "Complex Conjugate Roots",
            expression: ans,
            note: "No real solutions exist"
          });
        }

        return {
          query: raw,
          answer: ans,
          formulaStatement: { title: "Quadratic Formula", latex: `${v} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}` },
          givenValues: `a = ${a}, \\; b = ${b}, \\; c = ${c}`,
          substitution: `${v} = \\frac{-(${b}) \\pm \\sqrt{(${b})^2 - 4(${a})(${c})}}{2(${a})}`,
          intermediateSteps: intermediate,
          finalResult: ans,
          steps: intermediate
        };
      } catch (err: any) {
        return { query: raw, answer: "Equation Error", error: true, steps: [{ title: "Error", expression: raw, note: err.message }] };
      }
    }

    return {
      query: raw,
      answer: `${diffExpr} = 0`,
      steps: [{ title: "Implicit Form", expression: `${diffExpr} = 0`, note: "Multi-variable equation" }]
    };
  },

  solveTrig(raw: string, func: string, argStr: string): SolveResult {
    try {
      let rad = 0;
      let angleDegrees = parseFloat(argStr);
      if (argStr.includes('pi') || argStr.includes('π')) {
        rad = Number(math.evaluate(argStr.replace(/π/g, 'pi'), { pi: Math.PI }));
        angleDegrees = rad * (180 / Math.PI);
      } else {
        rad = (angleDegrees * Math.PI) / 180;
      }

      let val = 0;
      switch (func) {
        case 'sin': val = Math.sin(rad); break;
        case 'cos': val = Math.cos(rad); break;
        case 'tan': val = Math.tan(rad); break;
        case 'cot': val = 1 / Math.tan(rad); break;
        case 'sec': val = 1 / Math.cos(rad); break;
        case 'csc': val = 1 / Math.sin(rad); break;
      }

      const cleanVal = Math.abs(val) < 1e-10 ? 0 : Number.isInteger(val) ? val : parseFloat(val.toFixed(4));
      const ans = `${cleanVal}`;
      const steps: StepItem[] = [
        { title: "Trigonometric Function", expression: `${func}(${argStr}^\\circ)`, note: "Input angle in degrees" },
        { title: "Radian Conversion", expression: `\\theta = ${angleDegrees}^\\circ \\times \\frac{\\pi}{180^\\circ} = ${parseFloat(rad.toFixed(4))} \\text{ rad}`, note: "Standard angle conversion" },
        { title: "Exact Ratio / Numerical Evaluation", expression: `${func}(${argStr}) = ${cleanVal}`, note: "Evaluated value" }
      ];

      return {
        query: raw,
        answer: ans,
        formulaStatement: { title: `Trigonometric ${func.toUpperCase()}`, latex: `\\${func}(\\theta)` },
        givenValues: `\\theta = ${argStr}^\\circ`,
        substitution: `\\${func}(${parseFloat(rad.toFixed(4))}) = ${cleanVal}`,
        intermediateSteps: steps,
        finalResult: ans,
        steps
      };
    } catch (err: any) {
      return { query: raw, answer: "Trig Error", error: true, steps: [{ title: "Error", expression: raw, note: err.message }] };
    }
  },

  solveArithmetic(raw: string, clean: string): SolveResult {
    try {
      const scope = { pi: Math.PI, e: Math.E };
      const res = math.evaluate(clean, scope);
      const val = typeof res === 'number' ? (Number.isInteger(res) ? res : parseFloat(res.toFixed(6))) : res.toString();
      const ans = `${val}`;
      const steps: StepItem[] = [
        { title: "Expression Statement", expression: clean, note: "Input arithmetic expression" },
        { title: "Order of Operations (PEMDAS)", expression: `${clean} = ${ans}`, note: "Evaluate parentheses, exponents, multiplication/division, addition/subtraction" }
      ];
      return {
        query: raw,
        answer: ans,
        intermediateSteps: steps,
        finalResult: ans,
        steps
      };
    } catch (err: any) {
      return { query: raw, answer: "Arithmetic Error", error: true, steps: [{ title: "Error", expression: raw, note: err.message }] };
    }
  },

  solveAlgebraic(raw: string, clean: string): SolveResult {
    try {
      const simp = math.simplify(clean).toString();
      const ans = simp.replace(/\s*\*\s*/g, '');
      const steps: StepItem[] = [
        { title: "Original Polynomial", expression: clean, note: "Input algebraic expression" },
        { title: "Combine Like Terms & Simplify", expression: ans, note: "Apply distributive law and polynomial reduction" }
      ];
      return {
        query: raw,
        answer: ans,
        intermediateSteps: steps,
        finalResult: ans,
        steps
      };
    } catch (err: any) {
      return { query: raw, answer: "Algebraic Error", error: true, steps: [{ title: "Error", expression: raw, note: err.message }] };
    }
  },

  solveDerivative(raw: string, targetExpr: string, respectTo: string | null = 'x'): SolveResult {
    try {
      const v = respectTo || 'x';
      const node = math.parse(targetExpr);
      const deriv = math.derivative(node, v);
      const simp = math.simplify(deriv).toString();
      const ans = simp.replace(/\s*\*\s*/g, '');
      const steps: StepItem[] = [
        { title: "Function Definition", expression: `f(${v}) = ${targetExpr}`, note: "Differentiating with respect to " + v },
        { title: "Differentiate", expression: `\\frac{d}{d${v}}[${targetExpr}] = ${ans}`, note: "Apply derivative calculus rules" }
      ];
      return {
        query: raw,
        answer: ans,
        formulaStatement: { title: "Derivative", latex: `\\frac{d}{d${v}}[f(${v})]` },
        intermediateSteps: steps,
        finalResult: ans,
        steps
      };
    } catch (err: any) {
      return { query: raw, answer: "Derivative Error", error: true, steps: [{ title: "Error", expression: raw, note: err.message }] };
    }
  },

  solveIntegral(raw: string, integrand: string, respectTo: string | null = 'x'): SolveResult {
    const v = respectTo || 'x';
    const ans = `∫(${integrand})d${v} + C`;
    const steps: StepItem[] = [
      { title: "Integrand Statement", expression: `f(${v}) = ${integrand}`, note: "Indefinite integration" },
      { title: "Antiderivative", expression: ans, note: "Add constant of integration C" }
    ];
    return {
      query: raw,
      answer: ans,
      formulaStatement: { title: "Indefinite Integral", latex: `\\int f(${v}) \\, d${v}` },
      intermediateSteps: steps,
      finalResult: ans,
      steps
    };
  }
};
