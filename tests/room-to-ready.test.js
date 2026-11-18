"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const model = require("../website/room-to-ready.js");
const engine = require("../website/project-estimator-engine.js");

const room = { unit: "m", length: 15, width: 8, height: 4, openings: 6 };
function ref(low, high, unit, id) {
  return { kind: "editorial-range", currency: "EUR", unit, low, high,
    source: { id: id || "sample", name: "Reviewed source sample", geography: "Germany", geographyResolution: "national", observedAt: "2026-11-15" } };
}

test("calculates floor and net wall area from one shared room", () => {
  const a = model.roomAreas(room);
  assert.equal(a.floorM2, 120);
  assert.equal(a.wallGrossM2, 184);
  assert.equal(a.wallNetM2, 178);
  assert.equal(a.wallAreaKnown, true);
});

test("converts feet dimensions and openings to square metres", () => {
  const a = model.roomAreas({ unit: "ft", length: 15, width: 8, height: 9, openings: 20 });
  assert.ok(Math.abs(a.floorM2 - 11.1483648) < 1e-8);
  assert.ok(Math.abs(a.wallNetM2 - (2 * (15 + 8) * 9 - 20) * 0.09290304) < 1e-8);
});

test("adds a flooring and paint range using net wall area and coat count", () => {
  const p = model.buildPlan({ market: "Germany", room, flooring: { price: ref(10, 12, "m²", "floor") },
    wallFinish: "paint", paintCoats: 2, paintPrice: ref(1, 2, "m²/coat", "paint") }, engine);
  assert.equal(p.estimate.lineItems.length, 2);
  assert.equal(p.estimate.lineItems[0].totalLow, 1200);
  assert.equal(p.estimate.lineItems[1].quantity, 356);
  assert.equal(p.knownMaterialSubtotal.low, 1556);
  assert.equal(p.knownMaterialSubtotal.high, 2152);
  assert.equal(p.isIncomplete, false);
});

test("wallpaper is priced as the only wall finish and uses net wall area", () => {
  const p = model.buildPlan({ market: "Germany", room, wallFinish: "wallpaper",
    wallpaperPrice: ref(3, 4, "m²", "wallpaper") }, engine);
  assert.equal(p.estimate.lineItems.length, 1);
  assert.equal(p.estimate.lineItems[0].quantity, 178);
  assert.equal(p.knownMaterialSubtotal.low, 534);
  assert.equal(p.knownMaterialSubtotal.high, 712);
});

test("selected work with no price remains an unknown, not a zero", () => {
  const p = model.buildPlan({ market: "Germany", room, wallFinish: "paint", paintCoats: 2 }, engine);
  assert.equal(p.knownMaterialSubtotal.low, 0);
  assert.equal(p.unknownRequired.length, 1);
  assert.equal(p.isIncomplete, true);
  assert.match(p.disclaimer, /not counted as zero/);
});

test("missing wall height creates an explicit unmeasured unknown", () => {
  const p = model.buildPlan({ market: "Germany", room: { unit: "m", length: 15, width: 8, height: null, openings: 0 },
    wallFinish: "wallpaper", wallpaperPrice: ref(3, 4, "m²", "wallpaper") }, engine);
  assert.equal(p.areas.wallNetM2, null);
  assert.equal(p.estimate.unknownRequired[0].name, "Wallpaper (wall area not measured)");
  assert.equal(p.estimate.lineItems.length, 0);
});

test("electricity remains separate from the one-time materials subtotal", () => {
  const p = model.buildPlan({ market: "Germany", room, flooring: { price: ref(10, 12, "m²", "floor") },
    electricity: { low: 20, high: 35, currency: "EUR", period: "month" } }, engine);
  assert.equal(p.knownMaterialSubtotal.low, 1200);
  assert.equal(p.electricity.low, 20);
  assert.equal(p.electricity.excludedFromMaterialsSubtotal, true);
});

test("rejects unsupported market and mixed currency", () => {
  assert.throws(() => model.buildPlan({ market: "Tunisia", room, flooring: { price: null } }, engine), /supported market/);
  assert.throws(() => model.buildPlan({ market: "Germany", room, flooring: { price: { ...ref(1, 2, "m²"), currency: "USD" } } }, engine), /currency\/unit/);
});

test("rejects an attempt to select paint and wallpaper as one wall finish", () => {
  assert.throws(() => model.buildPlan({ market: "Germany", room, wallFinish: ["paint", "wallpaper"] }, engine), /Choose paint OR wallpaper/);
});

test("does not invent wall area when the opening area exceeds the gross wall area", () => {
  assert.throws(() => model.roomAreas({ unit: "m", length: 2, width: 2, height: 2, openings: 40 }), /smaller than the total wall area/);
});
