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

## State on 2026-10-15 (day 2)
- 20 articles. Categories: Storage 4, Home Design 4, Weekend Projects 9, Smart Home 3. Weakest: Smart Home.
- Done: PR #78 (article right-rug-size-painters-tape-test, HOME DESIGN, 5 original SVG diagrams in website/images/), #79 (quiet-entryway-storage: quick answer, what not to buy, quick win, meta tag order fixed), #80 ("On this page" card: website/toc.js + CSS in style.css + one script tag per article head). All merged after green checks; live site verified (pages, images, guides, sitemap, toc.js).
- Gate lesson: the gate expects `<meta name=... content=...>` and `<link rel="canonical" href=...>` in that attribute order, plus BreadcrumbList schema and GoatCounter script in every article.
- Sandbox lesson: the Composio workbench can reset between calls; do build, gate simulation and commit in the same cell.

## Update 2026-10-16 (day 2 wrap-up: images)
- Hero images are now AI-generated with ChatGPT from prompts written by Claude (one prompt per image, one code block each). Flow: Claude writes the prompt -> owner generates the image and sends it in chat -> Claude crops/removes any corner watermark and converts to JPG 1600x900 (~250 KB) -> owner uploads it at https://github.com/home-project-wise/home-project-wise/upload/main/website/images -> Claude updates the article PR, waits for the checks, merges and verifies the live page. Claude cannot push binary files itself.
- AI images carry the caption prefix "AI-generated image:". The hero must SHOW the article's subject (the vision guard blocks 'mismatch').
- PR #83: automation/vision_guard.py no longer blocks 'ai-look' (set VISION_BLOCK_AI_LOOK=1 to restore). Workflow file untouched.
- PR #82 merged: rug article hero = website/images/rug-tape-test-hero.jpg (orange painter's tape on the floor), og:image + twitter large card added.
- Cleanup: unused website/images/rug-size-hero.jpg and rug-size-hero.svg removed.
- Rule of thumb: Composio workbench cells time out after 180 s and the sandbox can reset between calls; fetch live pages in parallel instead of many GitHub API calls.

## State on 2026-10-16 (day 3)
- 21 articles live. Categories: Storage 4, Home Design 4, Weekend Projects 9, Smart Home 4. Next new article: Storage (first in the category order).
- Done and merged: PR #84 (simple-home-reset: quick answer, 15-minute timeline diagram, what not to buy, quick win), #85 (new logo lockup with outlined wordmark on every page; icon-only mark refreshed), #86 (broken footer brand on fix-wobbly-furniture).
- Done and merged: PR #90 (new article what-can-you-plug-into-a-smart-plug, SMART HOME, 4 SVG diagrams + AI hero website/images/smart-plug-safe-load-hero.jpg, guides card, sitemap entry). All 3 checks green, live page, images, guides and sitemap verified. Header/footer markup of a new article must match the majority of the other articles (logo header 220x33; footer with brand-logo-footer 200x30 and the nav).
- Vision guard (PR #83): AI-generated images allowed (label them 'AI-generated image' in the caption); the guard still blocks images that do not show the section subject (mismatch) and text/watermarks. The hero must show the article subject itself.
- Image flow: Claude writes one ChatGPT prompt per image; owner sends the image to Claude; Claude removes watermarks, converts to JPG 1600x900, owner uploads it at github.com/home-project-wise/home-project-wise/upload/main/website/images.
- Cleanup of the two unused rug hero files was done in PR #88.

## Queues
- New articles, category order: Storage, Home Design, Smart Home, Weekend Projects.
- Older articles to improve: fix-wobbly-furniture, better-evening-home-lighting, smart-lighting.
- Look: guides.html cards, dark mode, homepage hero, article cards.
