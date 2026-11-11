# HomeProjectWise Budget-First Home Project Estimator
## Product, data, trust, SEO/CAO and delivery specification

**Status:** Strategic specification / draft for review  
**Version:** 1.0 — 2026-11-03  
**Initial market:** United States (USD, ZIP Code)  
**Planned expansion:** United Kingdom, Canada, then EU countries individually  
**Operating rule:** Value Before Publishing v1.0 is mandatory. This document authorizes planning and review only. It does not authorize protected-route implementation, merging, deployment or publication.

## 1. Executive decision

Build a **Budget-First Home Project Estimator**, not a collection of disconnected quantity calculators.

**User promise:** Understand what a home project may cost in your area, see what your budget can realistically cover, compare practical alternatives, and understand where every estimate comes from and what it excludes.

The tool must support three situations:

1. **I do not know prices.** Show defensible low/high planning ranges only where licensed, dated and geographically appropriate data exists.
2. **I know some prices.** Let users enter or override material, labor, delivery, tax, permit and other costs without silently replacing their values.
3. **I have a fixed budget.** Model what can fit, what cannot, what scope changes may help, and the trade-offs.

The differentiator is not an unsupported claim that we are cheaper or more accurate than competitors. It is a demonstrably better decision workflow: **budget feasibility + transparent line-item ranges + user control + provenance + explicit uncertainty**.

### Non-negotiable principles

- Never invent, extrapolate or silently fill missing prices.
- Never label a dated estimate or national benchmark as a live local price.
- Never imply a retailer listing is a complete installed-project cost.
- Never call a number a quote, bid or guarantee unless it actually is one.
- Preserve source, market, geographic resolution, unit, currency, observation/update date, license and methodology for every external datum.
- Display uncertainty and exclusions before users rely on the total.
- Keep user-entered values distinguishable from sourced values.
- Do not create thin ZIP/city pages or mass-generated SEO pages.
- No release unless the Value Before Publishing score is at least 85/100 and all critical trust/safety gates pass.

## 2. User problems and jobs-to-be-done

| Situation | User question | Required outcome |
|---|---|---|
| Early exploration | What might this project cost? | A range with assumptions, location and source quality |
| Price novice | I do not know material or labor prices | Guided estimate with visible, editable defaults |
| Budget constrained | I have $X; what can I do? | Feasibility scenarios, scope options, shortfall/surplus |
| Price informed | I already have supplier/contractor prices | Manual entry/override and recalculation |
| Comparing options | Is option A worth the extra cost? | Comparable scenarios with consistent scope and trade-offs |
| Preparing for quotes | What should I ask contractors? | Scope/quantity worksheet and quote-comparison checklist |
| Planning purchases | How much material should I buy? | Quantity, waste allowance and package rounding |

Target homeowners and renters undertaking appropriate projects, DIY planners and people preparing to request contractor quotes. Do not encourage unqualified users to perform hazardous, regulated or code-controlled work.

## 3. Product experience

### Step 1 — Market and location

Initial US experience:
- Country fixed to United States in MVP; USD and US customary units by default, with metric input/display where useful.
- ZIP Code input with validation. Do not require precise GPS or full street address.
- Resolve ZIP to a supported geographic area only through an approved provider.
- Show the actual resolution: ZIP, metro/county, state or national.
- If a source cannot support ZIP-level pricing, say so. Never imply ZIP precision from a national average.
- Do not retain ZIP, budget or project details beyond the active session unless the user explicitly opts into a save feature.

### Step 2 — Select a project

Start with a small number of repeatable, testable templates:
1. Interior painting.
2. Flooring replacement.
3. Drywall repair/installation.
4. Bathroom refresh, strictly scoped and clearly distinguished from a full remodel.

Launch only templates whose formulas, assumptions, price coverage and safety notes pass validation. If only two are ready, launch two.

Every template defines scope/exclusions, required dimensions, takeoff formula and units, waste assumptions, labor model (only if supported), permit questions, safety/professional-help triggers, valid input ranges and errors.

### Step 3 — Pricing modes

**A. Guided market estimate**
- Prefill only supported line items.
- Show low/high ranges, not false-precision single values.
- Separate materials, labor, equipment, delivery, disposal, permits, tax and contingency.
- Explain inclusions/exclusions and link each sourced value to source details.
- Missing line items remain “Not estimated” or user-editable; never silently become $0.

**B. Enter my own prices**
- Editable unit price for each line item.
- Editable labor rate/hours or direct labor allowance.
- Optional delivery, disposal, permit, tax and other costs.
- Mark each override “Your input” and preserve it during recalculation.
- Reset-to-source action must warn if it overwrites user values.
- Allow mixed mode: some sourced estimates, some user inputs.

**C. Plan around my budget**
- User enters total budget and optional reserve/contingency.
- User marks scope priorities: must-have, preferred, optional.
- Show feasible scope and compare alternatives.
- Never claim feasibility based only on materials when labor, permits or other critical costs are missing.
- Return “insufficient data to assess” when unknown costs could materially change the result.

### Step 4 — Results

Show:
1. Estimated total range, explicitly labeled planning estimate, not a quote.
2. Materials subtotal and itemized takeoff.
3. Labor subtotal only when a valid labor model/source exists.
4. Other costs as separate lines.
5. Included/excluded list.
6. Budget status: likely within budget; may fit (range overlaps); likely over budget; cannot assess.
7. Remaining amount or shortfall as a range where inputs are ranges.
8. Scope/finish alternatives with cost effect and trade-offs.
9. Assumptions and uncertainty.
10. Source ledger: source/type, geography, units, observation/update date, retrieval date, license/disclosure and methodology.
11. Next-step checklist: verify measurements, confirm site conditions, request comparable quotes and check local permits/code.

Do not present one plan as objectively best unless user priorities and constraints support that conclusion.

## 4. Estimation engine

### Core model

Use a deterministic, independently testable engine, separate from UI, providers and market configuration.

- Quantity = measured scope × documented takeoff factor.
- Purchase quantity = round up to verified package/unit size where available.
- Material range = purchase quantity × unit price range.
- Labor range = supported hours/productivity × local labor rate range.
- Delivery, rental, disposal, permits, tax and contingency remain explicit line items.
- Project low/high = sum compatible low/high line-item bounds plus explicitly modeled fees/taxes.

Preserve dimensional units. Do not mix square feet/meters, gallons/liters, linear feet/meters or hourly/per-project rates without explicit conversion.

### Waste and rounding

Waste factors must be material/project-specific, visible and editable where appropriate. No universal waste percentage. If package size is unknown, show theoretical quantity and mark purchase quantity unavailable.

### Range and uncertainty

- Calculate low/high scenarios consistently; do not create artificial precision by multiplying rounded averages.
- Do not imply independent statistical variables unless the model supports that assumption.
- Do not call a range a statistical confidence interval unless its sample design and calculation justify that term.
- Use “planning range” or “scenario range” where appropriate.
- Distinguish known cost, sourced estimate, derived estimate, unknown and excluded. Unknown is never zero.

### Budget feasibility

Account for required items and user-selected reserve. If a critical component is unknown and could change feasibility, return “cannot assess reliably.” Show the reason and what information is needed.

### Savings options

Potential options: reduce area/scope, phase optional work, compare equivalent material grades, retain suitable existing components only where safe, or user-selected DIY labor where appropriate. Never recommend skipping permits, licensed trades, waterproofing, ventilation, structural work or safety measures.

Every option states what changes, savings range or “not quantified,” quality/durability/time/maintenance trade-offs, and professional/local-code caveats.

## 5. Pricing data architecture and source policy

### Provider-neutral architecture

The calculation engine must never call a retailer API directly. Use a provider adapter and normalized observations.

**PriceObservation fields**
- normalized item ID, market ID, geography ID and geography resolution
- currency, unit, package size
- low/high price or observed price
- price type: live retailer listing, licensed cost database, contractor quote sample, government benchmark, editorial reference or user input
- source ID/reference, observed/retrieved/effective/expiry dates
- tax/shipping/installation inclusion flags
- availability if provided
- license/redistribution permission
- sample size/methodology where applicable
- confidence class and quality flags

**SourceRegistry**
- provider/dataset, authorized use/license, caching/retention terms, attribution requirements
- update cadence/SLA, supported markets/geographies/categories
- limitations and contract/contact reference

**MarketConfig**
- country/market, currency, locale, supported units
- postal validation/geocoding provider and geographic hierarchy
- tax model, approved sources, expiry rules, legal/safety references

**EstimateSnapshot**
- inputs/units, market/geography resolution, source observation IDs, formula/model version
- result ranges and unknowns, timestamp
- optional session/local identifier

### Source hierarchy

Subject to licensing, prefer:
1. Licensed local project-cost dataset with unit breakdown and geographic modifiers.
2. Authorized current retailer feed for exact purchasable materials and local availability where supported.
3. Anonymized recent contractor quote sample with documented market, scope, sample size and selection.
4. Government wage/producer-price indices for context/trends only, not direct homeowner quotes.
5. Researched editorial ranges cross-checked against independent credible sources with date/market/scope.
6. User-entered values.

Do not average fundamentally different data types into one opaque number. Retail shelf price is not installed contractor price.

### US source candidates — research only, not approved integrations

- **Craftsman National Estimator Cloud API:** public documentation describes licensed datasets and US/Canada area modifiers. Production access requires a paid license; sandbox is demo data and must never appear as live prices. Obtain written pricing, coverage, update cadence, redistribution/display and caching terms before selection.  
  https://craftsman-book.com/data-licensing  
  https://intercom.help/craftsman/en/articles/9791025-getting-started-national-estimator-cloud-nec-api
- **Home Depot project calculators/catalog:** competitor and product-reference research. Do not assume an unrestricted public price API. Any feed requires documented authorization.  
  https://www.homedepot.com/c/project_calculators
- **Lowe's calculators/catalog:** useful material-takeoff UX and product research. No scraping or unsupported endpoints; feed access requires authorization.  
  https://www.lowes.com/diy-projects-and-ideas
- **US Bureau of Labor Statistics:** occupational wages and producer-price series can provide context/trends, not direct local contractor quotes.
- **US Census construction spending:** macro activity data, not local homeowner project prices.  
  https://www.census.gov/construction/c30/data/index.html
- **Fixr and Homewyse:** competitor/methodology cross-checks only; do not copy their data. Their published caveats illustrate the importance of scope, geography and labor assumptions.  
  https://www.fixr.com/info/methodology  
  https://www.homewyse.com/reference/how_accurate_are_homewyse_estimates.html

### Live-price wording

Use “current retailer listing” only when fetched through an authorized source, timestamped, geography/store coverage is real, product/unit/pack match, and cache complies with provider terms.

Never call labor ranges, national cost guides, government indices, old editorial estimates or sandbox records “real-time prices.”

Preferred labels:
- Retailer listing — retrieved [date/time]
- Regional planning range — updated [date]
- Government benchmark — period [period], not a quote
- Your entered price
- Price unavailable

Each source/category needs its own maximum age. When stale, stop presenting it as current; label/suppress it. Fallback only to a permitted and useful broader/older reference, explicitly labeled. Monitor provider failures and schema changes.

**No scraping:** no retailer-page scraping, bot-control bypass, reverse-engineering private APIs, copying competitor databases or violating terms. If licensed feeds are unaffordable, launch fewer templates with transparent researched ranges.

## 6. International market design

Design for multiple markets, but enable only markets with real source coverage and QA.

| Phase | Market | Localization | Critical considerations |
|---|---|---|---|
| 1 | US | USD, ZIP, ft/in and sq ft | State/local taxes, permits, geography coverage |
| 2 | UK | GBP, postcode, metric-first | VAT, regional labor/materials, UK standards |
| 3 | Canada | CAD, postal code, metric and customary | Provincial/territorial tax, climate and regional labor |
| 4 | EU, country by country | EUR where applicable; local currency otherwise | Language, tax, units, permits, labor and source differences |

The EU is not one construction-cost market. Each country requires its own configuration and localization. Currency conversion is not local pricing. Use currency-safe decimal/minor-unit arithmetic. If tax rules are not validated, keep tax as user input or “not included.” Postal code does not guarantee local labor-price precision.

## 7. Competition and fair differentiation

This is a feature-level benchmark, not a claim about competitors' full products, traffic, conversions or estimate accuracy.

| Competitor | Publicly visible strength | HomeProjectWise opportunity |
|---|---|---|
| Home Depot | Broad material quantity calculators and shopping-oriented project support | Connect quantities to whole-project budgets and explicit labor/other-cost uncertainty |
| Lowe's | Material calculators, project planning and visualization | Budget-first scenarios across multiple suppliers and user-entered prices |
| Homewyse | ZIP-based estimates, lower/higher labor ranges and unit-cost methodology | Make assumptions, provenance, unknown costs and feasibility easier to understand |
| Fixr | Cost guides, calculator, methodology and expert-reviewed content | Editable estimate, budget trade-offs and line-item audit trail |
| Angi | Cost ranges informed by homeowner/pro data and local project context | Useful planning without requiring contact details or lead submission |

References:
- https://www.homedepot.com/c/project_calculators
- https://www.lowes.com/diy-projects-and-ideas
- https://www.homewyse.com/reference/how_accurate_are_homewyse_estimates.html
- https://www.fixr.com/info/methodology
- https://intercom.help/angi/en/articles/17748678-how-angi-estimated-cost-ranges-work

### Ethical differentiation

- Do not copy competitor calculators, text, formulas, illustrations, datasets or proprietary UX.
- Benchmark publicly visible user problems; build our own workflow and calculations.
- Do not claim “better than Angi/Homewyse” without reproducible matched-scope, matched-market, matched-date testing.
- Do not imply contractor endorsement or expert review unless a qualified reviewer actually did it.
- Disclose affiliate links near recommendations. Commission must not alter estimate values or product ranking.
- Never fabricate reviews, quote samples, contractor networks, first-hand experience or proprietary data.

Defensible advantage should grow from an auditable cost model, price provenance/history, budget-to-scope engine, consented estimate-vs-actual feedback, reusable localized configuration and tested templates. Do not claim proprietary data until permissioned observations exist at meaningful scale.

## 8. SEO strategy

### One canonical tool page

Maintain one crawlable canonical estimator landing page for the initial US product. It must contain useful visible explanation and a functional tool, not a blank JavaScript shell.

Intent themes to map against Search Console:
- home project cost estimator
- home renovation budget calculator
- home improvement cost calculator
- estimate project cost by ZIP code (only if ZIP-level coverage truly exists)
- what can I do with my home improvement budget
- material and labor cost estimate

Use Search Console and intent evidence, not invented search volumes. Avoid multiple pages targeting the same intent.

### Supporting pages only when distinct

Create project-specific guides only when they solve a distinct task and offer original value. Each should explain method/exclusions, provide sourced or clearly illustrative examples, and link naturally to the tool. No mass city/ZIP pages. A location page requires unique reliable local data and useful context beyond replacing a place name.

### Technical SEO

- Server-render/static-render meaningful title, headings, introduction, methodology summary and useful answers.
- Ensure search engines can understand the page without executing complex client-only flows.
- Semantic HTML, descriptive labels, keyboard operation, visible focus and accessible result announcements.
- One canonical URL; avoid indexing query-string permutations and private estimate states.
- No personal estimate data in URLs, analytics or logs.
- Crawlable internal links from relevant guides and tools hub.
- Add the canonical page to generated indexes/sitemap through the existing repository pipeline; never hand-edit generated sitemap/index files.
- Validate status, canonical, robots, sitemap, mobile rendering, performance and no-JS fallback.
- Do not use misleading structured data. WebApplication/SoftwareApplication only if the visible product genuinely qualifies and properties are accurate. BreadcrumbList only for visible breadcrumbs. Do not promise FAQ rich results.
- Keep visible methodology consistent with metadata and structured data.

### Measurement

Track impressions, clicks, CTR, position, organic entrances, calculator start/completion, mode selection, estimate generated, budget result type, source-detail opens, overrides, scenario comparisons, errors and abandonment. Only collect privacy-approved aggregate events. Do not optimize for starts alone: success means a useful estimate or an actionable explanation of why one cannot yet be produced.

## 9. CAO: answer-ready and citable information

CAO means making the product and its supporting information understandable and citeable by answer engines while preserving accuracy and source traceability. It is not keyword stuffing or manufacturing AI mentions.

### Questions answered visibly

- What does the estimator calculate?
- Which projects are supported?
- How are prices estimated?
- How does ZIP Code affect the result?
- Are prices live or planning ranges?
- Are labor and materials separate?
- What happens when a price is unknown?
- Can users enter their own prices?
- Can it show what fits a budget?
- Are tax, permits, delivery and disposal included?
- Is the result a contractor quote?
- How often are prices updated?
- What must be verified before work begins?

### Citation-ready methodology

Publish formula/model version, source register/categories, observation/update dates, geography resolution, units/conversions, range construction, limitations, sample sizes, exclusions, missing-data behavior, correction process and affiliate disclosures.

Every material numerical claim must trace to a source record or formula. Distinguish our calculations from external source facts.

### Answer assets per template

Create a direct answer, scope/unit definitions, transparent worked example (clearly illustrative or sourced), cost-component table, variables, exclusions, practical checklist and citations. Illustrative values must never appear as current market prices.

### CAO measurement

Use a fixed benchmark of questions, engines and dates. Record citation/link/paraphrase/absence, correctness and target page. Compare snapshots and disclose sample limitations. Do not claim universal AI visibility based on a few prompts or treat unlinked brand mentions as referrals. Extend the existing 40-question AI citation matrix with calculator questions; do not replace the broader benchmark.

## 10. Trust, safety, privacy and disclosure

### User-facing disclaimer

“This is a planning estimate, not a contractor quote or guarantee. Actual costs can change with site conditions, measurements, material availability, labor rates, local requirements and project scope. Verify measurements, current prices, permits and qualified-trade requirements before purchasing or starting work.”

Place contextual notices near totals, not only in a distant legal page.

### High-risk work

For electrical, gas, structural, roofing at height, major plumbing, asbestos, lead paint, mold remediation, fire protection and other regulated/hazardous work:
- Identify when professional assessment/licensed trades may be required.
- Do not provide unsafe DIY instructions or estimate hazardous remediation from generic inputs.
- Direct users to qualified inspection/quotes where hidden conditions materially affect cost.
- Local code/permit details must be jurisdiction-specific and sourced.

### Privacy and commercial transparency

- ZIP Code is location data; collect only what is needed.
- No account required for basic estimate.
- Do not send budget, ZIP, dimensions or free text to analytics unless privacy-reviewed and approved.
- No personal estimate values in URLs/referrers.
- Document retention/deletion/consent before cloud save/history.
- Keep a session-only path.
- Label affiliate/sponsored links. Separate estimate from shopping links. Do not imply stock/availability unless provider returns it with timestamp/geography.

## 11. Accessibility, performance and UX

- Mobile-first, usable at narrow widths.
- Labels associated with every input; errors announced accessibly.
- Full keyboard navigation and visible focus.
- Result updates announced without unexpectedly moving focus.
- Units beside values; currency never ambiguous.
- Zero accepted only where valid; empty required fields rejected; invalid/negative values rejected where inappropriate.
- Preserve inputs when changing modes or editing line items.
- Clear loading, no-data, stale-data, source-failure and calculation-error states.
- Missing prices never create misleading zero totals.
- Print-friendly estimate with sources, assumptions, date and disclaimer.
- Progressive disclosure for advanced inputs.
- Fast initial render; avoid heavy third-party scripts.

## 12. Roadmap and release gates

### Phase 0 — Audit and freeze (planning only)
Reconcile current calculator PR #229 and current head/status; inspect actual main branch, calculator, generator, TOOLS registry and QA. Keep the 5 November Search Console/editorial freeze intact. Confirm templates and behavior; obtain provider sample terms/pricing; baseline user/competitor benchmark.
**Exit:** reviewed spec, no production changes, owner approval.

### Phase 1 — Trustworthy calculation core (no live external pricing)
Template schema, deterministic engine, units, validation, manual entry/override, range arithmetic, unknown state, line-item ledger, budget scenarios, unit tests and fixtures.
**Exit:** independently reproducible calculations; missing price never becomes zero.

### Phase 2 — US sourced planning ranges
Select licensed source only after terms/cost review. Import only covered categories/geographies. Add registry, dates, geography resolution and freshness. Separate regional planning ranges from retailer listings.
**Exit:** every external value has provenance and permission; coverage honestly described.

### Phase 3 — Retail listings (optional)
Only authorized feeds. Exact SKU, pack size, location/store coverage, availability, price and timestamp. Cache per contract. Product price remains separate from installed cost.
**Exit:** terms/legal review and data QA; no scraping.

### Phase 4 — Public launch of validated US templates
Tool page, methodology, internal links, accessibility, SEO checks and novice usability tests. Compare estimates to real quotes/receipts only where consent and scope matching allow.
**Exit:** score ≥85, hard gates pass, explicit owner approval.

### Phase 5 — Improve from evidence
Review query/page data at agreed five-day cadence, usage/error patterns and estimate-vs-actual feedback. Prioritize real gaps, not page count.

### Phase 6 — UK, Canada and EU
Enable one market at a time after local source rights, tax/rules, units, language, QA and safety review.

## 13. Acceptance criteria

### Critical hard gates (any failure blocks release)

- No fabricated prices, quotes, sources, samples or live-data claims.
- No unlicensed data or scraping.
- No missing critical price treated as zero.
- No market/currency/unit mixing.
- No false ZIP precision.
- No unsafe savings advice.
- No protected-route changes/deployment without owner approval.
- No private estimate data in URLs or analytics.
- Outputs match independently verified fixtures.

### Weighted score (minimum 85/100)

| Area | Weight | Evidence |
|---|---:|---|
| User value/task completion | 20 | Novice testing; useful plan; budget task solved |
| Calculation correctness | 20 | Independent fixtures, units, range, rounding and boundary tests |
| Price evidence/transparency | 20 | Source, license, geography, timestamp, exclusions, stale tests |
| Budget decisions/differentiation | 15 | Meaningful scenarios, trade-offs, unknown handling |
| SEO/CAO | 10 | Crawlable page, methodology, internal links, answer benchmark |
| Accessibility/privacy/performance | 10 | Keyboard/screen reader, privacy review, mobile performance |
| Maintainability/operations | 5 | Provider adapter, monitoring, failure behavior, documentation |
| **Total** | **100** | **Minimum 85 and every hard gate** |

### Required test matrix

Empty required field vs explicit zero; negative/malformed/extreme/decimal inputs; unit conversion; package rounding/waste; range propagation/missing data; tax inclusion/unknown; delivery/permit/disposal/contingency; override persistence/reset; invalid/unsupported/ambiguous ZIP and broad fallback; stale feed/outage/schema change/duplicate/spike; currency boundaries; budget lower/upper/overlap; screen reader/keyboard/zoom/mobile; print/export sources and disclaimer; no private estimate data in analytics/URL/logs.

## 14. Metrics

**North-star quality metric:** useful estimate completion rate — sessions producing a valid transparent estimate or actionable “cannot estimate yet” explanation without critical errors.

Also track completion by template/mode, source coverage, unresolved critical costs, overrides, budget scenarios, usefulness feedback, estimate-to-quote variance (where comparable/consented), feed freshness/errors, relevant organic impressions/clicks, CAO benchmark results and privacy-compliant return usage.

Pageviews, template count and indexed URL count are not product success.

## 15. Implementation handoff for Claude

This is a design proposal, not permission to change protected code. Claude must inspect the current repository and calculator implementation before choosing paths.

Suggested logical modules:
- Market configuration: currencies, units, postal validation, tax and geography.
- Project templates: scope, inputs, formulas, required items and safety.
- Pure calculation engine.
- Pricing provider interface and source registry.
- Budget scenario engine.
- Estimate presentation/source ledger/print view.
- Privacy-reviewed aggregate telemetry.

Architecture rules:
- Pure, testable calculation logic.
- Inject market and providers; no US assumptions embedded in formulas.
- Immutable/versioned source observations.
- Decimal/minor-unit-safe money arithmetic.
- Explicit unknown, not-included, user-input, stale and unavailable states; never overload numeric zero.
- Formula/model version in every saved/exported estimate.
- No API keys in client code.
- Server-side provider access, rate limits, contract-compliant caching and monitoring.
- Avoid unjustified dependencies.
- Respect existing generated-page/index pipeline.

### Claude's first tasks after approval

1. Audit current calculator PR #229 and current head/status; do not rely on the 2026-11-03 snapshot.
2. Inspect main, calculator code, page generator, TOOLS registry, QA and protected-route freeze.
3. Produce a code-mapped plan and identify existing acceptance coverage.
4. Propose the smallest Phase 1 slice; no paid/live pricing integration yet.
5. Add tests before behavior changes.
6. Submit a draft PR describing problem, benefit, differentiation and tests.
7. Do not merge, deploy, publish, edit homepage/route templates or protected pages without explicit owner approval.

### Responsibility split

**ChatGPT:** product requirements, source/market research, competitor/search intent, CAO question benchmark, provenance policy, acceptance criteria and independent PR review. Do not ask Claude to repeat this research.

**Claude:** repository/code inspection, implementation, tests, accessibility/performance code checks, CI and technical risk analysis.

## 16. Decisions still required before Phase 2

1. Which US cost-data license is viable after written quote and redistribution/display terms?
2. Which two or three templates best combine demand, formula reliability and source coverage?
3. Does the selected source support ZIP modifiers or only broader metro/state modifiers?
4. Will initial estimates include labor, or show an explicit labor-unavailable state for some templates?
5. What are provider-specific freshness and caching rules?
6. Which privacy-safe events are supported by current GoatCounter setup?
7. Who can qualify to review high-risk scopes and local code caveats?

Record each decision with evidence, cost, owner and date. Do not guess.

## 17. Research references

- Google Search Central — people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Essentials: https://developers.google.com/search/docs/essentials
- Craftsman data licensing: https://craftsman-book.com/data-licensing
- Craftsman NEC API: https://intercom.help/craftsman/en/articles/9791025-getting-started-national-estimator-cloud-nec-api
- Home Depot project calculators: https://www.homedepot.com/c/project_calculators
- Lowe's DIY/calculators: https://www.lowes.com/diy-projects-and-ideas
- Fixr methodology: https://www.fixr.com/info/methodology
- Homewyse estimate accuracy: https://www.homewyse.com/reference/how_accurate_are_homewyse_estimates.html
- Angi range methodology: https://intercom.help/angi/en/articles/17748678-how-angi-estimated-cost-ranges-work
- US Census construction spending: https://www.census.gov/construction/c30/data/index.html

Public webpages establish what organizations publicly describe, not our entitlement to their datasets/APIs. No vendor integration, quote, partnership, API access or data license has been secured by this document.

## 18. Value Before Publishing review

**Problem:** Homeowners cannot reliably translate dimensions, uncertain prices and a fixed budget into a practical project plan.  
**New benefit:** Guided, editable, source-traceable estimates with budget feasibility and scope alternatives.  
**Why choose us:** Connect quantities, materials, labor/other costs, user overrides, budget scenarios and uncertainty in one transparent workflow instead of only quantity calculators or opaque headline averages.  
**How tested:** Deterministic fixtures, provenance audits, geography/freshness tests, novice usability, accessibility and valid quote/receipt comparisons.  
**Current status:** Strategy/specification only. No new functionality is claimed to exist. No external pricing integration is approved. No release is authorized.

**Release decision:** Not eligible until Phases 1–4 evidence is complete, score is at least 85/100, every hard gate passes and the owner explicitly approves.
