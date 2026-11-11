# HomeProjectWise roadmap (owner mandate, 2026-10-17)

Goal: build the most useful, trustworthy and best-made beginner home-improvement and smart-home site for US/UK readers. Claude runs the project end to end; the owner is only asked for decisions that genuinely need him.

## Non-negotiable rules
1. Never break an existing URL. A page that moves or is renamed keeps its old file as a redirect stub (meta refresh + canonical to the new URL). No deletions of published pages.
2. Every change goes through a PR with green checks, is verified live after deploy, and is logged in data/daily_routine_log.md and data/PROJECT_STATE.md.
3. Honesty over polish: no invented tests, experts, statistics or experience claims. AI-assisted drafting is disclosed on the Editorial Policy page. Sources are checked and linked.
4. guides.html, sitemap.xml, feed.xml and the homepage "latest" cards are generated at deploy by scripts/rebuild_site_indexes.py. Fix problems in the generator or in the article files, never by hand-editing the generated files.
5. Every article needs: datePublished in JSON-LD, an eyebrow "CATEGORY . SUBTOPIC" (SMART, DESIGN or PROJECT/REPAIR/MAINTENANCE words route it; anything else lands in Storage), a meta description, a hero image, at least 4 images, sources, FAQ.

## Baseline measured on 2026-10-17
- 22 guides (Storage 5, Home Design 4, Weekend Projects 9, Smart Home 4), 29 URLs in the sitemap, about 1,300-2,400 words per guide.
- All guides have BlogPosting + FAQPage structured data and canonical URLs; the 4 legal pages have no canonical and 30-40 words of text; About has about 140 words; Editorial Policy 30 words (trust gap).
- Internal links: each guide receives only 1-8 links from other pages (new guides 2). No category hub pages, no site search, no visible breadcrumbs.
- No custom 404 page, no web manifest, no sitemap lastmod (fixed in the foundation PR).
- Header navigation was hidden on mobile (fixed), low-contrast small text (fixed), SVG crops (fixed), tablet gutters (fixed).
- Fonts load through a CSS @import (render-blocking); the homepage hero photo is hotlinked from Unsplash.
- Domain is a github.io project URL, which caps brand authority. A custom domain can be added later without losing old links (GitHub redirects the old URLs to the custom domain).

## Phase 1: trust and technical foundation
- [x] 404 page, web manifest, theme colour, sitemap lastmod, dateModified on revised guides, dead source link replaced.
- [x] Real About, Editorial Policy, Corrections, Contact, Privacy and Terms pages with canonical, meta, Organization schema (who we are, how guides are researched, AI-assistance disclosure, corrections policy, affiliate/ads policy when relevant).
- [ ] Visible "Last updated" and "Sources" block on every guide; author/organization byline consistent.
- [ ] Automated link checker and structured-data validator in CI (report only, no blocking on bot-blocked sites).

## Phase 2: information architecture and internal linking
- [x] Category hub pages (storage, design, projects, smart home) with intro, start-here path and grouped guides; the guides.html anchors keep working.
- [x] Automatic "Related guides" block at the end of every guide, built by the generator from category and sub-topic, so new guides are linked from day one. Target: at least 5 inbound links per guide.
- [x] Visible breadcrumbs, client-side site search (previous/next in cluster still open) from a generated index.
- [ ] Topic clusters: moisture and bathrooms, lighting (design and smart), storage routines, small repairs. Each gets a pillar guide.

## Phase 3: performance, design and accessibility
- [ ] Preconnect and self-hosted fonts, self-hosted hero image, responsive images with width/height, no layout shift.
- [ ] Dark mode, print styles for checklists, reading comfort pass, skip link.
- [ ] PageSpeed check in CI; target Lighthouse 95+ on mobile for home, guides and a sample guide.

## Phase 4: content engine (what makes the site better than generic ones)
- [x] Interactive tools: rug size and crawl space dehumidifier done; smart plug watt check next and printable checklists: unique, linkable assets.
- [ ] Each new guide ships an original diagram or tool, a quick answer, a quick win, sources and FAQ.
- [ ] Review cycle: every guide re-checked for facts and links about every 6 months, dateModified updated only when something real changed.
- [ ] Image audit (Gemini) after each quota reset; replace weak images in batches.

## Phase 5: growth
- [ ] Search Console and indexing health checks, RSS, newsletter, Pinterest-ready vertical images.
- [ ] Custom domain when the owner decides (needs his purchase and DNS).
- [ ] Outreach and backlinks need real-world action; Claude prepares the assets and a list, the owner decides.

## Needed from the owner (kept to a minimum)
- Batches of hero images generated with the prompts Claude supplies (about 5 at a time, when he has a free minute).
- A decision on the custom domain, when ready.
- A quick look at the site on his phone now and then.

## Tools (free calculators)
Each tool applies the rules and sources of one guide to the reader's own measurements. Live: rug size, crawl space dehumidifier size. See the Tools page (tools.html, generated).
How to add a tool (about 10 minutes): follow the docstring in scripts/tool_page.py. In short: write and test the JS logic (jsdom, real scenarios), build the page with build_tool_page(...), save it as website/<slug>.html, add one entry to TOOLS in scripts/rebuild_site_indexes.py (that adds it to the Tools page, its category hub, search and the sitemap), add a callout in the related guide, and cite the sources the rules come from. Results are estimates and every tool says so. No affiliate links inside tools.


## Competitive growth strategy (2026-11-10)
The current execution priorities and evidence are maintained in [docs/HOMEPROJECTWISE-COMPETITIVE-GROWTH-ROADMAP-2026-11-10.md](../docs/HOMEPROJECTWISE-COMPETITIVE-GROWTH-ROADMAP-2026-11-10.md). Follow its ranked sequence rather than starting unrelated articles/tools: (1) refresh GSC/Bing baseline and query-to-URL map; (2) improve existing near-page-one pages; (3) audit macerating-toilet costs and build quote-scope worksheet; (4) strengthen bathroom ventilation/moisture cluster; (5) complete Wallpaper UI/comparison/adapter; (6) validate tile quantity calculator; (7) connect calculator outputs to Budget Planner. All work remains subject to Value Before Publishing. No bulk image changes are authorized.


## 2026-11-10 — Search performance refresh

Google Search Console final 28-day data (2026-10-11 to 2026-11-07): 800 impressions, 4 clicks, 0.50% CTR, average position 17.13. The previous consecutive 28-day period (2026-09-13 to 2026-10-10) had 43 impressions and 0 clicks. This is growth from a very small baseline, not causal proof.

Current leading pages: smart-plug suitability (133 impressions, 2 clicks, position 6.21), macerating toilet (128, 0, 13.01), bathroom condensation (91, 0, 49.96), large wall art (88, 0, 6.33), leak-sensor placement (58, 0, 19.22), evening lighting (40, 0, 5.25), legacy kitchen redirect stub (39, 1, 12.79), and motion lighting (29, 1, 6.10). US contributed 428 impressions and 1 click; mobile 417 impressions and all 4 clicks; desktop 376 impressions and no clicks. Bing returned 0 impressions/clicks and empty query/page rows; sitemap status Success, 45 URLs, last crawled 2026-11-01.

Next: inspect indexing status for the high-impression URLs; improve existing near-page-one pages before creating overlapping articles; keep the generic tile calculator on hold until a distinct advantage over current competitors is proven.

Indexing follow-up from 2026-11-10: six high-impression articles inspected in GSC are all submitted and indexed with successful mobile fetches and matching canonicals. Crawl dates are stale (macerating 2026-10-06; condensation 2026-10-01; smart plug/large wall art/motion lighting 2026-10-22; leak sensors 2026-10-29). The legacy kitchen redirect stub remains indexed under its old canonical (last crawl 2026-10-01), while the destination is also indexed (2026-10-22). Preserve both and allow recrawl. Google sitemap pending, 0 errors/0 warnings, last submitted 2026-11-01; do not resubmit merely because it says pending.


## Editorial execution system — 2026-11-10

The single canonical, ordered article queue is `docs/ARTICLE-PRODUCTION-QUEUE.md`. All new article candidates must pass through it. The queue implements the Operating Charter and Value Before Publishing, uses GSC to identify topic clusters rather than repeatedly optimizing a single URL for a small number of clicks, and targets 2–3 high-value articles/day only when research and quality permit. ChatGPT researches and prepares complete briefs; Claude reviews and completes only READY FOR CLAUDE items in ordered batches, then handles implementation, QA, PR and verified deployment. No scattered parallel article requests.

The initial validation cluster is Smart Home. SH-001 is first; SH-002 must first be checked against the existing smart-lighting guide. All initial entries are candidates, not publication authorization. Word count is evidence-led with no quota; images are limited to 0–2 purposeful, high-quality assets, with no speculative replacements. See the queue for mandatory brief fields, 85/100 score threshold, workflow statuses and release rules.
## Owner strategy update — 2026-11-10: topic expansion and publishing cadence

This section supersedes any earlier roadmap language that makes optimizing existing near-page-one articles the default priority over new topic coverage.

1. **Expand topics, not single URLs.** Use GSC signals to discover which SUBJECT AREAS merit deeper coverage. A page with one or two clicks is a clue about a potentially promising topic, not a reason to keep revising that same page. For example, smart-home search traction should prompt research into related smart-home problems, devices, setup, compatibility, troubleshooting, safety and cost questions where genuine search intent exists.
2. **Target 2–3 high-value articles per day** when research and quality gates support that pace. Build a large library over time, comparable in breadth to strong competitors, while ensuring every page has a distinct purpose and practical solution. Do not force the quota when the evidence or quality is insufficient.
3. **Research each article before drafting:** primary and secondary keywords/query variants; search intent; current US search results; leading competitor coverage; what is missing or poorly explained; the concrete visitor problem; evidence-backed differentiation; internal overlap/cannibalization; sources; and a practical answer structure. Keep a traceable brief/query map.
4. **No word-count quota.** Use competitor scope as context, not a template. Article length is determined by the complexity of the problem and the amount of explanation needed for a complete, accurate solution. No padding to hit a target.
5. **Images are functional editorial assets.** Use one or two high-quality, accurate images or diagrams when they improve understanding, trust or decision-making. There is no minimum image count. Never add irrelevant imagery to meet a quota; never replace existing images without a verified reason.
6. **Balance expansion and maintenance.** Improve an existing page when a real factual, usefulness, UX or search-intent gap is demonstrated, and when the improvement supports the wider topic cluster. Do not let this work crowd out differentiated new coverage.
7. **Value Before Publishing remains non-negotiable.** The target is a large library of useful solutions, not mass-produced SEO pages. Every article needs distinct search intent, verified claims/sources, real practical value and a compelling reason to choose HomeProjectWise.

**Initial candidate cluster:** Smart Home. Current GSC signals (smart-plug suitability and motion lighting clicks/impressions) justify investigating the wider cluster. Validate individual subtopics with query data and US SERPs before assigning publication slots; do not infer demand from a single page's clicks alone.
