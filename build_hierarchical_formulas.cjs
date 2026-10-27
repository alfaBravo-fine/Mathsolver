const fs = require('fs');

// 1. Definition of Simultaneous Linear Systems with Division and Factorization Methods as the first sub-tabs
const SIMULTANEOUS_GROUP = `  // ================= 10. SIMULTANEOUS LINEAR SYSTEMS (SUB-TABS FOR METHODS) =================
  {
    id: 'simultaneous_systems',
    category: 'Systems',
    subCategory: 'Linear Systems',
    title: 'Simultaneous Linear Systems (Methods)',
    subtitle: 'Solve { a₁x + b₁y = c₁, a₂x + b₂y = c₂ } via Division Method, Factorization Method, Substitution, or Elimination',
    latex: '\\\\begin{cases} a_1 x + b_1 y = c_1 \\\\\\\\ a_2 x + b_2 y = c_2 \\\\end{cases}',
    subFormulas: [
      {
        id: 'sim_division',
        title: '1. Division Method (Matrix / Cramer)',
        desc: 'Solve system using Matrix Division & Cramer\\'s Rule determinants: x = D_x / D, y = D_y / D',
        latex: 'D = \\\\begin{vmatrix} a_1 & b_1 \\\\\\\\ a_2 & b_2 \\\\end{vmatrix}, \\\\quad x = \\\\frac{D_x}{D}, \\\\quad y = \\\\frac{D_y}{D}',
        template: 'Division Method: a1*x + b1*y = c1, a2*x + b2*y = c2',
        vars: [
          { id: 'a1', label: 'a₁', default: 2, type: 'number' },
          { id: 'b1', label: 'b₁', default: 3, type: 'number' },
          { id: 'c1', label: 'c₁', default: 13, type: 'number' },
          { id: 'a2', label: 'a₂', default: 5, type: 'number' },
          { id: 'b2', label: 'b₂', default: -2, type: 'number' },
          { id: 'c2', label: 'c₂', default: 4, type: 'number' }
        ],
        compute(v) {
          const a1 = parseFloat(v.a1), b1 = parseFloat(v.b1), c1 = parseFloat(v.c1);
          const a2 = parseFloat(v.a2), b2 = parseFloat(v.b2), c2 = parseFloat(v.c2);
          const D = a1 * b2 - a2 * b1;
          if (Math.abs(D) < 1e-9) return { error: "Matrix is singular (D = 0); no unique solution exists." };
          const Dx = c1 * b2 - c2 * b1;
          const Dy = a1 * c2 - a2 * c1;
          const x = Dx / D;
          const y = Dy / D;
          const cx = Number.isInteger(x) ? x : parseFloat(x.toFixed(4));
          const cy = Number.isInteger(y) ? y : parseFloat(y.toFixed(4));
          const inter = [
            { title: "Matrix Equation (AX = B)", expression: \`\\\\begin{pmatrix} \${a1} & \${b1} \\\\\\\\ \${a2} & \${b2} \\\\end{pmatrix} \\\\begin{pmatrix} x \\\\\\\\ y \\\\end{pmatrix} = \\\\begin{pmatrix} \${c1} \\\\\\\\ \${c2} \\\\end{pmatrix}\`, note: "Standard matrix form representation" },
            { title: "Compute Coefficient Determinant D", expression: \`D = (\${a1})(\${b2}) - (\${a2})(\${b1}) = \${a1*b2} - (\${a2*b1}) = \${D}\`, note: "Base determinant of coefficient matrix" },
            { title: "Compute Column 1 Determinant D_x", expression: \`D_x = (\${c1})(\${b2}) - (\${c2})(\${b1}) = \${c1*b2} - (\${c2*b1}) = \${Dx}\`, note: "Replace column 1 with constant vector B" },
            { title: "Compute Column 2 Determinant D_y", expression: \`D_y = (\${a1})(\${c2}) - (\${a2})(\${c1}) = \${a1*c2} - (\${a2*c1}) = \${Dy}\`, note: "Replace column 2 with constant vector B" },
            { title: "Matrix Division & Quotient Evaluation", expression: \`x = \\\\frac{D_x}{D} = \\\\frac{\${Dx}}{\${D}} = \${cx}, \\\\quad y = \\\\frac{D_y}{D} = \\\\frac{\${Dy}}{\${D}} = \${cy}\`, note: "Divide modified determinants by base determinant" }
          ];
          return {
            formulaStatement: { title: "Division Method (Matrix Division / Cramer's Rule)", latex: "x = \\\\frac{\\\\det(A_1)}{\\\\det(A)}, \\\\quad y = \\\\frac{\\\\det(A_2)}{\\\\det(A)}" },
            givenValues: \`\\\\text{Eq 1: } \${a1}x + \${b1}y = \${c1}, \\\\quad \\\\text{Eq 2: } \${a2}x + \${b2}y = \${c2}\`,
            substitution: \`x = \\\\frac{\${Dx}}{\${D}} = \${cx}, \\\\quad y = \\\\frac{\${Dy}}{\${D}} = \${cy}\`,
            intermediateSteps: inter,
            finalResult: \`x = \${cx}, \\\\; y = \${cy}\`,
            answer: \`x = \${cx}, y = \${cy}\`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "X = A^{-1}B = \\\\frac{\\\\text{adj}(A)B}{\\\\det(A)}", note: "Matrix division algorithm" },
              { title: "Step 2: Given Values", expression: \`a_1=\${a1}, b_1=\${b1}, c_1=\${c1}, a_2=\${a2}, b_2=\${b2}, c_2=\${c2}\`, note: "Matrix coefficients" },
              ...inter,
              { title: "Step 5: Final Result", expression: \`x = \${cx}, \\\\quad y = \${cy}\`, note: "Division method verified" }
            ]
          };
        }
      },
      {
        id: 'sim_factorization',
        title: '2. Factorization Method (Triangular Elimination)',
        desc: 'Solve system using Systematic Triangular Row Elimination: eliminate x to produce an upper-triangular system',
        latex: 'L \\\\cdot U \\\\cdot X = B \\\\implies \\\\text{Eq}_2 - m \\\\cdot \\\\text{Eq}_1 \\\\implies (b_2 - m b_1)y = c_2 - m c_1',
        template: 'Factorization Method: a1*x + b1*y = c1, a2*x + b2*y = c2',
        vars: [
          { id: 'a1', label: 'a₁', default: 2, type: 'number' },
          { id: 'b1', label: 'b₁', default: 3, type: 'number' },
          { id: 'c1', label: 'c₁', default: 13, type: 'number' },
          { id: 'a2', label: 'a₂', default: 5, type: 'number' },
          { id: 'b2', label: 'b₂', default: -2, type: 'number' },
          { id: 'c2', label: 'c₂', default: 4, type: 'number' }
        ],
        compute(v) {
          const a1 = parseFloat(v.a1), b1 = parseFloat(v.b1), c1 = parseFloat(v.c1);
          const a2 = parseFloat(v.a2), b2 = parseFloat(v.b2), c2 = parseFloat(v.c2);
          if (a1 === 0) return { error: "Coefficient a₁ cannot be 0 for triangular row factorization." };
          const m = a2 / a1;
          const cleanM = Number.isInteger(m) ? m : parseFloat(m.toFixed(4));
          const elimB = b2 - m * b1;
          const elimC = c2 - m * c1;
          if (Math.abs(elimB) < 1e-9) return { error: "System has no unique triangular factorization (rows are linearly dependent)." };
          const y = elimC / elimB;
          const x = (c1 - b1 * y) / a1;
          const cx = Number.isInteger(x) ? x : parseFloat(x.toFixed(4));
          const cy = Number.isInteger(y) ? y : parseFloat(y.toFixed(4));
          const cleanElimB = Number.isInteger(elimB) ? elimB : parseFloat(elimB.toFixed(4));
          const cleanElimC = Number.isInteger(elimC) ? elimC : parseFloat(elimC.toFixed(4));
          const inter = [
            { title: "Align System Equations", expression: \`\\\\begin{cases} (1): \${a1}x + \${b1}y = \${c1} \\\\\\\\ (2): \${a2}x + \${b2}y = \${c2} \\\\end{cases}\`, note: "Standard system representation" },
            { title: "Determine Row Pivot Elimination Factor", expression: \`m = \\\\frac{a_2}{a_1} = \\\\frac{\${a2}}{\${a1}} = \${cleanM}\`, note: "Scalar multiplier to eliminate x from equation 2" },
            { title: "Triangular Factorization / Row Elimination", expression: \`\\\\text{Eq}(2) - (\${cleanM})\\\\text{Eq}(1) \\\\implies (\${cleanElimB})y = \${cleanElimC}\`, note: "Converts system to upper-triangular echelon form" },
            { title: "Back-Substitution for y", expression: \`y = \\\\frac{\${cleanElimC}}{\${cleanElimB}} = \${cy}\`, note: "Solve upper-triangular diagonal" },
            { title: "Back-Substitution for x in Eq(1)", expression: \`\${a1}x + (\${b1})(\${cy}) = \${c1} \\\\implies \${a1}x = \${c1 - b1*cy} \\\\implies x = \${cx}\`, note: "Substitute y into original top row" }
          ];
          return {
            formulaStatement: { title: "Factorization Method (Systematic Triangular Row Elimination)", latex: "L \\\\cdot U \\\\cdot X = B \\\\implies U \\\\cdot X = Y" },
            givenValues: \`\\\\text{Eq 1: } \${a1}x + \${b1}y = \${c1}, \\\\quad \\\\text{Eq 2: } \${a2}x + \${b2}y = \${c2}\`,
            substitution: \`m = \${cleanM}, \\\\quad y = \${cy}, \\\\quad x = \${cx}\`,
            intermediateSteps: inter,
            finalResult: \`x = \${cx}, \\\\; y = \${cy}\`,
            answer: \`x = \${cx}, y = \${cy}\`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\\\text{Triangular Row Factorization}", note: "Systematic Gaussian triangularization" },
              { title: "Step 2: Given Values", expression: \`a_1=\${a1}, b_1=\${b1}, c_1=\${c1}, a_2=\${a2}, b_2=\${b2}, c_2=\${c2}\`, note: "Input coefficients" },
              ...inter,
              { title: "Step 5: Final Result", expression: \`x = \${cx}, \\\\quad y = \${cy}\`, note: "Factorization solution verified" }
            ]
          };
        }
      },
      {
        id: 'sim_substitution',
        title: '3. Substitution Method',
        desc: 'Isolate one variable from Eq 1 and substitute into Eq 2',
        latex: 'x = \\\\frac{c_1 - b_1 y}{a_1} \\\\implies a_2\\\\left(\\\\frac{c_1 - b_1 y}{a_1}\\\\right) + b_2 y = c_2',
        template: 'Substitution: a1*x + b1*y = c1, a2*x + b2*y = c2',
        vars: [
          { id: 'a1', label: 'a₁', default: 2, type: 'number' },
          { id: 'b1', label: 'b₁', default: 3, type: 'number' },
          { id: 'c1', label: 'c₁', default: 13, type: 'number' },
          { id: 'a2', label: 'a₂', default: 5, type: 'number' },
          { id: 'b2', label: 'b₂', default: -2, type: 'number' },
          { id: 'c2', label: 'c₂', default: 4, type: 'number' }
        ],
        compute(v) {
          const a1 = parseFloat(v.a1), b1 = parseFloat(v.b1), c1 = parseFloat(v.c1);
          const a2 = parseFloat(v.a2), b2 = parseFloat(v.b2), c2 = parseFloat(v.c2);
          const det = a1 * b2 - a2 * b1;
          if (Math.abs(det) < 1e-9) return { error: "System has no unique solution (determinant is zero; lines are parallel or coincident)." };
          const x = (c1 * b2 - c2 * b1) / det;
          const y = (a1 * c2 - a2 * c1) / det;
          const cx = Number.isInteger(x) ? x : parseFloat(x.toFixed(4));
          const cy = Number.isInteger(y) ? y : parseFloat(y.toFixed(4));
          const inter = [
            { title: "System Equations", expression: \`\\\\begin{cases} \${a1}x + \${b1}y = \${c1} \\\\\\\\ \${a2}x + \${b2}y = \${c2} \\\\end{cases}\`, note: "Given 2x2 linear system" },
            { title: "Isolate x in Equation 1", expression: \`x = \\\\frac{\${c1} - \${b1}y}{\${a1}}\`, note: "Express x in terms of y" },
            { title: "Substitute into Equation 2", expression: \`\${a2}\\\\left(\\\\frac{\${c1} - \${b1}y}{\${a1}}\\\\right) + (\${b2})y = \${c2}\`, note: "Equation in single variable y" },
            { title: "Solve for y", expression: \`y = \${cy}\`, note: "Combine coefficients and isolate y" },
            { title: "Back-substitute for x", expression: \`x = \\\\frac{\${c1} - (\${b1})(\${cy})}{\${a1}} = \${cx}\`, note: "Compute x" }
          ];
          return {
            formulaStatement: { title: "Substitution Method", latex: "x = \\\\frac{c_1 - b_1 y}{a_1} \\\\implies \\\\text{substitute into Eq 2}" },
            givenValues: \`\\\\text{Eq 1: } \${a1}x + \${b1}y = \${c1}, \\\\quad \\\\text{Eq 2: } \${a2}x + \${b2}y = \${c2}\`,
            substitution: \`x = \\\\frac{\${c1} - \${b1}y}{\${a1}}\`,
            intermediateSteps: inter,
            finalResult: \`x = \${cx}, y = \${cy}\`,
            answer: \`x = \${cx}, y = \${cy}\`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\\\text{Substitution Method Flow}", note: "Isolate and substitute" },
              { title: "Step 2: Given Values", expression: \`\\\\text{Eq 1: } \${a1}x + \${b1}y = \${c1}, \\\\quad \\\\text{Eq 2: } \${a2}x + \${b2}y = \${c2}\`, note: "Coefficients" },
              ...inter,
              { title: "Step 5: Final Result", expression: \`x = \${cx}, \\\\quad y = \${cy}\`, note: "Unique solution verified" }
            ]
          };
        }
      },
      {
        id: 'sim_elimination',
        title: '4. Elimination Method',
        desc: 'Multiply equations by scale factors to eliminate one variable by addition or subtraction',
        latex: '(a_2 \\\\cdot \\\\text{Eq 1}) - (a_1 \\\\cdot \\\\text{Eq 2}) \\\\implies (a_2 b_1 - a_1 b_2)y = a_2 c_1 - a_1 c_2',
        template: 'Elimination: a1*x + b1*y = c1, a2*x + b2*y = c2',
        vars: [
          { id: 'a1', label: 'a₁', default: 3, type: 'number' },
          { id: 'b1', label: 'b₁', default: 2, type: 'number' },
          { id: 'c1', label: 'c₁', default: 16, type: 'number' },
          { id: 'a2', label: 'a₂', default: 2, type: 'number' },
          { id: 'b2', label: 'b₂', default: -3, type: 'number' },
          { id: 'c2', label: 'c₂', default: -11, type: 'number' }
        ],
        compute(v) {
          const a1 = parseFloat(v.a1), b1 = parseFloat(v.b1), c1 = parseFloat(v.c1);
          const a2 = parseFloat(v.a2), b2 = parseFloat(v.b2), c2 = parseFloat(v.c2);
          const det = a1 * b2 - a2 * b1;
          if (Math.abs(det) < 1e-9) return { error: "System has no unique solution (determinant is zero)." };
          const x = (c1 * b2 - c2 * b1) / det;
          const y = (a1 * c2 - a2 * c1) / det;
          const cx = Number.isInteger(x) ? x : parseFloat(x.toFixed(4));
          const cy = Number.isInteger(y) ? y : parseFloat(y.toFixed(4));
          const inter = [
            { title: "Multiply Eq 1 by a₂ and Eq 2 by a₁", expression: \`\\\\begin{cases} \${a1*a2}x + \${b1*a2}y = \${c1*a2} \\\\\\\\ \${a1*a2}x + \${b2*a1}y = \${c2*a1} \\\\end{cases}\`, note: "Equalize x coefficients" },
            { title: "Subtract Equation 2 from Equation 1", expression: \`(\${b1*a2 - b2*a1})y = \${c1*a2 - c2*a1}\`, note: "Eliminated variable x" },
            { title: "Solve for y", expression: \`y = \\\\frac{\${c1*a2 - c2*a1}}{\${b1*a2 - b2*a1}} = \${cy}\`, note: "Divide by y coefficient" },
            { title: "Solve for x via back-substitution", expression: \`x = \\\\frac{\${c1} - (\${b1})(\${cy})}{\${a1}} = \${cx}\`, note: "Substitute y into Eq 1" }
          ];
          return {
            formulaStatement: { title: "Elimination Method", latex: "a_2 \\\\cdot \\\\text{Eq}_1 - a_1 \\\\cdot \\\\text{Eq}_2 \\\\implies (a_2 b_1 - a_1 b_2)y = a_2 c_1 - a_1 c_2" },
            givenValues: \`\\\\text{Eq 1: } \${a1}x + \${b1}y = \${c1}, \\\\quad \\\\text{Eq 2: } \${a2}x + \${b2}y = \${c2}\`,
            substitution: \`\\\\text{Scale by } \${a2} \\\\text{ and } \${a1}\`,
            intermediateSteps: inter,
            finalResult: \`x = \${cx}, y = \${cy}\`,
            answer: \`x = \${cx}, y = \${cy}\`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\\\text{Elimination Method Flow}", note: "Eliminate one unknown" },
              { title: "Step 2: Given Values", expression: \`\\\\text{System: } \${a1}x + \${b1}y = \${c1}, \\\\quad \${a2}x + \${b2}y = \${c2}\`, note: "Input linear equations" },
              ...inter,
              { title: "Step 5: Final Result", expression: \`x = \${cx}, \\\\quad y = \${cy}\`, note: "Elimination solved" }
            ]
          };
        }
      }
    ]
  },`;

fs.writeFileSync('simultaneous_block.txt', SIMULTANEOUS_GROUP);
console.log('simultaneous_block.txt written successfully');
