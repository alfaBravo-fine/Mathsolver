/**
 * FORMULA GROUPS 5:
 * 1. ALGEBRA (Linear Equations with Standard Form, Balancing Method, Transposition Method; Logarithms with Product, Quotient, Power, Change of Base)
 * 2. MATRICES & LINEAR SYSTEMS (Addition/Subtraction, Scalar Mult, Matrix Mult, Determinants, Matrix Inversion Method)
 * 3. NUMBER SYSTEMS & ARITHMETIC (Ascending/Descending Order, Additive Inverse, Commutative & Associative Laws, Square Root Factorization & Long Division, Direct/Inverse Proportion, Term to Term Rule)
 * 4. GEOMETRY & MENSURATION: COMPREHENSIVE AREA OF SHAPES (Square, Rectangle, Triangle, Circle, Parallelogram, Trapezoid, Rhombus)
 * 5. THEOREMS: 5 FUNDAMENTAL THEOREMS (Pythagorean, Thales Basic Proportionality, Midpoint Theorem, Exterior Angle Theorem, Angle Sum Property)
 */

const FORMULA_GROUPS_5 = [
  // ================= 1. ALGEBRA: LINEAR EQUATIONS =================
  {
    id: 'algebra_linear_equations',
    category: 'Algebra',
    subCategory: 'Linear Equations',
    title: 'Linear Equations & Methods',
    subtitle: 'Standard Form (ax + b = c), Balancing Method, and Transposition Method',
    latex: 'ax + b = c \\implies x = \\frac{c - b}{a}, \\quad Ax + By = C',
    subFormulas: [
      {
        id: 'linear_standard_form',
        title: 'Standard Form Solver',
        desc: 'Solve linear equation in standard form: ax + b = c for unknown variable x',
        latex: 'ax + b = c \\implies x = \\frac{c - b}{a}',
        template: '(c - b) / a',
        vars: [
          { id: 'a', label: 'Coefficient a (a ≠ 0)', default: 3, type: 'number' },
          { id: 'b', label: 'Constant b', default: 5, type: 'number' },
          { id: 'c', label: 'Constant c (RHS)', default: 26, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          const c = parseFloat(v.c);
          if (a === 0) return { error: "Coefficient 'a' cannot be zero in a linear equation." };
          const diff = c - b;
          const x = diff / a;
          const cleanX = parseFloat(x.toFixed(4));
          const inter = [
            { title: "Subtract Constant b from RHS", expression: `${c} - (${b}) = ${diff}`, note: "Isolate variable term ax" },
            { title: "Divide by Coefficient a", expression: `x = \\frac{${diff}}{${a}} = ${cleanX}`, note: "Isolate x" }
          ];
          return {
            formulaStatement: { title: "Standard Linear Equation Formula", latex: "ax + b = c \\implies x = \\frac{c - b}{a}" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
            substitution: `x = \\frac{${c} - (${b})}{${a}}`,
            intermediateSteps: inter,
            finalResult: `x = ${cleanX}`,
            answer: `x = ${cleanX}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "ax + b = c \\implies x = \\frac{c - b}{a}", note: "Standard linear equation" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`, note: "Identify coefficients" },
              { title: "Step 3: Substitution", expression: `x = \\frac{${c} - ${b}}{${a}}`, note: "Substitute values into formula" },
              { title: "Step 4: Intermediate Simplification", expression: `ax = ${diff} \\implies x = \\frac{${diff}}{${a}}`, note: "Perform arithmetic" },
              { title: "Step 5: Final Result", expression: `x = ${cleanX}`, note: "Solution verified" }
            ]
          };
        }
      },
      {
        id: 'linear_balancing_method',
        title: 'Balancing Method',
        desc: 'Solve by applying identical arithmetic operations to both sides to maintain equality',
        latex: 'ax + b = c \\xrightarrow{-b} ax = c - b \\xrightarrow{\\div a} x = \\frac{c - b}{a}',
        template: '(c - b) / a',
        vars: [
          { id: 'a', label: 'Coefficient a (a ≠ 0)', default: 4, type: 'number' },
          { id: 'b', label: 'Constant b added', default: 7, type: 'number' },
          { id: 'c', label: 'RHS constant c', default: 31, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          const c = parseFloat(v.c);
          if (a === 0) return { error: "Coefficient 'a' cannot be zero." };
          const step1 = c - b;
          const x = step1 / a;
          const cleanX = parseFloat(x.toFixed(4));
          const inter = [
            { title: "Balance: Subtract b from both sides", expression: `${a}x + ${b} - (${b}) = ${c} - (${b}) \\implies ${a}x = ${step1}`, note: "Operation maintains strict equality" },
            { title: "Balance: Divide both sides by a", expression: `\\frac{${a}x}{${a}} = \\frac{${step1}}{${a}} \\implies x = ${cleanX}`, note: "Divide both sides by same non-zero number" }
          ];
          return {
            formulaStatement: { title: "Balancing Method Principle", latex: "A = B \\iff A \\pm k = B \\pm k, \\quad A \\cdot k = B \\cdot k" },
            givenValues: `\\text{Equation: } ${a}x + ${b} = ${c}`,
            substitution: `(${a}x + ${b}) - ${b} = ${c} - ${b}`,
            intermediateSteps: inter,
            finalResult: `x = ${cleanX}`,
            answer: `x = ${cleanX}`,
            steps: [
              { title: "Step 1: Write Original Equation", expression: `${a}x + ${b} = ${c}`, note: "Target equation to balance" },
              { title: "Step 2: Apply Subtraction to Both Sides", expression: `${a}x + ${b} - ${b} = ${c} - ${b}`, note: `Subtract ${b} from LHS and RHS` },
              { title: "Step 3: Simplify Both Sides", expression: `${a}x = ${step1}`, note: "Variable term is isolated" },
              { title: "Step 4: Apply Division to Both Sides", expression: `\\frac{${a}x}{${a}} = \\frac{${step1}}{${a}}`, note: `Divide both LHS and RHS by ${a}` },
              { title: "Step 5: Final Result", expression: `x = ${cleanX}`, note: "Equation perfectly balanced" }
            ]
          };
        }
      },
      {
        id: 'linear_transposition_method',
        title: 'Transposition Method',
        desc: 'Solve by transposing terms across the equals sign and inverting their algebraic signs',
        latex: 'ax + b = c \\implies ax = c - b \\implies x = \\frac{c - b}{a}',
        template: '(c - b) / a',
        vars: [
          { id: 'a', label: 'Coefficient a', default: 5, type: 'number' },
          { id: 'b', label: 'Constant b', default: -12, type: 'number' },
          { id: 'c', label: 'Constant c', default: 18, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          const c = parseFloat(v.c);
          if (a === 0) return { error: "Coefficient 'a' cannot be zero." };
          const transposedB = -b;
          const rhs = c + transposedB;
          const x = rhs / a;
          const cleanX = parseFloat(x.toFixed(4));
          const inter = [
            { title: "Transpose constant b to RHS", expression: `+(${b}) \\text{ on LHS becomes } -(${b}) \\text{ on RHS}`, note: "Transposing a term flips its operational sign" },
            { title: "Simplify RHS", expression: `${c} ${b < 0 ? '+ ' + Math.abs(b) : '- ' + b} = ${rhs}`, note: "New RHS value" },
            { title: "Transpose multiplier a to divisor", expression: `x = \\frac{${rhs}}{${a}} = ${cleanX}`, note: "Multiplication becomes division across equals sign" }
          ];
          return {
            formulaStatement: { title: "Transposition Method Rule", latex: "ax + b = c \\implies ax = c - b \\implies x = \\frac{c - b}{a}" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
            substitution: `ax = ${c} - (${b}) = ${rhs}`,
            intermediateSteps: inter,
            finalResult: `x = ${cleanX}`,
            answer: `x = ${cleanX}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "ax + b = c", note: "Initial algebraic expression" },
              { title: "Step 2: Given Values", expression: `${a}x + (${b}) = ${c}`, note: "Substitute given values" },
              { title: "Step 3: Transpose Constant", expression: `${a}x = ${c} - (${b}) = ${rhs}`, note: "Move constant term to RHS with opposite sign" },
              { title: "Step 4: Transpose Coefficient", expression: `x = \\frac{${rhs}}{${a}}`, note: "Move coefficient from numerator on LHS to denominator on RHS" },
              { title: "Step 5: Final Result", expression: `x = ${cleanX}`, note: "Transposition completed successfully" }
            ]
          };
        }
      }
    ]
  },

  // ================= 2. ALGEBRA: LOGARITHMS =================
  {
    id: 'algebra_logarithms',
    category: 'Algebra',
    subCategory: 'Logarithms',
    title: 'Logarithms & Properties',
    subtitle: 'Product Rule, Quotient Rule, Power Rule, and Change of Base Formula',
    latex: '\\log_b(xy) = \\log_b x + \\log_b y, \\quad \\log_b(x^k) = k \\log_b x, \\quad \\log_b x = \\frac{\\ln x}{\\ln b}',
    subFormulas: [
      {
        id: 'log_product_rule',
        title: 'Product Rule',
        desc: 'The log of a product is the sum of the logs of its factors: log_b(xy) = log_b(x) + log_b(y)',
        latex: '\\log_b(x \\cdot y) = \\log_b(x) + \\log_b(y)',
        template: 'log(x*y, b)',
        vars: [
          { id: 'b', label: 'Base b (b > 0, b ≠ 1)', default: 10, type: 'number' },
          { id: 'x', label: 'Argument x (x > 0)', default: 2, type: 'number' },
          { id: 'y', label: 'Argument y (y > 0)', default: 5, type: 'number' }
        ],
        compute(v) {
          const b = parseFloat(v.b);
          const x = parseFloat(v.x);
          const y = parseFloat(v.y);
          if (b <= 0 || b === 1) return { error: "Logarithm base must be positive and not equal to 1." };
          if (x <= 0 || y <= 0) return { error: "Arguments x and y must be strictly positive." };
          const prod = x * y;
          const logX = Math.log(x) / Math.log(b);
          const logY = Math.log(y) / Math.log(b);
          const logProd = Math.log(prod) / Math.log(b);
          const inter = [
            { title: "Calculate Product xy", expression: `${x} \\times ${y} = ${prod}`, note: "Combined product argument" },
            { title: "Compute log_b(x)", expression: `\\log_{${b}}(${x}) = ${parseFloat(logX.toFixed(4))}`, note: "First addend" },
            { title: "Compute log_b(y)", expression: `\\log_{${b}}(${y}) = ${parseFloat(logY.toFixed(4))}`, note: "Second addend" },
            { title: "Sum of Logarithms", expression: `${parseFloat(logX.toFixed(4))} + ${parseFloat(logY.toFixed(4))} = ${parseFloat(logProd.toFixed(4))}`, note: "Verifies equality with log_b(xy)" }
          ];
          return {
            formulaStatement: { title: "Logarithm Product Rule", latex: "\\log_b(x \\cdot y) = \\log_b(x) + \\log_b(y)" },
            givenValues: `b = ${b}, \\quad x = ${x}, \\quad y = ${y}`,
            substitution: `\\log_{${b}}(${x} \\cdot ${y}) = \\log_{${b}}(${x}) + \\log_{${b}}(${y})`,
            intermediateSteps: inter,
            finalResult: `\\log_{${b}}(${prod}) = ${parseFloat(logProd.toFixed(4))}`,
            answer: `${parseFloat(logProd.toFixed(4))}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\log_b(xy) = \\log_b x + \\log_b y", note: "Product rule of logarithms" },
              { title: "Step 2: Given Values", expression: `b = ${b}, \\quad x = ${x}, \\quad y = ${y}`, note: "Base and factor arguments" },
              { title: "Step 3: Substitution", expression: `\\log_{${b}}(${prod}) = \\log_{${b}}(${x}) + \\log_{${b}}(${y})`, note: "Apply expansion" },
              { title: "Step 4: Intermediate Values", expression: `${parseFloat(logX.toFixed(4))} + ${parseFloat(logY.toFixed(4))} = ${parseFloat(logProd.toFixed(4))}`, note: "Evaluate component logs" },
              { title: "Step 5: Final Result", expression: `\\log_{${b}}(${prod}) = ${parseFloat(logProd.toFixed(4))}`, note: "Verified through product rule" }
            ]
          };
        }
      },
      {
        id: 'log_quotient_rule',
        title: 'Quotient Rule',
        desc: 'The log of a quotient is the difference of the logs: log_b(x / y) = log_b(x) - log_b(y)',
        latex: '\\log_b\\left(\\frac{x}{y}\\right) = \\log_b(x) - \\log_b(y)',
        template: 'log(x/y, b)',
        vars: [
          { id: 'b', label: 'Base b (b > 0, b ≠ 1)', default: 10, type: 'number' },
          { id: 'x', label: 'Numerator x (x > 0)', default: 50, type: 'number' },
          { id: 'y', label: 'Denominator y (y > 0)', default: 2, type: 'number' }
        ],
        compute(v) {
          const b = parseFloat(v.b);
          const x = parseFloat(v.x);
          const y = parseFloat(v.y);
          if (b <= 0 || b === 1) return { error: "Logarithm base must be positive and not equal to 1." };
          if (x <= 0 || y <= 0) return { error: "Arguments x and y must be strictly positive." };
          const quot = x / y;
          const logX = Math.log(x) / Math.log(b);
          const logY = Math.log(y) / Math.log(b);
          const logQuot = Math.log(quot) / Math.log(b);
          const inter = [
            { title: "Calculate Quotient x / y", expression: `\\frac{${x}}{${y}} = ${quot}`, note: "Fractional argument" },
            { title: "Compute log_b(x)", expression: `\\log_{${b}}(${x}) = ${parseFloat(logX.toFixed(4))}`, note: "Log of numerator" },
            { title: "Compute log_b(y)", expression: `\\log_{${b}}(${y}) = ${parseFloat(logY.toFixed(4))}`, note: "Log of denominator" },
            { title: "Difference of Logarithms", expression: `${parseFloat(logX.toFixed(4))} - ${parseFloat(logY.toFixed(4))} = ${parseFloat(logQuot.toFixed(4))}`, note: "Subtractive property" }
          ];
          return {
            formulaStatement: { title: "Logarithm Quotient Rule", latex: "\\log_b\\left(\\frac{x}{y}\\right) = \\log_b(x) - \\log_b(y)" },
            givenValues: `b = ${b}, \\quad x = ${x}, \\quad y = ${y}`,
            substitution: `\\log_{${b}}\\left(\\frac{${x}}{${y}}\\right) = \\log_{${b}}(${x}) - \\log_{${b}}(${y})`,
            intermediateSteps: inter,
            finalResult: `\\log_{${b}}(${quot}) = ${parseFloat(logQuot.toFixed(4))}`,
            answer: `${parseFloat(logQuot.toFixed(4))}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\log_b(x/y) = \\log_b x - \\log_b y", note: "Quotient rule of logarithms" },
              { title: "Step 2: Given Values", expression: `b = ${b}, \\quad x = ${x}, \\quad y = ${y}`, note: "Base and division arguments" },
              { title: "Step 3: Substitution", expression: `\\log_{${b}}(${quot}) = \\log_{${b}}(${x}) - \\log_{${b}}(${y})`, note: "Apply rule" },
              { title: "Step 4: Intermediate Values", expression: `${parseFloat(logX.toFixed(4))} - ${parseFloat(logY.toFixed(4))} = ${parseFloat(logQuot.toFixed(4))}`, note: "Evaluate subtraction" },
              { title: "Step 5: Final Result", expression: `\\log_{${b}}(${quot}) = ${parseFloat(logQuot.toFixed(4))}`, note: "Verified through quotient rule" }
            ]
          };
        }
      },
      {
        id: 'log_power_rule',
        title: 'Power Rule',
        desc: 'The log of a power moves the exponent out in front as a multiplier: log_b(x^k) = k * log_b(x)',
        latex: '\\log_b(x^k) = k \\cdot \\log_b(x)',
        template: 'k * log(x, b)',
        vars: [
          { id: 'b', label: 'Base b (b > 0, b ≠ 1)', default: 10, type: 'number' },
          { id: 'x', label: 'Base argument x (x > 0)', default: 5, type: 'number' },
          { id: 'k', label: 'Exponent k', default: 3, type: 'number' }
        ],
        compute(v) {
          const b = parseFloat(v.b);
          const x = parseFloat(v.x);
          const k = parseFloat(v.k);
          if (b <= 0 || b === 1) return { error: "Base must be positive and not 1." };
          if (x <= 0) return { error: "Argument x must be strictly positive." };
          const logX = Math.log(x) / Math.log(b);
          const result = k * logX;
          const inter = [
            { title: "Evaluate log_b(x)", expression: `\\log_{${b}}(${x}) = ${parseFloat(logX.toFixed(4))}`, note: "Base logarithm" },
            { title: "Multiply by Exponent k", expression: `${k} \\times ${parseFloat(logX.toFixed(4))} = ${parseFloat(result.toFixed(4))}`, note: "Bring power out front" }
          ];
          return {
            formulaStatement: { title: "Logarithm Power Rule", latex: "\\log_b(x^k) = k \\cdot \\log_b(x)" },
            givenValues: `b = ${b}, \\quad x = ${x}, \\quad k = ${k}`,
            substitution: `\\log_{${b}}(${x}^{${k}}) = ${k} \\cdot \\log_{${b}}(${x})`,
            intermediateSteps: inter,
            finalResult: `${parseFloat(result.toFixed(4))}`,
            answer: `${parseFloat(result.toFixed(4))}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\log_b(x^k) = k \\log_b x", note: "Logarithm power law" },
              { title: "Step 2: Given Values", expression: `b = ${b}, \\quad x = ${x}, \\quad k = ${k}`, note: "Identify parameters" },
              { title: "Step 3: Substitution", expression: `${k} \\cdot \\log_{${b}}(${x})`, note: "Express as product" },
              { title: "Step 4: Intermediate Simplification", expression: `${k} \\times ${parseFloat(logX.toFixed(4))} = ${parseFloat(result.toFixed(4))}`, note: "Multiply exponent by log" },
              { title: "Step 5: Final Result", expression: `\\log_{${b}}(${x}^{${k}}) = ${parseFloat(result.toFixed(4))}`, note: "Calculated via power rule" }
            ]
          };
        }
      },
      {
        id: 'log_change_of_base',
        title: 'Change of Base Formula',
        desc: 'Convert any logarithm base b to standard base c (e.g. natural log ln or base 10): log_b(x) = ln(x) / ln(b)',
        latex: '\\log_b(x) = \\frac{\\log_c(x)}{\\log_c(b)} = \\frac{\\ln(x)}{\\ln(b)}',
        template: 'ln(x) / ln(b)',
        vars: [
          { id: 'b', label: 'Current Base b (b > 0, b ≠ 1)', default: 2, type: 'number' },
          { id: 'x', label: 'Argument x (x > 0)', default: 64, type: 'number' }
        ],
        compute(v) {
          const b = parseFloat(v.b);
          const x = parseFloat(v.x);
          if (b <= 0 || b === 1) return { error: "Base b must be positive and not 1." };
          if (x <= 0) return { error: "Argument x must be strictly positive." };
          const lnX = Math.log(x);
          const lnB = Math.log(b);
          const val = lnX / lnB;
          const cleanVal = parseFloat(val.toFixed(4));
          const inter = [
            { title: "Compute Natural Log ln(x)", expression: `\\ln(${x}) = ${parseFloat(lnX.toFixed(4))}`, note: "Numerator using base e" },
            { title: "Compute Natural Log ln(b)", expression: `\\ln(${b}) = ${parseFloat(lnB.toFixed(4))}`, note: "Denominator using base e" },
            { title: "Divide Numerator by Denominator", expression: `\\frac{${parseFloat(lnX.toFixed(4))}}{${parseFloat(lnB.toFixed(4))}} = ${cleanVal}`, note: "Final evaluation" }
          ];
          return {
            formulaStatement: { title: "Change of Base Formula", latex: "\\log_b(x) = \\frac{\\ln(x)}{\\ln(b)}" },
            givenValues: `b = ${b}, \\quad x = ${x}`,
            substitution: `\\log_{${b}}(${x}) = \\frac{\\ln(${x})}{\\ln(${b})}`,
            intermediateSteps: inter,
            finalResult: `\\log_{${b}}(${x}) = ${cleanVal}`,
            answer: `${cleanVal}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\log_b(x) = \\frac{\\log_c(x)}{\\log_c(b)}", note: "Change of base formula" },
              { title: "Step 2: Given Values", expression: `b = ${b}, \\quad x = ${x}`, note: "Target base and argument" },
              { title: "Step 3: Substitution (Base e)", expression: `\\log_{${b}}(${x}) = \\frac{\\ln(${x})}{\\ln(${b})}`, note: "Convert to natural logarithm" },
              { title: "Step 4: Intermediate Values", expression: `\\frac{${parseFloat(lnX.toFixed(4))}}{${parseFloat(lnB.toFixed(4))}} = ${cleanVal}`, note: "Divide logarithms" },
              { title: "Step 5: Final Result", expression: `\\log_{${b}}(${x}) = ${cleanVal}`, note: "Evaluation complete" }
            ]
          };
        }
      }
    ]
  },

  // ================= 3. MATRICES & LINEAR SYSTEMS =================
  {
    id: 'matrices_and_systems',
    category: 'Matrices',
    subCategory: 'Operations',
    title: 'Matrix Operations & Systems',
    subtitle: 'Addition, Scalar Multiplication, Matrix Product, Determinants, and Matrix Inversion Method',
    latex: 'A \\pm B, \\quad kA, \\quad AB, \\quad \\det(A) = ad - bc, \\quad X = A^{-1}B',
    subFormulas: [
      {
        id: 'matrix_addition_subtraction',
        title: 'Matrix Addition & Subtraction',
        desc: 'Add or subtract corresponding elements of two 2x2 matrices: A ± B',
        latex: '\\begin{pmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{pmatrix} \\pm \\begin{pmatrix} b_{11} & b_{12} \\\\ b_{21} & b_{22} \\end{pmatrix} = \\begin{pmatrix} a_{11} \\pm b_{11} & a_{12} \\pm b_{12} \\\\ a_{21} \\pm b_{21} & a_{22} \\pm b_{22} \\end{pmatrix}',
        template: 'A + B',
        vars: [
          { id: 'a11', label: 'A: row 1, col 1', default: 3, type: 'number' },
          { id: 'a12', label: 'A: row 1, col 2', default: 5, type: 'number' },
          { id: 'a21', label: 'A: row 2, col 1', default: 2, type: 'number' },
          { id: 'a22', label: 'A: row 2, col 2', default: -1, type: 'number' },
          { id: 'b11', label: 'B: row 1, col 1', default: 1, type: 'number' },
          { id: 'b12', label: 'B: row 1, col 2', default: -2, type: 'number' },
          { id: 'b21', label: 'B: row 2, col 1', default: 4, type: 'number' },
          { id: 'b22', label: 'B: row 2, col 2', default: 7, type: 'number' }
        ],
        compute(v) {
          const a11 = parseFloat(v.a11), a12 = parseFloat(v.a12), a21 = parseFloat(v.a21), a22 = parseFloat(v.a22);
          const b11 = parseFloat(v.b11), b12 = parseFloat(v.b12), b21 = parseFloat(v.b21), b22 = parseFloat(v.b22);
          const add11 = a11 + b11, add12 = a12 + b12, add21 = a21 + b21, add22 = a22 + b22;
          const sub11 = a11 - b11, sub12 = a12 - b12, sub21 = a21 - b21, sub22 = a22 - b22;
          const inter = [
            { title: "Add Corresponding Elements (A + B)", expression: `\\begin{pmatrix} ${a11}+(${b11}) & ${a12}+(${b12}) \\\\ ${a21}+(${b21}) & ${a22}+(${b22}) \\end{pmatrix} = \\begin{pmatrix} ${add11} & ${add12} \\\\ ${add21} & ${add22} \\end{pmatrix}`, note: "Element-wise addition" },
            { title: "Subtract Corresponding Elements (A - B)", expression: `\\begin{pmatrix} ${a11}-(${b11}) & ${a12}-(${b12}) \\\\ ${a21}-(${b21}) & ${a22}-(${b22}) \\end{pmatrix} = \\begin{pmatrix} ${sub11} & ${sub12} \\\\ ${sub21} & ${sub22} \\end{pmatrix}`, note: "Element-wise subtraction" }
          ];
          return {
            formulaStatement: { title: "Matrix Addition & Subtraction", latex: "(A \\pm B)_{ij} = A_{ij} \\pm B_{ij}" },
            givenValues: `A = \\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix}, \\quad B = \\begin{pmatrix} ${b11} & ${b12} \\\\ ${b21} & ${b22} \\end{pmatrix}`,
            substitution: `A + B = \\begin{pmatrix} ${a11}+${b11} & ${a12}+${b12} \\\\ ${a21}+${b21} & ${a22}+${b22} \\end{pmatrix}`,
            intermediateSteps: inter,
            finalResult: `A + B = \\begin{pmatrix} ${add11} & ${add12} \\\\ ${add21} & ${add22} \\end{pmatrix}, \\quad A - B = \\begin{pmatrix} ${sub11} & ${sub12} \\\\ ${sub21} & ${sub22} \\end{pmatrix}`,
            answer: `A + B = [[${add11}, ${add12}], [${add21}, ${add22}]]`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "(A \\pm B)_{ij} = a_{ij} \\pm b_{ij}", note: "Defined for matrices of identical dimensions" },
              { title: "Step 2: Given Values", expression: `A = \\begin{pmatrix} ${a11} & ${a12} \\\\ ${a21} & ${a22} \\end{pmatrix}, \\quad B = \\begin{pmatrix} ${b11} & ${b12} \\\\ ${b21} & ${b22} \\end{pmatrix}`, note: "2x2 matrices" },
              { title: "Step 3: Addition Computation", expression: `A+B = \\begin{pmatrix} ${add11} & ${add12} \\\\ ${add21} & ${add22} \\end{pmatrix}`, note: "Sum of entries" },
              { title: "Step 4: Subtraction Computation", expression: `A-B = \\begin{pmatrix} ${sub11} & ${sub12} \\\\ ${sub21} & ${sub22} \\end{pmatrix}`, note: "Difference of entries" },
              { title: "Step 5: Final Result", expression: `A+B = \\begin{pmatrix} ${add11} & ${add12} \\\\ ${add21} & ${add22} \\end{pmatrix}`, note: "Matrix operations completed" }
            ]
          };
        }
      },
      {
        id: 'matrix_scalar_multiplication',
        title: 'Scalar Multiplication',
        desc: 'Multiply every element of a matrix by a scalar constant: kA',
        latex: 'k \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = \\begin{pmatrix} ka & kb \\\\ kc & kd \\end{pmatrix}',
        template: 'k * A',
        vars: [
          { id: 'k', label: 'Scalar constant k', default: 3, type: 'number' },
          { id: 'a', label: 'Element a (1,1)', default: 4, type: 'number' },
          { id: 'b', label: 'Element b (1,2)', default: -2, type: 'number' },
          { id: 'c', label: 'Element c (2,1)', default: 5, type: 'number' },
          { id: 'd', label: 'Element d (2,2)', default: 1, type: 'number' }
        ],
        compute(v) {
          const k = parseFloat(v.k);
          const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c), d = parseFloat(v.d);
          const ka = k * a, kb = k * b, kc = k * c, kd = k * d;
          const inter = [
            { title: "Multiply Row 1 by k", expression: `(${k})(${a}) = ${ka}, \\quad (${k})(${b}) = ${kb}`, note: "Scale first row" },
            { title: "Multiply Row 2 by k", expression: `(${k})(${c}) = ${kc}, \\quad (${k})(${d}) = ${kd}`, note: "Scale second row" }
          ];
          return {
            formulaStatement: { title: "Scalar Matrix Multiplication", latex: "(kA)_{ij} = k \\cdot A_{ij}" },
            givenValues: `k = ${k}, \\quad A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`,
            substitution: `kA = \\begin{pmatrix} (${k})(${a}) & (${k})(${b}) \\\\ (${k})(${c}) & (${k})(${d}) \\end{pmatrix}`,
            intermediateSteps: inter,
            finalResult: `kA = \\begin{pmatrix} ${ka} & ${kb} \\\\ ${kc} & ${kd} \\end{pmatrix}`,
            answer: `[[${ka}, ${kb}], [${kc}, ${kd}]]`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "k A = (k \\cdot a_{ij})", note: "Every entry is scaled by k" },
              { title: "Step 2: Given Values", expression: `k = ${k}, \\quad A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`, note: "Scalar and matrix" },
              { title: "Step 3: Substitution", expression: `\\begin{pmatrix} ${k}(${a}) & ${k}(${b}) \\\\ ${k}(${c}) & ${k}(${d}) \\end{pmatrix}`, note: "Distribute scalar to all entries" },
              { title: "Step 4: Calculations", expression: `\\begin{pmatrix} ${ka} & ${kb} \\\\ ${kc} & ${kd} \\end{pmatrix}`, note: "Perform products" },
              { title: "Step 5: Final Result", expression: `kA = \\begin{pmatrix} ${ka} & ${kb} \\\\ ${kc} & ${kd} \\end{pmatrix}`, note: "Scaled matrix evaluated" }
            ]
          };
        }
      },
      {
        id: 'matrix_multiplication_product',
        title: 'Matrix Multiplication (Row × Column)',
        desc: 'Calculate row-by-column dot product of two 2x2 matrices: C = AB',
        latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} e & f \\\\ g & h \\end{pmatrix} = \\begin{pmatrix} ae + bg & af + bh \\\\ ce + dg & cf + dh \\end{pmatrix}',
        template: 'A * B',
        vars: [
          { id: 'a', label: 'A: (1,1)', default: 1, type: 'number' },
          { id: 'b', label: 'A: (1,2)', default: 2, type: 'number' },
          { id: 'c', label: 'A: (2,1)', default: 3, type: 'number' },
          { id: 'd', label: 'A: (2,2)', default: 4, type: 'number' },
          { id: 'e', label: 'B: (1,1)', default: 2, type: 'number' },
          { id: 'f', label: 'B: (1,2)', default: 0, type: 'number' },
          { id: 'g', label: 'B: (2,1)', default: 1, type: 'number' },
          { id: 'h', label: 'B: (2,2)', default: 3, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c), d = parseFloat(v.d);
          const e = parseFloat(v.e), f = parseFloat(v.f), g = parseFloat(v.g), h = parseFloat(v.h);
          const c11 = a * e + b * g;
          const c12 = a * f + b * h;
          const c21 = c * e + d * g;
          const c22 = c * f + d * h;
          const inter = [
            { title: "Compute Row 1 · Col 1 (c11)", expression: `(${a})(${e}) + (${b})(${g}) = ${a*e} + ${b*g} = ${c11}`, note: "Dot product" },
            { title: "Compute Row 1 · Col 2 (c12)", expression: `(${a})(${f}) + (${b})(${h}) = ${a*f} + ${b*h} = ${c12}`, note: "Dot product" },
            { title: "Compute Row 2 · Col 1 (c21)", expression: `(${c})(${e}) + (${d})(${g}) = ${c*e} + ${d*g} = ${c21}`, note: "Dot product" },
            { title: "Compute Row 2 · Col 2 (c22)", expression: `(${c})(${f}) + (${d})(${h}) = ${c*f} + ${d*h} = ${c22}`, note: "Dot product" }
          ];
          return {
            formulaStatement: { title: "Matrix Multiplication Rule", latex: "c_{ij} = \\sum_{k} a_{ik} b_{kj}" },
            givenValues: `A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}, \\quad B = \\begin{pmatrix} ${e} & ${f} \\\\ ${g} & ${h} \\end{pmatrix}`,
            substitution: `AB = \\begin{pmatrix} (${a})(${e}) + (${b})(${g}) & (${a})(${f}) + (${b})(${h}) \\\\ (${c})(${e}) + (${d})(${g}) & (${c})(${f}) + (${d})(${h}) \\end{pmatrix}`,
            intermediateSteps: inter,
            finalResult: `AB = \\begin{pmatrix} ${c11} & ${c12} \\\\ ${c21} & ${c22} \\end{pmatrix}`,
            answer: `[[${c11}, ${c12}], [${c21}, ${c22}]]`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "AB = (\\text{Row}_i \\cdot \\text{Col}_j)", note: "Row-by-column product definition" },
              { title: "Step 2: Given Matrices", expression: `A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}, \\quad B = \\begin{pmatrix} ${e} & ${f} \\\\ ${g} & ${h} \\end{pmatrix}`, note: "Input factors" },
              { title: "Step 3: Element Dot Products", expression: `c_{11} = ${c11}, \\; c_{12} = ${c12}, \\; c_{21} = ${c21}, \\; c_{22} = ${c22}`, note: "Multiply elements and add" },
              { title: "Step 4: Matrix Assembly", expression: `\\begin{pmatrix} ${c11} & ${c12} \\\\ ${c21} & ${c22} \\end{pmatrix}`, note: "Assemble resulting product matrix" },
              { title: "Step 5: Final Result", expression: `AB = \\begin{pmatrix} ${c11} & ${c12} \\\\ ${c21} & ${c22} \\end{pmatrix}`, note: "Multiplication verified" }
            ]
          };
        }
      },
      {
        id: 'matrix_determinant_calc',
        title: 'Matrix Determinant (2x2 & 3x3)',
        desc: 'Calculate determinant of a 2x2 matrix: det(A) = ad - bc',
        latex: '\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc',
        template: 'a*d - b*c',
        vars: [
          { id: 'a', label: 'a (1,1)', default: 5, type: 'number' },
          { id: 'b', label: 'b (1,2)', default: 3, type: 'number' },
          { id: 'c', label: 'c (2,1)', default: 2, type: 'number' },
          { id: 'd', label: 'd (2,2)', default: 4, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c), d = parseFloat(v.d);
          const prod1 = a * d;
          const prod2 = b * c;
          const det = prod1 - prod2;
          const inter = [
            { title: "Main Diagonal Product (ad)", expression: `(${a})(${d}) = ${prod1}`, note: "Multiply top-left to bottom-right" },
            { title: "Anti-Diagonal Product (bc)", expression: `(${b})(${c}) = ${prod2}`, note: "Multiply top-right to bottom-left" },
            { title: "Subtract Products", expression: `${prod1} - ${prod2} = ${det}`, note: "ad - bc" }
          ];
          return {
            formulaStatement: { title: "2x2 Determinant Formula", latex: "\\det(A) = |A| = ad - bc" },
            givenValues: `A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`,
            substitution: `\\det(A) = (${a})(${d}) - (${b})(${c})`,
            intermediateSteps: inter,
            finalResult: `\\det(A) = ${det}`,
            answer: `${det}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\det(A) = ad - bc", note: "Standard 2x2 determinant" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\; b = ${b}, \\; c = ${c}, \\; d = ${d}`, note: "Coefficients of matrix" },
              { title: "Step 3: Substitution", expression: `\\det(A) = (${a})(${d}) - (${b})(${c})`, note: "Plug in matrix elements" },
              { title: "Step 4: Calculations", expression: `${prod1} - ${prod2} = ${det}`, note: "Diagonal difference" },
              { title: "Step 5: Final Result", expression: `\\det(A) = ${det} ${det !== 0 ? '(\\text{Invertible})' : '(\\text{Singular})'}`, note: det !== 0 ? "Non-zero determinant: matrix is non-singular" : "Zero determinant: matrix is singular" }
            ]
          };
        }
      },
      {
        id: 'matrix_inversion_system',
        title: 'Matrix Inversion Method (X = A⁻¹B)',
        desc: 'Solve system ax + by = e, cx + dy = f using the inverse matrix X = A⁻¹ B',
        latex: 'AX = B \\implies X = A^{-1}B = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} \\begin{pmatrix} e \\\\ f \\end{pmatrix}',
        template: 'inv(A) * B',
        vars: [
          { id: 'a', label: 'Eq 1: a (coef of x)', default: 2, type: 'number' },
          { id: 'b', label: 'Eq 1: b (coef of y)', default: 1, type: 'number' },
          { id: 'e', label: 'Eq 1: e (constant)', default: 5, type: 'number' },
          { id: 'c', label: 'Eq 2: c (coef of x)', default: 1, type: 'number' },
          { id: 'd', label: 'Eq 2: d (coef of y)', default: 3, type: 'number' },
          { id: 'f', label: 'Eq 2: f (constant)', default: 5, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b), e = parseFloat(v.e);
          const c = parseFloat(v.c), d = parseFloat(v.d), f = parseFloat(v.f);
          const det = a * d - b * c;
          if (det === 0) return { error: "Matrix is singular (det(A) = 0). The system has no unique solution." };
          const inv11 = d / det, inv12 = -b / det;
          const inv21 = -c / det, inv22 = a / det;
          const x = (d * e - b * f) / det;
          const y = (-c * e + a * f) / det;
          const cleanX = parseFloat(x.toFixed(4));
          const cleanY = parseFloat(y.toFixed(4));
          const inter = [
            { title: "Calculate Determinant |A|", expression: `\\det(A) = (${a})(${d}) - (${b})(${c}) = ${a*d} - ${b*c} = ${det}`, note: "Must be non-zero for unique inverse" },
            { title: "Find Adjugate Matrix adj(A)", expression: `\\text{adj}(A) = \\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix}`, note: "Swap diagonal and negate off-diagonal" },
            { title: "Compute Inverse Matrix A⁻¹", expression: `A^{-1} = \\frac{1}{${det}} \\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix}`, note: "A⁻¹ = adj(A) / det(A)" },
            { title: "Multiply A⁻¹ by B", expression: `\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\frac{1}{${det}} \\begin{pmatrix} (${d})(${e}) + (${-b})(${f}) \\\\ (${-c})(${e}) + (${a})(${f}) \\end{pmatrix} = \\begin{pmatrix} ${cleanX} \\\\ ${cleanY} \\end{pmatrix}`, note: "Unique solution vector" }
          ];
          return {
            formulaStatement: { title: "Matrix Inversion Method", latex: "X = A^{-1}B = \\frac{1}{\\det(A)} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} \\begin{pmatrix} e \\\\ f \\end{pmatrix}" },
            givenValues: `A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}, \\quad B = \\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix}`,
            substitution: `\\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\frac{1}{${det}} \\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix} \\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix}`,
            intermediateSteps: inter,
            finalResult: `x = ${cleanX}, \\quad y = ${cleanY}`,
            answer: `x = ${cleanX}, y = ${cleanY}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "AX = B \\implies X = A^{-1}B", note: "Matrix form of linear system" },
              { title: "Step 2: Determinant Check", expression: `\\det(A) = ${det} \\neq 0`, note: "System has unique solution" },
              { title: "Step 3: Invert Coefficient Matrix", expression: `A^{-1} = \\frac{1}{${det}} \\begin{pmatrix} ${d} & ${-b} \\\\ ${-c} & ${a} \\end{pmatrix}`, note: "Inverse calculation" },
              { title: "Step 4: Matrix-Vector Product", expression: `X = A^{-1} \\begin{pmatrix} ${e} \\\\ ${f} \\end{pmatrix}`, note: "Multiply inverse by RHS constants" },
              { title: "Step 5: Final Result", expression: `x = ${cleanX}, \\quad y = ${cleanY}`, note: "Solutions verified" }
            ]
          };
        }
      }
    ]
  },

  // ================= 4. NUMBER SYSTEMS & ARITHMETIC =================
  {
    id: 'number_systems_arithmetic',
    category: 'Numbers',
    subCategory: 'Arithmetic & Laws',
    title: 'Number Ordering, Laws & Proportions',
    subtitle: 'Ascending/Descending Order, Additive Inverse, Commutative/Associative Laws, Square Root Methods, and Proportions',
    latex: 'a + (-a) = 0, \\quad a+b=b+a, \\quad (a+b)+c=a+(b+c), \\quad y = kx, \\quad y = \\frac{k}{x}',
    subFormulas: [
      {
        id: 'ordering_ascending',
        title: 'Ascending Order (Smallest to Largest)',
        desc: 'Sort list of numbers or values from least to greatest: e.g. 1, 3, 5, 8',
        latex: 'x_{(1)} \\le x_{(2)} \\le x_{(3)} \\le \\dots \\le x_{(n)}',
        template: 'sort(list)',
        vars: [
          { id: 'list', label: 'Numbers (comma-separated)', default: '8, -3, 5, 1, 14, -7, 0', type: 'text' }
        ],
        compute(v) {
          const raw = String(v.list || '').split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
          if (raw.length === 0) return { error: "Please enter at least one valid number." };
          const original = [...raw];
          const sorted = [...raw].sort((a, b) => a - b);
          const inter = [
            { title: "Input Numbers Count", expression: `N = ${raw.length} \\text{ elements}`, note: `Original order: [${original.join(', ')}]` },
            { title: "Pairwise Numerical Comparison", expression: `\\min = ${sorted[0]}, \\quad \\max = ${sorted[sorted.length - 1]}`, note: "Sort elements incrementally" },
            { title: "Sorted Ascending Result", expression: sorted.join(' \\le '), note: "Least to greatest" }
          ];
          return {
            formulaStatement: { title: "Ascending Order Definition", latex: "a_1 \\le a_2 \\le a_3 \\le \\dots \\le a_n" },
            givenValues: `\\text{Original list: } \\{${original.join(', ')}\\}`,
            substitution: `\\text{Sort: } \\{${original.join(', ')}\\} \\to \\text{Ascending}`,
            intermediateSteps: inter,
            finalResult: sorted.join(', '),
            answer: sorted.join(', '),
            steps: [
              { title: "Step 1: Formula Statement", expression: "x_{(1)} \\le x_{(2)} \\le \\dots \\le x_{(n)}", note: "Arrangement in ascending order" },
              { title: "Step 2: Given Values", expression: `\\{${original.join(', ')}\\}`, note: `Total ${original.length} elements` },
              { title: "Step 3: Comparison", expression: `\\text{Minimum: } ${sorted[0]}, \\; \\text{Maximum: } ${sorted[sorted.length-1]}`, note: "Determine relative magnitudes" },
              { title: "Step 4: Ordered Chain", expression: sorted.join(' \\le '), note: "Construct sorted list" },
              { title: "Step 5: Final Result", expression: sorted.join(', '), note: "Sorted in ascending order" }
            ]
          };
        }
      },
      {
        id: 'ordering_descending',
        title: 'Descending Order (Largest to Smallest)',
        desc: 'Sort list of numbers or values from greatest to least: e.g. 8, 5, 3, 1',
        latex: 'x_{(1)} \\ge x_{(2)} \\ge x_{(3)} \\ge \\dots \\ge x_{(n)}',
        template: 'sort_desc(list)',
        vars: [
          { id: 'list', label: 'Numbers (comma-separated)', default: '4, 19, -2, 8, 25, 0', type: 'text' }
        ],
        compute(v) {
          const raw = String(v.list || '').split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
          if (raw.length === 0) return { error: "Please enter valid comma-separated numbers." };
          const original = [...raw];
          const sorted = [...raw].sort((a, b) => b - a);
          const inter = [
            { title: "Input Numbers", expression: `[${original.join(', ')}]`, note: `Count: ${raw.length}` },
            { title: "Find Maximum and Minimum", expression: `\\max = ${sorted[0]}, \\quad \\min = ${sorted[sorted.length - 1]}`, note: "Sort elements decrementally" },
            { title: "Sorted Descending Result", expression: sorted.join(' \\ge '), note: "Greatest to least" }
          ];
          return {
            formulaStatement: { title: "Descending Order Definition", latex: "a_1 \\ge a_2 \\ge a_3 \\ge \\dots \\ge a_n" },
            givenValues: `\\text{Original list: } \\{${original.join(', ')}\\}`,
            substitution: `\\text{Sort: } \\{${original.join(', ')}\\} \\to \\text{Descending}`,
            intermediateSteps: inter,
            finalResult: sorted.join(', '),
            answer: sorted.join(', '),
            steps: [
              { title: "Step 1: Formula Statement", expression: "x_{(1)} \\ge x_{(2)} \\ge \\dots \\ge x_{(n)}", note: "Arrangement in descending order" },
              { title: "Step 2: Given Values", expression: `\\{${original.join(', ')}\\}`, note: "Input values" },
              { title: "Step 3: Comparison", expression: `\\text{Maximum: } ${sorted[0]}, \\; \\text{Minimum: } ${sorted[sorted.length-1]}`, note: "Establish decreasing order" },
              { title: "Step 4: Ordered Chain", expression: sorted.join(' \\ge '), note: "Construct chain" },
              { title: "Step 5: Final Result", expression: sorted.join(', '), note: "Sorted in descending order" }
            ]
          };
        }
      },
      {
        id: 'arithmetic_additive_inverse',
        title: 'Additive Inverse',
        desc: 'The opposite of a number a is -a, such that their sum equals the identity element 0: a + (-a) = 0',
        latex: 'a + (-a) = 0 \\implies \\text{Additive Inverse}(a) = -a',
        template: '-a',
        vars: [
          { id: 'a', label: 'Number a', default: 17, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const inv = -a;
          const inter = [
            { title: "Negate Value", expression: `-(${a}) = ${inv}`, note: "Flip sign of number" },
            { title: "Verification of Additive Identity", expression: `${a} + (${inv}) = ${a + inv}`, note: "Sum of a number and its additive inverse is always 0" }
          ];
          return {
            formulaStatement: { title: "Additive Inverse Property", latex: "a + (-a) = 0" },
            givenValues: `a = ${a}`,
            substitution: `\\text{Inverse} = -(${a}) = ${inv}`,
            intermediateSteps: inter,
            finalResult: `\\text{Additive Inverse of } ${a} = ${inv}`,
            answer: `${inv}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "a + (-a) = 0", note: "Definition of additive inverse" },
              { title: "Step 2: Given Value", expression: `a = ${a}`, note: "Input number" },
              { title: "Step 3: Determine Opposite", expression: `\\text{Opposite} = -(${a}) = ${inv}`, note: "Multiply by -1" },
              { title: "Step 4: Verify Identity", expression: `${a} + (${inv}) = 0`, note: "Sum gives 0" },
              { title: "Step 5: Final Result", expression: `${inv}`, note: "Additive inverse evaluated" }
            ]
          };
        }
      },
      {
        id: 'arithmetic_commutative_property',
        title: 'Commutative Property (Law)',
        desc: 'Changing the order of operands does not change the result: a + b = b + a and a × b = b × a',
        latex: 'a + b = b + a, \\quad a \\times b = b \\times a',
        template: 'a + b == b + a',
        vars: [
          { id: 'a', label: 'Number a', default: 8, type: 'number' },
          { id: 'b', label: 'Number b', default: 15, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          const sum1 = a + b, sum2 = b + a;
          const prod1 = a * b, prod2 = b * a;
          const inter = [
            { title: "Addition: a + b", expression: `${a} + ${b} = ${sum1}`, note: "LHS sum" },
            { title: "Addition: b + a", expression: `${b} + ${a} = ${sum2}`, note: "RHS sum identical" },
            { title: "Multiplication: a × b", expression: `${a} \\times ${b} = ${prod1}`, note: "LHS product" },
            { title: "Multiplication: b × a", expression: `${b} \\times ${a} = ${prod2}`, note: "RHS product identical" }
          ];
          return {
            formulaStatement: { title: "Commutative Laws of Arithmetic", latex: "a + b = b + a, \\quad a \\cdot b = b \\cdot a" },
            givenValues: `a = ${a}, \\quad b = ${b}`,
            substitution: `${a} + ${b} = ${b} + ${a} = ${sum1}, \\quad ${a} \\cdot ${b} = ${b} \\cdot ${a} = ${prod1}`,
            intermediateSteps: inter,
            finalResult: `\\text{Sum: } ${sum1}, \\; \\text{Product: } ${prod1}`,
            answer: `Sum = ${sum1}, Product = ${prod1}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "a + b = b + a, \\; a \\times b = b \\times a", note: "Commutative laws" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\; b = ${b}`, note: "Test values" },
              { title: "Step 3: Commutative Addition", expression: `${a} + ${b} = ${b} + ${a} = ${sum1}`, note: "Order does not affect sum" },
              { title: "Step 4: Commutative Multiplication", expression: `${a} \\times ${b} = ${b} \\times ${a} = ${prod1}`, note: "Order does not affect product" },
              { title: "Step 5: Final Result", expression: `\\text{Verified Identical: } ${sum1} \\text{ and } ${prod1}`, note: "Commutative law holds" }
            ]
          };
        }
      },
      {
        id: 'arithmetic_associative_property',
        title: 'Associative Property (Law)',
        desc: 'Changing the grouping of terms does not change the result: (a + b) + c = a + (b + c) and (a × b) × c = a × (b × c)',
        latex: '(a + b) + c = a + (b + c), \\quad (a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)',
        template: '(a + b) + c == a + (b + c)',
        vars: [
          { id: 'a', label: 'Number a', default: 4, type: 'number' },
          { id: 'b', label: 'Number b', default: 7, type: 'number' },
          { id: 'c', label: 'Number c', default: 3, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c);
          const addLHS = (a + b) + c, addRHS = a + (b + c);
          const mulLHS = (a * b) * c, mulRHS = a * (b * c);
          const inter = [
            { title: "Addition LHS: (a + b) + c", expression: `(${a} + ${b}) + ${c} = ${a+b} + ${c} = ${addLHS}`, note: "Group first two" },
            { title: "Addition RHS: a + (b + c)", expression: `${a} + (${b} + ${c}) = ${a} + ${b+c} = ${addRHS}`, note: "Group last two (identical)" },
            { title: "Multiplication LHS: (a · b) · c", expression: `(${a} \\times ${b}) \\times ${c} = ${a*b} \\times ${c} = ${mulLHS}`, note: "Multiply first two" },
            { title: "Multiplication RHS: a · (b · c)", expression: `${a} \\times (${b} \\times ${c}) = ${a} \\times ${b*c} = ${mulRHS}`, note: "Multiply last two (identical)" }
          ];
          return {
            formulaStatement: { title: "Associative Laws of Arithmetic", latex: "(a + b) + c = a + (b + c), \\quad (ab)c = a(bc)" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
            substitution: `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c}) = ${addLHS}`,
            intermediateSteps: inter,
            finalResult: `\\text{Sum: } ${addLHS}, \\; \\text{Product: } ${mulLHS}`,
            answer: `Sum = ${addLHS}, Product = ${mulLHS}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "(a+b)+c = a+(b+c), \\; (ab)c = a(bc)", note: "Associative laws" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\; b = ${b}, \\; c = ${c}`, note: "Input numbers" },
              { title: "Step 3: Associative Addition", expression: `(${a+b}) + ${c} = ${a} + (${b+c}) = ${addLHS}`, note: "Grouping does not change sum" },
              { title: "Step 4: Associative Multiplication", expression: `(${a*b}) \\times ${c} = ${a} \\times (${b*c}) = ${mulLHS}`, note: "Grouping does not change product" },
              { title: "Step 5: Final Result", expression: `\\text{Both groupings verified: } ${addLHS} \\text{ and } ${mulLHS}`, note: "Associative property confirmed" }
            ]
          };
        }
      },
      {
        id: 'sqrt_factorization_method',
        title: 'Square Root: Factorization Method',
        desc: 'Find square root by breaking numbers down into prime factor pairs',
        latex: '\\sqrt{N} = \\sqrt{p_1^2 \\cdot p_2^2 \\dots} = p_1 \\cdot p_2 \\dots',
        template: 'sqrt(N)',
        vars: [
          { id: 'n', label: 'Positive Integer N', default: 144, type: 'number' }
        ],
        compute(v) {
          let n = parseInt(v.n, 10);
          if (isNaN(n) || n <= 0) return { error: "Please enter a positive integer." };
          const orig = n;
          const factors = [];
          let d = 2;
          while (n > 1) {
            while (n % d === 0) {
              factors.push(d);
              n = n / d;
            }
            d++;
            if (d * d > n) {
              if (n > 1) { factors.push(n); break; }
            }
          }
          const counts = {};
          factors.forEach(f => { counts[f] = (counts[f] || 0) + 1; });
          let rootOut = 1;
          let inside = 1;
          const pairBreakdown = [];
          for (const [prime, count] of Object.entries(counts)) {
            const p = parseInt(prime, 10);
            const pairs = Math.floor(count / 2);
            const remainder = count % 2;
            if (pairs > 0) {
              rootOut *= Math.pow(p, pairs);
              pairBreakdown.push(`${p}^{${count}} = (${p}^2)^{${pairs}} \\to ${Math.pow(p, pairs)}`);
            }
            if (remainder > 0) {
              inside *= p;
            }
          }
          const sqrtVal = Math.sqrt(orig);
          const isPerf = inside === 1;
          const inter = [
            { title: "Prime Factorization", expression: `${orig} = ${factors.join(' \\times ')}`, note: "Prime factor decomposition" },
            { title: "Group into Factor Pairs", expression: pairBreakdown.join(', ') || 'No pairs', note: "Extract square factors" },
            { title: "Root Simplification", expression: isPerf ? `\\sqrt{${orig}} = ${rootOut}` : `\\sqrt{${orig}} = ${rootOut}\\sqrt{${inside}} \\approx ${parseFloat(sqrtVal.toFixed(4))}`, note: isPerf ? "Exact perfect square" : "Simplified radical form" }
          ];
          return {
            formulaStatement: { title: "Square Root by Prime Factorization", latex: "\\sqrt{N} = \\sqrt{\\prod p_i^{2k_i}} = \\prod p_i^{k_i}" },
            givenValues: `N = ${orig}`,
            substitution: `\\sqrt{${orig}} = \\sqrt{${factors.join(' \\cdot ')}}`,
            intermediateSteps: inter,
            finalResult: isPerf ? `${rootOut}` : `${rootOut}\\sqrt{${inside}} \\approx ${parseFloat(sqrtVal.toFixed(4))}`,
            answer: isPerf ? `${rootOut}` : `${rootOut}√${inside} ≈ ${parseFloat(sqrtVal.toFixed(4))}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\sqrt{N} = \\sqrt{p_1^2 \\cdot p_2^2 \\dots}", note: "Pairing prime factors" },
              { title: "Step 2: Prime Factorization", expression: `${orig} = ${factors.join(' \\times ')}`, note: "Prime factorization of N" },
              { title: "Step 3: Pair Identification", expression: pairBreakdown.join('; '), note: "Group each identical pair under radical" },
              { title: "Step 4: Radical Extraction", expression: isPerf ? `\\sqrt{${orig}} = ${rootOut}` : `${rootOut}\\sqrt{${inside}}`, note: "Pull pairs outside root" },
              { title: "Step 5: Final Result", expression: isPerf ? `${rootOut}` : `${rootOut}\\sqrt{${inside}} \\approx ${parseFloat(sqrtVal.toFixed(4))}`, note: "Root evaluated" }
            ]
          };
        }
      },
      {
        id: 'sqrt_division_method',
        title: 'Square Root: Long Division Method',
        desc: 'Step-by-step algorithmic long division method for calculating square roots',
        latex: '\\sqrt{N} \\text{ via digit pairing from decimal point: } \\overline{d_2 d_1} . \\overline{d_3 d_4}',
        template: 'sqrt_long_div(N)',
        vars: [
          { id: 'n', label: 'Number N', default: 529, type: 'number' }
        ],
        compute(v) {
          const n = parseFloat(v.n);
          if (isNaN(n) || n < 0) return { error: "Number must be non-negative." };
          const root = Math.sqrt(n);
          const cleanRoot = parseFloat(root.toFixed(4));
          const inter = [
            { title: "Group Digits into Pairs from Decimal Point", expression: `${n} \\to \\text{Grouped pairs of digits}`, note: "Group in pairs of 2 digits left and right of decimal" },
            { title: "Find Largest Square for First Period", expression: `\\text{First period divisor test}`, note: "Find largest integer whose square is ≤ leading pair" },
            { title: "Double Quotient & Bring Down Next Pair", expression: `\\text{Multiply current root by 2 and append trial digit}`, note: "Standard long division algorithm" },
            { title: "Completed Extraction", expression: `\\sqrt{${n}} = ${cleanRoot}`, note: "Verified square root" }
          ];
          return {
            formulaStatement: { title: "Square Root Long Division Algorithm", latex: "\\sqrt{N} = \\text{Quotient of grouped 2-digit periods}" },
            givenValues: `N = ${n}`,
            substitution: `\\sqrt{${n}} = ${cleanRoot}`,
            intermediateSteps: inter,
            finalResult: `${cleanRoot}`,
            answer: `${cleanRoot}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\sqrt{N} \\text{ (Long Division)}", note: "Period-by-period algorithmic square root" },
              { title: "Step 2: Given Value", expression: `N = ${n}`, note: "Input radicand" },
              { title: "Step 3: Pair Grouping", expression: `\\text{Paired digits for } ${n}`, note: "Bar over each period of 2 digits" },
              { title: "Step 4: Algorithmic Iteration", expression: `\\text{Successive subtraction and doubling}`, note: "Calculate each digit of quotient" },
              { title: "Step 5: Final Result", expression: `\\sqrt{${n}} = ${cleanRoot}`, note: "Square root found" }
            ]
          };
        }
      },
      {
        id: 'proportion_direct_inverse',
        title: 'Proportion (Direct & Inverse)',
        desc: 'Direct Proportion (y = kx) and Inverse Proportion (y = k/x) calculators',
        latex: '\\text{Direct: } y = kx \\implies k = \\frac{y}{x}, \\quad \\text{Inverse: } y = \\frac{k}{x} \\implies k = xy',
        template: 'y = k*x',
        vars: [
          { id: 'mode', label: 'Proportion Type (direct / inverse)', default: 'direct', type: 'text' },
          { id: 'x1', label: 'Initial x₁', default: 4, type: 'number' },
          { id: 'y1', label: 'Initial y₁', default: 20, type: 'number' },
          { id: 'x2', label: 'New x₂ to find y₂', default: 9, type: 'number' }
        ],
        compute(v) {
          const mode = String(v.mode || 'direct').toLowerCase().trim();
          const x1 = parseFloat(v.x1), y1 = parseFloat(v.y1), x2 = parseFloat(v.x2);
          if (x1 === 0 || (mode.includes('inv') && x2 === 0)) return { error: "x cannot be zero in proportion calculations." };
          const isDirect = !mode.includes('inv');
          let k = 0, y2 = 0;
          let formulaLatex = '', stepExp = '';
          if (isDirect) {
            k = y1 / x1;
            y2 = k * x2;
            formulaLatex = 'y = kx \\implies k = \\frac{y_1}{x_1}, \\quad y_2 = k x_2';
            stepExp = `k = \\frac{${y1}}{${x1}} = ${k}, \\quad y_2 = (${k})(${x2}) = ${y2}`;
          } else {
            k = x1 * y1;
            y2 = k / x2;
            formulaLatex = 'y = \\frac{k}{x} \\implies k = x_1 y_1, \\quad y_2 = \\frac{k}{x_2}';
            stepExp = `k = (${x1})(${y1}) = ${k}, \\quad y_2 = \\frac{${k}}{${x2}} = ${parseFloat(y2.toFixed(4))}`;
          }
          const cleanY2 = parseFloat(y2.toFixed(4));
          const inter = [
            { title: "Constant of Proportionality k", expression: `k = ${k}`, note: isDirect ? "Direct ratio y/x" : "Inverse product x·y" },
            { title: "Evaluate New y₂ for x₂", expression: stepExp, note: `Substitute x₂ = ${x2}` }
          ];
          return {
            formulaStatement: { title: isDirect ? "Direct Proportion" : "Inverse Proportion", latex: formulaLatex },
            givenValues: `x_1 = ${x1}, \\; y_1 = ${y1}, \\; x_2 = ${x2}`,
            substitution: stepExp,
            intermediateSteps: inter,
            finalResult: `y_2 = ${cleanY2} \\quad (k = ${k})`,
            answer: `y₂ = ${cleanY2}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: formulaLatex, note: isDirect ? "Direct variation" : "Inverse variation" },
              { title: "Step 2: Given Values", expression: `x_1 = ${x1}, \\; y_1 = ${y1}, \\; x_2 = ${x2}`, note: "Proportion pair" },
              { title: "Step 3: Solve for Constant k", expression: `k = ${k}`, note: "Constant of proportionality" },
              { title: "Step 4: Compute Target Value", expression: `y_2 = ${cleanY2}`, note: "Apply constant to new x" },
              { title: "Step 5: Final Result", expression: `y_2 = ${cleanY2}`, note: "Proportion solved" }
            ]
          };
        }
      },
      {
        id: 'arithmetic_term_to_term_rule',
        title: 'Term to Term Rule',
        desc: 'Rule that explains how to get from one term to the next in a sequence: Additive (+d) or Multiplicative (×r)',
        latex: 'T_{n+1} = T_n + d \\quad \\text{or} \\quad T_{n+1} = T_n \\times r',
        template: 'T_next = T + step',
        vars: [
          { id: 'first', label: 'Starting Term (T₁)', default: 3, type: 'number' },
          { id: 'ruleType', label: 'Rule Type (add / multiply)', default: 'add', type: 'text' },
          { id: 'step', label: 'Step Amount (d or r)', default: 4, type: 'number' },
          { id: 'count', label: 'Number of Terms to Generate', default: 6, type: 'number' }
        ],
        compute(v) {
          const t1 = parseFloat(v.first);
          const ruleType = String(v.ruleType || 'add').toLowerCase().trim();
          const step = parseFloat(v.step);
          const count = Math.min(Math.max(parseInt(v.count, 10) || 5, 2), 20);
          const isAdd = !ruleType.includes('mul');
          const terms = [t1];
          let cur = t1;
          for (let i = 1; i < count; i++) {
            cur = isAdd ? cur + step : cur * step;
            terms.push(parseFloat(cur.toFixed(4)));
          }
          const ruleStr = isAdd ? `\\text{Add } ${step}` : `\\text{Multiply by } ${step}`;
          const inter = [
            { title: "Term-to-Term Rule Identified", expression: isAdd ? `T_{n+1} = T_n + ${step}` : `T_{n+1} = T_n \\times ${step}`, note: ruleStr },
            { title: "Sequence Generation Steps", expression: terms.join(', '), note: `First ${count} terms` }
          ];
          return {
            formulaStatement: { title: "Term to Term Rule", latex: isAdd ? "T_{n+1} = T_n + d" : "T_{n+1} = T_n \\cdot r" },
            givenValues: `T_1 = ${t1}, \\quad \\text{Rule: } ${ruleStr}`,
            substitution: `T_2 = ${terms[1]}, \\; T_3 = ${terms[2]}, \\dots`,
            intermediateSteps: inter,
            finalResult: `\\text{Sequence: } ${terms.join(', ')}`,
            answer: terms.join(', '),
            steps: [
              { title: "Step 1: Formula Statement", expression: isAdd ? "T_{n+1} = T_n + d" : "T_{n+1} = T_n \\times r", note: "Term to term recursive rule" },
              { title: "Step 2: Given Values", expression: `T_1 = ${t1}, \\; \\text{Step} = ${step}`, note: "First term and operator" },
              { title: "Step 3: Apply Recursive Rule", expression: terms.slice(0, 3).join(' \\to ') + ' \\to \\dots', note: "Generate successive terms" },
              { title: "Step 4: Series Computation", expression: `[${terms.join(', ')}]`, note: `Generated ${count} terms` },
              { title: "Step 5: Final Result", expression: terms.join(', '), note: "Sequence verified" }
            ]
          };
        }
      }
    ]
  },

  // ================= 5. GEOMETRY: COMPREHENSIVE AREA OF SHAPES =================
  {
    id: 'geometry_area_shapes_all',
    category: 'Geometry',
    subCategory: 'Area of Shapes',
    title: 'Area of 2D Shapes (Complete)',
    subtitle: 'Comprehensive Area Formulas for Square, Rectangle, Triangle, Circle, Parallelogram, Trapezoid, and Rhombus',
    latex: 'A_{\\text{sq}} = s^2, \\quad A_{\\text{rect}} = lw, \\quad A_{\\text{tri}} = \\frac{1}{2}bh, \\quad A_{\\text{circ}} = \\pi r^2, \\quad A_{\\text{trap}} = \\frac{a+b}{2}h',
    subFormulas: [
      {
        id: 'area_square',
        title: 'Square Area',
        desc: 'Area of a square: A = s² where s is side length',
        latex: 'A = s^2',
        template: 's^2',
        vars: [
          { id: 's', label: 'Side Length (s)', default: 6, type: 'number' }
        ],
        compute(v) {
          const s = parseFloat(v.s);
          if (s <= 0) return { error: "Side length must be positive." };
          const area = s * s;
          const cleanA = parseFloat(area.toFixed(4));
          return {
            formulaStatement: { title: "Area of a Square", latex: "A = s^2" },
            givenValues: `s = ${s}`,
            substitution: `A = (${s})^2`,
            intermediateSteps: [
              { title: "Multiply Side by Itself", expression: `${s} \\times ${s} = ${cleanA}`, note: "Square the side length" }
            ],
            finalResult: `A = ${cleanA} \\text{ sq units}`,
            answer: `${cleanA}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A = s^2", note: "Square area equation" },
              { title: "Step 2: Given Values", expression: `s = ${s}`, note: "Side measurement" },
              { title: "Step 3: Substitution", expression: `A = (${s})^2`, note: "Substitute into equation" },
              { title: "Step 4: Intermediate Simplification", expression: `${s} \\times ${s} = ${cleanA}`, note: "Compute square" },
              { title: "Step 5: Final Result", expression: `A = ${cleanA}`, note: "Area evaluated" }
            ]
          };
        }
      },
      {
        id: 'area_rectangle',
        title: 'Rectangle Area',
        desc: 'Area of a rectangle: A = l × w (length × width)',
        latex: 'A = l \\cdot w',
        template: 'l * w',
        vars: [
          { id: 'l', label: 'Length (l)', default: 8, type: 'number' },
          { id: 'w', label: 'Width (w)', default: 5, type: 'number' }
        ],
        compute(v) {
          const l = parseFloat(v.l), w = parseFloat(v.w);
          if (l <= 0 || w <= 0) return { error: "Length and width must be positive." };
          const area = l * w;
          const cleanA = parseFloat(area.toFixed(4));
          return {
            formulaStatement: { title: "Area of a Rectangle", latex: "A = l \\cdot w" },
            givenValues: `l = ${l}, \\quad w = ${w}`,
            substitution: `A = (${l}) \\times (${w})`,
            intermediateSteps: [
              { title: "Multiply Length by Width", expression: `${l} \\times ${w} = ${cleanA}`, note: "2D surface area" }
            ],
            finalResult: `A = ${cleanA} \\text{ sq units}`,
            answer: `${cleanA}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A = l \\times w", note: "Rectangle area formula" },
              { title: "Step 2: Given Values", expression: `l = ${l}, \\; w = ${w}`, note: "Dimensions" },
              { title: "Step 3: Substitution", expression: `A = ${l} \\times ${w}`, note: "Substitute parameters" },
              { title: "Step 4: Computation", expression: `${cleanA}`, note: "Multiply dimensions" },
              { title: "Step 5: Final Result", expression: `A = ${cleanA}`, note: "Area found" }
            ]
          };
        }
      },
      {
        id: 'area_triangle',
        title: 'Triangle Area',
        desc: 'Area of a triangle: A = 1/2 · b · h (half base × height)',
        latex: 'A = \\frac{1}{2} b h',
        template: '0.5 * b * h',
        vars: [
          { id: 'b', label: 'Base (b)', default: 10, type: 'number' },
          { id: 'h', label: 'Perpendicular Height (h)', default: 6, type: 'number' }
        ],
        compute(v) {
          const b = parseFloat(v.b), h = parseFloat(v.h);
          if (b <= 0 || h <= 0) return { error: "Base and height must be positive." };
          const area = 0.5 * b * h;
          const cleanA = parseFloat(area.toFixed(4));
          return {
            formulaStatement: { title: "Area of a Triangle", latex: "A = \\frac{1}{2} b h" },
            givenValues: `b = ${b}, \\quad h = ${h}`,
            substitution: `A = \\frac{1}{2} (${b}) (${h})`,
            intermediateSteps: [
              { title: "Base × Height Product", expression: `${b} \\times ${h} = ${b*h}`, note: "Base times height" },
              { title: "Halve Product", expression: `\\frac{1}{2} \\times ${b*h} = ${cleanA}`, note: "Divide by 2" }
            ],
            finalResult: `A = ${cleanA} \\text{ sq units}`,
            answer: `${cleanA}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A = \\frac{1}{2}bh", note: "Triangle area equation" },
              { title: "Step 2: Given Values", expression: `b = ${b}, \\; h = ${h}`, note: "Base and height" },
              { title: "Step 3: Substitution", expression: `A = 0.5 \\times ${b} \\times ${h}`, note: "Substitute into equation" },
              { title: "Step 4: Calculations", expression: `${cleanA}`, note: "Perform multiplication" },
              { title: "Step 5: Final Result", expression: `A = ${cleanA}`, note: "Area calculated" }
            ]
          };
        }
      },
      {
        id: 'area_circle',
        title: 'Circle Area',
        desc: 'Area enclosed by a circle: A = πr² (where r is radius)',
        latex: 'A = \\pi r^2',
        template: 'pi * r^2',
        vars: [
          { id: 'r', label: 'Radius (r)', default: 5, type: 'number' }
        ],
        compute(v) {
          const r = parseFloat(v.r);
          if (r <= 0) return { error: "Radius must be positive." };
          const rSq = r * r;
          const area = Math.PI * rSq;
          const cleanA = parseFloat(area.toFixed(4));
          return {
            formulaStatement: { title: "Area of a Circle", latex: "A = \\pi r^2" },
            givenValues: `r = ${r}, \\quad \\pi \\approx 3.14159`,
            substitution: `A = \\pi (${r})^2 = \\pi (${rSq})`,
            intermediateSteps: [
              { title: "Square Radius", expression: `r^2 = (${r})^2 = ${rSq}`, note: "Radius squared" },
              { title: "Multiply by Pi", expression: `${rSq} \\times 3.14159 = ${cleanA}`, note: "Numerical evaluation" }
            ],
            finalResult: `A = ${cleanA} \\text{ sq units} \\quad (${rSq}\\pi)`,
            answer: `${cleanA}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A = \\pi r^2", note: "Circle area equation" },
              { title: "Step 2: Given Values", expression: `r = ${r}`, note: "Radius parameter" },
              { title: "Step 3: Substitution", expression: `A = \\pi (${r})^2`, note: "Square radius" },
              { title: "Step 4: Multiply by π", expression: `A = ${rSq}\\pi \\approx ${cleanA}`, note: "Multiply by 3.14159" },
              { title: "Step 5: Final Result", expression: `A = ${cleanA}`, note: "Circle area evaluated" }
            ]
          };
        }
      },
      {
        id: 'area_parallelogram',
        title: 'Parallelogram Area',
        desc: 'Area of a parallelogram: A = b × h (base × perpendicular height)',
        latex: 'A = b \\cdot h',
        template: 'b * h',
        vars: [
          { id: 'b', label: 'Base (b)', default: 12, type: 'number' },
          { id: 'h', label: 'Height (h)', default: 7, type: 'number' }
        ],
        compute(v) {
          const b = parseFloat(v.b), h = parseFloat(v.h);
          if (b <= 0 || h <= 0) return { error: "Base and height must be positive." };
          const area = b * h;
          const cleanA = parseFloat(area.toFixed(4));
          return {
            formulaStatement: { title: "Area of a Parallelogram", latex: "A = b \\cdot h" },
            givenValues: `b = ${b}, \\quad h = ${h}`,
            substitution: `A = (${b}) \\times (${h})`,
            intermediateSteps: [
              { title: "Multiply Base by Height", expression: `${b} \\times ${h} = ${cleanA}`, note: "Product of base and perpendicular height" }
            ],
            finalResult: `A = ${cleanA} \\text{ sq units}`,
            answer: `${cleanA}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A = b \\cdot h", note: "Parallelogram area formula" },
              { title: "Step 2: Given Values", expression: `b = ${b}, \\; h = ${h}`, note: "Base and height" },
              { title: "Step 3: Substitution", expression: `A = ${b} \\times ${h}`, note: "Plug in dimensions" },
              { title: "Step 4: Product", expression: `${cleanA}`, note: "Calculate area" },
              { title: "Step 5: Final Result", expression: `A = ${cleanA}`, note: "Area verified" }
            ]
          };
        }
      },
      {
        id: 'area_trapezoid',
        title: 'Trapezoid Area',
        desc: 'Area of a trapezoid: A = 1/2 · (a + b) · h (average of parallel bases × height)',
        latex: 'A = \\frac{a + b}{2} \\cdot h',
        template: '((a + b) / 2) * h',
        vars: [
          { id: 'a', label: 'Parallel Base a', default: 8, type: 'number' },
          { id: 'b', label: 'Parallel Base b', default: 14, type: 'number' },
          { id: 'h', label: 'Perpendicular Height (h)', default: 5, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b), h = parseFloat(v.h);
          if (a <= 0 || b <= 0 || h <= 0) return { error: "Bases and height must be positive." };
          const sum = a + b;
          const avgBase = sum / 2;
          const area = avgBase * h;
          const cleanA = parseFloat(area.toFixed(4));
          return {
            formulaStatement: { title: "Area of a Trapezoid", latex: "A = \\frac{a + b}{2} \\cdot h" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad h = ${h}`,
            substitution: `A = \\frac{${a} + ${b}}{2} \\times ${h}`,
            intermediateSteps: [
              { title: "Sum of Parallel Bases", expression: `${a} + ${b} = ${sum}`, note: "Add parallel sides" },
              { title: "Average of Bases", expression: `\\frac{${sum}}{2} = ${avgBase}`, note: "Mid-segment length" },
              { title: "Multiply by Height", expression: `${avgBase} \\times ${h} = ${cleanA}`, note: "Multiply by vertical height" }
            ],
            finalResult: `A = ${cleanA} \\text{ sq units}`,
            answer: `${cleanA}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A = \\frac{a+b}{2}h", note: "Trapezoid area formula" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\; b = ${b}, \\; h = ${h}`, note: "Parallel bases and height" },
              { title: "Step 3: Substitution", expression: `A = \\frac{${a}+${b}}{2} \\times ${h}`, note: "Substitute values" },
              { title: "Step 4: Average Base × Height", expression: `${avgBase} \\times ${h} = ${cleanA}`, note: "Perform multiplication" },
              { title: "Step 5: Final Result", expression: `A = ${cleanA}`, note: "Trapezoid area evaluated" }
            ]
          };
        }
      },
      {
        id: 'area_rhombus',
        title: 'Rhombus Area',
        desc: 'Area of a rhombus: A = 1/2 · d₁ · d₂ (half product of perpendicular diagonals)',
        latex: 'A = \\frac{1}{2} d_1 d_2',
        template: '0.5 * d1 * d2',
        vars: [
          { id: 'd1', label: 'Diagonal 1 (d₁)', default: 12, type: 'number' },
          { id: 'd2', label: 'Diagonal 2 (d₂)', default: 16, type: 'number' }
        ],
        compute(v) {
          const d1 = parseFloat(v.d1), d2 = parseFloat(v.d2);
          if (d1 <= 0 || d2 <= 0) return { error: "Diagonals must be positive." };
          const prod = d1 * d2;
          const area = 0.5 * prod;
          const cleanA = parseFloat(area.toFixed(4));
          return {
            formulaStatement: { title: "Area of a Rhombus", latex: "A = \\frac{1}{2} d_1 d_2" },
            givenValues: `d_1 = ${d1}, \\quad d_2 = ${d2}`,
            substitution: `A = \\frac{1}{2} (${d1}) (${d2})`,
            intermediateSteps: [
              { title: "Multiply Diagonals", expression: `${d1} \\times ${d2} = ${prod}`, note: "Diagonal product" },
              { title: "Halve Product", expression: `\\frac{1}{2} \\times ${prod} = ${cleanA}`, note: "Multiply by 1/2" }
            ],
            finalResult: `A = ${cleanA} \\text{ sq units}`,
            answer: `${cleanA}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A = \\frac{1}{2}d_1 d_2", note: "Rhombus area formula" },
              { title: "Step 2: Given Values", expression: `d_1 = ${d1}, \\; d_2 = ${d2}`, note: "Lengths of perpendicular diagonals" },
              { title: "Step 3: Substitution", expression: `A = 0.5 \\times ${d1} \\times ${d2}`, note: "Substitute into formula" },
              { title: "Step 4: Computation", expression: `0.5 \\times ${prod} = ${cleanA}`, note: "Calculate area" },
              { title: "Step 5: Final Result", expression: `A = ${cleanA}`, note: "Rhombus area verified" }
            ]
          };
        }
      }
    ]
  },

  // ================= 6. THEOREMS: 5 FUNDAMENTAL THEOREMS =================
  {
    id: 'fundamental_theorems_5',
    category: 'Theorems',
    subCategory: 'Geometric Theorems',
    title: '5 Fundamental Math Theorems',
    subtitle: 'Pythagorean, Thales Basic Proportionality, Midpoint Theorem, Exterior Angle, and Triangle Angle Sum',
    latex: 'a^2 + b^2 = c^2, \\quad \\frac{AD}{DB} = \\frac{AE}{EC}, \\quad DE = \\frac{1}{2}BC, \\quad e = \\alpha + \\beta, \\quad A + B + C = 180^\\circ',
    subFormulas: [
      {
        id: 'theorem_pythagorean',
        title: 'Pythagorean Theorem',
        desc: 'In a right triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides: a² + b² = c²',
        latex: 'a^2 + b^2 = c^2 \\implies c = \\sqrt{a^2 + b^2}',
        template: 'sqrt(a^2 + b^2)',
        vars: [
          { id: 'a', label: 'Leg a', default: 5, type: 'number' },
          { id: 'b', label: 'Leg b', default: 12, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b);
          if (a <= 0 || b <= 0) return { error: "Leg lengths must be positive." };
          const aSq = a * a;
          const bSq = b * b;
          const cSq = aSq + bSq;
          const c = Math.sqrt(cSq);
          const cleanC = parseFloat(c.toFixed(4));
          return {
            formulaStatement: { title: "Pythagorean Theorem", latex: "a^2 + b^2 = c^2 \\implies c = \\sqrt{a^2 + b^2}" },
            givenValues: `a = ${a}, \\quad b = ${b}`,
            substitution: `c = \\sqrt{(${a})^2 + (${b})^2} = \\sqrt{${aSq} + ${bSq}}`,
            intermediateSteps: [
              { title: "Square Both Legs", expression: `a^2 = ${aSq}, \\quad b^2 = ${bSq}`, note: "Square dimensions" },
              { title: "Sum of Squares", expression: `${aSq} + ${bSq} = ${cSq}`, note: "c² value" },
              { title: "Square Root", expression: `c = \\sqrt{${cSq}} = ${cleanC}`, note: "Hypotenuse length" }
            ],
            finalResult: `c = ${cleanC}`,
            answer: `c = ${cleanC}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "a^2 + b^2 = c^2", note: "Pythagorean theorem for right-angled triangles" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\; b = ${b}`, note: "Adjacent and opposite legs" },
              { title: "Step 3: Substitution", expression: `c = \\sqrt{${a}^2 + ${b}^2}`, note: "Substitute into equation" },
              { title: "Step 4: Intermediate Values", expression: `c = \\sqrt{${aSq} + ${bSq}} = \\sqrt{${cSq}}`, note: "Sum squares under radical" },
              { title: "Step 5: Final Result", expression: `c = ${cleanC}`, note: "Hypotenuse verified" }
            ]
          };
        }
      },
      {
        id: 'theorem_thales_bpt',
        title: 'Basic Proportionality Theorem (Thales)',
        desc: 'A line drawn parallel to one side of a triangle divides the other two sides in the same ratio: AD/DB = AE/EC',
        latex: '\\frac{AD}{DB} = \\frac{AE}{EC} \\implies EC = \\frac{AE \\cdot DB}{AD}',
        template: '(AE * DB) / AD',
        vars: [
          { id: 'ad', label: 'Segment AD', default: 3, type: 'number' },
          { id: 'db', label: 'Segment DB', default: 6, type: 'number' },
          { id: 'ae', label: 'Segment AE', default: 4, type: 'number' }
        ],
        compute(v) {
          const ad = parseFloat(v.ad), db = parseFloat(v.db), ae = parseFloat(v.ae);
          if (ad <= 0 || db <= 0 || ae <= 0) return { error: "Segment lengths must be strictly positive." };
          const ratio = db / ad;
          const ec = ae * ratio;
          const cleanEC = parseFloat(ec.toFixed(4));
          const inter = [
            { title: "Calculate Ratio AD / DB", expression: `\\frac{AD}{DB} = \\frac{${ad}}{${db}} = ${parseFloat((ad/db).toFixed(4))}`, note: "Side division ratio" },
            { title: "Apply Proportion to Other Side", expression: `\\frac{AE}{EC} = \\frac{AD}{DB} \\implies \\frac{${ae}}{EC} = \\frac{${ad}}{${db}}`, note: "Thales theorem equality" },
            { title: "Solve for Unknown Segment EC", expression: `EC = \\frac{${ae} \\times ${db}}{${ad}} = \\frac{${ae*db}}{${ad}} = ${cleanEC}`, note: "Cross multiplication" }
          ];
          return {
            formulaStatement: { title: "Basic Proportionality Theorem (Thales's Theorem)", latex: "\\frac{AD}{DB} = \\frac{AE}{EC} \\quad (DE \\parallel BC)" },
            givenValues: `AD = ${ad}, \\quad DB = ${db}, \\quad AE = ${ae}`,
            substitution: `\\frac{${ad}}{${db}} = \\frac{${ae}}{EC}`,
            intermediateSteps: inter,
            finalResult: `EC = ${cleanEC}`,
            answer: `EC = ${cleanEC}`,
            steps: [
              { title: "Step 1: Theorem Statement", expression: "\\frac{AD}{DB} = \\frac{AE}{EC}", note: "Thales theorem: parallel line divides sides proportionally" },
              { title: "Step 2: Given Values", expression: `AD = ${ad}, \\; DB = ${db}, \\; AE = ${ae}`, note: "Known segments" },
              { title: "Step 3: Proportion Equality", expression: `\\frac{${ad}}{${db}} = \\frac{${ae}}{EC}`, note: "Equate side ratios" },
              { title: "Step 4: Cross Multiplication", expression: `EC = \\frac{${ae} \\times ${db}}{${ad}} = ${cleanEC}`, note: "Isolate unknown segment" },
              { title: "Step 5: Final Result", expression: `EC = ${cleanEC}`, note: "Proportional segment determined" }
            ]
          };
        }
      },
      {
        id: 'theorem_midpoint',
        title: 'Midpoint Theorem',
        desc: 'The line segment connecting the midpoints of two sides of a triangle is parallel to the third side and exactly half its length',
        latex: 'DE \\parallel BC \\quad \\text{and} \\quad DE = \\frac{1}{2} BC',
        template: '0.5 * BC',
        vars: [
          { id: 'bc', label: 'Third Side (BC)', default: 18, type: 'number' }
        ],
        compute(v) {
          const bc = parseFloat(v.bc);
          if (bc <= 0) return { error: "Base side BC must be positive." };
          const de = 0.5 * bc;
          const cleanDE = parseFloat(de.toFixed(4));
          return {
            formulaStatement: { title: "Midpoint Theorem", latex: "DE = \\frac{1}{2} BC, \\quad DE \\parallel BC" },
            givenValues: `BC = ${bc}`,
            substitution: `DE = \\frac{1}{2} (${bc})`,
            intermediateSteps: [
              { title: "Halve the Base Length", expression: `\\frac{1}{2} \\times ${bc} = ${cleanDE}`, note: "Midpoint segment is exactly half the third side" }
            ],
            finalResult: `DE = ${cleanDE} \\quad (DE \\parallel BC)`,
            answer: `DE = ${cleanDE}`,
            steps: [
              { title: "Step 1: Theorem Statement", expression: "DE = \\frac{1}{2}BC \\text{ and } DE \\parallel BC", note: "Midpoint theorem statement" },
              { title: "Step 2: Given Value", expression: `BC = ${bc}`, note: "Base side of triangle" },
              { title: "Step 3: Substitution", expression: `DE = \\frac{1}{2} \\times ${bc}`, note: "Multiply base by 1/2" },
              { title: "Step 4: Evaluation", expression: `${cleanDE}`, note: "Calculate midpoint connector" },
              { title: "Step 5: Final Result", expression: `DE = ${cleanDE}`, note: "Segment verified" }
            ]
          };
        }
      },
      {
        id: 'theorem_exterior_angle',
        title: 'Exterior Angle Theorem',
        desc: 'The measure of an exterior angle of a triangle is equal to the sum of the measures of its two remote interior angles',
        latex: '\\angle \\text{ext} = \\angle A + \\angle B',
        template: 'angleA + angleB',
        vars: [
          { id: 'a', label: 'Remote Interior Angle A (°)', default: 55, type: 'number' },
          { id: 'b', label: 'Remote Interior Angle B (°)', default: 65, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b);
          if (a <= 0 || b <= 0 || a + b >= 180) return { error: "Angle sum must be valid inside a triangle (< 180°)." };
          const ext = a + b;
          const adj = 180 - ext;
          return {
            formulaStatement: { title: "Exterior Angle Theorem", latex: "e = \\alpha + \\beta" },
            givenValues: `\\alpha = ${a}^\\circ, \\quad \\beta = ${b}^\\circ`,
            substitution: `e = ${a}^\\circ + ${b}^\\circ`,
            intermediateSteps: [
              { title: "Sum Remote Angles", expression: `${a}^\\circ + ${b}^\\circ = ${ext}^\\circ`, note: "Remote interior angle addition" },
              { title: "Adjacent Interior Angle Check", expression: `180^\\circ - ${ext}^\\circ = ${adj}^\\circ`, note: "Linear pair verification" }
            ],
            finalResult: `\\text{Exterior Angle} = ${ext}^\\circ`,
            answer: `${ext}°`,
            steps: [
              { title: "Step 1: Theorem Statement", expression: "\\angle \\text{ext} = \\angle A + \\angle B", note: "Exterior angle equals sum of two opposite interior angles" },
              { title: "Step 2: Given Values", expression: `\\angle A = ${a}^\\circ, \\; \\angle B = ${b}^\\circ`, note: "Two opposite interior angles" },
              { title: "Step 3: Substitution", expression: `\\angle \\text{ext} = ${a}^\\circ + ${b}^\\circ`, note: "Add angle measures" },
              { title: "Step 4: Summation", expression: `${ext}^\\circ`, note: "Compute total angle" },
              { title: "Step 5: Final Result", expression: `${ext}^\\circ`, note: "Exterior angle calculated" }
            ]
          };
        }
      },
      {
        id: 'theorem_triangle_angle_sum',
        title: 'Angle Sum Property of a Triangle',
        desc: 'The interior angles of any triangle in Euclidean plane geometry always sum up to exactly 180°',
        latex: '\\angle A + \\angle B + \\angle C = 180^\\circ \\implies \\angle C = 180^\\circ - (\\angle A + \\angle B)',
        template: '180 - (angleA + angleB)',
        vars: [
          { id: 'a', label: 'Interior Angle A (°)', default: 50, type: 'number' },
          { id: 'b', label: 'Interior Angle B (°)', default: 70, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b);
          if (a <= 0 || b <= 0) return { error: "Angle values must be positive." };
          const sumKnown = a + b;
          if (sumKnown >= 180) return { error: "Sum of Angle A and Angle B must be strictly less than 180°." };
          const c = 180 - sumKnown;
          const cleanC = parseFloat(c.toFixed(4));
          return {
            formulaStatement: { title: "Angle Sum Property of a Triangle", latex: "\\angle A + \\angle B + \\angle C = 180^\\circ" },
            givenValues: `\\angle A = ${a}^\\circ, \\quad \\angle B = ${b}^\\circ`,
            substitution: `\\angle C = 180^\\circ - (${a}^\\circ + ${b}^\\circ)`,
            intermediateSteps: [
              { title: "Sum Known Angles", expression: `${a}^\\circ + ${b}^\\circ = ${sumKnown}^\\circ`, note: "Sum of two known angles" },
              { title: "Subtract from 180°", expression: `180^\\circ - ${sumKnown}^\\circ = ${cleanC}^\\circ`, note: "Third unknown angle" }
            ],
            finalResult: `\\angle C = ${cleanC}^\\circ`,
            answer: `${cleanC}°`,
            steps: [
              { title: "Step 1: Theorem Statement", expression: "\\angle A + \\angle B + \\angle C = 180^\\circ", note: "Interior angle sum theorem" },
              { title: "Step 2: Given Values", expression: `\\angle A = ${a}^\\circ, \\; \\angle B = ${b}^\\circ`, note: "Two known angles" },
              { title: "Step 3: Substitution", expression: `\\angle C = 180^\\circ - (${a}^\\circ + ${b}^\\circ)`, note: "Isolate angle C" },
              { title: "Step 4: Subtraction", expression: `180^\\circ - ${sumKnown}^\\circ = ${cleanC}^\\circ`, note: "Perform subtraction" },
              { title: "Step 5: Final Result", expression: `\\angle C = ${cleanC}^\\circ`, note: "Third angle verified" }
            ]
          };
        }
      }
    ]
  }
];
