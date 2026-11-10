# Wallpaper calculator UI integration — implementation handoff
Date: 2026-11-10
Status: scoped for Claude implementation; ChatGPT completed source inspection and safety/acceptance specification only.

## Work completed in this pass
- Re-read the operations room, current audit and Claude engineering record.
- Verified the accessibility work #266 and evidence record #267 are merged. The engineering record reports 364/364 Chromium checks for the accessibility suite and the existing calculator/engine suites passing.
- Re-read the current flagship calculator HTML, wallpaper engine, Project Estimator Engine 1.0.2, and wallpaper module specification.
- Confirmed the wallpaper engine is a pure calculation module and already exports:
  - `estimateWallpaper(input)`
  - `estimateWallpaperProject(input)`
  - `compareWallpaperProducts(commonInput, products)`
  - `toProjectBudgetLineItem(estimate, options)`
- Confirmed the flagship calculator currently has five tabs: area/volume, paint, flooring/materials, electricity cost, and project cost. The wallpaper module is not yet part of the visitor-facing UI.
- No production code, calculator logic, images, article URLs, affiliate links, editorial freeze, generated Pages output, or workflow was changed in this pass.

## Why the implementation is left to Claude
This is not a simple markup insertion. It changes the primary calculator's multi-tab interaction model, room collection, per-room rounding presentation, product comparison, and project-budget state. The integration needs exact-head local Node and Playwright execution plus privacy inspection. The available GitHub connection can read and commit source, but it does not provide a local browser runtime for me to reproduce the full regression suite. I have therefore not committed unexecuted UI code or claimed tests that were not run.

## Required integration boundary
Implement inside the existing `website/home-project-calculator.html` flagship calculator. Do not create a duplicate standalone wallpaper calculator and do not change the existing five tools' behaviour. Add a clearly named sixth tab/panel (or a compact, accessible nested module within the existing project panel only if the tab system cannot be safely extended). Keep the flagship calculator's existing tab keyboard/ARIA contract.

Load the existing `website/wallpaper-calculator-engine.js` and `website/project-estimator-engine.js` locally, with deterministic script order, before the integration adapter. Do not duplicate their arithmetic in DOM handlers.

## Calculation contract (must be preserved)
1. Multiple rooms; each room has its own label, wall height, trim allowance, and list of individual wall widths.
2. Every dimension in a calculation uses one selected unit. Use the engine's own input validation.
3. Product data must be entered from the exact package/product label: usable roll width, usable length per sale unit, and exact sale-unit label (single roll, double roll, package, panel set, etc.). Never assume a standard US roll size or package count.
4. Support only `free`, `random`, and `straight` matches. Straight match requires the positive vertical repeat from the label. For half-drop, offset, murals/panels, unknown, or irregular patterns, show the engine's unsupported message and do not return a quantity.
5. The engine rounds strips up per wall and sale units up per room. Do not pool leftovers between walls or rooms; explain this assumption.
6. Doors/windows are not deducted by default. Do not introduce generic waste percentages on top of the explicit trim allowance.
7. Price is optional and manually entered only. Blank price must remain `null`, not zero. When a price is supplied, require a 3-letter uppercase ISO 4217 currency code.
8. Use `toProjectBudgetLineItem` to map a successful result to the existing project estimator. Preserve `price: null` for unknown price. Never fabricate a price range or mark an unknown price as zero.
9. Project Estimator Engine 1.0.2 requires estimate currency to match budget currency and line-item price unit to match the wallpaper sale-unit label. If currencies differ, block the adapter action and explain why; never silently convert.
10. Product comparison must use the same room measurements. Show quantity comparison only when measurement units match; show cost comparison only when both prices exist and currencies match.

## Privacy requirements
- No room names, measurements, prices, budget values, or product label data in URL/query/hash, analytics, console logs, network requests, localStorage, sessionStorage, or cookies.
- Existing site page-view analytics may remain; do not attach calculator field values to analytics events.
- Print/export, if implemented, must be client-side and must not transmit entered data.

## Required UI behaviour
- Add/remove rooms and add/remove walls with stable labels and accessible names.
- Each room can be edited independently.
- Show per-room wall strip counts, drops per sale unit, sale units per room, and overall sale-unit total. Explain that each room is rounded separately.
- Show cost only when a user-entered price and valid currency exist; otherwise label cost as unknown/not entered.
- Add a successful estimate to the existing Project Cost/Estimator workflow without losing current line items or resetting other calculator tabs.
- Keep unsupported match choices visible but disabled or clearly explained; do not silently map them to free/random.
- Results/errors announced via `aria-live` and `role=alert`; all fields labelled; keyboard operation; 44px touch targets; mobile without horizontal overflow; focus returns sensibly after add/remove.
- Link to the existing wallpaper planning guide and display assumptions/limitations adjacent to results.

## Exact tests required before merge
### Node
- Run `scripts/test_wallpaper_calculator_engine.js`.
- Run `scripts/test_wallpaper_project_estimator_integration.js` against the exact current estimator engine.
- Run the existing Project Estimator and flagship calculator Node suites.
- Add adapter/UI-state tests for null prices, currency mismatch, duplicate IDs, adding multiple rooms, remove/edit, and no mutation of existing budget lines.

### Chromium/Playwright
- Run existing `scripts/qa_browser_home_calculator.py` plus new wallpaper integration browser tests.
- Viewports: 320, 360, 390, 412, 768, 1280; portrait and landscape where relevant.
- Test tab keyboard/ARIA, room and wall add/remove, invalid inputs, all supported/unsupported match types, multiple-room separate rounding, two-product comparison, add-to-budget, dark/light, focus, result announcements, and no horizontal overflow.
- Capture and inspect screenshots; automated checks alone are not visual sign-off.

### Privacy
- Capture all requests, console messages, storage keys and URL changes while entering representative room names, dimensions, product details and prices. Assert no values leak.

## Files likely in scope
- `website/home-project-calculator.html` — UI and adapter loading.
- `website/article-overrides.css` or a dedicated existing calculator stylesheet — scoped presentation only, if required.
- `scripts/test_...` — focused Node tests.
- `scripts/qa_browser_...` — focused Chromium suite.
- This handoff and Claude's engineering record.

Do not touch shared operations logs while #245/#247 remain open. Do not touch `.github/workflows/`, Awin links, `.editorial-freeze`, article URLs, images, or generated index/sitemap files.

## Completion evidence to append
Record exact PR number, exact head SHA, exact commands, pass/fail counts, viewport coverage, privacy request/storage findings, screenshots inspected, Pages run ID, and live verification. Do not claim Safari, Firefox, screen-reader or real-device testing unless actually run.
