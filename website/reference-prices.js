/* HomeProjectWise reference-price adapter (contract: docs/CALCULATOR-REFERENCE-PRICE-DATA-CONTRACT-2026-11-14.md).
 * Pure functions, deny by default. It never contains a price, never parses notes, never converts currency,
 * never averages records, and never makes a request: callers pass in the reviewed records from data/reference_prices.json.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWReferencePrices = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var SQFT_PER_M2 = 10.7639104167, M2_PER_SQFT = 0.09290304;
  var KINDS = ["regional-range", "retailer-listing", "editorial-range", "government-benchmark"];
  // Contract section 10.1: structurally valid but never eligible for automatic category selection.
  var BLOCKED_IDS = [
    "UK-flooring-lvt-spc-retailer-sample-2026-11-14", "CA-flooring-lvt-spc-rona-listings-2026-11-14",
    "EU-DE-carpet-hornbach-2026-11-14", "EU-DE-flooring-porcelain-tile-hornbach-2026-11-14",
    "CA-flooring-ceramic-tile-homedepot-listings-2026-11-14", "US-flooring-porcelain-tile-homedepot-sample-iqr-2026-11-14",
    "EU-NL-flooring-ceramic-tile-gamma-2026-11-14", "EU-NL-flooring-pvc-gamma-2026-11-14",
    "EU-NL-flooring-laminate-gamma-2026-11-14", "UK-flooring-solid-oak-retailer-sample-2026-11-14"
  ];
  var NO_REFERENCE = "No reference range yet; enter your own price or two quotes.";
  var DISCLAIMER = "This is a rough planning estimate to help you judge whether your budget may be enough. It is not a quote or a final cost. Prices vary by location, store, brand, quality, product size, availability and date. Labour, installation, delivery, preparation, taxes and other extras may not be included. For a more accurate estimate, replace the reference price with a local store price or two quotes.";
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ""));
    if (!m) return null;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return d.getUTCMonth() === +m[2] - 1 ? d : null;
  }
  function isOlderData(record, now) {
    var obs = parseDate(record && record.source && record.source.observedAt);
    if (!obs) return true;
    var limit = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 12, now.getUTCDate()));
    return obs < limit;
  }
  function areaBasis(unit) {
    var u = String(unit || "").toLowerCase().replace(/\s+/g, " ").trim();
    if (u === "sq ft" || u === "sqft" || u === "ft²" || u === "ft2") return "sqft";
    if (u === "m²" || u === "m2" || u === "sq m") return "m2";
    return null;
  }
  function validRange(r) {
    return r && Number.isFinite(r.low) && Number.isFinite(r.high) && r.low >= 0 && r.low <= r.high;
  }
  // Automatic selection needs structured fields supplied by the data owner; nothing is inferred from prose.
  function commonOk(r) {
    return !!r && r.autoEligible === true && BLOCKED_IDS.indexOf(r.id) === -1 && validRange(r) &&
      /^[A-Z]{3}$/.test(String(r.currency || "")) && !!r.source && !!parseDate(r.source.observedAt);
  }
  function isAutoEligible(r) {
    if (!commonOk(r)) return false;
    if (r.kind === "editorial-range" && r.category === "flooring") return typeof r.subtype === "string" && r.subtype !== "" && areaBasis(r.unit) !== null;
    if (r.kind === "government-benchmark" && r.category === "electricity") return String(r.unit).toLowerCase() === "kwh" && !!r.jurisdiction && !!r.tariffPlan;
    return false;
  }
  function denyReason(r) { return (r && r.autoEligibleReason) || "Not eligible for an automatic reference."; }
  function select(records, query) {
    var hits = (records || []).filter(function (r) {
      return isAutoEligible(r) && r.audience === query.country && r.category === query.category && r.subtype === query.subtype;
    });
    if (!hits.length) return { ok: false, message: NO_REFERENCE };
    hits.sort(function (a, b) { return a.source.observedAt < b.source.observedAt ? 1 : a.source.observedAt > b.source.observedAt ? -1 : 0; });
    if (hits.length > 1 && hits[0].source.observedAt === hits[1].source.observedAt) return { ok: false, message: NO_REFERENCE };
    return { ok: true, record: hits[0] };
  }
  // Electricity: exact jurisdiction (and plan where there is more than one). No cross-jurisdiction fallback;
  // "US-national" is only returned when it is asked for explicitly.
  function selectElectricity(records, query) {
    var hits = (records || []).filter(function (r) {
      return isAutoEligible(r) && r.category === "electricity" && r.jurisdiction === query.jurisdiction && (!query.tariffPlan || r.tariffPlan === query.tariffPlan);
    });
    if (!hits.length) return { ok: false, message: NO_REFERENCE };
    if (hits.length > 1) return { ok: false, ambiguous: true, plans: hits.map(function (r) { return r.tariffPlan; }), message: "Choose the tariff plan to see a reference rate." };
    var r = hits[0];
    return { ok: true, record: r, single: r.low === r.high, nationalFallback: r.jurisdiction === "US-national" };
  }
  function uniqueSorted(list) { return list.filter(function (v, i) { return list.indexOf(v) === i; }).sort(); }
  function flooringOptions(records, country) {
    return uniqueSorted((records || []).filter(function (r) { return isAutoEligible(r) && r.category === "flooring" && r.audience === country; }).map(function (r) { return r.subtype; }));
  }
  var COUNTRY_ORDER = ["US", "Canada", "UK", "Germany", "France", "Spain", "Italy", "Netherlands"];
  var COUNTRY_LABEL = { US: "United States", UK: "United Kingdom" };
  var SUBTYPE_LABEL = { "laminate": "Laminate", "lvp-spc": "Luxury vinyl plank / SPC", "sheet-vinyl": "Sheet vinyl", "broadloom-carpet": "Broadloom carpet", "carpet-tile": "Carpet tile", "engineered-hardwood": "Engineered hardwood", "solid-hardwood": "Solid hardwood", "ceramic-tile": "Ceramic tile", "porcelain-tile": "Porcelain tile" };
  function flooringCountries(records) {
    var seen = {};
    (records || []).forEach(function (r) { if (isAutoEligible(r) && r.category === "flooring") seen[r.audience] = true; });
    return COUNTRY_ORDER.filter(function (c) { return seen[c]; });
  }
  // Material cost range for an area: the sourced price per area times the area, converted only between sq ft and m2 (never currency).
  function areaCost(record, area, areaUnit) {
    var base = areaBasis(record && record.unit), au = areaBasis(areaUnit);
    if (!base || !au || !Number.isFinite(area) || area <= 0 || !validRange(record)) return null;
    var qty = au === base ? area : (base === "sqft" ? area * SQFT_PER_M2 : area * M2_PER_SQFT);
    return { low: Number((qty * record.low).toFixed(2)), high: Number((qty * record.high).toFixed(2)), currency: record.currency, quantity: Number(qty.toFixed(4)), quantityUnit: record.unit };
  }
  // Engine price for an item counted in sq ft or m2: the sourced price per area, converted only between those two units (never currency).
  function toEngineAreaPrice(record, itemUnit) {
    var base = areaBasis(record && record.unit), iu = areaBasis(itemUnit);
    if (!base || !iu || !validRange(record) || !record.source) return null;
    var f = iu === base ? 1 : (iu === "sqft" ? M2_PER_SQFT : SQFT_PER_M2), s = record.source;
    return { kind: "editorial-range", currency: record.currency, unit: itemUnit, low: Number((record.low * f).toFixed(4)), high: Number((record.high * f).toFixed(4)),
      source: { id: s.id, name: s.name, geography: s.geography, geographyResolution: s.geographyResolution, observedAt: s.observedAt } };
  }
  function electricityChoices(records) {
    var rows = (records || []).filter(function (r) { return isAutoEligible(r) && r.category === "electricity"; });
    var perJurisdiction = {};
    rows.forEach(function (r) { perJurisdiction[r.jurisdiction] = (perJurisdiction[r.jurisdiction] || 0) + 1; });
    var order = ["US", "Canada", "UK", "Germany", "France", "Spain", "Italy", "Netherlands"];
    return rows.map(function (r) {
      return { id: r.id, jurisdiction: r.jurisdiction, tariffPlan: r.tariffPlan, audience: r.audience,
        label: r.source.geography + (perJurisdiction[r.jurisdiction] > 1 ? " – " + r.tariffPlan : "") };
    }).sort(function (x, y) {
      var ax = order.indexOf(x.audience), ay = order.indexOf(y.audience);
      ax = ax === -1 ? 99 : ax; ay = ay === -1 ? 99 : ay;
      return ax - ay || (x.label < y.label ? -1 : x.label > y.label ? 1 : 0);
    });
  }
  function electricityOptions(records) {
    var by = {};
    (records || []).forEach(function (r) {
      if (!isAutoEligible(r) || r.category !== "electricity") return;
      (by[r.jurisdiction] = by[r.jurisdiction] || { jurisdiction: r.jurisdiction, audience: r.audience, plans: [] }).plans.push(r.tariffPlan);
    });
    return Object.keys(by).sort().map(function (k) { return by[k]; });
  }
  // Reference price per area -> price per pack, using the coverage the visitor entered from the product label.
  function packRange(record, coverage, coverageUnit) {
    var base = areaBasis(record.unit), cu = areaBasis(coverageUnit);
    if (!base || !cu || !Number.isFinite(coverage) || coverage <= 0 || !validRange(record)) return null;
    var cov = cu === base ? coverage : (base === "sqft" ? coverage * SQFT_PER_M2 : coverage * M2_PER_SQFT);
    var round = function (x) { return Number(x.toFixed(4)); };
    return { low: round(record.low * cov), high: round(record.high * cov), currency: record.currency, unit: "pack" };
  }
  function toEnginePrice(record, coverage, coverageUnit) {
    var p = packRange(record, coverage, coverageUnit);
    if (!p) return null;
    var s = record.source;
    return { kind: "editorial-range", currency: p.currency, unit: p.unit, low: p.low, high: p.high,
      source: { id: s.id, name: s.name, geography: s.geography, geographyResolution: s.geographyResolution, observedAt: s.observedAt } };
  }
  function describe(record, now) {
    var s = record.source;
    return { range: record.low + "–" + record.high + " " + record.currency + " per " + record.unit, sourceName: s.name, publisher: s.publisher,
      url: s.url, geography: s.geography, observedAt: s.observedAt, retrievedAt: s.retrievedAt, caveats: record.caveats, notes: record.notes,
      older: isOlderData(record, now), disclaimer: DISCLAIMER };
  }
  // Structural checks from the contract, used by tests to audit the data file without changing it.
  function validateDataset(records, now) {
    var problems = [], seen = {};
    (records || []).forEach(function (r, i) {
      var id = r && r.id ? r.id : "#" + i;
      function bad(m) { problems.push(id + ": " + m); }
      if (seen[id]) bad("duplicate id"); seen[id] = true;
      if (KINDS.indexOf(r.kind) === -1) bad("unknown kind");
      if (!validRange(r)) bad("low/high must be finite, non-negative, low <= high");
      if (!/^[A-Z]{3}$/.test(String(r.currency || ""))) bad("currency must be a 3-letter code");
      if (!r.unit) bad("missing unit");
      var s = r.source || {};
      ["id", "name", "publisher", "url", "geography", "geographyResolution"].forEach(function (k) { if (!s[k]) bad("source." + k + " missing"); });
      var obs = parseDate(s.observedAt), ret = parseDate(s.retrievedAt);
      if (!obs) bad("observedAt invalid"); else if (obs > now) bad("observedAt in the future");
      if (!ret) bad("retrievedAt invalid");
      if (r.kind === "retailer-listing") {
        if (r.low !== r.high) bad("retailer-listing must be a single price");
        if (!(r.productOrSku || s.productOrSku)) bad("retailer-listing missing productOrSku");
      }
    });
    return problems;
  }
  return { SQFT_PER_M2: SQFT_PER_M2, M2_PER_SQFT: M2_PER_SQFT, BLOCKED_IDS: BLOCKED_IDS, NO_REFERENCE: NO_REFERENCE, DISCLAIMER: DISCLAIMER,
    parseDate: parseDate, isOlderData: isOlderData, areaBasis: areaBasis, isAutoEligible: isAutoEligible, denyReason: denyReason, select: select, selectElectricity: selectElectricity, flooringOptions: flooringOptions, electricityOptions: electricityOptions, electricityChoices: electricityChoices, flooringCountries: flooringCountries, areaCost: areaCost, toEngineAreaPrice: toEngineAreaPrice, COUNTRY_LABEL: COUNTRY_LABEL, COUNTRY_ORDER: COUNTRY_ORDER, SUBTYPE_LABEL: SUBTYPE_LABEL,
    packRange: packRange, toEnginePrice: toEnginePrice, describe: describe, validateDataset: validateDataset };
}));
