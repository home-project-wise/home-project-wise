"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const Tile = require("../website/tile.js");

test("calculates net metric floor area, visitor tile dimensions and label box coverage", () => {
  const r = Tile.calculate({lengthUnit:"m",sections:[{length:5,width:4}],openings:[2],waste:"",tileLength:0.6,tileWidth:0.6,joint:3,jointUnit:"mm",boxCoverage:1.44,coverageUnit:"m2"});
  assert.equal(r.grossAreaM2,20);
  assert.equal(r.openingAreaM2,2);
  assert.equal(r.netAreaM2,18);
  assert.equal(r.wastePercent,0);
  assert.equal(r.tileCount,50);
  assert.equal(r.boxes,13);
});

test("supports multiple areas, optional visitor waste and feet dimensions", () => {
  const r = Tile.calculate({lengthUnit:"ft",sections:[{length:10,width:10},{length:5,width:4}],openings:[10],waste:"10",tileLength:"",tileWidth:"",joint:"",boxCoverage:10,coverageUnit:"ft2"});
  assert.ok(Math.abs(r.grossAreaM2 - 120 * 0.3048 * 0.3048) < 1e-12);
  assert.ok(Math.abs(r.openingAreaM2 - 10 * 0.3048 * 0.3048) < 1e-12);
  assert.ok(Math.abs(r.adjustedAreaM2 - r.netAreaM2 * 1.1) < 1e-12);
  assert.equal(r.tileCount,null);
  assert.equal(r.boxes,Math.ceil(r.adjustedAreaFt2/10));
});

test("no coverage or tile count is invented when label or dimensions are omitted", () => {
  const r = Tile.calculate({lengthUnit:"m",sections:[{length:2,width:3}],openings:[],waste:"",tileLength:"",tileWidth:"",joint:"",boxCoverage:"",coverageUnit:"m2"});
  assert.equal(r.tileCount,null);
  assert.equal(r.boxes,null);
});

test("rejects invalid geometry, openings larger than floor and invalid coverage", () => {
  const base={lengthUnit:"m",sections:[{length:2,width:2}],openings:[],waste:"",tileLength:"",tileWidth:"",joint:"",boxCoverage:"",coverageUnit:"m2"};
  assert.throws(()=>Tile.calculate({...base,sections:[]}),/at least one/);
  assert.throws(()=>Tile.calculate({...base,sections:[{length:0,width:1}]}),/length/);
  assert.throws(()=>Tile.calculate({...base,openings:[5]}),/cannot exceed/);
  assert.throws(()=>Tile.calculate({...base,boxCoverage:0}),/Box coverage/);
});

test("requires paired tile dimensions and a unit for any positive joint", () => {
  const base={lengthUnit:"m",sections:[{length:2,width:2}],openings:[],waste:"",tileLength:0.3,tileWidth:"",joint:"",jointUnit:"mm",boxCoverage:"",coverageUnit:"m2"};
  assert.throws(()=>Tile.calculate(base),/both tile dimensions/);
  assert.throws(()=>Tile.calculate({...base,tileWidth:0.3,joint:2,jointUnit:""}),/Choose millimetres or inches/);
});

test("rounds tile and box counts up without adding a default allowance", () => {
  const r=Tile.calculate({lengthUnit:"m",sections:[{length:1,width:1}],openings:[],waste:"",tileLength:0.3,tileWidth:0.3,joint:0,jointUnit:"mm",boxCoverage:0.5,coverageUnit:"m2"});
  assert.equal(r.tileCount,12);
  assert.equal(r.boxes,2);
  assert.equal(r.adjustedAreaM2,1);
});

test("unit conversion round trip preserves equivalent floor area", () => {
  const m=Tile.calculate({lengthUnit:"m",sections:[{length:3,width:2}],openings:[],waste:"",tileLength:"",tileWidth:"",joint:"",boxCoverage:"",coverageUnit:"m2"});
  const ft=Tile.calculate({lengthUnit:"ft",sections:[{length:3/0.3048,width:2/0.3048}],openings:[],waste:"",tileLength:"",tileWidth:"",joint:"",boxCoverage:"",coverageUnit:"m2"});
  assert.ok(Math.abs(m.netAreaM2-ft.netAreaM2)<1e-10);
  assert.ok(Math.abs(m.netAreaFt2-ft.netAreaFt2)<1e-8);
});

test("keeps zero-opening input valid but rejects a zero net floor area", () => {
  const base={lengthUnit:"m",sections:[{length:2,width:2}],openings:[],waste:"",tileLength:"",tileWidth:"",joint:"",boxCoverage:"",coverageUnit:"m2"};
  assert.equal(Tile.calculate(base).openingAreaM2,0);
  assert.throws(()=>Tile.calculate({...base,openings:[4]}),/net floor area/);
});

test("room reuse is explicit and warns that it replaces extra areas", () => {
  const src=require("node:fs").readFileSync(require("node:path").join(__dirname,"..","website","tile.js"),"utf8");
  assert.match(src,/tile-use-room/);
  assert.match(src,/replaces extra areas/);
  assert.match(src,/win\.hpwRoom/);
});
