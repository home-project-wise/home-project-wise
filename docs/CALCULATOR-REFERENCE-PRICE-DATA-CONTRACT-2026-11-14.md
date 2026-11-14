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

Initial audit found four non-US listing rows without a top-level `productOrSku`. Follow-up verification has now identified all four exact product references and direct product URLs in the candidate data branch: France ARTENS laminate `89154816`; Spain LUXENS 15 L paint `96114412`; Germany Parador engineered hardwood parquet `1748887`; and Netherlands HORNBACH made-to-measure sheet PVC `6053234`. The Germany product's construction was also corrected: its spruce carrier core and 3.6 mm real-wood wear layer make it engineered hardwood, not solid hardwood. All four remain individual product observations, never category defaults. Never infer an identifier from a category URL or fabricate one.

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

## 4.1 Structured eligibility fields (2026-11-14)

The catalogue now carries five additive top-level fields on every record: subtype, autoEligible, autoEligibleReason, jurisdiction and tariffPlan. These fields do not replace or alter any price, unit, currency, date, source, publisher, URL, note or caveat.

- subtype: required key for flooring; one of laminate, lvp-spc, sheet-vinyl, broadloom-carpet, carpet-tile, engineered-hardwood, solid-hardwood, ceramic-tile, porcelain-tile, or null when the record is not flooring or the exact construction is not established. Do not infer from adjacent materials or parse prose to fill an uncertain subtype.
- jurisdiction: canonical matching key for electricity. US state records use US-XX (DC uses US-DC) and the national fallback uses US-NATIONAL; Great Britain is GB, Northern Ireland is GB-NIR; Canadian province/territory codes use CA-ON, CA-QC, CA-BC, CA-AB, CA-SK, CA-MB, CA-NB, CA-NS, CA-PE, CA-NL, CA-YT, CA-NU, CA-NT; Eurostat records use the two-letter country code (DE, FR, ES, IT, NL). It is null for non-electricity records.
- tariffPlan: exact plan/benchmark identifier, not a guessed generic plan. EIA and Eurostat rows use explicit statistical-benchmark identifiers (not household tariffs); named utility/rate rows use their named plan identifiers. It is null when no plan can be established.
- autoEligible: boolean permission to surface the record as an indicative reference after exact scope matching, not a claim that it calculates a complete household bill or a guaranteed local price. If false, autoEligibleReason is mandatory and must explain the block. A true record must still retain all provenance and caveats.
- Retailer listings are always false for generic category selection; they remain product examples only. Paint and wallpaper are false until the package/sale-unit compatibility fields described in section 6 are captured. The ten section 10.1 exclusions remain false. A record with uncertain/mixed subtype, membership condition or application remains false.
- Electricity rows marked true are indicative only: EIA and Eurostat are averages; GB/NI are named tariff benchmarks with their own period/tax/payment scope; selected Canadian rows are energy-charge references only and exclude fixed charges or other bill components. Ontario is eligible only when the visitor explicitly selects TOU. Block tariffs, community/subsidy schedules and stale Nunavut remain false. No true flag permits an all-in bill claim.

The current data pass deliberately enables only exact-subtype flooring editorial ranges and electricity records whose jurisdiction and benchmark/plan scope can be expressed without pretending a block tariff is a flat household rate. Claude's adapter must treat autoEligible=false as a hard stop and match both jurisdiction and tariffPlan where applicable.

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
- All four non-US retailer listings originally missing product/SKU identifiers have now been verified against exact retailer product pages and corrected in the PR #341 candidate branch. Germany's record was also reclassified from solid hardwood to engineered hardwood. No `retailer-listing` row in the current candidate branch is missing `productOrSku`; all remain product examples only, not category defaults.

## 10.1 Additional data-eligibility exclusions from the 14 Nov audit

The following records are structurally valid JSON but are **not eligible as automatic category references** until the research owner resolves the comparability issue. Their presence in the catalogue does not mean they may be selected by a broad `category` match.

| Record ID | Why automatic selection is blocked | Required research/data resolution |
|---|---|---|
| `UK-flooring-lvt-spc-retailer-sample-2026-11-14` | LVT and SPC are grouped together; they are adjacent products, not a single exact subtype | Split into subtype-specific ranges or keep out of automatic matching |
| `CA-flooring-lvt-spc-rona-listings-2026-11-14` | Mixes SPC, glue-down and peel-and-stick vinyl constructions | Separate construction-specific records or exclude |
| `EU-DE-carpet-hornbach-2026-11-14` | Mixes broadloom carpet and carpet tiles | Split broadloom from carpet tile |
| `EU-DE-flooring-porcelain-tile-hornbach-2026-11-14` | Label/source span mixes ceramic and porcelain tile | Separate ceramic and porcelain evidence |
| `CA-flooring-ceramic-tile-homedepot-listings-2026-11-14` | Floor and wall tile are mixed; wall-only products are not a safe flooring proxy | Verify every sampled product is floor-rated or narrow the range |
| `US-flooring-porcelain-tile-homedepot-sample-iqr-2026-11-14` | Sample description includes floor/wall porcelain products; wall-only tile is not a safe flooring proxy | Verify every sampled SKU is floor-rated or exclude wall-only products and recompute the range |
| `EU-NL-flooring-ceramic-tile-gamma-2026-11-14` | The record is explicitly a wall tile and compares one SKU's standard and loyalty prices | Keep as an identified product example only; never use as floor-tile category reference |
| `EU-NL-flooring-pvc-gamma-2026-11-14` | One click-PVC SKU's standard price and member promotion are represented as a range | Record one clearly dated price/condition as a product listing or exclude from category range |
| `EU-NL-flooring-laminate-gamma-2026-11-14` | Low/high are loyalty-card and standard prices for one product, not a sampled category range | Separate membership condition and product identity; do not present as a category range |
| `UK-flooring-solid-oak-retailer-sample-2026-11-14` | Low endpoint is unfinished parquet while higher endpoints are finished planks | Split unfinished parquet from finished plank evidence or exclude the mixed range |

The exact item/subtype matcher must also reject any future record whose notes/caveats reveal a materially mixed construction, finish, eligibility, membership condition or application that is not represented in structured fields. Do not try to repair these cases in the calculator by parsing prose.

**Wallpaper is globally blocked from automatic sale-unit costing in this dataset version.** Records use incompatible bases (per roll, per m² covered or per sq ft covered); roll/package coverage, width, length, pattern repeat and sale-unit type are not consistently structured. This applies even when a note mentions approximate roll coverage. Keep wallpaper on user-entered price/two-quote flow; any displayed reference is context-only with its exact basis until the research owner creates a normalized, validated package schema.

**Paint is globally blocked from automatic can/tin costing in this dataset version.** Even where a retailer listing names a 15 L or 3.79 L pack, package volume is not a normalized field and the Paint tab does not capture the visitor's can volume. A per-litre or per-gallon reference must not be multiplied by a tin count. Keep manual price/two-quote flow until a structured pack-volume match exists.

These exclusions are deliberate quality controls, not defects to be bypassed. ChatGPT owns the research/data resolution; Claude implements the technical deny-by-default behavior and tests.

## 10.2 Electricity tariff applicability guard

Electricity rows must be matched by jurisdiction **and** tariff structure. A country/state match alone is insufficient.

- **Ontario:** the numeric low/high fields on the current record are the Nov 2026 Time-of-Use (TOU) rates only. Tiered and Ultra-Low Overnight (ULO) plans have different thresholds/time windows. Use this record only when TOU is selected; do not silently use its range for Tiered/ULO or an unknown plan.
- **Quebec, British Columbia, Manitoba and Prince Edward Island:** the recorded rates include consumption blocks/thresholds and/or a separate fixed charge. A single low/high multiplied by total kWh is not an exact bill calculation. If the calculator does not collect the applicable plan, period and consumption distribution/threshold inputs, show the data only as an indicative rate reference with the tariff caveat, not as a precise bill.
- **Alberta:** Rate of Last Resort is an energy-only regulated default benchmark in a competitive retail market; it is not an all-in provincial bill.
- **Newfoundland and Labrador, Yukon and Northwest Territories:** respect the named utility/grid/community scope. Never widen a regional/community tariff to an entire province or territory.
- **Nunavut:** the currently located official tariff is effective 1 Oct 2023. It is older than 12 months and must not be selected as a current default; it may appear only as a clearly dated historical reference with subsidy treatment.
- **Great Britain:** the Ofgem Q4 2026 Direct Debit benchmark applies to England, Scotland and Wales only; 26.32p/kWh and 54.83p/day standing charge. Qualifying domestic electricity is temporarily zero-rated for VAT from 1 Oct 2026; the Ofgem figures reflect that.
- **Northern Ireland:** keep the Power NI monthly Direct Debit/e-bill row distinct from a territory-wide average. The Consumer Council snapshot dated 14 Nov 2026 includes 5% VAT; its 32.100p/kWh unit price already reflects an eligible 6% discount capped at £60/year and subject to the supplier's usage threshold. Do not compare it directly with the GB Ofgem cap without showing these differences.
- **United States:** EIA state/national observations are monthly average residential revenue prices per kWh, not an individual household tariff. Prefer a state row when known; use the national row only as an explicitly labelled fallback.
- **EU:** Eurostat H1 2026 figures are harmonised half-year household prices for the 2,500–4,999 kWh/year consumption band, including taxes and levies; they are not live supplier tariffs.

Where the current calculator cannot represent the tariff structure, the safe behavior is manual price/quote input or a clearly labelled indicative reference. Do not convert a multi-part tariff into a single definitive bill estimate.

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
10. A retailer SKU never becomes a category default; all 57 retailer listings must have a verified `productOrSku`, and the four corrected non-US identifiers must be preserved as individual listings. All explicit exclusions in §10.1 are denied by default.
11. No median is parsed from notes; no midpoint is labelled as a median.
12. A missing country/category match prompts the user for a price or two quotes; no FX conversion or cross-country fallback occurs.
13. User input and two user quotes override a selected reference without mixing values.
14. Unknown required costs block a full-scope budget verdict; optional unknowns remain disclosed.
15. The source name, publisher, URL, observed date, retrieval date and caveat remain visible/clickable.
16. Records older than 12 months (measured from `observedAt`, not merely `retrievedAt`) are labelled “older data”; do not treat a recent retrieval date as a recent price observation.
17. No network call or persistence of user-entered measurements/prices is introduced.
18. Mixed-construction and mixed-application records listed in §10.1 are never returned by automatic category selection.
19. Paint and wallpaper remain manual-only until structured package-volume/coverage compatibility is implemented; prose notes cannot unlock them.
20. Electricity tests prove plan-specific matching: Ontario TOU is never applied to Tiered/ULO; block tariffs are not presented as exact bills without threshold inputs; GB and NI VAT/tariff distinctions remain visible; US EIA and Eurostat benchmarks are labelled as averages, not live tariffs.

## 12. Handoff and ownership

**To ChatGPT — research/data owner:** complete the source-by-source audit of all candidate records; correct any verifiable source URL, product identifier, value, unit, date, geography, caveat or classification issue in `data/reference_prices.json`; reject or quarantine records that cannot be substantiated; update the research log; and merge the data PR only after the audit and all required checks pass. Never invent missing identifiers or values.

**To Claude — Calculator Owner:** after the reviewed dataset is merged to `main`, implement this contract only in calculator-owned files. Do not conduct price research or edit `data/reference_prices.json`. Implement safe adapter behavior for ineligible/missing records and all acceptance tests. If an engineering limitation conflicts with the data contract, report the exact blocker and proposed technical solution in the official operations room; do not silently weaken data rules.

**Files ChatGPT must not edit:** `website/home-project-calculator.html`, `website/project-estimator-engine.js`, `website/project-list.js`, `website/wallpaper-calculator-engine.js`, and calculator-owned tests. `data/reference_prices.json` and research documentation remain ChatGPT's responsibility.

**Merge policy:** ChatGPT may merge routine research/documentation/data PRs when the scope is verified, required checks are green, no conflicts or unresolved owner decisions remain, and the resulting `main` state is confirmed. Do not merge an unverified price dataset or any technical change that belongs to Claude's ownership.

**Status:** research/data contract; implementation is assigned to Claude only after the reviewed data is on `main`.


## 13. Static-site publication integration

The canonical registry remains at data/reference_prices.json. The GitHub Pages workflow publishes the website/ directory and runs scripts/rebuild_site_indexes.py before uploading it; the workflow already triggers when that script changes. The technical owner should copy the canonical registry to website/reference-prices.json during that build and add a test that the generated file is byte-identical to the source. Never maintain a second hand-edited JSON file. A data-only change does not trigger Pages under the current workflow path filter; the build-script integration is the deployment trigger.


## 14. Source audit follow-up — 14 November 2026

The source owner performed a targeted live-page audit of the 36 flooring records marked auto-eligible after PR #348. The audit is incremental; it does not certify all 36 endpoints or replace the required periodic source-by-source review.

- `EU-FR-solid-hardwood-leroymerlin-2026-11-14` is now `autoEligible: false`. The linked generic floor/wall promotion page did not establish the recorded endpoints, and the current Leroy Merlin solid-parquet category exposes at least one €118.80/m² figure as a former/list price with a current selling price of €71.92/m². Do not use the former price as a current material reference. Re-enable only after both endpoints and their price conditions are verified at product level.
- `EU-IT-solid-hardwood-leroymerlin-2026-11-14` now links to the direct Leroy Merlin Italia solid-wood parquet category page, where the recorded €42.68/m² and €117/m² endpoints are visible. Original numeric values and observed date were not changed.
- `EU-FR-carpet-leroymerlin-2026-11-14` now links to the direct roll-carpet category page; the recorded €13.90/m² and €29.90/m² endpoints are visible among roll products. The selected-sample caveat remains.

This reduces flooring auto-eligible records from 36 to 35 (electricity remains 66; total eligible records 101). No prices, units, currencies or observed dates were changed. The two corrected URLs are more direct source references, not new price observations.
