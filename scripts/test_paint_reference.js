// Tests for website/paint-reference.js (Stage 2 beginner paint estimate; owner approval in the operations room, 15 Nov 2026).
// Run: node scripts/test_paint_reference.js   (reads data/reference_assumptions.json; never writes it)
"use strict";
const assert = require("node:assert/strict");
const fs = require("fs"), path = require("path");
const PR = require("../website/paint-reference.js");
const FILE = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "reference_assumptions.json"), "utf8"));
let n = 0; function ok(name, fn) { fn(); n++; console.log("PASS " + name); }
const COUNTRIES = Object.keys(PR.MARKET), CUR = { US: "USD", Canada: "CAD", UK: "GBP", Germany: "EUR", France: "EUR", Spain: "EUR", Italy: "EUR", Netherlands: "EUR" };
const clone = () => JSON.parse(JSON.stringify(FILE));
const rec = (f, market, kind) => f.records.find((r) => r.market === market && r.kind === kind);

ok("every supported market gives litres and material cost from its own two records, in its own currency", () => {
  COUNTRIES.forEach((c) => {
    const m = PR.MARKET[c], cov = rec(FILE, m, "coverage-range"), cost = rec(FILE, m, "material-cost-range"), r = PR.estimate(FILE, c, 40, 2);
    assert.equal(r.ok, true, c);
    assert.ok(Math.abs(r.litres.low - 40 * 2 * cov.low) < 1e-9 && Math.abs(r.litres.high - 40 * 2 * cov.high) < 1e-9, c);
    assert.ok(Math.abs(r.cost.low - 40 * 2 * cost.low) < 1e-9 && Math.abs(r.cost.high - 40 * 2 * cost.high) < 1e-9, c);
    assert.equal(r.cost.currency, CUR[c]); assert.equal(cost.currency, CUR[c]);
  });
});
ok("net wall area times the per-coat range times the coat count; one coat is half of two", () => {
  const one = PR.estimate(FILE, "US", 32, 1), two = PR.estimate(FILE, "US", 32, 2);
  assert.ok(Math.abs(two.litres.low - 2 * one.litres.low) < 1e-9 && Math.abs(two.cost.high - 2 * one.cost.high) < 1e-9);
  const cov = rec(FILE, "US", "coverage-range"); assert.ok(Math.abs(one.litres.low - 32 * cov.low) < 1e-9);
});
ok("only the approved coat choices are accepted", () => {
  assert.deepEqual(FILE.approval.allowedCoatChoices, [1, 2]);
  [0, 3, 2.5, NaN].forEach((c) => assert.equal(PR.estimate(FILE, "US", 30, c).ok, false, String(c)));
  assert.equal(PR.estimate(FILE, "US", 30, 3).reason, "coats"); assert.equal(PR.estimate(FILE, "US", 0, 2).ok, false);
});
ok("a missing or unknown market gives nothing and says so; no other market is substituted", () => {
  const f = clone(); f.records = f.records.filter((r) => !(r.market === "IT" && r.kind === "material-cost-range"));
  assert.equal(PR.pick(f, "Italy"), null); assert.equal(PR.estimate(f, "Italy", 30, 2).reason, "no-market");
  assert.ok(PR.fragment(f, "Italy", { netM2: 30, coats: 2 }).includes("No typical paint estimate for Italy yet"));
  assert.equal(PR.pick(FILE, "Atlantis"), null);
  assert.ok(PR.fragment(FILE, "", { netM2: 30, coats: 2 }).includes("Choose your country at the top"));
  assert.ok(PR.fragment(null, "US", { netM2: 30, coats: 2 }).includes("not available right now"));
});
ok("a record that is not approved, not eligible, package-priced, a national average, out of scope or duplicated is never used", () => {
  const mutate = (fn) => { const f = clone(); fn(rec(f, "US", "coverage-range"), f); return f; };
  [(r) => { r.status = "proposed"; }, (r) => { r.autoEligible = false; }, (r) => { r.packagePricingEligible = true; }, (r) => { r.nationalAverage = true; },
   (r) => { r.eligibilityScope = "other"; }, (r) => { r.low = 0.5; r.high = 0.1; }, (r) => { r.sources = []; }, (r) => { r.unit = "L/m2"; }, (r) => { r.subtype = "exterior"; }].forEach((fn, i) => assert.equal(PR.pick(mutate(fn), "US"), null, "mutation " + i));
  const dup = clone(); dup.records.push(Object.assign({}, rec(dup, "US", "coverage-range"), { id: "dup" })); assert.equal(PR.pick(dup, "US"), null);
  const off = clone(); off.approval.eligibleMarkets = off.approval.eligibleMarkets.filter((m) => m !== "US"); assert.equal(PR.pick(off, "US"), null);
  const cur = clone(); rec(cur, "US", "material-cost-range").currency = "EUR"; assert.equal(PR.pick(cur, "US"), null);
});
ok("the result shows range, market, coats, caveats, primer wording, tax wording and every source link; no package or tin claim", () => {
  const h = PR.fragment(FILE, "US", { netM2: 40, coats: 2, allowPct: 0 });
  assert.ok(h.includes("Typical paint for these walls") && h.includes("for 2 coats") && h.includes("Typical material cost") && h.includes("(approximate)"));
  assert.ok(h.includes("the United States") && h.includes("sound, prepared walls") && h.includes("primer") && h.includes("tax treatment varies by source") && h.includes("not a tin or package count and not a quote"));
  assert.ok(h.includes("2 is a planning default if you are not sure") && h.includes(FILE.approval.caveat.slice(0, 40)));
  const p = PR.pick(FILE, "US"), all = p.coverage.sources.concat(p.cost.sources);
  all.forEach((s) => assert.ok(h.includes('href="' + s.url + '"'), s.url)); assert.ok(h.includes("Sources (" + all.length + ")"));
  assert.ok(!/tin\(s\)|Buy at least|per tin|\d+ tins?\b/.test(h.replace("not a tin or package count", "")));
});
ok("one coat omits the default note; US adds gallons, other markets do not; the user's extra is a separate line", () => {
  const one = PR.fragment(FILE, "US", { netM2: 40, coats: 1 }); assert.ok(one.includes("for 1 coat<") && !one.includes("planning default") && one.includes("US gallons"));
  assert.ok(!PR.fragment(FILE, "UK", { netM2: 40, coats: 2 }).includes("US gallons"));
  const x = PR.fragment(FILE, "Canada", { netM2: 40, coats: 2, allowPct: 10 }), r = PR.estimate(FILE, "Canada", 40, 2, 10);
  assert.ok(x.includes("With your 10% extra") && Math.abs(r.withAllowance.litres.low - r.litres.low * 1.1) < 1e-9 && Math.abs(r.withAllowance.cost.high - r.cost.high * 1.1) < 1e-9);
  assert.ok(!PR.fragment(FILE, "Canada", { netM2: 40, coats: 2, allowPct: 0 }).includes("With your"));
});
ok("coats outside the approved choices explain what is available", () => {
  assert.ok(PR.fragment(FILE, "US", { netM2: 40, coats: 3 }).includes("available for 1 or 2 coats"));
});
ok("text from the data file is escaped", () => {
  const f = clone(); rec(f, "US", "coverage-range").sources[0].title = "<img src=x onerror=alert(1)>"; f.approval.caveat = "<b>c</b>";
  const h = PR.fragment(f, "US", { netM2: 40, coats: 2 }); assert.ok(h.includes("&lt;img") && !h.includes("<img") && h.includes("&lt;b&gt;c&lt;/b&gt;"));
});
ok("init exposes hpwPaint, follows the page-wide country, and a null window is refused", () => {
  const win = { hpwRegion: "" }; const c = PR.init(win, { file: FILE });
  assert.ok(win.hpwPaint({ netM2: 40, coats: 2 }).includes("Choose your country")); win.hpwRegion = "Germany";
  const h = win.hpwPaint({ netM2: 40, coats: 2 }); assert.ok(h.includes("Germany") && h.includes("€") && c.state.file === FILE);
  win.hpwRegion = "France"; assert.ok(win.hpwPaint({ netM2: 40, coats: 2 }).includes("France")); assert.equal(PR.init(null), null);
});
ok("source: one same-origin GET of the build copy, no storage, no other network", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "website", "paint-reference.js"), "utf8");
  for (const bad of ["localStorage", "sessionStorage", "indexedDB", "XMLHttpRequest", "eval(", "document.cookie", "sendBeacon", "WebSocket"]) assert.ok(!src.includes(bad), bad);
  assert.equal((src.match(/fetch\(/g) || []).length, 1); assert.equal((src.match(/win\.fetch\("reference-assumptions\.json", \{ cache: "no-cache" \}\)/g) || []).length, 1);
});
ok("the page: beginner fields first, coverage and price under Advanced settings and optional, scripts in order", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
  const panel = html.slice(html.indexOf('id="panel-paint"'), html.indexOf("</section>", html.indexOf('id="panel-paint"')));
  const adv = panel.indexOf('id="paint-advanced"');
  assert.ok(adv > 0 && adv < panel.indexOf('id="paint-coverage"') && adv < panel.indexOf('id="paint-price"') && adv < panel.indexOf('id="paint-currency"'));
  assert.ok(!/id="paint-coverage"[^>]*required/.test(panel) && /id="paint-coats"[^>]*value="2"/.test(panel) && panel.includes("2 if you are not sure") && !/id="paint-waste"[^>]*value=/.test(panel));
  assert.ok(html.indexOf("paint-reference.js") < html.lastIndexOf("<script>"));
});
console.log("\n" + n + " paint-reference tests passed");
