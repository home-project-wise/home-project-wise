# Paint market evidence refresh — 2026-11-15

**Owner:** ChatGPT — source research and data quality  
**Related:** merged PR #369; `docs/CALCULATOR-PAINT-WALLPAPER-ASSUMPTION-EVIDENCE-2026-11-15.md`; Issue #362  
**Retrieved:** 2026-11-15  
**Scope:** Additional opened manufacturer evidence for Canada, UK and Germany. This is an evidence update, not approval for generic runtime defaults.

## Executive decision

The additional sources strengthen product-specific evidence in Canada, UK and Germany. They still do not establish a defensible country-wide LOW–HIGH range for a beginner calculator:

- Canada now has current Valspar Canada product-page evidence from a manufacturer group independent of PPG/Benjamin Moore, alongside PPG/Sico technical-sheet evidence. The figures are different and the product instructions are conditional.
- UK Crown Standard Emulsion Matt provides a second standard-retail product example alongside Dulux Matt, both listing 14 m²/L and two coats. These are manufacturer-stated upper coverage values, not guaranteed practical lower bounds or an independent measured sample.
- Germany Brillux provides a current manufacturer product specification with consumption per coat and hiding-power class. It is a professional product family and does not establish a national market distribution.

**No generic paint coverage or coat-count assumption is approved.** Do not write these values into `data/reference_assumptions.json` as country defaults. Product-specific evidence may be retained with exact product, finish, substrate, film thickness, coat basis, package and caveats.

## New verified evidence

### Canada — Valspar Accolade Interior Paint + Primer

- Official Canada product page: https://www.valspar.ca/en/products/interior-paints-primers/accolade-interior-paint-primer
- Manufacturer states 37 m² per 3.78 L (400 sq ft per gallon).
- Product sizes: 946 mL and 3.78 L.
- Product page recommends one coat, but explicitly warns deep/bright colours, surface conditions and application techniques can reduce coverage and require multiple coats.
- Intended for properly prepared interior walls, trim and ceilings; substrates include previously painted or bare drywall, plaster, masonry, wood and primed metal.
- Use: current Canadian manufacturer evidence from the Sherwin-Williams/Valspar family, independent of the PPG/Sico and Benjamin Moore examples.
- Limitation: product page gives a stated coverage value, not a guaranteed minimum or a market-wide practical range. Its one-coat statement is conditional, not a universal coat default.

### Canada — SICO Expert 874-6XX (PPG)

- Official PPG-hosted Canadian technical sheet: https://buyat.ppg.com/REP_PafPaintTools_files/Sico/SC_8746XX_CAEN.pdf
- Product: 100% acrylic interior latex, platinum finish.
- Spreading rate **per coat**: 45–51 m² per 3.78 L (480–550 sq ft).
- Film thickness: 74–85 μm wet and 29–33 μm dry.
- Requires properly primed new surfaces or previously painted surfaces in good condition and properly prepared; some colours or drastic colour changes may require additional coats.
- Use: exact product-specific Canadian per-coat coverage and film-build basis.
- Limitation: a platinum finish product; not interchangeable with standard matte wall paint or with the Valspar one-coat claim. The sheet's current revision date was not established from the opened page, so retain it as undated until the PDF footer is inspected.

### United Kingdom — Crown Standard Emulsion Matt

- Official product page example: https://cd01.crownpaints.co.uk/products/standard-emulsion/matt/liqueur/171
- Crown's calculator lists 14 m²/L and two recommended coats for the standard matt emulsion.
- Painting guidance says porous/new plaster may need a diluted sealing coat and some colours may require additional coats.
- A second Crown colour page reports the same 14 m²/L and two-coat recommendation: https://cd01.crownpaints.co.uk/products/standard-emulsion/matt/beige-white/136
- Use: second standard-retail matt product family example alongside Dulux Matt (up to 14 m²/L, two coats).
- Limitation: both sources are manufacturer calculator/product pages and state a coverage figure rather than a measured practical yield range. Do not interpret 14 m²/L as a guaranteed minimum or calculate a generic litre range from it. Crown's page notes its old web shop no longer sells directly.

### Germany — Brillux Superlux 3000

- Official manufacturer product page: https://www.brillux.com/products/160475_de_superlux-3000/
- Interior dull-matt emulsion; wet-abrasion resistance class 2.
- Hiding power class 1 at 7 m²/L (white).
- Consumption: approximately 130–150 ml/m² per coat, equivalent to approximately 6.67–7.69 m²/L per coat.
- Manufacturer describes it as a high-quality product for larger contiguous surfaces, including surfaces exposed to grazing light.
- Use: current product-specific German evidence with per-coat consumption and EN 13300 hiding-power context.
- Limitation: professional high-quality product; its declared class/consumption basis cannot be generalized to all standard German interior paints.

## Comparability assessment

| Market | New evidence | What it changes | What remains blocked |
|---|---|---|---|
| CA | Valspar Accolade; SICO Expert | Adds a manufacturer family independent of PPG/BM; provides current product page plus exact per-coat technical sheet | Different finishes, film build and conditional coats; no generic national range |
| GB | Crown Standard Emulsion Matt | Adds a second standard-retail matt product with two-coat guidance alongside Dulux Matt | Both figures are upper manufacturer claims; no defensible lower practical bound or representative sample |
| DE | Brillux Superlux 3000 | Adds current product-specific per-layer consumption and hiding-power class | Professional product class; no national sample or generic rate |

## Data and calculator decision

- No `reference_assumptions.json` default values are approved by this refresh.
- Do not combine values from different finish classes or product positions into a single market range.
- Do not assume one coat from a product's headline "one coat" claim; preserve the manufacturer's conditional warnings.
- Do not infer a practical coverage floor from a maximum or "up to" statement.
- The calculator may continue to show wall area only until the visitor selects a supported product or the evidence supports a genuinely comparable market-level assumption.
- If a future product-selection path is implemented, exact product-specific records must retain publisher, URL, retrievedAt, observedAt/revision date (or null with reason), finish, substrate, per-coat/system basis, film thickness and package details.

## Next research gaps

1. Canada: find a current independent standard-matt Canadian manufacturer TDS with per-coat practical coverage and explicit film thickness, comparable to a common residential wall finish.
2. UK: seek a second manufacturer TDS with practical per-coat yield, not only an upper web-calculator claim; separate standard retail matt from trade/high-opacity paint.
3. Germany: compare current product-level TDS for standard dispersion paint from a second manufacturer against Brillux, with the same hiding-power class and per-coat basis.
4. France: retrieve Seigneurie Evolutex's underlying TDS and confirm whether its displayed yield is per coat or system total.
5. For all markets, preserve the distinction between theoretical, practical, per-coat and multi-coat coverage.

## Ownership

ChatGPT owns evidence and data approval. Claude owns calculator implementation and must consume only an explicitly approved assumption record. No code, CSS, workflow, price registry, assumption registry or operations-room file is changed by this memo.
