"use strict";
const trigInfo = {
  sin: {
    cn: "正弦",
    formula: "sin θ = y",
    ratio: "对边 / 斜边",
    domain: "ℝ",
    range: "[−1,1]",
    period: "2π",
    parity: "奇函数",
    inverse: "arcsin",
    iDomain: "[−1,1]",
    iRange: "[−π/2,π/2]",
    sine: "sin θ",
    derivative: "cos x",
    iDerivative: "1 / √(1−x²)",
    color: "#7454bd",
  },
  cos: {
    cn: "余弦",
    formula: "cos θ = x",
    ratio: "邻边 / 斜边",
    domain: "ℝ",
    range: "[−1,1]",
    period: "2π",
    parity: "偶函数",
    inverse: "arccos",
    iDomain: "[−1,1]",
    iRange: "[0,π]",
    sine: "sin(θ+π/2)",
    derivative: "−sin x",
    iDerivative: "−1 / √(1−x²)",
    color: "#d88d51",
  },
  tan: {
    cn: "正切",
    formula: "tan θ = sin θ / cos θ",
    ratio: "对边 / 邻边",
    domain: "θ ≠ π/2+kπ",
    range: "ℝ",
    period: "π",
    parity: "奇函数",
    inverse: "arctan",
    iDomain: "ℝ",
    iRange: "(−π/2,π/2)",
    sine: "sin θ / sin(θ+π/2)",
    derivative: "sec² x",
    iDerivative: "1 / (1+x²)",
    color: "#389c96",
  },
  cot: {
    cn: "余切",
    formula: "cot θ = cos θ / sin θ",
    ratio: "邻边 / 对边",
    domain: "θ ≠ kπ",
    range: "ℝ",
    period: "π",
    parity: "奇函数",
    inverse: "arccot",
    iDomain: "ℝ",
    iRange: "(0,π)",
    sine: "sin(θ+π/2) / sin θ",
    derivative: "−csc² x",
    iDerivative: "−1 / (1+x²)",
    color: "#b65d85",
  },
  sec: {
    cn: "正割",
    formula: "sec θ = 1 / cos θ",
    ratio: "斜边 / 邻边",
    domain: "θ ≠ π/2+kπ",
    range: "(−∞,−1] ∪ [1,+∞)",
    period: "2π",
    parity: "偶函数",
    inverse: "arcsec",
    iDomain: "(−∞,−1] ∪ [1,+∞)",
    iRange: "[0,π/2) ∪ (π/2,π]",
    sine: "1 / sin(θ+π/2)",
    derivative: "sec x · tan x",
    iDerivative: "1 / (|x|√(x²−1))",
    color: "#497bad",
  },
  csc: {
    cn: "余割",
    formula: "csc θ = 1 / sin θ",
    ratio: "斜边 / 对边",
    domain: "θ ≠ kπ",
    range: "(−∞,−1] ∪ [1,+∞)",
    period: "2π",
    parity: "奇函数",
    inverse: "arccsc",
    iDomain: "(−∞,−1] ∪ [1,+∞)",
    iRange: "[−π/2,0) ∪ (0,π/2]",
    sine: "1 / sin θ",
    derivative: "−csc x · cot x",
    iDerivative: "−1 / (|x|√(x²−1))",
    color: "#7b8b3d",
  },
};
const trigModules = [
  { id: "main", title: "单位圆与六种函数", render: trigCircle },
  { id: "graphs", title: "六函数图像对照", render: trigGraphs },
  { id: "sine", title: "从 sin 出发", render: trigSine },
  { id: "identities", title: "恒等式的几何", render: trigIdentities },
  { id: "inverse", title: "六种反函数", render: trigInverse },
  { id: "compose", title: "角度如何映射", render: trigCompose },
  { id: "calculus", title: "导数与切线", render: trigCalculus },
];
function installTrig() {
  topics.splice(1, 0, {
    id: "trig",
    title: "三角函数与反函数",
    en: "TRIGONOMETRY · SEE THE CONNECTIONS",
    symbol: "θ",
    desc: "从单位圆认识六种三角函数，走向反函数与微积分。",
    tags: "单位圆 · 六函数 · 反函数",
    time: "按需探索",
    hint: "转动一个角，把几何、函数与公式连起来。",
  });
  chapterModules.trig = trigModules;
}
const trigOptions = () => Trig.keys.map((k) => [k, `${k} · ${trigInfo[k].cn}`]);
function trigSelect(selected = "sin") {
  return select("trig-kind", "观察的函数", trigOptions()).replace(
    `value="${selected}"`,
    `value="${selected}" selected`,
  );
}
function trigAngle(value = 30, min = -180, max = 360) {
  return (
    range("theta", "角度 θ（度）", value, min, max, 1) +
    `<div class="trig-presets" aria-label="常用角">${[
      0, 30, 45, 60, 90, 120, 180, 270,
    ]
      .filter((d) => d >= min && d <= max)
      .map(
        (d) => `<button class="button small" data-angle="${d}">${d}°</button>`,
      )
      .join("")}</div>`
  );
}
function trigSetup(fields, legend, steps, question, answer) {
  scaffold(
    "trig",
    fields + metric("当前观察"),
    legend,
    steps,
    question,
    answer,
  );
  $("#plot").classList.add("trig-canvas");
  $(".source-note").innerHTML =
    '六种函数，一条学习路线：<a href="#trig">单位圆</a> → <a href="#trig/graphs">图像</a> → <a href="#trig/inverse">反函数</a> → <a href="#trig/calculus">导数</a> · <a href="docs/三角函数学习说明.md" download>下载学习说明</a>';
  $(".formula-band").insertAdjacentHTML(
    "afterend",
    '<div id="trig-explanation"></div>',
  );
  $("#view-reset").textContent = "刷新图形";
}
function trigBind(draw) {
  const update = () => {
    stopAnimation();
    draw();
    saveControls();
  };
  $$(".control-panel input,.control-panel select").forEach((e) =>
    e.addEventListener(e.tagName === "SELECT" ? "change" : "input", update),
  );
  $$("[data-angle]").forEach(
    (b) =>
      (b.onclick = () => {
        $("#theta").value = b.dataset.angle;
        update();
      }),
  );
  $("#view-reset").onclick = update;
  renderPlot = draw;
  draw();
  return update;
}
function trigSync() {
  for (const e of $$(".control-panel input[type=range]"))
    $("#" + e.id + "-value").textContent = e.value;
}
function trigMetrics(html) {
  $("#trig-explanation").innerHTML = html;
}
function trigReference(inverted = false) {
  return `<section class="trig-reference"><h2>${inverted ? "六种反函数 · 输入与输出" : "六种三角函数 · 名称与关系"}</h2><div class="trig-reference-grid">${Trig.keys
    .map((k) => {
      const m = trigInfo[k];
      return `<article style="--trig-color:${m.color}"><div class="trig-name"><strong>${inverted ? m.inverse : k}</strong><span>${inverted ? "反" : ""}${m.cn}</span></div><p class="trig-equation">${inverted ? `${m.inverse}(u)=θ ⇔ ${k}(θ)=u` : m.formula}</p><dl><dt>${inverted ? "输入 u" : "定义域"}</dt><dd>${inverted ? m.iDomain : m.domain}</dd><dt>${inverted ? "输出角 θ" : "值域"}</dt><dd>${inverted ? m.iRange : m.range}</dd>${inverted ? "" : `<dt>周期 · 对称</dt><dd>${m.period} · ${m.parity}</dd><dt>锐角直角三角形</dt><dd>${m.ratio}</dd>`}</dl></article>`;
    })
    .join(
      "",
    )}</div><p>${inverted ? "反函数返回的角称为主值，本页六种主值范围如上。" : "单位圆半径为 1，点 P=(x,y)=(cos θ,sin θ)。表中 k 为任意整数；π 弧度=180°。"}</p></section>`;
}
// SVG panels share coordinates for geometry, sampling and reflected inverse graphs.
function trigDrawing(W, H) {
  let parts = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(activeTitle())}" style="display:block;width:100%;height:auto;background:#fff"><title>${esc(activeTitle())}</title>`,
    ],
    index = 0;
  const text = (x, y, t, color = "#526273", size = 16, anchor = "start") =>
    parts.push(
      `<text x="${x}" y="${y}" fill="${color}" font-family="Arial,Microsoft YaHei,sans-serif" font-size="${size}" text-anchor="${anchor}">${esc(t)}</text>`,
    );
  function frame(x, y, w, h, lo, hi, bottom, top, title = "", ticks = true) {
    const id = `trig-clip-${index++}`,
      X = (v) => x + ((v - lo) / (hi - lo)) * w,
      Y = (v) => y + h - ((v - bottom) / (top - bottom)) * h;
    parts.push(
      `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="#fcfcff" stroke="#e2e6ef"/>`,
    );
    if (title) text(x, y - 13, title, "#354158", 18);
    const screenLine = (a, b, c, d, color = "#dfe4ec", dash = "", width = 1) =>
      parts.push(
        `<path d="M${a},${b}L${c},${d}" fill="none" stroke="${color}" stroke-width="${width}" ${dash ? `stroke-dasharray="${dash}"` : ""} clip-path="url(#${id})"/>`,
      );
    const ln = (a, b, color = "#7454bd", dash = "", width = 2) => {
      if ([...a, ...b].every(Number.isFinite))
        screenLine(X(a[0]), Y(a[1]), X(b[0]), Y(b[1]), color, dash, width);
    };
    if (ticks) {
      const step = hi - lo > 15 ? 2 : hi - lo > 7 ? 1 : 0.5;
      for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) {
        ln([v, bottom], [v, top], "#edf0f6");
        if (Math.abs(v) > 1e-8)
          text(X(v), y + h + 20, fmt(v, 2), "#798390", 12, "middle");
      }
      const sy = top - bottom > 12 ? 2 : top - bottom > 5 ? 1 : 0.5;
      for (let v = Math.ceil(bottom / sy) * sy; v <= top + 1e-9; v += sy) {
        ln([lo, v], [hi, v], "#edf0f6");
        if (Math.abs(v) > 1e-8)
          text(x - 7, Y(v) + 4, fmt(v, 2), "#798390", 12, "end");
      }
    }
    ln([lo, 0], [hi, 0], "#aab3c2");
    ln([0, bottom], [0, top], "#aab3c2");
    const path = (
      points,
      color = "#7454bd",
      width = 2.5,
      dash = "",
      fill = "none",
    ) => {
      let d = "",
        pen = false;
      for (const [px, py] of points) {
        if (
          !Number.isFinite(px) ||
          !Number.isFinite(py) ||
          Math.abs(py) > 1e5 ||
          Math.abs(px) > 1e5
        ) {
          pen = false;
          continue;
        }
        d += (pen ? "L" : "M") + X(px).toFixed(3) + "," + Y(py).toFixed(3);
        pen = true;
      }
      parts.push(
        `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" ${dash ? `stroke-dasharray="${dash}"` : ""} clip-path="url(#${id})"/>`,
      );
    };
    const pt = (a, b, color = "#7454bd", open = false, label = "") => {
      if (
        Number.isFinite(a) &&
        Number.isFinite(b) &&
        a >= lo &&
        a <= hi &&
        b >= bottom &&
        b <= top
      ) {
        parts.push(
          `<circle cx="${X(a)}" cy="${Y(b)}" r="4.8" fill="${open ? "white" : color}" stroke="${color}" stroke-width="2"/>`,
        );
        if (label) text(X(a) + 8, Y(b) - 10, label, color, 15);
      }
    };
    return {
      X,
      Y,
      line: ln,
      path,
      point: pt,
      label: (a, b, t, color, size = 16) => text(X(a), Y(b), t, color, size),
      shade: (a, b, color) =>
        parts.push(
          `<rect x="${X(a)}" y="${y}" width="${X(b) - X(a)}" height="${h}" fill="${color}" opacity=".07" clip-path="url(#${id})"/>`,
        ),
    };
  }
  return {
    text,
    frame,
    raw: (s) => parts.push(s),
    finish: () => {
      $("#plot").innerHTML = parts.join("") + "</svg>";
      $("#plot").dataset.sceneItems = String(index);
    },
  };
}
function trigCurve(
  frame,
  key,
  lo,
  hi,
  color = trigInfo[key].color,
  bottom = -10,
  top = 10,
) {
  Trig.branches(key, lo, hi).forEach((p) => frame.path(p, color));
  Trig.poles(key, lo, hi).forEach((x) =>
    frame.line([x, bottom], [x, top], "#b2a4c9", "4 5", 1),
  );
}
function trigSeries(f, lo, hi, n = 300) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const x = lo + ((hi - lo) * i) / n;
    return [x, f(x)];
  });
}
const trigTableValue = (n) => (Number.isFinite(n) ? n : "未定义");
function trigConclusion(formula, note, caption, headers, rows, latex = "") {
  trigSync();
  setMath(formula, note, latex);
  $("#plot-caption").textContent = caption;
  setDataTable(headers, rows);
}
function trigPiGrid(d, f, lo, hi, bottom, top) {
  for (
    let k = Math.ceil(lo / (Math.PI / 2));
    k <= Math.floor(hi / (Math.PI / 2));
    k++
  ) {
    const x = (k * Math.PI) / 2;
    f.line([x, bottom], [x, top], "#e7eaf1");
    const label =
      k === 0
        ? "0"
        : k === 1
          ? "π/2"
          : k === -1
            ? "−π/2"
            : k === 2
              ? "π"
              : k === -2
                ? "−π"
                : k % 2 === 0
                  ? `${k / 2}π`
                  : `${k}π/2`;
    d.text(f.X(x), f.Y(bottom) + 20, label, "#687589", 13, "middle");
  }
  const step = [0.2, 0.5, 1, 2, 5, 10, 20, 50].find(
    (s) => (top - bottom) / s <= 6,
  );
  for (let k = Math.ceil(bottom / step); k <= Math.floor(top / step); k++) {
    const value = k * step;
    f.line([lo, value], [hi, value], k === 0 ? "#a6b0c0" : "#edf0f5");
    if (k !== 0)
      d.text(f.X(lo) - 6, f.Y(value) + 4, fmt(value, 2), "#798390", 12, "end");
  }
}
function trigCircle() {
  trigSetup(
    trigSelect("sec") +
      trigAngle(35, -180, 360) +
      '<button class="button primary full" id="animate">▶ 自动演示</button>',
    ["紫：单位圆与半径 OP", "橙：P 点切线", "彩色粗线：所选函数对应的几何量"],
    [
      "先选 sin、cos，观察 P 的横纵坐标。",
      "再选 sec、csc，看 P 点切线在两轴的截距。",
      "选 tan、cot，转动角度，比较切线上的两段长度。",
    ],
    "六个函数怎样由同一个点 P 得到？",
    "P 的坐标给出 cos θ、sin θ；P 点切线的横截距给出 sec θ，纵截距给出 csc θ。切线上的 PQ 长度为 |tan θ|，PR 长度为 |cot θ|。函数的正负由当前象限决定。",
  );
  const descriptions = {
    sin: "sin θ 是 P 的纵坐标。",
    cos: "cos θ 是 P 的横坐标。",
    tan: "切线段 PQ 的长度为 |tan θ|；tan θ=sin θ/cos θ。",
    cot: "切线段 PR 的长度为 |cot θ|；cot θ=cos θ/sin θ。",
    sec: "切线与横轴交于 Q，Q 的横坐标为 sec θ。",
    csc: "切线与纵轴交于 R，R 的纵坐标为 csc θ。",
  };
  const draw = () => {
    const theta = Trig.rad(num("theta")),
      v = Trig.all(theta),
      key = $("#trig-kind").value,
      m = trigInfo[key],
      d = trigDrawing(600, 490),
      f = d.frame(62, 40, 480, 400, -3.6, 3.6, -3, 3);
    f.path(
      Array.from({ length: 181 }, (_, i) => [
        Math.cos((i * Math.PI) / 90),
        Math.sin((i * Math.PI) / 90),
      ]),
      purple,
      2,
    );
    const p = [v.cos, v.sin],
      q = [v.sec, 0],
      r = [0, v.csc];
    f.line([0, 0], p, purple, "", 2.5);
    f.line(p, [v.cos, 0], "#c5cbd7", "4 4");
    f.line(p, [0, v.sin], "#c5cbd7", "4 4");
    if (Math.abs(v.sin) > 0.0001)
      f.line(
        [-3.6, (1 + 3.6 * v.cos) / v.sin],
        [3.6, (1 - 3.6 * v.cos) / v.sin],
        orange,
        "",
        2,
      );
    else f.line([v.sec, -3], [v.sec, 3], orange, "", 2);
    const segments = {
      sin: [[v.cos, 0], p],
      cos: [
        [0, 0],
        [v.cos, 0],
      ],
      tan: [p, q],
      cot: [p, r],
      sec: [[0, 0], q],
      csc: [[0, 0], r],
    };
    f.line(...segments[key], m.color, "", 5);
    f.path(
      Array.from({ length: 61 }, (_, i) => [
        0.4 * Math.cos((theta * i) / 60),
        0.4 * Math.sin((theta * i) / 60),
      ]),
      purple,
      2,
    );
    f.point(...p, purple, false, "P");
    f.point(...q, trigInfo.sec.color, false, "Q");
    f.point(...r, trigInfo.csc.color, false, "R");
    d.text(62, 468, `θ=${num("theta")}° = ${fmt(theta)} rad`, purple, 18);
    d.finish();
    values(`${key} θ = ${fmt(v[key])}`, descriptions[key]);
    trigConclusion(
      m.formula,
      "单位圆 P 点的切线方程：cos θ·X + sin θ·Y = 1。",
      "横纵轴使用相同单位；Q=(sec θ,0)，R=(0,csc θ)。",
      ["函数", "中文名", "当前值"],
      Trig.keys.map((k) => [
        k,
        trigInfo[k].cn,
        Number.isFinite(v[k]) ? v[k] : "未定义",
      ]),
    );
    trigMetrics(
      `<div class="trig-live-values">${Trig.keys.map((k) => `<div style="--trig-color:${trigInfo[k].color}"><span>${trigInfo[k].cn} ${k}</span><strong>${fmt(v[k])}</strong></div>`).join("")}</div>` +
        trigReference(),
    );
  };
  trigBind(draw);
  $("#animate").onclick = () => {
    if (timer) {
      stopAnimation(true);
      return;
    }
    animate(() => {
      $("#theta").value = String(num("theta") >= 360 ? -180 : num("theta") + 2);
      draw();
    }, null);
  };
}
function trigGraphs() {
  trigSetup(
    trigAngle(30, -360, 360) +
      range("cycles", "横轴半宽（π 的倍数）", 2, 1, 3) +
      select("height", "纵轴范围", [
        ["fit", "按函数适配：sin/cos ±1.2，其余 ±5"],
        ...[1.2, 2, 3, 4, 5, 6, 10, 20, 50].map((h) => [
          String(h),
          `−${h} 到 ${h}`,
        ]),
      ]).replace('value="3"', 'value="3" selected'),
    ["每张图使用对应函数的颜色", "紫灰虚线：渐近线", "深灰虚线：当前观察角度"],
    [
      "先比较 sin 与 cos 的形状和相位。",
      "观察 tan 与 cot 每隔 π 重复。",
      "比较 sec/csc 的两侧分支与 sin/cos 的波峰、波谷。",
    ],
    "sec 和 csc 为什么总在 y≥1 或 y≤−1 的区域？",
    "单位圆上 |sin θ|、|cos θ| 都不超过 1，因此它们非零时对应的 1/sin θ、1/cos θ 的绝对值至少是 1。它们在 sin 或 cos 为零的角度出现竖直渐近线。",
  );
  $(".legend").classList.add("trig-graph-legend");
  trigBind(() => {
    const theta = Trig.rad(num("theta")),
      lo = -num("cycles") * Math.PI,
      hi = -lo,
      scale = $("#height").value,
      cols = $("#plot").clientWidth < 520 ? 1 : 2,
      d = trigDrawing(cols * 390 + 20, Math.ceil(6 / cols) * 225 + 20);
    Trig.keys.forEach((k, i) => {
      const h =
          scale === "fit"
            ? ["sin", "cos"].includes(k)
              ? 1.2
              : 5
            : Number(scale),
        x = 45 + (i % cols) * 390,
        y = 40 + Math.floor(i / cols) * 225,
        f = d.frame(
          x,
          y,
          330,
          158,
          lo,
          hi,
          -h,
          h,
          `${k} · ${trigInfo[k].cn}`,
          false,
        );
      trigPiGrid(d, f, lo, hi, -h, h);
      trigCurve(f, k, lo, hi, trigInfo[k].color, -h, h);
      f.line([theta, -h], [theta, h], "#8998ab", "3 3");
      f.point(theta, Trig.value(k, theta), trigInfo[k].color);
    });
    d.finish();
    values(
      `θ = ${num("theta")}°`,
      scale === "fit"
        ? "六张图共用角度；sin/cos 纵轴为 ±1.2，其余为 ±5。"
        : `六张图共用角度，纵轴均为 −${scale} 到 ${scale}。`,
    );
    trigConclusion(
      "sin、cos、sec、csc 的周期是 2π；tan、cot 的周期是 π。",
      "各图横轴均为弧度，纵轴为函数值。",
      "六函数对照：波峰、零点、周期与渐近线。",
      ["函数", "当前函数值", "周期", "定义域"],
      Trig.keys.map((k) => [
        k,
        trigTableValue(Trig.value(k, theta)),
        trigInfo[k].period,
        trigInfo[k].domain,
      ]),
    );
    trigMetrics(trigReference());
  });
}
function trigSine() {
  trigSetup(
    trigSelect("sec") + range("theta", "观察角度 θ（度）", 30, -180, 180, 1),
    ["紫：sin θ", "橙：向左平移 π/2 后的 cos θ", "第三幅：用两者构成所选函数"],
    [
      "看第一幅正弦曲线。",
      "沿横轴向左平移 π/2，得到第二幅余弦曲线。",
      "切换第三幅的函数，查看相同角度的计算关系。",
    ],
    "能从 sin 得到其余五种三角函数吗？",
    "能。已知完整的 sin 函数，用 cos θ=sin(θ+π/2) 得到 cos，再构成 sin/cos、cos/sin、1/cos、1/sin，依次得到 tan、cot、sec、csc。六种记法分别突出不同的几何与计算关系。",
  );
  trigBind(() => {
    const key = $("#trig-kind").value,
      m = trigInfo[key],
      theta = Trig.rad(num("theta")),
      v = Trig.all(theta),
      d = trigDrawing(620, 660),
      lo = -Math.PI,
      hi = Math.PI;
    ["sin", "cos", key].forEach((k, i) => {
      const h = i === 2 ? 3 : 1.4,
        f = d.frame(
          60,
          40 + i * 215,
          525,
          150,
          lo,
          hi,
          -h,
          h,
          i === 0
            ? "① 原曲线 sin θ"
            : i === 1
              ? "② 左移 π/2：cos θ = sin(θ+π/2)"
              : `③ ${key} θ = ${m.sine}`,
          false,
        );
      trigPiGrid(d, f, lo, hi, -Math.floor(h), Math.floor(h));
      trigCurve(f, k, lo, hi);
      f.line([theta, -h], [theta, h], "#8998ab", "3 3", 1);
      f.point(theta, v[k], trigInfo[k].color);
      if (i === 0) {
        const x = theta + Math.PI / 2;
        if (x <= hi) f.point(x, Math.sin(x), orange, true);
      }
    });
    d.finish();
    values(
      `${key} θ = ${fmt(v[key])}`,
      `sin θ=${fmt(v.sin)}，sin(θ+π/2)=${fmt(v.cos)}。`,
    );
    trigConclusion(
      `${key} θ = ${m.sine}`,
      "余弦是正弦的水平平移；其他四种通过这两者构成。",
      "同一条竖向观察位置 θ，分别读取 sin、cos 与所选函数的值。",
      ["函数", "用 sin 表示", "当前值"],
      Trig.keys.map((k) => [
        k,
        trigInfo[k].sine,
        trigTableValue(Trig.fromSine(k, theta)),
      ]),
    );
    trigMetrics(
      `<section class="trig-story"><h2>一条正弦曲线，六种表达</h2><div class="trig-relations">${Trig.keys.map((k) => `<div style="--trig-color:${trigInfo[k].color}"><strong>${k} θ</strong><span>${trigInfo[k].sine}</span></div>`).join("")}</div><p>例如 θ=30°：sin θ=1/2，cos θ=√3/2，tan θ=√3/3，cot θ=√3，sec θ=2√3/3，csc θ=2。</p></section>`,
    );
  });
}
function trigIdentities() {
  trigSetup(
    select("identity", "选择一组恒等式", [
      ["circle", "sin² θ + cos² θ = 1"],
      ["sec", "1 + tan² θ = sec² θ"],
      ["csc", "1 + cot² θ = csc² θ"],
    ]) +
      range("theta", "锐角 θ（度）", 35, 5, 85, 1) +
      select("identity-view", "视野大小", [
        ["2", "标准"],
        ["1", "近景"],
        ["4", "宽视野"],
        ["8", "全景"],
      ]),
    [
      "紫、橙：两条直角边上的正方形",
      "青：斜边上的正方形",
      "面积条：两块面积拼成总面积",
    ],
    [
      "观察直角三角形三条边对应的函数。",
      "固定单位边与面积为 1 的正方形，改变角度，观察另外两块面积。",
      "切换恒等式，比较单位圆关系除以 cos² 或 sin² 后的结果。",
    ],
    "三组恒等式为什么都来自勾股定理？",
    "sin² θ+cos² θ=1 来自半径为 1 的直角三角形。等式两边除以 cos² θ 得到 1+tan² θ=sec² θ；除以 sin² θ 得到 1+cot² θ=csc² θ。",
  );
  const setViewControl = () => {
    $("#identity-view").closest(".field").hidden =
      $("#identity").value === "circle";
  };
  $("#identity").addEventListener("change", setViewControl);
  setViewControl();
  trigBind(() => {
    const theta = Trig.rad(num("theta")),
      kind = $("#identity").value,
      v = Trig.all(theta),
      a = kind === "circle" ? v.cos : 1,
      b = kind === "circle" ? v.sin : kind === "sec" ? v.tan : v.cot,
      h = kind === "circle" ? 1 : Math.hypot(a, b),
      names =
        kind === "circle"
          ? ["cos θ", "sin θ", "1"]
          : kind === "sec"
            ? ["1", "tan θ", "sec θ"]
            : ["1", "cot θ", "csc θ"],
      n = num("identity-view"),
      d = trigDrawing(620, 570),
      f = d.frame(
        130,
        45,
        360,
        360,
        kind === "circle" ? -0.75 : -1.25 * n,
        kind === "circle" ? 1.75 : 2.25 * n,
        kind === "circle" ? -1.15 : -1.25 * n,
        kind === "circle" ? 1.35 : 2.25 * n,
        kind === "circle"
          ? "斜边与单位正方形固定"
          : "单位边固定，改变另外两条边",
        false,
      );
    if (kind === "circle") {
      const geometry = Trig.unitIdentityGeometry(theta);
      f.path(geometry.cosSquare, purple, 2, "", "#ede7fa");
      f.path(geometry.sinSquare, orange, 2, "", "#fff0df");
      f.path(geometry.unitSquare, teal, 2, "", "#e0f4ee");
      f.path(geometry.triangle, "#42536b", 2.5);
      const center = (points) =>
        [0, 1].map(
          (axis) => points.slice(0, 4).reduce((sum, p) => sum + p[axis], 0) / 4,
        );
      const [cx, cy] = center(geometry.cosSquare),
        [sx, sy] = center(geometry.sinSquare);
      d.text(f.X(cx), f.Y(cy) + 5, "cos² θ", purple, 17, "middle");
      d.text(f.X(sx), f.Y(sy) + 5, "sin² θ", orange, 17, "middle");
      d.text(f.X(0.5), f.Y(-0.5), "1（固定）", teal, 20, "middle");
      f.point(...geometry.pivot, purple);
      f.path(
        Array.from({ length: 25 }, (_, i) => [
          0.15 * Math.cos((theta * i) / 24),
          0.15 * Math.sin((theta * i) / 24),
        ]),
        purple,
        1.5,
      );
      f.label(
        0.23 * Math.cos(theta / 2),
        0.23 * Math.sin(theta / 2),
        "θ",
        purple,
        15,
      );
      // The right angle follows the moving vertex on the fixed-diameter semicircle.
      const p = geometry.pivot,
        u = [-v.cos, -v.sin],
        w = [v.sin, -v.cos],
        r = 0.045;
      f.path(
        [
          [p[0] + r * u[0], p[1] + r * u[1]],
          [p[0] + r * (u[0] + w[0]), p[1] + r * (u[1] + w[1])],
          [p[0] + r * w[0], p[1] + r * w[1]],
        ],
        "#768294",
        1.2,
      );
    } else {
      f.path(
        [
          [0, 0],
          [a, 0],
          [a, b],
          [0, 0],
        ],
        "#42536b",
        2,
      );
      f.path(
        [
          [0, 0],
          [0, -a],
          [a, -a],
          [a, 0],
          [0, 0],
        ],
        purple,
        2,
        "",
        "#ede7fa",
      );
      f.path(
        [
          [a, 0],
          [a + b, 0],
          [a + b, b],
          [a, b],
          [a, 0],
        ],
        orange,
        2,
        "",
        "#fff0df",
      );
      f.path(
        [
          [0, 0],
          [-b, a],
          [a - b, a + b],
          [a, b],
          [0, 0],
        ],
        teal,
        2,
        "",
        "#e0f4ee",
      );
      const squareName = (name) =>
        name === "1" ? "1" : name.replace(" θ", "² θ");
      f.label(a * 0.2, -a * 0.4, squareName(names[0]), purple, 17);
      f.label(a + b * 0.12, b * 0.48, squareName(names[1]), orange, 17);
      f.label((a - b) * 0.45, (a + b) * 0.6, squareName(names[2]), teal, 17);
    }
    const total = h * h,
      left = ((a * a) / total) * 500,
      squaredNames = names.map((name) =>
        name === "1" ? "1" : name.replace(" θ", "² θ"),
      );
    d.text(
      60,
      444,
      `${squaredNames[0]} + ${squaredNames[1]} = ${squaredNames[2]}`,
      "#38415b",
      19,
    );
    d.raw(
      `<rect x="60" y="462" width="${left}" height="30" fill="${purple}"/><rect x="${60 + left}" y="462" width="${500 - left}" height="30" fill="${orange}"/><rect x="60" y="506" width="500" height="12" fill="${teal}"/>`,
    );
    d.text(
      60,
      550,
      `${fmt(a * a)} + ${fmt(b * b)} = ${fmt(total)}`,
      "#526273",
      18,
    );
    d.finish();
    values(`${fmt(a * a)} + ${fmt(b * b)}`, `总面积 = ${fmt(total)}。`);
    const formula =
      kind === "circle"
        ? "sin² θ + cos² θ = 1"
        : kind === "sec"
          ? "1 + tan² θ = sec² θ"
          : "1 + cot² θ = csc² θ";
    trigConclusion(
      formula,
      kind === "circle"
        ? "斜边长度始终为 1；青色正方形的位置、方向和面积保持不变。sin、cos 对应的两条直角边随 θ 改变。"
        : kind === "sec"
          ? "由 sin² θ+cos² θ=1 两边除以 cos² θ 得到。"
          : "由 sin² θ+cos² θ=1 两边除以 sin² θ 得到。",
      kind === "circle"
        ? "固定坐标比例：紫色 cos² θ 与橙色 sin² θ 的面积之和始终为 1。"
        : "单位边与坐标比例固定；用视野大小查看较大的正方形。下方面积条按总面积归一化。",
      ["边", "长度", "正方形面积"],
      [
        [names[0], a, a * a],
        [names[1], b, b * b],
        [names[2], h, h * h],
      ],
    );
    trigMetrics(
      `<section class="trig-story"><h2>三组关系连起来</h2><div class="trig-equation-row"><span>sin² θ + cos² θ = 1</span><span>1 + tan² θ = sec² θ</span><span>1 + cot² θ = csc² θ</span></div></section>`,
    );
  });
}
function trigInverse() {
  trigSetup(
    trigSelect() +
      select("inverse-branch", "选取分支", [
        ["positive", "正值分支"],
        ["negative", "负值分支"],
      ]) +
      range("theta", "原函数的角 θ（度）", 30, -180, 180, 1),
    ["紫：选定区间的原函数", "橙：交换坐标得到反函数", "青虚线：对称轴 y=x"],
    [
      "移动原函数上的 P 点，观察反函数上的 P′。",
      "把 P 的横纵坐标交换，读出返回的角度。",
      "依次选择六种函数，比较反函数的输入范围与输出角范围。",
    ],
    "为什么选定一段原函数后，可以从函数值找到唯一的角？",
    "所选区间让每个函数值只对应一个角。原函数点 (θ,u) 变成反函数点 (u,θ)，两个图像关于 y=x 对称。输入范围和输出范围也随之交换。",
  );
  const adjust = () => {
    const key = $("#trig-kind").value,
      split = key === "sec" || key === "csc",
      field = $("#inverse-branch").closest(".field");
    field.hidden = !split;
    $("#inverse-branch").disabled = !split;
    const [lo, hi, start] = Trig.angleBounds(
        key,
        $("#inverse-branch").value === "negative",
      ),
      input = $("#theta"),
      previous = +input.value;
    input.min = lo;
    input.max = hi;
    if (previous < lo || previous > hi) input.value = start;
    const ends = input.closest(".field").querySelectorAll(".range-ends span");
    ends[0].textContent = lo;
    ends[1].textContent = hi;
  };
  $("#trig-kind").addEventListener("change", adjust);
  $("#inverse-branch").addEventListener("change", adjust);
  adjust();
  trigBind(() => {
    const key = $("#trig-kind").value,
      m = trigInfo[key],
      theta = Trig.rad(num("theta")),
      u = Trig.value(key, theta),
      back = Trig.inverse(key, u),
      edge = Math.max(3.5, Math.abs(u) * 1.18),
      d = trigDrawing(620, 570),
      f = d.frame(78, 42, 465, 465, -edge, edge, -edge, edge);
    f.line([-edge, -edge], [edge, edge], teal, "5 5", 1.5);
    Trig.principalSegments(key).forEach(([a, b]) => {
      const rows = trigSeries((x) => Trig.value(key, x), a, b, 500);
      f.path(rows, purple, 3);
      f.path(
        rows.map(([x, y]) => [y, x]),
        orange,
        3,
      );
    });
    f.line([theta, u], [u, theta], "#afbac7", "3 4");
    f.point(theta, u, purple, false, "P");
    f.point(u, theta, orange, false, "P′");
    d.text(
      65,
      548,
      `(${fmt(theta)}, ${fmt(u)}) ↔ (${fmt(u)}, ${fmt(back)})`,
      "#526273",
      18,
    );
    d.finish();
    values(
      `${m.inverse}(${fmt(u)}) = ${fmt(back)}`,
      `返回角 ${fmt(Trig.deg(back))}°；输出角范围 ${m.iRange}。`,
    );
    trigConclusion(
      `${m.inverse}(${key} θ) = θ（θ 取所示主值区间）`,
      `输入范围：${m.iDomain}；输出角范围：${m.iRange}。`,
      "横纵轴均使用数值坐标；反函数输出的角以弧度计。P 与 P′ 关于 y=x 对称。",
      ["函数", "θ（度）", "θ（弧度）", "u", "反函数(u)（弧度）"],
      [[key, num("theta"), theta, u, back]],
    );
    trigMetrics(
      trigReference(true) +
        `<section class="trig-story"><h2>反函数之间的关系</h2><div class="trig-equation-row"><span>arcsin u + arccos u = π/2<br><small>−1 ≤ u ≤ 1</small></span><span>arctan u + arccot u = π/2<br><small>u ∈ ℝ</small></span><span>arcsec u = arccos(1/u)<br>arccsc u = arcsin(1/u)<br><small>|u| ≥ 1</small></span></div></section>`,
    );
  });
}
function trigCompose() {
  trigSetup(
    trigSelect() + range("theta", "输入角 θ（度）", 150, -540, 540, 1),
    ["紫：输入角 θ", "橙：反函数返回的主值角", "灰虚线：y=θ"],
    [
      "先用 sin，把 θ 从 0° 拖到 180°。",
      "比较 θ 与 arcsin(sin θ) 的变化。",
      "切换函数，观察每种主值区间如何把不同的角对应起来。",
    ],
    "sin 30° 与 sin 150° 相等时，arcsin 会返回哪个角？",
    "arcsin 的输出区间是 [−90°,90°]，所以二者都返回 30°。同样地，其他反函数也按各自的主值区间返回角度。图中的橙色曲线把这个对应过程完整画出来。",
  );
  trigBind(() => {
    const key = $("#trig-kind").value,
      m = trigInfo[key],
      theta = Trig.rad(num("theta")),
      v = Trig.value(key, theta),
      back = Trig.inverse(key, v),
      lo = -3 * Math.PI,
      hi = 3 * Math.PI,
      d = trigDrawing(670, 510),
      f = d.frame(65, 40, 550, 380, lo, hi, -3.6, 3.6);
    f.line([lo, lo], [hi, hi], "#a5afbd", "5 5");
    Trig.branches(key, lo, hi, 900).forEach((rows) =>
      f.path(
        rows.map(([x, y]) => [x, Trig.inverse(key, y)]),
        orange,
        3,
      ),
    );
    if (key === "sec" || key === "csc")
      Trig.poles(key, lo, hi).forEach((x) =>
        f.point(x, key === "sec" ? Math.PI / 2 : 0, orange, true),
      );
    f.line([theta, -3.6], [theta, 3.6], purple, "3 4");
    f.point(theta, back, orange);
    d.text(
      65,
      463,
      `输入 ${num("theta")}° → ${key} → ${fmt(v)} → ${m.inverse} → ${Number.isFinite(back) ? fmt(Trig.deg(back)) + "°" : "未定义"}`,
      "#526273",
      18,
    );
    d.finish();
    values(
      Number.isFinite(back)
        ? `${num("theta")}° → ${fmt(Trig.deg(back))}°`
        : "该角处函数未定义",
      `主值范围：${m.iRange}。`,
    );
    trigConclusion(
      `θ → ${key} θ → ${m.inverse}(${key} θ)`,
      `返回角落在 ${m.iRange} 内；图中横纵坐标以弧度计。`,
      "横轴：原角度 θ；纵轴：返回的主值角。",
      ["原角（度）", "函数值", "返回角（度）"],
      [
        -360,
        -180,
        -90,
        -60,
        -30,
        0,
        30,
        60,
        90,
        120,
        150,
        180,
        270,
        360,
        num("theta"),
      ].map((x) => {
        const a = Trig.value(key, Trig.rad(x)),
          b = Trig.inverse(key, a);
        return [x, trigTableValue(a), trigTableValue(Trig.deg(b))];
      }),
    );
    trigMetrics(
      `<section class="trig-story"><h2>把角度放回指定区间</h2><p class="trig-equation">${m.inverse}：${m.iDomain} → ${m.iRange}</p><p>横轴可以跨越多个周期，返回角始终落在这一输出区间中。每个点都可以从下方数值表读出。</p></section>`,
    );
  });
}
function trigCalculus() {
  trigSetup(
    trigSelect() +
      select("derivative-family", "观察对象", [
        ["forward", "三角函数"],
        ["inverse", "反三角函数"],
      ]) +
      range("trig-point", "取点 x", 0.5, -4, 4, 0.05),
    ["紫：函数曲线", "橙：当前点的切线", "青：导函数曲线"],
    [
      "沿函数曲线移动取点，比较切线斜率。",
      "把斜率对应到右图的导函数高度。",
      "选择反三角函数，查看相应的导数关系。",
    ],
    "函数在某处上升或下降，怎样从导数图像看出来？",
    "导数为正时切线向右上升，为负时向右下降；导数绝对值越大，切线越陡。sin 的导数是 cos，cos 的导数是 −sin；其余四种由比值和乘积的求导规则得到。",
  );
  const adjust = () => {
    const k = $("#trig-kind").value,
      inv = $("#derivative-family").value === "inverse",
      e = $("#trig-point"),
      previous = +e.value;
    e.min = inv && (k === "sin" || k === "cos") ? -1 : -4;
    e.max = inv && (k === "sin" || k === "cos") ? 1 : 4;
    if (previous < +e.min || previous > +e.max) e.value = 0.5;
    if (inv && ["sec", "csc"].includes(k) && Math.abs(+e.value) < 1)
      e.value = 2;
    const ends = e.closest(".field").querySelectorAll(".range-ends span");
    ends[0].textContent = e.min;
    ends[1].textContent = e.max;
  };
  $("#trig-kind").addEventListener("change", adjust);
  $("#derivative-family").addEventListener("change", adjust);
  adjust();
  trigBind(() => {
    const k = $("#trig-kind").value,
      inv = $("#derivative-family").value === "inverse",
      m = trigInfo[k],
      a = num("trig-point"),
      f = (x) => (inv ? Trig.inverse(k, x) : Trig.value(k, x)),
      df = (x) => Trig.derivative(k, x, inv),
      v = f(a),
      slope = df(a),
      stack = $("#plot").clientWidth < 520,
      d = trigDrawing(stack ? 420 : 820, stack ? 600 : 320),
      p = d.frame(
        48,
        42,
        335,
        215,
        -4,
        4,
        -4,
        4,
        inv ? m.inverse + " x" : k + " x",
      ),
      q = d.frame(
        stack ? 48 : 448,
        stack ? 342 : 42,
        335,
        215,
        -4,
        4,
        -4,
        4,
        "导函数：切线的斜率",
      );
    let intervals;
    if (inv)
      intervals = ["sin", "cos"].includes(k)
        ? [[-1, 1]]
        : ["sec", "csc"].includes(k)
          ? [
              [-4, -1],
              [1, 4],
            ]
          : [[-4, 4]];
    else
      intervals = Trig.branches(k, -4, 4).map((rows) => [
        rows[0][0],
        rows.at(-1)[0],
      ]);
    for (const [lo, hi] of intervals) {
      p.path(trigSeries(f, lo, hi), purple, 2.8);
      q.path(trigSeries(df, lo, hi), teal, 2.8);
    }
    p.point(a, v, purple);
    q.point(a, slope, teal);
    if (Number.isFinite(v) && Number.isFinite(slope))
      p.line(
        [-4, v + slope * (-4 - a)],
        [4, v + slope * (4 - a)],
        orange,
        "",
        2,
      );
    else if (inv && Math.abs(a) === 1 && Number.isFinite(v))
      p.line([a, -4], [a, 4], orange, "", 2);
    d.finish();
    values(
      Number.isFinite(slope)
        ? `斜率 = ${fmt(slope)}`
        : Number.isFinite(v)
          ? "此处为竖直切线"
          : "此处函数未定义",
      `${inv ? m.inverse : k}(${fmt(a)}) = ${fmt(v)}。`,
    );
    const formula = `d(${inv ? m.inverse : k} x)/dx = ${inv ? m.iDerivative : m.derivative}`;
    trigConclusion(
      formula,
      "三角函数及反函数的导数公式均以弧度为角度单位。",
      `${stack ? "上" : "左"}图显示函数与切线；${stack ? "下" : "右"}图显示同一横坐标处的导数。`,
      ["x", "函数值", "导数"],
      [-2, -1, -0.5, 0, 0.5, 1, 2, a].map((x) => [
        x,
        trigTableValue(f(x)),
        trigTableValue(df(x)),
      ]),
    );
    trigMetrics(
      `<section class="trig-reference"><h2>${inv ? "反三角函数" : "三角函数"}求导关系</h2><div class="trig-derivatives">${Trig.keys.map((key) => `<div><strong>${inv ? trigInfo[key].inverse : key} x</strong><span>→</span><span>${inv ? trigInfo[key].iDerivative : trigInfo[key].derivative}</span></div>`).join("")}</div></section>`,
    );
  });
}
