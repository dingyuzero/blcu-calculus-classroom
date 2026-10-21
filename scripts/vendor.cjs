const fs = require("node:fs");
fs.mkdirSync("dist/vendor", { recursive: true });
for (const [src, dest] of [
  ["jsxgraph/distrib/jsxgraphcore.js", "jsxgraphcore.js"],
  ["jsxgraph/distrib/jsxgraph.css", "jsxgraph.css"],
  ["jsxgraph/LICENSE.MIT", "JSXGraph-LICENSE.txt"],
  ["mathjs/lib/browser/math.js", "math.js"],
  ["mathjs/LICENSE", "mathjs-LICENSE.txt"],
  ["mathjs/NOTICE", "mathjs-NOTICE.txt"],
  ["katex/dist/katex.min.js", "katex.min.js"],
  ["katex/dist/katex.min.css", "katex.min.css"],
  ["katex/LICENSE", "KaTeX-LICENSE.txt"],
])
  fs.copyFileSync("node_modules/" + src, "dist/vendor/" + dest);
fs.cpSync("node_modules/katex/dist/fonts", "dist/vendor/fonts", {
  recursive: true,
});
console.log(
  "Vendored JSXGraph 1.14.0, math.js 15.2.0, KaTeX 0.19.0 with licenses and fonts.",
);
fs.copyFileSync(
  "node_modules/mathjs/lib/browser/math.js.LICENSE.txt",
  "dist/vendor/math.js.LICENSE.txt",
);
