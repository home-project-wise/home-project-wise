// Tests for the pure summarize() function of website/budget-planner.html and for the privacy rules in its markup.
// Run: node scripts/test_budget_planner.js
const fs = require('fs'), assert = require('assert'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'website', 'budget-planner.html'), 'utf8');
const m = html.match(/\/\*fn\*\/([\s\S]*?)\/\*endfn\*\//);
assert.ok(m, 'fn markers present');
const ORDER = { must: 0, nice: 1, later: 2 };
const { summarize } = new Function('ORDER', m[1] + '; return {summarize: summarize};')(ORDER);
const it = (n, p, q, u) => ({ n, p, q, u });

let r = summarize([it('a', 'must', 2, 10), it('b', 'must', 1, 5), it('c', 'nice', 1, 7)], 40);
assert.strictEqual(r.tot.must, 25); assert.strictEqual(r.mustMissing, 0); assert.strictEqual(r.niceMissing, 0); assert.strictEqual(r.missing, 0);

// a blank price is unknown (null), never zero
r = summarize([it('a', 'must', 1, 10), it('b', 'must', 1, null), it('c', 'nice', 1, null), it('d', 'later', 1, null), it('', 'must', 1, null)], 100);
assert.strictEqual(r.mustMissing, 1, 'an unpriced named must-have is counted, the blank row is not');
assert.strictEqual(r.niceMissing, 1); assert.strictEqual(r.missing, 4, 'missing keeps counting every row without a price');
assert.strictEqual(r.tot.must, 10);

// an explicit 0 is a real price (the reader already owns it), not a missing one
r = summarize([it('a', 'must', 1, 0), it('b', 'must', 1, 10)], 100);
assert.strictEqual(r.mustMissing, 0, 'explicit zero is priced'); assert.strictEqual(r.missing, 0); assert.strictEqual(r.tot.must, 10);

r = summarize([it('a', 'must', 0, 5)], 10);
assert.strictEqual(r.mustMissing, 0, 'a price with quantity 0 is a priced item with a zero line, not a missing price');

// rough guesses never enter the priced totals and only count for unpriced named items
const g = (n, p, q, u, gu) => ({ n, p, q, u, g: gu });
r = summarize([g('a', 'must', 2, null, 10), g('b', 'must', 1, 5, 99), g('c', 'nice', 1, null, 7), g('d', 'later', 1, null, null), g('', 'must', 1, null, 50)], 100);
assert.strictEqual(r.tot.must, 5, 'guesses are not prices'); assert.strictEqual(r.tot.nice, 0);
assert.strictEqual(r.guess.must, 20); assert.strictEqual(r.guess.nice, 7); assert.strictEqual(r.guess.later, 0);
assert.strictEqual(r.guess.count, 2); assert.strictEqual(r.guess.mustCount, 1);
assert.strictEqual(r.mustMissing, 1, 'a guess does not make the must-have priced');
r = summarize([g('a', 'must', 1, null, -3), g('b', 'must', 1, null, NaN)], 10);
assert.strictEqual(r.guess.count, 0, 'negative or non-numeric guesses are ignored');

// privacy: the page must not write the plan into the address bar while the reader types
assert.ok(!/history\.replaceState\(null,'','\?s='/.test(html), 'no replaceState with the encoded plan');
assert.ok(/function share\(\)\{return location\.origin\+location\.pathname\+'\?s='\+encodeURIComponent\(enc\(\)\);\}/.test(html), 'the link is built only when asked');
assert.ok(/if\(s\)\{try\{history\.replaceState\(null,'',location\.pathname\);\}catch\(e\)\{\}/.test(html), 'an opened shared link is removed from the address bar');
assert.ok(html.includes('your plan is never written to the address bar'));
assert.ok(html.includes('The link contains your list, budget, entered prices and any rough guesses.')); assert.ok(html.includes('Treat it as a private note'));
// the confusing sentence is gone and the new help is in the markup
assert.ok(!html.includes('an empty price counts as zero'), 'empty price must not be described as zero');
assert.ok(html.includes('Type 0 if you already own an item'));
assert.ok(html.includes('Do this in 10 minutes'));
assert.ok(html.includes('never counted as a price'));
assert.ok(/function numOrNull\(/.test(html), 'blank price is read as null');
assert.ok(!/u:parseFloat\(tr\.querySelector\('\.r-u'\)\.value\)\|\|0/.test(html), 'blank price must not be coerced to 0');
// the plan must not be redrawn on blur: a redraw between mousedown and mouseup swallows the click on the copy link
assert.ok(!/addEventListener\('change',function\(\)\{calc\(/.test(html) && !html.includes("['input','change']"), 'no change listeners that redraw the result on blur');
console.log('budget planner: all assertions passed');
