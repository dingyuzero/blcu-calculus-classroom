(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Trig = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const pi = Math.PI,
    rad = (d) => (d * pi) / 180,
    deg = (r) => (r * 180) / pi;
  const keys = ["sin", "cos", "tan", "cot", "sec", "csc"];
  // Exact cardinal angles remain exact in the classroom's degree controls.
  function sincos(x) {
    const q = x / (pi / 2),
      k = Math.round(q);
    if (Math.abs(q - k) < 1e-12) {
      return [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ][((k % 4) + 4) % 4];
    }
    return [Math.sin(x), Math.cos(x)];
  }
  function all(x) {
    const [s, c] = sincos(x);
    return {
      sin: s,
      cos: c,
      tan: c === 0 ? NaN : s / c,
      cot: s === 0 ? NaN : c / s,
      sec: c === 0 ? NaN : 1 / c,
      csc: s === 0 ? NaN : 1 / s,
    };
  }
  const value = (key, x) => all(x)[key];
  function inverse(key, x) {
    switch (key) {
      case "sin":
        return Math.asin(x);
      case "cos":
        return Math.acos(x);
      case "tan":
        return Math.atan(x);
      case "cot":
        return Math.atan2(1, x);
      case "sec":
        return Math.abs(x) >= 1 ? Math.acos(1 / x) : NaN;
      case "csc":
        return Math.abs(x) >= 1 ? Math.asin(1 / x) : NaN;
    }
  }
  function derivative(key, x, inverted = false) {
    if (inverted) {
      switch (key) {
        case "sin":
          return Math.abs(x) < 1 ? 1 / Math.sqrt(1 - x * x) : NaN;
        case "cos":
          return Math.abs(x) < 1 ? -1 / Math.sqrt(1 - x * x) : NaN;
        case "tan":
          return 1 / (1 + x * x);
        case "cot":
          return -1 / (1 + x * x);
        case "sec":
          return Math.abs(x) > 1
            ? 1 / (Math.abs(x) * Math.sqrt(x * x - 1))
            : NaN;
        case "csc":
          return Math.abs(x) > 1
            ? -1 / (Math.abs(x) * Math.sqrt(x * x - 1))
            : NaN;
      }
    }
    const v = all(x);
    return {
      sin: v.cos,
      cos: -v.sin,
      tan: v.sec * v.sec,
      cot: -v.csc * v.csc,
      sec: v.sec * v.tan,
      csc: -v.csc * v.cot,
    }[key];
  }
  function poles(key, lo, hi) {
    if (key === "sin" || key === "cos") return [];
    const shift = ["tan", "sec"].includes(key) ? pi / 2 : 0;
    const out = [];
    for (
      let k = Math.ceil((lo - shift) / pi);
      k <= Math.floor((hi - shift) / pi);
      k++
    )
      out.push(shift + k * pi);
    return out;
  }
  // Split curves at the known poles before sampling: no line joins across infinity.
  function branches(key, lo, hi, n = 360) {
    const cuts = [
        lo,
        ...poles(key, lo, hi).filter((x) => x > lo && x < hi),
        hi,
      ],
      ps = poles(key, lo, hi);
    return cuts.slice(0, -1).map((a, i) => {
      const b = cuts[i + 1],
        start = ps.some((p) => Math.abs(p - a) < 1e-10) ? a + 1e-6 : a,
        end = ps.some((p) => Math.abs(p - b) < 1e-10) ? b - 1e-6 : b,
        count = Math.max(8, Math.ceil((n * (b - a)) / (hi - lo)));
      return Array.from({ length: count + 1 }, (_, j) => {
        const x = start + ((end - start) * j) / count;
        return [x, value(key, x)];
      });
    });
  }
  function principalSegments(key) {
    switch (key) {
      case "sin":
        return [[-pi / 2, pi / 2]];
      case "cos":
        return [[0, pi]];
      case "tan":
        return [[-pi / 2 + 1e-4, pi / 2 - 1e-4]];
      case "cot":
        return [[1e-4, pi - 1e-4]];
      case "sec":
        return [
          [0, pi / 2 - 1e-4],
          [pi / 2 + 1e-4, pi],
        ];
      case "csc":
        return [
          [-pi / 2, -1e-4],
          [1e-4, pi / 2],
        ];
    }
  }
  function angleBounds(key, negative = false) {
    return {
      sin: [-90, 90, 30],
      cos: [0, 180, 60],
      tan: [-89, 89, 30],
      cot: [1, 179, 60],
      sec: negative ? [91, 180, 135] : [0, 89, 45],
      csc: negative ? [-90, -1, -30] : [1, 90, 30],
    }[key];
  }
  function fromSine(key, x) {
    const s = sincos(x)[0],
      c = sincos(x + pi / 2)[0];
    return {
      sin: s,
      cos: c,
      tan: c === 0 ? NaN : s / c,
      cot: s === 0 ? NaN : c / s,
      sec: c === 0 ? NaN : 1 / c,
      csc: s === 0 ? NaN : 1 / s,
    }[key];
  }
  function identity(kind, x) {
    const v = all(x);
    return kind === "circle"
      ? { parts: [v.sin * v.sin, v.cos * v.cos], total: 1 }
      : kind === "sec"
        ? { parts: [1, v.tan * v.tan], total: v.sec * v.sec }
        : { parts: [1, v.cot * v.cot], total: v.csc * v.csc };
  }
  return {
    pi,
    rad,
    deg,
    keys,
    sincos,
    all,
    value,
    inverse,
    derivative,
    poles,
    branches,
    principalSegments,
    angleBounds,
    fromSine,
    identity,
  };
});
