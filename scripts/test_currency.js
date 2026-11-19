"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Currency = require("../website/currency.js");
const ProjectList = require("../website/project-list.js");

const expected = {
  US: "USD", Canada: "CAD", UK: "GBP", Germany: "EUR",
  France: "EUR", Spain: "EUR", Italy: "EUR", Netherlands: "EUR"
};
assert.deepEqual(Currency.MARKET_CURRENCY, expected);
Object.entries(expected).forEach(([market, code]) => assert.equal(Currency.codeForMarket(market), code));
assert.equal(Currency.codeForMarket("Tunisia"), "");
assert.equal(Currency.codeForMarket(""), "");
assert.equal(Currency.format(7, "EUR"), "EUR 7.00");
assert.equal(Currency.format(0, "GBP"), "GBP 0.00");
assert.throws(() => Currency.format(7, ""), /supported country/);
console.log("PASS eight supported markets map to ISO currency codes");
console.log("PASS unsupported markets stay unmapped and formatting uses ISO codes");

const state = ProjectList.createState();
state.currency = "EUR";
const added = ProjectList.addItem(state, { name: "Paint", unit: "tin", quantity: 2, price: 7, currency: "EUR" });
assert.equal(added.ok, true);
assert.equal(added.item.currency, "EUR");
assert.equal(ProjectList.addItem(state, { name: "Wrong currency", unit: "pack", quantity: 1, price: 3, currency: "USD" }).ok, false);
assert.equal(ProjectList.setMarket(state, "UK"), "GBP");
assert.equal(state.items[0].mode, "unknown");
assert.equal(state.items[0].price, "");
assert.equal(state.items[0].quantity, "2");
assert.equal(ProjectList.setField(state, added.item.id, "mode", "known"), true);
assert.equal(state.items[0].currency, "GBP");
assert.equal(ProjectList.setField(state, added.item.id, "price", "9"), true);
state.items[0].currency = "EUR";
assert.throws(() => ProjectList.buildEstimateInput(state), /different currency/);
ProjectList.setMarket(state, "");
assert.equal(state.currency, "");
assert.equal(ProjectList.setField(state, added.item.id, "mode", "known"), false);
console.log("PASS Project List carries ISO identity, clears old prices on market change and rejects mismatches");

const ids = ["paint-currency", "material-currency", "energy-currency", "project-currency", "plist-currency",
  "paint-price", "material-price", "energy-rate", "project-unit-price", "project-extra",
  "paint-result", "material-result", "energy-result", "project-result",
  "paint-error", "material-error", "energy-error", "project-error",
  "paint-add", "material-add", "currency-market-note"];
const elements = {};
ids.forEach((id) => elements[id] = { id, value: "123", innerHTML: "old", textContent: "", hidden: false });
const doc = { getElementById(id) { return elements[id] || null; } };
const handlers = {};
const win = { hpwRegion: "", hpwLast: { paint: {}, material: {} }, addEventListener(type, fn) { (handlers[type] = handlers[type] || []).push(fn); } };
Currency.init(doc, win);
assert.equal(elements["paint-currency"].value, "");
assert.match(elements["currency-market-note"].textContent, /Choose a supported country/);
win.hpwRegion = "Germany";
(handlers["hpw-region"] || []).forEach((fn) => fn({ detail: { country: "Germany" } }));
["paint-currency", "material-currency", "energy-currency", "project-currency", "plist-currency"].forEach((id) => assert.equal(elements[id].value, "EUR"));
["paint-price", "material-price", "energy-rate", "project-unit-price", "project-extra"].forEach((id) => assert.equal(elements[id].value, ""));
["paint-result", "material-result", "energy-result", "project-result"].forEach((id) => assert.equal(elements[id].innerHTML, ""));
assert.equal(elements["paint-add"].hidden, true);
assert.equal(win.hpwLast.paint, undefined);
assert.match(elements["currency-market-note"].textContent, /Re-enter manual prices in EUR/);
console.log("PASS changing market refreshes codes and clears old manual amounts and results");

const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
["paint-currency", "material-currency", "energy-currency", "project-currency"].forEach((id) => {
  const field = html.match(new RegExp('<input id="' + id + '"[^>]*>'));
  assert.ok(field && /readonly/.test(field[0]), id + " must be read-only and market-derived");
});
assert.ok(html.includes('<script src="currency.js"></script>'));
console.log("PASS calculator currency fields are read-only and the shared contract loads before calculator modules");
console.log("\\nISO currency tests passed");
