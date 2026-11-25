"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const L = require("../website/project-list.js");
let passed = 0;
function ok(name, fn) { fn(); passed++; console.log("PASS " + name); }
function fresh() { return L.createState(); }
function addManual(state, name, extra) {
  return L.addItem(state, Object.assign({ name, unit: "each", quantity: 2 }, extra || {}));
}
const expected = {
  "smart-home-starter": ["Smart plug", "Smart bulb", "Smart switch or dimmer", "Bridge", "Wireless remote", "Switch cover"],
  "hang-and-mount": ["Stud finder", "Wood screw", "Drywall anchors", "Toggle bolts", "Picture hangers", "French cleat", "Rubber bumpers"]
};
const allowedSources = new Set([
  "what-can-you-plug-into-a-smart-plug",
  "smart-lighting",
  "how-to-hang-large-wall-art-without-damage",
  "how-much-weight-can-drywall-anchors-hold"
]);
ok("the two presets contain exactly the registered article-derived names", () => {
  assert.deepEqual(Object.keys(L.PRESETS), Object.keys(expected));
  for (const [id, names] of Object.entries(expected)) {
    assert.deepEqual(L.PRESETS[id].items.map(x => x.name), names);
    for (const item of L.PRESETS[id].items) {
      assert.ok(item.sources.length > 0, item.name + " has no article source");
      for (const source of item.sources) {
        assert.ok(allowedSources.has(source.slug), source.slug);
        assert.ok(source.title && source.title.trim());
        const article = fs.readFileSync(path.join(__dirname, "..", "website", "articles", source.slug + ".html"), "utf8").toLowerCase();
        assert.ok(article.includes(item.name.toLowerCase()), item.name + " is not verbatim in " + source.slug);
      }
    }
  }
});
ok("preset insertion creates names only with blank quantity, unit, price and quote fields", () => {
  const s = fresh();
  const result = L.addPreset(s, "smart-home-starter");
  assert.equal(result.ok, true);
  assert.deepEqual(s.items.map(x => x.name), expected["smart-home-starter"]);
  for (const item of s.items) {
    assert.equal(item.quantity, "");
    assert.equal(item.unit, "");
    assert.equal(item.price, "");
    assert.equal(item.low, "");
    assert.equal(item.high, "");
    assert.equal(item.currency, "");
    assert.equal(item.mode, "unknown");
    assert.equal(item.category, "");
  }
});
ok("each preset item records its source article and multi-source items retain both sources", () => {
  const s = fresh();
  L.addPreset(s, "hang-and-mount");
  const anchor = s.items.find(x => x.name === "Drywall anchors");
  const cleat = s.items.find(x => x.name === "French cleat");
  assert.deepEqual(anchor.sourceArticles.map(x => x.slug), [
    "how-to-hang-large-wall-art-without-damage",
    "how-much-weight-can-drywall-anchors-hold"
  ]);
  assert.deepEqual(cleat.sourceArticles.map(x => x.slug), [
    "how-to-hang-large-wall-art-without-damage",
    "how-much-weight-can-drywall-anchors-hold"
  ]);
  for (const item of s.items) assert.ok(item.sourceArticles.length > 0);
});
ok("choosing the same preset twice is idempotent and does not duplicate names or sources", () => {
  const s = fresh();
  const first = L.addPreset(s, "smart-home-starter");
  const count = s.items.length;
  const second = L.addPreset(s, "smart-home-starter");
  assert.equal(first.added.length, 6);
  assert.equal(second.added.length, 0);
  assert.equal(second.alreadyPresent.length, 6);
  assert.equal(s.items.length, count);
  assert.equal(s.items.find(x => x.name === "Smart bulb").sourceArticles.length, 1);
});
ok("an existing visitor item is kept with quantity, unit, price and mode unchanged", () => {
  const s = fresh();
  const original = addManual(s, "Smart plug", { quantity: 3, unit: "each", price: 12, currency: "USD" });
  assert.equal(original.ok, true);
  const item = original.item;
  const result = L.addPreset(s, "smart-home-starter");
  assert.equal(result.alreadyPresent.includes("Smart plug"), true);
  assert.equal(s.items.filter(x => x.name.toLowerCase() === "smart plug").length, 1);
  assert.equal(item.quantity, "3");
  assert.equal(item.unit, "each");
  assert.equal(item.price, "12");
  assert.equal(item.mode, "known");
  assert.deepEqual(item.sourceArticles.map(x => x.slug), ["what-can-you-plug-into-a-smart-plug"]);
  assert.equal(s.items.length, 6);
});
ok("a different preset preserves existing items and deduplicates shared names case-insensitively", () => {
  const s = fresh();
  addManual(s, "french CLEAT", { quantity: 1, unit: "piece" });
  const result = L.addPreset(s, "hang-and-mount");
  assert.equal(result.alreadyPresent.includes("French cleat"), true);
  assert.equal(s.items.filter(x => x.name.toLowerCase() === "french cleat").length, 1);
  const cleat = s.items.find(x => x.name.toLowerCase() === "french cleat");
  assert.deepEqual(cleat.sourceArticles.map(x => x.slug), [
    "how-to-hang-large-wall-art-without-damage",
    "how-much-weight-can-drywall-anchors-hold"
  ]);
  assert.equal(cleat.quantity, "1");
  assert.equal(cleat.unit, "piece");
});
ok("the 30-item cap is respected and overflow is reported without deleting existing items", () => {
  const s = fresh();
  for (let i = 0; i < 29; i++) assert.equal(addManual(s, "Existing " + i).ok, true);
  const result = L.addPreset(s, "hang-and-mount");
  assert.equal(s.items.length, 30);
  assert.equal(result.added.length, 1);
  assert.equal(result.skipped.length, 6);
  assert.equal(s.items[0].name, "Existing 0");
});
ok("blank preset unit and quantity block calculation until the visitor supplies them", () => {
  const s = fresh();
  L.addPreset(s, "smart-home-starter");
  assert.throws(() => L.buildEstimateInput(s), /Enter a unit for "Smart plug"/);
  const item = s.items[0];
  L.setField(s, item.id, "unit", "each");
  assert.throws(() => L.buildEstimateInput(s), /Check the quantity for "Smart plug"/);
});
ok("unit can be supplied later and is retained as visitor input", () => {
  const s = fresh();
  L.addPreset(s, "smart-home-starter");
  const item = s.items[0];
  assert.equal(L.setField(s, item.id, "unit", "each"), true);
  assert.equal(L.setField(s, item.id, "quantity", "2"), true);
  assert.equal(item.unit, "each");
  assert.equal(item.quantity, "2");
  assert.equal(L.buildEstimateInput(s).lineItems[0].quantity, 2);
});
ok("unknown preset identifiers are rejected without changing the list", () => {
  const s = fresh();
  assert.equal(L.addPreset(s, "not-a-preset").ok, false);
  assert.equal(s.items.length, 0);
});
ok("source links render beside the item and source provenance enters the copyable summary", () => {
  const s = fresh();
  L.addPreset(s, "hang-and-mount");
  const doc = makeDoc();
  const win = { navigator: {}, hpwRegion: "", hpwLast: {} };
  L.init(doc, { calculateEstimate() { return { currency: "USD" }; } }, win);
  doc.getElementById("plist-preset-hang-mount").handlers.click[0]();
  const html = doc.getElementById("plist-items").innerHTML;
  assert.ok(html.includes('href="articles/how-to-hang-large-wall-art-without-damage.html"'));
  assert.ok(html.includes('href="articles/how-much-weight-can-drywall-anchors-hold.html"'));
  assert.ok(html.includes("Source:"));
  const state = win.hpwProjectListState;
  state.items.forEach(item => { L.setField(state, item.id, "unit", "each"); L.setField(state, item.id, "quantity", "1"); });
  const summary = L.summarize(state, { calculateEstimate(input) {
    return { currency: "USD", lineItems: input.lineItems.map(item => ({ id: item.id, unitPriceLow: 0, unitPriceHigh: 0, totalLow: 0, totalHigh: 0 })), unknownRequired: input.lineItems.map(item => item.name), pricedLineCount: 0 };
  } });
  assert.ok(summary.ok);
  assert.ok(summary.text.includes("Preset item source for Drywall anchor: How to Hang Large Wall Art Without Damaging Your Walls"));
  assert.ok(summary.text.includes("Preset item source for Drywall anchor: How Much Weight Can Drywall Anchors Hold?"));
});
ok("preset controls are present in the existing project-list module without page or CSS edits", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "website", "project-list.js"), "utf8");
  assert.ok(src.includes("plist-preset-smart-home"));
  assert.ok(src.includes("plist-preset-hang-mount"));
  assert.ok(src.includes("sourceArticles"));
  assert.ok(!src.includes("localStorage") && !src.includes("sessionStorage"));
});
function makeDoc() {
  const els = {};
  function getElementById(id) {
    if (!els[id]) els[id] = {
      id, value: "", innerHTML: "", textContent: "", hidden: false, handlers: {},
      addEventListener(type, fn) { (this.handlers[type] = this.handlers[type] || []).push(fn); },
      focus() { this.focused = true; },
      getAttribute() { return null; }
    };
    return els[id];
  }
  return { els, getElementById };
}
console.log("\\n" + passed + " T4c project-list preset tests passed");
