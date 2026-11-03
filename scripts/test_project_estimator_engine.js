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
rejects("missing price cannot be silently passed as zero", () => estimator.calculateEstimate({
  currency: "USD", contingencyPct: 0, lineItems: [{ id: "x", name: "Unknown item", quantity: 1, unit: "each" }]
}), /price/);
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
}), /single observed price/);
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
