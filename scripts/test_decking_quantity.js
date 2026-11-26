"use strict";
const assert = require("node:assert/strict");
const { calculate } = require("../website/decking-quantity-calculator.js");
let passed = 0;
function test(name, fn) { fn(); passed += 1; console.log("PASS " + name); }
function base(overrides) {
  return Object.assign({
    unit: "m", boardWidth: 0.1, boardGap: 0.005, stockLength: 2.5,
    wastePercent: "", sections: [{ length: 4, width: 2, orientation: "along-length", edgeClearance: 0 }]
  }, overrides || {});
}
test("metric section: 20 rows × 2 boards per row = 40, no hidden allowance", function () {
  const r = calculate(base());
  assert.equal(r.sections[0].rows, 20);
  assert.equal(r.sections[0].boardsPerRow, 2);
  assert.equal(r.baseBoards, 40);
  assert.equal(r.extraBoards, 0);
  assert.equal(r.totalBoards, 40);
});
test("visitor-selected 5% allowance rounds up to three extra boards", function () {
  const r = calculate(base({ wastePercent: 5 }));
  assert.equal(r.extraBoards, 2);
  assert.equal(r.totalBoards, 42);
});
test("zero board gap is accepted when explicitly entered", function () {
  const r = calculate(base({ boardGap: 0 }));
  assert.equal(r.sections[0].rows, 20);
});
test("edge clearance is deducted on both sides", function () {
  const r = calculate(base({ sections: [{ length: 4, width: 2, orientation: "along-length", edgeClearance: 0.1 }] }));
  assert.equal(r.sections[0].usableWidth, 1.8);
  assert.equal(r.sections[0].rows, 18);
});
test("orientation along width swaps run and row dimensions", function () {
  const r = calculate(base({ sections: [{ length: 4, width: 2, orientation: "along-width", edgeClearance: 0 }] }));
  assert.equal(r.sections[0].runLength, 2);
  assert.equal(r.sections[0].acrossWidth, 4);
  assert.equal(r.sections[0].rows, 39);
  assert.equal(r.sections[0].boardsPerRow, 1);
  assert.equal(r.baseBoards, 39);
});
test("multiple rectangles are rounded separately and summed", function () {
  const r = calculate(base({ sections: [
    { length: 4, width: 2, orientation: "along-length", edgeClearance: 0 },
    { length: 2, width: 1, orientation: "along-width", edgeClearance: 0 }
  ] }));
  assert.equal(r.sections[0].boards, 40);
  assert.equal(r.sections[1].boards, 20);
  assert.equal(r.baseBoards, 60);
  assert.equal(r.totalArea, 10);
});
test("imperial dimensions use the same entered unit without hidden conversion", function () {
  const r = calculate(base({ unit: "ft", boardWidth: 0.5, boardGap: 0, stockLength: 12,
    sections: [{ length: 12, width: 8, orientation: "along-length", edgeClearance: 0 }] }));
  assert.equal(r.sections[0].rows, 16);
  assert.equal(r.sections[0].boardsPerRow, 1);
  assert.equal(r.totalBoards, 16);
});
test("stock boards round up per row", function () {
  const r = calculate(base({ stockLength: 1.5 }));
  assert.equal(r.sections[0].boardsPerRow, 3);
  assert.equal(r.baseBoards, 60);
});
test("missing unit is rejected", function () {
  assert.throws(() => calculate(base({ unit: "" })), /Choose metres or feet/);
});
test("missing board gap is rejected rather than assumed", function () {
  assert.throws(() => calculate(base({ boardGap: "" })), /Gap between boards/);
});
test("missing edge clearance is rejected rather than assumed", function () {
  assert.throws(() => calculate(base({ sections: [{ length: 4, width: 2, orientation: "along-length", edgeClearance: "" }] })), /edge clearance/);
});
test("missing board direction is rejected", function () {
  assert.throws(() => calculate(base({ sections: [{ length: 4, width: 2, orientation: "", edgeClearance: 0 }] })), /choose whether boards run/);
});
test("edge clearance that consumes the full width is rejected", function () {
  assert.throws(() => calculate(base({ sections: [{ length: 4, width: 2, orientation: "along-length", edgeClearance: 1 }] })), /no usable board width/);
});
test("negative and zero board dimensions are rejected", function () {
  assert.throws(() => calculate(base({ boardWidth: 0 })), /greater than zero/);
  assert.throws(() => calculate(base({ stockLength: -1 })), /greater than zero/);
});
test("negative gap and allowance above 100% are rejected", function () {
  assert.throws(() => calculate(base({ boardGap: -0.01 })), /zero or greater/);
  assert.throws(() => calculate(base({ wastePercent: 101 })), /between 0% and 100%/);
});
test("empty surface list is rejected", function () {
  assert.throws(() => calculate(base({ sections: [] })), /at least one measured/);
});
console.log(passed + " decking quantity fixtures passed");
