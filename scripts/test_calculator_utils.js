"use strict";
const assert = require("node:assert/strict");
const utils = require("../website/calculator-utils.js");
let passed = 0;
function test(name, fn) {
  try { fn(); passed += 1; console.log("PASS " + name); }
  catch (error) { console.error("FAIL " + name + "\n  " + (error && error.message)); process.exitCode = 1; }
}

test("blank recognises only empty, null and undefined", () => {
  assert.equal(utils.blank(""), true);
  assert.equal(utils.blank(null), true);
  assert.equal(utils.blank(undefined), true);
  assert.equal(utils.blank(0), false);
  assert.equal(utils.blank("0"), false);
});

test("positive preserves numeric conversion and exact validation message", () => {
  assert.equal(utils.positive("2.5", "Length"), 2.5);
  for (const value of ["", null, undefined, 0, -1, "no", Infinity]) {
    assert.throws(() => utils.positive(value, "Length"), { message: "Length must be greater than zero." });
  }
});

test("non-negative validation preserves both calculator help variants", () => {
  assert.equal(utils.nonNegative("0", "Gap", true), 0);
  assert.equal(utils.nonNegative(2, "Gap", false), 2);
  assert.throws(() => utils.nonNegative("", "Gap", true), { message: "Gap must be zero or greater. Enter 0 if none." });
  assert.throws(() => utils.nonNegative(-1, "Gap", false), { message: "Gap must be zero or greater." });
});

test("four-ULP ceil tolerance keeps exact and near-exact positive pack boundaries", () => {
  const tolerance = Number.EPSILON * 4 * 3;
  assert.equal(utils.ceilCount(3), 3);
  assert.equal(utils.ceilCount(3 + tolerance / 2), 3);
  assert.equal(utils.ceilCount(3 - tolerance / 2), 3);
  assert.equal(utils.ceilCount(3 + tolerance * 2), 4);
  assert.equal(utils.ceilCount(3.000001), 4);
  assert.equal(utils.ceilCount(6), 6);
});

test("shared ceil matches the former roof/siding nearest-integer snap", () => {
  function previous(value) {
    const nearest = Math.round(value);
    const tolerance = Number.EPSILON * 4 * Math.max(1, Math.abs(value));
    return Math.abs(value - nearest) <= tolerance ? nearest : Math.ceil(value);
  }
  [1, 2, 3, 10, 1000, 1000000].forEach((whole) => {
    const tolerance = Number.EPSILON * 4 * Math.max(1, whole);
    [-2, -1, -0.5, 0, 0.5, 1, 2].forEach((multiple) => {
      const value = whole + tolerance * multiple;
      assert.equal(utils.ceilCount(value), previous(value), String(value));
    });
  });
  [0.25, 1.000001, 2.5, 9.999999, 100.00001].forEach((value) => {
    assert.equal(utils.ceilCount(value), previous(value), String(value));
  });
});

test("format preserves en-US grouping and three-decimal display", () => {
  assert.equal(utils.format(1234.56789), "1,234.568");
  assert.equal(utils.format(12.5), "12.5");
  assert.equal(utils.format(1.23456, 2), "1.23");
});

test("element helper uses textContent rather than parsing markup", () => {
  const doc = { createElement(tag) { return { tagName: tag, textContent: "" }; } };
  const node = utils.element(doc, "p", "<img src=x onerror=alert(1)>");
  assert.equal(node.tagName, "p");
  assert.equal(node.textContent, "<img src=x onerror=alert(1)>");
  assert.equal(utils.element(doc, "ul").textContent, "");
});

console.log("Calculator utils: " + passed + " tests passed.");
