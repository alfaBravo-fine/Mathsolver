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
