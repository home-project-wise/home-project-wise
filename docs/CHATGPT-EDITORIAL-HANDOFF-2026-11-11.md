# Editorial & Research Handoff — 2026-11-11

**Purpose:** Transfer the current ChatGPT editorial workflow, research methods, verified tools, decisions and visual review context to the user's previous ChatGPT conversation/agent. This is an operating handoff, not a claim that the previous conversation has received a direct notification.

## 1. Ownership and boundaries

- **ChatGPT editorial lane:** topic discovery, keyword/intent research, representative SERP and competitor review, site-overlap checks, article briefs, content scoring, source verification, internal-link strategy, editorial QA and portfolio planning.
- **Claude engineering lane:** implementation/code, calculator logic/UI, technical fixes, responsive behavior, workflows, tests and deployment work assigned to Claude.
- Do not edit Claude-owned code, branches, calculator implementation or workflows. Do not merge PRs or deploy without the owner's explicit approval.
- Keep one canonical coordination record: `data/AI_COLLABORATION.md`. Log small steps with START / DONE / BLOCKED / RESUME HERE. Never create a competing operations room or overwrite it from a stale branch.
- Work should be independent and parallel, with clear handoffs. Do not claim that Claude was notified unless an actual message/action confirms it; put review requests in the canonical operations room for Claude to read.

## 2. Owner-approved editorial policy

The owner explicitly corrected an overly conservative approach: competition is normal and must not stop growth. Do not wait for a topic to be uncovered by every competitor or demand a zero-competition keyword.

Use proportionate research:
- **Tier 1 (default):** define reader task and intent; check site overlap; inspect a representative top-5 SERP sample, 2–3 useful competitor pages, and 2–4 credible/official sources. Produce a concise actionable brief.
- **Tier 2 (priority/complex):** top-10 SERP sample, 3–5 competitor pages, keyword cluster and internal-link map.
- **Tier 3 (flagship/high-risk):** deep evidence and competitor analysis, especially for safety-critical, technical or fast-changing claims.
- Competition is not a veto. Defer only for real same-intent cannibalization, weak reader utility, unsafe/unsupported claims, poor site fit or a genuine production constraint.
- The quality score measures reader value, evidence, execution and site fit — not novelty or absence of competitors.
- Expand existing pillars and create supporting pages. Do not collapse every related question into one oversized article.
- Keep expanding all pillars; Smart Home & Lighting is an active priority, not the only topic area.
- The 100-title portfolio is a starting point, not a ceiling. If the qualified queue is empty, discover and brief new candidates; do not stop.
- Previous DEFER decisions for PL-001, EN-001 and HVAC-001 were over-conservative and should be reassessed with Tier 1 effort, not defended by repeating expensive research.

## 3. First qualified article batch

The current live main-branch queue contains three complete 16-field briefs, each marked READY FOR CLAUDE:
1. **SH-001 — Do You Need a Thread Border Router? Check What You Already Own Before Buying** — 86/100. Proposed slug: `do-you-need-a-thread-border-router`.
2. **EN-001 — DIY Home Energy Audit: A Room-by-Room Walkthrough to Find What to Fix First** — 88/100. Proposed slug: `diy-home-energy-audit-walkthrough`.
3. **HVAC-001 — What Size HVAC Air Filter Do I Need? Measure the Slot, Check the Fit and Choose MERV** — 89/100. Proposed slug: `how-to-measure-hvac-air-filter-size`.

The full briefs, evidence URLs, SERP sample, site overlap, differentiation, outlines, visuals, internal links and acceptance criteria are in:
- `docs/ARTICLE-PRODUCTION-QUEUE.md`
- `docs/HOMEPROJECTWISE-ARTICLE-PORTFOLIO-AUDIT-2026-11-10.md`

Next step: Claude reviews in order SH-001 → EN-001 → HVAC-001 and records ACCEPT / REVISE / REJECT with reasons. READY FOR CLAUDE is not a claim that implementation or publication has started.

## 4. Research and tool workflow used

### A. GitHub repository inspection and persistent handoff
Connected GitHub tools used:
- `mcp__GitHub__fetch_file`: read exact files from the default branch, including the queue, audit, charter, ops room, article HTML and inventory.
- `mcp__GitHub__fetch`: inspect repository directories and REST resources, such as current article-directory contents and repository metadata.
- `mcp__GitHub__update_file`: update existing documents using the current blob SHA; each write creates a normal Git commit.
- `mcp__GitHub__create_file`: create new handoff documents.
Method: fetch current main-branch file → inspect actual contents → make a targeted change → write using the returned SHA → fetch again to verify. Never infer that a write succeeded without checking the result. No article HTML, source code, calculator, workflow or Claude-owned file was changed in this editorial batch.

### B. OpenSEO
Project ID: `bfc2efa7-1372-48f2-be31-5e3c1878547f`.

Available and relevant actions include:
- `mcp__OpenSEO__list_projects` and `get_project_context`: identify the correct project and read saved website/competitor/keyword context before new research.
- `research_keywords` / `get_keyword_metrics`: keyword volume, difficulty, CPC, intent and trends, when credits are available.
- `get_serp_results`: live Google organic result sample for target queries.
- `get_ranked_keywords`, `get_domain_keyword_suggestions`, `find_serp_competitors`, `get_domain_overview`: competitor keyword/domain intelligence where justified.
- `get_search_console_performance` and `list_search_console_sites`: first-party GSC data, only if a verified property is actually connected.
- `show_serp_results` can display already-fetched SERP results interactively; it does not fetch new data or spend credits.
Important limits: prior keyword expansion returned `INSUFFICIENT_CREDITS`. Search Console was not connected/available in the inspected context. Therefore the latest three briefs do **not** claim fresh monthly volume, KD, rankings, traffic or GSC demand. Do not invent these values or rerun paid research just to make a brief look more quantitative. Use official sources and observed SERP intent while credits/data are unavailable.

### C. General web research
The standard web search/open workflow was used to find and inspect:
- Official documentation and standards bodies first for factual/technical claims.
- Representative specialist and publisher competitor pages for the actual reader task.
- Exact page-copy and current repository inventory checks to avoid same-intent duplication.
For SH-001, sources include CSA Matter 1.6, Thread Group, Apple Support, Google Home/Matter documentation, Amazon Alexa/Thread documentation, and specialist guides/tools (MatterCatalog, Smart Living Web, Matterhome.io, Smart Homeowners). Recheck device models and platform support immediately before publication.
For EN-001, sources include DOE, ENERGY STAR and This Old House. Keep the DIY walkthrough clearly separate from professional energy audits and include safety stop points.
For HVAC-001, sources include Trane, PNNL Building America and EPA's MERV explanation. Do not recommend a high-MERV filter without checking system airflow/pressure-drop compatibility.

## 5. Site overlap and inventory method

- The live `website/articles/` directory was inspected directly; it contained **31 article HTML files** at the time of this review.
- `data/CONTENT_INVENTORY.md` is an older 23-article snapshot dated 2026-10-24 and must not be quoted as the current count.
- SH-001's exact overlap check reviewed `smart-lighting.html`, `smart-home-wifi-outage-test.html` and `smart-devices-keep-going-offline.html`. The lighting page has a short Matter-over-Thread/border-router mention, but no dedicated setup/purchase decision flow. The new guide has distinct intent; add contextual cross-links.
- EN-001 is an umbrella inspection/prioritization task; existing pages solve narrower issues and should be linked as next steps, not duplicated.
- HVAC-001 concerns central HVAC/furnace filters. The existing bathroom exhaust-fan sizing guide is a different task.

## 6. Video review — owner upload, 2026-11-11

The owner shared a 67.7-second phone screen recording. It was inspected frame-by-frame. It shows:
- The HomeProjectWise home page and article/library sections on a mobile browser.
- The Home Project Calculator page and six calculator categories: Area & Volume, Paint, Flooring & Materials, Electricity Cost, Project Cost, Wallpaper.
- Mobile form fields, explanatory calculation notes, FAQs and related links.
- A wider/desktop-like responsive presentation of the calculator further into the recording.
- The visible website pages are in **light mode only**. The video does not demonstrate a dark-mode toggle or a dark-mode rendering.
The video itself remains the owner's conversation upload; this note records observations, not a copy of the video in GitHub.

### Light/dark mode clarification for the owner
If Claude asks for light and dark screenshots, the owner can try Android Settings → Display → Dark theme, or the Dark theme quick-settings tile, then reload the website. However, changing Android's theme will only change the site if it supports `prefers-color-scheme` or has its own theme control. The recording does not establish whether dark mode is implemented. Ask Claude whether he needs (a) screenshots of the device in system light/dark mode, (b) screenshots of a site-level theme toggle, or (c) implementation/QA of dark-mode support. Do not ask the owner to alter code or infer that dark mode exists. If there is no dark theme yet, say so and test/implement it in Claude's engineering lane.

## 7. Exact next actions

1. Claude: review the three queued briefs in order and return ACCEPT / REVISE / REJECT, checking current code/source work before implementation.
2. ChatGPT editorial lane: continue discovering the next Tier 1 candidates across all pillars while prioritizing current Smart Home developments; do not wait for this batch to publish.
3. For every candidate: check the live article inventory and exact competing page intent, sample SERP proportionately, use official sources, create the 16-field brief and score reader utility.
4. Recheck fast-changing Matter/Thread device support on draft/publication date.
5. Keep the canonical operations room updated with concise START / DONE / BLOCKED / RESUME HERE records.
6. Preserve owner approval boundaries for code merges, deployment and public release.

## 8. Current source-of-truth links

- Production queue: https://github.com/home-project-wise/home-project-wise/blob/main/docs/ARTICLE-PRODUCTION-QUEUE.md
- Portfolio audit: https://github.com/home-project-wise/home-project-wise/blob/main/docs/HOMEPROJECTWISE-ARTICLE-PORTFOLIO-AUDIT-2026-11-10.md
- Operating charter: https://github.com/home-project-wise/home-project-wise/blob/main/docs/HOMEPROJECTWISE-OPERATING-CHARTER-2026-11-10.md
- Operations room: https://github.com/home-project-wise/home-project-wise/blob/main/data/AI_COLLABORATION.md

