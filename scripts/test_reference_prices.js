// Tests for website/reference-prices.js against docs/CALCULATOR-REFERENCE-PRICE-DATA-CONTRACT-2026-11-14.md.
// Run: node scripts/test_reference_prices.js   (reads data/reference_prices.json; never writes it)
"use strict";
const assert = require("node:assert/strict");
const fs = require("fs"), path = require("path");
const RP = require("../website/reference-prices.js");
const E = require("../website/project-estimator-engine.js");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "reference_prices.json"), "utf8"));
const NOW = new Date(Date.UTC(2026, 10, 14));
let n = 0; function ok(name, fn) { fn(); n++; console.log("PASS " + name); }
const rec = (o) => Object.assign({ id: "T-1", audience: "US", category: "flooring", subtype: "laminate", autoEligible: true, item: "Laminate", unit: "sq ft", currency: "USD", low: 2, high: 3, kind: "editorial-range",
  source: { id: "S", name: "Survey", publisher: "P", url: "https://example.com", geography: "United States", geographyResolution: "national", observedAt: "2026-07-14", retrievedAt: "2026-11-14" } }, o);

ok("area conversion: sq ft price to pack price, coverage in sq ft or m2", () => {
  const p1 = RP.packRange(rec({ low: 2, high: 3 }), 20, "sq ft"); assert.deepEqual([p1.low, p1.high, p1.unit, p1.currency], [40, 60, "pack", "USD"]);
  const p2 = RP.packRange(rec({ low: 2, high: 3 }), 2, "m²"); assert.ok(Math.abs(p2.low - 2 * 2 * 10.7639104167) < 1e-3 && Math.abs(p2.high - 3 * 2 * 10.7639104167) < 1e-3, JSON.stringify(p2));
});
ok("area conversion: m2 price to pack price, coverage in m2 or sq ft", () => {
  const r = rec({ unit: "m²", currency: "EUR", low: 20, high: 30 });
  const a = RP.packRange(r, 1.5, "m²"); assert.deepEqual([a.low, a.high, a.currency], [30, 45, "EUR"]);
  const b = RP.packRange(r, 1.5 * RP.SQFT_PER_M2, "sq ft"); assert.ok(Math.abs(b.low - 30) < 1e-3 && Math.abs(b.high - 45) < 1e-3);
});
ok("bad coverage, unknown units and invalid ranges give no pack price", () => {
  assert.equal(RP.packRange(rec(), 0, "sq ft"), null); assert.equal(RP.packRange(rec(), 20, "gallon"), null);
  assert.equal(RP.packRange(rec({ unit: "gallon" }), 20, "sq ft"), null); assert.equal(RP.packRange(rec({ low: 5, high: 1 }), 20, "sq ft"), null);
});
ok("selection is deny-by-default: needs structured subtype and autoEligible, exact country and subtype", () => {
  const q = { country: "US", category: "flooring", subtype: "laminate" };
  assert.equal(RP.select([rec()], q).ok, true);
  assert.equal(RP.select([rec({ subtype: undefined })], q).ok, false);
  assert.equal(RP.select([rec({ autoEligible: false })], q).ok, false);
  assert.equal(RP.select([rec({ autoEligible: undefined })], q).ok, false);
  assert.equal(RP.select([rec({ audience: "Canada", currency: "CAD" })], q).ok, false);
  assert.equal(RP.select([rec()], Object.assign({}, q, { subtype: "lvp-spc" })).ok, false);
  assert.equal(RP.select([rec()], Object.assign({}, q, { subtype: "porcelain-tile" })).ok, false);
  assert.equal(RP.select([rec()], q).record.id, "T-1");
  assert.equal(RP.select([], q).message, RP.NO_REFERENCE);
});
ok("the ten section-10.1 exclusions are denied even if flagged eligible", () => {
  assert.equal(RP.BLOCKED_IDS.length, 10);
  RP.BLOCKED_IDS.forEach((id) => assert.equal(RP.isAutoEligible(rec({ id })), false, id));
});
ok("retailer listings, paint, wallpaper and electricity are never automatic category references", () => {
  assert.equal(RP.isAutoEligible(rec({ kind: "retailer-listing" })), false);
  assert.equal(RP.isAutoEligible(rec({ category: "paint" })), false);
  assert.equal(RP.isAutoEligible(rec({ category: "wallpaper" })), false);
  assert.equal(RP.isAutoEligible(rec({ category: "electricity", kind: "government-benchmark", unit: "kWh" })), false);
});
ok("newest observation wins; an exact tie is ambiguous and returns nothing; records are never averaged", () => {
  const q = { country: "US", category: "flooring", subtype: "laminate" };
  const older = rec({ id: "A", low: 1, high: 2, source: Object.assign({}, rec().source, { observedAt: "2026-03-01" }) });
  const newer = rec({ id: "B", low: 4, high: 5 });
  const r = RP.select([older, newer], q); assert.equal(r.record.id, "B"); assert.equal(r.record.low, 4);
  assert.equal(RP.select([rec({ id: "C" }), rec({ id: "D" })], q).ok, false);
});
ok("records older than 12 months from observedAt are labelled older data, whatever retrievedAt says", () => {
  const old = rec({ source: Object.assign({}, rec().source, { observedAt: "2025-10-01", retrievedAt: "2026-11-14" }) });
  assert.equal(RP.isOlderData(old, NOW), true); assert.equal(RP.describe(old, NOW).older, true);
  assert.equal(RP.isOlderData(rec({ source: Object.assign({}, rec().source, { observedAt: "2025-11-20" }) }), NOW), false);
  assert.equal(RP.isOlderData(rec({ source: Object.assign({}, rec().source, { observedAt: "bad" }) }), NOW), true);
});
ok("attribution and the required disclaimer stay with the selected record", () => {
  const d = RP.describe(rec(), NOW);
  assert.equal(d.sourceName, "Survey"); assert.equal(d.url, "https://example.com"); assert.equal(d.observedAt, "2026-07-14"); assert.equal(d.retrievedAt, "2026-11-14");
  assert.ok(d.disclaimer.startsWith("This is a rough planning estimate") && d.disclaimer.includes("not a quote or a final cost"));
  assert.ok(d.range.includes("USD per sq ft"));
});
ok("engine accepts the adapter price; the reference range gives a material total range, no midpoint", () => {
  const price = RP.toEnginePrice(rec({ low: 2, high: 3 }), 20, "sq ft");
  const est = E.calculateEstimate({ currency: "USD", contingencyPct: 0, lineItems: [{ id: "f", name: "Laminate", quantity: 11, unit: "pack", required: true, price }] });
  assert.equal(est.subtotalLow, 440); assert.equal(est.subtotalHigh, 660);
  assert.ok(!("median" in RP) && !("midpoint" in RP) && !("convertCurrency" in RP));
});
ok("a user price or two quotes stay separate from a reference (no blending path exists)", () => {
  const user = { kind: "user-range", currency: "USD", unit: "pack", low: 30, high: 35 };
  const est = E.calculateEstimate({ currency: "USD", contingencyPct: 0, lineItems: [{ id: "f", name: "Laminate", quantity: 2, unit: "pack", required: true, price: user }] });
  assert.equal(est.subtotalLow, 60); assert.equal(est.subtotalHigh, 70);
});
ok("source has no network, storage or eval calls", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "website", "reference-prices.js"), "utf8");
  for (const bad of ["fetch(", "XMLHttpRequest", "localStorage", "sessionStorage", "indexedDB", "eval(", "document."]) assert.ok(!src.includes(bad), bad);
});
ok("the real data file meets the contract's structural rules (audit, read-only)", () => {
  const problems = RP.validateDataset(data, NOW);
  assert.deepEqual(problems, [], problems.slice(0, 10).join("\n"));
});
ok("no real record is auto-selectable until the data owner adds structured subtype and autoEligible", () => {
  const eligible = data.filter(RP.isAutoEligible);
  console.log("   auto-eligible records in the data file: " + eligible.length + " of " + data.length);
  assert.ok(eligible.every((r) => r.kind === "editorial-range" && r.category === "flooring" && RP.BLOCKED_IDS.indexOf(r.id) === -1));
});
console.log("\n" + n + " reference-price tests passed");
