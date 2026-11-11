# HomeProjectWise — Editorial Research & Production Queue

**Created:** 2026-11-10  
**Status:** Operating system proposal; first Smart Home candidates are in validation, not approved for publication.  
**Authority:** This queue implements the owner-approved direction and must remain subordinate to `docs/HOMEPROJECTWISE-OPERATING-CHARTER-2026-11-10.md`, the Value Before Publishing law, the current repository inventory, and the latest operations handoff. If any queue item conflicts with those sources, the charter and owner decision prevail.

## 1. Purpose and single source of truth

This is the one ordered editorial queue. New ideas do not become parallel tasks in chat, branches or Claude handoffs. Every candidate enters here, receives a stable ID, moves through the same evidence gates, and has one explicit status and next owner.

The publishing ambition is **2–3 valuable articles per day when enough candidates pass the gates**. It is not a quota that permits thin, duplicate or weakly researched pages. Build a large library over time by covering distinct, useful search intents across the five charter pillars.

Use GSC signals to identify promising **topics and clusters**, not to keep revising one URL because it earned one or two clicks. Smart Home is the first cluster to validate based on the current early search signals; this is a research hypothesis, not proof of demand for every Smart Home subtopic.

## 2. Required stages and ownership

| Stage | Status label | Owner | Exit condition |
|---|---|---|---|
| Intake | BACKLOG | ChatGPT | Candidate is in-scope and has a clear reader problem. |
| Research | RESEARCHING | ChatGPT | Keyword/query map, intent, GSC/Bing evidence where available, live US SERP, 3–5 competitor-page reviews, sources, and repository overlap check are recorded. |
| Editorial decision | QUALIFIED / REFRAME / MERGE / REJECT / DEFER (reason and review trigger required) | ChatGPT proposes; Claude challenges; owner decides strategic exceptions | Clear reason to create a new URL rather than improve/link an existing asset. |
| Brief ready | READY FOR CLAUDE | ChatGPT | Complete brief scores at least 85/100 under the existing editorial scorecard, has no unresolved critical safety/factual issue, and names the differentiator and acceptance tests. |
| Independent review | CLAUDE REVIEW | Claude | Claude verifies current code/inventory, overlap, feasibility, sources, safety, outline, media needs and any tool/link dependencies; returns PASS or specific changes. |
| Production | IN PRODUCTION | Claude | Draft/article source, metadata, schema, internal links, relevant visual assets and required tests implemented. |
| Quality gate | QA | Claude executes; ChatGPT can independently audit | Tests pass; rendered mobile/desktop review; factual/source and Value Before Publishing checks pass; URL/index generation correct. |
| Release | READY TO MERGE / PUBLISHED | Claude prepares; owner approval rules apply | PR checks green, owner/approved workflow permits merge; merge and deployment are verified. |
| Learning | MONITOR | ChatGPT | URL, publication date, target queries and baseline recorded; review performance at scheduled intervals without making click count the sole success measure. |

**Important:** Only items marked READY FOR CLAUDE should be sent as execution tasks. BACKLOG and RESEARCHING items are not writing or publishing authorization. Claude must not skip the research gate or select an arbitrary item directly from the 100-title portfolio.

## 3. Mandatory research brief — no exceptions

Each proposed article must have a record containing:

1. **Queue ID and proposed URL/slug** — check existing and historical URLs first; never break or casually repurpose a published URL.
2. **Reader problem and outcome** — what the US homeowner/renter is trying to do, decide, diagnose or safely avoid.
3. **Keyword map** — provisional primary query, close variants, supporting questions and entities. Label estimates and unknowns honestly. Do not invent search volumes or difficulty.
4. **Search intent** — informational, troubleshooting, comparison, buying, cost/quantity, or mixed; explain what a satisfying result must provide.
5. **Demand evidence** — exact GSC query/page/date/device/country data where available; Bing data where available; if query-level data is unavailable, say so and use SERP evidence without pretending it is GSC evidence.
6. **US SERP review** — date, exact query, observed result types and leading ranking URLs. Review the top results; deep-review 3–5 genuinely relevant competitor pages, including specialists/primary sources where appropriate.
7. **Competitor comparison** — what they answer well; missing, confusing, unsafe or weakly evidenced points; what HomeProjectWise can demonstrably do better. No unsupported claims that competitors are poor.
8. **Repository overlap audit** — search current inventory, article files, category hubs, calculators and open PRs. Identify the nearest existing URLs and decide improve / expand / cross-link / new distinct URL / reject.
9. **Differentiation and solution** — the concrete method, decision framework, worked example, safe troubleshooting flow, comparison table, checklist, calculator connection or original diagram that gives the page a reason to exist.
10. **Evidence and safety** — primary/authoritative sources, manufacturer instructions when relevant, assumptions, limits, professional escalation and claims requiring verification.
11. **Proposed outline** — answer-first structure that solves the whole problem. No mandatory section count.
12. **Length rationale** — brief comparison of competitor scope and a reasoned estimate of what completeness requires. No fixed word-count quota and no padding.
13. **Image plan** — zero, one or two images/diagrams, only when each improves understanding or a decision. Specify the exact visual purpose and accuracy requirements. No image-count quota.
14. **Internal journey** — existing guides/tools to link from and to; do not invent links to unpublished pages as if live.
15. **Acceptance checklist** — factual/source checks, practical completeness, safety, originality, UX/accessibility, mobile rendering, metadata/schema, internal links, generated indexes and required automated tests.
16. **Scorecard** — use the current charter's editorial/Value Before Publishing scoring framework. A score below 85/100 is not READY FOR CLAUDE; critical factual, safety, duplicate-intent or evidence failures cannot be offset by points elsewhere.

## 4. Word count and media rules

- No universal word-count target, minimum or maximum. The problem's complexity and evidence determine the length.
- Competitor page length is context only, not a number to imitate.
- Do not omit necessary caveats or steps merely to be short; do not add repetitive sections to appear comprehensive.
- Use one or two excellent, relevant images/diagrams when they materially improve understanding, task execution or a decision. Some articles may need none.
- A visual must depict the actual device/task/layout accurately, be suitable for the US audience, have useful alt text, and be optimized for the page. No decorative filler or misleading AI imagery.
- Existing images are not to be replaced without an individually verified reason.

## 5. Qualified production queue

**Currently empty.** An item appears here only after it has passed the full research and quality gate in §3 and holds a decision of QUALIFIED. There is no minimum queue size; an empty queue is a valid state. Nothing in §5b is qualified work and nothing in §5b is sent to Claude.

Balance rule (owner direction, 2026-11-10): keep a deliberate portfolio across the topic areas (energy and efficiency; moisture, ventilation and indoor air; plumbing; maintenance and repair; lighting and smart home; project costs, planning and calculators). Balance is strategic, not an equal quota. Smart Home is one candidate cluster among several, not the default priority; by filename it already accounts for about 9 of the 31 articles on main.

## 5b. Research backlog (unqualified candidates)

Listing order below is **not** a priority ranking. Every row is an unqualified research task, not an approved title. Each candidate ends in one explicit decision: QUALIFIED / REFRAME / MERGE / REJECT / DEFER.

All rows below are **candidate research tasks**, not approved article titles or permission to publish. Proposed queries are starting hypotheses and must be validated against current GSC query data and live US SERPs before a brief can pass.

| # | ID | Candidate topic from the approved working portfolio | Provisional primary query | Why investigate / required distinction | Status |
|---:|---|---|---|---|---|
| 1 | SH-001 | Can You Use Smart Switches With Three-Way Lighting? | smart switch 3 way wiring | Potentially distinct practical compatibility/setup intent; must be safety-gated, manufacturer-specific and clear about when a licensed electrician is required. Do not provide unsafe universal wiring instructions. | RESEARCHING |
| 2 | SH-002 | How to Choose a Smart Dimmer for LED Lights | smart dimmer LED compatibility | Could solve flicker, minimum-load, neutral, dimming-protocol and compatibility decisions; first check whether existing `smart-lighting` can fully serve the intent. New URL only if SERP and intent are distinct. | BACKLOG |
| 3 | SH-003 | Smart Home Hub vs. No Hub: What Do You Really Need? | smart home hub vs no hub | Potential purchase/architecture decision for mixed protocols; must go beyond generic protocol definitions and offer a usable compatibility decision method. | BACKLOG |
| 4 | SH-004 | How Much Electricity Do Smart Home Devices Use on Standby? | smart home standby power consumption | Could connect smart-home devices to the existing electricity-cost calculator; distinguish standby draw, active use, measured watts and user-entered utility rates. Do not invent average device consumption. | BACKLOG |
| 5 | SH-005 | Matter vs. Zigbee vs. Thread vs. Wi-Fi: Which Smart Home Standard Should You Choose? | Matter vs Zigbee vs Thread | Conditional only: fast-changing standards and overlap with existing connectivity/offline guides. Requires current authoritative specifications and a practical buyer decision tree, not a generic glossary. | BACKLOG |

### Queue rule for the Smart Home cluster

Research SH-001 first. Do not automatically start SH-002 the same day: first determine whether the existing smart-lighting guide can satisfy the intent. Once the first brief reaches READY FOR CLAUDE, ChatGPT may research the next candidates in parallel so the queue remains stocked. Keep no more than three items in active research at once unless the owner changes the capacity rule.

## 6. Next cluster after Smart Home

After the first Smart Home batch has been researched, review the existing portfolio validation queue in `docs/HOMEPROJECTWISE-ARTICLE-PORTFOLIO-AUDIT-2026-11-10.md`. Candidate topics include hidden water-leak diagnosis, home energy audit, whole-home air-leak diagnosis, drywall repair and contractor quote comparison. Do not jump clusters merely because a title sounds attractive: compare topic-level demand, strategic fit, overlap and production dependencies first.

## 7. Daily operating rhythm

1. ChatGPT checks the queue, current main/inventory, open PRs and latest search evidence before selecting work.
2. ChatGPT advances up to 2–3 candidates through research only when evidence and time allow; active research is capped at three items to avoid scattering.
3. Every completed brief is scored and placed in READY FOR CLAUDE only after all mandatory fields are complete.
4. Claude receives a **single ordered batch** containing the READY FOR CLAUDE briefs, not scattered one-line commands. For each item Claude returns: accept/revise/reject, overlap check, technical/editorial concerns, planned implementation, exact tests and PR link.
5. Claude implements accepted briefs in queue order, normally one article per PR or a tightly related small batch; it does not silently skip ahead or publish an unreviewed candidate.
6. Claude records the article URL, PR, checks, merge/deploy evidence and handoff in the queue and operations logs.
7. ChatGPT audits the finished result where possible, checks the queue for drift and prepares the next batch.
8. The owner is asked only for decisions that genuinely require owner approval.

## 8. Release and monitoring rules

- Every new page must pass the site's current Value Before Publishing law and the operating charter. A score is not a substitute for judgment.
- Preserve all existing URLs. Update source article files and generators; never hand-edit generated guides indexes, hubs, sitemap or feed.
- Do not publish based on a green word-count gate alone. Verify facts, sources, intent, usefulness, images, mobile UX and distinct value.
- No unverified prices, statistics, test results, credentials, first-hand claims or product compatibility promises.
- No paid data provider, live price feed, affiliate insertion, URL migration or new calculator scope without the required owner decision.
- Record target query, baseline date, publication date and URL; review impressions, clicks, CTR, position and engagement when data is available. Interpret low-volume data cautiously.
- Publishing pace is measured as a rolling operational target, not a forced daily quota. If only one or zero briefs pass, ship only those.

## 9. Change control

The owner may reprioritize the queue at any time. ChatGPT maintains it; Claude reviews feasibility and execution; owner direction overrides provisional rankings. Any change to the five editorial pillars, quality threshold, safety boundaries or URL policy must be explicitly recorded in the operating charter and operations room.

---

## 10. Repository overlap findings for SH-001 to SH-005 (Claude, main `d02a9ef`, 2026-11-10)

Keyword counts over stripped HTML; evidence of coverage, not of ranking. Live SERP and GSC validation is still required for every row.

| ID | Existing coverage | Provisional decision |
|---|---|---|
| SH-001 | `smart-lighting` covers smart bulb vs switch, neutral wire check, no-neutral trade-offs and a 3-way row (matching companion switch; no single-switch model on a 3-way circuit). Safety-critical electrical topic. | MERGE into `smart-lighting` unless a distinct intent plus safety design is proven |
| SH-002 | Dimmer mentioned 13 times and flicker 6, but minimum load once and no worked compatibility check. Clearest gap of the five. | Research first; REFRAME toward LED dimmer compatibility |
| SH-003 | Overlaps `smart-home-wifi-outage-test`, `smart-devices-keep-going-offline` and section 5 of `smart-lighting`. | REFRAME or MERGE |
| SH-004 | Overlaps section 6 of `smart-lighting`, `what-can-you-plug-into-a-smart-plug` and the energy tab of the calculator. | REFRAME toward a measured-standby method tied to the calculator, or MERGE |
| SH-005 | Overlaps section 5 of `smart-lighting` and the Wi-Fi outage test; fast-changing standards. | DEFER until current authoritative specs and a distinct decision tree exist |

Alternative rule: when Claude rejects or merges a candidate it must name the replacement or the better-fitting existing URL and give evidence (query-level demand, SERP review, size of the reader problem) in the research brief, so work continues instead of stopping.


## 11. 2026-11-11 cross-cluster research checkpoint (ChatGPT)

### Fresh demand evidence

- Search Console final Web data for 2026-10-14 to 2026-11-10: 831 impressions, 4 clicks, 0.481% CTR, average position 16.86; preceding equal 28-day period 2026-09-16 to 2026-10-13: 65 impressions, 0 clicks, position 32.48.
- The visible query export contains 81 rows. Query filters for terms containing `energy` and `air leak` returned no visible rows. This is not evidence that market demand is zero; it means the site's current query report provides no direct demand signal for those exact topic families yet.
- Bing Webmaster Tools `top_queries` returned an empty row set.
- Page-level clicks and query-level visible rows do not reconcile because Search Console can omit anonymized queries. Do not invent query attribution.

### Candidate #41 — Home Energy Audit Without Special Equipment

**Status: RESEARCHING — not qualified and not approved for production.**

Initial US search-result review on 2026-11-11 surfaced:

- [ENERGY STAR — What to Look For: DIY Checks and Inspections](https://www.energystar.gov/saveathome/seal_insulate/identify-problems-you-want-fix/diy-checks-inspections): useful visual inspection and paper/light checks; it also warns that vermiculite insulation may contain asbestos and should not be disturbed unless properly tested.
- [ENERGY STAR — Locating Air Leaks](https://www.energystar.gov/saveathome/seal_insulate/do-it-yourself-guide/locating-air-leaks): identifies hidden attic/basement leakage locations, not only obvious window and door drafts.
- [U.S. DOE — Consumer Guide to Air Sealing the Home](https://www.energy.gov/sites/default/files/2021-08/ES-Air%20Sealing_080421.pdf): distinguishes accessible DIY sealing from hidden leaks and work requiring a qualified professional.
- [This Old House — How to Perform a Home Energy Audit](https://www.thisoldhouse.com/inspections/how-to-perform-a-home-energy-audit): uses infrared equipment and attic inspection/insulation work, a materially different scope from a no-special-equipment homeowner walk-through.
- [Sealed — DIY thermal leak detector: How to find air leaks in your house](https://www.sealed.com/resources/how-to-find-air-leaks/): offers several hands-on checks, including smoke and device-based methods; these require tighter safety framing than a simple visual checklist.
- [Pennsylvania DEP — Measure Your Energy Usage](https://www.pa.gov/agencies/dep/residents/saving-energy/home-energy-efficiency-and-conservation/measure-your-energy-usage): distinguishes free homeowner energy-use tools from a professional audit using blower-door and infrared equipment.

**Preliminary differentiation hypothesis:** a homeowner-safe, no-special-equipment walkthrough that records observable symptoms by area, distinguishes air leakage from insulation/HVAC/moisture clues, prioritizes findings by evidence and comfort impact, and clearly separates safe visual checks from professional-only diagnostics. It must not claim to be a certified or quantified energy audit, promise bill savings, or instruct readers to disturb insulation, enter unsafe attics, handle electrical/gas equipment, block combustion air, or perform depressurization/smoke tests around fuel-burning appliances.

**Overlap decision:** candidate #43 (whole-home air-leak diagnosis) should initially be treated as a section/diagnostic pathway within #41, not a second URL. Existing `stop-a-drafty-door-without-replacing-it` owns the single-door sealing task; the new candidate must stay at whole-home assessment/triage level and link to that page rather than repeat its repair instructions. Link to the existing electricity-cost and Smart Plug tools only where they help readers interpret their own usage; do not claim those tools measure whole-home energy performance.

**Still required before qualification:** complete top-10 US SERP review for the primary and secondary queries; deep-review 3–5 competing pages and record exact titles, outlines, formats, trust signals, mobile UX and specific gaps; verify keyword/query variants and any available country/device GSC evidence; check current article/tool inventory and open PRs again; complete the charter's scorecard and all 16 research-brief fields. No search volume, traffic estimate or ranking difficulty is asserted here.

### Candidate #87 — Contractor Quote Comparison

**Status: DEFER pending a genuinely differentiated worksheet/tool concept.**

The current US results are crowded with recent line-by-line quote-comparison guides and worksheets, including [Pond](https://www.pond.com/home/how-to-compare-contractor-quotes), [Practical Homeownership](https://practicalhomeownership.com/hire-or-diy/compare-contractor-estimates/), [ServiceGoat](https://servicegoat.com/homeowner-guides/how-to-compare-contractor-estimates/), [4Homes](https://4homes.com/homeowner-guides/contractor-quote-comparison) and [Crewdax](https://www.crewdax.com/resources/how-to-compare-contractor-quotes). A generic checklist article would not be sufficiently differentiated. Revisit only with a privacy-first comparison worksheet that normalizes scope, materials, allowances, exclusions, permits, cleanup, schedule, payment milestones, change orders and warranty without ranking contractors or treating missing costs as zero; technical feasibility and owner approval are prerequisites.

**Next research action:** finish candidate #41's full SERP and scorecard work, then compare it with a distinct plumbing/repair candidate so the next batch is not confined to Energy or Smart Home.