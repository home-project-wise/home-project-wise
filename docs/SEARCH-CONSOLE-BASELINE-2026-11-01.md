# HomeProjectWise — Search Console baseline

**Snapshot retrieved:** 2026-11-01 (UTC)  
**Search property:** `https://home-project-wise.github.io/home-project-wise/`  
**Permission:** siteOwner  
**Search type:** Web  
**Measurement window:** 2026-10-22 through 2026-10-28 (latest complete seven-day window used for this snapshot)  
**Purpose:** Preserve an evidence-based starting point for the five-day measurement cycle. This is a read-only snapshot; no page, Search Console setting, sitemap, or crawler policy was changed.

## 1. Property and sitemap

- The connected Search Console account lists the exact URL-prefix property above with `siteOwner` permission.
- Submitted sitemap: `https://home-project-wise.github.io/home-project-wise/sitemap.xml`
- Last submitted: `2026-11-01T06:20:44.740Z`
- Current response: `isPending=true`, `errors=0`, `warnings=0`.
- The list-sitemaps response did not return submitted/indexed URL counts. Do not infer them. Recheck after processing completes.

## 2. Google Web Search — property totals

| Metric | 2026-10-22 to 2026-10-28 |
|---|---:|
| Clicks | 1 |
| Impressions | 192 |
| CTR | 0.52% |
| Impression-weighted average position | 15.14 |

Daily impressions: 22 Oct 14; 23 Oct 34; 24 Oct 32; 25 Oct 32; 26 Oct 32; 27 Oct 23; 28 Oct 25. The only click in this window was recorded on 23 October.

These are ordinary Web Search API metrics, not Google generative-AI report metrics. Search Console data can lag by 2–3 days; do not compare this period with incomplete recent days.

## 3. Pages receiving the most impressions

| Page | Impressions | Clicks | CTR | Avg. position |
|---|---:|---:|---:|---:|
| Macerating toilet / basement bathroom | 40 | 0 | 0% | 10.18 |
| Large wall art without damage | 32 | 0 | 0% | 5.47 |
| Reduce bathroom condensation | 29 | 0 | 0% | 44.90 |
| Small bathroom easier to clean | 16 | 0 | 0% | 11.31 |
| Reduce cable clutter | 14 | 0 | 0% | 12.36 |
| Stop musty bathroom towels | 13 | 0 | 0% | 23.54 |
| Motion lighting that helps | 11 | 0 | 0% | 6.00 |
| Better evening home lighting | 9 | 0 | 0% | 6.56 |
| What can you plug into a smart plug | 9 | 0 | 0% | 7.78 |
| Legacy kitchen-counter URL (see section 5) | 7 | 1 | 14.29% | 7.14 |

The remaining reported pages had fewer impressions. Page averages are impression-weighted and depend on the query mix; they are not fixed rankings.

## 4. Query observations (not a keyword-volume study)

Observed queries included:

- `cable clutter meaning`: 4 impressions, average position 7.5.
- `why does my kitchen clutter keep coming back`: 3 impressions, average position 10.33.
- `evening lighting`: 2 impressions, average position 2.
- Bathroom-condensation variants such as `condensation in bathroom`, `condensation on bathroom walls`, and `how to dehumidify a bathroom` appeared at very weak average positions (roughly 80–98 in the returned rows).
- `whats a macerating toilet`: 1 impression, average position 79.

The sample is small. Do not treat one-to-four impressions as proven demand or build new pages from these phrases. Use them as diagnostic clues and compare with a longer window and page-level query mapping before changing content.

## 5. Kitchen-counter legacy URL — canonical discrepancy to monitor

The page-performance response returned:

`/articles/stop-kitchen-counter-clutter.html`: 7 impressions, 1 click, average position 7.14.

Repository inspection on `main` shows this path is a small legacy transition page with a canonical link and meta refresh pointing to:

`/articles/kitchen-counter-zone-that-stays-clear.html`

The canonical destination is included in the sitemap; the legacy path is not.

URL Inspection results retrieved on 2026-11-01:

- Legacy URL: verdict `PASS`, `Submitted and indexed`, but Google canonical and user canonical both still reported the legacy URL; last crawl `2026-10-01T12:57:13Z`.
- Canonical destination: verdict `PASS`, `Submitted and indexed`; Google canonical and user canonical both match the destination; last crawl `2026-10-22T19:33:31Z`.

This may reflect stale inspection data for the legacy URL. Do not create another kitchen-counter page or alter the existing content based on this snapshot. Recheck the legacy URL after Google recrawls; if the discrepancy persists, propose a technically appropriate consolidation path for owner review. No redirect or content change is authorized by this report.

## 6. Three priority URL inspections

All three returned `PASS`, `Submitted and indexed`, mobile crawl, successful fetch, indexing allowed, robots allowed, and matching user/Google canonical URLs. Breadcrumbs rich results were detected with `PASS`.

| URL | Last crawl (UTC) | Search evidence |
|---|---|---|
| `articles/reduce-bathroom-condensation.html` | 2026-10-01 12:52 | 29 impressions; avg. position 44.90 |
| `articles/macerating-toilet-basement-bathroom.html` | 2026-10-06 10:52 | 40 impressions; avg. position 10.18 |
| `articles/how-to-hang-large-wall-art-without-damage.html` | 2026-10-22 19:33 | 32 impressions; avg. position 5.47 |

These inspections establish indexing and fetch status, not content quality or a guarantee of continued ranking.

## 7. Required follow-up

1. Recheck sitemap processing status; record indexed/submitted counts only when Search Console returns them.
2. In the Search Console UI, manually inspect **Settings → Search generative AI** for this exact property. Record Include/Exclude/Inherit and the effective parent if inherited. Do not change the setting without owner approval.
3. Open the dedicated **Generative AI performance** report if it is available. Record its actual dates, pages, impressions and dimensions separately. The Search Analytics API data above does not substitute for this report.
4. Keep the fixed 40-question AI answer-engine benchmark separate from Search Console metrics.
5. At the 2026-11-05 checkpoint, compare equivalent complete date windows. Do not attribute changes to an edit unless the change and its timing are documented.

## 8. Change-control note

This file records observed data only. It does not authorize changes to editorial content, page titles, canonical tags, robots.txt, sitemap URLs, crawler access, analytics configuration, Search Console settings, outreach, or production deployment. Apply the Value Before Publishing law and existing editorial freeze.


### Five-day comparison reference for the 2026-11-05 checkpoint

To preserve the user's five-day cadence, use this non-overlapping five-day reference window from the daily rows above:

| Metric | 2026-10-24 to 2026-10-28 |
|---|---:|
| Clicks | 0 |
| Impressions | 144 |
| CTR | 0.00% |
| Impression-weighted average position | 13.87 |

At the 2026-11-05 checkpoint, compare this with **2026-10-29 through 2026-11-02** if those dates are available as final data. If 2026-11-02 is still preliminary or absent, wait for final data or explicitly report the shorter complete window; do not silently compare unequal windows. This is a Web Search baseline only and remains separate from the Generative AI performance report.


## 9. CAO benchmark target URL discovery check

A cross-check of the four intended article URLs below found that the HTML files exist on `main`, but none is listed in the current `website/sitemap.xml`. Google URL Inspection returned `URL is unknown to Google` with a neutral verdict for all four on 2026-11-01.

| Benchmark topic | Existing URL | In sitemap? | GSC URL Inspection | Known internal link found |
|---|---|---|---|---|
| Bathroom exhaust fan dripping water (BF-02) | `articles/bathroom-exhaust-fan-dripping-water.html` | No | URL is unknown to Google | Linked from `articles/choose-bathroom-exhaust-fan.html` |
| Smart thermostat without C wire (SH-05) | `articles/smart-thermostat-without-c-wire.html` | No | URL is unknown to Google | Linked from `articles/smart-home-wifi-outage-test.html` |
| Smart-home privacy checklist (SR-02/SR-05) | `articles/smart-home-privacy-check.html` | No | URL is unknown to Google | Linked from `articles/smart-lighting.html` |
| Paint finish by room (PT-03) | `articles/choose-paint-finish-for-each-room.html` | No | URL is unknown to Google | No link found from `guides.html`; broader inbound-link audit still needed |

These pages are included as intended destinations in the 40-question benchmark, but their current Google discoverability is not established. This does **not** prove that they are unpublished or blocked; the inspection API says Google does not currently know the URLs. Three have at least one confirmed contextual inbound link from a related guide. The paint-finish page needs a wider inbound-link check.

**Next safe action:** at the next technical review, verify the live HTTP response, canonical, robots directives, and internal-link paths for these URLs, then propose sitemap inclusion only for pages that are genuinely ready, canonical, useful, and intended for indexing. Do not add them automatically or request indexing solely to inflate coverage. No sitemap or content changes were made in this snapshot.
