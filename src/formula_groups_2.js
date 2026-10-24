/**
 * FORMULA GROUPS 8-13:
 * Quadratics, Coordinate Geometry, Simultaneous Systems, Sequences, Polynomials, Theorems/Sets
 */
const FORMULA_GROUPS_2 = [
  // ================= 8. QUADRATIC EQUATIONS =================
  {
    id: 'quadratics',
    category: 'Algebra',
    subCategory: 'Quadratics',
    title: 'Quadratic Equations',
    subtitle: 'Solve ax² + bx + c = 0 via Quadratic Formula, and compute Vertex',
    latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}, \\quad x_v = -\\frac{b}{2a}, \\quad y_v = c - \\frac{b^2}{4a}',
    subFormulas: [
      {
        id: 'quad_formula_solver',
        title: 'Quadratic Formula Solver',
        desc: 'Solve second-degree polynomial equation with real or complex roots',
        latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        template: 'x = (-b +- sqrt(b^2 - 4ac)) / (2a)',
        vars: [
          { id: 'a', label: 'Coefficient a', default: 1, type: 'number' },
          { id: 'b', label: 'Coefficient b', default: -5, type: 'number' },
          { id: 'c', label: 'Constant c', default: 6, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          const c = parseFloat(v.c);
          if (a === 0) return { error: "Coefficient 'a' cannot be zero (that would be a linear equation)." };
          const disc = b * b - 4 * a * c;
          const inter = [
            { title: "Standard Quadratic Form", expression: `${a}x^2 ${b>=0?'+':'-'} ${Math.abs(b)}x ${c>=0?'+':'-'} ${Math.abs(c)} = 0`, note: `Identified: a = ${a}, b = ${b}, c = ${c}` },
            { title: "Discriminant (Δ)", expression: `\\Delta = b^2 - 4ac = (${b})^2 - 4(${a})(${c}) = ${disc}`, note: disc > 0 ? "Two distinct real roots" : disc === 0 ? "One repeated root" : "Two complex conjugate roots" }
          ];
          let ans = "";
          if (disc >= 0) {
            const sq = Math.sqrt(disc);
            const r1 = (-b + sq) / (2 * a);
            const r2 = (-b - sq) / (2 * a);
            const cr1 = Number.isInteger(r1) ? r1 : parseFloat(r1.toFixed(4));
            const cr2 = Number.isInteger(r2) ? r2 : parseFloat(r2.toFixed(4));
            ans = cr1 === cr2 ? `x = ${cr1}` : `x₁ = ${cr1}, x₂ = ${cr2}`;
            inter.push({ title: "Evaluate Roots", expression: `x = \\frac{-(${b}) \\pm \\sqrt{${disc}}}{2(${a})} = \\frac{${-b} \\pm ${parseFloat(sq.toFixed(4))}}{${2*a}}`, note: "Computed exact values" });
          } else {
            const real = parseFloat((-b / (2 * a)).toFixed(4));
            const imag = parseFloat((Math.sqrt(-disc) / (2 * a)).toFixed(4));
            ans = `x = ${real} ± ${Math.abs(imag)}i`;
            inter.push({ title: "Complex Roots", expression: `x = ${real} \\pm ${Math.abs(imag)}i`, note: "Imaginary unit i = √(-1)" });
          }
          return {
            formulaStatement: { title: "Quadratic Formula", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
            substitution: `x = \\frac{-(${b}) \\pm \\sqrt{(${b})^2 - 4(${a})(${c})}}{2(${a})}`,
            intermediateSteps: inter,
            finalResult: ans,
            answer: ans,
            steps: [
              { title: "Step 1: Formula Statement", expression: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", note: "Base quadratic equation formula" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`, note: "Input coefficients" },
              { title: "Step 3: Substitution", expression: `x = \\frac{-(${b}) \\pm \\sqrt{(${b})^2 - 4(${a})(${c})}}{2(${a})}`, note: "Plug into formula" },
              ...inter,
              { title: "Step 5: Final Result", expression: ans, note: "Roots solved" }
            ]
          };
        }
      },
      {
        id: 'quad_vertex',
        title: 'Parabola Vertex & Axis of Symmetry',
        desc: 'Find the vertex coordinate (h, k) and axis of symmetry of quadratic function y = ax² + bx + c',
        latex: 'h = -\\frac{b}{2a}, \\quad k = c - \\frac{b^2}{4a}',
        template: 'h = -b/(2a), k = c - b^2/(4a)',
        vars: [
          { id: 'a', label: 'Coefficient a', default: 2, type: 'number' },
          { id: 'b', label: 'Coefficient b', default: -8, type: 'number' },
          { id: 'c', label: 'Constant c', default: 3, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          const c = parseFloat(v.c);
          if (a === 0) return { error: "Coefficient a cannot be zero." };
          const h = -b / (2 * a);
          const k = a * h * h + b * h + c;
          const ch = Number.isInteger(h) ? h : parseFloat(h.toFixed(4));
          const ck = Number.isInteger(k) ? k : parseFloat(k.toFixed(4));
          const nature = a > 0 ? "Minimum point (parabola opens upwards)" : "Maximum point (parabola opens downwards)";
          const inter = [
            { title: "Axis of Symmetry (h)", expression: `h = -\\frac{b}{2a} = -\\frac{${b}}{2(${a})} = ${ch}`, note: "Vertical axis of symmetry x = h" },
            { title: "Vertex Y-coordinate (k)", expression: `k = f(${ch}) = ${a}(${ch})^2 + (${b})(${ch}) + ${c} = ${ck}`, note: "Extreme value of parabola" }
          ];
          return {
            formulaStatement: { title: "Parabola Vertex Coordinates", latex: "h = -\\frac{b}{2a}, \\quad k = f(h)" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
            substitution: `h = -\\frac{${b}}{2(${a})}, \\quad k = ${a}\\left(-\\frac{${b}}{2(${a})}\\right)^2 + ${b}\\left(-\\frac{${b}}{2(${a})}\\right) + ${c}`,
            intermediateSteps: inter,
            finalResult: `Vertex: (${ch}, ${ck}) [${nature}]`,
            answer: `Vertex: (${ch}, ${ck})`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "h = -\\frac{b}{2a}, \\quad k = f(h)", note: "Vertex formula" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`, note: "Input coefficients" },
              { title: "Step 3: Substitution", expression: `h = -\\frac{${b}}{2(${a})}`, note: "Calculate x-coordinate" },
              ...inter,
              { title: "Step 5: Final Result", expression: `\\text{Vertex: } (${ch}, ${ck}) \\quad [${nature}]`, note: "Vertex determined" }
            ]
          };
        }
      }
    ]
  },

  // ================= 9. COORDINATE GEOMETRY =================
  {
    id: 'coordinate_geometry',
    category: 'Algebra',
    subCategory: 'Coordinates',
    title: 'Coordinate Geometry',
    subtitle: 'Distance Formula, Midpoint Formula, and Slope of a Line',
    latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}, \\quad M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right), \\quad m = \\frac{y_2 - y_1}{x_2 - x_1}',
    subFormulas: [
      {
        id: 'distance_calc',
        title: 'Distance Formula',
        desc: 'Euclidean distance between two 2D points (x₁, y₁) and (x₂, y₂)',
        latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
        template: 'sqrt((x2 - x1)^2 + (y2 - y1)^2)',
        vars: [
          { id: 'x1', label: 'Point 1: x₁', default: 1, type: 'number' },
          { id: 'y1', label: 'Point 1: y₁', default: 2, type: 'number' },
          { id: 'x2', label: 'Point 2: x₂', default: 7, type: 'number' },
          { id: 'y2', label: 'Point 2: y₂', default: 10, type: 'number' }
        ],
        compute(v) {
          const x1 = parseFloat(v.x1), y1 = parseFloat(v.y1);
          const x2 = parseFloat(v.x2), y2 = parseFloat(v.y2);
          const dx = x2 - x1;
          const dy = y2 - y1;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          const cleanDist = Number.isInteger(dist) ? dist : parseFloat(dist.toFixed(4));
          const inter = [
            { title: "Coordinate Differences", expression: `\\Delta x = ${x2} - ${x1} = ${dx}, \\quad \\Delta y = ${y2} - ${y1} = ${dy}`, note: "Horizontal and vertical displacements" },
            { title: "Sum of Squares", expression: `(\\Delta x)^2 + (\\Delta y)^2 = (${dx})^2 + (${dy})^2 = ${dx*dx} + ${dy*dy} = ${distSq}`, note: "Pythagorean metric" },
            { title: "Square Root", expression: `d = \\sqrt{${distSq}} = ${cleanDist}`, note: "Exact Euclidean distance" }
          ];
          return {
            formulaStatement: { title: "Distance Formula", latex: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}" },
            givenValues: `(x_1, y_1) = (${x1}, ${y1}), \\quad (x_2, y_2) = (${x2}, ${y2})`,
            substitution: `d = \\sqrt{(${x2} - ${x1})^2 + (${y2} - ${y1})^2}`,
            intermediateSteps: inter,
            finalResult: `Distance d = ${cleanDist}`,
            answer: `Distance d = ${cleanDist}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}", note: "Distance equation" },
              { title: "Step 2: Given Values", expression: `P_1(${x1}, ${y1}), \\quad P_2(${x2}, ${y2})`, note: "Coordinates of points" },
              { title: "Step 3: Substitution", expression: `d = \\sqrt{(${x2} - ${x1})^2 + (${y2} - ${y1})^2}`, note: "Substitute into formula" },
              ...inter,
              { title: "Step 5: Final Result", expression: `d = ${cleanDist}`, note: "Distance calculated" }
            ]
          };
        }
      },
      {
        id: 'midpoint_calc',
        title: 'Midpoint Formula',
        desc: 'Find the exact central midpoint coordinate between two points',
        latex: 'M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)',
        template: '((x1 + x2)/2, (y1 + y2)/2)',
        vars: [
          { id: 'x1', label: 'Point 1: x₁', default: 2, type: 'number' },
          { id: 'y1', label: 'Point 1: y₁', default: -4, type: 'number' },
          { id: 'x2', label: 'Point 2: x₂', default: 8, type: 'number' },
          { id: 'y2', label: 'Point 2: y₂', default: 6, type: 'number' }
        ],
        compute(v) {
          const x1 = parseFloat(v.x1), y1 = parseFloat(v.y1);
          const x2 = parseFloat(v.x2), y2 = parseFloat(v.y2);
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          const cmx = Number.isInteger(mx) ? mx : parseFloat(mx.toFixed(4));
          const cmy = Number.isInteger(my) ? my : parseFloat(my.toFixed(4));
          const inter = [
            { title: "X-coordinate Average", expression: `x_m = \\frac{${x1} + ${x2}}{2} = \\frac{${x1+x2}}{2} = ${cmx}`, note: "Horizontal mean" },
            { title: "Y-coordinate Average", expression: `y_m = \\frac{${y1} + ${y2}}{2} = \\frac{${y1+y2}}{2} = ${cmy}`, note: "Vertical mean" }
          ];
          return {
            formulaStatement: { title: "Midpoint Formula", latex: "M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)" },
            givenValues: `(x_1, y_1) = (${x1}, ${y1}), \\quad (x_2, y_2) = (${x2}, ${y2})`,
            substitution: `M = \\left(\\frac{${x1} + ${x2}}{2}, \\frac{${y1} + ${y2}}{2}\\right)`,
            intermediateSteps: inter,
            finalResult: `Midpoint M = (${cmx}, ${cmy})`,
            answer: `Midpoint M = (${cmx}, ${cmy})`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)", note: "Midpoint formula" },
              { title: "Step 2: Given Values", expression: `P_1(${x1}, ${y1}), \\quad P_2(${x2}, ${y2})`, note: "Input points" },
              { title: "Step 3: Substitution", expression: `M = \\left(\\frac{${x1} + ${x2}}{2}, \\frac{${y1} + ${y2}}{2}\\right)`, note: "Substitute into formula" },
              ...inter,
              { title: "Step 5: Final Result", expression: `M = (${cmx}, ${cmy})`, note: "Midpoint determined" }
            ]
          };
        }
      },
      {
        id: 'slope_calc',
        title: 'Slope of a Line (m)',
        desc: 'Calculate line steepness ratio m = Δy / Δx and angle of inclination θ',
        latex: 'm = \\frac{y_2 - y_1}{x_2 - x_1}',
        template: '(y2 - y1) / (x2 - x1)',
        vars: [
          { id: 'x1', label: 'Point 1: x₁', default: 1, type: 'number' },
          { id: 'y1', label: 'Point 1: y₁', default: 3, type: 'number' },
          { id: 'x2', label: 'Point 2: x₂', default: 5, type: 'number' },
          { id: 'y2', label: 'Point 2: y₂', default: 11, type: 'number' }
        ],
        compute(v) {
          const x1 = parseFloat(v.x1), y1 = parseFloat(v.y1);
          const x2 = parseFloat(v.x2), y2 = parseFloat(v.y2);
          const dx = x2 - x1;
          const dy = y2 - y1;
          if (dx === 0) return { error: "Vertical line: Δx = 0, slope m is undefined (infinity)." };
          const m = dy / dx;
          const cm = Number.isInteger(m) ? m : parseFloat(m.toFixed(4));
          const angleDeg = (Math.atan(m) * 180 / Math.PI);
          const cAngle = parseFloat(angleDeg.toFixed(2));
          const inter = [
            { title: "Vertical Rise (Δy)", expression: `\\Delta y = ${y2} - ${y1} = ${dy}`, note: "Change in y" },
            { title: "Horizontal Run (Δx)", expression: `\\Delta x = ${x2} - ${x1} = ${dx}`, note: "Change in x" },
            { title: "Slope Ratio", expression: `m = \\frac{\\Delta y}{\\Delta x} = \\frac{${dy}}{${dx}} = ${cm}`, note: "Rise over run" },
            { title: "Angle of Inclination", expression: `\\theta = \\arctan(${cm}) = ${cAngle}^\\circ`, note: "Angle with positive x-axis" }
          ];
          return {
            formulaStatement: { title: "Slope of a Line", latex: "m = \\frac{y_2 - y_1}{x_2 - x_1}" },
            givenValues: `(x_1, y_1) = (${x1}, ${y1}), \\quad (x_2, y_2) = (${x2}, ${y2})`,
            substitution: `m = \\frac{${y2} - ${y1}}{${x2} - ${x1}}`,
            intermediateSteps: inter,
            finalResult: `Slope m = ${cm} (Inclination: ${cAngle}°)`,
            answer: `Slope m = ${cm}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "m = \\frac{y_2 - y_1}{x_2 - x_1}", note: "Slope equation" },
              { title: "Step 2: Given Values", expression: `P_1(${x1}, ${y1}), \\quad P_2(${x2}, ${y2})`, note: "Coordinates" },
              { title: "Step 3: Substitution", expression: `m = \\frac{${y2} - ${y1}}{${x2} - ${x1}}`, note: "Substitute inputs" },
              ...inter,
              { title: "Step 5: Final Result", expression: `m = ${cm}`, note: "Slope evaluated" }
            ]
          };
        }
      }
    ]
  },

  // ================= 10. SIMULTANEOUS LINEAR SYSTEMS (ALL 4 RULES) =================
  {
    id: 'simultaneous_systems',
    category: 'Systems',
    subCategory: 'Linear Systems',
    title: 'Simultaneous Linear Systems (4 Methods)',
    subtitle: 'Solve { a₁x + b₁y = c₁, a₂x + b₂y = c₂ } via Substitution, Elimination, Cramer\'s, or Inversion',
    latex: '\\begin{cases} a_1 x + b_1 y = c_1 \\\\ a_2 x + b_2 y = c_2 \\end{cases}',
    subFormulas: [
      {
        id: 'sim_substitution',
        title: '1. Substitution Method',
        desc: 'Isolate one variable from Eq 1 and substitute into Eq 2',
        latex: 'x = \\frac{c_1 - b_1 y}{a_1} \\implies a_2\\left(\\frac{c_1 - b_1 y}{a_1}\\right) + b_2 y = c_2',
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
            { title: "System Equations", expression: `\\begin{cases} ${a1}x + ${b1}y = ${c1} \\\\ ${a2}x + ${b2}y = ${c2} \\end{cases}`, note: "Given 2x2 linear system" },
            { title: "Isolate x in Equation 1", expression: `x = \\frac{${c1} - ${b1}y}{${a1}}`, note: "Express x in terms of y" },
            { title: "Substitute into Equation 2", expression: `${a2}\\left(\\frac{${c1} - ${b1}y}{${a1}}\\right) + (${b2})y = ${c2}`, note: "Equation in single variable y" },
            { title: "Solve for y", expression: `y = ${cy}`, note: "Combine coefficients and isolate y" },
            { title: "Back-substitute for x", expression: `x = \\frac{${c1} - (${b1})(${cy})}{${a1}} = ${cx}`, note: "Compute x" }
          ];
          return {
            formulaStatement: { title: "Substitution Method", latex: "x = \\frac{c_1 - b_1 y}{a_1} \\implies \\text{substitute into Eq 2}" },
            givenValues: `\\text{Eq 1: } ${a1}x + ${b1}y = ${c1}, \\quad \\text{Eq 2: } ${a2}x + ${b2}y = ${c2}`,
            substitution: `x = \\frac{${c1} - ${b1}y}{${a1}}`,
            intermediateSteps: inter,
            finalResult: `x = ${cx}, y = ${cy}`,
            answer: `x = ${cx}, y = ${cy}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{Substitution Method Flow}", note: "Isolate and substitute" },
              { title: "Step 2: Given Values", expression: `\\text{Eq 1: } ${a1}x + ${b1}y = ${c1}, \\quad \\text{Eq 2: } ${a2}x + ${b2}y = ${c2}`, note: "Coefficients" },
              ...inter,
              { title: "Step 5: Final Result", expression: `x = ${cx}, \\quad y = ${cy}`, note: "Unique solution verified" }
            ]
          };
        }
      },
      {
        id: 'sim_elimination',
        title: '2. Elimination Method',
        desc: 'Multiply equations by scale factors to eliminate one variable by addition or subtraction',
        latex: '(a_2 \\cdot \\text{Eq 1}) - (a_1 \\cdot \\text{Eq 2}) \\implies (a_2 b_1 - a_1 b_2)y = a_2 c_1 - a_1 c_2',
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
            { title: "Multiply Eq 1 by a₂ and Eq 2 by a₁", expression: `\\begin{cases} ${a1*a2}x + ${b1*a2}y = ${c1*a2} \\\\ ${a1*a2}x + ${b2*a1}y = ${c2*a1} \\end{cases}`, note: "Equalize x coefficients" },
            { title: "Subtract Equation 2 from Equation 1", expression: `(${b1*a2 - b2*a1})y = ${c1*a2 - c2*a1}`, note: "Eliminated variable x" },
            { title: "Solve for y", expression: `y = \\frac{${c1*a2 - c2*a1}}{${b1*a2 - b2*a1}} = ${cy}`, note: "Divide by y coefficient" },
            { title: "Solve for x via back-substitution", expression: `x = \\frac{${c1} - (${b1})(${cy})}{${a1}} = ${cx}`, note: "Substitute y into Eq 1" }
          ];
          return {
            formulaStatement: { title: "Elimination Method", latex: "a_2 \\cdot \\text{Eq}_1 - a_1 \\cdot \\text{Eq}_2 \\implies (a_2 b_1 - a_1 b_2)y = a_2 c_1 - a_1 c_2" },
            givenValues: `\\text{Eq 1: } ${a1}x + ${b1}y = ${c1}, \\quad \\text{Eq 2: } ${a2}x + ${b2}y = ${c2}`,
            substitution: `\\text{Scale by } ${a2} \\text{ and } ${a1}`,
            intermediateSteps: inter,
            finalResult: `x = ${cx}, y = ${cy}`,
            answer: `x = ${cx}, y = ${cy}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{Elimination Method Flow}", note: "Eliminate one unknown" },
              { title: "Step 2: Given Values", expression: `\\text{System: } ${a1}x + ${b1}y = ${c1}, \\quad ${a2}x + ${b2}y = ${c2}`, note: "Input linear equations" },
              ...inter,
              { title: "Step 5: Final Result", expression: `x = ${cx}, \\quad y = ${cy}`, note: "Elimination solved" }
            ]
          };
        }
      },
      {
        id: 'sim_cramer',
        title: '3. Cramer\'s Rule',
        desc: 'Solve system using determinants: x = D_x / D, y = D_y / D',
        latex: 'D = \\begin{vmatrix} a_1 & b_1 \\\\ a_2 & b_2 \\end{vmatrix}, \\quad D_x = \\begin{vmatrix} c_1 & b_1 \\\\ c_2 & b_2 \\end{vmatrix}, \\quad D_y = \\begin{vmatrix} a_1 & c_1 \\\\ a_2 & c_2 \\end{vmatrix}',
        template: 'Cramer: D = a1*b2 - a2*b1, x = Dx/D, y = Dy/D',
        vars: [
          { id: 'a1', label: 'a₁', default: 4, type: 'number' },
          { id: 'b1', label: 'b₁', default: -3, type: 'number' },
          { id: 'c1', label: 'c₁', default: 10, type: 'number' },
          { id: 'a2', label: 'a₂', default: 3, type: 'number' },
          { id: 'b2', label: 'b₂', default: 5, type: 'number' },
          { id: 'c2', label: 'c₂', default: 22, type: 'number' }
        ],
        compute(v) {
          const a1 = parseFloat(v.a1), b1 = parseFloat(v.b1), c1 = parseFloat(v.c1);
          const a2 = parseFloat(v.a2), b2 = parseFloat(v.b2), c2 = parseFloat(v.c2);
          const D = a1 * b2 - a2 * b1;
          if (Math.abs(D) < 1e-9) return { error: "Cramer's rule is inapplicable when determinant D = 0." };
          const Dx = c1 * b2 - c2 * b1;
          const Dy = a1 * c2 - a2 * c1;
          const x = Dx / D;
          const y = Dy / D;
          const cx = Number.isInteger(x) ? x : parseFloat(x.toFixed(4));
          const cy = Number.isInteger(y) ? y : parseFloat(y.toFixed(4));
          const inter = [
            { title: "Coefficient Determinant D", expression: `D = (${a1})(${b2}) - (${a2})(${b1}) = ${a1*b2} - (${a2*b1}) = ${D}`, note: "Main coefficient determinant" },
            { title: "X Determinant D_x", expression: `D_x = (${c1})(${b2}) - (${c2})(${b1}) = ${c1*b2} - (${c2*b1}) = ${Dx}`, note: "Replace column 1 with constants" },
            { title: "Y Determinant D_y", expression: `D_y = (${a1})(${c2}) - (${a2})(${c1}) = ${a1*c2} - (${a2*c1}) = ${Dy}`, note: "Replace column 2 with constants" },
            { title: "Compute Variables", expression: `x = \\frac{D_x}{D} = \\frac{${Dx}}{${D}} = ${cx}, \\quad y = \\frac{D_y}{D} = \\frac{${Dy}}{${D}} = ${cy}`, note: "Ratio of determinants" }
          ];
          return {
            formulaStatement: { title: "Cramer's Rule", latex: "x = \\frac{D_x}{D}, \\quad y = \\frac{D_y}{D}" },
            givenValues: `\\begin{pmatrix} ${a1} & ${b1} \\\\ ${a2} & ${b2} \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ${c1} \\\\ ${c2} \\end{pmatrix}`,
            substitution: `D = \\begin{vmatrix} ${a1} & ${b1} \\\\ ${a2} & ${b2} \\end{vmatrix}`,
            intermediateSteps: inter,
            finalResult: `x = ${cx}, y = ${cy}`,
            answer: `x = ${cx}, y = ${cy}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "x = \\frac{D_x}{D}, \\quad y = \\frac{D_y}{D}", note: "Cramer determinant theorem" },
              { title: "Step 2: Given Values", expression: `a_1=${a1}, b_1=${b1}, c_1=${c1}, a_2=${a2}, b_2=${b2}, c_2=${c2}`, note: "Coefficients" },
              ...inter,
              { title: "Step 5: Final Result", expression: `x = ${cx}, \\quad y = ${cy}`, note: "Cramer's rule verified" }
            ]
          };
        }
      },
      {
        id: 'sim_inversion',
        title: '4. Matrix Inversion Rule',
        desc: 'Solve matrix equation AX = B via inverse: X = A⁻¹ B = (1/det(A)) * adj(A) * B',
        latex: '\\mathbf{X} = \\mathbf{A}^{-1} \\mathbf{B} = \\frac{1}{a_1 b_2 - a_2 b_1} \\begin{pmatrix} b_2 & -b_1 \\\\ -a_2 & a_1 \\end{pmatrix} \\begin{pmatrix} c_1 \\\\ c_2 \\end{pmatrix}',
        template: 'Matrix Inversion: X = A^(-1) * B',
        vars: [
          { id: 'a1', label: 'a₁', default: 1, type: 'number' },
          { id: 'b1', label: 'b₁', default: 2, type: 'number' },
          { id: 'c1', label: 'c₁', default: 8, type: 'number' },
          { id: 'a2', label: 'a₂', default: 3, type: 'number' },
          { id: 'b2', label: 'b₂', default: -1, type: 'number' },
          { id: 'c2', label: 'c₂', default: 3, type: 'number' }
        ],
        compute(v) {
          const a1 = parseFloat(v.a1), b1 = parseFloat(v.b1), c1 = parseFloat(v.c1);
          const a2 = parseFloat(v.a2), b2 = parseFloat(v.b2), c2 = parseFloat(v.c2);
          const det = a1 * b2 - a2 * b1;
          if (Math.abs(det) < 1e-9) return { error: "Matrix is singular (det A = 0), inverse does not exist." };
          const inv11 = b2 / det, inv12 = -b1 / det;
          const inv21 = -a2 / det, inv22 = a1 / det;
          const x = inv11 * c1 + inv12 * c2;
          const y = inv21 * c1 + inv22 * c2;
          const cx = Number.isInteger(x) ? x : parseFloat(x.toFixed(4));
          const cy = Number.isInteger(y) ? y : parseFloat(y.toFixed(4));
          const inter = [
            { title: "Coefficient Matrix Determinant", expression: "\\det(A) = (" + a1 + ")(" + b2 + ") - (" + a2 + ")(" + b1 + ") = " + det, note: "Matrix invertibility condition det ≠ 0" },
            { title: "Adjugate Matrix adj(A)", expression: "\\text{adj}(A) = \\begin{pmatrix} " + b2 + " & " + (-b1) + " \\\\ " + (-a2) + " & " + a1 + " \\end{pmatrix}", note: "Transpose of cofactor matrix" },
            { title: "Inverse Matrix A⁻¹", expression: "A^{-1} = \\frac{1}{" + det + "} \\begin{pmatrix} " + b2 + " & " + (-b1) + " \\\\ " + (-a2) + " & " + a1 + " \\end{pmatrix}", note: "Scale adjugate by 1/det" },
            { title: "Matrix Multiplication X = A⁻¹ B", expression: "\\begin{pmatrix} x \\\\ y \\end{pmatrix} = A^{-1} \\begin{pmatrix} " + c1 + " \\\\ " + c2 + " \\end{pmatrix} = \\begin{pmatrix} " + cx + " \\\\ " + cy + " \\end{pmatrix}", note: "Row-by-column product" }
          ];
          return {
            formulaStatement: { title: "Matrix Inversion Formula", latex: "\\mathbf{X} = \\mathbf{A}^{-1} \\mathbf{B}" },
            givenValues: `A = \\begin{pmatrix} ${a1} & ${b1} \\\\ ${a2} & ${b2} \\end{pmatrix}, \\quad B = \\begin{pmatrix} ${c1} \\\\ ${c2} \\end{pmatrix}`,
            substitution: `\\mathbf{X} = \\frac{1}{${det}} \\begin{pmatrix} ${b2} & ${-b1} \\\\ ${-a2} & ${a1} \\end{pmatrix} \\begin{pmatrix} ${c1} \\\\ ${c2} \\end{pmatrix}`,
            intermediateSteps: inter,
            finalResult: `x = ${cx}, y = ${cy}`,
            answer: `x = ${cx}, y = ${cy}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\mathbf{X} = \\mathbf{A}^{-1} \\mathbf{B}", note: "Matrix inversion principle" },
              { title: "Step 2: Given Values", expression: `\\text{Matrix system coefficients}`, note: "Input arrays" },
              ...inter,
              { title: "Step 5: Final Result", expression: `x = ${cx}, \\quad y = ${cy}`, note: "Matrix inversion completed" }
            ]
          };
        }
      }
    ]
  },

  // ================= 11. SEQUENCES & SERIES =================
  {
    id: 'sequences_series',
    category: 'Sequences',
    subCategory: 'Sequences & Series',
    title: 'Sequences & Series',
    subtitle: 'Arithmetic & Geometric Sequences (n-th terms and partial sums)',
    latex: 'a_n = a_1 + (n-1)d, \\quad S_n = \\frac{n}{2}(2a_1 + (n-1)d), \\quad g_n = a_1 r^{n-1}, \\quad S_{n(geom)} = a_1 \\frac{1 - r^n}{1 - r}',
    subFormulas: [
      {
        id: 'arith_nth_term',
        title: 'Arithmetic Sequence (n-th Term)',
        desc: 'Calculate the n-th term of an arithmetic progression: aₙ = a₁ + (n - 1)d',
        latex: 'a_n = a_1 + (n - 1)d',
        template: 'a1 + (n - 1)*d',
        vars: [
          { id: 'a1', label: 'First Term (a₁)', default: 3, type: 'number' },
          { id: 'd', label: 'Common Difference (d)', default: 5, type: 'number' },
          { id: 'n', label: 'Term Number (n)', default: 20, type: 'number' }
        ],
        compute(v) {
          const a1 = parseFloat(v.a1);
          const d = parseFloat(v.d);
          const n = parseInt(v.n, 10);
          if (n < 1) return { error: "Term index n must be a positive integer (n ≥ 1)." };
          const an = a1 + (n - 1) * d;
          const inter = [
            { title: "Term Difference Multiplier", expression: `n - 1 = ${n} - 1 = ${n - 1}`, note: "Number of common difference steps" },
            { title: "Difference Addition", expression: `(n - 1)d = (${n - 1}) \\times ${d} = ${(n - 1) * d}`, note: "Cumulative difference" },
            { title: "Sum with Initial Term", expression: `a_{${n}} = ${a1} + ${(n - 1) * d} = ${an}`, note: "Final term value" }
          ];
          return {
            formulaStatement: { title: "Arithmetic Sequence n-th Term", latex: "a_n = a_1 + (n - 1)d" },
            givenValues: `a_1 = ${a1}, \\quad d = ${d}, \\quad n = ${n}`,
            substitution: `a_{${n}} = ${a1} + (${n} - 1)(${d})`,
            intermediateSteps: inter,
            finalResult: `a_${n} = ${an}`,
            answer: `a_${n} = ${an}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "a_n = a_1 + (n - 1)d", note: "AP term formula" },
              { title: "Step 2: Given Values", expression: `a_1 = ${a1}, \\quad d = ${d}, \\quad n = ${n}`, note: "Parameters" },
              { title: "Step 3: Substitution", expression: `a_{${n}} = ${a1} + (${n}-1)(${d})`, note: "Insert into formula" },
              ...inter,
              { title: "Step 5: Final Result", expression: `a_{${n}} = ${an}`, note: "Term determined" }
            ]
          };
        }
      },
      {
        id: 'arith_sum',
        title: 'Arithmetic Series Sum (Sₙ)',
        desc: 'Calculate the sum of the first n terms: Sₙ = n/2 · [2a₁ + (n - 1)d]',
        latex: 'S_n = \\frac{n}{2}\\left(2a_1 + (n - 1)d\\right)',
        template: '(n / 2) * (2*a1 + (n - 1)*d)',
        vars: [
          { id: 'a1', label: 'First Term (a₁)', default: 2, type: 'number' },
          { id: 'd', label: 'Common Difference (d)', default: 4, type: 'number' },
          { id: 'n', label: 'Number of Terms (n)', default: 15, type: 'number' }
        ],
        compute(v) {
          const a1 = parseFloat(v.a1);
          const d = parseFloat(v.d);
          const n = parseInt(v.n, 10);
          if (n < 1) return { error: "Term count n must be at least 1." };
          const inside = 2 * a1 + (n - 1) * d;
          const sn = (n / 2) * inside;
          const inter = [
            { title: "Inside Bracket Term", expression: `2a_1 + (n - 1)d = 2(${a1}) + (${n - 1})(${d}) = ${2 * a1} + ${(n - 1) * d} = ${inside}`, note: "Average factor" },
            { title: "Multiply by n/2", expression: `S_{${n}} = \\frac{${n}}{2} \\times ${inside} = ${n / 2} \\times ${inside} = ${sn}`, note: "Cumulative sum" }
          ];
          return {
            formulaStatement: { title: "Arithmetic Series Sum", latex: "S_n = \\frac{n}{2}(2a_1 + (n - 1)d)" },
            givenValues: `a_1 = ${a1}, \\quad d = ${d}, \\quad n = ${n}`,
            substitution: `S_{${n}} = \\frac{${n}}{2}\\left(2(${a1}) + (${n} - 1)(${d})\\right)`,
            intermediateSteps: inter,
            finalResult: `S_${n} = ${sn}`,
            answer: `S_${n} = ${sn}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "S_n = \\frac{n}{2}(2a_1 + (n - 1)d)", note: "AP sum formula" },
              { title: "Step 2: Given Values", expression: `a_1 = ${a1}, \\quad d = ${d}, \\quad n = ${n}`, note: "Input parameters" },
              { title: "Step 3: Substitution", expression: `S_{${n}} = \\frac{${n}}{2}(2(${a1}) + (${n}-1)(${d}))`, note: "Substitute into equation" },
              ...inter,
              { title: "Step 5: Final Result", expression: `S_{${n}} = ${sn}`, note: "Series sum computed" }
            ]
          };
        }
      },
      {
        id: 'geom_nth_term',
        title: 'Geometric Sequence (n-th Term)',
        desc: 'Calculate the n-th term of a geometric progression: gₙ = a₁ · rⁿ⁻¹',
        latex: 'g_n = a_1 \\cdot r^{n - 1}',
        template: 'a1 * r^(n - 1)',
        vars: [
          { id: 'a1', label: 'First Term (a₁)', default: 3, type: 'number' },
          { id: 'r', label: 'Common Ratio (r)', default: 2, type: 'number' },
          { id: 'n', label: 'Term Number (n)', default: 6, type: 'number' }
        ],
        compute(v) {
          const a1 = parseFloat(v.a1);
          const r = parseFloat(v.r);
          const n = parseInt(v.n, 10);
          if (n < 1) return { error: "Term index n must be ≥ 1." };
          const p = n - 1;
          const rPow = Math.pow(r, p);
          const gn = a1 * rPow;
          const inter = [
            { title: "Exponent", expression: `n - 1 = ${n} - 1 = ${p}`, note: "Ratio power index" },
            { title: "Ratio Raised to Power", expression: `r^{${p}} = (${r})^{${p}} = ${rPow}`, note: "Geometric multiplier" },
            { title: "Multiply with a₁", expression: `g_{${n}} = ${a1} \\times ${rPow} = ${gn}`, note: "Final n-th term" }
          ];
          return {
            formulaStatement: { title: "Geometric Sequence n-th Term", latex: "g_n = a_1 \\cdot r^{n - 1}" },
            givenValues: `a_1 = ${a1}, \\quad r = ${r}, \\quad n = ${n}`,
            substitution: `g_{${n}} = ${a1} \\cdot (${r})^{${n} - 1}`,
            intermediateSteps: inter,
            finalResult: `g_${n} = ${gn}`,
            answer: `g_${n} = ${gn}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "g_n = a_1 \\cdot r^{n-1}", note: "GP term formula" },
              { title: "Step 2: Given Values", expression: `a_1 = ${a1}, \\quad r = ${r}, \\quad n = ${n}`, note: "Parameters" },
              { title: "Step 3: Substitution", expression: `g_{${n}} = ${a1} \\cdot (${r})^{${n-1}}`, note: "Substitute into equation" },
              ...inter,
              { title: "Step 5: Final Result", expression: `g_{${n}} = ${gn}`, note: "Geometric term evaluated" }
            ]
          };
        }
      },
      {
        id: 'geom_sum',
        title: 'Geometric Series Sum (Sₙ)',
        desc: 'Calculate partial sum of first n terms: Sₙ = a₁ · (1 - rⁿ) / (1 - r)',
        latex: 'S_n = a_1 \\frac{1 - r^n}{1 - r} \\quad (r \\neq 1)',
        template: 'a1 * (1 - r^n) / (1 - r)',
        vars: [
          { id: 'a1', label: 'First Term (a₁)', default: 4, type: 'number' },
          { id: 'r', label: 'Common Ratio (r)', default: 3, type: 'number' },
          { id: 'n', label: 'Number of Terms (n)', default: 5, type: 'number' }
        ],
        compute(v) {
          const a1 = parseFloat(v.a1);
          const r = parseFloat(v.r);
          const n = parseInt(v.n, 10);
          if (n < 1) return { error: "n must be ≥ 1." };
          if (r === 1) {
            const sn = a1 * n;
            return {
              formulaStatement: { title: "Geometric Series Sum (r = 1)", latex: "S_n = n \\cdot a_1" },
              givenValues: `a_1 = ${a1}, \\quad r = 1, \\quad n = ${n}`,
              substitution: `S_{${n}} = ${n} \\times ${a1}`,
              intermediateSteps: [{ title: "Constant Terms", expression: `${n} \\times ${a1} = ${sn}`, note: "All terms equal a₁" }],
              finalResult: `S_${n} = ${sn}`,
              answer: `S_${n} = ${sn}`,
              steps: [{ title: "Constant GP", expression: `S_{${n}} = ${sn}`, note: "For r = 1" }]
            };
          }
          const rn = Math.pow(r, n);
          const sn = a1 * (1 - rn) / (1 - r);
          const csn = Number.isInteger(sn) ? sn : parseFloat(sn.toFixed(4));
          const inter = [
            { title: "Ratio to n-th Power", expression: `r^n = (${r})^{${n}} = ${rn}`, note: "Exponential power" },
            { title: "Numerator & Denominator", expression: `1 - r^n = 1 - ${rn} = ${1 - rn}, \\quad 1 - r = 1 - ${r} = ${1 - r}`, note: "Difference fractions" },
            { title: "Evaluate Sum", expression: `S_{${n}} = ${a1} \\times \\frac{${1 - rn}}{${1 - r}} = ${csn}`, note: "Completed sum" }
          ];
          return {
            formulaStatement: { title: "Geometric Series Sum", latex: "S_n = a_1 \\frac{1 - r^n}{1 - r}" },
            givenValues: `a_1 = ${a1}, \\quad r = ${r}, \\quad n = ${n}`,
            substitution: `S_{${n}} = ${a1} \\frac{1 - (${r})^{${n}}}{1 - ${r}}`,
            intermediateSteps: inter,
            finalResult: `S_${n} = ${csn}`,
            answer: `S_${n} = ${csn}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "S_n = a_1 \\frac{1 - r^n}{1 - r}", note: "GP sum formula" },
              { title: "Step 2: Given Values", expression: `a_1 = ${a1}, \\quad r = ${r}, \\quad n = ${n}`, note: "Parameters" },
              { title: "Step 3: Substitution", expression: `S_{${n}} = ${a1} \\frac{1 - (${r})^{${n}}}{1 - ${r}}`, note: "Substitute into equation" },
              ...inter,
              { title: "Step 5: Final Result", expression: `S_{${n}} = ${csn}`, note: "Sum determined" }
            ]
          };
        }
      }
    ]
  },

  // ================= 12. POLYNOMIALS & FACTORIZATION =================
  {
    id: 'polynomials_factoring',
    category: 'Polynomials',
    subCategory: 'Polynomials & Factoring',
    title: 'Polynomials & Factoring',
    subtitle: 'Degree, Leading Coefficients, Difference of Squares, and Trinomial Factoring',
    latex: 'P(x) = a_n x^n + \\dots + a_0, \\quad a^2 - b^2 = (a-b)(a+b), \\quad x^2 + (p+q)x + pq = (x+p)(x+q)',
    subFormulas: [
      {
        id: 'poly_degree_coef',
        title: 'Polynomial Degree & Coefficients',
        desc: 'Extract degree, leading coefficient, and all polynomial coefficients',
        latex: 'P(x) = a_n x^n + a_{n-1} x^{n-1} + \\dots + a_1 x + a_0',
        template: 'Degree of polynomial',
        vars: [
          { id: 'expr', label: 'Polynomial Expression', default: '4x^5 - 7x^3 + 2x - 9', type: 'text' }
        ],
        compute(v) {
          const raw = (v.expr || '').trim();
          if (!raw) return { error: "Please enter a polynomial expression." };
          try {
            const clean = raw.replace(/\s+/g, '').replace(/-/g, '+-');
            const terms = clean.split('+').filter(Boolean);
            let maxDeg = 0;
            let leadCoef = 1;
            const coefs = [];
            for (const t of terms) {
              const m = t.match(/^([+-]?\d*(?:\.\d+)?)?x(?:\^(\d+))?$/);
              if (m) {
                const c = m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : parseFloat(m[1]);
                const p = m[2] ? parseInt(m[2], 10) : 1;
                coefs.push({ power: p, coef: c });
                if (p > maxDeg) { maxDeg = p; leadCoef = c; }
              } else if (!isNaN(parseFloat(t))) {
                coefs.push({ power: 0, coef: parseFloat(t) });
              }
            }
            const inter = [
              { title: "Parsed Terms", expression: terms.join(', '), note: "Identified polynomial mononomials" },
              { title: "Highest Exponent (Degree)", expression: `\\text{Degree} = ${maxDeg}`, note: "Maximum variable power" },
              { title: "Leading Coefficient", expression: `a_{${maxDeg}} = ${leadCoef}`, note: "Coefficient of highest degree term" }
            ];
            return {
              formulaStatement: { title: "Standard Polynomial Form", latex: "P(x) = a_n x^n + a_{n-1} x^{n-1} + \\dots + a_0" },
              givenValues: `P(x) = ${raw}`,
              substitution: `\\text{Degree: } ${maxDeg}, \\quad \\text{Lead Coef: } ${leadCoef}`,
              intermediateSteps: inter,
              finalResult: `Degree = ${maxDeg}, Leading Coeff = ${leadCoef}`,
              answer: `Degree: ${maxDeg}, Leading Coeff: ${leadCoef}`,
              steps: [
                { title: "Step 1: Formula Statement", expression: "P(x) = \\sum_{i=0}^n a_i x^i", note: "Canonical polynomial form" },
                { title: "Step 2: Given Values", expression: `P(x) = ${raw}`, note: "Input polynomial" },
                ...inter,
                { title: "Step 5: Final Result", expression: `\\text{Degree: } ${maxDeg}, \\quad \\text{Leading Coeff: } ${leadCoef}`, note: "Classification complete" }
              ]
            };
          } catch (e) {
            return { error: "Unable to parse polynomial: " + e.message };
          }
        }
      },
      {
        id: 'diff_of_squares',
        title: 'Difference of Squares Identity',
        desc: 'Factorize a² - b² = (a - b)(a + b)',
        latex: 'a^2 - b^2 = (a - b)(a + b)',
        template: 'a^2 - b^2 = (a - b)(a + b)',
        vars: [
          { id: 'a', label: 'First Base (a)', default: 9, type: 'number' },
          { id: 'b', label: 'Second Base (b)', default: 4, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          const a2 = a * a;
          const b2 = b * b;
          const diff = a2 - b2;
          const sub = a - b;
          const add = a + b;
          const inter = [
            { title: "Squared Quantities", expression: `a^2 = (${a})^2 = ${a2}, \\quad b^2 = (${b})^2 = ${b2}`, note: "Squares" },
            { title: "Factor Forms", expression: `(a - b) = (${a} - ${b}) = ${sub}, \\quad (a + b) = (${a} + ${b}) = ${add}`, note: "Conjugate linear factors" },
            { title: "Product Verification", expression: `(${sub})(${add}) = ${sub * add}`, note: "Product matches a² - b²" }
          ];
          return {
            formulaStatement: { title: "Difference of Squares Identity", latex: "a^2 - b^2 = (a - b)(a + b)" },
            givenValues: `a = ${a}, \\quad b = ${b}`,
            substitution: `${a}^2 - ${b}^2 = (${a} - ${b})(${a} + ${b})`,
            intermediateSteps: inter,
            finalResult: `${a2} - ${b2} = (${sub})(${add}) = ${diff}`,
            answer: `(${a} - ${b})(${a} + ${b}) = (${sub})(${add})`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "a^2 - b^2 = (a - b)(a + b)", note: "Algebraic identity" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad b = ${b}`, note: "Terms" },
              { title: "Step 3: Substitution", expression: `${a}^2 - ${b}^2 = (${a} - ${b})(${a} + ${b})`, note: "Plug in" },
              ...inter,
              { title: "Step 5: Final Result", expression: `${diff} = (${sub})(${add})`, note: "Factorization complete" }
            ]
          };
        }
      },
      {
        id: 'trinomial_factor',
        title: 'Factoring Quadratic Trinomials',
        desc: 'Factorize x² + Bx + C into (x + p)(x + q) where p · q = C and p + q = B',
        latex: 'x^2 + Bx + C = (x + p)(x + q) \\quad \\text{with } p+q=B, \\ pq=C',
        template: 'x^2 + Bx + C',
        vars: [
          { id: 'B', label: 'Coefficient B (Sum)', default: 7, type: 'number' },
          { id: 'C', label: 'Constant C (Product)', default: 12, type: 'number' }
        ],
        compute(v) {
          const B = parseFloat(v.B);
          const C = parseFloat(v.C);
          const disc = B * B - 4 * C;
          if (disc < 0) return { error: "Trinomial cannot be factored into real linear factors (Δ < 0)." };
          const sq = Math.sqrt(disc);
          if (!Number.isInteger(sq)) return { error: `Discriminant √Δ = √${disc} is not an integer. Not factorable into rational binomials.` };
          const p = (B + sq) / 2;
          const q = (B - sq) / 2;
          const signP = p >= 0 ? `+ ${p}` : `- ${Math.abs(p)}`;
          const signQ = q >= 0 ? `+ ${q}` : `- ${Math.abs(q)}`;
          const factored = `(x ${signP})(x ${signQ})`;
          const inter = [
            { title: "Target Sum and Product", expression: `p + q = ${B}, \\quad p \\cdot q = ${C}`, note: "Find integers p and q" },
            { title: "Found Factors", expression: `p = ${p}, \\quad q = ${q}`, note: `${p} + ${q} = ${B} \\text{ and } ${p} \\times ${q} = ${C}` }
          ];
          return {
            formulaStatement: { title: "Quadratic Trinomial Factoring", latex: "x^2 + Bx + C = (x + p)(x + q)" },
            givenValues: `B = ${B}, \\quad C = ${C}`,
            substitution: `x^2 + (${B})x + (${C})`,
            intermediateSteps: inter,
            finalResult: factored,
            answer: factored,
            steps: [
              { title: "Step 1: Formula Statement", expression: "x^2 + Bx + C = (x + p)(x + q)", note: "Monic trinomial factoring" },
              { title: "Step 2: Given Values", expression: `B = ${B}, \\quad C = ${C}`, note: "Sum and product" },
              ...inter,
              { title: "Step 5: Final Result", expression: `x^2 + ${B}x + ${C} = ${factored}`, note: "Factoring verified" }
            ]
          };
        }
      }
    ]
  },

  // ================= 13. THEOREMS & SET THEORY =================
  {
    id: 'theorems_sets',
    category: 'Theorems',
    subCategory: 'Theorems & Sets',
    title: 'Theorems & Set Theory',
    subtitle: 'Pythagorean Theorem and De Morgan\'s Laws of Sets',
    latex: 'a^2 + b^2 = c^2, \\quad (A \\cup B)\' = A\' \\cap B\', \\quad (A \\cap B)\' = A\' \\cup B\'',
    subFormulas: [
      {
        id: 'pythagorean_theorem',
        title: 'Pythagorean Theorem',
        desc: 'For right triangle with legs a, b and hypotenuse c: a² + b² = c²',
        latex: 'c = \\sqrt{a^2 + b^2}, \\quad a = \\sqrt{c^2 - b^2}',
        template: 'c = sqrt(a^2 + b^2)',
        vars: [
          { id: 'a', label: 'Leg a', default: 3, type: 'number' },
          { id: 'b', label: 'Leg b', default: 4, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          if (a <= 0 || b <= 0) return { error: "Leg lengths must be positive." };
          const c2 = a * a + b * b;
          const c = Math.sqrt(c2);
          const cc = Number.isInteger(c) ? c : parseFloat(c.toFixed(4));
          const inter = [
            { title: "Sum of Squared Legs", expression: `a^2 + b^2 = (${a})^2 + (${b})^2 = ${a*a} + ${b*b} = ${c2}`, note: "Pythagorean relation" },
            { title: "Square Root for Hypotenuse", expression: `c = \\sqrt{${c2}} = ${cc}`, note: "Longest side of right triangle" }
          ];
          return {
            formulaStatement: { title: "Pythagorean Theorem", latex: "c = \\sqrt{a^2 + b^2}" },
            givenValues: `a = ${a}, \\quad b = ${b}`,
            substitution: `c = \\sqrt{(${a})^2 + (${b})^2}`,
            intermediateSteps: inter,
            finalResult: `Hypotenuse c = ${cc}`,
            answer: `Hypotenuse c = ${cc}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "a^2 + b^2 = c^2", note: "Pythagorean right triangle theorem" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad b = ${b}`, note: "Perpendicular leg lengths" },
              { title: "Step 3: Substitution", expression: `c = \\sqrt{${a}^2 + ${b}^2}`, note: "Plug in" },
              ...inter,
              { title: "Step 5: Final Result", expression: `c = ${cc}`, note: "Hypotenuse determined" }
            ]
          };
        }
      },
      {
        id: 'demorgan_union',
        title: 'De Morgan\'s Law (Union Complement)',
        desc: 'The complement of the union equals the intersection of complements: (A ∪ B)′ = A′ ∩ B′',
        latex: '(A \\cup B)\' = A\' \\cap B\'',
        template: '(A U B)\' = A\' ∩ B\'',
        vars: [
          { id: 'setU', label: 'Universal Set U (comma-separated)', default: '1, 2, 3, 4, 5, 6, 7, 8', type: 'text' },
          { id: 'setA', label: 'Set A', default: '2, 4, 6, 8', type: 'text' },
          { id: 'setB', label: 'Set B', default: '1, 2, 3, 4', type: 'text' }
        ],
        compute(v) {
          const parseS = str => Array.from(new Set(str.split(',').map(s => s.trim()).filter(Boolean)));
          const U = parseS(v.setU);
          const A = parseS(v.setA);
          const B = parseS(v.setB);
          const unionAB = Array.from(new Set([...A, ...B])).sort();
          const compUnion = U.filter(x => !unionAB.includes(x)).sort();
          const compA = U.filter(x => !A.includes(x));
          const compB = U.filter(x => !B.includes(x));
          const interComp = compA.filter(x => compB.includes(x)).sort();
          const verified = JSON.stringify(compUnion) === JSON.stringify(interComp);
          const inter = [
            { title: "Union (A ∪ B)", expression: `A \\cup B = \\{${unionAB.join(', ')}\\}`, note: "Combined elements" },
            { title: "LHS: Complement (A ∪ B)′", expression: `(A \\cup B)\' = \\{${compUnion.join(', ')}\\}`, note: "Elements in U but not in A ∪ B" },
            { title: "RHS: Complements A′ and B′", expression: `A\' = \\{${compA.sort().join(', ')}\\}, \\quad B\' = \\{${compB.sort().join(', ')}\\}`, note: "Individual complements" },
            { title: "Intersection A′ ∩ B′", expression: `A\' \\cap B\' = \\{${interComp.join(', ')}\\}`, note: "Common elements of complements" }
          ];
          return {
            formulaStatement: { title: "De Morgan's Union Law", latex: "(A \\cup B)\' = A\' \\cap B\'" },
            givenValues: `U = \\{${U.join(', ')}\\}, \\ A = \\{${A.join(', ')}\\}, \\ B = \\{${B.join(', ')}\\}`,
            substitution: `(A \\cup B)\' = A\' \\cap B\'`,
            intermediateSteps: inter,
            finalResult: `(A ∪ B)′ = A′ ∩ B′ = {${compUnion.join(', ')}} [Verified: ${verified}]`,
            answer: `{${compUnion.join(', ')}}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "(A \\cup B)\' = A\' \\cap B\'", note: "De Morgan's first set law" },
              { title: "Step 2: Given Values", expression: `Set sizes: |U|=${U.length}, |A|=${A.length}, |B|=${B.length}`, note: "Input sets" },
              ...inter,
              { title: "Step 5: Final Result", expression: `(A \\cup B)\' = A\' \\cap B\' = \\{${compUnion.join(', ')}\\}`, note: "Identity verified" }
            ]
          };
        }
      },
      {
        id: 'demorgan_inter',
        title: 'De Morgan\'s Law (Intersection Complement)',
        desc: 'The complement of the intersection equals the union of complements: (A ∩ B)′ = A′ ∪ B′',
        latex: '(A \\cap B)\' = A\' \\cup B\'',
        template: '(A ∩ B)\' = A\' U B\'',
        vars: [
          { id: 'setU', label: 'Universal Set U (comma-separated)', default: '1, 2, 3, 4, 5, 6, 7, 8', type: 'text' },
          { id: 'setA', label: 'Set A', default: '2, 3, 5, 7', type: 'text' },
          { id: 'setB', label: 'Set B', default: '3, 4, 5, 6', type: 'text' }
        ],
        compute(v) {
          const parseS = str => Array.from(new Set(str.split(',').map(s => s.trim()).filter(Boolean)));
          const U = parseS(v.setU);
          const A = parseS(v.setA);
          const B = parseS(v.setB);
          const interAB = A.filter(x => B.includes(x)).sort();
          const compInter = U.filter(x => !interAB.includes(x)).sort();
          const compA = U.filter(x => !A.includes(x));
          const compB = U.filter(x => !B.includes(x));
          const unionComp = Array.from(new Set([...compA, ...compB])).sort();
          const verified = JSON.stringify(compInter) === JSON.stringify(unionComp);
          const inter = [
            { title: "Intersection (A ∩ B)", expression: `A \\cap B = \\{${interAB.join(', ')}\\}`, note: "Common elements" },
            { title: "LHS: (A ∩ B)′", expression: `(A \\cap B)\' = \\{${compInter.join(', ')}\\}`, note: "Elements in U but not in A ∩ B" },
            { title: "RHS: Complements A′ and B′", expression: `A\' = \\{${compA.sort().join(', ')}\\}, \\quad B\' = \\{${compB.sort().join(', ')}\\}`, note: "Complements" },
            { title: "Union A′ ∪ B′", expression: `A\' \\cup B\' = \\{${unionComp.join(', ')}\\}`, note: "Union of complements" }
          ];
          return {
            formulaStatement: { title: "De Morgan's Intersection Law", latex: "(A \\cap B)\' = A\' \\cup B\'" },
            givenValues: `U = \\{${U.join(', ')}\\}, \\ A = \\{${A.join(', ')}\\}, \\ B = \\{${B.join(', ')}\\}`,
            substitution: `(A \\cap B)\' = A\' \\cup B\'`,
            intermediateSteps: inter,
            finalResult: `(A ∩ B)′ = A′ ∪ B′ = {${compInter.join(', ')}} [Verified: ${verified}]`,
            answer: `{${compInter.join(', ')}}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "(A \\cap B)\' = A\' \\cup B\'", note: "De Morgan's second set law" },
              { title: "Step 2: Given Values", expression: `Set sizes: |U|=${U.length}, |A|=${A.length}, |B|=${B.length}`, note: "Input sets" },
              ...inter,
              { title: "Step 5: Final Result", expression: `(A \\cap B)\' = A\' \\cup B\' = \\{${compInter.join(', ')}\\}`, note: "Identity verified" }
            ]
          };
        }
      }
    ]
  }
];
