# HomeProjectWise: project charter and state

Maintained by Claude (project manager). Read this first at the start of every session. Update it at the end of every working day.

## Roles
- **Claude**: runs the project. Writes articles, edits the repo through the GitHub connector, opens and merges its own PRs after verification, checks the live site after every merge.
- **ChatGPT**: available for tasks Claude cannot do itself (run workflows, use the Gemini key stored in GitHub secrets, generate images). The owner relays at most 1 to 2 messages per day, so every request to ChatGPT must be one complete, copy-paste message.
- **DeepSeek**: no longer directs the work (stopped by the owner on 2026-10-14).
- **Owner (Khaled)**: wants minimal screen time. Decisions only, no relaying between tools.

## Daily routine (3 tasks, each in its own PR)
1. **New article** that solves one real problem, adds real value, is creative, sits in its correct category (pick the weakest category), has an attractive hero image at the heart of the topic.
2. **Improve one older article** (text, structure, sources, related links; not images unless decided).
3. **One small look improvement** to the site.
Then update `data/daily_routine_log.md` and this file.

## Rules
- One real problem per article; test: clear problem, actionable, useful info, images that explain (no decoration), action possible in 10 minutes, says what to do.
- Useful blocks when relevant: Quick plan (time, cost, best for, goal), Quick win (10 min), What not to buy yet, Common mistakes, FAQ, Sources, Keep going (related guides).
- No fixed article length. Claims must be sourced or hedged; no invented numbers.
- Exactly one category per article, written the same way in three places: page tag `CATEGORY · SUBTOPIC`, the matching section of `website/guides.html`, and `website/sitemap.xml` entry. Categories: STORAGE & ORGANIZATION, HOME DESIGN, WEEKEND PROJECTS, SMART HOME.
- Never touch: Awin links, `.editorial-freeze`, `.github/workflows`, secrets, PRs #16 #18 #21 (frozen, decision pending).
- Verify the live site after every merge (page, images, guides section, sitemap).

## Technical facts (verified 2026-10-14)
- Site: https://home-project-wise.github.io/home-project-wise/ (static HTML, GitHub Pages from `./website`).
- Quality gate `scripts/quality_gate.py`: MIN_IMAGES lowered to 4 (PR #70). Rule: each figure's alt + caption must share a word of 4+ letters with the heading of its section. The PR check shows green with "no changed article candidate" and does not really inspect the article, so run the checks by simulation.
- A deploy-time CSS layer is appended to `style.css` on the live site (not in `main`); its source file is not yet identified. Its rules (`.section.article>p`) beat plain `.article` rules, so use higher specificity.
- `automation/publish.py` rewrites `guides.html` with generic GUIDE cards: do not run it. `daily.yml` publishes `content/queue` items twice a day unless `.editorial-freeze` exists; the queue holds 2 old items (organize-under-the-sink, 15-minute-weekend-home-check) that would publish at once if the freeze is lifted.
- A new article needs 3 manual edits: article HTML, a card in the right section of `guides.html`, a URL in `sitemap.xml`. Never run build scripts for this.
- Articles use hotlinked Unsplash photos in 12 of 19 articles (risk of broken images); not part of the routine until decided.

## State on 2026-10-14
- 19 articles. Categories: Storage 4, Home Design 3, Weekend Projects 9, Smart Home 3. Weakest: Home Design, Smart Home.
- Done today: PR #68 (category tags unified, orphan article added), #69 (article smart-home-wifi-outage-test), #70 (min images 4), #73 and #74 (article typography CSS), #75 (kitchen-counter-zone improvement).
- 2026-10-15: owner approved. #16 and #18 closed (photos never visually verified). #21 (Image Vision Guard, Gemini) merged with default mode changed to audit = report only; automatic photo replacement happens only if started manually with mode=fix. First audit run started 2026-10-15 (workflow_dispatch). Read its reports in `data/image_audit/REPORT.md` and `CONTENT_REPORT.md` and use them to decide image fixes (nothing replaced automatically).
- Frozen PRs: none left open. Do not use mode=fix without the owner's decision.

## Queues
- New articles, category order: Home Design, Smart Home, Storage, Home Design, Smart Home.
- Older articles to improve: quiet-entryway-storage, simple-home-reset-that-prevents-weekend-chaos, fix-wobbly-furniture, better-evening-home-lighting, smart-lighting.
- Look: "On this page" contents for long articles, guides.html cards, dark mode.
