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

## 2026-11-05 entry (Claude, session 27; Search Console comparison day)

### Google Search Console, performance (web, data state all; final data ends 2026-11-02, firstIncompleteDate 2026-11-03)
- 2026-10-06 to 2026-11-02: 530 impressions, 2 clicks, CTR 0.377%, average position 19.30. Baseline logged 2026-11-03 for 2026-10-06 to 2026-10-31: 432 impressions, 1 click, CTR 0.231%, position 19.96.
- 2026-09-20 to 2026-11-02: 544 impressions, 2 clicks, CTR 0.368%, position 19.95 (2026-09-20 to 10-31 re-read as 446 / 1 / 0.224% / 20.74, same as 11-03).
- Last 7 final days 10-27 to 11-02: 238 impressions; previous 7 days 10-20 to 10-26: 169. Clicks: 1 on 10-23, 1 on 11-01. Provisional (incomplete) days: 11-03 73 impressions, 11-04 43.
- Pages, 2026-10-06 to 2026-11-05 (provisional tail; sums to 648 impressions, 2 clicks; not comparable with the 432 window above): macerating 128 (11.9), reduce-bathroom-condensation 86 (52.0), what-can-you-plug-into-a-smart-plug 72 (5.9), how-to-hang-large-wall-art 64 (6.0), where-to-put-water-leak-sensors 41 (23.8), small-bathroom-easier-to-clean 38 (9.2), stop-musty-bathroom-towels 37 (25.8), better-evening-home-lighting 34 (5.8), stop-kitchen-counter-clutter stub 33 (12.9, 1 click), motion-lighting 25 (6.2, 1 click), reduce-cable-clutter 24 (12.1), how-to-fix-damp-crawl-space-humidity 15 (73.3), smart-lighting 12 (18.6).
- Queries (69 rows, 137 impressions; anonymised queries hidden, never add to page totals): "why does my kitchen clutter keep coming back" 15 (8.7), "bad condensation in bathroom" 12 (89.6), "bathroom dampness" 6 (86.8), "condensation on bathroom walls" 5 (90.4), "where to place water leak sensors" 5 (71.6). Crawl-space and condensation queries sit at positions 60 to 100.
- Interpretation (not a verified cause): impressions grew modestly and position is flat; the pages that matter most for revenue (crawl space, condensation) are still far from page 1 and Google has not recrawled them.

### Google, indexing (URL Inspection on all 45 live sitemap URLs, 2026-11-05)
- Submitted and indexed 23; unknown to Google 21; crawled, currently not indexed 1 (choose-bathroom-exhaust-fan). Identical to 2026-11-01 and 2026-11-03; the unknown set is the same. reduce-bathroom-condensation still last crawled 2026-10-01. Sitemap: pending, last submitted 2026-11-01, 0 errors, 0 warnings.

### Bing Webmaster Tools
- Daily totals 2026-10-04 to 2026-11-02: 0 impressions, 0 clicks.

### Method note
- quality_gate.py --all on raw main: 28 PASS, only the redirect stub fails. After running rebuild_site_indexes.py first (deploy-style), 12 more articles exceed the 130-word intro limit because the rebuild adds breadcrumb and date text before the first H2. CI does not run it that way; nothing was changed because of this. Do not trim intros on the strength of a post-rebuild run.


## 2026-11-10 entry (ChatGPT — fresh 28-day performance and Bing refresh)

### Google Search Console, Search type Web, data_state final

- Current 28-day window: **2026-10-11 to 2026-11-07** — 800 impressions, 4 clicks, CTR 0.50%, average position 17.13.
- Previous consecutive 28-day window: **2026-09-13 to 2026-10-10** — 43 impressions, 0 clicks, CTR 0%, average position 38.33.
- Interpretation: impressions and clicks increased substantially from a very small early baseline. This does not establish which publication, page edit, indexing event or other change caused the increase. Do not claim causal attribution.
- Top pages by impressions in the current window (clicks; average position):
  - `what-can-you-plug-into-a-smart-plug`: 133 (2; 6.21).
  - `macerating-toilet-basement-bathroom`: 128 (0; 13.01).
  - `reduce-bathroom-condensation`: 91 (0; 49.96).
  - `how-to-hang-large-wall-art-without-damage`: 88 (0; 6.33).
  - `where-to-put-water-leak-sensors`: 58 (0; 19.22).
  - `stop-musty-bathroom-towels`: 49 (0; 26.35).
  - `better-evening-home-lighting-without-overcomplicating-it`: 40 (0; 5.25).
  - Legacy `stop-kitchen-counter-clutter` redirect stub: 39 (1; 12.79).
  - `small-bathroom-easier-to-clean`: 39 (0; 9.13).
  - `motion-lighting-that-actually-helps`: 29 (1; 6.10).
  - `reduce-cable-clutter`: 28 (0; 11.21).
  - `how-to-fix-damp-crawl-space-humidity`: 24 (0; 66.25).
- Query examples with page mapping:
  - `why does my kitchen clutter keep coming back`: 20 impressions, position 7.65, mapped to the legacy kitchen redirect stub.
  - `bad condensation in bathroom`: 12 impressions, position 91.08, mapped to `reduce-bathroom-condensation`.
  - `condensation on bathroom walls`: 9 impressions, position 87.11, same condensation guide.
  - `where to place water leak sensors`: 5 impressions, position 71.60, mapped to `where-to-put-water-leak-sensors`.
- Country breakdown (impressions; clicks): United States 428;1, United Kingdom 89;1, Canada 62;0, India 32;1, France 3;1. Other countries each contributed smaller totals. The US supplied 53.5% of impressions but only 1 of 4 clicks.
- Device breakdown: Mobile 417 impressions, 4 clicks, CTR 0.959%, average position 12.17; Desktop 376 impressions, 0 clicks, average position 22.88; Tablet 7 impressions, 0 clicks, average position 3.57.
- The query export returned 80 visible rows; anonymized queries may be omitted by Search Console. Do not sum query totals and page totals together.
- Important legacy URL note: the kitchen redirect stub still appears in Search Console and received 39 impressions and 1 click. Preserve the stub and its canonical/meta-refresh behavior while Google recrawls; do not remove it based on the current data.

### Bing Webmaster Tools

- Daily totals report returned 0 impressions and 0 clicks across the returned dates from 2026-10-04 through 2026-11-07.
- Top-query and top-page reports returned empty row sets. This is a returned zero/no-row report, not proof of indexing failure.
- Sitemap `https://home-project-wise.github.io/home-project-wise/sitemap.xml`: status Success, 45 URLs, last crawled 2026-11-01. The feed metadata returned file_size 0; do not infer a sitemap-content problem from that field alone because status was Success and URL count was 45.

### Scope and limitations

- No Google URL Inspection was run in this refresh. Do not update indexed/unknown/crawled-not-indexed counts from this entry.
- No sitemap was submitted or changed.
- Search data is performance evidence, not a direct quality score. Review the exact query/page pairs and live SERPs before editing titles, rewriting pages or approving new articles.

### Google URL Inspection and sitemap — 2026-11-10

Six high-priority article URLs were inspected. All six returned **Submitted and indexed**, `INDEXING_ALLOWED`, `SUCCESSFUL` page fetch, `ALLOWED` robots.txt, mobile crawl, and matching user/Google canonical URLs:

| URL | Last Google crawl |
|---|---|
| `what-can-you-plug-into-a-smart-plug` | 2026-10-22 |
| `macerating-toilet-basement-bathroom` | 2026-10-06 |
| `reduce-bathroom-condensation` | 2026-10-01 |
| `how-to-hang-large-wall-art-without-damage` | 2026-10-22 |
| `where-to-put-water-leak-sensors` | 2026-10-29 |
| `motion-lighting-that-actually-helps` | 2026-10-22 |

Additional legacy URL check:
- `stop-kitchen-counter-clutter` remains **Submitted and indexed** with Google canonical still pointing to the old stub URL; last crawl 2026-10-01.
- Destination `kitchen-counter-zone-that-stays-clear` is also **Submitted and indexed**, canonical matches itself; last crawl 2026-10-22.
- This confirms Google has not yet recrawled the legacy stub to observe its current meta-refresh/canonical behavior. Preserve both the stub and destination; do not delete or change the URL based on this lag.

Google sitemap `https://home-project-wise.github.io/home-project-wise/sitemap.xml`:
- `isPending=true`, errors 0, warnings 0, last submitted 2026-11-01 06:20:44 UTC.
- No sitemap submission was made. Pending with zero errors/warnings is recorded as returned, not treated as a failure.

Inspection caveats:
- Rich-results output reported Breadcrumbs PASS for these URLs; it is not a complete audit of every structured-data type.
- Mobile usability returned `VERDICT_UNSPECIFIED`; do not describe it as a pass or fail.
- Inspection results may lag live changes by several days.


## Historical 2026-11-07 checkpoint (preserved from the earlier operations handoff)

This snapshot is retained for audit history; its 28-day window overlaps the 2026-11-10 window and must not be treated as a consecutive-period comparison.

### Google Search Console, final data

- 2026-10-08 to 2026-11-04: **652 impressions, 2 clicks, CTR 0.307%, average position 18.17**.
- Previous equal window 2026-09-10 to 2026-10-07: **21 impressions, 0 clicks, average position 44.29**.
- 2026-11-01 to 2026-11-04: 227 impressions, 1 click, CTR 0.441%, average position 15.52.
- Top pages then: macerating-toilet-basement-bathroom 125 impressions (position 11.88); reduce-bathroom-condensation 84 (50.99); what-can-you-plug-into-a-smart-plug 77 (5.74); how-to-hang-large-wall-art-without-damage 67 (6.60); where-to-put-water-leak-sensors 42 (23.43).
- Query examples: "bad condensation in bathroom" 12 impressions (position 89.58); "bathroom dampness" 6 (86.83); "condensation on bathroom walls" 5 (90.4); "where to place water leak sensors" 5 (71.6); "why does my kitchen clutter keep coming back" 15 (8.67). Query totals are incomplete/anonymized and must not be added to page totals.
- Historical URL inspection at that time: homepage indexed (last crawl 2026-10-29); leak-sensor page indexed but not recrawled after its 2026-11-07 edit; homepage calculator and wallpaper guide were then unknown to Google. These statuses are historical and superseded where later inspections exist.
- Sitemap was pending with 0 errors and 0 warnings, last submitted 2026-11-01. Bing daily totals were 0 impressions/clicks through 2026-11-04; top queries/pages empty.
- No indexing setting, sitemap or URL submission was changed in that checkpoint.


## 2026-11-11 checkpoint — five-day performance report

### Google Search Console (Web, data_state=final)

Latest finalized date returned by the API: **2026-11-09** (2026-11-10 had not appeared yet; Search Console data is delayed). Therefore the comparable five-day windows are:

- Current: **2026-11-05 to 2026-11-09** — **280 impressions, 2 clicks, CTR 0.714%, average position 14.45**.
- Previous: **2026-10-31 to 2026-11-04** — **259 impressions, 1 click, CTR 0.386%, average position 16.01**.
- Change: **+21 impressions (+8.1%)**, **+1 click (+100%)**, CTR **+0.328 percentage points**, average position improved by **1.57 places** (lower is better).
- November baseline, **2026-11-01 to 2026-11-09**: **507 impressions, 3 clicks, CTR 0.592%, average position 14.93**.
- Daily totals for Nov 5–9: Nov 5 55/0 clicks; Nov 6 64/1; Nov 7 51/1; Nov 8 53/0; Nov 9 57/0 (impressions/clicks).

Top pages in the current five-day window (impressions; clicks; average position):
- `what-can-you-plug-into-a-smart-plug`: **87; 2; 6.85** (CTR 2.30%).
- `how-to-hang-large-wall-art-without-damage`: **32; 0; 5.66**.
- `macerating-toilet-basement-bathroom`: **28; 0; 14.64**.
- `where-to-put-water-leak-sensors`: **28; 0; 6.29**.
- `reduce-bathroom-condensation`: **20; 0; 51.30**.
- `how-to-fix-damp-crawl-space-humidity`: **18; 0; 55.67**.
- `stop-musty-bathroom-towels`: **15; 0; 25.20**.
- `better-evening-home-lighting-without-overcomplicating-it`: **14; 0; 2.86**.
- `reduce-cable-clutter`: **7; 0; 4.71**.

Visible query examples (query rows do not expose the two page-level clicks in this export; anonymized queries may be omitted):
- `why does my kitchen clutter keep coming back`: **9 impressions, position 3.00** (previous window: 6 impressions, position 6.50).
- `condensation on bathroom walls`: 5 impressions, position 83.00.
- `how to keep towels from smelling musty`: 4 impressions, position 65.75.
- `bad condensation in bathroom`: 3 impressions, position 89.00.
- `how to dry out a crawl space`: 3 impressions, position 94.33.

Country/device signals for Nov 5–9:
- United States: **137 impressions, 0 clicks**; United Kingdom: 42 impressions, 1 click; India: 11 impressions, 1 click.
- Mobile: **152 impressions, 2 clicks, position 9.64**; Desktop: 124 impressions, 0 clicks, position 20.59; Tablet: 4 impressions, 0 clicks, position 6.75.
- Search appearance returned only `TRANSLATED_RESULT` (4 impressions, 0 clicks). This API slice did not expose an AI Overview/AI Mode row and is not a substitute for the separate Search Generative AI performance report.

### GoatCounter / site traffic

Latest daily snapshot status **OK** (API user check passed), generated 2026-11-11 03:55 UTC:
- Window 2026-11-10 03:00 to 2026-11-11 03:55 UTC: **15 visitors, 15 pageviews**.
- Previous rolling snapshot: 8 visitors, 8 pageviews. The windows differ slightly in duration (24h55 vs 24h24), so this is directional only, not a strict equal-period comparison.
- Latest referrer list is empty; all 15 visits were geolocated to Tunisia. Top paths: homepage 4, Guides 3, Budget Planner 2, Wallpaper guide 2, flagship calculator 2, smart-device troubleshooting guide 1, Tools 1.
- This is a one-day rolling snapshot, not a five-day total. Do not attribute it to AI search; current referrer attribution is absent.

Metricool's Website connector returned zero for visits/pageviews/visitors and empty source/page/post rows. The Google Analytics toolkit has no active connection. Treat website analytics from those sources as **unavailable**, not as proof of zero visits. No reliable five-day GoatCounter history was retrieved.

### Pinterest (Metricool; connected profile: home organization ideas)

Pinterest has a complete five-day daily series for **2026-11-06 to 2026-11-10**; compare with **2026-11-01 to 2026-11-05**:
- Impressions: **17 vs 102** (**-85; -83.3%**).
- Interactions: **0 vs 6** (**-6; -100%**).
- Pin clicks: **0 vs 5** (**-5; -100%**).
- Outbound clicks: **0 vs 1** (**-1; -100%**).
- Saves: **0 vs 0** (no change).
- All 17 impressions occurred on Nov 6; Nov 7–10 returned zero for these metrics.
- Per-pin/post rows were empty, so top-performing pin titles and individual pin attribution are unavailable. Do not infer that no pins were published from the empty per-pin result.

### Interpretation and cautions

- Search visibility improved modestly across the two equal finalized five-day windows, but clicks remain very low and the US produced no clicks in the current window.
- Smart-plug content is the only page with page-level clicks in the current five-day export. Water-leak sensors and large-wall-art pages have useful positions but no clicks; inspect their query/snippet fit before editing.
- The kitchen-clutter query is visible at position 3 but maps to the legacy URL. Preserve the legacy redirect/canonical behavior while Google recrawls; do not remove the stub.
- Pinterest distribution weakened sharply in the latest five days and produced no outbound site clicks. Review cadence, creative relevance and pin-to-article matching before increasing volume.
- No new URL Inspection or sitemap submission was performed in this checkpoint. The Nov 10 inspection/sitemap state remains historical: six priority URLs indexed with successful mobile fetches; sitemap pending with zero errors/warnings.

## 2026-11-11 — PR #285 evidence consolidated on main

### Google Search Console — Web, final data
- Current complete 28-day window: **2026-10-14 to 2026-11-10** — **831 impressions, 4 clicks, CTR 0.481%, average position 16.86**.
- Previous immediately preceding 28-day window: **2026-09-16 to 2026-10-13** — **65 impressions, 0 clicks, CTR 0%, average position 32.48**.
- Equal-window change: **+766 impressions (+1,178.5%)**, **+4 clicks** (relative percentage undefined because the previous value was zero), CTR **+0.481 percentage points**, average position improved by **15.62 places**.
- The query export returned 81 visible rows and the page export 21 rows. Query rows exposed no clicks although page aggregation reports four; anonymized queries may be omitted. Do not assign page-level clicks to guessed queries or add query and page totals.
- Pages with page-level clicks: `what-can-you-plug-into-a-smart-plug` 146 impressions / 2 clicks / position 6.29; `motion-lighting-that-actually-helps` 30 / 1 / 6.17; legacy `stop-kitchen-counter-clutter` 39 / 1 / 12.92. Destination `kitchen-counter-zone-that-stays-clear` had 7 impressions and no clicks. Preserve the legacy URL and its redirect/canonical behavior while Google recrawls.
- Other leading pages: macerating toilet 121 impressions (position 13.34); large wall art 92 (6.41); bathroom condensation 91 (48.31); leak sensors 63 (17.92); musty towels 49 (26.31); evening lighting 46 (5.11); cable clutter 29 (10.86); crawl-space humidity 29 (65.52).
- Visible query examples: `why does my kitchen clutter keep coming back` 22 impressions (position 7.05); `bad condensation in bathroom` 10 (91.7); `condensation on bathroom walls` 10 (86.7); `how to keep towels from smelling musty` 8 (64.38); `cable clutter meaning` 7 (7.86). These are visible rows, not the complete query set.
- Filtered queries containing `energy` and `air leak` returned no visible rows. This does not prove market demand is zero.
- Bing Webmaster Tools `top_queries` returned an empty row set; do not infer indexing failure from that alone.

### Candidate research transferred from PR #285 — not production approval
- **#41 Home Energy Audit Without Special Equipment:** RESEARCHING only. Preliminary differentiation hypothesis: homeowner-safe, no-special-equipment walkthrough that distinguishes air leakage from insulation/HVAC/moisture clues and clearly separates safe visual checks from professional diagnostics. Do not claim a certified/quantified audit, promise bill savings, disturb insulation, enter unsafe attics, handle electrical/gas equipment, block combustion air or perform unsafe smoke/depressurization tests. Whole-home air-leak candidate #43 should be a section/pathway of #41 unless evidence proves distinct intent. Full top-10 US SERP, 3–5 deep competitor reviews, query evidence and scorecard remain outstanding.
- **#87 Contractor Quote Comparison:** DEFER. Generic quote comparison is crowded. Reopen only with a genuinely differentiated privacy-first worksheet that normalizes scope, materials, allowances, exclusions, permits, cleanup, schedule, payment milestones, change orders and warranty; do not rank contractors or treat missing costs as zero.
- This research is evidence for candidate triage only, not authorization to draft, publish or add either candidate to the qualified production queue.

### Pinterest / GoatCounter source note
- The 6–10 Nov Pinterest comparison and the 10–11 Nov GoatCounter rolling snapshot are already recorded in the 5-day checkpoint above. They are not part of the 28-day GSC window and must not be combined with it.
