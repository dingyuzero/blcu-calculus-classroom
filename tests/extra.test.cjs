const assert = require("node:assert/strict");
const { test } = require("node:test");
const C = require("../dist/math-core.js"),
  E = require("../dist/math-extra.js");
const near = (a, b, t = 1e-11) =>
  assert.ok(Math.abs(a - b) <= t, `${a} != ${b}`);
test("student logarithm syntax and invalid bases", () => {
  near(C.compileExpression("log10(x)")(100), 2);
  near(C.compileExpression("log2(x)")(8), 3);
  near(C.compileExpression("ln(x)")(Math.E), 1);
  near(C.compileExpression("log(x, 0.5)")(4), -2);
  for (const expr of [
    "log(x,1)",
    "log(x,0)",
    "log(x,-2)",
    "log(x,x)",
    "log(x,[2])",
    "log10(x,2)",
    'log(x,import("x"))',
  ])
    assert.throws(() => C.compileExpression(expr), expr);
  assert.ok(Number.isNaN(C.compileExpression("log10(x)")(-1)));
});
test("epsilon delta guarantee works throughout and fails beyond sharp boundary", () => {
  for (const a of [-2, -0.5, 0, 0.5, 2])
    for (const eps of [0.1, 0.5, 2]) {
      const r = E.epsilonDelta(a, eps, 0.1);
      near(2 * Math.abs(a) * r.sufficient + r.sufficient ** 2, eps);
      assert.ok(E.epsilonDelta(a, eps, r.sufficient).valid);
      assert.ok(!E.epsilonDelta(a, eps, r.sufficient * 1.01).valid);
      for (let i = -99; i <= 99; i++)
        assert.ok(Math.abs((a + (r.sufficient * i) / 100) ** 2 - a * a) < eps);
    }
});
test("discrete sequences distinguish alternating convergence and oscillation", () => {
  near(E.sequence("reciprocal", 100), 0.01);
  near(E.sequence("alternating", 99), -1 / 99);
  assert.equal(E.sequence("oscillating", 99), -1);
  assert.equal(E.sequence("oscillating", 100), 1);
  near(E.sequence("euler", 100), 2.704813829421526);
});
test("Newton solves analytic roots, stops at horizontal tangent and identifies cycles", () => {
  near(E.newton("square", 1, 8).rows.at(-1).x, Math.SQRT2);
  near(E.newton("cosine", 1, 8).rows.at(-1).x, 0.7390851332151607);
  assert.match(E.newton("square", 0, 8).status, /导数/);
  const r = E.newton("cycle", 0, 8);
  assert.deepEqual(
    r.rows.map((p) => p.x),
    [0, 1, 0],
  );
  assert.match(r.status, /循环/);
  assert.equal(E.newton("square", 2, 0).rows.length, 1);
});
test("composite rules: exactness, error direction, signed values, even requirement", () => {
  const f = (x) => x * x;
  near(E.integrateRule(f, 0, 2, 4, "simpson"), 8 / 3);
  near(
    E.integrateRule((x) => x ** 3, -1, 2, 4, "simpson"),
    15 / 4,
  );
  assert.ok(E.integrateRule(f, 0, 2, 4, "mid") < 8 / 3);
  assert.ok(E.integrateRule(f, 0, 2, 4, "trapezoid") > 8 / 3);
  near(
    E.integrateRule((x) => x, -2, 2, 4, "trapezoid"),
    0,
  );
  assert.throws(() => E.integrateRule(f, 0, 2, 3, "simpson"));
  assert.throws(() => E.integrateRule(f, 2, 0, 4, "mid"));
});
test("Lagrange bounds cover actual errors over supported classroom parameter grid", () => {
  for (const kind of ["sin", "cos", "exp", "log"])
    for (const a of [-0.5, 0, 1])
      for (const x of [-0.8, 0, 0.8, 2])
        for (const n of [0, 1, 3, 8, 12]) {
          const actual = Math.abs(
              C.taylorOriginal(kind, x) -
                C.polynomial(C.taylorCoefficients(kind, a, n), a, x),
            ),
            bound = E.taylorBound(kind, a, n, x);
          assert.ok(actual <= bound + 1e-12, `${kind},${a},${x},${n}`);
        }
  assert.throws(() => E.taylorBound("log", -1, 2, 1));
});
test("geometric partial sum, signed remainder and divergent endpoints", () => {
  for (const q of [-0.8, 0, 0.5, 0.95]) {
    const r = E.geometricSeries(q, 12);
    near(r.sum + r.remainder, 1 / (1 - q));
    assert.ok(r.converges);
  }
  assert.equal(E.geometricSeries(1, 12).sum, 13);
  assert.equal(E.geometricSeries(-1, 11).sum, 0);
  for (const q of [-1.2, -1, 1, 1.2])
    assert.ok(!E.geometricSeries(q, 12).converges);
});
test("forgetting resets only on review and logistic derivative and symmetry", () => {
  near(E.forgetting(2, 0.35, [2, 5]), 1);
  near(E.forgetting(4, 0.35, [2, 5]), Math.exp(-0.7));
  near(E.forgetting(Math.LN2 / 0.35, 0.35, []), 0.5);
  for (const k of [0.2, 1, 3]) {
    near(E.logistic(1, k, 1).p, 0.5);
    near(E.logistic(1, k, 1).derivative, k / 4);
    near(E.logistic(-2, k, 0).p + E.logistic(2, k, 0).p, 1);
    const x = 0.3,
      h = 1e-5;
    near(
      (E.logistic(x + h, k, 0).p - E.logistic(x - h, k, 0).p) / (2 * h),
      E.logistic(x, k, 0).derivative,
      1e-9,
    );
  }
});
