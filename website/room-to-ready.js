/* HomeProjectWise Room-to-Ready Stage A domain model.
 * Pure, in-memory aggregation of already-selected calculator inputs. No prices are embedded,
 * fetched, converted between currencies, persisted, or sent. Electricity is deliberately separate.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWRoomToReady = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var M2_PER_FT2 = 0.09290304;
  var MARKET_CURRENCY = { US: "USD", Canada: "CAD", UK: "GBP", Germany: "EUR", France: "EUR", Spain: "EUR", Italy: "EUR", Netherlands: "EUR" };

  function fail(message) { throw new Error(message); }
  function finitePositive(value, field) {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) fail(field + " must be a finite number greater than zero.");
    return value;
  }
  function finiteNonNegative(value, field) {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) fail(field + " must be a finite non-negative number.");
    return value;
  }
  function roomAreas(room) {
    if (!room || typeof room !== "object") fail("A shared room is required.");
    var unit = room.unit === "ft" ? "ft" : (room.unit === "m" ? "m" : null);
    if (!unit) fail("Room unit must be m or ft.");
    var length = finitePositive(room.length, "Room length");
    var width = finitePositive(room.width, "Room width");
    var factor = unit === "ft" ? M2_PER_FT2 : 1;
    var floorM2 = length * width * factor;
    if (!Number.isFinite(floorM2) || floorM2 <= 0) fail("Floor area is outside the supported range.");
    var result = { unit: unit, floorM2: floorM2, wallGrossM2: null, wallNetM2: null, wallAreaKnown: false };
    if (room.height !== null && room.height !== undefined && room.height !== "") {
      var height = finitePositive(room.height, "Wall height");
      var openings = room.openings === null || room.openings === undefined || room.openings === "" ? 0 : finiteNonNegative(room.openings, "Doors and windows area");
      var gross = 2 * (length + width) * height * factor;
      var net = gross - openings * factor;
      if (!Number.isFinite(net) || net <= 0) fail("Doors and windows must be smaller than the total wall area.");
      result.wallGrossM2 = gross;
      result.wallNetM2 = net;
      result.wallAreaKnown = true;
    }
    return result;
  }
  function priceForLine(price, expectedCurrency, expectedUnit, label) {
    if (price === null || price === undefined) return null;
    if (!price || typeof price !== "object") fail(label + " price must be an object.");
    var kind = price.kind;
    if (kind === "user-input") {
      finiteNonNegative(price.amount, label + " price");
      if (price.currency !== expectedCurrency || price.unit !== expectedUnit) fail(label + " price currency/unit does not match the project.");
      return { kind: kind, currency: expectedCurrency, unit: expectedUnit, amount: price.amount };
    }
    if (kind === "user-range") {
      finiteNonNegative(price.low, label + " low price");
      finiteNonNegative(price.high, label + " high price");
      if (price.low > price.high) fail(label + " low price cannot exceed high price.");
      if (price.currency !== expectedCurrency || price.unit !== expectedUnit) fail(label + " price currency/unit does not match the project.");
      return { kind: kind, currency: expectedCurrency, unit: expectedUnit, low: price.low, high: price.high };
    }
    if (["regional-range", "retailer-listing", "editorial-range", "government-benchmark"].indexOf(kind) === -1) fail(label + " price kind is not supported.");
    finiteNonNegative(price.low, label + " low price");
    finiteNonNegative(price.high, label + " high price");
    if (price.low > price.high) fail(label + " low price cannot exceed high price.");
    if (price.currency !== expectedCurrency || price.unit !== expectedUnit) fail(label + " reference currency/unit does not match the project.");
    var s = price.source;
    if (!s || !s.id || !s.name || !s.geography || !s.geographyResolution || !s.observedAt) fail(label + " reference price is missing source provenance.");
    return { kind: kind, currency: expectedCurrency, unit: expectedUnit, low: price.low, high: price.high,
      source: { id: s.id, name: s.name, geography: s.geography, geographyResolution: s.geographyResolution, observedAt: s.observedAt } };
  }
  function buildPlan(input, estimator, options) {
    if (!input || typeof input !== "object") fail("Room-to-Ready input is required.");
    if (!estimator || typeof estimator.calculateEstimate !== "function") fail("The project estimate engine is required.");
    var market = input.market;
    var currency = MARKET_CURRENCY[market];
    if (!currency) fail("Choose a supported market before building the project plan.");
    var areas = roomAreas(input.room);
    var finish = input.wallFinish || "none";
    if (["none", "paint", "wallpaper"].indexOf(finish) === -1) fail("Choose paint OR wallpaper for the shared wall area, not both.");
    var lineItems = [];
    var sourceDetails = [];
    var wallFinishNote = finish === "none" ? "" : "Paint and wallpaper lines are area-based sample ranges. They do not include waste, pattern matching or trim and are not a tin or roll count.";
    function keepSources(itemName, price) {
      if (!price || !price.source) return;
      var s = price.source;
      var urls = Array.isArray(s.urls) ? s.urls.slice() : (s.url ? [s.url] : []);
      sourceDetails.push({ item: itemName, name: s.name, observedAt: s.observedAt, geography: s.geography, geographyResolution: s.geographyResolution, urls: urls });
    }
    function addLine(id, name, quantity, unit, price) {
      lineItems.push({ id: id, name: name, quantity: quantity, unit: unit, required: true,
        price: priceForLine(price, currency, unit, name) });
    }
    if (input.flooring) {
      addLine("room-flooring", "Flooring", areas.floorM2, "m²", input.flooring.price || null);
      keepSources("Flooring", input.flooring.price);
    }
    if (finish !== "none") {
      if (!areas.wallAreaKnown) {
        // Preserve the selected work as an explicit unknown; do not fabricate a wall area or a zero cost.
        addLine("room-wall-finish", finish === "paint" ? "Wall paint (wall area not measured)" : "Wallpaper (wall area not measured)",
          1, "unmeasured wall area", null);
      } else if (finish === "paint") {
        var coats = input.paintCoats;
        if (coats !== 1 && coats !== 2) fail("Paint coats must be 1 or 2.");
        addLine("room-wall-finish", "Wall paint (" + coats + " coat" + (coats === 1 ? "" : "s") + ")",
          areas.wallNetM2 * coats, "m²/coat", input.paintPrice || null);
        keepSources("Wall paint", input.paintPrice);
      } else {
        addLine("room-wall-finish", "Wallpaper", areas.wallNetM2, "m²", input.wallpaperPrice || null);
        keepSources("Wallpaper", input.wallpaperPrice);
      }
    }
    if (!lineItems.length) fail("Choose at least one project item to add to the room plan.");
    var estimate = estimator.calculateEstimate({ currency: currency, contingencyPct: 0, lineItems: lineItems }, options);
    var electricity = null;
    if (input.electricity !== null && input.electricity !== undefined) {
      var e = input.electricity;
      if (!e || typeof e !== "object") fail("Electricity running cost must be an object.");
      if (e.currency !== currency) fail("Electricity currency must match the selected market; no currency conversion is performed.");
      if (typeof e.low !== "number" || !Number.isFinite(e.low) || e.low < 0 ||
          typeof e.high !== "number" || !Number.isFinite(e.high) || e.high < e.low) fail("Electricity running-cost range is invalid.");
      electricity = { low: e.low, high: e.high, currency: currency, period: String(e.period || "period not specified"),
        excludedFromMaterialsSubtotal: true };
    }
    return {
      market: market, currency: currency, areas: areas, wallFinish: finish,
      estimate: estimate,
      engineLineItems: lineItems,
      sources: sourceDetails,
      wallFinishNote: wallFinishNote,
      knownMaterialSubtotal: { low: estimate.subtotalLow, high: estimate.subtotalHigh, currency: currency },
      unknownRequired: estimate.unknownRequired.map(function (x) { return { id: x.id, name: x.name }; }),
      isIncomplete: estimate.unknownRequired.length > 0,
      electricity: electricity,
      disclaimer: estimate.unknownRequired.length > 0
        ? "This is a partial known-material subtotal. One or more selected project costs are still unknown and are not counted as zero."
        : "This is a planning estimate for the selected, priced materials only; it is not a quote."
    };
  }
  return { version: "1.0.0", MARKET_CURRENCY: MARKET_CURRENCY, roomAreas: roomAreas, buildPlan: buildPlan };
}));
