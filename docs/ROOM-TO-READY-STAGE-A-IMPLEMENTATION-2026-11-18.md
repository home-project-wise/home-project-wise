# Room-to-Ready Stage A implementation note

Date: 18 November 2026

## What this slice adds

- `website/room-to-ready.js` is a pure domain adapter that turns one shared room and selected work into a single known-material estimate using the existing `HPWProjectEstimator`.
- `website/room-to-ready-ui.js` adds a Room-to-Ready section inside the Project cost tab and synchronizes the current plan into the Project List below.
- `website/home-project-calculator.html` loads the two modules and provides their mount point.
- `scripts/test_room_to_ready.js` covers the core area, currency, unknown-cost, finish-exclusivity and electricity-separation rules.

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
- Electricity can be shown as a separate monthly running-cost estimate when the visitor has selected an existing reference tariff and entered appliance wattage, hours per day and days per month in the existing Electricity tab. The reference low/high tariff is multiplied by the entered monthly kWh; its source and observation date are retained. If the tariff or usage inputs are unavailable, the summary keeps its pointer to the Electricity tab. Electricity is never added to one-time materials.
- The Room-to-Ready summary reports counts of source-backed, visitor-confirmed and unpriced/unknown selected items. Labour, delivery, tools, preparation and unverified tax are explicitly listed as not priced/excluded.

## Current boundary / not claimed complete

This is the first integrated Room-to-Ready slice, not the complete future Home Project Companion. The legacy Project List can add separate visitor-priced labour, service and extra items to the same basket; this feature does not invent those prices or rates. It does not add persistence, accounts, server storage, tax assumptions, labour rates, installation rates, delivery rates, roll/package counts, waste or pattern allowances. Contingency and budget comparison remain visitor-controlled in the existing Project List. The legacy calculators remain available.

## Verification

Run the domain tests from the repository root:

```sh
node --test scripts/test_room_to_ready.js
```

The tests exercise the existing project-estimator engine directly, the combined Project List flow, exact-market price currency matching across all eight supported markets, evidence counts, exclusion labels, electricity provenance and the invariant that electricity never enters the one-time materials subtotal. CI/Chromium verification must also cover responsive widths, country switching and a simulated reference-registry fetch failure. Keyboard and screen-reader verification remains a manual check for the owner.
