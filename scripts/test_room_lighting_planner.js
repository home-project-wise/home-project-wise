"use strict";
const assert = require("node:assert/strict");
const P = require("../website/room-lighting-planner.js");
let passed = 0;
function check(name, fn) { fn(); passed++; console.log("PASS " + name); }
const close = (a,b) => assert.ok(Math.abs(a-b) < 1e-8, a + " !== " + b);
function base(overrides) {
  return Object.assign({sourceId:"uk",targetId:"uk-kitchen",area:20,areaUnit:"m2",bulbLumens:""},overrides||{});
}
check("UK floor row retains its printed 200–300 lx range and source identity", () => {
  const r=P.calculate(base({bulbLumens:800}));
  assert.equal(r.printedLux,"200–300 lx"); assert.equal(r.source.name,P.SOURCES.uk.name);
  close(r.lumensMin,200*20/0.7); close(r.lumensMax,300*20/0.3);
  assert.equal(r.bulbsMin,8); assert.equal(r.bulbsMax,25);
});
check("Canada task target uses its own Table 3 countertop value, not the UK row", () => {
  const r=P.calculate(base({sourceId:"canada",targetId:"ca-kitchen-task",area:10}));
  assert.equal(r.printedLux,"750 lx"); close(r.lumensMin,750*10/0.7); close(r.lumensMax,750*10/0.3);
  assert.equal(r.source.id,"canada");
});
check("Malta living-room range is preserved exactly as printed", () => {
  const r=P.calculate(base({sourceId:"malta",targetId:"mt-living",area:20}));
  assert.equal(r.printedLux,"50–300 lx"); close(r.lumensMin,50*20/0.7); close(r.lumensMax,300*20/0.3);
});
check("Australia maintained illuminance uses the maintained value and its own table", () => {
  const r=P.calculate(base({sourceId:"australia",targetId:"au-bedroom-maintained",area:15}));
  assert.equal(r.printedLux,"80 lx"); close(r.lumensMin,80*15/0.7); close(r.lumensMax,80*15/0.3);
  assert.match(r.source.reference,/Table 6/);
});
check("Australia initial and maintained values remain separate selectable rows", () => {
  const initial=P.calculate(base({sourceId:"australia",targetId:"au-kitchen-initial"}));
  const maintained=P.calculate(base({sourceId:"australia",targetId:"au-kitchen-maintained"}));
  assert.equal(initial.printedLux,"200 lx"); assert.equal(maintained.printedLux,"160 lx");
});
check("imperial area converts to square metres before applying the same formula", () => {
  const metric=P.calculate(base({area:9.290304,areaUnit:"m2"}));
  const imperial=P.calculate(base({area:100,areaUnit:"ft2"}));
  close(imperial.areaM2,metric.areaM2); close(imperial.lumensMin,metric.lumensMin); close(imperial.lumensMax,metric.lumensMax);
});
check("blank bulb lumens leaves the lumen range but withholds bulb counts", () => {
  const r=P.calculate(base());
  assert.ok(r.lumensMin>0 && r.lumensMax>r.lumensMin);
  assert.equal(r.bulbsMin,null); assert.equal(r.bulbsMax,null); assert.equal(r.bulbLumens,null);
});
check("bulb count rounds both ends upward from visitor-entered lumens", () => {
  const r=P.calculate(base({bulbLumens:1000}));
  assert.equal(r.bulbsMin,6); assert.equal(r.bulbsMax,20);
});
check("a row from a different source is rejected rather than silently reused", () => {
  assert.throws(()=>P.calculate(base({sourceId:"canada",targetId:"uk-kitchen"})),/listed in the selected source/);
});
check("unsupported US source and unknown target are rejected", () => {
  assert.throws(()=>P.calculate(base({sourceId:"us"})),/listed sources/);
  assert.throws(()=>P.calculate(base({targetId:"not-a-row"})),/listed in the selected source/);
});
check("zero, negative and non-finite areas or bulb lumens are rejected", () => {
  for (const area of [0,-1,"NaN","Infinity"]) assert.throws(()=>P.calculate(base({area})));
  for (const bulbLumens of [0,-1,"NaN","Infinity"]) assert.throws(()=>P.calculate(base({bulbLumens})));
});
console.log(passed + " room lighting planner fixtures passed");
