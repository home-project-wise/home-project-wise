# Paint assumption evidence follow-up — 2026-11-15

**Owner:** ChatGPT (research and data quality)  
**Related:** PR #364 (merged), Issue #362, `docs/CALCULATOR-PAINT-WALLPAPER-ASSUMPTION-EVIDENCE-2026-11-15.md`  
**Scope:** Additional manufacturer-level evidence found after PR #364. Product-specific claims only; no market-wide coverage or coat defaults approved.  
**Retrieved:** 2026-11-15

## Executive result

This follow-up adds additional opened manufacturer/technical-sheet evidence in the US, Canada, France, Germany, Spain, Italy and the Netherlands. It improves the evidence map but does **not** remove the main comparability blocker: product classes, film thickness, substrate, opacity, practical/theoretical coverage and coat basis are not consistently equivalent.

**Decision remains unchanged:** do not add generic country-level paint coverage or coat-count records to `data/reference_assumptions.json`. Keep the beginner result at wall area until a selected product or a defensible comparable market class supplies coverage and coat instructions. Product-specific records may be considered only when the calculator has an explicit product-selection path and the exact product is matched.

## Additional verified evidence

### United States — Sherwin-Williams Cashmere Interior Acrylic Medium Lustre

- Technical document: https://sherlink2.sherwin.com/sher-link/ViewHearsCountryCodeDoc?language=E&sku=650406846&type=DP
- Product class: residential interior acrylic medium-lustre finish.
- Coverage: 350–400 sq ft per US gallon at 4 mil wet / 1.5 mil dry film.
- Coat guidance is substrate-dependent: two finish coats for drywall, plaster, masonry and wood systems in the listed preparation paths; previously painted surfaces may use 1–2 coats. Primer is separately required or recommended for several substrates and hiding/color-change conditions.
- Document revision/date shown: 12/2024.
- Permitted: exact product-specific US coverage and substrate-specific system notes.
- Not permitted: universal US coverage or universal two-coat assumption.

### Canada — Benjamin Moore ben Interior (additional product-family evidence)

- Canadian sell sheet: https://media.benjaminmoore.com/WebServices/prod/assets/production/sellsheets/ben_Interior_SellSheet_CAN.pdf
- Coverage: theoretical 37.2–41.8 m² (400–450 sq ft) per 3.79 L at recommended film thickness for listed interior finishes.
- Recommended film thickness is the basis; the sheet does not turn this into a universal practical yield. The sheet is dated 2022.
- Current Canadian product page also lists 37.2–41.8 m² per 3.79 L and 1 or 2 recommended coats: https://www.benjaminmoore.com/en-ca/product/ben-interior-paint-eggshell-3-78-l-glacier-white-oc-37/F626/ZWB100000002047011
- This is another Benjamin Moore product family, not an independent manufacturer relative to Regal Select. It supplements but does not replace the older Glidden Canada technical sheet already in the evidence audit.
- Permitted: product-specific Canadian theoretical coverage and explicit coat range.
- Not permitted: market-wide Canadian default; do not count several Benjamin Moore lines as independent manufacturers.

### France — Seigneurie Evolutex 2EN1 Mat

- Official product page: https://www.seigneuriegauthier.com/peintures/peintures-interieures/peintures-murs-plafonds/evolutex-2en1-mat
- Interior matte acrylic/alkyd dispersion for walls/ceilings and named living spaces.
- Manufacturer lists 9–11 m²/L on smooth substrates and 7–9 m²/L on paintable fabric; the page also exposes a quantity calculator explicitly based on two coats.
- The coverage field itself is not explicitly labelled per coat; do not silently reinterpret it as a per-coat figure.
- Permitted: product-specific coverage with substrate class and two-coat calculator context preserved.
- Not permitted: merge this with the Tollens 8–10 m²/L-per-coat figure as if the bases were identical.

### Germany — Caparol interior-paint catalogue (historical cross-check only)

- Manufacturer PDF: https://www.caparol.de/fileadmin/data/pdf/English/FP/CAP120457_BRO_Caparol_Interior_Paints_EXC_EN.pdf
- Catalogue table contains several distinct interior products and coverage/consumption entries, including 6–8 m²/L and 125–150 ml/m² rows; product categories, scrub classes and finishes differ.
- The document is old (approximately 2012 by indexed metadata) and the extracted catalogue table is not a current product-specific technical sheet.
- Permitted: historical evidence that even one manufacturer's interior-paint families have materially different coverage classes.
- Not permitted: current German default or a pooled Caparol range. Replace with current German product TDS documents before considering runtime use.

### Spain — VALPAINT L-3000

- Manufacturer technical sheet: https://media.adeo.com/media/4819910/media.pdf
- Product: matte acrylic interior wall/ceiling paint (also listed for protected exterior use).
- Coverage: 9–10 m²/L at 100 microns wet per coat.
- Manufacturer recommends a minimum of two coats; package formats 4 L and 14 L.
- Sheet revision: December 2024.
- Permitted: exact product-specific yield, film thickness, coat recommendation and package formats.
- Not permitted: generic Spanish paint coverage. Do not combine with other product yields without matching the film-thickness and application basis.

### Italy — Boero / Attiva MUR.AT

- Manufacturer technical sheet: https://attivacolori.it/wp-content/uploads/prodotti/schede_tecniche/ST_MUR.AT_.pdf
- Product: matte breathable professional interior wall paint for plaster and previously painted substrates.
- Coverage: 10–12 m²/L per coat.
- Technical classification reports contrast ratio class 2 at 8 m²/L; application system specifies one suitable primer coat plus two finish coats on new substrates or specified older paint systems.
- This is a product-specific professional/humidity-oriented product; the primer/finish system matters.
- Permitted: exact product-specific yield and system notes.
- Not permitted: generic Italian market default or a two-coat assumption detached from its substrate preparation.

### Netherlands — Wijzonol Muurverf Mat and Sikkens Muren & Plafonds

**Wijzonol Muurverf Mat**
- Product information sheet: https://www.wijzonol.nl/wp-content/uploads/wpallimport/files/documents/10093_nl_PIB_Wijzonol_Bouwverven_B.V._Wijzonol%20Muurverf%20Mat_1_1_1762319041007.pdf
- Interior matte wall paint for mineral substrates and well-adhering wallpaper.
- Practical roller coverage: 7–9 m²/L per coat, dependent on substrate porosity and structure; test area advised.
- Sheet version shown: v1.1; source file indexed in 2025.

**Sikkens Muren & Plafonds**
- Technical sheet: https://prdakzodecodocumentssa.blob.core.windows.net/public/tds/s1/nl/nl/sikkens_muren_en_plafonds_tds.pdf
- Matte interior wall/ceiling paint; approx. 11 m²/L, dependent on application method and substrate roughness/structure/porosity.
- Technical sheet dated 27 February 2025.
- System information says one to two finish coats, with primer on specified absorbent/powdering or otherwise problematic substrates.
- Permitted: two product-specific NL examples; preserve per-coat and coat-count differences.
- Not permitted: convert 7–9 and approx. 11 into a national default. The products and performance bases are not demonstrated to be directly comparable.

## Comparability and release decision

| Market | Additional evidence | Current conclusion |
|---|---|---|
| US | Sherwin-Williams Cashmere | Adds a second independent manufacturer family alongside BEHR/BM, but film build and substrate/coat systems still vary; product-specific only |
| Canada | Benjamin Moore ben Interior | Additional BM line, not a new independent manufacturer; Glidden source remains old; no national default |
| GB | No new source in this follow-up | Existing Dulux/Valspar/KEIM evidence remains product-specific and not directly pooled |
| DE | Caparol catalogue | Historical multi-product cross-check only; obtain current TDS |
| FR | Seigneurie Evolutex 2EN1 | Product-specific; coverage basis is not explicitly per coat, so keep separate from Tollens |
| ES | VALPAINT L-3000 | Product-specific per-coat yield with 2-coat minimum; not generic |
| IT | Boero/Attiva MUR.AT | Product-specific per-coat yield; professional product and defined substrate system |
| NL | Wijzonol and Sikkens | More than one product family, but differing rates and system details; not a generic national range |

No new default is approved. No numeric values should be written to `data/reference_assumptions.json` from this follow-up.

## Exact next research actions

1. Canada: refresh the older Glidden technical sheet or find a current independent manufacturer TDS with a comparable interior matte wall finish and per-coat basis.
2. US: compare Cashmere with BEHR and Benjamin Moore using identical finish class, substrate and wet/dry film thickness before deciding whether a broad beginner range is meaningful.
3. GB: find a second standard retail matt/emulsion product comparable to Dulux Matt; keep trade/high-opacity products separate.
4. DE: replace the old Caparol catalogue with current product-level German TDS files for standard dispersion interior wall paint.
5. FR: obtain the actual Seigneurie TDS and verify whether the listed yield is per coat; keep Tollens separate until bases match.
6. ES/IT/NL: retain product-specific evidence; only consider market ranges after exact subtype and coverage-basis normalization is demonstrated.
7. Do not infer pack coverage from package volume. Do not infer coats from a coverage statement. Do not derive a midpoint from product ranges.

## Scope and ownership

- ChatGPT: evidence verification, comparability decisions, and any future assumption registry values.
- Claude: technical integration only after an approved, explicit assumption record exists.
- No calculator code, CSS, workflow, canonical price values, eligibility flags or operations-room files were changed by this follow-up.
