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

r = summarize([it('a', 'must', 1, 10), it('b', 'must', 1, 0), it('c', 'nice', 1, 0), it('d', 'later', 1, 0), it('', 'must', 1, 0)], 100);
assert.strictEqual(r.mustMissing, 1, 'an unpriced named must-have is counted, the blank row is not');
assert.strictEqual(r.niceMissing, 1); assert.strictEqual(r.missing, 4, 'missing keeps counting every row without a price');
assert.strictEqual(r.tot.must, 10);

r = summarize([it('a', 'must', 0, 5)], 10);
assert.strictEqual(r.mustMissing, 0, 'a price with quantity 0 is a priced item with a zero line, not a missing price');

// privacy: the page must not write the plan into the address bar while the reader types
assert.ok(!/history\.replaceState\(null,'','\?s='/.test(html), 'no replaceState with the encoded plan');
assert.ok(/function share\(\)\{return location\.origin\+location\.pathname\+'\?s='\+encodeURIComponent\(enc\(\)\);\}/.test(html), 'the link is built only when asked');
assert.ok(/if\(s\)\{try\{history\.replaceState\(null,'',location\.pathname\);\}catch\(e\)\{\}/.test(html), 'an opened shared link is removed from the address bar');
assert.ok(html.includes('your plan is never written to the address bar'));
assert.ok(html.includes('The link contains your list, budget and prices'));
console.log('budget planner: all assertions passed');
