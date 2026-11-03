# Search metrics log (Google Search Console and Bing Webmaster Tools)

Both tools are connected to the project through Composio (Google Search Console: property `https://home-project-wise.github.io/home-project-wise/`, owner permission; Bing Webmaster Tools: same site, verified). Claude pulls the numbers and records them here so ChatGPT can read them without access. Append a dated entry; never overwrite earlier ones. Figures are copied from the tools; interpretation is marked as such.

## 2026-11-01 snapshot

### Google Search Console, performance (web, 2026-09-20 to 2026-10-31; last days may be incomplete)
- Total: 414 impressions, 1 click, CTR 0.24%, average position 20.8, 50 distinct queries.
- Daily impressions: 0 until 2026-09-30, 3 on 10-01, about 12 around 10-20, about 32 from 10-23 to 10-26, 23 to 33 from 10-27 to 10-30. The only click was on 10-23.
- Devices: mobile 204 impressions (1 click, position 12.8); desktop 210 (0 clicks, position 28.6).
- Countries by impressions: United Kingdom 43, Canada 23, Germany 8, Australia 7, Brazil 5.
- Pages by impressions (position): macerating-toilet-basement-bathroom 104 (11.4); reduce-bathroom-condensation 85 (53.7); how-to-hang-large-wall-art-without-damage 40 (5.4); stop-musty-bathroom-towels 31 (24.8); stop-kitchen-counter-clutter 22 (7.9, now a redirect stub); motion-lighting 18 (6.1); better-evening-home-lighting 17 (6.6); small-bathroom-easier-to-clean 17 (10.8); reduce-cable-clutter 16 (11.9); smart-lighting 15 (16.5); what-can-you-plug-into-a-smart-plug 13 (7.1); where-to-put-water-leak-sensors 12 (36.7).
- Queries: the condensation guide shows the most query variety (about 17 variants such as "bad condensation in bathroom", 12 impressions) at positions 62 to 100 for its core queries. The macerating guide's page average is 11.4, with single queries between 23 and 67. "evening lighting" appears at position 2 with 2 impressions.
- Interpretation (not a verified cause): the page with the broadest demand is far from page 1 for its core queries. Do not rewrite it blindly: see "Recrawl lag" below.

### Google, indexing (URL Inspection on the 45 sitemap URLs, 2026-11-01)
- Submitted and indexed: 23. Unknown to Google: 21. Crawled, currently not indexed: 1 (choose-bathroom-exhaust-fan).
- The sitemap was submitted on 2026-10-29 and showed as pending, with 0 errors and 0 warnings. It was resubmitted on 2026-11-01 after the redirect stub was removed from it.
- Recrawl lag (important): Google's last crawl of several key pages predates our edits. reduce-bathroom-condensation was last crawled on 2026-10-01, calm-room 10-01, smart-lighting 10-04, stop-musty-bathroom-towels 10-04, macerating-toilet-basement-bathroom 10-06; most others 10-22 or 10-29. The guides published or rewritten after about 10-22 are unknown to Google, including the crawl-space dehumidifier guide (the one with an affiliate link). So the 2026-11-05 comparison mostly measures pages as Google saw them in early October. Inspection data can lag by days, and "unknown to Google" means not yet seen, not rejected.

| Path | Google coverage state | Last Google crawl |
|---|---|---|
| /about.html | URL is unknown to Google | - |
| /articles/bathroom-exhaust-fan-dripping-water.html | URL is unknown to Google | - |
| /articles/choose-bathroom-exhaust-fan.html | Crawled - currently not indexed | - |
| /articles/choose-paint-finish-for-each-room.html | URL is unknown to Google | - |
| /articles/fix-wobbly-furniture.html | URL is unknown to Google | - |
| /articles/make-small-living-room-feel-bigger.html | URL is unknown to Google | - |
| /articles/quiet-entryway-storage.html | URL is unknown to Google | - |
| /articles/right-rug-size-painters-tape-test.html | URL is unknown to Google | - |
| /articles/smart-home-privacy-check.html | URL is unknown to Google | - |
| /articles/smart-home-wifi-outage-test.html | URL is unknown to Google | - |
| /articles/smart-thermostat-without-c-wire.html | URL is unknown to Google | - |
| /articles/stop-a-drafty-door-without-replacing-it.html | URL is unknown to Google | - |
| /articles/what-size-dehumidifier-crawl-space.html | URL is unknown to Google | - |
| /budget-planner.html | URL is unknown to Google | - |
| /contact.html | URL is unknown to Google | - |
| /crawl-space-dehumidifier-calculator.html | URL is unknown to Google | - |
| /editorial-policy.html | URL is unknown to Google | - |
| /home-checkup.html | URL is unknown to Google | - |
| /privacy.html | URL is unknown to Google | - |
| /rug-size-calculator.html | URL is unknown to Google | - |
| /smart-plug-load-check.html | URL is unknown to Google | - |
| /terms.html | URL is unknown to Google | - |
| / | Submitted and indexed | 2026-10-29 |
| /articles/better-evening-home-lighting-without-overcomplicating-it.html | Submitted and indexed | 2026-10-22 |
| /articles/calm-room.html | Submitted and indexed | 2026-10-01 |
| /articles/how-to-fix-damp-crawl-space-humidity.html | Submitted and indexed | 2026-10-29 |
| /articles/how-to-hang-large-wall-art-without-damage.html | Submitted and indexed | 2026-10-22 |
| /articles/kitchen-counter-zone-that-stays-clear.html | Submitted and indexed | 2026-10-22 |
| /articles/macerating-toilet-basement-bathroom.html | Submitted and indexed | 2026-10-06 |
| /articles/motion-lighting-that-actually-helps.html | Submitted and indexed | 2026-10-22 |
| /articles/reduce-bathroom-condensation.html | Submitted and indexed | 2026-10-01 |
| /articles/reduce-cable-clutter.html | Submitted and indexed | 2026-10-22 |
| /articles/simple-home-reset-that-prevents-weekend-chaos.html | Submitted and indexed | 2026-10-22 |
| /articles/small-bathroom-easier-to-clean.html | Submitted and indexed | 2026-10-22 |
| /articles/smart-lighting.html | Submitted and indexed | 2026-10-04 |
| /articles/stop-mail-and-paper-pile.html | Submitted and indexed | 2026-10-22 |
| /articles/stop-musty-bathroom-towels.html | Submitted and indexed | 2026-10-04 |
| /articles/what-can-you-plug-into-a-smart-plug.html | Submitted and indexed | 2026-10-22 |
| /articles/where-to-put-water-leak-sensors.html | Submitted and indexed | 2026-10-29 |
| /guides.html | Submitted and indexed | 2026-10-29 |
| /home-design.html | Submitted and indexed | 2026-10-29 |
| /smart-home.html | Submitted and indexed | 2026-10-29 |
| /storage.html | Submitted and indexed | 2026-10-29 |
| /tools.html | Submitted and indexed | 2026-10-29 |
| /weekend-projects.html | Submitted and indexed | 2026-10-29 |

### Bing Webmaster Tools
- Performance: 0 impressions and 0 clicks in the daily totals (from 2026-10-04); no top queries or pages; no crawl issues reported.
- The sitemap was last crawled on 2026-10-18 when it listed 34 URLs; it now lists 45.
- Actions taken 2026-11-01 (non-recallable): the sitemap was resubmitted; all 45 URLs were submitted through the URL-submission API (daily quota 100, 55 left that day; monthly 3000).

### Actions taken on 2026-11-01
Google sitemap resubmitted; Bing sitemap resubmitted; 45 URLs submitted to Bing. Google offers no public API to request indexing of ordinary pages, so recrawl waits on Google.

## 2026-11-03 entry (Claude; reconciles ChatGPT's retrieval of the same day)

### Google Search Console, performance (web, data state final, retrieved 2026-11-03 via Composio)
- 2026-10-06 to 2026-10-31: 432 impressions, 1 click, CTR 0.231%, average position 19.96. Same figures as ChatGPT's retrieval. Asking for 2026-10-06 to 2026-11-01 returns the same 432, so final data stops at 2026-10-31.
- 2026-09-20 to 2026-10-31: 446 impressions, 1 click, CTR 0.224%, average position 20.74. The 2026-11-01 snapshot above logged 414 impressions, CTR 0.24%, position 20.8 for the same dates. Both retrievals are kept; the 414 is not overwritten. Cause of the +32 is not verified (interpretation: Search Console can revise recent days after a first read, so the earlier figure was probably incomplete).
- Dimensions are not additive: the page table (19 rows) sums to the 432 total; the query table (49 rows) sums to only 87 impressions because anonymised queries are hidden. Never add pages and queries together.
- Pages by impressions (position), 2026-10-06 to 2026-10-31: macerating-toilet-basement-bathroom 109 (11.3); how-to-hang-large-wall-art-without-damage 44 (5.6); stop-kitchen-counter-clutter 23 (10.0, the only click, now a redirect stub); better-evening-home-lighting 19 (6.5); calm-room 6 (9.7); kitchen-counter-zone-that-stays-clear 3 (9.0); home page 3 (5.0); how-to-fix-damp-crawl-space-humidity 1 (61).
- Daily impressions, data state all (provisional), 2026-10-25 to 2026-11-02: 32, 32, 23, 25, 27, 33, 32, 53, 29. The provisional 2026-11-01 row shows 1 click; it is not part of the final data above and must be re-read after finalisation.

### Google, indexing (URL Inspection on all 45 sitemap URLs, 2026-11-03)
- Submitted and indexed: 23. Unknown to Google: 21. Crawled, currently not indexed: 1 (choose-bathroom-exhaust-fan, last crawled 2026-10-29). Counts are identical to 2026-11-01; the 21 unknown URLs are the same set. reduce-bathroom-condensation is still recorded as last crawled on 2026-10-01.

### Legacy kitchen URL, read-only check (2026-11-03)
- Live stop-kitchen-counter-clutter.html answers HTTP 200 (GitHub Pages cannot send a 301) with a canonical and a 0-second meta refresh to kitchen-counter-zone-that-stays-clear, plus a visible link. No page in the repository links to the stub, and the live sitemap, guides page, feed and home page do not list it.
- The destination answers 200, has a self-canonical and is linked from 5 articles (stop-mail-and-paper-pile, small-bathroom-easier-to-clean, simple-home-reset, reduce-cable-clutter, calm-room).
- Google's last crawl of the stub URL is 2026-10-01 and Google still holds the stub URL as its own canonical (the pre-redirect page); the destination was crawled 2026-10-22. So Google has not yet seen the redirect: recrawl lag, not a defect. No change made.

## Routine
Each Claude session: pull totals and the page and query tables for the last 28 days; re-inspect the URLs still unknown; append an entry here. Do not report a metric as zero when the tool returned no data.
