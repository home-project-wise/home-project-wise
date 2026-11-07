# Operations handoff — 2026-11-07 (ChatGPT independent work)

## Owner direction

The owner authorized ChatGPT to continue as the active project operator while Claude is unavailable. Claude's role on return is final technical/editorial review, challenge assumptions, run independent checks and identify defects. This does not waive Value Before Publishing, the 85/100 quality threshold, safety/privacy rules, or exact-head verification.

## Current coordination boundaries

- PR #242 is an open draft changing website/index.html, data/AI_COLLABORATION.md and data/WORK_LOG.md. Do not edit those paths until it is resolved.
- PR #243 is an open draft changing data/AI_COLLABORATION.md, data/WORK_LOG.md and website/articles/where-to-put-water-leak-sensors.html. Do not edit those paths until it is resolved.
- The shared collaboration and work-log files are therefore intentionally not changed by this task. Reconcile one canonical work-log line and an AI_COLLABORATION handoff after #242/#243 merge or close.
- Existing CAO drafts #208 and #216 and the estimator spec #231 remain separate review items; this task does not edit or supersede them.

## Work completed in this task

- Researched wallpaper quantity methods from Sherwin-Williams, Graham & Brown, James Dunlop Textiles and the Wallcoverings Association.
- Added a new guide focused on per-wall drops, pattern repeat, usable roll length, package unit, batch code and opening deductions.
- Created original vector illustrations for the hero and three calculation diagrams.
- Added the guide to the Home Design library and sitemap.
- Added a research-backed product specification for a wallpaper quantity/cost module inside the existing flagship calculator. It explicitly avoids a new standalone calculator, invented roll sizes, generic price claims and unsupported half-drop estimates.
- Implemented the isolated calculation engine and 28 focused Node tests (local run: 28/28 pass on Node 22.16.0). The engine is not yet wired to the page; no UI or published calculator capability is claimed.
- Updated the project-state record with the new owner operating direction and exact PR handoff.

## Review requested from Claude on return

1. Independently verify the worked example: 34 drops, 10-foot matched drop, 3 complete drops per 33-foot sale unit, 12 sale units.
2. Review article claims against the linked primary manufacturer/association pages, especially how openings and half-drop patterns are treated.
3. Inspect all four SVG illustrations at desktop and mobile widths and check accessibility/contrast.
4. Run the editorial quality gate, source/link checks, sitemap/index checks and Image Vision Guard on the exact PR head. Do not call a guard pass unless its actual result is green.
5. Rerun node scripts/test_wallpaper_calculator_engine.js from the exact PR head; independently review safe rounding, package-unit semantics, metric/imperial consistency and error handling. Then review the module contract and propose the smallest accessible UI integration. Do not begin half-drop or live-price functionality without validated formula and source/licence evidence.
6. Review PR #242/#243 independently; no overlapping edits while those PRs are open.

## Verification limitations

This PR was authored through GitHub repository operations. The pure calculation engine's 28-case Node suite was run locally on Node 22.16.0 before upload. The exact uploaded PR head has not yet been independently rerun. No local Python editorial gate, Chromium, screen-reader, rendered SVG review, or deployed-page test was run. CI structural checks and the Image Vision Guard PR gate passed, but full content-value audit was skipped. Independent Claude verification remains pending. Do not merge or claim publication until exact-head checks and live verification pass.
