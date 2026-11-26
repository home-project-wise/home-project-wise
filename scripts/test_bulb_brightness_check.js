"use strict";
const assert = require("node:assert/strict");
const B = require("../website/bulb-brightness-check.js");
let passed = 0;
function check(name, fn) { fn(); passed++; console.log("PASS " + name); }
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9, a+" !== "+b);
check("multiple fixtures and bulbs use label lumens and show both subtotals",()=>{
 const r=B.calculate({fixtureCount:"2",bulbsPerFixture:"3",lumensPerBulb:"800",area:"24",areaUnit:"m2",roomType:"kitchen"});
 assert.equal(r.lumensPerFixture,2400); assert.equal(r.totalLumens,4800); close(r.ratio,200);
 assert.equal(r.reference.text,"1,000+ lumens per fixture");
});
check("living and bedroom examples use the source's 400–800 range",()=>{
 for(const roomType of ["living-room","bedroom"]) assert.equal(B.calculate({fixtureCount:1,bulbsPerFixture:1,lumensPerBulb:600,roomType}).reference.text,"400–800 lumens per fixture");
});
check("bathroom and home office use the source's 1,000+ example",()=>{
 for(const roomType of ["bathroom","home-office"]) assert.equal(B.calculate({fixtureCount:1,bulbsPerFixture:1,lumensPerBulb:1100,roomType}).reference.text,"1,000+ lumens per fixture");
});
check("unknown or unselected room has no reference line",()=>{
 assert.equal(B.calculate({fixtureCount:1,bulbsPerFixture:1,lumensPerBulb:800,roomType:""}).reference,null);
 assert.equal(B.calculate({fixtureCount:1,bulbsPerFixture:1,lumensPerBulb:800,roomType:"outdoor"}).reference,null);
});
check("blank lumens produces no calculation rather than a false zero",()=>{
 assert.equal(B.calculate({fixtureCount:1,bulbsPerFixture:1,lumensPerBulb:"",area:20}),null);
});
check("area is optional and never changes the total lumen arithmetic",()=>{
 const a=B.calculate({fixtureCount:2,bulbsPerFixture:2,lumensPerBulb:500});
 const b=B.calculate({fixtureCount:2,bulbsPerFixture:2,lumensPerBulb:500,area:200,areaUnit:"ft2"});
 assert.equal(a.totalLumens,2000); assert.equal(a.ratio,null); assert.equal(b.totalLumens,2000); close(b.ratio,10);
 assert.equal(b.areaUnit,"ft²");
});
check("zero and invalid inputs are rejected, not treated as missing or zero output",()=>{
 for(const input of [
  {fixtureCount:0,bulbsPerFixture:1,lumensPerBulb:800},
  {fixtureCount:1,bulbsPerFixture:0,lumensPerBulb:800},
  {fixtureCount:1,bulbsPerFixture:1,lumensPerBulb:0},
  {fixtureCount:1,bulbsPerFixture:1,lumensPerBulb:800,area:0},
  {fixtureCount:1.5,bulbsPerFixture:1,lumensPerBulb:800}
 ]) assert.throws(()=>B.calculate(input));
});
check("shared-room 3 m × 1.1 m handoff is normalized before area ratio",()=>{
 assert.equal(B.roomFloorArea(3,1.1),3.3);
 const r=B.calculate({fixtureCount:1,bulbsPerFixture:1,lumensPerBulb:3.3,area:B.roomFloorArea(3,1.1),areaUnit:"m2"});
 close(r.ratio,1);
});
console.log(passed+" bulb brightness fixtures passed");
