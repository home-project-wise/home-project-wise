"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const DP = require("../website/drywall-plaster-calculator.js");
const close = (actual, expected, tolerance=1e-9) => assert.ok(Math.abs(actual-expected)<tolerance, actual+" != "+expected);

test("metric wall sections subtract openings and add an entered ceiling area", () => {
  const r = DP.calculate({lengthUnit:"m",sections:[{length:5,height:2.4},{length:4,height:2.4}],openingsArea:3.6,ceilingArea:20});
  close(r.grossWallAreaM2,21.6);
  close(r.openingsAreaM2,3.6);
  close(r.totalAreaM2,38);
  assert.equal(DP.format(r).metric,"38 m²");
});

test("imperial wall sections and openings convert to square metres without mixing units", () => {
  const r = DP.calculate({lengthUnit:"ft",sections:[{length:12,height:8},{length:10,height:8}],openingsArea:20});
  close(r.grossWallAreaM2,176*0.09290304);
  close(r.openingsAreaM2,20*0.09290304);
  close(r.totalAreaFt2,156);
});

test("drywall board estimate uses visitor-entered panel face dimensions and rounds up", () => {
  const r = DP.calculate({lengthUnit:"m",sections:[{length:5,height:2.4}],openingsArea:0,
    boardWidth:1.2,boardHeight:2.4});
  close(r.totalAreaM2,12);
  close(r.boardRatio,12/2.88);
  assert.equal(r.boardCount,5);
});

test("plaster bags scale only from the named product's entered coverage and thickness", () => {
  const r = DP.calculate({lengthUnit:"m",sections:[{length:5,height:2.4}],openingsArea:0,
    plasterProductName:"Named plaster",plasterCoverage:10,plasterCoverageUnit:"m2",
    plasterReferenceThickness:10,plasterApplicationThickness:10,plasterThicknessUnit:"mm"});
  close(r.plasterBagRatio,1.2);
  assert.equal(r.plasterBagCount,2);
});

test("imperial plaster coverage and inch thickness convert correctly", () => {
  const r = DP.calculate({lengthUnit:"ft",sections:[{length:12,height:8}],openingsArea:0,
    plasterProductName:"Named plaster",plasterCoverage:100,plasterCoverageUnit:"ft2",
    plasterReferenceThickness:0.5,plasterApplicationThickness:0.5,plasterThicknessUnit:"in"});
  close(r.totalAreaFt2,96);
  close(r.plasterBagRatio,0.96);
  assert.equal(r.plasterBagCount,1);
});

test("shared-room wall area is accepted without requiring a blank manual section", () => {
  const shared = (2*(12+10)*8-20)*0.09290304;
  const r = DP.calculate({lengthUnit:"ft",sections:[{length:"",height:""}],sharedWallAreaM2:shared});
  close(r.totalAreaFt2,332);
  assert.equal(r.boardCount,null);
});

test("partial board or plaster details never block the measured area or invent quantities", () => {
  const r = DP.calculate({lengthUnit:"m",sections:[{length:5,height:2.4}],
    boardWidth:1.2,boardHeight:"",plasterProductName:"Named plaster",plasterCoverage:10});
  assert.equal(r.totalAreaM2,12);
  assert.equal(r.boardCount,null);
  assert.equal(r.boardDetailsIncomplete,true);
  assert.equal(r.plasterBagCount,null);
  assert.equal(r.plasterDetailsIncomplete,true);
});

test("blank optional inputs add no openings or ceiling area", () => {
  const r = DP.calculate({lengthUnit:"m",sections:[{length:5,height:2.4}],openingsArea:"",ceilingArea:""});
  assert.equal(r.totalAreaM2,12);
});

test("rejects blank units, missing dimensions, zero dimensions and openings larger than wall area", () => {
  assert.throws(()=>DP.calculate({lengthUnit:"",sections:[{length:5,height:2.4}]}),/Choose metres or feet/);
  assert.throws(()=>DP.calculate({lengthUnit:"m",sections:[{length:"",height:2.4}]}),/length is required/);
  assert.throws(()=>DP.calculate({lengthUnit:"m",sections:[{length:0,height:2.4}]}),/greater than zero/);
  assert.throws(()=>DP.calculate({lengthUnit:"m",sections:[{length:2,height:2}],openingsArea:5}),/cannot exceed/);
});

test("rejects non-positive or non-finite optional surface inputs", () => {
  assert.throws(()=>DP.calculate({lengthUnit:"m",sections:[{length:2,height:2}],ceilingArea:-1}),/zero or greater/);
  assert.throws(()=>DP.calculate({lengthUnit:"m",sections:[{length:2,height:2}],sharedWallAreaM2:Infinity}),/zero or greater/);
});

test("does not introduce price, waste, structural or product-suitability calculations", () => {
  const r = DP.calculate({lengthUnit:"m",sections:[{length:2,height:2}]});
  assert.equal(r.price,undefined);
  assert.equal(r.waste,undefined);
  assert.equal(r.structural,undefined);
  assert.equal(r.totalAreaM2,4);
});


test("does not scale published plaster coverage when application thickness differs", () => {
  const r = DP.calculate({lengthUnit:"m",sections:[{length:5,height:2.4}],
    plasterProductName:"Named plaster",plasterCoverage:10,plasterCoverageUnit:"m2",
    plasterReferenceThickness:10,plasterApplicationThickness:15,plasterThicknessUnit:"mm"});
  assert.equal(r.totalAreaM2,12);
  assert.equal(r.plasterBagCount,null);
  assert.equal(r.plasterThicknessMismatch,true);
});


test("shared-room-only area calculates without a redundant length-unit selection", () => {
  const r = DP.calculate({lengthUnit:"",sections:[{length:"",height:""}],sharedWallAreaM2:20});
  close(r.totalAreaM2,20);
  assert.equal(r.boardCount,null);
});
test("manual wall dimensions still require an explicit unit", () => {
  assert.throws(()=>DP.calculate({lengthUnit:"",sections:[{length:5,height:2.4}]}),/Choose metres or feet/);
});
test("added wall sections can be removed without affecting the remaining first section", () => {
  const r = DP.calculate({lengthUnit:"m",sections:[{length:5,height:2.4}],openingsArea:0});
  assert.equal(r.totalAreaM2,12);
});
