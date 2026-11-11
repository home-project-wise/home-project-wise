# HomeProjectWise Calculator System — Product Vision and Expansion Roadmap

**Created:** 2026-11-01  
**Related proposal:** PR #214 — Home tools directory and multi-purpose project calculator  
**Status:** Product/quality specification; this document does not authorize publication or merging.

## 1. Product principle

The calculator system should become a core utility of HomeProjectWise, not a single novelty widget. Homeowners repeatedly need practical numerical answers before buying, repairing, replacing, or improving something:

- How much material do I need?
- What will the project cost?
- How much will this appliance cost to run?
- How much could I save by changing a product, setting, or habit?
- How much capacity, space, time, or quantity is appropriate?

The product promise: **turn a real home-project decision into a transparent, adjustable estimate using the visitor's measurements, local prices, and clearly stated assumptions.**

Do not claim that every possible calculation belongs in one enormous form. Build a coherent calculator library with a clear hub, focused calculators for distinct intents, and shared calculation components where that improves accuracy and maintenance.

## 2. The system: a hub plus focused calculators

### Core hub
The tools directory should be the discoverable hub. The multi-purpose calculator can serve as the starting point and link to focused tools. Each focused calculator should solve one recognisable task completely rather than duplicating a thin variation of another page.

### Calculation families and candidate modules

| Family | Useful calculations | Inputs that make results trustworthy |
|---|---|---|
| Measurements & space | Area, perimeter, volume, wall area, room dimensions, unit conversion | Dimensions, units, openings, shape assumptions |
| Paint & surface finishing | Paint quantity, primer, coats, wallpaper rolls, surface preparation quantities | Surface area, coats, product coverage/yield, openings, waste |
| Flooring & tiling | Flooring packs, tile count, grout, underlay, skirting/baseboard length | Room dimensions, tile/pack size, joint width where relevant, pattern/cut allowance |
| Building materials | Concrete, mortar, screed, gravel, sand, soil, mulch, drywall/sheet goods, insulation | Geometry, depth/thickness, product yield, density only when sourced |
| Project budgeting | Materials, labour, delivery, tool hire, disposal, tax, contingency, project total, budget gap | Itemised quantities and local unit prices; tax/fee treatment stated |
| Electricity & appliances | kWh, daily/monthly/annual running cost, standby cost, appliance comparisons, estimated savings | Rated or measured watts, usage pattern, tariff, billing assumptions |
| Heating & cooling | Preliminary room heating/cooling estimate, runtime cost, thermostat schedule comparisons | Room dimensions, climate inputs, insulation and equipment assumptions; professional sizing caveat |
| Water & plumbing | Flow rate, water use, leak volume, water cost, shower usage, tank volume | Flow, duration, tariff, units and local billing structure |
| Moisture & ventilation | Dehumidifier planning, ventilation runtime, moisture removal estimates | Room volume, measured RH/temperature, device capacity and manufacturer data |
| Doors, windows & insulation | Glass/curtain/blind area, insulation coverage, draft-sealing quantities, simple heat-loss comparisons | Dimensions, material/product properties and explicitly limited assumptions |
| Lighting | Lumens needed as a planning guide, bulb energy cost, replacement comparison | Room area, task/use, lumens, watts, hours and tariff |
| Garden & exterior | Soil, mulch, gravel, paint/stain, fence/deck material, irrigation water | Area, depth, dimensions, spacing and product coverage |
| Maintenance & repair | Replacement quantities, maintenance intervals, repair material estimates, simple cost comparisons | Product/manual guidance, dimensions, usage and local costs |

This is a candidate map, not a commitment to publish every module. Prioritise only calculations supported by a real visitor problem, reliable formulas or product data, and a useful page experience.

## 3. Make cost calculations the differentiator

Where relevant, connect **quantity → local price → total cost**. Do not invent universal prices.

A useful cost result can show:
1. Exact measured quantity.
2. Product/pack quantity after a separately displayed waste allowance.
3. User-entered unit price and currency.
4. Optional labour, delivery, hire, disposal and other extras.
5. Optional contingency, with its calculation base shown.
6. Tax/fees as configurable assumptions, not universal tax advice.
7. Estimated total and a clear list of what is excluded.

For comparisons, allow visitors to change one variable at a time (for example, appliance A vs B, tariff, usage hours, material price, or product coverage) and show the difference in cost. Any savings figure must be calculated from visible inputs and a stated time period.

## 4. Shared calculation experience

Use consistent patterns across modules:
- Metric and imperial units where the calculation reasonably supports both.
- Local prices entered by the visitor; configurable currency label.
- Product-label coverage/yield preferred over generic assumptions.
- Exact requirement separated from purchase allowance and rounded pack count.
- Formula and assumptions visible beside or below the result.
- Input validation that matches the displayed range, including legitimate zero values.
- Results that identify the period and units (per day, 30 days, year, m², packs, kWh).
- Clear empty, invalid, and optional-input states.
- Mobile-first layout, keyboard support, accessible labels, selected states and announced results.
- Browser-side calculation and a clear privacy statement where no entered values are transmitted.
- Copy/share/print result can be considered later only if implemented accessibly and without collecting private inputs.

## 5. Trust and calculation quality

Every module must have a QA note containing:
- Formula and derivation/source.
- Units and conversion constants.
- Expected-value test cases, including boundary, zero, invalid, and unit-equivalence cases.
- What the calculator includes and excludes.
- Known uncertainty and when a professional assessment is required.

Never present a rough planning estimate as a quote, diagnosis, code-compliance check, engineering design, or safety approval. For energy, moisture, structural, plumbing, and HVAC topics, use manufacturer or authoritative technical sources and narrow the claim to what the inputs can support.

## 6. Search and answer-engine discovery

The calculator should earn discovery by being genuinely useful, not by multiplying near-identical URLs.

- Give each focused tool one distinct job and a descriptive title, explanation, formula, worked example, FAQs that resolve real uncertainties, and related guides.
- Put the calculator itself near the top of the page; do not bury the utility under long generic copy.
- Link from relevant existing articles at the point where the reader needs the calculation, and link back from the calculator to explanatory guides.
- Add only canonical, working, indexable pages to the sitemap after live URL, internal-link, and quality checks.
- Use descriptive internal anchors and consistent entity/term definitions.
- Publish reproducible worked examples with inputs, outputs, and assumptions. These can become useful evidence for readers and answer engines.
- Do not claim that a calculator makes search engines return automatically or guarantees citations. Measure impressions, clicks, usage events and referrals, then improve based on evidence.
- Track each calculator separately in analytics where possible, while protecting entered values; measure starts, successful calculations, and meaningful engagement rather than collecting user measurements or prices.

## 7. Prioritisation

Proposed sequence, subject to evidence and validation:

**Stage 1 — Make the foundation reliable**
- Complete and browser-test the five modules in PR #214.
- Fix validation/accessibility mismatches.
- Ensure the tools directory is linked from the main navigation and relevant tool pages.
- Confirm live routes, canonical tags, sitemap entries and mobile usability before merge.

**Stage 2 — Expand high-utility cost coverage**
- Itemised project budget/materials calculator (multiple line items, not only one quantity × one price).
- Tile, grout and flooring quantity/cost.
- Wallpaper and wall-covering quantity/cost.
- Concrete, soil, mulch and gravel volume/cost, each with verified product/yield assumptions.
- Appliance annual running cost and side-by-side comparison.

**Stage 3 — Broaden home operating costs**
- Water use and cost.
- Heating/cooling running-cost comparisons.
- Lighting energy and replacement-cost comparison.
- Insulation and draft-sealing material estimates.

**Stage 4 — Expand only where validated**
- Plumbing, ventilation, maintenance and exterior-project calculators based on search data, visitor feedback, reliable formulas and demonstrable differentiation.

## 8. Acceptance gate (Value Before Publishing)

A calculator module is not ready merely because it runs. Before merge/publication, document:
1. The exact visitor problem and decision it helps with.
2. Why this tool is better or more useful than a generic alternative.
3. Formula, source, assumptions, limitations and expected outputs.
4. Browser tests, keyboard/mobile checks and accessibility checks.
5. Related internal links and a valid canonical/indexing plan.
6. The measurement plan: impressions, clicks, calculator starts/completions and useful engagement.

If the team cannot explain the visitor benefit or reproduce the result independently, redesign or postpone the module.
