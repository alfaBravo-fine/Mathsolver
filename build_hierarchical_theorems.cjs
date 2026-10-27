const fs = require('fs');

const THEOREM_GROUPS = [
  // 1. Geometry: Pythagorean Theorem & Metric Geometry
  {
    id: 'theorems_pythagorean',
    category: 'Theorems',
    subCategory: 'Geometry',
    title: 'Pythagorean Theorem & Metric Geometry',
    subtitle: 'Fundamental orthogonal metric relations: Hypotenuse, Legs, 3D Distance, and Integer Triples',
    latex: 'a^2 + b^2 = c^2, \\quad d = \\sqrt{\\Delta x^2 + \\Delta y^2 + \\Delta z^2}',
    subFormulas: [
      {
        id: 'thm_pythagoras_hypot',
        title: '1. Hypotenuse Calculator (c)',
        desc: 'Calculate hypotenuse c given perpendicular legs a and b: c = √(a² + b²)',
        latex: 'c = \\sqrt{a^2 + b^2}',
        template: 'sqrt(a^2 + b^2)',
        vars: [
          { id: 'a', label: 'Leg a', default: 3, type: 'number' },
          { id: 'b', label: 'Leg b', default: 4, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b);
          if (a <= 0 || b <= 0) return { error: "Leg lengths must be strictly positive." };
          const aSq = a * a, bSq = b * b, cSq = aSq + bSq, c = Math.sqrt(cSq);
          const cleanC = parseFloat(c.toFixed(4));
          return {
            formulaStatement: { title: "Pythagorean Theorem", latex: "c = \\sqrt{a^2 + b^2}" },
            givenValues: `a = ${a}, \\quad b = ${b}`,
            substitution: `c = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${aSq} + ${bSq}} = \\sqrt{${cSq}}`,
            intermediateSteps: [
              { title: "Square Both Legs", expression: `${a}^2 = ${aSq}, \\quad ${b}^2 = ${bSq}`, note: "Orthogonal leg squares" },
              { title: "Sum of Squares", expression: `${aSq} + ${bSq} = ${cSq}`, note: "Square of hypotenuse c²" },
              { title: "Principal Square Root", expression: `c = \\sqrt{${cSq}} = ${cleanC}`, note: "Hypotenuse length" }
            ],
            finalResult: `c = ${cleanC}`,
            answer: `c = ${cleanC}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "c = \\sqrt{a^2 + b^2}", note: "Hypotenuse formula" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\; b = ${b}`, note: "Known leg measurements" },
              { title: "Step 3: Substitution", expression: `c = \\sqrt{${aSq} + ${bSq}}`, note: "Substitute into equation" },
              { title: "Step 4: Radical Resolution", expression: `c = \\sqrt{${cSq}} = ${cleanC}`, note: "Square root calculation" },
              { title: "Step 5: Final Result", expression: `c = ${cleanC}`, note: "Hypotenuse verified" }
            ]
          };
        }
      },
      {
        id: 'thm_pythagoras_leg',
        title: '2. Unknown Leg Calculator (a)',
        desc: 'Calculate perpendicular leg a given hypotenuse c and other leg b: a = √(c² - b²)',
        latex: 'a = \\sqrt{c^2 - b^2}',
        template: 'sqrt(c^2 - b^2)',
        vars: [
          { id: 'c', label: 'Hypotenuse c', default: 13, type: 'number' },
          { id: 'b', label: 'Known Leg b', default: 12, type: 'number' }
        ],
        compute(v) {
          const c = parseFloat(v.c), b = parseFloat(v.b);
          if (c <= b || b <= 0) return { error: "Hypotenuse c must be strictly greater than leg b." };
          const cSq = c * c, bSq = b * b, aSq = cSq - bSq, a = Math.sqrt(aSq);
          const cleanA = parseFloat(a.toFixed(4));
          return {
            formulaStatement: { title: "Pythagorean Leg Formula", latex: "a = \\sqrt{c^2 - b^2}" },
            givenValues: `c = ${c}, \\quad b = ${b}`,
            substitution: `a = \\sqrt{${c}^2 - ${b}^2} = \\sqrt{${cSq} - ${bSq}} = \\sqrt{${aSq}}`,
            intermediateSteps: [
              { title: "Square Known Dimensions", expression: `c^2 = ${cSq}, \\quad b^2 = ${bSq}`, note: "Dimensions squared" },
              { title: "Subtract Squares", expression: `${cSq} - ${bSq} = ${aSq}`, note: "Difference of squares" },
              { title: "Take Square Root", expression: `a = \\sqrt{${aSq}} = ${cleanA}`, note: "Unknown leg length" }
            ],
            finalResult: `a = ${cleanA}`,
            answer: `a = ${cleanA}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "a = \\sqrt{c^2 - b^2}", note: "Leg isolation formula" },
              { title: "Step 2: Given Values", expression: `c = ${c}, \\; b = ${b}`, note: "Known sides" },
              { title: "Step 3: Substitution", expression: `a = \\sqrt{${cSq} - ${bSq}}`, note: "Compute difference" },
              { title: "Step 4: Radical Resolution", expression: `a = \\sqrt{${aSq}} = ${cleanA}`, note: "Square root" },
              { title: "Step 5: Final Result", expression: `a = ${cleanA}`, note: "Leg measurement confirmed" }
            ]
          };
        }
      },
      {
        id: 'thm_pythagoras_distance_3d',
        title: '3. 3D Euclidean Distance',
        desc: 'Distance between two points (x₁, y₁, z₁) and (x₂, y₂, z₂) in 3D Euclidean space',
        latex: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2 + (z_2 - z_1)^2}',
        template: 'sqrt((x2-x1)^2 + (y2-y1)^2 + (z2-z1)^2)',
        vars: [
          { id: 'dx', label: 'Δx (x₂ - x₁)', default: 3, type: 'number' },
          { id: 'dy', label: 'Δy (y₂ - y₁)', default: 4, type: 'number' },
          { id: 'dz', label: 'Δz (z₂ - z₁)', default: 12, type: 'number' }
        ],
        compute(v) {
          const dx = parseFloat(v.dx), dy = parseFloat(v.dy), dz = parseFloat(v.dz);
          const sumSq = dx * dx + dy * dy + dz * dz;
          const d = Math.sqrt(sumSq);
          const cleanD = parseFloat(d.toFixed(4));
          return {
            formulaStatement: { title: "3D Euclidean Distance", latex: "d = \\sqrt{\\Delta x^2 + \\Delta y^2 + \\Delta z^2}" },
            givenValues: `\\Delta x = ${dx}, \\quad \\Delta y = ${dy}, \\quad \\Delta z = ${dz}`,
            substitution: `d = \\sqrt{(${dx})^2 + (${dy})^2 + (${dz})^2} = \\sqrt{${dx*dx} + ${dy*dy} + ${dz*dz}} = \\sqrt{${sumSq}}`,
            intermediateSteps: [
              { title: "Square Coordinate Displacements", expression: `(\\Delta x)^2 = ${dx*dx}, \\; (\\Delta y)^2 = ${dy*dy}, \\; (\\Delta z)^2 = ${dz*dz}`, note: "3D coordinate squares" },
              { title: "Sum Coordinate Squares", expression: `${dx*dx} + ${dy*dy} + ${dz*dz} = ${sumSq}`, note: "Total squared distance" },
              { title: "Evaluate Euclidean Metric", expression: `d = \\sqrt{${sumSq}} = ${cleanD}`, note: "Spatial distance" }
            ],
            finalResult: `d = ${cleanD}`,
            answer: `d = ${cleanD}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "d = \\sqrt{\\Delta x^2 + \\Delta y^2 + \\Delta z^2}", note: "3D distance metric" },
              { title: "Step 2: Given Coordinates", expression: `\\Delta x=${dx}, \\Delta y=${dy}, \\Delta z=${dz}`, note: "Coordinate offsets" },
              { title: "Step 3: Substitution", expression: `d = \\sqrt{${sumSq}}`, note: "Sum of squares" },
              { title: "Step 4: Radical Value", expression: `d = ${cleanD}`, note: "Square root" },
              { title: "Step 5: Final Result", expression: `d = ${cleanD}`, note: "Distance verified" }
            ]
          };
        }
      },
      {
        id: 'thm_pythagoras_triples',
        title: '4. Pythagorean Triples Generator',
        desc: 'Generate primitive integer triples using Euclid\'s formula: a = m² - n², b = 2mn, c = m² + n² (m > n > 0)',
        latex: 'a = m^2 - n^2, \\quad b = 2mn, \\quad c = m^2 + n^2',
        template: 'm^2 + n^2',
        vars: [
          { id: 'm', label: 'Integer m (m > n)', default: 3, type: 'number' },
          { id: 'n', label: 'Integer n (n > 0)', default: 2, type: 'number' }
        ],
        compute(v) {
          const m = Math.round(parseFloat(v.m)), n = Math.round(parseFloat(v.n));
          if (m <= n || n <= 0) return { error: "Requirements: m and n must be positive integers with m > n." };
          const a = m * m - n * n, b = 2 * m * n, c = m * m + n * n;
          return {
            formulaStatement: { title: "Euclid's Pythagorean Triple Generator", latex: "a = m^2 - n^2, \\quad b = 2mn, \\quad c = m^2 + n^2" },
            givenValues: `m = ${m}, \\quad n = ${n}`,
            substitution: `a = ${m}^2 - ${n}^2 = ${a}, \\quad b = 2(${m})(${n}) = ${b}, \\quad c = ${m}^2 + ${n}^2 = ${c}`,
            intermediateSteps: [
              { title: "Leg a (m² - n²)", expression: `${m*m} - ${n*n} = ${a}`, note: "First orthogonal leg" },
              { title: "Leg b (2mn)", expression: `2 \\times ${m} \\times ${n} = ${b}`, note: "Second orthogonal leg" },
              { title: "Hypotenuse c (m² + n²)", expression: `${m*m} + ${n*n} = ${c}`, note: "Hypotenuse" },
              { title: "Identity Verification", expression: `${a}^2 + ${b}^2 = ${a*a} + ${b*b} = ${c*c} = ${c}^2`, note: "Exact integer right triangle" }
            ],
            finalResult: `(a, b, c) = (${a}, ${b}, ${c})`,
            answer: `(${a}, ${b}, ${c})`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "a = m^2 - n^2, \\; b = 2mn, \\; c = m^2 + n^2", note: "Euclid's triple formula" },
              { title: "Step 2: Given Integers", expression: `m = ${m}, \\; n = ${n}`, note: "Generator parameters" },
              { title: "Step 3: Component Evaluation", expression: `a = ${a}, \\; b = ${b}, \\; c = ${c}`, note: "Side lengths" },
              { title: "Step 4: Check Equality", expression: `${a}^2 + ${b}^2 = ${c}^2`, note: "Pythagorean identity holds" },
              { title: "Step 5: Final Result", expression: `(${a}, ${b}, ${c})`, note: "Integer triple generated" }
            ]
          };
        }
      }
    ]
  },

  // 2. Algebra: Quadratic Theorems & Polynomial Properties
  {
    id: 'theorems_quadratics',
    category: 'Theorems',
    subCategory: 'Algebra',
    title: 'Quadratic Theorems & Polynomial Properties',
    subtitle: 'Analytical root resolution, discriminant behavior, root-coefficient symmetry, and remainder theorem',
    latex: 'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}, \\quad x_1 + x_2 = -\\frac{b}{a}, \\quad R = P(c)',
    subFormulas: [
      {
        id: 'thm_quad_roots',
        title: '1. Quadratic Root Formula',
        desc: 'Analytical root resolution of any quadratic equation ax² + bx + c = 0 via standard quadratic formula',
        latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        template: '(-b +- sqrt(b^2 - 4*a*c))/(2*a)',
        vars: [
          { id: 'a', label: 'Coefficient a (a ≠ 0)', default: 1, type: 'number' },
          { id: 'b', label: 'Coefficient b', default: -5, type: 'number' },
          { id: 'c', label: 'Constant c', default: 6, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c);
          if (a === 0) return { error: "Coefficient a cannot be 0 in a quadratic equation." };
          const disc = b * b - 4 * a * c;
          let ansStr = '';
          const inter = [
            { title: "Compute Discriminant", expression: `\\Delta = (${b})^2 - 4(${a})(${c}) = ${disc}`, note: disc >= 0 ? "Non-negative discriminant yields real roots" : "Negative discriminant yields complex roots" }
          ];
          if (disc >= 0) {
            const r1 = (-b + Math.sqrt(disc)) / (2 * a);
            const r2 = (-b - Math.sqrt(disc)) / (2 * a);
            const c1 = parseFloat(r1.toFixed(4)), c2 = parseFloat(r2.toFixed(4));
            ansStr = c1 === c2 ? `x = ${c1}` : `x_1 = ${c1}, \\; x_2 = ${c2}`;
            inter.push({ title: "Evaluate Real Roots", expression: `x = \\frac{${-b} \\pm \\sqrt{${disc}}}{${2 * a}} \\implies ${ansStr}`, note: "Square root resolution" });
          } else {
            const realP = parseFloat((-b / (2 * a)).toFixed(4));
            const imagP = parseFloat((Math.sqrt(-disc) / (2 * a)).toFixed(4));
            ansStr = `x = ${realP} \\pm ${Math.abs(imagP)}i`;
            inter.push({ title: "Evaluate Complex Roots", expression: ansStr, note: "Imaginary unit i = √(-1)" });
          }
          return {
            formulaStatement: { title: "Quadratic Formula", latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
            substitution: `x = \\frac{-(${b}) \\pm \\sqrt{(${b})^2 - 4(${a})(${c})}}{2(${a})}`,
            intermediateSteps: inter,
            finalResult: ansStr,
            answer: ansStr,
            steps: [
              { title: "Step 1: Formula Statement", expression: "x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}", note: "Quadratic formula" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\; b = ${b}, \\; c = ${c}`, note: "Input coefficients" },
              { title: "Step 3: Discriminant", expression: `\\Delta = ${disc}`, note: "Compute radical value" },
              { title: "Step 4: Radical Resolution", expression: ansStr, note: "Evaluate positive and negative branches" },
              { title: "Step 5: Final Result", expression: ansStr, note: "Roots verified" }
            ]
          };
        }
      },
      {
        id: 'thm_quad_discriminant',
        title: '2. Discriminant Nature of Roots',
        desc: 'Classify root multiplicity and nature from Δ = b² - 4ac (Δ > 0: two distinct real, Δ = 0: one real, Δ < 0: two complex)',
        latex: '\\Delta = b^2 - 4ac',
        template: 'b^2 - 4*a*c',
        vars: [
          { id: 'a', label: 'Coefficient a', default: 2, type: 'number' },
          { id: 'b', label: 'Coefficient b', default: -4, type: 'number' },
          { id: 'c', label: 'Constant c', default: 2, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c);
          const disc = b * b - 4 * a * c;
          const nature = disc > 0 ? "Two distinct real roots (Δ > 0)" : disc === 0 ? "One repeated real root (double root, Δ = 0)" : "Two complex conjugate roots (Δ < 0)";
          return {
            formulaStatement: { title: "Discriminant Theorem", latex: "\\Delta = b^2 - 4ac" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
            substitution: `\\Delta = (${b})^2 - 4(${a})(${c}) = ${b*b} - ${4*a*c} = ${disc}`,
            intermediateSteps: [
              { title: "Square Linear Coefficient", expression: `b^2 = (${b})^2 = ${b*b}`, note: "Quadratic middle term" },
              { title: "Subtract 4ac", expression: `4ac = 4(${a})(${c}) = ${4*a*c}`, note: "Cross-term product" },
              { title: "Nature Classification", expression: `\\Delta = ${disc} \\implies \\text{${nature}}`, note: "Algebraic root classification" }
            ],
            finalResult: `\\Delta = ${disc} \\quad (\\text{${nature}})`,
            answer: `Δ = ${disc} (${nature})`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\Delta = b^2 - 4ac", note: "Discriminant definition" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\; b = ${b}, \\; c = ${c}`, note: "Input trinomial coefficients" },
              { title: "Step 3: Substitution", expression: `\\Delta = ${b*b} - ${4*a*c} = ${disc}`, note: "Calculate discriminant" },
              { title: "Step 4: Classification", expression: `\\text{${nature}}`, note: "Sign inspection" },
              { title: "Step 5: Final Result", expression: `\\Delta = ${disc}`, note: "Nature of roots confirmed" }
            ]
          };
        }
      },
      {
        id: 'thm_vieta_roots',
        title: '3. Vieta\'s Formulas',
        desc: 'Calculate root sum S = -b/a and root product P = c/a directly from coefficients',
        latex: 'x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 x_2 = \\frac{c}{a}',
        template: '-b/a',
        vars: [
          { id: 'a', label: 'Coefficient a (≠ 0)', default: 2, type: 'number' },
          { id: 'b', label: 'Coefficient b', default: -8, type: 'number' },
          { id: 'c', label: 'Constant c', default: 6, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c);
          if (a === 0) return { error: "Coefficient a cannot be zero." };
          const s = -b / a, p = c / a;
          const cleanS = parseFloat(s.toFixed(4)), cleanP = parseFloat(p.toFixed(4));
          return {
            formulaStatement: { title: "Vieta's Formulas", latex: "S = -\\frac{b}{a}, \\quad P = \\frac{c}{a}" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad c = ${c}`,
            substitution: `S = -\\frac{${b}}{${a}} = ${cleanS}, \\quad P = \\frac{${c}}{${a}} = ${cleanP}`,
            intermediateSteps: [
              { title: "Sum of Roots (S)", expression: `S = -\\frac{${b}}{${a}} = ${cleanS}`, note: "Direct sum of polynomial zeros" },
              { title: "Product of Roots (P)", expression: `P = \\frac{${c}}{${a}} = ${cleanP}`, note: "Direct product of polynomial zeros" }
            ],
            finalResult: `S = ${cleanS}, \\quad P = ${cleanP}`,
            answer: `Sum = ${cleanS}, Product = ${cleanP}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "S = -b/a, \\; P = c/a", note: "Vieta root relations" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\; b = ${b}, \\; c = ${c}`, note: "Polynomial coefficients" },
              { title: "Step 3: Root Sum", expression: `S = -(${b})/${a} = ${cleanS}`, note: "Compute sum" },
              { title: "Step 4: Root Product", expression: `P = ${c}/${a} = ${cleanP}`, note: "Compute product" },
              { title: "Step 5: Final Result", expression: `S = ${cleanS}, \\; P = ${cleanP}`, note: "Vieta relations confirmed" }
            ]
          };
        }
      },
      {
        id: 'thm_poly_remainder',
        title: '4. Polynomial Remainder Theorem',
        desc: 'Evaluate remainder R of polynomial ax² + bx + d upon division by linear binomial (x - c): R = P(c)',
        latex: 'P(x) = (x - c)Q(x) + R \\implies R = P(c)',
        template: 'a*c^2 + b*c + d',
        vars: [
          { id: 'a', label: 'Coefficient a', default: 2, type: 'number' },
          { id: 'b', label: 'Coefficient b', default: 3, type: 'number' },
          { id: 'd', label: 'Constant d', default: -5, type: 'number' },
          { id: 'c', label: 'Root / Shift c (divisor x - c)', default: 2, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a), b = parseFloat(v.b), d = parseFloat(v.d), c = parseFloat(v.c);
          const R = a * c * c + b * c + d;
          const cleanR = parseFloat(R.toFixed(4));
          const isFact = Math.abs(cleanR) < 1e-6;
          return {
            formulaStatement: { title: "Polynomial Remainder Theorem", latex: "R = P(c) = a c^2 + b c + d" },
            givenValues: `P(x) = ${a}x^2 + ${b}x + (${d}), \\quad c = ${c}`,
            substitution: `R = P(${c}) = ${a}(${c})^2 + ${b}(${c}) + (${d}) = ${cleanR}`,
            intermediateSteps: [
              { title: "Substitute c into Monomials", expression: `${a}(${c*c}) + ${b*c} + (${d})`, note: "Direct polynomial evaluation" },
              { title: "Calculate Remainder", expression: `R = ${cleanR}`, note: isFact ? "(x - c) is an EXACT FACTOR (R = 0)" : "Non-zero remainder" }
            ],
            finalResult: `R = ${cleanR}${isFact ? ' \\implies (x - c) \\text{ is a factor!}' : ''}`,
            answer: `R = ${cleanR}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "R = P(c)", note: "Remainder theorem" },
              { title: "Step 2: Given Values", expression: `P(x), \\; c = ${c}`, note: "Input polynomial and test root" },
              { title: "Step 3: Substitution", expression: `R = ${a}(${c})^2 + ${b}(${c}) + ${d}`, note: "Substitute into equation" },
              { title: "Step 4: Arithmetic", expression: `R = ${cleanR}`, note: "Evaluate sum" },
              { title: "Step 5: Final Result", expression: `R = ${cleanR}`, note: "Remainder evaluated" }
            ]
          };
        }
      },
      {
        id: 'thm_binomial_theorem',
        title: '5. Binomial Expansion Theorem',
        desc: 'Calculate combinations binomial coefficient C(n, k) = n! / (k!(n - k)!) for powers of a binomial',
        latex: '\\binom{n}{k} = \\frac{n!}{k!(n - k)!}',
        template: 'factorial(n)/(factorial(k)*factorial(n-k))',
        vars: [
          { id: 'n', label: 'Power / Total (n)', default: 5, type: 'number' },
          { id: 'k', label: 'Selection Index (k)', default: 2, type: 'number' }
        ],
        compute(v) {
          const n = Math.round(parseFloat(v.n)), k = Math.round(parseFloat(v.k));
          if (n < 0 || k < 0 || k > n) return { error: "Requirements: n ≥ 0 and 0 ≤ k ≤ n." };
          const fact = (m) => { let res = 1; for (let i = 2; i <= m; i++) res *= i; return res; };
          const nFact = fact(n), kFact = fact(k), nkFact = fact(n - k);
          const coeff = nFact / (kFact * nkFact);
          return {
            formulaStatement: { title: "Binomial Coefficient", latex: "\\binom{n}{k} = \\frac{n!}{k!(n - k)!}" },
            givenValues: `n = ${n}, \\quad k = ${k}`,
            substitution: `\\binom{${n}}{${k}} = \\frac{${n}!}{${k}!(${n} - ${k})!} = \\frac{${nFact}}{${kFact} \\times ${nkFact}}`,
            intermediateSteps: [
              { title: "Factorial Computations", expression: `${n}! = ${nFact}, \\; ${k}! = ${kFact}, \\; (${n}-${k})! = ${nkFact}`, note: "Factorial values" },
              { title: "Combinatorial Quotient", expression: `\\frac{${nFact}}{${kFact * nkFact}} = ${coeff}`, note: "Evaluate quotient" }
            ],
            finalResult: `\\binom{${n}}{${k}} = ${coeff}`,
            answer: `${coeff}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\binom{n}{k} = \\frac{n!}{k!(n-k)!}", note: "Binomial coefficient" },
              { title: "Step 2: Given Values", expression: `n = ${n}, \\; k = ${k}`, note: "Input index values" },
              { title: "Step 3: Substitution", expression: `\\frac{${n}!}{\${k}!(${n}-${k})!}`, note: "Substitute into equation" },
              { title: "Step 4: Computation", expression: `\\frac{${nFact}}{${kFact*nkFact}} = ${coeff}`, note: "Perform division" },
              { title: "Step 5: Final Result", expression: `${coeff}`, note: "Binomial coefficient confirmed" }
            ]
          };
        }
      }
    ]
  }
];

let js = 'const CORE_THEOREMS_26 = [\n';
// ... We will assemble all 9 groups
console.log('Script built');
