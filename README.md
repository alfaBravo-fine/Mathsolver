# MathSolver Web & Android App

A production-grade, 100% offline-capable mathematical problem solver, interactive formula library, and OCR camera recognition application built with a soft cream/sage aesthetic.

Built with **Math.js v12** (safe parsing and evaluation without `eval()`), **MathJax 3** (rich LaTeX typesetting), **Tesseract.js v5** (client-side offline OCR with local binarization & exponent heuristics), **PWA Service Worker** (`sw.js`), and **localStorage** persistence.

---

## 🚀 How to Run

### Option 1: Standalone HTML (Zero dependencies)
Open `math_solver_app.html` or `index.html` directly in any modern web browser or mobile browser:
```bash
# MacOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

### Option 2: Local Dev Server (Node.js / Vite)
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the live application.

---

## 📱 How to Convert into an Android APK Package

You have three straightforward, standard ways to package this app into an installable Android APK:

### Method 1: Capacitor (Recommended for Production & Google Play Store)
Capacitor wraps modern web apps into native Android Studio projects:

1. **Install Capacitor CLI:**
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   ```
2. **Initialize Capacitor:**
   ```bash
   npx cap init MathSolver com.mathsolver.app --web-dir dist
   ```
3. **Build the web assets:**
   ```bash
   npm run build
   ```
4. **Add Android platform & sync:**
   ```bash
   npx cap add android
   npx cap copy android
   ```
5. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```
6. **Generate APK in Android Studio:**
   - Go to menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - Android Studio outputs the `.apk` file ready to install on your Android phone!

---

### Method 2: PWABuilder (Zero Code / Easiest in 2 Minutes)
This app is already configured with `public/manifest.json`, `public/icon.svg`, and an offline Service Worker (`public/sw.js`).
1. Host or deploy your app (or use your Cloud Run URL: `https://ais-pre-xudpwmycjnyw3dldquq6xl-502965749161.asia-southeast1.run.app`).
2. Visit [https://www.pwabuilder.com](https://www.pwabuilder.com).
3. Paste the URL and click **Start**.
4. Click **Package for Android** > **Download APK / AAB**.
5. Install the generated `.apk` directly onto your Android device or publish the `.aab` to Google Play.

---

### Method 3: Apache Cordova / Bubblewrap (CLI Tool)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://your-domain.com/manifest.json
bubblewrap build
```
This produces a signed release APK and Android App Bundle directly from the command line.

---

## 📚 Hierarchical Formula Library Engine

The formula library has been refactored into a **hierarchical, multi-view sub-formula engine** with interactive sub-tabs:

### 1. Hierarchical Navigation Pattern
- Clicking a multi-rule formula card (e.g. **Laws of Exponents**, **Radicals & Roots**, **Markup & Commercial Pricing**, or **Simultaneous Systems**) opens a dedicated **Sub-Formula Selection View**.
- Inside the calculator detail view, an **Interactive Horizontal Sub-Tab Bar** allows instant switching between sub-rules without losing context or navigating back.

### 2. Disentangled & Completely Separated Concepts
- **Markup & Commercial Pricing**:
  1. *Markup Amount Calculator*: $\text{Markup} = \text{CP} \times \frac{M}{100}$
  2. *Selling Price Calculator*: $\text{SP} = \text{CP} \times (1 + \frac{M}{100})$
  3. *Cost Price Calculator (Reverse Markup)*: $\text{CP} = \frac{\text{SP}}{1 + M/100}$
  4. *Markup % vs Gross Margin % Comparison*: $\text{Margin} = \frac{\text{SP}-\text{CP}}{\text{SP}}\times 100\%$
- **Profit & Loss Analysis**:
  1. *Profit & Profit %*: $\text{SP} - \text{CP}$
  2. *Loss & Loss %*: $\text{CP} - \text{SP}$
- **Radicals & Roots (Completely Separated)**:
  1. *Square Root Calculator ($\sqrt{x}$)*: $\sqrt{x} = x^{1/2}$, prime factor pairs, radical simplification (e.g. $\sqrt{72} = 6\sqrt{2}$)
  2. *Cube Root Calculator ($\sqrt[3]{x}$)*: $\sqrt[3]{x} = x^{1/3}$, handles negatives, prime factor triples
  3. *n-th Root Calculator ($\sqrt[n]{x}$)*: $\sqrt[n]{x} = x^{1/n}$
- **Laws of Exponents (All 6 Fundamental Laws)**:
  1. *Product of Powers*: $a^m \cdot a^n = a^{m+n}$
  2. *Quotient of Powers*: $\frac{a^m}{a^n} = a^{m-n}$ ($a \neq 0$)
  3. *Power of a Power*: $(a^m)^n = a^{mn}$
  4. *Power of a Product*: $(ab)^n = a^n b^n$
  5. *Power of a Quotient*: $(\frac{a}{b})^n = \frac{a^n}{b^n}$ ($b \neq 0$)
  6. *Zero & Negative Exponents*: $a^0 = 1, \quad a^{-n} = \frac{1}{a^n}$ ($a \neq 0$)
- **Simultaneous Linear Systems (All 4 Methods)**:
  1. *Substitution Method*
  2. *Elimination Method*
  3. *Cramer's Rule* ($x = D_x/D, y = D_y/D$)
  4. *Matrix Inversion Rule* ($X = A^{-1}B$)
- **Sequences & Series**:
  1. *Arithmetic $n$-th Term*: $a_n = a_1 + (n-1)d$
  2. *Arithmetic Series Sum*: $S_n = \frac{n}{2}(a_1 + a_n)$
  3. *Geometric $n$-th Term*: $a_n = a_1 \cdot r^{n-1}$
  4. *Geometric Finite Sum*: $S_n = a_1 \frac{1-r^n}{1-r}$
  5. *Geometric Infinite Sum*: $S_\infty = \frac{a_1}{1-r}$ ($|r| < 1$)
- **Polynomials & Factoring**:
  1. *Polynomial Degree & Coefficients*
  2. *Trinomial Factoring* ($ax^2 + bx + c$)
  3. *Difference of Two Squares* ($a^2 - b^2$)
- **Theorems & Set Theory**:
  1. *De Morgan's First Law*: $(A \cup B)' = A' \cap B'$
  2. *De Morgan's Second Law*: $(A \cap B)' = A' \cup B'$
  3. *Polynomial Remainder & Factor Theorem*: $P(c) = R$
- **Number Theory & Arithmetic**:
  1. *Least Common Multiple (LCM)*
  2. *Highest Common Factor (HCF / GCD)*
- **Geometry (2D & 3D)**: Circle, Triangle, Rectangle, Pythagoras, Sphere, Cylinder, Cone.
- **Trigonometry**: SOH-CAH-TOA, Sine Rule, Cosine Rule, Degrees ↔ Radians.
- **Calculus**: Power Rule (Derivative), Power Rule (Integral), Trig Derivatives, Logarithm Derivative.
- **Descriptive Statistics**: Mean & Median, Mode & Range, Variance & Standard Deviation.

---

## 📷 Offline OCR & Fixing Exponents

### Why Exponents Get Scrambled in Photo OCR
In mathematical images, exponents like $x^2$ or $x^3$ are printed smaller and higher above the baseline. Generic text OCR engines (like Tesseract) don't have built-in math syntax models, so they often misread:
- $x^2$ as `x2` or `x 2`
- $x^3$ as `x3`
- $(x+1)^2$ as `(x+1)2`
- $5x^2$ as `5x2`

### How We Fixed It (100% Offline)
1. **Bradley-Roth Local Adaptive Binarization**:
   Cleans background shadows, uneven lighting, and yellowed paper directly in an HTML5 canvas before OCR recognition.
2. **Offline Math Normalization Heuristic**:
   Automatically detects patterns like `x2` and converts them to `x^2`, and turns Unicode superscripts (`⁰...⁹`) into standard caret notation (`^0...^9`).
3. **`⚡ Fix Powers` Button**:
   In the Write Modal helper toolbar, click **⚡ Fix Powers** at any time to automatically format all powers in your input!
4. **`🧹 Clean OCR` Button**:
   Auto-cleans excess spaces, minus signs, and division symbols offline.

---

## 🛠️ How to Fix Errors or Add Features with AI

If you ever encounter an issue, calculation edge case, or want to add a feature, here is the exact 3-step prompt format to get an instant, perfect fix from the AI:

### The 3-Part Prompt Template:
```
1. What I did:
[Example: I typed "d/dx(3x^2 + 5x)" or selected the "Cramer's Rule" formula with a1=2, b1=4...]

2. What happened (The Error):
[Example: It returned "Calculation Error" or gave x = 3 instead of x = 5]

3. What it should be:
[Example: The answer should be "6x + 5" with steps showing power rule on 3x^2 and constant rule on 5x]
```

The AI can then directly inspect the solver logic or formula array, make the fix, run `compile_applet` and `lint_applet`, and verify that the application remains healthy.
