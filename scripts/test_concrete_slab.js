"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Slab = require("../website/concrete-slab-calculator.js");
const close = (actual, expected, tolerance=1e-9) => assert.ok(Math.abs(actual-expected)<tolerance, actual+" != "+expected);

test("metric dimensions calculate cubic metres, feet and yards from hand-computed values", () => {
  const r = Slab.calculate({length:3,width:2,lengthUnit:"m",thickness:10,thicknessUnit:"cm"});
  close(r.volumeM3,0.6);
  close(r.volumeFt3,21.1888000329,1e-8);
  close(r.volumeYd3,0.7847703716,1e-8);
  assert.equal(Slab.format(r).metric,"0.6 m³");
});

test("imperial dimensions and inch thickness convert to all metric and imperial volume units", () => {
  const r = Slab.calculate({length:10,width:10,lengthUnit:"ft",thickness:4,thicknessUnit:"in"});
  close(r.volumeFt3,100/3);
  close(r.volumeYd3,1.234567901234568);
  close(r.volumeM3,0.9438948864);
});

test("metric and imperial length/thickness units can be combined without mixing units", () => {
  const r = Slab.calculate({length:10,width:5,lengthUnit:"ft",thickness:10,thicknessUnit:"cm"});
  close(r.volumeM3,0.4645152);
});

test("optional named-product yield converts and rounds the bag count up only after total volume", () => {
  const r = Slab.calculate({length:10,width:10,lengthUnit:"ft",thickness:4,thicknessUnit:"in",
    productName:"Example product",bagYield:0.5,bagYieldUnit:"ft3"});
  assert.equal(r.bagCount,67);
  close(r.bagRatio,200/3);
  assert.equal(r.productName,"Example product");
});

test("bag yields entered in cubic yards and cubic metres use their own units", () => {
  const yd = Slab.calculate({length:10,width:10,lengthUnit:"ft",thickness:4,thicknessUnit:"in",
    productName:"Yard yield",bagYield:1,bagYieldUnit:"yd3"});
  assert.equal(yd.bagCount,2);
  const metric = Slab.calculate({length:3,width:2,lengthUnit:"m",thickness:10,thicknessUnit:"cm",
    productName:"Metric yield",bagYield:0.2,bagYieldUnit:"m3"});
  assert.equal(metric.bagCount,3);
});

test("a visitor-entered allowance is explicit, optional and included in the adjusted bag estimate", () => {
  const r = Slab.calculate({length:10,width:10,lengthUnit:"ft",thickness:4,thicknessUnit:"in",allowancePercent:10,productName:"Named product",bagYield:0.5,bagYieldUnit:"ft3"});
  close(r.volumeFt3,100/3);
  close(r.adjustedVolumeM3,r.volumeM3*1.1);
  assert.equal(r.allowancePercent,10);
  assert.equal(r.bagCount,74);
});

test("blank allowance adds nothing and does not create an assumed percentage", () => {
  const r = Slab.calculate({length:2,width:2,lengthUnit:"m",thickness:5,thicknessUnit:"cm",allowancePercent:""});
  assert.equal(r.allowancePercent,null);
  close(r.adjustedVolumeM3,r.volumeM3);
});

test("no bag count is displayed unless the visitor enters both product name and published yield", () => {
  const r = Slab.calculate({length:2,width:2,lengthUnit:"m",thickness:5,thicknessUnit:"cm",
    productName:"",bagYield:"",bagYieldUnit:"m3"});
  assert.equal(r.bagCount,null);
});

test("blank, zero, negative, non-finite and invalid dimensions are rejected", () => {
  const base = {length:2,width:2,lengthUnit:"m",thickness:5,thicknessUnit:"cm"};
  for (const patch of [
    {length:""},{width:0},{thickness:""},{thickness:0},{length:-1},{length:Infinity},
    {lengthUnit:""},{thicknessUnit:""}
  ]) assert.throws(()=>Slab.calculate({...base,...patch}));
});

test("incomplete bag details do not block the volume result or create a bag count", () => {
  const base = {length:2,width:2,lengthUnit:"m",thickness:5,thicknessUnit:"cm"};
  const namedOnly = Slab.calculate({...base,productName:"Named mix",bagYield:""});
  assert.equal(namedOnly.volumeM3,0.2); assert.equal(namedOnly.bagCount,null); assert.equal(namedOnly.bagDetailsIncomplete,true);
  const yieldOnly = Slab.calculate({...base,productName:"",bagYield:0.5,bagYieldUnit:"m3"});
  assert.equal(yieldOnly.volumeM3,0.2); assert.equal(yieldOnly.bagCount,null); assert.equal(yieldOnly.bagDetailsIncomplete,true);
});

test("invalid entered bag yields, units and negative allowances are rejected", () => {
  const base = {length:2,width:2,lengthUnit:"m",thickness:5,thicknessUnit:"cm"};
  assert.throws(()=>Slab.calculate({...base,productName:"Named mix",bagYield:0}),/greater than zero/);
  assert.throws(()=>Slab.calculate({...base,productName:"Named mix",bagYield:1,bagYieldUnit:"kg"}),/valid bag-yield unit/);
  assert.throws(()=>Slab.calculate({...base,allowancePercent:-1}),/Extra allowance/);
});

test("very small positive dimensions remain positive in every volume unit", () => {
  const r = Slab.calculate({length:0.01,width:0.01,lengthUnit:"m",thickness:0.1,thicknessUnit:"cm"});
  assert.ok(r.volumeM3>0 && r.volumeFt3>0 && r.volumeYd3>0);
  const display = Slab.format(r);
  assert.ok(!display.metric.startsWith("0"), display.metric);
  assert.ok(!display.feet.startsWith("0"), display.feet);
  assert.ok(!display.yards.startsWith("0"), display.yards);
});

test("volume calculation contains no hidden allowance, price or material assumptions", () => {
  const r = Slab.calculate({length:2,width:2,lengthUnit:"m",thickness:5,thicknessUnit:"cm"});
  close(r.volumeM3,0.2);
  assert.equal(r.bagCount,null);
  assert.equal(r.allowancePercent,null);
  assert.equal(r.waste,undefined);
  assert.equal(r.price,undefined);
});
