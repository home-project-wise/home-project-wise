"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const model = require("../website/room-to-ready.js");
const engine = require("../website/project-estimator-engine.js");
const projectList = require("../website/project-list.js");

const room = { unit: "m", length: 15, width: 8, height: 4, openings: 6 };
function ref(low, high, unit, id) {
  return { kind: "editorial-range", currency: "EUR", unit, low, high,
    source: { id: id || "sample", name: "Reviewed source sample", geography: "Germany", geographyResolution: "national", observedAt: "2026-11-15", url: "https://example.com/source" } };
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

test("visitor-confirmed prices are identified separately from references", () => {
  const p = model.buildPlan({ market: "Germany", room, flooring: { price: { kind: "user-input", currency: "EUR", unit: "m²", amount: 2 } } }, engine);
  assert.equal(p.estimate.lineItems[0].priceKind, "user-input");
  assert.equal(p.knownMaterialSubtotal.low, 240);
  assert.equal(p.sources.length, 0);
});

test("reference provenance links survive into the plan", () => {
  const p = model.buildPlan({ market: "Germany", room, flooring: { price: ref(10, 12, "m²", "floor") } }, engine);
  assert.equal(p.sources.length, 1);
  assert.equal(p.sources[0].urls[0], "https://example.com/source");
});

test("Room-to-Ready items join the Project List basket and keep provenance", () => {
  const plan = model.buildPlan({ market: "Germany", room, flooring: { price: ref(10, 12, "m²", "floor") },
    wallFinish: "paint", paintCoats: 2, paintPrice: ref(1, 2, "m²/coat", "paint") }, engine);
  const state = projectList.createState();
  assert.equal(projectList.setRoomPlan(state, plan), true);
  const result = projectList.summarize(state, engine);
  assert.equal(result.ok, true);
  assert.equal(result.estimate.currency, "EUR");
  assert.equal(result.estimate.lineItems.length, 2);
  assert.equal(result.estimate.subtotalLow, 1556);
  assert.equal(result.roomPlanSources.length, 2);
  assert.match(result.lines.join(" "), /Flooring/);
  assert.match(result.lines.join(" "), /Wall paint/);
});

test("Project List refuses to combine a room plan with a different currency", () => {
  const plan = model.buildPlan({ market: "Germany", room, wallFinish: "wallpaper",
    wallpaperPrice: ref(3, 4, "m²", "wallpaper") }, engine);
  const state = projectList.createState();
  projectList.addItem(state, { name: "Brushes", unit: "set", quantity: 1, price: 5 });
  projectList.setRoomPlan(state, plan);
  assert.match(projectList.summarize(state, engine).error, /currencies are never converted/);
});

test("unknown Room-to-Ready work stays unknown in the combined Project List", () => {
  const plan = model.buildPlan({ market: "Germany", room, wallFinish: "wallpaper" }, engine);
  const state = projectList.createState();
  projectList.setRoomPlan(state, plan);
  const result = projectList.summarize(state, engine);
  assert.equal(result.estimate.unknownRequired.length, 1);
  assert.match(result.lines.join(" "), /price not known yet/);
  assert.match(result.totals.join(" "), /No prices yet/);
});
