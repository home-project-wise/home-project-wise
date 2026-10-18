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
