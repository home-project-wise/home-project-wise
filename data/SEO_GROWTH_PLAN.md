# HomeProjectWise — SEO and Audience Growth Plan

Created 2026-10-29 by Claude from the owner's Search Console screenshot. Owner priority: quality first; we want grateful visitors, not just satisfied ones; revenue comes only after real, repeat traffic. No shortcuts that risk a penalty.

## 1. Baseline (Search Console, Performance, Web, last 3 months, screenshot of 2026-10-29)
- 1 click, 329 impressions, average CTR 0.3%, average position 21.8, 44 distinct queries. The site was created on 2026-09-23, so this is the first month of data.
- Impressions climbed from about 0 in late September to about 30 per day around 22-24 Oct, then about 15 on 26 Oct. The only click was around 23 Oct.
- Top queries (impressions): bad condensation in bathroom 11; why does my kitchen clutter keep coming back 8; cable clutter meaning 4; bathroom dampness 4; how to reduce condensation in bathroom 3; condensation on bathroom walls 3; evening lighting 2; basement toilet 2; how to keep moisture out of bathroom 2; how to stop condensation in bathroom 2.
- Reading: position 21.8 is roughly page 2 to 3, so almost nobody sees us yet; with 1 click, CTR is noise and must not drive decisions. The one clear signal is the bathroom moisture cluster (6 of the top 10 queries). Clutter queries also appear even though Storage is outside the core identity: do not delete those pages, improve them where cheap.
- Not known yet: which page each query hits, devices, countries, indexing status. See owner actions.
- Analytics gap: data/traffic/latest.json reports UNAVAILABLE (GoatCounter API 404). Fix or replace this so we can measure engagement, not only search.

## 2. Principles
1. Rank first, then CTR: at position 20+ better titles barely matter; depth, intent match and internal links move rankings.
2. One page per search intent; avoid two of our pages competing for the same query.
3. Answer the exact question in the first 100 words, then give the checklist, the diagram and the next decision.
4. Grateful means the reader solved the problem and found the next step: a quick answer, a checklist or tool, a "what if this did not work" section, and honest limits.
5. No bought links, link networks, comment spam, mass AI pages or keyword stuffing. No claim without a source.

## 3. Plan
### Phase 1 (days 1-7): win where Google already shows us
- Condensation cluster: reduce-bathroom-condensation (primary), choose-bathroom-exhaust-fan, small-bathroom-easier-to-clean, stop-musty-bathroom-towels, macerating-toilet-basement-bathroom, where-to-put-water-leak-sensors. Map each query above to exactly one page. Rewrite title, meta description, intro and one H2 per page to match the real question wording (bad condensation, bathroom dampness, condensation on walls, keep moisture out). Add a short "condensation, damp or leak?" decision block with a link to the leak sensor guide (inbound link still missing).
- Clutter queries: find the page that best answers "why does my kitchen clutter keep coming back" and make its first paragraph answer it directly. "cable clutter meaning" is a definition query: add a two-sentence definition only if an article covers cables; otherwise skip.
- Link audit: no orphan pages; every guide gets at least 2 descriptive inbound links from related guides.
- Indexing hygiene: confirm sitemap is read, list URLs that are not indexed and why, confirm IndexNow submits new URLs.

### Phase 2 (weeks 2-4): topical depth
- Grow the bathroom moisture cluster to 7-8 genuinely useful guides, chosen from real queries (check Search Console query list weekly), for example mould versus mildew cleaning and when to call a pro, and how to tell if a bathroom fan moves enough air. Every new guide needs a real problem, a diagram, sources and links to the cluster.
- Weekly routine: export queries, pick the ones with position 8-30 and 10+ impressions, improve the matching page first ("striking distance").
- Buying-decision pages (comparisons before purchase) after the cluster is solid, because they fit the Awin guides. Keep disclosures clear.

### Phase 3 (month 2+): earn attention honestly
- Linkable assets: the calculators and checkers (rug size, crawl space dehumidifier, smart plug load, home check-up). Make each one clearly useful and shareable; mention them where readers ask.
- Pinterest: the original SVG diagrams and checklists suit DIY boards. data/pinterest_published.json is empty, so find out whether publishing ever ran before relying on it.
- Genuine helpfulness in communities (answer a question fully, link only when it truly helps, disclose affiliation). No spam, no mass posting.

## 4. What counts as success (aspirational targets, not predictions)
- Weekly: impressions, distinct queries, clicks, average position of the bathroom cluster.
- By end of November: more than 100 distinct queries; at least 5 queries in the top 10; first queries with 50+ impressions so CTR becomes readable.
- Quality signals once analytics works: returning visitors, time on article, use of tools and checklists, messages from readers.
- Revenue is not a goal for this phase; it follows traffic. Do not add ads or push affiliate links ahead of reader value.

## 5. Owner actions (small)
- Search Console, Performance, Pages tab, then Queries inside the top page: one screenshot each.
- Search Console, Sitemaps: confirm the sitemap shows Success.
- Search Console, Pages (indexing): screenshot of the reasons list.
- GoatCounter: check the dashboard code and whether the site shows visits.

## 6. Data added 2026-10-29 evening (owner screenshots)
- Performance by page (3 months, impressions / clicks): macerating-toilet-basement-bathroom 100 / 0; reduce-bathroom-condensation 75 / 0; stop-musty-bathroom-towels 28; how-to-hang-large-wall-art-without-damage 27; stop-kitchen-counter-clutter 20 / 1 (the only click); small-bathroom-easier-to-clean 14; smart-lighting 14; reduce-cable-clutter 12; motion-lighting 10; better-evening-home-lighting 7. 16 pages have impressions.
- Priority change: the macerating toilet guide is the most visible page and a commercial one (Awin link inside, never edit the link). Look at its real queries first (owner screenshot: Performance > page filter > Queries), then deepen it for the reader. Second the condensation cluster. Third the clutter page that earned the click: see which query it was.
- Indexed pages report (last updated 23 Oct): 16 indexed, up from 7 on about 22 Oct. The sitemap lists 44 URLs. The reasons for non-indexed pages are still unknown (owner screenshot of the Pages > Why pages aren't indexed list).
- Sitemaps report: «Unable to retrieve sitemap», submitted 15 Oct, shown as /sitemap.xml. Checked live: https://home-project-wise.github.io/sitemap.xml returns 404 (a project site has no root file), while https://home-project-wise.github.io/home-project-wise/sitemap.xml returns 200, valid XML, 44 URLs, all 200, all inside the property prefix. Likely cause: the entry was submitted at the domain root. Fix: remove it and submit `sitemap.xml` in the field that already shows the /home-project-wise/ prefix. Confirm Success afterwards. Note that robots.txt is only read at the domain root, so the one under /home-project-wise/ is not used by crawlers (harmless, Allow: /).
- GoatCounter dashboard (28 Sep to 28 Oct): 174 visits, 97% from Tunisia (the owner), only 6 visits from the US, Brazil and Ecuador; 93% Android, 98% phones; referrers: unknown 39, pinterest 3, Google 2, chatgpt.com 1. This is mostly our own testing, not an audience. Own visits must be excluded before any engagement reading. The dashboard works, so the 404 in data/traffic/latest.json is a wrong site code or API token in the check, not a dead counter.
