"use strict";
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.HPWCalculatorUtils = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var ROUND_EPSILON = Number.EPSILON * 4;

  function blank(value) {
    return value === "" || value === null || value === undefined;
  }

  function positive(value, label) {
    if (blank(value) || !Number.isFinite(Number(value)) || Number(value) <= 0) {
      throw new Error(label + " must be greater than zero.");
    }
    return Number(value);
  }

  function nonNegative(value, label, includeZeroHint) {
    if (blank(value) || !Number.isFinite(Number(value)) || Number(value) < 0) {
      throw new Error(label + (includeZeroHint
        ? " must be zero or greater. Enter 0 if none."
        : " must be zero or greater."));
    }
    return Number(value);
  }

  // Keep both historical positive-quantity strategies: pavers/baseboard use
  // epsilon subtraction; roof/siding use an explicit nearest-integer snap.
  function ceilCount(value) {
    if (value === 0) return 0;
    return Math.ceil(value - ROUND_EPSILON * Math.max(1, Math.abs(value)));
  }

  function ceilCountNearest(value) {
    if (value === 0) return 0;
    var nearest = Math.round(value);
    return Math.abs(value - nearest) <= ROUND_EPSILON * Math.max(1, Math.abs(value))
      ? nearest
      : Math.ceil(value);
  }

  function format(value, digits) {
    return Number(value).toLocaleString("en-US", {
      maximumFractionDigits: digits === undefined ? 3 : digits
    });
  }

  function element(doc, tag, text) {
    var node = doc.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  }

  return {
    blank: blank,
    positive: positive,
    nonNegative: nonNegative,
    ceilCount: ceilCount,
    ceilCountNearest: ceilCountNearest,
    format: format,
    element: element
  };
});
