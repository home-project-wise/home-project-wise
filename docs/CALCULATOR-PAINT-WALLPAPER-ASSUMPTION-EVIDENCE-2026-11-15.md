# Calculator paint and wallpaper assumption evidence — 2026-11-15

**Owner:** ChatGPT (research and data quality)  
**Related:** PR #364; source map and verified-evidence addendum; Issue #362; calculator data contract  
**Scope:** Source-level evidence audit. This memo does **not** approve generic numeric defaults or authorize a registry edit.  
**Retrieved:** 2026-11-15 unless a source revision date is stated.

## 1. Executive result

The eight supported markets now have opened manufacturer or product technical sources for interior-wall paint coverage. US, Canada, UK, Germany, Spain, Italy and the Netherlands each have at least two product/manufacturer references in this evidence pass; France currently has two product lines from one manufacturer, so independent corroboration remains missing there. However, the evidence is not sufficiently comparable to approve a single market-wide beginner default: paint class, hiding/opacity class, substrate, application method, coverage basis and coat recommendation differ materially.

**Decision:**
- Do not populate a generic country-level paint coverage or coat-count default in `data/reference_assumptions.json` yet.
- Keep wall-area calculation available from the shared room, but do not claim paint litres or tins from an unsupported coverage/coat assumption.
- Product-specific coverage may be stored as product-specific evidence only, with the exact product, source, surface and coat basis.
- Never treat package volume as wall coverage, or convert one manufacturer's pack size into another product's coverage.
- The sources below demonstrate why a single cross-market or cross-product rate is unsafe; they are not a pooled statistical sample.

## 2. Opened paint evidence by supported market

### United States (US)

**BEHR PREMIUM PLUS Interior Paint — manufacturer technical sheet / product page**
- Official product page: https://www.behr.com/pro/products/interior-products/interior-paints-and-coatings/paints-and-coatings/behr-premium-plus-interior/behr-premium-plus-flat
- Official technical sheet: https://s7d9.scene7.com/is/content/behr/1050_tds_uspdf-1
- Reported coverage: 250–400 sq ft per US gallon, depending on application method and substrate porosity; spray loss excluded.
- The technical sheet's system guidance includes two finish coats in the stated stain-blocking system. This is not evidence that every wall or colour needs exactly two coats.
- Technical sheet revision shown: 05/25.
- Permitted use: product-specific US interior-paint coverage and explicit caveats.
- Not permitted: generic US paint rate, universal two-coat rule, or extrapolation to primer/other paint classes.

### Canada (CA)

**Glidden SPEEDWALL Interior Latex 8150 — PPG/Dulux Canada technical sheet**
- https://buyat.ppg.com/REP_PafPaintTools_files/Glidden%20Canada/GN_8150_CAEN.pdf
- Practical coverage: 35–39 m² per 3.78 L (9–10 m²/L); excludes losses from surface irregularity/porosity and application/mixing.
- Flat interior latex finish coat for walls and ceilings; sheet dated 11/2017 and notes that some colours or drastic colour changes may require additional coats.
- Permitted use: second independent Canadian manufacturer/product example with a clearly disclosed older sheet date.
- Not permitted: a current national default; refresh the technical sheet before production use.

**Benjamin Moore REGAL Select Waterborne Interior — manufacturer Canada product page / sell sheet**
- Product page: https://www.benjaminmoore.com/en-ca/product/regal-select-waterborne-interior-paint-flat-3-78-l/F547
- Canadian sell sheet: https://media.benjaminmoore.com/WebServices/prod/FinalProductAssets/production/SellSheets/RegalSelect_Int_Brochure_CAN.pdf
- Reported coverage: 37.2–41.8 m² per 3.79 L can (theoretical coverage at recommended film thickness); product page rounds this to 37–42 m² / 3.79 L.
- Recommended coats: 1 or 2, not one unconditional coat count.
- The sell sheet is dated 12/20; the current product page was retrieved 2026-11-15.
- Permitted use: product-specific Canadian interior-paint coverage, package size and conditional coat guidance.
- Not permitted: market-wide Canadian paint default or an assumption that one coat is sufficient on every substrate.

### United States — second independent product family

**Benjamin Moore AURA Waterborne Interior — manufacturer US product page / sell sheet**
- Product page: https://www.benjaminmoore.com/en-us/product/aura-interior-paint-matte-1-gallon-porcelain-2113-60/N522/ZWB100000001867419
- US sell sheet: https://media.benjaminmoore.com/WebServices/prod/FinalProductAssets/production/SellSheets/Aura_Interior_Brochure_US.pdf
- Reported coverage: 350–400 sq ft per US gallon for named interior wall finishes; the product page lists 1 or 2 recommended coats.
- Permitted use: a second independent US manufacturer example, product-specific.
- Not permitted: assume every paint covers 350–400 sq ft/gal or that one coat is sufficient.

### United Kingdom (GB)

**Dulux Matt — manufacturer product page**
- https://www.dulux.co.uk/en/products/dulux-matt.html/cccId_1915096-page
- Coverage: up to 14 m²/L.
- Coats: 2.
- Interior walls and ceilings; pack formats shown from 2.5 L to 10 L.
- This is an upper stated coverage for a named Dulux product, not a guaranteed lower bound.

**Valspar Trade Vinyl Matt — manufacturer product page**
- https://www.valsparpaint.co.uk/valspar-trade/paint-products/trade-walls-ceilings/valspar-trade-vinyl-matt/
- Coverage: 16 m²/L; product calculator explicitly says its calculation is based on one coat.
- Trade/professional high-opacity product, available in 5 L and 10 L.
- Permitted use: two product-specific GB examples that expose different coat bases and product positioning.
- Not permitted: combine 14 and 16 into a generic UK range; Dulux's stated two coats and Valspar's one-coat calculator basis are not equivalent.

### Germany (DE)

**Alpina Wandweiß — manufacturer technical information**
- https://alpina-farben.de/fileadmin/InterfaceAssets/assets/pdf/TI_3442020250522.pdf
- Approx. 165 ml/m² per working coat on a smooth substrate (about 6 m²/L); rough surfaces require more.
- The technical information identifies the product for ordinary interior wall and ceiling substrates.

**Caparol interior-paint product-family table**
- https://www.caparol.de/fileadmin/data/pdf/English/FP/CAP120457_BRO_Caparol_Interior_Paints_EXC_EN.pdf
- Product-family table lists several interior paint classes with stated coverage values around 6–8 m²/L and differing opacity classes and package sizes.
- This is a family comparison, not one homogeneous product specification.
- Permitted use: product-specific German examples and evidence that opacity/product family affects coverage.
- Not permitted: average or range across all interior paints; roughness and product class must remain explicit.

### France (FR)

**Seigneurie Evolutex 2EN1 Mat — manufacturer product page**
- https://www.seigneuriegauthier.com/peintures/peintures-interieures/peintures-murs-plafonds/evolutex-2en1-mat
- Stated yield: 9–11 m²/L on smooth substrates; 7–9 m²/L on paintable fabric.
- Product page's built-in estimate explicitly says it is based on two coats.
- A second Seigneurie interior product page (Evolutex BC Mat) states 10–12 m²/L: https://www.seigneuriegauthier.com/peintures/peintures-interieures/peintures-murs-plafonds/evolutex-bc-mat
- These are two product lines from the same manufacturer, not independent market evidence.
- Permitted use: product-specific French coverage and substrate sensitivity.
- Not permitted: claim of a representative French market range; seek an independent French-market manufacturer before any generic default.

### Spain (ES)

**Grupo Puma Pumacril Interior — manufacturer product page**
- https://www.grupopuma.com/es-ES/productos/ver/pumacril-interior-es-es
- Theoretical yield: 7–9 m²/L, under UNE 48282; product instructions specify different dilution for first and subsequent coats.
- This is a named interior product, not a generic national standard.

**Caparol InnenColor — Spain manufacturer page**
- https://www.caparol.es/productos/productos-por-categorias/pinturas-de-interior-y-exterior/pinturas-de-interior/pinturas-esenciales/innencolor
- Yield: 12–14 m²/L per coat on smooth, moderately absorbent surfaces; intense colours may require an additional coat.
- These are different products and stated application conditions.
- Permitted use: product-specific Spanish examples; the spread itself cautions against a single unqualified coverage default.
- Not permitted: pool the two values into a generic Spain range.

### Italy (IT)

**Sikkens Alpha Rezisto Mat — manufacturer Italy product page**
- https://www.sikkens.it/it/prodotti/alpha-rezisto-mat/cccId_1477625
- Coverage: 13–14 m²/L per coat; explicitly varies with roughness, porosity, absorption and application system.
- Pack formats: 1 L, 5 L and 10 L.

**San Marco Group Pittura per Interni — manufacturer technical data**
- https://static.san-marco.com/new/SMG/Allegati/Novacolor/Pittura%20per%20Interni/Scheda%20tecnica%20html/IT_N150_pittura-per-interni.html
- Technical sheet revision: 2025-05-16.
- Yield: 3–5 m²/L for the two-coat system, depending on substrate type and absorption; advises a practical test on the actual substrate.
- Pack sizes: 5 L and 14 L.
- These are different named products and their coverage bases differ (per coat versus two coats).
- Permitted use: product-specific Italian examples and a strong warning against conflating per-coat and multi-coat yield.
- Not permitted: derive a market-wide Italian rate from these two products.

### Netherlands (NL)

**GAMMA Muurverf Mat — retailer own-brand product specifications**
- 1 L product: https://www.gamma.nl/assortiment/gamma-muurverf-mat-1-liter/p/B102962
- 2.5 L product: https://www.gamma.nl/assortiment/gamma-muurverf-mat-2-5-liter/p/B102723
- Both list 8 m²/L for indoor walls/ceilings; the product page advises primer on certain untreated/porous or contaminated substrates.

**Stiho Muurverf voor wand en plafond — product information sheet**
- https://www.stiho.nl/INTERSHOP/web/WFS/stihoGroep-Stiho-Site/nl_NL/-/EUR/ViewProductAttachment-OpenFile?DirectoryPath=&FileName=Stiho+Muurverf+20102021+v2.pdf&LocaleId=nl_NL&UnitName=stihoGroep-Stiho
- Theoretical yield: approx. 8–9 m²/L at 40 μm dry film; coverage class 1 at 8 m²/L.
- Sheet is dated 2021; treat as older product documentation.
- Permitted use: two NL product-specific references that are broadly close in stated yield, with the age of the Stiho sheet disclosed.
- Not permitted: a national default without checking current comparable independent products and exact product class.

## 3. Why these sources do not yet authorize a beginner paint default

The observed manufacturer statements are not directly interchangeable:

1. Some rates are per coat; others are for a two-coat system or an upper theoretical rate.
2. Substrate porosity, roughness, previous colour, primer, roller/spray method and film thickness change consumption.
3. Opacity class and paint formulation vary materially. The Italian examples alone demonstrate why a per-coat figure cannot be mixed with a two-coat system figure.
4. A product page's coat count is not a market-wide recommendation. Canada REGAL gives 1 or 2; Dulux Matt says 2; Valspar's calculator basis says 1.
5. A package size (e.g. 2.5 L, 5 L, 10 L) does not establish a generic coverage per tin.

**Release gate still unmet:** for a generic beginner-facing rate, collect a comparable set of ordinary interior wall matt/emulsion products per market, with at least two independent manufacturers, same coverage basis (per coat), similar substrate conditions and explicit coat guidance. Keep premium/high-opacity/one-coat products in separate subtypes. If that cannot be done, keep the quantity result as wall area only and explain that litres depend on the selected paint.

## 4. Wallpaper evidence and calculator boundary

**Sanderson official FAQ (UK manufacturer)**
- https://www.sanderson.design/faqs
- Standard Sanderson wallpaper roll: 10.05 m long × 52 cm wide; stated area 5.23 m².
- Wide-width wallcoverings are separate products: 6.89 m² or 13.78 m² per roll depending on width.
- Pattern matching is material: straight match, half-drop and random/free match are distinct.
- Sanderson's own quantity guidance calculates drops from wall width and roll width, then lengths from wall height plus pattern repeat; it adds a 5% trimming allowance in its worked example and warns that the calculator is approximate.
- This is strong evidence for Sanderson products and a clear example of why one total room area is not enough to calculate exact roll counts.

**Brewster Home Fashions — manufacturer wallpaper specifications**
- https://www.brewsterwallcovering.com/wallpaper-properties
- Explains that the common 20.5 in / 21 in format is typically 33 ft per bolt (double roll), while 27 in wallpaper is typically 27 ft per bolt; 36 in products have another length convention.
- Explains that design repeat can increase waste because matching may lose up to a repeat length on each strip.
- This is a manufacturer explanation of its product-family conventions, not a guarantee that every North American brand uses the same format.

**York Wallcoverings — named product examples**
- 27 in × 27 ft, double roll, about 60.8 sq ft, with a 24 in straight match: https://yorkwallcoverings.com/products/large-lattice-wallpaper
- 20.5 in × 20 ft, double roll, about 34.2 sq ft, with a 20.5 in straight match: https://yorkwallcoverings.com/products/synchronized-wallpaper
- These official product pages demonstrate that even within one manufacturer, width, length, coverage and pattern repeat differ by product family.

**Canadian retailer cross-check — Brewster product**
- https://kent.ca/en/20-1-2-x-33-paintable-white-tile-double-roll-wallpaper-1010354
- A Canadian retail product page lists a Brewster double roll at 20.5 in × 33 ft and 56 sq ft, with a 6.3 in straight pattern repeat. The page marks the item clearance / no longer available for delivery, so it is product-format evidence only, not a current price or market sample.

**Scandinavian Wallpaper FAQ**
- https://www.scandinavianwallpaper.com/pages/faq
- Explains North American single-roll/double-roll terminology and that one double roll is a sale unit containing two physical rolls; exact product dimensions and pattern repeat vary.
- This is a retailer's explanatory guidance, not a manufacturer-wide US/Canada standard.

**EN 234:2019**
- https://www.iteh.fr/catalog/standards/cen/6c0463ee-2f8b-4c33-a406-8a5173a91022/en-234-2019
- Standard summary addresses declared roll area and marking; its minimum declared area is not evidence of the typical roll size in every European market.

**Implementation/data decision**
- The Stage 1 shared room can provide a rough wall-area input, but total room perimeter × height does not determine exact wallpaper roll count when individual wall widths, door/window placement, roll width, pattern repeat and sale-unit convention are unknown.
- Claude may wire shared-room wall area into Wallpaper as an area-only estimate if the current calculator supports that output. Do not silently calculate rolls or pack costs from area alone.
- Exact roll count must remain product-specific and require wall/drop layout plus exact product dimensions, pattern repeat and sale unit. No universal wallpaper roll size or trimming percentage is approved.
- A generic 5% trimming allowance from Sanderson's own worked example must not be generalized to every brand, pattern, wall layout or supported market.

## 5. Recommended next data work

1. Obtain a second independent ordinary interior-matt product technical sheet for France and verify whether the product class and per-coat basis are comparable.
2. For each market, preserve product-specific examples in a source evidence table rather than averaging unlike products.
3. For US and Canada, find a second independent manufacturer with explicit coverage per coat and distinguish US gallon from Canadian/metric pack presentation.
4. For UK, separate standard retail emulsion from trade/high-opacity products.
5. For Germany, distinguish standard dispersion wall paint from high-opacity premium families.
6. For Spain and Italy, keep product class and coverage basis explicit; the current product examples are not comparable enough to support a single default.
7. For Netherlands, replace/refresh the older Stiho sheet with current documentation before relying on it.
8. Do not edit `data/reference_assumptions.json` or add generic defaults until the release gate above is met.

## 6. Role and implementation handoff

- **ChatGPT:** source verification, evidence grading, market/product comparability, assumption records and price/assumption registry.
- **Claude:** technical integration only after a specific assumption is approved; shared-room-to-Wallpaper wiring and Project-list area pricing are engineering tasks. Claude must not invent coverage, coats, roll sizes, trim allowances or prices.
- **Designer:** visual presentation and advanced-settings hierarchy only; no technical default selection.

No calculator code, CSS, workflow, canonical price values or eligibility flags were changed by this memo.
