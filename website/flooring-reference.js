/* HomeProjectWise flooring reference cost (Stage 0 of the beginner flow, Issue #362; contract: docs/CALCULATOR-REFERENCE-PRICE-DATA-CONTRACT-2026-11-14.md).
 * Fills the country and floor-type choices on the Flooring tab from the eligible registry records, and gives the page a function that
 * returns the "typical material cost for this area" text. No pack size or price is needed. Nothing typed is sent or stored.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWFlooringReference = factory(root);
}(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";
  var Currency = typeof module === "object" && module.exports && typeof require === "function" ? require("./currency.js") : root.HPWCurrency;
  function esc(s) {
    return String(s === undefined || s === null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; });
  }
  function link(url, label) { return /^https:\/\//.test(String(url || "")) ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + '</a>' : esc(label); }
  function money(n, currency) { return Currency.format(n, currency); }
  function init(doc, win, opts) {
    var countryEl = doc.getElementById("material-country"), typeEl = doc.getElementById("material-subtype");
    var RP = (opts && opts.rp) || (typeof module === "object" && module.exports && typeof require === "function" ? require("./reference-prices.js") : (win && win.HPWReferencePrices));
    if (!countryEl || !typeEl || !RP) return null;
    var state = { records: null, now: (opts && opts.now) || null };
    function options(first, list) {
      return '<option value="">' + first + '</option>' + list.map(function (o) { return '<option value="' + esc(o.value) + '">' + esc(o.label) + '</option>'; }).join("");
    }
    function fillTypes() {
      var subs = countryEl.value ? RP.flooringOptions(state.records, countryEl.value) : [];
      typeEl.innerHTML = options("Choose a type", subs.map(function (s) { return { value: s, label: RP.SUBTYPE_LABEL[s] || s }; }));
      typeEl.value = "";
    }
    function setHidden(id, v) { var f = doc.getElementById(id); if (f) f.hidden = v; }
    // The country comes from the page-wide choice when there is one; the local choice is only a fallback.
    function sync() {
      if (!state.records) return;
      var g = (win && win.hpwRegion) || "", note = doc.getElementById("material-region-note");
      if (g) {
        var has = RP.flooringCountries(state.records).indexOf(g) !== -1;
        countryEl.value = has ? g : ""; fillTypes();
        setHidden("material-country-field", true); setHidden("material-subtype-field", !has);
        if (note) { note.hidden = has; note.textContent = has ? "" : "No typical flooring prices for " + (RP.COUNTRY_LABEL[g] || g) + " yet. Enter your own price in Advanced settings."; }
      } else {
        setHidden("material-country-field", false); setHidden("material-subtype-field", false);
        if (note) { note.hidden = true; note.textContent = ""; }
      }
    }
    function load(records) {
      if (!Array.isArray(records) || !records.length) return;
      var countries = RP.flooringCountries(records);
      if (!countries.length) return;
      state.records = records;
      countryEl.innerHTML = options("Choose a country", countries.map(function (c) { return { value: c, label: RP.COUNTRY_LABEL[c] || c }; }));
      fillTypes(); sync();
    }
    countryEl.addEventListener("change", fillTypes);
    if (win && win.addEventListener) win.addEventListener("hpw-region", sync);
    // Returns an HTML fragment for the Flooring result, or "" when the visitor did not ask for a reference.
    function fragment(info) {
      if (!state.records || !countryEl.value || !typeEl.value || !info) return "";
      var query = { country: countryEl.value, category: "flooring", subtype: typeEl.value };
      var sel = RP.select(state.records, query), displayOnly = false;
      if (!sel.ok && typeof RP.selectDisplayOnly === "function") { sel = RP.selectDisplayOnly(state.records, query); displayOnly = !!sel.ok; }
      if (!sel.ok) return '<br><span class="wp-note">' + esc(sel.message) + '</span>';
      var c = RP.areaCost(sel.record, info.needed, info.areaUnit);
      if (!c) return "";
      var d = RP.describe(sel.record, state.now || new Date());
      var range = c.low === c.high ? money(c.low, c.currency) : money(c.low, c.currency) + "–" + money(c.high, c.currency);
      var sampleText = d.sample ? 'Based on ' + d.sample.count + ' observed product listings; ' + d.sample.description + ' ' : 'Sample size and method were not recorded in the source. ';
      var heading = displayOnly ? 'Observed sample material cost for this area (display only; not a typical market range): ' : 'Observed sample material cost for this area: ';
      return '<br>' + heading + '<strong>' + range + '</strong> (approximate)<br><span class="wp-note">' + esc(sampleText) +
        'Source: ' + link(d.url, d.sourceName) + ', observed ' + esc(d.observedAt) + ', retrieved ' + esc(d.retrievedAt) + (d.older ? ' (older data)' : '') + '. ' + esc(d.caveats) + ' ' + esc(RP.DISCLAIMER) + '</span>';
    }
    if (win) win.hpwFlooring = fragment;
    if (opts && opts.records) load(opts.records);
    else if (win && typeof win.fetch === "function") {
      win.fetch("reference-prices.json", { cache: "no-cache" }).then(function (r) { return r && r.ok ? r.json() : null; }).then(load).catch(function () {});
    }
    return { state: state, fragment: fragment };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document, window);
  return { init: init };
}));
