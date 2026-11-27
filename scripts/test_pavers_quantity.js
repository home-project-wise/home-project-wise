"use strict";
const assert = require("node:assert/strict");
const { calculate } = require("../website/pavers-quantity-calculator.js");
let passed = 0;
function test(name, fn) { fn(); passed += 1; console.log("PASS " + name); }
function base(overrides) {
  return Object.assign({
    unit:"m", paverLength:0.2, paverWidth:0.1, jointWidth:0.005,
    sections:[{length:4,width:3,borderWidth:0.2,orientation:"along-length"}]
  }, overrides || {});
}
test("metric patio separates field grid and area-based border equivalents", function () {
  const r=calculate(base());
  assert.equal(r.totalArea,12);
  assert.ok(Math.abs(r.fieldArea-9.36)<1e-9);
  assert.ok(Math.abs(r.borderArea-2.64)<1e-9);
  assert.equal(r.sections[0].runPavers,18);
  assert.equal(r.sections[0].acrossPavers,25);
  assert.equal(r.fieldPavers,450);
  assert.equal(r.borderPavers,123);
  assert.equal(r.totalPavers,573);
});
test("no border is explicit zero and counts the full rectangle as field", function () {
  const r=calculate(base({sections:[{length:1,width:1,borderWidth:0,orientation:"along-length"}],paverLength:0.5,paverWidth:0.5,jointWidth:0}));
  assert.equal(r.fieldPavers,4);
  assert.equal(r.borderPavers,0);
  assert.equal(r.totalPavers,4);
});
test("zero joint is accepted when visitor enters zero", function () {
  const r=calculate(base({jointWidth:0}));
  assert.equal(r.jointWidth,0);
});
test("joint width affects the repeating module in both directions", function () {
  const r=calculate(base({jointWidth:0.01,sections:[{length:1,width:1,borderWidth:0,orientation:"along-length"}],paverLength:0.2,paverWidth:0.2}));
  assert.equal(r.sections[0].runPavers,5);
  assert.equal(r.sections[0].acrossPavers,5);
  assert.equal(r.fieldPavers,25);
});
test("paver direction rotates the row and run dimensions", function () {
  const r=calculate(base({sections:[{length:4,width:3,borderWidth:0,orientation:"along-width"}]}));
  assert.equal(r.sections[0].runPavers,15);
  assert.equal(r.sections[0].acrossPavers,39);
  assert.equal(r.fieldPavers,585);
});
test("multiple sections are calculated separately and summed", function () {
  const r=calculate(base({sections:[
    {length:4,width:3,borderWidth:0,orientation:"along-length"},
    {length:2,width:1,borderWidth:0,orientation:"along-length"}
  ]}));
  assert.equal(r.sections.length,2);
  assert.equal(r.totalArea,14);
  assert.equal(r.totalPavers,Math.ceil(4.005/0.205)*Math.ceil(3.005/0.105)+Math.ceil(2.005/0.205)*Math.ceil(1.005/0.105));
});
test("imperial dimensions use the visitor-selected unit without hidden conversion", function () {
  const r=calculate(base({unit:"ft",paverLength:1,paverWidth:0.5,jointWidth:0,sections:[{length:10,width:5,borderWidth:0,orientation:"along-length"}]}));
  assert.equal(r.totalArea,50);
  assert.equal(r.fieldPavers,100);
});
test("exact module boundary does not add a spurious extra paver", function () {
  const r=calculate(base({paverLength:0.2,paverWidth:0.1,jointWidth:0,sections:[{length:0.4,width:0.3,borderWidth:0,orientation:"along-length"}]}));
  assert.equal(r.fieldPavers,6);
});
test("missing unit is rejected rather than guessed", function () {
  assert.throws(()=>calculate(base({unit:""})),/Choose metres or feet/);
});
test("missing paver dimensions and joint are rejected", function () {
  assert.throws(()=>calculate(base({paverLength:""})),/Paver length/);
  assert.throws(()=>calculate(base({paverWidth:""})),/Paver width/);
  assert.throws(()=>calculate(base({jointWidth:""})),/Joint width/);
});
test("missing border width is rejected rather than silently treated as zero", function () {
  assert.throws(()=>calculate(base({sections:[{length:4,width:3,borderWidth:"",orientation:"along-length"}]})),/border width/);
});
test("missing or invalid direction is rejected", function () {
  assert.throws(()=>calculate(base({sections:[{length:4,width:3,borderWidth:0,orientation:""}]})),/choose the paver direction/);
});
test("negative, zero and non-finite dimensions are rejected", function () {
  assert.throws(()=>calculate(base({paverLength:0})),/greater than zero/);
  assert.throws(()=>calculate(base({sections:[{length:-1,width:3,borderWidth:0,orientation:"along-length"}]})),/greater than zero/);
  assert.throws(()=>calculate(base({sections:[{length:"Infinity",width:3,borderWidth:0,orientation:"along-length"}]})),/greater than zero/);
});
test("negative joint and border are rejected", function () {
  assert.throws(()=>calculate(base({jointWidth:-0.01})),/zero or greater/);
  assert.throws(()=>calculate(base({sections:[{length:4,width:3,borderWidth:-0.1,orientation:"along-length"}]})),/zero or greater/);
});
test("border that consumes the inner field is rejected", function () {
  assert.throws(()=>calculate(base({sections:[{length:4,width:3,borderWidth:1.5,orientation:"along-length"}]})),/leaves no positive inner field/);
});
test("area overflow is rejected rather than returning Infinity", function () {
  assert.throws(()=>calculate(base({sections:[{length:1e308,width:2,borderWidth:0,orientation:"along-length"}]})),/area too large/);
});
test("combined section quantity overflow is rejected", function () {
  assert.throws(()=>calculate(base({paverLength:1,paverWidth:1,jointWidth:0,sections:[
    {length:6000000000000000,width:1,borderWidth:0,orientation:"along-length"},
    {length:6000000000000000,width:1,borderWidth:0,orientation:"along-length"}
  ]})),/combined patio dimensions/);
});
test("empty section list is rejected", function () {
  assert.throws(()=>calculate(base({sections:[]})),/at least one measured/);
});
console.log(passed + " paver quantity fixtures passed");
