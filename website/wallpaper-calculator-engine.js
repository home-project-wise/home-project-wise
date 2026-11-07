'use strict';

/*
 * HomeProjectWise wallpaper quantity engine.
 * Pure calculation only: no DOM, storage, network, URL, or analytics access.
 * All dimensions in one call must use the same unit.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.HomeProjectWiseWallpaper = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const EPSILON = 1e-10;

  function fail(code, message) {
    return { ok: false, error: { code, message } };
  }

  function isFiniteNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  function floorWithTolerance(value) {
    const nearest = Math.round(value);
    return Math.abs(value - nearest) <= EPSILON ? nearest : Math.floor(value);
  }

  function money(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  function estimateWallpaper(input) {
    if (!input || typeof input !== 'object') {
      return fail('invalid_input', 'Provide the room measurements and exact product-label dimensions.');
    }

    if (typeof input.unit !== 'string' || !input.unit.trim()) {
      return fail('invalid_unit', 'Choose one measurement unit and use it for every dimension.');
    }
    if (typeof input.saleUnitLabel !== 'string' || !input.saleUnitLabel.trim()) {
      return fail('invalid_sale_unit', 'Name the exact sale unit shown on the product label (for example, double roll or package).');
    }

    const walls = input.walls;
    if (!Array.isArray(walls) || walls.length === 0) {
      return fail('walls_required', 'Enter at least one wall width.');
    }

    const normalizedWalls = [];
    for (let index = 0; index < walls.length; index += 1) {
      const wall = typeof walls[index] === 'number' ? { width: walls[index] } : walls[index];
      if (!wall || !isFiniteNumber(wall.width) || wall.width <= 0) {
        return fail('invalid_wall_width', `Wall ${index + 1} must have a width greater than zero.`);
      }
      normalizedWalls.push({
        label: typeof wall.label === 'string' && wall.label.trim() ? wall.label.trim() : `Wall ${index + 1}`,
        width: wall.width
      });
    }

    const requiredPositive = [
      ['wallHeight', input.wallHeight, 'Wall height'],
      ['rollWidth', input.rollWidth, 'Usable roll width'],
      ['usableLengthPerSaleUnit', input.usableLengthPerSaleUnit, 'Usable length per sale unit']
    ];
    for (const [key, value, label] of requiredPositive) {
      if (!isFiniteNumber(value) || value <= 0) {
        return fail(`invalid_${key}`, `${label} must be a number greater than zero.`);
      }
    }

    if (!isFiniteNumber(input.trimAllowance) || input.trimAllowance < 0) {
      return fail('invalid_trim_allowance', 'Enter a non-negative trimming allowance from the product instructions.');
    }

    const matchType = input.matchType;
    if (matchType !== 'free' && matchType !== 'random' && matchType !== 'straight') {
      return fail('unsupported_match_type', "This version supports free/random and straight match only. Use the manufacturer's calculator for half-drop, offset or complex patterns.");
    }

    if (matchType === 'straight' && (!isFiniteNumber(input.patternRepeat) || input.patternRepeat <= 0)) {
      return fail('invalid_pattern_repeat', 'A straight-match pattern needs its positive vertical repeat from the product label.');
    }

    const workingHeight = input.wallHeight + input.trimAllowance;
    // Conservative straight-match allowance: one full repeat is added after trim.
    // Product-specific manufacturer instructions/calculators take precedence.
    const dropLength = matchType === 'straight'
      ? workingHeight + input.patternRepeat
      : workingHeight;

    if (!isFiniteNumber(dropLength) || dropLength <= 0) {
      return fail('invalid_drop_length', 'The calculated drop length is not valid. Check the height, trim and pattern repeat.');
    }

    const dropsPerSaleUnit = floorWithTolerance(input.usableLengthPerSaleUnit / dropLength);
    if (!Number.isSafeInteger(dropsPerSaleUnit)) {
      return fail('quantity_out_of_range', 'The usable sale-unit length is outside the safe calculation range.');
    }
    if (dropsPerSaleUnit < 1) {
      return fail('sale_unit_too_short', 'This sale unit cannot produce one complete drop at the entered wall height and pattern repeat.');
    }

    const wallResults = normalizedWalls.map(wall => ({
      label: wall.label,
      width: wall.width,
      dropsRequired: Math.ceil(wall.width / input.rollWidth)
    }));
    if (wallResults.some(wall => !Number.isSafeInteger(wall.dropsRequired))) {
      return fail('quantity_out_of_range', 'The entered wall width or roll width is outside the safe calculation range.');
    }
    const totalDrops = wallResults.reduce((sum, wall) => sum + wall.dropsRequired, 0);
    const saleUnits = Math.ceil(totalDrops / dropsPerSaleUnit);
    if (!Number.isSafeInteger(totalDrops) || !Number.isSafeInteger(saleUnits)) {
      return fail('quantity_out_of_range', 'The calculated drop or sale-unit count is outside the safe calculation range.');
    }

    const hasPrice = input.pricePerSaleUnit !== undefined && input.pricePerSaleUnit !== null && input.pricePerSaleUnit !== '';
    if (hasPrice && (!isFiniteNumber(input.pricePerSaleUnit) || input.pricePerSaleUnit < 0)) {
      return fail('invalid_price', 'Enter a non-negative price per sale unit, or leave it blank when unknown.');
    }
    if (hasPrice && (typeof input.currency !== 'string' || !input.currency.trim())) {
      return fail('invalid_currency', 'Choose the currency for the entered sale-unit price.');
    }
    if (hasPrice && (!Number.isFinite(saleUnits * input.pricePerSaleUnit) || saleUnits * input.pricePerSaleUnit > Number.MAX_SAFE_INTEGER / 100)) {
      return fail('cost_out_of_range', 'The estimated material cost is outside the safe calculation range.');
    }

    return {
      ok: true,
      unit: input.unit.trim(),
      matchType,
      wallHeight: input.wallHeight,
      trimAllowance: input.trimAllowance,
      workingHeight,
      patternRepeat: matchType === 'straight' ? input.patternRepeat : null,
      dropLength,
      rollWidth: input.rollWidth,
      usableLengthPerSaleUnit: input.usableLengthPerSaleUnit,
      saleUnitLabel: input.saleUnitLabel.trim(),
      walls: wallResults,
      totalDrops,
      dropsPerSaleUnit,
      saleUnits,
      pricePerSaleUnit: hasPrice ? input.pricePerSaleUnit : null,
      currency: hasPrice ? input.currency.trim() : null,
      materialCost: hasPrice ? money(saleUnits * input.pricePerSaleUnit) : null,
      assumptions: [
        'Each wall is rounded up separately; no offcut reuse across corners is assumed.',
        'Ordinary doors and windows are not deducted automatically.',
        'The entered sale-unit length and price must describe the same product package.',
        'Complex offset patterns, murals and irregular wall layouts are not calculated.'
      ]
    };
  }

  function compareWallpaperProducts(commonInput, products) {
    if (!Array.isArray(products) || products.length !== 2) {
      return fail('two_products_required', 'Provide exactly two product-label sets to compare.');
    }
    const comparisons = products.map(product => {
      const estimate = estimateWallpaper({ ...commonInput, ...product });
      return {
        productLabel: product && typeof product.productLabel === 'string' ? product.productLabel : 'Wallpaper option',
        estimate
      };
    });
    return {
      ok: true,
      products: comparisons,
      comparable: comparisons.every(item => item.estimate.ok),
      note: 'Compare only products measured in the same unit system and priced per their stated sale unit.'
    };
  }

  return { estimateWallpaper, compareWallpaperProducts };
});
