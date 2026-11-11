# HomeProjectWise — Calculator cost-intent mini-benchmark

**Version:** 1.0  
**Created:** 2026-11-02  
**Status:** Prepared; no platform runs performed.  
**Market/language:** United States / English, matching the site-wide 40-question benchmark.  
**Relationship:** This is a focused supplement to `CAO-AI-QUESTION-BENCHMARK.md`; it does not replace, renumber or modify the fixed 40 questions.

## 1. Why this sample exists

Home-project visitors often need to make a cost decision before buying materials or running equipment. A useful calculator can answer a concrete question, expose the assumptions behind the estimate, and provide a reproducible method that an answer engine can cite. This sample tests those tasks rather than generic brand-awareness prompts.

These are fixed test prompts, **not measured keyword volumes** and not proof of search demand. The existing Search Console snapshot does not establish demand for every prompt below. Use the questions to test citation quality after the tool is genuinely ready; do not use them to justify publishing thin pages.

## 2. Fixed questions and destination fit

| ID | Exact test question | Intended destination | What a useful, supportable answer must contain |
|---|---|---|---|
| CC-01 | How much paint do I need for a room, and how can I estimate the total paint cost? | Multi-purpose calculator — paint module; future focused paint calculator only if distinct demand is demonstrated | Wall area, openings, number of coats, product-label coverage, user-selected allowance, rounded-up tins/packs and user-entered price; show assumptions rather than a universal price |
| CC-02 | How many flooring or tile packs do I need for my room, and what will the materials cost? | Multi-purpose calculator — material-pack module | Measured area, user-selected waste allowance, coverage per pack, rounded-up pack count and entered local price |
| CC-03 | How can I estimate a home-project total when I know the quantity and unit price but also have extras, contingency and tax? | Multi-purpose calculator — project-cost module | Transparent order of operations, editable inputs, separate extras/contingency/tax and a clear note about costs not entered |
| CC-04 | How much will it cost to run a 1,000-watt appliance for 2 hours a day over 30 days? | Multi-purpose calculator — electricity module | 60 kWh for the stated usage and cost calculated from the user's tariff; explain watts-to-kilowatts conversion |
| CC-05 | How much does a dehumidifier cost to run per month, and which numbers do I need to calculate it? | Electricity module plus crawl-space/dehumidifier guidance | Use rated or measured input watts, actual runtime, days and tariff; distinguish rated maximum draw from cycling/real-world consumption |
| CC-06 | What will it cost to run a portable heater overnight if I know its wattage, hours and electricity price? | Electricity module | Formula using input watts, actual hours and tariff; do not assume a thermostat-controlled heater draws full rated power continuously |
| CC-07 | How do I calculate material cost when prices and package coverage differ between stores? | Material-pack module; budget planner for the wider project | Compare like-for-like coverage and package count using prices supplied by the visitor; do not invent or scrape stale store prices |
| CC-08 | How much extra should I budget for material waste and unexpected project costs? | Paint/material allowance fields and project contingency field | Explain that material allowance and project contingency solve different problems; let the visitor choose values and avoid presenting one percentage as universally correct |
| CC-09 | How can I check whether a project estimate fits my maximum budget? | Budget planner, with project-cost calculator as an input source | Compare the visitor's budget with an itemised estimate and show remaining amount or shortfall; do not imply that the current multi-purpose calculator already has a budget-cap comparison unless implemented |
| CC-10 | How can I compare the monthly electricity cost of two appliances using the same tariff and usage period? | **Current product gap:** electricity module currently calculates one appliance at a time; a side-by-side comparison is a candidate enhancement, not a capability to claim | A valid comparison needs two independent wattage/runtime inputs, the same tariff and period, and a clear difference in kWh and cost; build only if evidence and value justify it |

## 3. Test protocol

For each question, run the exact wording on ChatGPT Search, Google AI Overviews/AI Mode when actually displayed, Microsoft Copilot and Perplexity. Follow the capture protocol and scoring rules in the parent 40-question benchmark:

- Record UTC date/time, platform and mode, region, language and exact prompt.
- Record direct citation, unlinked mention, no observed presence or not observable.
- Capture the exact HomeProjectWise URL and the answer passage it supports.
- Judge support independently: supported, partly supported, unsupported or not assessed.
- Record factual errors, unsafe omissions, incorrect arithmetic, missing assumptions and broken/noncanonical links.
- Keep citation presence separate from answer correctness and from attributable referral visits.

**Baseline gate:** do not run the baseline against PR previews or a draft calculator. First require: final tool-pipeline integration; successful calculation tests; actual browser checks for HTML form validation and each module; mobile layout; keyboard and screen-reader review; no unexpected network transmission of entered values; canonical/live URL verification. If these checks are incomplete, the benchmark remains pending.

## 4. Interpretation and product decisions

- CC-01 to CC-08 test functions described in the proposed multi-purpose calculator; they do not prove those functions are already production-ready.
- CC-09 is assigned to the existing budget-planning experience, not assumed to be part of the new calculator.
- CC-10 is deliberately marked as a gap. Do not advertise side-by-side appliance comparison until it exists and passes QA.
- A citation is meaningful only when the cited page is the correct canonical destination and its visible method supports the answer. A mention without a useful citation is partial presence, not a win.
- If a platform repeatedly gives the correct formula but cites a stronger competitor, inspect the actual difference in source clarity, examples, trust and usability before editing. Do not add repetitive keyword copy as a response.
- Compare repeated runs cautiously. Answer engines vary, and a single citation/no-citation observation does not prove that an edit caused a change.

## 5. Result register

| Run date (UTC) | Platform/mode | ID | Presence (2/1/0/N/O) | HPW URL cited | Supports answer? | Error/safety issue | Referral observed? | Notes |
|---|---|---|---|---|---|---|---|---|
| Not run | — | CC-01–CC-10 | — | — | — | — | — | Waiting for tool-pipeline integration, browser QA and live release |

## 6. Ownership

- **ChatGPT:** maintain the prompt set, map intent to the right destination, analyse observations and recommend evidence-led content changes.
- **Claude:** implement the calculator through the existing generator/tool pipeline, run code and browser-level tests, and report actual test evidence and limitations.
- **Owner:** approve merges and deployment; no draft or benchmark document authorizes publication by itself.

The Value Before Publishing law applies to every proposed calculator enhancement. A question in this register is a test case, not automatic approval to create another page or feature.


## 7. Competitor snapshot and differentiation test (reviewed 2026-11-02)

This is a focused review of visible calculator features on representative alternatives, not a complete market census, traffic study or ranking analysis. URLs were opened through current search results; observations below describe visible capabilities, not verified backend behaviour.

### Paint quantity and cost

| Alternative | Visible capabilities | Implication for HomeProjectWise |
|---|---|---|
| [BasedFrame Paint Calculator](https://www.basedframe.com/free-tools/paint-calculator) | Room perimeter/wall length, height, doors/windows, optional ceiling, coats, label coverage, waste, litres/gallons and tin count; states browser-local operation | These are table-stakes, not a differentiator. |
| [CalcsBay Paint Calculator](https://calcsbay.com/paint-calculator) | Multiple rooms or wall groups, individual openings, coats, manufacturer coverage, waste, purchase increments and price | Multi-room workflow is a meaningful gap if our page only handles one room. |
| [ExactKit Paint Quantity & Cost](https://exactkit.tools/calculators/construction-electricity/paint-calculator) | Wall/surface groups, openings, coats, waste, tin size, primer and material cost; formula and worked example | Primer and explicit purchase-unit logic are additional comparison points. |
| [Hasebah Tunisia Paint Calculator](https://hasebah.com/en/tn/calculators/paint) | Tunisia/TND context, adjustable coverage, advanced opening inputs, cost display and formula explanation | Local-market language/currency context may be valuable, but its surfaced result contains inconsistent unit labels; do not copy assumptions without checking. |

### Flooring quantity and cost

| Alternative | Visible capabilities | Implication for HomeProjectWise |
|---|---|---|
| [Project Home Calc Flooring Calculator](https://www.projecthomecalc.com/calculators/flooring/flooring-calculator) | Room dimensions, waste, box coverage, price per box, boxes rounded up and material cost | Our basic pack module must be exceptionally clear and accurate; this is a direct baseline. |
| [FixerCalc Flooring Calculator](https://fixercalc.com/flooring/flooring-calculator) | Room dimensions or known area, product/box coverage, waste, order quantity and editable cost; warns that labour and subfloor work are extra | Clear exclusions are a trust requirement. |
| [CalcRabbit Flooring Calculator](https://www.calcrabbit.com/flooring-calculator/) | Shows measured area, waste-adjusted area, boxes, purchased coverage, leftover and cost based on full boxes | Showing purchased coverage and leftover material is a concrete improvement opportunity if it can be added without clutter. |
| [Cost My Reno Flooring Calculator](https://costmyreno.com/calculators/flooring-cost-calculator) | Separates material and labour pricing and produces a total estimate | Material-only totals must be labelled clearly; a broader project estimate needs explicit labour inputs. |

### Appliance running cost

| Alternative | Visible capabilities | Implication for HomeProjectWise |
|---|---|---|
| [Ponderloop Electricity Cost Calculator](https://www.ponderloop.com/tools/electricity-cost-calculator/) | Multiple appliances, presets/custom watts, user tariff, per-row and total daily/monthly/yearly kWh and cost; says inputs stay in browser | A one-appliance calculator is useful but not differentiated against multi-appliance tools. |
| [WattDollar](https://watt-dollar.com/) | Large appliance preset catalogue, editable power/use/rate, per-hour/day/month/year cost and source notes | Appliance presets and annual comparisons are future opportunities, not claims about our current module. |
| [KilowattKit](https://kilowattkit.com/tools/electricity/appliance-energy-cost) | Presets/custom watts, hours, days/week, tariff, daily/monthly/yearly cost and kWh | Results over several time horizons are common user expectations. |

### Project budgeting

| Alternative | Visible capabilities | Implication for HomeProjectWise |
|---|---|---|
| [Houzz Pro Project Cost Estimator](https://pro.houzz.com/houzz-pro/construction-calculators/project-cost) | Multiple line items, quantity × unit cost, overhead and contingency | Our single quantity/unit-price/extras model is materially simpler; do not describe it as a full renovation estimator. |
| [Pennyloom Renovation Budget Calculator](https://world.invnty.com/home/renovation) | Area-based materials and labour, fixed fees, waste and contingency; explains the formula and exclusions | Labour, fixed costs and explicit exclusions are important when promising a project total. |
| [Juniper Handyman Cost Estimator](https://estimator.juniperhandyman.com/) | Multiple trades/scopes, materials, consumables, trade labour and contingency, with ranges | Broad estimators use many assumptions; our user-entered prices avoid invented regional prices but require more inputs from the visitor. |

### Honest differentiation verdict

The proposed multi-purpose calculator has a convenience advantage: several common home calculations are gathered in one browser page, with visitor-entered dimensions, product coverage and local prices. However, the competitor scan shows that paint, flooring and appliance-cost calculators with formulas, waste allowances and price inputs already exist in abundance. **Combining five familiar modules on one page is not, by itself, a defensible competitive advantage.**

Before merge/publication, the implementation should at minimum prove these points in its visible UX and tests:

1. Every module uses transparent formulas and units; the visitor can reproduce the result.
2. The visitor enters product-label coverage and their own local price; no stale universal price is presented as current.
3. Purchase quantities round up correctly, and cost is based on the actual purchase unit (whole tins/packs), not silently on theoretical consumption.
4. Material allowance, project contingency, labour, tax and other exclusions are not conflated. If labour is not entered, say so beside the total.
5. The tool is genuinely easier to use on mobile than switching among separate tools, without hiding any module or its explanation behind inaccessible tabs.
6. The privacy statement is tested against actual network requests, not merely asserted in copy.

**Scope gaps to record, not silently add before the 2026-11-05 checkpoint:** multi-room paint/flooring, side-by-side appliance comparison, multiple project line items, labour/overhead, purchased-coverage/leftover breakdown, and save/export/share. Treat each as a separate hypothesis; add only after usage or search evidence and an 85/100 value review. The calculator should not be marketed as a complete renovation-cost estimator while these gaps remain.

This review does not authorize adding features, creating separate pages, changing protected files, or merging #214. Claude is asked to challenge the accuracy and practical impact of this verdict as part of the consolidated technical review.
