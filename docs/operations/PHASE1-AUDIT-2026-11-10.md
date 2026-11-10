# HomeProjectWise Phase 1 audit and Claude handoff — 2026-11-10

## Executive status

- Audited repository `home-project-wise/home-project-wise`, the required operations records, calculator and wallpaper specifications, image-audit outputs, generated Pages artifact, recent commits, open PRs and deployment workflow.
- Current `main`: `1950448be7` — PR #261 (wallpaper guide now points to the photographic hero).
- Last successful Pages deployment: run [#42797593223](https://github.com/home-project-wise/home-project-wise/actions/runs/42797593223), commit `82735c5acb` (PR #260). It completed the generated-site rebuild, deployed and passed the live homepage/all-article-image verification.
- Latest Pages run for PR #261: [#42798390762](https://github.com/home-project-wise/home-project-wise/actions/runs/42798390762) failed. The production site is therefore one merged commit behind `main`; the wallpaper photo selection from #261 is not yet live.
- No article/image deletion, image replacement, Awin change, editorial-freeze change or manual edit to generated output was made in this audit.

## What was read and verified

Operations and source records:
- `data/WORK_LOG.md`
- `data/AI_COLLABORATION.md`
- `data/PROJECT_STATE.md`
- `data/CONTENT_INVENTORY.md`
- `data/daily_routine_log.md`
- `docs/CAO-INTEGRATION.md`
- `docs/CALCULATOR-WALLPAPER-PLANNING-MODULE.md`
- `docs/operations/CHATGPT-INDEPENDENT-WORK-HANDOFF-2026-11-07.md`
- `data/image_audit/REPORT.md`, `CONTENT_REPORT.md`, `latest.json`, `content_latest.json`, `data/image_progress.md`, `data/URL_AUDIT.md`, `data/SEARCH_METRICS.md`
- `scripts/rebuild_site_indexes.py`, `scripts/check_site.py`, the Pages workflow and the current calculator/QA source files.

### Repository and deployment

Recent main commits:
- #255 — calculator finder routing, working homepage newsletter URL, mobile nav fit and minimum target sizing.
- Homepage calculator first-screen visibility improvement.
- #256 — 71-check real-browser smoke suite for Home Check-up, Rug Size, Smart Plug Load Check and Crawl Space Dehumidifier.
- #258/#259 — Smart Devices hero asset and article hero selection.
- #260/#261 — wallpaper photo asset and article hero selection.

The successful #260 Pages artifact was downloaded and inspected. It contains:
- 30 indexable article cards; the only excluded article file is the intentional `stop-kitchen-counter-clutter` redirect stub.
- 7 tool cards, four category hubs, a generated Tools hub and 49 sitemap URLs.
- 67 raster image assets; all 30 article hero images are unique.
- 18 raster assets not referenced in that deployed artifact. One of those is `images/wallpaper-planning-hero.jpg`, which PR #261 now references in main but which is not yet live because #261's deployment failed. The remaining unreferenced assets were not deleted.

Important generator rule: `scripts/rebuild_site_indexes.py` generates `guides.html`, `tools.html`, category hubs, sitemap and RSS in the deployment workspace. The tracked versions can be stale. Do not manually create a second `tools.html` or edit generated cards/hubs as the source of truth.

### Deployment failure — priority P0

The first attempt for run #42798390762 built the site and uploaded the Pages artifact successfully, but the Deploy step could not locate artifact metadata. A retry then failed earlier at **Remove stale Pages artifacts from this run** with HTTP 403:
- The workflow uses `github.rest.actions.deleteArtifact`.
- Explicit workflow permissions are only `contents: read`, `pages: write`, and `id-token: write`.
- The token therefore lacks `actions: write`, so a retry cannot delete the artifact left by the previous attempt.

A least-privilege fix is available, but the file `.github/workflows/pages.yml` is protected by project policy. Proposed repair after explicit owner approval:
1. Remove the stale-artifact deletion step (avoid granting broader `actions: write`).
2. Name the upload artifact `github-pages-${{ github.run_attempt }}`.
3. Set `actions/deploy-pages@v4` input `artifact_name` to the same `github-pages-${{ github.run_attempt }}`.
4. Keep existing `contents: read`, `pages: write`, `id-token: write` permissions.
The official action manifests confirm both actions support the `name` and `artifact_name` inputs. This proposal was not applied because workflow files require explicit approval. Until repaired and a new successful deployment is verified, treat #261 as merged-to-main but not live.

## Site structure, UX and content

### Verified strengths already delivered — do not repeat

- Homepage calculator prominence was improved in main.
- Mobile navigation, finder-to-correct-calculator routing, newsletter target and 24px/44px target work were addressed in #255.
- Guides, Tools, four category hubs and sitemap are generated from article/tool sources at deploy time.
- Budget Planner is already integrated with Project Estimator Engine 1.0.2; it is not a duplicate estimator page.
- Dark mode exists through `prefers-color-scheme` styling. It was not visually re-tested in this sandbox.
- Article metadata and structured data are complete across all 30 indexable guides.

### Static audit results from the successful Pages artifact

- 52 HTML files checked.
- 0 broken local file references.
- 0 invalid JSON-LD blocks.
- 0 missing title, viewport or canonical on checked public pages.
- One expected exception: `404.html` has no meta description.
- All 30 indexable articles have Sources, `dateModified`, canonical, meta description, Article/BlogPosting schema and FAQPage schema.
- 15 titles exceed 70 characters. Do not shorten them blindly; use Search Console intent/CTR evidence first.
- Generated Guides counts: Storage 5, Home Design 7, Weekend Projects 10, Smart Home 8. PR #151 is merged; the older inventory note saying it was still pending is obsolete.
- Keep the existing Storage URLs. The category conflicts with the five-pillar editorial boundary, but taxonomy migration is an owner decision and must not silently change routes.

### Accessibility and responsive follow-ups

Previously merged browser evidence:
- #255: 34/34 finder checks; real Chromium sweep of 24 pages at 320, 360, 390, 412, 768 and 1280px reported zero horizontal overflow, page/console errors, broken images or failed local requests. The 360px navigation fit and keyboard focus were checked.
- #256: 71/71 smoke checks across four tools, including keyboard-only use, unit switching, result/error states, six viewport widths and no horizontal overflow.
- #250/#252: Budget Planner engine/browser checks and responsive card layout were tested. The #252 notes still record one long item name overflowing its field by about 15px at 320px; real-phone owner confirmation was not recorded.
- #236: bathroom fan calculator had a 36/36 browser suite on its merged PR.

Remaining known target-size issues from #255:
- Native checkbox/radio controls in calculators and the crawl-space tool remain roughly 13–18px.
- `Print this guide` is about 31px high.
- `On this page` summary is about 26px high.
- Budget Planner `+ Add an item` is about 21px high.
These are safe candidates for a small CSS-only accessibility PR, but the updated controls still need exact-head Chromium checks at mobile and desktop sizes. No CSS was changed in this audit.

This session's local browser launch was blocked by the execution environment (`ERR_BLOCKED_BY_ADMINISTRATOR` for localhost and file URLs). This is an environment limitation, not a site failure. Do not report a new browser sweep as passed.

## Calculator and estimator verification

### Tests run in this audit against the successful Pages artifact/current main source

- Home Project Calculator DOM harness: 38/38 checks passed normally; 39/39 with `HPW_TEST_HASH=#panel-project`. Covers metric/imperial area, perimeter and volume; paint coverage and tins; material packs; energy kWh and user-entered tariff; project cost, tax and contingency; invalid/blank inputs; stale-result clearing; deep-link tab selection; keyboard tab roving and arrow/Home/End behavior.
- Budget Planner: 8 additional checks passed, plus 300 generated plans where the estimator-backed Must / Must+Nice / Everything totals matched the plain summary arithmetic. Unknown required prices block a verdict; unknown optional prices stay optional; explicit zero remains a real entered price; guesses stay in a separate scenario; excessive decimal precision is not rounded silently.
- Project Estimator Engine: 10 additional checks passed. Includes sourced range arithmetic, unknown required/optional handling, explicit zero, 4-decimal unit prices, provenance requirements, invalid/future dates, forged estimate rejection and deep immutability.
- Wallpaper → Project Estimator adapter: 2/2 integration checks passed against the current engine files. A priced package maps as user-input and yields the expected budget result; an unknown package price remains null and produces `cannot-assess`.
- Historical merged evidence: #244 reports 39/39 wallpaper engine tests; #250 reports the Budget Planner's 52 browser checks; #255/#256/#236 provide the browser results above.

The browser sweep could not be repeated in this session. Safari, Firefox, real devices, screen readers, landscape and dark-mode rendered screenshots remain unverified.

### Calculator product status

- Home Project Calculator remains the flagship: measurement, paint, material, energy and project-cost modules; the homepage now exposes it earlier.
- Budget Planner already uses Project Estimator Engine 1.0.2, USD-only, with Must/Nice/Later scenarios, source-aware/entered prices, unknown costs kept unknown, and rough guesses separated from the main verdict.
- Project Estimator Engine requires provenance for external ranges/listings; no live regional price feed was enabled. Do not invent market prices.
- Wallpaper calculation engine and adapter exist, but the wallpaper feature is **not connected to the visible flagship calculator UI**. The module spec says the intended place is inside the flagship calculator, not a duplicate standalone tool. Claude should review and propose the smallest accessible UI integration; unsupported half-drop patterns and generic price assumptions must remain unavailable.

## Content quality and gap analysis

No new article was published in this phase. The existing 30-guide library already has broad coverage across repairs/moisture, Smart Home, design/installation and buying decisions.

Potential gaps to validate, not briefs to publish immediately:
- Energy: whole-home energy audit, air sealing/insulation, HVAC/heat-pump efficiency and appliance running-cost decisions. The current energy calculator module and smart-plug safety guide do not constitute a full Energy cluster.
- Smart Home: Matter/Thread/Zigbee and device compatibility, only if a practical decision framework adds value beyond existing connectivity articles.
- Home Improvement/Repairs: drywall patching, caulk/grout repair, flooring transitions and safe leak response.
Use query-level Search Console data, competitor/SERP evidence, duplicate-intent checks, primary sources and the 85/100 Value Before Publishing threshold before drafting.

## Image phase register — no image changed

The stored vision report has 47 rows: 10 keep, 1 replace, 14 weak-match, 15 pending and 7 error. Pending/quota and timeout results are not evidence of mismatch. I downloaded the last successful Pages artifact and visually inspected a contact sheet of its 67 raster assets, then checked the current article hero references.

| Page / URL | Image file | Visual finding and reason | Source classification | Decision / priority |
|---|---|---|---|---|
| Smart Lighting — `/articles/smart-lighting.html` | `assets/img/smart-lighting-hero.jpg` | Abstract split pink/yellow product flat-lay with floating device icons; does not show a real room or practical lighting layers. Breaks the warm-neutral editorial photo style and weakens the article's promise of practical room lighting. | Caption says “Product-style flat lay”; EXIF does not identify origin. AI vs stock is **unverified**; do not label it as AI without provenance. | **Replace in image phase — P1.** Use a photorealistic US living-room scene showing layered smart lighting (ambient lamp, task light, one discreet smart bulb/switch); no text/logos/people. |
| Calm Room — `/articles/calm-room.html` | `images/calm-room-doorway-hero.jpg` | Vision report marked “replace”, but manual full-size inspection shows a calm doorway view, clear floor, sofa, soft window light and one focal print; it fits the article and the existing warm-neutral style. | AI-generated per caption. | **Keep — no replacement.** Record the vision verdict as a false positive. |
| Smart Devices Offline — `/articles/smart-devices-keep-going-offline.html` | `images/smart-devices-offline-hero.jpg` | New hero shows a router on one side of a wall and a smart plug in the next room; relevant and visually consistent. | AI-generated per caption. | **Keep.** Deployed by successful #260 build. |
| Wallpaper Planning — `/articles/how-to-calculate-wallpaper-rolls-pattern-repeat.html` | `images/wallpaper-planning-hero.jpg` | New photo shows botanical wallpaper, a roll, tape measure and level; relevant and visually consistent. Main #261 now uses it, but the failed deployment means the current live artifact still shows the previous SVG. | AI-generated per caption. | **Keep; verify after deployment — P1 operational check, not image replacement.** |
| Bathroom Fan Dripping — `/articles/bathroom-exhaust-fan-dripping-water.html` | `images/fan-dripping-water-hero.jpg` | Vision audit timed out, but manual contact-sheet review shows water droplets on a bathroom exhaust grille; clear topic match. | AI-generated per caption. | **Keep; no replacement.** |
| Crawl Space Dehumidifier — `/what-size-dehumidifier-crawl-space.html` | `images/crawl-space-dehumidifier-hero.jpg` | Vision audit timed out; manual review shows a dehumidifier and humidity reading, matching the sizing guide. | Canva illustration per caption. | **Keep; no replacement.** |
| Macerating Toilet — `/articles/macerating-toilet-basement-bathroom.html` | `images/AaEuhjogDLzUicDPoF8kqw-AaEuhjogQ2vVsrb4CvvZMA.jpg` | Opaque filename, but the image visibly shows a basement toilet and pump; it is relevant. | Origin unverified; caption does not identify AI. | **Keep; filename cleanup is not part of this phase.** |

Other weak-match rows (evening-lighting set, calm-room inner images, wobbly-furniture, small-living-room, motion-lighting, cable-clutter and rug-size) were visually relevant in the contact sheet. The seven timeout/error rows were not treated as mismatch verdicts. The 15 pending rows remain candidates for the separate, full image pass, not automatic replacements.

The 18 unreferenced raster files in the successful artifact are an asset-cleanup list, not a deletion list. They include legacy Pinterest assets under `assets/img/`, older superseded photos, two opaque fan-image files, and the wallpaper JPG that #261 now references in main but that was not yet deployed. Do not delete any of them until usage/history is reconciled. The source type of uncaptioned assets remains unverified.

## Open PRs and protected files

Open PRs verified at audit time:
- #247 — `data/WORK_LOG.md`
- #245 — `data/AI_COLLABORATION.md`, `data/PROJECT_STATE.md`, `data/SEARCH_METRICS.md`, `data/WORK_LOG.md`, `data/daily_routine_log.md`
- #231 — `docs/BUDGET_FIRST_HOME_PROJECT_ESTIMATOR_SPEC_2026-11-03.md`
- #216 — `docs/CAO-EXECUTION-FOUNDATIONS.md`, `docs/SEARCH-CONSOLE-BASELINE-2026-11-01.md`
- #208 — `docs/AI-SEARCH-VISIBILITY-PRIORITY-PLAN.md`, `docs/FOUR-GROWTH-ENGINES-ROADMAP.md`

Do not edit those files while their PRs are open. In particular, do not edit the shared operations records in #245/#247; this audit and the inventory delta are in separate files to avoid conflicts.

Protected areas:
- `.github/workflows/` — requires explicit owner approval. The Pages retry fix above is only a proposal; do not implement it without that approval.
- Awin affiliate URLs and disclosures — do not touch.
- `.editorial-freeze` and frozen content queue — do not touch.
- Generated Pages outputs (`tools.html`, category hubs, generated Guides cards and sitemap) — edit their source/generator, not the build output.

## Claude handoff — one-pass review request

Claude should not repeat the repository discovery or content/image mapping in this document. Review the evidence and complete only the specialized work below:

1. **Deployment:** inspect run #42798390762 and the protected Pages workflow. After the owner explicitly authorizes workflow edits, implement the attempt-specific artifact name fix described above, validate the YAML/action inputs, run the required checks, merge only if green, then verify the live homepage, Tools hub, Guides cards, 49+ sitemap URLs and the wallpaper JPG hero.
2. **Accessibility:** fix the remaining checkbox/radio, Print this guide, On this page and Budget Planner Add Item targets; fix the known 320px long-item-name clipping. Run exact-head Chromium at 320/360/390/412/768/1280, keyboard-only, light/dark and landscape. Do not claim Safari, screen-reader or real-device checks unless actually run.
3. **Flagship calculator:** review the wallpaper module spec and the 2/2 adapter test. Propose and implement the smallest accessible UI integration inside the existing Home Project Calculator, not a duplicate standalone calculator. Keep unknown price null, use only user-entered prices, and refuse unsupported half-drop/offset patterns.
4. **Content:** validate the Energy and other gap hypotheses with current query-level Search Console/SERP evidence. Review the 15 long titles using intent/CTR. Do not publish a new article or shorten a title solely to increase count or fit a character target; apply the 85/100 Value Before Publishing gate.
5. **Images — separate phase only:** use this register. Replace only the Smart Lighting hero unless a fresh visual audit establishes another mismatch. Keep the Calm Room hero despite the automated false positive. Confirm the wallpaper photo is live after the deployment fix. Do not replace/delete any other image in this phase.

After #245 and #247 resolve, reconcile one canonical work-log entry, the project state, AI collaboration handoff and daily routine log. Keep this report as the evidence source until that reconciliation is complete.

## Changes made in this audit

- Updated `data/CONTENT_INVENTORY.md` with the 2026-11-10 verified counts, seven new articles, current metadata status, overlap decisions and unvalidated gap hypotheses.
- Added this audit and handoff record.
- No production code, image, Awin link, editorial-freeze file or workflow was changed.
