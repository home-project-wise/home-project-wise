# HomeProjectWise calculator — reference-price data contract

**Version:** 1.0  
**Date:** 2026-11-14  
**Prepared by:** ChatGPT — production/data handoff  
**Recipient:** Claude — Calculator Owner  
**Inputs reviewed:** `docs/CALCULATOR-REFERENCE-PRICES-BRIEF-2026-11-14.md`, manager's technical/data review on PR #341, current `website/project-estimator-engine.js`, current `website/home-project-calculator.html`, and candidate `data/reference_prices.json` on branch `data/us-reference-price-observations-2026-11-14`.

## 1. Purpose and non-goals

The calculator is a **rough budget-planning aid** for people who know the work they want to do but do not know material prices. It should help answer: “Is my available budget likely to be enough?” It is not a quote, tender, bill of quantities, contractor estimate or guarantee of final cost.

Keep the existing manual path. Users who know their prices must be able to enter them or enter two quotes. A reference price is only a starting point and must be replaceable by the user's local price.

This contract defines the boundary between research/data ownership and engineering implementation. **ChatGPT owns research, source verification, data-quality analysis, price-record corrections and maintenance of `data/reference_prices.json`. Claude, Calculator Owner, owns calculator code, UI, adapters, engineering tests and technical implementation.** ChatGPT must not edit Claude-owned calculator files; Claude must not research, invent, alter or independently maintain price values. Either agent must return issues in its own lane to the other through the official operations room. The owner has delegated routine, necessary merges to ChatGPT when the change is fully reviewed, all required checks pass, the diff is within the assigned scope and no unresolved owner decision or material risk remains. Production price data is not merged until its sources, values, coverage and limitations have been audited.

## 2. Source-of-truth and release gate

Candidate dataset:
- File: `data/reference_prices.json`
- Branch: `data/us-reference-price-observations-2026-11-14`
- PR: https://github.com/home-project-wise/home-project-wise/pull/341
- Head at review: `4adf6c1d47cedb1f3a3db263b6cfeb734130f8f1`
- Candidate count: 193 records (US 114, UK 12, Canada 24, Germany 9, France 9, Spain 8, Italy 8, Netherlands 9).

**Release gate:** PR #341 is open and unmerged at the time this contract was prepared. The calculator must not load data from an unmerged feature branch, copy prices into code, or present these records as live/default prices until the data PR has passed ChatGPT's source/data audit, required CI, and has been merged to `main`. ChatGPT owns the research/data audit and any necessary corrections to the dataset. Claude consumes only the merged, reviewed dataset; he does not maintain price values. PR #340 (source memo) is supporting research, not a runtime data source.

## 3. Record types and eligibility

The dataset currently contains:
- 72 `government-benchmark`
- 64 `editorial-range`
- 57 `retailer-listing`
- No `regional-range` records in this snapshot.

Use `kind` to decide what a record means. Never flatten all records into one category price.

### 3.1 `editorial-range` — primary material reference

Use this kind for the default approximate LOW–HIGH material price where the selected record matches the visitor's country, material subtype, currency and unit basis.

These are selected retailer/catalogue samples, not national statistical averages. Display the actual low–high values and the source/sample caveat. Do not call them “national average”, “market average” or “typical national price”.

Some records describe a sample median only inside `notes`. **Do not parse prose or infer a median from notes. Do not use (low + high) / 2 as a median.** Version 1.0 uses the explicit low–high range only. If a future single “planning figure” is required, the data owner must add a structured numeric field with its method and sample provenance in a separately reviewed data change.

### 3.2 `government-benchmark` — official electricity reference

Use for electricity only when the exact jurisdiction and tariff/statistical scope match. A record with equal low/high is a single benchmark point, not a market range. A record with different low/high values is a stated tariff/period range, not a weighted household average.

Display the source period, geography, consumption band/plan and the energy-only or tax-inclusion status. Do not add standing/basic charges unless the calculator has the correct billing period and a separate, explicit fixed-charge calculation.

### 3.3 `retailer-listing` — one product, not a category price

Never select an individual SKU as the automatic default for a whole material category. Never average SKU rows together with an `editorial-range` row. A listing can be shown only as a clearly identified individual product example, with its SKU/model and exact source.

There are four non-US listing rows in this snapshot without a top-level `productOrSku` value (France laminate, Spain paint, Germany solid hardwood, Netherlands sheet vinyl). They do not satisfy the current engine's retailer-listing validation and must be excluded from any engine payload until the data owner supplies the missing identifier. Do not invent one.

For the 53 US listing rows, `productOrSku` is at the **top level** of the JSON record, while the current engine expects it inside `price.source.productOrSku`. The loader must map it explicitly; do not change the JSON as part of calculator work.

### 3.4 Unknown or unsupported

If no eligible record matches, return “No reference range yet; enter your own price or two quotes.” Do not substitute another country, currency, subtype, SKU or unrelated product class. Do not interpolate, extrapolate or fabricate a range.

## 4. Record selection key and precedence

Select exactly one record for each line item, using this composite key:

`audience/country + jurisdiction (when relevant) + category + exact item subtype + currency + compatible unit + eligible kind`.

Selection rules:
1. Match the visitor's selected country first. The “US-first” audience grouping is a product/audience priority, **not permission to show US prices in Canada or the UK**.
2. For flooring, match the exact subtype: laminate, LVP/SPC, sheet vinyl, broadloom carpet, carpet tile, engineered hardwood, solid hardwood, ceramic tile or porcelain tile. Do not treat all flooring as interchangeable.
3. Prefer a matching `editorial-range` for material estimates. If more than one record could match, do not average them; apply an explicit deterministic choice (the most directly comparable subtype/unit and freshest valid observation) or show no reference until the owner/data maintainer resolves the ambiguity.
4. Use `government-benchmark` for electricity only.
5. Use `retailer-listing` only for an explicitly selected matching product, never as the generic category default.
6. Preserve `source.geography`, `source.geographyResolution`, `observedAt`, `retrievedAt`, publisher, URL, notes and caveats alongside the selected record for attribution and audit.

`reviewStatus: researched` is a research state, not by itself an approval-to-publish flag. The dataset must be merged and its eligibility reviewed before production use.

## 5. Country and jurisdiction rules

### United States
- Material references are USD samples; local store/ZIP availability and price can differ.
- Electricity: select the matching EIA state record (50 states + DC are present). The US national record is a fallback only when no state can be identified, and must be labelled national.

### Canada
- Currency is CAD. Do not show one Canada-wide electricity price.
- Match the province/territory and utility/geography. The 13 records have differing scopes: some are named utility tariffs, Ontario time-of-use, Quebec/BC tiered tariffs, Yukon hydro-grid only, and NWT selected communities.
- Do not apply NWT selected-community values to all NWT residents or Yukon hydro-grid values to diesel communities.
- Exclude the Nunavut 74.94¢/kWh record from the default estimate: its source still states an effective date of 1 Oct 2023 and its subsidy threshold materially changes the amount households pay. It may only be shown as a dated “last published tariff” with the subsidy caveat after an explicit location/eligibility match and owner approval.

### United Kingdom
- GB (England, Scotland, Wales) Ofgem and Northern Ireland Power NI are separate. Never combine them or describe Ofgem's price cap as UK-wide.
- GB Ofgem is a Direct Debit price-cap unit-rate benchmark for 1 Oct–31 Dec 2026, with a separate standing charge.
- NI is one named Power NI payment/online-billing tariff, not an NI-wide average.

### Europe
- Germany, France, Spain, Italy and the Netherlands each have their own country record.
- Electricity values use the same Eurostat H1 2026 household consumption band (2,500–4,999 kWh/year), including taxes and levies. Label this as a harmonised national benchmark, not an individual supplier tariff.
- Never convert EUR to GBP, CAD or USD to fill missing data.

## 6. Unit and package normalization

The current estimator engine requires the price unit to equal the line-item unit. The loader/adapter must normalize prices before calling it; never pass a numerically similar but dimensionally different unit.

### Area
- Exact conversion: 1 m² = 10.7639104167 sq ft; 1 sq ft = 0.09290304 m².
- Flooring source prices are per sq ft (US/Canada) or per m² (UK/Europe). The current material calculator asks for **coverage per pack** and returns a pack count.
- Convert the reference unit price to the visitor's measurement basis, then calculate package price range:
  - reference price per area × entered coverage per pack = reference price per pack;
  - pass the resulting low/high price per pack with the same currency and unit as the project-list line item.
- Do not assume pack coverage. Use the value the visitor entered from the product label. Keep the waste allowance in the quantity calculation; do not silently bake waste into the unit price.

### Paint
- Dataset units differ: US per US gallon, UK/EU per litre, Canada per 3.79 L can.
- The current Paint calculator prices a **tin/can** and asks for coverage per tin; it does not currently capture tin volume. A per-gallon or per-litre source price cannot safely be multiplied by a tin count without knowing the tin volume.
- Therefore, do not auto-apply paint references until the UI/adapter has the exact package volume (or a validated coverage-per-volume basis) for the user's selected can. For Canada, the 3.79 L can reference can only match a 3.79 L can. For US/UK/EU, convert by volume only after the can volume is known.
- If package volume is not known, show the reference price per gallon/litre for information only and ask for the user's actual price per tin/can; do not calculate a package total from it.

### Wallpaper
- The wallpaper engine prices a sale unit (roll, double roll or package) and needs the exact sale-unit label, usable width/length, coverage and pattern information.
- Dataset wallpaper records mix per-roll, per-m² and per-sq-ft-covered units; some dimensions/coverage are only prose in `notes`, not structured fields. Do not parse notes or assume a standard roll size or that “roll” always means the same package.
- Until structured package dimensions/coverage and sale-unit compatibility are available, do not auto-inject wallpaper reference prices into the wallpaper sale-unit calculation. Keep the user's own price/two quotes path. A matching record may be shown as context only with its exact basis and caveat.

### Electricity
- Electricity unit is kWh. Use exact jurisdictional record and its tariff/statistical context. The current appliance calculator multiplies kWh by a unit rate; fixed daily/monthly charges are outside that calculation unless separately modelled with a known billing period.

### Currency
- Currency must be the three-letter ISO code expected by the estimator (`USD`, `CAD`, `GBP`, `EUR`), not just a display symbol.
- Never perform foreign-exchange conversion. Use the selected country's currency and format it consistently.
- Do not rely on a bare “$” symbol to distinguish USD from CAD.

## 7. Engine adapter contract

The current `website/project-estimator-engine.js` accepts external kinds `regional-range`, `retailer-listing`, `editorial-range` and `government-benchmark`. It requires:
- exact currency match between estimate and price;
- exact unit match between line item and price;
- finite non-negative low/high values, with low ≤ high;
- source id, name, geography, geographyResolution and observedAt;
- additionally for `retailer-listing`: low = high, retrievedAt and productOrSku.

Adapter requirements:
1. Keep the complete raw JSON record in a read-only reference registry so the UI can display publisher, clickable source URL, retrieval date, notes and caveats. The engine currently returns only a reduced source object; do not lose the full attribution by relying only on the engine result.
2. Build the engine payload from the selected record. Map top-level `productOrSku` to `price.source.productOrSku` for eligible retailer listings.
3. Do not read a median from `notes`, and do not synthesize a reference value.
4. Do not modify the engine's validation contract or calculator-owned files outside Claude's implementation.
5. Do not fetch remote prices at runtime. Use the merged, reviewed local data file; no tracking, storage or transmission of user measurements/prices is introduced by this feature.
6. Preserve the existing user-input and user-range paths. A user-entered price or two quotes override the reference; never blend them with the reference range.

## 8. Result and budget semantics

- When a supported reference exists, show **Approximate material price: LOW–HIGH per [unit/package]**, currency, source name, geography, observed date and a concise caveat.
- Use the same low/high range for total material cost. Do not display a central “likely” amount unless a structured reference value and method are explicitly approved in the data.
- If a single official electricity benchmark has low = high, label it “reference benchmark”, not a range.
- A user-entered actual price or two quotes take precedence over the reference.
- The existing engine marks the estimate incomplete if required or optional line items remain unpriced. Preserve this: show a partial total and list what is excluded.
- If a required cost is unknown, budget assessment must say it cannot assess whether the full required scope fits the budget. If only optional costs are unknown, say the comparison covers required/priced items only.
- Contingency applies only to priced line items under the current engine; disclose that unknown costs are not covered by contingency.
- Keep material prices separate from labour, installation, delivery, preparation, underlay, adhesive, grout, trim, removal and other costs unless a separate supported line item is added.

## 9. Required user-facing disclaimer

Use clear language near the estimate, not only in a footnote:

> This is a rough planning estimate to help you judge whether your budget may be enough. It is not a quote or a final cost. Prices vary by location, store, brand, quality, product size, availability and date. Labour, installation, delivery, preparation, taxes and other extras may not be included. For a more accurate estimate, replace the reference price with a local store price or two quotes.

For electricity, add the tariff-specific note (energy-only, time-of-use/tier threshold, standing charge or tax status as applicable).

## 10. Data coverage and known limitations

Candidate catalogue totals:
- US: 114 (52 electricity, 53 individual listings, 9 editorial ranges).
- UK: 12.
- Canada: 24 (including 13 electricity records with materially different scopes).
- Germany: 9; France: 9; Spain: 8; Italy: 8; Netherlands: 9.
- Total: 193.

Current categories are electricity, paint, flooring and wallpaper. This is not a complete project-material catalogue. Do not imply that drywall, lumber, insulation, roofing, trim, fasteners, adhesives, grout, underlay or labour are covered.

Known constraints that must remain visible:
- Material bands are selected samples, not nationally representative surveys.
- UK tile ranges are very wide and include premium/clearance listings; do not silently replace them with medians from notes.
- Some flooring samples mix adjacent constructions or promotional prices; subtype match and caveat are mandatory.
- Canadian electricity records are tariff/provider/community scoped; Nunavut is stale-dated and excluded by default.
- Wallpaper units and roll sizes are not yet machine-normalized.
- Paint pack volume is not currently captured by the Paint tab.
- Four non-US retailer listings lack a product/SKU identifier required by the engine.

## 11. Acceptance tests required before enabling references

Claude should add tests for at least these cases:

1. US state electricity selects that state's EIA record; national fallback is labelled and never silently substituted.
2. GB and Northern Ireland select separate electricity records and never share a tariff.
3. Canada Ontario TOU, Quebec Rate D, BC Hydro, Yukon, NWT and Nunavut scope rules are respected; Nunavut is excluded by default.
4. EU country electricity uses the same Eurostat H1 2026 consumption band and labels taxes/levies included.
5. US flooring price per sq ft converts correctly to a pack price when pack coverage is entered in sq ft or m².
6. UK/EU flooring price per m² converts correctly to a pack price when pack coverage is entered in m² or sq ft.
7. Flooring subtype mismatch (e.g. ceramic vs porcelain, broadloom vs carpet tile, sheet vinyl vs LVP) returns no reference rather than a substitute.
8. Paint reference is not multiplied by tins unless package volume is known and compatible.
9. Wallpaper reference is not used for sale-unit costing when roll/package coverage is unknown or incompatible.
10. A retailer SKU never becomes a category default; four non-US SKU-less listing rows are rejected by the adapter.
11. No median is parsed from notes; no midpoint is labelled as a median.
12. A missing country/category match prompts the user for a price or two quotes; no FX conversion or cross-country fallback occurs.
13. User input and two user quotes override a selected reference without mixing values.
14. Unknown required costs block a full-scope budget verdict; optional unknowns remain disclosed.
15. The source name, publisher, URL, observed date, retrieval date and caveat remain visible/clickable.
16. Records older than 12 months (measured from `observedAt`, not merely `retrievedAt`) are labelled “older data”; do not treat a recent retrieval date as a recent price observation.
17. No network call or persistence of user-entered measurements/prices is introduced.

## 12. Handoff and ownership

**To ChatGPT — research/data owner:** complete the source-by-source audit of all candidate records; correct any verifiable source URL, product identifier, value, unit, date, geography, caveat or classification issue in `data/reference_prices.json`; reject or quarantine records that cannot be substantiated; update the research log; and merge the data PR only after the audit and all required checks pass. Never invent missing identifiers or values.

**To Claude — Calculator Owner:** after the reviewed dataset is merged to `main`, implement this contract only in calculator-owned files. Do not conduct price research or edit `data/reference_prices.json`. Implement safe adapter behavior for ineligible/missing records and all acceptance tests. If an engineering limitation conflicts with the data contract, report the exact blocker and proposed technical solution in the official operations room; do not silently weaken data rules.

**Files ChatGPT must not edit:** `website/home-project-calculator.html`, `website/project-estimator-engine.js`, `website/project-list.js`, `website/wallpaper-calculator-engine.js`, and calculator-owned tests. `data/reference_prices.json` and research documentation remain ChatGPT's responsibility.

**Merge policy:** ChatGPT may merge routine research/documentation/data PRs when the scope is verified, required checks are green, no conflicts or unresolved owner decisions remain, and the resulting `main` state is confirmed. Do not merge an unverified price dataset or any technical change that belongs to Claude's ownership.

**Status:** research/data contract; implementation is assigned to Claude only after the reviewed data is on `main`.
