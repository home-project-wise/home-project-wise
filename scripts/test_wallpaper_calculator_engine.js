'use strict';
// Run: node scripts/test_wallpaper_calculator_engine.js
const assert = require('assert');
const path = require('path');
const { estimateWallpaper, estimateWallpaperProject, compareWallpaperProducts } = require(path.join(__dirname, '..', 'website', 'wallpaper-calculator-engine.js'));
let passed = 0;
function test(name, fn) {
  try { fn(); passed += 1; console.log(`PASS ${name}`); }
  catch (error) { console.error(`FAIL ${name}: ${error.message}`); process.exitCode = 1; }
}
function base(overrides = {}) {
  return {
    walls: [12, 15, 12, 15], wallHeight: 8, trimAllowance: 0.5,
    rollWidth: 1.7083333333333333, usableLengthPerSaleUnit: 33,
    matchType: 'straight', patternRepeat: 1.6666666666666667,
    unit: 'ft', pricePerSaleUnit: 24.99, currency: '$', saleUnitLabel: 'double-roll package',
    ...overrides
  };
}
test('worked example: 34 drops, 10.167 ft drop, 3 per unit, 12 units', () => {
  const r = estimateWallpaper(base());
  assert.equal(r.ok, true); assert.equal(r.totalDrops, 34); assert.ok(Math.abs(r.dropLength - (8.5 + 20/12)) < 1e-10);
  assert.equal(r.dropsPerSaleUnit, 3); assert.equal(r.saleUnits, 12); assert.equal(r.materialCost, 299.88);
  assert.deepEqual(r.walls.map(w => w.dropsRequired), [8, 9, 8, 9]);
});
test('free match uses wall height plus explicit trim', () => {
  const r = estimateWallpaper(base({ matchType: 'free', patternRepeat: null }));
  assert.equal(r.ok, true); assert.equal(r.dropLength, 8.5); assert.equal(r.patternRepeat, null);
});
test('random match is accepted as free match', () => {
  const r = estimateWallpaper(base({ matchType: 'random', patternRepeat: null }));
  assert.equal(r.ok, true); assert.equal(r.dropLength, 8.5);
});
test('straight match adds one full repeat after trim allowance', () => {
  const r = estimateWallpaper(base({ walls: [2], wallHeight: 8.5, trimAllowance: 0.5, patternRepeat: 2, rollWidth: 1, usableLengthPerSaleUnit: 30 }));
  assert.equal(r.ok, true); assert.equal(r.dropLength, 11);
});
test('straight match adds one full repeat even at an exact working-height boundary', () => {
  const r = estimateWallpaper(base({ walls: [2], wallHeight: 8, trimAllowance: 0, patternRepeat: 2, rollWidth: 1, usableLengthPerSaleUnit: 30 }));
  assert.equal(r.ok, true); assert.equal(r.dropLength, 10);
});
test('straight match adds one full repeat just above a boundary', () => {
  const r = estimateWallpaper(base({ walls: [2], wallHeight: 8.000001, trimAllowance: 0, patternRepeat: 2, rollWidth: 1, usableLengthPerSaleUnit: 30 }));
  assert.ok(Math.abs(r.dropLength - 10.000001) < 1e-10);
});
test('straight match adds one full repeat just below a boundary', () => {
  const r = estimateWallpaper(base({ walls: [2], wallHeight: 7.999999, trimAllowance: 0, patternRepeat: 2, rollWidth: 1, usableLengthPerSaleUnit: 30 }));
  assert.ok(Math.abs(r.dropLength - 9.999999) < 1e-10);
});
test('only complete drops fit in sale unit: exact fit', () => {
  const r = estimateWallpaper(base({ walls: [3], wallHeight: 10, trimAllowance: 0, matchType: 'free', patternRepeat: null, rollWidth: 1, usableLengthPerSaleUnit: 30 }));
  assert.equal(r.ok, true); assert.equal(r.dropsPerSaleUnit, 3);
});
test('partial remainder does not count as another complete drop', () => {
  const r = estimateWallpaper(base({ walls: [3], wallHeight: 10, trimAllowance: 0, matchType: 'free', patternRepeat: null, rollWidth: 1, usableLengthPerSaleUnit: 29.99 }));
  assert.equal(r.ok, true); assert.equal(r.dropsPerSaleUnit, 2);
});
test('each wall rounds separately rather than carrying width around corners', () => {
  const r = estimateWallpaper(base({ walls: [1.1, 1.1], wallHeight: 2, trimAllowance: 0, patternRepeat: 1, rollWidth: 1, usableLengthPerSaleUnit: 20 }));
  assert.equal(r.ok, true); assert.equal(r.totalDrops, 4);
});
test('zero price is valid and produces zero material cost', () => {
  const r = estimateWallpaper(base({ pricePerSaleUnit: 0 }));
  assert.equal(r.ok, true); assert.equal(r.materialCost, 0);
});
test('unknown blank price stays unknown, not zero', () => {
  const r = estimateWallpaper(base({ pricePerSaleUnit: '' }));
  assert.equal(r.ok, true); assert.equal(r.pricePerSaleUnit, null); assert.equal(r.materialCost, null);
});
test('negative price is rejected', () => {
  const r = estimateWallpaper(base({ pricePerSaleUnit: -1 }));
  assert.equal(r.ok, false); assert.equal(r.error.code, 'invalid_price');
});
test('missing trim allowance is rejected instead of guessed', () => {
  const input = base(); delete input.trimAllowance;
  const r = estimateWallpaper(input);
  assert.equal(r.ok, false); assert.equal(r.error.code, 'invalid_trim_allowance');
});
test('zero trim allowance is valid', () => {
  const r = estimateWallpaper(base({ trimAllowance: 0 }));
  assert.equal(r.ok, true); assert.equal(r.workingHeight, 8);
});
test('missing unit label is rejected', () => {
  const input = base(); delete input.unit;
  const r = estimateWallpaper(input);
  assert.equal(r.ok, false); assert.equal(r.error.code, 'invalid_unit');
});
test('missing sale-unit label is rejected', () => {
  const input = base(); delete input.saleUnitLabel;
  const r = estimateWallpaper(input);
  assert.equal(r.ok, false); assert.equal(r.error.code, 'invalid_sale_unit');
});
test('price without a currency is rejected', () => {
  const r = estimateWallpaper(base({ currency: '' }));
  assert.equal(r.ok, false); assert.equal(r.error.code, 'invalid_currency');
});
test('zero wall width is rejected', () => {
  const r = estimateWallpaper(base({ walls: [0] }));
  assert.equal(r.ok, false); assert.equal(r.error.code, 'invalid_wall_width');
});
test('negative wall height is rejected', () => {
  const r = estimateWallpaper(base({ wallHeight: -2 }));
  assert.equal(r.ok, false); assert.equal(r.error.code, 'invalid_wallHeight');
});
test('missing pattern repeat is rejected for straight match', () => {
  const r = estimateWallpaper(base({ patternRepeat: null }));
  assert.equal(r.ok, false); assert.equal(r.error.code, 'invalid_pattern_repeat');
});
test('half-drop is explicitly unsupported', () => {
  const r = estimateWallpaper(base({ matchType: 'half-drop' }));
  assert.equal(r.ok, false); assert.equal(r.error.code, 'unsupported_match_type');
});
test('unknown match type is explicitly unsupported', () => {
  const r = estimateWallpaper(base({ matchType: 'unknown' }));
  assert.equal(r.ok, false); assert.equal(r.error.code, 'unsupported_match_type');
});
test('sale unit too short to produce one full drop is rejected', () => {
  const r = estimateWallpaper(base({ walls: [2], wallHeight: 20, trimAllowance: 1, patternRepeat: 2, rollWidth: 1, usableLengthPerSaleUnit: 10 }));
  assert.equal(r.ok, false); assert.equal(r.error.code, 'sale_unit_too_short');
});
test('no walls is rejected', () => {
  const r = estimateWallpaper(base({ walls: [] }));
  assert.equal(r.ok, false); assert.equal(r.error.code, 'walls_required');
});
test('metric and imperial inputs produce the same sale-unit count', () => {
  const ft = estimateWallpaper(base());
  const m = estimateWallpaper(base({
    walls: [12*0.3048,15*0.3048,12*0.3048,15*0.3048],
    wallHeight: 8*0.3048, trimAllowance: 0.5*0.3048,
    rollWidth: (20.5/12)*0.3048, usableLengthPerSaleUnit: 33*0.3048,
    patternRepeat: (20/12)*0.3048, unit: 'm'
  }));
  assert.equal(ft.ok, true); assert.equal(m.ok, true); assert.equal(m.saleUnits, ft.saleUnits); assert.equal(m.totalDrops, ft.totalDrops);
});
test('two-product comparison reports each product result and cost', () => {
  const r = compareWallpaperProducts({ walls: [12, 15], wallHeight: 8, trimAllowance: 0.5, unit: 'ft' }, [
    { productLabel: 'A', matchType: 'free', rollWidth: 2, usableLengthPerSaleUnit: 30, pricePerSaleUnit: 20, currency: '$', saleUnitLabel: 'roll' },
    { productLabel: 'B', matchType: 'straight', patternRepeat: 2, rollWidth: 2, usableLengthPerSaleUnit: 30, pricePerSaleUnit: 25, currency: '$', saleUnitLabel: 'roll' }
  ]);
  assert.equal(r.ok, true); assert.equal(r.comparable, true); assert.equal(r.costComparable, true); assert.equal(r.products.length, 2);
  assert.equal(r.products[0].estimate.ok, true); assert.equal(r.products[1].estimate.ok, true);
});
test('comparison marks unsupported product as not comparable', () => {
  const r = compareWallpaperProducts({ walls: [12], wallHeight: 8, trimAllowance: 0.5, unit: 'ft' }, [
    { matchType: 'free', rollWidth: 2, usableLengthPerSaleUnit: 30, saleUnitLabel: 'roll' },
    { matchType: 'half-drop', patternRepeat: 2, rollWidth: 2, usableLengthPerSaleUnit: 30, saleUnitLabel: 'roll' }
  ]);
  assert.equal(r.ok, true); assert.equal(r.comparable, false); assert.equal(r.products[1].estimate.error.code, 'unsupported_match_type');
});
test('comparison refuses quantity comparison across different measurement units', () => {
  const r = compareWallpaperProducts({ walls: [12], wallHeight: 8, trimAllowance: 0.5, unit: 'ft' }, [
    { matchType: 'free', rollWidth: 2, usableLengthPerSaleUnit: 30, saleUnitLabel: 'roll', unit: 'ft' },
    { matchType: 'free', rollWidth: 0.6, usableLengthPerSaleUnit: 10, saleUnitLabel: 'roll', unit: 'm' }
  ]);
  assert.equal(r.ok, true); assert.equal(r.comparable, false); assert.equal(r.costComparable, false);
});
test('comparison does not compare costs in different currencies', () => {
  const r = compareWallpaperProducts({ walls: [12], wallHeight: 8, trimAllowance: 0.5, unit: 'ft' }, [
    { matchType: 'free', rollWidth: 2, usableLengthPerSaleUnit: 30, saleUnitLabel: 'roll', pricePerSaleUnit: 20, currency: 'USD' },
    { matchType: 'free', rollWidth: 2, usableLengthPerSaleUnit: 30, saleUnitLabel: 'roll', pricePerSaleUnit: 18, currency: 'CAD' }
  ]);
  assert.equal(r.ok, true); assert.equal(r.comparable, true); assert.equal(r.costComparable, false);
});
test('quantity comparison remains valid when prices are unknown but cost comparison is unavailable', () => {
  const r = compareWallpaperProducts({ walls: [12], wallHeight: 8, trimAllowance: 0.5, unit: 'ft' }, [
    { matchType: 'free', rollWidth: 2, usableLengthPerSaleUnit: 30, saleUnitLabel: 'roll' },
    { matchType: 'free', rollWidth: 2, usableLengthPerSaleUnit: 30, saleUnitLabel: 'roll' }
  ]);
  assert.equal(r.ok, true); assert.equal(r.comparable, true); assert.equal(r.costComparable, false);
});

test('multi-room project calculates each room separately and sums sale units conservatively', () => {
  const r = estimateWallpaperProject({
    unit: 'ft', rollWidth: 1.7083333333333333, usableLengthPerSaleUnit: 33,
    matchType: 'straight', patternRepeat: 20/12, pricePerSaleUnit: 24.99, currency: '
, saleUnitLabel: 'double-roll package',
    rooms: [
      { label: 'Living room', walls: [12, 15, 12, 15], wallHeight: 8, trimAllowance: 0.5 },
      { label: 'Bedroom', walls: [10, 10], wallHeight: 8.5, trimAllowance: 0.5 }
    ]
  });
  assert.equal(r.ok, true); assert.equal(r.totalDrops, 46); assert.equal(r.rooms[0].estimate.saleUnits, 12);
  assert.equal(r.rooms[1].estimate.saleUnits, 4); assert.equal(r.totalSaleUnits, 16); assert.equal(r.materialCost, 399.84);
});
test('multi-room project rejects an invalid room instead of silently omitting it', () => {
  const r = estimateWallpaperProject({ unit: 'ft', rollWidth: 2, usableLengthPerSaleUnit: 30, saleUnitLabel: 'roll', matchType: 'free', trimAllowance: 0, rooms: [
    { walls: [12], wallHeight: 8, trimAllowance: 0 },
    { walls: [0], wallHeight: 8, trimAllowance: 0 }
  ] });
  assert.equal(r.ok, false); assert.equal(r.error.code, 'invalid_room'); assert.equal(r.error.roomIndex, 1);
});
test('multi-room product comparison preserves room-by-room totals', () => {
  const r = compareWallpaperProducts({ unit: 'ft', rooms: [
    { label: 'Room 1', walls: [12, 12], wallHeight: 8, trimAllowance: 0.5 },
    { label: 'Room 2', walls: [10, 10], wallHeight: 8.5, trimAllowance: 0.5 }
  ] }, [
    { matchType: 'free', rollWidth: 2, usableLengthPerSaleUnit: 30, saleUnitLabel: 'roll', pricePerSaleUnit: 20, currency: 'USD' },
    { matchType: 'straight', patternRepeat: 2, rollWidth: 2, usableLengthPerSaleUnit: 30, saleUnitLabel: 'roll', pricePerSaleUnit: 25, currency: 'USD' }
  ]);
  assert.equal(r.ok, true); assert.equal(r.comparable, true); assert.equal(r.costComparable, true);
  assert.equal(r.products[0].estimate.rooms.length, 2);
});

console.log(`\n${passed} wallpaper engine tests passed`);
