# HomeProjectWise — Operating Charter, Editorial Portfolio & Product Roadmap

**Status: Operating framework approved by owner on 2026-11-11.**
**The governance, quality gates, portfolio balance and role boundaries below are binding. The 100-title portfolio remains a candidate library, not an approved publishing schedule or publication quota.**
**Applies to:** owner, ChatGPT, Claude, editors, designers, developers and any commissioned contributor.


## 0. Operating authority, role boundaries and execution control (owner-approved 2026-11-11)

### Source hierarchy
1. Latest explicit owner decision recorded in `data/AI_COLLABORATION.md`.
2. This operating charter and the complete mandatory law in `docs/VALUE-BEFORE-PUBLISHING.md`.
3. The qualified-only production queue in `docs/ARTICLE-PRODUCTION-QUEUE.md`.
4. Specialized evidence records: `data/SEARCH_METRICS.md`, `data/PROJECT_STATE.md`, `data/WORK_LOG.md`, portfolio audit and technical specifications.
5. PR descriptions/comments and chat history are not durable authority. Mirror any lasting decision into the operations room.

### Single communication room and startup rule
Every ChatGPT or Claude session, including replacement/new sessions, must read the latest `main` version of `data/AI_COLLABORATION.md` before acting. It must record its claim, task owner, files/PR, evidence, exclusions and next action there. No parallel operations room or handoff document may be created. No assistant is assumed to receive notifications or see another session's chat.

### Non-interchangeable primary responsibilities
- **ChatGPT — research/editorial/measurement lead:** topic discovery; query and intent mapping; GSC/Bing analysis; current US SERP and competitor research; site overlap/cannibalization checks; primary-source verification; complete article briefs and editorial drafts where possible; performance reporting; independent content/UX review.
- **Claude — engineering/technical lead:** complex code and architecture changes; calculator implementation; responsive/accessibility/cross-browser engineering; automation and build/test work; technical review of changes; implementation PRs and deployment verification.
- Either may flag a risk outside its primary lane, but must hand off the task rather than silently take over or duplicate the other's active work. The owner resolves conflicts and strategic exceptions.
- Every active task has one named owner and a defined file/PR scope. Before shared-file edits, inspect open PR changed-file overlap. No two agents edit the same file concurrently. Record a temporary file/task lock in the operations room and release it when done.

### Article pipeline and speed without quality erosion
- Research continuously across all six portfolio areas: energy/efficiency; moisture/ventilation; plumbing; maintenance/repair; lighting/smart home; project costs/planning/calculators.
- Maintain a small balanced investigation register (normally no more than six active candidates, spread across areas). The register is research-only and is not the production queue.
- The production queue contains only READY/QUALIFIED briefs. Admission requires all 16 brief fields, a score of at least 85/100, defensible distinct value, a completed overlap audit and no critical evidence, factual, safety or duplication blocker.
- Empty production queue never means stop researching. ChatGPT must progress several candidate investigations in parallel (normally up to three at once), close weak candidates promptly, and promote only qualified briefs.
- Working publishing cadence: aim for one valuable article per day when qualified work exists; scale toward 2–3/day only when independently qualified briefs and implementation capacity exist. Never lower quality gates to meet cadence.
- Claude receives one ordered batch of READY FOR CLAUDE briefs, not speculative ideas or scattered micro-commands. ChatGPT prepares the research; Claude challenges feasibility and implements approved work; the owner decides strategic exceptions.
- Quality applies to both article and product work. CI green is not live-site success; distinguish local, PR-head, merged-main, deployed and real-device evidence explicitly.

## 1. Purpose: stop reactive work

This document combines the useful governance, competitor-learning, quality, technical and measurement rules from the original Charter with a concrete proposed portfolio of 100 article briefs, calculator work, design improvements and technical work.

It is the single proposal to review. It does not authorize automatic publication, deletion, URL changes, redesigns or calculator releases. The owner approves the portfolio; Claude reviews feasibility, duplication and implementation; contributors execute only approved work.

The objective is not to publish 100 articles as a quota. It is to select and build a coherent set of useful pages and tools that can earn relevant search demand and make HomeProjectWise materially more useful than a generic advice site.

## 2. Mission, audience and positioning

**Mission:** Help homeowners and renters make better home-project decisions: diagnose a problem, choose a safe next step, understand options, calculate quantities and costs, compare materials or quotes, and know when professional help is appropriate.

**Positioning:** A practical home-project decision platform — not a generic lifestyle magazine, retailer, contractor marketplace or undifferentiated listicle site.

**Primary audience:** People planning or maintaining a home, especially readers who need clear explanations, measurements, safe checks, material choices, cost planning and practical next steps.

**Five editorial pillars**
1. Home Repairs & Troubleshooting.
2. Smart Home & Lighting.
3. Energy, Airflow & Comfort.
4. DIY Projects & Installation.
5. Tools, Materials & Buying Decisions.

**Boundary:** Generic decluttering, closet/pantry organization, storage inspiration and broad decor-only listicles are not a growth priority for this site. Existing URLs remain published unless query-level evidence and owner approval justify a change. Do not silently migrate categories or remove legacy content.

## 3. Competitor intelligence: study leaders, extract strengths, improve weaknesses

### 3.1 Domain-level traffic benchmarks

These are third-party estimates of whole-domain visits for September 2026, not publisher analytics and emphatically not traffic to one page. They are a shortlist for systematic study, not proof that every page on each site performs well.

| Publisher | Estimated monthly domain visits | Strengths to study |
|---|---:|---|
| [Good Housekeeping](https://www.goodhousekeeping.com/) | 23.73M | Service journalism, utility-led headlines, product evaluation, recurring needs, visible editorial/testing standards |
| [The Spruce](https://www.thespruce.com/) | 10.33M | Topic clusters, accessible how-to explanations, category discovery, breadth of practical coverage |
| [Martha Stewart](https://www.marthastewart.com/) | 10.99M | Editorial packaging, evergreen household problem framing, strong presentation; adjacent rather than a direct scope template |
| [HGTV](https://www.hgtv.com/) | 8.27M | Visual storytelling, project galleries, room/project pathways and video where it clarifies |
| [Real Simple](https://www.realsimple.com/) | 7.85M | Direct titles, practical steps, checklists, scannable explanations |
| [Houzz](https://www.houzz.com/) | 7.01M | Visual discovery, project context, professional perspectives and deep browsing paths |
| [Better Homes & Gardens](https://www.bhg.com/) | 6.53M | Topic packaging, seasonal relevance, image-led hubs and accessible project framing |

Source snapshots: public Semrush domain overview/competitor pages for September 2026. Estimates vary by provider and methodology. References: [Good Housekeeping](https://www.semrush.com/website/goodhousekeeping.com/overview/), [The Spruce](https://www.semrush.com/website/thespruce.com/overview/), [Real Simple](https://www.semrush.com/website/realsimple.com/overview/), [BHG](https://www.semrush.com/website/bhg.com/overview/), [HGTV](https://www.semrush.com/website/hgtv.com/overview/), [Houzz](https://www.semrush.com/website/houzz.com/overview/), [Martha Stewart](https://www.semrush.com/website/marthastewart.com/competitors/).

### 3.2 Page-level evidence is mandatory

Never describe a domain's 23.73M visits as the visits of an individual page. For every proposed priority article, record the exact competitor URL, target query, country, search intent, observed title/H1, estimated keyword/page traffic (if available), date and source. A keyword's search volume is not the same as a page's visits.

The earlier research surfaced examples such as Real Simple ranking for “how to organize closet”, Apartment Therapy for “how to organize desk drawers”, and The Spruce for “how to clean stone countertops”. They are learning examples, not automatic content approvals; generic organization remains outside this site's core scope.

### 3.3 Required competitor study for every approved content cluster

- Review the top 10 live search results in the target country; record date and query.
- Deep-review at least 3–5 relevant competing pages, including a high-traffic publisher and a specialist or primary source.
- Record headline/H1, promise, intent, first-screen answer, outline, media, tables, tools, sources, trust signals, author/reviewer disclosures, internal links, mobile UX and gaps.
- Separate observed weaknesses from hypotheses. Do not claim a competitor is weak without evidence.
- Produce a “Keep / Improve / Avoid / Our advantage” comparison.
- Learn from strong headlines and page structures, but never copy wording, images, data, proprietary diagrams or unsupported claims.
- Recheck the SERP before drafting and before publication.

## 4. Existing-site inventory and anti-duplication rules

The latest inventory snapshot records 30 indexable guide articles and 7 tools. The repository inventory and live sitemap are the source of truth; re-check them before approving each title because the count may change.

Before any new article:
1. Search the inventory and repository for matching topics, synonyms and overlapping intent.
2. Inspect existing page performance in Search Console and Bing Webmaster Tools.
3. Decide whether to improve an existing URL, add a genuinely distinct supporting page, or reject the idea.
4. Define one primary intent per URL. Avoid cannibalization and near-duplicate pages.
5. Preserve existing URLs. Redirect, merge, rename or recategorize only with evidence, owner approval and tested migration plan.

The 100 titles below are **candidate portfolio ideas**, not approved briefs and not permission to create 100 URLs. Claude must mark each as KEEP / REVISE / REPLACE / DUPLICATE / OUT OF SCOPE after comparing it with the current inventory and live SERPs.

A preliminary repository-only overlap review has now been recorded in `docs/HOMEPROJECTWISE-ARTICLE-PORTFOLIO-AUDIT-2026-11-10.md`. It flags likely duplicate or overlapping candidates and records a first US SERP sample for the energy-audit, tile-calculator and contractor-quote opportunities. This is not a final 100-title approval: the remaining candidates still require individual live-SERP, query-demand and cannibalization checks.

## 5. Proposed article portfolio — 100 named candidates

### Pillar A — Home Repairs & Troubleshooting (20)

1. How to Fix a Running Toilet: Causes, Parts, and Repair Costs
2. Why Is My Water Heater Making Noise? Causes and Safe Checks
3. How to Find the Source of a Hidden Water Leak
4. What to Do Immediately After Discovering a Water Leak
5. How to Fix a Slow-Draining Bathroom Sink
6. Why Does My Toilet Keep Clogging? Causes and Solutions
7. How to Repair Cracked Drywall Before Painting
8. How to Patch a Large Hole in Drywall Without Replacing the Wall
9. How to Fix Peeling Paint on Walls and Ceilings
10. Why Does Paint Bubble or Blister? Causes and Prevention
11. How to Repair Cracked Caulk Around a Bathtub
12. How to Remove and Replace Old Bathroom Caulk
13. Why Is Grout Cracking and When Should You Replace It?
14. How to Fix Loose Floor Tiles Without Replacing the Entire Floor
15. Why Does My Door Stick? How to Diagnose and Fix It
16. How to Fix a Door That Will Not Latch Properly
17. How to Stop Water From Seeping Into a Basement
18. Why Is My Ceiling Stained? How to Identify the Cause
19. How to Diagnose a Musty Smell Coming From a Crawl Space
20. Home Maintenance Problems You Should Fix Before They Become Expensive

### Pillar B — Smart Home & Lighting (20)

21. Smart Thermostat Compatibility: How to Check Before You Buy
22. C-Wire vs. No C-Wire: What Your Thermostat Actually Needs
23. Matter vs. Zigbee vs. Thread vs. Wi-Fi: Which Smart Home Standard Should You Choose?
24. Why Do Smart Bulbs Disconnect and How Can You Fix Them?
25. Smart Switch vs. Smart Bulb: Which Is Better for Your Room?
26. How to Choose a Smart Dimmer for LED Lights
27. Can You Use Smart Switches With Three-Way Lighting?
28. How to Build a Smart Lighting Schedule That Saves Energy
29. Smart Home Hub vs. No Hub: What Do You Really Need?
30. How to Check Whether Smart Devices Work Together Before Buying
31. Smart Door Sensors vs. Motion Sensors: Which Should You Use?
32. Where to Place Smart Motion Sensors for Reliable Detection
33. Smart Water Shutoff Valves: Are They Worth Installing?
34. Smart Leak Detector vs. Automatic Water Shutoff: What's the Difference?
35. How to Make Smart Home Devices Work During an Internet Outage
36. How to Secure a Smart Home Network Without Complicated Settings
37. Smart Plug vs. Smart Power Strip: Which Is Safer?
38. How Much Electricity Do Smart Home Devices Use on Standby?
39. How to Choose a Smart Smoke and Carbon Monoxide Alarm
40. A Practical Smart Home Upgrade Plan for Older Houses

### Pillar C — Energy, Airflow & Comfort (20)

41. How to Perform a Home Energy Audit Without Special Equipment
42. Where Does a House Lose the Most Heat? A Room-by-Room Guide
43. How to Find Air Leaks Around Windows, Doors, and Outlets
44. Attic Insulation vs. Air Sealing: What Should You Do First?
45. How Much Insulation Does Your Attic Need?
46. How to Choose the Right Insulation for Your Home
47. Why Is One Room Colder Than the Rest of the House?
48. How to Reduce Heating Costs Without Replacing Your HVAC System
49. Heat Pump vs. Furnace: Cost, Efficiency, and Home Compatibility
50. How Often Should You Replace HVAC Filters?
51. How to Choose the Right HVAC Filter MERV Rating
52. Why Does My Air Conditioner Run but Not Cool the House?
53. How to Reduce Indoor Humidity Without Overusing a Dehumidifier
54. What Is the Ideal Indoor Humidity for Different Rooms?
55. How to Improve Bedroom Ventilation Without Losing Comfort
56. Bathroom Fan vs. Open Window: Which Removes Moisture Better?
57. How to Stop Condensation on Windows in Winter
58. Why Does My Attic Get Too Hot? Causes and Practical Fixes
59. How to Calculate the Running Cost of a Space Heater
60. Which Home Upgrades Reduce Energy Bills the Most?

### Pillar D — DIY Projects & Installation (20)

61. How to Install a Bathroom Exhaust Fan: Planning, Wiring, and Venting
62. How to Replace a Bathroom Faucet Without Damaging the Sink
63. How to Install a Kitchen Backsplash: Materials, Layout, and Cost
64. How to Prepare a Wall Before Painting
65. How to Paint a Room Without Visible Roller Marks
66. How to Choose and Apply Primer for Different Wall Surfaces
67. How to Install Peel-and-Stick Wallpaper Without Common Mistakes
68. How to Remove Wallpaper Without Damaging Drywall
69. How to Plan a Tile Layout Before Cutting the First Tile
70. How to Install Floor Tiles: Subfloor Preparation to Grouting
71. How to Install Vinyl Plank Flooring Around Doorways
72. Laminate vs. Vinyl Plank Flooring: Installation and Long-Term Costs
73. How to Install Baseboards and Avoid Visible Gaps
74. How to Replace Interior Door Weatherstripping
75. How to Install a Door Sweep and Check the Seal
76. How to Build a Simple Under-Sink Leak Protection Setup
77. How to Install a Water Leak Sensor Near Appliances
78. How to Plan Lighting Layers Before Renovating a Room
79. How to Prepare a Basement for a Moisture-Safe Renovation
80. How to Plan a Small Bathroom Renovation Before Buying Materials

### Pillar E — Tools, Materials & Buying Decisions (20)

81. How Much Tile Do You Need? Waste, Cuts, and Box Coverage Explained
82. How Much Paint Do You Need for Two Coats?
83. How Many Wallpaper Rolls Do You Need for Patterned Walls?
84. How to Calculate Flooring Waste Before Ordering
85. How to Compare Flooring Quotes Apples to Apples
86. How to Estimate the Total Cost of a Bathroom Renovation
87. How to Compare Contractor Quotes Before Hiring
88. How to Choose the Right Caulk for Bathrooms, Windows, and Trim
89. Silicone vs. Acrylic Caulk: Where Each One Works Best
90. Thinset vs. Mastic: Which Tile Adhesive Should You Use?
91. Grout Types Explained: Sanded, Unsanded, and Epoxy
92. Primer vs. Paint-and-Primer: What Is the Real Difference?
93. Paint Sheen Guide: Flat, Eggshell, Satin, and Semi-Gloss
94. How to Choose a Dehumidifier by Room Size and Moisture Level
95. How to Choose an Exhaust Fan by Bathroom Size and Duct Length
96. What Size Air Filter Does Your HVAC System Need?
97. How to Choose the Right Extension Cord for Home Appliances
98. How to Calculate Appliance Electricity Costs Before Buying
99. What Should a Home Renovation Estimate Include?
100. DIY vs. Hiring a Contractor: How to Compare the Real Cost

## 6. First proposed article batch — pending evidence and owner approval

These five are initial candidates because they can form connected content/tool journeys. They are not automatically approved until the SERP and duplicate checks are complete:

- How to Find the Source of a Hidden Water Leak — connect to existing leak-sensor placement coverage; must add a distinct diagnostic process, not repeat sensor placement.
- How to Perform a Home Energy Audit Without Special Equipment — potential entry page for an energy cluster and energy-cost tool.
- How to Find Air Leaks Around Windows, Doors, and Outlets — proceed only with a whole-home diagnostic workflow distinct from the existing door-sealing guide; include safe checks and clear limits.
- How to Patch a Large Hole in Drywall Without Replacing the Wall — task-led repair guide with materials, dimensions, finish checks and safe limits.
- How to Compare Contractor Quotes Apples to Apples — useful decision guide that can support a quote-comparison tool.

Claude must verify overlap with the actual current article files, especially smart-home connectivity, bathroom leak sensors, paint/wallpaper and existing project-cost content. Replace any overlapping candidate before approval.

## 7. Calculator and interactive-tool portfolio

### Existing tools — improve before multiplying

- Complete Wallpaper Calculator: product comparison, adapter coverage, test cases, edge cases, mobile UX, accessible controls and a verified handoff to the Budget Planner.
- Audit the existing main project calculator and Budget Planner for formula transparency, assumptions, validation, keyboard/accessibility, mobile behavior and consistency.
- Ensure paint, flooring, wallpaper and project-cost journeys cross-link without silently duplicating calculations.

### Proposed new tools

1. **Tile Quantity & Cost Calculator** — room dimensions, tile dimensions, layout/waste allowance, box coverage, boxes to buy and user-entered price.
2. **Home Energy Cost Calculator** — appliance wattage, hours/day, days, user-entered electricity rate, daily/monthly/annual estimates.
3. **Insulation Estimator** — area, existing insulation, target specification and package coverage; clearly label climate/building-code limitations.
4. **Bathroom Ventilation Calculator** — room dimensions, recommended airflow method, duct/installation caveats and fan-selection guide.
5. **Contractor Quote Comparison Tool** — normalize scope, quantities, allowances, exclusions, labor/materials and unknowns across quotes.
6. **Home Repair Cost Planner** — user-entered line items, contingency assumptions and project total; no fabricated market prices.
7. **HVAC Filter Replacement Planner** — filter dimensions/type, manufacturer guidance and user-set reminder interval; do not prescribe a universal interval.

Each proposed tool needs demand validation, a distinct job-to-be-done, formula specification, test vectors, edge-case handling, accessibility/privacy review and a supporting guide. Do not build tools solely to increase the tool count.

### Product direction

Build a coherent workflow: **measure → calculate quantity and waste → convert to real pack/unit sizes → enter the user's price → compare quotes/options → add to project budget → produce a useful checklist/summary.**

Never invent live prices, supplier stock, local labor rates or code compliance. Show assumptions and let users enter local values.

## 8. Design and user-experience work backlog

These are proposed product improvements, to be prioritized after an audit of the current implementation:

1. A task-first article template: quick answer, suitability, tools/materials, time/skill, steps, checks, troubleshooting, safety and sources — include only sections useful to that task.
2. A consistent calculator pattern: clear inputs/units, live or explicit calculate action, explainable results, assumptions, reset/edit and next step.
3. Contextual article ↔ calculator links, with the relevant tool embedded or linked near the decision point.
4. A Guides discovery experience filterable by problem, room, project type and skill level, if the current library structure supports it.
5. Search that understands problem phrasing and synonyms, not only exact title matches.
6. Better topic hubs that explain the problem space and guide readers through distinct supporting pages.
7. Clear trust information: author/editorial policy, source quality, review/update history and correction path; never fabricate expert review.
8. Mobile-first tables, forms, diagrams and long calculator results; prevent horizontal overflow.
9. Original, task-specific visuals: measurement diagrams, decision trees, before/after context and step images where they add information.
10. Consistent breadcrumbs, related next steps and useful internal navigation without link stuffing.
11. Accessible focus states, labels, error messages, keyboard operation, contrast, touch targets and reduced-motion behavior.
12. Image performance and loading checks: responsive dimensions, appropriate formats, lazy loading below the fold, meaningful alt text and visual verification that images actually render.
13. Page-level design review across representative article, tool, hub and search pages in mobile, desktop, light and dark modes.

No broad redesign is approved by this document alone. Each design item needs an audit, a clear user problem and a scoped PR.

## 9. Technical, SEO, accessibility and trust standards

- Preserve existing URLs; migrations require tested redirects, canonical decisions and owner approval.
- Update source files and generators, not generated Guides cards, tool indexes, sitemap or category pages by hand.
- Maintain sitemap, RSS, search index, metadata, canonical tags, structured data and internal links.
- Prevent orphan pages, broken links, duplicate intent, accidental noindex and invalid structured data.
- Use descriptive titles/H1s matching the actual task; no clickbait or keyword stuffing.
- Cite primary/authoritative sources for safety, technical, numerical, legal and product claims.
- Disclose affiliate relationships and separate editorial judgment from paid placements.
- Never invent author credentials, expert reviews, tests, hands-on experience, statistics, rankings, prices or product availability.
- Meet semantic HTML, keyboard navigation, visible focus, form labels, error announcements, alt text, sufficient contrast and usable touch-target standards.
- Test responsive behavior and dark mode where supported.
- Run automated browser QA and inspect actual screenshots. A green automated test is not proof that every page looks correct.
- Record browser coverage and known limits; automated Chromium checks do not replace real-device, cross-browser or screen-reader testing.

## 10. Mandatory article brief and acceptance gate

Before drafting, every candidate must have:
- Target reader, country, situation and one primary intent.
- Primary query, variants, related questions and evidence of demand.
- Current-site duplicate/cannibalization check.
- SERP review and competitor-page notes.
- Competitor strengths, verified weaknesses and our original advantage.
- Proposed title/H1 and outline with a direct answer near the top.
- Source list, fact-check requirements, safety/permit/code boundaries and expert-review needs.
- Original visual, table, calculator or checklist plan.
- Internal links in and out; cluster role and next reader action.
- Success metric and review condition.

A page is publishable only if it is accurate, original, complete for its intent, materially useful, sourced, safe, readable and technically sound. It must pass editorial, technical, mobile, accessibility and visual QA. No invented claims or decorative media quotas.

## 11. Prioritization and approval

Score each proposal from 0–5 on:
- Reader pain/importance.
- Demand evidence and SERP opportunity.
- Fit with the five pillars.
- Competitive gap.
- Original value we can provide.
- Leverage from existing pages/tools.
- Feasibility and confidence.

Subtract risk for duplication, weak sources, safety, uncertain formulas, maintenance burden and unclear intent. High search volume alone is never sufficient.

**Approval flow:** research → brief → owner approval → draft/build → editorial/technical review → visual QA → PR checks → owner merge decision → post-release measurement. A worker must not treat a suggestion, draft PR or passing unit test as publication approval.

## 12. Measurement and review

Use Search Console and Bing Webmaster Tools at query and URL level: clicks, impressions, CTR, position, country, device and query-to-page fit. Add privacy-conscious analytics for engaged use, calculator starts/completions and next-step actions where available.

Review:
- Which pages attract relevant impressions but weak CTR?
- Which pages rank near the first page and merit improvement?
- Which queries map to multiple URLs?
- Which calculators are started, completed or abandoned?
- Which internal paths lead to a useful next step?
- Which pages lose traffic or become outdated?
- Which competitor pages have materially changed?

A traffic estimate is not a result. A ranking claim requires measured data. Compare performance with a recorded baseline and annotate significant releases.

## 13. Roles and operations-room handoff

**Owner:** sets scope, approves portfolio and major changes, decides merges/publication priorities.

**Claude:** reviews current inventory and feasibility, researches SERPs and competitor URLs, flags duplicates, implements approved articles/tools/site work, runs tests and leaves exact handoff notes.

**ChatGPT:** performs independent competitor/content analysis, proposes improvements, audits outputs and visual evidence available to its environment, and records verifiable findings. It must not claim Claude can access screenshots or tools unless that access has been tested.

**Every worker:** reads this charter, project state, content inventory, work log, AI collaboration handoff and open PRs before starting; avoids file/branch collisions; records files changed, evidence, checks, limitations and next action.

No one silently changes the strategy, adds a new content pillar, creates a competing URL, edits images or merges work outside the agreed approval flow.

## 14. Decisions requested from owner and Claude

1. Approve, revise or reject the five-pillar scope.
2. Review the 100 candidate titles against the actual current inventory and SERPs; return a deduplicated, evidence-ranked shortlist.
3. Confirm or replace the proposed first five candidates.
4. Approve which calculator should follow Wallpaper completion.
5. Review design/technical backlog and identify the highest-impact verified gaps.
6. Confirm the portfolio only after competitor evidence, overlap checks and feasibility review.

**No publication dates are set in this charter.** Work is selected by approved priority and readiness, not by calendar pressure. The portfolio can be revised when evidence changes, with a short decision note explaining why.

---
**Review state:** Awaiting Claude's written review and owner's approval. This document supersedes the earlier time-based 12-month schedule as the proposed operating plan; useful governance and competitor research from the earlier version are retained.

## 15. Mandatory weekly research and continuous charter improvement law

**This charter is a living standard, not a one-time research snapshot. ChatGPT must conduct a fresh research and review cycle every week and use verified findings to improve this charter and its candidate portfolio.** The initial competitor scan and 100-title portfolio are a starting hypothesis, not a permanent or complete market map.

### 15.1 Weekly research duties

At least once every seven days, ChatGPT must:

1. Recheck the target-country search results for the highest-priority candidate topics and the first approved content cluster. Record the exact query, country, date, ranking URLs and material SERP changes.
2. Revisit the strongest relevant competitors and specialist/authoritative sources. Identify newly useful pages, tools, formats, topic clusters and meaningful changes in their content or presentation.
3. Study page-level evidence wherever available. Keep whole-domain traffic estimates, keyword search volume, estimated page traffic and measured HomeProjectWise traffic clearly separate; label estimates, dates, geography and data-provider limitations.
4. Look for emerging reader questions, changing terminology, product/platform changes, seasonal needs, technical standards, safety guidance and topics competitors are serving poorly or incompletely.
5. Recheck HomeProjectWise's live sitemap, content inventory, tools, open pull requests and available Search Console/Bing performance before recommending new topics or changes. Do not rely on stale counts or assume a candidate is still unserved.
6. Review the existing 100 candidates and tool/design backlog. Keep, improve, reorder, replace or retire candidates based on evidence, user value, site fit, feasibility and duplication risk. The list may grow or shrink; 100 is not a quota.
7. Identify weaknesses in our own pages, tools and user journeys, then recommend specific improvements that are more useful than merely matching a competitor.

### 15.2 Evidence and reporting standard

Every weekly review must leave a concise, dated research note in the operations room and a traceable summary of proposed charter changes. Include:
- Sources and direct URLs, search country/query, review date and relevant competitor page URLs.
- What changed since the previous review and what remains unchanged.
- Verified observations separately from estimates, assumptions and unanswered questions.
- The practical implication for HomeProjectWise and the exact section, candidate, tool or design item affected.
- A priority recommendation with rationale, confidence and duplication/safety/maintenance risks.
- A short list of decisions requiring owner approval.

Do not manufacture traffic numbers, ranking positions, competitor weaknesses, trends or evidence. If a source is unavailable or a claim cannot be verified, label it unverified and do not use it as a basis for a major change.

### 15.3 How the charter may be updated

ChatGPT is responsible for maintaining the research-informed proposal: refresh competitor evidence, add or remove candidate ideas, refine priorities, record newly discovered gaps and improve recommendations when the evidence justifies it. Keep the main charter and its public working page consistent, and preserve a brief change history so the owner and Claude can see what changed and why.

The following remain protected decisions and must not be changed or executed without owner approval: mission and site scope, new editorial pillars, publication or URL decisions, redirects/deletions, major design or architecture changes, tool releases, publishing, merging and spending. Weekly research is not permission to implement or publish.

Claude should review material technical/content feasibility changes and flag conflicts with active work. ChatGPT must check open PRs and current project state before proposing overlapping work. If GitHub or analytics access is unavailable, ChatGPT must say so, provide the research note and proposed patch, and never claim the repository or data was updated.

### 15.4 Weekly decision loop

**Observe → verify → compare → identify gaps → revise proposal → record changes → request approval → measure later.**

The purpose is continuous learning, not change for its own sake. Retain a strong rule or candidate when the evidence still supports it. Prefer a small number of high-confidence improvements over a large volume of speculative edits. Do not create publication deadlines or output quotas through the weekly review.

**This weekly review law takes effect as an operating requirement once approved by the owner.** Until then, it is part of this consolidated proposal and must be reviewed with the rest of the charter.

## 16. Competitive intelligence system and mandatory competitor dossiers

**Purpose:** replace a static competitor-name list with a repeatable, evidence-led system that explains which sites and pages win our target searches, why they win, where they are weak, and how HomeProjectWise can provide a more useful answer. The seven publishers in the initial benchmark are a starting cohort only. Specialist sites, independent experts, manufacturers, public authorities and focused niche publishers must also be discovered from live search results.

### 16.1 Competitor universe: three layers

Maintain three distinct competitor groups:

1. **Major publisher cohort:** Good Housekeeping, The Spruce, Martha Stewart, HGTV, Real Simple, Houzz and Better Homes & Gardens. Keep them in the benchmark while they remain relevant to our target market and pillars.
2. **Topic-level specialist competitors:** smaller or focused websites that repeatedly rank for a particular problem, room, repair, product, calculator or project. Discover these from actual target-country SERPs; do not exclude them because their domain traffic is small.
3. **Reference and authority sources:** manufacturers, standards bodies, utilities, government agencies, trade associations and qualified professionals. These may not compete for broad traffic, but are essential for accuracy, safety, specifications and original evidence.

A domain is not automatically a competitor for every topic. Assign relevance by pillar, query cluster and page intent. Record the reason for inclusion and the date last validated. Add newly discovered competitors and retire irrelevant ones with a dated reason; do not freeze the list at seven.

### 16.2 Required individual competitor dossier

Create and maintain one dossier per relevant competitor. Each dossier must contain the following fields; use **Not publicly available**, **Not verified**, or **Not applicable** rather than guessing.

1. **Identity and scope:** domain, publisher/site type, target countries/languages, relevant pillars, audience, business model, ownership where verifiable, and reason it competes with or informs us.
2. **Content inventory:** best available count of published editorial articles; method, source, date, scope and confidence. Prefer a reproducible sitemap/CMS/category/archive inventory, deduplicated by canonical URL and filtered to genuine editorial articles. Separate guides, news, recipes, product reviews, videos, forum/community pages, profiles, category/tag pages, tools and other indexable URLs. If exact counting is impossible, report a range and method. Never relabel indexed URLs, Google result counts or SEO-tool URL counts as article counts.
3. **Top 20 performing pages:** a ranked table of up to 20 relevant URLs with page title, canonical URL, topic/pillar, page format, target country, ranking queries, position/date where available, estimated organic visits and provider/date, and measured traffic only if the owner has legitimately supplied access to first-party analytics. Record whether the ranking is based on estimated traffic, keyword visibility, backlinks or another explicit metric. Do not mix unlike metrics into one unexplained rank. If page-level traffic is unavailable, show the 20 strongest pages by the best available transparent proxy and label the proxy.
4. **Top 10 topic clusters:** the ten topic/query clusters where the competitor has the strongest demonstrated search presence in our target market. For each, list representative queries, intent, ranking URLs, observed SERP coverage (for example, number of top-10 placements across a fixed query sample), country, device if relevant and observation date. Explain the sampling rule. Do not call a topic “owned” or claim market dominance from one query or one screenshot.
5. **Traffic-driving formats:** classify relevant winning pages as how-to guides, troubleshooting, checklists, comparisons, buying guides, reviews, calculators, templates, galleries, videos, FAQs, inspiration or other observed formats. Explain which formats appear to serve which search intents.
6. **Tools and interactive assets:** list calculators, quizzes, selectors, planners, downloadable templates, comparison features and other functional assets. Record URL, purpose, inputs/outputs, assumptions, mobile usability, accessibility, monetization and whether calculations/sources can be verified. Distinguish genuinely interactive tools from static articles or promotional widgets.
7. **Editorial strengths:** demonstrated expertise, author/reviewer transparency, sourcing, firsthand testing, specificity, step-by-step clarity, original examples, visuals, update practices, safety coverage and correction policies. Cite examples; do not infer quality from brand reputation alone.
8. **Technical and UX strengths:** observed navigation, information architecture, internal links, page speed/Core Web Vitals where measured, mobile layout, accessibility, structured data, image handling, search/filtering, ad load and intrusive elements. Record the test method, device, date and any measurement tool.
9. **Commercial strengths:** affiliate disclosures, product testing, retailer links, lead generation, professional directories, subscriptions, sponsorships, advertising, commerce and other visible business models. Record only what is observable and distinguish disclosure from inference.
10. **Weaknesses and exploitable gaps:** specific, reproducible shortcomings such as missing steps, unclear assumptions, outdated information, weak local relevance, inaccessible controls, poor mobile presentation, thin comparisons, missing calculators, unsupported claims or unanswered reader questions. Every weakness must cite the affected URL, screenshot/test or evidence, date and impact. Do not invent weaknesses or treat personal preference as proof.
11. **Our better-answer opportunity:** a concrete improvement HomeProjectWise can deliver, for a defined reader and intent. Specify the missing value, required evidence/expertise, original visual/tool/checklist, safety boundary, maintenance cost and why our proposed page/tool would be meaningfully better—not merely longer.
12. **Confidence and follow-up:** evidence quality, unknowns, last checked date, next verification date, owner/Claude review needs and change history.

### 16.3 How to count articles without misleading ourselves

Use this hierarchy:

- **High confidence:** complete, accessible sitemap or content export with canonical URLs, cross-checked against category/archive pages and a sample of live URLs.
- **Medium confidence:** systematic archive/category pagination or crawl with deduplication, known coverage gaps and a documented sampling check.
- **Low confidence:** third-party SEO index or search-engine index estimate only. Label as an indexed-page proxy, never as an article count.

For every count, state: retrieval date; domain/subdomain scope; included content types; excluded URL types; canonical/duplicate handling; pagination or crawl coverage; and confidence. Report a range where coverage is incomplete. Do not compare competitors' totals unless the same inclusion rules and comparable collection method were used. Show the number of tools, videos, recipes, reviews and other major formats separately when useful. Reconcile the figure on the next review rather than silently overwriting the previous count.

### 16.4 Page-level research and ranking evidence

For each priority topic cluster:

1. Define target country, language, search intent and a fixed query set before looking at results.
2. Capture the first page of results (normally top 10; extend to top 20 when justified), including organic pages and relevant SERP features. Record date, query, country, device and ranking URL.
3. Review the actual competing pages—not just their homepages, domain scores or search snippets. Read the content, inspect visuals, tools, citations, update dates and user journey.
4. Where a suitable SEO platform is available, collect page-level estimated organic traffic, ranking keywords, positions and trend history. Record provider, database/country, date and metric definitions. Treat these as estimates, not first-party analytics.
5. Use first-party traffic only for HomeProjectWise when authorized Search Console, analytics or equivalent data is actually connected. Competitor measured analytics are not publicly knowable unless the competitor or a credible source discloses them.
6. Save direct URLs and concise evidence notes. Search-result snippets and cached extracts alone are insufficient to establish a page's quality, functionality or weakness.

### 16.5 Specialist competitor discovery

At every weekly review, and whenever a new content cluster is proposed:

- Search the target country's SERPs for the cluster's primary and supporting queries.
- Record recurring domains that rank across multiple relevant queries, even if they are small, narrowly focused, local or individual-expert sites.
- Check specialist repair, DIY, organization, energy, smart-home, building-science and trade sources as relevant to the query—not as a generic list.
- Separate commercial competitors from technical authorities and product/manufacturer documentation.
- Add a specialist to the active dossier set when repeated relevant visibility or uniquely valuable expertise is demonstrated. Record the exact queries and ranking URLs that justified inclusion.
- Do not assume a major publisher is the strongest competitor for every topic. Topic-level SERP evidence takes precedence over overall domain size.

### 16.6 Comparative scorecard and decision rules

Score each relevant competitor/page cluster on a 1–5 scale, with evidence and confidence attached to every score:

- Search visibility and page-level performance evidence.
- Intent match and completeness of the answer.
- Accuracy, sourcing, expertise and safety.
- Originality and practical usefulness.
- Visual explanation and interactive utility.
- Mobile UX, accessibility and technical quality.
- Internal discovery and related-topic coverage.
- Trust, transparency and update discipline.

A score without a cited observation is **unscored**, not zero. Do not collapse all dimensions into a single league table unless weights and purpose are explicitly documented. Use the scorecard to identify repeatable strengths, gaps and opportunities—not to copy layouts or wording.

For every proposed HomeProjectWise response, document:
- What competitors already answer well and what readers can learn from them.
- What is missing, confusing, outdated, weakly evidenced or difficult to use.
- The exact improvement we can credibly deliver.
- What original evidence, test, calculation, diagram, photo or expert review is required.
- Whether the opportunity is worth the production and maintenance cost.
- Duplicate/cannibalization risk against our own URLs and tools.

### 16.7 Deliverables, ownership and update cadence

Maintain a competitor register linking to each dossier, plus dated topic-level SERP studies and a concise comparison summary in the operations room. The seven initial major publishers must each receive a dossier; add specialist dossiers as evidence warrants. Do not fabricate a complete top-20 page list when the data source cannot support it: record the limitation and the best defensible proxy.

- **Weekly:** discover relevant specialist domains, refresh priority query samples, note material competitor/page/tool changes, and update the most decision-relevant dossiers.
- **For each new article/tool proposal:** complete a topic-level competitor study before approval, including 3–5 actual ranking pages (or all relevant results when fewer are available).
- **Periodic deep review:** complete or refresh all seven major-publisher dossiers in a planned rotation; no claim that all 7 are freshly audited unless each was actually reviewed.
- **ChatGPT:** independent research, source checking, gap analysis and proposal updates; must identify access limitations.
- **Claude:** validate inventory/technical feasibility, inspect actual URLs and tools, challenge unsupported weakness claims and check overlap with active work.
- **Owner:** approves strategic choices, scope changes, production, publishing and merges.

### 16.8 Evidence integrity and prohibited shortcuts

Never invent article counts, page traffic, rankings, keyword ownership, conversion rates, tool functionality, author credentials or competitor weaknesses. Never present domain-wide traffic as traffic to a specific article. Never treat keyword search volume as page visits, indexed URLs as articles, or estimated SEO traffic as measured analytics. Never scrape or bypass access controls in violation of source terms. Respect robots.txt, rate limits, licensing and privacy. If a tool/paywall or analytics account is unavailable, state that limitation and continue with accessible primary evidence where possible.

**Acceptance gate:** a competitor dossier is decision-ready only when its scope, date, method, sources, article-count confidence, page-level evidence, topic sample, tools/formats, strengths, evidenced weaknesses, HomeProjectWise opportunity and unresolved unknowns are all recorded. A competitor list without these dossiers is not a completed competitive analysis.



## 14. Owner-approved editorial growth correction — 2026-11-11

This section clarifies and supersedes any interpretation of Sections 3.3, 4, and the candidate research workflow that makes competitor saturation or the absence of a wholly unique angle a reason to stop publishing.

### 14.1 Competition is normal, not a veto

- **Never reject or defer a useful topic solely because competitors already cover it.** Most worthwhile homeowner questions have existing answers. The objective is to publish a more useful, clearer, safer, more current, more actionable, or better-structured answer—not to find topics with zero competition.
- "Distinct value" does not mean an unprecedented subject. It can mean a better explanation, clearer decision path, accurate worked example, practical checklist, updated standards, more useful comparison, original illustration, calculator connection, realistic constraints, or better internal journey.
- A competitor covering the same broad subject is not proof of search-intent duplication. Check the actual query, task, audience and expected answer. A distinct subtask or stage of the homeowner journey may deserve its own page.
- Use **improve existing page / add a supporting page / build a topic cluster / publish a new page** as real options. Do not default to merging everything into one giant article.
- Defer only for a concrete reason: true same-intent cannibalization with an existing URL, weak reader value, unsafe or unsupported claims, poor fit with the site's mission, or production constraints. State a practical revisit trigger. "Competitors already cover it" is not an acceptable standalone reason.

### 14.2 Risk-based research tiers — match effort to the article

The former requirement to deeply review 3–5 pages and capture the top 10 for every approved content cluster is replaced by the following proportional workflow:

**Tier 1 — Standard useful article (default for most articles)**
- Confirm the reader task and primary search intent.
- Check the current site inventory and likely overlap.
- Review a representative SERP sample (normally top 5) and 2–3 useful competitor pages.
- Verify the important factual claims against 2–4 credible sources appropriate to the topic.
- Record a concise outline, the practical improvement we offer, safety limits and internal links.
- Do not buy domain-wide competitor metrics or perform exhaustive keyword research by default.

**Tier 2 — Priority cluster / strategic article**
- Review the top 10 results and 3–5 competitor pages.
- Map primary and secondary queries, related subtopics and internal-link relationships.
- Compare page structure, examples, visuals, tools, sources and reader decision support.
- Use keyword metrics when available and decision-relevant; label estimates and uncertainty.

**Tier 3 — Flagship, high-risk or technical article**
- Deep evidence review, authoritative/primary sources, expert or manufacturer guidance as relevant, complete competitor matrix, safety and limitation analysis, and stronger editorial/technical review.
- Apply to electrical, gas, structural, health/safety-adjacent, code-sensitive, expensive-system, flagship comparison and calculator-linked decisions where error costs are high.

Research tiers are a floor for sound work, not a reason to delay indefinitely. If a source is unavailable, document the limitation and use the best reliable alternative. Do not claim exhaustive coverage when a representative sample was used.

### 14.3 Publishing momentum and portfolio breadth

- The 100-title list is a starting portfolio, not a ceiling. ChatGPT should continuously add useful candidates and supporting subtopics as technologies, standards, homeowner questions and site coverage evolve.
- Research multiple candidates in parallel, normally up to three, and move qualified briefs forward without waiting for every competitor to be exhaustively profiled.
- Maintain the quality score and mandatory factual/safety checks, but interpret the score as **reader value and execution quality**, not novelty or absence of competition. An article may qualify while competing with strong pages if it offers a defensible practical improvement.
- A candidate marked DEFER for lack of a sufficiently distinct standalone angle may still be useful as a section, update, visual, checklist, FAQ or supporting page in a larger cluster. Record this distinction.
- Prioritize steady publication of useful, independently qualified articles. Empty queue means increase discovery and brief preparation—not stop publishing research or repeatedly re-audit already deferred topics.

### 14.4 Smart Home & Lighting — active expansion priority

Smart Home is a current, evolving pillar and must not be limited to old device troubleshooting. Expand across interoperability, setup, automations, energy, security, cameras, sensors, privacy, reliability, accessibility and retrofit planning. Examples to investigate (not automatic publication approvals):

1. What Matter 1.6 Means for Homeowners: Setup, Sharing and Device Compatibility.
2. Do You Need a Thread Border Router? How to Check Before Buying More Devices.
3. Matter Multi-Admin: Share One Smart Home Across Apple, Google and Alexa.
4. Matter Cameras: What Works Across Platforms, and What Still Depends on the Brand App?
5. Smart Blinds and Garage Doors: Compatibility, Controls and Safety Checks.
6. Smart Home Energy Management: Coordinate EV Charging, Solar, Batteries and Time-of-Use Rates.
7. Smart Home Presence Sensors: mmWave vs PIR Motion Sensors and Where Each Works Best.
8. Local vs Cloud Smart Home Automations: What Keeps Working When the Internet Is Down?
9. Smart Irrigation and Soil Sensors: Automate Watering Without Overwatering.
10. Smart Home Security Sensor History: What Event Logs Can and Cannot Tell You.
11. How to Build a Reliable Smart Home Network: Wi-Fi Coverage, Thread Border Routers and Device Placement.
12. A Practical Smart Home Retrofit Plan for Renters and Older Houses.

Before creating a new URL, check the existing Smart Home guides and update them when the intent is genuinely the same. Where the new subject is a different homeowner task or a major new standard capability, a supporting article is encouraged rather than automatically rejected as overlap.

**Current technology anchor:** Matter 1.5 added camera, closure, soil-sensor and energy-management capabilities (CSA, 2025-11-20); Matter 1.6 added setup, multi-ecosystem and context-driven-control improvements (CSA, 2026-06-17). Recheck official release notes and actual certified-device support at drafting time; do not imply every announced capability is available in every retail device or ecosystem.

### 14.5 Reassessment of the recent DEFER decisions

PL-001, EN-001 and HVAC-001 were deferred under an overly conservative interpretation of competitor coverage. Their current records remain useful research, but the decision must not be read as a permanent ban:
- PL-001 may be a useful homeowner diagnostic guide or a strong section in a broader water-loss troubleshooting cluster if we make the decision path clearer and safer than typical generic instructions.
- EN-001 may be a practical, low-risk first-pass walk-through with explicit stop points and next steps; it need not outperform every comprehensive audit guide to help readers.
- HVAC-001 may be a useful filter-selection/measurement guide with a clear chart and compatibility caveats; existing manufacturer guidance is a source to build on, not a reason to avoid the subject.
Reassess these candidates with Tier 1 or Tier 2 effort, select the strongest next one based on reader usefulness and production feasibility, and do not repeat paid research merely to justify moving forward.
