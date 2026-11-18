# Room-to-Ready — independent QA contract scenarios
Date: 2026-11-18
Owner: ChatGPT (product/data contract and independent QA)
Tracks: #415; product brief in `data/CALCULATOR_COMPETITIVE_FEATURE_BRIEF_2026-11-18.md`

## Purpose

This is an implementation-neutral test contract for Stage A. It defines expected user-visible semantics and arithmetic boundaries; it does not prescribe Claude's architecture or UI. Use it when reviewing the implementation PR. Keep the existing calculator suites green.

## Canonical room fixture

- Unit: metres
- Length: 15
- Width: 8
- Wall height: 4
- Openings: 6 m²
- Gross wall area: 2 × (15 + 8) × 4 = 184 m²
- Net wall area: 184 − 6 = 178 m²

The fixture is a geometry check only. It does not establish wallpaper roll yield, paint coverage, flooring waste, labour or a total renovation quote.

## Required scenarios

| ID | Scenario / setup | Expected result |
|---|---|---|
| RR-01 | Enter the canonical room once and select one supported market. Open the plan and its flooring, paint and wallpaper paths. | Room dimensions and market are reused; no duplicate country or room prompt. |
| RR-02 | Add one supported flooring estimate. | The plan carries the calculator's existing estimate and its exact unit, market and evidence status; it does not invent pack count or waste. |
| RR-03 | Add Paint as the wall finish. | Paint occupies the wall-finish slot. The same wall area cannot also be charged as wallpaper. |
| RR-04 | Switch wall finish from Paint to Wallpaper. | Wallpaper replaces Paint for the same wall scope; no double charge. Any prior user-entered Paint price is retained only if the product supports a clearly separate inactive/draft choice, never silently added. |
| RR-05 | Attempt to add Paint and Wallpaper simultaneously for the same room walls. | Block the duplicate or require an explicit scope distinction; never include both against the same full wall area by default. |
| RR-06 | A source-backed item has low/high values and a matching market/currency. | Show the range and provenance; include it once in the known material subtotal. |
| RR-07 | A required line item has no eligible price. | Show “needs a price/quote” (or equivalent), count it as unpriced, and exclude it from arithmetic without presenting it as free or zero-cost. |
| RR-08 | One priced item and one unpriced item are in the basket. | Show the known subtotal separately and state clearly that the full project budget is incomplete. |
| RR-09 | Visitor enters their own confirmed price for an item that also has a reference range. | Visitor price takes precedence for that line; do not add it to the reference range or blend the two. Preserve the reference as comparison context only if clearly labelled. |
| RR-10 | Visitor-entered price has a different currency from the selected market. | Do not convert, silently relabel or include it in a mixed-currency subtotal. Ask for a matching currency or keep it visibly excluded pending correction. |
| RR-11 | Reference data exists for another country but not the selected country. | Do not fall back to another market, apply FX, or imply local applicability. Mark the item unpriced. |
| RR-12 | Electricity calculator returns an estimated recurring usage cost. | Display it in a separate recurring-cost section; exclude it from one-time renovation material subtotal. Do not multiply it into a project purchase total. |
| RR-13 | Labour, delivery, tools, preparation, tax or adhesive has no supported price. | Show as excluded/not priced where relevant; do not silently add a percentage or assume zero means included. |
| RR-14 | Wallpaper area estimate is based on the canonical room. | If the wallpaper reference adapter is used, the area basis is 178 m² net and the estimate is only the approved per-area material sample range. Never infer rolls, strips, package count, pattern, trim or waste. |
| RR-15 | A user changes room dimensions after adding estimates. | Recalculate dependent area-based estimates from the new shared room; no stale result remains in the basket. Preserve manually entered fixed quotes as user prices unless the user changes them. |
| RR-16 | A user changes the selected market. | Re-resolve only against eligible records for the newly selected market and currency. Remove or mark incompatible prior reference values; never carry the old market's price forward. |
| RR-17 | A line item is unavailable or excluded by its evidence contract. | It cannot enter the known subtotal, even if a raw/legacy record exists in a file. Eligibility scope and source contract govern. |
| RR-18 | Reload or revisit the page. | No project details are transmitted to a remote service or persisted unexpectedly. Preserve the existing browser-only/no-network/no-persistence contract unless the owner separately authorizes a change. |
| RR-19 | Empty optional openings field in the shared-room fixture. | Existing shared-room behaviour remains consistent: blank optional openings are treated according to the established calculator contract, not newly guessed by the project-plan layer. |
| RR-20 | Existing standalone calculator is used without opening Room-to-Ready. | Its prior inputs, outputs, validation and advanced paths remain unchanged; Stage A must not regress standalone workflows. |

## Arithmetic and presentation invariants

1. The known material subtotal is the sum of eligible, mutually compatible, one-time material line items only.
2. A source-backed range remains a range: low subtotal is the sum of eligible lows and high subtotal the sum of eligible highs. Do not collapse it to an average or point estimate.
3. User-confirmed prices are included only when their currency and scope are compatible with the subtotal. They replace, rather than supplement, the reference estimate for the same line.
4. Unpriced, excluded, recurring and incompatible-currency items are not included in the one-time known material subtotal.
5. If any required project cost is unpriced or excluded, the interface must not label the known subtotal as the complete project cost.
6. No implicit waste, contingency, tax, labour, delivery, tool, adhesive, package coverage, roll yield, FX or market fallback assumptions.
7. The room's shared dimensions and selected market are the single source of truth for this plan. Do not create a second competing copy of either.

## Review evidence expected from the implementation PR

- Automated tests for RR-01 through RR-20, or a documented mapping explaining which existing test covers each invariant.
- At least one end-to-end scenario showing the canonical room and the 178 m² net wall result.
- Tests proving Paint/Wallpaper mutual exclusion, unknown-cost handling, manual-price precedence, currency mismatch, market mismatch, and electricity separation.
- Mobile viewport verification and keyboard/focus review for the plan controls.
- Confirmation that existing standalone calculator suites still pass.
- Confirmation that no workflow, deployment, persistence or network behaviour was changed.

## Explicit non-goals for Stage A

No multi-room aggregation, shopping recommendations, contractor quote comparison, work-sequencing advice, scenario optimiser, automatic package/roll count, or new price research is part of this QA contract. These remain separate roadmap candidates.


## Additional independent edge scenarios (ChatGPT review, 2026-11-18)

These extend RR-01–RR-20 after reviewing the current calculator implementation and Claude's Stage A architecture proposal.

| ID | Scenario / setup | Expected result |
|---|---|---|
| RR-21 | Add paint through the existing pack/tin path, then select wallpaper for the same room walls. | The plan's single wall-finish slot replaces the active finish; the earlier paint line/price is not still counted. |
| RR-22 | Enter room length and width but leave wall height blank, then request a wall-finish estimate. | The wall estimate remains unavailable / needs wall height. It must not become 0 m² or a priced zero. |
| RR-23 | Change the shared room unit from metres to feet after estimates are present. | All area-derived lines are recomputed from the canonical room values and market; no stale or mixed-unit area remains. |
| RR-24 | Enter a fixed user-confirmed quote, then change room dimensions. | The fixed quote remains the same user-entered amount; area-derived reference estimates recalculate. The quote is not silently multiplied by the new area. |
| RR-25 | Use only the keyboard to choose or switch the wall-finish slot and observe the subtotal. | The control is operable without a pointer, has visible focus, and the changed subtotal/status is announced to assistive technology. |
| RR-26 | Build a plan, reload the page, and return to the Project cost tab. | Stage A in-memory intent is cleared; no stale line-item snapshots are restored from browser storage or a remote service. |

## Additional arithmetic and state invariants

8. The wall-finish selection is a single-valued state (paint, wallpaper, or none) for the same wall area. Existing paint pack/tin lines cannot coexist with a wallpaper area estimate for that same scope.
9. Missing required geometry (especially wall height) is an unknown input state, not a numeric zero.
10. A fixed user-entered quote is not an area-derived estimate; dimension changes must not scale it unless the user explicitly edits the quote.
11. Unit changes must normalize the room once and recalculate every dependent estimate from the same canonical room state.
12. Stage A project intent is in-memory only. Reload clears it; no persistence mechanism may be introduced by the implementation.
