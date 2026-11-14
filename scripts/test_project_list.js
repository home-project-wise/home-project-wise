// Tests for website/project-list.js (the price-optional project list).
// Run: node scripts/test_project_list.js
// Logic runs for real; the page wiring runs against a minimal DOM stub (no browser, no layout).
"use strict";
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const L = require("../website/project-list.js");
const E = require("../website/project-estimator-engine.js");
let passed = 0;
function ok(name, fn) { fn(); passed++; console.log("PASS " + name); }

ok("addItem validates name, unit and quantity", () => {
  const s = L.createState();
  assert.equal(L.addItem(s, { name: "", unit: "tin", quantity: 1 }).ok, false);
  assert.equal(L.addItem(s, { name: "Paint", unit: "", quantity: 1 }).ok, false);
  assert.equal(L.addItem(s, { name: "Paint", unit: "tin", quantity: 0 }).ok, false);
  assert.equal(L.addItem(s, { name: "Paint", unit: "tin", quantity: "x" }).ok, false);
  assert.equal(s.items.length, 0);
  const r = L.addItem(s, { name: " Paint ", unit: "tin", quantity: 8 });
  assert.equal(r.ok, true); assert.equal(s.items[0].name, "Paint"); assert.equal(s.items[0].mode, "unknown");
});
ok("a passed-in price makes the item 'known'; no price stays unknown", () => {
  const s = L.createState();
  L.addItem(s, { name: "Paint", unit: "tin", quantity: 8, price: 20 });
  L.addItem(s, { name: "Packs", unit: "pack", quantity: 11, price: null });
  assert.equal(s.items[0].mode, "known"); assert.equal(s.items[0].price, "20"); assert.equal(s.items[1].mode, "unknown");
});
ok("list is capped at 30 items", () => {
  const s = L.createState();
  for (let i = 0; i < 30; i++) assert.equal(L.addItem(s, { name: "I" + i, unit: "u", quantity: 1 }).ok, true);
  assert.equal(L.addItem(s, { name: "extra", unit: "u", quantity: 1 }).ok, false);
});
function sample() {
  const s = L.createState();
  L.addItem(s, { name: "Paint", unit: "tin", quantity: 8, price: 20 });
  L.addItem(s, { name: "Flooring / material packs", unit: "pack", quantity: 11 });
  return s;
}
ok("no-price item stays on the list, is marked, and the total is flagged partial", () => {
  const r = L.summarize(sample(), E);
  assert.equal(r.ok, true);
  assert.ok(r.lines[0].includes("Paint: 8 tin × $20.00 per tin = $160.00"), r.lines[0]);
  assert.ok(r.lines[1].includes("price not known yet"), r.lines[1]);
  assert.ok(r.totals.includes("Total with contingency: $176.00"), JSON.stringify(r.totals));
  assert.ok(r.totals.some(t => t.includes("partial: 1 item(s) have no price")));
});
ok("two quotes give a range, order does not matter, contingency applies", () => {
  const s = sample(); s.items[1].mode = "range"; s.items[1].low = "34"; s.items[1].high = "28";
  const r = L.summarize(s, E);
  assert.ok(r.lines[1].includes("11 pack × $28.00–$34.00 per pack = $308.00–$374.00"), r.lines[1]);
  assert.ok(r.totals.includes("Priced items: $468.00–$534.00"), JSON.stringify(r.totals));
  assert.ok(r.totals.includes("Total with contingency: $514.80–$587.40"), JSON.stringify(r.totals));
  assert.ok(!r.totals.some(t => t.includes("partial")));
});
ok("nothing priced: quantities only, never an invented number", () => {
  const s = L.createState(); L.addItem(s, { name: "Paint", unit: "tin", quantity: 8 });
  const r = L.summarize(s, E);
  assert.ok(r.totals[0].startsWith("No prices yet"));
  assert.ok(!/\$\d/.test(r.text.replace("HomeProjectWise", "")), r.text);
});
ok("budget: within, overlap, over, and cannot-assess when a price is unknown", () => {
  const s = sample(); s.items[1].mode = "range"; s.items[1].low = "28"; s.items[1].high = "34";
  s.budget = "600"; assert.ok(L.summarize(s, E).budgetLine.startsWith("Likely within your $600.00 budget. Remaining: $12.60–$85.20."), L.summarize(s, E).budgetLine);
  s.budget = "550"; assert.ok(L.summarize(s, E).budgetLine.includes("falls inside this estimate range"));
  s.budget = "500"; assert.ok(L.summarize(s, E).budgetLine.startsWith("Likely over your $500.00 budget"));
  s.items[1].mode = "unknown"; s.budget = "600";
  assert.ok(L.summarize(s, E).budgetLine.includes("Can’t compare with your $600.00 budget yet: no price for Flooring / material packs"), L.summarize(s, E).budgetLine);
  s.budget = "-5"; assert.equal(L.summarize(s, E).budgetLine, "Budget must be a number greater than zero.");
});
ok("input errors are explained, not thrown", () => {
  const s = sample(); s.currency = "US"; assert.match(L.summarize(s, E).error, /3-letter currency code/);
  s.currency = "USD"; s.contingency = "150"; assert.match(L.summarize(s, E).error, /between 0 and 100/);
  s.contingency = "10"; s.items[0].price = ""; assert.match(L.summarize(s, E).error, /Enter a price for "Paint"/);
  s.items[0].price = "20"; s.items[1].mode = "range"; s.items[1].low = "5"; assert.match(L.summarize(s, E).error, /Enter both quotes/);
  assert.match(L.summarize(L.createState(), E).error, /Add at least one item/);
  const q = sample(); q.items[0].quantity = "0"; assert.match(L.summarize(q, E).error, /Check the quantity/);
});
ok("user text is escaped in every rendered string", () => {
  assert.equal(L.esc("<img src=x onerror=alert(1)>"), "&lt;img src=x onerror=alert(1)&gt;");
});
ok("source has no storage, network or eval calls", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "website", "project-list.js"), "utf8");
  for (const bad of ["localStorage", "sessionStorage", "indexedDB", "XMLHttpRequest", "eval(", "document.cookie", "sendBeacon", "WebSocket"]) assert.ok(!src.includes(bad), bad);
  // The only request allowed is one same-origin GET of the build-time copy of the reference registry; nothing user-entered is sent.
  const fetches = src.match(/fetch\(/g) || [], allowed = src.match(/win\.fetch\("reference-prices\.json", \{ cache: "no-cache" \}\)/g) || [];
  assert.equal(fetches.length, 1); assert.equal(allowed.length, 1);
});

// ---- page wiring against a minimal DOM stub ----
function makeDoc() {
  const els = {};
  function mk(id) {
    return els[id] || (els[id] = { id, value: "", innerHTML: "", textContent: "", hidden: false, handlers: {}, attrs: {}, focused: false,
      addEventListener(t, f) { (this.handlers[t] = this.handlers[t] || []).push(f); },
      getAttribute(k) { return this.attrs[k] === undefined ? null : this.attrs[k]; },
      focus() { this.focused = true; }, select() { this.selected = true; } });
  }
  return { els, getElementById: mk };
}
function fire(el, type, extra) { (el.handlers[type] || []).forEach(f => f(Object.assign({ preventDefault() {}, target: el }, extra))); }
function target(attrs, value) { return { attrs, value, getAttribute(k) { return this.attrs[k] === undefined ? null : this.attrs[k]; } }; }
const doc = makeDoc(); const win = { navigator: {}, hpwLast: {} };
doc.getElementById("plist-root"); const ctl = L.init(doc, E, win); const els = new Proxy(doc.els, { get: (t, k) => doc.getElementById(k) });
els["plist-currency"].value = "USD"; els["plist-contingency"].value = "10"; els["plist-budget"].value = "";
ok("init renders the empty list and the price guide", () => {
  assert.ok(els["plist-root"].innerHTML.includes("Don’t know the prices yet?"));
  assert.ok(els["plist-items"].innerHTML.includes("Your list is empty"));
});
ok("Paint and Flooring results are added with one click; stale results hide the button", () => {
  win.hpwLast.paint = { name: "Paint", unit: "tin", quantity: 8, price: 20 };
  win.hpwLast.material = { name: "Flooring / material packs", unit: "pack", quantity: 11, price: null };
  fire(els["paint-add"], "click"); fire(els["material-add"], "click");
  assert.equal(ctl.state.items.length, 2);
  assert.ok(els["paint-add-note"].textContent.startsWith("Added to your project list"));
  assert.ok(els["plist-items"].innerHTML.includes("<legend>Paint</legend>") && els["plist-items"].innerHTML.includes("I know the price"));
  els["paint-add"].hidden = false; fire(els["paint-form"], "input");
  assert.equal(els["paint-add"].hidden, true); assert.equal(els["paint-add-note"].textContent, "");
});
ok("calculating shows lines, partial total, and a copyable text version", () => {
  fire(els["plist-calc-form"], "submit");
  assert.equal(els["plist-error"].textContent, "");
  const h = els["plist-result"].innerHTML;
  assert.ok(h.includes("Paint: 8 tin × $20.00 per tin = $160.00"), h);
  assert.ok(h.includes("price not known yet") && h.includes("This total is partial"), h);
  assert.ok(h.includes("<textarea id=\"plist-text\"") && h.includes("data-action=\"copy\""));
});
ok("switching an item to 'Two quotes' re-renders its fields; typing updates state", () => {
  const id = ctl.state.items[1].id;
  fire(els["plist-items"], "change", { target: target({ "data-id": id, "data-field": "mode" }, "range") });
  assert.ok(els["plist-items"].innerHTML.includes("First quote per pack") && els["plist-items"].innerHTML.includes("Second quote per pack"));
  assert.equal(els["pl-m-" + id].focused, true);
  fire(els["plist-items"], "input", { target: target({ "data-id": id, "data-field": "low" }, "28") });
  fire(els["plist-items"], "input", { target: target({ "data-id": id, "data-field": "high" }, "34") });
  els["plist-budget"].value = "600"; fire(els["plist-calc-form"], "submit");
  const h = els["plist-result"].innerHTML;
  assert.ok(h.includes("Total with contingency: $514.80–$587.40"), h);
  assert.ok(h.includes("Likely within your $600.00 budget"), h);
});
ok("copy without Clipboard API falls back to selecting the text", () => {
  fire(els["plist-result"], "click", { target: target({ "data-action": "copy" }) });
  assert.equal(els["plist-text"].selected, true);
  assert.equal(els["plist-copy-note"].textContent, "Select the text above and copy it.");
});
ok("manual add validates, escapes names, and remove works", () => {
  els["plist-name"].value = "<img src=x onerror=alert(1)>"; els["plist-qty"].value = "2"; els["plist-unit"].value = "box";
  fire(els["plist-add-form"], "submit");
  assert.equal(ctl.state.items.length, 3);
  assert.ok(els["plist-items"].innerHTML.includes("&lt;img") && !els["plist-items"].innerHTML.includes("<img"));
  els["plist-name"].value = ""; fire(els["plist-add-form"], "submit");
  assert.match(els["plist-add-error"].textContent, /Enter an item name/);
  fire(els["plist-items"], "click", { target: target({ "data-action": "remove", "data-id": ctl.state.items[2].id }) });
  assert.equal(ctl.state.items.length, 2); assert.equal(els["plist-result"].innerHTML, "");
});
ok("the page loads the scripts in order and exposes the hooks", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
  assert.ok(html.indexOf("project-estimator-engine.js") < html.indexOf("project-list.js"));
  for (const id of ["plist-root", "paint-add", "paint-add-note", "material-add", "material-add-note"]) assert.ok(html.includes("id=\"" + id + "\""), id);
  assert.ok(/id="paint-add" hidden/.test(html) && /id="material-add" hidden/.test(html));
});

// ---- flooring "typical range from sources" (contract: docs/CALCULATOR-REFERENCE-PRICE-DATA-CONTRACT-2026-11-14.md) ----
const RP = require("../website/reference-prices.js");
const REG = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "reference_prices.json"), "utf8"));
const NOWD = new Date(Date.UTC(2026, 10, 14));
function newList(records) {
  const d = makeDoc(), w = { navigator: {}, hpwLast: {} }; d.getElementById("plist-root");
  const c = L.init(d, E, w, records ? { records, rp: RP } : undefined); if (c && records) c.state.now = NOWD;
  const e = new Proxy(d.els, { get: (tt, k) => d.getElementById(k) });
  e["plist-currency"].value = "USD"; e["plist-contingency"].value = "10"; e["plist-budget"].value = "";
  return { c, e, w };
}
const FLOOR = { name: "Flooring / material packs", unit: "pack", quantity: 11, price: null, category: "flooring", coverage: 20, coverageUnit: "sq ft" };
function addFloor(x, over) { x.w.hpwLast.material = Object.assign({}, FLOOR, over); fire(x.e["material-add"], "click"); return x.c.state.items[x.c.state.items.length - 1]; }
function pickRef(x, it, country, subtype) {
  fire(x.e["plist-items"], "change", { target: target({ "data-id": it.id, "data-field": "mode" }, "reference") });
  fire(x.e["plist-items"], "change", { target: target({ "data-id": it.id, "data-field": "country" }, country) });
  fire(x.e["plist-items"], "change", { target: target({ "data-id": it.id, "data-field": "subtype" }, subtype) });
}
ok("the reference option exists only for flooring items and only when the registry is loaded", () => {
  const a = newList(REG), it = addFloor(a);
  assert.ok(a.e["plist-items"].innerHTML.includes("Typical range from sources"));
  a.w.hpwLast.paint = { name: "Paint", unit: "tin", quantity: 8, price: null }; fire(a.e["paint-add"], "click");
  assert.equal((a.e["plist-items"].innerHTML.match(/Typical range from sources/g) || []).length, 1);
  const b = newList(null), it2 = addFloor(b);
  assert.ok(!b.e["plist-items"].innerHTML.includes("Typical range from sources"));
  assert.equal(L.setField(b.c.state, it2.id, "mode", "reference"), false);
});
ok("US laminate: country and type choices show the sourced range, link, date and caveat", () => {
  const x = newList(REG), it = addFloor(x); pickRef(x, it, "US", "laminate");
  const h = x.e["plist-items"].innerHTML, rec = RP.select(REG, { country: "US", category: "flooring", subtype: "laminate" }).record;
  assert.ok(h.includes("Typical range: " + rec.low + "–" + rec.high + " USD per sq ft"), h.slice(0, 600));
  assert.ok(h.includes("Approximate, from") && h.includes("observed " + rec.source.observedAt) && h.includes('href="' + rec.source.url + '"'));
  assert.ok(h.includes("Laminate") && h.includes("United States") && h.includes("Floor type"));
});
ok("calculating uses the pack price range, shows attribution and the required disclaimer", () => {
  const x = newList(REG), it = addFloor(x); pickRef(x, it, "US", "laminate");
  fire(x.e["plist-calc-form"], "submit");
  const rec = RP.select(REG, { country: "US", category: "flooring", subtype: "laminate" }).record, pk = RP.packRange(rec, 20, "sq ft"), h = x.e["plist-result"].innerHTML;
  assert.equal(x.e["plist-error"].textContent, "");
  const lo = (11 * pk.low).toFixed(2), hi = (11 * pk.high).toFixed(2), fmtc = (v) => Number(v).toLocaleString("en-US", { style: "currency", currency: "USD" });
  assert.ok(h.includes(fmtc(lo) + "–" + fmtc(hi)), h.slice(0, 900));
  assert.ok(h.includes("[reference: " + rec.source.name) && h.includes("Reference for Flooring / material packs") && h.includes("not a quote or a final cost"));
  assert.ok(h.includes('href="' + rec.source.url + '"') && h.includes("retrieved " + rec.source.retrievedAt));
});
ok("no reference for a mismatched subtype: no substitute, the item stays unpriced", () => {
  const x = newList(REG), it = addFloor(x); pickRef(x, it, "Netherlands", "ceramic-tile");
  assert.ok(x.e["plist-items"].innerHTML.includes("No reference range yet; enter your own price or two quotes."));
  fire(x.e["plist-calc-form"], "submit");
  const h = x.e["plist-result"].innerHTML; assert.ok(h.includes("price not known yet") && h.includes("No prices yet") && !h.includes("[reference:"));
});
ok("reference prices in two currencies are never combined or converted", () => {
  const x = newList(REG), a = addFloor(x); pickRef(x, a, "US", "laminate");
  const b = addFloor(x); pickRef(x, b, "Canada", "laminate");
  fire(x.e["plist-calc-form"], "submit");
  assert.match(x.e["plist-error"].textContent, /different currencies/);
});
ok("a reference sets the list currency; a European reference reads in EUR", () => {
  const x = newList(REG), it = addFloor(x, { coverage: 2, coverageUnit: "m²" });
  const eu = REG.filter(RP.isAutoEligible).find((r) => r.category === "flooring" && r.currency === "EUR");
  pickRef(x, it, eu.audience, eu.subtype); fire(x.e["plist-calc-form"], "submit");
  assert.equal(x.c.state.currency, "EUR"); assert.equal(x.e["plist-currency"].value, "EUR");
  assert.ok(x.e["plist-result"].innerHTML.includes("The list currency is now EUR") && x.e["plist-result"].innerHTML.includes("€"));
});
ok("the user's own price or two quotes override a reference and are never blended with it", () => {
  const x = newList(REG), it = addFloor(x); pickRef(x, it, "US", "laminate");
  fire(x.e["plist-items"], "change", { target: target({ "data-id": it.id, "data-field": "mode" }, "range") });
  fire(x.e["plist-items"], "input", { target: target({ "data-id": it.id, "data-field": "low" }, "28") });
  fire(x.e["plist-items"], "input", { target: target({ "data-id": it.id, "data-field": "high" }, "34") });
  fire(x.e["plist-calc-form"], "submit"); const h = x.e["plist-result"].innerHTML;
  assert.ok(h.includes("$308.00–$374.00") && !h.includes("[reference:") && !h.includes("Reference for"), h.slice(0, 700));
});
ok("changing the country clears the floor type; older data is labelled", () => {
  const x = newList(REG), it = addFloor(x); pickRef(x, it, "US", "laminate");
  fire(x.e["plist-items"], "change", { target: target({ "data-id": it.id, "data-field": "country" }, "UK") });
  assert.equal(it.subtype, "");
  const rec = RP.select(REG, { country: "US", category: "flooring", subtype: "laminate" }).record;
  const old = REG.map((r) => r.id === rec.id ? Object.assign({}, r, { source: Object.assign({}, r.source, { observedAt: "2025-01-15" }) }) : r);
  const y = newList(old), it2 = addFloor(y); pickRef(y, it2, "US", "laminate");
  assert.ok(y.e["plist-items"].innerHTML.includes("(older data)"));
});
ok("the Flooring tab passes coverage and its unit to the list", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
  assert.ok(html.indexOf("reference-prices.js") < html.indexOf("project-list.js") && html.indexOf("project-estimator-engine.js") < html.indexOf("reference-prices.js"));
  assert.ok(html.includes("category:'flooring',coverage:value('material-coverage'),coverageUnit:ft?'sq ft':'m²'"));
});

console.log("\n" + passed + " project-list tests passed");
