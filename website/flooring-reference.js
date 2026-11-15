/* HomeProjectWise flooring reference cost (Stage 0 of the beginner flow, Issue #362; contract: docs/CALCULATOR-REFERENCE-PRICE-DATA-CONTRACT-2026-11-14.md).
 * Fills the country and floor-type choices on the Flooring tab from the eligible registry records, and gives the page a function that
 * returns the "typical material cost for this area" text. No pack size or price is needed. Nothing typed is sent or stored.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWFlooringReference = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function esc(s) {
    return String(s === undefined || s === null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; });
  }
  function link(url, label) { return /^https:\/\//.test(String(url || "")) ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + '</a>' : esc(label); }
  function money(n, currency) {
    try { return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(n); } catch (e) { return currency + " " + Number(n).toFixed(2); }
  }
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
    function show(on) {
      ["material-country-field", "material-subtype-field"].forEach(function (id) { var f = doc.getElementById(id); if (f) f.hidden = !on; });
    }
    function load(records) {
      if (!Array.isArray(records) || !records.length) return;
      var countries = RP.flooringCountries(records);
      if (!countries.length) return;
      state.records = records;
      countryEl.innerHTML = options("Choose a country", countries.map(function (c) { return { value: c, label: RP.COUNTRY_LABEL[c] || c }; }));
      fillTypes(); show(true);
    }
    countryEl.addEventListener("change", fillTypes);
    // Returns an HTML fragment for the Flooring result, or "" when the visitor did not ask for a reference.
    function fragment(info) {
      if (!state.records || !countryEl.value || !typeEl.value || !info) return "";
      var sel = RP.select(state.records, { country: countryEl.value, category: "flooring", subtype: typeEl.value });
      if (!sel.ok) return '<br><span class="wp-note">' + esc(sel.message) + '</span>';
      var c = RP.areaCost(sel.record, info.needed, info.areaUnit);
      if (!c) return "";
      var d = RP.describe(sel.record, state.now || new Date());
      var range = c.low === c.high ? money(c.low, c.currency) : money(c.low, c.currency) + "–" + money(c.high, c.currency);
      return '<br>Typical material cost for this area: <strong>' + range + '</strong> (approximate)<br><span class="wp-note">Based on ' + esc(d.range) +
        ', from ' + link(d.url, d.sourceName) + ', observed ' + esc(d.observedAt) + (d.older ? ' (older data)' : '') + '. ' + esc(d.caveats) + ' ' + esc(RP.DISCLAIMER) + '</span>';
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
