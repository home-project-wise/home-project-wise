// Tests for the pure HomeProjectWise project-estimator engine.
// Run: node scripts/test_project_estimator_engine.js
"use strict";
const assert = require("node:assert/strict");
const estimator = require("../website/project-estimator-engine.js");
const source = { id: "licensed-demo-dataset", name: "Licensed regional cost dataset", geography: "Austin metro, TX, USA", geographyResolution: "metro", observedAt: "2026-10-15" };
const estimate = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 10,
  lineItems: [
    { id: "paint", name: "Paint", quantity: 12, unit: "gallon", price: { kind: "regional-range", unit: "gallon", low: 2.50, high: 3.00, currency: "USD", source } },
    { id: "labor", name: "Painting labor", quantity: 1, unit: "job", price: { kind: "user-input", unit: "job", amount: 100, currency: "USD" } },
    { id: "permit", name: "Permit", quantity: 1, unit: "job", required: true, price: null },
    { id: "delivery", name: "Delivery", quantity: 1, unit: "job", required: false, price: null },
    { id: "optional-upgrade", name: "Optional upgrade not selected", quantity: 1, unit: "job", required: false, excluded: true }
  ]
});
assert.equal(estimate.subtotalLow, 130);
assert.equal(estimate.subtotalHigh, 136);
assert.equal(estimate.contingencyLow, 13);
assert.equal(estimate.contingencyHigh, 13.6);
assert.equal(estimate.totalLow, 143);
assert.equal(estimate.totalHigh, 149.6);
assert.deepEqual(estimate.unknownRequired.map(x => x.id), ["permit"]);
assert.deepEqual(estimate.unknownOptional.map(x => x.id), ["delivery"]);
assert.deepEqual(estimate.excluded.map(x => x.id), ["optional-upgrade"]);
assert.equal(estimate.canAssessRequiredScope, false);
assert.equal(estimator.assessBudget(estimate, { amount: 200, reserveAmount: 20, currency: "USD" }).status, "cannot-assess");

const complete = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0,
  lineItems: [
    { id: "flooring", name: "Flooring packs", quantity: 10, unit: "pack", price: { kind: "user-input", unit: "pack", amount: 24.99, currency: "USD" } },
    { id: "labor", name: "Installation", quantity: 5, unit: "hour", price: { kind: "user-input", unit: "hour", amount: 40, currency: "USD" } }
  ]
});
assert.equal(complete.totalLow, 449.9);
assert.equal(complete.totalHigh, 449.9);
assert.equal(estimator.assessBudget(complete, { amount: 500, reserveAmount: 50, currency: "USD" }).status, "likely-within-budget");
const ranged = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0,
  lineItems: [{ id: "range", name: "Material range", quantity: 1, unit: "job",
    price: { kind: "regional-range", unit: "job", low: 400, high: 500, currency: "USD", source } }]
});
assert.equal(estimator.assessBudget(ranged, { amount: 450, currency: "USD" }).status, "range-overlaps-budget");
assert.equal(estimator.assessBudget(complete, { amount: 400, currency: "USD" }).status, "likely-over-budget");

const optionalUnknown = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0,
  lineItems: [
    { id: "materials", name: "Materials", quantity: 1, unit: "job", price: { kind: "user-input", unit: "job", amount: 100, currency: "USD" } },
    { id: "optional", name: "Optional disposal", quantity: 1, unit: "job", required: false, price: null }
  ]
});
const optionalResult = estimator.assessBudget(optionalUnknown, { amount: 120, currency: "USD" });
assert.equal(optionalResult.status, "likely-within-budget");
assert.match(optionalResult.reason, /Optional costs are not included/);
assert.deepEqual(optionalResult.unknownOptional, ["Optional disposal"]);

const retailer = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0,
  lineItems: [{
    id: "tile", name: "Tile box", quantity: 4, unit: "box",
    price: { kind: "retailer-listing", unit: "box", low: 18.50, high: 18.50, currency: "USD",
      source: { ...source, retrievedAt: "2026-11-03T10:00:00Z", productOrSku: "SKU-123" } }
  }]
});
assert.equal(retailer.totalLow, 74);

function rejects(name, fn, pattern) { assert.throws(fn, pattern, name); }
rejects("required line items cannot be excluded from the estimate", () => estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0,
  lineItems: [{ id: "required", name: "Required work", quantity: 1, unit: "job", excluded: true }]
}), /required and cannot be excluded/);
const missingPrice = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0, lineItems: [{ id: "x", name: "Unknown item", quantity: 1, unit: "each" }]
});
assert.deepEqual(missingPrice.unknownRequired.map(x => x.id), ["x"]);
assert.equal(missingPrice.subtotalLow, 0); // Known subtotal only; the required unknown is disclosed separately.
assert.equal(missingPrice.complete, false);
assert.equal(missingPrice.canAssessRequiredScope, false);
assert.equal(estimator.assessBudget(missingPrice, { amount: 500, currency: "USD" }).status, "cannot-assess");
const explicitNullPrice = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0, lineItems: [{ id: "y", name: "Unpriced required item", quantity: 1, unit: "each", price: null }]
});
assert.deepEqual(explicitNullPrice.unknownRequired.map(x => x.id), ["y"]);
assert.equal(estimator.assessBudget(explicitNullPrice, { amount: 500, currency: "USD" }).status, "cannot-assess");
rejects("negative user price", () => estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0, lineItems: [{ id: "x", name: "Bad", quantity: 1, unit: "each", price: { kind: "user-input", unit: "each", amount: -1, currency: "USD" } }]
}), /non-negative/);
rejects("external price without provenance", () => estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0, lineItems: [{ id: "x", name: "Bad", quantity: 1, unit: "each", price: { kind: "regional-range", unit: "each", low: 1, high: 2, currency: "USD" } }]
}), /provenance/);
rejects("reversed range", () => estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0, lineItems: [{ id: "x", name: "Bad", quantity: 3, unit: "each", price: { kind: "regional-range", unit: "each", low: 3, high: 2, currency: "USD", source } }]
}), /cannot exceed/);
rejects("mixed currency", () => estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0, lineItems: [{ id: "x", name: "Bad", quantity: 1, unit: "each", price: { kind: "user-input", unit: "each", amount: 2, currency: "CAD" } }]
}), /must match/);
rejects("retailer price must be a single observed price", () => estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0, lineItems: [{ id: "x", name: "Bad", quantity: 1, unit: "each", price: { kind: "retailer-listing", unit: "each", low: 2, high: 3, currency: "USD", source: { ...source, retrievedAt: "2026-11-03T10:00:00Z", productOrSku: "SKU" } } }]
}), /one observed price/);
rejects("missing contingency must be explicit", () => estimator.calculateEstimate({
  currency: "USD", lineItems: [{ id: "x", name: "Bad", quantity: 1, unit: "each", price: { kind: "user-input", unit: "each", amount: 2, currency: "USD" } }]
}), /contingencyPct/);
rejects("reserve cannot exceed budget", () => estimator.assessBudget(complete, { amount: 10, reserveAmount: 11, currency: "USD" }));
rejects("budget currency mismatch", () => estimator.assessBudget(complete, { amount: 500, currency: "CAD" }), /must match/);
rejects("price unit must match line item unit", () => estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0,
  lineItems: [{ id: "x", name: "Bad unit", quantity: 1, unit: "gallon", price: { kind: "user-input", unit: "litre", amount: 2, currency: "USD" } }]
}), /must match the line item unit/);
console.log("Project estimator engine: all assertions passed.");
// --- Regression tests for the four findings of the Claude review (2026-11-03) ---
const NOW = new Date("2026-11-04T12:00:00Z");
// 1. An estimate with nothing priced must not produce a budget verdict.
const nothingPriced = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 10, lineItems: [{ id: "paint", name: "Paint", quantity: 2, unit: "gallon", required: false, price: null }]
});
assert.equal(nothingPriced.pricedLineCount, 0);
assert.equal(nothingPriced.canAssessRequiredScope, false);
const nothingPricedResult = estimator.assessBudget(nothingPriced, { amount: 100, currency: "USD" });
assert.equal(nothingPricedResult.status, "cannot-assess");
assert.match(nothingPricedResult.reason, /No line item has a price/);
const allExcluded = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0, lineItems: [{ id: "a", name: "Extra", quantity: 1, unit: "job", required: false, excluded: true }]
});
assert.equal(estimator.assessBudget(allExcluded, { amount: 100, currency: "USD" }).status, "cannot-assess");
// The partial total of a cannot-assess result is named as partial and never as the project estimate.
const partial = estimator.assessBudget(missingPrice, { amount: 500, currency: "USD" });
assert.equal(partial.estimateLow, undefined);
assert.equal(partial.pricedTotalLow, 0);

// 2. Unit prices keep 4 decimals: no rounding to cents before multiplying.
const wire = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0,
  lineItems: [{ id: "wire", name: "Wire", quantity: 1000, unit: "ft", price: { kind: "user-input", unit: "ft", amount: 0.285, currency: "USD" } }]
});
assert.equal(wire.totalLow, 285);
assert.equal(wire.lineItems[0].unitPriceLow, 0.285);
const tile = estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0,
  lineItems: [{ id: "tile", name: "Tile", quantity: 800, unit: "sqft", price: { kind: "regional-range", unit: "sqft", low: 2.754, high: 3.246, currency: "USD", source } }]
}, { now: NOW });
assert.equal(tile.totalLow, 2203.2);
assert.equal(tile.totalHigh, 2596.8);
rejects("more than 4 decimals in a unit price is rejected, not rounded", () => estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0,
  lineItems: [{ id: "x", name: "Bad", quantity: 1, unit: "ft", price: { kind: "user-input", unit: "ft", amount: 0.28549, currency: "USD" } }]
}), /at most 4 decimal places/);

// 3. assessBudget accepts only the result of calculateEstimate.
rejects("hand-built estimate is rejected", () => estimator.assessBudget({ currency: "USD", totalLow: 0, totalHigh: 0 }, { amount: 50, currency: "USD" }), /result of calculateEstimate/);
rejects("estimate without the required-cost flag is rejected", () => estimator.assessBudget({ currency: "USD", totalLow: 0, totalHigh: 0, lineItems: [], unknownRequired: [], unknownOptional: [] }, { amount: 50, currency: "USD" }), /result of calculateEstimate/);

// 4. Provenance dates must be ISO 8601 and not in the future.
function withDate(observedAt) {
  return () => estimator.calculateEstimate({
    currency: "USD", contingencyPct: 0,
    lineItems: [{ id: "x", name: "Item", quantity: 1, unit: "each", price: { kind: "regional-range", unit: "each", low: 1, high: 2, currency: "USD", source: { ...source, observedAt } } }]
  }, { now: NOW });
}
rejects("loose date string", withDate("1"), /ISO 8601/);
rejects("not a date", withDate("last week"), /ISO 8601/);
rejects("future date", withDate("2099-01-01"), /cannot be in the future/);
assert.equal(withDate("2026-11-04")().lineItems[0].source.observedAt, "2026-11-04");
assert.equal(withDate("2026-11-03T10:00:00Z")().lineItems[0].source.observedAt, "2026-11-03T10:00:00Z");
rejects("invalid now option", () => estimator.calculateEstimate({ currency: "USD", contingencyPct: 0, lineItems: [{ id: "x", name: "i", quantity: 1, unit: "each" }] }, { now: "tomorrow" }), /options.now/);
console.log("Project estimator engine: review regression tests passed.");
// 5. Provenance cannot be bypassed with a fully-shaped forged estimate; returned data is immutable.
const forgedEstimate = {
  currency: complete.currency, lineItems: complete.lineItems,
  unknownRequired: complete.unknownRequired, unknownOptional: complete.unknownOptional,
  canAssessRequiredScope: true, totalLow: 0, totalHigh: 0
};
rejects("fully-shaped forged estimate is rejected", () => estimator.assessBudget(forgedEstimate, { amount: 500, currency: "USD" }), /result of calculateEstimate/);
rejects("returned estimate cannot be mutated", () => { complete.totalLow = 0; }, TypeError);
rejects("nested estimate lines cannot be mutated", () => { complete.lineItems[0].totalLow = 0; }, TypeError);
assert.equal(estimator.assessBudget(complete, { amount: 500, reserveAmount: 50, currency: "USD" }).status, "likely-within-budget");

// 6. ISO validation rejects impossible calendar days, times and UTC offsets.
rejects("impossible February date is rejected", withDate("2026-02-30"), /impossible calendar date/);
rejects("month 13 is rejected", withDate("2026-13-01"), /impossible calendar date/);
rejects("hour 24 is rejected", withDate("2026-11-03T24:00:00Z"), /invalid time/);
rejects("minute 60 is rejected", withDate("2026-11-03T10:60:00Z"), /invalid time/);
rejects("second 60 is rejected", withDate("2026-11-03T10:00:60Z"), /invalid time/);
rejects("UTC offset beyond 14 hours is rejected", withDate("2026-11-03T10:00:00+15:00"), /invalid UTC offset/);
rejects("UTC offset minutes beyond 14:00 are rejected", withDate("2026-11-03T10:00:00+14:01"), /invalid UTC offset/);
assert.equal(withDate("2024-02-29")().lineItems[0].source.observedAt, "2024-02-29");
rejects("non-leap February 29 is rejected", withDate("2026-02-29"), /impossible calendar date/);


