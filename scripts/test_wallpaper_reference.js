// Tests for website/wallpaper-reference.js and its wiring in website/home-project-calculator.html (Issue #402, beginner wallpaper cost range).
// Run: node scripts/test_wallpaper_reference.js
"use strict";
const assert = require("node:assert/strict");
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const W = require("../website/wallpaper-reference.js"), B = require("../website/wallpaper-beginner.js"), P = require("../website/paint-reference.js");
const file = JSON.parse(fs.readFileSync(path.join(root, "data", "reference_assumptions.json"), "utf8"));
const prices = JSON.parse(fs.readFileSync(path.join(root, "data", "reference_prices.json"), "utf8"));
const COUNTRIES = { US: ["US", "USD", "$"], Canada: ["CA", "CAD", "CA$"], UK: ["UK", "GBP", "£"], Germany: ["DE", "EUR", "€"], France: ["FR", "EUR", "€"], Spain: ["ES", "EUR", "€"], Italy: ["IT", "EUR", "€"], Netherlands: ["NL", "EUR", "€"] };
const clone = (o) => JSON.parse(JSON.stringify(o));
const wp = (f) => f.records.filter((r) => r.category === "wallpaper");
const NOW = new Date("2026-11-20T00:00:00Z");
let n = 0;
function ok(name, fn) { fn(); n++; console.log("PASS " + name); }
async function okA(name, fn) { await fn(); n++; console.log("PASS " + name); }

ok("each of the eight markets picks exactly its own approved record, in its own currency", () => {
  assert.equal(wp(file).length, 8);
  for (const [country, [code, cur]] of Object.entries(COUNTRIES)) {
    const p = W.pick(file, country);
    assert.ok(p, country);
    assert.equal(p.record.category, "wallpaper"); assert.equal(p.record.market, code); assert.equal(p.record.currency, cur); assert.equal(p.record.unit, cur + "/m2");
    assert.equal(p.record.packagePricingEligible, false); assert.equal(p.record.nationalAverage, false);
  }
});

ok("the estimate is exactly the net wall area times the low and high price per m2, with no waste, roll or package figure", () => {
  const us = W.pick(file, "US").record, e = W.estimate(file, "US", 57.6, NOW);
  assert.equal(e.ok, true);
  assert.ok(Math.abs(e.cost.low - 57.6 * us.low) < 1e-9 && Math.abs(e.cost.high - 57.6 * us.high) < 1e-9 && e.cost.currency === "USD");
  assert.deepEqual(Object.keys(e).sort(), ["cost", "netM2", "ok", "older", "perM2", "pick"]);
  for (const country of Object.keys(COUNTRIES)) { const r = W.pick(file, country).record, x = W.estimate(file, country, 100, NOW); assert.ok(Math.abs(x.cost.low - 100 * r.low) < 1e-9 && Math.abs(x.cost.high - 100 * r.high) < 1e-9 && x.cost.currency === r.currency, country); }
});

ok("the per-m2 range matches the two exact endpoint products (roll price divided by nominal roll coverage)", () => {
  for (const country of Object.keys(COUNTRIES)) {
    const r = W.pick(file, country).record, per = r.sources.map((s) => s.pricePerRoll / s.nominalRollCoverageM2).sort((a, b) => a - b);
    assert.ok(Math.abs(per[0] - r.low) < 5e-4 && Math.abs(per[1] - r.high) < 5e-4, country + " " + per + " vs " + r.low + "-" + r.high);
  }
});

ok("no other market is ever used: unknown, empty and inherited names give nothing, and a missing market is not filled from another", () => {
  for (const bad of ["", "Mexico", "constructor", "__proto__", "toString", "us", null, undefined, 5]) { assert.equal(W.pick(file, bad), null, String(bad)); assert.equal(W.estimate(file, bad, 50, NOW).reason, "no-market"); }
  const f = clone(file); f.records = f.records.filter((r) => !(r.category === "wallpaper" && r.market === "US"));
  assert.equal(W.pick(f, "US"), null); assert.equal(W.pick(f, "Canada").record.currency, "CAD");
  const t = W.lines(f, "US", 50, NOW); assert.equal(t.ok, false); assert.equal(t.reason, "no-market"); assert.match(t.message, /No approximate wallpaper cost range for the United States yet/); assert.ok(!/CA\$|£|€/.test(t.message));
});

ok("the wall area must be a positive finite number", () => {
  for (const bad of [0, -5, NaN, Infinity, "12", null, undefined]) assert.equal(W.estimate(file, "US", bad, NOW).reason, "area", String(bad));
  assert.equal(W.lines(file, "US", 0, NOW).reason, "area");
});

ok("every eligibility condition is enforced: a record that fails any of them is not used", () => {
  const cases = {
    "autoEligible false": (r) => { r.autoEligible = false; }, "package pricing allowed": (r) => { r.packagePricingEligible = true; }, "national average": (r) => { r.nationalAverage = true; },
    "other scope": (r) => { r.eligibilityScope = "roll-count"; }, "not approved": (r) => { r.status = "researched"; }, "other subtype": (r) => { r.subtype = "x"; }, "other kind": (r) => { r.kind = "retailer-listing"; },
    "other category": (r) => { r.category = "paint"; }, "unit not per m2": (r) => { r.unit = r.currency + "/roll"; }, "currency not the market's": (r) => { r.currency = "USD"; r.unit = "USD/m2"; },
    "low above high": (r) => { r.low = r.high + 1; }, "negative low": (r) => { r.low = -1; }, "non-numeric high": (r) => { r.high = "9"; }, "one source": (r) => { r.sources.pop(); },
    "source currency differs": (r) => { r.sources[0].currency = "JPY"; }, "bad record date": (r) => { r.observedAt = "soon"; }, "bad source date": (r) => { r.sources[1].observedAt = ""; }
  };
  for (const [name, mutate] of Object.entries(cases)) { const f = clone(file); mutate(f.records.find((r) => r.category === "wallpaper" && r.market === "DE")); assert.equal(W.pick(f, "Germany"), null, name); assert.ok(W.pick(f, "France"), name + " must not affect France"); }
  const noApproval = clone(file); delete noApproval.wallpaperApproval; assert.equal(W.pick(noApproval, "US"), null);
  const notListed = clone(file); notListed.wallpaperApproval.eligibleMarkets = notListed.wallpaperApproval.eligibleMarkets.filter((m) => m !== "FR"); assert.equal(W.pick(notListed, "France"), null); assert.ok(W.pick(notListed, "US"));
  const twice = clone(file); twice.records.push(clone(twice.records.find((r) => r.category === "wallpaper" && r.market === "IT"))); assert.equal(W.pick(twice, "Italy"), null, "two eligible records are ambiguous: no guess");
  assert.equal(W.pick({ records: "x", wallpaperApproval: file.wallpaperApproval }, "US"), null); assert.equal(W.pick(null, "US"), null);
});

ok("the quarantined legacy wallpaper rows in reference_prices.json are never used", () => {
  const legacy = prices.filter((r) => r.category === "wallpaper");
  assert.equal(legacy.length, 12); assert.ok(legacy.every((r) => r.autoEligible === false && String(r.autoEligibleReason || "").length > 20));
  for (const c of Object.keys(COUNTRIES)) assert.equal(W.pick({ records: prices, wallpaperApproval: file.wallpaperApproval }, c), null, c);
  assert.ok(!fs.readFileSync(path.join(root, "website", "wallpaper-reference.js"), "utf8").includes("reference_prices"));
});

ok("paint records in the same file are untouched and never returned as wallpaper", () => {
  for (const c of Object.keys(COUNTRIES)) assert.equal(W.pick(file, c).record.category, "wallpaper");
  assert.ok(P.pick(file, "US"), "the paint estimate still finds its records");
});

ok("the text: approximate sample price range, source dates, product-type caveat, exclusions, own currency only", () => {
  for (const [country, [, , sym]] of Object.entries(COUNTRIES)) {
    const L = W.lines(file, country, 57.6, NOW), all = [L.headline].concat(L.notes).join(" "), r = W.pick(file, country).record;
    assert.equal(L.ok, true, country);
    assert.ok(L.headline.startsWith("Approximate sample price range: " + sym) && L.headline.includes("57.6 m² of wall"), L.headline);
    assert.ok(all.includes("Prices vary by product type and retailer") && all.includes("not a national average") && all.includes("or a quote"), country);
    assert.ok(all.includes("does not tell you how many rolls to buy") && all.includes("pattern matching, trim, offcuts or waste") && all.includes("paste, tools, delivery, labour or installation"));
    assert.ok(all.includes(r.sources.map((s) => s.observedAt).sort()[0]), country + " shows the sources' own observation date");
    assert.ok(!/\d+\s*(rolls?|packages?|strips?)\b/i.test(all), all); assert.ok(!/\d+\s*%/.test(all));
    const bare = all.replace(/CA\$/g, "");
    for (const other of ["$", "£", "€"]) assert.equal(bare.includes(other), sym.replace("CA$", "").includes(other), country + " shows only its own currency symbol (" + other + ")");
    assert.equal(L.sources.length, 2); assert.ok(L.sources.every((s) => /^https:\/\//.test(s.url) && s.label.length > 5 && s.detail.includes("per roll")));
  }
  const ca = W.lines(file, "Canada", 50, NOW).notes.join(" "); assert.ok(ca.includes("observed between 2026-09-26 and 2026-10-15"), ca);
  assert.ok(ca.includes("different kinds of wallpaper"));
});

ok("data whose sources are more than 12 months old is labelled", () => {
  assert.ok(!W.lines(file, "US", 50, new Date("2027-11-10")).notes.join(" ").includes("more than 12 months old"));
  assert.ok(W.lines(file, "US", 50, new Date("2027-11-20")).notes.join(" ").includes("more than 12 months old"));
  assert.ok(W.lines(file, "Canada", 50, new Date("2027-10-01")).notes.join(" ").includes("more than 12 months old"), "measured from the oldest source observation, not the record date");
});

ok("when there is no range the visitor is told why and pointed to their own price", () => {
  const a = W.lines(file, "", 50, NOW), b = W.lines(null, "US", 50, NOW), c = W.lines(file, "Mexico", 50, NOW);
  assert.deepEqual([a.ok, a.reason, b.ok, b.reason, c.ok, c.reason], [false, "no-country", false, "not-loaded", false, "no-market"]);
  for (const x of [a, b, c]) assert.ok(x.message.includes("Advanced settings"), x.message);
});

ok("the beginner wall-area text drops its 'not available yet' line only when the page handles the cost", () => {
  const res = B.area([{ label: "R", wallHeight: 2.4, trimAllowance: 0, walls: [{ width: 8 }, { width: 4 }, { width: 8 }, { width: 4 }] }], "m");
  assert.ok(B.lines(res).notes.join(" ").includes("not available yet"));
  const handled = B.lines(res, true); assert.ok(!handled.notes.join(" ").includes("not available yet")); assert.equal(handled.notes.length, 2);
});

ok("source: no storage, eval or tracking; the only network call is the build copy of the approved assumptions", () => {
  const src = fs.readFileSync(path.join(root, "website", "wallpaper-reference.js"), "utf8");
  for (const bad of ["localStorage", "sessionStorage", "indexedDB", "XMLHttpRequest", "eval(", "document.cookie", "sendBeacon", "WebSocket", "innerHTML"]) assert.ok(!src.includes(bad), bad);
  assert.equal((src.match(/fetch\(/g) || []).length, 1); assert.ok(src.includes('fetch("reference-assumptions.json"'));
});

const html = fs.readFileSync(path.join(root, "website", "home-project-calculator.html"), "utf8");
ok("the Wallpaper tab shows the cost block only on the beginner path, built with text nodes", () => {
  assert.ok(html.indexOf("wallpaper-beginner.js") < html.indexOf("wallpaper-reference.js") && html.indexOf("wallpaper-reference.js") < html.lastIndexOf("<script>"));
  const begin = html.slice(html.indexOf("function wpBeginner()"), html.indexOf("function wpRenderCompare"));
  assert.ok(begin.includes("window.hpwWallpaperCost") && begin.indexOf("window.hpwWallpaperCost") < begin.indexOf("B.lines(res,!!cost)") && begin.includes("wpRenderCost(out,cost)"));
  assert.ok(!begin.includes("innerHTML") && !begin.includes("fetch(") && !begin.includes("localStorage"));
  assert.ok(html.indexOf("wpBeginner();return;") < html.indexOf("WP.estimateWallpaperProject(input)"), "the exact roll calculation is untouched and still comes after the beginner path");
});

(async () => {
  await okA("init exposes the cost for the visitor's chosen country, from preloaded data or from the build copy, and never throws", async () => {
    const win = { hpwRegion: "Germany" }; W.init(win, { file });
    assert.equal(win.hpwWallpaperCost({ netM2: 40 }).estimate.cost.currency, "EUR"); win.hpwRegion = "UK"; assert.equal(win.hpwWallpaperCost({ netM2: 40 }).estimate.cost.currency, "GBP");
    win.hpwRegion = ""; assert.equal(win.hpwWallpaperCost({ netM2: 40 }).reason, "no-country");
    let asked = null; const w2 = { hpwRegion: "France", fetch: (u) => { asked = u; return Promise.resolve({ ok: true, json: () => Promise.resolve(file) }); } };
    W.init(w2); assert.equal(w2.hpwWallpaperCost({ netM2: 40 }).reason, "not-loaded"); await new Promise((r) => setTimeout(r, 5));
    assert.equal(asked, "reference-assumptions.json"); assert.equal(w2.hpwWallpaperCost({ netM2: 40 }).ok, true);
    const w3 = { hpwRegion: "France", fetch: () => Promise.reject(new Error("offline")) }; W.init(w3); await new Promise((r) => setTimeout(r, 5)); assert.equal(w3.hpwWallpaperCost({ netM2: 40 }).reason, "not-loaded");
    const w4 = { hpwRegion: "France", fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({ records: [{ category: "paint" }] }) }) }; W.init(w4); await new Promise((r) => setTimeout(r, 5)); assert.equal(w4.hpwWallpaperCost({ netM2: 40 }).reason, "not-loaded", "a file without the wallpaper approval block is not accepted");
    assert.equal(W.init(null), null);
  });
  console.log("\n" + n + " wallpaper-reference tests passed");
})().catch((e) => { console.error(e); process.exit(1); });
