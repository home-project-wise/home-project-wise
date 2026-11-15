// Tests for website/flooring-reference.js (Stage 0, area-first flooring). Run: node scripts/test_flooring_reference.js
"use strict";
const assert = require("node:assert/strict");
const fs = require("fs"), path = require("path");
const RP = require("../website/reference-prices.js");
const FR = require("../website/flooring-reference.js");
const REG = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "reference_prices.json"), "utf8"));
const NOW = new Date(Date.UTC(2026, 10, 14));
let n = 0; function ok(name, fn) { fn(); n++; console.log("PASS " + name); }
function makeDoc() {
  const els = {};
  const mk = (id) => els[id] || (els[id] = { id, value: "", innerHTML: "", hidden: true, handlers: {}, addEventListener(t, f) { (this.handlers[t] = this.handlers[t] || []).push(f); } });
  return { els, getElementById: mk };
}
function setup(records) {
  const d = makeDoc(), win = {}; d.getElementById("material-country"); d.getElementById("material-subtype"); d.getElementById("material-country-field"); d.getElementById("material-subtype-field");
  const c = FR.init(d, win, { records, rp: RP, now: NOW }); return { d, win, c, e: d.els };
}
function pick(x, country, subtype) { x.e["material-country"].value = country; (x.e["material-country"].handlers.change || []).forEach((f) => f()); x.e["material-subtype"].value = subtype; }
ok("choices appear only when the registry has eligible flooring ranges, and only for countries that have one", () => {
  const x = setup(REG);
  assert.equal(x.e["material-country-field"].hidden, false); assert.equal(x.e["material-subtype-field"].hidden, false);
  assert.ok(x.e["material-country"].innerHTML.includes("United States") && x.e["material-country"].innerHTML.includes("Choose a country"));
  const none = setup([]); assert.equal(none.e["material-country-field"].hidden, true); assert.equal(none.win.hpwFlooring({ needed: 100, areaUnit: "sq ft" }), "");
  assert.equal(FR.init({ getElementById: () => null }, {}, { rp: RP }), null);
});
ok("changing the country offers only the floor types that have a range there", () => {
  const x = setup(REG); x.e["material-country"].value = "US"; x.e["material-country"].handlers.change.forEach((f) => f());
  const types = RP.flooringOptions(REG, "US"); assert.ok(types.length > 0);
  types.forEach((t) => assert.ok(x.e["material-subtype"].innerHTML.includes('value="' + t + '"')));
  assert.ok(!x.e["material-subtype"].innerHTML.includes("Choose a country"));
});
ok("a country and floor type give a material cost range from the area alone, with source, date and the disclaimer", () => {
  const x = setup(REG); pick(x, "US", "laminate");
  const rec = RP.select(REG, { country: "US", category: "flooring", subtype: "laminate" }).record;
  const html = x.win.hpwFlooring({ needed: 120, areaUnit: "sq ft" }), c = RP.areaCost(rec, 120, "sq ft");
  const fmt = (v) => Number(v).toLocaleString("en-US", { style: "currency", currency: "USD" });
  assert.ok(html.includes("Typical material cost for this area: <strong>" + fmt(c.low) + "–" + fmt(c.high) + "</strong> (approximate)"), html);
  assert.ok(html.includes('href="' + rec.source.url + '"') && html.includes("observed " + rec.source.observedAt) && html.includes("not a quote or a final cost"));
});
ok("metric area on a per-sq-ft record is converted by area only", () => {
  const x = setup(REG); pick(x, "US", "laminate");
  const rec = RP.select(REG, { country: "US", category: "flooring", subtype: "laminate" }).record, c = RP.areaCost(rec, 11.1484, "m²");
  assert.ok(x.win.hpwFlooring({ needed: 11.1484, areaUnit: "m²" }).includes(Number(c.low).toLocaleString("en-US", { style: "currency", currency: "USD" })));
});
ok("nothing chosen shows nothing; no range for a mismatch is said plainly, with no substitute", () => {
  const x = setup(REG); assert.equal(x.win.hpwFlooring({ needed: 120, areaUnit: "sq ft" }), "");
  pick(x, "US", ""); assert.equal(x.win.hpwFlooring({ needed: 120, areaUnit: "sq ft" }), "");
  x.e["material-country"].value = "Netherlands"; x.e["material-subtype"].value = "ceramic-tile";
  const h = x.win.hpwFlooring({ needed: 120, areaUnit: "sq ft" }); assert.ok(h.includes("No reference range yet; enter your own price or two quotes.") && !h.includes("Typical material cost"));
});
ok("older data is labelled and text from the registry is escaped", () => {
  const rec = RP.select(REG, { country: "US", category: "flooring", subtype: "laminate" }).record;
  const old = REG.map((r) => r.id === rec.id ? Object.assign({}, r, { caveats: "<b>x</b>", source: Object.assign({}, r.source, { observedAt: "2025-01-15" }) }) : r);
  const x = setup(old); pick(x, "US", "laminate"); const h = x.win.hpwFlooring({ needed: 100, areaUnit: "sq ft" });
  assert.ok(h.includes("(older data)") && h.includes("&lt;b&gt;x&lt;/b&gt;") && !h.includes("<b>x"));
});
ok("source: one same-origin GET of the registry copy, no storage, no other network", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "website", "flooring-reference.js"), "utf8");
  for (const bad of ["localStorage", "sessionStorage", "indexedDB", "XMLHttpRequest", "eval(", "document.cookie", "sendBeacon", "WebSocket"]) assert.ok(!src.includes(bad), bad);
  assert.equal((src.match(/fetch\(/g) || []).length, 1); assert.equal((src.match(/win\.fetch\("reference-prices\.json", \{ cache: "no-cache" \}\)/g) || []).length, 1);
});
ok("the page: area-first, allowance not pre-filled, pack size under Advanced settings, scripts in order", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
  const panel = html.slice(html.indexOf('id="panel-material"'), html.indexOf("</section>", html.indexOf('id="panel-material"')));
  assert.ok(!/id="material-waste"[^>]*value=/.test(panel), "allowance must not carry a hidden default");
  assert.ok(/id="material-advanced"/.test(panel) && panel.indexOf('id="material-advanced"') < panel.indexOf('id="material-coverage"') && panel.indexOf('id="material-advanced"') < panel.indexOf('id="material-price"'));
  assert.ok(!/id="material-coverage"[^>]*required/.test(panel));
  assert.ok(panel.indexOf('id="material-country"') < panel.indexOf('id="material-advanced"'));
  assert.ok(html.indexOf("reference-prices.js") < html.indexOf("flooring-reference.js") && html.indexOf("flooring-reference.js") < html.lastIndexOf("<script>"));
});
function setupG(records, country) {
  const d = makeDoc(), handlers = [], win = { hpwRegion: country, addEventListener(t, f) { if (t === "hpw-region") handlers.push(f); } };
  ["material-country", "material-subtype", "material-country-field", "material-subtype-field", "material-region-note"].forEach((id) => d.getElementById(id));
  d.els["material-region-note"].hidden = true; d.els["material-region-note"].textContent = "";
  const c = FR.init(d, win, { records, rp: RP, now: NOW }); return { d, win, c, e: d.els, set(cn) { win.hpwRegion = cn; handlers.forEach((f) => f()); } };
}
ok("a page-wide country hides the local country choice and drives the floor types and the cost range", () => {
  const x = setupG(REG, "US");
  assert.equal(x.e["material-country-field"].hidden, true); assert.equal(x.e["material-subtype-field"].hidden, false); assert.equal(x.e["material-region-note"].hidden, true);
  assert.equal(x.e["material-country"].value, "US"); RP.flooringOptions(REG, "US").forEach((t) => assert.ok(x.e["material-subtype"].innerHTML.includes('value="' + t + '"')));
  x.e["material-subtype"].value = "laminate"; const h = x.win.hpwFlooring({ needed: 120, areaUnit: "sq ft" });
  assert.ok(h.includes("Typical material cost for this area") && h.includes("United States") === false);
});
ok("changing the page-wide country updates the choices and the note; with no country the local choice comes back", () => {
  const x = setupG(REG, "US"); x.e["material-subtype"].value = "laminate";
  x.set("Canada"); assert.equal(x.e["material-country"].value, "Canada"); assert.equal(x.e["material-subtype"].value, "");
  assert.equal(x.win.hpwFlooring({ needed: 120, areaUnit: "sq ft" }), "");
  const none = REG.filter((r) => !(r.audience === "Italy" && r.category === "flooring")); const y = setupG(none, "Italy");
  assert.equal(y.e["material-subtype-field"].hidden, true); assert.equal(y.e["material-region-note"].hidden, false); assert.ok(y.e["material-region-note"].textContent.includes("No typical flooring prices for Italy"));
  x.set(""); assert.equal(x.e["material-country-field"].hidden, false); assert.equal(x.e["material-subtype-field"].hidden, false);
});
console.log("\n" + n + " flooring-reference tests passed");
