# Wallpaper assumption evidence follow-up — 2026-11-15

**Owner:** ChatGPT — research and data quality  
**Related:** Issue #362; `docs/CALCULATOR-BEGINNER-FLOW-TECHNICAL-DESIGN-2026-11-15.md`; `docs/CALCULATOR-PAINT-WALLPAPER-ASSUMPTION-EVIDENCE-2026-11-15.md`  
**Retrieved:** 2026-11-15  
**Purpose:** Additional primary/industry evidence on roll conventions, declared dimensions, pattern repeat and usable yield. This is not approval for a generic wallpaper roll-size or waste default.

## Executive decision

The shared-room calculator can safely show a **gross wall-area estimate** from room perimeter × wall height, with user-entered openings optionally subtracted. It must not infer roll count or wallpaper purchase cost from this area alone.

The evidence confirms two important points:

1. European roll-form conventions often use a nominal 10.05 m × approximately 0.53 m roll (about 5.3 m²), but wider and specialty wallcoverings are also sold, and standards define product classes and declared dimensions rather than a universal market pack.
2. North American wallpaper is especially sensitive to the distinction between a priced single-roll unit and physical double/triple-roll packaging. A published single-roll usable yield of 25 sq ft is not the same as the physical roll's gross area.

Exact roll count requires each wall's width and height, product usable width/length, sale-unit convention, pattern repeat and match type, plus any product-specific trimming instructions. The current shared-room inputs do not contain enough geometry.

## Verified sources and what they support

### North America — Wallcoverings Association (industry association)

- Source: https://www.wallcoverings.org/page/ResUnderWallpaper
- Explains wallpaper width varies by manufacturing equipment.
- Metric/Euro single rolls: approximately 27.5–29 sq ft; double rolls: 56–58 sq ft.
- Traditional American single rolls: approximately 36 sq ft; double bolts: approximately 72 sq ft; triple bolts: approximately 101–108 sq ft. It notes American single rolls are being phased out.
- Pattern repeat can range from under an inch to the width of the wallpaper or more; matching type matters.
- Use: strong industry explanation of why sale-unit labels and roll-area conventions cannot be collapsed into one North American number.
- Limitation: association guidance is not a dated current retailer survey and does not prove every US or Canadian product follows one convention.

### United States — Sherwin-Williams homeowner guidance

- Source: https://www.sherwin-williams.com/homeowners/how-to/wallpapering-how-tos/sw-article-dir-howmuchtobuy
- States that its planning convention treats a **single roll as 25 usable sq ft**, while wallpaper is priced by single rolls but supplied in double or triple rolls.
- Pattern repeat varies by product and can range from 0 to 23 inches in the guide.
- Advises considering an extra roll for shortage/repair, but does not establish a universal percentage.
- Use: demonstrates a US retail/estimation convention and the distinction between pricing unit and physical package.
- Limitation: do not generalize the 25 sq ft figure to all US brands or products; the source itself requires product repeat and actual covered area.

### United Kingdom — Sanderson and Sandberg manufacturer FAQs

**Sanderson**
- Source: https://www.sanderson.design/faqs
- Its standard roll is 10.05 m × 52 cm; wide-width products are separate and can have substantially different coverage.
- Defines straight match, half-drop and random/free match.
- Its worked quantity example uses wall widths and height plus pattern repeat and includes a 5% trimming allowance.
- Use: product-family evidence and a practical example of why room area alone does not determine roll count.
- Limitation: Sanderson's 5% example is not a universal UK waste allowance.

**Sandberg**
- Source: https://sandbergwallpaper.com/uk/faq
- Traditional rolls are 53 cm × 10.05 m and described as double rolls.
- Its own calculator asks for wall measurements and calculates the number of drops; murals use a different made-to-measure system.
- Use: independent UK-facing manufacturer corroboration for one common traditional roll format and the need for wall measurements.
- Limitation: two manufacturers' similar traditional roll dimensions do not establish every UK brand or specialty product.

### European product-format evidence — ERFURT / A.S. Création

- Source: https://www.erfurt.com/fileadmin/download/service/brochures/international_e_collection.pdf
- Product catalogue shows a standard product at 10.05 m × 0.53 m (5.3 m²) and a separate wide format at 25 m × 0.75 m (18.75 m²); package counts differ.
- This is manufacturer product catalogue evidence, not a national market average.
- A.S. Création technical sheet: https://www.fargerike.no/globalassets/importedresources/n/pdf/tm_wg_16_en.pdf
- Lists 10.05 m × 0.53 m, 10.05 m × 0.70 m, and 10.05 m × 1.06 m formats for the manufacturer's wallcovering family.
- Use: proves that even within EU-oriented product families, widths and sale/pack formats vary.

### Germany / EU retail examples — A.S. Création products

- B&Q product examples (German-made A.S. Création): https://www.diy.com/departments/white-plain-vinyl-wallpaper-10-05m-x-53cm-for-living-room-bedroom-and-hallway-ref-b790913/4051315693056_BQ.prd and https://www.diy.com/departments/white-plain-vinyl-wallpaper-10-05m-x-53cm-for-living-room-bedroom-and-hallway-ref-b790973/4051315693674_BQ.prd
- Both list 10.05 m × 0.53 m (about 5.33 m²), but are individual SKUs and free-match products.
- Use: SKU-level examples only; not a national German default or evidence for France, Spain, Italy or the Netherlands.

### European standard — EN 233:2016 / EN 234:2019 summaries

- EN 233 sample: https://cdn.standards.iteh.ai/samples/59403/e4630788ab84446e8d8ad0977585634e/SIST-EN-233-2017.pdf
- EN 233 category 1 specifies usable roll area 5.326 m² ±3%, nominal width 500–530 mm, with marked nominal width and length. Category 2 has a different width class (at least 600 mm).
- EN 234 overview: https://www.iteh.us/catalog/standards/cen/6c0463ee-2f8b-4c33-a406-8a5173a91022/en-234-2019
- EN 234 addresses roll-form wallcoverings intended for subsequent decoration, including marking, dimensions and match/application/removal symbols. The stated minimum declared area belongs to that standard's scope and exclusions.
- Use: technical boundary for specified standard categories.
- Limitation: a minimum declared area is not proof of a typical roll size in each country and does not cover every finished, vinyl, textile, mural or specialty wallcovering.

## Country-level conclusion for the eight supported markets

| Market | Evidence position | Runtime default decision |
|---|---|---|
| US | Association and Sherwin-Williams explain single-roll usable yield vs double/triple packaging; individual brands differ | No generic roll size or usable-yield default |
| CA | North American convention sources are informative, but no current representative Canadian manufacturer/retailer sample was established in this pass | No Canadian default |
| GB | Sanderson and Sandberg corroborate 10.05 m × 52–53 cm for their traditional products; wide-width and murals differ | No universal GB roll default |
| DE | EU standard categories and A.S. Création/ERFURT examples; specialty widths exist | No universal DE default |
| FR | No adequate independent French-market sample in this pass | No FR default |
| ES | No adequate independent Spanish-market sample in this pass | No ES default |
| IT | No adequate independent Italian-market sample in this pass | No IT default |
| NL | No adequate independent Dutch-market sample in this pass | No NL default |

Do not copy one European manufacturer's 10.05 × 0.53 m SKU into all eight markets. Do not treat the EU standard's minimum declared area as a market average. Do not treat the US single-roll pricing unit as the physical double-roll package.

## Calculator implications

### Safe now
- Claude may connect the shared-room wall-area result to the Wallpaper tab as a **gross wall-area figure**, optionally subtracting only openings the visitor actually entered.
- State clearly that it is an area estimate, not a roll or purchase estimate.
- Keep per-wall inputs available for users who want to calculate actual drops.
- Do not apply an automatic trimming percentage.

### Not safe without additional inputs
- Number of rolls, bolts, double rolls or packages.
- Wallpaper material cost from a generic area price.
- Any universal roll size or pattern waste percentage.

### Minimum data required for a future exact product calculator
- Per-wall width and height (not only total perimeter), and opening dimensions/locations if deductions are made.
- Product usable roll width and length.
- Explicit sale unit (single roll, double roll, bolt, package, panel or mural).
- Pattern repeat and match type (free/random, straight, half-drop, offset).
- Manufacturer's product-specific yield/installation instructions and batch/lot consistency warning.
- A calculation method that accounts for full drops and unusable offcuts, not simply wall area ÷ gross roll area.

## Next research actions

1. Canada: obtain current product-level Canadian wallpaper specs from at least two independent retailers/manufacturers, preserving single/double-roll unit and stock status.
2. France, Spain, Italy and Netherlands: identify local manufacturer/retailer product pages with explicit roll dimensions and match/repeat for country-specific examples; do not assume the same brand's EU catalogue implies local market representation.
3. US: compare at least two current brand product specification pages against the Wallcoverings Association and Sherwin-Williams guidance; record whether the product is priced by single roll but shipped as double/triple.
4. Keep any future data product-specific unless the evidence supports a clearly defined market convention and comparable sample.
5. No numeric wallpaper defaults are approved by this memo.

## Ownership
- ChatGPT: source research, evidence and assumption approval.
- Claude: shared-room integration and calculator logic only; no invented roll defaults or roll count from total room area.
- Designer: visual presentation only.

No code, CSS, workflow, price registry, assumption registry or operations-room file is changed by this memo.
