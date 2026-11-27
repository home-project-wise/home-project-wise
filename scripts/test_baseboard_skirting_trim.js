"use strict";
const assert=require("node:assert/strict");
const {calculate}=require("../website/baseboard-skirting-trim-calculator.js");
let passed=0;function test(name,fn){fn();passed++;console.log("PASS "+name);}
function base(overrides){return Object.assign({unit:"m",stockLength:2.4,cuttingAllowance:0.2,rooms:[{length:4,width:3,openingWidth:0.9}]},overrides||{});}
test("one room perimeter minus doorway plus entered allowance",()=>{const r=calculate(base());assert.equal(r.perimeter,14);assert.equal(r.netTrimLength,13.1);assert.ok(Math.abs(r.requiredLength-13.3)<1e-12);assert.equal(r.stockPieces,6);});
test("multiple rooms add their perimeters and openings",()=>{const r=calculate(base({rooms:[{length:4,width:3,openingWidth:0.9},{length:5,width:2,openingWidth:0}]}));assert.equal(r.perimeter,28);assert.equal(r.openingWidth,0.9);assert.equal(r.netTrimLength,27.1);assert.equal(r.stockPieces,12);});
test("explicit zero allowance adds nothing",()=>{const r=calculate(base({cuttingAllowance:0}));assert.equal(r.requiredLength,13.1);assert.equal(r.stockPieces,6);});
test("exact stock-length boundary does not add a piece",()=>{const r=calculate(base({stockLength:2,cuttingAllowance:0,rooms:[{length:1,width:1,openingWidth:0}]}));assert.equal(r.requiredLength,4);assert.equal(r.stockPieces,2);});
test("a real amount above a stock boundary rounds up",()=>{const r=calculate(base({stockLength:2,cuttingAllowance:0.0000001,rooms:[{length:1,width:1,openingWidth:0}]}));assert.equal(r.stockPieces,3);});
test("imperial inputs stay in the selected unit",()=>{const r=calculate(base({unit:"ft",stockLength:8,cuttingAllowance:0,rooms:[{length:12,width:10,openingWidth:3}]}));assert.equal(r.perimeter,44);assert.equal(r.netTrimLength,41);assert.equal(r.stockPieces,6);});
test("missing unit, stock length and allowance are rejected",()=>{assert.throws(()=>calculate(base({unit:""})),/Choose metres or feet/);assert.throws(()=>calculate(base({stockLength:""})),/Stock length/);assert.throws(()=>calculate(base({cuttingAllowance:""})),/Cutting allowance/);});
test("missing room dimensions and opening width are rejected",()=>{assert.throws(()=>calculate(base({rooms:[{length:"",width:3,openingWidth:0}]})),/Room 1 length/);assert.throws(()=>calculate(base({rooms:[{length:4,width:0,openingWidth:0}]})),/Room 1 width/);assert.throws(()=>calculate(base({rooms:[{length:4,width:3,openingWidth:""}]})),/opening width/);});
test("negative and non-finite values are rejected",()=>{assert.throws(()=>calculate(base({stockLength:Infinity})),/Stock length/);assert.throws(()=>calculate(base({cuttingAllowance:-1})),/Cutting allowance/);assert.throws(()=>calculate(base({rooms:[{length:4,width:3,openingWidth:-1}]})),/zero or greater/);});
test("openings cannot equal or exceed perimeter",()=>{assert.throws(()=>calculate(base({rooms:[{length:4,width:3,openingWidth:14}]})),/less than the room perimeter/);});
test("area-independent perimeter overflow is rejected",()=>{assert.throws(()=>calculate(base({rooms:[{length:1e308,width:1,openingWidth:0}]})),/too large/);});
test("unsafe stock-piece totals are rejected",()=>{assert.throws(()=>calculate(base({stockLength:1e-300,cuttingAllowance:0,rooms:[{length:4,width:3,openingWidth:0}]})),/too large/);});
test("empty rooms are rejected",()=>{assert.throws(()=>calculate(base({rooms:[]})),/at least one measured room/);});
console.log(passed+" baseboard/skirting quantity fixtures passed");
