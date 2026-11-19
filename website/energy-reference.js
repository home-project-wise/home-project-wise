/* HomeProjectWise electricity reference rate (contract: docs/CALCULATOR-REFERENCE-PRICE-DATA-CONTRACT-2026-11-14.md, section 10.2).
 * Shows a sourced reference rate for the place the visitor chooses. A single published rate can be copied into the
 * calculator; a time-of-use range is shown but never averaged or filled in. The visitor's own rate always wins.
 * Reads the build-time copy of the registry (same origin); nothing the visitor types is sent or stored.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWEnergyReference = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function esc(s) {
    return String(s === undefined || s === null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; });
  }
  function link(url, label) { return /^https:\/\//.test(String(url || "")) ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + '</a>' : esc(label); }
  function init(doc, win, opts) {
    var host = doc.getElementById("energy-ref-root");
    var RP = (opts && opts.rp) || (typeof module === "object" && module.exports && typeof require === "function" ? require("./reference-prices.js") : (win && win.HPWReferencePrices));
    if (!host || !RP) return null;
    var state = { records: null, all: [], choices: [], chosen: "", now: (opts && opts.now) || null };
    function current() {
      var c = state.choices.filter(function (x) { return x.id === state.chosen; })[0];
      return c ? RP.selectElectricity(state.records, { jurisdiction: c.jurisdiction, tariffPlan: c.tariffPlan }) : null;
    }
    function viewHtml(sel) {
      if (!sel) return "";
      if (!sel.ok) return '<p class="wp-note">' + esc(sel.message) + '</p>';
      var r = sel.record, d = RP.describe(r, state.now || new Date());
      var src = ' Approximate, from ' + link(d.url, d.sourceName) + ', observed ' + esc(d.observedAt) + (d.older ? ' (older data)' : '') + '. ' + esc(d.caveats);
      if (sel.single) {
        return '<p>Reference rate: <strong>' + esc(r.low) + ' ' + esc(r.currency) + ' per kWh</strong>.' + src + '</p>' +
          '<button type="button" class="wp-btn" data-action="use">Use this rate in the calculator</button> <span class="wp-note" id="energy-ref-note" role="status"></span>';
      }
      return '<p>Reference range: <strong>' + esc(r.low) + '–' + esc(r.high) + ' ' + esc(r.currency) + ' per kWh</strong> (' + esc(r.tariffPlan) + ').' + src +
        ' This depends on when you use electricity, so it is not filled in: enter the rate that applies to you.</p>';
    }
    function render() {
      var g = (win && win.hpwRegion) || "";
      state.choices = g ? state.all.filter(function (c) { return c.audience === g; }) : state.all;
      if (state.chosen && !state.choices.some(function (c) { return c.id === state.chosen; })) state.chosen = "";
      if (!state.choices.length) {
        host.innerHTML = g && state.all.length ? '<p class="wp-note">No typical electricity rate for ' + esc(RP.COUNTRY_LABEL[g] || g) + ' yet. Enter your own rate.</p>' : "";
        return;
      }
      var h = '<details' + (state.chosen ? ' open' : '') + '><summary>Don’t know your rate? See a typical reference rate</summary>' +
        '<div class="calc-field"><label for="energy-ref-choice">Where do you pay for electricity?</label><select id="energy-ref-choice"><option value="">Choose a place</option>' +
        state.choices.map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === state.chosen ? " selected" : "") + '>' + esc(c.label) + '</option>'; }).join("") + '</select></div>' +
        viewHtml(current()) + '<p class="wp-note">' + esc(RP.DISCLAIMER) + ' Check your bill for your actual rate.</p></details>';
      host.innerHTML = h;
    }
    function load(records) {
      if (!Array.isArray(records) || !records.length) return;
      state.records = records; state.all = RP.electricityChoices(records); render();
    }
    if (win && win.addEventListener) win.addEventListener("hpw-region", function () { state.chosen = ""; render(); });
    host.addEventListener("change", function (e) {
      var t = e.target; if (!t || t.id !== "energy-ref-choice") return;
      state.chosen = t.value; render();
      var again = doc.getElementById("energy-ref-choice"); if (again && again.focus) again.focus();
    });
    host.addEventListener("click", function (e) {
      var t = e.target; if (!t || !t.getAttribute || t.getAttribute("data-action") !== "use") return;
      var sel = current(); if (!sel || !sel.ok || !sel.single) return;
      doc.getElementById("energy-rate").value = String(sel.record.low);
      doc.getElementById("energy-currency").value = sel.record.currency;
      var note = doc.getElementById("energy-ref-note"); if (note) note.textContent = "Filled from the reference rate. Change it to your own rate at any time.";
    });
    if (opts && opts.records) load(opts.records);
    else if (win && typeof win.fetch === "function") {
      win.fetch("reference-prices.json", { cache: "no-cache" }).then(function (r) { return r && r.ok ? r.json() : null; }).then(load).catch(function () {});
    }
    return { state: state };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document, window);
  return { init: init };
}));
