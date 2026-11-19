/* HomeProjectWise market-linked ISO currency contract.
 * Currency is derived only from the visitor's explicit shared market selection.
 * No locale inference, symbol parsing, FX or persistence.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWCurrency = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var MARKET_CURRENCY = Object.freeze({
    US: "USD", Canada: "CAD", UK: "GBP", Germany: "EUR",
    France: "EUR", Spain: "EUR", Italy: "EUR", Netherlands: "EUR"
  });
  function codeForMarket(market) { return MARKET_CURRENCY[String(market || "")] || ""; }
  function validCode(code) { return /^[A-Z]{3}$/.test(String(code || "")); }
  function format(amount, code) {
    if (!validCode(code)) throw new Error("Choose a supported country before showing a price.");
    if (!Number.isFinite(Number(amount))) throw new Error("Price must be a finite number.");
    return code + " " + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function init(doc, win) {
    if (!doc || !win || !win.addEventListener) return null;
    var codeIds = ["paint-currency", "material-currency", "energy-currency", "project-currency", "plist-currency"];
    function sync(clearPrices) {
      var code = codeForMarket(win.hpwRegion);
      codeIds.forEach(function (id) {
        var field = doc.getElementById(id);
        if (field) field.value = code;
      });
      if (clearPrices) {
        ["paint-price", "material-price", "energy-rate", "project-unit-price", "project-extra"].forEach(function (id) {
          var field = doc.getElementById(id);
          if (field) field.value = id === "project-extra" && field.value === "0" ? "0" : "";
        });
        ["paint-result", "material-result", "energy-result", "project-result"].forEach(function (id) {
          var result = doc.getElementById(id);
          if (result) result.innerHTML = "";
        });
        ["paint-error", "material-error", "energy-error", "project-error"].forEach(function (id) {
          var error = doc.getElementById(id);
          if (error) error.textContent = "";
        });
        ["paint-add", "material-add"].forEach(function (id) {
          var button = doc.getElementById(id);
          if (button) button.hidden = true;
        });
        if (win.hpwLast) { delete win.hpwLast.paint; delete win.hpwLast.material; }
      }
      var note = doc.getElementById("currency-market-note");
      if (note) note.textContent = clearPrices
        ? "Country changed. Re-enter manual prices in " + (code || "the selected market's currency") + ". Old amounts were cleared so they cannot be mistaken for another currency."
        : (code ? "Manual prices use " + code + " for the selected market." : "Choose a supported country above before entering prices. Quantity calculations remain available.");
    }
    sync(false);
    win.addEventListener("hpw-region", function () { sync(true); });
    return { sync: sync };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined") init(document, window);
  return { MARKET_CURRENCY: MARKET_CURRENCY, codeForMarket: codeForMarket, validCode: validCode, format: format, init: init };
}));
