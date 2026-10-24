/**
 * FORMULA GROUPS 1-7:
 * Pricing, Profit/Loss, Commercial Math, Interest, Roots, Exponents, Number Theory
 */
const FORMULA_GROUPS_1 = [
  // ================= 1. BUSINESS & COMMERCIAL PRICING =================
  {
    id: 'pricing',
    category: 'Business',
    subCategory: 'Pricing',
    title: 'Markup & Pricing',
    subtitle: 'Formulas for Markup Amount, Selling Price, Cost Price, and Margin %',
    latex: '\\text{Markup} = \\text{CP} \\cdot \\frac{M}{100}, \\quad \\text{SP} = \\text{CP} + \\text{Markup}',
    subFormulas: [
      {
        id: 'markup_amt',
        title: 'Markup Amount Calculator',
        desc: 'Calculate dollar markup addition from cost price and percentage',
        latex: '\\text{Markup} = \\text{Cost Price (CP)} \\times \\frac{\\text{Markup \\% (M)}}{100}',
        template: 'CP * (M / 100)',
        vars: [
          { id: 'cp', label: 'Cost Price ($)', default: 120, type: 'number' },
          { id: 'm', label: 'Markup Percentage (M %)', default: 25, type: 'number' }
        ],
        compute(v) {
          const cp = parseFloat(v.cp);
          const m = parseFloat(v.m);
          if (cp <= 0) return { error: "Cost Price must be greater than zero." };
          if (m < 0) return { error: "Markup percentage cannot be negative." };
          const markupVal = cp * (m / 100);
          const sp = cp + markupVal;
          const inter = [
            { title: "Convert Markup to Decimal", expression: `\\frac{${m}}{100} = ${m/100}`, note: "Divide percentage by 100" },
            { title: "Multiply by Cost", expression: `${cp} \\times ${m/100} = \\$${parseFloat(markupVal.toFixed(2))}`, note: "Calculate absolute monetary markup" },
            { title: "Resulting Selling Price", expression: `\\text{SP} = ${cp} + ${parseFloat(markupVal.toFixed(2))} = \\$${parseFloat(sp.toFixed(2))}`, note: "Customer retail price" }
          ];
          return {
            formulaStatement: { title: "Markup Amount Formula", latex: "\\text{Markup} = \\text{CP} \\times \\frac{M}{100}" },
            givenValues: `\\text{CP} = \\$${cp}, \\quad M = ${m}\\%`,
            substitution: `\\text{Markup} = ${cp} \\times \\frac{${m}}{100}`,
            intermediateSteps: inter,
            finalResult: `Markup = $${parseFloat(markupVal.toFixed(2))}`,
            answer: `Markup = $${parseFloat(markupVal.toFixed(2))}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{Markup} = \\text{CP} \\times \\frac{M}{100}", note: "Base commercial markup equation" },
              { title: "Step 2: Given Values", expression: `\\text{CP} = \\$${cp}, \\quad M = ${m}\\%`, note: "Wholesale cost and markup rate" },
              { title: "Step 3: Substitution", expression: `\\text{Markup} = ${cp} \\times \\frac{${m}}{100}`, note: "Plug known variables into equation" },
              { title: "Step 4: Intermediate Simplification", expression: `${cp} \\times ${m/100} = \\$${parseFloat(markupVal.toFixed(2))}`, note: "Multiply cost by rate" },
              { title: "Step 5: Final Result", expression: `\\text{Markup} = \\$${parseFloat(markupVal.toFixed(2))}, \\quad \\text{SP} = \\$${parseFloat(sp.toFixed(2))}`, note: "Completed commercial calculation" }
            ]
          };
        }
      },
      {
        id: 'selling_price_calc',
        title: 'Selling Price from Markup',
        desc: 'Calculate final selling price directly from cost price and markup percentage',
        latex: '\\text{Selling Price (SP)} = \\text{CP} \\times \\left(1 + \\frac{M}{100}\\right)',
        template: 'CP * (1 + M / 100)',
        vars: [
          { id: 'cp', label: 'Cost Price ($)', default: 80, type: 'number' },
          { id: 'm', label: 'Markup Percentage (M %)', default: 40, type: 'number' }
        ],
        compute(v) {
          const cp = parseFloat(v.cp);
          const m = parseFloat(v.m);
          if (cp <= 0) return { error: "Cost Price must be greater than zero." };
          if (m < 0) return { error: "Markup percentage cannot be negative." };
          const mult = 1 + (m / 100);
          const sp = cp * mult;
          const inter = [
            { title: "Calculate Multiplier", expression: `1 + \\frac{${m}}{100} = 1 + ${m/100} = ${mult}`, note: "Effective pricing ratio" },
            { title: "Multiply by Cost", expression: `${cp} \\times ${mult} = \\$${parseFloat(sp.toFixed(2))}`, note: "Apply pricing factor" }
          ];
          return {
            formulaStatement: { title: "Selling Price Equation", latex: "\\text{SP} = \\text{CP} \\times \\left(1 + \\frac{M}{100}\\right)" },
            givenValues: `\\text{CP} = \\$${cp}, \\quad M = ${m}\\%`,
            substitution: `\\text{SP} = ${cp} \\times \\left(1 + \\frac{${m}}{100}\\right)`,
            intermediateSteps: inter,
            finalResult: `Selling Price = $${parseFloat(sp.toFixed(2))}`,
            answer: `Selling Price = $${parseFloat(sp.toFixed(2))}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{SP} = \\text{CP} \\times (1 + M/100)", note: "Direct selling price formula" },
              { title: "Step 2: Given Values", expression: `\\text{CP} = \\$${cp}, \\quad M = ${m}\\%`, note: "Wholesale cost and markup percentage" },
              { title: "Step 3: Substitution", expression: `\\text{SP} = ${cp} \\times (1 + ${m}/100)`, note: "Substitute into formula" },
              { title: "Step 4: Intermediate Simplification", expression: `1 + ${m/100} = ${mult} \\implies ${cp} \\times ${mult} = ${parseFloat(sp.toFixed(2))}`, note: "Evaluate arithmetic terms" },
              { title: "Step 5: Final Result", expression: `\\text{SP} = \\$${parseFloat(sp.toFixed(2))}`, note: "Final consumer price" }
            ]
          };
        }
      },
      {
        id: 'cost_price_calc',
        title: 'Cost Price from Selling Price & Markup',
        desc: 'Back-calculate original wholesale cost when retail price and markup rate are known',
        latex: '\\text{Cost Price (CP)} = \\frac{\\text{Selling Price (SP)}}{1 + \\frac{M}{100}}',
        template: 'SP / (1 + M / 100)',
        vars: [
          { id: 'sp', label: 'Selling Price ($)', default: 150, type: 'number' },
          { id: 'm', label: 'Markup Percentage (M %)', default: 50, type: 'number' }
        ],
        compute(v) {
          const sp = parseFloat(v.sp);
          const m = parseFloat(v.m);
          if (sp <= 0) return { error: "Selling Price must be greater than zero." };
          if (m < 0) return { error: "Markup percentage cannot be negative." };
          const div = 1 + (m / 100);
          const cp = sp / div;
          return {
            formulaStatement: { title: "Cost Price Inversion Formula", latex: "\\text{CP} = \\frac{\\text{SP}}{1 + \\frac{M}{100}}" },
            givenValues: `\\text{SP} = \\$${sp}, \\quad M = ${m}\\%`,
            substitution: `\\text{CP} = \\frac{${sp}}{1 + \\frac{${m}}{100}}`,
            intermediateSteps: [
              { title: "Denominator Evaluation", expression: `1 + \\frac{${m}}{100} = 1 + ${m/100} = ${div}`, note: "Markup coefficient" },
              { title: "Division", expression: `\\frac{${sp}}{${div}} = \\$${parseFloat(cp.toFixed(2))}`, note: "Recover base wholesale cost" }
            ],
            finalResult: `Cost Price = $${parseFloat(cp.toFixed(2))}`,
            answer: `Cost Price = $${parseFloat(cp.toFixed(2))}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{CP} = \\frac{\\text{SP}}{1 + M/100}", note: "Inverted markup formula" },
              { title: "Step 2: Given Values", expression: `\\text{SP} = \\$${sp}, \\quad M = ${m}\\%`, note: "Retail target and markup %" },
              { title: "Step 3: Substitution", expression: `\\text{CP} = \\frac{${sp}}{1 + ${m}/100}`, note: "Insert known parameters" },
              { title: "Step 4: Intermediate Simplification", expression: `\\frac{${sp}}{${div}} = \\$${parseFloat(cp.toFixed(2))}`, note: "Perform division" },
              { title: "Step 5: Final Result", expression: `\\text{Cost Price (CP)} = \\$${parseFloat(cp.toFixed(2))}`, note: "Wholesale cost" }
            ]
          };
        }
      },
      {
        id: 'margin_pct',
        title: 'Profit Margin Percentage',
        desc: 'Calculate profit margin as a percentage of selling price',
        latex: '\\text{Margin \\%} = \\frac{\\text{SP} - \\text{CP}}{\\text{SP}} \\times 100',
        template: '((SP - CP) / SP) * 100',
        vars: [
          { id: 'cp', label: 'Cost Price ($)', default: 75, type: 'number' },
          { id: 'sp', label: 'Selling Price ($)', default: 100, type: 'number' }
        ],
        compute(v) {
          const cp = parseFloat(v.cp);
          const sp = parseFloat(v.sp);
          if (sp <= 0) return { error: "Selling Price must be greater than zero." };
          if (cp < 0) return { error: "Cost Price cannot be negative." };
          const profit = sp - cp;
          const margin = (profit / sp) * 100;
          return {
            formulaStatement: { title: "Profit Margin Percentage Formula", latex: "\\text{Margin \\%} = \\frac{\\text{SP} - \\text{CP}}{\\text{SP}} \\times 100" },
            givenValues: `\\text{CP} = \\$${cp}, \\quad \\text{SP} = \\$${sp}`,
            substitution: `\\text{Margin \\%} = \\frac{${sp} - ${cp}}{${sp}} \\times 100`,
            intermediateSteps: [
              { title: "Gross Profit", expression: `${sp} - ${cp} = \\$${parseFloat(profit.toFixed(2))}`, note: "Revenue minus cost" },
              { title: "Margin Calculation", expression: `\\frac{${profit}}{${sp}} \\times 100 = ${parseFloat(margin.toFixed(2))}\\%`, note: "Profit as share of revenue" }
            ],
            finalResult: `Margin = ${parseFloat(margin.toFixed(2))}%`,
            answer: `Margin = ${parseFloat(margin.toFixed(2))}%`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{Margin \\%} = \\frac{\\text{SP} - \\text{CP}}{\\text{SP}} \\times 100", note: "Standard margin ratio" },
              { title: "Step 2: Given Values", expression: `\\text{CP} = \\$${cp}, \\quad \\text{SP} = \\$${sp}`, note: "Input financial figures" },
              { title: "Step 3: Substitution", expression: `\\frac{${sp} - ${cp}}{${sp}} \\times 100`, note: "Substitute into ratio" },
              { title: "Step 4: Intermediate Simplification", expression: `\\frac{${profit}}{${sp}} \\times 100 = ${parseFloat(margin.toFixed(2))}\\%`, note: "Compute fraction and multiply" },
              { title: "Step 5: Final Result", expression: `\\text{Profit Margin} = ${parseFloat(margin.toFixed(2))}\\%`, note: "Return percentage" }
            ]
          };
        }
      }
    ]
  },

  // ================= 2. PROFIT & LOSS =================
  {
    id: 'profit_loss',
    category: 'Business',
    subCategory: 'Commercial',
    title: 'Profit & Loss',
    subtitle: 'Formulas for Profit Amount, Profit %, Loss Amount, and Loss %',
    latex: '\\text{Profit} = \\text{SP} - \\text{CP}, \\quad \\text{Loss} = \\text{CP} - \\text{SP}',
    subFormulas: [
      {
        id: 'profit_calc',
        title: 'Profit & Profit %',
        desc: 'Calculate financial gain and profit margin percentage on cost price',
        latex: '\\text{Profit} = \\text{SP} - \\text{CP}, \\quad \\text{Profit \\%} = \\frac{\\text{Profit}}{\\text{CP}} \\times 100',
        template: 'SP - CP',
        vars: [
          { id: 'cp', label: 'Cost Price ($)', default: 200, type: 'number' },
          { id: 'sp', label: 'Selling Price ($)', default: 260, type: 'number' }
        ],
        compute(v) {
          const cp = parseFloat(v.cp);
          const sp = parseFloat(v.sp);
          if (cp <= 0 || sp <= 0) return { error: "Prices must be greater than zero." };
          const diff = sp - cp;
          if (diff < 0) return { error: "Selling Price is less than Cost Price (this is a Loss, use Loss formula)." };
          const pct = (diff / cp) * 100;
          return {
            formulaStatement: { title: "Profit & Profit % Equations", latex: "\\text{Profit} = \\text{SP} - \\text{CP}, \\quad \\text{Profit \\%} = \\frac{\\text{Profit}}{\\text{CP}} \\times 100" },
            givenValues: `\\text{CP} = \\$${cp}, \\quad \\text{SP} = \\$${sp}`,
            substitution: `\\text{Profit} = ${sp} - ${cp}, \\quad \\text{Profit \\%} = \\frac{${diff}}{${cp}} \\times 100`,
            intermediateSteps: [
              { title: "Subtract Cost from Revenue", expression: `${sp} - ${cp} = \\$${parseFloat(diff.toFixed(2))}`, note: "Calculate absolute monetary profit" },
              { title: "Calculate Margin on Cost", expression: `\\frac{${parseFloat(diff.toFixed(2))}}{${cp}} \\times 100 = ${parseFloat(pct.toFixed(2))}\\%`, note: "Standard return on investment ratio" }
            ],
            finalResult: `Profit = $${parseFloat(diff.toFixed(2))} (${parseFloat(pct.toFixed(2))}%)`,
            answer: `Profit = $${parseFloat(diff.toFixed(2))} (${parseFloat(pct.toFixed(2))}%)`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{Profit} = \\text{SP} - \\text{CP}", note: "Base commercial definition" },
              { title: "Step 2: Given Values", expression: `\\text{CP} = \\$${cp}, \\quad \\text{SP} = \\$${sp}`, note: "Provided financial parameters" },
              { title: "Step 3: Substitution", expression: `\\text{Profit} = ${sp} - ${cp}`, note: "Insert values" },
              { title: "Step 4: Intermediate Simplification", expression: `\\text{Profit} = \\$${parseFloat(diff.toFixed(2))}, \\quad \\frac{${diff}}{${cp}} \\times 100 = ${parseFloat(pct.toFixed(2))}\\%`, note: "Evaluate arithmetic" },
              { title: "Step 5: Final Result", expression: `\\text{Profit} = \\$${parseFloat(diff.toFixed(2))} \\text{ with } ${parseFloat(pct.toFixed(2))}\\% \\text{ return}`, note: "Calculation complete" }
            ]
          };
        }
      },
      {
        id: 'loss_calc',
        title: 'Loss & Loss %',
        desc: 'Calculate financial loss when cost exceeds selling price',
        latex: '\\text{Loss} = \\text{CP} - \\text{SP}, \\quad \\text{Loss \\%} = \\frac{\\text{Loss}}{\\text{CP}} \\times 100',
        template: 'CP - SP',
        vars: [
          { id: 'cp', label: 'Cost Price ($)', default: 150, type: 'number' },
          { id: 'sp', label: 'Selling Price ($)', default: 120, type: 'number' }
        ],
        compute(v) {
          const cp = parseFloat(v.cp);
          const sp = parseFloat(v.sp);
          if (cp <= 0 || sp <= 0) return { error: "Prices must be greater than zero." };
          const diff = cp - sp;
          if (diff < 0) return { error: "Selling Price exceeds Cost Price (this is a Profit, use Profit formula)." };
          const pct = (diff / cp) * 100;
          return {
            formulaStatement: { title: "Loss & Loss % Equations", latex: "\\text{Loss} = \\text{CP} - \\text{SP}, \\quad \\text{Loss \\%} = \\frac{\\text{Loss}}{\\text{CP}} \\times 100" },
            givenValues: `\\text{CP} = \\$${cp}, \\quad \\text{SP} = \\$${sp}`,
            substitution: `\\text{Loss} = ${cp} - ${sp}, \\quad \\text{Loss \\%} = \\frac{${diff}}{${cp}} \\times 100`,
            intermediateSteps: [
              { title: "Subtract Selling Price from Cost", expression: `${cp} - ${sp} = \\$${parseFloat(diff.toFixed(2))}`, note: "Absolute negative cash flow" },
              { title: "Calculate Loss Percentage", expression: `\\frac{${parseFloat(diff.toFixed(2))}}{${cp}} \\times 100 = ${parseFloat(pct.toFixed(2))}\\%`, note: "Loss measured against initial cost basis" }
            ],
            finalResult: `Loss = $${parseFloat(diff.toFixed(2))} (${parseFloat(pct.toFixed(2))}%)`,
            answer: `Loss = $${parseFloat(diff.toFixed(2))} (${parseFloat(pct.toFixed(2))}%)`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{Loss} = \\text{CP} - \\text{SP}", note: "Base definition of financial loss" },
              { title: "Step 2: Given Values", expression: `\\text{CP} = \\$${cp}, \\quad \\text{SP} = \\$${sp}`, note: "Input financial amounts" },
              { title: "Step 3: Substitution", expression: `\\text{Loss} = ${cp} - ${sp}`, note: "Substitute figures" },
              { title: "Step 4: Intermediate Simplification", expression: `\\text{Loss} = \\$${parseFloat(diff.toFixed(2))}, \\quad \\frac{${diff}}{${cp}} \\times 100 = ${parseFloat(pct.toFixed(2))}\\%`, note: "Compute financial deficit and ratio" },
              { title: "Step 5: Final Result", expression: `\\text{Loss} = \\$${parseFloat(diff.toFixed(2))} (${parseFloat(pct.toFixed(2))}\\% \\text{ loss})`, note: "Result finalized" }
            ]
          };
        }
      }
    ]
  },

  // ================= 3. COMMERCIAL MATH & DISCOUNT =================
  {
    id: 'commercial_math',
    category: 'Business',
    subCategory: 'Commercial Math',
    title: 'Discount & Percentage',
    subtitle: 'Formulas for Trade Discounts, Sale Price, and Part/Whole Percentages',
    latex: '\\text{Discount} = \\text{LP} \\times \\frac{D}{100}, \\quad \\text{Percentage} = \\frac{\\text{Part}}{\\text{Whole}} \\times 100',
    subFormulas: [
      {
        id: 'discount_calc',
        title: 'Discount & Sale Price',
        desc: 'Calculate monetary discount deduction and discounted sale price',
        latex: '\\text{Discount} = \\text{List Price} \\times \\frac{D\\%}{100}, \\quad \\text{Sale Price} = \\text{List Price} - \\text{Discount}',
        template: 'LP * (1 - D / 100)',
        vars: [
          { id: 'lp', label: 'List Price ($)', default: 250, type: 'number' },
          { id: 'd', label: 'Discount Percentage (D %)', default: 20, type: 'number' }
        ],
        compute(v) {
          const lp = parseFloat(v.lp);
          const d = parseFloat(v.d);
          if (lp <= 0) return { error: "List price must be positive." };
          if (d < 0 || d > 100) return { error: "Discount must be between 0% and 100%." };
          const disc = lp * (d / 100);
          const sale = lp - disc;
          return {
            formulaStatement: { title: "Commercial Discount Formula", latex: "\\text{Discount} = \\text{LP} \\times \\frac{D}{100}, \\quad \\text{Sale Price} = \\text{LP} - \\text{Discount}" },
            givenValues: `\\text{List Price (LP)} = \\$${lp}, \\quad D = ${d}\\%`,
            substitution: `\\text{Discount} = ${lp} \\times \\frac{${d}}{100}`,
            intermediateSteps: [
              { title: "Evaluate Discount Rate", expression: `\\frac{${d}}{100} = ${d/100}`, note: "Convert percentage to decimal" },
              { title: "Compute Dollar Discount", expression: `${lp} \\times ${d/100} = \\$${parseFloat(disc.toFixed(2))}`, note: "Amount deducted" },
              { title: "Deduct from List Price", expression: `${lp} - ${parseFloat(disc.toFixed(2))} = \\$${parseFloat(sale.toFixed(2))}`, note: "Final net price" }
            ],
            finalResult: `Discount = $${parseFloat(disc.toFixed(2))}, Sale Price = $${parseFloat(sale.toFixed(2))}`,
            answer: `Sale Price = $${parseFloat(sale.toFixed(2))} (Saved $${parseFloat(disc.toFixed(2))})`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{Sale Price} = \\text{LP} \\times (1 - D/100)", note: "Standard consumer discount formula" },
              { title: "Step 2: Given Values", expression: `\\text{LP} = \\$${lp}, \\quad D = ${d}\\%`, note: "Original price and discount %" },
              { title: "Step 3: Substitution", expression: `\\text{Discount} = ${lp} \\times \\frac{${d}}{100}`, note: "Substitute into equation" },
              { title: "Step 4: Intermediate Simplification", expression: `\\text{Discount} = \\$${parseFloat(disc.toFixed(2))}, \\quad ${lp} - ${parseFloat(disc.toFixed(2))} = \\$${parseFloat(sale.toFixed(2))}`, note: "Perform deduction" },
              { title: "Step 5: Final Result", expression: `\\text{Final Sale Price} = \\$${parseFloat(sale.toFixed(2))}`, note: "Discount successfully computed" }
            ]
          };
        }
      },
      {
        id: 'percentage_calc',
        title: 'Percentage Calculator',
        desc: 'Calculate what percentage a part is of a whole',
        latex: '\\text{Percentage} = \\frac{\\text{Part}}{\\text{Whole}} \\times 100',
        template: '(Part / Whole) * 100',
        vars: [
          { id: 'part', label: 'Part Value', default: 45, type: 'number' },
          { id: 'whole', label: 'Whole Value', default: 180, type: 'number' }
        ],
        compute(v) {
          const part = parseFloat(v.part);
          const whole = parseFloat(v.whole);
          if (whole === 0) return { error: "Whole value cannot be zero (division by zero)." };
          const ratio = part / whole;
          const pct = ratio * 100;
          return {
            formulaStatement: { title: "Standard Percentage Ratio", latex: "\\text{Percentage} = \\frac{\\text{Part}}{\\text{Whole}} \\times 100" },
            givenValues: `\\text{Part} = ${part}, \\quad \\text{Whole} = ${whole}`,
            substitution: `\\text{Percentage} = \\frac{${part}}{${whole}} \\times 100`,
            intermediateSteps: [
              { title: "Compute Decimal Ratio", expression: `\\frac{${part}}{${whole}} = ${parseFloat(ratio.toFixed(6))}`, note: "Divide part by whole" },
              { title: "Multiply by 100", expression: `${parseFloat(ratio.toFixed(6))} \\times 100 = ${parseFloat(pct.toFixed(4))}\\%`, note: "Scale to percentage base 100" }
            ],
            finalResult: `${parseFloat(pct.toFixed(2))}%`,
            answer: `${parseFloat(pct.toFixed(2))}%`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{Percentage} = \\frac{\\text{Part}}{\\text{Whole}} \\times 100", note: "Standard proportional percentage formula" },
              { title: "Step 2: Given Values", expression: `\\text{Part} = ${part}, \\quad \\text{Whole} = ${whole}`, note: "Specified part and total reference whole" },
              { title: "Step 3: Substitution", expression: `\\text{P} = \\frac{${part}}{${whole}} \\times 100`, note: "Substitute inputs into ratio" },
              { title: "Step 4: Intermediate Simplification", expression: `\\frac{${part}}{${whole}} = ${parseFloat(ratio.toFixed(4))} \\implies ${parseFloat(ratio.toFixed(4))} \\times 100 = ${parseFloat(pct.toFixed(2))}\\%`, note: "Multiply ratio by 100" },
              { title: "Step 5: Final Result", expression: `${part} \\text{ is } ${parseFloat(pct.toFixed(2))}\\% \\text{ of } ${whole}`, note: "Percentage evaluation complete" }
            ]
          };
        }
      }
    ]
  },

  // ================= 4. FINANCIAL INTEREST =================
  {
    id: 'financial_interest',
    category: 'Business',
    subCategory: 'Interest',
    title: 'Financial Interest',
    subtitle: 'Simple Interest ($I = Prt$) and Compound Interest ($A = P(1+r/n)^{nt}$)',
    latex: 'I = P \\cdot r \\cdot t, \\quad A = P\\left(1 + \\frac{r}{n}\\right)^{nt}',
    subFormulas: [
      {
        id: 'simple_interest',
        title: 'Simple Interest',
        desc: 'Calculate linear interest accrued over time on principal capital',
        latex: 'I = P \\cdot \\frac{r}{100} \\cdot t, \\quad A = P + I',
        template: 'P * (r / 100) * t',
        vars: [
          { id: 'p', label: 'Principal (P in $)', default: 5000, type: 'number' },
          { id: 'r', label: 'Annual Interest Rate (r %)', default: 6, type: 'number' },
          { id: 't', label: 'Time (t in Years)', default: 3, type: 'number' }
        ],
        compute(v) {
          const p = parseFloat(v.p);
          const r = parseFloat(v.r);
          const t = parseFloat(v.t);
          if (p <= 0 || t <= 0) return { error: "Principal and Time must be positive values." };
          const interest = p * (r / 100) * t;
          const total = p + interest;
          return {
            formulaStatement: { title: "Simple Interest Formula", latex: "I = P \\cdot \\frac{r}{100} \\cdot t, \\quad A = P + I" },
            givenValues: `P = \\$${p}, \\quad r = ${r}\\%, \\quad t = ${t} \\text{ years}`,
            substitution: `I = ${p} \\cdot \\left(\\frac{${r}}{100}\\right) \\cdot ${t}`,
            intermediateSteps: [
              { title: "Decimal Rate", expression: `\\frac{${r}}{100} = ${r/100}`, note: "Annual rate" },
              { title: "Multiply Principal, Rate, Time", expression: `${p} \\times ${r/100} \\times ${t} = \\$${parseFloat(interest.toFixed(2))}`, note: "Accrued interest" },
              { title: "Maturity Total Amount", expression: `A = ${p} + ${parseFloat(interest.toFixed(2))} = \\$${parseFloat(total.toFixed(2))}`, note: "Principal plus interest" }
            ],
            finalResult: `Interest = $${parseFloat(interest.toFixed(2))}, Total = $${parseFloat(total.toFixed(2))}`,
            answer: `Interest = $${parseFloat(interest.toFixed(2))}, Total = $${parseFloat(total.toFixed(2))}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "I = P \\cdot r \\cdot t", note: "Standard linear simple interest law" },
              { title: "Step 2: Given Values", expression: `P = \\$${p}, \\quad r = ${r}\\%, \\quad t = ${t} \\text{ years}`, note: "Principal, rate, and duration" },
              { title: "Step 3: Substitution", expression: `I = ${p} \\times \\frac{${r}}{100} \\times ${t}`, note: "Insert into equation" },
              { title: "Step 4: Intermediate Simplification", expression: `I = \\$${parseFloat(interest.toFixed(2))}, \\quad A = ${p} + ${parseFloat(interest.toFixed(2))} = \\$${parseFloat(total.toFixed(2))}`, note: "Evaluate interest and aggregate total" },
              { title: "Step 5: Final Result", expression: `\\text{Total Balance: } \\$${parseFloat(total.toFixed(2))}`, note: "Simple interest evaluation complete" }
            ]
          };
        }
      },
      {
        id: 'compound_interest',
        title: 'Compound Interest',
        desc: 'Calculate exponential investment compounding over multiple periods per year',
        latex: 'A = P\\left(1 + \\frac{r}{100n}\\right)^{nt}, \\quad I = A - P',
        template: 'P * (1 + (r / 100) / n)^(n * t)',
        vars: [
          { id: 'p', label: 'Principal (P in $)', default: 5000, type: 'number' },
          { id: 'r', label: 'Annual Rate (r %)', default: 7.5, type: 'number' },
          { id: 't', label: 'Time (t in Years)', default: 5, type: 'number' },
          { id: 'n', label: 'Compounding frequency (1=ann, 4=qrt, 12=mon)', default: 12, type: 'number' }
        ],
        compute(v) {
          const p = parseFloat(v.p);
          const r = parseFloat(v.r);
          const t = parseFloat(v.t);
          const n = parseFloat(v.n);
          if (p <= 0 || t <= 0 || n <= 0) return { error: "Principal, time, and compounding periods must be positive." };
          const ratePerPeriod = (r / 100) / n;
          const totalPeriods = n * t;
          const factor = Math.pow(1 + ratePerPeriod, totalPeriods);
          const total = p * factor;
          const interest = total - p;
          return {
            formulaStatement: { title: "Compound Interest Formula", latex: "A = P\\left(1 + \\frac{r}{100n}\\right)^{nt}, \\quad I = A - P" },
            givenValues: `P = \\$${p}, \\quad r = ${r}\\%, \\quad t = ${t} \\text{ yrs}, \\quad n = ${n}`,
            substitution: `A = ${p}\\left(1 + \\frac{${r}}{100 \\times ${n}}\\right)^{${n} \\times ${t}}`,
            intermediateSteps: [
              { title: "Periodic Interest Rate", expression: `\\frac{${r/100}}{${n}} = ${parseFloat(ratePerPeriod.toFixed(6))}`, note: "Rate per compounding interval" },
              { title: "Total Compounding Periods", expression: `nt = ${n} \\times ${t} = ${totalPeriods}`, note: "Number of exponent periods" },
              { title: "Compounding Multiplier", expression: `(1 + ${parseFloat(ratePerPeriod.toFixed(6))})^{${totalPeriods}} \\approx ${parseFloat(factor.toFixed(6))}`, note: "Growth coefficient" },
              { title: "Compound Interest Amount", expression: `I = ${parseFloat(total.toFixed(2))} - ${p} = \\$${parseFloat(interest.toFixed(2))}`, note: "Total yield over principal" }
            ],
            finalResult: `Total Balance = $${parseFloat(total.toFixed(2))} (Earned $${parseFloat(interest.toFixed(2))})`,
            answer: `Total Balance = $${parseFloat(total.toFixed(2))} (Earned $${parseFloat(interest.toFixed(2))})`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "A = P\\left(1 + \\frac{r}{n}\\right)^{nt}", note: "Standard compound growth equation" },
              { title: "Step 2: Given Values", expression: `P = \\$${p}, \\quad r = ${r}\\%, \\quad t = ${t}, \\quad n = ${n}`, note: "Principal and compounding parameters" },
              { title: "Step 3: Substitution", expression: `A = ${p}\\left(1 + \\frac{${r/100}}{${n}}\\right)^{${totalPeriods}}`, note: "Plug in parameters" },
              { title: "Step 4: Intermediate Simplification", expression: `${p} \\times ${parseFloat(factor.toFixed(4))} = \\$${parseFloat(total.toFixed(2))}`, note: "Exponential factor multiplication" },
              { title: "Step 5: Final Result", expression: `\\text{Total Maturity: } \\$${parseFloat(total.toFixed(2))}, \\quad \\text{Interest: } \\$${parseFloat(interest.toFixed(2))}`, note: "Calculation complete" }
            ]
          };
        }
      }
    ]
  },

  // ================= 5. ROOTS (COMPLETELY SEPARATED) =================
  {
    id: 'roots',
    category: 'Numbers',
    subCategory: 'Roots',
    title: 'Roots',
    subtitle: 'Dedicated calculators for Square Root (√x), Cube Root (∛x), and n-th Root',
    latex: '\\sqrt{x} = x^{1/2}, \\quad \\sqrt[3]{x} = x^{1/3}, \\quad \\sqrt[n]{x} = x^{1/n}',
    subFormulas: [
      {
        id: 'square_root_calc',
        title: 'Square Root Calculator',
        desc: 'Calculate the principal non-negative square root √x such that y² = x',
        latex: 'y = \\sqrt{x} \\iff y^2 = x \\quad (x \\ge 0)',
        template: 'sqrt(x)',
        vars: [
          { id: 'x', label: 'Radicand (x)', default: 144, type: 'number' }
        ],
        compute(v) {
          const x = parseFloat(v.x);
          if (x < 0) return { error: "Square root of a negative number yields an imaginary result. Enter x ≥ 0 for real roots." };
          const root = Math.sqrt(x);
          const isPerf = Number.isInteger(root);
          const cleanRoot = isPerf ? root : parseFloat(root.toFixed(6));
          return {
            formulaStatement: { title: "Square Root Definition", latex: "y = \\sqrt{x} \\iff y^2 = x" },
            givenValues: `x = ${x}`,
            substitution: `y = \\sqrt{${x}}`,
            intermediateSteps: [
              { title: "Radicand Analysis", expression: `\\sqrt{${x}}`, note: isPerf ? `${x} is a perfect square (${cleanRoot}² = ${x})` : `${x} is not a perfect square; irrational approximation` },
              { title: "Root Evaluation", expression: `\\sqrt{${x}} = ${cleanRoot}`, note: "Principal positive square root" }
            ],
            finalResult: `√${x} = ${cleanRoot}`,
            answer: `√${x} = ${cleanRoot}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "y = \\sqrt{x} \\iff y^2 = x", note: "Principal square root definition" },
              { title: "Step 2: Given Values", expression: `x = ${x}`, note: "Input radicand" },
              { title: "Step 3: Substitution", expression: `y = \\sqrt{${x}}`, note: "Insert into radical" },
              { title: "Step 4: Intermediate Simplification", expression: `${cleanRoot}^2 = ${isPerf ? x : parseFloat((cleanRoot*cleanRoot).toFixed(4))}`, note: "Verification" },
              { title: "Step 5: Final Result", expression: `\\sqrt{${x}} = ${cleanRoot}`, note: "Calculation complete" }
            ]
          };
        }
      },
      {
        id: 'cube_root_calc',
        title: 'Cube Root Calculator',
        desc: 'Calculate the real cube root ∛x such that y³ = x (valid for all real numbers)',
        latex: 'y = \\sqrt[3]{x} \\iff y^3 = x',
        template: 'cbrt(x)',
        vars: [
          { id: 'x', label: 'Radicand (x)', default: 64, type: 'number' }
        ],
        compute(v) {
          const x = parseFloat(v.x);
          const root = Math.cbrt(x);
          const isPerf = Number.isInteger(root);
          const cleanRoot = isPerf ? root : parseFloat(root.toFixed(6));
          return {
            formulaStatement: { title: "Cube Root Definition", latex: "y = \\sqrt[3]{x} \\iff y^3 = x" },
            givenValues: `x = ${x}`,
            substitution: `y = \\sqrt[3]{${x}}`,
            intermediateSteps: [
              { title: "Radicand Factorization", expression: `\\sqrt[3]{${x}}`, note: isPerf ? `${x} is a perfect cube (${cleanRoot}³ = ${x})` : "Irrational real cube root approximation" },
              { title: "Root Evaluation", expression: `\\sqrt[3]{${x}} = ${cleanRoot}`, note: "Real cube root" }
            ],
            finalResult: `∛${x} = ${cleanRoot}`,
            answer: `∛${x} = ${cleanRoot}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "y = \\sqrt[3]{x} \\iff y^3 = x", note: "Cube root definition" },
              { title: "Step 2: Given Values", expression: `x = ${x}`, note: "Input radicand" },
              { title: "Step 3: Substitution", expression: `y = \\sqrt[3]{${x}}`, note: "Substitute into cube radical" },
              { title: "Step 4: Intermediate Simplification", expression: `(${cleanRoot})^3 = ${x}`, note: "Verified by raising to third power" },
              { title: "Step 5: Final Result", expression: `\\sqrt[3]{${x}} = ${cleanRoot}`, note: "Real root determined" }
            ]
          };
        }
      },
      {
        id: 'nth_root_calc',
        title: 'n-th Root Calculator',
        desc: 'Calculate the principal n-th root of any base x',
        latex: 'y = \\sqrt[n]{x} = x^{1/n}',
        template: 'x^(1/n)',
        vars: [
          { id: 'x', label: 'Radicand (x)', default: 32, type: 'number' },
          { id: 'n', label: 'Index / Degree (n)', default: 5, type: 'number' }
        ],
        compute(v) {
          const x = parseFloat(v.x);
          const n = parseFloat(v.n);
          if (n === 0) return { error: "Index degree n cannot be zero." };
          if (x < 0 && n % 2 === 0) return { error: "Even root of negative number is complex." };
          const root = x < 0 ? -Math.pow(-x, 1 / n) : Math.pow(x, 1 / n);
          const cleanRoot = Number.isInteger(root) ? root : parseFloat(root.toFixed(6));
          return {
            formulaStatement: { title: "n-th Root Radical Formula", latex: "\\sqrt[n]{x} = x^{\\frac{1}{n}}" },
            givenValues: `x = ${x}, \\quad n = ${n}`,
            substitution: `\\sqrt[${n}]{${x}} = ${x}^{\\frac{1}{${n}}}`,
            intermediateSteps: [
              { title: "Exponent Form Conversion", expression: `${x}^{\\frac{1}{${n}}} = ${x}^{${parseFloat((1/n).toFixed(4))}}`, note: "Convert radical to fractional exponent" },
              { title: "Power Evaluation", expression: `\\sqrt[${n}]{${x}} = ${cleanRoot}`, note: "Compute numerical root" }
            ],
            finalResult: `ⁿ√${x} = ${cleanRoot}`,
            answer: `ⁿ√${x} = ${cleanRoot}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\sqrt[n]{x} = x^{1/n}", note: "General index radical law" },
              { title: "Step 2: Given Values", expression: `x = ${x}, \\quad n = ${n}`, note: "Radicand and index" },
              { title: "Step 3: Substitution", expression: `\\sqrt[${n}]{${x}} = ${x}^{1/${n}}`, note: "Substitute into equation" },
              { title: "Step 4: Intermediate Simplification", expression: `(${cleanRoot})^{${n}} \\approx ${x}`, note: "Verify exponential power" },
              { title: "Step 5: Final Result", expression: `\\sqrt[${n}]{${x}} = ${cleanRoot}`, note: "Root evaluated" }
            ]
          };
        }
      }
    ]
  },

  // ================= 6. EXPONENTS (ALL 6 LAWS SEPARATED) =================
  {
    id: 'exponents',
    category: 'Algebra',
    subCategory: 'Exponents',
    title: 'Exponents',
    subtitle: 'All 6 fundamental laws of exponents separated into dedicated sub-formulas',
    latex: 'a^m \\cdot a^n = a^{m+n}, \\quad \\frac{a^m}{a^n} = a^{m-n}, \\quad (a^m)^n = a^{mn}, \\quad (ab)^n = a^n b^n, \\quad \\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}, \\quad a^{-n} = \\frac{1}{a^n}',
    subFormulas: [
      {
        id: 'exp_product_powers',
        title: '1. Product of Powers Law',
        desc: 'When multiplying powers with the same base, add their exponents: aᵐ · aⁿ = aᵐ⁺ⁿ',
        latex: 'a^m \\cdot a^n = a^{m + n}',
        template: 'a^m * a^n',
        vars: [
          { id: 'a', label: 'Base (a)', default: 3, type: 'number' },
          { id: 'm', label: 'Exponent 1 (m)', default: 4, type: 'number' },
          { id: 'n', label: 'Exponent 2 (n)', default: 2, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const m = parseFloat(v.m);
          const n = parseFloat(v.n);
          const sumExp = m + n;
          const val = Math.pow(a, sumExp);
          return {
            formulaStatement: { title: "Product of Powers Law", latex: "a^m \\cdot a^n = a^{m + n}" },
            givenValues: `a = ${a}, \\quad m = ${m}, \\quad n = ${n}`,
            substitution: `${a}^{${m}} \\cdot ${a}^{${n}} = ${a}^{${m} + ${n}}`,
            intermediateSteps: [
              { title: "Add Exponents", expression: `${m} + ${n} = ${sumExp}`, note: "Combine like bases by summing powers" },
              { title: "Single Power Form", expression: `${a}^{${sumExp}}`, note: "Simplified exponential term" },
              { title: "Evaluate Numeric Value", expression: `${a}^{${sumExp}} = ${val}`, note: "Raise base to sum exponent" }
            ],
            finalResult: `${a}^${sumExp} = ${val}`,
            answer: `${a}^${sumExp} = ${val}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "a^m \\cdot a^n = a^{m+n}", note: "Product of powers rule" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad m = ${m}, \\quad n = ${n}`, note: "Base and powers" },
              { title: "Step 3: Substitution", expression: `${a}^{${m}} \\cdot ${a}^{${n}} = ${a}^{${m}+${n}}`, note: "Substitute inputs" },
              { title: "Step 4: Intermediate Simplification", expression: `${a}^{${sumExp}} = ${val}`, note: "Evaluate arithmetic" },
              { title: "Step 5: Final Result", expression: `${a}^{${m}} \\cdot ${a}^{${n}} = ${val}`, note: "Calculation complete" }
            ]
          };
        }
      },
      {
        id: 'exp_quotient_powers',
        title: '2. Quotient of Powers Law',
        desc: 'When dividing powers with the same base, subtract their exponents: aᵐ / aⁿ = aᵐ⁻ⁿ',
        latex: '\\frac{a^m}{a^n} = a^{m - n} \\quad (a \\neq 0)',
        template: 'a^m / a^n',
        vars: [
          { id: 'a', label: 'Base (a)', default: 5, type: 'number' },
          { id: 'm', label: 'Numerator Power (m)', default: 6, type: 'number' },
          { id: 'n', label: 'Denominator Power (n)', default: 3, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const m = parseFloat(v.m);
          const n = parseFloat(v.n);
          if (a === 0) return { error: "Base cannot be zero (division by zero)." };
          const diffExp = m - n;
          const val = Math.pow(a, diffExp);
          return {
            formulaStatement: { title: "Quotient of Powers Law", latex: "\\frac{a^m}{a^n} = a^{m - n}" },
            givenValues: `a = ${a}, \\quad m = ${m}, \\quad n = ${n}`,
            substitution: `\\frac{${a}^{${m}}}{${a}^{${n}}} = ${a}^{${m} - ${n}}`,
            intermediateSteps: [
              { title: "Subtract Exponents", expression: `${m} - ${n} = ${diffExp}`, note: "Numerator power minus denominator power" },
              { title: "Exponential Result", expression: `${a}^{${diffExp}} = ${val}`, note: "Calculate final numerical value" }
            ],
            finalResult: `${a}^${diffExp} = ${val}`,
            answer: `${a}^${diffExp} = ${val}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\frac{a^m}{a^n} = a^{m-n}", note: "Quotient of powers identity" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad m = ${m}, \\quad n = ${n}`, note: "Given base and powers" },
              { title: "Step 3: Substitution", expression: `\\frac{${a}^{${m}}}{${a}^{${n}}} = ${a}^{${m}-${n}}`, note: "Insert into equation" },
              { title: "Step 4: Intermediate Simplification", expression: `${a}^{${diffExp}} = ${val}`, note: "Perform subtraction and power" },
              { title: "Step 5: Final Result", expression: `\\frac{${a}^{${m}}}{${a}^{${n}}} = ${val}`, note: "Evaluation complete" }
            ]
          };
        }
      },
      {
        id: 'exp_power_of_power',
        title: '3. Power of a Power Law',
        desc: 'When raising a power to another power, multiply the exponents: (aᵐ)ⁿ = aᵐⁿ',
        latex: '(a^m)^n = a^{m \\cdot n}',
        template: '(a^m)^n',
        vars: [
          { id: 'a', label: 'Base (a)', default: 2, type: 'number' },
          { id: 'm', label: 'Inner Power (m)', default: 3, type: 'number' },
          { id: 'n', label: 'Outer Power (n)', default: 4, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const m = parseFloat(v.m);
          const n = parseFloat(v.n);
          const prodExp = m * n;
          const val = Math.pow(a, prodExp);
          return {
            formulaStatement: { title: "Power of a Power Law", latex: "(a^m)^n = a^{m \\cdot n}" },
            givenValues: `a = ${a}, \\quad m = ${m}, \\quad n = ${n}`,
            substitution: `(${a}^{${m}})^{${n}} = ${a}^{${m} \\cdot ${n}}`,
            intermediateSteps: [
              { title: "Multiply Exponents", expression: `${m} \\times ${n} = ${prodExp}`, note: "Inner power times outer power" },
              { title: "Resulting Power", expression: `${a}^{${prodExp}} = ${val}`, note: "Compute power value" }
            ],
            finalResult: `${a}^${prodExp} = ${val}`,
            answer: `${a}^${prodExp} = ${val}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "(a^m)^n = a^{m \\cdot n}", note: "Power of a power rule" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad m = ${m}, \\quad n = ${n}`, note: "Base and exponent chain" },
              { title: "Step 3: Substitution", expression: `(${a}^{${m}})^{${n}} = ${a}^{${m} \\times ${n}}`, note: "Plug in parameters" },
              { title: "Step 4: Intermediate Simplification", expression: `${a}^{${prodExp}} = ${val}`, note: "Evaluate product of exponents" },
              { title: "Step 5: Final Result", expression: `(${a}^{${m}})^{${n}} = ${val}`, note: "Calculation finished" }
            ]
          };
        }
      },
      {
        id: 'exp_power_of_product',
        title: '4. Power of a Product Law',
        desc: 'When raising a product to a power, distribute the power to each factor: (ab)ⁿ = aⁿ bⁿ',
        latex: '(a \\cdot b)^n = a^n \\cdot b^n',
        template: '(a * b)^n',
        vars: [
          { id: 'a', label: 'First Factor (a)', default: 3, type: 'number' },
          { id: 'b', label: 'Second Factor (b)', default: 4, type: 'number' },
          { id: 'n', label: 'Exponent (n)', default: 2, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          const n = parseFloat(v.n);
          const an = Math.pow(a, n);
          const bn = Math.pow(b, n);
          const val = an * bn;
          return {
            formulaStatement: { title: "Power of a Product Law", latex: "(a \\cdot b)^n = a^n \\cdot b^n" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad n = ${n}`,
            substitution: `(${a} \\cdot ${b})^{${n}} = ${a}^{${n}} \\cdot ${b}^{${n}}`,
            intermediateSteps: [
              { title: "Distribute Exponent", expression: `${a}^{${n}} = ${an}, \\quad ${b}^{${n}} = ${bn}`, note: "Raise each factor independently" },
              { title: "Multiply Powers", expression: `${an} \\times ${bn} = ${val}`, note: "Combined product" }
            ],
            finalResult: `(${a}·${b})^${n} = ${val}`,
            answer: `(${a}·${b})^${n} = ${val}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "(ab)^n = a^n b^n", note: "Power of a product law" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad b = ${b}, \\quad n = ${n}`, note: "Factors and exponent" },
              { title: "Step 3: Substitution", expression: `(${a} \\cdot ${b})^{${n}} = ${a}^{${n}} \\cdot ${b}^{${n}}`, note: "Distribute exponent" },
              { title: "Step 4: Intermediate Simplification", expression: `${an} \\times ${bn} = ${val}`, note: "Evaluate individual terms" },
              { title: "Step 5: Final Result", expression: `(${a} \\cdot ${b})^{${n}} = ${val}`, note: "Evaluation complete" }
            ]
          };
        }
      },
      {
        id: 'exp_power_of_quotient',
        title: '5. Power of a Quotient Law',
        desc: 'When raising a quotient/fraction to a power, distribute the power: (a/b)ⁿ = aⁿ / bⁿ',
        latex: '\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n} \\quad (b \\neq 0)',
        template: '(a / b)^n',
        vars: [
          { id: 'a', label: 'Numerator (a)', default: 6, type: 'number' },
          { id: 'b', label: 'Denominator (b)', default: 2, type: 'number' },
          { id: 'n', label: 'Exponent (n)', default: 3, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const b = parseFloat(v.b);
          const n = parseFloat(v.n);
          if (b === 0) return { error: "Denominator b cannot be zero." };
          const an = Math.pow(a, n);
          const bn = Math.pow(b, n);
          const val = an / bn;
          return {
            formulaStatement: { title: "Power of a Quotient Law", latex: "\\left(\\frac{a}{b}\\right)^n = \\frac{a^n}{b^n}" },
            givenValues: `a = ${a}, \\quad b = ${b}, \\quad n = ${n}`,
            substitution: `\\left(\\frac{${a}}{${b}}\\right)^{${n}} = \\frac{${a}^{${n}}}{${b}^{${n}}}`,
            intermediateSteps: [
              { title: "Distribute Power to Numerator & Denominator", expression: `${a}^{${n}} = ${an}, \\quad ${b}^{${n}} = ${bn}`, note: "Apply exponent separately" },
              { title: "Compute Quotient", expression: `\\frac{${an}}{${bn}} = ${parseFloat(val.toFixed(6))}`, note: "Divide numerator power by denominator power" }
            ],
            finalResult: `(${a}/${b})^${n} = ${parseFloat(val.toFixed(4))}`,
            answer: `(${a}/${b})^${n} = ${parseFloat(val.toFixed(4))}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "(a/b)^n = a^n / b^n", note: "Power of a quotient rule" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad b = ${b}, \\quad n = ${n}`, note: "Numerator, denominator, power" },
              { title: "Step 3: Substitution", expression: `\\left(\\frac{${a}}{${b}}\\right)^{${n}} = \\frac{${a}^{${n}}}{${b}^{${n}}}`, note: "Distribute power" },
              { title: "Step 4: Intermediate Simplification", expression: `\\frac{${an}}{${bn}} = ${parseFloat(val.toFixed(4))}`, note: "Evaluate fractions" },
              { title: "Step 5: Final Result", expression: `\\left(\\frac{${a}}{${b}}\\right)^{${n}} = ${parseFloat(val.toFixed(4))}`, note: "Result finalized" }
            ]
          };
        }
      },
      {
        id: 'exp_zero_neg',
        title: '6. Zero & Negative Exponents',
        desc: 'Any non-zero base to power 0 equals 1; negative exponent reciprocates base: a⁻ⁿ = 1/aⁿ',
        latex: 'a^0 = 1, \\quad a^{-n} = \\frac{1}{a^n} \\quad (a \\neq 0)',
        template: 'a^(-n)',
        vars: [
          { id: 'a', label: 'Base (a)', default: 4, type: 'number' },
          { id: 'n', label: 'Exponent (enter negative or 0)', default: -3, type: 'number' }
        ],
        compute(v) {
          const a = parseFloat(v.a);
          const n = parseFloat(v.n);
          if (a === 0 && n <= 0) return { error: "0 to a non-positive power is mathematically undefined." };
          const val = Math.pow(a, n);
          if (n === 0) {
            return {
              formulaStatement: { title: "Zero Exponent Identity", latex: "a^0 = 1 \\quad (a \\neq 0)" },
              givenValues: `a = ${a}, \\quad n = 0`,
              substitution: `${a}^0 = 1`,
              intermediateSteps: [
                { title: "Identity Definition", expression: `${a}^0 = 1`, note: "By definition of quotient cancellation" }
              ],
              finalResult: `${a}⁰ = 1`,
              answer: `${a}⁰ = 1`,
              steps: [
                { title: "Step 1: Formula Statement", expression: "a^0 = 1", note: "Zero exponent law" },
                { title: "Step 2: Given Values", expression: `a = ${a}`, note: "Non-zero base" },
                { title: "Step 3: Substitution", expression: `${a}^0 = 1`, note: "Apply identity" },
                { title: "Step 4: Simplification", expression: "1", note: "Constant value" },
                { title: "Step 5: Final Result", expression: `${a}^0 = 1`, note: "Complete" }
              ]
            };
          }
          const posN = Math.abs(n);
          const denom = Math.pow(a, posN);
          return {
            formulaStatement: { title: "Negative Exponent Reciprocal Rule", latex: "a^{-n} = \\frac{1}{a^n}" },
            givenValues: `a = ${a}, \\quad n = ${n}`,
            substitution: `${a}^{${n}} = \\frac{1}{${a}^{${posN}}}`,
            intermediateSteps: [
              { title: "Reciprocate Base to Positive Exponent", expression: `\\frac{1}{${a}^{${posN}}}`, note: "Invert into denominator" },
              { title: "Evaluate Denominator", expression: `${a}^{${posN}} = ${denom} \\implies \\frac{1}{${denom}} = ${parseFloat(val.toFixed(6))}`, note: "Compute fraction value" }
            ],
            finalResult: `${a}^(${n}) = 1/${denom} = ${parseFloat(val.toFixed(6))}`,
            answer: `${a}^(${n}) = 1/${denom} = ${parseFloat(val.toFixed(6))}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "a^{-n} = \\frac{1}{a^n}", note: "Negative exponent rule" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad n = ${n}`, note: "Base and negative power" },
              { title: "Step 3: Substitution", expression: `${a}^{${n}} = \\frac{1}{${a}^{${posN}}}`, note: "Plug in values" },
              { title: "Step 4: Intermediate Simplification", expression: `\\frac{1}{${denom}} = ${parseFloat(val.toFixed(6))}`, note: "Evaluate denominator power" },
              { title: "Step 5: Final Result", expression: `${a}^{${n}} = \\frac{1}{${denom}}`, note: "Exact fraction and decimal" }
            ]
          };
        }
      }
    ]
  },

  // ================= 7. NUMBER THEORY (LCM & HCF) =================
  {
    id: 'number_theory',
    category: 'Numbers',
    subCategory: 'Divisibility',
    title: 'LCM & HCF Divisibility',
    subtitle: 'Greatest Common Divisor (HCF/GCD) and Least Common Multiple (LCM)',
    latex: '\\text{LCM}(a,b) = \\frac{|a \\cdot b|}{\\text{HCF}(a,b)}, \\quad \\text{HCF}(a,b) = \\gcd(a,b)',
    subFormulas: [
      {
        id: 'lcm_calc',
        title: 'LCM (Least Common Multiple)',
        desc: 'Smallest positive integer divisible by both numbers',
        latex: '\\text{LCM}(a, b) = \\frac{|a \\cdot b|}{\\text{HCF}(a, b)}',
        template: 'lcm(a, b)',
        vars: [
          { id: 'a', label: 'First Number (a)', default: 24, type: 'number' },
          { id: 'b', label: 'Second Number (b)', default: 36, type: 'number' }
        ],
        compute(v) {
          const a = Math.abs(parseInt(v.a, 10));
          const b = Math.abs(parseInt(v.b, 10));
          if (!a || !b) return { error: "Please enter non-zero integers." };
          function gcd(x, y) { while (y) { let t = y; y = x % y; x = t; } return x; }
          const hcfVal = gcd(a, b);
          const lcmVal = (a * b) / hcfVal;
          return {
            formulaStatement: { title: "LCM Formula via GCD Relation", latex: "\\text{LCM}(a, b) = \\frac{a \\cdot b}{\\text{HCF}(a, b)}" },
            givenValues: `a = ${a}, \\quad b = ${b}`,
            substitution: `\\text{LCM}(${a}, ${b}) = \\frac{${a} \\cdot ${b}}{\\text{HCF}(${a}, ${b})}`,
            intermediateSteps: [
              { title: "Find Greatest Common Factor (HCF)", expression: `\\text{HCF}(${a}, ${b}) = ${hcfVal}`, note: "Using Euclidean algorithm" },
              { title: "Product of Integers", expression: `${a} \\times ${b} = ${a * b}`, note: "Multiply numbers" },
              { title: "Compute LCM", expression: `\\frac{${a * b}}{${hcfVal}} = ${lcmVal}`, note: "Divide product by HCF" }
            ],
            finalResult: `LCM(${a}, ${b}) = ${lcmVal}`,
            answer: `LCM(${a}, ${b}) = ${lcmVal}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{LCM}(a, b) = \\frac{a \\cdot b}{\\text{HCF}(a, b)}", note: "LCM product relation" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad b = ${b}`, note: "Input integers" },
              { title: "Step 3: Substitution", expression: `\\frac{${a} \\times ${b}}{\\text{HCF}(${a}, ${b})}`, note: "Insert numbers" },
              { title: "Step 4: Intermediate Simplification", expression: `\\text{HCF} = ${hcfVal} \\implies \\frac{${a*b}}{${hcfVal}} = ${lcmVal}`, note: "Compute HCF and divide" },
              { title: "Step 5: Final Result", expression: `\\text{LCM}(${a}, ${b}) = ${lcmVal}`, note: "Least common multiple found" }
            ]
          };
        }
      },
      {
        id: 'hcf_calc',
        title: 'HCF / GCD (Greatest Common Divisor)',
        desc: 'Largest positive integer that divides both numbers without remainder',
        latex: '\\text{HCF}(a, b) = \\gcd(a, b)',
        template: 'gcd(a, b)',
        vars: [
          { id: 'a', label: 'First Number (a)', default: 48, type: 'number' },
          { id: 'b', label: 'Second Number (b)', default: 72, type: 'number' }
        ],
        compute(v) {
          const a = Math.abs(parseInt(v.a, 10));
          const b = Math.abs(parseInt(v.b, 10));
          if (!a || !b) return { error: "Please enter non-zero integers." };
          function gcdWithSteps(x, y) {
            const steps = [];
            let n1 = x, n2 = y;
            while (n2 !== 0) {
              const r = n1 % n2;
              const q = Math.floor(n1 / n2);
              steps.push({ title: "Euclidean Division Step", expression: `${n1} = ${n2} \\times ${q} + ${r}`, note: `Remainder = ${r}` });
              n1 = n2;
              n2 = r;
            }
            return { g: n1, st: steps };
          }
          const res = gcdWithSteps(a, b);
          return {
            formulaStatement: { title: "Euclidean Division Algorithm for HCF", latex: "a = bq + r \\implies \\gcd(a,b) = \\gcd(b,r)" },
            givenValues: `a = ${a}, \\quad b = ${b}`,
            substitution: `\\gcd(${a}, ${b})`,
            intermediateSteps: res.st,
            finalResult: `HCF(${a}, ${b}) = ${res.g}`,
            answer: `HCF(${a}, ${b}) = ${res.g}`,
            steps: [
              { title: "Step 1: Formula Statement", expression: "\\text{HCF}(a, b) = \\gcd(a, b)", note: "Euclidean algorithm identity" },
              { title: "Step 2: Given Values", expression: `a = ${a}, \\quad b = ${b}`, note: "Given integers" },
              { title: "Step 3: Substitution", expression: `\\text{Find largest divisor of } ${a} \\text{ and } ${b}`, note: "Begin Euclidean steps" },
              ...res.st,
              { title: "Step 5: Final Result", expression: `\\text{HCF}(${a}, ${b}) = ${res.g}`, note: "Greatest common divisor found" }
            ]
          };
        }
      }
    ]
  }
];
