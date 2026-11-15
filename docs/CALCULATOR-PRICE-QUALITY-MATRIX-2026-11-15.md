# Calculator reference-price quality matrix — 2026-11-15

**Owner:** ChatGPT (research/data)  
**Status:** First-pass audit complete; no price values changed and no new record approved.  
**Source of truth audited:** `data/reference_prices.json` on `main` at `745ab2d0a3f409dc822718353eadf2c75ddbc954`.  
**Related:** #362, #363, PR #364, and `docs/CALCULATOR-REFERENCE-PRICE-DATA-CONTRACT-2026-11-14.md`.

## 1. Executive result

The registry contains **193 records**, of which **101 are technically eligible for indicative auto-selection**: 35 flooring records and 66 electricity benchmarks. Eligibility is not the same as representativeness or confidence. The matrix below therefore reports both total records and auto-eligible records, followed by a separate quality judgement.

| Market | Flooring eligible / total | Paint eligible / total | Wallpaper eligible / total | Electricity eligible / total |
|---|---:|---:|---:|---:|
| US | 6 / 55 | 0 / 2 | 0 / 5 | 52 / 52 |
| Canada | 7 / 9 | 0 / 1 | 0 / 1 | 7 / 13 |
| UK | 6 / 8 | 0 / 1 | 0 / 1 | 2 / 2 |
| Germany | 2 / 6 | 0 / 1 | 0 / 1 | 1 / 1 |
| France | 3 / 6 | 0 / 1 | 0 / 1 | 1 / 1 |
| Spain | 5 / 5 | 0 / 1 | 0 / 1 | 1 / 1 |
| Italy | 5 / 5 | 0 / 1 | 0 / 1 | 1 / 1 |
| Netherlands | 1 / 6 | 0 / 1 | 0 / 1 | 1 / 1 |
| **Total** | **35 / 100** | **0 / 9** | **0 / 12** | **66 / 72** |

The remaining 57 retailer/SKU records are intentionally not category defaults. All 92 non-eligible records have an explicit reason; no record is missing `autoEligibleReason`. One historical Nunavut electricity observation (2023-10-01) is stale and non-eligible.

## 2. Market/category confidence assessment

Confidence here means confidence that a beginner-facing result is reasonably representative of the selected market and category, not merely that a source is genuine.

| Market | Flooring | Electricity | Paint | Wallpaper | Main reason |
|---|---|---|---|---|---|
| US | **Medium / uneven by subtype** | **High authority; medium household fit** | Not ready | Not ready | Six eligible flooring ranges; older July observations for three types and newer November samples for three. EIA covers 50 states + DC + national average, but reports average retail prices, not each household's tariff. |
| Canada | **Medium-low** | **Medium-high authority; incomplete coverage** | Not ready | Not ready | Seven flooring ranges but only RONA and Home Depot Canada; online catalogue sample is not a national market survey. Seven official/regulator/provider electricity observations cover selected provinces/territories and plan types, not all Canada. |
| UK | **Medium-low** | **Medium-high benchmark quality; scope-sensitive** | Not ready | Not ready | Six eligible flooring ranges but some rely on one retailer/category source and offer prices. Electricity correctly separates GB Ofgem from Northern Ireland Power NI; these are not the same tariff/geography. |
| Germany | **Low** | **High statistical authority; medium user fit** | Not ready | Not ready | Only two flooring subtypes, both from HORNBACH. Eurostat provides one national electricity benchmark, not an individual supplier tariff. |
| France | **Low** | **High statistical authority; medium user fit** | Not ready | Not ready | Three flooring subtypes, all from Leroy Merlin; one earlier solid-hardwood range was correctly quarantined. Eurostat electricity is a national household-price benchmark. |
| Spain | **Low-medium** | **High statistical authority; medium user fit** | Not ready | Not ready | Five flooring types, all from Leroy Merlin; no independent retailer cross-check yet. Eurostat electricity is a national benchmark. |
| Italy | **Low-medium** | **High statistical authority; medium user fit** | Not ready | Not ready | Five flooring types, all from Leroy Merlin; no independent retailer cross-check yet. Eurostat electricity is a national benchmark. |
| Netherlands | **Low** | **High statistical authority; medium user fit** | Not ready | Not ready | Only one eligible flooring type (broadloom carpet), sourced from HORNBACH. Eurostat electricity is a national benchmark. |

### Interpretation

- **Do not display all eight countries as equally reliable.** The selector can contain all eight as the owner decided, but each calculator result must disclose whether its selected country/material has a usable reference.
- **Do not label the current flooring ranges as national averages.** Most are retailer catalogue/listing samples. A country-level URL does not prove a representative country-level sample.
- **Do not convert electricity benchmarks into a promise about a user's bill.** EIA and Eurostat are statistical averages; Ofgem is a price-cap benchmark for a defined payment method and GB geography; Canadian sources are jurisdiction/plan-specific. Keep fixed charges, taxes, usage bands and tariff conditions explicit.
- **Paint and wallpaper must remain manual / unavailable for automatic prices** until compatible package, coverage, sale-unit and market evidence passes the data contract.

## 3. Flooring: source breadth and known weaknesses

All 35 eligible flooring rows are `editorial-range`; none is a government benchmark. The current source breadth is uneven:

- **US (6):** vCalc-derived samples for laminate, broadloom carpet and ceramic tile were observed 2026-07-14. LVP/SPC and engineered hardwood use Home Depot + Lowe's November 2026 samples. Solid hardwood uses Home Depot alone. Refresh the July rows and preserve subtype boundaries.
- **Canada (7):** three RONA ranges (laminate, engineered hardwood, solid hardwood) and four Home Depot Canada ranges (porcelain tile, broadloom carpet, carpet tile, sheet vinyl), observed 2026-11-14. Add independent Canadian retailers and provincial/region checks before claiming national representativeness.
- **UK (6):** the current research sample covers laminate, broadloom carpet, engineered wood, sheet vinyl, ceramic tile and porcelain tile. The What's The Damage source explicitly notes that some categories are based on one retailer, offers are common, and fitting/delivery/underlay are excluded. Do not call these ranges stable market averages without a second independent sample.
- **Germany (2):** laminate and sheet vinyl, both HORNBACH only.
- **France (3):** ceramic tile, engineered hardwood and broadloom carpet, all Leroy Merlin only.
- **Spain (5):** laminate, porcelain tile, LVP/SPC, broadloom carpet and sheet vinyl, all Leroy Merlin only.
- **Italy (5):** laminate, porcelain tile, engineered hardwood, broadloom carpet and solid hardwood, all Leroy Merlin only.
- **Netherlands (1):** broadloom carpet only, HORNBACH only.

### Important price-comparability gaps

1. **Retailer breadth:** except selected US and UK samples, most market/category ranges rely on one retailer. This is insufficient to claim a representative market range.
2. **Promotion treatment:** UK sources report that most sampled prices were offers. A promotional low endpoint must not be silently blended with a normal-price high endpoint. Capture offer status and, where available, the non-promotional price separately.
3. **Tax and delivery:** consumer-facing tax inclusion, delivery, underlay, trim, substrate preparation and installation are not uniformly recorded. The current ranges are material-only unless a record explicitly says otherwise.
4. **Product mix:** wide ranges can span different grades, formats, finishes, thicknesses and brands. A range is not automatically a like-for-like comparison simply because the category label matches.
5. **Geographic granularity:** national retailer websites may localize price/availability by postal code. Record the observed geography and do not overstate national availability.
6. **Coverage conversion:** do not infer pack coverage from price-per-area. The existing contract remains in force: use user-entered pack coverage for pack counts; never invent package coverage.

## 4. Electricity: keep the benchmark class visible

The 66 eligible electricity records consist of:
- US: 52 EIA state/DC/national average residential price records (August 2026).
- Canada: 7 regulator/provider observations for selected provinces or service territories.
- UK: 2 separate records — Ofgem GB price-cap benchmark and Northern Ireland Power NI reference.
- EU: 5 Eurostat country observations (Germany, France, Spain, Italy, Netherlands; 2026 H1).

This is a strong official-source foundation, but not a unified tariff dataset. The UI must label the value as an indicative benchmark and avoid implying that it predicts an individual bill. Exact jurisdiction, plan, effective date, usage assumptions and whether fixed charges/taxes are included remain decisive.

## 5. External cross-checks reviewed on 2026-11-15

These sources are useful as corroboration, not automatic replacements for the canonical records:

- **Canada / Ontario:** 22FLOORING reports counting 793 publicly listed products at five Ontario stores on 2026-11-11, with a reported laminate midpoint of CAD 2.99/sq ft and half of sampled laminate prices between CAD 2.49 and 3.47/sq ft. This overlaps the current Canadian laminate range (CAD 1.49–3.97/sq ft), which is a useful plausibility check. However, the source is an installation business and the study is Ontario-only; it is not a Canada-wide independent market index. https://22flooring.ca/toronto-flooring-prices/
- **UK:** What's The Damage reports checking three retailer websites on 2026-10-31, but notes Direct Wood Flooring and Flooring Superstore appear to be one group; several categories rest on one retailer and most prices are offers. This directly supports treating the current UK range as a useful discovery sample, not a robust national benchmark. https://whatsthedamage.co.uk/articles/how-much-does-flooring-cost-uk
- **UK cross-check:** Less.co.uk (updated 2026-11-12) distinguishes material-only from fitted prices and says fitting, underlay and subfloor preparation are not uniformly included in material ranges. Use it to check scope definitions, not to blend its figures into retailer samples without like-for-like verification. https://less.co.uk/home-improvements/flooring/cost

## 6. Immediate remediation plan — accuracy first

### P0 — preserve correctness before adding records
1. Keep all current eligibility flags and exclusions. No retailer SKU becomes a generic default.
2. Keep all paint and wallpaper records non-eligible.
3. Keep the stale Nunavut observation excluded until refreshed.
4. Do not calculate median, midpoint or percentile from raw observations under the current data contract. Any future tier model requires a reviewed contract amendment and reproducible method.

### P1 — improve flooring representativeness
1. Refresh the three US July 2026 ranges against current retailer samples and record the exact sampling method, SKU count, geography and promotion status.
2. For Canada, add at least two additional independent retailers and identify the province/region for observed listings; separately validate Ontario and other provinces where possible.
3. For UK, split standard and promotional prices; add independent suppliers for carpet, engineered wood, tile and vinyl rather than relying on one category retailer.
4. For DE, FR, ES, IT and NL, add at least one genuinely independent retailer per currently eligible subtype before promoting any range to high confidence. Where that cannot be done, keep the result clearly labelled as a limited retailer sample.
5. Capture product grade/specification boundaries (thickness, wear layer, construction, finish, format) before combining endpoints.

### P2 — strengthen electricity interpretation
1. Preserve EIA/Eurostat as statistical benchmarks, not supplier tariffs.
2. Expand Canadian provincial coverage only from official regulator/provider sources, and keep each tariff's eligibility conditions and plan separate.
3. Keep GB and NI distinct; update on the official effective-date cycle.
4. Make the calculator's output say “indicative benchmark” and show jurisdiction and observed/effective date.

### P3 — unlock paint and wallpaper only after evidence gates
1. Paint: collect comparable interior-wall product technical sheets for each market, separating product type, substrate, coats, coverage basis and package size. Do not extrapolate one product to a national default.
2. Wallpaper: collect regional physical-roll dimensions and sale-unit conventions from multiple manufacturers/retailers; record pattern repeat and usable yield separately. Do not treat a single brand's roll as a market standard.

## 7. Approval / release rules

A range may be considered for automatic beginner-facing use only when:
- country, jurisdiction, material subtype, currency, unit and price basis match exactly;
- source and observed date are present and independently rechecked;
- sample method, number of products, number of independent retailers and promotion treatment are recorded;
- product grades/specifications are sufficiently comparable;
- exclusions and caveats are visible;
- the current data contract's restrictions are met.

For a broad market range, target at least two independent retailers or two independent primary/industry sources where the market structure permits. This is a quality target, not permission to fabricate a range when only one source exists. A product-specific verified price can remain product-specific without pretending to be a category average.

**No data change is authorized by this audit.** The next work is evidence collection and source re-verification. Any proposed price update must be reviewed record-by-record and then validated against the contract before editing `data/reference_prices.json`.

## 8. Operations / coordination note

PR #364 already contains the assumption source map and verified evidence addendum. This matrix is added to that same research PR. At audit time PR #360 and PR #301 also modify shared operations-room files; therefore this task does not overwrite `data/AI_COLLABORATION.md` or `data/WORK_LOG.md` while those changes are open. Reconcile the canonical logs sequentially after the overlapping PRs are resolved. No Claude-owned files, calculator code, CSS, workflow or price records were changed.
