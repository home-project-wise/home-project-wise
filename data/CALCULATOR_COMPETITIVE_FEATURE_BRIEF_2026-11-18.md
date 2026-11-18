# Calculator product opportunity — Room-to-Ready Project Plan
**Prepared by:** ChatGPT, product research and calculation/data owner  
**Date:** 2026-11-18  
**Status:** Product proposal and implementation brief; not authorization to change calculator code or publish.

## Executive recommendation

Do not compete by adding another isolated calculator. HomeProjectWise already has a connected room entry and six calculator tabs: Area & volume, Paint, Flooring & materials, Electricity cost, Project cost, and Wallpaper. The strongest next differentiator is to turn their outputs into one **Room-to-Ready Project Plan**: a single, honest view of what the homeowner intends to do in one room, what the materials may cost, what is confirmed, and what is still unknown.

The promise:

> **Measure once. Plan the whole room. Know what is included—and what is not—before you buy.**

This is a workflow advantage, not a seventh calculator. It should connect the tools the visitor already used rather than make them repeat dimensions or re-enter the same figures.

## Why this is a better competitive move

A quick competitor scan on 2026-11-18 shows a crowded market for standalone calculators:
- HomeImprovementGeek lists separate paint, flooring, area, trim and electricity calculators, with formula/worked-example transparency: https://homeimprovementgeek.com/calculators/
- DIYdigits advertises 102 calculators across 15 categories: https://diydigits.com/calculators
- DIYGauge promotes 65 calculators and a live SVG project preview: https://diygauge.com/
- PlanCalq promotes 20 calculators that reuse a saved “My Project”: https://plancalq.com/tools/
- Homewyse focuses on large catalogues of installation cost estimates and labour/material breakdowns: https://homewyse.com/projects/index.html

Implication: adding more calculator tabs alone is unlikely to create a defensible difference. Shared measurements and connected project planning are already appearing elsewhere, so our advantage must be the quality of the combined decision: **source-aware estimates, clear unknowns, protection against double counting, and a useful whole-room budget in one flow.**

This is a directional scan, not a claim that these are the only competitors or a complete feature audit.

## The proposed visitor experience

### 1. Start with one room and one market
Reuse the existing shared-room inputs and selected market. Do not add a second country selector or ask for dimensions again.

### 2. Choose the work planned for that room
For the first release, keep the choices deliberately simple:
- Floor: choose one supported flooring/material estimate.
- Walls: choose **paint or wallpaper** for the same wall area, not both by default.
- Electricity: show appliance running cost separately as a recurring operating estimate, never silently add it to one-time renovation material spend.
- Other items: let the visitor add their own line items in the existing Project cost/list flow.

### 3. Collect the results into one project basket
Each result becomes a line item with a clear evidence/status type:
- **Reference estimate** — a source-backed low/high range, market, currency, basis and checked/source date.
- **Your price** — a visitor-entered quote or exact product price, which takes precedence over the reference estimate and is not blended with it.
- **Needs a price / not estimated** — an unknown cost that remains visible and is never treated as zero.
- **Excluded from this total** — a clear list of scope exclusions such as labour, delivery, tools, preparation, tax where unverified, or recurring energy cost.

### 4. Show an honest whole-room summary
The summary should show:
- A low–high **known material subtotal** in the selected market's currency.
- How many items have a source-backed range, a user-confirmed price, or no price yet.
- A visible **budget completeness** statement, e.g. “3 of 5 planned items have prices; 2 still need quotes.” Do not invent a numeric confidence score.
- What the total does not include.
- Links to the assumptions/sources behind reference estimates.

The product must not imply that the known subtotal is the final project cost when some planned items are unpriced.

## Critical calculation and product rules

1. **No double counting:** paint and wallpaper are mutually exclusive for the same wall surface in the first release. If the visitor wants different finishes on different walls, that requires explicit wall-area allocation in a later phase; never add both full-wall estimates.
2. **Separate one-time and recurring costs:** electricity running cost is a monthly/usage estimate, not a renovation material purchase. Display it in a separate “ongoing running cost” section.
3. **No false zeros:** unknown price, unavailable market data, missing product coverage, or unpriced labour must remain unknown—not zero.
4. **Preserve source matching:** use only the exact selected market, correct currency, eligible record and permitted estimate scope. No FX conversion or cross-market fallback.
5. **Preserve manual override:** an exact visitor-entered product price/specification or supplier quote replaces the reference estimate for that item; do not combine the two.
6. **No hidden allowances:** waste, contingency, tax, labour and delivery are separate, disclosed inputs or exclusions—not silently embedded.
7. **No unsupported purchase counts:** a per-area cost range does not prove pack, tin, roll or package count. Respect each calculator's current eligibility contract.
8. **Privacy:** preserve the static/browser-only calculation contract. No server-side storage or transmission of room measurements/prices.
9. **Currency:** all one-time items in a project must share the selected market/currency. If a line item cannot be matched, show it as unpriced rather than convert it.

## Suggested staged delivery

### Stage A — Product contract and small integration (recommended first)
- Reuse the current shared-room, selected-market, calculator-result and project-list data paths where possible.
- Add a single project summary/basket view; do not redesign every calculator.
- Add explicit finish selection so paint and wallpaper cannot both consume the same wall area.
- Keep electricity running cost separate from one-time project materials.
- Surface estimate provenance and missing-price count.
- Keep existing standalone calculator tabs working.

### Stage B — Scenario comparison (after Stage A is proven)
Let the visitor compare “Do the essentials now” with “Complete the room” using the same room and the same line items. Only visitor-selected items and supported estimates may change. No AI-generated quantities or fabricated prices. This can help people decide what to defer without pretending to know what every project costs.

### Stage C — Work sequence (only after source-backed review)
Offer a short, editable sequence of project stages (for example, dusty/hidden work before final finishes) only where reliable trade guidance supports it. Do not launch generic sequencing rules that could be unsafe or wrong for a particular property.

## MVP acceptance criteria

- A visitor enters the room and market once; no calculator asks for them again in the beginner flow.
- A flooring estimate and exactly one wall-finish estimate can be added to the same room plan.
- Electricity usage cost is visible but excluded from the one-time materials subtotal.
- Each line item visibly identifies reference estimate, visitor price, or unpriced status.
- Missing costs are counted and never treated as zero.
- The summary shows a low–high known subtotal and explicitly warns when the planned budget is incomplete.
- Paint and wallpaper cannot both be applied to the full same wall area without an explicit split.
- Market/currency mismatch blocks inclusion in the subtotal; no FX conversion.
- Manual exact price overrides reference data for that line item.
- Existing privacy behavior and all standalone calculator tests remain intact.
- Mobile layout makes the subtotal, incomplete items and exclusions easy to understand without horizontal scrolling.

## Ownership and handoff

**ChatGPT owns this brief and the product/calculation/data contract:** competitor scan, evidence rules, line-item semantics, calculation review, source freshness, acceptance examples and QA of the estimate logic.

**Claude owns implementation:** inspect existing shared-room and project-list architecture; propose the smallest isolated UI/engine/test change; preserve the active Wallpaper PR #413 and do not edit overlapping files while it is open.

**Sequence:** do not interrupt or duplicate Claude's current #413 wallpaper work. Once #413 is merged and verified, Claude can review this brief and estimate Stage A as a separate implementation PR. This document alone does not authorize production deployment or a broader product-scope change.

## Decisions deliberately not made here

- No new material price assumptions or market values are introduced.
- No labour or contractor pricing is invented.
- No automatic waste/contingency percentage is introduced.
- No room-plan persistence or server storage is proposed.
- No numeric “confidence score” is proposed; use factual completeness counts instead.
