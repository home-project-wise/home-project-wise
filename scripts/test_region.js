// Tests for website/region.js (one country choice for the whole calculator). Run: node scripts/test_region.js
"use strict";
const assert = require("node:assert/strict");
const fs = require("fs"), path = require("path");
const RP = require("../website/reference-prices.js");
const RG = require("../website/region.js");
let n = 0; function ok(name, fn) { fn(); n++; console.log("PASS " + name); }
function makeDoc() {
  const els = {};
  const mk = (id) => els[id] || (els[id] = { id, value: "", innerHTML: "", handlers: {}, addEventListener(t, f) { (this.handlers[t] = this.handlers[t] || []).push(f); } });
  return { els, getElementById: mk };
}
class CE { constructor(type, o) { this.type = type; this.detail = o && o.detail; } }
function setup() {
  const d = makeDoc(), events = [], win = { dispatchEvent(ev) { events.push([ev.type, ev.detail.country]); }, CustomEvent: CE };
  d.getElementById("region-root"); const c = RG.init(d, win, { rp: RP }); return { d, win, events, c };
}
ok("lists the supported countries, none chosen, nothing assumed", () => {
  const x = setup(), h = x.d.els["region-root"].innerHTML;
  assert.equal(x.win.hpwRegion, ""); assert.ok(h.includes("Choose your country") && h.includes("United States") && h.includes("United Kingdom") && h.includes("Netherlands"));
  RP.COUNTRY_ORDER.forEach((c) => assert.ok(h.includes('value="' + c + '"'), c));
});
ok("choosing a country sets it for every calculator and announces it; clearing it clears it", () => {
  const x = setup(), sel = x.d.els["region-country"];
  sel.value = "Canada"; sel.handlers.change.forEach((f) => f()); assert.equal(x.win.hpwRegion, "Canada"); assert.deepEqual(x.events.at(-1), ["hpw-region", "Canada"]);
  sel.value = ""; sel.handlers.change.forEach((f) => f()); assert.equal(x.win.hpwRegion, ""); assert.deepEqual(x.events.at(-1), ["hpw-region", ""]);
  sel.value = "Atlantis"; sel.handlers.change.forEach((f) => f()); assert.equal(x.win.hpwRegion, "");
});
ok("returns null without a host or a window; source has no storage, network or eval", () => {
  assert.equal(RG.init({ getElementById: () => null }, {}, { rp: RP }), null);
  const src = fs.readFileSync(path.join(__dirname, "..", "website", "region.js"), "utf8");
  for (const bad of ["localStorage", "sessionStorage", "indexedDB", "fetch(", "XMLHttpRequest", "eval(", "document.cookie", "sendBeacon", "WebSocket"]) assert.ok(!src.includes(bad), bad);
});
ok("the page puts the country choice first and loads region.js before the calculators that read it", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
  assert.ok(html.indexOf('id="region-root"') < html.indexOf('id="room-root"') && html.indexOf('id="room-root"') < html.indexOf('class="calc-tabs"'));
  for (const f of ["project-list.js", "energy-reference.js", "flooring-reference.js"]) assert.ok(html.indexOf("region.js") < html.indexOf(f), f);
  assert.ok(html.includes('id="material-region-note"'));
});
ok("result lists inherit the result card colour (the site-wide list colour made them unreadable on the dark card) and the country, room and electricity controls get the field style", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
  const css = (html.match(/<style>[\s\S]*?<\/style>/g) || []).join("\n");
  assert.ok(/main\.article \.tool-result ul,main\.article \.tool-result ol\{[^}]*color:inherit/.test(css));
  const rule = css.match(/[^{}]*#energy-ref-root select\{[^}]*\}/)[0];
  assert.ok(rule.includes("min-height:48px") && rule.includes("border-radius:12px"));
  for (const sel of ["#region-root select", "#room-root select", "#room-root input:not([type=checkbox]):not([type=radio])", "#energy-ref-root select"]) assert.ok(rule.includes(sel), sel);
  assert.ok(/#region-root select:focus-visible/.test(css) && /#room-root select:focus,/.test(css));
});
console.log("\n" + n + " region tests passed");
