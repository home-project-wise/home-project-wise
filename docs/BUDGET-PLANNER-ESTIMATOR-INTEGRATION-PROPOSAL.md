# Budget Planner + Project Estimator Engine — Integration Proposal

**Prepared:** 2026-11-06  
**Status:** Design proposal only; not implementation approval  
**Canonical page:** `website/budget-planner.html`  
**Engine:** `website/project-estimator-engine.js` from PR #234 (stacked on #232)  
**Governing rule:** Value Before Publishing; accuracy, privacy, accessibility and verified visitor value before release.

## 1. Decision: extend the existing Budget Planner

Do not create a second general-purpose budget estimator page.

The existing Budget Planner already owns the visitor's budget-first journey: select a project template, enter item quantities and prices, set Must have / Nice to have / Later priorities, and see totals plus a buying order. The new engine should strengthen this same journey, not split visitors across competing tools.

The broader Home Project Calculator (#229) remains a separate set of quantity/utility tools (area/volume, paint, flooring, electricity). Its simple project-cost function should link to the canonical Budget Planner rather than become a second budget-feasibility product. The bathroom fan calculator (#236) remains a specialist airflow/duct tool.

## 2. Existing-page audit: two correctness/privacy issues to resolve first

### 2.1 Personal plan data currently enters the URL

The current page's `enc()` serializes the selected template, budget, currency, item names, priorities, quantities and unit prices into a base64 query parameter named `s`. `calc()` writes it into the address bar with `history.replaceState`, and “Copy a link to this plan” copies that URL.

Base64 is encoding, not encryption. Anyone receiving the URL can decode the plan, and the values may be retained in browser history, copied links, screenshots, referrer-bearing contexts or logs. This conflicts with the estimator's privacy requirement that budgets, quantities and prices must not be placed in URLs or analytics.

**Required before engine integration:** remove automatic URL serialization and remove the share-link behavior that carries plan data. The URL must remain the canonical page URL regardless of entered values. Do not replace this with another encoded query/hash scheme.

A safe no-account MVP can offer an explicitly user-initiated local export (for example, a downloaded JSON/text file) and/or a locally generated printable summary. No server storage, external API, analytics payload or third-party request should receive the entered values. Explain clearly that a downloaded file is stored wherever the visitor chooses. Any future save/restore feature must be opt-in and local-only unless the owner approves a separately reviewed privacy architecture.

### 2.2 Missing prices are currently treated as zero

The existing `summarize()` calculates an unpriced line as zero and then includes it in priority totals and budget comparison; the result copy explicitly says missing items “count as zero”. That can make a project look affordable when required costs are unknown.

**Required before engine integration:** no unknown required item may silently contribute zero to a feasibility verdict. Use the engine's `cannot-assess` outcome for unknown required costs. Unknown optional costs must be visibly listed as excluded from the current priced total, not hidden or described as free.

## 3. Mapping the existing planner to the engine

| Existing planner concept | Engine representation | Required UI/data rule |
|---|---|---|
| Item name | `lineItems[].name` | Non-empty; keep existing safe text rendering |
| Quantity | `lineItems[].quantity` | Finite, non-negative number; reject blank rather than coercing to zero |
| Unit | `lineItems[].unit` | Add an explicit unit field (e.g. each, gallon, sq ft, linear ft, bag); do not infer or silently convert units |
| Price each | `price.kind = "user-input"`, `amount`, `currency`, `unit` | Blank means unknown; zero is allowed only when the visitor explicitly enters zero |
| Must have | `required: true` | An unknown required price blocks a complete feasibility assessment |
| Nice to have | `required: false` | Include when priced; disclose when unknown |
| Later / only if needed | `required: false` | Keep visible as a deferred priority; do not silently erase it |
| Removed / not selected | `excluded: true` | Only optional items may be excluded; the engine rejects required + excluded |
| Budget | `assessBudget()` budget object | Currency must match the estimate currency |
| Currency selector | ISO currency code | Label explicitly (USD, GBP, EUR); no currency conversion |

The engine accepts an explicit unit on every line. The current page has only a generic quantity and price-each input, so adding a unit field is a correctness requirement, not cosmetic complexity. No automatic unit conversion is proposed for Phase 1.

### 3.1 Preserve the three priority views

The existing page shows Must-have, Must-have + Nice-to-have, and Everything totals, then a buying order. Preserve this mental model by calculating separate scenario estimates with the same engine:

1. **Essentials:** Must-have lines included; Nice-to-have and Later lines excluded from this scenario.
2. **Essentials + improvements:** Must-have and Nice-to-have included; Later excluded.
3. **Full selected plan:** all non-excluded lines included.

For each scenario, call `calculateEstimate()` and then `assessBudget()` on that exact returned object in the same page session. Do not serialize the estimate and pass it back later: PR #234 uses a private WeakMap identity check, so a JSON round-trip, spread copy, clone or proxy is not a valid estimate object. Recalculate from the user's input state whenever the page needs to refresh a scenario.

Display the estimate range only when the input prices are ranges from a separately approved source layer. In the manual-price MVP, the low/high values will be equal because the visitor supplied one price. Keep unknown required and optional items visible with their distinct meanings.

### 3.2 Currency handling

The engine validates a three-uppercase-letter format and currency consistency, but it does not establish that a code is an assigned ISO 4217 currency. The UI/market configuration must therefore whitelist the currencies it actually supports. For the current selector, map the explicitly labelled choices to USD, GBP and EUR; do not infer CAD from an ambiguous “$”. CAD and additional EU-country currencies should be added only with explicit country/currency configuration. No exchange-rate conversion is part of this proposal.

## 4. Phased implementation

### Phase 0 — privacy and behavior corrections

- Remove `?s=` plan serialization and automatic `history.replaceState` updates.
- Remove the URL-sharing link; replace only with a clearly explained local export/print action if implementation and QA can keep all values on-device.
- Change missing-price semantics: unknown is not zero.
- Add explicit unit inputs and stable line-item IDs.
- Preserve templates, priority labels, guide links and buying order.
- Document exactly what is stored locally, exported or transmitted; target is no network transmission of visitor-entered plan values.

### Phase 1 — integrate the tested calculation engine

- Add the engine script to the existing Budget Planner page only.
- Map each planner row to a validated engine line item.
- Calculate the three priority scenarios above.
- Keep `calculateEstimate` and `assessBudget` calls in one runtime and one page session.
- Render `cannot-assess` prominently when any required item is unknown; never turn unknown required costs into zero.
- Preserve manual prices as the only price source in this phase. No live price claim, ZIP lookup, retailer API, scraping or external price feed.
- Keep tax, permits, labour and other extras as separate explicit rows where relevant; do not imply they are included unless entered.

### Phase 2 — only after separate source/licence approval

A guided market-price mode is a later project, not part of this integration. It requires an approved source registry with source identity, licence, geography and resolution, observation/retrieval dates, freshness policy, method and clear distinction between retail material prices and installed project costs. Do not enable external price objects merely because the engine supports their data shape.

The United States remains the first market. UK, Canada and EU expansion must be country-by-country, with currency and source coverage verified before claims are shown.

## 5. Acceptance and test plan

### Calculation and regression tests

- Required unknown price => `cannot-assess`; no missing required cost is treated as zero.
- Optional unknown price => disclosed; does not falsely appear as a free purchase.
- Explicit user-entered zero is distinct from blank.
- Unit mismatch is rejected; no implicit conversion.
- Four-decimal unit-price precision is preserved before quantity multiplication.
- Required + excluded is rejected.
- All three priority scenarios produce correct independent totals and budget verdicts.
- Currency mismatch and unsupported currency codes are rejected by the UI configuration.
- Empty, negative, non-finite, text, over-limit and malformed inputs produce clear validation messages.
- Existing buying-order behavior remains deterministic and correctly prioritises Must, Nice, Later.

### Privacy tests

- Enter a unique test budget, quantity and price; assert that `location.href`, query string and hash never change.
- Inspect all network requests while editing, calculating, exporting and printing; no user-entered values may be sent.
- Ensure analytics events, page titles, error messages and console logs do not include budgets, quantities, prices, item names or other plan data.
- Ensure local export is initiated only by the visitor and is generated in-browser.

### Browser/accessibility tests

- Real browser tests at desktop and mobile widths.
- Keyboard-only operation, visible focus, labels, error association and result announcements.
- Screen-reader review of validation, unknown-cost and budget-result states.
- Dark-mode contrast and layout.
- Test reload behavior: no plan data is restored from the URL. Explain that an exported file is the user's chosen backup mechanism if implemented.

## 6. Release gates

This proposal does not authorize implementation on a protected route, merge, deployment or publication.

Before release:
- All relevant Node and browser tests pass on the exact PR head.
- Privacy checks prove that plan values stay out of URLs, analytics and network requests.
- The tool remains usable for a novice and communicates unknowns honestly.
- The existing Budget Planner journey is preserved and improved rather than duplicated.
- The page and integration meet the Value Before Publishing threshold (85/100) and all hard gates.
- The owner reviews the evidence and explicitly approves release.

## 7. Explicit non-goals

- No second general budget-estimator page.
- No live prices, national averages, ZIP/city price claims or retailer scraping.
- No paid API, subscription, database or infrastructure; project spend remains $0 until the first actual payout.
- No claim of local installed-cost accuracy.
- No publication or AI-citation benchmark against a draft.
- No edits to Awin links, workflows, crawler settings, homepage or route templates.

**Recommended next implementation slice:** Phase 0 plus a small Phase 1 adapter behind the existing Budget Planner, on a dedicated branch, after the owner reviews this proposal and the current #234/#237 review state.