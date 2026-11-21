// Tests for website/reference-prices.js against docs/CALCULATOR-REFERENCE-PRICE-DATA-CONTRACT-2026-11-14.md.
// Run: node scripts/test_reference_prices.js   (reads data/reference_prices.json; never writes it)
"use strict";
const assert = require("node:assert/strict");
const fs = require("fs"), path = require("path");
const RP = require("../website/reference-prices.js");
const E = require("../website/project-estimator-engine.js");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "reference_prices.json"), "utf8"));
const NOW = new Date(Date.UTC(2026, 10, 20));
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
  assert.equal(RP.select(data, { country: "Netherlands", category: "flooring", subtype: "ceramic-tile" }).ok, false); assert.equal(RP.selectDisplayOnly(data, { country: "Netherlands", category: "flooring", subtype: "ceramic-tile" }).ok, true);
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
ok("areaCost: price range per area times the area, converting only sq ft and m2, never currency", () => {
  const r = rec({ unit: "sq ft", low: 2, high: 3 });
  const a = RP.areaCost(r, 100, "sq ft"); assert.deepEqual([a.low, a.high, a.currency], [200, 300, "USD"]);
  const b = RP.areaCost(r, 10, "m²"); assert.ok(Math.abs(b.low - 10 * RP.SQFT_PER_M2 * 2) < 0.01 && Math.abs(b.high - 10 * RP.SQFT_PER_M2 * 3) < 0.01);
  const c = RP.areaCost(rec({ unit: "m²", currency: "EUR", low: 20, high: 30 }), 1000, "sq ft"); assert.ok(Math.abs(c.low - 20 * 92.90304) < 0.01 && Math.abs(c.high - 30 * 92.90304) < 0.01 && c.currency === "EUR");
  assert.equal(RP.areaCost(r, 0, "sq ft"), null); assert.equal(RP.areaCost(r, 10, "gallon"), null); assert.equal(RP.areaCost(rec({ unit: "gallon" }), 10, "sq ft"), null); assert.equal(RP.areaCost(rec({ low: 5, high: 1 }), 10, "sq ft"), null);
});
ok("flooringCountries lists only countries with an eligible flooring range", () => {
  const cs = RP.flooringCountries(data); assert.ok(cs.includes("US") && cs.every((c) => data.some((r) => RP.isAutoEligible(r) && r.category === "flooring" && r.audience === c)));
  assert.deepEqual(RP.flooringCountries([rec({ autoEligible: false })]), []);
});
ok("toEngineAreaPrice: price per area in the item's unit, no currency conversion; the engine agrees with areaCost", () => {
  const r = rec({ unit: "sq ft", low: 2, high: 3 });
  const same = RP.toEngineAreaPrice(r, "sq ft"); assert.deepEqual([same.kind, same.unit, same.low, same.high, same.currency], ["editorial-range", "sq ft", 2, 3, "USD"]);
  const m2 = RP.toEngineAreaPrice(r, "m²"); assert.ok(Math.abs(m2.low - 2 * RP.SQFT_PER_M2) < 1e-3 && m2.unit === "m²");
  const est = E.calculateEstimate({ currency: "USD", contingencyPct: 0, lineItems: [{ id: "f", name: "Floor", quantity: 10, unit: "m²", required: true, price: m2 }] });
  const ac = RP.areaCost(r, 10, "m²"); assert.ok(Math.abs(est.subtotalLow - ac.low) < 0.01 && Math.abs(est.subtotalHigh - ac.high) < 0.01);
  const eur = RP.toEngineAreaPrice(rec({ unit: "m²", currency: "EUR", low: 20, high: 30 }), "sq ft"); assert.ok(Math.abs(eur.low - 20 * RP.M2_PER_SQFT) < 1e-3 && eur.currency === "EUR");
  assert.equal(RP.toEngineAreaPrice(r, "gallon"), null); assert.equal(RP.toEngineAreaPrice(rec({ unit: "gallon" }), "sq ft"), null); assert.equal(RP.toEngineAreaPrice(rec({ low: 5, high: 1 }), "sq ft"), null);
});

ok("strong tile samples alone are auto-eligible; weaker exact-market examples are display-only", () => {
  const strong = [
    ["US","ceramic-tile","USD","sq ft",1.08,2.59,15],
    ["UK","ceramic-tile","GBP","m²",12,50.60,20]
  ];
  strong.forEach(([country,subtype,currency,unit,low,high,count]) => {
    const s = RP.select(data,{country,category:"flooring",subtype});
    assert.equal(s.ok,true,country+" "+subtype);
    assert.equal(s.record.currency,currency); assert.equal(s.record.unit,unit);
    assert.equal(s.record.low,low); assert.equal(s.record.high,high);
    assert.equal(s.record.sample.count,count); assert.equal(s.record.autoEligible,true);
    assert.ok(s.record.source.url.startsWith("https://"));
  });
  const display = [
    ["US","porcelain-tile","USD","sq ft",1.49,16.43],
    ["Canada","ceramic-tile","CAD","sq ft",2.37,23.16],
    ["Canada","porcelain-tile","CAD","sq ft",1.79,7.16],
    ["UK","porcelain-tile","GBP","m²",29.78,40],
    ["Germany","porcelain-tile","EUR","m²",13.95,59.95],
    ["France","ceramic-tile","EUR","m²",9.99,34.90],
    ["Spain","porcelain-tile","EUR","m²",9.99,35.49],
    ["Italy","porcelain-tile","EUR","m²",13.49,21.99],
    ["Netherlands","ceramic-tile","EUR","m²",17.85,92.85]
  ];
  display.forEach(([country,subtype,currency,unit,low,high]) => {
    const q={country,category:"flooring",subtype}, s=RP.select(data,q), d=RP.selectDisplayOnly(data,q);
    assert.equal(s.ok,false,country+" weak sample must not enter auto pricing");
    assert.equal(d.ok,true,country+" "+subtype+" display-only sample");
    assert.equal(d.record.currency,currency); assert.equal(d.record.unit,unit);
    assert.equal(d.record.low,low); assert.equal(d.record.high,high);
    assert.equal(d.record.sample.count,2); assert.equal(d.record.autoEligible,false); assert.equal(d.record.displayOnly,true);
    assert.equal(RP.flooringOptions(data,country).includes(subtype),false);
    assert.ok(RP.areaCost(d.record,10,unit));
  });
  assert.equal(RP.select(data,{country:"Australia",category:"flooring",subtype:"porcelain-tile"}).ok,false);
  const oldUsPorcelain=pick("US-flooring-porcelain-tile-homedepot-sample-iqr-2026-11-14");
  assert.ok(oldUsPorcelain && oldUsPorcelain.sample.count===12 && oldUsPorcelain.autoEligible===false,"preserve stronger historical IQR audit record and its block");
  assert.equal(RP.select(data,{country:"US",category:"flooring",subtype:"ceramic-tile"}).record.id,"US-flooring-ceramic-tile-vcalc-survey-2026-07-14","do not replace stronger 15-product IQR with weaker sample");
});
ok("tile and paint bands record sample size and method; date ordering cannot be falsified", () => {
  data.filter(r => r.low !== r.high && (r.category==="paint" || (r.category==="flooring" && /^(ceramic|porcelain)-tile$/.test(r.subtype||"")))).forEach(r => {
    assert.ok(r.sample && Number.isInteger(r.sample.count) && r.sample.count > 0, r.id+" sample count");
    assert.ok(r.sample.method && r.sample.statistic && r.sample.description, r.id+" sample method");
    assert.equal(r.sample.representative,false,r.id+" must not claim representativeness");
    if(r.category==="flooring" && /tile$/.test(r.subtype||"") && r.autoEligible) assert.ok(r.sample.count>=10,r.id+" weak tile sample auto eligible");
  });
  assert.equal(pick("UK-flooring-ceramic-tile-catalogue-sample-2026-11-14").source.observedAt,"2026-11-20");
  assert.equal(pick("UK-flooring-porcelain-tile-catalogue-sample-2026-11-14").source.observedAt,"2026-11-20");
  assert.equal(pick("UK-flooring-porcelain-tile-catalogue-sample-2026-11-14").source.retrievedAt,"2026-11-20");
  assert.equal(pick("EU-IT-flooring-porcelain-tile-leroymerlin-2026-11-14").source.observedAt,"2026-11-16");
  assert.equal(pick("EU-IT-flooring-porcelain-tile-leroymerlin-2026-11-14").source.retrievedAt,"2026-11-20");
  const badOrder=rec({source:Object.assign({},rec().source,{observedAt:"2026-11-19",retrievedAt:"2026-11-18"})});
  assert.ok(RP.validateDataset([badOrder],NOW).some(x=>x.includes("retrievedAt precedes observedAt")));
  const future=rec({source:Object.assign({},rec().source,{retrievedAt:"2026-11-21"})});
  assert.ok(RP.validateDataset([future],NOW).some(x=>x.includes("retrievedAt in the future")));
  const missing=rec({category:"paint",low:1,high:2,sample:undefined});
  assert.ok(RP.validateDataset([missing],NOW).some(x=>x.includes("sample.count")));
  const weakEligible=rec({subtype:"porcelain-tile",sample:{count:2,method:"selected",statistic:"observed-min-max",description:"two",representative:false}});
  assert.ok(RP.validateDataset([weakEligible],NOW).some(x=>x.includes("fewer than 10")));
});
ok("paint reference bands are per gallon or litre, market-currency exact, and display-only", () => {
  const cases = [
    ["US-paint-interior-lowes-top-rated-2026-11-20","US","USD","gallon",37.98,49.98],
    ["CA-paint-interior-homedepot-379l-per-litre-2026-11-20","Canada","CAD","L",7.64,12.53],
    ["UK-interior-paint-wickes-listings-2026-11-20","UK","GBP","L",1.70,12.80],
    ["EU-DE-paint-hornbach-listings-2026-11-19","Germany","EUR","L",2.00,7.39],
    ["EU-FR-paint-leroymerlin-white-interior-2026-11-19","France","EUR","L",2.79,4.99],
    ["EU-ES-paint-leroymerlin-interior-range-2026-11-20","Spain","EUR","L",1.11,3.07],
    ["EU-IT-paint-leroymerlin-interior-white-2026-11-20","Italy","EUR","L",1.25,7.12],
    ["EU-NL-paint-gamma-listings-2026-11-14","Netherlands","EUR","L",1.50,10.50]
  ];
  cases.forEach(([id,country,currency,unit,low,high]) => {
    const r = pick(id);
    assert.ok(r,country+" paint range missing");
    assert.equal(r.audience,country,country);
    assert.equal(r.currency,currency,country);
    assert.equal(r.unit,unit,country);
    assert.equal(r.low,low,country);
    assert.equal(r.high,high,country);
    assert.equal(r.autoEligible,false,country);
    assert.equal(RP.isAutoEligible(r),false,country);
    assert.ok(r.autoEligibleReason.includes("does not capture the selected can volume") || r.autoEligibleReason.includes("does not capture"),country);
  });
  const oldUS=pick("US-paint-interior-lowes-top-sellers-iqr-2026-11-14");
  assert.ok(oldUS,"retain the prior stronger US multi-brand sample");
  assert.deepEqual([oldUS.low,oldUS.high,oldUS.sample.count,oldUS.sample.statistic],[41.48,51.98,12,"interquartile-range"]);
  assert.equal(oldUS.source.observedAt,"2026-11-14");
  assert.equal(oldUS.displayOnly,true);
  const currentUS=pick("US-paint-interior-lowes-top-rated-2026-11-20");
  assert.equal(currentUS.sample.count,2);
  assert.ok(currentUS.item.includes("Ovation Plus") && !currentUS.item.includes("top-seller"),"new two-listing one-family sample must not retain the stale top-seller label");
  const ca = data.find(x=>x.id==="CA-paint-interior-homedepot-379l-per-litre-2026-11-20");
  assert.ok(ca.notes.includes("3.79 L") && ca.notes.includes("28.97 ÷ 3.79") && ca.notes.includes("47.47 ÷ 3.79"));
});

console.log("\n" + n + " reference-price tests passed");
