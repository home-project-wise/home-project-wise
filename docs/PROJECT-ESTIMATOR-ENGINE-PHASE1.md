# Phase 1 calculation engine — implementation note

**Status:** isolated draft implementation on top of calculator integration PR #229; not merged or deployed.

## What this slice delivers

- A pure calculation module independent of the page DOM, network, and pricing providers.
- Itemized cost lines with explicit units, required/optional state, and excluded lines; a required line cannot be excluded (the visitor must explicitly reclassify it as optional first).
- User-entered single prices and externally sourced low/high ranges as different data types.
- Mandatory provenance for external prices: source ID/name, geography, geography resolution, observation date; retailer listings also require retrieval date and product/SKU and are restricted to one observed price.
- Integer minor-unit money arithmetic, one currency per estimate, explicit contingency, and budget feasibility.
- Required unknown costs produce cannot-assess; they are never interpreted as zero.
- Optional unknown costs are disclosed and flagged in the budget explanation.

## Deliberate non-goals

- No external price API, retailer integration, ZIP lookup, tax automation, or claims of live pricing.
- No changes to the calculator page, tool registry, generated hubs, sitemap, homepage, or protected routes.
- No UI integration in this slice. The engine is a tested foundation; it does not claim that the visitor-facing budget-first workflow is already available.
- No automatic savings advice or scope optimization yet.

## Data contract

Each estimate has one uppercase three-letter currency code and an explicit contingency percentage. The engine checks the code format and enforces one consistent code per estimate; it does **not** verify that the code is an assigned ISO 4217 currency. The market configuration/provider layer must validate the supported currency before any user-facing market estimate is enabled (USD for the initial US market; add GBP, CAD and the applicable country currencies only with their approved market configurations). Each line item has a unique ID, name, unit, non-negative quantity, and a price whose unit must exactly match the line item's unit. A mismatch is rejected rather than silently converting unlike quantities. The price is one of:

- User-entered price: kind user-input, amount, currency.
- Regional/editorial/government price range: low, high, currency, source.
- Retailer listing: one observed price, source includes retrieval date and product/SKU.
- Null price for unknown, or excluded true for intentionally excluded work.

The engine refuses mixed currency codes, malformed amounts, reversed ranges, external prices without provenance, and attempts to exclude a required line item. A syntactically valid but unassigned code (for example `ZZZ`) is not rejected by this isolated engine; currency membership must be validated by the market configuration layer. It cannot independently verify a provider license; production integration must validate license and freshness in a separate approved source registry/provider layer.

## Verification

Run node scripts/test_project_estimator_engine.js. Tests cover range arithmetic, cents, contingency, required vs optional unknowns, required-line exclusion rejection, budget status, reserve, currency mismatch, missing provenance and retailer-listing semantics. The missing-price test verifies `unknownRequired` and `cannot-assess` rather than treating a missing price as zero.

The existing page and its tests remain unchanged. Before UI integration, add browser-level tests for novice flow, manual overrides, keyboard/screen-reader behavior, responsive layout and stale/failed source states.


## ChatGPT independent review (3 Nov 2026)

- Re-ran `node scripts/test_project_estimator_engine.js` on the updated branch: **all assertions passed**.
- Found and fixed a correctness gap: a line marked required could previously also be marked excluded, allowing the estimate to appear assessable without a required cost. The engine now rejects that contradictory state; a regression assertion covers it.
- Corrected the currency claim: the engine validates three-uppercase-letter format and currency consistency, not ISO 4217 membership. The market/provider layer must validate supported currencies before UI integration.
- No UI, market price provider, ZIP lookup, tax automation, or production change was made.

## Changes in 1.0.1 (review of 2026-11-03, patch by Claude)

- Unit prices are stored with 4 decimals and multiplied by the quantity before rounding to cents. A unit price with more than 4 decimals is rejected, never silently rounded. Example: 0.285 per ft x 1000 ft is 285.00.
- An estimate with no priced line (only optional unknown or excluded lines) gives `canAssessRequiredScope: false` and `assessBudget` returns `cannot-assess` with the reason "No line item has a price yet". `pricedLineCount` is added to the estimate.
- `assessBudget` accepts only the result of `calculateEstimate` (shape check), so a hand-built object cannot skip the required-cost check.
- `observedAt` and `retrievedAt` must be ISO 8601 and not in the future (one day of tolerance). `calculateEstimate(input, { now })` takes an injectable clock; the default is the current time.
- In a `cannot-assess` result, the partial totals are named `pricedTotalLow` / `pricedTotalHigh`: they exclude the unknown required costs and must never be shown as the project total.
