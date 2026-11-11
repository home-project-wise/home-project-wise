'use strict';
// Run: node scripts/test_wallpaper_project_estimator_integration.js
const assert = require('assert');
const path = require('path');
const wallpaper = require(path.join(__dirname, '..', 'website', 'wallpaper-calculator-engine.js'));
const projectEstimator = require(path.join(__dirname, '..', 'website', 'project-estimator-engine.js'));

const pricedWallpaper = wallpaper.estimateWallpaperProject({
  unit: 'ft',
  rollWidth: 20.5 / 12,
  usableLengthPerSaleUnit: 33,
  matchType: 'straight',
  patternRepeat: 20 / 12,
  pricePerSaleUnit: 24.99,
  currency: 'USD',
  saleUnitLabel: 'double-roll package',
  rooms: [
    { label: 'Living room', walls: [12, 15, 12, 15], wallHeight: 8, trimAllowance: 0.5 }
  ]
});
assert.equal(pricedWallpaper.ok, true);
const mappedPricedItem = wallpaper.toProjectBudgetLineItem(pricedWallpaper, {
  id: 'wallpaper-living-room',
  name: 'Living room wallpaper'
});
assert.equal(mappedPricedItem.ok, true);
const pricedEstimate = projectEstimator.calculateEstimate({
  currency: 'USD',
  contingencyPct: 10,
  lineItems: [mappedPricedItem.lineItem]
});
assert.equal(pricedEstimate.lineItems.length, 1);
assert.equal(pricedEstimate.lineItems[0].priceKind, 'user-input');
assert.equal(pricedEstimate.lineItems[0].unit, 'double-roll package');
assert.equal(pricedEstimate.lineItems[0].quantity, 12);
assert.equal(pricedEstimate.totalLow, 329.87);
const pricedBudget = projectEstimator.assessBudget(pricedEstimate, {
  currency: 'USD',
  amount: 400,
  reserveAmount: 20
});
assert.equal(pricedBudget.status, 'likely-within-budget');

const unknownWallpaper = wallpaper.estimateWallpaperProject({
  unit: 'ft',
  rollWidth: 20.5 / 12,
  usableLengthPerSaleUnit: 33,
  matchType: 'straight',
  patternRepeat: 20 / 12,
  saleUnitLabel: 'double-roll package',
  rooms: [
    { label: 'Bedroom', walls: [12, 12], wallHeight: 8, trimAllowance: 0.5 }
  ]
});
assert.equal(unknownWallpaper.ok, true);
const mappedUnknownItem = wallpaper.toProjectBudgetLineItem(unknownWallpaper, {
  id: 'wallpaper-bedroom',
  name: 'Bedroom wallpaper'
});
assert.equal(mappedUnknownItem.ok, true);
assert.equal(mappedUnknownItem.lineItem.price, null);
const unknownEstimate = projectEstimator.calculateEstimate({
  currency: 'USD',
  contingencyPct: 0,
  lineItems: [mappedUnknownItem.lineItem]
});
assert.equal(unknownEstimate.unknownRequired.length, 1);
assert.equal(unknownEstimate.unknownRequired[0].name, 'Bedroom wallpaper');
const unknownBudget = projectEstimator.assessBudget(unknownEstimate, {
  currency: 'USD',
  amount: 500
});
assert.equal(unknownBudget.status, 'cannot-assess');

console.log('PASS wallpaper -> Project Estimator priced line-item integration');
console.log('PASS unknown wallpaper price remains unknown in the project budget');
console.log('2 wallpaper/project-estimator integration tests passed');
