"use strict";
const assert = require("node:assert/strict");
const { calculate } = require("../website/insulation-quantity-calculator.js");
let passed = 0;
function test(name, fn) { fn(); passed += 1; console.log("PASS " + name); }
function base(overrides) {
  return Object.assign({
    unit:"m", sections:[{length:5,width:4}], openingsArea:"", sharedWallAreaM2:0,
    productName:"", packCoverage:"", coverageUnit:""
  }, overrides || {});
}
test("metric area subtracts visitor-entered openings", function () {
  const r=calculate(base({openingsArea:2}));
  assert.equal(r.totalAreaM2,18); assert.equal(r.totalAreaFt2,18/0.09290304);
});
test("imperial dimensions calculate in square feet and convert to square metres", function () {
  const r=calculate(base({unit:"ft",sections:[{length:10,width:12}]}));
  assert.equal(r.totalAreaFt2,120); assert.ok(Math.abs(r.totalAreaM2-11.1483648)<1e-9);
});
test("multiple rectangular sections are added before openings are deducted", function () {
  const r=calculate(base({sections:[{length:5,width:4},{length:2,width:3}],openingsArea:2}));
  assert.equal(r.totalAreaM2,24); assert.equal(r.sectionCount,2);
});
test("metric pack coverage rounds up and reports the exact ratio", function () {
  const r=calculate(base({openingsArea:2,productName:"Pack A",packCoverage:4,coverageUnit:"m2"}));
  assert.equal(r.packRatio,4.5); assert.equal(r.packCount,5);
});
test("imperial pack coverage converts consistently", function () {
  const r=calculate(base({unit:"ft",sections:[{length:10,width:12}],productName:"Pack B",packCoverage:30,coverageUnit:"ft2"}));
  assert.equal(r.packCount,4); assert.ok(Math.abs(r.packRatio-4)<1e-9);
});
test("blank product details leave the area available and do not invent a pack count", function () {
  const r=calculate(base());
  assert.equal(r.totalAreaM2,20); assert.equal(r.packCount,null); assert.equal(r.productDetailsIncomplete,false);
});
test("partial product details leave the area available and withhold pack count", function () {
  const r=calculate(base({productName:"Pack C"}));
  assert.equal(r.totalAreaM2,20); assert.equal(r.packCount,null); assert.equal(r.productDetailsIncomplete,true);
});
test("coverage without product name or unit never produces a pack count", function () {
  const r=calculate(base({packCoverage:5}));
  assert.equal(r.packCount,null); assert.equal(r.productDetailsIncomplete,true);
});
test("shared-room-only area works in square metres without a duplicate unit", function () {
  const r=calculate(base({unit:"",sections:[],sharedWallAreaM2:24}));
  assert.equal(r.totalAreaM2,24); assert.equal(r.packCount,null);
});
test("shared-room and manual areas are added transparently", function () {
  const r=calculate(base({sharedWallAreaM2:10,sections:[{length:2,width:3}]}));
  assert.equal(r.totalAreaM2,16);
});
test("zero and negative pack coverage withhold pack count but preserve measured area", function () {
  const zero=calculate(base({productName:"Pack",packCoverage:0,coverageUnit:"m2"}));
  const negative=calculate(base({productName:"Pack",packCoverage:-1,coverageUnit:"m2"}));
  assert.equal(zero.totalAreaM2,20); assert.equal(zero.packCount,null); assert.match(zero.productDetailsError,/greater than zero/);
  assert.equal(negative.totalAreaM2,20); assert.equal(negative.packCount,null); assert.match(negative.productDetailsError,/greater than zero/);
});
test("unsupported coverage unit withholds pack count but preserves measured area", function () {
  const r=calculate(base({productName:"Pack",packCoverage:5,coverageUnit:"litres"}));
  assert.equal(r.totalAreaM2,20); assert.equal(r.packCount,null); assert.match(r.productDetailsError,/Choose square metres or square feet/);
});
test("openings cannot exceed manual gross area", function () {
  assert.throws(()=>calculate(base({openingsArea:21})),/cannot exceed/);
});
test("invalid, zero and negative measured dimensions are rejected", function () {
  assert.throws(()=>calculate(base({sections:[{length:0,width:4}]})),/greater than zero/);
  assert.throws(()=>calculate(base({sections:[{length:"bad",width:4}]})),/greater than zero/);
  assert.throws(()=>calculate(base({sections:[{length:-1,width:4}]})),/greater than zero/);
});
test("missing units cannot be guessed for manual measurements", function () {
  assert.throws(()=>calculate(base({unit:""})),/Choose metres or feet/);
});
test("no positive area is rejected", function () {
  assert.throws(()=>calculate(base({sections:[],unit:"",sharedWallAreaM2:0})),/Choose metres or feet/);
});
console.log(passed + " insulation quantity fixtures passed");
