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


### UK — Wickes independent laminate spot check (15 November 2026)

**Wickes laminate category page**
- https://www.wickes.co.uk/Products/Flooring/Laminate-Flooring/c/1000887
- The live category page displayed 40 products. Visible examples were priced from about £9/m² to £22/m², with many 8–12 mm planks and stated pack coverages commonly around 1.48–2.74 m². Some listings were explicitly discounted; others were not.
- Examples included Wickes own-brand 8 mm and 12 mm laminate, herringbone formats with smaller pack coverage, and Quick-Step branded laminate. The page is a live catalogue snapshot, not a fixed, downloadable sample.
- **Use:** a new retailer-level cross-check independent of Direct Wood Flooring / Flooring Superstore and Carpetright/Tapi. It confirms that the UK laminate category has current offerings outside the earlier three-site study.
- **Do not use:** as a replacement market range or as a direct LOW–HIGH endpoint. The category mixes thickness, herringbone vs plank format, own-brand vs branded products, discounted and non-discounted prices, and pack sizes. Record exact SKU observations only if each listing is opened and its price, stock, coverage and promotion status are captured.

**UK ownership / independence caution**
- Carpetright is now part of Tapi, so Tapi and Carpetright should not be counted as two independent retailers for the same sample.
- Direct Wood Flooring and Flooring Superstore appear to be one group according to the 1 November 2026 source audit; keep them as one independent source group.
- Wickes is an additional independent retailer for laminate in this pass. No comparable new independent sample was verified here for UK carpet, engineered wood, solid wood, tile or sheet vinyl.


### Germany — OBI independent laminate spot check (15 November 2026)

**OBI Germany laminate category**
- https://www.obi.de/search/laminat/
- Live examples included Kaindl 6 mm laminate at €7.49/m², Kaindl 7 mm waterproof laminate at €11.99/m² regular / €10.00/m² with heyOBI advantage, and Kaindl 7 mm Sea Pine at €7.99/m².
- OBI shows both €/m² and sale-unit price. The member price is conditional and must not be treated as the general price.
- **Use:** independent retailer cross-check beyond HORNBACH for German laminate.
- **Do not use:** as a generic German range; this is a small live category-page sample and contains member pricing.

### France — Castorama independent laminate spot check (15 November 2026)

**Castorama France laminate category**
- https://www.castorama.fr/carrelage-sol/parquet-sol-stratifie-et-plancher/sol-stratifie/cat_id_3241.cat
- The category page showed 136 products. Current visible examples included 8 mm AC5 Krono Original at €11.99/m² and 8 mm AC4 GoodHome Gladstone at a promotional €9.99/m² (stated offer through 1 December 2026; regular price €13.99/m²).
- The page distinguishes AC3, AC4, AC5 and AC6 use classes, and some offers have stock or loyalty conditions.
- **Use:** independent retailer cross-check beyond Leroy Merlin for French laminate.
- **Do not use:** as a broad French market range or combine promo and regular prices without separate fields.

### Spain — OBRAMAT (ADEO) and Brico Depôt (Kingfisher) laminate checks (15 November 2026)

**OBRAMAT Spain laminate category**
- https://www.obramat.es/suelos-y-revestimientos-de-madera/suelos-laminados/todos-los-suelos-laminados/
- The category page showed 22 products. Examples included FINSA AC5 7 mm Roble Malta at €7.11/m² including IVA and KRONOSPAN AC5 8 mm Roble Khaki at €9.30/m² including IVA. The page also surfaced separate Canary Islands IGIC prices for some products.
- **Ownership correction:** OBRAMAT is an ADEO brand, the same corporate group as Leroy Merlin. Its listings are a useful second banner/product sample, but **not an independent retailer-group cross-check**. ADEO's own brand portfolio identifies OBRAMAT as its professional-format banner: https://www.adeo.com/wp-content/uploads/2025/05/EN-2025-ADEO-PRESENTATION.pdf
- **Independent group cross-check — Brico Depôt Spain (Kingfisher):** official category https://www.bricodepot.es/catalogo/revestimientos. Current visible laminate examples included AC5 7 mm Albisola at €7.95/m² and AC5 7 mm Santa Fé at €8.95/m², with pack areas 2.669 m²; individual product listings include AC4 8 mm at €11.95/m². Brico Depôt states it is part of Kingfisher: https://www.bricodepot.es/informacioncorporativa
- **Use:** OBRAMAT and Brico Depôt are two distinct corporate groups for a Spain laminate cross-check; retain the tax-region distinction (IVA vs IGIC), sale status and pack coverage.
- **Do not use:** as a national range without a defined SKU sample and normalized tax/availability basis.


### Italy — OBI and Bricocenter laminate spot checks (15 November 2026)

**OBI Italia laminate category**
- https://www.obi-italia.it/search/pavimenti%20laminati/
- Current examples included 7 mm Standard rovere ghiaccio at €7.80/m² promotional (regular €12.00/m²), 8 mm Kaindl Smart Deal Rovere Ferrara at €12.57/m², 8 mm Smooth Oak at €12.00/m² and 8 mm Noce Newport at €13.49/m². Package coverage and package totals were shown for several listings.
- **Use:** additional independent retailer evidence beyond Leroy Merlin; preserve regular and promotional price separately.

**Bricocenter Italia laminate category**
- https://www.bricocenter.it/prodotti/default/legno-porte-e-pavimenti/pavimenti-laminati.html
- Visible listings included 7 mm Bela at €7.90/m² promotional, 8 mm Wayne at €11.06/m² promotional, and several 8–10 mm product lines between €11.17 and €22.08/m², with package totals and offer dates shown.
- Offers displayed explicit date windows (e.g. 11 November–8 December 2026) and varied by product/class.
- **Ownership correction:** Bricocenter is part of ADEO, the same corporate group as Leroy Merlin. Its listings are an additional product/banner check, not an independent retailer-group sample. Bricocenter's own corporate information confirms ADEO membership: https://www.bricocenter.it/wp-content/uploads/2023/07/BCI_Modello-231_2023-07-14.pdf
- **Use:** OBI is the independent corporate-group cross-check beyond Leroy Merlin; Bricocenter remains a same-group product-level comparison. The category mixes thickness, use class, brands and time-limited offers.
- **Do not use:** as a national Italy LOW–HIGH range or count Bricocenter and Leroy Merlin as independent observations.

### Netherlands — Praxis independent laminate spot check (15 November 2026)

**Praxis Netherlands laminate category / offers**
- https://www.praxis.nl/tegels-vloeren/laminaat/fl06/
- The category showed current per-m² examples including Baseline 6 mm at €6.39/m² (fixed low price), several 7–8 mm products around €7.49–€9.99/m² on promotion, and Quick-Step 8 mm at €34.99/m². Pack coverage was shown per listing.
- The offers page includes large discounts and Praxis Plus member prices, so promotional and member prices must be kept distinct from standard shelf prices.
- **Use:** independent retailer cross-check beyond HORNBACH for Dutch laminate.
- **Do not use:** as a market range; the category mixes brands, thickness, quality classes, member pricing and large promotions.

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
