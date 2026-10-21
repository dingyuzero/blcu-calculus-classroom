"use strict";
// Chapter routes are also the inventory used by the home page and handoff.
const chapterModules = {
  function: [
    { id: "main", title: "自由函数绘图" },
    { id: "transform", title: "平移与伸缩", render: transformLab },
    { id: "inverse", title: "反函数与定义域", render: inverseLab },
  ],
  limit: [
    { id: "main", title: "左右逼近与连续" },
    { id: "epsilon", title: "ε–δ 邻域挑战", render: epsilonLab },
    { id: "sequence", title: "数列的收敛", render: sequenceLab },
  ],
  derivative: [
    { id: "main", title: "割线与切线" },
    { id: "graph", title: "导函数与单调性", render: derivativeGraphLab },
    { id: "newton", title: "牛顿迭代求根", render: newtonLab },
  ],
  integral: [
    { id: "main", title: "黎曼和与面积" },
    { id: "accumulation", title: "变上限积分", render: accumulationLab },
    { id: "quadrature", title: "三种数值积分", render: quadratureLab },
  ],
  taylor: [
    { id: "main", title: "多项式逐阶逼近" },
    { id: "error", title: "误差与余项界", render: taylorErrorLab },
    { id: "geometric", title: "几何级数与收敛", render: geometricLab },
  ],
  psych: [
    { id: "main", title: "学习曲线与正态分布" },
    { id: "forgetting", title: "遗忘与复习模型", render: forgettingLab },
    { id: "logistic", title: "心理测量曲线", render: logisticLab },
  ],
};
const extraF = {
  square: (x) => x * x,
  linear: (x) => x,
  sin: Math.sin,
  exp: Math.exp,
};
const integralOptions = [
  ["sin", "sin(x)"],
  ["square", "x²"],
  ["linear", "x"],
  ["exp", "eˣ"],
];
const taylorOptions = [
  ["sin", "sin(x)"],
  ["cos", "cos(x)"],
  ["exp", "eˣ"],
  ["log", "ln(1+x)"],
];
function num(id) {
  return Number($("#" + id).value);
}
function extraBind(draw) {
  function update() {
    stopAnimation();
    for (const el of $$(".control-panel input, .control-panel select")) {
      const out = $("#" + el.id + "-value");
      if (out) out.textContent = el.value;
      if (!el.checkValidity()) {
        $("#error").textContent =
          "请填写控件范围内的有效参数。图形保留上一次有效结果。";
        return;
      }
    }
    try {
      draw();
      $("#error").textContent = "";
    } catch (e) {
      $("#error").textContent = e.message;
    }
  }
  for (const el of $$(".control-panel input, .control-panel select"))
    el.addEventListener(el.tagName === "SELECT" ? "change" : "input", update);
  renderPlot = update;
  update();
  return update;
}
function fitBox(lo, hi, ys) {
  const [top, bottom] = Calc.autoBounds([...ys, 0]);
  return [lo, top, hi, bottom];
}
function samples(f, lo, hi, n = 80) {
  return Array.from({ length: n + 1 }, (_, i) => f(lo + ((hi - lo) * i) / n));
}
function dots(rows, xcol, ycol, color = purple) {
  rows.forEach((r) => point(r[xcol], r[ycol], color).setAttribute({ size: 2 }));
}
function transformLab() {
  scaffold(
    "function",
    select("base-function", "基础函数", [
      ["sin", "sin(x)"],
      ["square", "x²"],
      ["abs", "|x|"],
      ["exp", "eˣ"],
    ]) +
      range("amplitude", "纵向系数 A", 1, -3, 3, 0.1) +
      range("frequency", "横向系数 B", 1, 0.25, 3, 0.05) +
      range("horizontal", "水平平移 h", 0, -3, 3, 0.1) +
      range("vertical", "竖直平移 k", 0, -3, 3, 0.1) +
      metric("变换后的 g(0)"),
    ["紫：变换后的 g", "橙：基础函数 f"],
    [
      "只改变 h，观察图像向哪边移动。",
      "将 A 改成负数，比较翻折前后的图像。",
      "增加 B，观察横向压缩，注意 B 在括号内部。",
    ],
    "f(x−h) 为什么向右平移 h？",
    "原图像中横坐标 u 的点，在新图像中满足 x−h=u，所以新横坐标为 u+h。B>1 则横向压缩为原来的 1/B。",
  );
  extraBind(() => {
    const k = $("#base-function").value,
      f = k === "abs" ? Math.abs : extraF[k],
      A = num("amplitude"),
      B = num("frequency"),
      h = num("horizontal"),
      v = num("vertical"),
      g = (x) => A * f(B * (x - h)) + v;
    // Fixed ordinate avoids one exponential edge flattening the whole classroom view.
    initBoard([-5, 8, 5, -5]);
    curve(g);
    curve(f, orange, 2);
    point(0, g(0));
    values(
      fmt(g(0)),
      `纵向 ×${fmt(A)}；横向 ×${fmt(1 / B)}；右移 ${fmt(h)}；上移 ${fmt(v)}`,
    );
    setMath(
      `g(x)=${fmt(A)} f(${fmt(B)}(x−${fmt(h)}))+${fmt(v)}`,
      "纵轴固定在 [−5,8]，超出画布的曲线仍可在数值表中检查。",
      String.raw`g(x)=A f\big(B(x-h)\big)+k`,
    );
    setDataTable(
      ["x", "f(x)", "g(x)"],
      [-2, -1, 0, 1, 2].map((x) => [x, f(x), g(x)]),
    );
  });
}
function inverseLab() {
  scaffold(
    "function",
    select("inverse-pair", "一对互为反函数的函数", [
      ["square", "x²（x≥0）与 √x"],
      ["exp", "eˣ 与 ln(x)"],
      ["ten", "10ˣ 与 log10(x)"],
      ["two", "2ˣ 与 log2(x)"],
    ]) +
      range("inverse-point", "原函数上的横坐标 a", 1, 0, 2, 0.02) +
      metric("对应点 (a, f(a))"),
    ["紫：原函数", "橙：反函数", "青虚线：y=x"],
    [
      "移动 a，观察两个点的横纵坐标互换。",
      "选择平方函数，注意这里限制了 x≥0。",
      "比较两个函数的定义域和值域。",
    ],
    "为什么 x² 在整个实数轴上没有反函数？",
    "正负两个数可能具有相同平方，不能从函数值唯一还原自变量。限制 x≥0 后，它与 √x 一一对应。",
  );
  extraBind(() => {
    const kind = $("#inverse-pair").value,
      a = num("inverse-point"),
      base = kind === "ten" ? 10 : kind === "two" ? 2 : Math.E;
    const f =
        kind === "square" ? (x) => (x >= 0 ? x * x : NaN) : (x) => base ** x,
      inv = kind === "square" ? Math.sqrt : (x) => CalcExtra.logBase(x, base),
      b = f(a),
      edge = Math.max(5, b + 1);
    initBoard([-1, edge, edge, -1]);
    curve(f);
    curve(inv, orange);
    line((x) => x, teal, 2);
    point(a, b, purple, false, "P");
    point(b, a, orange, false, "P′");
    segment([a, b], [b, a], teal);
    values(
      `(${fmt(a)}, ${fmt(b)})`,
      `交换后 (${fmt(b)}, ${fmt(a)})；反函数在 f(a) 处的值 = ${fmt(inv(b))}`,
    );
    setMath(
      "f⁻¹(f(a))=a",
      kind === "square"
        ? "两者的定义域、值域均为 [0,+∞)；平方函数已限制为非负自变量。"
        : "指数函数定义域为实数，值域为 (0,+∞)；对数函数交换这两个集合。",
      String.raw`(a,f(a))\longleftrightarrow(f(a),a)`,
    );
    setDataTable(
      ["a", "f(a)", "f⁻¹(f(a))"],
      [0, 0.5, 1, 1.5, a].map((x) => [x, f(x), inv(f(x))]),
    );
  });
}
function epsilonLab() {
  scaffold(
    "limit",
    range("eps-center", "靠近的位置 a", 1, -2, 2, 0.1) +
      range("epsilon", "允许的误差 ε", 0.5, 0.1, 2, 0.05) +
      number("delta", "横向邻域 δ", 0.3, 0.001, 1.5) +
      '<button class="button primary full" id="choose-delta">找到一个合适的 δ</button>' +
      metric("当前 δ 是否满足要求"),
    ["紫：f(x)=x²", "橙虚线：a±δ", "青虚线：a²±ε"],
    [
      "给定 ε，尝试缩小 δ，让邻域内的曲线落入横向误差带。",
      "把 a 从 0 移到 2，比较同样 ε 下所需的 δ。",
      "点击按钮，查看由不等式算出的 δ。",
    ],
    "找到一个 δ 后，比它更小的正数还可用吗？",
    "可以。缩小邻域不会加入新点。这里对 f(x)=x² 使用 |x²−a²|≤2|a||x−a|+|x−a|²，从而找到对整个邻域成立的界，判断不依赖屏幕采样。",
  );
  const update = extraBind(() => {
    const a = num("eps-center"),
      eps = num("epsilon"),
      delta = num("delta"),
      r = CalcExtra.epsilonDelta(a, eps, delta),
      L = a * a;
    initBoard([a - 2, Math.max(5, L + eps + 1), a + 2, -1]);
    curve((x) => x * x);
    line(() => L + eps, teal, 2);
    line(() => L - eps, teal, 2);
    segment([a - delta, -1], [a - delta, Math.max(5, L + eps + 1)], orange);
    segment([a + delta, -1], [a + delta, Math.max(5, L + eps + 1)], orange);
    point(a, L, purple, true, "L");
    values(
      r.valid ? "满足" : "尚不满足",
      `邻域边界最大偏差 = ${fmt(r.maxDeviation)}；可用 δ ≤ ${fmt(r.sufficient, 6)}`,
    );
    setMath(
      `0<|x−${fmt(a)}|<${fmt(delta)} ⇒ |x²−${fmt(L)}|<${fmt(eps)}`,
      "判断来自解析不等式。边界点 x=a±δ 不在开邻域内；中心 x=a 也不在极限条件内。",
      String.raw`0<|x-a|<\delta\;\Longrightarrow\;|x^2-a^2|<\varepsilon`,
    );
    setDataTable(
      ["δ", "边界最大偏差", "满足要求"],
      [delta / 2, delta, Math.min(1.5, delta * 2)].map((d) => {
        const s = CalcExtra.epsilonDelta(a, eps, d);
        return [d, s.maxDeviation, s.valid ? "是" : "否"];
      }),
    );
  });
  $("#choose-delta").onclick = () => {
    const d = CalcExtra.epsilonDelta(
      num("eps-center"),
      num("epsilon"),
      0.1,
    ).sufficient;
    $("#delta").value = Math.floor(d * 100000) / 100000;
    update();
    saveControls();
  };
}
function sequenceLab() {
  scaffold(
    "limit",
    select("sequence-kind", "选择数列", [
      ["reciprocal", "1/n"],
      ["alternating", "(−1)ⁿ/n"],
      ["oscillating", "(−1)ⁿ"],
      ["euler", "(1+1/n)ⁿ"],
    ]) +
      range("sequence-count", "观察到第 N 项", 30, 2, 100, 1) +
      range("sequence-epsilon", "极限附近 ε 带", 0.15, 0.01, 1, 0.01) +
      metric("最后一项 aₙ"),
    ["紫：离散数列点", "橙：极限（存在时）", "青虚线：L±ε"],
    [
      "比较 (−1)ⁿ/n 和 (−1)ⁿ，区分振荡与不收敛。",
      "增加 N，观察后面的项是否全部进入 ε 带。",
      "收窄 ε 带，再增加 N。",
    ],
    "有振荡的数列一定不收敛吗？",
    "不一定。(−1)ⁿ/n 虽然交替正负，绝对值仍趋于 0；(−1)ⁿ 则在 −1 和 1 之间跳动。前有限项的图形不能单独证明无限数列的结论。",
  );
  extraBind(() => {
    const kind = $("#sequence-kind").value,
      n = num("sequence-count"),
      eps = num("sequence-epsilon"),
      L = kind === "euler" ? Math.E : 0,
      converges = kind !== "oscillating",
      rows = Array.from({ length: n }, (_, i) => [
        i + 1,
        CalcExtra.sequence(kind, i + 1),
      ]);
    initBoard([
      -0.5,
      kind === "euler" ? 3.9 : 1.5,
      n + 2,
      kind === "euler" ? -0.3 : -1.5,
    ]);
    dots(rows, 0, 1);
    if (converges) {
      line(() => L, orange);
      line(() => L + eps, teal, 2);
      line(() => L - eps, teal, 2);
    }
    values(
      fmt(rows.at(-1)[1], 6),
      converges
        ? `极限 L=${fmt(L, 6)}；末项误差=${fmt(Math.abs(rows.at(-1)[1] - L), 6)}`
        : "数列不收敛：奇数项 −1，偶数项 1",
    );
    setMath(
      converges ? `aₙ → ${kind === "euler" ? "e" : "0"}` : "(−1)ⁿ 没有极限",
      kind === "reciprocal" || kind === "alternating"
        ? `当 n≥${Math.floor(1 / eps) + 1} 时，1/n<ε，由此保证后面的所有项都落在误差带内。`
        : "数列使用离散点表示；观察有限项，并联系课程中的收敛论证。",
    );
    setDataTable(
      ["n", "aₙ", "|aₙ−L|"],
      rows.map((r) => [...r, converges ? Math.abs(r[1] - L) : "不存在 L"]),
    );
  });
}
function derivativeGraphLab() {
  scaffold(
    "derivative",
    select("graph-kind", "函数", [
      ["cubic", "x³−3x"],
      ["sin", "sin(x)"],
      ["square", "x²"],
      ["exp", "eˣ"],
    ]) +
      range("graph-point", "观察位置 a", 0.5, -2.5, 2.5, 0.05) +
      metric("导数 f′(a)"),
    ["紫：f(x)", "橙：f′(x)", "青虚线：切线"],
    [
      "导函数在横轴上方时，原函数怎样变化？",
      "移动到 f′=0 的位置，检查左右两侧导数符号。",
      "比较函数值为零与导数为零的点。",
    ],
    "f′(a)=0 是否就是函数的零点？",
    "不是。f(a)=0 描述函数经过横轴；f′(a)=0 描述水平切线。驻点是否为极值点，还需检查邻域变化，单凭导数等于零不能判断。",
  );
  extraBind(() => {
    const kind = $("#graph-kind").value,
      a = num("graph-point"),
      { f, d, critical } = CalcExtra.models[kind];
    initBoard([-3, 12, 3, -6]);
    curve(f);
    curve(d, orange);
    line((x) => f(a) + d(a) * (x - a), teal, 2);
    point(a, f(a));
    point(a, d(a), orange);
    critical.forEach((x) => point(x, 0, orange, true));
    values(
      fmt(d(a)),
      d(a) > 1e-10
        ? "该点导数为正，附近呈上升趋势。"
        : d(a) < -1e-10
          ? "该点导数为负，附近呈下降趋势。"
          : "该点导数为零，请比较两侧符号。",
    );
    setMath(
      `f(${fmt(a)})=${fmt(f(a))}；f′(${fmt(a)})=${fmt(d(a))}`,
      "导函数使用解析公式。纵轴固定，超出范围的数值可在表中查看。",
      String.raw`y=f(a)+f'(a)(x-a)`,
    );
    setDataTable(
      ["x", "f(x)", "f′(x)"],
      [-2, -1, 0, 1, 2, a].map((x) => [x, f(x), d(x)]),
    );
  });
}
function newtonLab() {
  scaffold(
    "derivative",
    select("root-kind", "待求根的方程 f(x)=0", [
      ["square", "x²−2=0"],
      ["cubic", "x³−x−2=0"],
      ["cosine", "cos(x)−x=0"],
      ["cycle", "x³−2x+2=0 · 循环示例"],
    ]) +
      number("root-start", "起点 x₀", 1, -3, 3) +
      range("root-steps", "最多迭代步数", 3, 0, 8, 1) +
      '<button class="button primary full" id="next-root">再迭代一步</button>' +
      metric("当前近似根"),
    ["紫：f(x)", "橙虚线：切线落到横轴", "青：迭代点"],
    [
      "从 x₀=1 求 √2，每次增加一步。",
      "把 x₀ 改成 0，观察导数为零的提示。",
      "选择循环示例并令 x₀=0，观察 0→1→0。",
    ],
    "迭代次数更多，是否一定更接近根？",
    "不一定。牛顿法依赖函数与初值，可能遇到水平切线、循环或发散。这里报告残差 |f(xₙ)|，它不是未经条件保证的根位置误差。",
  );
  const update = extraBind(() => {
    const kind = $("#root-kind").value,
      r = CalcExtra.newton(kind, num("root-start"), num("root-steps")),
      { f } = CalcExtra.roots[kind],
      last = r.rows.at(-1);
    initBoard([-3.5, 7, 3.5, -7]);
    curve(f);
    r.rows.slice(-5).forEach((p, i, rs) => {
      point(p.x, p.y, teal);
      const next = rs[i + 1];
      if (next) {
        segment([p.x, p.y], [next.x, 0], orange);
        segment([next.x, 0], [next.x, next.y], teal);
      }
    });
    values(fmt(last.x, 9), `残差 ${fmt(Math.abs(last.y), 8)}；${r.status}`);
    setMath(
      `xₙ₊₁=xₙ−f(xₙ)/f′(xₙ)`,
      "画布固定在 x∈[−3.5,3.5]，只显示最近 4 条迭代切线；完整迭代见数值表。",
      String.raw`x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}`,
    );
    setDataTable(
      ["步数 n", "xₙ", "f(xₙ)", "|f(xₙ)|"],
      r.rows.map((p) => [p.step, p.x, p.y, Math.abs(p.y)]),
    );
    $("#next-root").disabled =
      num("root-steps") >= 8 || r.status !== "已完成指定步数";
  });
  $("#next-root").onclick = () => {
    $("#root-steps").value = Math.min(8, num("root-steps") + 1);
    update();
    saveControls();
  };
}
function accumulationLab() {
  scaffold(
    "integral",
    select("acc-kind", "被积函数 f(t)", integralOptions) +
      range("acc-base", "固定下限 a", 0, -2, 2, 0.1) +
      range("acc-end", "变化的上限 x", 1, -3, 3, 0.05) +
      metric("累积量 F(x)"),
    ["紫：f(x)", "橙：F(x)", "青虚线：F 的切线"],
    [
      "从 a 出发移动上限，观察累积量的增加与减少。",
      "令 x<a，比较有向积分与涂色区域。",
      "观察 F 的切线斜率是否等于 f(x)。",
    ],
    "f(x)>0 时，累积函数 F(x) 会不会下降？",
    "对这里连续的 f，F′(x)=f(x)，所以 f 为正的区间上 F 随 x 增加而上升。F 本身可以是负数；函数值的正负与变化率的正负不同。",
  );
  extraBind(() => {
    const kind = $("#acc-kind").value,
      a = num("acc-base"),
      x = num("acc-end"),
      f = extraF[kind],
      F = (t) => Calc.definiteIntegral(kind, a, t);
    initBoard(fitBox(-3.4, 3.4, [...samples(f, -3, 3), ...samples(F, -3, 3)]));
    if (x !== a) area(f, Math.min(a, x), Math.max(a, x), teal);
    curve(f);
    curve(F, orange);
    line((t) => F(x) + f(x) * (t - x), teal, 2);
    point(x, F(x), orange);
    values(
      fmt(F(x), 6),
      `F′(${fmt(x)})=f(${fmt(x)})=${fmt(f(x), 6)}；${x < a ? "上限小于下限，积分方向反转" : "从 a 向 x 累积"}`,
    );
    setMath(
      `F(x)=∫[${fmt(a)},x] f(t)dt；F′(x)=f(x)`,
      "涂色仅标示积分所在区间，正负由函数值和积分方向共同决定。下限固定时，连续被积函数满足微积分基本定理。",
      String.raw`F(x)=\int_a^x f(t)\,dt,\quad F'(x)=f(x)`,
    );
    setDataTable(
      ["上限 x", "累积 F(x)", "导数 F′(x)=f(x)"],
      [-3, -2, -1, 0, 1, 2, 3, x].map((t) => [t, F(t), f(t)]),
    );
  });
}
function quadratureLab() {
  scaffold(
    "integral",
    select("quad-kind", "被积函数", integralOptions) +
      `<div class="paired-fields">${number("quad-a", "下限 a", 0, -3, 3)}${number("quad-b", "上限 b", 2, -3, 3)}</div>` +
      range("quad-n", "分割数 n（偶数）", 4, 2, 40, 2) +
      select("quad-method", "画布显示的方法", [
        ["mid", "中点矩形法"],
        ["trapezoid", "梯形法"],
        ["simpson", "Simpson 抛物线法"],
      ]) +
      metric("所选方法的近似积分"),
    ["紫：原函数", "橙：所选近似", "表中同时比较三种方法"],
    [
      "选择 x²，观察 Simpson 法即使分割较少也很准确。",
      "改为 eˣ 并增加分割，比较三种误差。",
      "选择 x，在 [−2,2] 上比较有向积分。",
    ],
    "Simpson 法为什么使用偶数个小区间？",
    "每两个小区间取三个节点，以一段二次插值抛物线代替原函数。复合规则要求小区间数为偶数；它对三次及以下多项式的积分是精确的（忽略浮点误差）。",
  );
  extraBind(() => {
    const kind = $("#quad-kind").value,
      a = num("quad-a"),
      b = num("quad-b"),
      n = num("quad-n"),
      method = $("#quad-method").value,
      f = extraF[kind];
    if (a >= b) throw Error("下限 a 必须小于上限 b。图形保留上一次结果。");
    const exact = Calc.definiteIntegral(kind, a, b),
      methods = ["mid", "trapezoid", "simpson"],
      results = methods.map((m) => CalcExtra.integrateRule(f, a, b, n, m)),
      h = (b - a) / n;
    initBoard(fitBox(a - 0.15 * (b - a), b + 0.15 * (b - a), samples(f, a, b)));
    if (method === "mid") {
      const rects = Array.from({ length: n }, (_, i) => ({
        left: a + i * h,
        right: a + (i + 1) * h,
        y: f(a + (i + 0.5) * h),
      }));
      rectanglePaths(rects, true);
      rectanglePaths(rects, false);
    } else if (method === "trapezoid") {
      for (let i = 0; i < n; i++) {
        const l = a + i * h,
          r = l + h;
        area((x) => f(l) + ((x - l) / h) * (f(r) - f(l)), l, r, orange);
        segment([l, f(l)], [r, f(r)], orange, 0);
      }
    } else {
      for (let i = 0; i < n; i += 2) {
        const l = a + i * h,
          m = l + h,
          r = l + 2 * h,
          fl = f(l),
          fm = f(m),
          fr = f(r),
          p = (x) =>
            (fl * (x - m) * (x - r)) / (2 * h * h) -
            (fm * (x - l) * (x - r)) / (h * h) +
            (fr * (x - l) * (x - m)) / (2 * h * h);
        area(p, l, r, orange);
        scene.data(
          Array.from({ length: 21 }, (_, j) => l + (2 * h * j) / 20),
          Array.from({ length: 21 }, (_, j) => p(l + (2 * h * j) / 20)),
          { strokeColor: orange, strokeWidth: 2, dash: 2, fillColor: "none" },
        );
      }
    }
    curve(f);
    const value = results[methods.indexOf(method)];
    values(
      fmt(value, 8),
      `解析积分 ${fmt(exact, 8)}；绝对误差 ${fmt(Math.abs(value - exact), 8)}`,
    );
    setMath(
      `I≈${fmt(value, 8)}；误差=${fmt(Math.abs(value - exact), 8)}`,
      "表格的误差由解析积分计算；浮点舍入可能产生很小的非零误差。",
      method === "simpson"
        ? String.raw`S_n=\frac h3\left[f(a)+4\sum_{i\;\mathrm{odd}}f(a+ih)+2\sum_{\substack{i\;\mathrm{even}\\0<i<n}}f(a+ih)+f(b)\right]`
        : method === "trapezoid"
          ? String.raw`T_n=h\left[\frac{f(a)+f(b)}2+\sum_{i=1}^{n-1}f(a+ih)\right]`
          : String.raw`M_n=h\sum_{i=0}^{n-1}f\left(a+(i+\tfrac12)h\right)`,
    );
    setDataTable(
      ["方法", "近似积分", "绝对误差"],
      results.map((v, i) => [
        ["中点矩形", "梯形", "Simpson"][i],
        v,
        Math.abs(v - exact),
      ]),
    );
  });
}
function taylorErrorLab() {
  scaffold(
    "taylor",
    select("error-kind", "被近似的函数", taylorOptions) +
      range("error-center", "展开中心 a", 0, -0.5, 1, 0.05) +
      range("error-order", "多项式阶数 n", 3, 0, 12, 1) +
      range("error-probe", "检验位置 x", 0.8, -0.8, 2, 0.05) +
      metric("检验点的绝对误差"),
    ["紫：实际误差 f−Tₙ", "橙虚线：±余项上界", "实心点：当前检验位置"],
    [
      "固定检验点，增加阶数，比较实际误差和误差上界。",
      "把检验点向展开中心靠近，观察误差。",
      "选择 ln(1+x)，比较 x=0.5 与 x=2。",
    ],
    "误差上界很大，是否说明实际误差也很大？",
    "不一定。上界是保证误差不会超过的估计，可以很保守。这里对连接 a 与 x 的闭区间取高阶导数上界，不把渐近趋势或小的屏幕误差当作收敛证明。",
  );
  extraBind(() => {
    const kind = $("#error-kind").value,
      a = num("error-center"),
      n = num("error-order"),
      x = num("error-probe"),
      c = Calc.taylorCoefficients(kind, a, n),
      err = (t) => Calc.taylorOriginal(kind, t) - Calc.polynomial(c, a, t),
      bound = CalcExtra.taylorBound(kind, a, n, x),
      lo = Math.min(a, x) - 0.1,
      hi = Math.max(a, x) + 0.1;
    const safeLo = kind === "log" ? Math.max(-0.95, lo) : lo;
    initBoard(
      fitBox(safeLo, hi, [...samples(err, safeLo, hi), bound, -bound, 1e-8]),
    );
    curve(err);
    line(() => bound, orange, 2);
    line(() => -bound, orange, 2);
    point(x, err(x));
    values(
      fmt(Math.abs(err(x)), 8),
      `保证上界 ${fmt(bound, 8)}；误差/上界 ${bound ? fmt(Math.abs(err(x)) / bound) : "0（中心处）"}`,
    );
    setMath(
      `|Rₙ(${fmt(x)})|≤${fmt(bound, 8)}`,
      "虚线为当前检验点的误差界，并非画布上所有横坐标的统一界。阶数较高、误差很小时，计算受浮点舍入限制。",
      String.raw`|R_n(x)|\le\frac{M|x-a|^{n+1}}{(n+1)!},\quad M\ge\max_{t\;\mathrm{between}\;a,x}|f^{(n+1)}(t)|`,
    );
    setDataTable(
      ["阶数", "检验点实际误差绝对值", "Lagrange 上界"],
      Array.from({ length: n + 1 }, (_, j) => [
        j,
        Math.abs(
          Calc.taylorOriginal(kind, x) -
            Calc.polynomial(Calc.taylorCoefficients(kind, a, j), a, x),
        ),
        CalcExtra.taylorBound(kind, a, j, x),
      ]),
    );
  });
}
function geometricLab() {
  scaffold(
    "taylor",
    range("series-q", "公比 q", 0.5, -1.5, 1.5, 0.05) +
      range("series-n", "最高幂 n（共 n+1 项）", 12, 0, 30, 1) +
      metric("部分和 Sₙ"),
    ["紫：部分和 Sₖ", "橙：无穷和（存在时）"],
    [
      "在 |q|<1 时增加 n，观察部分和逼近无穷和。",
      "将 q 设为 −0.8，观察振荡式逼近。",
      "分别试 q=1、q=−1、q=1.2，讨论端点与发散。",
    ],
    "1/(1−q) 什么时候才等于无穷级数？",
    "只有 |q|<1 时，几何级数的无穷和才等于 1/(1−q)。在 q=−1 等点，即使这个分式有值，也不能据此声称对应的无穷级数收敛。",
  );
  extraBind(() => {
    const q = num("series-q"),
      n = num("series-n"),
      r = CalcExtra.geometricSeries(q, n);
    initBoard(
      fitBox(-0.5, Math.max(3, n + 1), [
        ...r.rows.map((t) => t[2]),
        ...(r.converges ? [r.limit] : []),
      ]),
    );
    dots(r.rows, 0, 2);
    if (r.converges) line(() => r.limit, orange, 2);
    values(
      fmt(r.sum, 7),
      r.converges
        ? `无穷和 ${fmt(r.limit, 7)}；带符号余项 ${fmt(r.remainder, 7)}`
        : "无穷级数发散；有限部分和仍有定义。",
    );
    setMath(
      `Sₙ=1+q+…+qⁿ=${fmt(r.sum)}`,
      r.converges
        ? "余项 Rₙ=无穷和−Sₙ，保留符号。"
        : "收敛半径为 1；两个端点 q=±1 都不收敛。",
      String.raw`\sum_{k=0}^{\infty}q^k=\frac1{1-q}\quad(|q|<1)`,
    );
    setDataTable(["k", "第 k 项 qᵏ", "部分和 Sₖ"], r.rows);
  });
}
function forgettingLab() {
  scaffold(
    "psych",
    range("forget-rate", "遗忘速率 k", 0.35, 0.1, 1, 0.05) +
      select("review-plan", "理想化复习时刻", [
        ["none", "不复习"],
        ["two", "第 2、5 天"],
        ["three", "第 2、4、6 天"],
      ]) +
      range("forget-time", "观察时间 t（天）", 5, 0, 10, 0.1) +
      metric("当前记忆保持比例"),
    ["紫：所选复习方案", "橙虚线：不复习", "竖虚线：复习重置"],
    [
      "增加 k，观察基线曲线下降速度和半衰期。",
      "选择复习方案，观察复习时刻的跳变。",
      "对比同一时刻有无复习的保持比例。",
    ],
    "图中每次复习都回到 100%，是真实规律吗？",
    "这是为讲解分段函数和指数衰减设置的理想化假设。没有真实数据拟合，也不表示每个人的记忆都会按此变化；本例也没有模拟复习后衰减率变慢。",
  );
  extraBind(() => {
    const k = num("forget-rate"),
      t = num("forget-time"),
      plan = $("#review-plan").value,
      rs = plan === "two" ? [2, 5] : plan === "three" ? [2, 4, 6] : [],
      f = (x) => CalcExtra.forgetting(x, k, rs);
    initBoard([-0.4, 1.2, 10.5, -0.12]);
    curve((x) => (x >= 0 ? Math.exp(-k * x) : NaN), orange, 2);
    const cuts = [0, ...rs, 10];
    for (let i = 0; i < cuts.length - 1; i++) {
      const l = cuts[i],
        r = cuts[i + 1],
        xs = Array.from({ length: 51 }, (_, j) => l + ((r - l) * j) / 50);
      scene.data(
        xs,
        xs.map((x) => Math.exp(-k * (x - l))),
        { strokeColor: purple, strokeWidth: 3, fillColor: "none" },
      );
      if (i < cuts.length - 2) {
        point(r, Math.exp(-k * (r - l)), purple, true);
        point(r, 1, purple);
        segment([r, Math.exp(-k * (r - l))], [r, 1], teal);
      }
    }
    point(t, f(t), orange);
    values(
      fmt(100 * f(t), 2) + "%",
      `不复习 ${fmt(100 * Math.exp(-k * t), 2)}%；基线半衰期 ${fmt(Math.LN2 / k, 3)} 天`,
    );
    setMath(
      `R(t)=e^(−k(t−tᵣ))；t½=ln(2)/k`,
      "tᵣ 为最近一次复习时刻；复习瞬间取复习后的值 1。跳变处用空心/实心点区分，不连接成连续曲线。",
      String.raw`R(t)=e^{-k(t-t_r)},\qquad t_{1/2}=\frac{\ln2}{k}`,
    );
    setDataTable(
      ["天数", "不复习保持比例", "所选方案保持比例"],
      Array.from({ length: 11 }, (_, x) => [x, Math.exp(-k * x), f(x)]),
    );
  });
}
function logisticLab() {
  scaffold(
    "psych",
    range("logistic-rate", "陡峭程度 k", 1, 0.2, 3, 0.1) +
      range("logistic-center", "50% 阈值 x₀", 0, -3, 3, 0.1) +
      range("logistic-x", "刺激强度 x（任意单位）", 1, -5, 5, 0.1) +
      metric("模型预测的反应概率"),
    ["紫：反应概率 P(x)", "橙：变化率 P′(x)", "青虚线：50% 概率"],
    [
      "改变 x₀，观察整条曲线的水平平移。",
      "改变 k，比较阈值附近概率变化的快慢。",
      "将 x 移到 x₀，观察 P=0.5 和最大斜率 k/4。",
    ],
    "阈值处概率只有一半，为什么变化最快？",
    "概率大小和变化速度是两个量。Logistic 曲线的导数为 kP(1−P)，在 P=0.5 时最大。这里是无猜测率、无失误率参数的简化教学模型，没有使用真实心理测量数据。",
  );
  extraBind(() => {
    const k = num("logistic-rate"),
      x0 = num("logistic-center"),
      x = num("logistic-x"),
      f = (t) => CalcExtra.logistic(t, k, x0);
    initBoard([-6, 1.2, 6, -0.12]);
    curve((t) => f(t).p);
    curve((t) => f(t).derivative, orange);
    line(() => 0.5, teal, 2);
    segment([x0, 0], [x0, 1], teal);
    point(x, f(x).p);
    values(
      fmt(100 * f(x).p, 2) + "%",
      `当前变化率 ${fmt(f(x).derivative, 4)}；最大斜率 k/4=${fmt(k / 4)}`,
    );
    setMath(
      `P(x)=1/(1+e^(−k(x−x₀)))`,
      "仅用于解释函数、阈值与导数，不用于个体评估或诊断。反应概率介于 0 和 1 之间。",
      String.raw`P(x)=\frac1{1+e^{-k(x-x_0)}},\quad P'(x)=kP(x)(1-P(x))`,
    );
    setDataTable(
      ["刺激强度", "反应概率", "导数"],
      [-5, -3, -1, 0, 1, 3, 5, x].map((t) => [t, f(t).p, f(t).derivative]),
    );
  });
}
