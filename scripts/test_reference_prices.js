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
  const elec = { category: "electricity", kind: "government-benchmark", unit: "kWh", subtype: null, jurisdiction: "US-CT", tariffPlan: "EIA-RESIDENTIAL-AVERAGE" };
  assert.equal(RP.isAutoEligible(rec(Object.assign({}, elec, { jurisdiction: null }))), false);
  assert.equal(RP.isAutoEligible(rec(Object.assign({}, elec, { tariffPlan: null }))), false);
  assert.equal(RP.isAutoEligible(rec(Object.assign({}, elec, { autoEligible: false }))), false);
  assert.equal(RP.isAutoEligible(rec(elec)), true);
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
const pick = (id) => data.find((r) => r.id === id);
ok("real data: only flooring ranges and electricity benchmarks can be eligible; every denial has a reason", () => {
  const eligible = data.filter(RP.isAutoEligible);
  console.log("   auto-eligible records in the data file: " + eligible.length + " of " + data.length);
  assert.ok(eligible.length > 0);
  assert.ok(eligible.every((r) => (r.category === "flooring" && r.kind === "editorial-range") || (r.category === "electricity" && r.kind === "government-benchmark")));
  assert.ok(eligible.every((r) => RP.BLOCKED_IDS.indexOf(r.id) === -1));
  assert.ok(data.filter((r) => r.kind === "retailer-listing" || r.category === "paint" || r.category === "wallpaper").every((r) => !RP.isAutoEligible(r)));
  assert.ok(RP.BLOCKED_IDS.every((id) => !pick(id) || !RP.isAutoEligible(pick(id))));
  assert.ok(data.filter((r) => !RP.isAutoEligible(r) && !RP.BLOCKED_IDS.includes(r.id) && r.autoEligible === false).every((r) => RP.denyReason(r).length > 10));
});
ok("real data flooring: exact market and subtype only, no substitute", () => {
  const us = RP.select(data, { country: "US", category: "flooring", subtype: "laminate" });
  assert.equal(us.ok, true); assert.equal(us.record.audience, "US"); assert.equal(us.record.currency, "USD");
  const p = RP.packRange(us.record, 20, "sq ft"); assert.ok(Math.abs(p.low - us.record.low * 20) < 1e-3);
  assert.equal(RP.select(data, { country: "Netherlands", category: "flooring", subtype: "ceramic-tile" }).ok, false);
  assert.equal(RP.select(data, { country: "UK", category: "flooring", subtype: "lvp-spc" }).ok, false);
  assert.equal(RP.select(data, { country: "US", category: "flooring", subtype: "carpet-tile" }).ok, false);
  RP.flooringOptions(data, "Canada").forEach((s) => assert.equal(RP.select(data, { country: "Canada", category: "flooring", subtype: s }).ok, true, s));
  data.filter((r) => RP.isAutoEligible(r) && r.category === "flooring").forEach((r) => assert.ok(RP.packRange(r, 1, "m²"), r.id));
});
ok("real data electricity: GB and Northern Ireland are separate; no cross-jurisdiction fallback", () => {
  const gb = RP.selectElectricity(data, { jurisdiction: "GB" }), ni = RP.selectElectricity(data, { jurisdiction: "GB-NIR" });
  assert.equal(gb.ok, true); assert.equal(ni.ok, true); assert.notEqual(gb.record.id, ni.record.id); assert.notEqual(gb.record.tariffPlan, ni.record.tariffPlan);
  const ct = RP.selectElectricity(data, { jurisdiction: "US-CT" }); assert.equal(ct.ok, true); assert.equal(ct.single, true); assert.equal(ct.record.currency, "USD");
  assert.equal(RP.selectElectricity(data, { jurisdiction: "US-ZZ" }).ok, false);
  assert.equal(RP.selectElectricity(data, { jurisdiction: "GB", tariffPlan: "OEB-ONTARIO-TOU" }).ok, false);
  const on = RP.selectElectricity(data, { jurisdiction: "CA-ON", tariffPlan: "OEB-ONTARIO-TOU" }); assert.equal(on.ok, true); assert.equal(on.single, false); assert.equal(on.record.currency, "CAD");
  RP.electricityOptions(data).forEach((o) => o.plans.forEach((pl) => assert.equal(RP.selectElectricity(data, { jurisdiction: o.jurisdiction, tariffPlan: pl }).ok, true, o.jurisdiction + " " + pl)));
  data.filter((r) => RP.isAutoEligible(r) && r.category === "electricity").forEach((r) => assert.equal(String(r.unit).toLowerCase(), "kwh"));
});
console.log("\n" + n + " reference-price tests passed");
