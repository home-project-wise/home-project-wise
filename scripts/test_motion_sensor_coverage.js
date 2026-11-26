"use strict";
const assert = require("node:assert/strict");
const C = require("../website/motion-sensor-coverage-calculator.js");
let passed = 0;
function check(name, fn) { fn(); passed++; console.log("PASS " + name); }
const base = (overrides) => Object.assign({ area: 70, coverage: 20, unit: "m2" }, overrides || {});

check("metric area divides by the manufacturer's entered coverage and rounds up", () => {
  const r = C.calculate(base());
  assert.equal(r.count, 4);
  assert.equal(r.ratio, 3.5);
  assert.equal(r.unit, "m²");
});
check("imperial area uses the same unit without an unrequested conversion", () => {
  const r = C.calculate(base({ area: 180, coverage: 60, unit: "ft2" }));
  assert.equal(r.count, 3);
  assert.equal(r.area, 180);
  assert.equal(r.coverage, 60);
  assert.equal(r.unit, "ft²");
});
check("exact division does not add an extra sensor", () => {
  assert.equal(C.calculate(base({ area: 60, coverage: 20 })).count, 3);
});
check("any positive remainder rounds up to the next whole sensor", () => {
  assert.equal(C.calculate(base({ area: 60.01, coverage: 20 })).count, 4);
});
check("decimal values just above an integer ratio are never rounded down by a tolerance", () => {
  assert.equal(C.calculate(base({ area: "10.00000000001", coverage: "10" })).count, 2);
});
check("exact decimal division is not over-counted by binary floating-point noise", () => {
  assert.equal(C.calculate(base({ area: "0.3", coverage: "0.1" })).count, 3);
});
check("one sensor is the minimum when its stated area covers the entered area", () => {
  assert.equal(C.calculate(base({ area: 18, coverage: 500 })).count, 1);
});
check("fractional areas are accepted and the returned ratio is inspectable", () => {
  const r = C.calculate(base({ area: 12.5, coverage: 5 }));
  assert.equal(r.count, 3);
  assert.equal(r.ratio, 2.5);
});
check("missing values stop and explain that range and angle cannot replace a stated area", () => {
  assert.throws(() => C.calculate(base({ coverage: "" })), /cannot convert them into an area/);
  assert.throws(() => C.calculate(base({ area: "" })), /Area to cover is required/);
});
check("zero, negative and non-finite values are rejected for both inputs", () => {
  for (const area of [0, -1, "NaN", "Infinity"]) assert.throws(() => C.calculate(base({ area })));
  for (const coverage of [0, -1, "NaN", "Infinity"]) assert.throws(() => C.calculate(base({ coverage })));
});
check("units must be selected explicitly and cannot be mixed", () => {
  assert.throws(() => C.calculate(base({ unit: "" })), /Choose square metres or square feet/);
  assert.throws(() => C.calculate(base({ unit: "cm2" })), /Choose square metres or square feet/);
});
check("overflow and unsafe counts stop rather than returning a misleading integer", () => {
  assert.throws(() => C.calculate(base({ area: 1e308, coverage: 1e-308 })), /supported number range/);
  assert.throws(() => C.calculate(base({ area: 1e20, coverage: 1 })), /supported number range/);
});
console.log(passed + " motion sensor coverage fixtures passed");
