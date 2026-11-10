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
| Editorial decision | QUALIFIED / REFRAME / MERGE / REJECT | ChatGPT proposes; Claude challenges; owner decides strategic exceptions | Clear reason to create a new URL rather than improve/link an existing asset. |
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

## 5. Initial ordered validation queue — Smart Home cluster

All rows below are **candidate research tasks**, not approved article titles or permission to publish. Proposed queries are starting hypotheses and must be validated against current GSC query data and live US SERPs before a brief can pass.

| Rank | ID | Candidate topic from the approved working portfolio | Provisional primary query | Why investigate / required distinction | Status |
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
