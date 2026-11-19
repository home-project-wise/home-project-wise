"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Soil = require("../website/soil-mulch.js");

test("calculates cubic metres and both imperial volume units from metric bed sections", () => {
  const r = Soil.calculate({ material:"mulch", lengthUnit:"m", sections:[{length:3,width:2},{length:2,width:1}],
    depth:5, depthUnit:"cm", bagVolume:"50", bagUnit:"L" });
  assert.equal(r.areaM2, 8);
  assert.ok(Math.abs(r.areaFt2 - 86.1112833336) < 1e-8);
  assert.equal(r.volumeM3, 0.4);
  assert.ok(Math.abs(r.volumeFt3 - 14.1258666886) < 1e-9);
  assert.equal(r.bags, 8);
});

test("converts feet, inches and cubic yards consistently", () => {
  const r = Soil.calculate({ material:"topsoil", lengthUnit:"ft", sections:[{length:10,width:10}],
    depth:2, depthUnit:"in", bagVolume:"1", bagUnit:"yd3" });
  assert.ok(Math.abs(r.volumeFt3 - (100 * 2 / 12)) < 1e-9);
  assert.ok(Math.abs(r.volumeYd3 - r.volumeFt3 / 27) < 1e-9);
  assert.equal(r.bags, 1);
});

test("does not invent bag count when no label volume is supplied", () => {
  const r = Soil.calculate({ material:"compost", lengthUnit:"m", sections:[{length:4,width:2}], depth:10, depthUnit:"cm", bagVolume:"", bagUnit:"L" });
  assert.equal(r.bags, null);
});

test("keeps mulch, topsoil, raised-bed mix and compost as distinct choices", () => {
  ["mulch","topsoil","raised-bed-mix","compost"].forEach(material => {
    assert.equal(Soil.calculate({ material, lengthUnit:"m", sections:[{length:1,width:1}], depth:1, depthUnit:"cm" }).material, material);
  });
});

test("rejects missing or non-positive geometry, depth and bag volume", () => {
  const base = { material:"mulch", lengthUnit:"m", sections:[{length:1,width:1}], depth:2, depthUnit:"cm", bagVolume:"", bagUnit:"L" };
  assert.throws(() => Soil.calculate({...base, sections:[]}), /at least one/);
  assert.throws(() => Soil.calculate({...base, sections:[{length:0,width:1}]}), /length/);
  assert.throws(() => Soil.calculate({...base, depth:0}), /depth/);
  assert.throws(() => Soil.calculate({...base, bagVolume:0}), /Bag volume/);
});

test("uses a shared room only when the visitor explicitly activates the button", () => {
  const src = require("node:fs").readFileSync(require("node:path").join(__dirname,"..","website","soil-mulch.js"),"utf8");
  assert.match(src, /soil-use-room/);
  assert.match(src, /win\.hpwRoom/);
});

test("leads with the visitor-selected unit system and keeps both equivalents visible", () => {
  const metric = Soil.calculate({ material:"mulch", lengthUnit:"m", sections:[{length:2,width:1}], depth:5, depthUnit:"cm" });
  const metricDisplay = Soil.formatVolume(metric, "m");
  assert.match(metricDisplay.primary, /0.1 m³/);
  assert.match(metricDisplay.imperial, /yd³.*ft³/);
  const imperial = Soil.calculate({ material:"mulch", lengthUnit:"ft", sections:[{length:10,width:10}], depth:2, depthUnit:"in" });
  const imperialDisplay = Soil.formatVolume(imperial, "ft");
  assert.match(imperialDisplay.primary, /yd³.*ft³/);
  assert.match(imperialDisplay.metric, /m³/);
});

test("shows litres for small positive metric volumes instead of a rounded zero", () => {
  const r = Soil.calculate({ material:"compost", lengthUnit:"m", sections:[{length:0.1,width:0.1}], depth:1, depthUnit:"cm" });
  const display = Soil.formatVolume(r, "m");
  assert.match(display.primary, /0.1 L/);
  assert.doesNotMatch(display.primary, /^0 m³/);
});

test("capitalises material labels for visitor-facing results", () => {
  assert.equal(Soil.materialLabel("raised-bed-mix"), "Raised bed mix");
  assert.equal(Soil.materialLabel("mulch"), "Mulch");
});

test("warns that using shared room dimensions replaces additional bed sections", () => {
  const src = require("node:fs").readFileSync(require("node:path").join(__dirname,"..","website","soil-mulch.js"),"utf8");
  assert.match(src, /replaces extra sections/);
});
