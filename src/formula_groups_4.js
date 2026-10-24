/**
 * FORMULA GROUPS 19-26:
 * Calculus (Power Rule, Trig, Product/Quotient), Physics Kinematics, Statistics & Probability, Unit Conversions
 */
const FORMULA_GROUPS_4 = [
  // ================= 19. CALCULUS: POWER RULE =================
  {
    id: 'calculus_power_rule',
    category: 'Calculus',
    subCategory: 'Power Rule',
    title: 'Calculus: Power Rule',
    subtitle: 'Power Rule for Differentiation (d/dx xⁿ = n xⁿ⁻¹) and Indefinite Integration (∫ xⁿ dx = xⁿ⁺¹/(n+1) + C)',
    latex: '\\frac{d}{dx}[x^n] = n x^{n-1}, \\quad \\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)',
    subFormulas: [
      {
        id: 'power_rule_deriv',
        title: 'Power Rule for Derivatives',
        desc: 'Differentiate power function: bring power in front as coefficient and decrement exponent by 1',
        latex: '\\frac{d}{dx}[x^n] = n \\cdot x^{n - 1}',
        template: 'd/dx(x^n)',
        vars: [
          { id: 'n', label: 'Exponent n', default: 4, type: 'number' }
        ],
        compute(v) {
          const n = parseFloat(v.n);
          const newP = n - 1;
          const ansLatex = n === 1 ? "1" : n === 0 ? "0" : newP === 1 ? `${n}x` : `${n}x^{${newP}}`;
          const inter = [
            { title: "Identify Exponent", expression: `n = ${n}`, note: "Target power" },
            { title: "Decrement Exponent by 1", expression: `n - 1 = ${n} - 1 = ${newP}`, note: "New power index" },
            { title: "Multiply by Original Exponent", expression: `${n} \\cdot x^{${newP}} = ${ansLatex}`, note: "Derivative term" }
          ];
          return {
            formulaStatement: { title: "Derivative Power Rule", latex: "\\frac{d}{dx}[x^n] = n x^{n-1}" },
            givenValues: `f(x) = x^{${n}}, \\quad n = ${n}`,
            substitution: `\\frac{d}{dx}[x^{${n}}] = (${n}) \\cdot x^{${n} - 1}`,
            intermediateSteps: inter,
            finalResult: `d/dx(x^${n}) = ${ansLatex}`,
            answer: `${ansLatex}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\frac{d}{dx}[x^n] = n x^{n-1}", note: "Power rule identity" },
              { title: "Step 2: Given Values", expression: `n = ${n}`, note: "Input exponent" },
              { title: "Step 3: Substitution", expression: `\\frac{d}{dx}[x^{${n}}] = ${n} \\cdot x^{${n}-1}`, note: "Substitute into derivative" },
              ...inter,
              { title: "Step 5: Final Result", expression: `\\frac{d}{dx}[x^{${n}}] = ${ansLatex}`, note: "Differentiation complete" }
            ]
          };
        }
      },
      {
        id: 'power_rule_integ',
        title: 'Power Rule for Integrals',
        desc: 'Antiderivative of power function: increment exponent by 1 and divide by new power',
        latex: '\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)',
        template: 'integral(x^n)',
        vars: [
          { id: 'n', label: 'Exponent n (n ≠ -1)', default: 3, type: 'number' }
        ],
        compute(v) {
          const n = parseFloat(v.n);
          if (n === -1) {
            return {
              formulaStatement: { title: "Integral of Reciprocal 1/x", latex: "\\int \\frac{1}{x} \\, dx = \\ln|x| + C" },
              givenValues: "n = -1 \\implies f(x) = \\frac{1}{x}",
              substitution: "\\int x^{-1} \\, dx = \\ln|x| + C",
              intermediateSteps: [{ title: "Special Case n = -1", expression: "\\int \\frac{1}{x} dx = \\ln|x| + C", note: "Standard natural logarithm antiderivative" }],
              finalResult: "ln|x| + C",
              answer: "ln|x| + C",
              steps: [{ title: "Logarithmic Antiderivative", expression: "\\int \\frac{1}{x} dx = \\ln|x| + C", note: "n = -1 case" }]
            };
          }
          const newP = n + 1;
          const ansLatex = `\\frac{x^{${newP}}}{${newP}} + C`;
          const inter = [
            { title: "Increment Exponent by 1", expression: `n + 1 = ${n} + 1 = ${newP}`, note: "New power index" },
            { title: "Divide by New Exponent", expression: `\\frac{x^{${newP}}}{${newP}} + C`, note: "Antiderivative term" },
            { title: "Add Constant of Integration", expression: "C", note: "Arbitrary constant" }
          ];
          return {
            formulaStatement: { title: "Integral Power Rule", latex: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C" },
            givenValues: `f(x) = x^{${n}}, \\quad n = ${n}`,
            substitution: `\\int x^{${n}} \\, dx = \\frac{x^{${n} + 1}}{${n} + 1} + C`,
            intermediateSteps: inter,
            finalResult: `∫ x^${n} dx = ${ansLatex}`,
            answer: `${ansLatex}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C", note: "Integration power rule" },
              { title: "Step 2: Given Values", expression: `n = ${n}`, note: "Input exponent" },
              ...inter,
              { title: "Step 5: Final Result", expression: `\\int x^{${n}} dx = ${ansLatex}`, note: "Integration complete" }
            ]
          };
        }
      }
    ]
  },

  // ================= 20. CALCULUS: TRIGONOMETRIC RULES =================
  {
    id: 'calculus_trig',
    category: 'Calculus',
    subCategory: 'Trig Calculus',
    title: 'Calculus: Trigonometric Derivatives & Integrals',
    subtitle: 'Derivatives and integrals of sin(x) and cos(x)',
    latex: '\\frac{d}{dx}\\sin(x) = \\cos(x), \\quad \\frac{d}{dx}\\cos(x) = -\\sin(x), \\quad \\int \\sin(x) dx = -\\cos(x)+C, \\quad \\int \\cos(x) dx = \\sin(x)+C',
    subFormulas: [
      {
        id: 'deriv_sin',
        title: 'Derivative of sin(x)',
        desc: 'Rate of change of sine function: d/dx[sin(x)] = cos(x)',
        latex: '\\frac{d}{dx}[\\sin(x)] = \\cos(x)',
        template: 'd/dx(sin(x))',
        vars: [
          { id: 'k', label: 'Coefficient k in sin(kx)', default: 1, type: 'number' }
        ],
        compute(v) {
          const k = parseFloat(v.k) || 1;
          const ans = k === 1 ? "\\cos(x)" : `${k}\\cos(${k}x)`;
          const inter = [
            { title: "Chain Rule Application", expression: `\\frac{d}{dx}[\\sin(kx)] = k \\cdot \\cos(kx)`, note: "Multiply by inner derivative k" },
            { title: "Evaluate with k", expression: `\\frac{d}{dx}[\\sin(${k}x)] = ${ans}`, note: "Final derivative" }
          ];
          return {
            formulaStatement: { title: "Sine Derivative Identity", latex: "\\frac{d}{dx}[\\sin(kx)] = k \\cos(kx)" },
            givenValues: `f(x) = \\sin(${k}x), \\quad k = ${k}`,
            substitution: `\\frac{d}{dx}[\\sin(${k}x)] = ${k} \\cos(${k}x)`,
            intermediateSteps: inter,
            finalResult: `d/dx(sin(${k}x)) = ${ans}`,
            answer: `${ans}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\frac{d}{dx}[\\sin(x)] = \\cos(x)", note: "Base trigonometric derivative" },
              { title: "Step 2: Given Values", expression: `k = ${k}`, note: "Frequency coefficient" },
              ...inter,
              { title: "Step 5: Final Result", expression: ans, note: "Derivative determined" }
            ]
          };
        }
      },
      {
        id: 'deriv_cos',
        title: 'Derivative of cos(x)',
        desc: 'Rate of change of cosine function: d/dx[cos(x)] = -sin(x)',
        latex: '\\frac{d}{dx}[\\cos(x)] = -\\sin(x)',
        template: 'd/dx(cos(x))',
        vars: [
          { id: 'k', label: 'Coefficient k in cos(kx)', default: 1, type: 'number' }
        ],
        compute(v) {
          const k = parseFloat(v.k) || 1;
          const ans = k === 1 ? "-\\sin(x)" : `-${k}\\sin(${k}x)`;
          const inter = [
            { title: "Chain Rule Application", expression: `\\frac{d}{dx}[\\cos(kx)] = -k \\cdot \\sin(kx)`, note: "Cosine derivative carries a negative sign" },
            { title: "Evaluate with k", expression: `\\frac{d}{dx}[\\cos(${k}x)] = ${ans}`, note: "Final derivative" }
          ];
          return {
            formulaStatement: { title: "Cosine Derivative Identity", latex: "\\frac{d}{dx}[\\cos(kx)] = -k \\sin(kx)" },
            givenValues: `f(x) = \\cos(${k}x), \\quad k = ${k}`,
            substitution: `\\frac{d}{dx}[\\cos(${k}x)] = -${k} \\sin(${k}x)`,
            intermediateSteps: inter,
            finalResult: `d/dx(cos(${k}x)) = ${ans}`,
            answer: `${ans}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\frac{d}{dx}[\\cos(x)] = -\\sin(x)", note: "Base trigonometric derivative" },
              { title: "Step 2: Given Values", expression: `k = ${k}`, note: "Frequency coefficient" },
              ...inter,
              { title: "Step 5: Final Result", expression: ans, note: "Derivative determined" }
            ]
          };
        }
      },
      {
        id: 'integ_sin',
        title: 'Integral of sin(x)',
        desc: 'Indefinite antiderivative of sine: ∫ sin(x) dx = -cos(x) + C',
        latex: '\\int \\sin(x) \\, dx = -\\cos(x) + C',
        template: 'integral(sin(x))',
        vars: [
          { id: 'k', label: 'Coefficient k in sin(kx)', default: 1, type: 'number' }
        ],
        compute(v) {
          const k = parseFloat(v.k) || 1;
          const ans = k === 1 ? "-\\cos(x) + C" : `-\\frac{1}{${k}}\\cos(${k}x) + C`;
          const inter = [
            { title: "Integration by Substitution", expression: `u = ${k}x \\implies du = ${k} dx`, note: "Divide by inner coefficient k" },
            { title: "Antiderivative Form", expression: `\\int \\sin(${k}x) dx = -\\frac{1}{${k}} \\cos(${k}x) + C`, note: "Negative cosine antiderivative" }
          ];
          return {
            formulaStatement: { title: "Sine Indefinite Integral", latex: "\\int \\sin(kx) \\, dx = -\\frac{1}{k}\\cos(kx) + C" },
            givenValues: `f(x) = \\sin(${k}x), \\quad k = ${k}`,
            substitution: `\\int \\sin(${k}x) \\, dx = -\\frac{1}{${k}}\\cos(${k}x) + C`,
            intermediateSteps: inter,
            finalResult: `∫ sin(${k}x) dx = ${ans}`,
            answer: `${ans}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\int \\sin(x) dx = -\\cos(x) + C", note: "Standard antiderivative" },
              ...inter,
              { title: "Step 5: Final Result", expression: ans, note: "Antiderivative found" }
            ]
          };
        }
      },
      {
        id: 'integ_cos',
        title: 'Integral of cos(x)',
        desc: 'Indefinite antiderivative of cosine: ∫ cos(x) dx = sin(x) + C',
        latex: '\\int \\cos(x) \\, dx = \\sin(x) + C',
        template: 'integral(cos(x))',
        vars: [
          { id: 'k', label: 'Coefficient k in cos(kx)', default: 1, type: 'number' }
        ],
        compute(v) {
          const k = parseFloat(v.k) || 1;
          const ans = k === 1 ? "\\sin(x) + C" : `\\frac{1}{${k}}\\sin(${k}x) + C`;
          const inter = [
            { title: "Substitution", expression: `u = ${k}x \\implies du = ${k} dx`, note: "Chain rule integration" },
            { title: "Antiderivative Form", expression: `\\int \\cos(${k}x) dx = \\frac{1}{${k}} \\sin(${k}x) + C`, note: "Positive sine antiderivative" }
          ];
          return {
            formulaStatement: { title: "Cosine Indefinite Integral", latex: "\\int \\cos(kx) \\, dx = \\frac{1}{k}\\sin(kx) + C" },
            givenValues: `f(x) = \\cos(${k}x), \\quad k = ${k}`,
            substitution: `\\int \\cos(${k}x) \\, dx = \\frac{1}{${k}}\\sin(${k}x) + C`,
            intermediateSteps: inter,
            finalResult: `∫ cos(${k}x) dx = ${ans}`,
            answer: `${ans}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\int \\cos(x) dx = \\sin(x) + C", note: "Standard antiderivative" },
              ...inter,
              { title: "Step 5: Final Result", expression: ans, note: "Antiderivative found" }
            ]
          };
        }
      }
    ]
  },

  // ================= 21. CALCULUS: PRODUCT & QUOTIENT RULES =================
  {
    id: 'calculus_product_quotient',
    category: 'Calculus',
    subCategory: 'Rules',
    title: 'Calculus: Product & Quotient Rules',
    subtitle: 'Differentiate products (u · v)\' = u\'v + uv\' and quotients (u / v)\' = (u\'v - uv\') / v²',
    latex: '\\frac{d}{dx}[u \\cdot v] = u\'v + uv\', \\quad \\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u\'v - uv\'}{v^2}',
    subFormulas: [
      {
        id: 'calc_product_rule',
        title: 'Product Rule for Differentiation',
        desc: 'Derivative of two multiplied functions: d/dx[u · v] = u\'v + uv\'',
        latex: '\\frac{d}{dx}[u \\cdot v] = u\'v + u v\'',
        template: 'Product Rule: d/dx[u * v]',
        vars: [
          { id: 'u', label: 'Function u(x)', default: 'x^2', type: 'text' },
          { id: 'v', label: 'Function v(x)', default: 'sin(x)', type: 'text' }
        ],
        compute(vals) {
          const uStr = (vals.u || 'x^2').trim();
          const vStr = (vals.v || 'sin(x)').trim();
          try {
            const uNode = math.parse(uStr);
            const vNode = math.parse(vStr);
            const du = math.derivative(uNode, 'x').toString();
            const dv = math.derivative(vNode, 'x').toString();
            const res = `(${du})(${vStr}) + (${uStr})(${dv})`;
            const inter = [
              { title: "Identify Factors", expression: `u(x) = ${uStr}, \\quad v(x) = ${vStr}`, note: "Constituent functions" },
              { title: "Differentiate Each Separately", expression: `u'(x) = ${du}, \\quad v'(x) = ${dv}`, note: "First derivatives" },
              { title: "Assemble Product Rule", expression: `u\'v + uv\' = (${du})(${vStr}) + (${uStr})(${dv})`, note: "Cross multiplication" }
            ];
            return {
              formulaStatement: { title: "Product Rule", latex: "\\frac{d}{dx}[u \\cdot v] = u'v + u v'" },
              givenValues: `u(x) = ${uStr}, \\quad v(x) = ${vStr}`,
              substitution: `(${du})(${vStr}) + (${uStr})(${dv})`,
              intermediateSteps: inter,
              finalResult: res,
              answer: res,
              steps: [
                { title: "Step 1: Formula Statement", expression: "\\frac{d}{dx}[u \\cdot v] = u'v + uv'", note: "Product rule equation" },
                ...inter,
                { title: "Step 5: Final Result", expression: res, note: "Product derivative assembled" }
              ]
            };
          } catch (e) {
            return { error: "Unable to parse functions: " + e.message };
          }
        }
      },
      {
        id: 'calc_quotient_rule',
        title: 'Quotient Rule for Differentiation',
        desc: 'Derivative of divided functions: d/dx[u / v] = (u\'v - uv\') / v²',
        latex: '\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u\'v - u v\'}{v^2}',
        template: 'Quotient Rule: d/dx[u / v]',
        vars: [
          { id: 'u', label: 'Numerator u(x)', default: 'x', type: 'text' },
          { id: 'v', label: 'Denominator v(x)', default: 'cos(x)', type: 'text' }
        ],
        compute(vals) {
          const uStr = (vals.u || 'x').trim();
          const vStr = (vals.v || 'cos(x)').trim();
          try {
            const uNode = math.parse(uStr);
            const vNode = math.parse(vStr);
            const du = math.derivative(uNode, 'x').toString();
            const dv = math.derivative(vNode, 'x').toString();
            const num = `(${du})(${vStr}) - (${uStr})(${dv})`;
            const den = `(${vStr})^2`;
            const res = `\\frac{${num}}{${den}}`;
            const inter = [
              { title: "Numerator & Denominator", expression: `u(x) = ${uStr}, \\quad v(x) = ${vStr}`, note: "Input functions" },
              { title: "Differentiate u and v", expression: `u'(x) = ${du}, \\quad v'(x) = ${dv}`, note: "Individual derivatives" },
              { title: "Assemble Quotient Formula", expression: `\\frac{u\'v - uv\'}{v^2} = \\frac{(${du})(${vStr}) - (${uStr})(${dv})}{(${vStr})^2}`, note: "Low d-high minus high d-low over low squared" }
            ];
            return {
              formulaStatement: { title: "Quotient Rule", latex: "\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - u v'}{v^2}" },
              givenValues: `u(x) = ${uStr}, \\quad v(x) = ${vStr}`,
              substitution: `\\frac{(${du})(${vStr}) - (${uStr})(${dv})}{(${vStr})^2}`,
              intermediateSteps: inter,
              finalResult: res,
              answer: `${num} / ${den}`,
              steps: [
                { title: "Step 1: Formula Statement", expression: "\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}", note: "Quotient rule equation" },
                ...inter,
                { title: "Step 5: Final Result", expression: res, note: "Quotient derivative evaluated" }
              ]
            };
          } catch (e) {
            return { error: "Unable to parse functions: " + e.message };
          }
        }
      }
    ]
  },

  // ================= 22. PHYSICS & MOTION (KINEMATICS) =================
  {
    id: 'physics_kinematics',
    category: 'Physics',
    subCategory: 'Kinematics',
    title: 'Physics: Kinematics & Motion',
    subtitle: 'Speed (v = d/t), Time (t = d/v), Distance (d = v · t), and Average Speed (v_avg = d_total / t_total)',
    latex: 'v = \\frac{d}{t}, \\quad t = \\frac{d}{v}, \\quad d = v \\cdot t, \\quad v_{\\text{avg}} = \\frac{d_1 + d_2}{t_1 + t_2}',
    subFormulas: [
      {
        id: 'kinematics_speed',
        title: 'Speed Calculator (v = d / t)',
        desc: 'Calculate speed from distance traveled and time elapsed: v = d / t',
        latex: 'v = \\frac{d}{t}',
        template: 'v = d / t',
        vars: [
          { id: 'd', label: 'Distance d (meters or km)', default: 150, type: 'number' },
          { id: 't', label: 'Time t (seconds or hours)', default: 2.5, type: 'number' }
        ],
        compute(v) {
          const d = parseFloat(v.d);
          const t = parseFloat(v.t);
          if (d < 0) return { error: "Distance cannot be negative." };
          if (t <= 0) return { error: "Time must be strictly greater than zero." };
          const speed = d / t;
          const cleanS = Number.isInteger(speed) ? speed : parseFloat(speed.toFixed(4));
          const inter = [
            { title: "Rate of Motion Formula", expression: `v = \\frac{d}{t} = \\frac{${d}}{${t}}`, note: "Distance divided by duration" },
            { title: "Division Result", expression: `${d} \\div ${t} = ${cleanS}`, note: "Speed magnitude" }
          ];
          return {
            formulaStatement: { title: "Speed Equation", latex: "v = \\frac{d}{t}" },
            givenValues: `d = ${d}, \\quad t = ${t}`,
            substitution: `v = \\frac{${d}}{${t}}`,
            intermediateSteps: inter,
            finalResult: `Speed v = ${cleanS} units/time`,
            answer: `Speed v = ${cleanS}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "v = \\frac{d}{t}", note: "Kinematic speed definition" },
              { title: "Step 2: Given Values", expression: `d = ${d}, \\quad t = ${t}`, note: "Distance and elapsed time" },
              ...inter,
              { title: "Step 5: Final Result", expression: `v = ${cleanS}`, note: "Speed evaluated" }
            ]
          };
        }
      },
      {
        id: 'kinematics_time',
        title: 'Time Calculator (t = d / v)',
        desc: 'Calculate duration from distance and constant speed: t = d / v',
        latex: 't = \\frac{d}{v}',
        template: 't = d / v',
        vars: [
          { id: 'd', label: 'Distance d (meters or km)', default: 360, type: 'number' },
          { id: 'v', label: 'Speed v (m/s or km/h)', default: 60, type: 'number' }
        ],
        compute(v) {
          const d = parseFloat(v.d);
          const sp = parseFloat(v.v);
          if (d < 0) return { error: "Distance cannot be negative." };
          if (sp <= 0) return { error: "Speed must be strictly greater than zero." };
          const t = d / sp;
          const cleanT = Number.isInteger(t) ? t : parseFloat(t.toFixed(4));
          const inter = [
            { title: "Inverted Time Formula", expression: `t = \\frac{d}{v} = \\frac{${d}}{${sp}}`, note: "Duration ratio" },
            { title: "Division Result", expression: `${d} \\div ${sp} = ${cleanT}`, note: "Elapsed time" }
          ];
          return {
            formulaStatement: { title: "Time from Speed & Distance", latex: "t = \\frac{d}{v}" },
            givenValues: `d = ${d}, \\quad v = ${sp}`,
            substitution: `t = \\frac{${d}}{${sp}}`,
            intermediateSteps: inter,
            finalResult: `Time t = ${cleanT} time units`,
            answer: `Time t = ${cleanT}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "t = \\frac{d}{v}", note: "Time duration formula" },
              { title: "Step 2: Given Values", expression: `d = ${d}, \\quad v = ${sp}`, note: "Distance and velocity" },
              ...inter,
              { title: "Step 5: Final Result", expression: `t = ${cleanT}`, note: "Time determined" }
            ]
          };
        }
      },
      {
        id: 'kinematics_distance',
        title: 'Distance Calculator (d = v · t)',
        desc: 'Calculate linear distance traveled: d = v · t',
        latex: 'd = v \\cdot t',
        template: 'd = v * t',
        vars: [
          { id: 'v', label: 'Speed v', default: 85, type: 'number' },
          { id: 't', label: 'Time t', default: 4, type: 'number' }
        ],
        compute(v) {
          const sp = parseFloat(v.v);
          const t = parseFloat(v.t);
          if (sp < 0 || t < 0) return { error: "Speed and time cannot be negative." };
          const d = sp * t;
          const cleanD = Number.isInteger(d) ? d : parseFloat(d.toFixed(4));
          const inter = [
            { title: "Product of Speed and Duration", expression: `d = ${sp} \\times ${t} = ${cleanD}`, note: "Accumulated displacement" }
          ];
          return {
            formulaStatement: { title: "Distance Equation", latex: "d = v \\cdot t" },
            givenValues: `v = ${sp}, \\quad t = ${t}`,
            substitution: `d = (${sp})(${t})`,
            intermediateSteps: inter,
            finalResult: `Distance d = ${cleanD} distance units`,
            answer: `Distance d = ${cleanD}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "d = v \\cdot t", note: "Kinematic distance formula" },
              { title: "Step 2: Given Values", expression: `v = ${sp}, \\quad t = ${t}`, note: "Speed and time" },
              ...inter,
              { title: "Step 5: Final Result", expression: `d = ${cleanD}`, note: "Distance calculated" }
            ]
          };
        }
      },
      {
        id: 'kinematics_avg_speed',
        title: 'Average Speed (v_avg = d_total / t_total)',
        desc: 'Calculate average speed over multi-leg journeys: v_avg = (d₁ + d₂) / (t₁ + t₂)',
        latex: 'v_{\\text{avg}} = \\frac{d_1 + d_2}{t_1 + t_2}',
        template: '(d1 + d2) / (t1 + t2)',
        vars: [
          { id: 'd1', label: 'Leg 1 Distance (d₁)', default: 120, type: 'number' },
          { id: 't1', label: 'Leg 1 Time (t₁)', default: 2, type: 'number' },
          { id: 'd2', label: 'Leg 2 Distance (d₂)', default: 180, type: 'number' },
          { id: 't2', label: 'Leg 2 Time (t₂)', default: 3, type: 'number' }
        ],
        compute(v) {
          const d1 = parseFloat(v.d1), t1 = parseFloat(v.t1);
          const d2 = parseFloat(v.d2), t2 = parseFloat(v.t2);
          if (d1 < 0 || d2 < 0 || t1 <= 0 || t2 <= 0) return { error: "Distances must be non-negative and times must be positive." };
          const totalD = d1 + d2;
          const totalT = t1 + t2;
          const vAvg = totalD / totalT;
          const cleanV = Number.isInteger(vAvg) ? vAvg : parseFloat(vAvg.toFixed(4));
          const inter = [
            { title: "Total Distance", expression: `d_{\\text{total}} = ${d1} + ${d2} = ${totalD}`, note: "Combined journey distance" },
            { title: "Total Elapsed Time", expression: `t_{\\text{total}} = ${t1} + ${t2} = ${totalT}`, note: "Combined journey time" },
            { title: "Average Speed Quotient", expression: `v_{\\text{avg}} = \\frac{${totalD}}{${totalT}} = ${cleanV}`, note: "Total distance divided by total time" }
          ];
          return {
            formulaStatement: { title: "Average Speed Formula", latex: "v_{\\text{avg}} = \\frac{\\sum d}{\\sum t} = \\frac{d_1 + d_2}{t_1 + t_2}" },
            givenValues: `d_1 = ${d1}, \\ t_1 = ${t1}, \\ d_2 = ${d2}, \\ t_2 = ${t2}`,
            substitution: `v_{\\text{avg}} = \\frac{${d1} + ${d2}}{${t1} + ${t2}}`,
            intermediateSteps: inter,
            finalResult: `Average Speed = ${cleanV}`,
            answer: `Average Speed = ${cleanV}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "v_{\\text{avg}} = \\frac{d_{\\text{total}}}{t_{\\text{total}}}", note: "Average speed principle" },
              { title: "Step 2: Given Values", expression: `Leg 1: (${d1}, ${t1}), \\quad Leg 2: (${d2}, ${t2})`, note: "Journey parameters" },
              ...inter,
              { title: "Step 5: Final Result", expression: `v_{\\text{avg}} = ${cleanV}`, note: "Average speed evaluated" }
            ]
          };
        }
      }
    ]
  },

  // ================= 23. STATISTICS: DESCRIPTIVE STATS =================
  {
    id: 'statistics_descriptive',
    category: 'Statistics',
    subCategory: 'Descriptive',
    title: 'Descriptive Statistics',
    subtitle: 'Mean (x̄ = Σx / n), Variance (σ² = Σ(x - x̄)² / n), and Standard Deviation (σ = √σ²)',
    latex: '\\bar{x} = \\frac{\\sum x}{n}, \\quad \\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n}, \\quad \\sigma = \\sqrt{\\sigma^2}',
    subFormulas: [
      {
        id: 'stat_mean',
        title: 'Arithmetic Mean (Average)',
        desc: 'Sum of all values divided by total count: x̄ = Σx / n',
        latex: '\\bar{x} = \\frac{\\sum x}{n}',
        template: 'mean(data)',
        vars: [
          { id: 'data', label: 'Data Values (comma-separated)', default: '12, 15, 18, 22, 33', type: 'text' }
        ],
        compute(v) {
          const raw = (v.data || '').split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
          if (raw.length === 0) return { error: "Please enter comma-separated numbers." };
          const n = raw.length;
          const sum = raw.reduce((a, b) => a + b, 0);
          const mean = sum / n;
          const cleanMean = Number.isInteger(mean) ? mean : parseFloat(mean.toFixed(4));
          const inter = [
            { title: "Sum of Observations", expression: `\\sum x = ${raw.join(' + ')} = ${sum}`, note: "Sum of all data points" },
            { title: "Sample Size (n)", expression: `n = ${n}`, note: "Total count of elements" },
            { title: "Arithmetic Mean", expression: `\\bar{x} = \\frac{${sum}}{${n}} = ${cleanMean}`, note: "Mean average" }
          ];
          return {
            formulaStatement: { title: "Arithmetic Mean Formula", latex: "\\bar{x} = \\frac{\\sum x}{n}" },
            givenValues: `\\text{Data: } [${raw.join(', ')}], \\quad n = ${n}`,
            substitution: `\\bar{x} = \\frac{${sum}}{${n}}`,
            intermediateSteps: inter,
            finalResult: `Mean x̄ = ${cleanMean}`,
            answer: `Mean = ${cleanMean}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\bar{x} = \\frac{\\sum x}{n}", note: "Mean formula" },
              { title: "Step 2: Given Values", expression: `n = ${n} \\text{ observations}`, note: "Data set" },
              ...inter,
              { title: "Step 5: Final Result", expression: `\\bar{x} = ${cleanMean}`, note: "Mean evaluated" }
            ]
          };
        }
      },
      {
        id: 'stat_variance_sd',
        title: 'Variance & Standard Deviation (σ², σ)',
        desc: 'Measures of statistical dispersion: Variance σ² = Σ(x - x̄)² / n and Std Dev σ = √σ²',
        latex: '\\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n}, \\quad \\sigma = \\sqrt{\\sigma^2}',
        template: 'variance & std dev',
        vars: [
          { id: 'data', label: 'Data Values (comma-separated)', default: '10, 12, 23, 23, 16, 23, 21, 16', type: 'text' }
        ],
        compute(v) {
          const raw = (v.data || '').split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
          if (raw.length === 0) return { error: "Please enter comma-separated numbers." };
          const n = raw.length;
          const sum = raw.reduce((a, b) => a + b, 0);
          const mean = sum / n;
          const cleanMean = parseFloat(mean.toFixed(4));
          const sqDiffs = raw.map(x => (x - mean) * (x - mean));
          const sumSqDiffs = sqDiffs.reduce((a, b) => a + b, 0);
          const variance = sumSqDiffs / n;
          const sd = Math.sqrt(variance);
          const cleanVar = parseFloat(variance.toFixed(4));
          const cleanSD = parseFloat(sd.toFixed(4));
          const inter = [
            { title: "Mean (x̄)", expression: `\\bar{x} = \\frac{${sum}}{${n}} = ${cleanMean}`, note: "Central tendency" },
            { title: "Sum of Squared Deviations", expression: `\\sum (x_i - \\bar{x})^2 = ${parseFloat(sumSqDiffs.toFixed(4))}`, note: "Total squared distance from mean" },
            { title: "Population Variance (σ²)", expression: `\\sigma^2 = \\frac{${parseFloat(sumSqDiffs.toFixed(4))}}{${n}} = ${cleanVar}`, note: "Average squared deviation" },
            { title: "Standard Deviation (σ)", expression: `\\sigma = \\sqrt{${cleanVar}} = ${cleanSD}`, note: "Square root of variance in original units" }
          ];
          return {
            formulaStatement: { title: "Variance & Standard Deviation", latex: "\\sigma^2 = \\frac{\\sum (x - \\bar{x})^2}{n}, \\quad \\sigma = \\sqrt{\\sigma^2}" },
            givenValues: `\\text{Data: } [${raw.join(', ')}], \\quad n = ${n}`,
            substitution: `\\sigma^2 = \\frac{${parseFloat(sumSqDiffs.toFixed(2))}}{${n}}, \\quad \\sigma = \\sqrt{${cleanVar}}`,
            intermediateSteps: inter,
            finalResult: `Variance σ² = ${cleanVar}, Std Dev σ = ${cleanSD}`,
            answer: `σ² = ${cleanVar}, σ = ${cleanSD}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\sigma^2 = \\frac{\\sum (x-\\bar{x})^2}{n}, \\ \\sigma = \\sqrt{\\sigma^2}", note: "Dispersion formulas" },
              { title: "Step 2: Given Values", expression: `n = ${n}`, note: "Input series" },
              ...inter,
              { title: "Step 5: Final Result", expression: `\\sigma^2 = ${cleanVar}, \\quad \\sigma = ${cleanSD}`, note: "Calculated successfully" }
            ]
          };
        }
      }
    ]
  },

  // ================= 24. STATISTICS: PROBABILITY & COMBINATORICS =================
  {
    id: 'statistics_probability',
    category: 'Statistics',
    subCategory: 'Probability',
    title: 'Probability & Combinatorics',
    subtitle: 'Probability of an Event (P(E) = n(E)/n(S)), Permutations (P(n,r)), and Combinations (C(n,r))',
    latex: 'P(E) = \\frac{n(E)}{n(S)}, \\quad P(n,r) = \\frac{n!}{(n-r)!}, \\quad C(n,r) = \\frac{n!}{r!(n-r)!}',
    subFormulas: [
      {
        id: 'prob_event',
        title: 'Probability of an Event P(E)',
        desc: 'Theoretical probability: ratio of favorable outcomes n(E) to total outcomes in sample space n(S)',
        latex: 'P(E) = \\frac{n(E)}{n(S)}',
        template: 'P(E) = n(E) / n(S)',
        vars: [
          { id: 'ne', label: 'Favorable Outcomes n(E)', default: 3, type: 'number' },
          { id: 'ns', label: 'Total Sample Space n(S)', default: 12, type: 'number' }
        ],
        compute(v) {
          const ne = parseFloat(v.ne);
          const ns = parseFloat(v.ns);
          if (ne < 0 || ns <= 0) return { error: "Favorable outcomes must be ≥ 0 and Sample space must be > 0." };
          if (ne > ns) return { error: "Favorable outcomes cannot exceed total sample space." };
          const p = ne / ns;
          const pct = p * 100;
          const cleanP = parseFloat(p.toFixed(4));
          const cleanPct = parseFloat(pct.toFixed(2));
          const inter = [
            { title: "Fraction Form", expression: `P(E) = \\frac{${ne}}{${ns}} = ${cleanP}`, note: "Decimal probability in range [0, 1]" },
            { title: "Percentage Form", expression: `${cleanP} \\times 100\\% = ${cleanPct}\\%`, note: "Likelihood percentage" }
          ];
          return {
            formulaStatement: { title: "Probability of an Event", latex: "P(E) = \\frac{n(E)}{n(S)}" },
            givenValues: `n(E) = ${ne}, \\quad n(S) = ${ns}`,
            substitution: `P(E) = \\frac{${ne}}{${ns}}`,
            intermediateSteps: inter,
            finalResult: `P(E) = ${cleanP} (${cleanPct}%)`,
            answer: `P(E) = ${cleanP} (${cleanPct}%)`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "P(E) = \\frac{n(E)}{n(S)}", note: "Classical probability formula" },
              { title: "Step 2: Given Values", expression: `n(E) = ${ne}, \\quad n(S) = ${ns}`, note: "Outcomes and sample space" },
              ...inter,
              { title: "Step 5: Final Result", expression: `P(E) = ${cleanP} \\quad (${cleanPct}\\%)`, note: "Probability evaluated" }
            ]
          };
        }
      },
      {
        id: 'prob_permutations',
        title: 'Permutations P(n, r)',
        desc: 'Number of ordered arrangements of r items chosen from n distinct items: P(n,r) = n! / (n - r)!',
        latex: 'P(n, r) = \\frac{n!}{(n - r)!}',
        template: 'n! / (n - r)!',
        vars: [
          { id: 'n', label: 'Total Items (n)', default: 7, type: 'number' },
          { id: 'r', label: 'Items Chosen (r)', default: 3, type: 'number' }
        ],
        compute(v) {
          const n = parseInt(v.n, 10);
          const r = parseInt(v.r, 10);
          if (n < 0 || r < 0 || r > n) return { error: "Requirements: 0 ≤ r ≤ n." };
          function fact(k) { let res = 1; for (let i = 2; i <= k; i++) res *= i; return res; }
          const fn = fact(n);
          const fnr = fact(n - r);
          const p = fn / fnr;
          const inter = [
            { title: "Factorial n!", expression: `${n}! = ${fn}`, note: "Total permutations of n items" },
            { title: "Factorial (n - r)!", expression: `(${n} - ${r})! = ${n - r}! = ${fnr}`, note: "Unordered remainder items" },
            { title: "Quotient Evaluation", expression: `\\frac{${fn}}{${fnr}} = ${p}`, note: "Ordered permutations" }
          ];
          return {
            formulaStatement: { title: "Permutations Formula", latex: "P(n, r) = \\frac{n!}{(n - r)!}" },
            givenValues: `n = ${n}, \\quad r = ${r}`,
            substitution: `P(${n}, ${r}) = \\frac{${n}!}{(${n} - ${r})!}`,
            intermediateSteps: inter,
            finalResult: `P(${n}, ${r}) = ${p}`,
            answer: `P(${n}, ${r}) = ${p}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "P(n,r) = \\frac{n!}{(n-r)!}", note: "Permutations rule (order matters)" },
              { title: "Step 2: Given Values", expression: `n = ${n}, \\quad r = ${r}`, note: "Inputs" },
              ...inter,
              { title: "Step 5: Final Result", expression: `P(${n}, ${r}) = ${p}`, note: "Arrangements computed" }
            ]
          };
        }
      },
      {
        id: 'prob_combinations',
        title: 'Combinations C(n, r)',
        desc: 'Number of unordered selections of r items chosen from n distinct items: C(n,r) = n! / (r!(n - r)!)',
        latex: 'C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}',
        template: 'n! / (r! * (n - r)!)',
        vars: [
          { id: 'n', label: 'Total Items (n)', default: 8, type: 'number' },
          { id: 'r', label: 'Items Selected (r)', default: 3, type: 'number' }
        ],
        compute(v) {
          const n = parseInt(v.n, 10);
          const r = parseInt(v.r, 10);
          if (n < 0 || r < 0 || r > n) return { error: "Requirements: 0 ≤ r ≤ n." };
          function fact(k) { let res = 1; for (let i = 2; i <= k; i++) res *= i; return res; }
          const fn = fact(n);
          const fr = fact(r);
          const fnr = fact(n - r);
          const c = fn / (fr * fnr);
          const inter = [
            { title: "Factorial Numerator n!", expression: `${n}! = ${fn}`, note: "Total permutations" },
            { title: "Factorial Denominator r! · (n - r)!", expression: `${r}! \\times ${n - r}! = ${fr} \\times ${fnr} = ${fr * fnr}`, note: "Account for order insensitivity" },
            { title: "Combination Quotient", expression: `\\frac{${fn}}{${fr * fnr}} = ${c}`, note: "Unique combinations" }
          ];
          return {
            formulaStatement: { title: "Combinations Formula", latex: "C(n, r) = \\binom{n}{r} = \\frac{n!}{r!(n - r)!}" },
            givenValues: `n = ${n}, \\quad r = ${r}`,
            substitution: `C(${n}, ${r}) = \\frac{${n}!}{${r}!(${n} - ${r})!}`,
            intermediateSteps: inter,
            finalResult: `C(${n}, ${r}) = ${c}`,
            answer: `C(${n}, ${r}) = ${c}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "C(n, r) = \\frac{n!}{r!(n-r)!}", note: "Combinations rule (order does not matter)" },
              { title: "Step 2: Given Values", expression: `n = ${n}, \\quad r = ${r}`, note: "Inputs" },
              ...inter,
              { title: "Step 5: Final Result", expression: `C(${n}, ${r}) = ${c}`, note: "Combinations evaluated" }
            ]
          };
        }
      }
    ]
  },

  // ================= 25. UNIT CONVERSIONS: DISTANCE =================
  {
    id: 'unit_conversions_distance',
    category: 'Conversions',
    subCategory: 'Distance',
    title: 'Unit Conversions: Distance',
    subtitle: 'Kilometers to Meters (× 1000), Meters to Centimeters (× 100), and Centimeters to Millimeters (× 10)',
    latex: '1\\text{ km} = 1000\\text{ m}, \\quad 1\\text{ m} = 100\\text{ cm}, \\quad 1\\text{ cm} = 10\\text{ mm}',
    subFormulas: [
      {
        id: 'convert_km_to_m',
        title: 'Kilometers to Meters (km → m)',
        desc: 'Convert distance from kilometers to meters: meters = km × 1000',
        latex: '\\text{meters} = \\text{km} \\times 1000',
        template: 'km * 1000',
        vars: [
          { id: 'km', label: 'Kilometers (km)', default: 4.5, type: 'number' }
        ],
        compute(v) {
          const km = parseFloat(v.km);
          const m = km * 1000;
          const cleanM = Number.isInteger(m) ? m : parseFloat(m.toFixed(4));
          const inter = [
            { title: "Metric Scale Factor", expression: `1 \\text{ km} = 1000 \\text{ m}`, note: "Metric kilo- prefix means 10³" },
            { title: "Multiplication", expression: `${km} \\times 1000 = ${cleanM} \\text{ m}`, note: "Scale by factor of 1000" }
          ];
          return {
            formulaStatement: { title: "Kilometers to Meters Conversion", latex: "m = \\text{km} \\times 1000" },
            givenValues: `\\text{km} = ${km}`,
            substitution: `m = ${km} \\times 1000`,
            intermediateSteps: inter,
            finalResult: `${cleanM} meters (m)`,
            answer: `${cleanM} m`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "m = \\text{km} \\times 1000", note: "Standard conversion factor" },
              { title: "Step 2: Given Values", expression: `${km} \\text{ km}`, note: "Input value" },
              ...inter,
              { title: "Step 5: Final Result", expression: `${cleanM} \\text{ m}`, note: "Converted successfully" }
            ]
          };
        }
      },
      {
        id: 'convert_m_to_cm',
        title: 'Meters to Centimeters (m → cm)',
        desc: 'Convert length from meters to centimeters: centimeters = m × 100',
        latex: '\\text{centimeters} = \\text{m} \\times 100',
        template: 'm * 100',
        vars: [
          { id: 'm', label: 'Meters (m)', default: 3.25, type: 'number' }
        ],
        compute(v) {
          const m = parseFloat(v.m);
          const cm = m * 100;
          const cleanCM = Number.isInteger(cm) ? cm : parseFloat(cm.toFixed(4));
          const inter = [
            { title: "Metric Centi- Scale Factor", expression: `1 \\text{ m} = 100 \\text{ cm}`, note: "100 centimeters per meter" },
            { title: "Multiplication", expression: `${m} \\times 100 = ${cleanCM} \\text{ cm}`, note: "Scale by factor of 100" }
          ];
          return {
            formulaStatement: { title: "Meters to Centimeters Conversion", latex: "\\text{cm} = \\text{m} \\times 100" },
            givenValues: `\\text{m} = ${m}`,
            substitution: `\\text{cm} = ${m} \\times 100`,
            intermediateSteps: inter,
            finalResult: `${cleanCM} centimeters (cm)`,
            answer: `${cleanCM} cm`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{cm} = \\text{m} \\times 100", note: "Conversion relation" },
              { title: "Step 2: Given Values", expression: `${m} \\text{ m}`, note: "Input length" },
              ...inter,
              { title: "Step 5: Final Result", expression: `${cleanCM} \\text{ cm}`, note: "Conversion complete" }
            ]
          };
        }
      },
      {
        id: 'convert_cm_to_mm',
        title: 'Centimeters to Millimeters (cm → mm)',
        desc: 'Convert length from centimeters to millimeters: millimeters = cm × 10',
        latex: '\\text{millimeters} = \\text{cm} \\times 10',
        template: 'cm * 10',
        vars: [
          { id: 'cm', label: 'Centimeters (cm)', default: 18.5, type: 'number' }
        ],
        compute(v) {
          const cm = parseFloat(v.cm);
          const mm = cm * 10;
          const cleanMM = Number.isInteger(mm) ? mm : parseFloat(mm.toFixed(4));
          const inter = [
            { title: "Metric Milli- Scale Factor", expression: `1 \\text{ cm} = 10 \\text{ mm}`, note: "10 millimeters in every centimeter" },
            { title: "Multiplication", expression: `${cm} \\times 10 = ${cleanMM} \\text{ mm}`, note: "Scale by factor of 10" }
          ];
          return {
            formulaStatement: { title: "Centimeters to Millimeters Conversion", latex: "\\text{mm} = \\text{cm} \\times 10" },
            givenValues: `\\text{cm} = ${cm}`,
            substitution: `\\text{mm} = ${cm} \\times 10`,
            intermediateSteps: inter,
            finalResult: `${cleanMM} millimeters (mm)`,
            answer: `${cleanMM} mm`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{mm} = \\text{cm} \\times 10", note: "Scale relation" },
              { title: "Step 2: Given Values", expression: `${cm} \\text{ cm}`, note: "Input" },
              ...inter,
              { title: "Step 5: Final Result", expression: `${cleanMM} \\text{ mm}`, note: "Conversion complete" }
            ]
          };
        }
      }
    ]
  },

  // ================= 26. UNIT CONVERSIONS: TIME =================
  {
    id: 'unit_conversions_time',
    category: 'Conversions',
    subCategory: 'Time',
    title: 'Unit Conversions: Time',
    subtitle: 'Hours to Minutes (× 60) and Minutes to Seconds (× 60)',
    latex: '1\\text{ hour} = 60\\text{ minutes}, \\quad 1\\text{ minute} = 60\\text{ seconds}',
    subFormulas: [
      {
        id: 'convert_hours_to_mins',
        title: 'Hours to Minutes (hrs → mins)',
        desc: 'Convert time duration from hours to minutes: minutes = hours × 60',
        latex: '\\text{minutes} = \\text{hours} \\times 60',
        template: 'hours * 60',
        vars: [
          { id: 'hrs', label: 'Hours (hrs)', default: 2.75, type: 'number' }
        ],
        compute(v) {
          const hrs = parseFloat(v.hrs);
          const mins = hrs * 60;
          const cleanMins = Number.isInteger(mins) ? mins : parseFloat(mins.toFixed(4));
          const inter = [
            { title: "Sexagesimal Time Factor", expression: `1 \\text{ hr} = 60 \\text{ mins}`, note: "Base time unit ratio" },
            { title: "Multiplication", expression: `${hrs} \\times 60 = ${cleanMins} \\text{ minutes}`, note: "Scale hours by 60" }
          ];
          return {
            formulaStatement: { title: "Hours to Minutes Conversion", latex: "\\text{minutes} = \\text{hours} \\times 60" },
            givenValues: `\\text{hours} = ${hrs}`,
            substitution: `\\text{mins} = ${hrs} \\times 60`,
            intermediateSteps: inter,
            finalResult: `${cleanMins} minutes`,
            answer: `${cleanMins} mins`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{mins} = \\text{hrs} \\times 60", note: "Standard time multiplier" },
              { title: "Step 2: Given Values", expression: `${hrs} \\text{ hrs}`, note: "Input hours" },
              ...inter,
              { title: "Step 5: Final Result", expression: `${cleanMins} \\text{ mins}`, note: "Time converted" }
            ]
          };
        }
      },
      {
        id: 'convert_mins_to_secs',
        title: 'Minutes to Seconds (mins → secs)',
        desc: 'Convert time duration from minutes to seconds: seconds = minutes × 60',
        latex: '\\text{seconds} = \\text{minutes} \\times 60',
        template: 'minutes * 60',
        vars: [
          { id: 'mins', label: 'Minutes (mins)', default: 14.5, type: 'number' }
        ],
        compute(v) {
          const mins = parseFloat(v.mins);
          const secs = mins * 60;
          const cleanSecs = Number.isInteger(secs) ? secs : parseFloat(secs.toFixed(4));
          const inter = [
            { title: "Sexagesimal Base Factor", expression: `1 \\text{ min} = 60 \\text{ secs}`, note: "60 seconds per minute" },
            { title: "Multiplication", expression: `${mins} \\times 60 = ${cleanSecs} \\text{ seconds}`, note: "Scale minutes by 60" }
          ];
          return {
            formulaStatement: { title: "Minutes to Seconds Conversion", latex: "\\text{seconds} = \\text{minutes} \\times 60" },
            givenValues: `\\text{minutes} = ${mins}`,
            substitution: `\\text{secs} = ${mins} \\times 60`,
            intermediateSteps: inter,
            finalResult: `${cleanSecs} seconds`,
            answer: `${cleanSecs} secs`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{secs} = \\text{mins} \\times 60", note: "Standard time multiplier" },
              { title: "Step 2: Given Values", expression: `${mins} \\text{ mins}`, note: "Input duration" },
              ...inter,
              { title: "Step 5: Final Result", expression: `${cleanSecs} \\text{ secs}`, note: "Time converted" }
            ]
          };
        }
      }
    ]
  }
];
