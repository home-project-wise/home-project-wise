# HomeProjectWise — Search Console intent map and opportunity brief

**Prepared:** 2026-11-03  
**Data source:** connected Google Search Console property `https://home-project-wise.github.io/home-project-wise/`  
**Search type:** Web; data state: final  
**Query/page window:** 2026-10-06 through 2026-10-31 (26 calendar days)  
**Purpose:** evidence-led prioritisation for the 2026-11-05 comparison. This is an internal analysis, not a publishing or merge authorization.

## 1. Fresh measurement read and reconciliation

A fresh Search Console read on 2026-11-03 returned:

| Report | Date range | Clicks | Impressions | CTR | Avg position |
|---|---|---:|---:|---:|---:|
| Property total | 2026-10-06–2026-10-31 | 1 | 432 | 0.231% | 19.96 |
| Property total | 2026-09-20–2026-10-31 | 1 | 446 | 0.224% | 20.74 |

The 42-day result is a new retrieval of the same date range as the 2026-11-01 snapshot in `data/SEARCH_METRICS.md`, which previously recorded 414 impressions, 1 click, 0.24% CTR and position 20.8. The current API read returns 446 impressions for that range. Treat this as a revised/retrieved value and preserve both dated observations; do not silently overwrite the earlier snapshot or infer growth between them.

For the 26-day query/page window:
- The query dimension returned **49 visible query rows** and **87 impressions**. This is only about 20.1% of the 432 property impressions; query anonymisation and reporting thresholds mean the visible query list is incomplete.
- The page dimension returned 19 URLs and 435 page-impressions when rows are summed. Do not add page totals to property totals or interpret the small difference as extra site impressions; dimensions are separate views.
- The query-page report returned 49 rows. The visible rows below each associate with one URL in this report, but hidden/anonymised query traffic is not represented.
- The property total contains one click. Query-level rows expose no click; the page report attributes one click to the legacy kitchen-counter URL (23 impressions, 4.35% CTR, position 9.96). **Do not claim a specific query generated that click** because the query report does not expose it.

The query/page window is a useful intent sample, not a full demand estimate. No search volumes, keyword difficulty, or external traffic estimates are asserted.

## 2. Priority page signals

Page-level figures for 2026-10-06–2026-10-31:

| Existing URL / page | Impressions | Clicks | Avg position | Intent / decision |
|---|---:|---:|---:|---|
| `macerating-toilet-basement-bathroom` | 109 | 0 | 11.28 | Choose a basement toilet system without breaking concrete |
| `reduce-bathroom-condensation` | 78 | 0 | 52.01 | Diagnose and reduce bathroom condensation/moisture |
| `how-to-hang-large-wall-art-without-damage` | 44 | 0 | 5.64 | Hang large wall art safely |
| `stop-musty-bathroom-towels` | 31 | 0 | 24.81 | Stop towels smelling or staying damp |
| `where-to-put-water-leak-sensors` | 20 | 0 | 38.20 | Decide where to place leak sensors |
| `better-evening-home-lighting-without-overcomplicating-it` | 19 | 0 | 6.53 | Improve evening home lighting |
| `motion-lighting-that-actually-helps` | 19 | 0 | 6.21 | Motion lighting for practical safety/use |
| `reduce-cable-clutter` | 18 | 0 | 11.39 | Understand and reduce cable clutter |
| `small-bathroom-easier-to-clean` | 17 | 0 | 10.82 | Make a small bathroom easier to clean |
| `what-can-you-plug-into-a-smart-plug` | 19 | 0 | 7.05 | Check smart-plug suitability |
| `smart-lighting` | 12 | 0 | 18.58 | Smart-lighting decisions |
| `stop-kitchen-counter-clutter` (legacy redirect URL) | 23 | 1 | 9.96 | Why kitchen counter clutter returns |
| `kitchen-counter-zone-that-stays-clear` | 3 | 0 | 9.00 | Current kitchen-counter organisation guide |

The calculator page in #229 is not in this report because it is not yet deployed/indexed in the measured period. Do not treat the new tool as having search demand or ranking evidence yet.

## 3. Intent map and one-primary-page rule

### A. Bathroom condensation and moisture — highest visible query variety, weak ranking

**Primary URL:** `articles/reduce-bathroom-condensation.html`  
**Visible query evidence:** 17 variants, 36 impressions; weighted average position across these visible rows is approximately 86.3. The page-level average is 52.01 because it includes other query and reporting behaviour. These figures are not contradictory measures of the same sample.

| Query | Impressions | Avg position |
|---|---:|---:|
| bad condensation in bathroom | 12 | 89.58 |
| bathroom dampness | 4 | 84 |
| bathroom vent condensation | 1 | 39 |
| condensation in bathroom | 1 | 90 |
| condensation on air vents in bathroom | 1 | 80 |
| condensation on bathroom walls | 4 | 93.5 |
| condensation on walls in bathroom | 1 | 79 |
| dampness in bathroom | 1 | 100 |
| how to dehumidify a bathroom | 1 | 92 |
| how to get rid of moisture in bathroom | 1 | 81 |
| how to keep moisture out of bathroom | 2 | 84 |
| how to reduce condensation in bathroom | 2 | 98 |
| how to reduce dampness in a bathroom without a window | 1 | 69 |
| how to reduce steam in the bathroom | 1 | 92 |
| how to remove moisture from bathroom | 1 | 88 |
| how to stop condensation in bathroom | 1 | 100 |
| wash rooms condensation removal | 1 | 49 |

**Decision:** retain one primary condensation guide; do not create separate pages for wording variations. Do not blindly rewrite the page before the 2026-11-05 comparison: its last recorded Google crawl was 2026-10-01, so the current data may largely predate later edits. Review the live content against the high-intent distinctions (condensation vs leak, ventilation/fan performance, windowless bathroom) only after the checkpoint and fresh crawl evidence.

### B. Basement toilet choice — strongest commercial decision opportunity

**Primary URL:** `articles/macerating-toilet-basement-bathroom.html`  
**Visible query evidence:** 8 variants, 9 impressions. The strongest task phrasing is “basement bathroom without breaking concrete” (position 23), with “basement toilet” (2 impressions, position 32) and “basement toilet system” (position 27).

| Query | Impressions | Avg position |
|---|---:|---:|
| basement bathroom without breaking concrete | 1 | 23 |
| basement toilet | 2 | 32 |
| basement toilet system | 1 | 27 |
| how does a macerating toilet work | 1 | 67 |
| macerating toilets | 1 | 26 |
| toilet in cellar | 1 | 30 |
| what is macerating toilet | 1 | 76 |
| whats a macerating toilet | 1 | 79 |

**Decision:** one page should satisfy the choice intent and explain how the system works. The clearest opportunity is a decision comparison: macerating/upflush vs sewage ejector, floor-breaking alternatives, installation constraints, maintenance and when a plumber/code check is required. Add only if the current page lacks it and primary sources support it. Preserve the existing affiliate disclosure/link exactly; do not make unsupported cost claims.

### C. Kitchen counter clutter — page-one signal, legacy URL needs preservation

**Primary destination to verify:** `articles/kitchen-counter-zone-that-stays-clear.html`  
The visible query “why does my kitchen clutter keep coming back” has 10 impressions at position 10 and maps in the report to the legacy `stop-kitchen-counter-clutter.html` URL, which is now a redirect stub. The current destination has 3 impressions for “kitchen clear” at position 21.

**Decision:** do not resurrect or create a duplicate article. Verify that the old URL redirects cleanly to the current canonical destination, that the destination answers the “why does it return?” question directly, and that internal links point to the destination. Preserve the old URL for legacy traffic and do not remove its redirect.

### D. Cable clutter — definition query already on page one

**Primary URL:** `articles/reduce-cable-clutter.html`

| Query | Impressions | Avg position |
|---|---:|---:|
| cable clutter | 1 | 11 |
| cable clutter meaning | 4 | 7.5 |
| cable reduce paper | 1 | 31 |

**Decision:** the meaningful query is “cable clutter meaning” (position 7.5). Check that the page gives a concise, plain-language definition near the top before the practical steps. The third query is ambiguous/noisy; do not target it. No new definition-only page.

### E. Bathroom towels — low-volume follow-up problem

**Primary URL:** `articles/stop-musty-bathroom-towels.html`

| Query | Impressions | Avg position |
|---|---:|---:|
| how to keep towels from smelling musty | 1 | 57 |
| towel not drying in bathroom | 1 | 57 |
| towels smell after washing | 2 | 109.5 |
| why do my clean towels smell musty | 1 | 77 |
| why do towels smell musty | 1 | 84 |

**Decision:** keep one troubleshooting page. Check whether it distinguishes slow drying, washing residue and room humidity without adding unsupported causes. Wait for recrawl evidence before editing.

### F. Water leak sensor placement — useful long-tail, currently low visibility

**Primary URL:** `articles/where-to-put-water-leak-sensors.html`

| Query | Impressions | Avg position |
|---|---:|---:|
| where to place water leak sensors | 5 | 71.6 |
| where to put water leak sensors | 1 | 91 |

**Decision:** one placement guide, not two near-duplicate pages. If improved after the checkpoint, make the first answer a room-by-room placement map/checklist and state that sensors do not replace fixing leaks or maintaining plumbing.

### G. Evening lighting — strong position, tiny sample

**Primary URL:** `articles/better-evening-home-lighting-without-overcomplicating-it.html`

- “evening home”: 1 impression, position 2.
- “evening lighting”: 2 impressions, position 2.
- “make it light”: 1 impression, position 17 (ambiguous).

**Decision:** monitor only. Three clear impressions at position 2 are encouraging but far too few to infer stable ranking or justify a rewrite.

### H. Other sparse signals

- Crawl space: “how to fix moisture crawlspace”, 1 impression, position 61 → `articles/how-to-fix-damp-crawl-space-humidity.html`. Keep separate from the dehumidifier sizing intent; no new page based on one impression.
- Smart home: “smart home lighting system project”, 1 impression, position 58 → `articles/smart-lighting.html`. One ambiguous “smart light bulb vs changing table” row (1 impression, position 11) is not a reliable opportunity. Do not expand from this signal alone.

### I. Exclude from keyword targeting (query noise / mismatched intent)

The following visible rows should not become SEO targets or prompt new pages:
- “how can i reduce order errors between front of house and kitchen?” (1 impression; maps to legacy kitchen URL)
- “mostre em fotos”, “muéstrame”, “show me picture” (one impression each; map to wall-art guide)
- A long German image-editing prompt (1 impression; maps to evening-lighting guide)
- “water leak sensor vs bookshelf” (1 impression; maps to leak-sensor guide)
- Treat “cable reduce paper”, “make it light”, “kitchen clear” and “smart light bulb vs changing table” as ambiguous until a meaningful pattern appears.

Do not attempt to optimise a page around anomalous or obviously mismatched query text. Check for accidental query association, page content mismatch, and whether the row persists in later exports.

## 4. Prioritisation after the 2026-11-05 checkpoint

| Rank | Work item | Why now / evidence | Gate before action |
|---:|---|---|---|
| 1 | Preserve kitchen clutter migration | 10 impressions at position 10 and the only click appears at the legacy URL; the destination needs to inherit intent cleanly | Verify 301/meta-refresh behaviour, canonical, internal links and destination answer; no duplicate page |
| 2 | Improve the basement toilet decision page | 109 page impressions, position 11.28; query evidence includes “without breaking concrete” and “basement toilet system” | Compare actual SERP pages; inspect current guide; preserve Awin disclosure/link; score ≥85/100 |
| 3 | Improve cable clutter definition | “cable clutter meaning” at position 7.5, 4 visible impressions | Verify current intro already defines the term; make the smallest useful improvement only if missing |
| 4 | Diagnose condensation guide | 78 page impressions but visible head-query positions 69–100; last crawl 2026-10-01 | Wait for fresh crawl; inspect SERP intent and sources; do not rewrite based on old crawl |
| 5 | Leak sensor placement | 6 visible query impressions, positions 71.6/91 | Verify whether a placement diagram/checklist adds distinct value; no near-duplicate page |
| 6 | Towels and crawl-space follow-up | small visible query samples and weak positions | Monitor; do not create pages from one- or two-impression signals |
| 7 | Evening lighting | position 2 but only 3 clear query impressions | Monitor; no edit justified yet |

The 2026-11-05 checkpoint should compare identical search type, property, country/device filters, aggregation and equal-length date windows. Record exact retrieval time and date range. Because Search Console lags by 2–3 days, use the most recent **finalized** dates and state the lag; do not compare a complete baseline with an incomplete current window.

## 5. Cannibalisation and routing rules

1. One primary URL per distinct visitor task. Similar wording is a secondary query, not a reason for a new page.
2. Condensation, fan selection, fan dripping and leak-sensor placement are related but distinct tasks; cross-link where useful rather than merging all into one article.
3. Basement toilet selection and macerating toilet operation belong on one comprehensive decision page unless Search Console later proves a distinct intent.
4. Kitchen clutter's legacy URL must redirect to the current canonical destination; all new internal links should use the destination.
5. Cable clutter meaning belongs within the existing cable guide.
6. Keep calculator intents separate from generic editorial queries: the new general calculator is not evidence-backed by Search Console yet. Do not create focused calculator URLs until a distinct task and user benefit are validated.

## 6. Responsibilities

**ChatGPT:** own this query/intent interpretation, SERP competitor review, and the fixed AI-answer benchmark. Do not ask Claude to repeat this research.

**Claude:** verify live/repository facts that require implementation access (legacy redirect/canonical/internal links; current page contents; actual last crawl state if the owner tools show it), and update the dated `data/SEARCH_METRICS.md` log with the fresh API retrieval and reconciliation note. Do not edit the protected pages before the 2026-11-05 checkpoint.

**Owner:** preserve the 2026-11-05 measurement checkpoint and approve any protected page changes after evidence is presented.

## 7. Provenance and limitations

- Retrieved from the connected Google Search Console API on 2026-11-03, property `https://home-project-wise.github.io/home-project-wise/`, Web search, final data.
- Query/page rows: 2026-10-06–2026-10-31; property totals also re-read for 2026-09-20–2026-10-31 to reconcile the previous snapshot.
- Position is the Search Console average position for the row, not a fixed rank in every location or search.
- Query rows are incomplete because Google withholds some queries; visible impressions must not be presented as total demand.
- No keyword-volume provider, paid traffic dataset, backlink index, or top-10 competitor crawl was used in this document.
- This document is a research artifact. It authorizes no publication, code change, PR merge, Search Console setting change, sitemap submission or freeze removal.
