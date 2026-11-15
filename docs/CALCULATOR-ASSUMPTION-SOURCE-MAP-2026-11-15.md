# Calculator assumptions — source map and evidence rules

**Owner:** ChatGPT (research/data)
**Date:** 2026-11-15
**Status:** Source map / evidence assessment only. No numeric defaults are approved by this memo.
**Related:** Issue #362; `docs/CALCULATOR-BEGINNER-FLOW-TECHNICAL-DESIGN-2026-11-15.md`; decision restricting the shared country selector to US, CA, GB, DE, FR, ES, IT, NL.

## Purpose

Prepare the evidence base for `data/reference_assumptions.json` without asking a beginner for package-label information and without converting isolated product specifications into universal defaults. This memo identifies source families, what each can support, and what remains unproven. It deliberately does not authorize numeric values.

## Executive decisions

1. **No universal paint coverage or coat count.** Manufacturer technical data sheets are the primary evidence. Coverage depends on product, substrate, porosity, application method and film build. Build market-specific ranges only from comparable interior wall products, and keep primer / finish coats distinct.
2. **No universal wallpaper roll format.** Keep North American roll conventions separate from UK/European metric roll conventions. "Single roll", "double roll" and "one physical roll" are not interchangeable sale units. Product-specific pattern repeat materially changes usable yield.
3. **No universal flooring waste percentage.** Manufacturer installation guides establish layout and cutting constraints, but a percentage should be approved only after multiple comparable guides support the same material and layout class. Otherwise retain a clearly labelled user choice or show material area only.
4. **Do not subtract assumed door/window areas by default.** Opening dimensions vary by dwelling, room and local practice; accessibility clearances are not typical residential product dimensions. Beginner result should use gross wall area unless the user optionally supplies openings.
5. **Separate material allowance from financial contingency.** Cutting/installation waste is a material quantity assumption. Budget contingency is a financial planning choice, not a product property. Do not silently prefill either without evidence and explicit labelling.
6. **A source can support a range only within its stated scope.** Do not pool product-specific data from different markets, substrates, paint types, roll sale units or floor constructions into one synthetic "typical" value.

## Source map by assumption

### Paint coverage per litre / gallon, per coat

Primary sources:
- United States: Behr product technical/product pages and Benjamin Moore US technical data sheets. Behr explicitly gives coverage as a range and states dependence on application method and substrate porosity. Benjamin Moore provides product-specific technical data sheets.
- Canada: Benjamin Moore Canada technical data sheets/product pages; use Canadian product variants and Canadian units, not an automatic copy of US sheets.
- United Kingdom: Dulux UK product technical pages and product technical data sheets; capture the exact interior wall/ceiling product, coverage unit, coat recommendation and substrate caveats.
- Germany: Caparol technical product documentation and product tables. Caparol's consumer guidance explicitly warns that coverage varies with product, applied thickness and substrate absorbency.
- France: Leroy Merlin France product technical sheets for named interior wall paints, supplemented by manufacturer technical sheets. Retailer category pages alone are not enough.
- Spain: Leroy Merlin Spain technical sheets for named interior wall paints, supplemented by manufacturer sheets. Record substrate, layer count and product class.
- Italy: obtain named manufacturer technical sheets for interior wall paints before approving any country-specific default. A retailer listing without a linked technical sheet is discovery evidence only.
- Netherlands: GAMMA product technical sheets / manufacturer documentation for interior wall paints; capture product-specific coverage and substrate caveats.

Evidence already located:
- Behr (US): product pages publish coverage ranges and caveats for application method and substrate porosity: https://www.behr.com/pro/products/interior-products/interior-paints-and-coatings/paints-and-coatings/behr-premium-plus-interior/behr-premium-plus-flat
- Benjamin Moore (US technical data sheet index): https://www.benjaminmoore.com/en-us/data-sheets/technical-data-sheets
- Benjamin Moore Canada (technical data sheet index): https://www.benjaminmoore.com/en-ca/data-sheets/technical-data-sheets
- Benjamin Moore Canada Regal Select product data shows a product-specific coverage range and recommended-coat field; it is not a market-wide default: https://www.benjaminmoore.com/en-ca/product/regal-select-waterborne-interior-paint-flat-3-78-l-stone-white-2120-70/F547/ZWB100000001642380
- Dulux UK product page publishes coverage, pack sizes and coat guidance for that named product: https://www.dulux.co.uk/en/products/dulux-paint-mixing-matt
- Caparol Germany explains why there is no universal coverage answer and identifies substrate absorbency and applied thickness as variables: https://www.caparol.de/ratgeber/gut-zu-wissen/wissenswertes-ueber-wandfarbe
- Leroy Merlin France named interior paint page includes a product-specific per-coat consumption figure: https://www.leroymerlin.fr/produits/peinture-interieure-multi-supports-satin-murs-plafonds-boiseries-radiateurs-sans-odeur-plusieurs-teintes-profacile-2-5-litres-bleu-vintage-ma-95808733.html
- Leroy Merlin Spain technical sheet for a named interior paint reports per-coat performance and coat count: https://assets.leroymerlin.es/is/content/lmes/81989564-0123q-es/pintura-interior-mate-economica-15l-bl.pdf
- GAMMA Netherlands named wall-paint product information: https://www.gamma.nl/assortiment/gamma-muurverf-mat-2-5-liter/p/B102723

Limitations / next research:
- The links above are a starting set, not a completed representative sample. Italy needs a verified manufacturer TDS; Germany/France/Spain/Netherlands need more than one comparable interior-wall product before a robust market range is approved.
- Exclude exterior, masonry-specialist, trim/enamel, spray-only, ceiling-only and primer products from an interior-wall finish range unless represented as separate subtypes.
- Do not infer the number of coats from a single product. Record explicit manufacturer recommendation and whether it is conditional on colour change, substrate, primer or hiding power.

### Paint coats

Primary evidence must be the product manufacturer's technical sheet or application instructions for the same paint class and substrate. Do not treat a retailer's calculator assumption as a technical standard. If comparable sources disagree or state conditional coat counts, the calculator should show a disclosed range or make coats an optional beginner choice with a plain-language explanation. Advanced mode may expose exact product instructions.

### Flooring cutting / installation allowance

Primary sources:
- Quick-Step official installation instructions by flooring construction and product family.
- Other named manufacturers' installation guides for laminate, engineered wood, solid wood, LVT/SPC and carpet, kept as separate material classes.

Evidence already located:
- Quick-Step LVT AlphaVinyl installation instructions emphasize measuring and planning the room layout before installation: https://www.quick-step.co.uk/-/media/imported%20assets/flooring/c/5/9/qsinstallationlvtalphavinyl4mm%20and%205mmenpdf222077.ashx?filename=Installation+instructions+Quick-Step+Vinyl+-+LVT+AlphaVinyl.pdf&rev=256b049b0cb04473937ff262fdee6aeb&type=original
- Quick-Step laminate installation guide: https://int.quick-step.com/-/media/imported%20assets/flooring/8/c/5/qsinstallationlmpenpdf293099.ashx?filename=Installation+Guide+-+Quick-Step+LMP.pdf&rev=9bb77e69e0964fb3b5ae0fe16c764d36&type=original

Limitations / next research:
- These guides establish installation and layout constraints but do not, by themselves, justify one universal waste percentage.
- Research at least two manufacturer sources for each material/layout class before encoding an automatic allowance.
- If evidence is insufficient, keep allowance as an explicitly named user-selected refinement and do not hide it inside the result. Do not let a contingency percentage disguise missing material quantity.

### Wallpaper roll size and usable yield

Regional source families:
- United States / Canada: North American manufacturers and specialist retailers that explicitly explain single-roll versus double-roll terminology and sale-unit conventions. Confirm physical roll dimensions and the number of physical rolls included in the sale unit.
- United Kingdom: UK manufacturer technical pages and retailer installation guides; confirm metric roll dimensions and the product's usable yield after pattern matching.
- Germany, France, Spain, Italy, Netherlands: manufacturer technical sheets and product specification pages in the relevant market. Do not assume every European product uses the same physical size or sale unit.

Evidence already located:
- Graham & Brown wallpaper guide explains that usable yield depends on pattern repeat: https://assets.wfcdn.com/dm/document/1a8b0905-15c1-415b-b81e-aa782950e04a/wallpaper%20guide_final.pdf
- British Coatings Federation explains design repeat and pattern-match effects, and notes that repeat length changes roll requirements: https://coatings.org.uk/general/custom.asp?page=FAQs
- Sanderson official FAQ gives its own product-family roll convention and explains pattern-match types: https://www.sanderson.design/faqs
- World of Wallpaper US FAQ explicitly explains its roll size and cautions that coverage depends on pattern: https://www.worldofwallpaper.com/us/faqs
- Scandinavian Wallpaper explains why the specific product's roll dimensions, pattern repeat and match must be used for exact roll calculations: https://www.scandinavianwallpaper.com/pages/faq
- DuPont Artisse installation guide explains trimming and matching requirements: https://www.dupont.com/content/dam/dupont/amer/us/en/microsites/artisse/Public/documents/Artisse-Wallpaper-Install-Instructions.pdf

Limitations / next research:
- Do not treat retailer guidance or one brand's roll as an industry-wide standard without corroboration from multiple brands in that market.
- For beginner estimates, a standard roll assumption can only be used if the region and sale unit are explicit and a conservative usable-yield range accounts for pattern uncertainty. If no defensible regional sample exists, show wall area and explain that roll count needs product details.
- Never mix US single-roll price/sale units with European physical-roll conventions. Never calculate an exact number of rolls from gross area alone when pattern repeat and strip layout are unknown.

### Doors and windows (optional opening deductions)

Preferred approach:
- Default to gross wall area. Let the user optionally enter the number of doors/windows or their dimensions if they want a closer result.
- If a future market-specific preset is considered, derive it from residential housing survey / building stock data or building regulations explicitly identified as minimum/accessibility requirements, not from a single accessibility clear-width rule.
- Accessibility standards describe minimum clearances for accessible routes, not average residential door dimensions; they must not be presented as typical opening sizes.

Evidence / caution:
- Accessibility Standards Canada specifies clear doorway requirements for accessible routes; this is not a source for typical home door dimensions: https://accessible.canada.ca/standards-and-technical-guides/standards-and-technical-guides-database/can-asc-2.3-model-standard-built-environment-accessibility-federally-regulated-entities-defined-accessible-canada-act
- Similar caution applies to building-code minimums in every other market.

### Electricity appliance wattage (later stage)

For stage 3, use official government energy-label databases, regulator/energy-agency datasets, or manufacturer nameplate specifications. Keep appliance categories and operating modes separate. Wattage alone does not estimate usage time; any cost result must disclose the hours/day or usage pattern assumption. Do not insert a generic wattage until the selected appliance class and source population are defined.

## Unsourced prefilled allowance and contingency in the current page

- A **material allowance** (cutting/installation waste) is a quantity assumption. It requires material-specific and layout-specific evidence; until then it must be a visible visitor choice or omitted from the automatic result.
- A **financial contingency** is not a material property or measured quantity. It should be removed from any hidden prefill and offered only as an optional user-selected budget buffer, clearly separate from the estimated material subtotal.
- Neither should be used to make a project appear affordable when a required cost is unknown.

## Recommended data model fields

For every future assumption record, require:
- stable `id`; `market` (one of US, CA, GB, DE, FR, ES, IT, NL); `jurisdiction` where applicable;
- `category`, `subtype`, `kind`, `unit`, `basis` (e.g. per coat, per physical roll, per m²);
- `low`, `high` only when both are supported; no fabricated midpoint;
- `source.publisher`, `source.title`, `source.url`, `source.observedAt`, `source.retrievedAt`, `source.notes`, `source.caveats`;
- `autoEligible` and a mandatory `autoEligibleReason` when false;
- explicit evidence class: manufacturer technical sheet, manufacturer installation guide, trade association guidance, official building standard, retailer guidance, or secondary explainer.

Retailer guidance can help discover conventions but should not outrank manufacturer technical documents. A standard or code can establish a minimum requirement, not a typical home dimension unless it explicitly says so.

## Release gate for the assumptions registry

Do not create numeric records until:
1. the source is opened and the exact claim is visible;
2. geography, product class, unit, basis and observation/retrieval dates are recorded;
3. at least two independent comparable sources support a proposed market-level range, unless the record is explicitly product-specific;
4. exclusions and caveats are encoded;
5. the record is checked against the beginner calculator's actual formula and output labels.

## Handoff

- ChatGPT: source audit, evidence grading, assumption registry and research log.
- Claude: calculator code, shared room model, adapters, tests and implementation; consume approved assumptions only.
- Designer: visual hierarchy, beginner input sequence, result presentation, and styling of the collapsed Advanced settings disclosure. The designer should not choose technical defaults or invent labels that imply unsupported accuracy.

This memo is a source map, not approval to populate numeric assumptions.