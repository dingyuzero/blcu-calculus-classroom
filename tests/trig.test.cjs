const { test } = require("node:test");
const assert = require("node:assert/strict");
const T = require("../dist/trig-core.js");
const near = (a, b, tol = 1e-9) =>
  assert.ok(Math.abs(a - b) < tol, `${a} ≠ ${b}`);

test("six functions at 30 degrees and exact quadrant boundaries", () => {
  const v = T.all(Math.PI / 6);
  const expected = {
    sin: 0.5,
    cos: Math.sqrt(3) / 2,
    tan: 1 / Math.sqrt(3),
    cot: Math.sqrt(3),
    sec: 2 / Math.sqrt(3),
    csc: 2,
  };
  for (const k of T.keys) near(v[k], expected[k]);
  assert.equal(T.value("cot", Math.PI / 2), 0);
  near(T.value("tan", Math.PI), 0);
  assert.ok(Number.isNaN(T.value("sec", Math.PI / 2)));
  assert.ok(Number.isNaN(T.value("csc", 0)));
});
test("phase-shift construction, periodicity and parity agree across quadrants", () => {
  for (const x of [-5.3, -2.1, -0.4, 0.3, 1.8, 4.2])
    for (const k of T.keys) {
      near(T.fromSine(k, x), T.value(k, x));
      near(
        T.value(k, x + (["tan", "cot"].includes(k) ? Math.PI : 2 * Math.PI)),
        T.value(k, x),
      );
      near(
        T.value(k, -x),
        (["cos", "sec"].includes(k) ? 1 : -1) * T.value(k, x),
      );
    }
});
test("tangent intercept geometry and three Pythagorean identities", () => {
  for (const x of [0.2, 0.7, 1.1, 2.3, -0.8]) {
    const v = T.all(x);
    near(v.cos * v.sec, 1);
    near(v.sin * v.csc, 1);
    near(Math.hypot(v.sec - v.cos, v.sin), Math.abs(v.tan));
    near(Math.hypot(v.cos, v.csc - v.sin), Math.abs(v.cot));
    for (const k of ["circle", "sec", "csc"]) {
      const a = T.identity(k, x);
      near(a.parts[0] + a.parts[1], a.total);
    }
  }
});
test("six principal inverse branches round-trip including finite endpoints", () => {
  const samples = {
    sin: [-1, -0.5, 0, 0.5, 1],
    cos: [-1, -0.5, 0, 0.5, 1],
    tan: [-4, -1, 0, 1, 4],
    cot: [-4, -1, 0, 1, 4],
    sec: [-4, -2, -1, 1, 2, 4],
    csc: [-4, -2, -1, 1, 2, 4],
  };
  for (const k of T.keys)
    for (const x of samples[k]) near(T.value(k, T.inverse(k, x)), x);
  near(T.inverse("cot", -1), (3 * Math.PI) / 4);
  near(T.inverse("sec", -2), (2 * Math.PI) / 3);
  near(T.inverse("csc", -2), -Math.PI / 6);
  near(T.inverse("sin", T.value("sin", (5 * Math.PI) / 6)), Math.PI / 6);
});
test("all twelve derivatives agree with central differences on both signs", () => {
  const h = 1e-6;
  for (const inv of [false, true])
    for (const k of T.keys) {
      const points = inv && ["sec", "csc"].includes(k) ? [-2, 2] : [-0.7, 0.7];
      const f = (x) => (inv ? T.inverse(k, x) : T.value(k, x));
      for (const x of points)
        near(T.derivative(k, x, inv), (f(x + h) - f(x - h)) / (2 * h), 2e-7);
    }
  near(T.derivative("sec", -2, true), 1 / (2 * Math.sqrt(3)));
  near(T.derivative("csc", -2, true), -1 / (2 * Math.sqrt(3)));
});
test("sampled graph branches never cross analytic poles", () => {
  for (const k of ["tan", "cot", "sec", "csc"]) {
    const poles = T.poles(k, -2 * Math.PI, 2 * Math.PI);
    for (const rows of T.branches(k, -2 * Math.PI, 2 * Math.PI)) {
      assert.ok(
        rows.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y)),
      );
      for (const p of poles)
        assert.ok(!(rows[0][0] <= p && p <= rows.at(-1)[0]));
    }
  }
});
test("identity diagram keeps the unit square fixed while sin and cos areas change", () => {
  const area = (points) =>
    Math.abs(
      points
        .slice(0, -1)
        .reduce(
          (sum, p, i) =>
            sum + p[0] * points[i + 1][1] - p[1] * points[i + 1][0],
          0,
        ),
    ) / 2;
  const fixed = T.unitIdentityGeometry(T.rad(30)).unitSquare;
  for (const degrees of [0, 5, 30, 45, 60, 85, 90]) {
    const angle = T.rad(degrees),
      g = T.unitIdentityGeometry(angle);
    assert.deepEqual(g.unitSquare, fixed);
    near(area(g.unitSquare), 1);
    near(area(g.cosSquare), Math.cos(angle) ** 2);
    near(area(g.sinSquare), Math.sin(angle) ** 2);
    near(Math.hypot(...g.pivot), Math.cos(angle));
    near(Math.hypot(1 - g.pivot[0], g.pivot[1]), Math.sin(angle));
    near(area(g.cosSquare) + area(g.sinSquare), 1);
  }
});
