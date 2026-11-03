// Calculation and keyboard checks for website/home-project-calculator.html.
// No dependencies: node scripts/test_home_calculator.js
// Runs the page's inline script against a minimal DOM stub. It does NOT run a browser:
// layout, HTML5 form validation (required/min/max), mobile and screen-reader checks stay manual.
const fs = require('fs');
const path = require('path');
const file = process.argv[2] || path.join(__dirname, '..', 'website', 'home-project-calculator.html');
const html = fs.readFileSync(file, 'utf8');
const script = html.split('<script>').pop().split('</script>')[0];
const els = {};
function mk(id) {
  return els[id] || (els[id] = {
    id, value: '', innerHTML: '', textContent: '', handlers: {}, attrs: {}, focused: false,
    classList: { toggle() {}, add() {}, remove() {} },
    addEventListener(t, f) { this.handlers[t] = f; },
    setAttribute(k, v) { this.attrs[k] = String(v); },
    getAttribute(k) { return this.attrs[k] !== undefined ? this.attrs[k] : (this.dataset && this.dataset[k]) || ''; },
    focus() { this.focused = true; }
  });
}
for (const m of html.matchAll(/id="([^"]+)"/g)) mk(m[1]);
for (const m of html.matchAll(/<(?:input|select)[^>]*id="([^"]+)"[^>]*>/g)) {
  const v = m[0].match(/\svalue="([^"]*)"/); if (v) els[m[1]].value = v[1];
}
for (const m of html.matchAll(/<select[^>]*id="([^"]+)"[^>]*>\s*<option[^>]*value="([^"]*)"/g)) els[m[1]].value = m[2];
const tabs = [...html.matchAll(/<button[^>]*role="tab"[^>]*id="([^"]+)"[^>]*aria-controls="([^"]+)"/g)].map(m => m);
const tabEls = [...html.matchAll(/<button[^>]*role="tab"[^>]*>/g)].map(m => {
  const id = m[0].match(/id="([^"]+)"/)[1]; const e = mk(id);
  e.attrs['aria-controls'] = m[0].match(/aria-controls="([^"]+)"/)[1];
  e.attrs['aria-selected'] = m[0].match(/aria-selected="([^"]+)"/)[1]; return e;
});
global.document = {
  getElementById: mk,
  querySelectorAll: s => s === '.calc-tabs button' ? tabEls : []
};
eval(script);
let fail = 0;
function submit(form, vals) {
  for (const k in vals) els[k].value = String(vals[k]);
  const out = form.replace('-form', '');
  els[out + '-error'].textContent = '';
  els[out + '-result'].innerHTML = '';
  els[form].handlers.submit({ preventDefault() {} });
  return { err: els[out + '-error'].textContent, res: els[out + '-result'].innerHTML.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() };
}
function ok(name, cond, detail) { if (!cond) fail++; console.log((cond ? 'PASS ' : 'FAIL ') + name + (cond ? '' : '  -> ' + detail)); }
function has(name, r, text) { ok(name, !r.err && r.res.includes(text), JSON.stringify(r)); }
function rejects(name, r) { ok(name, !!r.err && r.res === '', JSON.stringify(r)); }
const M = { 'measure-unit': 'm', 'measure-depth': '' };
// 1 Area / volume
has('measure metric 4x3x2.5', submit('measure-form', { ...M, 'measure-length': 4, 'measure-width': 3, 'measure-depth': 2.5 }), 'Floor area: 12 m² (129.17 ft²) Perimeter: 14 m (45.93 ft) Volume: 30 m³');
has('measure imperial 10x12 ft', submit('measure-form', { 'measure-unit': 'ft', 'measure-length': 10, 'measure-width': 12, 'measure-depth': '' }), 'Floor area: 11.15 m² (120 ft²) Perimeter: 13.41 m (44 ft)');
rejects('measure zero length', submit('measure-form', { ...M, 'measure-length': 0, 'measure-width': 3 }));
has('measure depth 0 gives zero volume (not an error)', submit('measure-form', { ...M, 'measure-length': 4, 'measure-width': 3, 'measure-depth': 0 }), 'Volume: 0 m³');
rejects('measure negative depth', submit('measure-form', { ...M, 'measure-length': 4, 'measure-width': 3, 'measure-depth': -1 }));
// 2 Paint
const P = { 'paint-unit': 'm', 'paint-length': 4, 'paint-width': 3, 'paint-height': 2.5, 'paint-openings': 3, 'paint-coats': 2, 'paint-waste': 10, 'paint-coverage': 10, 'paint-price': 20 };
has('paint 32 m2, 2 coats, 10%: 7.04 -> 8 tins, cost 160', submit('paint-form', P), 'Buy at least 8 tin(s) of the entered coverage. Estimated paint cost: $160');
has('paint zero allowance: 6.4 -> 7 tins', submit('paint-form', { ...P, 'paint-waste': 0 }), 'Buy at least 7 tin(s)');
has('paint exact boundary: 5 tins when 5.00 needed', submit('paint-form', { ...P, 'paint-openings': 0, 'paint-length': 5, 'paint-width': 5, 'paint-height': 2.5, 'paint-waste': 0, 'paint-coats': 1, 'paint-coverage': 10, 'paint-price': '' }), 'Buy at least 5 tin(s)');
rejects('paint openings larger than walls', submit('paint-form', { ...P, 'paint-openings': 100 }));
// 3 Material packs
const K = { 'material-length': 5, 'material-width': 4, 'material-coverage': 2.1, 'material-waste': 10, 'material-price': 30 };
has('material 20 m2 +10% = 22 m2 / 2.1 -> 11 packs, cost 330', submit('material-form', K), 'Required: 11 pack(s) Estimated material cost: $330');
has('material exact pack boundary 21 / 2.1 = 10', submit('material-form', { ...K, 'material-length': 7, 'material-width': 3, 'material-waste': 0, 'material-price': '' }), 'Required: 10 pack(s)');
has('material zero price is a valid price', submit('material-form', { ...K, 'material-price': 0 }), 'Estimated material cost: $0');
// 4 Electricity
const E = { 'energy-watts': 1000, 'energy-hours': 2, 'energy-days': 30, 'energy-rate': 0.2 };
has('energy 1000 W, 2 h, 30 d, 0.20 -> 60 kWh, 12', submit('energy-form', E), '60 kWh per month Daily use: 2 kWh Estimated monthly cost: $12');
has('energy 0 hours -> 0 kWh, cost 0', submit('energy-form', { ...E, 'energy-hours': 0 }), 'Estimated energy: 0 kWh per month');
has('energy tariff 0 -> cost 0', submit('energy-form', { ...E, 'energy-rate': 0 }), 'Estimated monthly cost: $0');
rejects('energy blank days is an error, not silent zero', submit('energy-form', { ...E, 'energy-days': '' }));
has('energy fractional days 15.5 -> 31 kWh', submit('energy-form', { ...E, 'energy-days': 15.5 }), '31 kWh per month');
rejects('energy 25 hours', submit('energy-form', { ...E, 'energy-hours': 25 }));
rejects('energy 32 days', submit('energy-form', { ...E, 'energy-days': 32 }));
rejects('energy zero watts', submit('energy-form', { ...E, 'energy-watts': 0 }));
// 5 Project cost
const J = { 'project-quantity': 10, 'project-unit-price': 25, 'project-extra': 50, 'project-contingency': 10, 'project-tax': 20 };
has('project: 300 + 10% + 20% tax on 330 = 396', submit('project-form', J), 'Contingency: $30 Estimated tax: $66 Estimated project total: $396');
has('project zero prices -> 0', submit('project-form', { ...J, 'project-unit-price': 0, 'project-extra': 0 }), 'Estimated project total: $0');
rejects('project contingency over 100', submit('project-form', { ...J, 'project-contingency': 101 }));
// Stale results cleared after an invalid submission
submit('energy-form', E);
const bad = submit('energy-form', { ...E, 'energy-watts': 0 });
ok('stale result cleared after invalid submit', bad.res === '', JSON.stringify(bad));
// Tabs keyboard pattern
function key(el, k) { let prevented = false; el.handlers.keydown && el.handlers.keydown({ key: k, preventDefault() { prevented = true; } }); return prevented; }
const sel = () => tabEls.map(e => e.attrs['aria-selected']).join(',');
ok('tabs have keydown handlers', tabEls.every(e => typeof e.handlers.keydown === 'function'), 'no keydown handler');
if (tabEls.every(e => typeof e.handlers.keydown === 'function')) {
  ok('exactly one tab in the tab order (roving tabindex)', tabEls.filter(e => e.attrs.tabindex === '0').length === 1, tabEls.map(e => e.attrs.tabindex).join(','));
  key(tabEls[0], 'ArrowRight'); ok('ArrowRight selects and focuses next tab', sel() === 'false,true,false,false,false' && tabEls[1].focused, sel());
  key(tabEls[1], 'End'); ok('End selects last tab', sel() === 'false,false,false,false,true', sel());
  key(tabEls[4], 'ArrowRight'); ok('ArrowRight wraps to first tab', sel() === 'true,false,false,false,false', sel());
  key(tabEls[0], 'ArrowLeft'); ok('ArrowLeft wraps to last tab', sel() === 'false,false,false,false,true', sel());
  key(tabEls[4], 'Home'); ok('Home selects first tab', sel() === 'true,false,false,false,false', sel());
}
console.log(fail ? '\n' + fail + ' check(s) failed' : '\nAll checks passed');
process.exit(fail ? 1 : 0);
