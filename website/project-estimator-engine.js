/* HomeProjectWise project-estimator domain engine.
 * Pure calculations only: no network, DOM, provider calls, or implicit prices.
 * Money is converted to integer minor units before arithmetic.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWProjectEstimator = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var EXTERNAL_KINDS = ["regional-range", "retailer-listing", "editorial-range", "government-benchmark"];
  function fail(message) { throw new Error(message); }
  function isObject(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
  function requiredText(value, field) { if (typeof value !== "string" || !value.trim()) fail(field + " is required."); return value.trim(); }
  function currencyCode(value) { if (typeof value !== "string" || !/^[A-Z]{3}$/.test(value)) fail("Currency must be a 3-letter uppercase ISO code."); return value; }
  function nonNegative(value, field) { if (typeof value !== "number" || !Number.isFinite(value) || value < 0) fail(field + " must be a finite non-negative number."); return value; }
  function toMinorUnits(value, field) {
    nonNegative(value, field);
    var minor = Math.round((value + Number.EPSILON) * 100);
    if (!Number.isSafeInteger(minor)) fail(field + " is too large to calculate safely.");
    return minor;
  }
  function fromMinorUnits(value) { return value / 100; }
  // Unit prices keep 4 decimals (scale 1e4) so that per-sq-ft or per-ft prices such as 0.285 are not
  // rounded to cents before they are multiplied by the quantity. More than 4 decimals is rejected, never rounded.
  var UNIT_PRICE_SCALE = 10000;
  function toUnitPriceScaled(value, field) {
    nonNegative(value, field);
    var scaled = value * UNIT_PRICE_SCALE, rounded = Math.round(scaled);
    if (Math.abs(scaled - rounded) > 1e-6) fail(field + " supports at most 4 decimal places.");
    if (!Number.isSafeInteger(rounded)) fail(field + " is too large to calculate safely.");
    return rounded;
  }
  var ISO_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/;
  var ONE_DAY_MS = 86400000;
  function dateValue(value, field, nowMs) {
    requiredText(value, field);
    if (!ISO_DATE.test(value.trim()) || !Number.isFinite(Date.parse(value.trim()))) fail(field + " must be an ISO 8601 date or timestamp (for example 2026-11-03 or 2026-11-03T10:00:00Z).");
    if (Date.parse(value.trim()) > nowMs + ONE_DAY_MS) fail(field + " cannot be in the future.");
    return value.trim();
  }
  function normalizePrice(price, expectedCurrency, expectedUnit, field, nowMs) {
    if (price === null || price === undefined) return null;
    if (!isObject(price)) fail(field + " must be an object or null.");
    var kind = requiredText(price.kind, field + ".kind");
    var currency = currencyCode(price.currency);
    if (currency !== expectedCurrency) fail(field + " currency must match the estimate currency.");
    var unit = requiredText(price.unit, field + ".unit");
    if (unit !== expectedUnit) fail(field + ".unit must match the line item unit.");
    if (kind === "user-input") {
      var amount = toUnitPriceScaled(price.amount, field + ".amount");
      return { kind: kind, currency: currency, unit: unit, lowScaled: amount, highScaled: amount, source: null };
    }
    if (EXTERNAL_KINDS.indexOf(kind) === -1) fail(field + ".kind is not a supported price type.");
    var low = toUnitPriceScaled(price.low, field + ".low");
    var high = toUnitPriceScaled(price.high, field + ".high");
    if (low > high) fail(field + ".low cannot exceed " + field + ".high.");
    if (!isObject(price.source)) fail(field + ".source provenance is required for external prices.");
    var source = {
      id: requiredText(price.source.id, field + ".source.id"),
      name: requiredText(price.source.name, field + ".source.name"),
      geography: requiredText(price.source.geography, field + ".source.geography"),
      geographyResolution: requiredText(price.source.geographyResolution, field + ".source.geographyResolution"),
      observedAt: dateValue(price.source.observedAt, field + ".source.observedAt", nowMs)
    };
    if (kind === "retailer-listing") {
      if (low !== high) fail("A retailer listing must be one observed price, not an unsupported range.");
      source.retrievedAt = dateValue(price.source.retrievedAt, field + ".source.retrievedAt", nowMs);
      source.productOrSku = requiredText(price.source.productOrSku, field + ".source.productOrSku");
    }
    return { kind: kind, currency: currency, unit: unit, lowScaled: low, highScaled: high, source: source };
  }
  function normalizeLineItem(item, currency, index, nowMs) {
    var prefix = "lineItems[" + index + "]";
    if (!isObject(item)) fail(prefix + " must be an object.");
    var id = requiredText(item.id, prefix + ".id");
    var name = requiredText(item.name, prefix + ".name");
    var unit = requiredText(item.unit, prefix + ".unit");
    var quantity = nonNegative(item.quantity, prefix + ".quantity");
    var required = item.required !== false;
    var excluded = item.excluded === true;
    if (excluded && required) fail(prefix + " is required and cannot be excluded; mark it optional before excluding it.");
    var price = excluded ? null : normalizePrice(item.price, currency, unit, prefix + ".price", nowMs);
    return { id: id, name: name, unit: unit, quantity: quantity, required: required, excluded: excluded, price: price };
  }
  function calculateEstimate(input, options) {
    if (!isObject(input)) fail("Estimate input must be an object.");
    // "now" is injectable so that tests and callers control the clock; it only limits provenance dates.
    var nowMs = options && options.now !== undefined ? (options.now instanceof Date ? options.now.getTime() : Number(options.now)) : Date.now();
    if (!Number.isFinite(nowMs)) fail("options.now must be a valid date or timestamp.");
    var currency = currencyCode(input.currency);
    var contingencyPct = nonNegative(input.contingencyPct, "contingencyPct");
    if (contingencyPct > 100) fail("contingencyPct cannot exceed 100.");
    if (!Array.isArray(input.lineItems) || input.lineItems.length === 0) fail("At least one line item is required.");
    var seen = Object.create(null);
    var items = input.lineItems.map(function (item, index) {
      var normalized = normalizeLineItem(item, currency, index, nowMs);
      if (seen[normalized.id]) fail("Line item IDs must be unique: " + normalized.id);
      seen[normalized.id] = true;
      return normalized;
    });
    var subtotalLow = 0, subtotalHigh = 0;
    var known = [], unknownRequired = [], unknownOptional = [], excluded = [];
    items.forEach(function (item) {
      if (item.excluded) { excluded.push(item); return; }
      if (!item.price) {
        (item.required ? unknownRequired : unknownOptional).push({ id: item.id, name: item.name, unit: item.unit, quantity: item.quantity });
        return;
      }
      var low = Math.round(item.quantity * item.price.lowScaled / 100);
      var high = Math.round(item.quantity * item.price.highScaled / 100);
      if (!Number.isSafeInteger(low) || !Number.isSafeInteger(high)) fail("Line item total exceeds safe arithmetic limits: " + item.id);
      subtotalLow += low; subtotalHigh += high;
      if (!Number.isSafeInteger(subtotalLow) || !Number.isSafeInteger(subtotalHigh)) fail("Estimate total exceeds safe arithmetic limits.");
      known.push({
        id: item.id, name: item.name, unit: item.unit, quantity: item.quantity,
        priceKind: item.price.kind, priceUnit: item.price.unit,
        unitPriceLow: item.price.lowScaled / UNIT_PRICE_SCALE, unitPriceHigh: item.price.highScaled / UNIT_PRICE_SCALE,
        totalLow: fromMinorUnits(low), totalHigh: fromMinorUnits(high), source: item.price.source
      });
    });
    var contingencyLow = Math.round(subtotalLow * contingencyPct / 100);
    var contingencyHigh = Math.round(subtotalHigh * contingencyPct / 100);
    var totalLow = subtotalLow + contingencyLow, totalHigh = subtotalHigh + contingencyHigh;
    if (![contingencyLow, contingencyHigh, totalLow, totalHigh].every(Number.isSafeInteger)) fail("Estimate total exceeds safe arithmetic limits.");
    return {
      currency: currency, lineItems: known, unknownRequired: unknownRequired, unknownOptional: unknownOptional,
      excluded: excluded.map(function (item) { return { id: item.id, name: item.name }; }),
      subtotalLow: fromMinorUnits(subtotalLow), subtotalHigh: fromMinorUnits(subtotalHigh),
      contingencyPct: contingencyPct, contingencyLow: fromMinorUnits(contingencyLow), contingencyHigh: fromMinorUnits(contingencyHigh),
      totalLow: fromMinorUnits(totalLow), totalHigh: fromMinorUnits(totalHigh),
      pricedLineCount: known.length,
      complete: unknownRequired.length === 0 && unknownOptional.length === 0,
      // At least one priced line is needed: an estimate with nothing priced has nothing to compare with a budget.
      canAssessRequiredScope: unknownRequired.length === 0 && known.length > 0
    };
  }
  function assessBudget(estimate, budget) {
    if (!isObject(estimate) || !isObject(budget)) fail("Estimate and budget objects are required.");
    // Only an object produced by calculateEstimate is accepted, so a hand-built object cannot skip the required-cost check.
    if (!Array.isArray(estimate.lineItems) || !Array.isArray(estimate.unknownRequired) || !Array.isArray(estimate.unknownOptional) ||
        typeof estimate.canAssessRequiredScope !== "boolean" || !Number.isFinite(estimate.totalLow) || !Number.isFinite(estimate.totalHigh)) {
      fail("Estimate must be the result of calculateEstimate.");
    }
    var currency = currencyCode(budget.currency);
    if (currency !== estimate.currency) fail("Budget currency must match estimate currency.");
    var budgetMinor = toMinorUnits(budget.amount, "budget.amount");
    var reserveMinor = budget.reserveAmount === undefined ? 0 : toMinorUnits(budget.reserveAmount, "budget.reserveAmount");
    if (reserveMinor > budgetMinor) fail("Reserve cannot exceed the total budget.");
    var availableMinor = budgetMinor - reserveMinor;
    if (estimate.unknownRequired && estimate.unknownRequired.length) {
      return {
        status: "cannot-assess",
        reason: "A required cost is unknown; the budget may not cover the full required scope.",
        budget: fromMinorUnits(budgetMinor), reserve: fromMinorUnits(reserveMinor), availableBudget: fromMinorUnits(availableMinor),
        // Partial: priced lines plus contingency only; the unknown required costs are NOT in these numbers.
        pricedTotalLow: estimate.totalLow, pricedTotalHigh: estimate.totalHigh,
        unknownRequired: estimate.unknownRequired.map(function (item) { return item.name; })
      };
    }
    if (!estimate.lineItems.length) {
      return {
        status: "cannot-assess",
        reason: "No line item has a price yet, so there is nothing to compare with the budget.",
        budget: fromMinorUnits(budgetMinor), reserve: fromMinorUnits(reserveMinor), availableBudget: fromMinorUnits(availableMinor),
        unknownRequired: [], unknownOptional: (estimate.unknownOptional || []).map(function (item) { return item.name; })
      };
    }
    var low = toMinorUnits(estimate.totalLow, "estimate.totalLow");
    var high = toMinorUnits(estimate.totalHigh, "estimate.totalHigh");
    var status = high <= availableMinor ? "likely-within-budget" : (low <= availableMinor ? "range-overlaps-budget" : "likely-over-budget");
    return {
      status: status,
      reason: estimate.unknownOptional && estimate.unknownOptional.length ?
        "Optional costs are not included; this result is not a complete project total." :
        "All required line items have a price in the estimate.",
      budget: fromMinorUnits(budgetMinor), reserve: fromMinorUnits(reserveMinor), availableBudget: fromMinorUnits(availableMinor),
      estimateLow: estimate.totalLow, estimateHigh: estimate.totalHigh,
      remainingLow: fromMinorUnits(availableMinor - high), remainingHigh: fromMinorUnits(availableMinor - low),
      unknownOptional: (estimate.unknownOptional || []).map(function (item) { return item.name; })
    };
  }
  return { version: "1.0.1", calculateEstimate: calculateEstimate, assessBudget: assessBudget };
}));
