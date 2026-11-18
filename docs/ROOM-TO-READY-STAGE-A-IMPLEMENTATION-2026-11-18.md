# Room-to-Ready Stage A implementation note

Date: 18 November 2026

## What this slice adds

- `website/room-to-ready.js` is a pure domain adapter that turns one shared room and selected work into a single known-material estimate using the existing `HPWProjectEstimator`.
- `website/room-to-ready-ui.js` adds a Room-to-Ready section inside the Project cost tab and synchronizes the current plan into the Project List below.
- `website/home-project-calculator.html` loads the two modules and provides their mount point.
- `tests/room-to-ready.test.js` covers the core area, currency, unknown-cost, finish-exclusivity and electricity-separation rules.

## Inputs and price provenance

- The room is reused from `window.hpwRoom`, which is set by the existing shared-room form. No second room form is introduced.
- The market is reused from the existing page-wide `window.hpwRegion` selection.
- Flooring ranges are selected through `HPWReferencePrices` from the existing `reference-prices.json` registry.
- Paint and wallpaper ranges are selected through the existing approved reference modules and `reference-assumptions.json`.
- No price, coverage rate, package count, labour rate, waste factor or currency conversion is introduced by this feature.
- A visitor-entered unit price takes precedence over the reference range for that selected line and is labelled as visitor-confirmed. If neither a usable reference nor a visitor price exists, the line remains unpriced.
- The Project List now combines Room-to-Ready items with visitor-added items in one estimate. It applies the visitor-selected contingency and optional budget to the combined basket. If currencies differ, it refuses the combination rather than converting or reinterpreting prices.
- Reference source links and observation dates are preserved in the plan output.

## Calculation rules

- Floor area is converted to m² from the shared room dimensions.
- Net wall area is `2 × (length + width) × wall height − openings`, converted to m².
- Paint uses net wall area multiplied by the visitor-selected 1 or 2 coats; the price basis remains per m² per coat.
- Wallpaper uses net wall area once. The wall-finish selector is a single choice: none, paint, or wallpaper.
- Missing wall height creates an explicit unmeasured required item. It is not treated as zero area.
- Unknown prices are passed to the existing estimate engine as null prices. They remain required unknowns and are excluded from the known subtotal, never silently priced at zero.
- Electricity is shown as a separate running-cost category and is not added to one-time materials.

## Current boundary / not claimed complete

This is the first integrated Room-to-Ready slice, not the complete future Home Project Companion. The legacy Project List can add separate visitor-priced labour, service and extra items to the same basket; this feature does not invent those prices or rates. It does not add persistence, accounts, server storage, tax assumptions, labour rates, installation rates, delivery rates, roll/package counts, waste or pattern allowances. Contingency and budget comparison remain visitor-controlled in the existing Project List. The legacy calculators remain available.

## Verification

Run the domain tests from the repository root:

```sh
node --test tests/room-to-ready.test.js
```

The tests exercise the existing project-estimator engine directly, the combined Project List flow, and exact-market price currency matching across all eight supported markets. Manual/browser verification is still required for responsive layout, keyboard/screen-reader interaction, registry fetch failures and country switching before release.
