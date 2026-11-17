# Wallpaper beginner area-cost assumptions — 2026-11-17

**Owner:** ChatGPT research/data lane  
**Implementation handoff:** Claude, calculator lane  
**Issue:** #402  
**Owner decision:** one broad, clearly labelled low/high sample envelope per supported market. Approval is recorded in Issue #402 by Claude on 2026-11-17.

## Runtime scope

The new records in `data/reference_assumptions.json` support only a beginner **area-based material budget**:

`selected market net wall area (m²) × market low/high price (currency/m²)`

Each endpoint is calculated from one exact product page: retailer-displayed price per roll ÷ stated nominal roll coverage. If the retailer does not state a separate coverage figure, nominal coverage is roll width × roll length. For stated square-foot coverage, convert with `1 sq ft = 0.09290304 m²`. Values in the registry are rounded to four decimal places. The price is a nominal-area normalization, not a practical-yield rate.

## Approved market envelope

| Market | Currency | Low / m² | High / m² | Low endpoint / high endpoint |
|---|---|---:|---:|---|
| US | USD | 12.2481 | 17.4988 | $34.99 NW31700 / $49.99 LX10005 |
| UK | GBP | 5.9457 | 7.0816 | £31.67 self-adhesive / £37.72 non-woven |
| Canada | CAD | 9.6068 | 26.2149 | CAD 49.98 Holden / CAD 74.89 Galey Alix |
| Germany | EUR | 3.5201 | 3.7454 | €18.75 A.S. Création / €19.95 Grandeco |
| France | EUR | 6.4583 | 8.0541 | €34.40 Livingwalls / €42.90 A.S. Création |
| Spain | EUR | 2.4509 | 6.6019 | €12.99 GRANDECOLIFE / €34.99 RASCH |
| Italy | EUR | 5.2549 | 8.4464 | €27.99 Foglie / €44.99 Tela |
| Netherlands | EUR | 8.9623 | 13.7989 | €47.50 Dutch Wallcoverings / €73.50 Duro |

The two endpoint products, exact product URLs, SKU/reference, roll dimensions, nominal area, product class, source dates and tax notes are structured individually in each market record's `sources` array. The direct product pages and the research evidence file in PR #411 were rechecked on 2026-11-17. Canadian product snapshots retain their earlier observation dates (2026-10-15 and 2026-09-26); `retrievedAt` is 2026-11-17.

## Product-class and retailer caveats

- US: both endpoints are vinyl peel-and-stick.
- UK: self-adhesive vinyl at the low endpoint and patterned non-woven at the high endpoint; both are B&Q online-only third-party Bricoflor listings, not store stock.
- Canada: traditional non-pasted wallpaper at the low endpoint and premium peel-and-stick vinyl at the high endpoint.
- Germany: both endpoints are non-woven; individual HORNBACH product URLs are supplied.
- France: both are vinyl surface on non-woven backing; low endpoint is sold by third-party Profistuck.
- Spain: both are vinyl wallpaper sold by Leroy Merlin.
- Italy: both are vinyl / non-woven products sold by Leroy Merlin.
- Netherlands: non-woven products; BAUHAUS low endpoint displays VAT included; Praxis high endpoint is a standard product page, not Praxis Plus.

This is the owner-approved broad mixed-product sample-envelope approach for a simple beginner path. It is not like-for-like by construction and must not be described as a national average, median or statistically representative market range. Display: **“Approximate sample price range — prices vary by product type and retailer.”**

## Explicitly quarantined legacy data

All 12 old `category=wallpaper` rows in `data/reference_prices.json` remain `autoEligible:false` and now carry `quarantineReason`. They are retained for audit/history only; they must not be selected alongside the new assumption records. The unreproducible US IQR (12 original SKUs and observations missing) is explicitly quarantined. Also excluded: the old unsupported France band, Germany 12-roll bulk price, UK out-of-stock endpoint, and Netherlands Praxis Plus member promotions.

## What the estimator must not infer

- No roll count, strip count or package count.
- No pattern-repeat, seam overlap, trim, offcut or waste allowance.
- No paste/adhesive, primer, tools, delivery, labour or installation.
- No FX, cross-market fallback, national-average claim or guaranteed quotation.
- No tax-inclusive/exclusive claim except where the exact source explicitly says so.

Roll planning remains a separate blocked feature until market/product-specific cut-yield, wall-height, pattern-repeat, trim and offcut assumptions are sourced and approved.

## Data changes

- Add eight approved-initial records to `data/reference_assumptions.json`, one per supported market, with two structured exact-product endpoints each.
- Keep all legacy wallpaper records in `data/reference_prices.json` false and add explicit quarantine reasons.
- No calculator code, UI, test, workflow or deployment changes.
