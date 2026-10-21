(function (root, factory) {
  if (typeof module === "object" && module.exports)
    module.exports = factory(require("./math-core.js"));
  else root.CalcExtra = factory(root.Calc);
})(typeof window === "undefined" ? globalThis : window, function (C) {
  "use strict";
  function finite(...xs) {
    if (xs.some((x) => !Number.isFinite(x)))
      throw Error("参数必须为有限实数。");
  }
  function logBase(x, b) {
    finite(x, b);
    if (b <= 0 || b === 1) throw Error("底数必须大于 0 且不等于 1。");
    return x > 0 ? Math.log(x) / Math.log(b) : NaN;
  }
  function epsilonDelta(a, epsilon, delta) {
    finite(a, epsilon, delta);
    if (epsilon <= 0 || delta <= 0) throw Error("ε 和 δ 都必须为正。");
    const sufficient = epsilon / (Math.sqrt(a * a + epsilon) + Math.abs(a));
    const maxDeviation = 2 * Math.abs(a) * delta + delta * delta;
    return { sufficient, maxDeviation, valid: maxDeviation <= epsilon + 1e-12 };
  }
  function sequence(kind, n) {
    if (!Number.isInteger(n) || n < 1 || n > 10000)
      throw Error("n 须为正整数。");
    if (kind === "reciprocal") return 1 / n;
    if (kind === "alternating") return (-1) ** n / n;
    if (kind === "oscillating") return (-1) ** n;
    if (kind === "euler") return Math.exp(n * Math.log1p(1 / n));
    throw Error("未知数列。");
  }
  const models = {
    cubic: {
      f: (x) => x * x * x - 3 * x,
      d: (x) => 3 * x * x - 3,
      critical: [-1, 1],
    },
    sin: { f: Math.sin, d: Math.cos, critical: [-Math.PI / 2, Math.PI / 2] },
    exp: { f: Math.exp, d: Math.exp, critical: [] },
    log: { f: Math.log, d: (x) => 1 / x, critical: [] },
    square: { f: (x) => x * x, d: (x) => 2 * x, critical: [0] },
  };
  const roots = {
    square: { f: (x) => x * x - 2, d: (x) => 2 * x },
    cubic: { f: (x) => x * x * x - x - 2, d: (x) => 3 * x * x - 1 },
    cosine: { f: (x) => Math.cos(x) - x, d: (x) => -Math.sin(x) - 1 },
    cycle: { f: (x) => x * x * x - 2 * x + 2, d: (x) => 3 * x * x - 2 },
  };
  function newton(kind, x0, steps) {
    finite(x0);
    if (!roots[kind] || !Number.isInteger(steps) || steps < 0 || steps > 12)
      throw Error("牛顿迭代参数无效。");
    const { f, d } = roots[kind];
    const rows = [{ step: 0, x: x0, y: f(x0) }];
    let status = "已完成指定步数";
    for (let k = 0; k < steps; k++) {
      const last = rows.at(-1);
      if (Math.abs(last.y) < 1e-12) {
        status = "残差小于 10⁻¹²，停止迭代";
        break;
      }
      const slope = d(last.x);
      if (!Number.isFinite(slope) || Math.abs(slope) < 1e-12) {
        status = "导数为零或过小，无法继续";
        break;
      }
      const next = last.x - last.y / slope;
      if (!Number.isFinite(next) || Math.abs(next) > 100) {
        status = "迭代离开 |x|≤100 的演示范围";
        break;
      }
      rows.push({ step: k + 1, x: next, y: f(next) });
      if (rows.slice(0, -1).some((r) => Math.abs(r.x - next) < 1e-12)) {
        status = "出现重复点，迭代可能循环";
        break;
      }
    }
    if (Math.abs(rows.at(-1).y) < 1e-12) status = "残差小于 10⁻¹²，停止迭代";
    return { rows, status };
  }
  function integrateRule(f, a, b, n, method) {
    finite(a, b);
    if (a >= b || !Number.isInteger(n) || n < 2 || n > 1000)
      throw Error("区间须递增，分割数为 2–1000 的整数。");
    if (method === "simpson" && n % 2)
      throw Error("复合 Simpson 法要求偶数分割。");
    if (!["mid", "trapezoid", "simpson"].includes(method))
      throw Error("未知求积方法。");
    const h = (b - a) / n;
    let sum = 0;
    if (method === "mid") {
      for (let i = 0; i < n; i++) sum += f(a + (i + 0.5) * h);
      return h * sum;
    }
    sum = f(a) + f(b);
    for (let i = 1; i < n; i++)
      sum += f(a + i * h) * (method === "trapezoid" ? 2 : i % 2 ? 4 : 2);
    return (sum * h) / (method === "trapezoid" ? 2 : 3);
  }
  function taylorBound(kind, a, n, x) {
    finite(a, x);
    if (!Number.isInteger(n) || n < 0 || n > 30) throw Error("阶数无效。");
    const distance = Math.abs(x - a);
    if (kind === "sin" || kind === "cos")
      return distance ** (n + 1) / C.factorial(n + 1);
    if (kind === "exp")
      return (
        (Math.exp(Math.max(a, x)) * distance ** (n + 1)) / C.factorial(n + 1)
      );
    if (kind === "log") {
      if (Math.min(a, x) <= -1) throw Error("ln(1+x) 的区间必须在 x>−1 内。");
      return distance ** (n + 1) / ((n + 1) * (1 + Math.min(a, x)) ** (n + 1));
    }
    throw Error("未知函数。");
  }
  function geometricSeries(q, n) {
    finite(q);
    if (!Number.isInteger(n) || n < 0 || n > 40)
      throw Error("阶数须在 0–40 之间。");
    let sum = 0,
      term = 1;
    const rows = [];
    for (let k = 0; k <= n; k++) {
      sum += term;
      rows.push([k, term, sum]);
      term *= q;
    }
    return {
      sum,
      rows,
      converges: Math.abs(q) < 1,
      limit: Math.abs(q) < 1 ? 1 / (1 - q) : NaN,
      remainder: Math.abs(q) < 1 ? q ** (n + 1) / (1 - q) : NaN,
    };
  }
  function forgetting(t, k, review) {
    finite(t, k);
    if (t < 0 || k <= 0) throw Error("时间非负，速率为正。");
    let anchor = 0;
    for (const r of review) if (r <= t && r > anchor) anchor = r;
    return Math.exp(-k * (t - anchor));
  }
  function logistic(x, k, x0) {
    finite(x, k, x0);
    if (k <= 0) throw Error("斜率参数须为正。");
    const z = k * (x - x0),
      p = z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z));
    return { p, derivative: k * p * (1 - p) };
  }
  return {
    logBase,
    epsilonDelta,
    sequence,
    models,
    roots,
    newton,
    integrateRule,
    taylorBound,
    geometricSeries,
    forgetting,
    logistic,
  };
});
