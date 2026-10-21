(function (root) {
  "use strict";
  const M =
    typeof module !== "undefined" && module.exports
      ? require("mathjs")
      : root.math;
  function compileExpression(text) {
    if (typeof text !== "string" || !text.trim() || text.length > 120)
      throw Error("请输入 1–120 个字符的函数表达式。");
    const normalized = text
      .replace(/π/g, "pi")
      .replace(/\bln\s*\(/g, "log(")
      .replace(/\*\*/g, "^")
      .replace(/[−–]/g, "-")
      .replace(/×/g, "*")
      .replace(/÷/g, "/");
    let node;
    try {
      node = M.parse(normalized);
    } catch {
      throw Error("表达式无法识别，请检查括号和运算符，例如 sin(x) + x/2。");
    }
    const funcs = new Set([
      "sin",
      "cos",
      "tan",
      "exp",
      "log",
      "log2",
      "log10",
      "sqrt",
      "abs",
      "asin",
      "acos",
      "atan",
      "sinh",
      "cosh",
      "tanh",
    ]);
    let count = 0;
    const logarithmBases = [];
    node.traverse((n) => {
      if (++count > 65) throw Error("表达式过于复杂，请拆分后绘图。");
      if (n.type === "OperatorNode") {
        if (!["+", "-", "*", "/", "^"].includes(n.op))
          throw Error("仅支持 + − * / ^ 运算。");
      } else if (n.type === "FunctionNode") {
        if (
          !funcs.has(n.fn.name) ||
          (n.args.length !== 1 && !(n.fn.name === "log" && n.args.length === 2))
        )
          throw Error("请使用支持的单变量函数，如 sin(x)、log(x)、sqrt(x)。");
        if (n.fn.name === "log" && n.args.length === 2)
          logarithmBases.push(n.args[1]);
      } else if (n.type === "SymbolNode") {
        if (!["x", "pi", "e"].includes(n.name) && !funcs.has(n.name))
          throw Error("仅支持变量 x 和常数 pi、e。");
      } else if (
        n.type === "ConstantNode" &&
        (typeof n.value !== "number" || !Number.isFinite(n.value))
      )
        throw Error("请只使用有限实数，不支持字符串或无穷常量。");
      else if (!["ConstantNode", "ParenthesisNode"].includes(n.type))
        throw Error("请输入单个函数，不支持赋值、矩阵或脚本。");
    });
    for (const baseNode of logarithmBases) {
      let variableBase = false;
      baseNode.traverse((n) => {
        if (n.type === "SymbolNode" && n.name === "x") variableBase = true;
      });
      if (variableBase) throw Error("对数底数请填写常数，例如 log(x, 2)。");
      let base;
      try {
        base = baseNode.compile().evaluate();
      } catch {
        base = NaN;
      }
      if (
        typeof base !== "number" ||
        !Number.isFinite(base) ||
        base <= 0 ||
        base === 1
      )
        throw Error(
          "对数底数须大于 0 且不等于 1，例如 log(x, 2)、log(x, 0.5)。",
        );
    }
    const code = node.compile();
    const evaluate = (x) => {
      try {
        const y = code.evaluate({ x });
        return typeof y === "number" && Number.isFinite(y) ? y : NaN;
      } catch {
        return NaN;
      }
    };
    evaluate.latex = node.toTex({ parenthesis: "keep", implicit: "hide" });
    return evaluate;
  }
  function factorial(n) {
    let v = 1;
    for (let i = 2; i <= n; i++) v *= i;
    return v;
  }
  function taylorCoefficients(kind, a, n) {
    if (!Number.isFinite(a) || !Number.isInteger(n) || n < 0 || n > 30)
      throw Error("展开中心须为有限数，阶数须为 0–30 的整数。");
    if (kind === "log" && a <= -1)
      throw Error("ln(1+x) 的展开中心必须大于 −1。");
    const arr = [];
    for (let k = 0; k <= n; k++) {
      let d;
      if (kind === "sin")
        d = [Math.sin(a), Math.cos(a), -Math.sin(a), -Math.cos(a)][k % 4];
      else if (kind === "cos")
        d = [Math.cos(a), -Math.sin(a), -Math.cos(a), Math.sin(a)][k % 4];
      else if (kind === "exp") d = Math.exp(a);
      else if (kind === "log")
        d =
          k === 0
            ? Math.log1p(a)
            : ((-1) ** (k - 1) * factorial(k - 1)) / (1 + a) ** k;
      else throw Error("未知函数");
      arr.push(d / factorial(k));
    }
    return arr;
  }
  function polynomial(coeff, a, x) {
    let y = 0;
    for (let i = coeff.length - 1; i >= 0; i--) y = y * (x - a) + coeff[i];
    return y;
  }
  function taylorOriginal(kind, x) {
    return kind === "sin"
      ? Math.sin(x)
      : kind === "cos"
        ? Math.cos(x)
        : kind === "exp"
          ? Math.exp(x)
          : x > -1
            ? Math.log1p(x)
            : NaN;
  }
  function riemann(f, a, b, n, method) {
    if (
      !Number.isFinite(a) ||
      !Number.isFinite(b) ||
      a >= b ||
      !Number.isInteger(n) ||
      n < 1 ||
      n > 10000 ||
      !["left", "mid", "right"].includes(method)
    )
      throw Error("无效的积分区间、分割数或取样方法。");
    const dx = (b - a) / n;
    let total = 0;
    const rectangles = [];
    for (let i = 0; i < n; i++) {
      const left = a + i * dx;
      const at =
        left + dx * (method === "left" ? 0 : method === "right" ? 1 : 0.5);
      const y = f(at);
      if (!Number.isFinite(y)) throw Error("取样点的函数值不是有限实数。");
      total += dx * y;
      rectangles.push({ left, right: left + dx, y });
    }
    return { total, rectangles };
  }
  function normal(x, mu, sigma) {
    if (!Number.isFinite(mu) || !Number.isFinite(sigma) || sigma <= 0)
      throw Error("标准差必须为正的有限数。");
    return (
      Math.exp(-0.5 * ((x - mu) / sigma) ** 2) /
      (sigma * Math.sqrt(2 * Math.PI))
    );
  }
  function definiteIntegral(kind, a, b) {
    if (![a, b].every(Number.isFinite)) throw Error("积分端点须为有限数。");
    const width = b - a;
    if (kind === "square") return (width * (a * a + a * b + b * b)) / 3;
    if (kind === "linear") return (width * (a + b)) / 2;
    if (kind === "sin") return 2 * Math.sin((a + b) / 2) * Math.sin(width / 2);
    if (kind === "exp") return Math.exp(a) * Math.expm1(width);
    throw Error("未知积分函数。");
  }
  function geometricIntegral(kind, a, b) {
    if (![a, b].every(Number.isFinite) || a >= b || a < -5 || b > 5)
      throw Error("几何面积实验要求 −5≤a<b≤5。");
    const roots =
      kind === "sin" ? [-Math.PI, 0, Math.PI] : kind === "linear" ? [0] : [];
    const cuts = [a, ...roots.filter((x) => x > a && x < b), b];
    return cuts
      .slice(1)
      .reduce(
        (sum, x, i) => sum + Math.abs(definiteIntegral(kind, cuts[i], x)),
        0,
      );
  }
  function normalProbability(a, b, mu, sigma) {
    if (![a, b, mu, sigma].every(Number.isFinite) || sigma <= 0 || a > b)
      throw Error("概率区间或标准差无效。");
    const left = (a - mu) / sigma,
      right = (b - mu) / sigma;
    if (left >= 0)
      return Math.max(0, normalSurvival(left) - normalSurvival(right));
    if (right <= 0)
      return Math.max(0, normalSurvival(-right) - normalSurvival(-left));
    return 0.5 * (M.erf(right / Math.SQRT2) - M.erf(left / Math.SQRT2));
  }
  function adaptiveIntegral(f, a, b, tol = 1e-12, maxDepth = 18) {
    const simpson = (a, b, fa, fm, fb) => ((b - a) * (fa + 4 * fm + fb)) / 6;
    function split(a, b, fa, fm, fb, whole, eps, depth) {
      const m = (a + b) / 2,
        fl = f((a + m) / 2),
        fr = f((m + b) / 2),
        left = simpson(a, m, fa, fl, fm),
        right = simpson(m, b, fm, fr, fb),
        delta = left + right - whole;
      if (depth === 0 || Math.abs(delta) <= 15 * eps)
        return left + right + delta / 15;
      return (
        split(a, m, fa, fl, fm, left, eps / 2, depth - 1) +
        split(m, b, fm, fr, fb, right, eps / 2, depth - 1)
      );
    }
    const fa = f(a),
      fb = f(b),
      fm = f((a + b) / 2);
    return split(a, b, fa, fm, fb, simpson(a, b, fa, fm, fb), tol, maxDepth);
  }
  // Integrate the scaled tail instead of subtracting two CDFs close to one.
  function normalSurvival(z) {
    if (z < 0) return 1 - normalSurvival(-z);
    if (z < 4) return 0.5 * (1 - M.erf(z / Math.SQRT2));
    if (z > 38) return 0; // Below the useful range of IEEE 754 double precision.
    const scaled = adaptiveIntegral(
      (u) => Math.exp(-u - (u * u) / (2 * z * z)),
      0,
      40,
    );
    return (Math.exp((-z * z) / 2) / (Math.sqrt(2 * Math.PI) * z)) * scaled;
  }
  function convergence(kind, a, x) {
    if (kind !== "log") return "all-real";
    const upper = 1 + 2 * a,
      eps = 1e-12 * Math.max(1, Math.abs(upper), Math.abs(x));
    if (x <= -1) return "undefined";
    if (Math.abs(x - upper) <= eps) return "right-endpoint";
    return x < upper ? "inside" : "outside";
  }
  function autoBounds(values, includeZero = true) {
    const finite = values.filter(Number.isFinite);
    if (!finite.length) throw Error("该区间内没有足够的实数值，请检查定义域。");
    let lo = Math.min(...finite),
      hi = Math.max(...finite);
    if (Math.max(Math.abs(lo), Math.abs(hi)) > 1e12)
      throw Error("数值超过当前绘图范围（±10¹²），请缩小区间或缩放函数。");
    if (includeZero) {
      lo = Math.min(0, lo);
      hi = Math.max(0, hi);
    }
    const span = hi - lo,
      pad = Math.max(span * 0.15, Math.abs(hi) * 0.03, 0.25);
    return [hi + pad, lo - pad];
  }
  function sample(f, lo, hi, ySpan = 10, n = 600) {
    const xs = [],
      ys = [];
    let evaluations = 0,
      truncated = false;
    const budget = 14000,
      tolerance = Math.max(Math.abs(ySpan) * 0.0015, 1e-10);
    const evaluate = (x) => {
      evaluations++;
      try {
        return f(x);
      } catch {
        return NaN;
      }
    };
    const put = (x, y) => {
      xs.push(x);
      ys.push(Number.isFinite(y) ? y : NaN);
    };
    const gap = () => {
      if (!Number.isNaN(ys[ys.length - 1])) put(NaN, NaN);
    };
    function segment(a, fa, b, fb, depth) {
      const mid = (a + b) / 2,
        fm = evaluate(mid),
        valid =
          Number.isFinite(fa) && Number.isFinite(fb) && Number.isFinite(fm);
      const err = valid ? Math.abs(fm - (fa + fb) / 2) : Infinity;
      if (valid && err < tolerance) {
        put(b, fb);
        return;
      }
      if (
        !Number.isFinite(fa) &&
        !Number.isFinite(fm) &&
        !Number.isFinite(fb)
      ) {
        gap();
        put(b, fb);
        return;
      }
      if (depth === 0 || evaluations >= budget) {
        if (evaluations >= budget) truncated = true;
        if (!valid || err > tolerance * 4) gap();
        put(b, fb);
        return;
      }
      segment(a, fa, mid, fm, depth - 1);
      segment(mid, fm, b, fb, depth - 1);
    }
    let a = lo,
      fa = evaluate(a);
    put(a, fa);
    for (let i = 1; i <= n; i++) {
      const b = lo + ((hi - lo) * i) / n,
        fb = evaluate(b);
      segment(a, fa, b, fb, 9);
      a = b;
      fa = fb;
    }
    const result = [xs, ys];
    result.truncated = truncated;
    result.evaluations = evaluations;
    return result;
  }
  const API = {
    compileExpression,
    factorial,
    taylorCoefficients,
    polynomial,
    taylorOriginal,
    riemann,
    definiteIntegral,
    geometricIntegral,
    normal,
    normalProbability,
    normalSurvival,
    adaptiveIntegral,
    convergence,
    autoBounds,
    sample,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.Calc = API;
})(typeof window === "undefined" ? globalThis : window);
