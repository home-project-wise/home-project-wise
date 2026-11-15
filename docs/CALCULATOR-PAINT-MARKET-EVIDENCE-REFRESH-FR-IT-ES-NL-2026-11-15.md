# Paint market evidence refresh — FR, IT, ES, NL — 2026-11-15

**Owner:** ChatGPT — source research and data quality  
**Related:** #369, #373; `docs/CALCULATOR-ASSUMPTION-SOURCE-MAP-2026-11-15.md`; Issue #362  
**Retrieved:** 2026-11-15  
**Scope:** Additional manufacturer evidence for France, Italy, Spain and the Netherlands. This is product-specific evidence only, not approval for generic calculator defaults.

## Executive decision

The additional opened manufacturer sources provide useful product-specific technical coverage data in all four markets. They do **not** establish representative national LOW–HIGH practical coverage ranges or a common coat-count default.

- **FR:** Seigneurie Evolutex product pages report different yields by finish and substrate (for example, smooth substrates versus glass-fibre painting canvas). The product and substrate distinctions must remain explicit.
- **IT:** Caparol Italia publishes per-coat yield for InnenColor, but the accessible flyer is dated 11/2021 and its range is product-specific.
- **ES:** Caparol España's 2026 product catalogue gives per-coat ranges for several interior paint products and explicitly states practical yield depends on substrate absorption, texture and condition. These are still one manufacturer's product family, not an independent market sample.
- **NL:** Wijzonol Muurverf Mat has a current product information sheet stating theoretical and practical yield of 7–9 m²/L per coat, with practical yield dependent on substrate porosity and texture and a trial patch advised.

**No country-wide paint coverage or coat-count assumption is approved.** Do not populate `data/reference_assumptions.json` with these figures as country defaults. Retain them only as exact product-specific evidence unless a future product-selection flow is designed.

## Verified manufacturer evidence

### France — Seigneurie Evolutex

Official product pages:

- Evolutex 2en1 Velours: https://seigneurie.com/nos-produits/peintures-interieures/peintures-murs-plafonds/evolutex-2en1-velours-blanc-1l
  - Packaging: 1 L, 3 L, 15 L.
  - Average yield on smooth substrates: 9–11 m²/L.
  - Yield on painting canvas: 7–9 m²/L.
  - Recoat time: 4 hours, or wet-on-wet under the manufacturer's stated condition.
  - Application conditions: NF DTU 59.1; temperature above 8°C and relative humidity below 70%.
- Evolutex BC Velours: https://seigneurie.com/nos-produits/peintures-interieures/peintures-murs-plafonds/evolutex-bc-velours-blanc-1l
  - Packaging: 1 L, 5 L, 15 L.
  - Smooth substrates: 10–12 m²/L **per coat**; glass-fibre canvas: 7–9 m²/L per coat.
  - Recoat time: 2 hours.
- Evolutex BC Satin: https://seigneurie.com/peintures-peintures-interieures-peintures-murs-plafonds-evolutex-bc-satin-blanc-1l
  - Packaging: 1 L, 5 L, 15 L.
  - Approximately 12–14 m²/L per coat.

**Assessment:** These are different formulations/finishes and some are distinct product families (2en1 vs BC). Their values cannot be collapsed into one FR market range. The product page's available download link for the technical sheet should be opened and revision date checked before any structured product record is approved. Do not infer a default number of coats from the product name or recoat time.

### Italy — Caparol InnenColor

- Official Caparol Italia PDF flyer: https://www.caparol.it/fileadmin/data_it/Materiali_Informativi_PDF/Flyer_Caparol_InnenColor_LR_REV.pdf
- Product: InnenColor interior paint.
- Manufacturer states approximately 90–125 ml/m², equivalent to 8–11 m²/L.
- The flyer gives the rate as a product consumption/yield figure; its accompanying product instructions say to wait 4 hours before the second coat.
- For intense Base 3 colours with high colourant concentration, an additional coat may be necessary.
- The accessible flyer carries the code/date 417460 — 11/2021.

**Assessment:** Useful product-specific Italian evidence with an identifiable document date. It is not a national market sample, and the stated yield should not be presented as a guaranteed practical lower bound. Confirm the current Italian technical sheet and its exact application/coat basis before considering structured use.

### Spain — Caparol España

Official manufacturer sources:

- 2026 product catalogue: https://www.caparol.es/fileadmin/data_es/Web2023_Servicios/Catalogos_2023/PROGRAMA_PRODUCTOS_CAPAROL_2026_WEB.pdf
- CapaColor product page: https://www.caparol.es/productos/productos-por-categorias/pinturas-de-interior-y-exterior/pinturas-de-interior/pinturas-esenciales/capacolor
- CapaMatex product page: https://www.caparol.es/productos/productos-por-categorias/pinturas-de-interior-y-exterior/pinturas-de-interior/pinturas-esenciales/capamatex
- CapaCover product page: https://www.caparol.es/productos/productos-por-categorias/pinturas-de-interior-y-exterior/pinturas-de-interior/pinturas-esenciales/capacover

Evidence in the 2026 catalogue/product pages:

- CapaColor: 10–12 m²/L per coat; approximately 75–90 ml/m² per coat depending on substrate structure and absorption. Dark substrates being repainted white/pastel may need a diluted first coat as primer and two finish coats; low-opacity colours may need a more opaque base/primer.
- CapaMatex: 10–12 m²/L per coat, depending on dilution and surface condition.
- CapaCover: approximately 12 m²/L per coat, depending on dilution and surface condition.
- The catalogue explicitly warns that practical yield depends on substrate absorption, texture and condition.

**Assessment:** This is current 2026 manufacturer catalogue evidence for exact Spanish-market products. The three products differ in formulation and product position and come from the same manufacturer. They do not create an independent country-wide range. Preserve each product's own rate and warnings; do not take the minimum and maximum across these products and relabel them a market LOW–HIGH range.

### Netherlands — Wijzonol Muurverf Mat

- Official product page: https://www.wijzonol.nl/consument/verf/wijzonol-muurverf-mat
- Official product information sheet (PIB): https://www.wijzonol.nl/wp-content/uploads/wpallimport/files/documents/10093_nl_PIB_Wijzonol_Bouwverven_B.V._Wijzonol%20Muurverf%20Mat_1_1_1762319041007.pdf
- Interior matte water-dilutable wall paint; packs listed: 0.25 L, 1 L, 2.5 L, 5 L and 10 L.
- PIB states theoretical yield: 7–9 m²/L.
- PIB states practical roller yield: 7–9 m²/L **per coat**, depending on substrate porosity and structure; exact consumption should be determined with a trial patch.
- Recoat time: approximately 4 hours at 20°C / 65% RH.

**Assessment:** This is stronger than a headline-only web calculator because the product sheet distinguishes theoretical from practical yield and explicitly states per-coat basis. It remains one product from one manufacturer, not a national distribution. Do not assume all Dutch wall paints share this yield or that every project needs the same number of coats.

## Cross-market comparability and blockers

| Market | Evidence quality | Product/market scope | What is still missing |
|---|---|---|---|
| FR | Official product pages with substrate-specific yields and pack sizes | Seigneurie Evolutex variants and finishes | Open/review current TDS revision; independent comparable manufacturers; representative practical sample |
| IT | Manufacturer flyer with yield and identifiable 11/2021 date | Caparol InnenColor only | Current TDS and a second independent, comparable standard-matt product |
| ES | 2026 manufacturer catalogue plus product pages; per-coat values and substrate caveats | Multiple Caparol product families | Independent manufacturer evidence with matched finish/class and same per-coat basis |
| NL | Manufacturer product information sheet with theoretical and practical per-coat rate | Wijzonol Muurverf Mat | Second independent standard-matt TDS and representative sample |

A product-level per-coat yield is not a complete project quantity assumption. The calculator would still need a supported coat count, substrate state/absorption, primer treatment and package selection. None of those may be silently inferred from this evidence.

## Data and calculator decision

- Do not add these values to the generic country-level `reference_assumptions.json` registry.
- Do not compute a market range by taking the lowest and highest figures from unlike products, finishes or substrates.
- Keep per-coat yield distinct from total system coverage and theoretical from practical yield.
- Preserve the exact manufacturer, product, finish, substrate, units, package sizes, source URL, retrieval date and document revision date (or an explicit unknown reason).
- The current beginner flow may show gross wall area only. It must not infer litres, tins, coats or cost from these product-specific sources.
- A future product-specific path would need the visitor to choose the exact product/finish and confirm the substrate/application system, with source caveats displayed.

## Next research priorities

1. FR: download and inspect the current Evolutex BC / 2en1 technical sheets and revision dates; find a second independent French manufacturer with comparable standard interior matt TDS.
2. IT: locate the current Caparol InnenColor technical sheet and a second independent Italian standard-matt wall paint TDS.
3. ES: find a second manufacturer with explicit per-coat practical yield, matched to a common standard interior matt product.
4. NL: find a second independent Dutch standard-matt technical sheet with per-coat practical yield.
5. Across all four markets, keep the distinction between product-specific and market-level evidence; do not approve generic coat counts without independent comparable evidence.

## Ownership

ChatGPT owns source verification and assumption/data approval. Claude owns calculator implementation and must consume only explicitly approved structured assumptions. This document adds evidence only; it changes no price registry, assumption registry, calculator code, CSS, workflow or operations-room file.
