"use strict";
const assert=require("node:assert/strict");
const {calculate}=require("../website/siding-cladding-quantity-calculator.js");
let passed=0;function test(name,fn){fn();passed++;console.log("PASS "+name);}
function base(overrides){return Object.assign({unit:"m²",coveragePerPack:10,faces:[{area:24},{area:6}]},overrides||{});}
test("multiple measured net wall faces are summed and packs rounded up",()=>{const r=calculate(base());assert.equal(r.totalArea,30);assert.equal(r.packs,3);});
test("one wall face uses exact visitor-entered product coverage",()=>{const r=calculate(base({faces:[{area:18}],coveragePerPack:5}));assert.equal(r.packs,4);});
test("exact pack boundary does not add a pack",()=>{const r=calculate(base({faces:[{area:20}],coveragePerPack:10}));assert.equal(r.packs,2);});
test("area just above exact pack boundary rounds up",()=>{const r=calculate(base({faces:[{area:20.000001}],coveragePerPack:10}));assert.equal(r.packs,3);});
test("imperial areas remain in square feet",()=>{const r=calculate(base({unit:"ft²",coveragePerPack:100,faces:[{area:150},{area:50}]}));assert.equal(r.totalArea,200);assert.equal(r.packs,2);});
test("no assumed waste or extra allowance appears in result",()=>{const r=calculate(base());assert.equal(r.totalArea,30);assert.equal(r.packs,3);assert.equal(r.waste,undefined);});
test("unit, coverage and at least one face are required",()=>{assert.throws(()=>calculate(base({unit:""})),/Choose square metres/);assert.throws(()=>calculate(base({coveragePerPack:""})),/coverage per pack/);assert.throws(()=>calculate(base({faces:[]})),/at least one measured wall face/);});
test("blank, zero, negative and non-finite wall areas are rejected",()=>{for(const v of ["",0,-1,Infinity,NaN])assert.throws(()=>calculate(base({faces:[{area:v}]})),/Wall face 1 net area/);});
test("blank, zero, negative and non-finite coverage are rejected",()=>{for(const v of ["",0,-1,Infinity,NaN])assert.throws(()=>calculate(base({coveragePerPack:v})),/coverage per pack/);});
test("combined wall area overflow is rejected",()=>{assert.throws(()=>calculate(base({faces:[{area:1e308},{area:1e308}]})),/too large/);});
test("unsafe pack totals are rejected",()=>{assert.throws(()=>calculate(base({faces:[{area:1e308}],coveragePerPack:1e-300})),/too large/);});
console.log(passed+" siding/cladding quantity fixtures passed");
