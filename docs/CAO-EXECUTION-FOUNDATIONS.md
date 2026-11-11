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
