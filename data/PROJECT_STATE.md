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

## Update 2026-10-16 (night): AI images merged
- The owner generated 11 images with ChatGPT from our prompts (uploaded as PNG). Claude converts and pushes them itself: crop to 1600x900 from the top-left corner (removes the faint Gemini watermark at the bottom-right), JPG quality 84, upload with GITHUB_CREATE_OR_UPDATE_FILE_CONTENTS (base64) from the Composio workbench, delete the source PNG in the same PR. The owner no longer needs to convert; PNG upload is enough.
- Merged: #92 calm-room (4 images), #93 better-evening-home-lighting (4), #94 fix-wobbly-furniture (hero), #95 how-to-hang-large-wall-art (hero), #96 simple-home-reset (section 5). Live pages and images verified (200, sizes ~130-230 KB).
- Owner decision: images made to order for a section do not wait for the Gemini audit; the guard is for auto-sourced images. The guard result is meaningless when the daily Gemini quota is exhausted ('pending') or times out ('error').
- Gemini audit (workflow_dispatch image-vision-guard.yml, inputs as a JSON string) still has about 36 images pending (hotlinked Unsplash photos in the older articles); quota resets daily.
- Social tags: twitter:image of the five articles pointed to the old Unsplash hero; updated to the new local hero (simple-home-reset hero is still an Unsplash photo).

## Queues
- New articles, category order: Storage, Home Design, Smart Home, Weekend Projects.
- Older articles to improve: fix-wobbly-furniture, better-evening-home-lighting, smart-lighting.
- Look: guides.html cards, dark mode, homepage hero, article cards.

## Update 2026-10-17 (day 4)
- Done: PR #98 (article stop-mail-and-paper-pile, STORAGE, 4 original SVG diagrams), #99 (its hero: owner-generated AI image, cropped 1600x900 JPG, og:image, twitter large card, JSON-LD image), #100 (fix-wobbly-furniture improved), #101 and #102 (guide library cards). All merged after green checks and verified live.
- Article count is about 22 (Storage 5, Home Design 4, Weekend Projects 9, Smart Home 4, counted from the notes above). Weakest next: Home Design or Smart Home.
- Important correction: the live `guides.html`, `sitemap.xml`, feed and homepage latest cards are REGENERATED at every deploy by `scripts/rebuild_site_indexes.py` (see `.github/workflows/pages.yml`), then `website/article-overrides.css` is appended to `style.css`. Hand edits to the card list in `website/guides.html` are overwritten; the card comes from the article file (title, meta description, eyebrow text as tag, hero image). So a new article needs the article HTML, its images, and a correct meta description, eyebrow `CATEGORY · SUBTOPIC` and hero. Layout changes to the guide library must go in the generator (done in PR #102: library sections use `cards guide-grid`; homepage cards unchanged).
- Image audit (Gemini): daily quota runs out after about 16 images. Latest report: 3 keep, 9 weak, 4 replace, 32 pending. Start the next run in audit mode right after the quota resets (about 07:00 UTC).
- Workflow lesson: the PR check set can be 2 runs (Image Vision Guard only runs when images change) and Site Health Monitor can wait several minutes in a queue. Merge when every listed run is green.

## Update 2026-10-22: new working protocol and division of labor
- **Protocol**: the owner starts a NEW conversation every day (old ones are deleted so context never fills up). First message of the day: "ابدأ اليوم". At the start Claude reads this file, `data/WORK_LOG.md` and the open PRs, then works without asking the owner to re-explain anything. Every finished task adds one line to `data/WORK_LOG.md` in the same PR.
- **What happened 2026-10-20 to 2026-10-21 (ChatGPT took over while Claude was blocked)**: Project Budget Planner (#127), sitemap 28 to 39 URLs (#130), mismatched photos replaced by purpose-built SVG illustrations (#132, #133, #134). PR #128 (work log, diagrams branch waiting for the Gemini quota) is still open.
- **Live audit 2026-10-22 (Claude)**: 22 guides, all 39 sitemap URLs return 200, 0 broken images. Guides per section: Storage 5, Home Design 4, Weekend Projects 9 (shown as "Plan repairs and upgrades"), Smart Home 4. About 18 Unsplash hotlinks remain in guides (risk of breakage and of topic mismatch). Weekend Projects is twice as big as the others.
- **Owner goal**: a good-looking, well-organised site for any visitor (images, diagrams, article choice), no empty or lopsided sections (merge or remove them if that is better), small daily improvements, minimal fixing.
- **Claude does**: article and page HTML/CSS/JS, structure of sections and homepage, sources and internal links, interactive tools and jsdom tests, PRs and merges after checks, state and log updates, image prompts.
- **ChatGPT does**: (1) benchmark 5 to 8 leading home DIY and smart-home sites (homepage, hero, category pages, article template, trust signals, tools) and write at most 10 small, ranked ideas to `data/COMPETITOR_BENCHMARK.md`; (2) run `image-vision-guard.yml` by workflow_dispatch after the Gemini quota resets (about 07:00 UTC) and report the verdicts; (3) generate hero images from Claude's prompts; (4) at most one small improvement PR per day on a `chatgpt/` branch.
- **No-collision rule**: before starting, list open PRs and read the last lines of `data/WORK_LOG.md`; claim the task with a line in the log; never edit the same file as an open PR.
- **Priority queue**: P1 homepage first impression (hero, featured guides, balanced categories); P2 rebalance Weekend Projects (split or move guides) so no section looks empty or lopsided; P3 replace the remaining Unsplash hotlinks with local images in batches of about 5 (prompts by Claude, owner uploads PNG); P4 one new guide per day in the weakest category; P5 merge or close PR #128.

## Update 2026-10-25: operations room, image pipeline, thermostat guide
- Trigger phrase: the owner starts every session with «غرفة العمليات اكمل العمل» (replaces the "start the day" phrase). Claude reads data/AI_COLLABORATION.md, data/WORK_LOG.md, this file and the open PRs, continues the highest-priority task that does not collide with the other assistant, and leaves a dated HANDOFF in AI_COLLABORATION.md. ChatGPT follows the same protocol.
- Image pipeline (owner decision): Claude posts an IMAGE REQUEST (path, format, prompt, alt text, branch), ChatGPT generates the image and commits it, Claude wires it into the article and merges. The owner uploads a file only as a fallback. Claude cannot move a chat attachment into GitHub; it can only convert and commit files already in the repository or created in its own workbench.
- Done 2026-10-25: #159 (cross-links evening lighting to smart lighting, crawl-space humidity to the sizing guide), #160 (ChatGPT's audit-script fix, run and reviewed by Claude), #161 and #162 (handoff and image pipeline), and the new guide smart-thermostat-without-c-wire (Smart Home, now 6 guides; 24 guides in total).
- Finding: scripts/site_visual_audit.py exits 1 with 46 issues on main because it looks for class names the templates do not use; no workflow runs it.
- Method that worked: copy the repo files into the Composio sandbox, run scripts/quality_gate.py and scripts/rebuild_site_indexes.py against the copy, decode downloaded files as UTF-8 (not response.text), and only then commit. Workbench files persist between cells in /tmp and /mnt/files within a session.
- Queue: next guide in the weakest category (candidate: bathroom fan sizing), one older article improvement per day, ChatGPT's rendered mobile and dark-mode check.

## Update 2026-10-26: bathroom fan guide merged
- Done: PR #167 merged (guide choose-bathroom-exhaust-fan, WEEKEND PROJECTS · BATHROOM VENTILATION; 3 original SVG diagrams, AI hero bathroom-fan-hero.jpg, link added from section 7 of reduce-bathroom-condensation.html). PRs #166 and #168 were docs-only handoffs. 25 guides in total; Weekend Projects now has 10 and is the largest section (P2 rebalancing is still open: this guide adds to it).
- Image flow actually used: ChatGPT did not deliver the hero. The owner generated it, sent it in chat, Claude converted it to JPG 1600x900 (113 KB) in its own container, and the owner uploaded it through the GitHub upload link on the draft branch. Claude cannot move a chat attachment into the repository.
- Image Vision Guard on PR #167: red on three runs (two read timeouts, then Gemini HTTP 503 high demand), a service outage and not a verdict on the image. quality and health were green. mergeable_state was unstable, which suggests the guard is not a required check (branch protection not inspected). Merged on 2026-10-26 with the owner's explicit approval; the hero was checked by eye only. Next guard run or the weekly audit should confirm it.
- After the merges: Pages deployment green; Site Health Monitor failed once on a 503 while the site was redeploying, and passed on re-run (all sitemap URLs, content integrity, queue checks).
- Confirmed again: guides.html cards, sitemap.xml and feed are generated at deploy; the committed copies on main do not list the newest guides, so do not hand-edit them.
- Not verified: rendered page, mobile and dark mode, and that the new URL is in the live sitemap (health check covers whatever the sitemap lists).
- Queue: older-article improvement other than drafty-door (PR #154 touches it); decide where bathroom and humidity guides belong when rebalancing; rerun the vision guard on the hero; ChatGPT's mobile and dark-mode check.

## Update 2026-10-27 (session 9)
- Merged: #177 (link from the basement bathroom guide to the fan guide), #178 (handoff), #179 (small living room guide: quick answer, walking-path diagram, links to rug-size and calm-room guides). 25 guides.
- Link audit: no inbound hand-written links to smart-thermostat-without-c-wire, small-bathroom-easier-to-clean, stop-mail-and-paper-pile. ChatGPT takes the first two (inbound links); Claude takes the Sources fix on small-bathroom-easier-to-clean.
- Queue: new guide in the weakest category (Home Design, 4 to 5 guides) with an IMAGE REQUEST; Keep going / Keep reading decision (7 articles); dark-mode and hub-page screenshots from the owner; #165 and #171 on ChatGPT's side.

## Update 2026-10-27 (session 10)
- Merged #181 (small-bathroom-easier-to-clean: EPA and USGS sources, intro under 130 words). 25 guides.
- Drafted choose-paint-finish-for-each-room (Home Design) on claude/paint-finish-guide; waiting for its hero (IMAGE REQUEST in AI_COLLABORATION.md). Home Design has 5 guides, 6 after it.
- ChatGPT still owes the inbound links to the thermostat and small-bathroom guides; #165 and #171 still open.

## Update 2026-10-28 (session 11)
- Merged: #183 (ChatGPT, inbound links to the thermostat and small-bathroom guides) and #185 (smart-lighting improved and brought back inside the quality gate). 25 guides.
- Waiting: #184 (paint finish guide) is green on quality and health; the guard fails on Gemini HTTP 503 only. Needs the owner's OK to merge past it, or a later green rerun.
- Still open on ChatGPT's side: #165, #171.

## Update 2026-10-28 (session 12)
- Merged #184 (choose-paint-finish-for-each-room, HOME DESIGN · PAINT FINISHES). 26 guides; Home Design now 6. Live: page, hero, 3 SVGs, guides, sitemap, feed and home OK (rendering not seen).
- #184 conflicted on data/WORK_LOG.md (main moved); resolved by syncing the file with main. Guard: green once on the same hero (04:35 UTC), later runs failed on Gemini read timeouts only.
- Waiting on the owner: a limited change to Image Vision Guard (503/timeout = inconclusive + human review); it touches a protected workflow file, so not started.
- Still open on ChatGPT's side: #165, #171. Queue: inbound link to the paint guide where it fits; older-article improvement (quiet-entryway-storage, simple-home-reset); next new guide in the weakest category.

## Update 2026-10-28 (session 13)
- Merged #191 (guard: service errors are inconclusive) and #192 (entryway and home-reset guides cross-linked). 26 guides. No open PRs.
- Queue: new guide in a weak category with an IMAGE REQUEST; inbound link to the paint guide where it fits; run the audit script on main (ChatGPT).

## Update 2026-10-29 (SEO baseline)
- Search Console, 3 months: 1 click, 329 impressions, CTR 0.3%, average position 21.8, 44 queries; bathroom condensation queries lead. Plan in data/SEO_GROWTH_PLAN.md; work orders for 2026-10-30 in AI_COLLABORATION.md. Smart Home has 7 guides (where-to-put-water-leak-sensors merged in #196). GoatCounter API check (data/traffic/latest.json) is UNAVAILABLE (404): needs diagnosis.

## Update 2026-10-30 (session 15)
- Merged #197 (paint link from the condensation guide, replacing the conflicted #194). 27 guides on main; Weekend Projects 10, becomes 11 with the new guide.
- Draft guide bathroom-exhaust-fan-dripping-water is on branch claude/fan-dripping-guide, waiting for its hero image (do not merge before the hero is on the branch and looked at).
- #195 (sitemap hand-edit) is redundant: the generated live sitemap already has all 44 URLs. Proposed to close.


## Update 2026-10-30 (session 15, part 2)
- Guide bathroom-exhaust-fan-dripping-water is live (PR #198) with inbound links from 3 guides (PR #199). #194 closed (superseded by #197). #195 still open pending owner decision.


## Update 2026-10-31 (operations-room verification)
- Repository main is current through PR #204. PR #202 (condensation-versus-leak diagnosis), #203 (gravity/macerator/sewage-ejector comparison) and #204 (handoff record) are merged. PR #195 is closed without merging because its sitemap change was redundant. No open PRs were returned by the open-PR endpoint.
- Checks: #202 quality/deploy/health succeeded; #203 quality and deploy succeeded while its PR-head health run was cancelled; a subsequent main health run after the merge succeeded. #204 quality and health succeeded. Do not count a cancelled run as a pass.
- GoatCounter API diagnosis from #201 remains resolved at the workflow level: `.github/workflows/traffic-report.yml` uses the existing GitHub Actions secret, and the latest `data/traffic/latest.json` snapshot (2026-10-31 03:27 UTC) reports API status OK, valid API user, no endpoint errors, and zero in its visitor/pageview totals. This is not a live query. No separate GoatCounter Composio connection was available or needed for this check.
- The claimed `docs/operations/SEO-OPTIMIZATION-MATRIX-2026-10-30.md` is not present on main. PR #130 is the earlier wall-art image and sitemap repair; it is not the matrix. Locate the actual branch/path before treating the matrix as repository-backed.
- Owner's latest timing constraint supersedes older work-order dates: compare GSC on 2026-11-05, and do not open implementation PRs for the homepage or route-page template before that comparison. Keep the measurement window clean.

## Update 2026-10-31 (session 16)
- Merged #205 (ChatGPT review record) and #206 (cable and kitchen clutter quick wins). 29 article files on main (28 guides plus the redirect stub), sitemap 46 URLs. No open PRs.
- `quality_gate.py --all` on main: 18 PASS, 11 FAIL (causes in AI_COLLABORATION.md, 2026-10-31 Claude handoff). The PR check does not catch this because it only inspects changed articles. Next: fix reduce-bathroom-condensation and macerating-toilet-basement-bathroom first, then one failing page per day.
- Constraint in force: no homepage or route-template implementation before the owner's 2026-11-05 Search Console comparison.
- Merged #207 (condensation and macerating guides back inside the gate). Gate --all now 20 PASS, 9 FAIL expected (8 guides plus the intentional redirect stub); next one page per day, Awin pages first.

## Update 2026-10-31 (session 17)
- Crawl-space dehumidifier guide brought back inside the quality gate (PR from claude/crawl-space-gate): intro split under a new H2, two captions reworded, BreadcrumbList added, one FAQ added that restates the Step 6 test. Remaining gate failures: 7 guides plus the redirect stub (wall art next, it carries an Awin link).
- Open PR #208 (ChatGPT, draft, docs only: four-engine roadmap and AI search visibility plan). Not merged: the draft says no merge is authorized and the owner has not answered. Read-only technical eligibility audit it asks Claude for was done and posted on the PR (summary in AI_COLLABORATION.md).
- Constraint still in force: no homepage or route-template implementation before the owner's 2026-11-05 Search Console comparison.

## Update 2026-10-31 (session 17, part 2)
- Merged #209 (crawl-space dehumidifier guide back inside the gate; live verified: new H2, BreadcrumbList, 4 FAQ, single Awin href, sitemap lastmod 2026-10-31). Read-only eligibility audit posted on #208 (host-root robots.txt is 404, so no bot is blocked; no per-bot policy possible on this host).
- Wall-art guide brought back inside the gate (branch claude/wall-art-gate). Remaining gate failures: drafty-door, musty towels, wobbly furniture, evening lighting, wifi outage test, motion lighting (plus the redirect stub).
- #208 stays a draft: owner has not answered; the CAO program is still to be supplied.

## Update 2026-11-01 (session 17, part 3)
- Merged #210 (wall-art guide back inside the gate; live verified). Gate --all failures left: drafty-door, musty towels, wobbly furniture, evening lighting, wifi outage test, motion lighting (plus the redirect stub).
- CAO clarified by the owner: the plan found in Fadhel-docom/auto-blog issue #109 belongs to Home Organization Ideas; HomeProjectWise has none of its own. Its useful ideas are integrated in docs/CAO-INTEGRATION.md (proposal; gaps, contradictions and owner decisions listed there). My earlier comment on #208 saying the same was deleted at the owner's request. Nothing was written to the other project's repository.

## Update 2026-11-01 (session 17, part 4)
- URL audit recorded in data/URL_AUDIT.md. Redirect stub removed from the generated sitemap and guide library (generator change; stub file kept). Long titles (13 pages) left unchanged until after the 2026-11-05 Search Console comparison.

## Update 2026-11-01 (session 17, part 5)
- Owner standing authorization (restated 2026-11-01): Claude and ChatGPT act without asking whenever the work serves the project and does not harm it; the gates (Value Before Publishing, 85/100 threshold, editorial freeze, Awin, workflows, 2026-11-05 baseline) still apply.
- Google Search Console and Bing Webmaster Tools are connected through Composio; numbers live in data/SEARCH_METRICS.md. Indexing is the current bottleneck: 21 URLs unknown to Google, key pages last crawled before our edits.
- New plan section: assets other sites need from us (docs/CAO-INTEGRATION.md section 8).

## Update 2026-11-01 (session 18)
- stop-a-drafty-door brought back inside the quality gate (PR from claude/drafty-door-gate, layout only). Remaining gate failures: musty towels, wobbly furniture, evening lighting, wifi outage test, motion lighting. Open draft PRs by ChatGPT: #208, #214 (home project calculator and tools.html), #216; none merged by Claude. Constraint unchanged: no homepage or route-template implementation before the 2026-11-05 Search Console comparison.
