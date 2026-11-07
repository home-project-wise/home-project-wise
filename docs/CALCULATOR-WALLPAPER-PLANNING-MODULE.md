# Wallpaper quantity and cost module — product requirements

**Prepared:** 2026-11-07  
**Status:** Research-backed proposal for the existing Home Project Calculator; no implementation or live-price source authorized by this document.  
**Market order:** United States first; UK, Canada and EU only after product-label and unit conventions are validated.

## Decision

Build wallpaper planning as a new module inside the existing flagship Home Project Calculator, not as another standalone thin calculator page. The current calculator's area/volume module can help with simple room dimensions, but it does not calculate wallpaper drops, pattern repeat, package yield or roll cost. The article published alongside this proposal must state that limitation clearly.

## Competitor and manufacturer review

| Source | Verified useful capability or guidance | What we should learn |
|---|---|---|
| Sherwin-Williams wallpaper estimate guide | Area-based usable-yield bands by pattern repeat; discusses single-roll pricing versus double/triple-roll packaging and matching run codes | Product packaging and usable yield must be explicit; avoid a generic roll-size assumption |
| Graham & Brown measuring guide and US wallpaper guide | Measure wall-by-wall; explains free, straight and offset matches; its US guide adds the pattern repeat to wall height when estimating a drop | Explain match type and avoid subtracting opening area in a way that under-orders; use a conservative repeat allowance and defer to product-specific yield guidance |
| James Dunlop Textiles manufacturer guide | Counts drops per wall; adds trimming and pattern repeat; counts only complete drops per roll; gives different waste guidance for match size | Strip-level arithmetic is more useful than square-foot-only division |
| Wallcoverings Association | Defines random, straight-across and half-drop match types | Use consistent definitions and route complex match types to product instructions |
| Sherwin-Williams hanging guide | Starting point, plumb line, strip width and installation technique | Link quantity advice to correct installation planning |
| Calcs24 wallpaper calculator | Roll size, repeat, optional openings, wall-by-wall rounding toggle, manual price, area cross-check and unit switching; says it does not model offset layout or batch number | Generic strip math and manual price entry are already commodity features |
| CalcTools UK wallpaper calculator | Multiple rooms/heights, standard UK sizes, pattern repeat, waste/opening options, paste-pack estimate and PDF/CSV/clipboard buying sheet | Multi-room and export are already available in the UK; do not claim either alone as unique |
| PlainTools wallpaper calculator | Per-wall widths, roll size, repeat, trim, optional waste percentage and manual price; browser-only privacy claim; no offset match | Basic per-wall calculation and user-entered cost are not a defensible moat |
| Layout Foundry wallpaper calculator | Multiple walls, unit conversion, trim/repeat and full-height opening handling; half-drop not calculated | Unit conversion and wall-by-wall drops are also commodity features |
| Calk-USA wallpaper calculator | Area/cost breakdown, openings, adhesive and paste estimates | Shows demand for cost context, but area-based coverage must not replace drop-yield math |

Sources:
- https://www.sherwin-williams.com/homeowners/how-to/wallpapering-how-tos/sw-article-dir-howtoestimate
- https://www.grahambrown.com/row/how-to/measure-your-room/
- https://www.grahambrown.com/us/blog/how-much-wallpaper-do-i-need/
- https://manufacturer.jamesdunloptextiles.com/journal/tips-how-to/how-to-calculate-wallpaper-requirements
- https://www.wallcoverings.org/page/ResUnderWallpaper
- https://www.sherwin-williams.com/homeowners/project-center/wallpapering-how-tos/hanging-techniques
- https://calcs24.com/wallpaper-calculator/
- https://www.calctools.uk/wallpaper-calculator/
- https://plaintools.site/tools/wallpaper-calculator/
- https://layoutfoundry.com/wallpaper
- https://calk-usa.com/calculator/wallpaper/

The review is a functional-pattern comparison, not a traffic ranking or proof that every competitor was exhaustively tested. Important finding: basic roll count, pattern repeat, manual price, multi-room inputs, unit conversion and exports already exist in competing tools. Do not position those features alone as unique. The defensible opportunity is to connect room-by-room wallpaper quantities to the existing whole-project budget, compare products with currency-safe costs, and eventually use dated, source-backed regional price ranges. The article and engine use a conservative one-full-repeat allowance for straight match; manufacturer-specific yield instructions override this general estimate.

## User journey

1. Add one or more rooms.
2. Enter each wall width separately, plus wall height; optionally mark a full-height opening only when it genuinely removes a complete drop.
3. Enter the exact product label: usable roll width, usable length per sale unit, price per sale unit and currency.
4. Choose match type: free/random, straight, half-drop/offset, mural/panel or unknown.
5. Enter the vertical pattern repeat when applicable and the trim allowance recommended by the product maker.
6. See the calculation at each stage: drops per wall, total drops, cut length, complete drops per sale unit, sale units to buy and entered-price material total.
7. Compare two wallpaper products using the same room measurements; show the difference in required sale units and entered cost.
8. Export or print a local shopping summary only if it can be done without transmitting measurements or prices.

## Calculation contract

For each wall i:
- drops_i = ceil(wall_width_i / usable_roll_width)
- total_drops = sum(drops_i); do not silently carry partial drops across corners or walls.
- Free/random match: drop_length = wall_height + trim_allowance.
- Straight match: drop_length = wall_height + trim_allowance + pattern_repeat (a conservative one-full-repeat allowance following the cited manufacturer example; the selected product manufacturer's calculator/instructions take precedence).
- drops_per_sale_unit = floor(usable_length_per_sale_unit / drop_length).
- sale_units = ceil(total_drops / drops_per_sale_unit).
- material_cost = sale_units * user_entered_price_per_sale_unit.

Do not calculate when dimensions, units, usable roll width/length, price unit or required pattern information are missing or invalid. When a price is entered, require a three-letter uppercase ISO currency code so the result can be safely passed into the existing project estimator. Unknown is not zero. All measurements in one calculation must use a consistent unit. Keep the product's commercial sale unit (single, double, triple, pack or panel set) explicit so price and quantity use the same unit.

## Scope and safety of assumptions

**MVP support:** multiple rectangular rooms with separate wall widths and heights; free/random match and straight match; exact product-label dimensions; explicit trim allowance; whole sale-unit rounding per room; manual price entry using ISO 4217 currency codes; two-product comparison with unit/currency safety; and an adapter that converts a wallpaper estimate into a Project Estimator Engine line item. The conservative aggregation rounds packages separately per room and does not pool leftover roll lengths between rooms. The project-budget adapter preserves an unknown price as null; when a visitor enters a price it maps it as a user-input price per exact sale unit, matching Project Estimator Engine 1.0.2. An additional two-case integration harness is provided at scripts/test_wallpaper_project_estimator_integration.js; it must be run against the repository's exact estimator engine before UI integration.

**Not auto-estimated in MVP:** half-drop or complex multi-drop patterns, murals/numbered panels, curved or sloped surfaces, stairs, unusually high walls, corner reuse, full-height opening deductions without a reviewed layout, or generic waste percentages. Do not stack a generic waste percentage on top of the one-repeat allowance unless the selected manufacturer specifically recommends it. For unsupported patterns, show a clear message to use the manufacturer's calculator or ask the supplier/installer; never return a falsely precise count.

Do not invent a universal US, UK, Canadian or EU roll size. Do not assume a standard package contains a fixed number of single rolls. Do not use retailer scraping or stale national prices. Any future price feed needs source identity, licensing, geography, product match, observation/retrieval dates and a freshness policy. Until then, only user-entered prices are used.

## Differentiation and acceptance tests

A visitor should be able to answer: “How many full strips will each wall need, how many full drops fit in this exact product's sale unit, and what will those units cost at the price I entered?”

Required tests:
- Exact-width wall; fractional strip rounds up.
- Several walls with independent rounding; no implicit corner reuse.
- Free-match and straight-match calculations.
- Repeat divides working height exactly; repeat just above/below boundary.
- Roll length exactly fits N drops; a short remainder does not count as another.
- Sale unit contains explicitly declared usable length; package count is not confused with single-roll count.
- Metric/imperial equivalence using exact conversion constants.
- Invalid/missing/zero dimensions, width, length, repeat, trim and price.
- Pattern type unknown or half-drop selected => no unsupported result.
- Full-height opening handling is opt-in and testable; ordinary windows/doors are not fully deducted by default.
- Two-product comparison across multiple rooms with different width, length, repeat and package price; refuse quantity comparison across measurement units and refuse cost comparison across currencies or unknown prices. Multi-room totals round each room separately and never assume offcut reuse between rooms.
- Project-budget adapter: sale-unit quantity maps to quantity, sale-unit label maps to unit, a manual price maps to price.kind=user-input with matching currency/unit, and an unknown price remains null. Verify it with Project Estimator Engine 1.0.2.
- Privacy: no measurements, room names or prices in URL, analytics, logs or network requests.
- Browser QA at desktop and 360px mobile; keyboard, labels, focus, error association and announced results.
- Visible formula, assumptions, limitations, and links to this guide and product instructions.

## Value Before Publishing gate

- Visitor problem: avoid running short or buying excess wallpaper because area-only estimates ignore drops and repeat.
- Differentiation: exact product-label sale unit, per-wall strip counts, repeat-aware yield, side-by-side product comparison and entered-price cost.
- Proof: reproducible arithmetic, product-label inputs, primary manufacturer/association sources, explicit unsupported cases.
- Release: all tests on exact head, accessible mobile browser review, privacy checks and score >=85/100 with every hard gate passed.

**Implementation slice completed in this PR:** the isolated browser/Node-safe calculation engine is now in website/wallpaper-calculator-engine.js, with 28 local Node tests in scripts/test_wallpaper_calculator_engine.js. It supports free/random and straight match, exact product sale-unit labels, required unit labels, manual price/currency, two-product comparison, safe rounding, and explicit errors for unsupported patterns. It is not yet connected to the calculator UI; no visitor-facing wallpaper calculator is claimed. The 28 tests passed locally on Node 22.16.0 against the authored source before upload. Claude must rerun the test from the exact PR head and independently review the implementation before any UI integration.