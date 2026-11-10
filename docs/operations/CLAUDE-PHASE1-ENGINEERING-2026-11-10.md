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
