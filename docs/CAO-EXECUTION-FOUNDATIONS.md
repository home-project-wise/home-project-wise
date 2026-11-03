# CAO execution foundations — HomeProjectWise

**Prepared:** 2026-11-01  
**Status:** Proposed operating foundation; documentation only.  
**Scope:** Organic search, AI answer visibility, competitive advantage, useful referrals, and reference-worthy resources.  
**Authority:** This document operationalizes the ideas adapted in [CAO-INTEGRATION.md](CAO-INTEGRATION.md). It does not override the complete [Value Before Publishing law](VALUE-BEFORE-PUBLISHING.md), the 85/100 opportunity threshold, `.editorial-freeze`, or owner approval gates.

## 1. Strategic definition: become useful enough to be referenced

HomeProjectWise should not try to persuade other websites or AI systems to mention it. It should create resources that another publisher, homeowner, property manager, or answer engine has a concrete reason to reference because the resource helps someone make a better decision or complete a task.

The competitive advantage is not article volume. It is a connected set of:

1. **Decision-grade guides:** direct answers, clear decision paths, accurate comparisons, measurements, worked examples, safety boundaries, and primary sources.
2. **Useful tools:** calculators and checkers whose formulas, assumptions, units, limits, and edge cases are transparent and independently verifiable.
3. **Reusable reference assets:** printable checklists, decision tables, diagrams, and methods that genuinely save another site or reader time.
4. **Trust and traceability:** clear editorial identity, dates, source attribution, correction path, and no invented testing or expertise.
5. **Findability:** technically eligible pages, crawlable HTML links, consistent canonical URLs, valid sitemap, and relevant topic pathways.

A backlink, AI citation, search impression, click, and completed visitor task are different outcomes. Never report one as another.

## 2. What the evidence says today

### Search baseline available in the project records

The latest documented Search Console snapshot is 2026-10-29, covering 2026-09-20 to 2026-10-29:

- 360 impressions, 1 click, average position 20.9.
- 16 pages had impressions.
- The macerating-toilet guide had 100 page impressions; the bathroom-condensation guide had 75.
- The kitchen-counter guide had 20 impressions and 1 click.
- The cable-clutter page had 12 impressions.
- The recorded query positions for the two clutter topics were approximately 10.1 (kitchen clutter) and 7.5 (cable clutter meaning); volumes were small, so these are investigation signals, not stable performance conclusions.

These values are a dated baseline, not live metrics for 2026-11-01. Recheck on 2026-11-05 as already scheduled. Do not edit the homepage, route templates, or titles before that comparison.

### Technical eligibility

The 2026-10-31 read-only audit recorded:

- The site is served at the GitHub Pages project path.
- The host-root `https://home-project-wise.github.io/robots.txt` returned 404; the repository's subpath `/home-project-wise/robots.txt` is not the host-level robots file.
- No host-root crawler directives were observed. This does not prove actual crawler visits, indexing, or AI citations.
- The tested homepage, guide, and sitemap returned 200; the sampled HTML included page text, headings, and structured data without requiring JavaScript.
- A per-bot robots policy (for example, separate OAI-SearchBot and GPTBot choices) cannot be managed reliably through the current project-subpath robots file. A custom-domain/hosting decision is needed before changing crawler policy.

**Decision:** do not change robots, crawler policy, hosting, or domain settings as part of this document. Keep the current configuration unchanged until the owner decides the long-term domain route.

## 3. Platform requirements — no folklore

- **ChatGPT Search:** public pages can be eligible; allow OAI-SearchBot and ensure the host/CDN permits its published search crawler traffic. OAI-SearchBot is for search discovery; GPTBot is a separate control for potential model-training crawling. A policy decision must distinguish them.
- **Google AI Overviews / AI Mode:** Google says ordinary SEO fundamentals apply. Pages must be indexed and eligible for a normal Search snippet. There is no special AI schema or requirement to create llms.txt / AI-only files.
- **Bing / Copilot:** use Bing Webmaster Tools where available. Its AI Performance report can show aggregated citations, cited pages, and grounding-query themes for supported experiences. It is not a ranking report, traffic report, complete log, or causal attribution.
- **Other answer engines:** measure only what can actually be observed. Do not imply a universal crawler rule or guaranteed placement.

## 4. The reference-worthiness test

Before investing in a page, tool, or asset, answer:

1. What exact task does it help another person or publisher complete?
2. What does it contain that is not merely a rewritten summary of common advice?
3. Can its method, evidence, units, and limits be checked?
4. Can another site cite or link to one stable, useful URL?
5. Does it remain useful without requiring a backlink, affiliate click, or brand mention?
6. Can we measure actual use or useful referrals?

Examples of potentially reference-worthy assets, subject to verification:

- A crawl-space dehumidifier sizing calculator with a published method, input assumptions, unit conversions, and limitations.
- A bathroom moisture decision guide that carefully separates clues for condensation, plumbing leaks, and rain-related moisture without pretending to diagnose remotely.
- A basement toilet decision matrix that distinguishes macerating toilets, sewage ejectors, and gravity drainage, with local-code and manufacturer limits.
- A practical smart-plug load checker with clear electrical-rating assumptions and safety warnings.
- A printable project measurement/checklist asset that is genuinely usable on its own.

These are candidates, not claims that every current tool already passes the test. Verify formulas and UX before promoting them as reference assets.

## 5. Prioritization: fix eligibility, then earn citations, then scale

### Priority A — discoverability and measurement

- Complete URL/indexing status using Search Console and Bing exports; HTTP 200 is not proof of indexing.
- Confirm sitemap submission and excluded-URL reasons.
- Verify that important pages have crawlable internal links and are not orphaned.
- Confirm Bing Webmaster Tools ownership and whether AI Performance is available for this property.
- Preserve separate reporting for Google/Bing organic visits, AI referrals, direct traffic, and unknown referrers.
- Remember: GoatCounter's JavaScript page counter does not measure crawler visits.

### Priority B — build a repeatable AI answer benchmark

Use the companion [AI question benchmark](CAO-AI-QUESTION-BENCHMARK.md). Keep question wording, language, region, platform, and recording rules stable. Record exact cited URLs and whether the cited page actually supports the answer. A manually tested question set is a sample, not a complete measure of platform visibility.

### Priority C — use evidence to select no more than three existing pages

Initial candidates based on the site's existing work (not an approval to edit):

1. Basement toilet / macerating toilet guide.
2. Bathroom condensation and moisture guide.
3. Crawl-space dehumidifier guide/calculator.

Confirm the choice using 2026-11-05 query/page data and the AI benchmark. The clutter pages remain a separate small-query observation; do not let them distract from the main topical priorities without fresh evidence.

### Priority D — create one reusable asset at a time

Choose the asset with the clearest visitor problem, demonstrable method, and realistic demand. Prototype only after confirming the current tool works. Ask for feedback from a small number of relevant users or publishers before building embed infrastructure. Any outreach requires owner approval.

## 6. Keyword and intent map — initial hypotheses, not search-volume claims

| Cluster | Primary intent | Existing target | Initial decision |
|---|---|---|---|
| Bathroom moisture | Diagnose condensation vs leak; reduce moisture | `articles/reduce-bathroom-condensation.html` | Use query-level GSC data to select a specific long-tail problem; do not chase broad head terms blindly |
| Bathroom ventilation | Select, size, and troubleshoot an exhaust fan | `articles/choose-bathroom-exhaust-fan.html`; `articles/bathroom-exhaust-fan-dripping-water.html` | Keep sizing and dripping-water intents distinct where the visitor task differs; link them contextually |
| Basement bathroom | Choose a drainage/toilet system without unnecessary concrete demolition | `articles/macerating-toilet-basement-bathroom.html` | High-priority existing guide; protect its affiliate URL and validate technical claims against manufacturers/local code |
| Crawl-space moisture | Choose dehumidifier capacity; understand persistent moisture | `articles/what-size-dehumidifier-crawl-space.html`; `articles/how-to-fix-damp-crawl-space-humidity.html`; calculator | Separate sizing intent from diagnosing water-entry/drainage causes; no duplicate pages |
| Kitchen clutter | Understand why clutter returns and build a workable zone | `articles/kitchen-counter-zone-that-stays-clear.html` | Existing page has a small recorded click; monitor exact queries before further edits |
| Cable clutter | Define cable clutter and reduce visible cable mess | `articles/reduce-cable-clutter.html` | Existing page has a small recorded page-one query signal; preserve the current test window |
| Smart-home safety | Check load, compatibility, privacy, and outage behaviour | Smart-plug, thermostat, privacy, and Wi-Fi guides/tools | Map each distinct task to one page; do not merge unrelated intents |
| Home planning tools | Calculate, check, or plan a practical home task | Budget planner, home check-up, rug-size, smart-plug, crawl-space tools | Tool pages must explain method, units, assumptions, limits, and result meaning |

For each query cluster, the working map must eventually add: exact query, source/date, country/device, intent, target URL, GSC impressions/clicks/CTR/position, indexed state, SERP features, actual competitors reviewed, overlap/cannibalization risk, visitor gap, next action, confidence, and owner.

Do not fill unavailable fields with estimates. Do not set numeric targets until the 28-day comparison window is complete.

## 7. How we will know it is working

Report these as separate layers:

| Layer | Evidence | What it does not prove |
|---|---|---|
| Technical eligibility | crawl access, valid responses, sitemap, index status | ranking or citation |
| Search visibility | impressions, queries, indexed URLs | useful visits |
| AI visibility | verified cited URLs; Bing AI Performance where available | clicks, endorsement, or causation |
| Referral acquisition | identifiable AI/referral sessions | full citation volume |
| Visitor value | calculator starts/completions, useful guide interactions, repeat use where measured | revenue by itself |
| External references | relevant editorial links/mentions and referral use | authority from raw link count |

For each experiment, record baseline, change, date, comparison window, other changes, outcome, confidence, and decision (keep/revert/observe). Separate zero from unavailable.

## 8. Operating plan and ownership

### ChatGPT
- Own the 40-question AI benchmark and its results register.
- Own the keyword/intent map, SERP/competitor review, and independent review of up to three proposed page briefs.
- Use source evidence; do not claim access to GSC/Bing exports unless retrieved.
- Keep the benchmark questions stable between runs.

### Claude
- Own the live URL/indexing table and inbound-link/hub audit already assigned in CAO-INTEGRATION.md.
- Own implementation in focused PRs only after approval, with tests and exact handoff evidence.
- Do not overlap with ChatGPT's benchmark or edit its files.

### Owner
- Provide/confirm Search Console and Bing exports and Bing Webmaster access.
- Decide custom domain/hosting and crawler-control policy.
- Decide whether CI `quality_gate.py --all` should become a protected workflow change.
- Approve outreach, content changes, PR merges, and any change to the editorial freeze.

### Immediate sequence
1. Now: create the benchmark and initial intent map (documentation/research only).
2. By 2026-11-05: keep the existing GSC baseline clean; gather the next comparison and Bing evidence.
3. After 2026-11-05: select at most three existing pages using evidence and the 85/100 rubric; prepare briefs, not automatic edits.
4. Test one reference asset; validate usefulness before outreach or embedding.
5. Review the first benchmark and real analytics; continue only what shows evidence of value.

## 9. Non-negotiable exclusions

- No bulk articles, near-duplicate pages, AI-only pages, fake experience, fake tests, fake statistics, fake experts, or manufactured citations/backlinks.
- No promises of ChatGPT, Google AI, Copilot, or Perplexity inclusion.
- No robots, crawler, custom-domain, or production setting changes without the owner's decision.
- No homepage, route-template, or title changes before the 2026-11-05 Search Console comparison.
- No Awin link changes, no workflow changes, no .editorial-freeze changes, and no publishing/merge authorization from this plan.
- The full Value Before Publishing law and the 85/100 threshold remain mandatory.


## 10. Google Search generative AI — mandatory Search Console audit

**Global availability:** Google states that the Search generative AI control and generative-AI performance insights were rolled out to all websites worldwide as of **2026-08-31**. This is now a required checkpoint, not a future or optional experiment.

Official documentation:
- Search generative AI control: https://support.google.com/webmasters/answer/16908024
- Generative AI performance report (Search): https://support.google.com/webmasters/answer/16984139
- Google Search Central announcement: https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports

### 10.1 Check the inclusion control first

In the correct verified Search Console property, open **Settings → Search generative AI** and record:

- Property inspected and inspection date.
- Current choice: include, exclude, or inherit from parent.
- If inherited, the effective parent property and its setting.
- Screenshot/export or other reproducible evidence of the displayed state.

**Desired eligibility state:** "Include my site's links and content in Search generative AI features." Google says this permits eligible pages to appear as links and help ground responses in AI Overviews, AI Mode, and generative-AI features in Discover. Excluding the site prevents its links/content from appearing in those features. Google says this control does not change ranking in other parts of Search.

Do not assume the default or inheritance state without checking the actual property. If the property is excluded, document the consequence and request owner confirmation before changing the setting. Do not change it silently. Record any approved change and its date.

### 10.2 Inspect the Generative AI performance report

In Search Console, open the **Generative AI performance** report for Search and record:

- Total impressions and trend over the selected period.
- Pages receiving impressions, with exact canonical URLs.
- Country and device breakdowns.
- Date range, granularity, property, and retrieval date.
- Pages with impressions that are not yet in our 40-question benchmark.

The report covers AI Overviews and AI Mode in Google Search. The separate Discover report covers generative-AI features in Discover. The documented dimensions are pages, countries, dates, and (for Search) devices. Do not treat this report as a query report or click report: track ordinary Search clicks and visits separately, and do not invent query/click attribution where the report does not provide it.

If the report is not visible, first verify the correct property and inclusion control; Google notes that a property may not show a report when it has not received enough generative-AI impressions. Record "not available / insufficient data" rather than zero.

### 10.3 Reporting cadence and interpretation

- Record the first report snapshot only when someone actually opens the verified property: write the real retrieval date and the selected report date range in the register. If nobody has retrieved it yet, mark the snapshot **pending**. Never backdate an uncollected measurement (for example to 2026-11-01). Do not change page content for this.
- Review it alongside the existing five-day progress check, but preserve the scheduled **2026-11-05** Search Console comparison and its clean measurement window.
- At each review, compare generative-AI impressions and cited pages separately from standard Web Search clicks, total impressions, CTR, and average position.
- **Do not add the generative-AI report to the overall Search totals.** Google states that generative-AI impressions are already included in the overall Search performance report; the dedicated report is a separate view of a subset of the same data. Show it as "of which generative AI" next to total impressions, never as an additional number. Clicks, queries and position stay in the overall report only. Keep Discover's generative-AI report separate from Search and do not mix their totals. Source: https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- Keep the 40 fixed questions in [CAO-AI-QUESTION-BENCHMARK.md](CAO-AI-QUESTION-BENCHMARK.md). For any observed Google AI citation, record the exact question (if observable), page URL, country, date, answer context, and whether the page genuinely supports the answer. Do not infer a prompt from an impression.
- Treat AI impressions as visibility, not a click, visit, endorsement, ranking, or proof of business value.

## 11. Search optimisation checklist — keywords, pages, links, and technical foundations

Apply this checklist to existing pages and approved work. It is a diagnostic standard, not permission to edit frozen pages.

### 11.1 Keyword and intent research

For every target page, document primary query/cluster, secondary natural-language questions, search intent, target country/language, current Search Console queries and metrics, matching URL, SERP features, competitor pages actually reviewed, and date/source. Separate informational, troubleshooting, comparison, calculator, and purchase intent.

Use exact Search Console evidence where available; use external keyword tools or SERP observations only with source/date labels. Never invent search volume, difficulty, ranking, or traffic potential. Assign one primary page to one distinct intent. Merge overlapping intents into the best existing resource rather than creating competing pages. Include question phrasing and synonyms naturally; never stuff repeated exact-match keywords.

### 11.2 On-page usefulness and relevance

For each approved page, check that:
- The title and H1 accurately describe the visitor's task and are distinct from other site pages.
- The opening gives a concise, correct answer and explains when the answer changes.
- Headings form a logical decision path rather than a list of keyword variants.
- The page contains useful steps, measurements, units, examples, comparisons, and limits where relevant and verified.
- Meta description accurately previews the page and encourages the right click without promising unsupported outcomes.
- Images have descriptive filenames where practical, useful alt text (not keyword stuffing), appropriate dimensions/compression, and meaningful captions when needed.
- Internal and external links help the reader take the next step; affiliate disclosures and existing affiliate URLs are preserved.
- Structured data is valid, matches visible content, and is used only for eligible content types. No invented reviews, ratings, authorship, FAQ markup, or special "AI schema" shortcuts.

### 11.3 Internal links and site architecture

Maintain a hub-and-supporting-page map for each topic cluster. Every important page should be reachable through ordinary crawlable HTML links, not only search, JavaScript events, or sitemap discovery. Use concise descriptive anchor text that explains the destination. Check orphan pages, broken links, redirect chains, duplicate/canonical conflicts, breadcrumbs, category hubs, and relevant tool links. Add links only where the destination is genuinely useful; avoid sitewide exact-match anchor repetition.

### 11.4 Technical SEO and indexation

For every sitemap URL, periodically verify HTTP status, redirect destination, canonical, robots meta and X-Robots-Tag, sitemap inclusion, internal discoverability, mobile rendering, and Google/Bing index state with the relevant inspection tools. Separate "not indexed", "not discovered", "crawled not indexed", and "unknown/unavailable". A 200 response or sitemap entry does not prove indexing. Check page speed/Core Web Vitals and mobile usability using measured data; fix material problems before cosmetic tuning. Preserve the existing constraint against homepage, route-template, title, robots, hosting, and workflow changes before the 2026-11-05 comparison or without owner approval.

### 11.5 External sharing, distribution, and earned links

The objective is useful discovery, not manufactured backlinks. Before sharing, confirm that the destination page is live, indexable, accurate, useful, and meets the 85/100 opportunity threshold. Then:

1. **Pinterest:** use original diagrams, checklists, and useful tool outputs; create platform-appropriate vertical assets with accurate titles, descriptions, and alt text. Link to the canonical page with channel-specific UTM parameters. Start with a small, sustainable test and measure real non-owner referrals.
2. **Relevant communities:** answer actual questions fully on Reddit, Quora, and suitable Facebook groups/forums. Read each community's self-promotion rules first, disclose the site's relationship, and link only when it directly helps. No repeated copy-paste, unsolicited link drops, or automated posting.
3. **Specialist publishers and resource pages:** identify a small number of relevant DIY, home-improvement, trade, or educational publishers whose readers would genuinely benefit from a calculator, decision table, or checklist. Offer a useful resource or correction, not a backlink exchange. Personalise outreach; no mass email, paid links, link networks, or reciprocal-link schemes. Sending outreach requires owner approval.
4. **Shareable assets:** prefer original calculators with transparent formulas, printable checklists, decision trees, comparison tables, and diagrams. A resource must stand on its own before promotion. Test one asset and measure referrals/usage before producing another.
5. **Attribution:** use consistent UTMs (for example, `utm_source=pinterest&utm_medium=social&utm_campaign=<page-slug>`) while keeping canonical URLs clean. Separate owner/testing visits from audience traffic. Track referral sessions, engaged use, tool completions, and earned editorial references separately.

Never buy links, fabricate mentions, spam comments, offer incentives for followed links, or claim a link is an endorsement. External sharing cannot compensate for weak content or poor indexability.

## 12. Five-day operating review

At each five-day checkpoint, record a dated snapshot with:
- Google Search: clicks, impressions, CTR, average position, queries/pages, and indexed URL changes.
- Google generative AI: impressions, pages, country/device/date dimensions, and control state.
- Bing: AI Performance observations where available, plus ordinary search performance.
- Other answer engines: results from the fixed 40-question sample, with exact cited URLs and answer-quality checks.
- Acquisition: attributable referral visits by source/campaign, excluding owner testing where possible.
- Visitor value: useful guide interactions and calculator/checker starts and completions where measurable.
- Work shipped: PRs, files, tests, and whether each change was approved and merged.

Do not compare unlike date windows or present impressions as clicks. Keep the 2026-11-05 comparison intact; the five-day cadence is measurement, not permission to edit protected areas.

