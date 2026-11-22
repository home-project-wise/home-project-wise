"use strict";
const assert = require("node:assert/strict");
const p = require("../website/picture-hanging-planner.js");
let passed = 0;
function check(name, fn) { fn(); passed++; console.log("PASS " + name); }
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-9, a+" !== "+b);
check("open wall: 36 in frame, 57 in centre, 3 in drop gives 72 in hook", () => {
 const r=p.openWall({frameHeight:36,centreHeight:57,hookDrop:3});
 close(r.hookHeight,72); close(r.frameBottom,39); close(r.frameTop,75);
 close(r.hookHeight*2.54,182.88);
});
check("above furniture: 30 + 8 gap, 24 frame, 2 drop gives 60 in hook", () => {
 const r=p.aboveFurniture({furnitureTop:30,gap:8,frameHeight:24,hookDrop:2});
 close(r.frameBottom,38); close(r.frameTop,62); close(r.centreHeight,50); close(r.hookHeight,60);
 close(r.hookHeight*2.54,152.4);
});
check("two measured hooks use independent offsets and floor datum", () => {
 const r=p.twoHooks({frameLeft:20,frameBottom:16,frameHeight:24,supports:[{x:5,drop:3},{x:43,drop:3}]});
 assert.deepEqual(r.points,[{x:25,y:37},{x:63,y:37}]);
 assert.match(r.datum,/finished floor/);
});
check("confirmed stud spacing shows sequence and highlights only studs in frame", () => {
 const r=p.studs({firstStud:14,spacing:16,frameLeft:20,frameWidth:40});
 assert.deepEqual(r.positions,[14,30,46,62]); assert.deepEqual(r.withinFrame,[30,46]);
 const irregular=p.studs({frameLeft:20,frameWidth:40,confirmedPositions:[13,31,47,59]});
 assert.deepEqual(irregular.withinFrame,[31,47,59]);
});
check("one-row gallery: 18 + 2.5 gap + 24 = 44.5 in", () => {
 const r=p.gallery({rows:[[{width:18,height:18},{width:24,height:20}]],horizontalGap:2.5,verticalGap:0,centreX:60,centreY:57});
 close(r.groupWidth,44.5); close(r.groupHeight,20); close(r.groupLeft,37.75);
});
check("two-row gallery uses tallest frame per row and row-bound gap", () => {
 const r=p.gallery({rows:[[{width:18,height:24},{width:12,height:18}],[{width:16,height:20},{width:14,height:16}]],horizontalGap:2.5,verticalGap:3,centreX:60,centreY:60});
 close(r.rows[0].height,24); close(r.rows[1].height,20); close(r.groupHeight,47);
 close(r.rows[0].frames[0].bottom-r.rows[1].frames[0].bottom,23);
});
check("invalid or missing visitor measurements are rejected", () => {
 assert.throws(()=>p.openWall({frameHeight:0,centreHeight:57,hookDrop:3}));
 assert.throws(()=>p.gallery({rows:"",horizontalGap:2,verticalGap:3,centreX:10,centreY:20}));
 assert.throws(()=>p.twoHooks({frameLeft:1,frameBottom:1,frameHeight:10,supports:[{x:1,drop:1}]}));
});
console.log(passed+" picture hanging planner fixtures passed");
