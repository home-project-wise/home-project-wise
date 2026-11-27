"use strict";
const assert=require("node:assert/strict");
const {calculate}=require("../website/roof-covering-quantity-calculator.js");
let passed=0;function test(name,fn){fn();passed++;console.log("PASS "+name);}
function base(overrides){return Object.assign({unit:"m²",coveragePerPack:3,planes:[{area:10},{area:5}],accessories:[]},overrides||{});}
test("multiple measured roof planes sum and round covering packs up",()=>{const r=calculate(base());assert.equal(r.totalArea,15);assert.equal(r.coveringPacks,5);});
test("one measured plane uses the entered coverage",()=>{const r=calculate(base({planes:[{area:12}],coveragePerPack:5}));assert.equal(r.coveringPacks,3);});
test("exact coverage boundary does not add a pack",()=>{const r=calculate(base({planes:[{area:12}],coveragePerPack:3}));assert.equal(r.coveringPacks,4);});
test("real amount above coverage boundary rounds up",()=>{const r=calculate(base({planes:[{area:12.000001}],coveragePerPack:3}));assert.equal(r.coveringPacks,5);});
test("imperial areas stay in square feet",()=>{const r=calculate(base({unit:"ft²",coveragePerPack:100,planes:[{area:150},{area:50}]}));assert.equal(r.totalArea,200);assert.equal(r.coveringPacks,2);});
test("accessories use their own entered quantities and pack sizes",()=>{const r=calculate(base({accessories:[{name:"Ridge caps — pieces",requiredQuantity:17,unitsPerPack:6},{name:"Underlay — rolls",requiredQuantity:0,unitsPerPack:1}]}));assert.equal(r.accessories[0].packs,3);assert.equal(r.accessories[1].packs,0);});
test("accessory exact pack boundary does not add a pack",()=>{const r=calculate(base({accessories:[{name:"Fixings — boxes",requiredQuantity:24,unitsPerPack:8}]}));assert.equal(r.accessories[0].packs,3);});
test("accessory amount just above pack boundary rounds up",()=>{const r=calculate(base({accessories:[{name:"Fixings — boxes",requiredQuantity:24.000001,unitsPerPack:8}]}));assert.equal(r.accessories[0].packs,4);});
test("missing unit, coverage and planes are rejected",()=>{assert.throws(()=>calculate(base({unit:""})),/Choose square metres/);assert.throws(()=>calculate(base({coveragePerPack:""})),/coverage per pack/);assert.throws(()=>calculate(base({planes:[]})),/at least one measured roof plane/);});
test("missing or invalid roof-plane area is rejected",()=>{assert.throws(()=>calculate(base({planes:[{area:""}]})),/Roof plane 1 area/);assert.throws(()=>calculate(base({planes:[{area:0}]})),/Roof plane 1 area/);assert.throws(()=>calculate(base({planes:[{area:Infinity}]})),/Roof plane 1 area/);});
test("negative or non-finite coverage is rejected",()=>{assert.throws(()=>calculate(base({coveragePerPack:-1})),/coverage per pack/);assert.throws(()=>calculate(base({coveragePerPack:Infinity})),/coverage per pack/);});
test("accessory name, required quantity and pack size are validated",()=>{assert.throws(()=>calculate(base({accessories:[{name:"",requiredQuantity:2,unitsPerPack:1}]})),/needs an item name/);assert.throws(()=>calculate(base({accessories:[{name:"Ridge caps",requiredQuantity:"",unitsPerPack:1}]})),/required quantity/);assert.throws(()=>calculate(base({accessories:[{name:"Ridge caps",requiredQuantity:2,unitsPerPack:0}]})),/units per pack/);});
test("combined roof area overflow is rejected",()=>{assert.throws(()=>calculate(base({planes:[{area:1e308},{area:1e308}]})),/too large/);});
test("unsafe covering pack totals are rejected",()=>{assert.throws(()=>calculate(base({planes:[{area:1e308}],coveragePerPack:1e-300})),/too large/);});
test("unsafe accessory pack totals are rejected",()=>{assert.throws(()=>calculate(base({accessories:[{name:"clips",requiredQuantity:1e308,unitsPerPack:1e-300}]})),/too large/);});
console.log(passed+" roof covering quantity fixtures passed");