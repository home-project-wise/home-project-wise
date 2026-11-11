# Claude Phase 1 engineering record — Pages deployment fix — 2026-11-10

Owner authorization: the owner explicitly approved Claude's edit of `.github/workflows/pages.yml` on 2026-11-10 (this chat session). Scope of the approval: the least-privilege fix below only.

## Evidence (independently checked, not copied from the ChatGPT audit)

- `main` = `1950448be7b4` (#261). Run #42798390762 (push, #261) has two attempts, both failed:
  - Attempt 1 (job 129769315101): build + upload succeeded; `Deploy` failed with "Found 0 artifact(s)... Fetching artifact metadata failed" although the run listing shows one artifact `github-pages` (id 13755357319, created 10:21:16Z). Transient artifact-metadata lag.
  - Attempt 2 (job 129796281852): step "Remove stale Pages artifacts from this run" failed with HTTP 403 `Resource not accessible by integration` (documentation: delete-an-artifact). The workflow grants only `contents: read`, `pages: write`, `id-token: write`, so `actions: write` is missing. Upload and Deploy were skipped.
- Conclusion: a plain re-run can never succeed while the deletion step needs a permission the workflow does not have. Cause confirmed from the job logs, not inferred.

## Change

- Removed the artifact-deletion step (no `actions: write` granted).
- `actions/upload-pages-artifact@v3` input `name` and `actions/deploy-pages@v4` input `artifact_name` both set to `github-pages-${{ github.run_attempt }}`, so a re-run uses a fresh artifact name.
- Permissions unchanged. No other workflow, no site file, no image, no Awin link and no `.editorial-freeze` touched.
- Because `pages.yml` is in the workflow's own `paths` filter, merging this PR to `main` triggers a fresh run (attempt 1) that deploys the current `main`, including the wallpaper hero from #261.

## Checks run

- YAML parsed with PyYAML; step list, permissions, and both artifact-name inputs verified programmatically; no `deleteArtifact` or `actions: write` left.
- Not tested: the actions/upload-pages-artifact `name` and actions/deploy-pages `artifact_name` pair on GitHub's runners until this PR is merged and the new run finishes. Result will be appended below after verification.

## Shared logs

`data/WORK_LOG.md`, `data/AI_COLLABORATION.md`, `data/PROJECT_STATE.md` and `data/daily_routine_log.md` are being modified by open PRs #245/#247, so they are intentionally untouched here. This file is the evidence source until those PRs resolve; one canonical entry is to be reconciled afterwards.

## Next actions

1. Merge only after required checks pass; verify the new Pages run, homepage, Tools hub, Guides cards, sitemap (49+ URLs) and `images/wallpaper-planning-hero.jpg` live.
2. Accessibility PR (checkbox/radio, Print this guide, On this page, Budget Planner Add item, 320 px long-name clipping) in a separate PR.
3. Wallpaper UI integration inside Home Project Calculator; content-gap and long-title validation with query-level evidence; Smart Lighting hero in the image phase only.

## Result (appended after merge)

- PR #263 squash-merged as `cd7c63791b0e` after `quality` and `health` checks passed on head `15da4da` (2 files changed: `pages.yml`, this record).
- Pages run #42809299624 (attempt 1, push to `main`) completed with conclusion `success`, including the built-in "Verify deployed homepage and all article images" step.
- Live checks (HTTP from the Composio sandbox, not a browser): homepage, `tools.html`, `guides.html`, `sitemap.xml` and the wallpaper article return 200; sitemap has 49 URLs; `images/wallpaper-planning-hero.jpg` returns 200 (image/jpeg, 233,708 bytes) and the wallpaper article references it. The wallpaper photo is therefore live.
- Not verified: rendered visuals in a browser, guide-card counts (the quick regex returned 0 and was not trusted), Tools hub card contents, dark mode, any real device.
- Remaining defects: accessibility targets and the 320 px long-name clipping; wallpaper module not in the flagship calculator UI; content-gap and long-title validation; Smart Lighting hero (image phase only).

## Accessibility PR #266 — 2026-11-10 (branch `claude/accessibility-targets-2026-11-10`, base `main` 265f1b27)

Scope: CSS and test only. Files: `website/article-overrides.css` (+735 bytes, appended block), `scripts/qa_browser_accessibility_targets.py` (new), this record.

Method: Chromium (Playwright chromium 1254, headless shell, Debian sandbox) against the site built as the Pages workflow builds it (`python scripts/rebuild_site_indexes.py && cat website/article-overrides.css >> website/style.css`).

Findings reproduced on unmodified `main` before any change: inputs 13x13 / 14x18 / 18x18 with label rows 21-26 px (rug, crawl space, bathroom fan, home check-up); `Print this guide` 31 px; `On this page` summary 26 px; `+ Add an item` 21 px.

Long item name: the audit note ("about 15 px at 320 px") was not what I reproduced. A long unbroken item name widens the plan summary and the whole page to a scroll width of 768 px at every viewport up to 768 px. The earlier overflow checks compared `scrollWidth` with `innerWidth`; under mobile emulation `innerWidth` grows to the content, so that comparison cannot detect it. The new test compares with the configured width. Text scrolling inside the input field itself is native input behaviour and was not changed.

Results: new test on unmodified CSS 106 failures of 276 checks (before the landscape sizes were added); with the change 276/276, then 364/364 with 667x375 and 844x390. Existing suites on the modified build: `test_home_calculator.js` all passed; `test_budget_planner.js`, `test_bathroom_fan_calculator.js`, `test_project_estimator_engine.js`, `test_wallpaper_calculator_engine.js` (39), `test_wallpaper_project_estimator_integration.js` (2) passed; `qa_browser_home_calculator.py` TOTAL 53 FAILS []; `qa_browser_four_tools.py` 71 passed 0 failed; `qa_browser_tools_finder.py` TOTAL 34 FAILS []; `qa_browser_budget_planner.py` TOTAL 68 FAILS []; `qa_browser_bathroom_fan_calculator.py` TOTAL 36 FAILS []. `check_site.py`: 3 errors, identical to `main` (the intentional `stop-kitchen-counter-clutter` redirect stub).

Not tested: Safari, Firefox, screen readers, real devices, print preview; screenshots were not reviewed by eye; `check_contrast.js` did not run (no npm/jsdom in the sandbox) although no colours were added; the focus check is Tab reachability plus a computed outline of at least 2 px, not a visual review. Live behaviour after merge is verified separately below.

Remaining defects after this PR: wallpaper module not in the Home Project Calculator UI; header/footer and site-wide focus-visible consistency not measured; content-gap and long-title validation; Smart Lighting hero (image phase).

### Result of #266 (appended after merge and deployment)

- #266 squash-merged as `5a924aff2337` after exact-head `quality` and `health` checks passed (final diff: 3 files, +127 lines: `article-overrides.css` +9, new test +102, this record +16).
- Pages run #42814108608 (attempt 1, push to `main`) completed `success`.
- Live check: the deployed `style.css` contains the accessibility block, and `qa_browser_accessibility_targets.py` run against the live site URLs (7 tool pages and 3 guides, 8 viewport sizes, light and dark, keyboard focus) gave 364/364 passed. Chromium emulation only; no Safari, Firefox, screen reader or real device.
- Next: wallpaper UI integration inside the Home Project Calculator (separate PR); then content/SEO validation and image phase per their own gates. Shared logs (`WORK_LOG`, `AI_COLLABORATION`, `PROJECT_STATE`, `daily_routine_log`) still wait for #245/#247.
