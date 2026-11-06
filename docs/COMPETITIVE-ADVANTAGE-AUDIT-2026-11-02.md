# HomeProjectWise competitive advantage audit — 2026-11-02

**Status:** research brief / proposed operating plan; not a claim of market leadership and not authorization to publish, merge, deploy, change hosting, or lift the 2026-11-05 editorial freeze.

## Executive finding

HomeProjectWise is **not currently demonstrably one of the leading sites in home improvement**, has **not demonstrated superiority over the strongest 20 competitors**, and has **not completed every SEO or CAO workstream**. The available performance baseline is an early-site signal, not a competitive result: the 2026-11-01 log records 414 Google web impressions, 1 click, 0.24% CTR, average position 20.8 and 50 queries for 2026-09-20–2026-10-31. Google had indexed 23/45 submitted URLs; 21 were still unknown and one was crawled-not-indexed. Bing reported no performance impressions in the recorded period. These numbers do not support a leadership claim.

This is not a verdict that the project cannot win. It means we must earn a **narrow, measurable advantage** rather than claim broad superiority. The most credible strategic position is:

> **The practical home-project decision site: calculate the real materials and cost implications, understand the trade-offs, and know when a DIY solution is not appropriate — with transparent assumptions, sources, and privacy-respecting tools.**

The strongest potential differentiator is not “more articles”. It is a connected decision workflow: a useful calculator + transparent method + worked example + decision guide + safety/fit limits + related next step. This must be validated with users and search data before being scaled.

## 1. Evidence boundary

### What is verified
- Search baseline and indexing state are recorded in `data/SEARCH_METRICS.md` (snapshot 2026-11-01).
- The CAO integration document itself identifies missing artifacts: a keyword/intent map with cannibalization control; a URL/indexing table; hub/supporting-guide structure; per-page AI-citation checklist; AI visibility measurement; and an approved CI coverage proposal.
- The quality-gate repair queue was reported complete in the 2026-11-02 Claude handoff, except the intentional redirect stub. This is a content-gate result, **not** proof that every article is excellent, ranks, is indexed, or beats competitors.
- The calculator PR is not validated yet: the Node/DOM-stub tests are not browser, mobile, accessibility, or network-privacy evidence. Its generated-page/index pipeline issue remains open.

### What is not verified
- No defensible global “top 20” ranking or competitor traffic/keyword dataset has been collected here.
- No systematic 20-domain crawl, backlink comparison, content-gap export, page-speed field data, or AI citation sample is complete.
- A search-result appearance or a competitor's feature list does not prove its actual quality or weakness.
- Search engines do not provide a single universal “SEO complete” badge. Technical compliance is necessary, not a guarantee of ranking or citation.

Therefore the 20-site set below is a **representative benchmark set across overlapping jobs**, not a ranked list of the 20 strongest domains. Before saying “we beat competitor X”, Claude must verify the exact competing URL and evidence.

## 2. Representative competitor and reference set

The set deliberately includes publishers, calculators, retailers/marketplaces, communities, and primary authorities. These groups compete for different parts of a homeowner's journey; they must not be scored as if they were identical businesses.

| # | Site / reference | Strongest competitive asset to respect | Opportunity for HomeProjectWise (hypothesis to test, not an asserted defect) |
|---:|---|---|---|
| 1 | This Old House | Expert-led repair/renovation explanations, video and deep project coverage | Win narrow “what should I choose / how much will it cost / does this fit my case?” tasks with interactive, transparent decision tools alongside concise guidance. |
| 2 | Family Handyman | Broad practical DIY coverage and step-by-step project format | Be more explicit about assumptions, decision branches, quantified trade-offs and when not to DIY. Verify page by page. |
| 3 | Bob Vila | Established home-repair and product knowledge footprint | Offer tighter task-specific tools and traceable calculations rather than competing on breadth. |
| 4 | The Spruce | Broad home, cleaning, decor and household coverage | Own tightly connected problem clusters with original tools, diagrams and explicit limits. |
| 5 | Better Homes & Gardens | Strong household/lifestyle breadth and visual presentation | Focus on measurable project outcomes and practical decisions rather than inspiration breadth. |
| 6 | HGTV | Strong visual storytelling, renovation inspiration and video | Pair concise written instructions with useful interactive estimates and source-backed decisions. |
| 7 | Houzz | Design inspiration, photos, professionals and community | Serve the pre-project decision stage with calculations, constraints and clear DIY/professional boundaries. |
| 8 | Angi | Contractor marketplace and cost/lead-generation intent | Provide a neutral pre-quote worksheet and explain which inputs materially change a quote; do not pretend to replace local quotes. |
| 9 | HomeAdvisor | Service matching and project-cost intent | Help users understand scope and prepare comparable quote requests before contacting a provider. |
| 10 | Homewyse | Large catalogue of installation-cost examples and cost breakdowns | Differentiate through user-editable local quotes, transparent inputs, uncertainty and project-specific calculations; never invent current prices. |
| 11 | Inch Calculator | Broad specialist calculator library and measurement/conversion coverage | Make outputs actionable: purchase units, waste, total cost, formula, example and limits in one workflow. |
| 12 | Omni Calculator | Broad range of interactive calculators and flexible inputs | Build deeper home-project context, not a generic one-number calculator. |
| 13 | Calculator.net | Breadth, familiarity and simple calculation intent | Provide project-specific guidance and decision support after the result. |
| 14 | The Home Depot | Product catalogue, product specifications, availability and purchase journey | Remain retailer-neutral; help users calculate quantities and compare their own prices before shopping. |
| 15 | Lowe's | Product ecosystem, project advice and retail journey | Provide independent pre-purchase estimates and expose assumptions rather than steer to one retailer. |
| 16 | wikiHow | Huge how-to breadth and illustrated step sequences | Win narrow, high-consequence home decisions with reliable primary sources, exact constraints and tools. |
| 17 | Reddit / r/DIY and relevant communities | First-hand edge cases, troubleshooting and lived experience | Turn recurring questions into carefully sourced decision trees; do not fabricate first-hand experience or treat anecdotes as standards. |
| 18 | Stack Exchange / Home Improvement | Specific questions and peer-reviewed community discussion | Answer repeatable questions with a stable, maintained canonical guide or calculator, while linking to primary standards. |
| 19 | US EPA | Authoritative moisture, mold and indoor-air guidance | Translate primary guidance into a usable homeowner diagnostic flow without replacing or overstating the source. |
| 20 | Home Ventilating Institute (HVI) | Ventilation guidance and certified-product context | Convert room/fixture inputs into a transparent fan-sizing decision, clearly showing the standard/source and installation limits. |

### Source examples reviewed for this first pass
- This Old House below-grade toilet guide: https://www.thisoldhouse.com/bathrooms/how-to-install-a-toilet-below-grade
- Homewyse project cost calculators: https://www.homewyse.com/project_costs/
- Inch Calculator: https://www.inchcalculator.com/
- Omni Calculator: https://www.omnicalculator.com/
- Calculator.net: https://www.calculator.net/
- EPA moisture control: https://www.epa.gov/mold/what-are-main-ways-control-moisture-your-home
- EPA mold/moisture guide: https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home
- HVI ventilation sizing: https://www.hvi.org/resources/publications/home-ventilation-guide-articles/how-much-ventilation-do-i-need/
- HVI bathroom exhaust fans: https://www.hvi.org/resources/publications/bathroom-exhaust-fans/
- Retail references: https://www.homedepot.com/ and https://www.lowes.com/

These references establish examples of competitor/reference positioning and primary-source material; they do **not** establish a complete comparative score.

## 3. Where we can realistically outperform

### A. Strengths of large competitors we should not try to imitate blindly
1. **Authority and breadth:** large publishers and retailers have years of content, brand recognition, links and distribution. We cannot out-publish them or manufacture equivalent authority quickly.
2. **Professional and product ecosystems:** retailers and marketplaces have inventory, pricing, contractor networks and local service data we do not own.
3. **Specialist expertise:** technical authorities and expert-led publishers may have credentials, testing facilities or standards access that we must not imply we possess.
4. **Community experience:** forums can surface unusual real-world cases; we cannot claim personal field experience we did not perform.

### B. Gaps we can target with a distinctive experience
1. **The answer is often fragmented.** A user may need a guide, a formula, a price assumption, a materials list and a “when this won't work” warning across several pages. Build one connected workflow for one validated intent at a time.
2. **Generic cost estimates may not match the user's actual project.** Let users enter their own supplier quote, labor rate, dimensions and contingency. Clearly separate user inputs from sourced defaults; never present a planning estimate as a contractor quote.
3. **A calculator can be a black box.** Show the formula, units, worked example, rounding rule, source/date and limits next to the result.
4. **Advice can omit the stop condition.** Explain when the proposed fix is unsuitable, when a diagnosis is uncertain, and when a licensed professional or local code check is needed.
5. **Content and tools are often disconnected.** Each tool should connect to the exact guide that explains the decision, and the guide should link back to the tool with descriptive anchors.
6. **AI answers need citeable evidence, not AI-flavoured wording.** Provide concise direct answers, stable visible HTML, primary sources close to claims, exact units, tables and transparent methods. No fabricated expert quotes, testing, or “experience”.

These are opportunity hypotheses. Claude's next audit must test them against actual competing pages for the same queries, not infer weakness from a competitor's brand or site-wide appearance.

## 4. Flagship calculator: the potential moat

The owner's multi-cost calculator idea is strategically stronger than adding a generic article batch, **if** it solves a real multi-step budgeting problem better than existing tools.

A meaningful version should let a homeowner assemble a project from relevant line items and calculate:
- materials and purchase quantities (including explicit waste/pack rounding);
- optional labor entered by the user or sourced with region/date labels;
- delivery, disposal, permits and other applicable extras only when supported;
- contingency as a visible user-controlled assumption;
- low / expected / high scenarios only when each range has a defensible source or user input;
- total and per-unit cost, with a printable/exportable breakdown;
- comparisons between “DIY”, “hire a professional”, and “defer/repair” only where inputs and assumptions can be made honest.

**Non-negotiable trust design**
- Never fabricate local prices, labor rates, material coverage, or “average cost” data.
- Separate user-entered prices from source-derived figures.
- Show formulas, units, rounding and worked examples.
- Show date, geography, source and uncertainty for every default.
- Explain exclusions and when a quote/professional assessment is needed.
- Prefer client-side calculations; inspect network traffic to prove private inputs are not transmitted.
- Keyboard, mobile, screen-reader and error-state QA must be evidenced before launch.
- Do not create dozens of thin calculator landing pages. One canonical tool per distinct intent; supporting pages must add a distinct decision benefit.

**Positioning:** “Plan the full project cost with your own prices and visible assumptions” is more defensible than “the most accurate cost calculator” unless accuracy has actually been independently tested.

## 5. SEO and CAO coverage: current gap register

| Workstream | Current state from repository evidence | Required completion evidence |
|---|---|---|
| Technical crawlability / indexability | Static HTML and sitemap checks have been reported; 23/45 sitemap URLs indexed on 2026-11-01; 21 unknown, 1 crawled-not-indexed | Fresh URL-by-URL HTTP, canonical, robots, sitemap, internal-link and Google/Bing inspection with dates and reasons |
| Search performance baseline | Snapshot exists for 2026-09-20–2026-10-31 | Query + page exports on 2026-11-05 and weekly snapshots thereafter; distinguish incomplete data and retrieval date |
| Keyword / intent map | CAO document explicitly lists this as missing | One primary URL per intent; secondary queries, SERP type, cannibalization decisions and source/date for every rank |
| Competitor/SERP review | Initial representative list only (this document) | Query-level review of actual top results, page features, content format, freshness, links, tool usefulness and unmet user task |
| Internal links / hubs | Planned; Claude owns inbound-link audit and hub structure | Every important guide has a named hub and at least two relevant descriptive inbound links; audit exceptions |
| Page quality | Quality gate reportedly passes all articles except intentional redirect stub | Gate pass plus editorial value score ≥85/100, factual/source review, uniqueness and actual user-task test; gate pass alone is insufficient |
| Safety / suitability | CAO proposes “When this does not suit you” blocks where relevant | Explicit limits, stop conditions and professional escalation where the page topic warrants it |
| Structured data | Some JSON-LD has been checked on fetched pages | Validate schema against visible content and eligibility; no markup added solely to chase rich results |
| Core Web Vitals / real UX | Not established by the cited baseline | Field data when available plus repeatable mobile tests; don't claim a pass from a source-code check alone |
| Calculator trust / QA | PR #214/#221 remains unvalidated as a browser experience; generator issue outstanding | Generator pipeline fixed, calculation tests, real browser/mobile/keyboard/screen-reader and network inspection recorded |
| AI answer visibility | Fixed question-set concept exists; no complete baseline cited | 30–50 fixed prompts, same locale/date/method, source/citation correctness and referral tracking; sample not universal ranking |
| Link-worthy assets | CAO section 8 proposes calculators, diagrams, printable checklists and decision tree | One asset at a time; demonstrate utility and measure genuine mentions/referrals before replication |
| Measurement and iteration | Routine described, baseline still early | Annotated before/after by page and query; don't call publishing or impressions alone success |
| Governance | Value Before Publishing and 85/100 threshold apply; 2026-11-05 freeze active | Pre-PR problem/value/difference/test record; no protected work or publication before authorization |

**Conclusion:** We have implemented parts of the technical and editorial foundation, but SEO/CAO is not “all done”. The missing items above are concrete and auditable.

## 6. Prioritized strategy (one coordinated program, not many small prompts)

### Phase 0 — protect measurement (now through 2026-11-05)
- Keep the editorial freeze and protected-file rules.
- Do not alter homepage, route templates, production settings, robots/crawler policy, CI workflows or Search Console settings.
- Complete the calculator technical work already in #214/#221 as one implementation/QA package, without merging or deploying until the existing review and owner gates are met.
- Prepare the competitor/intent benchmark without changing live pages.

### Phase 1 — prove where we can win (after the 2026-11-05 comparison)
- Combine query/page exports with the representative competitor set.
- Select at most three high-opportunity intents based on impressions, user task, ranking distance, business relevance and evidence of a competitor weakness.
- For each intent, compare the actual top 10 result pages; score task completion, evidence, specificity, tool usefulness, transparency, freshness, safety, mobile UX and internal journey.
- Choose one pilot page/tool only if the opportunity scores at least 85/100 and has a distinct visitor benefit.

### Phase 2 — build a defensible cluster
For each selected intent, ship one connected package:
1. one canonical tool or decision page;
2. one source-backed guide only if the guide adds a distinct job;
3. a worked example and transparent method;
4. “does not suit you” / escalation conditions;
5. a relevant hub and descriptive internal links;
6. an AI-citation checklist and fixed-question measurement;
7. a before/after measurement plan.

### Phase 3 — earn external trust
- Publish one original reusable asset (calculator, decision tree, diagram or printable checklist) after quality validation.
- Offer reuse terms and attribution only after the asset is stable.
- Run the single two-target outreach experiment only with owner approval.
- Measure real mentions, relevant referrals, citations and usage; do not buy or manufacture links.

## 7. Required scoring rubric (100 points)

Score each target page/tool and its top competing pages on the same scale. A score is a working editorial assessment, not a search-engine ranking.

| Dimension | Points |
|---|---:|
| Solves the exact intent / task completely | 20 |
| Accuracy, primary sources and transparent assumptions | 20 |
| Practical specificity, worked examples and decision support | 15 |
| Original utility (calculator, diagram, checklist, data) | 15 |
| Safety, limits and “when not suitable” | 10 |
| Mobile, accessibility, speed and privacy experience | 10 |
| Clear cluster structure and useful internal journey | 5 |
| Maintainability, review date and correction path | 5 |
| **Total** | **100** |

**Publish gate:** ≥85/100 plus all critical factual, safety, privacy and functional checks passed. A high score does not override the editorial freeze or owner approval.

## 8. Consolidated handoff to Claude

Please treat this as a single strategic work package and avoid consuming quota on repeated micro-prompts.

1. Read this document, the latest `data/AI_COLLABORATION.md`, `data/PROJECT_STATE.md`, `data/SEARCH_METRICS.md`, and `docs/CAO-INTEGRATION.md`.
2. Confirm the factual project state: open/merged status of #208, #214, #216, #221, #222, #225 and the current branch heads. In particular, #221 and #222 have **technical acceptance comments recorded**; they are not formal APPROVE reviews and have not been authorized for merge to main.
3. Continue the consolidated #214 calculator integration and browser QA package already requested on #225. Do not create another separate calculator task. Return one implementation PR or one precise blocked report with commands, environment, results and limits. Do not merge or deploy.
4. After the 2026-11-05 measurement checkpoint, perform the URL/internal-link/hub audit already assigned to Claude and return one consolidated report.
5. Do not spend Claude quota researching competitors or drafting the intent/AI benchmark: ChatGPT owns that research. Claude should only verify implementation facts and the actual live/repository state.
6. Do not add a new guide merely because a category is small. First return the query-level opportunity and competitor evidence; then apply the 85/100 and Value Before Publishing gates.
7. Keep all protected boundaries: no homepage/route-template implementation before the owner checkpoint; no workflow, hosting, robots, Search Console or production changes without the applicable authorization.

**Requested response:** one acknowledgement that this handoff was read, one consolidated calculator PR/blocked report, and one dated state update. Do not ask the owner to repeat context already in this document.

## 9. Source register (first-pass research)

- US EPA, *What are the main ways to control moisture in your home?*: https://www.epa.gov/mold/what-are-main-ways-control-moisture-your-home
- US EPA, *A Brief Guide to Mold, Moisture and Your Home*: https://www.epa.gov/mold/brief-guide-mold-moisture-and-your-home
- US EPA, *Remodeling Your Home and Indoor Air Quality*: https://www.epa.gov/indoor-air-quality-iaq/remodeling-your-home-and-indoor-air-quality
- HVI, *How Much Ventilation Do I Need?*: https://www.hvi.org/resources/publications/home-ventilation-guide-articles/how-much-ventilation-do-i-need/
- HVI, *Bathroom Exhaust Fans*: https://www.hvi.org/resources/publications/bathroom-exhaust-fans/
- This Old House, *How to Install a Toilet Below Grade*: https://www.thisoldhouse.com/bathrooms/how-to-install-a-toilet-below-grade
- Homewyse, *Project Cost Calculators*: https://www.homewyse.com/project_costs/
- Inch Calculator: https://www.inchcalculator.com/
- Omni Calculator: https://www.omnicalculator.com/
- Calculator.net: https://www.calculator.net/
- The Home Depot: https://www.homedepot.com/
- Lowe's: https://www.lowes.com/

---
**Research status:** preliminary desk review completed 2026-11-02. A true “top 20” competitor verdict requires query-specific SERP capture and comparable page-level scoring; this document intentionally does not claim that work is complete.
