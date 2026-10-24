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
