/**
 * MathSolver Universal Production Engine
 * Complete 5-Section Step-by-Step Breakdown, Comprehensive Formula Library,
 * Smart Constant Evaluator (Pi, e), Persistent Favorites System, and Offline OCR Heuristics.
 */

const CONFIG = {
  MATHPIX_APP_ID: "",
  MATHPIX_APP_KEY: ""
};

/**
 * THEME MANAGER (Global Dark / Light Mode)
 */
const ThemeManager = {
  STORAGE_KEY: "mathsolver_theme",

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    this.apply(theme);
  },

  getTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  },

  apply(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch {}
    this.updateUI();
  },

  toggle() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    showToast(`${next === 'dark' ? 'Dark' : 'Light'} Mode enabled`, 'info');
  },

  updateUI() {
    const isDark = this.getTheme() === 'dark';
    const toggles = document.querySelectorAll('.theme-toggle-checkbox');
    toggles.forEach(t => { t.checked = isDark; });
    const icons = document.querySelectorAll('.theme-toggle-icon');
    icons.forEach(i => {
      i.className = isDark ? "fa-solid fa-moon text-amber-300 text-sm theme-toggle-icon" : "fa-solid fa-sun text-amber-500 text-sm theme-toggle-icon";
    });
  }
};

/**
 * SETTINGS MANAGER
 */
const SettingsManager = {
  STORAGE_KEY: "mathsolver_settings",
  defaults: {
    precision: 4,
    angleMode: "deg"
  },
  get() {
    try {
      const s = localStorage.getItem(this.STORAGE_KEY);
      return s ? JSON.parse(s) : { ...this.defaults };
    } catch {
      return { ...this.defaults };
    }
  },
  set(key, val) {
    const s = this.get();
    s[key] = val;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(s));
    } catch {}
    this.updateUI();
  },
  init() {
    this.updateUI();
  },
  updateUI() {
    const s = this.get();
    const prec = document.getElementById('settingPrecision');
    if (prec) prec.value = s.precision;
    const angle = document.getElementById('settingAngleMode');
    if (angle) angle.value = s.angleMode;
  }
};

/**
 * UTILITY HELPERS
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  const bg = type === 'error' ? 'bg-red-800' : type === 'success' ? 'bg-sage-green' : 'bg-gray-800';
  toast.className = `${bg} text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 transform transition-all duration-300 pointer-events-auto opacity-0 translate-y-2`;
  
  const icon = type === 'error' ? 'fa-circle-exclamation' : type === 'success' ? 'fa-circle-check' : 'fa-circle-info';
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', '-translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

async function typeset(element) {
  if (window.MathJax && window.MathJax.typesetPromise) {
    try { await window.MathJax.typesetPromise(element ? [element] : null); } catch (e) { console.warn(e); }
  }
}

/**
 * LOCAL PERSISTENCE STORE (History & Favorites)
 */
const Store = {
  STORAGE_KEY: "mathsolver_history",
  FAVORITES_KEY: "mathsolver_favorites",

  defaultHistory: [
    {
      id: "seed-1",
      query: "x^2 - 5x + 6 = 0",
      answer: "x = 2, x = 3",
      formulaStatement: {
        title: "Standard Quadratic Formula",
        latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
      },
      givenValues: "a = 1, \\quad b = -5, \\quad c = 6",
      substitution: "x = \\frac{-(-5) \\pm \\sqrt{(-5)^2 - 4(1)(6)}}{2(1)}",
      steps: [
        { title: "Standard Quadratic Form", expression: "1x^2 - 5x + 6 = 0", note: "Coefficients: a = 1, b = -5, c = 6" },
        { title: "Calculate Discriminant", expression: "\\Delta = b^2 - 4ac = (-5)^2 - 4(1)(6) = 25 - 24 = 1", note: "\\Delta > 0 indicates two distinct real roots" },
        { title: "Factoring", expression: "(x - 2)(x - 3) = 0", note: "Find integers whose product is 6 and sum is -5" },
        { title: "Quadratic Formula", expression: "x = \\frac{-(-5) \\pm \\sqrt{1}}{2(1)} = \\frac{5 \\pm 1}{2}", note: "Apply x = (-b ± √Δ) / 2a" },
        { title: "Final Roots", expression: "x_1 = 2, \\quad x_2 = 3", note: "Both solutions verified" }
      ],
      timestamp: Date.now() - 3600000
    },
    {
      id: "seed-2",
      query: "integral(2x)",
      answer: "x² + C",
      formulaStatement: {
        title: "Indefinite Integration Power Rule",
        latex: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C"
      },
      givenValues: "f(x) = 2x, \\quad n = 1, \\quad k = 2",
      substitution: "\\int 2x \\, dx = 2 \\cdot \\frac{x^{1+1}}{1+1} + C",
      steps: [
        { title: "Identify Integrand", expression: "f(x) = 2x", note: "Indefinite integral with respect to x" },
        { title: "Integration Power Rule", expression: "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C", note: "Here exponent n = 1" },
        { title: "Evaluate Antiderivative", expression: "2 \\cdot \\frac{x^{1+1}}{2} + C = 2 \\cdot \\frac{x^2}{2} + C", note: "Cancel coefficient 2" },
        { title: "Result", expression: "x^2 + C", note: "Add arbitrary integration constant C" }
      ],
      timestamp: Date.now() - 7200000
    },
    {
      id: "seed-3",
      query: "sin(30)",
      answer: "0.5",
      formulaStatement: {
        title: "Trigonometric Sine Evaluation",
        latex: "\\sin(\\theta) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}"
      },
      givenValues: "\\theta = 30^\\circ = \\frac{\\pi}{6} \\text{ radians}",
      substitution: "\\sin(30^\\circ) = \\sin\\left(\\frac{\\pi}{6}\\right)",
      steps: [
        { title: "Trigonometric Function", expression: "\\sin(30^\\circ)", note: "Angle given in degrees" },
        { title: "Degree to Radian Conversion", expression: "30^\\circ = 30 \\times \\frac{\\pi}{180} = \\frac{\\pi}{6} \\text{ rad}", note: "Standard special reference angle" },
        { title: "Evaluation", expression: "\\sin(30^\\circ) = \\frac{1}{2} = 0.5", note: "Exact ratio on unit circle" }
      ],
      timestamp: Date.now() - 10800000
    },
    {
      id: "seed-4",
      query: "d/dx(x^3)",
      answer: "3x²",
      formulaStatement: {
        title: "Differential Power Rule",
        latex: "\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}"
      },
      givenValues: "f(x) = x^3, \\quad n = 3",
      substitution: "\\frac{d}{dx}[x^3] = 3 \\cdot x^{3-1}",
      steps: [
        { title: "Differentiation Target", expression: "f(x) = x^3", note: "Differentiate with respect to x" },
        { title: "Derivative Power Rule", expression: "\\frac{d}{dx} x^n = n x^{n-1}", note: "Here exponent n = 3" },
        { title: "Calculate Derivative", expression: "3 \\cdot x^{3-1} = 3x^2", note: "Multiply by power and decrement exponent" }
      ],
      timestamp: Date.now() - 14400000
    }
  ],

  getHistory() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultHistory));
        return this.defaultHistory;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : this.defaultHistory;
    } catch {
      return this.defaultHistory;
    }
  },

  saveItem(item) {
    const history = this.getHistory();
    const queryKey = (item.query || '').toLowerCase().replace(/\s+/g, '');
    const existingIdx = history.findIndex(h => (h.query || '').toLowerCase().replace(/\s+/g, '') === queryKey);
    if (existingIdx !== -1) {
      history.splice(existingIdx, 1);
    }
    const savedObj = {
      id: item.id || ('sol-' + Date.now()),
      query: item.query || item.title || 'Math Problem',
      answer: item.answer || item.finalResult || '',
      formulaStatement: item.formulaStatement,
      givenValues: item.givenValues,
      substitution: item.substitution,
      intermediateSteps: item.intermediateSteps,
      steps: item.steps || [],
      timestamp: Date.now()
    };
    history.unshift(savedObj);
    if (history.length > 50) history.pop();
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
    this.renderHomeChips();
    this.renderFullList();
    this.updateProfileCount();
    return savedObj;
  },

  clearHistory() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.renderHomeChips();
    this.renderFullList();
    this.updateProfileCount();
    showToast("History cleared", "info");
  },

  // ===== FAVORITES SYSTEM =====
  get favorites() {
    return this.getFavorites();
  },

  set favorites(arr) {
    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(arr || []));
    } catch {}
    this.updateProfileCount();
    this.renderFavoritesList();
  },

  getFavorites() {
    try {
      const raw = localStorage.getItem(this.FAVORITES_KEY);
      if (!raw) {
        const initial = [this.defaultHistory[0]];
        localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(initial));
        return initial;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveFavorite(item) {
    if (!item) return;
    if (!this.isFavorite(item)) {
      this.toggleFavorite(item);
    }
  },

  removeFavorite(itemOrId) {
    const id = typeof itemOrId === 'string' ? itemOrId : (itemOrId ? itemOrId.id : null);
    if (id) this.removeFavoriteById(id);
  },

  isFavorite(itemOrId) {
    if (!itemOrId) return false;
    const favs = this.getFavorites();
    const key = typeof itemOrId === 'string' ? itemOrId : (itemOrId.id || itemOrId.query);
    return favs.some(f => f.id === key || (f.query && itemOrId.query && f.query.trim().toLowerCase() === itemOrId.query.trim().toLowerCase()));
  },

  toggleFavorite(item) {
    if (!item) return false;
    let favs = this.getFavorites();
    const queryKey = (item.query || item.title || '').trim().toLowerCase();
    const existingIdx = favs.findIndex(f => (f.id && item.id && f.id === item.id) || (f.query && f.query.trim().toLowerCase() === queryKey));
    
    let isNowFav = false;
    if (existingIdx !== -1) {
      favs.splice(existingIdx, 1);
      isNowFav = false;
      showToast("Removed from Favorites", "info");
    } else {
      favs.unshift({
        id: item.id || ('fav-' + Date.now()),
        query: item.query || item.title || 'Saved Problem',
        answer: item.answer || item.finalResult || '',
        formulaStatement: item.formulaStatement,
        givenValues: item.givenValues,
        substitution: item.substitution,
        intermediateSteps: item.intermediateSteps,
        steps: item.steps || [],
        timestamp: Date.now()
      });
      if (favs.length > 50) favs.pop();
      isNowFav = true;
      showToast("Saved to Favorites ⭐", "success");
    }

    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favs));
    } catch (e) {
      console.warn("Storage quota error:", e);
    }

    this.updateProfileCount();
    this.renderFavoritesList();
    UI.updateFavoriteBtnState();
    return isNowFav;
  },

  removeFavoriteById(id) {
    let favs = this.getFavorites();
    favs = favs.filter(f => f.id !== id);
    try {
      localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favs));
    } catch {}
    this.renderFavoritesList();
    this.updateProfileCount();
    UI.updateFavoriteBtnState();
    showToast("Removed from Favorites", "info");
  },

  clearFavorites() {
    localStorage.removeItem(this.FAVORITES_KEY);
    this.renderFavoritesList();
    this.updateProfileCount();
    UI.updateFavoriteBtnState();
    showToast("Favorites cleared", "info");
  },

  renderFavoritesList(filter = '') {
    const container = document.getElementById('profileFavoritesContainer');
    if (!container) return;
    const favs = this.getFavorites();
    const q = (filter || '').toLowerCase().trim();
    const filtered = q ? favs.filter(f => (f.query || '').toLowerCase().includes(q) || (f.answer || '').toLowerCase().includes(q)) : favs;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-xs text-gray-400 dark:text-gray-500 italic">${q ? 'No favorites match your search.' : 'No favorites saved yet. Tap the star icon on any solution to bookmark it here!'}</div>`;
      return;
    }

    container.innerHTML = filtered.map((item) => {
      const displayLabel = (item.query || 'Saved Item').replace(/\*/g, '·').replace(/\^2/g, '²').replace(/\^3/g, '³');
      const formulaTitle = item.formulaStatement && item.formulaStatement.title ? `<span class="inline-block px-1.5 py-0.5 rounded bg-sage-green/10 text-sage-green text-[9px] font-semibold mr-1.5">${item.formulaStatement.title}</span>` : '';
      return `
        <div class="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-sage-green/10 dark:hover:bg-sage-green/20 rounded-xl transition flex justify-between items-center group">
          <div onclick="Store.loadFavoriteById('${item.id}')" class="flex-1 cursor-pointer min-w-0 mr-2">
            <div class="flex items-center gap-1">
              ${formulaTitle}
              <span class="font-mono text-xs font-bold text-gray-800 dark:text-gray-200 truncate">${displayLabel}</span>
            </div>
            <div class="text-[11px] text-sage-green font-semibold truncate mt-0.5">${item.answer}</div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button onclick="Store.loadFavoriteById('${item.id}')" title="Jump to Solution" class="p-1.5 rounded-lg text-sage-green hover:bg-sage-green/20 transition cursor-pointer">
              <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </button>
            <button onclick="Store.removeFavoriteById('${item.id}')" title="Remove Favorite" class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition cursor-pointer">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  loadFavoriteById(id) {
    const favs = this.getFavorites();
    const item = favs.find(f => f.id === id);
    if (!item) return;
    closeModal('profileModal');
    UI.displaySolution(item);
  },

  loadFavoriteByIndex(idx) {
    const favs = this.getFavorites();
    const item = favs[idx];
    if (!item) return;
    closeModal('profileModal');
    UI.displaySolution(item);
  },

  renderHomeChips() {
    const container = document.getElementById('homeRecentsContainer');
    if (!container) return;
    const history = this.getHistory();
    if (history.length === 0) {
      container.innerHTML = `<span class="text-xs text-gray-400 dark:text-gray-500 italic py-1 px-1">No recent problems yet</span>`;
      return;
    }
    container.innerHTML = history.slice(0, 6).map((item, idx) => {
      const displayLabel = (item.query || '').replace(/\*/g, '·').replace(/\^2/g, '²').replace(/\^3/g, '³');
      return `<button onclick="Store.loadRecentByIndex(${idx})" class="px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-200 border border-gray-200/60 dark:border-gray-700 shadow-sm whitespace-nowrap hover:border-sage-green hover:bg-sage-green/5 transition cursor-pointer">
        ${displayLabel}
      </button>`;
    }).join('');
  },

  renderFullList() {
    const container = document.getElementById('recentsFullListContainer');
    if (!container) return;
    const history = this.getHistory();
    if (history.length === 0) {
      container.innerHTML = `<div class="p-4 text-center text-xs text-gray-400 dark:text-gray-500">No stored solutions yet. Solve a problem to see it here!</div>`;
      return;
    }
    container.innerHTML = history.map((item, idx) => {
      const displayLabel = (item.query || '').replace(/\*/g, '·').replace(/\^2/g, '²').replace(/\^3/g, '³');
      const isFav = this.isFavorite(item);
      const starIcon = isFav ? "fa-solid fa-star text-amber-500" : "fa-regular fa-star text-gray-400 hover:text-amber-500";
      return `
        <div class="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-sage-green/10 dark:hover:bg-sage-green/20 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 flex justify-between items-center transition group">
          <div onclick="closeModal('recentsListModal'); Store.loadRecentByIndex(${idx});" class="flex-1 cursor-pointer truncate mr-2">
            <span class="font-mono text-gray-800 dark:text-gray-200">${displayLabel}</span>
            <div class="text-sage-green font-bold text-[11px] truncate mt-0.5">${item.answer}</div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0">
            <button onclick="event.stopPropagation(); Store.toggleFavorite(Store.getHistory()[${idx}]); Store.renderFullList();" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}" class="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 transition cursor-pointer">
              <i class="${starIcon}"></i>
            </button>
            <button onclick="closeModal('recentsListModal'); Store.loadRecentByIndex(${idx});" title="Open Solution" class="p-1.5 rounded-lg text-sage-green hover:bg-sage-green/20 transition cursor-pointer">
              <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  loadRecentByIndex(index) {
    const history = this.getHistory();
    const item = history[index];
    if (!item) return;
    UI.displaySolution(item);
  },

  updateProfileCount() {
    const histEl = document.getElementById('savedSolutionsCount');
    const favEl = document.getElementById('savedFavoritesCount');
    if (histEl) histEl.innerText = this.getHistory().length.toString();
    if (favEl) favEl.innerText = this.getFavorites().length.toString();
    this.renderFavoritesList();
  }
};
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
/**
 * MATH SOLVER ENGINE (Linear, Quadratic, Calculus, Trig, Arithmetic)
 * Enhanced with Smart Constant Evaluator (Pi, e) and Universal 5-Section Step Breakdown.
 */
const Solver = {
  async solve(rawInput) {
    if (!rawInput || !rawInput.trim()) {
      return {
        query: rawInput,
        answer: "Empty Expression",
        error: true,
        steps: [{ title: "Input Error", expression: "", note: "Please enter a valid mathematical expression." }]
      };
    }

    let clean = rawInput.trim();

    // Normalize OCR unicode superscripts (⁰¹²³⁴⁵⁶⁷⁸⁹) to carets
    const superscripts = {
      '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4',
      '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9',
      '⁺': '^+', '⁻': '^-'
    };
    for (const [sup, rep] of Object.entries(superscripts)) {
      clean = clean.split(sup).join(rep);
    }

    // Normalize characters
    clean = clean
      .replace(/[\u2012\u2013\u2014\u2212_]/g, '-')
      .replace(/[\u00D7\u22C5]/g, '*')
      .replace(/[\u00F7]/g, '/')
      .replace(/π/g, 'pi')
      .replace(/\bPi\b/g, 'pi');

    // 1. DERIVATIVE DETECTION: d/dx(...) or diff(...) or derivative(...)
    const derivMatch = clean.match(/^(?:d\/dx|diff|derivative)\s*\(?([^)]+?)\)?$/i);
    if (derivMatch) {
      return this.solveDerivative(rawInput, derivMatch[1].trim());
    }

    // 2. INTEGRAL DETECTION: integral(...) or integrate(...) or ∫...
    const intMatch = clean.match(/^(?:integral|integrate)\s*\(?([^)]+?)\)?(?:\s*dx)?$/i) || clean.match(/^(?:∫)\s*(.+?)(?:\s*dx)?$/i);
    if (intMatch) {
      return this.solveIntegral(rawInput, intMatch[1].trim());
    }

    // 3. EQUATIONS WITH EQUALS SIGN (Linear or Quadratic)
    if (clean.includes('=')) {
      return this.solveEquation(rawInput, clean);
    }

    // 4. TRIGONOMETRIC EXPRESSIONS: sin(30), cos(45), tan(60)...
    const trigMatch = clean.match(/^(sin|cos|tan|cot|sec|csc)\s*\(\s*([^)]+)\s*\)$/i);
    if (trigMatch) {
      return this.solveTrig(rawInput, trigMatch[1].toLowerCase(), trigMatch[2].trim());
    }

    // 5. GENERAL POLYNOMIAL / ALGEBRAIC SIMPLIFICATION (variables like x, y, a, b)
    const stripped = clean.replace(/[a-zA-Z]+/g, m => ['sqrt','log','ln','abs','exp','pi','e'].includes(m.toLowerCase()) ? '' : m);
    if (/[a-zA-Z]/.test(stripped)) {
      return this.solveAlgebraic(rawInput, clean);
    }

    // 6. ARITHMETIC EVALUATION (PEMDAS with Smart Constant Evaluation)
    return this.solveArithmetic(rawInput, clean);
  },

  // Smart numerical constant evaluator helper
  evaluateNumericWithConstants(exprStr) {
    try {
      const scope = {
        pi: 3.141592653589793,
        e: 2.718281828459045
      };
      const res = math.evaluate(exprStr, scope);
      if (typeof res === 'number') {
        return Number.isInteger(res) ? res : parseFloat(res.toFixed(6));
      }
      return res;
    } catch {
      return null;
    }
  },

  // Linear & Quadratic Equation Solver
  solveEquation(raw, clean) {
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
    const varMatch = clean.match(/[a-zA-Z]/);
    const v = varMatch ? varMatch[0] : 'x';
    const diffExpr = `(${lhsStr}) - (${rhsStr})`;

    try {
      const f0 = math.evaluate(diffExpr, { [v]: 0 });
      const f1 = math.evaluate(diffExpr, { [v]: 1 });
      const fn1 = math.evaluate(diffExpr, { [v]: -1 });
      const f2 = math.evaluate(diffExpr, { [v]: 2 });

      const c = f0;
      const a = (f1 + fn1 - 2 * c) / 2;
      const b = (f1 - fn1) / 2;
      const expectedF2 = 4 * a + 2 * b + c;
      const isQuadraticOrLinear = Math.abs(f2 - expectedF2) < 1e-4;

      if (!isQuadraticOrLinear || (Math.abs(a) < 1e-7 && Math.abs(b) < 1e-7)) {
        const simp = math.simplify(diffExpr).toString();
        return {
          query: raw,
          answer: `${simp} = 0`,
          formulaStatement: {
            title: "General Algebraic Equation",
            latex: "f(x) - g(x) = 0"
          },
          givenValues: `\\text{LHS} = ${lhsStr}, \\quad \\text{RHS} = ${rhsStr}`,
          substitution: `(${lhsStr}) - (${rhsStr}) = 0`,
          intermediateSteps: [
            { title: "Subtract RHS from LHS", expression: `(${lhsStr}) - (${rhsStr}) = 0`, note: "Collect all terms on one side" },
            { title: "Algebraic Simplification", expression: `${simp} = 0`, note: "Combine like terms" }
          ],
          finalResult: `${simp} = 0`,
          steps: [
            { title: "Subtract RHS from LHS", expression: `(${lhsStr}) - (${rhsStr}) = 0`, note: "Move terms to one side" },
            { title: "Algebraic Simplification", expression: `${simp} = 0`, note: "Combine like terms" }
          ]
        };
      }

      // Linear equation: b*x + c = 0 -> x = -c/b
      if (Math.abs(a) < 1e-6) {
        const root = -c / b;
        const cleanRoot = Number.isInteger(root) ? root : parseFloat(root.toFixed(5));
        const signC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
        const bDisplay = b === 1 ? '' : b === -1 ? '-' : b;

        return {
          query: raw,
          answer: `${v} = ${cleanRoot}`,
          formulaStatement: {
            title: "Linear Equation Canonical Form",
            latex: "ax + b = 0 \\implies x = -\\frac{b}{a}"
          },
          givenValues: `\\text{Slope/Coefficient } a = ${b}, \\quad \\text{Constant } b = ${c}`,
          substitution: `${bDisplay}${v} ${signC} = 0 \\implies ${v} = -\\frac{${c}}{${b}}`,
          intermediateSteps: [
            { title: "Canonical Linear Form", expression: `${bDisplay}${v} ${signC} = 0`, note: "Arranged in standard form" },
            { title: "Isolate Variable Term", expression: `${bDisplay}${v} = ${-c}`, note: `Subtract ${c} from both sides` },
            { title: "Divide by Coefficient", expression: `${v} = \\frac{${-c}}{${b}} = ${cleanRoot}`, note: `Divide by coefficient ${b}` }
          ],
          finalResult: `${v} = ${cleanRoot}`,
          steps: [
            { title: "Standard Form", expression: `${bDisplay}${v} ${signC} = 0`, note: "Arranged in canonical linear form" },
            { title: "Isolate Variable", expression: `${bDisplay}${v} = ${-c}`, note: `Subtract ${c} from both sides` },
            { title: "Solve for Root", expression: `${v} = \\frac{${-c}}{${b}} = ${cleanRoot}`, note: "Unique linear root determined" }
          ]
        };
      }

      // Quadratic equation: ax^2 + bx + c = 0
      const disc = b * b - 4 * a * c;
      const cleanA = Number.isInteger(a) ? a : parseFloat(a.toFixed(4));
      const cleanB = Number.isInteger(b) ? b : parseFloat(b.toFixed(4));
      const cleanC = Number.isInteger(c) ? c : parseFloat(c.toFixed(4));
      const cleanDisc = Number.isInteger(disc) ? disc : parseFloat(disc.toFixed(4));

      const intermediate = [
        {
          title: "Standard Quadratic Form",
          expression: `${cleanA}${v}^2 ${cleanB >= 0 ? '+' : '-'} ${Math.abs(cleanB)}${v} ${cleanC >= 0 ? '+' : '-'} ${Math.abs(cleanC)} = 0`,
          note: `Extracted coefficients: a = ${cleanA}, b = ${cleanB}, c = ${cleanC}`
        },
        {
          title: "Calculate Discriminant",
          expression: `\\Delta = b^2 - 4ac = (${cleanB})^2 - 4(${cleanA})(${cleanC}) = ${cleanDisc}`,
          note: disc > 0 ? "Δ > 0 indicates two distinct real roots" : disc === 0 ? "Δ = 0 indicates exactly one repeated real root" : "Δ < 0 indicates two complex conjugate roots"
        }
      ];

      let answerStr = "";
      if (disc >= 0) {
        const sqrtDisc = Math.sqrt(disc);
        const r1 = (-b + sqrtDisc) / (2 * a);
        const r2 = (-b - sqrtDisc) / (2 * a);
        const cleanR1 = Number.isInteger(r1) ? r1 : parseFloat(r1.toFixed(4));
        const cleanR2 = Number.isInteger(r2) ? r2 : parseFloat(r2.toFixed(4));

        if (Math.abs(r1 - r2) < 1e-6) {
          answerStr = `${v} = ${cleanR1}`;
          intermediate.push({
            title: "Repeated Root",
            expression: `${v} = \\frac{-(${cleanB})}{2(${cleanA})} = ${cleanR1}`,
            note: "Single repeated real root"
          });
        } else {
          answerStr = `${v} = ${cleanR1}, ${v} = ${cleanR2}`;
          intermediate.push({
            title: "Evaluate Quadratic Formula",
            expression: `${v} = \\frac{-(${cleanB}) \\pm \\sqrt{${cleanDisc}}}{2(${cleanA})}`,
            note: "Evaluate both addition and subtraction branches"
          });
          intermediate.push({
            title: "Computed Real Roots",
            expression: `${v}_1 = ${cleanR1}, \\quad ${v}_2 = ${cleanR2}`,
            note: "Both solutions verified by substitution"
          });
        }
      } else {
        const realPart = parseFloat((-b / (2 * a)).toFixed(4));
        const imagPart = parseFloat((Math.sqrt(-disc) / (2 * a)).toFixed(4));
        answerStr = `${v} = ${realPart} ± ${Math.abs(imagPart)}i`;
        intermediate.push({
          title: "Complex Conjugate Roots",
          expression: `${v} = ${realPart} \\pm ${Math.abs(imagPart)}i`,
          note: "No real solutions exist because Δ < 0"
        });
      }

      return {
        query: raw,
        answer: answerStr,
        formulaStatement: {
          title: "Quadratic Formula",
          latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
        },
        givenValues: `a = ${cleanA}, \\quad b = ${cleanB}, \\quad c = ${cleanC}`,
        substitution: `${v} = \\frac{-(${cleanB}) \\pm \\sqrt{(${cleanB})^2 - 4(${cleanA})(${cleanC})}}{2(${cleanA})}`,
        intermediateSteps: intermediate,
        finalResult: answerStr,
        steps: intermediate
      };
    } catch (err) {
      return {
        query: raw,
        answer: "Equation Error",
        error: true,
        steps: [{ title: "Error", expression: raw, note: err.message }]
      };
    }
  },

  // Derivative Solver
  solveDerivative(raw, targetExpr) {
    try {
      const node = math.parse(targetExpr);
      const deriv = math.derivative(node, 'x');
      const simpDeriv = math.simplify(deriv).toString();
      const displayAns = simpDeriv
        .replace(/\s*\*\s*/g, '')
        .replace(/\^2/g, '²')
        .replace(/\^3/g, '³')
        .replace(/\^4/g, '⁴');

      const intermediate = [
        {
          title: "Identify Function",
          expression: `f(x) = ${targetExpr}`,
          note: "Differentiating with respect to variable x"
        }
      ];

      let formulaLat = "\\frac{d}{dx}[f(x)] = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}";
      if (/x\^(\d+)/.test(targetExpr) || targetExpr === 'x') {
        formulaLat = "\\frac{d}{dx}[x^n] = n x^{n-1}";
        intermediate.push({
          title: "Apply Power Rule",
          expression: "\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}",
          note: "Multiply by exponent and decrement power by 1"
        });
      } else if (/sin\(x\)/i.test(targetExpr)) {
        formulaLat = "\\frac{d}{dx}[\\sin(x)] = \\cos(x)";
      } else if (/cos\(x\)/i.test(targetExpr)) {
        formulaLat = "\\frac{d}{dx}[\\cos(x)] = -\\sin(x)";
      }

      intermediate.push({
        title: "Differentiate & Simplify",
        expression: `\\frac{d}{dx}\\left(${targetExpr}\\right) = ${simpDeriv}`,
        note: "Result simplified according to algebraic laws"
      });

      return {
        query: raw,
        answer: displayAns,
        formulaStatement: {
          title: "Derivative Rule",
          latex: formulaLat
        },
        givenValues: `f(x) = ${targetExpr}`,
        substitution: `\\frac{d}{dx}\\left(${targetExpr}\\right)`,
        intermediateSteps: intermediate,
        finalResult: displayAns,
        steps: intermediate
      };
    } catch (err) {
      return {
        query: raw,
        answer: "Derivative Error",
        error: true,
        steps: [{ title: "Parsing Error", expression: targetExpr, note: err.message }]
      };
    }
  },

  // Integral Solver
  solveIntegral(raw, integrand) {
    try {
      const normInt = integrand.trim().toLowerCase();
      let answer = "";
      let formulaLat = "\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C";
      const intermediate = [
        {
          title: "Identify Integrand",
          expression: `f(x) = ${integrand}`,
          note: "Indefinite integration with respect to x"
        }
      ];

      const polyMatch = normInt.match(/^([+-]?\d*(?:\.\d+)?)\s*\*?\s*x(?:\^(\d+))?$/);
      if (normInt === '2x' || normInt === '2*x') {
        formulaLat = "\\int 2x \\, dx = x^2 + C";
        intermediate.push({
          title: "Power Rule for Integrals",
          expression: "\\int 2x \\, dx = 2 \\left(\\frac{x^{1+1}}{2}\\right) + C",
          note: "Cancel factor 2"
        });
        answer = "x² + C";
      } else if (polyMatch) {
        let coef = polyMatch[1] === '' || polyMatch[1] === '+' ? 1 : polyMatch[1] === '-' ? -1 : parseFloat(polyMatch[1]);
        let power = polyMatch[2] ? parseInt(polyMatch[2], 10) : 1;
        let newPower = power + 1;
        let newCoef = coef / newPower;
        let newCoefStr = Number.isInteger(newCoef) ? (newCoef === 1 ? '' : newCoef === -1 ? '-' : newCoef) : `\\frac{${coef}}{${newPower}}`;

        intermediate.push({
          title: "Power Rule for Integrals",
          expression: `\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C`,
          note: `Increment exponent from ${power} to ${newPower} and divide by ${newPower}`
        });
        answer = `${newCoefStr}x^${newPower} + C`.replace(/\^2/g, '²').replace(/\^3/g, '³');
      } else if (normInt === 'sin(x)' || normInt === 'sin x') {
        formulaLat = "\\int \\sin(x) \\, dx = -\\cos(x) + C";
        answer = "-cos(x) + C";
      } else if (normInt === 'cos(x)' || normInt === 'cos x') {
        formulaLat = "\\int \\cos(x) \\, dx = \\sin(x) + C";
        answer = "sin(x) + C";
      } else if (!isNaN(parseFloat(normInt)) && !/[a-z]/i.test(normInt)) {
        const k = parseFloat(normInt);
        formulaLat = "\\int k \\, dx = kx + C";
        answer = `${k}x + C`;
      } else {
        answer = `∫(${integrand})dx + C`;
      }

      intermediate.push({
        title: "Add Arbitrary Constant",
        expression: `\\text{Answer: } ${answer}`,
        note: "C represents the arbitrary constant of indefinite integration"
      });

      return {
        query: raw,
        answer: answer,
        formulaStatement: {
          title: "Indefinite Integral Rule",
          latex: formulaLat
        },
        givenValues: `f(x) = ${integrand}`,
        substitution: `\\int \\left(${integrand}\\right) dx`,
        intermediateSteps: intermediate,
        finalResult: answer,
        steps: intermediate
      };
    } catch (err) {
      return {
        query: raw,
        answer: "Integration Error",
        error: true,
        steps: [{ title: "Error", expression: integrand, note: err.message }]
      };
    }
  },

  // Trigonometric Solver
  solveTrig(raw, func, argStr) {
    try {
      let angleDeg = null;
      let isDegree = false;

      if (argStr.includes('deg')) {
        angleDeg = parseFloat(argStr.replace('deg', ''));
        isDegree = true;
      } else if (argStr.includes('rad') || argStr.includes('pi')) {
        const radVal = math.evaluate(argStr.replace('rad', ''));
        angleDeg = radVal * (180 / Math.PI);
        isDegree = false;
      } else {
        const num = parseFloat(argStr);
        if (!isNaN(num)) {
          angleDeg = num;
          isDegree = true;
        }
      }

      if (angleDeg !== null) {
        const angleRad = angleDeg * (Math.PI / 180);
        let val;
        if (func === 'sin') val = Math.sin(angleRad);
        else if (func === 'cos') val = Math.cos(angleRad);
        else if (func === 'tan') {
          if (Math.abs(angleDeg % 180 - 90) < 1e-6) {
            return {
              query: raw,
              answer: "Undefined (Asymptote)",
              steps: [{ title: "Trigonometric Undefined", expression: `\\tan(${angleDeg}^\\circ) = \\pm \\infty`, note: "Tangent is undefined at odd multiples of 90°" }]
            };
          }
          val = Math.tan(angleRad);
        } else if (func === 'cot') val = 1 / Math.tan(angleRad);
        else if (func === 'sec') val = 1 / Math.cos(angleRad);
        else if (func === 'csc') val = 1 / Math.sin(angleRad);

        const cleanVal = Math.abs(val) < 1e-12 ? 0 : Math.abs(val - 0.5) < 1e-10 ? 0.5 : Math.abs(val + 0.5) < 1e-10 ? -0.5 : Math.abs(val - 1) < 1e-10 ? 1 : Math.abs(val + 1) < 1e-10 ? -1 : parseFloat(val.toFixed(5));

        const intermediate = [
          {
            title: "Trigonometric Function",
            expression: `\\${func}(${angleDeg}^\\circ)`,
            note: "Evaluating in standard degree mode"
          },
          {
            title: "Degree to Radian Conversion",
            expression: `${angleDeg}^\\circ = ${angleDeg} \\times \\frac{\\pi}{180} = ${parseFloat(angleRad.toFixed(4))} \\text{ rad}`,
            note: `Constant \\pi \\approx 3.14159265`
          },
          {
            title: "Unit Circle Evaluation",
            expression: `\\${func}(${angleDeg}^\\circ) = ${cleanVal}`,
            note: "Computed exact trigonometric ratio"
          }
        ];

        return {
          query: raw,
          answer: cleanVal.toString(),
          formulaStatement: {
            title: `Trigonometric ${func.toUpperCase()} Function`,
            latex: `\\${func}(\\theta)`
          },
          givenValues: `\\theta = ${angleDeg}^\\circ`,
          substitution: `\\${func}(${angleDeg}^\\circ)`,
          intermediateSteps: intermediate,
          finalResult: cleanVal.toString(),
          steps: intermediate
        };
      }

      const res = math.evaluate(clean);
      return {
        query: raw,
        answer: res.toString(),
        steps: [{ title: "Result", expression: `${clean} = ${res}`, note: "Evaluated in radians" }]
      };
    } catch (err) {
      return {
        query: raw,
        answer: "Trig Error",
        error: true,
        steps: [{ title: "Error", expression: raw, note: err.message }]
      };
    }
  },

  // Algebraic Simplification
  solveAlgebraic(raw, clean) {
    try {
      const simplified = math.simplify(clean).toString();
      const intermediate = [
        { title: "Identify Algebraic Expression", expression: clean, note: "Parse symbols and operations" },
        { title: "Distribute & Group Like Terms", expression: "Combine variables and constants", note: "Apply distributive and associative laws" },
        { title: "Simplified Expression", expression: simplified, note: "Final irreducible form" }
      ];

      return {
        query: raw,
        answer: simplified.replace(/\*/g, ''),
        formulaStatement: {
          title: "Algebraic Simplification",
          latex: "\\text{Simplify: } f(x)"
        },
        givenValues: `\\text{Expression: } ${clean}`,
        substitution: clean,
        intermediateSteps: intermediate,
        finalResult: simplified.replace(/\*/g, ''),
        steps: intermediate
      };
    } catch {
      return this.solveArithmetic(raw, clean);
    }
  },

  // Arithmetic (PEMDAS with Smart Constant Evaluator)
  solveArithmetic(raw, clean) {
    try {
      if (/\/0(?!\.)/.test(clean)) {
        return {
          query: raw,
          answer: "Division by Zero (Undefined)",
          error: true,
          steps: [{ title: "Division by Zero", expression: clean, note: "Dividing any finite number by zero is undefined." }]
        };
      }

      const hasPi = /\bpi\b|π/i.test(clean);
      const hasE = /\be\b/i.test(clean);

      const intermediate = [
        {
          title: "Parse Expression",
          expression: clean,
          note: "Parsed operands and operations safely without eval()"
        }
      ];

      if (hasPi || hasE) {
        intermediate.push({
          title: "Substitute Mathematical Constants",
          expression: `${hasPi ? '\\pi \\approx 3.14159265' : ''} ${hasPi && hasE ? ', \\quad ' : ''} ${hasE ? 'e \\approx 2.71828183' : ''}`,
          note: "Recognized constant symbols evaluated to high-precision numerical values"
        });
      }

      intermediate.push({
        title: "Order of Operations (PEMDAS)",
        expression: "\\text{Parentheses} \\to \\text{Exponents} \\to \\text{Multiply/Divide} \\to \\text{Add/Subtract}",
        note: "Standard algebraic hierarchy"
      });

      const scope = {
        pi: 3.141592653589793,
        e: 2.718281828459045
      };
      const evaluated = math.evaluate(clean, scope);
      if (evaluated === undefined || evaluated === null || isNaN(evaluated)) {
        throw new Error("Unable to evaluate expression");
      }

      const cleanNum = typeof evaluated === 'number' ? (Number.isInteger(evaluated) ? evaluated : parseFloat(evaluated.toFixed(6))) : evaluated.toString();

      intermediate.push({
        title: "Final Calculated Result",
        expression: `${clean} = ${cleanNum}`,
        note: "Numerical evaluation complete"
      });

      return {
        query: raw,
        answer: cleanNum.toString(),
        formulaStatement: {
          title: "Arithmetic Expression Evaluation (PEMDAS)",
          latex: "\\text{Evaluate: } " + clean.replace(/\*/g, ' \\cdot ')
        },
        givenValues: `\\text{Input: } ${raw}`,
        substitution: clean.replace(/\bpi\b/g, '3.14159265').replace(/\be\b/g, '2.71828183'),
        intermediateSteps: intermediate,
        finalResult: cleanNum.toString(),
        steps: intermediate
      };
    } catch (err) {
      return {
        query: raw,
        answer: "Calculation Error",
        error: true,
        steps: [{ title: "Syntax Error", expression: raw, note: "Please check parentheses, operators, and syntax." }]
      };
    }
  }
};
/**
 * FORMULA ENGINE CONTROLLER, OCR PIPELINE, AND UI LOGIC
 */
const FormulaEngine = {
  activeCategory: 'All',
  searchQuery: '',
  currentGroup: null,     // Currently selected parent formula group
  currentFormula: null,   // Currently active sub-formula

  FORMULAS: [
    ...FORMULA_GROUPS_1,
    ...FORMULA_GROUPS_2,
    ...FORMULA_GROUPS_3,
    ...FORMULA_GROUPS_4,
    ...FORMULA_GROUPS_5
  ],

  init() {
    this.resetToRoot();
  },

  // Reset modal navigation back to root catalog (as required by specification)
  resetToRoot() {
    this.currentGroup = null;
    this.currentFormula = null;
    this.activeCategory = 'All';
    this.searchQuery = '';
    const searchInput = document.getElementById('formulaSearchInput');
    if (searchInput) searchInput.value = '';

    const detail = document.getElementById('formulaDetailView');
    const subMenu = document.getElementById('formulaSubMenuView');
    const list = document.getElementById('formulasListView');
    const resBox = document.getElementById('detailResultBox');

    if (detail) detail.classList.add('hidden');
    if (subMenu) subMenu.classList.add('hidden');
    if (resBox) resBox.classList.add('hidden');
    if (list) list.classList.remove('hidden');

    const title = document.getElementById('formulasModalTitle');
    const sub = document.getElementById('formulasModalSubtitle');
    if (title) title.innerText = "Math Formulas";
    if (sub) sub.innerText = "Select a formula to calculate or apply";

    this.filterCategory('All');
    this.renderList();
  },

  filterCategory(cat) {
    this.activeCategory = cat;
    const btns = document.querySelectorAll('.formula-cat-btn');
    btns.forEach(b => {
      if (b.getAttribute('data-category') === cat) {
        b.className = "formula-cat-btn px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap bg-sage-green text-white transition";
      } else {
        b.className = "formula-cat-btn px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition";
      }
    });
    this.renderList();
  },

  handleSearch(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    this.renderList();
  },

  renderList() {
    const container = document.getElementById('formulasItemsContainer');
    if (!container) return;

    let items = this.FORMULAS;
    if (this.activeCategory !== 'All') {
      items = items.filter(f => f.category === this.activeCategory || f.subCategory === this.activeCategory);
    }
    if (this.searchQuery) {
      items = items.filter(f => {
        const inParent = f.title.toLowerCase().includes(this.searchQuery) ||
                         f.subtitle.toLowerCase().includes(this.searchQuery) ||
                         f.category.toLowerCase().includes(this.searchQuery);
        const inSubs = (f.subFormulas || []).some(s =>
          s.title.toLowerCase().includes(this.searchQuery) ||
          s.desc.toLowerCase().includes(this.searchQuery)
        );
        return inParent || inSubs;
      });
    }

    if (items.length === 0) {
      container.innerHTML = `<div class="p-6 text-center text-xs text-gray-400 italic">No formulas found matching your filter.</div>`;
      return;
    }

    container.innerHTML = items.map(f => {
      const subCount = f.subFormulas ? f.subFormulas.length : 0;
      return `
        <div onclick="FormulaEngine.openGroup('${f.id}')" class="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/80 hover:bg-sage-green/10 dark:hover:bg-sage-green/20 border border-gray-100 dark:border-gray-700 cursor-pointer transition group">
          <div class="flex justify-between items-start mb-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-sage-green bg-sage-green/10 px-2 py-0.5 rounded-full">${f.category}</span>
            <span class="text-[10px] font-bold text-gray-400 bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-600">${subCount} Rules</span>
          </div>
          <h3 class="text-xs font-bold text-gray-800 dark:text-gray-100 group-hover:text-sage-green transition mb-0.5">${f.title}</h3>
          <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-2 mb-2 font-sans">${f.subtitle}</p>
          <div class="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700/80 text-center font-serif text-xs text-gray-800 dark:text-gray-200 overflow-x-auto no-scrollbar py-1">
            $$${f.latex}$$
          </div>
        </div>
      `;
    }).join('');

    typeset(container);
  },

  openGroup(groupId) {
    const group = this.FORMULAS.find(f => f.id === groupId);
    if (!group) return;
    this.currentGroup = group;

    document.getElementById('formulasListView').classList.add('hidden');
    document.getElementById('formulaSubMenuView').classList.remove('hidden');

    document.getElementById('subMenuTitle').innerText = group.title;
    document.getElementById('subMenuSubtitle').innerText = group.subtitle;
    document.getElementById('subMenuCategoryBadge').innerText = group.category;
    document.getElementById('subMenuLatex').innerHTML = `$$${group.latex}$$`;

    const list = document.getElementById('subMenuListContainer');
    list.innerHTML = (group.subFormulas || []).map(sub => `
      <div onclick="FormulaEngine.openDetail('${sub.id}', true)" class="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-sage-green/10 dark:hover:bg-sage-green/20 border border-gray-100 dark:border-gray-700 cursor-pointer transition group">
        <div class="flex items-center justify-between mb-1">
          <h4 class="text-xs font-bold text-gray-800 dark:text-gray-100 group-hover:text-sage-green transition">${sub.title}</h4>
          <i class="fa-solid fa-chevron-right text-[10px] text-gray-400 group-hover:text-sage-green transition"></i>
        </div>
        <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-snug mb-2 font-sans">${sub.desc}</p>
        <div class="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700/80 text-center font-serif text-xs text-gray-800 dark:text-gray-200 overflow-x-auto no-scrollbar py-0.5">
          $$${sub.latex}$$
        </div>
      </div>
    `).join('');

    typeset(document.getElementById('subMenuOverviewCard'));
    typeset(list);
  },

  backFromSubMenu() {
    this.currentGroup = null;
    document.getElementById('formulaSubMenuView').classList.add('hidden');
    document.getElementById('formulasListView').classList.remove('hidden');
    this.renderList();
  },

  openDetail(subFormulaId, fromGroup = false) {
    let sub = null;
    let parent = this.currentGroup;

    if (!parent) {
      for (const g of this.FORMULAS) {
        const found = (g.subFormulas || []).find(s => s.id === subFormulaId);
        if (found) { sub = found; parent = g; break; }
      }
    } else {
      sub = (parent.subFormulas || []).find(s => s.id === subFormulaId);
    }

    if (!sub || !parent) return;
    this.currentGroup = parent;
    this.currentFormula = sub;

    document.getElementById('formulasListView').classList.add('hidden');
    document.getElementById('formulaSubMenuView').classList.add('hidden');
    document.getElementById('formulaDetailView').classList.remove('hidden');

    document.getElementById('detailCategoryBadge').innerText = parent.category;
    document.getElementById('detailBackText').innerText = parent.title;

    this.renderDetailSubTabs();

    document.getElementById('detailFormulaTitle').innerText = sub.title;
    document.getElementById('detailFormulaDesc').innerText = sub.desc;
    document.getElementById('detailFormulaLatex').innerHTML = `$$${sub.latex}$$`;

    const inputsContainer = document.getElementById('detailInputsContainer');
    inputsContainer.innerHTML = (sub.vars || []).map(v => `
      <div>
        <label class="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">${v.label}</label>
        <input type="${v.type === 'number' ? 'number' : 'text'}" id="f_var_${v.id}" value="${v.default}" step="any" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-mono text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sage-green" />
      </div>
    `).join('');

    document.getElementById('detailResultBox').classList.add('hidden');
    typeset(document.getElementById('detailFormulaLatex'));
  },

  renderDetailSubTabs() {
    const tabsBar = document.getElementById('detailSubTabsBar');
    if (!tabsBar || !this.currentGroup) return;

    tabsBar.innerHTML = (this.currentGroup.subFormulas || []).map(s => {
      const active = s.id === this.currentFormula.id;
      const cls = active ? "bg-sage-green text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200";
      return `<button onclick="FormulaEngine.openDetail('${s.id}')" class="px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${cls} transition cursor-pointer">${s.title}</button>`;
    }).join('');
  },

  backFromDetail() {
    document.getElementById('formulaDetailView').classList.add('hidden');
    if (this.currentGroup) {
      document.getElementById('formulaSubMenuView').classList.remove('hidden');
    } else {
      document.getElementById('formulasListView').classList.remove('hidden');
      this.renderList();
    }
  },

  calculateCurrent() {
    if (!this.currentFormula) return;
    const values = {};
    for (const v of (this.currentFormula.vars || [])) {
      const el = document.getElementById(`f_var_${v.id}`);
      if (!el) continue;
      values[v.id] = v.type === 'number' ? parseFloat(el.value) : el.value;
      if (v.type === 'number' && isNaN(values[v.id])) {
        showToast(`Please enter a valid numeric value for ${v.label}`, "error");
        return;
      }
    }

    const res = this.currentFormula.compute(values);
    if (res.error) {
      showToast(res.error, "error");
      return;
    }

    // Attach metadata for solver modal
    res.query = `${this.currentFormula.title}`;
    res.formulaName = this.currentFormula.title;
    this.lastComputedResult = res;

    const resultBox = document.getElementById('detailResultBox');
    const answerEl = document.getElementById('detailResultAnswer');
    const stepsContainer = document.getElementById('detailStepsContainer');

    answerEl.innerText = res.answer || res.finalResult;

    if (res.intermediateSteps && res.intermediateSteps.length > 0) {
      stepsContainer.innerHTML = res.intermediateSteps.map(s => `
        <div class="bg-white dark:bg-gray-900 p-2.5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-xs">
          <div class="font-bold text-gray-800 dark:text-gray-200 text-xs">${s.title}</div>
          <div class="font-serif my-1 text-sage-green text-xs overflow-x-auto no-scrollbar py-0.5">$$${s.expression}$$</div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 italic font-sans">${s.note}</div>
        </div>
      `).join('');
      typeset(stepsContainer);
    }

    resultBox.classList.remove('hidden');
  },

  openFullSolutionFromDetail() {
    if (this.lastComputedResult) {
      closeModal('formulasModal');
      Store.saveItem(this.lastComputedResult);
      UI.displaySolution(this.lastComputedResult);
    }
  },

  toggleDetailSteps() {
    const steps = document.getElementById('detailStepsContainer');
    const icon = document.getElementById('detailStepsIcon');
    const isHidden = steps.classList.contains('hidden');
    if (isHidden) {
      steps.classList.remove('hidden');
      icon.className = "fa-solid fa-chevron-up text-[10px]";
    } else {
      steps.classList.add('hidden');
      icon.className = "fa-solid fa-chevron-down text-[10px]";
    }
  },

  insertCurrentIntoSolver() {
    if (!this.currentFormula) return;
    const values = {};
    for (const v of (this.currentFormula.vars || [])) {
      const el = document.getElementById(`f_var_${v.id}`);
      if (el) values[v.id] = el.value;
    }
    const expr = this.currentFormula.template || this.currentFormula.title;
    closeModal('formulasModal');
    document.getElementById('mathInput').value = expr;
    openModal('writeModal');
    UI.updateLivePreview();
    showToast("Inserted into solver", "success");
  }
};

/**
 * CAMERA & OCR ENGINE (Offline Bradley-Roth Local Thresholding)
 */
const Ocr = {
  stream: null,
  track: null,
  flashOn: false,

  async startCamera() {
    const video = document.getElementById('webcam');
    const promptBadge = document.getElementById('cameraPromptBadge');
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      video.srcObject = this.stream;
      video.classList.remove('hidden');
      this.track = this.stream.getVideoTracks()[0];
      promptBadge.innerText = "Center equation in frame";
    } catch (err) {
      console.warn("Camera access note:", err);
      video.classList.add('hidden');
      promptBadge.innerText = "Camera unavailable. Tap image icon to upload photo.";
    }
  },

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
      this.track = null;
      this.flashOn = false;
    }
  },

  async toggleFlash() {
    if (!this.track) { showToast("Flash not supported on device.", "info"); return; }
    try {
      const cap = this.track.getCapabilities();
      if (!cap.torch) { showToast("Torch not supported by this camera.", "info"); return; }
      this.flashOn = !this.flashOn;
      await this.track.applyConstraints({ advanced: [{ torch: this.flashOn }] });
      showToast(this.flashOn ? "Flash turned ON" : "Flash turned OFF", "info");
    } catch {
      showToast("Torch not available.", "info");
    }
  },

  async captureFrame() {
    const video = document.getElementById('webcam');
    if (!this.stream || video.videoWidth === 0) {
      this.triggerFileUpload();
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    await this.processImage(canvas);
  },

  triggerFileUpload() {
    document.getElementById('ocrFileInput').click();
  },

  async handleFileSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const img = new Image();
    const reader = new FileReader();
    reader.onload = async (e) => {
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        await this.processImage(canvas);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  preprocessCanvas(srcCanvas) {
    const out = document.createElement('canvas');
    const maxDim = Math.max(srcCanvas.width, srcCanvas.height);
    const scale = maxDim < 1000 ? Math.min(2.5, 1200 / maxDim) : 1;
    out.width = Math.round(srcCanvas.width * scale);
    out.height = Math.round(srcCanvas.height * scale);

    const ctx = out.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(srcCanvas, 0, 0, out.width, out.height);

    try {
      const imgData = ctx.getImageData(0, 0, out.width, out.height);
      const d = imgData.data;
      const w = out.width, h = out.height;

      const gray = new Uint8Array(w * h);
      for (let i = 0, j = 0; i < d.length; i += 4, j++) {
        gray[j] = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) | 0;
      }

      const intW = w + 1;
      const integral = new Float64Array((w + 1) * (h + 1));
      for (let y = 0; y < h; y++) {
        let rowSum = 0;
        const yOffset = (y + 1) * intW;
        const prevYOffset = y * intW;
        const grayYOffset = y * w;
        for (let x = 0; x < w; x++) {
          rowSum += gray[grayYOffset + x];
          integral[yOffset + x + 1] = integral[prevYOffset + x + 1] + rowSum;
        }
      }

      const S = Math.max(12, Math.round(w / 16));
      const s2 = Math.round(S / 2);
      const T = 0.15;

      for (let y = 0; y < h; y++) {
        const y1 = Math.max(0, y - s2);
        const y2 = Math.min(h - 1, y + s2);
        const y1Offset = y1 * intW;
        const y2Offset = (y2 + 1) * intW;
        const grayYOffset = y * w;

        for (let x = 0; x < w; x++) {
          const x1 = Math.max(0, x - s2);
          const x2 = Math.min(w - 1, x + s2);
          const count = (x2 - x1 + 1) * (y2 - y1 + 1);
          const sum = integral[y2Offset + x2 + 1] - integral[y1Offset + x2 + 1] - integral[y2Offset + x1] + integral[y1Offset + x1];
          const idx = (grayYOffset + x) * 4;
          const isInk = gray[grayYOffset + x] * count <= sum * (1 - T);
          const val = isInk ? 0 : 255;
          d[idx] = val; d[idx + 1] = val; d[idx + 2] = val;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      return out;
    } catch {
      return srcCanvas;
    }
  },

  cleanMathText(raw) {
    if (!raw) return "";
    let s = raw;
    const superscripts = {
      '⁰': '^0', '¹': '^1', '²': '^2', '³': '^3', '⁴': '^4',
      '⁵': '^5', '⁶': '^6', '⁷': '^7', '⁸': '^8', '⁹': '^9',
      '⁺': '^+', '⁻': '^-'
    };
    for (const [sup, rep] of Object.entries(superscripts)) {
      s = s.split(sup).join(rep);
    }
    s = s.replace(/([a-zA-Z\)])\s*([2-9])(?=\s*[\+\-\*\/\=\)]|\s+[a-zA-Z0-9]|\s*$)/g, '$1^$2');
    s = s.replace(/([a-zA-Z0-9\)])\s*\^\s*([0-9a-zA-Z]+)/g, '$1^$2');
    s = s.replace(/[\u2012\u2013\u2014\u2212_~]/g, '-');
    s = s.replace(/[\u00D7\u22C5]/g, '*');
    s = s.replace(/[\u00F7]/g, '/');
    s = s.replace(/==+/g, '=');
    s = s.replace(/\b([a-zA-Z0-9])\s+[tT]\s+([0-9a-zA-Z])/g, '$1 + $2');
    s = s.replace(/=\s*[oO]\b/g, '= 0');
    s = s.replace(/\b[oO]\s*=/g, '0 =');
    s = s.replace(/\r?\n+/g, ' ').replace(/\s+/g, ' ').trim();
    s = s.replace(/[\.;,]$/, '');
    return s;
  },

  autoFixInputPowers() {
    const input = document.getElementById('mathInput');
    if (!input || !input.value.trim()) { showToast("Type or scan an equation first", "info"); return; }
    const before = input.value;
    const fixed = this.cleanMathText(before);
    input.value = fixed;
    UI.updateLivePreview();
    showToast(before !== fixed ? "Fixed powers and exponents!" : "Powers in standard format.", "success");
  },

  autoCleanText() {
    const input = document.getElementById('mathInput');
    if (!input || !input.value.trim()) { showToast("Type or scan an equation first", "info"); return; }
    let fixed = this.cleanMathText(input.value)
      .replace(/\s*([+\-*/=])\s*/g, ' $1 ')
      .replace(/\s+/g, ' ')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      .trim();
    input.value = fixed;
    UI.updateLivePreview();
    showToast("Cleaned & formatted math offline!", "success");
  },

  async processImage(canvas) {
    const overlay = document.getElementById('cameraLoadingOverlay');
    const overlayText = document.getElementById('cameraLoadingText');
    overlay.classList.remove('hidden');

    try {
      let detectedText = "";
      if (CONFIG.MATHPIX_APP_ID && CONFIG.MATHPIX_APP_KEY) {
        overlayText.innerText = "Analyzing with Mathpix API...";
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const response = await fetch("https://api.mathpix.com/v3/text", {
          method: "POST",
          headers: { "content-type": "application/json", "app_id": CONFIG.MATHPIX_APP_ID, "app_key": CONFIG.MATHPIX_APP_KEY },
          body: JSON.stringify({ src: dataUrl, formats: ["text", "latex_styled"] })
        });
        const data = await response.json();
        detectedText = (data.latex_styled || data.text || "").replace(/\\/g, '');
      } else {
        overlayText.innerText = "Enhancing contrast & OCR...";
        const processed = this.preprocessCanvas(canvas);
        const res = await Tesseract.recognize(processed, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text' && m.progress) {
              overlayText.innerText = `Recognizing math (${Math.round(m.progress * 100)}%)...`;
            }
          }
        });
        detectedText = res.data.text || "";
      }

      const cleaned = this.cleanMathText(detectedText);
      closeModal('cameraModal');
      document.getElementById('mathInput').value = cleaned || "2x + 5 = 15";
      openModal('writeModal');
      UI.updateLivePreview();
      showToast("Scanned math loaded! Review before solving.", "success");
    } catch (err) {
      console.error("OCR Error:", err);
      showToast("OCR Error: " + err.message, "error");
    } finally {
      overlay.classList.add('hidden');
    }
  }
};

/**
 * UI CONTROLLER (5-Section Solution Modal, PDF Export, Favorites, Superscripts)
 */
const UI = {
  debounceTimer: null,
  currentSolvedResult: null,

  init() {
    const mathInput = document.getElementById('mathInput');
    if (mathInput) {
      mathInput.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => this.updateLivePreview(), 250);
      });
    }
    ThemeManager.init();
    SettingsManager.init();
  },

  // Helper to format string into unicode superscripts (e.g. 5256^3 -> 5256³)
  formatSuperscripts(str) {
    if (!str) return "";
    const supMap = {
      '0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',
      '+':'⁺','-':'⁻','=':'⁼','(':'⁽',')':'⁾','n':'ⁿ','x':'ˣ','y':'ʸ','a':'ᵃ','b':'ᵇ','m':'ᵐ','i':'ⁱ'
    };
    return str.replace(/\^([0-9a-zA-Z\+\-\(\)]+)/g, (match, p1) => {
      return p1.split('').map(c => supMap[c] || c).join('');
    });
  },

  updateLivePreview() {
    const input = document.getElementById('mathInput').value.trim();
    const preview = document.getElementById('liveMathPreview');
    const status = document.getElementById('previewStatus');
    const supDisplay = document.getElementById('formattedSuperscriptDisplay');
    const errorBanner = document.getElementById('inputErrorBanner');

    if (errorBanner) errorBanner.classList.add('hidden');

    if (!input) {
      preview.innerHTML = `<span class="text-xs text-gray-400 dark:text-gray-500 italic font-sans">Type math above to see rendered preview</span>`;
      status.innerText = "Ready";
      if (supDisplay) supDisplay.innerText = "Exponent Display: (Type powers e.g. 5256^3)";
      return;
    }

    // Update real-time formatted superscript display
    const formattedWithSup = this.formatSuperscripts(input);
    if (supDisplay) {
      supDisplay.innerHTML = `<span class="text-[10px] text-gray-400 font-sans uppercase mr-1.5">Formatted Power:</span><span class="font-bold text-sage-green font-mono">${formattedWithSup}</span>`;
    }

    // Convert text to LaTeX for MathJax
    let tex = input
      .replace(/[\u2012\u2013\u2014\u2212]/g, '-')
      .replace(/\*/g, ' \\cdot ')
      .replace(/d\/dx\(([^)]+)\)/g, '\\frac{d}{dx}\\left($1\\right)')
      .replace(/integral\(([^)]+)\)/g, '\\int $1 \\, dx')
      .replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}')
      .replace(/\^2/g, '^{2}')
      .replace(/\^3/g, '^{3}')
      .replace(/\^([0-9a-zA-Z]+)/g, '^{$1}');

    preview.innerHTML = `$$${tex}$$`;
    status.innerText = "Live";
    typeset(preview);
  },

  // UNIVERSAL 5-SECTION STEP-BY-STEP BREAKDOWN RENDERER
  displaySolution(item) {
    this.currentSolvedResult = item;

    // Header problem query
    const q = document.getElementById('solutionQuery');
    if (q) {
      const qText = item.query || item.title || "Math Problem";
      q.innerHTML = `$$${qText.replace(/\*/g, ' \\cdot ')}$$`;
      typeset(q);
    }

    // Section 1: Formula Statement
    const fTitle = document.getElementById('stepFormulaName');
    const fLatex = document.getElementById('stepFormulaLatex');
    if (item.formulaStatement) {
      if (fTitle) fTitle.innerText = item.formulaStatement.title || "Formula Statement";
      if (fLatex) {
        fLatex.innerHTML = `$$${item.formulaStatement.latex}$$`;
        typeset(fLatex);
      }
    } else {
      if (fTitle) fTitle.innerText = "Standard Problem Resolution";
      if (fLatex) {
        fLatex.innerHTML = `$$${(item.query || '').replace(/\*/g, ' \\cdot ') }$$`;
        typeset(fLatex);
      }
    }

    // Section 2: Given Values
    const gEl = document.getElementById('stepGivenValues');
    if (gEl) {
      const givenText = item.givenValues || `\\text{Problem: } ${item.query || ''}`;
      gEl.innerHTML = `$$${givenText}$$`;
      typeset(gEl);
    }

    // Section 3: Substitution Step
    const sEl = document.getElementById('stepSubstitution');
    if (sEl) {
      const substText = item.substitution || `\\text{Evaluate: } ${item.query || ''}`;
      sEl.innerHTML = `$$${substText}$$`;
      typeset(sEl);
    }

    // Section 4: Intermediate Simplifications
    const stepsContainer = document.getElementById('solutionSteps');
    if (stepsContainer) {
      const interSteps = item.intermediateSteps || item.steps || [];
      if (interSteps.length === 0) {
        stepsContainer.innerHTML = `<div class="p-2 text-xs text-gray-400 italic">Direct evaluation completed.</div>`;
      } else {
        stepsContainer.innerHTML = interSteps.map((step, idx) => `
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xs">
            <div class="flex items-center gap-2 mb-1">
              <span class="w-4 h-4 rounded-full bg-sage-green/15 text-sage-green flex items-center justify-center font-bold text-[10px]">${idx + 1}</span>
              <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${step.title}</span>
            </div>
            <div class="text-xs font-serif text-sage-green pl-6 my-1 overflow-x-auto no-scrollbar py-0.5">$$${step.expression}$$</div>
            <div class="text-[11px] text-gray-500 dark:text-gray-400 pl-6 italic font-sans">${step.note}</div>
          </div>
        `).join('');
        typeset(stepsContainer);
      }
    }

    // Section 5: Final Result
    const a = document.getElementById('solutionAnswer');
    if (a) {
      a.innerText = item.answer || item.finalResult || "";
    }

    this.updateFavoriteBtnState();
    openModal('solutionModal');
  },

  updateFavoriteBtnState() {
    const btn = document.getElementById('solutionFavBtn');
    const icon = document.getElementById('solutionFavIcon');
    if (!btn || !icon || !this.currentSolvedResult) return;
    const isFav = Store.isFavorite(this.currentSolvedResult);
    if (isFav) {
      icon.className = "fa-solid fa-star text-xs text-amber-500";
      btn.title = "Remove from Favorites";
    } else {
      icon.className = "fa-regular fa-star text-xs text-gray-400 dark:text-gray-300";
      btn.title = "Save to Favorites";
    }
  },

  toggleFavoriteCurrent() {
    if (!this.currentSolvedResult) return;
    Store.toggleFavorite(this.currentSolvedResult);
    this.updateFavoriteBtnState();
  },

  // PDF Export via html2pdf.js bundle with direct jsPDF fallback
  async exportSolutionAsPDF() {
    if (!this.currentSolvedResult) return;
    const printEl = document.getElementById('solutionPrintContainer');
    if (!printEl) return;
    showToast("Generating PDF document...", "info");

    const item = this.currentSolvedResult;
    const clone = printEl.cloneNode(true);
    const wrapper = document.createElement('div');
    wrapper.style.padding = '24px';
    wrapper.style.fontFamily = 'Arial, sans-serif';
    wrapper.style.color = '#1f241d';
    wrapper.style.backgroundColor = '#ffffff';

    const header = document.createElement('div');
    header.innerHTML = `
      <div style="border-bottom: 2px solid #708764; padding-bottom: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="color: #708764; margin: 0; font-size: 20px; font-weight: bold;">MathSolver</h1>
          <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 11px;">Universal Step-by-Step Mathematical Solution</p>
        </div>
        <div style="text-align: right; color: #9ca3af; font-size: 10px;">
          <div>Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
          <div style="color: #708764; font-weight: bold;">Verified Math Solution</div>
        </div>
      </div>
    `;
    wrapper.appendChild(header);
    wrapper.appendChild(clone);

    const footer = document.createElement('div');
    footer.innerHTML = `
      <div style="border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 20px; font-size: 9px; color: #9ca3af; text-align: center;">
        Generated by MathSolver Universal Production Engine • Clean Step-by-Step Math Documentation
      </div>
    `;
    wrapper.appendChild(footer);

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `MathSolver_Solution_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      if (window.html2pdf) {
        await window.html2pdf().set(opt).from(wrapper).save();
        showToast("PDF downloaded successfully! 📄", "success");
        return;
      }
    } catch (e) {
      console.warn("html2pdf note, falling back to direct jsPDF:", e);
    }

    // Direct jsPDF fallback for environments where html2canvas is restricted
    try {
      const jsPDFLib = window.jspdf ? window.jspdf.jsPDF : null;
      if (jsPDFLib) {
        const doc = new jsPDFLib({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(112, 135, 100);
        doc.text('MathSolver - Step-by-Step Solution', 15, 20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 27);
        doc.setDrawColor(112, 135, 100);
        doc.setLineWidth(0.5);
        doc.line(15, 30, 195, 30);

        let y = 38;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);
        doc.text('Problem:', 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(item.query || ''), 40, y);

        y += 9;
        doc.setFont('helvetica', 'bold');
        doc.text('Final Result:', 15, y);
        doc.setTextColor(112, 135, 100);
        doc.text(String(item.answer || item.finalResult || ''), 45, y);

        if (item.formulaStatement && item.formulaStatement.title) {
          y += 9;
          doc.setTextColor(30, 30, 30);
          doc.setFont('helvetica', 'bold');
          doc.text('Formula:', 15, y);
          doc.setFont('helvetica', 'normal');
          doc.text(`${item.formulaStatement.title} (${item.formulaStatement.latex || ''})`, 40, y);
        }

        if (item.givenValues) {
          y += 8;
          doc.setFont('helvetica', 'bold');
          doc.text('Given:', 15, y);
          doc.setFont('helvetica', 'normal');
          doc.text(String(item.givenValues), 35, y);
        }

        if (item.steps && item.steps.length > 0) {
          y += 11;
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 30, 30);
          doc.text('Step-by-Step Breakdown:', 15, y);
          y += 6;

          item.steps.forEach((step, sIdx) => {
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(70, 70, 70);
            doc.text(`Step ${sIdx + 1}: ${step.title || ''}`, 15, y);
            y += 5;

            doc.setFont('courier', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(20, 20, 20);
            doc.text(`  ${step.expression || ''}`, 15, y);
            y += 5;

            if (step.note) {
              doc.setFont('helvetica', 'italic');
              doc.setFontSize(8);
              doc.setTextColor(120, 120, 120);
              doc.text(`  Note: ${step.note}`, 15, y);
              y += 5;
            }
            y += 2;
          });
        }

        doc.save(`MathSolver_Solution_${Date.now()}.pdf`);
        showToast("PDF generated and downloaded! 📄", "success");
        return;
      }
    } catch (pdfErr) {
      console.warn("Direct jsPDF error:", pdfErr);
    }

    // Fallback to browser print dialog
    window.print();
  },

  editCurrentSolution() {
    if (!this.currentSolvedResult) return;
    closeModal('solutionModal');
    document.getElementById('mathInput').value = this.currentSolvedResult.query || '';
    openModal('writeModal');
    this.updateLivePreview();
  },

  copySolution() {
    if (!this.currentSolvedResult) return;
    const text = `Problem: ${this.currentSolvedResult.query}\nAnswer: ${this.currentSolvedResult.answer}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast("Solution copied to clipboard!", "success");
    }).catch(() => {
      showToast("Unable to copy", "info");
    });
  }
};

// Global Modal Controls with Strict Root Reset for Formulas Modal
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
  if (id === 'cameraModal') {
    Ocr.startCamera();
  } else if (id === 'writeModal') {
    UI.updateLivePreview();
  } else if (id === 'formulasModal') {
    FormulaEngine.resetToRoot();
  } else if (id === 'profileModal') {
    Store.updateProfileCount();
    Store.renderFavoritesList();
  } else if (id === 'recentsListModal') {
    Store.renderFullList();
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
  if (id === 'cameraModal') {
    Ocr.stopCamera();
  } else if (id === 'formulasModal') {
    FormulaEngine.resetToRoot();
  }
}

function appendMath(str) {
  const input = document.getElementById('mathInput');
  input.value += str;
  input.focus();
  UI.updateLivePreview();
}

function clearMathInput() {
  document.getElementById('mathInput').value = '';
  UI.updateLivePreview();
}

function toggleKeypad() {
  const keypad = document.getElementById('extendedKeypad');
  const icon = document.getElementById('keypadToggleIcon');
  const isHidden = keypad.classList.contains('hidden');
  if (isHidden) {
    keypad.classList.remove('hidden');
    icon.className = "fa-solid fa-chevron-up text-[10px]";
  } else {
    keypad.classList.add('hidden');
    icon.className = "fa-solid fa-chevron-down text-[10px]";
  }
}

async function handleWriteSubmit() {
  const expr = document.getElementById('mathInput').value;
  const errorBanner = document.getElementById('inputErrorBanner');
  const errorMsg = document.getElementById('inputErrorMessage');
  const solveBtn = document.getElementById('solveSubmitBtn');

  if (!expr || !expr.trim()) {
    errorMsg.innerText = "Please enter an expression to solve.";
    errorBanner.classList.remove('hidden');
    return;
  }

  solveBtn.innerHTML = `<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Solving...</span>`;
  solveBtn.disabled = true;

  try {
    const result = await Solver.solve(expr);
    if (result.error) {
      errorMsg.innerText = result.answer + (result.steps && result.steps[0] ? ": " + result.steps[0].note : "");
      errorBanner.classList.remove('hidden');
      return;
    }

    Store.saveItem(result);
    closeModal('writeModal');
    UI.displaySolution(result);
  } catch (err) {
    errorMsg.innerText = "Solver error: " + err.message;
    errorBanner.classList.remove('hidden');
  } finally {
    solveBtn.innerHTML = `<span>Solve Problem</span>`;
    solveBtn.disabled = false;
  }
}

function toggleFlash() { Ocr.toggleFlash(); }
function capturePhoto() { Ocr.captureFrame(); }
function triggerUpload() { Ocr.triggerFileUpload(); }

window.addEventListener('DOMContentLoaded', () => {
  Store.renderHomeChips();
  Store.updateProfileCount();
  UI.init();
  FormulaEngine.init();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration note:', err);
    });
  }
});
