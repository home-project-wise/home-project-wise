# Roadmap: next home-project calculator types

**Prepared by:** ChatGPT — product research, calculation semantics and data owner  
**Date:** 2026-11-19  
**Status:** Evidence-based roadmap proposal; documentation only. No calculator implementation, price data, or deployment is authorized by this file.  
**Market assessed:** United States, English

## Executive decision

Expand the existing connected calculator suite with **quantity-first project estimators**, not isolated cost calculators that invent local prices. The strongest first opportunities are:

1. **Tile** — clear area-and-product-coverage calculation, meaningful US search demand, and low reported keyword difficulty.
2. **Mulch / garden soil** — the largest directly relevant demand signal in this shortlist and a simple area × depth calculation.
3. **Concrete slabs** — strong demand and a transparent volume/yield calculation, but the product must remain a quantity estimator and must not recommend structural dimensions or mix specifications.
4. **Drywall / plaster** — useful, established manufacturer coverage data; keep board and plaster calculations product-specific.
5. **Fencing** — valuable material-planning intent, but posts and panels depend on the selected fence system and actual layout.
6. **Decking** — useful demand and a clear board-coverage calculation, but board layout, gaps, stairs and structural framing complicate exact counts.
7. **Insulation** — defer the full recommendation tool. A product-coverage quantity estimator is possible, but R-value recommendations depend on climate zone, building component, existing insulation and assembly details.

This is a staged order, not a promise that all seven should become one large release. Build one project type at a time, reuse the existing room/market/project-list patterns where appropriate, and keep every quantity explainable.

## 1. Demand evidence and prioritization

The OpenSEO keyword-research endpoint was unavailable during this pass because the connected account returned `INSUFFICIENT_CREDITS` for each seed. No OpenSEO keyword metrics were obtained. Search Console is not connected to this project, so these are **third-party US search estimates**, not HomeProjectWise impressions, clicks or ranking opportunities.

The figures below are directional snapshots from public keyword reports. The “average” and “Google Ads / Keyword Planner” columns are two estimates reported on the same source page; they are not separate demand pools and must not be added together. Search volumes vary by provider, grouping and month.

| Candidate keyword | US estimated average / month | Google Ads / Keyword Planner figure | Reported KD | CPC estimate | Snapshot |
|---|---:|---:|---:|---:|---|
| mulch calculator | 40,000 | 60,500 | 35 | $2.06 | 2026-10-31 |
| concrete slab calculator | 24,000 | 40,500 | 36 | $1.88 | 2026-11-03 |
| drywall calculator | 13,000 | 14,800 | 41 | $1.22 | 2026-11-10 |
| tile calculator | 11,000 | 12,100 | 5 | $1.57 | 2026-10-30 |
| fence calculator | 9,000 | 9,900 | 32 | $3.00 | 2026-11-12 |
| deck calculator | 8,900 | 12,100 | 38 | $2.39 | 2026-11-14 |
| insulation calculator | 5,400 | Not reported on the retrieved page | Unknown | $3.14 | 2026-05-17 |

Sources: [mulch](https://www.kwstrends.com/keywords/us/mulch-calculator), [concrete slab](https://www.kwstrends.com/keywords/us/concrete-slab-calculator), [drywall](https://www.kwstrends.com/keywords/us/drywall-calculator), [tile](https://www.kwstrends.com/keywords/us/tile-calculator), [fence](https://www.kwstrends.com/keywords/us/fence-calculator), [deck](https://www.kwstrends.com/keywords/us/deck-calculator), and [insulation](https://www.seodata.dev/keyword/insulation-calculator).

### How to read the demand data

- **Tile is the clearest low-competition opportunity:** 11,000 reported monthly searches with KD 5. That makes it a better early test than volume alone would suggest.
- **Mulch and concrete slab have the largest directly relevant volume signals.** Both should be quantity-first and must expose the user-selected depth/thickness and product yield.
- **Drywall, fence and deck show meaningful intent**, but the formulas need more product/layout inputs than a simple floor-area calculator.
- **Insulation is a lower-confidence opportunity:** the available volume snapshot is older and no KD was returned. Refresh it before committing to a standalone page.
- **Plaster is not ranked as a separate keyword opportunity** because no reliable, comparable US “plaster calculator” volume/KD snapshot was obtained. Treat plaster as a product-specific mode within a wall-surface materials estimator until demand is verified.
- Do not sum close variants such as “deck calculator”, “decking calculator” and “deck board calculator”; keyword providers may group overlapping variants.

## 2. Candidate specifications

### A. Tile quantity estimator — Priority 1

**Visitor decision:** “How much tile should I buy for this floor, wall or backsplash?”

**Minimum inputs**
- One or more rectangular surface sections (length × width); allow a room shape to be split into rectangles.
- Optional openings/cut-outs for wall or backsplash areas.
- Tile length and width, or the coverage printed on the selected box.
- A waste allowance explicitly chosen by the visitor; no hidden default.
- Optional box coverage and price from the product label or visitor entry.

**Core calculation**
- `net area = sum(section length × section width) − measured cut-outs`
- If tile dimensions are entered: `tile area = tile length × tile width`; `tile count = ceil(net area × (1 + chosen waste) ÷ tile area)`.
- If box coverage is entered: `boxes = ceil(net area × (1 + chosen waste) ÷ coverage per box)`.
- Keep the area unit consistent and show the rounding basis.

**Required exclusions / guardrails**
- Do not calculate grout, mortar/thinset, levelling compound, backer board or waterproofing without the exact product’s published coverage and relevant installation system.
- Do not promise exact cuts or layout. Pattern, grout-joint width, tile orientation, room irregularity and installer skill affect actual quantity.
- Do not silently apply a 10% allowance. Home Depot's tiling guidance describes a 10% allowance as typical advice; present any such suggestion as an optional, editable choice, not a concealed rule.

**Evidence / data needed**
- Tile face dimensions and package coverage from product labels or manufacturer data.
- Separate, sourced coverage for grout and setting materials if those are added later.
- Home Depot's [tile layout guide](https://www.homedepot.com/c/ah/how-to-lay-out-tile/9ba683603be9fa5395fab9035335ddf) confirms area = length × width, splitting L-shaped rooms into rectangles, and discusses an optional material allowance.

### B. Mulch and garden-soil estimator — Priority 1

**Visitor decision:** “How many cubic feet, cubic yards or bags do I need for these beds?”

**Minimum inputs**
- One or more bed areas; start with rectangles and allow multiple sections.
- Chosen application depth, with the unit shown clearly.
- Material type: mulch, topsoil, raised-bed mix or compost (keep these distinct).
- Optional bag volume or supplier bulk unit and price, taken from the product/supplier information.

**Core calculation**
- `volume = total area × chosen depth` after converting area and depth to compatible units.
- `cubic yards = cubic feet ÷ 27`.
- `bags = ceil(required volume ÷ published volume per bag)`.
- For irregular beds, allow the visitor to split the shape into simple areas rather than guessing a single dimension.

**Required exclusions / guardrails**
- Do not prescribe soil amendments, fertilizer or compost ratios without a soil test and crop/site context.
- Do not assume all mulch types have the same bulk density, settling or bag yield.
- Keep mulch-depth guidance separate from the quantity formula. UMN Extension advises 2–4 inches for mulch and keeping it clear of plant stems/trunks; that is gardening guidance, not a universal input default.
- Explain that bulk volume can settle and that delivered volume/coverage depends on product and site conditions.

**Evidence / data needed**
- Bag volume or bulk supplier unit, not weight converted to volume without a product density.
- The [Oregon State University Extension raised-bed guide](https://extension.oregonstate.edu/catalog/fs-270-raised-bed-gardening) gives a worked coverage relationship: one cubic yard covers 162 sq ft at 2 inches. [UMN Extension mulch guidance](https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/mulching-for-soil-and-garden-health) describes a 2–4 inch mulch depth and stem/trunk clearance.

### C. Concrete slab / pad estimator — Priority 1, quantity only

**Visitor decision:** “What volume of concrete does my stated slab size require, and how does that compare with a named bag yield?”

**Minimum inputs**
- Length and width for each rectangular slab/pad.
- Thickness entered by the visitor or copied from an approved plan; do not recommend a thickness.
- Either ready-mix volume unit or a selected bag product with published yield per bag.
- Optional supplier price entered by the visitor.

**Core calculation**
- `slab volume = length × width × thickness` with all dimensions converted to the same unit.
- `cubic yards = cubic feet ÷ 27`; show cubic feet/metres as well.
- `bags = ceil(total volume ÷ published yield per bag)`.
- Sum separate slab sections before converting/rounding; round bag counts only at the end.

**Required exclusions / guardrails**
- This is a volume estimator, **not structural or engineering advice**.
- Never suggest slab thickness, reinforcement, strength class, sub-base, load capacity, drainage, joints, footing dimensions or code compliance.
- Never infer a mix's bag yield from bag weight. Use the exact manufacturer's current data sheet.
- Make uneven subgrade and waste explicit exclusions unless the user supplies a separately justified allowance.

**Evidence / data needed**
- Exact bag yield and product name, kept together with the data-sheet date and URL.
- QUIKRETE's [concrete calculator](https://www.quikrete.com/calculator/main.asp) states its slab options and warns that yields are approximate and do not allow for uneven substrate or waste. Its [training guide](https://www.quikrete.com/dealers/training/presentations/3-mixing-placing-concrete-cement-mixes-training.pdf) demonstrates length × width × thickness and dividing volume by the selected bag yield.

### D. Drywall and plaster estimator — Priority 2

**Visitor decision:** “How much board or a named plaster product covers these walls/ceilings?”

**Minimum inputs**
- Wall sections: total wall length × height, or individually measured wall rectangles.
- Openings measured separately and subtracted once.
- Optional ceiling area.
- For drywall: panel width × length (or panel coverage).
- For plaster: exact product, bag weight, published coverage at its reference thickness, and visitor-entered application thickness.

**Core calculation**
- `net wall area = gross wall area − openings`; add ceiling area only if selected.
- `drywall sheets = ceil(net area ÷ panel face area)` as an area estimate only.
- For plaster with published coverage: `bags = ceil(net area ÷ coverage per bag at the stated thickness)`.
- If a product gives consumption `R kg/m² at thickness T₀`: `required kg = area × R × actual thickness ÷ T₀`; `bags = ceil(required kg ÷ bag weight)`.
- Calculate separate coats/products separately; do not treat skim coat and backing plaster as interchangeable.

**Required exclusions / guardrails**
- Board-area count is not a sheet-layout plan. Board orientation, framing centres, joints, openings and offcuts can change the number of sheets.
- Do not estimate joint compound, tape, fasteners, primer or corner bead without a named manufacturer system and published coverage.
- Do not imply a plaster product is suitable for every substrate, room, thickness or moisture condition.
- No fire-rating, sound-rating, structural, moisture-control or code-compliance claims.

**Evidence / data needed**
- Manufacturer panel sizes and installation system.
- Manufacturer coverage per bag at a stated thickness; preserve product, market and source date.
- USG's [Sheetrock Wallboard Estimator](https://assemblies-tools.usg.com/content/usgcom/en/resource-center/tools/sheetrockestimator.html) takes area and panel size and explicitly says its estimate excludes waste. British Gypsum's [Plaster Coverage Calculator](https://www.british-gypsum.com/technical-support/self-help-tools/plaster-coverage-calculator) requires the height and width of each wall/ceiling/area and product selection.

### E. Fence materials estimator — Priority 2

**Visitor decision:** “How many panels and system-specific posts fit my measured fence runs and gates?”

**Minimum inputs**
- Each fence run measured separately.
- Gate count and width, attached to the correct run.
- Selected panel width and the selected fence system/manufacturer.
- Manufacturer's post spacing or panel/post rule; corner, end and gate-post configuration.
- Optional product price/pack coverage.

**Core calculation**
- `net fence length = sum(run lengths) − sum(gate openings)`.
- Calculate panels per run: `panels per run = ceil(net length for that run ÷ selected panel width)`; do not combine separate runs before rounding.
- Calculate posts only from the selected system's installation rule and the explicit run-end/corner/gate layout. If the layout is insufficient, return “post count needs a layout” rather than a guessed count.

**Required exclusions / guardrails**
- No universal post-count formula: post spacing and shared corner/end/gate posts differ by product system.
- Do not assess property boundaries, easements, underground utilities, permits, setbacks, wind loads, retaining walls or code compliance.
- Slopes, stepped runs, custom panels and cut panels need a separate layout or manual adjustment.

**Evidence / data needed**
- Product-specific panel width, maximum on-centre spacing, gate hardware and post arrangement.
- Lowe's [fence layout guide](https://www.lowes.com/n/how-to/install-vinyl-fencing) says to mark each run, corners and gates and use the selected panel's spacing. The [Outdoor Essentials fence calculator sheet](https://pdf.lowes.com/productdocuments/89dcd302-00ce-4578-ba9d-5bffaefc4b87/15274086.pdf) gives an example panel/post formula for its preassembled-panel system only; do not generalize it to other systems.

### F. Decking estimator — Priority 2

**Visitor decision:** “How many deck boards and product-specific fastener packs cover my stated deck surface?”

**Minimum inputs**
- Deck surface area, initially rectangles or separate rectangular sections.
- Board's actual face width and stock length from the product specification.
- Board orientation and gap/spacing if calculating rows.
- Optional visitor-selected waste allowance.
- Fastener product coverage or manufacturer fastening instructions if estimating fasteners.

**Core calculation**
- For a simple coverage estimate: `board face area = actual board width × board length`; `boards = ceil(deck area × (1 + chosen waste) ÷ board face area)`.
- A more exact row/stock-length layout is a later feature requiring orientation, gap, board lengths, joins and cut reuse.
- `fastener packs = ceil(required coverage area ÷ published pack coverage)` only when the fastener manufacturer states coverage for the matching joist spacing/system.

**Required exclusions / guardrails**
- No deck framing design, joist/beam spans, ledger attachment, footing sizing, guard/handrail safety, stair stringers, load rating or code advice.
- No assumed board width based on nominal lumber dimensions; use actual product dimensions.
- Stairs, picture-frame borders, fascia, skirting and complex patterns are excluded until separately measured.
- Waste is a visible visitor input, not a hidden fixed percentage.

**Evidence / data needed**
- Exact board dimensions, stock lengths, fastener coverage and matching installation guidance.
- Home Depot's [deck-material guide](https://www.homedepot.com/c/ah/how-to-calculate-deck-materials/9ba683603be9fa5395fab90a84d7ea3) demonstrates using actual board width, deck area, board face area and a stated waste allowance; it also separates fasteners, stairs and trim from deck-board quantity.

### G. Insulation quantity estimator — Priority 3 / defer recommendations

**Visitor decision:** “How many packs of this exact insulation product cover my measured attic/floor/wall area?”

**Minimum inputs**
- Building component: attic floor, roof/ceiling, floor or wall (do not blend them).
- Measured surface area, with separate sections.
- Exact insulation product/type and published package coverage at the chosen thickness or R-value.
- Existing insulation details only if the user is explicitly doing a layered quantity calculation.

**Core calculation**
- `net area = sum(section areas) − measured exclusions`.
- `packs = ceil(net area ÷ product coverage per pack at the selected thickness/R-value)`.
- If multiple layers/products are selected, show each layer and its own published coverage separately.

**Required exclusions / guardrails**
- The first release should be **quantity-only**. Do not recommend a target R-value, insulation type, thickness, energy savings or payback.
- R-value depends on product/material and thickness; recommended targets depend on climate zone, building component, existing insulation and assembly. Existing wall insulation can require a qualified assessment.
- Do not advise opening walls, disturbing suspect materials, blocking ventilation, covering heat-producing equipment or changing fire/moisture assemblies.
- No claims about code compliance, moisture/condensation performance or energy savings.

**Evidence / data needed**
- Product label/data sheet: coverage, thickness, R-value, pack size, installation limits.
- Location/climate zone and component-specific authoritative guidance would be required before any future R-value recommendation.
- The US Department of Energy's [Consumer Guide to Home Insulation](https://www.energy.gov/sites/default/files/2021-11/ES-HomeInsulation_081721E-a.pdf) explains that R-value recommendations vary with climate zone and heating/cooling system, and that existing insulation should be evaluated in context. DOE's [climate-specific guidance](https://www.energy.gov/cmei/buildings/building-america-climate-specific-guidance) provides zone-specific assembly guidance.

## 3. Progressive disclosure: one engine, three user levels

| Level | Experience | Inputs exposed |
|---|---|---|
| Beginner | Plain-language questions, one visible surface/project at a time, clear units and worked examples | Dimensions and product type; no unexplained trade jargon |
| Basic | “Use my product” path | Actual product dimensions, package coverage/yield, bag/box size, visitor price |
| Advanced | Explicit assumptions, not hidden automation | Waste %, board gap, application thickness, product yield, multiple surfaces/coats, source/provenance details |

Do not create three separate calculation engines. Each level should reveal more explicit inputs for the same calculation and produce the same underlying result when the inputs match.

## 4. Shared data and calculation contract

Every new project type should preserve the existing HomeProjectWise estimate rules:

- **No invented prices:** a material price requires an eligible, current, market-matched source record or a visitor-entered price.
- **No FX:** never convert between currencies. If the selected market lacks a valid source, show the item as unpriced.
- **No hidden allowances:** waste, contingency, tax, labour and delivery must be visitor-selected or clearly excluded.
- **No false precision:** distinguish area/volume estimates from exact cut plans or purchase counts.
- **Product-specific yields:** package counts require a named product's published coverage/yield and matching unit/thickness/system.
- **Visible provenance:** retain source name, URL, market/geographic scope, unit, observation/check date and coverage basis.
- **Unknown stays unknown:** missing product coverage or layout inputs must not be replaced with zero or a generic default.
- **Browser-only privacy:** preserve the existing in-browser handling of visitor measurements and prices.
- **One room / one market:** reuse shared dimensions and the selected market where the existing product architecture supports them; do not ask visitors to repeat inputs.

## 5. Suggested delivery sequence and release gates

### Release 1 — Tile, mulch/soil, concrete quantity
These offer the clearest area/volume arithmetic and strong demand signals. Implement them as three isolated project types, not one overloaded form. Tile has the best reported keyword-difficulty signal; mulch and concrete offer larger volume but more seasonal or safety-sensitive boundaries.

### Release 2 — Drywall/plaster, fence, decking
Proceed only after exact product-coverage and layout requirements are documented. Fence post counts and deck board/fastener counts must remain system-specific.

### Release 3 — Insulation quantity
Start with package coverage only. A separate R-value recommendation feature requires an authoritative climate-zone and building-assembly data contract and a dedicated safety review.

### Acceptance gates for every project type

1. A plain-language input contract and unit-conversion tests.
2. At least one worked example that can be independently recalculated.
3. A source for each product yield/coverage and each non-obvious rule.
4. Explicit exclusions and visible user-selected allowances.
5. Tests for zero/blank/negative inputs, unit changes, fractional quantities and round-up boundaries.
6. Currency/source matching tests before any cost range is displayed.
7. Browser QA at mobile and desktop sizes, keyboard navigation, and a screenshot/report artifact.
8. No impact on existing calculator tabs, shared-room inputs, Project List or privacy behavior.

## 6. Research limits and next verification

- Search-demand figures are third-party estimates and snapshots; re-check before writing a public content brief or committing engineering capacity.
- OpenSEO returned `INSUFFICIENT_CREDITS` for the seven-seed discovery attempt; no paid keyword research was charged or used in this roadmap.
- Google Search Console is not connected, so no first-party demand, impressions, clicks or ranking claims are made.
- Plaster has no comparable US keyword metric in this pass and remains grouped with drywall until a separate demand/SERP check.
- Product data is intentionally not copied into `reference_prices.json` here. This is a roadmap only; each calculator needs its own source/coverage review before implementation.

## Sources checked

### Search-demand snapshots
- [Tile calculator — US keyword report](https://www.kwstrends.com/keywords/us/tile-calculator)
- [Mulch calculator — US keyword report](https://www.kwstrends.com/keywords/us/mulch-calculator)
- [Concrete slab calculator — US keyword report](https://www.kwstrends.com/keywords/us/concrete-slab-calculator)
- [Drywall calculator — US keyword report](https://www.kwstrends.com/keywords/us/drywall-calculator)
- [Fence calculator — US keyword report](https://www.kwstrends.com/keywords/us/fence-calculator)
- [Deck calculator — US keyword report](https://www.kwstrends.com/keywords/us/deck-calculator)
- [Insulation calculator — US keyword report](https://www.seodata.dev/keyword/insulation-calculator)

### Calculation, coverage and safety references
- [Home Depot — How to Lay Out Tile](https://www.homedepot.com/c/ah/how-to-lay-out-tile/9ba683603be9fa5395fab9035335ddf)
- [Home Depot — How to Calculate Deck Materials](https://www.homedepot.com/c/ah/how-to-calculate-deck-materials/9ba683603be9fa5395fab90a84d7ea3)
- [Lowe's — How to Install a Vinyl Fence](https://www.lowes.com/n/how-to/install-vinyl-fencing)
- [Outdoor Essentials — Fence Calculator for Preassembled Panels](https://pdf.lowes.com/productdocuments/89dcd302-00ce-4578-ba9d-5bffaefc4b87/15274086.pdf)
- [QUIKRETE — Concrete Calculator](https://www.quikrete.com/calculator/main.asp)
- [QUIKRETE — Calculating Concrete Volume and Bag Yield (training PDF)](https://www.quikrete.com/dealers/training/presentations/3-mixing-placing-concrete-cement-mixes-training.pdf)
- [USG — Sheetrock Wallboard Estimator](https://assemblies-tools.usg.com/content/usgcom/en/resource-center/tools/sheetrockestimator.html)
- [British Gypsum — Plaster Coverage Calculator](https://www.british-gypsum.com/technical-support/self-help-tools/plaster-coverage-calculator)
- [Oregon State University Extension — Raised Bed Gardening](https://extension.oregonstate.edu/catalog/fs-270-raised-bed-gardening)
- [University of Minnesota Extension — Mulching for Soil and Garden Health](https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/mulching-for-soil-and-garden-health)
- [US Department of Energy — Consumer Guide to Home Insulation](https://www.energy.gov/sites/default/files/2021-11/ES-HomeInsulation_081721E-a.pdf)
- [US Department of Energy — Building America Climate-Specific Guidance](https://www.energy.gov/cmei/buildings/building-america-climate-specific-guidance)
