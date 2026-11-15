# Flooring price evidence follow-up — 2026-11-15

**Owner:** ChatGPT (market research and data quality)  
**Purpose:** Continue the accuracy-first review after Claude merged Stage 0 (#367).  
**Scope:** Evidence review only. No canonical price or eligibility values changed.  
**Canonical registry snapshot:** `data/reference_prices.json` on main commit `bd21509fc6b7191c729ca0627a42ce0e659e6e64`; the registry remains 193 records / 101 eligible. PR #367 changed calculator implementation and the shared operations room, not the canonical price registry.

## 1. New cross-check evidence reviewed

### Canada — Ontario multi-store sample

**22FLOORING, “Toronto Flooring Prices 2026: What 793 Floors Cost per Square Foot”**  
URL: https://22flooring.ca/toronto-flooring-prices/  
Prices collected 11 November 2026; page updated November 2026.

The source reports 793 public product lines from five Ontario flooring-store websites, counting each product line once rather than colour variants. It separates material-only prices from its own installation rates, excludes sale prices from its stated regular-price sample, and uses printed carton coverage when a box price must be converted. Its “typical” band is explicitly the middle half of the sample, not a full observed min–max range.

Reported middle-half bands (CAD/sq ft):
- Laminate: 2.49–3.47 (166 products)
- Click vinyl (SPC/LVP): 2.89–4.49 (225)
- Glue-down vinyl (dryback/LVT): 2.79–3.80 (77)
- Engineered hardwood: 4.99–7.35 (57)
- Solid hardwood: 4.90–8.39 (74)
- Ceramic and porcelain floor tile combined: 4.89–9.11 (194)

**Limitations disclosed by the source:** one large GTA retailer supplied about 60% of all products; tile and glue-down vinyl each came from only two stores; big-box stores were excluded; premium hardwood brands without public prices are absent; the source is an installer with a commercial interest. This is a useful Ontario plausibility check, not a national Canadian survey.

**Comparison with canonical Canadian ranges:**
- Laminate current range CAD 1.49–3.97/sq ft contains the reported Ontario middle-half band.
- Engineered hardwood current range CAD 4.18–11.08 contains the Ontario middle-half band.
- Solid hardwood current range CAD 4.32–8.84 contains the Ontario middle-half band.
- The Ontario tile band must not be used to validate a porcelain-only record without subtype separation.
- The bands are quartile-based “middle half” intervals. Do not copy them into the current LOW–HIGH editorial-range fields, compute medians, or treat them as a substitute for raw product observations under the current data contract.

**Assessment:** positive independent plausibility signal for three Canadian wood/laminate categories, but not sufficient by itself to change any canonical range or to claim national representativeness.

### Canada — current retailer listing spot checks

**Home Depot Canada category pages**  
URLs:
- https://www.homedepot.ca/s/en/home/categories/floors/laminate-hardwood-flooring
- https://www.homedepot.ca/s/en/home/categories/floors/flooring-tools-and-accessories/floor-installation-kits/laminate-plank-floor

The search-indexed pages showed individual SKU-level prices per square foot and case coverage, including laminate products across roughly CAD 1.78–3.48/sq ft among examples with current availability, and engineered-hardwood examples around CAD 3.48–5.98/sq ft. Several lower-priced results were explicitly unavailable/out of stock. The page also contains hybrid resilient products among laminate category results, so the category page cannot be treated as a clean subtype sample without filtering every SKU.

**Flooring Canada in-stock page**  
URL: https://www.flooringcanada.ca/in-stock

The page showed individual listed prices: LVP CAD 3.99/sq ft, hardwood oak CAD 6.50, engineered maple CAD 5.75, laminate CAD 2.99, plush carpet CAD 4.50 and LVT CAD 4.25. It does not expose a dated, auditable SKU-by-SKU sample or a national stock/price guarantee on the page. Treat these as individual listing spot checks, not market ranges.

**RenoAtlas Canadian material-price catalogue**  
URL: https://renoatlas.ca/en/prix/

A dated 1 August 2026 snapshot lists product-level examples across Home Depot Canada, RONA and Canac, including carton prices and area conversions for vinyl, laminate and tile. It is useful as a cross-retailer product-level comparison and exposes geography/store selection, but its dated sample is not a November 2026 market survey. Preserve each product as product-specific evidence; do not pool unrelated SKUs without a comparable sampling method.

### United States — current Home Depot spot checks

**Home Depot US category pages**
- Laminate: https://www.homedepot.com/b/Flooring-Laminate-Flooring/N-5yc1vZare1
- Vinyl plank: https://www.homedepot.com/b/Flooring-Vinyl-Flooring-Vinyl-Plank-Flooring/N-5yc1vZbzjz

Current indexed product examples include:
- Laminate: multiple SKUs around USD 1.79–2.89/sq ft, with a clearance item around USD 0.99/sq ft and some explicitly discounted offers.
- Click vinyl: examples around USD 1.49–3.29/sq ft, with several product lines showing 6 mil, 12 mil and 22 mil wear layers.

These are live retailer listings, not a market sample. The category contains clearance, promotional and different performance-grade products; prices can also vary by store/location. They must not be used as a generic national LOW–HIGH range without a documented SKU sampling protocol and comparable specification filters.

**vCalc US survey page**  
URL: https://www.vcalc.com/wiki/flooring-price-information

This remains the source of several existing US records, with a dated 14 July 2026 sample and product counts per category. The page explicitly says it samples one big-box retailer per category, is not necessarily the retailer's complete product line, gives no accuracy guarantee and recommends checking local prices. This is a transparent convenience sample, not an independent national market survey. The three July observations should be refreshed before being described as current.

## 2. Record-level implications — no edits yet

| Market / material | Existing registry status | New evidence | Decision |
|---|---|---|---|
| Canada laminate | Eligible, RONA + Home Depot Canada sample | Ontario middle-half band overlaps; current Home Depot SKU spot checks span below and above parts of range | Keep eligible provisionally; improve product filtering and add another retailer sample |
| Canada engineered hardwood | Eligible, RONA sample | Ontario middle-half band overlaps; Home Depot SKU spot checks provide a second retailer signal | Keep eligible provisionally; obtain comparable SKU-level sample and province coverage |
| Canada solid hardwood | Eligible, RONA sample | Ontario middle-half band overlaps; premium brands are absent from Ontario study | Keep eligible with budget/public-price caveat; expand sample before high confidence |
| Canada porcelain tile | Eligible, Home Depot Canada | Ontario study combines ceramic and porcelain; cannot validate porcelain-only range | Keep current subtype separation; seek porcelain-only sample |
| Canada carpet / carpet tile / sheet vinyl | Eligible, Home Depot Canada | No sufficiently comparable independent sample in this pass | No change; add independent retailer evidence |
| US laminate | Eligible; vCalc observation 2026-07-14 | Current Home Depot examples overlap but include clearance and offers | Refresh with dated multi-retailer SKU sample |
| US LVP/SPC | Eligible; November sample from Home Depot + Lowe's | Home Depot examples include low-priced products with differing wear layers | Recheck specification comparability and promo status; do not change endpoints from this spot check |
| US engineered / solid hardwood, carpet, ceramic tile | Eligible | No complete comparable new sample in this pass | Retain provisional status; refresh from multiple sources before high-confidence label |

## 3. Method decisions reaffirmed

1. No price was changed by this follow-up.
2. Do not mix material-only and installed prices.
3. Do not mix tax-included and tax-excluded bases without recording the difference.
4. Do not merge clearance, promotional and regular prices into one undifferentiated range.
5. Do not combine ceramic and porcelain, click vinyl and glue-down vinyl, or engineered and solid hardwood.
6. Do not treat search-indexed category pages as a full product export or as a stable national price list.
7. Do not use quartile bands or medians from third-party studies to populate the existing LOW–HIGH range fields. The current data contract remains authoritative until formally reviewed and amended.
8. A single retailer's product page can support a product-specific listing, not a generic market range.
9. Keep location and availability caveats visible; national retailer domains do not guarantee a single national price.

## 4. Next research sequence

1. **US:** refresh the July vCalc records with a transparent, dated SKU sample from at least two independent retailers; filter clearance and promo products separately; record wear layer, thickness, construction and coverage where relevant.
2. **Canada:** expand beyond RONA and Home Depot Canada using independently operated flooring retailers and province-specific samples; keep Ontario findings labelled Ontario.
3. **UK:** re-sample laminate, carpet, sheet vinyl, LVT/SPC, engineered wood and solid wood with a standard-vs-offer distinction; do not infer tile ranges where none is sourced.
4. **DE/FR/ES/IT/NL:** improve single-retailer categories with a second independent retailer before upgrading confidence.
5. Only after these evidence steps should a record-level proposal be made for `data/reference_prices.json`.

**No new generic price range is approved by this document.** The priority remains reliable, explainable estimates rather than filling every market/category cell.
