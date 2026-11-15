/* HomeProjectWise country choice, made once for the whole calculator (Issue #362). The Flooring tab, the Project list and the
 * electricity reference all read it. In memory only: nothing is stored or sent, and no country is assumed until the visitor chooses.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWRegion = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function esc(s) {
    return String(s === undefined || s === null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; });
  }
  function init(doc, win, opts) {
    var host = doc.getElementById("region-root");
    var RP = (opts && opts.rp) || (typeof module === "object" && module.exports && typeof require === "function" ? require("./reference-prices.js") : (win && win.HPWReferencePrices));
    if (!host || !RP || !win) return null;
    win.hpwRegion = "";
    host.innerHTML = '<div class="calc-field"><label for="region-country">Your country</label><select id="region-country"><option value="">Choose your country</option>' +
      RP.COUNTRY_ORDER.map(function (c) { return '<option value="' + esc(c) + '">' + esc(RP.COUNTRY_LABEL[c] || c) + '</option>'; }).join("") +
      '</select><small>Used for typical prices and electricity rates in every calculator below. Nothing is stored or sent.</small></div>';
    var sel = doc.getElementById("region-country");
    sel.addEventListener("change", function () {
      win.hpwRegion = RP.COUNTRY_ORDER.indexOf(sel.value) === -1 ? "" : sel.value;
      try { if (win.dispatchEvent && win.CustomEvent) win.dispatchEvent(new win.CustomEvent("hpw-region", { detail: { country: win.hpwRegion } })); } catch (e) {}
    });
    return { select: sel };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document, window);
  return { init: init };
}));
