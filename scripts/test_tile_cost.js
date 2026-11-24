"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Tile = require("../website/tile.js");
const Currency = require("../website/currency.js");
const records = require("../data/reference_prices.json");

const area = { areaM2: 18, areaFt2: 193.7504 };

test("UK ceramic tile uses the exact-market GBP per-m² range", () => {
  const selected = Tile.selectTileReference(records, "UK", "ceramic-tile");
  assert.equal(selected.ok, true);
  assert.equal(selected.record.currency, "GBP");
  assert.equal(selected.record.unit, "m²");
  assert.deepEqual([selected.record.low, selected.record.high], [12, 50.6]);
  assert.equal(Tile.selectTileReference(records, "UK", "laminate").ok, false);
  const cost = Tile.estimateMaterialCost({ records, country: "UK", subtype: "ceramic-tile", ...area, areaUnit: "m²" });
  assert.deepEqual([cost.kind, cost.currency, cost.areaCost.low, cost.areaCost.high], ["reference", "GBP", 216, 910.8]);
  assert.equal(cost.displayOnly, false);
});

test("US ceramic tile converts an exact-market per-sq-ft range to the visitor area", () => {
  const cost = Tile.estimateMaterialCost({ records, country: "US", subtype: "ceramic-tile", areaM2: 11.14836, areaFt2: 120, areaUnit: "sq ft" });
  assert.deepEqual([cost.currency, cost.areaCost.low, cost.areaCost.high], ["USD", 129.6, 310.8]);
});

test("Canada porcelain display-only sample stays labelled and keeps CAD", () => {
  const selected = Tile.selectTileReference(records, "Canada", "porcelain-tile");
  assert.equal(selected.ok, true);
  assert.equal(selected.displayOnly, true);
  assert.equal(selected.record.sample.count, 2);
  const cost = Tile.estimateMaterialCost({ records, country: "Canada", subtype: "porcelain-tile", areaM2: 11.14836, areaFt2: 120, areaUnit: "sq ft" });
  assert.deepEqual([cost.displayOnly, cost.currency, cost.areaCost.low, cost.areaCost.high], [true, "CAD", 214.8, 859.2]);
  assert.equal(cost.description.sample.count, 2);
});

test("a missing exact-market tile subtype does not borrow another country's price", () => {
  const cost = Tile.estimateMaterialCost({ records, country: "Netherlands", subtype: "porcelain-tile", ...area, areaUnit: "m²" });
  assert.equal(cost.areaCost, null);
  assert.match(cost.message, /Netherlands/);
  assert.match(cost.message, /no price from another country/);
});

test("visitor-entered per-area price replaces a reference range", () => {
  const cost = Tile.estimateMaterialCost({ records, country: "UK", subtype: "ceramic-tile", ...area, areaUnit: "m²", manualPrice: "25" });
  assert.deepEqual([cost.kind, cost.currency, cost.areaCost.low, cost.areaCost.high], ["manual", "GBP", 450, 450]);
  assert.equal(cost.record, null);
  assert.match(cost.message, /replaces the reference range/);
});

test("manual per-area price works when the selected market has no reference", () => {
  const cost = Tile.estimateMaterialCost({ records, country: "Netherlands", subtype: "porcelain-tile", ...area, areaUnit: "m²", manualPrice: "31.5" });
  assert.deepEqual([cost.kind, cost.currency, cost.areaCost.low, cost.areaCost.high], ["manual", "EUR", 567, 567]);
});

test("pack price is a separate optional line based only on the computed box count", () => {
  const cost = Tile.estimateMaterialCost({ records, country: "UK", subtype: "ceramic-tile", ...area, areaUnit: "m²", packPrice: "30", boxes: 12 });
  assert.equal(cost.areaCost.low, 216);
  assert.equal(cost.areaCost.high, 910.8);
  assert.equal(cost.packTotal, 360);
  assert.equal(cost.packCount, 12);
  const noBoxes = Tile.estimateMaterialCost({ records, country: "UK", subtype: "ceramic-tile", ...area, areaUnit: "m²", packPrice: "30", boxes: null });
  assert.equal(noBoxes.packTotal, null);
  assert.match(noBoxes.packMessage, /box coverage/);
});

test("manual price is not silently relabelled when the floor unit changes", () => {
  const src = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "website", "tile.js"), "utf8");
  assert.match(src, /lastManualUnit/);
  assert.match(src, /manualPrice\.value = ""/);
  assert.match(src, /Your material price per /);
});

test("shared-room dimensions sync without a Tile-specific button; region changes clear manual prices", () => {
  const src = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "website", "tile.js"), "utf8");
  assert.match(src, /syncSharedRoomFromFields/);
  assert.match(src, /room-length/);
  assert.match(src, /hpw-room/);
  assert.match(src, /hpw-region/);
  assert.match(src, /syncCurrency\(true\)/);
});

test("currency formatter keeps the visitor's selected market currency; no FX fallback", () => {
  assert.equal(Currency.codeForMarket("UK"), "GBP");
  assert.equal(Currency.codeForMarket("Canada"), "CAD");
  assert.equal(Currency.codeForMarket("Netherlands"), "EUR");
  assert.equal(Currency.codeForMarket("Australia"), "");
  const unsupported = Tile.estimateMaterialCost({ records, country: "Australia", subtype: "ceramic-tile", ...area, areaUnit: "m²", manualPrice: "20" });
  assert.equal(unsupported.areaCost, null);
  assert.match(unsupported.message, /Choose your country/);
});

test("tile material price is based on net area plus only the visitor-entered allowance", () => {
  const noAllowance = Tile.calculate({ lengthUnit: "m", sections: [{ length: 5, width: 4 }], openings: [], waste: "", tileLength: "", tileWidth: "", joint: "", boxCoverage: "", coverageUnit: "m2" });
  const withAllowance = Tile.calculate({ lengthUnit: "m", sections: [{ length: 5, width: 4 }], openings: [], waste: "10", tileLength: "", tileWidth: "", joint: "", boxCoverage: "", coverageUnit: "m2" });
  assert.equal(noAllowance.netAreaM2, 20);
  assert.equal(noAllowance.adjustedAreaM2, 20);
  assert.equal(withAllowance.adjustedAreaM2, 22);
  const cost = Tile.estimateMaterialCost({ records, country: "UK", subtype: "ceramic-tile", areaM2: withAllowance.adjustedAreaM2, areaFt2: withAllowance.adjustedAreaFt2, areaUnit: "m²" });
  assert.deepEqual([cost.areaCost.low, cost.areaCost.high], [264, 1113.2]);
});

test("manual and pack prices must be positive and no missing price is returned as zero", () => {
  const base = { records, country: "UK", subtype: "ceramic-tile", ...area, areaUnit: "m²" };
  assert.throws(() => Tile.estimateMaterialCost({ ...base, manualPrice: "0" }), /greater than zero/);
  assert.throws(() => Tile.estimateMaterialCost({ ...base, manualPrice: "-1" }), /greater than zero/);
  assert.throws(() => Tile.estimateMaterialCost({ ...base, packPrice: "0" }), /greater than zero/);
  const missing = Tile.estimateMaterialCost({ ...base, country: "Netherlands", subtype: "porcelain-tile" });
  assert.equal(missing.areaCost, null);
  assert.equal(missing.kind, "unpriced");
});

test("reference prices that are not loaded are not reported as a missing market range", () => {
  const cost = Tile.estimateMaterialCost({ records: null, country: "UK", subtype: "ceramic-tile", ...area, areaUnit: "m²" });
  assert.equal(cost.areaCost, null);
  assert.equal(cost.kind, "unpriced");
  assert.match(cost.message, /not available right now/);
  assert.doesNotMatch(cost.message, /No reference range is available/);
  const manual = Tile.estimateMaterialCost({ records: null, country: "UK", subtype: "ceramic-tile", ...area, areaUnit: "m²", manualPrice: "25" });
  assert.deepEqual([manual.kind, manual.areaCost.low], ["manual", 450]);
});

test("a reference record whose currency is not the selected market's currency is never shown", () => {
  const uk = records.find((r) => r.audience === "UK" && r.subtype === "ceramic-tile" && r.autoEligible);
  const wrong = [{ ...uk, currency: "EUR" }];
  const cost = Tile.estimateMaterialCost({ records: wrong, country: "UK", subtype: "ceramic-tile", ...area, areaUnit: "m²" });
  assert.equal(cost.areaCost, null);
  assert.match(cost.message, /not in your market's currency/);
});

