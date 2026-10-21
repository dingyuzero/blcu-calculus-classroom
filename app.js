"use strict";
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const purple = "#7454bd",
  orange = "#d88d51",
  teal = "#389c96";
const topics = [
  {
    id: "function",
    title: "函数与图像",
    en: "FUNCTIONS & GRAPHS",
    symbol: "ƒ",
    desc: "输入一个函数，观察图像与数值如何对应。",
    tags: "自由绘图 · 参数变换",
    time: "5–8 分钟",
    hint: "从一个表达式，走进函数的世界",
  },
  {
    id: "limit",
    title: "极限与连续",
    en: "LIMITS & CONTINUITY",
    symbol: "→",
    desc: "从左右两侧靠近，理解「无限接近」的含义。",
    tags: "双侧逼近 · 可去间断",
    time: "8–10 分钟",
    hint: "函数在一点的值，决定它的极限吗？",
  },
  {
    id: "derivative",
    title: "导数与变化率",
    en: "DERIVATIVES",
    symbol: "′",
    desc: "让割线逐渐变成切线，看见瞬时变化率。",
    tags: "割线与切线 · 斜率",
    time: "8–10 分钟",
    hint: "把一段时间的变化，缩小到一个瞬间",
  },
  {
    id: "integral",
    title: "积分与累积",
    en: "INTEGRALS",
    symbol: "∫",
    desc: "用越来越细的矩形，拼出曲线下的累积量。",
    tags: "黎曼和 · 有向面积",
    time: "8–10 分钟",
    hint: "微小的变化，怎样累积成整体？",
  },
  {
    id: "taylor",
    title: "泰勒展开",
    en: "TAYLOR SERIES",
    symbol: "Σ",
    desc: "增加多项式阶数，观察局部近似与误差。",
    tags: "逐阶逼近 · 展开中心",
    time: "10–12 分钟",
    hint: "用熟悉的多项式，理解复杂的函数",
  },
  {
    id: "psych",
    title: "数学与心理学",
    en: "MATHEMATICS × PSYCHOLOGY",
    symbol: "ψ",
    desc: "在学习曲线与正态分布中，连接数学与心理学。",
    tags: "学习曲线 · 概率密度",
    time: "8–10 分钟",
    hint: "在心理学的问题里，发现数学的语言",
  },
];
const resources = [
  {
    name: "KaTeX",
    symbol: "TₑX",
    category: "compute",
    status: "本站已集成",
    license: "MIT",
    url: "https://github.com/KaTeX/KaTeX",
    docs: "https://katex.org/docs/browser.html",
    licenseUrl: "https://github.com/KaTeX/KaTeX/blob/main/LICENSE",
    desc: "浏览器数学公式排版库，显示分式、极限、积分和求和符号。",
    use: "课堂用途：把计算表达式排成清楚的数学公式。本站保留纯文本导出，并将字体随包保存。",
    tags: ["JavaScript", "公式排版", "可离线"],
    local: "vendor/KaTeX-LICENSE.txt",
  },
  {
    name: "JSXGraph",
    symbol: "JX",
    category: "interactive",
    status: "本站已集成",
    license: "MIT / LGPL-3.0+",
    url: "https://github.com/jsxgraph/jsxgraph",
    docs: "https://jsxgraph.org/",
    licenseUrl: "https://github.com/jsxgraph/jsxgraph/blob/main/LICENSE.MIT",
    desc: "面向浏览器的交互数学绘图库，支持函数、可拖动点、几何构造与动态图形。",
    use: "课堂用途：割线逼近切线、黎曼矩形、函数图像。本站 18 个演示的图形引擎。",
    tags: ["JavaScript", "浏览器运行", "可离线"],
    local: "vendor/JSXGraph-LICENSE.txt",
  },
  {
    name: "math.js",
    symbol: "m",
    category: "compute",
    status: "本站已集成",
    license: "Apache-2.0",
    url: "https://github.com/josdejong/mathjs",
    docs: "https://mathjs.org/docs/",
    licenseUrl: "https://github.com/josdejong/mathjs/blob/develop/LICENSE",
    desc: "JavaScript 数学库，提供表达式解析、数值计算和符号运算，可与绘图库组合。",
    use: "课堂用途：输入函数后求值、概率计算。本站仅开放受限的单变量表达式输入。",
    tags: ["JavaScript", "表达式解析", "可离线"],
    local: "vendor/mathjs-LICENSE.txt",
  },
  {
    name: "function-plot",
    symbol: "ƒ",
    category: "interactive",
    status: "扩展资源",
    license: "MIT",
    url: "https://github.com/mauriciopoppe/function-plot",
    docs: "https://mauriciopoppe.github.io/function-plot/",
    licenseUrl:
      "https://github.com/mauriciopoppe/function-plot/blob/main/LICENSE",
    desc: "基于 D3 的二维函数绘图库，适合快速搭建带缩放和导数展示的函数图像页面。",
    use: "课堂用途：快速比较多个函数、切线与导数。适合教师编写轻量的专题演示。",
    tags: ["JavaScript", "二维绘图", "需编程接入"],
  },
  {
    name: "MathBox",
    symbol: "M³",
    category: "interactive",
    status: "扩展资源",
    license: "MIT",
    url: "https://github.com/unconed/mathbox",
    docs: "https://mathbox.org/",
    licenseUrl: "https://github.com/unconed/mathbox/blob/master/LICENSE.md",
    desc: "基于 WebGL 的数学可视化库，可用声明式图形构造数学动画与空间关系。",
    use: "课堂用途：曲面、空间坐标与动态变换。适合后续扩展多元函数与三维演示。",
    tags: ["JavaScript", "WebGL", "需编程接入"],
  },
  {
    name: "Manim Community",
    symbol: "M",
    category: "animation",
    status: "扩展资源",
    license: "MIT",
    url: "https://github.com/ManimCommunity/manim",
    docs: "https://docs.manim.community/en/stable/examples.html",
    licenseUrl:
      "https://github.com/ManimCommunity/manim/blob/main/LICENSE.community",
    desc: "社区维护的 Python 数学动画框架，用代码安排公式、图形与动画之间的讲解顺序。",
    use: "课堂用途：预先制作泰勒展开、极限或面积累积视频，导出后用于课件。",
    tags: ["Python", "视频制作", "需安装环境"],
  },
  {
    name: "ManimGL",
    symbol: "GL",
    category: "animation",
    status: "扩展资源",
    license: "MIT",
    url: "https://github.com/3b1b/manim",
    docs: "https://3b1b.github.io/manim/",
    licenseUrl: "https://github.com/3b1b/manim/blob/master/LICENSE.md",
    desc: "3Blue1Brown 作者维护的数学动画引擎，适合研究和制作精细的数学可视化场景。",
    use: "课堂用途：教师制作讲解动画。与 Manim Community 为不同实现，安装与 API 不能混用。",
    tags: ["Python", "OpenGL", "需安装环境"],
  },
];
let board = null,
  current = "",
  currentModule = "main",
  timer = null,
  toastTimer = null,
  renderPlot = null;
let resourceFilter = "all",
  resourceQuery = "",
  appliedFunctionControls = null,
  exportUrl = null,
  lastPlotParameters = "",
  currentTable = null,
  animationState = null,
  formulaPlain = "";
const fmt = (v, d = 4) =>
  Number.isFinite(v)
    ? v === 0
      ? "0"
      : Math.abs(v) < 10 ** -d || Math.abs(v) >= 1e6
        ? v.toExponential(Math.min(d, 4))
        : Number(v.toFixed(d)).toString()
    : "未定义";
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function toast(msg) {
  $("#toast").textContent = msg;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2500);
}
const storageKey = "blcu.calculus.v2";
let savedControls = {},
  storageAvailable = true,
  controlBaseline = null;
try {
  savedControls = JSON.parse(localStorage.getItem(storageKey) || "{}");
  if (
    !savedControls ||
    typeof savedControls !== "object" ||
    Array.isArray(savedControls)
  )
    savedControls = {};
} catch {
  storageAvailable = false;
}
function persistTopic(id, values) {
  // Merge one topic so a second classroom tab cannot overwrite unrelated edits.
  try {
    const latest = JSON.parse(localStorage.getItem(storageKey) || "{}");
    if (latest && typeof latest === "object" && !Array.isArray(latest))
      savedControls = latest;
  } catch {}
  if (values === null) delete savedControls[id];
  else savedControls[id] = values;
  try {
    localStorage.setItem(storageKey, JSON.stringify(savedControls));
  } catch {
    storageAvailable = false;
    const status = $(".saved-state");
    if (status)
      status.textContent = "浏览器未开放本地存储 · 本次页面内保留参数";
  }
}
window.addEventListener("storage", (event) => {
  if (event.key !== storageKey) return;
  try {
    const latest = JSON.parse(event.newValue || "{}");
    if (latest && typeof latest === "object" && !Array.isArray(latest))
      savedControls = latest;
  } catch {}
});
function controlSnapshot() {
  if (!topics.some((t) => t.id === current) || !$("#plot")) return null;
  const controls = $$(".control-panel input[id], .control-panel select[id]");
  if (
    current === "function" &&
    currentModule === "main" &&
    appliedFunctionControls
  ) {
    return { ...appliedFunctionControls, probe: $("#probe").value };
  } else {
    if ($("#error")?.textContent || controls.some((el) => !el.checkValidity()))
      return null;
    return Object.fromEntries(controls.map((el) => [el.id, el.value]));
  }
}
function saveControls() {
  const snapshot = controlSnapshot();
  if (!snapshot) return;
  const signature = JSON.stringify(snapshot);
  if (signature === controlBaseline) return;
  persistTopic(stateKey(), snapshot);
  controlBaseline = signature;
}
function restoreControls(id) {
  const saved = savedControls[id];
  if (!saved || typeof saved !== "object") return;
  for (const el of $$(".control-panel input[id], .control-panel select[id]")) {
    if (typeof saved[el.id] !== "string" || saved[el.id].length > 120) continue;
    if (
      el.tagName === "SELECT" &&
      ![...el.options].some((o) => o.value === saved[el.id])
    )
      continue;
    if (el.id === "probe") {
      el.min = $("#xmin").value;
      el.max = $("#xmax").value;
      el.step = (Number(el.max) - Number(el.min)) / 1000;
    }
    const previous = el.value;
    el.value = saved[el.id];
    if (!el.checkValidity()) el.value = previous;
    const output = $("#" + el.id + "-value");
    if (output) output.textContent = el.value;
  }
}
function stateKey() {
  return currentModule === "main" ? current : `${current}:${currentModule}`;
}
function activeTitle() {
  return (
    chapterModules[current]?.find((m) => m.id === currentModule)?.title ||
    topics.find((t) => t.id === current)?.title ||
    current
  );
}
function closeMenu() {
  $("#sidebar").classList.remove("open");
  $("#menu").setAttribute("aria-expanded", "false");
}
function stopAnimation(preserve = false) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (!preserve) animationState = null;
  $("#metric")?.setAttribute("aria-live", "polite");
  const b = $("#animate");
  if (b) {
    b.textContent = preserve && animationState ? "▶ 继续演示" : "▶ 自动演示";
    b.setAttribute("aria-pressed", "false");
  }
}
function miniGraph(id, hero = false) {
  const w = hero ? 480 : 320,
    h = hero ? 278 : 116,
    cx = w * 0.5,
    cy = h * 0.58,
    sx = w / 8,
    sy = hero ? 49 : 25;
  const path = (f) =>
    Array.from({ length: 161 }, (_, i) => {
      const x = -4 + (8 * i) / 160,
        y = f(x);
      return `${i ? "L" : "M"}${(cx + x * sx).toFixed(1)},${(cy - y * sy).toFixed(1)}`;
    }).join(" ");
  let curves = "",
    extra = "";
  if (id === "function")
    curves = `<path d="${path((x) => 0.45 * x * x - 1.1)}" stroke="${purple}"/><path d="${path((x) => Math.sin(x))}" stroke="${teal}" stroke-dasharray="4 4"/>`;
  if (id === "limit") {
    curves = `<path d="${path((x) => (Math.abs(x) < 0.001 ? 1 : Math.sin(x) / x))}" stroke="${teal}"/>`;
    extra = `<circle cx="${cx}" cy="${cy - sy}" r="4" fill="#fff" stroke="${teal}" stroke-width="2"/>`;
  }
  if (id === "derivative") {
    curves = `<path d="${path((x) => 0.22 * x * x - 0.65)}" stroke="${purple}"/><path d="${path((x) => 0.66 * x - 1.145)}" stroke="${orange}" stroke-width="1.5"/>`;
    extra = `<circle cx="${cx + 1.5 * sx}" cy="${cy + 0.155 * sy}" r="4" fill="${purple}"/>`;
  }
  if (id === "integral") {
    for (let i = 0; i < 9; i++) {
      const x = -2.6 + i * 0.55,
        y = 0.15 * (x + 2.8) ** 2 + 0.2;
      extra += `<rect x="${cx + x * sx}" y="${cy - y * sy}" width="${sx * 0.55 - 1}" height="${y * sy}" fill="#d0e5df"/>`;
    }
    curves = `<path d="${path((x) => 0.15 * (x + 2.8) ** 2 + 0.2)}" stroke="${teal}"/>`;
  }
  if (id === "taylor") {
    curves = `<path d="${path(Math.sin)}" stroke="${purple}"/><path d="${path((x) => x - x ** 3 / 6 + x ** 5 / 120)}" stroke="${orange}" stroke-dasharray="5 4"/>`;
  }
  if (id === "psych") {
    curves = `<path d="${path((x) => 2 * Math.exp((-x * x) / 2) - 0.7)}" stroke="${purple}"/>`;
    extra = `<path d="${path((x) => 2 * Math.exp((-x * x) / 2) - 0.7)} L${w},${cy + 0.7 * sy} L0,${cy + 0.7 * sy}Z" fill="#e9e2f4"/>`;
  }
  const grid = Array.from(
    { length: 9 },
    (_, i) => `<path d="M${(i * w) / 8},0V${h} M0,${(i * h) / 8}H${w}"/>`,
  ).join("");
  return `<svg viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true"><defs><clipPath id="clip-${id}-${hero}"><rect width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#clip-${id}-${hero})"><g stroke="#d9d5e5" stroke-opacity=".4" stroke-width=".6">${grid}</g><path d="M0 ${cy}H${w} M${cx} 0V${h}" stroke="#cac3d9" stroke-width=".8"/>${extra}<g stroke-width="${hero ? 2.6 : 2.1}" stroke-linecap="round">${curves}</g>${hero ? `<text x="${w - 22}" y="${cy + 17}" fill="#a095ba" font-family="Georgia" font-size="13">x</text><circle cx="${cx}" cy="${cy}" r="4" fill="${purple}"/><text x="${cx + 16}" y="${cy - 75}" fill="${purple}" font-family="Georgia" font-size="16">f(x) = sin x</text><text x="${cx + 55}" y="${cy + 80}" fill="${orange}" font-family="Georgia" font-size="16">T₅(x)</text>` : ""}</g></svg>`;
}
function home() {
  $("#main").innerHTML =
    `<section class="hero"><div class="hero-text"><div class="eyebrow">A LITTLE EXPLORATION. A DEEPER UNDERSTANDING.</div><h1>让抽象的数学，<br>变得<em>直观。</em></h1><p>从函数的一条曲线，到理解心理学的一种方式。<br>在观察、操作与讨论中，发现高等数学的意义。</p><a class="button primary" href="#function">开始探索 <span>↗</span></a> <a class="button" href="#guide">课堂使用指南</a></div><div class="hero-art">${miniGraph("taylor", true)}<span class="hero-formula">f(x) ≈ ∑ aₙ(x − a)ⁿ</span><span class="hero-tag">用多项式，一步步接近真实</span></div></section>
 <div class="intro-strip"><span><strong>06</strong>课程章节</span><span><strong>18</strong>交互演示</span><span><strong>07</strong>开源项目</span><span class="strip-note">无需安装 · 即开即用 · 支持课堂投影</span></div>
 <div class="section-heading"><div><h2>把数学，放进实验室</h2><p>选择一个主题，调整参数，让理解在变化中发生。</p></div><span class="text-link">按课程进度自由探索 ↓</span></div>
 <div class="lab-grid">${topics.map((t, i) => `<a class="lab-card" href="#${t.id}"><div class="card-art"><span class="card-index">LAB / 0${i + 1}</span><span class="card-chip">${t.time}</span>${miniGraph(t.id)}</div><div class="card-body"><h3>${t.title}</h3><p>${chapterModules[t.id].map((m) => m.title).join(" · ")}</p><div class="card-bottom"><span>3 个演示 · 参数分别保存</span><span>进入实验 ↗</span></div></div></a>`).join("")}</div>
 <div class="section-heading"><div><h2>一节课，从一个好问题开始</h2><p>建议演示路线 · 约 25 分钟</p></div></div><section class="class-path"><div class="path-icon">′</div><div class="path-copy"><h3>学习越久，进步一定越快吗？</h3><p>从函数形状出发，走向变化率，再回到学习曲线。</p></div><div class="path-steps"><span>函数图像</span>→<span>导数</span>→<span>学习曲线</span></div><a class="button" href="#guide">查看课堂路线 ↗</a></section>`;
}
function head(title, en, subtitle, action = "") {
  return `<div class="page-head"><div><div class="eyebrow">${en}</div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`;
}
function range(id, label, value, min, max, step = 1) {
  return `<label class="field"><span class="field-top"><span>${label}</span><output id="${id}-value">${value}</output></span><input type="range" id="${id}" aria-label="${label}" min="${min}" max="${max}" step="${step}" value="${value}"><span class="range-ends"><span>${min}</span><span>${max}</span></span></label>`;
}
function select(id, label, options) {
  return `<label class="field"><span class="field-top">${label}</span><select id="${id}">${options.map(([v, t]) => `<option value="${v}">${t}</option>`).join("")}</select></label>`;
}
function number(id, label, value, min = -100, max = 100, step = 0.5) {
  return `<label class="field"><span class="field-top">${label}</span><input id="${id}" type="number" min="${min}" max="${max}" step="any" inputmode="decimal" value="${value}" required></label>`;
}
function metric(label) {
  return `<div class="control-rule"></div><div class="metric-label">${label}</div><div id="metric" class="metric-value" role="status"></div><div id="metric-detail" class="metric-detail"></div>`;
}
function notes(steps, question, answer) {
  return `<div class="notes-grid"><section class="notes-panel"><h3>↗ 这样探索</h3><ol>${steps.map((x) => `<li>${x}</li>`).join("")}</ol></section><section class="notes-panel"><div class="question-tag">PAUSE & THINK / 课堂提问</div><h3>${question}</h3><details><summary>展开讨论提示</summary><p>${answer}</p></details></section></div>`;
}
function scaffold(id, controls, legend, steps, question, answer) {
  const t = topics.find((x) => x.id === id);
  $("#main").innerHTML =
    head(
      activeTitle(),
      `LAB / 0${topics.indexOf(t) + 1} — ${t.en}`,
      t.hint,
      `<button class="button" id="reset">↺ 重置实验</button>`,
    ) +
    `<div class="lab-layout"><section class="plot-panel"><div class="plot-heading"><h2 id="plot-title">${t.title} · 交互画布</h2><div class="plot-tools"><button class="button" id="view-reset" aria-label="复位图形视图">复位</button><button class="button" id="export" aria-label="导出当前图形为 SVG">导出 SVG ↗</button></div></div><div class="plot-wrap"><div id="plot" class="jxgbox" aria-label="${t.title}交互图形"></div></div><div class="legend">${legend.map((x) => `<span>${x}</span>`).join("")}</div><div class="plot-caption" id="plot-caption">数值与曲线实时更新 · 可通过右侧控件操作 · 导出保留当前图形</div></section><aside class="control-panel"><h2 class="panel-title"><span>☷</span>实验控制台</h2>${controls}<div class="error" id="error" role="alert"></div></aside></div><div class="formula-band"><span class="label">数学表达</span><div><div id="formula" class="formula"></div><div id="formula-note" class="formula-note"></div></div></div>${notes(steps, question, answer)}<p class="source-note">图形：<a href="https://jsxgraph.org/" target="_blank" rel="noopener">JSXGraph</a> · 数值：<a href="https://mathjs.org/" target="_blank" rel="noopener">math.js</a> · ${id === "psych" ? "教学示意模型，不使用真实被试数据。" : "图形采样用于直观探索，不能代替数学证明。"}</p>`;
  const tabs = document.createElement("nav");
  tabs.className = "chapter-tabs";
  tabs.setAttribute("aria-label", t.title + "的实验");
  tabs.innerHTML = chapterModules[id]
    .map(
      (m, i) =>
        `<a href="#${id}${m.id === "main" ? "" : "/" + m.id}" ${m.id === currentModule ? 'aria-current="page" class="selected"' : ""}><span>0${i + 1}</span>${m.title}</a>`,
    )
    .join("");
  $(".page-head").after(tabs);
  $("#plot-title").textContent = activeTitle() + " · 交互画布";
  $("#plot").setAttribute("aria-label", activeTitle() + "交互图形");
  restoreControls(stateKey());
  $("#reset").onclick = () => {
    persistTopic(stateKey(), null);
    route(true);
    toast("当前实验已恢复默认参数");
  };
  const status = document.createElement("p");
  status.className = "saved-state";
  status.textContent = storageAvailable
    ? "参数自动保存在本机 · 重置恢复默认"
    : "浏览器未开放本地存储 · 本次页面内保留参数";
  $(".control-panel").append(status);
  const dataPanel = document.createElement("details");
  dataPanel.className = "data-panel";
  dataPanel.innerHTML =
    '<summary>查看数值表 · 把观察变成证据</summary><div class="data-tools"><p>表中显示值已舍入；CSV 保留计算精度。</p><button class="button" id="export-csv">导出 CSV</button></div><div class="table-scroll"><table id="data-table"></table></div>';
  $(".plot-panel").append(dataPanel);
  $("#export-csv").onclick = exportCSV;
  currentTable = null;
  if (id === "taylor" && currentModule === "main") {
    const full = document.createElement("details");
    full.className = "polynomial-details";
    full.innerHTML =
      '<summary>查看本阶多项式（系数已舍入）</summary><p id="polynomial-text"></p>';
    $("#formula-note").after(full);
  }
  $("#export").onclick = exportSVG;
}

let initialBox,
  scene = null;
function initBoard(box) {
  $("#plot-caption").textContent =
    "数值与曲线实时更新 · 可通过控件操作 · 导出保留当前图形";
  initialBox = box;
  if (!scene) scene = new ClassroomPlot("plot");
  scene.begin(box);
  board = scene.board;
  $("#view-reset").onclick = () => {
    board.setBoundingBox(initialBox, false);
    board.fullUpdate();
  };
  return board;
}
function curve(f, color = purple, dash = 0, width = 3) {
  const [lo, top, hi, bottom] = initialBox;
  const sampled = Calc.sample(f, lo, hi, top - bottom);
  if (sampled.truncated)
    $("#plot-caption").textContent =
      "曲线过于复杂，部分细节已省略。请缩小区间后观察。";
  return scene.data(sampled[0], sampled[1], {
    strokeColor: color,
    strokeWidth: width,
    dash,
    fillColor: "none",
  });
}
function point(x, y, color = purple, open = false, name = "") {
  return scene.point(x, y, {
    name,
    size: 4,
    fillColor: open ? "white" : color,
    strokeColor: color,
    strokeWidth: 2,
    label: {
      display: "internal",
      fontSize: 13,
      offset: [10, 10],
      strokeColor: color,
    },
  });
}
function line(f, color, dash = 0) {
  return curve(f, color, dash, 1.7);
}
function segment(a, b, color = orange, dash = 2) {
  return scene.data([a[0], b[0]], [a[1], b[1]], {
    strokeColor: color,
    strokeWidth: 1.5,
    dash,
    fillColor: "none",
  });
}
function area(f, a, b, color = purple) {
  const xs = [a],
    ys = [0];
  for (let i = 0; i <= 200; i++) {
    const x = a + ((b - a) * i) / 200;
    xs.push(x);
    ys.push(f(x));
  }
  xs.push(b, a);
  ys.push(0, 0);
  return scene.data(xs, ys, {
    strokeWidth: 0,
    fillColor: color,
    fillOpacity: 0.15,
  });
}
function rectanglePaths(rects, positive = true) {
  const xs = [],
    ys = [];
  for (const r of rects)
    if (positive ? r.y >= 0 : r.y < 0) {
      xs.push(r.left, r.left, r.right, r.right, r.left, NaN);
      ys.push(0, r.y, r.y, 0, 0, NaN);
    }
  const color = positive ? orange : teal;
  return scene.data(xs, ys, {
    strokeColor: color,
    strokeWidth: 0.8,
    fillColor: color,
    fillOpacity: 0.18,
    dash: 0,
  });
}

function bindRanges(callback) {
  $$("input[type=range]").forEach((el) =>
    el.addEventListener("input", () => {
      const out = $("#" + el.id + "-value");
      if (out) out.textContent = el.value;
      callback();
    }),
  );
}
function setMath(formula, note = "", latex = "") {
  formulaPlain = formula;
  $("#formula").textContent = formula;
  if (latex && window.katex) {
    try {
      katex.render(latex, $("#formula"), {
        displayMode: true,
        throwOnError: true,
        trust: false,
        strict: "error",
      });
    } catch {
      $("#formula").textContent = formula;
    }
  }
  $("#formula-note").textContent = note;
  if ($("#polynomial-text")) $("#polynomial-text").textContent = formula;
  lastPlotParameters = $$(".control-panel input[id], .control-panel select[id]")
    .filter((el) => !el.disabled && el.id !== "probe")
    .map((el) => {
      const top = el.closest(".field")?.querySelector(".field-top");
      const label =
        el.getAttribute("aria-label") ||
        top?.querySelector("span")?.textContent ||
        top?.textContent ||
        el.id;
      const value =
        el.tagName === "SELECT" ? el.selectedOptions[0].textContent : el.value;
      return label + "：" + value;
    })
    .join("；");
}
function values(main, detail = "") {
  $("#metric").textContent = main;
  $("#metric-detail").textContent = detail;
}
function setDataTable(headers, rows, selected = -1) {
  currentTable = { headers, rows, parameters: lastPlotParameters };
  const display = (value) =>
    typeof value === "number" ? fmt(value, 6) : value;
  $("#data-table").innerHTML =
    "<thead><tr>" +
    headers.map((h) => '<th scope="col">' + esc(h) + "</th>").join("") +
    "</tr></thead><tbody>" +
    rows
      .map(
        (row, index) =>
          "<tr" +
          (index === selected ? ' class="selected-row"' : "") +
          ">" +
          row.map((v) => "<td>" + esc(display(v)) + "</td>").join("") +
          "</tr>",
      )
      .join("") +
    "</tbody>";
}
function downloadArtifact(blob, filename, message) {
  if (exportUrl) URL.revokeObjectURL(exportUrl);
  exportUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = exportUrl;
  link.download = filename;
  link.textContent = "再次下载";
  link.id = "download-last";
  link.click();
  toast(message);
  $("#toast").append(" · ", link);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 12000);
}
function exportCSV() {
  if (!currentTable) return;
  const cell = (value) =>
    '"' +
    String(
      typeof value === "number" && !Number.isFinite(value) ? "未定义" : value,
    ).replace(/"/g, '""') +
    '"';
  const rows = [
    ["实验", activeTitle()],
    ["参数", currentTable.parameters],
    [],
    currentTable.headers,
    ...currentTable.rows,
  ];
  downloadArtifact(
    new Blob(
      ["\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    ),
    `高数课堂-${current}-${currentModule}.csv`,
    "已导出当前数值表 CSV",
  );
}
function animate(run, reset) {
  const resumed =
    animationState && animationState.topic === current ? animationState : null;
  stopAnimation();
  if (reset) reset();
  animationState = resumed || { topic: current, ticks: 0 };
  $("#animate").textContent = "Ⅱ 暂停演示";
  $("#animate").setAttribute("aria-pressed", "true");
  $("#metric").setAttribute("aria-live", "off");
  timer = setInterval(() => {
    if (run(animationState.ticks++) === false) {
      stopAnimation();
      saveControls();
    }
  }, 100);
}
function exportSVG() {
  stopAnimation();
  const svg = $("#plot svg");
  if (!svg) {
    toast("图形还未准备好");
    return;
  }
  const ns = "http://www.w3.org/2000/svg";
  const width = Math.round($("#plot").clientWidth),
    height = Math.round($("#plot").clientHeight);
  const copy = document.createElementNS(ns, "svg");
  copy.setAttribute("xmlns", ns);
  copy.setAttribute("width", width);
  copy.setAttribute("viewBox", `0 0 ${width} ${height + 190}`);
  const rect = document.createElementNS(ns, "rect");
  rect.setAttribute("width", "100%");
  rect.setAttribute("height", "100%");
  rect.setAttribute("fill", "white");
  copy.append(rect);
  let cursor = 28;
  const measure = document.createElement("canvas").getContext("2d");
  function writeLine(text, size = 12, fill = "#38384a") {
    measure.font = `${size}px "Microsoft YaHei", Arial, sans-serif`;
    const tokens = String(text).match(/[A-Za-z0-9_.^()+−-]+|\s+|./gu) || [];
    const lines = [];
    let buffer = "";
    for (const token of tokens) {
      if (buffer && measure.measureText(buffer + token).width > width - 40) {
        lines.push(buffer.trim());
        buffer = "";
      }
      if (measure.measureText(token).width > width - 40) {
        for (const char of token) {
          if (measure.measureText(buffer + char).width > width - 40) {
            lines.push(buffer);
            buffer = "";
          }
          buffer += char;
        }
      } else buffer += token;
    }
    if (buffer.trim()) lines.push(buffer.trim());
    for (const content of lines) {
      const line = document.createElementNS(ns, "text");
      line.setAttribute("x", "20");
      line.setAttribute("y", cursor);
      line.setAttribute("fill", fill);
      line.setAttribute("font-size", size);
      line.setAttribute("font-family", "Microsoft YaHei, Arial, sans-serif");
      line.textContent = content;
      copy.append(line);
      cursor += size * 1.6;
    }
  }
  writeLine(activeTitle(), 18);
  writeLine(lastPlotParameters, 12);
  writeLine(formulaPlain, 13);
  writeLine(
    $(".metric-label").textContent + " = " + $("#metric").textContent,
    13,
  );
  writeLine($("#metric-detail").textContent, 12);
  cursor += 12;
  const graph = svg.cloneNode(true);
  graph.querySelectorAll("foreignObject").forEach((el) => {
    if (!el.childNodes.length) el.remove();
  });
  graph.setAttribute("x", "0");
  graph.setAttribute("y", cursor);
  graph.setAttribute("width", width);
  graph.setAttribute("height", height);
  copy.append(graph);
  cursor += height + 22;
  writeLine(
    $$(".legend span")
      .map((x) => x.textContent)
      .join("  /  "),
    11,
  );
  writeLine($("#formula-note").textContent, 11);
  writeLine($("#plot-caption").textContent, 11);
  writeLine(
    "北语心理学院高数课程 · 课堂展示版 · JSXGraph / math.js",
    10,
    "#666677",
  );
  copy.setAttribute("height", cursor + 12);
  copy.setAttribute("viewBox", `0 0 ${width} ${cursor + 12}`);
  const desc = document.createElementNS("http://www.w3.org/2000/svg", "desc");
  desc.textContent = formulaPlain + " " + $("#formula-note").textContent;
  copy.prepend(desc);
  downloadArtifact(
    new Blob([new XMLSerializer().serializeToString(copy)], {
      type: "image/svg+xml;charset=utf-8",
    }),
    `高数课堂-${current}-${currentModule}.svg`,
    "已导出当前图形 SVG",
  );
}

function functionLab() {
  appliedFunctionControls = null;
  scaffold(
    "function",
    `<form id="function-form"><label class="field"><span class="field-top">函数表达式 f(x)</span><input id="expression" type="text" value="sin(x)" maxlength="120" spellcheck="false" autocomplete="off" aria-describedby="expression-help"><small id="expression-help">支持 sin、cos、tan、exp、log10、log2、ln、sqrt、abs。乘方写 x^2，乘法写 2*x；角度使用弧度。log10(x) 是常用对数，log2(x) 以 2 为底，ln(x) / log(x) 是自然对数。</small></label><div class="presets">${["sin(x)", "x^2", "exp(x)", "log10(x)", "log2(x)", "ln(x)", "1/x", "abs(x)"].map((x) => `<button type="button" class="preset" data-expr="${x}">${x}</button>`).join("")}</div><div class="paired-fields">${number("xmin", "x 最小值", -5, -100, 100, "any")}${number("xmax", "x 最大值", 5, -100, 100, "any")}</div><details class="advanced"><summary>纵轴范围</summary>${select(
      "ymode",
      "纵轴模式",
      [
        ["auto", "自动适配"],
        ["manual", "手动设置"],
      ],
    )}<div id="manual-y" hidden><div class="paired-fields">${number("ymin", "y 最小值", -3, -1e12, 1e12, "any")}${number("ymax", "y 最大值", 3, -1e12, 1e12, "any")}</div></div></details><button class="button primary full" type="submit">绘制函数 ↗</button></form><div class="control-rule"></div>${range("probe", "观察点 x", 1, -5, 5, 0.01)}${metric("观察点的函数值 f(x)")}`,
    ["f(x)"],
    [
      "输入函数并绘制。若需观察局部细节，可手动设置纵轴范围。",
      "拖动曲线上的 P，或调整观察点。点离开定义域时会隐藏，回到定义域时恢复。",
      "尝试 sin(2*x)、2*sin(x)、sin(x)+1，比较周期、振幅与平移。",
    ],
    "sin(2x) 和 2sin(x)，会把图像变得一样吗？",
    "前者沿水平方向压缩，周期变为 π；后者在竖直方向拉伸，振幅变为 2。参数作用的位置不同，图形变化也不同。",
  );
  let f = null,
    marker = null,
    lo = -5,
    hi = 5;
  function probeUpdate(x) {
    x = Math.max(lo, Math.min(hi, x));
    $("#probe").value = x;
    x = Number($("#probe").value);
    const y = f(x),
      valid = Number.isFinite(y);
    $("#probe-value").textContent = fmt(x, 3);
    if (marker) {
      marker.setAttribute({ visible: valid });
      marker.setAttribute({
        label: { offset: [x > lo + 0.85 * (hi - lo) ? -20 : 10, 10] },
      });
      if (valid) marker.setPosition(JXG.COORDS_BY_USER, [x, y]);
      board.update();
    }
    const outside = valid && (y > initialBox[1] || y < initialBox[3]);
    values(
      fmt(y, 6),
      `x = ${fmt(x, 4)}${!valid ? "；该点不在实数定义域内。" : outside ? "；观察点超出当前纵轴，请调整纵轴范围。" : ""}`,
    );
  }
  function draw() {
    try {
      const a = Number($("#xmin").value),
        b = Number($("#xmax").value);
      if (
        !$("#xmin").value ||
        !$("#xmax").value ||
        !Number.isFinite(a) ||
        !Number.isFinite(b) ||
        a < -100 ||
        b > 100 ||
        b - a <
          1e-6 - 4 * Number.EPSILON * Math.max(1, Math.abs(a), Math.abs(b))
      )
        throw Error("请设置 −100 到 100 内的递增区间，宽度至少 0.000001。");
      const nextF = Calc.compileExpression($("#expression").value),
        samples = Array.from({ length: 401 }, (_, i) =>
          nextF(a + ((b - a) * i) / 400),
        );
      if (samples.filter(Number.isFinite).length < 2)
        throw Error("该区间内没有足够的实数值，请检查定义域。");
      let top, bottom;
      if ($("#ymode").value === "manual") {
        top = Number($("#ymax").value);
        bottom = Number($("#ymin").value);
        if (
          !$("#ymax").value ||
          !$("#ymin").value ||
          !Number.isFinite(top) ||
          !Number.isFinite(bottom) ||
          top <= bottom ||
          top > 1e12 ||
          bottom < -1e12
        )
          throw Error("请设置有效的纵轴下限和上限（±10¹² 内）。");
      } else [top, bottom] = Calc.autoBounds(samples);
      f = nextF;
      lo = a;
      hi = b;
      initBoard([a, top, b, bottom]);
      curve(f);
      const input = $("#probe");
      input.min = a;
      input.max = b;
      input.step = (b - a) / 1000;
      const ends = input.parentElement.querySelectorAll(".range-ends span");
      ends[0].textContent = a;
      ends[1].textContent = b;
      const start = Math.max(a, Math.min(b, Number(input.value)));
      marker = scene.point(start, f(start), {
        name: "P",
        fixed: false,
        size: 4,
        fillColor: purple,
        strokeColor: "#fff",
        strokeWidth: 2,
        highlight: true,
        label: { display: "internal", fontSize: 13, offset: [10, 10] },
      });
      if (!marker._probeBound) {
        marker.on("drag", () => probeUpdate(marker.X()));
        marker._probeBound = true;
      }
      probeUpdate(start);
      setMath(
        `f(x) = ${$("#expression").value}`,
        "有限采样不能证明连续性；窄峰和高频振荡请缩小区间核对。当前绘制的是实数定义域。",
        "f(x)=" + f.latex,
      );
      $("#error").textContent = "";
      appliedFunctionControls = Object.fromEntries(
        $$(".control-panel input[id], .control-panel select[id]").map((el) => [
          el.id,
          el.value,
        ]),
      );
      setDataTable(
        ["x", "f(x)"],
        Array.from({ length: 11 }, (_, i) => {
          const x = a + ((b - a) * i) / 10;
          return [x, f(x)];
        }),
      );
    } catch (e) {
      $("#error").textContent = e.message + " 图形保留上一有效设置。";
    }
  }
  $("#function-form").onsubmit = (e) => {
    e.preventDefault();
    draw();
    saveControls();
  };
  $$("[data-expr]").forEach(
    (el) =>
      (el.onclick = () => {
        $("#expression").value = el.dataset.expr;
        draw();
        saveControls();
      }),
  );
  function syncYAxisControls() {
    const manual = $("#ymode").value === "manual";
    $("#manual-y").hidden = !manual;
    $$("#manual-y input").forEach((el) => {
      el.disabled = !manual;
    });
    if (manual) $(".advanced").open = true;
  }
  $("#ymode").onchange = syncYAxisControls;
  syncYAxisControls();
  $("#probe").oninput = () => {
    if (f) probeUpdate(Number($("#probe").value));
  };
  draw();
  renderPlot = draw;
}

function limitLab() {
  scaffold(
    "limit",
    select("limit-kind", "选择一个函数", [
      ["sinc", "sin(x) / x"],
      ["sign", "|x| / x"],
      ["square", "x²"],
    ]) +
      range("distance", "离 0 的距离 h", 0.5, 0.001, 1, 0.001) +
      `<button class="button primary full" id="animate">▶ 自动演示</button>` +
      metric("从两侧靠近 0"),
    ["函数曲线", "左侧观察点", "右侧观察点"],
    [
      "比较 x = −h 与 x = h 处的函数值。",
      "缩小 h，观察左右两侧是否靠近同一个数。",
      "切换到 |x|/x：两侧都能靠近某个数，但这两个数相同吗？",
    ],
    "sin(x)/x 在 x=0 没有定义，极限为什么还能存在？",
    "极限考察的是 x 靠近 0 时函数值的趋势，而不要求 x=0 处有定义。sin(x)/x 的双侧极限是 1；定义 f(0)=1 可以补成连续函数。|x|/x 的左极限为 −1、右极限为 1，因此双侧极限不存在。",
  );
  function draw() {
    const k = $("#limit-kind").value,
      h = Number($("#distance").value),
      f =
        k === "sinc"
          ? (x) => (x === 0 ? NaN : Math.sin(x) / x)
          : k === "sign"
            ? (x) => (x === 0 ? NaN : Math.sign(x))
            : (x) => x * x;
    initBoard([-2.5, 2.2, 2.5, -1.7]);
    curve(f);
    if (k === "sinc") point(0, 1, purple, true);
    if (k === "sign") {
      point(0, -1, purple, true);
      point(0, 1, purple, true);
    }
    point(-h, f(-h), orange, false, "L").setAttribute({
      label: { offset: [-22, 18] },
    });
    point(h, f(h), teal, false, "R").setAttribute({
      label: { offset: [10, -18] },
    });
    values(
      `${fmt(f(-h), 8)} / ${fmt(f(h), 8)}`,
      `左侧 x = −${fmt(h, 3)}；右侧 x = ${fmt(h, 3)}`,
    );
    setMath(
      k === "sinc"
        ? "limₓ→₀ sin(x)/x = 1"
        : k === "sign"
          ? "limₓ→₀⁻ |x|/x = −1 ≠ 1 = limₓ→₀⁺ |x|/x"
          : "limₓ→₀ x² = 0 = f(0)",
      k === "sign"
        ? "左右极限不相等，因此双侧极限不存在。"
        : "显示数值经过舍入；舍入后相等不代表严格相等。减小 h 可以观察趋势，有限次取值不能构成极限证明。",
      k === "sinc"
        ? String.raw`\lim_{x\to0}\frac{\sin x}{x}=1`
        : k === "sign"
          ? String.raw`\lim_{x\to0^-}\frac{|x|}{x}=-1\ne1=\lim_{x\to0^+}\frac{|x|}{x}`
          : String.raw`\lim_{x\to0}x^2=0=f(0)`,
    );
    setDataTable(
      ["h", "f(−h)", "f(h)"],
      [1, 0.5, 0.1, 0.01, 0.001, h].map((t) => [t, f(-t), f(t)]),
      5,
    );
  }
  bindRanges(() => {
    stopAnimation();
    draw();
  });
  $("#limit-kind").onchange = () => {
    stopAnimation();
    draw();
  };
  $("#animate").onclick = () => {
    if (timer) {
      stopAnimation(true);
      return;
    }
    animate((i) => {
      const h = 10 ** (-i / 20);
      $("#distance").value = Math.max(0.001, h);
      $("#distance-value").textContent = fmt(Math.max(0.001, h), 3);
      draw();
      return i < 60;
    });
  };
  draw();
  renderPlot = draw;
}
function derivativeLab() {
  scaffold(
    "derivative",
    select("derivative-kind", "选择一个函数", [
      ["square", "f(x) = x²"],
      ["sin", "f(x) = sin(x)"],
      ["exp", "f(x) = eˣ"],
      ["abs", "f(x) = |x| · 尖点"],
    ]) +
      range("center", "切点位置 a", 1, -1.5, 1.5, 0.05) +
      select("direction", "逼近方向", [
        ["right", "从右侧逼近 · h > 0"],
        ["left", "从左侧逼近 · h < 0"],
      ]) +
      range("step", "两点距离 |h|", 1, 0.01, 2, 0.01) +
      '<button class="button primary full" id="animate">▶ 自动演示</button>' +
      metric("割线斜率 Δy / Δx"),
    ["f(x)", "割线", "切线（存在时）"],
    [
      "固定 a，缩小两点距离，比较割线与切线。",
      "切换左右方向，判断两个差商极限是否一致。",
      "选择 |x|，把 a 调到 0：左右斜率不同，尖点处不可导。",
    ],
    "曲线连续，就一定在每个位置都有导数吗？",
    "不一定。|x| 在 0 连续，但从右侧逼近时差商为 1，从左侧为 −1，因此 0 处没有导数。函数上升也不等于上升得越来越快，后者还需要比较导数的变化。",
  );
  function draw() {
    const k = $("#derivative-kind").value,
      a = Number($("#center").value),
      h =
        Number($("#step").value) * ($("#direction").value === "left" ? -1 : 1),
      f =
        k === "square"
          ? (x) => x * x
          : k === "sin"
            ? Math.sin
            : k === "abs"
              ? Math.abs
              : Math.exp,
      d =
        k === "square"
          ? 2 * a
          : k === "sin"
            ? Math.cos(a)
            : k === "abs"
              ? a === 0
                ? NaN
                : Math.sign(a)
              : Math.exp(a),
      slope = (f(a + h) - f(a)) / h,
      [top, bottom] = Calc.autoBounds([
        f(a),
        f(a + h),
        f(a - 0.65),
        f(a + 0.65),
        1,
        -1,
      ]);
    initBoard([
      Math.min(-2.5, a + h - 0.6),
      top,
      Math.max(3, a + h + 0.6),
      bottom,
    ]);
    curve(f);
    line((x) => f(a) + slope * (x - a), orange, 2);
    if (Number.isFinite(d)) line((x) => f(a) + d * (x - a), teal);
    point(a, f(a), purple, false, "P");
    point(a + h, f(a + h), orange, false, "Q");
    values(
      fmt(slope, 5),
      Number.isFinite(d)
        ? "切线斜率 f′(a) = " +
            fmt(d, 5) +
            " · 相差 " +
            fmt(Math.abs(slope - d), 5)
        : "a = 0 处不可导：左侧斜率 −1，右侧斜率 1。",
    );
    setMath(
      "f′(a) = limₕ→₀ [f(a+h) − f(a)] / h",
      "a = " +
        fmt(a) +
        "，h = " +
        fmt(h) +
        "。导数定义要求左右差商极限一致；纵轴自动包含 P、Q。",
      String.raw`f'(a)=\lim_{h\to0}\frac{f(a+h)-f(a)}{h}`,
    );
    setDataTable(
      ["距离 |h|", "左侧差商", "右侧差商"],
      [1, 0.5, 0.1, 0.05, 0.01].map((t) => [
        t,
        (f(a) - f(a - t)) / t,
        (f(a + t) - f(a)) / t,
      ]),
    );
  }
  bindRanges(() => {
    stopAnimation();
    draw();
  });
  for (const el of $$(".control-panel select"))
    el.onchange = () => {
      stopAnimation();
      draw();
    };
  $("#animate").onclick = () => {
    if (timer) {
      stopAnimation(true);
      saveControls();
      return;
    }
    animate((i) => {
      const h = Math.max(0.01, 2 * Math.exp(-i * 0.075));
      $("#step").value = h;
      $("#step-value").textContent = $("#step").value;
      draw();
      return h > 0.01;
    });
  };
  draw();
  renderPlot = draw;
}
function integralLab() {
  scaffold(
    "integral",
    select("integral-kind", "被积函数", [
      ["square", "f(x) = x²"],
      ["sin", "f(x) = sin(x)"],
      ["linear", "f(x) = x"],
      ["exp", "f(x) = eˣ"],
    ]) +
      `<div class="paired-fields">${number("lower", "下限 a", 0, -5, 5, 0.25)}${number("upper", "上限 b", 2, -5, 5, 0.25)}</div>` +
      range("partitions", "矩形数量 n", 8, 2, 100, 1) +
      select("method", "取样方法", [
        ["mid", "中点取样"],
        ["left", "左端点取样"],
        ["right", "右端点取样"],
      ]) +
      metric("黎曼和 Sₙ"),
    ["函数曲线", "正向矩形", "负向矩形"],
    [
      "增加矩形数量，比较黎曼和与定积分的差异。",
      "切换左端点、中点、右端点取样，观察估计偏差。",
      "选 f(x)=x，设 a=−2、b=2，观察正负部分的抵消。",
    ],
    "定积分是 0，是否意味着曲线与横轴之间没有面积？",
    "不是。定积分累积的是有正负号的量。曲线在横轴上方贡献正值，下方贡献负值；对称区间上 f(x)=x 的定积分为 0，但两块几何面积均不为 0。",
  );
  function draw() {
    const a = Number($("#lower").value),
      b = Number($("#upper").value);
    if (
      !$("#lower").value ||
      !$("#upper").value ||
      !Number.isFinite(a) ||
      !Number.isFinite(b) ||
      b - a <
        1e-6 - 4 * Number.EPSILON * Math.max(1, Math.abs(a), Math.abs(b)) ||
      a < -5 ||
      b > 5
    ) {
      $("#error").textContent =
        "请输入 −5 到 5 内的递增区间，宽度至少 0.000001。图形保留上一有效设置。";
      return;
    }
    $("#error").textContent = "";
    const k = $("#integral-kind").value,
      n = Number($("#partitions").value),
      method = $("#method").value,
      f =
        k === "square"
          ? (x) => x * x
          : k === "sin"
            ? Math.sin
            : k === "linear"
              ? (x) => x
              : Math.exp,
      result = Calc.riemann(f, a, b, n, method),
      exact = Calc.definiteIntegral(k, a, b),
      geometric = Calc.geometricIntegral(k, a, b);
    const samples = Array.from({ length: 100 }, (_, i) =>
        f(a + ((b - a) * i) / 99),
      ),
      top = Math.max(1, ...samples) * 1.22,
      bot = Math.min(0, ...samples) - Math.max(0.4, top * 0.12),
      pad = (b - a) * 0.2;
    initBoard([a - pad, top, b + pad, bot]);
    rectanglePaths(result.rectangles, true);
    rectanglePaths(result.rectangles, false);
    curve(f);
    values(
      fmt(result.total, 5),
      `定积分 = ${fmt(exact, 5)} · 绝对误差 = ${fmt(Math.abs(result.total - exact), 6)} · 几何面积 = ${fmt(geometric, 5)}`,
    );
    setMath(
      "∫ₐᵇ f(x) dx = limₙ→∞ ∑ᵢ₌₁ⁿ f(ξᵢ) Δx",
      `Δx = (b−a)/n = ${fmt((b - a) / n, 4)}。当前积分值由对应原函数求得；矩形按有向面积累加。`,
      String.raw`\int_a^b f(x)\,dx=\lim_{n\to\infty}\sum_{i=1}^n f(\xi_i)\,\Delta x`,
    );
    setDataTable(
      ["方法", "n", "黎曼和", "绝对误差"],
      [
        ["left", "左端点"],
        ["mid", "中点"],
        ["right", "右端点"],
      ].map(([code, name]) => {
        const sum = Calc.riemann(f, a, b, n, code).total;
        return [name, n, sum, Math.abs(sum - exact)];
      }),
    );
  }
  bindRanges(draw);
  $$("select").forEach((el) => (el.onchange = draw));
  $$("input[type=number]").forEach((el) => (el.oninput = draw));
  draw();
  renderPlot = draw;
}
function taylorLab() {
  scaffold(
    "taylor",
    select("taylor-kind", "展开函数", [
      ["sin", "f(x) = sin(x)"],
      ["cos", "f(x) = cos(x)"],
      ["exp", "f(x) = eˣ"],
      ["log", "f(x) = ln(1+x)"],
    ]) +
      range("order", "多项式阶数 n", 3, 0, 12, 1) +
      range("expansion", "展开中心 a", 0, -0.75, 1, 0.05) +
      range("testpoint", "误差观察点 x", 1, -2, 3, 0.05) +
      select("taylor-view", "纵轴范围", [
        ["local", "保留局部细节"],
        ["both", "包含原函数与近似观察点"],
      ]) +
      `<button class="button primary full" id="animate">▶ 自动演示</button>` +
      metric("观察点的绝对误差"),
    ["原函数 f(x)", "泰勒多项式 Tₙ(x)"],
    [
      "从 1 阶开始，逐步增加阶数，比较展开中心附近的曲线。",
      "改变展开中心 a，观察近似最贴合的位置如何移动。",
      "切换 ln(1+x)，比较收敛区间内外的表现。",
    ],
    "多加几阶，就一定能在任何位置得到更好的近似吗？",
    "不一定。泰勒级数有收敛范围，也可能不等于原函数。本实验的 sin、cos、exp 级数处处收敛到原函数；ln(1+x) 在中心 a 处的收敛半径为 1+a，范围之外不能靠无限加阶保证逼近。有限阶误差也不保证逐阶严格减小。",
  );
  function draw() {
    const k = $("#taylor-kind").value,
      a = Number($("#expansion").value),
      n = Number($("#order").value),
      x = Number($("#testpoint").value),
      coeff = Calc.taylorCoefficients(k, a, n),
      f = (t) => Calc.taylorOriginal(k, t),
      p = (t) => Calc.polynomial(coeff, a, t),
      fx = f(x),
      px = p(x);
    const bounds = [-2.5, 3.5, fx, f(a)];
    const exceedsRange = Math.abs(px) > 1e12;
    if ($("#taylor-view").value === "both" && !exceedsRange) bounds.push(px);
    const [top, bottom] = Calc.autoBounds(bounds);
    initBoard([-3.5, top, 3.5, bottom]);
    curve(f);
    curve(p, orange, 2, 2.5);
    point(a, f(a), purple, false, "a").setAttribute({
      label: { offset: [-18, -18] },
    });
    if (Number.isFinite(fx))
      point(x, fx, teal, false, "f(x)").setAttribute({
        label: { offset: [x > 2.2 ? -50 : 10, 17] },
      });
    const approximationVisible =
      Number.isFinite(px) && px <= top && px >= bottom;
    if (approximationVisible)
      point(x, px, orange, true, "Tₙ(x)").setAttribute({
        label: { offset: [x > 2.2 ? -50 : 10, -17] },
      });
    if (Number.isFinite(fx) && approximationVisible)
      segment([x, fx], [x, px], teal, 2);
    if (!approximationVisible)
      $("#plot-caption").textContent = exceedsRange
        ? "近似值超过 ±10¹² 的绘图范围；数值仍在控制台更新，画布保留原函数附近的细节。"
        : "近似观察点超出当前纵轴；选择「包含原函数与近似观察点」可查看。";
    values(
      Number.isFinite(fx) ? fmt(Math.abs(fx - px), 8) : "超出定义域",
      `f(x) = ${fmt(fx, 6)}；T${n}(x) = ${fmt(px, 6)}`,
    );
    const terms = coeff
      .map((c, i) => {
        if (Math.abs(c) < 1e-12) return "";
        return `${c < 0 ? "−" : "+"} ${fmt(Math.abs(c), 5)}${i ? `·(x${a < 0 ? "+" : "−"}${fmt(Math.abs(a), 2)})${i > 1 ? "^" + i : ""}` : ""}`;
      })
      .filter(Boolean)
      .join(" ")
      .replace(/^\+ /, "");
    const convergenceMessage =
      {
        undefined: "当前观察点不在原函数实数定义域。",
        outside: "当前观察点位于收敛区间之外。",
        inside: "当前观察点在收敛区间内部。",
        "right-endpoint": "当前观察点在右端点，级数条件收敛。",
      }[Calc.convergence(k, a, x)] || "";
    setMath(
      `T${n}(x) = ${terms || "0"}`,
      k === "log"
        ? `系数展示为四舍五入值。收敛半径 R = ${fmt(1 + a)}；区间 −1 < x ≤ ${fmt(1 + 2 * a)} 内收敛到 ln(1+x)。${convergenceMessage}`
        : "Tₙ(x) = Σ f⁽ᵏ⁾(a)(x−a)ᵏ/k!，k=0,…,n。计算使用完整精度；显示系数作四舍五入。",
      String.raw`T_{${n}}(x)=\sum_{k=0}^{${n}}\frac{f^{(k)}(${a})}{k!}(x${a < 0 ? "+" : "-"}${Math.abs(a)})^k`,
    );
    setDataTable(
      ["阶数 n", "Tₙ(x)", "绝对误差"],
      Array.from({ length: 13 }, (_, order) => {
        const value = Calc.polynomial(
          Calc.taylorCoefficients(k, a, order),
          a,
          x,
        );
        return [order, value, Number.isFinite(fx) ? Math.abs(fx - value) : NaN];
      }),
      n,
    );
  }
  bindRanges(() => {
    stopAnimation();
    draw();
  });
  $("#taylor-view").onchange = () => {
    stopAnimation();
    draw();
  };
  $("#taylor-kind").onchange = () => {
    stopAnimation();
    draw();
  };
  $("#animate").onclick = () => {
    if (timer) {
      stopAnimation(true);
      return;
    }
    animate((i) => {
      if (i % 6 === 0) {
        const n = Math.floor(i / 6);
        $("#order").value = n;
        $("#order-value").textContent = n;
        draw();
      }
      return i < 72;
    });
  };
  draw();
  renderPlot = draw;
}
function psychLab() {
  scaffold(
    "psych",
    select("scenario", "心理学教学情境", [
      ["learning", "学习曲线：累积与变化率"],
      ["normal", "正态分布：密度与概率"],
    ]) +
      `<div id="learning-controls">${range("rate", "学习速率 k", 0.5, 0.1, 1.5, 0.05)}${range("time", "练习时间 t", 3, 0, 10, 0.1)}</div><div id="normal-controls" hidden>${range("mean", "均值 μ", 0, -2, 2, 0.1)}${range("sigma", "标准差 σ", 1, 0.4, 2, 0.1)}<div class="paired-fields">${number("prob-a", "区间左端 a", -1, -5, 5, 0.1)}${number("prob-b", "区间右端 b", 1, -5, 5, 0.1)}</div></div>` +
      metric("当前观察结果"),
    ["函数曲线", "切线 / 区间边界"],
    [
      "学习曲线：调整 k，比较早期与后期的进步速度。",
      "移动时间 t，观察曲线仍在上升时，切线斜率如何变化。",
      "正态分布：调整 μ、σ 与区间端点，观察曲线下面积对应的概率。",
    ],
    "概率密度在某点的高度，就是出现这个分数的概率吗？",
    "不是。连续型变量在某个精确点取值的概率为 0，区间概率由密度曲线在该区间上的积分得到。学习曲线为示意模型，其参数并非来自实测或个体诊断。",
  );
  function draw() {
    const kind = $("#scenario").value;
    $("#learning-controls").hidden = kind !== "learning";
    $("#normal-controls").hidden = kind !== "normal";
    $$("#learning-controls input").forEach((el) => {
      el.disabled = kind !== "learning";
    });
    $$("#normal-controls input").forEach((el) => {
      el.disabled = kind !== "normal";
    });
    $("#error").textContent = "";
    if (kind === "learning") {
      const k = Number($("#rate").value),
        t = Number($("#time").value),
        f = (x) => (x >= 0 ? 1 - Math.exp(-k * x) : NaN),
        d = k * Math.exp(-k * t);
      initBoard([-0.7, 1.25, 10.7, -0.12]);
      curve(f);
      line((x) => f(t) + d * (x - t), orange, 2);
      point(t, f(t), purple, false, "P");
      values(`${fmt(f(t) * 100, 1)}%`, `瞬时进步速率 L′(t) = ${fmt(d, 4)}`);
      setMath(
        "L(t) = 1 − e⁻ᵏᵗ    L′(t) = k e⁻ᵏᵗ",
        `k = ${fmt(k)}，t = ${fmt(t)}。归一化学习曲线：用于解释边际变化，并非对所有学习过程的经验定律。`,
        String.raw`L(t)=1-e^{-kt}\qquad L'(t)=ke^{-kt}`,
      );
      setDataTable(
        ["时间 t", "累积 L(t)", "瞬时速率 L′(t)"],
        [0, 1, 2, 3, 5, 8, 10].map((t) => [t, f(t), k * Math.exp(-k * t)]),
      );
    } else {
      const mu = Number($("#mean").value),
        sigma = Number($("#sigma").value),
        a = Number($("#prob-a").value),
        b = Number($("#prob-b").value);
      if (
        !$("#prob-a").value ||
        !$("#prob-b").value ||
        a >= b ||
        a < -5 ||
        b > 5 ||
        !Number.isFinite(a) ||
        !Number.isFinite(b)
      ) {
        $("#error").textContent =
          "请设置 −5 到 5 内、a < b 的区间。图形保留上一有效设置。";
        return;
      }
      const f = (x) => Calc.normal(x, mu, sigma),
        p = Calc.normalProbability(a, b, mu, sigma);
      initBoard([-5.5, 1.1, 5.5, -0.08]);
      area(f, a, b, purple);
      curve(f);
      for (const x of [a, b]) segment([x, 0], [x, f(x)], orange, 2);
      values(`${fmt(p * 100, 2)}%`, `P(${fmt(a)} ≤ X ≤ ${fmt(b)}) · 区间面积`);
      setMath(
        "f(x) = exp[−(x−μ)²/(2σ²)] / (σ√(2π))",
        `μ = ${fmt(mu)}，σ = ${fmt(sigma)}。整条密度曲线下面积为 1；心理测量分数是否近似正态需由实际数据检验。`,
        String.raw`f(x)=\frac{1}{\sigma\sqrt{2\pi}}\exp\left[-\frac{(x-\mu)^2}{2\sigma^2}\right]`,
      );
      setDataTable(
        ["区间", "左端", "右端", "概率"],
        [
          ["当前区间", a, b, p],
          ...[1, 2, 3].map((z) => [
            "μ ± " + z + "σ",
            mu - z * sigma,
            mu + z * sigma,
            Calc.normalProbability(mu - z * sigma, mu + z * sigma, mu, sigma),
          ]),
        ],
        0,
      );
    }
  }
  bindRanges(draw);
  $("#scenario").onchange = draw;
  $$("input[type=number]").forEach((el) => (el.oninput = draw));
  draw();
  renderPlot = draw;
}
function resourcePage() {
  $("#main").innerHTML =
    head(
      "开源资源库",
      "THE OPEN SOURCE TOOLKIT",
      "为一堂直观的高数课，挑选合适的工具。",
    ) +
    `<div class="notice">本站已集成 JSXGraph、math.js 和 KaTeX，核心实验可直接操作。其余项目提供官方入口与课堂用途建议，需另行接入或制作课件。许可证核对日期：2026-10-20。</div><div class="resource-toolbar"><div class="filters">${[
      ["all", "全部资源"],
      ["interactive", "交互绘图"],
      ["compute", "数学计算"],
      ["animation", "动画制作"],
    ]
      .map(
        ([id, name]) =>
          `<button class="filter ${id === resourceFilter ? "active" : ""}" data-filter="${id}" aria-pressed="${id === resourceFilter}">${name}</button>`,
      )
      .join(
        "",
      )}</div><input type="search" class="resource-search" id="resource-search" aria-label="搜索开源资源" placeholder="搜索项目、语言或课堂用途…" value="${esc(resourceQuery)}"></div><div class="resource-count" id="resource-count"></div><div class="resource-grid" id="resource-grid"></div><div class="source-note"><strong>许可证与使用说明</strong><br>JSXGraph 以 MIT 选项集成；math.js 以 Apache-2.0、KaTeX 以 MIT 集成，随包保留许可证、NOTICE 与公式字体。外部工具的代码许可证不自动覆盖其中所有第三方素材。Manim 引擎为 MIT；<a href="https://github.com/3b1b/videos" target="_blank" rel="noopener">3Blue1Brown 视频场景代码</a>另为 CC BY-NC-SA 4.0，不能视为同一授权。本站未复制其视频。<br>本地库版本：JSXGraph 1.14.0 · math.js 15.2.0 · KaTeX 0.19.0。<a href="vendor/mathjs-NOTICE.txt" target="_blank" rel="noopener">math.js NOTICE</a></div>`;
  function filter() {
    const q = resourceQuery.toLowerCase().trim(),
      list = resources.filter(
        (r) =>
          (resourceFilter === "all" || r.category === resourceFilter) &&
          [r.name, r.desc, r.use, ...r.tags]
            .join(" ")
            .toLowerCase()
            .includes(q),
      );
    $("#resource-count").textContent =
      `共 ${list.length} 个项目 · 项目名称与许可证链接均指向官方来源`;
    $("#resource-grid").innerHTML = list.length
      ? list
          .map(
            (r) =>
              `<article class="resource-card"><div class="resource-top"><div class="resource-logo">${r.symbol}</div><div><h3>${r.name}</h3><small>${r.license}</small></div><span class="resource-status">${r.status}</span></div><p>${r.desc}</p><div class="resource-use">${r.use}</div><div class="resource-meta">${r.tags.map((x) => `<span class="tag">${x}</span>`).join("")}</div><div class="resource-links"><a href="${r.url}" target="_blank" rel="noopener">GitHub ↗</a><a href="${r.docs}" target="_blank" rel="noopener">文档与示例 ↗</a><a href="${r.licenseUrl}" target="_blank" rel="noopener">许可证 ↗</a>${r.local ? `<a href="${r.local}" target="_blank" rel="noopener">本地副本</a>` : ""}</div></article>`,
          )
          .join("")
      : '<div class="empty">没有匹配的资源。试试「绘图」「Python」或清空搜索。</div>';
  }
  $$("[data-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        resourceFilter = b.dataset.filter;
        $$("[data-filter]").forEach((x) => {
          x.classList.toggle("active", x === b);
          x.setAttribute("aria-pressed", x === b);
        });
        filter();
      }),
  );
  $("#resource-search").oninput = (e) => {
    resourceQuery = e.target.value;
    filter();
  };
  filter();
}
function guide() {
  $("#main").innerHTML =
    head(
      "课堂使用指南",
      "A CLASSROOM BUILT FOR CURIOSITY",
      "先预测，再操作，最后用数学语言解释。",
    ) +
    `<div class="guide-grid"><article><span class="guide-number">01 /</span><h2>一条 25 分钟的课堂路线</h2><ol><li><strong>5 分钟 · 看图提问。</strong>输入 1-exp(-0.5*x)，设置 x∈[0,10]，让学生预测进步速度。</li><li><strong>8 分钟 · 建立导数直觉。</strong>切换「导数与变化率」，缩小 h，比较平均与瞬时变化率。</li><li><strong>7 分钟 · 回到心理学。</strong>在学习曲线中改变 k、t，讨论「仍在进步」和「进步加速」。</li><li><strong>5 分钟 · 学生解释。</strong>要求用函数值、斜率和导数三个词说明观察。</li></ol><a class="button primary" href="#function">从函数图像开始 ↗</a></article><article><span class="guide-number">02 /</span><h2>适合投影的展示方式</h2><p>右上角「课堂演示」会隐藏侧栏与补充说明，放大图形和主要数值；再次点击或按 Esc 退出。需要充满屏幕时，可使用浏览器全屏功能。</p><p>实验右上角可复位视图或导出 SVG，方便插入课件。「重置实验」恢复当前主题的默认参数。参数自动保存在本机浏览器；每张图下方可展开数值表并导出 CSV。「自动演示」可以暂停和继续，手动调整参数会结束当前演示序列。切到其他浏览器页签时会暂停。</p><button class="button" id="guide-present">进入课堂演示</button></article><article><span class="guide-number">03 /</span><h2>三组值得停下来的问题</h2><ol><li><strong>极限：</strong>函数在某点没有定义，为什么还能谈论极限？用 sin(x)/x 演示。</li><li><strong>积分：</strong>定积分为 0，几何面积也一定为 0 吗？用 f(x)=x 在 [−2,2] 上演示。</li><li><strong>泰勒：</strong>提高阶数一定处处更好吗？用 ln(1+x) 比较收敛半径内外。</li></ol><a class="button" href="#taylor">打开泰勒展开 ↗</a></article><article><span class="guide-number">04 /</span><h2>使用前了解这些边界</h2><p>函数输入使用弧度制。常用对数写 log10(x)，以 2 为底写 log2(x)，自然对数写 ln(x)；log(x) 也表示自然对数。支持实数单变量表达式，不支持隐函数、复数或分段脚本。有限采样可能遗漏狭窄峰值和快速振荡，不能凭图像证明连续、可导或收敛。</p><p>离线版已内嵌图形、数学库和公式字体，单个 HTML 文件即可拷贝到其他电脑打开；也可解压多文件版后打开 index.html。外部资源链接需要联网。网站不收集学生姓名、成绩或心理测量数据。心理学案例是教学示意，未用真实数据拟合。</p><a class="button" href="#resources">查看开源来源 ↗</a></article></div><p class="source-note">以「北语心理学院高数课程」为使用情境制作的课堂展示版；并非学校官方发布平台。具体教学顺序可按任课教师大纲调整。</p>`;
  $("#guide-present").onclick = () => {
    location.hash = "derivative";
    setPresentation(true);
  };
  const examples = [
    {
      id: "function",
      title: "学习会一直加速吗？",
      detail: "绘出学习曲线，先预测变化率。",
      params: {
        expression: "1-exp(-0.5*x)",
        xmin: "0",
        xmax: "10",
        ymode: "auto",
        probe: "3",
      },
    },
    {
      id: "limit",
      title: "没有函数值，也能有极限",
      detail: "sin(x)/x 从左右靠近 0。",
      params: { "limit-kind": "sinc", distance: "0.5" },
    },
    {
      id: "derivative",
      title: "连续，但是不可导",
      detail: "|x| 在原点的左右差商不同。",
      params: {
        "derivative-kind": "abs",
        center: "0",
        step: "1",
        direction: "right",
      },
    },
    {
      id: "integral",
      title: "积分为零，面积呢？",
      detail: "f(x)=x 在 [−2,2] 上的正负抵消。",
      params: {
        "integral-kind": "linear",
        lower: "-2",
        upper: "2",
        partitions: "8",
        method: "mid",
      },
    },
    {
      id: "taylor",
      title: "加阶数反而离得更远",
      detail: "ln(1+x) 在 a=0 展开，观察 x=2。",
      params: {
        "taylor-kind": "log",
        expansion: "0",
        testpoint: "2",
        order: "3",
        "taylor-view": "local",
      },
    },
    {
      id: "psych",
      title: "正态分布的一个标准差",
      detail: "标准正态分布 [−1,1] 的面积。",
      params: {
        scenario: "normal",
        mean: "0",
        sigma: "1",
        "prob-a": "-1",
        "prob-b": "1",
      },
    },
  ];
  const section = document.createElement("section");
  section.className = "example-section";
  section.innerHTML =
    '<div class="section-heading"><div><h2>一键载入课堂例题</h2><p>载入会替换对应实验的参数；可以随时重置。</p></div></div><div class="example-grid">' +
    examples
      .map(
        (example, i) =>
          `<article><span class="eyebrow">EXAMPLE / 0${i + 1}</span><h3>${example.title}</h3><p>${example.detail}</p><button class="button" data-example="${i}">载入示例 ↗</button></article>`,
      )
      .join("") +
    "</div>";
  $("#main").append(section);
  const downloads = document.createElement("section");
  downloads.className = "document-downloads";
  downloads.innerHTML =
    '<div><h2>把说明带到课堂</h2><p>版本 2.0.0 · Markdown 文档可离线保存、编辑和交接。</p></div><a class="button" href="docs/使用说明.md" download="高数网站-使用说明书.md">下载使用说明书 ↓</a><a class="button" href="docs/开发交接.md" download="高数网站-开发交接文档.md">下载开发交接文档 ↓</a><a class="button" href="docs/公开与离线部署.md" download>公开与离线部署指南 ↓</a><a class="button" href="https://github.com/dingyuzero/blcu-calculus-classroom/releases/latest" target="_blank" rel="noopener">单文件版下载 ↗</a>';
  $("#main").append(downloads);
  $$("[data-example]").forEach((button) => {
    button.onclick = () => {
      const example = examples[Number(button.dataset.example)];
      persistTopic(example.id, example.params);
      location.hash = example.id;
      toast("已载入：" + example.title);
    };
  });
}
function setPresentation(on) {
  document.body.classList.toggle("presentation", on);
  $("#present span").textContent = on ? "退出演示" : "课堂演示";
  $("#present").setAttribute("aria-pressed", on);
  requestAnimationFrame(() => {
    const plot = $("#plot");
    if (board && plot)
      board.resizeContainer(plot.clientWidth, plot.clientHeight, true);
  });
}
function route(reset = false) {
  if (!reset) saveControls();
  const [id = "home", moduleId = "main"] = (
    location.hash.slice(1) || "home"
  ).split("/");
  stopAnimation();
  if (scene) {
    scene.destroy();
    scene = null;
    board = null;
  }
  renderPlot = null;
  current = ["home", "resources", "guide", ...topics.map((x) => x.id)].includes(
    id,
  )
    ? id
    : "home";
  currentModule = chapterModules[current]?.some((m) => m.id === moduleId)
    ? moduleId
    : "main";
  $$("[data-nav]").forEach((a) => {
    a.classList.toggle("active", a.dataset.nav === current);
    if (a.dataset.nav === current) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  $("#breadcrumb").textContent =
    topics.find((x) => x.id === current)?.title ||
    { home: "课程总览", resources: "开源资源库", guide: "课堂使用指南" }[
      current
    ];
  closeMenu();
  document.title = `${$("#breadcrumb").textContent} · 北语心理学院高数课程`;
  const renderer =
    currentModule !== "main"
      ? chapterModules[current].find((m) => m.id === currentModule).render
      : {
          home,
          resources: resourcePage,
          guide,
          function: functionLab,
          limit: limitLab,
          derivative: derivativeLab,
          integral: integralLab,
          taylor: taylorLab,
          psych: psychLab,
        }[current];
  renderer();
  controlBaseline = JSON.stringify(controlSnapshot());
  if (!reset) window.scrollTo(0, 0);
}
$("#menu").onclick = () => {
  const on = $("#sidebar").classList.toggle("open");
  $("#menu").setAttribute("aria-expanded", on);
};
$("#present").onclick = () =>
  setPresentation(!document.body.classList.contains("presentation"));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setPresentation(false);
    closeMenu();
    stopAnimation(true);
  }
  if (
    e.code === "Space" &&
    !e.target.closest("input,select,textarea,button,a,[contenteditable] ") &&
    $("#animate")
  ) {
    e.preventDefault();
    $("#animate").click();
  }
});
document.addEventListener("click", (e) => {
  if (
    $("#sidebar").classList.contains("open") &&
    !$("#sidebar").contains(e.target) &&
    !$("#menu").contains(e.target)
  )
    closeMenu();
});
$(".skip").onclick = (e) => {
  e.preventDefault();
  $("#main").focus();
};
$("#menu").setAttribute("aria-expanded", "false");
$("#menu").setAttribute("aria-controls", "sidebar");
document.addEventListener("input", (e) => {
  if (e.target.closest(".control-panel")) saveControls();
});
document.addEventListener("change", (e) => {
  if (e.target.closest(".control-panel")) saveControls();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAnimation(true);
    saveControls();
  }
});
window.addEventListener("beforeunload", saveControls);
window.addEventListener("hashchange", () => route());
if (!window.JXG || !window.math || !window.Calc || !window.ClassroomPlot) {
  $("#main").innerHTML =
    '<div class="notice">数学组件未能加载。请确认 vendor 文件夹与 index.html 保持在一起，并刷新页面。</div>';
} else route();
