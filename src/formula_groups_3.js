/**
 * FORMULA GROUPS 14-18:
 * Geometry & Mensuration (Circles & Sectors, Cylinders, Prisms & Cubes, Polygons) and Trigonometry
 */
const FORMULA_GROUPS_3 = [
  // ================= 14. CIRCLES & SECTORS =================
  {
    id: 'geometry_circles_sectors',
    category: 'Geometry',
    subCategory: 'Circles & Sectors',
    title: 'Circles & Sectors',
    subtitle: 'Circumference, Circle Area, Arc Length, and Sector Area',
    latex: 'C = 2\\pi r, \\quad A = \\pi r^2, \\quad L = \\frac{\\theta}{360^\\circ} \\cdot 2\\pi r, \\quad A_{\\text{sector}} = \\frac{\\theta}{360^\\circ} \\cdot \\pi r^2',
    subFormulas: [
      {
        id: 'circle_circumference',
        title: 'Circle Circumference (Perimeter)',
        desc: 'Calculate boundary perimeter: C = 2πr = πd',
        latex: 'C = 2\\pi r',
        template: '2 * pi * r',
        vars: [
          { id: 'r', label: 'Radius (r)', default: 7, type: 'number' }
        ],
        compute(v) {
          const r = parseFloat(v.r);
          if (r <= 0) return { error: "Radius must be greater than zero." };
          const pi = 3.141592653589793;
          const c = 2 * pi * r;
          const cleanC = parseFloat(c.toFixed(4));
          const inter = [
            { title: "Substitute Radius & Numerical Pi", expression: `2 \\times 3.14159265 \\times ${r}`, note: "\\pi \\approx 3.14159265" },
            { title: "Product of Factors", expression: `2 \\times ${r} = ${2 * r} \\implies ${2 * r}\\pi \\approx ${cleanC}`, note: "Exact and decimal representation" }
          ];
          return {
            formulaStatement: { title: "Circumference of a Circle", latex: "C = 2\\pi r" },
            givenValues: `r = ${r}`,
            substitution: `C = 2\\pi(${r}) = 2 \\times 3.14159265 \\times ${r}`,
            intermediateSteps: inter,
            finalResult: `C = ${cleanC} (${2*r}π)`,
            answer: `C = ${cleanC} (${2*r}π)`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "C = 2\\pi r", note: "Circle circumference formula" },
              { title: "Step 2: Given Values", expression: `r = ${r}`, note: "Radius" },
              { title: "Step 3: Substitution", expression: `C = 2 \\cdot 3.14159265 \\cdot ${r}`, note: "Substitute constant and radius" },
              ...inter,
              { title: "Step 5: Final Result", expression: `C = ${cleanC}`, note: "Circumference evaluated" }
            ]
          };
        }
      },
      {
        id: 'circle_area',
        title: 'Circle Area',
        desc: 'Total two-dimensional enclosed area: A = πr²',
        latex: 'A = \\pi r^2',
        template: 'pi * r^2',
        vars: [
          { id: 'r', label: 'Radius (r)', default: 5, type: 'number' }
        ],
        compute(v) {
          const r = parseFloat(v.r);
          if (r <= 0) return { error: "Radius must be positive." };
          const pi = 3.141592653589793;
          const r2 = r * r;
          const a = pi * r2;
          const cleanA = parseFloat(a.toFixed(4));
          const inter = [
            { title: "Radius Squared", expression: `r^2 = (${r})^2 = ${r2}`, note: "Square the radius" },
            { title: "Multiply by Numerical Pi", expression: `\\pi \\times ${r2} = 3.14159265 \\times ${r2} = ${cleanA}`, note: "\\pi \\approx 3.14159265" }
          ];
          return {
            formulaStatement: { title: "Area of a Circle", latex: "A = \\pi r^2" },
            givenValues: `r = ${r}`,
            substitution: `A = \\pi(${r})^2 = 3.14159265 \\times ${r2}`,
            intermediateSteps: inter,
            finalResult: `Area A = ${cleanA} (${r2}π)`,
            answer: `Area A = ${cleanA} (${r2}π)`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A = \\pi r^2", note: "Circle area formula" },
              { title: "Step 2: Given Values", expression: `r = ${r}`, note: "Radius" },
              { title: "Step 3: Substitution", expression: `A = \\pi \\cdot (${r})^2`, note: "Plug in" },
              ...inter,
              { title: "Step 5: Final Result", expression: `A = ${cleanA}`, note: "Area determined" }
            ]
          };
        }
      },
      {
        id: 'circle_arc_length',
        title: 'Arc Length (L)',
        desc: 'Curve length of circular sector: L = (θ / 360°) · 2πr',
        latex: 'L = \\frac{\\theta}{360^\\circ} \\cdot 2\\pi r',
        template: '(theta / 360) * 2 * pi * r',
        vars: [
          { id: 'theta', label: 'Central Angle θ (degrees)', default: 60, type: 'number' },
          { id: 'r', label: 'Radius (r)', default: 12, type: 'number' }
        ],
        compute(v) {
          const theta = parseFloat(v.theta);
          const r = parseFloat(v.r);
          if (r <= 0 || theta <= 0) return { error: "Radius and Angle must be positive." };
          const pi = 3.141592653589793;
          const frac = theta / 360;
          const circ = 2 * pi * r;
          const l = frac * circ;
          const cleanL = parseFloat(l.toFixed(4));
          const inter = [
            { title: "Circle Fraction", expression: `\\frac{\\theta}{360^\\circ} = \\frac{${theta}}{360} = ${parseFloat(frac.toFixed(6))}`, note: "Proportional fraction of full turn" },
            { title: "Full Circumference", expression: `C = 2\\pi(${r}) = ${parseFloat(circ.toFixed(4))}`, note: "Full perimeter" },
            { title: "Arc Length Product", expression: `${parseFloat(frac.toFixed(4))} \\times ${parseFloat(circ.toFixed(4))} = ${cleanL}`, note: "Segment curve length" }
          ];
          return {
            formulaStatement: { title: "Arc Length Formula", latex: "L = \\frac{\\theta}{360^\\circ} \\cdot 2\\pi r" },
            givenValues: `\\theta = ${theta}^\\circ, \\quad r = ${r}`,
            substitution: `L = \\frac{${theta}}{360} \\cdot 2(3.14159265)(${r})`,
            intermediateSteps: inter,
            finalResult: `Arc Length L = ${cleanL}`,
            answer: `Arc Length L = ${cleanL}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "L = \\frac{\\theta}{360^\\circ} \\cdot 2\\pi r", note: "Arc length proportional rule" },
              { title: "Step 2: Given Values", expression: `\\theta = ${theta}^\\circ, \\quad r = ${r}`, note: "Inputs" },
              ...inter,
              { title: "Step 5: Final Result", expression: `L = ${cleanL}`, note: "Arc length evaluated" }
            ]
          };
        }
      },
      {
        id: 'circle_sector_area',
        title: 'Area of a Sector',
        desc: 'Surface area of circular slice: A = (θ / 360°) · πr²',
        latex: 'A_{\\text{sector}} = \\frac{\\theta}{360^\\circ} \\cdot \\pi r^2',
        template: '(theta / 360) * pi * r^2',
        vars: [
          { id: 'theta', label: 'Central Angle θ (degrees)', default: 90, type: 'number' },
          { id: 'r', label: 'Radius (r)', default: 8, type: 'number' }
        ],
        compute(v) {
          const theta = parseFloat(v.theta);
          const r = parseFloat(v.r);
          if (r <= 0 || theta <= 0) return { error: "Radius and Angle must be positive." };
          const pi = 3.141592653589793;
          const frac = theta / 360;
          const fullA = pi * r * r;
          const sa = frac * fullA;
          const cleanSA = parseFloat(sa.toFixed(4));
          const inter = [
            { title: "Sector Fraction", expression: `\\frac{\\theta}{360^\\circ} = \\frac{${theta}}{360} = ${parseFloat(frac.toFixed(4))}`, note: "Portion of 360°" },
            { title: "Total Circle Area", expression: `\\pi(${r})^2 = 3.14159265 \\times ${r*r} = ${parseFloat(fullA.toFixed(4))}`, note: "Full disk area" },
            { title: "Sector Area Product", expression: `${parseFloat(frac.toFixed(4))} \\times ${parseFloat(fullA.toFixed(4))} = ${cleanSA}`, note: "Multiply fraction by total area" }
          ];
          return {
            formulaStatement: { title: "Area of a Sector", latex: "A_{\\text{sector}} = \\frac{\\theta}{360^\\circ} \\cdot \\pi r^2" },
            givenValues: `\\theta = ${theta}^\\circ, \\quad r = ${r}`,
            substitution: `A = \\frac{${theta}}{360} \\cdot \\pi(${r})^2`,
            intermediateSteps: inter,
            finalResult: `Sector Area = ${cleanSA}`,
            answer: `Sector Area = ${cleanSA}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A_{\\text{sector}} = \\frac{\\theta}{360^\\circ} \\cdot \\pi r^2", note: "Sector area equation" },
              { title: "Step 2: Given Values", expression: `\\theta = ${theta}^\\circ, \\quad r = ${r}`, note: "Parameters" },
              ...inter,
              { title: "Step 5: Final Result", expression: `A_{\\text{sector}} = ${cleanSA}`, note: "Sector area calculated" }
            ]
          };
        }
      },
      {
        id: 'circle_sector_angle',
        title: 'Angle of Each Sector',
        desc: 'Central angle of circular sector: θ = 360° / n or θ = (Arc / 2πr) · 360°',
        latex: '\\theta = \\frac{360^\\circ}{n} = \\frac{L}{2\\pi r} \\times 360^\\circ',
        template: '360 / n',
        vars: [
          { id: 'n_sectors', label: 'Number of Equal Sectors (n)', default: 6, type: 'number' },
          { id: 'radius', label: 'Radius r (optional for arc length)', default: 5, type: 'number' }
        ],
        compute(v) {
          const n = parseFloat(v.n_sectors);
          const r = parseFloat(v.radius || 5);
          if (n <= 0) return { error: "Number of sectors must be positive." };
          const theta = 360 / n;
          const cleanTheta = parseFloat(theta.toFixed(4));
          const arcPerSector = (2 * Math.PI * r) / n;
          const cleanArc = parseFloat(arcPerSector.toFixed(4));
          const inter = [
            { title: "Even Division of Complete Turn (360°)", expression: `\\theta = \\frac{360^\\circ}{${n}} = ${cleanTheta}^\\circ`, note: "Angle allocated to each slice" },
            { title: "Curved Arc Length per Sector", expression: `L_{\\text{sector}} = \\frac{2 \\pi (${r})}{${n}} = ${cleanArc}`, note: "Curved perimeter boundary length" }
          ];
          return {
            formulaStatement: { title: "Angle of Each Sector", latex: "\\theta = \\frac{360^\\circ}{n}" },
            givenValues: `n = ${n} \\text{ sectors}, \\quad r = ${r}`,
            substitution: `\\theta = \\frac{360^\\circ}{${n}} = ${cleanTheta}^\\circ`,
            intermediateSteps: inter,
            finalResult: `Each Sector Angle θ = ${cleanTheta}° (Arc = ${cleanArc})`,
            answer: `θ = ${cleanTheta}°`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\theta = \\frac{360^\\circ}{n}", note: "Circle partition rule" },
              { title: "Step 2: Given Values", expression: `n = ${n}, \\quad r = ${r}`, note: "Total equal slices" },
              ...inter,
              { title: "Step 5: Final Result", expression: `\\theta = ${cleanTheta}^\\circ`, note: "Sector angle evaluated" }
            ]
          };
        }
      }
    ]
  },

  // ================= 15. CYLINDERS =================
  {
    id: 'geometry_cylinders',
    category: 'Geometry',
    subCategory: 'Cylinders',
    title: 'Cylinders',
    subtitle: 'Volume, Curved Surface Area (CSA), and Total Surface Area (TSA)',
    latex: 'V = \\pi r^2 h, \\quad \\text{CSA} = 2\\pi r h, \\quad \\text{TSA} = 2\\pi r(h + r)',
    subFormulas: [
      {
        id: 'cylinder_volume',
        title: 'Cylinder Volume',
        desc: '3D volume capacity: V = πr²h',
        latex: 'V = \\pi r^2 h',
        template: 'pi * r^2 * h',
        vars: [
          { id: 'r', label: 'Radius (r)', default: 4, type: 'number' },
          { id: 'h', label: 'Height (h)', default: 10, type: 'number' }
        ],
        compute(v) {
          const r = parseFloat(v.r);
          const h = parseFloat(v.h);
          if (r <= 0 || h <= 0) return { error: "Radius and height must be positive." };
          const pi = 3.141592653589793;
          const baseArea = pi * r * r;
          const vol = baseArea * h;
          const cleanV = parseFloat(vol.toFixed(4));
          const inter = [
            { title: "Circular Base Area", expression: `A_{\\text{base}} = \\pi r^2 = 3.14159265 \\times (${r})^2 = ${parseFloat(baseArea.toFixed(4))}`, note: "Cross-sectional area" },
            { title: "Multiply by Height", expression: `V = ${parseFloat(baseArea.toFixed(4))} \\times ${h} = ${cleanV}`, note: "Volume = Base × Height" }
          ];
          return {
            formulaStatement: { title: "Cylinder Volume Formula", latex: "V = \\pi r^2 h" },
            givenValues: `r = ${r}, \\quad h = ${h}`,
            substitution: `V = \\pi(${r})^2(${h}) = 3.14159265 \\times ${r*r} \\times ${h}`,
            intermediateSteps: inter,
            finalResult: `Volume V = ${cleanV} (${r*r*h}π)`,
            answer: `Volume V = ${cleanV} (${r*r*h}π)`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "V = \\pi r^2 h", note: "Cylinder volume equation" },
              { title: "Step 2: Given Values", expression: `r = ${r}, \\quad h = ${h}`, note: "Radius and height" },
              ...inter,
              { title: "Step 5: Final Result", expression: `V = ${cleanV}`, note: "Volume determined" }
            ]
          };
        }
      },
      {
        id: 'cylinder_csa',
        title: 'Curved Face / Lateral Surface Area',
        desc: 'Area of curved lateral side excluding top and bottom: CSA = 2πrh',
        latex: '\\text{CSA} = 2\\pi r h',
        template: '2 * pi * r * h',
        vars: [
          { id: 'r', label: 'Radius (r)', default: 5, type: 'number' },
          { id: 'h', label: 'Height (h)', default: 12, type: 'number' }
        ],
        compute(v) {
          const r = parseFloat(v.r);
          const h = parseFloat(v.h);
          if (r <= 0 || h <= 0) return { error: "Radius and height must be positive." };
          const pi = 3.141592653589793;
          const csa = 2 * pi * r * h;
          const cleanCSA = parseFloat(csa.toFixed(4));
          const inter = [
            { title: "Base Perimeter (Circumference)", expression: `C = 2\\pi r = 2(3.14159265)(${r}) = ${parseFloat((2*pi*r).toFixed(4))}`, note: "Unrolled rectangle width" },
            { title: "Lateral Surface Area", expression: `\\text{CSA} = ${parseFloat((2*pi*r).toFixed(4))} \\times ${h} = ${cleanCSA}`, note: "Circumference × Height" }
          ];
          return {
            formulaStatement: { title: "Curved Surface Area of Cylinder", latex: "\\text{CSA} = 2\\pi r h" },
            givenValues: `r = ${r}, \\quad h = ${h}`,
            substitution: `\\text{CSA} = 2(3.14159265)(${r})(${h})`,
            intermediateSteps: inter,
            finalResult: `CSA = ${cleanCSA} (${2*r*h}π)`,
            answer: `CSA = ${cleanCSA} (${2*r*h}π)`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{CSA} = 2\\pi r h", note: "Lateral area rule" },
              { title: "Step 2: Given Values", expression: `r = ${r}, \\quad h = ${h}`, note: "Inputs" },
              ...inter,
              { title: "Step 5: Final Result", expression: `\\text{CSA} = ${cleanCSA}`, note: "CSA evaluated" }
            ]
          };
        }
      },
      {
        id: 'cylinder_tsa',
        title: 'Total Surface Area (TSA)',
        desc: 'Complete area of cylinder including curved face plus top & bottom bases: TSA = 2πr(h + r)',
        latex: '\\text{TSA} = 2\\pi r(h + r) = 2\\pi r h + 2\\pi r^2',
        template: '2 * pi * r * (h + r)',
        vars: [
          { id: 'r', label: 'Radius (r)', default: 3, type: 'number' },
          { id: 'h', label: 'Height (h)', default: 7, type: 'number' }
        ],
        compute(v) {
          const r = parseFloat(v.r);
          const h = parseFloat(v.h);
          if (r <= 0 || h <= 0) return { error: "Radius and height must be positive." };
          const pi = 3.141592653589793;
          const sumHR = h + r;
          const tsa = 2 * pi * r * sumHR;
          const cleanTSA = parseFloat(tsa.toFixed(4));
          const inter = [
            { title: "Sum of Height and Radius", expression: `h + r = ${h} + ${r} = ${sumHR}`, note: "Combined dimension factor" },
            { title: "Total Surface Area", expression: `\\text{TSA} = 2\\pi(${r})(${sumHR}) = 2(3.14159265)(${r})(${sumHR}) = ${cleanTSA}`, note: "Total 3D surface area" }
          ];
          return {
            formulaStatement: { title: "Total Surface Area of Cylinder", latex: "\\text{TSA} = 2\\pi r(h + r)" },
            givenValues: `r = ${r}, \\quad h = ${h}`,
            substitution: `\\text{TSA} = 2\\pi(${r})(${h} + ${r})`,
            intermediateSteps: inter,
            finalResult: `TSA = ${cleanTSA} (${2*r*sumHR}π)`,
            answer: `TSA = ${cleanTSA} (${2*r*sumHR}π)`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{TSA} = 2\\pi r(h + r)", note: "Total surface area formula" },
              { title: "Step 2: Given Values", expression: `r = ${r}, \\quad h = ${h}`, note: "Parameters" },
              ...inter,
              { title: "Step 5: Final Result", expression: `\\text{TSA} = ${cleanTSA}`, note: "TSA computed" }
            ]
          };
        }
      }
    ]
  },

  // ================= 16. PRISMS & CUBES =================
  {
    id: 'geometry_prisms_cubes',
    category: 'Geometry',
    subCategory: 'Prisms & Cubes',
    title: 'Prisms & Cubes',
    subtitle: 'Cube Area/Volume, Rectangular Prism (Cuboid) TSA, and Right Prism Surface Area',
    latex: 'A_{\\text{cube}} = 6a^2, \\quad V_{\\text{cube}} = a^3, \\quad \\text{TSA}_{\\text{cuboid}} = 2(lw + lh + wh), \\quad A_{\\text{prism}} = P_{\\text{base}} h + 2A_{\\text{base}}',
    subFormulas: [
      {
        id: 'cube_area',
        title: 'Total Surface Area of Cube',
        desc: 'Surface area of 6 square faces: A = 6a²',
        latex: 'A = 6a^2',
        template: '6 * a^2',
        vars: [
          { id: 'a', label: 'Edge Length (a)', default: 4, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          if (a <= 0) return { error: "Edge length must be positive." };
          const a2 = a * a;
          const sa = 6 * a2;
          const inter = [
            { title: "Area of Single Face", expression: `a^2 = (${a})^2 = ${a2}`, note: "Each face is an identical square" },
            { title: "Multiply by 6 Faces", expression: `6 \\times ${a2} = ${sa}`, note: "Total exposed surface area" }
          ];
          return {
            formulaStatement: { title: "Cube Total Surface Area", latex: "A = 6a^2" },
            givenValues: `a = ${a}`,
            substitution: `A = 6(${a})^2`,
            intermediateSteps: inter,
            finalResult: `Surface Area A = ${sa}`,
            answer: `A = ${sa}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A = 6a^2", note: "Cube surface area formula" },
              { title: "Step 2: Given Values", expression: `a = ${a}`, note: "Side length" },
              ...inter,
              { title: "Step 5: Final Result", expression: `A = ${sa}`, note: "Area evaluated" }
            ]
          };
        }
      },
      {
        id: 'cube_volume',
        title: 'Volume of Cube',
        desc: 'Three-dimensional capacity of cube: V = a³',
        latex: 'V = a^3',
        template: 'a^3',
        vars: [
          { id: 'a', label: 'Edge Length (a)', default: 4, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          if (a <= 0) return { error: "Edge length must be positive." };
          const vol = a * a * a;
          const inter = [
            { title: "Base Area", expression: `a^2 = (${a})^2 = ${a*a}`, note: "Square footprint" },
            { title: "Multiply by Height", expression: `(${a*a}) \\times ${a} = ${vol}`, note: "Extrude to third dimension" }
          ];
          return {
            formulaStatement: { title: "Cube Volume Formula", latex: "V = a^3" },
            givenValues: `a = ${a}`,
            substitution: `V = (${a})^3`,
            intermediateSteps: inter,
            finalResult: `Volume V = ${vol}`,
            answer: `V = ${vol}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "V = a^3", note: "Cube volume formula" },
              { title: "Step 2: Given Values", expression: `a = ${a}`, note: "Edge dimension" },
              ...inter,
              { title: "Step 5: Final Result", expression: `V = ${vol}`, note: "Volume calculated" }
            ]
          };
        }
      },
      {
        id: 'rect_prism_tsa',
        title: 'Total Surface Area of Rectangular Prism / Box',
        desc: 'Surface area of 3D cuboid box: TSA = 2(lw + lh + wh)',
        latex: '\\text{TSA} = 2(lw + lh + wh)',
        template: '2 * (l*w + l*h + w*h)',
        vars: [
          { id: 'l', label: 'Length (l)', default: 8, type: 'number' },
          { id: 'w', label: 'Width (w)', default: 5, type: 'number' },
          { id: 'h', label: 'Height (h)', default: 3, type: 'number' }
        ],
        compute(v) {
          const l = parseFloat(v.l), w = parseFloat(v.w), h = parseFloat(v.h);
          if (l <= 0 || w <= 0 || h <= 0) return { error: "Dimensions must be positive." };
          const lw = l * w, lh = l * h, wh = w * h;
          const sumPairs = lw + lh + wh;
          const tsa = 2 * sumPairs;
          const inter = [
            { title: "Face Pair Areas", expression: `lw = ${l} \\times ${w} = ${lw}, \\quad lh = ${l} \\times ${h} = ${lh}, \\quad wh = ${w} \\times ${h} = ${wh}`, note: "Top/bottom, front/back, left/right faces" },
            { title: "Sum of Unique Face Areas", expression: `lw + lh + wh = ${lw} + ${lh} + ${wh} = ${sumPairs}`, note: "Half of total surface" },
            { title: "Total Surface Area (TSA)", expression: `2(${sumPairs}) = ${tsa}`, note: "Multiply by 2 for opposing faces" }
          ];
          return {
            formulaStatement: { title: "Rectangular Prism Total Surface Area", latex: "\\text{TSA} = 2(lw + lh + wh)" },
            givenValues: `l = ${l}, \\quad w = ${w}, \\quad h = ${h}`,
            substitution: `\\text{TSA} = 2((${l})(${w}) + (${l})(${h}) + (${w})(${h}))`,
            intermediateSteps: inter,
            finalResult: `Total Surface Area = ${tsa}`,
            answer: `TSA = ${tsa}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{TSA} = 2(lw + lh + wh)", note: "Cuboid TSA formula" },
              { title: "Step 2: Given Values", expression: `l = ${l}, \\quad w = ${w}, \\quad h = ${h}`, note: "Three dimensions" },
              ...inter,
              { title: "Step 5: Final Result", expression: `\\text{TSA} = ${tsa}`, note: "Surface area evaluated" }
            ]
          };
        }
      },
      {
        id: 'rect_prism_volume',
        title: 'Volume of Rectangular Prism / Box',
        desc: 'Capacity of 3D box: V = l · w · h',
        latex: 'V = l \\cdot w \\cdot h',
        template: 'l * w * h',
        vars: [
          { id: 'l', label: 'Length (l)', default: 8, type: 'number' },
          { id: 'w', label: 'Width (w)', default: 5, type: 'number' },
          { id: 'h', label: 'Height (h)', default: 3, type: 'number' }
        ],
        compute(v) {
          const l = parseFloat(v.l), w = parseFloat(v.w), h = parseFloat(v.h);
          if (l <= 0 || w <= 0 || h <= 0) return { error: "Dimensions must be positive." };
          const vol = l * w * h;
          const inter = [
            { title: "Base Footprint Area", expression: `l \\times w = ${l} \\times ${w} = ${l*w}`, note: "Bottom face area" },
            { title: "Multiply by Height", expression: `(${l*w}) \\times ${h} = ${vol}`, note: "Volume enclosed" }
          ];
          return {
            formulaStatement: { title: "Rectangular Prism Volume", latex: "V = l \\cdot w \\cdot h" },
            givenValues: `l = ${l}, \\quad w = ${w}, \\quad h = ${h}`,
            substitution: `V = (${l})(${w})(${h})`,
            intermediateSteps: inter,
            finalResult: `Volume V = ${vol}`,
            answer: `V = ${vol}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "V = l \\cdot w \\cdot h", note: "Prism volume formula" },
              { title: "Step 2: Given Values", expression: `l = ${l}, \\quad w = ${w}, \\quad h = ${h}`, note: "Edge dimensions" },
              ...inter,
              { title: "Step 5: Final Result", expression: `V = ${vol}`, note: "Volume evaluated" }
            ]
          };
        }
      },
      {
        id: 'right_prism_area',
        title: 'Area of Right Prism',
        desc: 'Surface area from base perimeter P, height h, and base area A: Area = P_base · h + 2 · A_base',
        latex: 'A_{\\text{prism}} = P_{\\text{base}} \\cdot h + 2 \\cdot A_{\\text{base}}',
        template: 'P_base * h + 2 * A_base',
        vars: [
          { id: 'p', label: 'Base Perimeter (P_base)', default: 24, type: 'number' },
          { id: 'h', label: 'Height of Prism (h)', default: 10, type: 'number' },
          { id: 'ab', label: 'Base Area (A_base)', default: 30, type: 'number' }
        ],
        compute(v) {
          const p = parseFloat(v.p), h = parseFloat(v.h), ab = parseFloat(v.ab);
          if (p <= 0 || h <= 0 || ab <= 0) return { error: "Perimeter, height, and area must be positive." };
          const lateral = p * h;
          const bases = 2 * ab;
          const total = lateral + bases;
          const inter = [
            { title: "Lateral Surface Area", expression: `A_{\\text{lat}} = P_{\\text{base}} \\cdot h = ${p} \\times ${h} = ${lateral}`, note: "Sides unrolled" },
            { title: "Area of Both Bases", expression: `2 \\cdot A_{\\text{base}} = 2 \\times ${ab} = ${bases}`, note: "Top and bottom identical bases" },
            { title: "Total Surface Area", expression: `${lateral} + ${bases} = ${total}`, note: "Lateral + Bases" }
          ];
          return {
            formulaStatement: { title: "Right Prism Surface Area", latex: "A_{\\text{prism}} = P_{\\text{base}} \\cdot h + 2 A_{\\text{base}}" },
            givenValues: `P_{\\text{base}} = ${p}, \\quad h = ${h}, \\quad A_{\\text{base}} = ${ab}`,
            substitution: `A = (${p})(${h}) + 2(${ab})`,
            intermediateSteps: inter,
            finalResult: `Total Area = ${total}`,
            answer: `Total Area = ${total}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A_{\\text{prism}} = P_{\\text{base}} h + 2A_{\\text{base}}", note: "Right prism area theorem" },
              { title: "Step 2: Given Values", expression: `P = ${p}, \\quad h = ${h}, \\quad A_b = ${ab}`, note: "Geometric inputs" },
              ...inter,
              { title: "Step 5: Final Result", expression: `A = ${total}`, note: "Total area calculated" }
            ]
          };
        }
      },
      {
        id: 'right_prism_volume',
        title: 'Volume of Right Prism',
        desc: 'Volume of right prism from base area and height: V = A_base · h',
        latex: 'V_{\\text{prism}} = A_{\\text{base}} \\cdot h',
        template: 'A_base * h',
        vars: [
          { id: 'ab', label: 'Base Area (A_base)', default: 30, type: 'number' },
          { id: 'h', label: 'Height of Prism (h)', default: 10, type: 'number' }
        ],
        compute(v) {
          const ab = parseFloat(v.ab), h = parseFloat(v.h);
          if (ab <= 0 || h <= 0) return { error: "Base area and height must be positive." };
          const vol = ab * h;
          const inter = [
            { title: "Base Footprint Area", expression: `A_{\\text{base}} = ${ab}`, note: "Area of identical polygon end" },
            { title: "Multiply by Height", expression: `${ab} \\times ${h} = ${vol}`, note: "Cross-sectional extrusion" }
          ];
          return {
            formulaStatement: { title: "Right Prism Volume", latex: "V = A_{\\text{base}} \\cdot h" },
            givenValues: `A_{\\text{base}} = ${ab}, \\quad h = ${h}`,
            substitution: `V = (${ab})(${h})`,
            intermediateSteps: inter,
            finalResult: `Volume V = ${vol}`,
            answer: `V = ${vol}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "V = A_{\\text{base}} \\cdot h", note: "General right prism volume rule" },
              { title: "Step 2: Given Values", expression: `A_b = ${ab}, \\quad h = ${h}`, note: "Area and height" },
              ...inter,
              { title: "Step 5: Final Result", expression: `V = ${vol}`, note: "Volume evaluated" }
            ]
          };
        }
      }
    ]
  },

  // ================= 17. POLYGONS =================
  {
    id: 'geometry_polygons',
    category: 'Geometry',
    subCategory: 'Polygons',
    title: 'Polygons',
    subtitle: 'Sum & Individual Interior and Exterior Angles of any n-sided Polygon',
    latex: 'S_{\\text{int}} = (n - 2) \\times 180^\\circ, \\quad I_{\\text{reg}} = \\frac{(n-2) \\times 180^\\circ}{n}, \\quad S_{\\text{ext}} = 360^\\circ, \\quad E_{\\text{reg}} = \\frac{360^\\circ}{n}',
    subFormulas: [
      {
        id: 'polygon_interior_sum',
        title: 'Sum of Interior Angles',
        desc: 'Total sum of interior angles of any convex n-gon: S = (n - 2) × 180°',
        latex: 'S_{\\text{int}} = (n - 2) \\times 180^\\circ',
        template: '(n - 2) * 180',
        vars: [
          { id: 'n', label: 'Number of Sides (n)', default: 6, type: 'number' }
        ],
        compute(v) {
          const n = parseInt(v.n, 10);
          if (n < 3) return { error: "A polygon must have at least 3 sides (n ≥ 3)." };
          const triangles = n - 2;
          const sum = triangles * 180;
          const inter = [
            { title: "Triangulation Factor (n - 2)", expression: `n - 2 = ${n} - 2 = ${triangles}`, note: "Polygon can be dissected into (n - 2) non-overlapping triangles" },
            { title: "Multiply by 180° per Triangle", expression: `${triangles} \\times 180^\\circ = ${sum}^\\circ`, note: "Sum of all interior angles" }
          ];
          return {
            formulaStatement: { title: "Polygon Interior Angle Sum", latex: "S_{\\text{int}} = (n - 2) \\times 180^\\circ" },
            givenValues: `n = ${n} \\text{ sides}`,
            substitution: `S = (${n} - 2) \\times 180^\\circ`,
            intermediateSteps: inter,
            finalResult: `Interior Angle Sum = ${sum}°`,
            answer: `Interior Sum = ${sum}°`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "S = (n - 2) \\times 180^\\circ", note: "Interior angle theorem" },
              { title: "Step 2: Given Values", expression: `n = ${n}`, note: "Side count" },
              ...inter,
              { title: "Step 5: Final Result", expression: `S = ${sum}^\\circ`, note: "Angle sum evaluated" }
            ]
          };
        }
      },
      {
        id: 'polygon_interior_each',
        title: 'Each Interior Angle of Regular Polygon',
        desc: 'Measure of each equal angle in regular equiangular polygon: I = ((n - 2) × 180°) / n',
        latex: 'I_{\\text{reg}} = \\frac{(n - 2) \\times 180^\\circ}{n}',
        template: '((n - 2) * 180) / n',
        vars: [
          { id: 'n', label: 'Number of Sides (n)', default: 8, type: 'number' }
        ],
        compute(v) {
          const n = parseInt(v.n, 10);
          if (n < 3) return { error: "A polygon must have at least 3 sides." };
          const sum = (n - 2) * 180;
          const each = sum / n;
          const cleanEach = Number.isInteger(each) ? each : parseFloat(each.toFixed(4));
          const inter = [
            { title: "Total Interior Angle Sum", expression: `S = (${n} - 2) \\times 180^\\circ = ${sum}^\\circ`, note: "Combined sum" },
            { title: "Divide by Number of Vertices (n)", expression: `\\frac{${sum}^\\circ}{${n}} = ${cleanEach}^\\circ`, note: "Symmetric equiangular division" }
          ];
          return {
            formulaStatement: { title: "Regular Polygon Interior Angle", latex: "I_{\\text{reg}} = \\frac{(n - 2) \\times 180^\\circ}{n}" },
            givenValues: `n = ${n}`,
            substitution: `I = \\frac{(${n} - 2) \\times 180^\\circ}{${n}}`,
            intermediateSteps: inter,
            finalResult: `Each Interior Angle = ${cleanEach}°`,
            answer: `Each Interior Angle = ${cleanEach}°`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "I = \\frac{(n - 2) \\times 180^\\circ}{n}", note: "Regular polygon angle rule" },
              { title: "Step 2: Given Values", expression: `n = ${n}`, note: "Side count" },
              ...inter,
              { title: "Step 5: Final Result", expression: `I = ${cleanEach}^\\circ`, note: "Each interior angle determined" }
            ]
          };
        }
      },
      {
        id: 'polygon_exterior_sum',
        title: 'Sum of Exterior Angles',
        desc: 'For ANY convex polygon regardless of side count, sum of exterior angles is always 360°',
        latex: 'S_{\\text{ext}} = 360^\\circ',
        template: '360',
        vars: [
          { id: 'n', label: 'Number of Sides (n)', default: 5, type: 'number' }
        ],
        compute(v) {
          const n = parseInt(v.n, 10);
          if (n < 3) return { error: "Must have at least 3 sides." };
          const inter = [
            { title: "Complete Turn Theorem", expression: "\\sum \\theta_{\\text{ext}} = 360^\\circ", note: "Walking along all exterior edges completes exactly one 360° rotation" }
          ];
          return {
            formulaStatement: { title: "Exterior Angle Sum Theorem", latex: "S_{\\text{ext}} = 360^\\circ" },
            givenValues: `n = ${n} \\text{ sides}`,
            substitution: `S_{\\text{ext}} = 360^\\circ`,
            intermediateSteps: inter,
            finalResult: `Sum of Exterior Angles = 360°`,
            answer: `Sum of Exterior Angles = 360°`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "S_{\\text{ext}} = 360^\\circ", note: "Universal polygon theorem" },
              { title: "Step 2: Given Values", expression: `n = ${n}`, note: "Valid for all n ≥ 3" },
              ...inter,
              { title: "Step 5: Final Result", expression: "360^\\circ", note: "Constant for all convex polygons" }
            ]
          };
        }
      },
      {
        id: 'polygon_exterior_each',
        title: 'Each Exterior Angle of Regular Polygon',
        desc: 'Measure of each equal exterior angle in regular polygon: E = 360° / n',
        latex: 'E_{\\text{reg}} = \\frac{360^\\circ}{n}',
        template: '360 / n',
        vars: [
          { id: 'n', label: 'Number of Sides (n)', default: 6, type: 'number' }
        ],
        compute(v) {
          const n = parseInt(v.n, 10);
          if (n < 3) return { error: "Must have at least 3 sides." };
          const e = 360 / n;
          const cleanE = Number.isInteger(e) ? e : parseFloat(e.toFixed(4));
          const inter = [
            { title: "Divide 360° by n Vertices", expression: `\\frac{360^\\circ}{${n}} = ${cleanE}^\\circ`, note: "Even distribution around regular perimeter" },
            { title: "Supplementary Check", expression: `${cleanE}^\\circ + ${180 - cleanE}^\\circ = 180^\\circ`, note: "Interior + Exterior = 180° (linear pair)" }
          ];
          return {
            formulaStatement: { title: "Regular Polygon Exterior Angle", latex: "E_{\\text{reg}} = \\frac{360^\\circ}{n}" },
            givenValues: `n = ${n}`,
            substitution: `E = \\frac{360^\\circ}{${n}}`,
            intermediateSteps: inter,
            finalResult: `Each Exterior Angle = ${cleanE}°`,
            answer: `Each Exterior Angle = ${cleanE}°`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "E = \\frac{360^\\circ}{n}", note: "Regular exterior angle formula" },
              { title: "Step 2: Given Values", expression: `n = ${n}`, note: "Number of sides" },
              ...inter,
              { title: "Step 5: Final Result", expression: `E = ${cleanE}^\\circ`, note: "Angle determined" }
            ]
          };
        }
      }
    ]
  },

  // ================= 18. TRIGONOMETRY =================
  {
    id: 'trigonometry_rules',
    category: 'Trigonometry',
    subCategory: 'Trig Identities',
    title: 'Trigonometric Rules & Identities',
    subtitle: 'SOH-CAH-TOA, Law of Sines, Law of Cosines, and Pythagorean Trig Identity',
    latex: '\\sin\\theta = \\frac{O}{H}, \\quad \\frac{a}{\\sin A} = \\frac{b}{\\sin B}, \\quad c^2 = a^2 + b^2 - 2ab\\cos C, \\quad \\sin^2\\theta + \\cos^2\\theta = 1',
    subFormulas: [
      {
        id: 'soh_cah_toa',
        title: 'SOH-CAH-TOA (Right Triangle Ratios)',
        desc: 'Calculate sin, cos, and tan from opposite, adjacent, and hypotenuse lengths',
        latex: '\\sin\\theta = \\frac{O}{H}, \\quad \\cos\\theta = \\frac{A}{H}, \\quad \\tan\\theta = \\frac{O}{A}',
        template: 'sin = O/H, cos = A/H, tan = O/A',
        vars: [
          { id: 'opp', label: 'Opposite Side (O)', default: 3, type: 'number' },
          { id: 'adj', label: 'Adjacent Side (A)', default: 4, type: 'number' },
          { id: 'hyp', label: 'Hypotenuse Side (H)', default: 5, type: 'number' }
        ],
        compute(v) {
          const o = parseFloat(v.opp), a = parseFloat(v.adj), h = parseFloat(v.hyp);
          if (o <= 0 || a <= 0 || h <= 0) return { error: "Side lengths must be positive." };
          const s = parseFloat((o / h).toFixed(4));
          const c = parseFloat((a / h).toFixed(4));
          const t = parseFloat((o / a).toFixed(4));
          const angleDeg = parseFloat((Math.asin(o / h) * 180 / Math.PI).toFixed(2));
          const inter = [
            { title: "Sine (Opposite / Hypotenuse)", expression: `\\sin\\theta = \\frac{${o}}{${h}} = ${s}`, note: "SOH ratio" },
            { title: "Cosine (Adjacent / Hypotenuse)", expression: `\\cos\\theta = \\frac{${a}}{${h}} = ${c}`, note: "CAH ratio" },
            { title: "Tangent (Opposite / Adjacent)", expression: `\\tan\\theta = \\frac{${o}}{${a}} = ${t}`, note: "TOA ratio" },
            { title: "Angle θ", expression: `\\theta = \\arcsin(${s}) = ${angleDeg}^\\circ`, note: "Angle in degrees" }
          ];
          return {
            formulaStatement: { title: "SOH-CAH-TOA Definitions", latex: "\\sin\\theta = \\frac{O}{H}, \\ \\cos\\theta = \\frac{A}{H}, \\ \\tan\\theta = \\frac{O}{A}" },
            givenValues: `O = ${o}, \\quad A = ${a}, \\quad H = ${h}`,
            substitution: `\\sin\\theta = \\frac{${o}}{${h}}, \\ \\cos\\theta = \\frac{${a}}{${h}}, \\ \\tan\\theta = \\frac{${o}}{${a}}`,
            intermediateSteps: inter,
            finalResult: `sin = ${s}, cos = ${c}, tan = ${t} (θ = ${angleDeg}°)`,
            answer: `sin=${s}, cos=${c}, tan=${t}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{SOH-CAH-TOA}", note: "Right triangle definitions" },
              { title: "Step 2: Given Values", expression: `O=${o}, A=${a}, H=${h}`, note: "Sides" },
              ...inter,
              { title: "Step 5: Final Result", expression: `\\theta = ${angleDeg}^\\circ`, note: "Ratios evaluated" }
            ]
          };
        }
      },
      {
        id: 'sine_rule',
        title: 'Law of Sines',
        desc: 'Relate sides and opposite angles of any triangle: a / sin(A) = b / sin(B)',
        latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} \\implies b = \\frac{a \\cdot \\sin B}{\\sin A}',
        template: 'b = (a * sin(B)) / sin(A)',
        vars: [
          { id: 'a', label: 'Side a', default: 10, type: 'number' },
          { id: 'angleA', label: 'Angle A (degrees)', default: 30, type: 'number' },
          { id: 'angleB', label: 'Angle B (degrees)', default: 45, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const A = parseFloat(v.angleA);
          const B = parseFloat(v.angleB);
          if (a <= 0 || A <= 0 || B <= 0 || A >= 180 || B >= 180 || A + B >= 180) return { error: "Please enter valid triangle parameters (angles > 0 and sum < 180°)." };
          const radA = A * (Math.PI / 180);
          const radB = B * (Math.PI / 180);
          const sinA = Math.sin(radA);
          const sinB = Math.sin(radB);
          const b = (a * sinB) / sinA;
          const cleanB = parseFloat(b.toFixed(4));
          const inter = [
            { title: "Angle Sines", expression: `\\sin(${A}^\\circ) = ${parseFloat(sinA.toFixed(4))}, \\quad \\sin(${B}^\\circ) = ${parseFloat(sinB.toFixed(4))}`, note: "Evaluate sines" },
            { title: "Law of Sines Ratio", expression: `\\frac{a}{\\sin A} = \\frac{${a}}{${parseFloat(sinA.toFixed(4))}} = ${parseFloat((a/sinA).toFixed(4))}`, note: "Diameter of circumcircle" },
            { title: "Solve for Side b", expression: `b = ${parseFloat((a/sinA).toFixed(4))} \\times ${parseFloat(sinB.toFixed(4))} = ${cleanB}`, note: "Cross-multiply" }
          ];
          return {
            formulaStatement: { title: "Law of Sines", latex: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B}" },
            givenValues: `a = ${a}, \\quad A = ${A}^\\circ, \\quad B = ${B}^\\circ`,
            substitution: `b = \\frac{${a} \\cdot \\sin(${B}^\\circ)}{\\sin(${A}^\\circ)}`,
            intermediateSteps: inter,
            finalResult: `Side b = ${cleanB}`,
            answer: `Side b = ${cleanB}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B}", note: "Law of Sines theorem" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad A = ${A}^\\circ, \\quad B = ${B}^\\circ`, note: "Inputs" },
              ...inter,
              { title: "Step 5: Final Result", expression: `b = ${cleanB}`, note: "Side determined" }
            ]
          };
        }
      },
      {
        id: 'cosine_rule',
        title: 'Law of Cosines',
        desc: 'Find unknown side c from sides a, b and included angle C: c² = a² + b² - 2ab cos(C)',
        latex: 'c = \\sqrt{a^2 + b^2 - 2ab\\cos C}',
        template: 'c = sqrt(a^2 + b^2 - 2*a*b*cos(C))',
        vars: [
          { id: 'a', label: 'Side a', default: 8, type: 'number' },
          { id: 'b', label: 'Side b', default: 11, type: 'number' },
          { id: 'angleC', label: 'Angle C (degrees)', default: 60, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          const C = parseFloat(v.angleC);
          if (a <= 0 || b <= 0 || C <= 0 || C >= 180) return { error: "Please enter valid triangle side and angle dimensions." };
          const radC = C * (Math.PI / 180);
          const cosC = Math.cos(radC);
          const c2 = a * a + b * b - 2 * a * b * cosC;
          const c = Math.sqrt(c2);
          const cleanC = parseFloat(c.toFixed(4));
          const inter = [
            { title: "Sides Squared", expression: `a^2 + b^2 = (${a})^2 + (${b})^2 = ${a*a} + ${b*b} = ${a*a + b*b}`, note: "Sum of squares" },
            { title: "Cosine Term", expression: `2ab \\cos C = 2(${a})(${b}) \\cos(${C}^\\circ) = ${2*a*b} \\times ${parseFloat(cosC.toFixed(4))} = ${parseFloat((2*a*b*cosC).toFixed(4))}`, note: "Correction factor" },
            { title: "c² and Square Root", expression: `c^2 = ${parseFloat(c2.toFixed(4))} \\implies c = ${cleanC}`, note: "Final side length" }
          ];
          return {
            formulaStatement: { title: "Law of Cosines", latex: "c^2 = a^2 + b^2 - 2ab\\cos C" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad C = ${C}^\\circ`,
            substitution: `c = \\sqrt{(${a})^2 + (${b})^2 - 2(${a})(${b})\\cos(${C}^\\circ)}`,
            intermediateSteps: inter,
            finalResult: `Side c = ${cleanC}`,
            answer: `Side c = ${cleanC}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "c^2 = a^2 + b^2 - 2ab\\cos C", note: "Law of Cosines theorem" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad b = ${b}, \\quad C = ${C}^\\circ`, note: "Inputs" },
              ...inter,
              { title: "Step 5: Final Result", expression: `c = ${cleanC}`, note: "Side determined" }
            ]
          };
        }
      }
    ]
  }
];
