# Phase 1 calculation engine — implementation note

**Status:** isolated draft implementation on top of calculator integration PR #229; not merged or deployed.

## What this slice delivers

- A pure calculation module independent of the page DOM, network, and pricing providers.
- Itemized cost lines with explicit units, required/optional state, and excluded lines.
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

Each estimate has one ISO 4217 currency code and an explicit contingency percentage. Each line item has a unique ID, name, unit, non-negative quantity, and one of:

- User-entered price: kind user-input, amount, currency.
- Regional/editorial/government price range: low, high, currency, source.
- Retailer listing: one observed price, source includes retrieval date and product/SKU.
- Null price for unknown, or excluded true for intentionally excluded work.

The engine refuses mixed currencies, malformed amounts, reversed ranges, and external prices without provenance. It cannot independently verify a provider license; production integration must validate license and freshness in a separate approved source registry/provider layer.

## Verification

Run node scripts/test_project_estimator_engine.js. Tests cover range arithmetic, cents, contingency, required vs optional unknowns, exclusions, budget status, reserve, currency mismatch, missing provenance and retailer-listing semantics.

The existing page and its tests remain unchanged. Before UI integration, add browser-level tests for novice flow, manual overrides, keyboard/screen-reader behavior, responsive layout and stale/failed source states.
