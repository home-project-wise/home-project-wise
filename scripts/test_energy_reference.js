// Tests for website/energy-reference.js (electricity reference rate, contract section 10.2). Run: node scripts/test_energy_reference.js
"use strict";
const assert = require("node:assert/strict");
const fs = require("fs"), path = require("path");
const RP = require("../website/reference-prices.js");
const ER = require("../website/energy-reference.js");
const REG = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "reference_prices.json"), "utf8"));
const NOW = new Date(Date.UTC(2026, 10, 14));
let n = 0; function ok(name, fn) { fn(); n++; console.log("PASS " + name); }
function makeDoc() {
  const els = {};
  const mk = (id) => els[id] || (els[id] = { id, value: "", innerHTML: "", textContent: "", handlers: {}, attrs: {}, focused: false,
    addEventListener(t, f) { (this.handlers[t] = this.handlers[t] || []).push(f); }, getAttribute(k) { return this.attrs[k] === undefined ? null : this.attrs[k]; }, focus() { this.focused = true; } });
  return { els, getElementById: mk };
}
const fire = (el, type, ev) => (el.handlers[type] || []).forEach((f) => f(Object.assign({ target: el }, ev)));
function setup(records) {
  const d = makeDoc(); d.getElementById("energy-ref-root"); const ctl = ER.init(d, { navigator: {} }, { records, rp: RP, now: NOW });
  const e = new Proxy(d.els, { get: (t, k) => d.getElementById(k) }); return { d, ctl, e };
}
const choose = (x, id) => fire(x.e["energy-ref-root"], "change", { target: { id: "energy-ref-choice", value: id } });
const idFor = (j, plan) => RP.electricityChoices(REG).find((c) => c.jurisdiction === j && (!plan || c.tariffPlan === plan)).id;
ok("the places list is built only from eligible electricity records, no invented names", () => {
  const x = setup(REG), ch = RP.electricityChoices(REG);
  assert.ok(ch.length > 20); assert.ok(ch.every((c) => RP.isAutoEligible(REG.find((r) => r.id === c.id))));
  assert.ok(x.e["energy-ref-root"].innerHTML.includes("Choose a place") && !x.e["energy-ref-root"].innerHTML.includes("<details open"));
  assert.ok(ch.find((c) => c.jurisdiction === "GB").label !== ch.find((c) => c.jurisdiction === "GB-NIR").label);
});
ok("a single published rate is shown with source, date and caveat, and fills the calculator only on request", () => {
  const x = setup(REG), id = idFor("US-CT"), rec = REG.find((r) => r.id === id);
  x.e["energy-rate"].value = ""; choose(x, id);
  const h = x.e["energy-ref-root"].innerHTML;
  assert.ok(h.includes("<details open") && h.includes("Reference rate: <strong>" + rec.low + " USD per kWh</strong>") && h.includes('href="' + rec.source.url + '"') && h.includes("observed " + rec.source.observedAt), h.slice(0, 700));
  assert.ok(h.includes("not a quote or a final cost") && h.includes("Check your bill"));
  assert.equal(x.e["energy-rate"].value, "");
  fire(x.e["energy-ref-root"], "click", { target: { getAttribute: (k) => (k === "data-action" ? "use" : null) } });
  assert.equal(x.e["energy-rate"].value, String(rec.low)); assert.equal(x.e["energy-currency"].value, "$");
  assert.ok(x.e["energy-ref-note"].textContent.includes("Change it"));
});
ok("a time-of-use range is shown but never averaged or filled in", () => {
  const x = setup(REG), id = idFor("CA-ON", "OEB-ONTARIO-TOU"), rec = REG.find((r) => r.id === id);
  x.e["energy-rate"].value = "0.2"; choose(x, id);
  const h = x.e["energy-ref-root"].innerHTML;
  assert.ok(h.includes("Reference range: <strong>" + rec.low + "–" + rec.high + " CAD per kWh</strong>") && h.includes("OEB-ONTARIO-TOU") && h.includes("not filled in"));
  assert.ok(!h.includes('data-action="use"'));
  fire(x.e["energy-ref-root"], "click", { target: { getAttribute: () => "use" } });
  assert.equal(x.e["energy-rate"].value, "0.2");
});
ok("currency symbols for GBP, EUR and CAD; other codes are used as the symbol; no conversion", () => {
  const x = setup(REG);
  for (const [j, sym, cur] of [["GB", "£", "GBP"], ["CA-ON", "C$", "CAD"]]) {
    const ch = RP.electricityChoices(REG).find((c) => c.jurisdiction === j); const rec = REG.find((r) => r.id === ch.id);
    if (rec.low !== rec.high) continue;
    choose(x, ch.id); fire(x.e["energy-ref-root"], "click", { target: { getAttribute: () => "use" } });
    assert.equal(x.e["energy-currency"].value, sym); assert.equal(rec.currency, cur);
  }
  const eur = RP.electricityChoices(REG).map((c) => REG.find((r) => r.id === c.id)).find((r) => r.currency === "EUR" && r.low === r.high);
  if (eur) { choose(x, eur.id); fire(x.e["energy-ref-root"], "click", { target: { getAttribute: () => "use" } }); assert.equal(x.e["energy-currency"].value, "€"); assert.equal(x.e["energy-rate"].value, String(eur.low)); }
});
ok("a record that is not eligible never appears, and with no registry nothing is shown", () => {
  const blocked = REG.map((r) => (r.id === idFor("US-CT") ? Object.assign({}, r, { autoEligible: false }) : r));
  assert.ok(!RP.electricityChoices(blocked).some((c) => c.jurisdiction === "US-CT"));
  const d = makeDoc(); d.getElementById("energy-ref-root"); ER.init(d, { navigator: {} }, { records: [], rp: RP });
  assert.equal(d.els["energy-ref-root"].innerHTML, "");
  assert.equal(ER.init({ getElementById: () => null }, {}, { rp: RP }), null);
});
ok("older observations are labelled", () => {
  const id = idFor("US-CT"), old = REG.map((r) => (r.id === id ? Object.assign({}, r, { source: Object.assign({}, r.source, { observedAt: "2025-01-15" }) }) : r));
  const x = setup(old); choose(x, id); assert.ok(x.e["energy-ref-root"].innerHTML.includes("(older data)"));
});
ok("source: one same-origin GET of the registry copy, no storage, no other network", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "website", "energy-reference.js"), "utf8");
  for (const bad of ["localStorage", "sessionStorage", "indexedDB", "XMLHttpRequest", "eval(", "document.cookie", "sendBeacon", "WebSocket"]) assert.ok(!src.includes(bad), bad);
  assert.equal((src.match(/fetch\(/g) || []).length, 1); assert.equal((src.match(/win\.fetch\("reference-prices\.json", \{ cache: "no-cache" \}\)/g) || []).length, 1);
});
ok("the page loads the scripts in order and has the host element", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
  assert.ok(html.indexOf("reference-prices.js") < html.indexOf("energy-reference.js") && html.includes('id="energy-ref-root"'));
  assert.ok(html.indexOf('id="energy-ref-root"') < html.indexOf('id="energy-form"'));
});
console.log("\n" + n + " energy-reference tests passed");
