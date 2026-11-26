"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const F = require("../website/fence-quantity-calculator.js");

test("metric straight run counts one post at each end and one per span boundary", () => {
  const r = F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:10}]});
  assert.equal(r.netLength,10);
  assert.equal(r.spans,5);
  assert.equal(r.rawPosts,6);
  assert.equal(r.terminalPosts,2);
  assert.equal(r.linePosts,4);
  assert.equal(r.posts,6);
});
test("uneven run rounds spans up and equalises spacing below the chosen maximum", () => {
  const r = F.calculate({lengthUnit:"m",postSpacing:3,runs:[{length:10}]});
  assert.equal(r.spans,4);
  assert.equal(r.posts,5);
  assert.equal(r.segments[0].actualSpacing,2.5);
});
test("imperial run uses the visitor-entered feet without a hidden conversion or spacing", () => {
  const r = F.calculate({lengthUnit:"ft",postSpacing:10,runs:[{length:30}]});
  assert.equal(r.spans,3);
  assert.equal(r.posts,4);
  assert.equal(r.netLength,30);
});
test("gate opening splits its run, subtracts its width and counts both gate-edge posts", () => {
  const r = F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:10,gates:[{offset:4,width:1}]}]});
  assert.equal(r.netLength,9);
  assert.equal(r.gateCount,1);
  assert.equal(r.spans,5);
  assert.equal(r.terminalPosts,4);
  assert.equal(r.linePosts,3);
  assert.equal(r.posts,7);
});
test("multiple gates split one run into separately rounded uninterrupted segments", () => {
  const r = F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:14,gates:[{offset:3,width:1},{offset:9,width:2}]}]});
  assert.equal(r.netLength,11);
  assert.equal(r.spans,2+3+2);
  assert.equal(r.posts,10);
});
test("gate at a run start retains both gate posts and counts the remaining fence", () => {
  const r = F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:10,gates:[{offset:0,width:2}]}]});
  assert.equal(r.spans,4);
  assert.equal(r.posts,6);
});
test("a gate occupying a complete run still has two gate-post positions and no fence spans", () => {
  const r = F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:3,gates:[{offset:0,width:3}]}]});
  assert.equal(r.spans,0);
  assert.equal(r.posts,2);
});
test("multiple straight runs round separately and require explicit shared-corner count", () => {
  const base = {lengthUnit:"m",postSpacing:2,runs:[{length:10},{length:5}]};
  const pending = F.calculate(base);
  assert.equal(pending.spans,8);
  assert.equal(pending.rawPosts,10);
  assert.equal(pending.posts,null);
  assert.equal(pending.sharedCorners,null);
  const joined = F.calculate({...base,sharedCorners:1});
  assert.equal(joined.posts,9);
  assert.equal(joined.linePosts,6);
});
test("separate runs with no shared corners require an explicit zero", () => {
  const r = F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:4},{length:6}],sharedCorners:0});
  assert.equal(r.posts,7);
});
test("panel width counts panels by uninterrupted segment only when supplied", () => {
  const r = F.calculate({lengthUnit:"m",postSpacing:2,panelWidth:2.5,runs:[{length:10,gates:[{offset:4,width:1}]}]});
  assert.equal(r.spans,5);
  assert.equal(r.panelCount,2+2);
});
test("repeated rails or boards require both visitor-entered values", () => {
  const partial = F.calculate({lengthUnit:"m",postSpacing:2,piecesPerSpan:2,runs:[{length:10}]});
  assert.equal(partial.repeatedPieces,null);
  assert.equal(partial.piecesIncomplete,true);
  const full = F.calculate({lengthUnit:"m",postSpacing:2,piecesPerSpan:2,pieceLength:3,runs:[{length:10}]});
  assert.equal(full.repeatedPieces,10);
  assert.equal(full.repeatedPiecesLength,30);
});
test("rejects missing unit, spacing, run, zero values and non-whole counts", () => {
  assert.throws(()=>F.calculate({lengthUnit:"",postSpacing:2,runs:[{length:10}]}),/Choose metres or feet/);
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:"",runs:[{length:10}]}),/spacing is required/);
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:2,runs:[]}),/at least one straight/);
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:0}]}),/greater than zero/);
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:2,piecesPerSpan:1.5,pieceLength:3,runs:[{length:10}]}),/whole number/);
});
test("rejects incomplete, overlapping, negative and out-of-run gate positions", () => {
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:10,gates:[{offset:"",width:1}]}]}),/position is required/);
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:10,gates:[{offset:-1,width:1}]}]}),/zero or greater/);
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:10,gates:[{offset:9,width:2}]}]}),/extends beyond/);
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:10,gates:[{offset:2,width:3},{offset:4,width:2}]}]}),/overlap/);
});
test("rejects invalid shared-corner deductions", () => {
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:10},{length:10}],sharedCorners:3}),/cannot exceed/);
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:2},{length:2}],sharedCorners:1.5}),/whole number/);
  assert.throws(()=>F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:10}],sharedCorners:1}),/at least two/);
});
test("no quantities, materials, costs or allowances are invented", () => {
  const r = F.calculate({lengthUnit:"m",postSpacing:2,runs:[{length:10}]});
  assert.equal(r.price,undefined);
  assert.equal(r.concrete,undefined);
  assert.equal(r.waste,undefined);
  assert.equal(r.height,undefined);
  assert.equal(r.spans,5);
});
