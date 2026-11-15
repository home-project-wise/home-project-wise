# Calculator assumptions — verified evidence addendum

**Date:** 2026-11-15  
**Related PR:** #364  
**Scope:** Additional source-level verification. This addendum does not approve market-wide numeric defaults.

## Verified source claims

### Paint: product-specific evidence, not a universal default

| Market / source | Verified claim | Permitted use | Not permitted |
|---|---|---|---|
| Germany / KEIM Innostar | Manufacturer product page describes an interior wall/ceiling paint; consumption approx. 125 ml/m² for a single coat; pack sizes 5 L and 12.5 L. https://www.keim.com/products/interior-paints/innostar/ | Product-specific example of a high-opacity, single-coat product. | Do not generalize to ordinary wall paint or all German products. |
| Italy / MAPEI Dursilite Igea | Manufacturer TDS says 9–11 m²/L per coat under normal conditions; coverage depends strongly on substrate absorption/roughness and application method; two finish coats; packaging 1, 4 and 14 L. https://cdnmedia.mapei.com/docs/librariesprovider2/products-documents/1_06209_dursilite-igea_en_b46e473322be4b79b373a385e2b809a1.pdf | Product-specific technical record, with the two-coat recommendation and substrate caveats. | Do not present as a representative Italian-market range; it is a professional mould-resistant product. |
| Finland-origin / Stark RAW 7 | TDS states 8–11 m²/L and can sizes 2.7, 9 and 18 L. https://content.stark-suomi.fi/BX14/DATA%20-%20RAW-7%20Interior%20paint_%20EN_.pdf | Cross-check that real manufacturer ranges vary; not one of the eight supported markets. | Do not use as a country default in the eight-market registry. |
| United Kingdom / KEIM Innostar | UK product page publishes approx. 125 ml/m² for one coat and 5 L / 12.5 L packs. https://www.keim.com/en-gb/products/interior-paints/innostar/ | UK product-specific example, same product family as the German page. | Do not count the German and UK pages as independent evidence; same manufacturer/product family. |

**Finding:** manufacturer sheets provide credible coverage and coat data, but the sources currently collected do not yet form two independent, comparable products for every approved market. Therefore no general paint coverage or default coat count should be entered into the registry yet. The calculator can still show wall area and explain that paint volume depends on the selected product and surface. A product-specific record can be supported when the user chooses that product.

### Flooring: the allowance is layout- and material-dependent

| Source | Verified claim | Permitted use | Not permitted |
|---|---|---|---|
| EarthWerks glue-down LVT/LVP installation instructions (2022) | Advises adding 5–10% for cutting waste; also says plan installation direction and evaluate the site. https://www.adleta.com/jm-resources/Installation/EarthWerksLVT-Installation-Instructions.pdf | Evidence for a product-family-specific LVT/LVP planning allowance, subject to checking current manufacturer instructions. | Not a universal LVT rule or a country-wide default. |
| Kährs UK flooring FAQ | Recommends approx. 5% waste; for more complex herringbone/chevron/stairs, around 7–10%. https://www.kahrs.com/uk/b2b/faq/faq-floor | Evidence that layout complexity changes the allowance for Kährs flooring products. | Not directly comparable with glue-down LVT; do not pool into one material-wide range. |
| LL Flooring engineered wood guide | Describes cutting allowance, rounds quantities up to boxes, and warns actual waste varies with room layout and pattern. It also notes a separate manufacturer tolerance for certain products. https://www.llflooring.com/assets-sub/image/upload/v1709844115/WIC%20PDFs/2024/engineered/bwwd-eply-nd-gd-egf-wall-r-100-5-2-14-2024_1_ca3jnr.pdf | Evidence that engineered wood may have separate product tolerance and cutting allowance considerations. | The extracted text does not provide a universally applicable percentage; do not invent one from this guide. |

**Finding:** retain flooring allowance as a visible optional refinement until we have comparable evidence by material and layout class. Do not silently apply a single default percentage. Do not combine manufacturing tolerance, cutting waste and spare stock into one percentage.

### Wallpaper: the sale unit and roll dimensions are not universal

| Market / source | Verified claim | Permitted use | Not permitted |
|---|---|---|---|
| UK / Sanderson official FAQ | Standard roll for its products is 10.05 m long × 52 cm wide, with stated standard coverage 5.23 m²; it distinguishes wide-width products and gives separate coverage. https://www.sanderson.design/faqs | Product-family-specific UK example and proof that width class matters. | Not a universal UK roll size. |
| US-facing retailer / Scandinavian Wallpaper FAQ | Explains that "double roll" is a common European convention, is still one physical roll, and that its regular rolls are approx. 33 ft × 21 in; exact dimensions and pattern repeat vary by product. https://www.scandinavianwallpaper.com/pages/faq | Explains the terminology trap and product-specific dependency. | Do not use this single retailer's approximate size as a North American industry default. |
| EN 234:2019 standard summary | The standard's stated minimum declared roll area is 5.326 m² with tolerances and marking requirements; it identifies pattern-match symbols. https://www.iteh.fr/catalog/standards/cen/6c0463ee-2f8b-4c33-a406-8a5173a91022/en-234-2019 | Compliance/label interpretation for in-scope roll-form wallcoverings. | A minimum area requirement is not evidence of a typical roll size or expected usable coverage. |
| Imogen Heath product page | Named UK-produced products show 52 cm × 10.05 m rolls with product-specific straight/half-drop repeats. https://www.imogenheath.com/journal/introducing-our-beautiful-new-wallpaper-designs | Corroborates a common product format for those named products and demonstrates repeat variability. | Same brand/product family is not independent market-wide sampling. |

**Finding:** do not produce roll counts from wall area alone in beginner mode until regional sale-unit conventions and pattern-repeat loss are defensibly represented. A safer first release is wall area plus a clear note that roll count requires product dimensions and pattern details; those remain in Advanced settings.

### Openings and financial contingency

No verified evidence has been found that justifies default door/window deductions as typical dimensions across all eight markets. Keep gross wall area as the beginner calculation and allow optional opening measurements.

A budget contingency is a user planning preference, not a material property. Remove any hidden default. If retained as a feature, make it an optional user-entered budget buffer and keep it separate from the material estimate.

## Updated evidence status by market

| Market | Paint coverage evidence status | Wallpaper roll convention status | Automatic generic assumption |
|---|---|---|---|
| US | Product-level sources identified; independent comparable sample incomplete | North American double/single terminology identified; exact product dimensions vary | Not approved |
| CA | Canadian manufacturer data source identified; representative sample incomplete | Need Canadian market-specific corroboration, not US-only retailer guidance | Not approved |
| GB | Product-specific sources identified; sample incomplete | Sanderson provides a UK product-family example, not full-market sample | Not approved |
| DE | KEIM product-specific source identified; sample incomplete | Need market-specific product sample | Not approved |
| FR | Leroy Merlin named product source identified; sample incomplete | Need market-specific product sample | Not approved |
| ES | Leroy Merlin technical sheet identified; sample incomplete | Need market-specific product sample | Not approved |
| IT | MAPEI technical sheet verified for a named professional product; sample incomplete | Need market-specific product sample | Not approved |
| NL | GAMMA named product source identified; sample incomplete | Need market-specific product sample | Not approved |

## Recommendation for implementation planning

- Stage 0/1 can proceed independently: country selection, room dimensions, shared area model, flooring price range from area.
- Do not block Stage 0/1 on these missing assumptions.
- Stage 2 paint/wallpaper should initially show area and an honest "product details needed for quantity" message until approved records exist.
- The designer can design the beginner results and Advanced settings states now, but should not hard-code coverage, coats, roll sizes, pattern losses, opening deductions or contingency values.
- ChatGPT continues source research and adds numeric records only after the evidence gate is met.
