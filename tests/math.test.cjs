const assert = require("node:assert/strict");
const { test } = require("node:test");
const C = require("../dist/math-core.js");
const near = (a, b, tol = 1e-10) =>
  assert.ok(Math.abs(a - b) < tol, `${a} should equal ${b}`);
test("classroom expressions, implicit multiplication, radians and real domain", () => {
  near(C.compileExpression("sin(pi/2)")(0), 1);
  near(C.compileExpression("2x^2 + 1")(3), 19);
  near(C.compileExpression("ln(e)")(0), 1);
  near(C.compileExpression("1-exp(-0.5*x)")(0), 0);
  assert.ok(Number.isNaN(C.compileExpression("sqrt(x)")(-1)));
  assert.ok(Number.isNaN(C.compileExpression("1/x")(0)));
});
test("reject executable, assignment, array, unexpected variable and expensive-function input", () => {
  for (const expr of [
    "x=2",
    'import("x")',
    'evaluate("2")',
    "[1,2]",
    "x;2",
    "random()",
    "factorial(10000000)",
    "y+x",
    "constructor(1)",
  ])
    assert.throws(() => C.compileExpression(expr), expr);
  assert.throws(() => C.compileExpression("sin("));
  assert.throws(() => C.compileExpression("x".repeat(121)));
});
test("known Maclaurin coefficients and shifted Taylor centers", () => {
  const c = C.taylorCoefficients("sin", 0, 5);
  [0, 1, 0, -1 / 6, 0, 1 / 120].forEach((v, i) => near(c[i], v));
  near(C.polynomial(C.taylorCoefficients("exp", 1, 12), 1, 1), Math.E);
  for (const kind of ["sin", "cos", "exp", "log"])
    for (const a of [-0.75, 0, 0.7])
      near(
        C.polynomial(C.taylorCoefficients(kind, a, 12), a, a),
        C.taylorOriginal(kind, a),
      );
  assert.throws(() => C.taylorCoefficients("log", -1, 3));
});
test("Taylor convergence in radius and divergence outside radius", () => {
  const err = (kind, n, x) =>
    Math.abs(
      C.polynomial(C.taylorCoefficients(kind, 0, n), 0, x) -
        C.taylorOriginal(kind, x),
    );
  assert.ok(err("sin", 11, 1) < 3e-10);
  assert.ok(err("exp", 12, 1) < 2e-10);
  assert.ok(err("log", 12, 0.5) < err("log", 3, 0.5));
  assert.ok(err("log", 12, 2) > err("log", 3, 2));
});
test("Riemann sums bracket x squared integral and signed areas cancel", () => {
  const f = (x) => x * x,
    a = 0,
    b = 2,
    n = 20,
    exact = 8 / 3;
  assert.ok(C.riemann(f, a, b, n, "left").total < exact);
  assert.ok(C.riemann(f, a, b, n, "right").total > exact);
  near(C.riemann((x) => x, -2, 2, 8, "mid").total, 0);
  assert.ok(
    Math.abs(C.riemann(f, 0, 2, 100, "mid").total - exact) <
      Math.abs(C.riemann(f, 0, 2, 8, "mid").total - exact),
  );
});
test("normal density and familiar interval probabilities", () => {
  near(C.normal(0, 0, 1), 1 / Math.sqrt(2 * Math.PI));
  near(C.normalProbability(-1, 1, 0, 1), 0.6826894921370859);
  near(C.normalProbability(-2, 2, 0, 1), 0.9544997361036416);
  near(C.normalProbability(8, 12, 10, 2), 0.6826894921370859);
});
test("stable integrals preserve small intervals and signed orientation", () => {
  near(C.definiteIntegral("square", 0, 2), 8 / 3);
  near(C.definiteIntegral("sin", 0, Math.PI), 2);
  near(C.definiteIntegral("linear", -2, 2), 0);
  for (const [kind, f] of [
    ["square", (x) => x * x],
    ["linear", (x) => x],
    ["sin", Math.sin],
    ["exp", Math.exp],
  ]) {
    const a = 2,
      b = a + 1e-8,
      integral = C.definiteIntegral(kind, a, b);
    assert.ok(Math.abs(integral / (b - a) / f((a + b) / 2) - 1) < 1e-12, kind);
    near(C.definiteIntegral(kind, b, a), -integral);
  }
});
test("geometric area splits positive and negative regions", () => {
  near(C.geometricIntegral("linear", -2, 2), 4);
  near(C.geometricIntegral("sin", -Math.PI, Math.PI), 4);
  near(C.geometricIntegral("square", -2, 2), 16 / 3);
  assert.throws(() => C.geometricIntegral("sin", -10, 10));
});
test("sample output breaks a pole instead of connecting it", () => {
  const [xs, ys] = C.sample((x) => 1 / x, -1, 1, 10, 1000);
  assert.ok(xs.some(Number.isNaN));
  assert.ok(ys.some((y) => !Number.isFinite(y)));
});
test("off-grid narrow poles are broken and smooth straight lines remain connected", () => {
  for (const pole of [0.005, 0.0051, 0.00314159]) {
    const [xs, ys] = C.sample((x) => 0.001 / (x - pole), -5, 5, 2, 1000);
    assert.ok(ys.some(Number.isNaN));
    for (let i = 1; i < xs.length; i++)
      if (Number.isFinite(ys[i]) && Number.isFinite(ys[i - 1]))
        assert.ok(
          !(xs[i - 1] < pole && xs[i] > pole),
          "No finite chord may cross the pole",
        );
  }
  assert.ok(C.sample((x) => 100000 * x, -5, 5, 10)[1].every(Number.isFinite));
});
test("Taylor classification respects decimal endpoints and logarithm domain", () => {
  for (const a of [0.15, -0.65, -0.55])
    assert.equal(
      C.convergence("log", a, Number((1 + 2 * a).toFixed(2))),
      "right-endpoint",
    );
  assert.equal(C.convergence("log", 0, -1), "undefined");
  assert.equal(C.convergence("log", 0, 2), "outside");
  assert.equal(C.convergence("log", 0, 0.5), "inside");
});
test("large constant auto range remains visible and invalid magnitudes fail clearly", () => {
  for (const v of [2000, -2000, 0, 0.0002]) {
    const [hi, lo] = C.autoBounds([v, v]);
    assert.ok(lo < v && hi > v);
  }
  assert.throws(() => C.autoBounds([1e300]));
});
test("normal extreme positive and negative tails retain nonzero probability", () => {
  const expected = 7.619853024156958e-24,
    p = C.normalProbability(4, 5, 0, 0.4);
  assert.ok(Math.abs(p / expected - 1) < 1e-10);
  near(C.normalProbability(-5, -4, 0, 0.4) / p, 1);
  near(C.normalProbability(0, 0, 0, 1), 0);
  assert.throws(() => C.normalProbability(0, 1, 0, 0));
});
