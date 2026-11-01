# Calculator Discovery Foundation — Search Questions, Practical Answers and Site Architecture

**Created:** 2026-11-01  
**Related work:** PR #214 and `docs/HOME-CALCULATOR-EXPANSION-ROADMAP.md`  
**Status:** Research and implementation specification. Question ideas are hypotheses to validate, not measured keyword volumes or proof of demand. This document does not authorize publishing new pages or merging the draft PR.

## 1. Objective

Make HomeProjectWise calculators discoverable through the real questions people ask before home projects. The calculator must be the useful answer, while supporting explanations help visitors understand the inputs, assumptions, choices and next steps.

The discovery system has four layers:

1. **Calculator hub:** a crawlable directory of tools grouped by the decisions they help with.
2. **Focused calculator pages:** one distinct task per page, with the working calculator as the main content.
3. **Question-led supporting content:** practical explanations, worked examples, comparisons and troubleshooting that answer a distinct need and link to the relevant calculator.
4. **Contextual internal links:** existing articles, guides and tools link to one another where the next step is genuinely useful.

Do not create a separate URL for every wording variation of the same question. Combine closely related questions on the page that fully solves the shared intent. Create a separate page only when the visitor's task, method, inputs or decision is materially different.

## 2. Question bank and practical solution map

The questions below are a starting research backlog. They are not claimed to be the 50 most searched questions. Validate priority with Search Console query/page data, autocomplete and related-search research, customer/reader feedback, and actual tool usage. Avoid manufacturing search volume or demand.

### A. Project cost and budgeting

| Visitor question | Practical answer / tool behaviour | Priority |
|---|---|---|
| How much will my home project cost? | Itemised budget: quantities × local unit prices, labour, delivery, disposal, contingency and optional tax | P1 |
| How do I calculate the cost of renovating one room? | Room-based estimate with separate work categories and a clear exclusions list | P1 |
| How much should I set aside for unexpected project costs? | User-adjustable contingency shown separately; explain it is a planning allowance, not a universal rule | P1 |
| How much do materials cost for my project? | Quantity calculator linked to editable local unit prices | P1 |
| How do I compare two project quotes fairly? | Quote comparison worksheet with matching scope, quantities, exclusions, labour and tax; no invented market prices | P2 |
| How much will labour add to the project? | Hours × entered rate, or contractor quote entered by user; clarify differences between estimate and quote | P2 |
| Can I complete this project within my budget? | Budget cap minus itemised estimated costs; show remaining amount or shortfall | P1 |
| What is the cheapest way to complete this project without wasting materials? | Compare user-entered product/pack options and purchase quantities; never equate cheapest with best/safe | P2 |

### B. Paint, walls and wallpaper

| Visitor question | Practical answer / tool behaviour | Priority |
|---|---|---|
| How much paint do I need for a room? | Wall area minus openings, coats, product-label coverage and allowance; show tin count | P1 |
| How many litres of paint do I need for two coats? | Same paint calculator, with coat count explicit and coverage source explained | P1 |
| How much does it cost to paint a room? | Paint quantity × user-entered tin price plus optional primer, labour and supplies | P1 |
| How do I calculate wall area when a room has doors and windows? | Explain perimeter × height and subtract measured openings; link to paint tool | P1 |
| How much wallpaper do I need? | Roll dimensions, usable pattern-repeat length, wall dimensions, openings and manufacturer guidance | P2 |
| How much primer do I need before painting? | Surface area and label coverage; account for surface condition only where product guidance supports it | P2 |
| How much paint is needed for a ceiling? | Ceiling area × coats ÷ label coverage, with allowance; distinct from wall-only calculation | P2 |
| How do I estimate paint for an irregular room? | Split the room into rectangles/sections and add areas; provide a worked example | P2 |

### C. Flooring, tile and finishes

| Visitor question | Practical answer / tool behaviour | Priority |
|---|---|---|
| How much flooring do I need for my room? | Area plus chosen cut/waste allowance, divided by pack coverage, rounded up | P1 |
| How many floor tiles do I need? | Room area and tile face dimensions; separate joint/cut/pattern assumptions | P1 |
| How much will new flooring cost? | Required packs × local price plus underlay, trims, labour and removal if applicable | P1 |
| How much extra flooring should I buy for cuts and waste? | Explain factors; allow user to set an allowance rather than impose one universal percentage | P1 |
| How much grout do I need? | Tile dimensions, joint width/depth and product yield; use manufacturer formula/data where available | P2 |
| How much tile adhesive or thinset do I need? | Area and product coverage adjusted for trowel/substrate only with sourced manufacturer data | P2 |
| How many boxes of laminate or vinyl flooring do I need? | Room area ÷ package coverage, round up; account for multiple rooms and package rounding | P1 |
| How much skirting/baseboard do I need? | Room perimeter minus door openings, plus user-selected cutting allowance | P2 |

### D. Concrete, soil and bulk materials

| Visitor question | Practical answer / tool behaviour | Priority |
|---|---|---|
| How much concrete do I need for a slab? | Length × width × thickness; convert volume to product bags/m³ using exact product yield | P2 |
| How many concrete bags do I need? | Required volume ÷ stated bag yield; round up and state yield is product-specific | P2 |
| How much gravel do I need for a driveway or path? | Area × depth; convert volume to weight only with a defensible density/source and caveat | P2 |
| How much sand do I need for a project? | Volume from dimensions; distinguish loose volume from compacted requirement | P2 |
| How much topsoil or garden soil should I buy? | Garden area × desired depth; convert to bag or bulk volume | P2 |
| How much mulch do I need for a garden bed? | Area × depth, with units and bag coverage clearly stated | P2 |
| How much screed or mortar do I need? | Area × thickness and product yield from technical data | P3 |
| How many drywall/plasterboard sheets do I need? | Wall/ceiling area, sheet dimensions, layout and cutting allowance | P2 |

### E. Electricity and appliance running costs

| Visitor question | Practical answer / tool behaviour | Priority |
|---|---|---|
| How much does it cost to run an appliance? | Watts ÷ 1,000 × hours × days × entered tariff | P1 |
| How much electricity does this appliance use per month? | kWh/day, 30-day estimate and annualised estimate with usage assumptions | P1 |
| How much does it cost to leave a device on standby? | Standby watts × hours × tariff; explain measurement uncertainty at very low wattage | P2 |
| Which appliance costs less to run? | Side-by-side inputs for power, usage and tariff; compare kWh and cost over the same period | P1 |
| How much could I save by replacing an old appliance? | Compare measured/labelled energy use and purchase cost; show annual savings and simple payback only when inputs exist | P2 |
| How much does a heater cost to run overnight? | Power × entered hours × tariff; do not assume continuous full-power operation for thermostatic devices | P1 |
| How much does a dehumidifier cost to run? | Rated/measured watts × actual daily runtime × tariff; link to existing moisture guidance | P1 |
| How much does lighting cost per month? | Bulb watts × number × hours × days × tariff; compare alternatives | P2 |

### F. Water, plumbing and hot water

| Visitor question | Practical answer / tool behaviour | Priority |
|---|---|---|
| How much water does my shower use? | Flow rate × duration; show litres/gallons and configurable local water tariff | P2 |
| How much does a daily shower cost? | Water volume plus heating energy if inputs and method are available; separate water and energy assumptions | P3 |
| How much water is wasted by a dripping tap? | Measured drip rate over time; avoid generic claims unless supported by a cited method | P2 |
| How much will a leak cost me? | User-measured flow/leak rate × time × entered tariff; explain that actual billing may include tiers/sewer charges | P2 |
| What size water tank do I need? | User-defined demand and days of supply; distinguish storage estimate from plumbing/code design | P3 |
| How much does it cost to heat water? | Water volume, temperature rise, energy efficiency and tariff; state assumptions and formula | P3 |

### G. Heating, cooling, insulation and comfort

| Visitor question | Practical answer / tool behaviour | Priority |
|---|---|---|
| How much does it cost to heat one room? | Heater power/runtime/tariff; distinguish portable heater estimate from whole-home heating | P1 |
| How much does an air conditioner cost to run? | Rated input power or measured consumption × runtime × tariff; avoid using cooling capacity as electrical input | P1 |
| How much could I save by changing thermostat settings? | Compare user-entered schedules and measured/estimated consumption; do not promise fixed savings percentages | P2 |
| How much insulation do I need for an attic? | Area ÷ product coverage or pack yield; explain thickness/R-value selection needs local guidance | P2 |
| How much could draft sealing cost? | Measure gaps/lengths and user-entered product prices; distinguish material cost from professional work | P2 |
| What size dehumidifier do I need for a room? | Room volume and manufacturer capacity guidance; present as preliminary screening, not diagnosis | P2 |
| How much does a fan cost to run overnight? | Watts × hours × tariff; link to ventilation/moisture articles where relevant | P2 |

### H. Garden, outdoor and maintenance projects

| Visitor question | Practical answer / tool behaviour | Priority |
|---|---|---|
| How much soil do I need for a raised bed? | Bed length × width × fill depth, with volume conversion | P2 |
| How much gravel do I need for a garden path? | Path area × depth, then product volume/weight if sourced | P2 |
| How much decking or fencing material do I need? | Dimensions, board/panel widths, spacing, posts and cutting allowance; require clear assumptions | P3 |
| How much exterior paint or stain do I need? | Surface area × coats ÷ label coverage; distinguish porous/previously coated surfaces | P2 |
| How much will it cost to maintain this home task annually? | Frequency × user-entered unit costs; show assumptions and editable schedule | P3 |

## 3. Page architecture: one intent, one best destination

Recommended structure (illustrative; use the repository's actual routes and naming conventions when implemented):

- `tools.html` — main tools directory, grouped by decision: measure, materials, project cost, energy, water, comfort, outdoor.
- `home-project-calculator.html` — multi-purpose starting tool; not a substitute for focused pages where the task needs a distinct method.
- Focused pages as validated: `paint-calculator.html`, `flooring-calculator.html`, `electricity-cost-calculator.html`, `project-cost-estimator.html`, and later concrete/soil/water tools.
- Supporting articles answer distinct "how/why/which" questions and link to the calculator at the exact point of need.
- Avoid publishing near-duplicate pages for "paint calculator", "paint cost calculator", "how much paint do I need" if one strong page can satisfy all three intents. Use headings and examples within that page.

## 4. Required anatomy of a search-discoverable calculator page

Every focused calculator page should contain the following, with the working tool near the top:

1. **Descriptive title and H1:** name the task and the outcome (e.g. calculate flooring quantity and estimated cost).
2. **Short direct answer:** say what the tool calculates, who it helps and what the result means.
3. **Working calculator in the initial page content:** usable on mobile and keyboard; not gated behind sign-in or an interaction that prevents understanding.
4. **Input guide:** explain each field, unit and where to find product-label values.
5. **Formula and assumptions:** show the actual formula and conversion basis.
6. **Worked example:** realistic illustrative inputs, step-by-step calculation and output; label it as an example, not a typical price or universal result.
7. **Practical decisions:** how to reduce waste, compare product packs, interpret a result and know when to seek professional advice.
8. **Limits and exclusions:** irregular shapes, substrate, local code, tax structure, equipment cycling, hidden damage, etc., as applicable.
9. **Relevant FAQs:** answer genuine follow-up questions, not keyword permutations.
10. **Related guides and tools:** crawlable contextual links with descriptive anchor text.
11. **Trust signals:** source notes, method/review date where applicable, editorial policy and clear site/about information.
12. **Technical foundation:** unique title/description, self-canonical, indexable response, descriptive URL, valid breadcrumb path, sitemap entry after QA, and no broken internal links.

## 5. Internal linking plan

Build a two-way contextual network, not a footer-only link list.

- Tools hub → every validated calculator, grouped under clear categories.
- Focused calculator → relevant explanatory guides, and adjacent tools only where they genuinely help.
- Supporting article → relevant calculator near the decision point (e.g. paint article → paint quantity/cost tool).
- Existing calculator/tool → broader budget planner when the visitor needs a full project total.
- Related tools cross-link only when there is a natural next step; avoid sitewide repetitive exact-match anchors.

Every important calculator should have at least one crawlable internal link from a relevant, already-indexed page. Use descriptive anchor text such as "estimate the paint needed for two coats" rather than repeated generic "click here". Check links resolve on the deployed site, not merely in the branch.

## 6. Structured data and technical discoverability

- Keep visible page content as the source of truth. Structured data must accurately describe the page and match visible content.
- Retain or improve suitable `WebApplication` / `SoftwareApplication` markup only if the page truly meets the type's definition; do not expect markup itself to improve rankings.
- Use `BreadcrumbList` only when the visible breadcrumb hierarchy is present and accurate.
- FAQ sections are useful for people and answer engines, but do not promise Google FAQ rich results. Google has limited FAQ rich-result visibility primarily to authoritative government and health sites; FAQ markup is not a general-purpose traffic tactic.
- Do not add fabricated ratings, reviews, prices, offers, author credentials, or review dates to structured data.
- Ensure essential explanation and calculator labels are present in crawlable HTML. Test the rendered page because client-side functionality and tabs can affect what users and crawlers can access.
- Keep canonical URLs consistent with sitemap and internal links. Do not submit or add a URL until its live route, response, canonical, robots/indexability and content quality are checked.
- A sitemap helps discovery but does not guarantee crawling, indexing or ranking.

## 7. Answer-engine / AI-search readiness

For each calculator, make it easy to understand, verify and cite:
- Give a concise, self-contained explanation of what it calculates.
- Define units and terms (kWh, coverage per pack, contingency, flow rate).
- Show the formula, assumptions and a worked example with reproducible arithmetic.
- Cite authoritative sources for technical constants, product yield, safety and regulated topics.
- Separate sourced facts from user-entered assumptions and illustrative examples.
- State what the calculator cannot determine.
- Use consistent names and internal links between the tool, related topic guides and methodology.
- Provide genuinely useful unique value; do not create text blocks solely to repeat questions or stuff keywords.

No formatting, schema, or question list guarantees inclusion or citation by an AI answer engine. Measure referrals and citations where observable, and keep the benchmark tests separate from ordinary organic search metrics.

## 8. Research and measurement workflow

For each candidate question:
1. Search current Search Console queries and pages for evidence already available to the site.
2. Explore autocomplete/related searches and competing result formats manually; record date, locale and exact phrasing.
3. Classify intent: calculate quantity, calculate cost, compare options, learn method, troubleshoot, or safety/eligibility.
4. Identify the single best destination: existing page, improvement to an existing tool, new focused calculator, or no action.
5. Record competitor gaps and the original value HomeProjectWise can provide.
6. Estimate implementation and validation effort; do not equate search volume with visitor value.
7. Test formula and UX before release.
8. After release, compare impressions, clicks, CTR, position, calculator starts/completions and relevant referrals over equal date windows.

The question bank should be updated from observed data. Do not create dozens of articles from the table in one batch.

## 9. First execution priorities

1. Complete QA of the existing five-module calculator proposal in PR #214.
2. Fix zero-hour validation and keyboard tab interaction; decide whether to add imperial units to materials or explicitly document the limitation.
3. Improve the project-cost tool into a genuine multi-line-item estimator in a later, separately tested change.
4. Strengthen `tools.html` as the hub and verify a crawlable route from main navigation.
5. Select only the first few focused tools after reviewing current pages and Search Console evidence: paint quantity/cost, flooring quantity/cost, appliance running cost and itemised project budget are candidates, not automatic approvals.
6. Map existing relevant articles to these tools before creating new supporting articles.
7. Publish only after the Value Before Publishing acceptance gate is satisfied.

## 10. Sources and implementation references

Google Search Central guidance consulted for this specification:
- SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Search Essentials: https://developers.google.com/search/docs/essentials
- Creating helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Link best practices: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- FAQ and How-To rich-result changes: https://developers.google.com/search/blog/2023/08/howto-faq-changes

Key implications: create useful original content, anticipate natural language used by readers, make internal links crawlable and descriptive, and do not treat structured data or indexing eligibility as a ranking guarantee.
