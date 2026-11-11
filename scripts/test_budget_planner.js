// Tests for the pure summarize() function of website/budget-planner.html and for the privacy rules in its markup.
// Run: node scripts/test_budget_planner.js
const fs = require('fs'), assert = require('assert'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'website', 'budget-planner.html'), 'utf8');
const m = html.match(/\/\*fn\*\/([\s\S]*?)\/\*endfn\*\//);
assert.ok(m, 'fn markers present');
const ORDER = { must: 0, nice: 1, later: 2 };
const E = require('../website/project-estimator-engine.js');
const { summarize, runScenarios, sanitizeItems } = new Function('ORDER', 'E', m[1] + '; return {summarize: summarize, runScenarios: runScenarios, sanitizeItems: sanitizeItems};')(ORDER, E);
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

// a blank or invalid quantity is unknown (null), never zero: the item is unpriced, not a free zero line
r = summarize([it('a', 'must', null, 10), it('b', 'must', 1, 5)], 100);
assert.strictEqual(r.mustMissing, 1, 'a price with a blank quantity is not a priced item'); assert.strictEqual(r.missing, 1); assert.strictEqual(r.tot.must, 5);
r = summarize([it('a', 'nice', NaN, 10), it('', 'must', null, 10)], 100);
assert.strictEqual(r.niceMissing, 1); assert.strictEqual(r.mustMissing, 0, 'a blank row is ignored'); assert.strictEqual(r.tot.nice, 0);
r = summarize([it('a', 'must', 0, 10)], 100);
assert.strictEqual(r.mustMissing, 0, 'an explicit quantity 0 stays a valid zero line'); assert.strictEqual(r.tot.must, 0);
assert.ok(!/q:parseFloat\(tr\.querySelector\('\.r-q'\)\.value\)\|\|0/.test(html), 'blank quantity must not be coerced to 0');
assert.ok(!/parseFloat\(r\[2\]\)\|\|0/.test(html), 'a shared link must not turn a blank quantity into 0');
assert.ok(html.includes('Enter a quantity for: '), 'visible quantity validation message');

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

// ---- engine integration: three priority scenarios computed by the project-estimator engine
const gi = (n, p, q, u, gu) => ({ n, p, q, u, g: gu });
let sc = runScenarios([gi('a', 'must', 2, 10), gi('b', 'nice', 1, 7), gi('c', 'later', 1, 3), gi('', 'must', 1, null)], 100, false);
assert.deepStrictEqual(sc.map(o => o.est.subtotalLow), [20, 27, 30], 'must / must+nice / everything');
assert.ok(sc.every(o => o.ver.status === 'likely-within-budget'), 'all fit a budget of 100');
assert.strictEqual(sc[0].est.lineItems.length, 1, 'the must scenario holds only Must rows (blank row ignored)');
assert.strictEqual(sc[1].est.lineItems.length, 2); assert.strictEqual(sc[2].est.lineItems.length, 3);
// unknown required line: cannot-assess, never a fit, priced subtotal is only a partial one
sc = runScenarios([gi('a', 'must', 1, 40), gi('b', 'must', 1, null), gi('c', 'nice', 1, 5)], 100, false);
assert.strictEqual(sc[0].ver.status, 'cannot-assess'); assert.strictEqual(sc[0].est.unknownRequired.length, 1);
assert.strictEqual(sc[0].est.subtotalLow, 40, 'partial subtotal excludes the unknown line');
assert.strictEqual(sc[1].ver.status, 'cannot-assess');
// unknown optional line: stays optional, is not priced, the required scope can still be assessed
sc = runScenarios([gi('a', 'must', 1, 40), gi('b', 'nice', 1, null), gi('c', 'later', 1, null)], 100, false);
assert.strictEqual(sc[0].ver.status, 'likely-within-budget'); assert.strictEqual(sc[1].est.unknownOptional.length, 1); assert.strictEqual(sc[2].est.unknownOptional.length, 2);
assert.strictEqual(sc[2].est.subtotalLow, 40, 'optional unknowns are not counted as priced costs');
// explicit zero is a real price, blank quantity is unknown
sc = runScenarios([gi('a', 'must', 1, 0), gi('b', 'must', 1, 25)], 30, false);
assert.strictEqual(sc[0].est.unknownRequired.length, 0); assert.strictEqual(sc[0].est.subtotalLow, 25); assert.strictEqual(sc[0].ver.status, 'likely-within-budget');
sc = runScenarios([gi('a', 'must', null, 10), gi('b', 'must', 1, 25)], 100, false);
assert.strictEqual(sc[0].est.unknownRequired.length, 1, 'blank quantity makes the required line unknown'); assert.strictEqual(sc[0].ver.status, 'cannot-assess');
sc = runScenarios([gi('a', 'must', 1, 140)], 100, false);
assert.strictEqual(sc[0].ver.status, 'likely-over-budget');
sc = runScenarios([gi('a', 'nice', 1, 5)], 100, false);
assert.ok(sc[0].empty && sc[0].est === null, 'no Must rows: the must scenario is empty, not an error'); assert.strictEqual(sc[1].est.subtotalLow, 5);
// a price with more than 4 decimals is never rounded silently and never throws
sc = runScenarios([gi('a', 'must', 1, 0.12345), gi('b', 'must', 1, 5)], 100, false);
assert.deepStrictEqual(sc[2].badPrice, ['a']); assert.strictEqual(sc[0].est.unknownRequired.length, 1); assert.ok(!sc[0].error);
// rough guesses live in a separate run and never change the main scenarios
const base = [gi('a', 'must', 2, null, 10), gi('b', 'must', 1, 5, 99), gi('c', 'nice', 1, null, 7), gi('d', 'later', 1, null, null)];
const noG = runScenarios(base, 100, false), withG = runScenarios(base, 100, true);
const clean = base.map(x => Object.assign({}, x, { g: undefined }));
assert.deepStrictEqual(runScenarios(clean, 100, false).map(o => [o.est.subtotalLow, o.ver.status]), noG.map(o => [o.est.subtotalLow, o.ver.status]), 'main scenarios ignore guesses entirely');
assert.deepStrictEqual(noG.map(o => o.guessed), [[], [], []]);
assert.deepStrictEqual(withG[2].guessed, ['a', 'c']); assert.strictEqual(withG[0].est.subtotalLow, 25, 'guess 2 x 10 + real price 5'); assert.strictEqual(withG[1].est.subtotalLow, 32); assert.strictEqual(withG[2].est.subtotalLow, 32);
assert.ok(withG[0].est.lineItems.find(l => l.name === 'b').unitPriceLow === 5, 'a real price is never overwritten by a guess');
// the engine totals equal the plain summarize() totals on many generated plans
let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let k = 0; k < 300; k++) {
  const rows = []; const n = 1 + Math.floor(rnd() * 6);
  for (let i = 0; i < n; i++) rows.push(gi('i' + i, ['must', 'nice', 'later'][Math.floor(rnd() * 3)], rnd() < 0.15 ? null : Math.floor(rnd() * 4), rnd() < 0.25 ? null : Math.round(rnd() * 5000) / 100, undefined));
  const s0 = summarize(rows, 100), e0 = runScenarios(rows, 100, false);
  const eTot = [e0[0].est ? e0[0].est.subtotalLow : 0, e0[1].est ? e0[1].est.subtotalLow : 0, e0[2].est ? e0[2].est.subtotalLow : 0];
  assert.ok(Math.abs(eTot[0] - s0.tot.must) < 0.005 && Math.abs(eTot[1] - (s0.tot.must + s0.tot.nice)) < 0.005 && Math.abs(eTot[2] - s0.all) < 0.005, 'engine and summarize agree: ' + JSON.stringify(rows));
}
// USD only, engine loaded, and every copy about the share link says what the URL really holds
assert.ok(!/id="cur"/.test(html), 'no currency selector'); assert.ok(html.includes('US dollars (USD)'));
assert.ok(/<script src="project-estimator-engine\.js"><\/script><script>\(function/.test(html), 'engine loaded before the planner script');
assert.ok(!html.includes('list, budget and prices'), 'no stale link description is left');
const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(x => JSON.parse(x[1]));
const faq = ld.find(x => x['@type'] === 'FAQPage'); const saveQ = faq.mainEntity.find(q => /save my plan/i.test(q.name));
assert.ok(saveQ.acceptedAnswer.text.includes('entered prices and any rough guesses'), 'structured FAQ answer matches the real URL contents');
const visible = html.replace(/<script[\s\S]*?<\/script>/g, '');
assert.strictEqual((visible.match(/entered prices and any rough guesses/g) || []).length, 2, 'how-it-works paragraph and visible FAQ (the generated note lives in the script)');
assert.ok(/function enc\(\)\{var st=\{t:sel\.value,b:form\.querySelector\('#budget'\)\.value,r:/.test(html), 'the link no longer carries a currency symbol');
console.log('budget planner engine integration: all assertions passed');

// review fixes (ChatGPT, #250): a rejected >4-decimal price is unknown in EVERY output, never half accepted
let z = sanitizeItems([gi('a', 'must', 2, 0.12345), gi('b', 'must', 1, 5), gi('', 'must', 1, 0.123456)]);
assert.deepStrictEqual(z.bad, ['a'], 'named rows are reported, blank rows are not'); assert.strictEqual(z.items[0].u, null); assert.strictEqual(z.items[1].u, 5);
const typed = [gi('a', 'must', 2, 0.12345)]; sanitizeItems(typed); assert.strictEqual(typed[0].u, 0.12345, 'the typed value is never mutated');
let sm = summarize(z.items, 100);
assert.strictEqual(sm.mustMissing, 1, 'the legacy summary counts the rejected row as missing'); assert.strictEqual(sm.tot.must, 5, 'and does not add its line');
assert.strictEqual(sm.order.find(x => x.n === 'a').line, 0, 'the buying order shows no amount for it');
sc = runScenarios(z.items, 100, false);
assert.strictEqual(sc[0].est.subtotalLow, 5); assert.strictEqual(sc[0].ver.status, 'cannot-assess');
assert.strictEqual(sc[0].est.unknownRequired.length, 1);
assert.ok(/var sz=sanitizeItems\(read\(\)\),items=sz\.items;/.test(html), 'calc works on the sanitized copy only');
// an empty Must scenario is not a fit and not a $0 cost; an explicit zero price is a real zero-cost scope
sc = runScenarios([gi('a', 'nice', 1, 5), gi('b', 'later', 1, 3)], 100, false);
assert.ok(sc[0].empty && sc[0].est === null && sc[0].ver === null, 'no verdict at all for an empty Must scenario');
assert.ok(!sc[1].empty && sc[1].est.subtotalLow === 5);
sc = runScenarios([gi('a', 'must', 1, 0)], 100, false);
assert.ok(!sc[0].empty && sc[0].est.subtotalLow === 0 && sc[0].ver.status === 'likely-within-budget', 'a typed price of 0 is a priced zero-cost Must');
assert.ok(html.includes('No must-have items selected.') && html.includes('none selected'));
assert.ok(!/fitM=sc\[0\]\.empty/.test(html), 'an empty scenario can no longer count as a fit');
console.log('budget planner review fixes: all assertions passed');
