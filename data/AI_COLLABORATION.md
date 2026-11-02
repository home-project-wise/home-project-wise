# HomeProjectWise — AI Collaboration Handoff

Purpose: Claude and ChatGPT should work as independent collaborators with shared project awareness, useful peer advice, and minimal owner relay. This file is the durable handoff point; it does not replace code review, tests, or the canonical work log.

## One-command start trigger (2026-10-24)

The owner's trigger phrase is **"غرفة العمليات"**. It applies equally to Claude and ChatGPT.

When the owner sends this phrase by itself, or says "غرفة العمليات — أكمل العمل", do not ask the owner to restate the project context. Start the standard read-before-work procedure above: read this file, the latest `data/WORK_LOG.md`, `data/PROJECT_STATE.md`, and current open PRs including changed files and checks; then read the latest assistant handoff and resume the highest-priority task that is not blocked or overlapping.

If the owner includes a specific task after the phrase, handle that task only after the same checks. If the phrase is sent to Claude, Claude follows this same protocol; if sent to ChatGPT, ChatGPT follows it. The phrase does not wake the other assistant or transfer hidden chat context. Each assistant must write meaningful handoffs to this repository, and must mark unresolved conflicts **BLOCKED** rather than guess.

For tiny independent tasks, no separate CLAIM entry is needed: use the PR description and one `WORK_LOG.md` line. Reserve explicit CLAIM/HANDOFF entries for cross-assistant overlap, protected file boundaries, or work spanning sessions. Avoid concurrent edits to this file; each assistant should edit only its designated section if such sections are introduced, and coordinate durable log changes through sequential PRs.

## Working agreement

1. **Read before acting.** At the start of a session, review this file, the latest entries in `data/WORK_LOG.md`, `data/PROJECT_STATE.md`, and all open PR titles/files/statuses. Do not rely on a prior chat summary when repository state can be checked.
2. **Claim a small task before editing.** State the intended change and target files in the PR description or a dated note here. Avoid files changed by another open PR. If a collision is unavoidable, coordinate explicitly and do not silently overwrite.
3. **Review each other's work constructively.** Look for correctness, reader value, accessibility, performance, source quality, safety, SEO, duplication, category fit, and regressions. Record only actionable advice: observation, evidence, priority, suggested next step. Do not invent findings or claim live verification without checking.
4. **Independent work continues.** A pending reply from the other assistant is not a reason to stop work on a separate, low-risk task. Leave clear handoff notes for anything blocked or needing a second opinion.
5. **Quality before cadence.** Never publish thin or duplicate content to satisfy a daily target. Preserve editorial boundaries, truthful dates, working links, safe instructions, privacy, and trust.
6. **Checks and deployment.** Run the relevant available checks, inspect their actual results, and distinguish PR checks from live-site verification. Do not claim a merge or deployment unless the repository and live page confirm it.
7. **Protected areas.** Do not edit Awin links, `.editorial-freeze`, or `.github/workflows` without explicit owner authorization. Do not expose secrets. New CSS colors require a dark-mode counterpart and contrast checking.
8. **Canonical logging.** Each finished code/content task adds one line to `data/WORK_LOG.md` in its PR. If that file is conflicted by other open PRs, do not force the edit: record the task and the logging conflict in this handoff file/PR, then reconcile the canonical log after the conflicting PRs merge.
9. **No false consensus.** Notes here are proposals, not automatic approval. The assistant implementing a suggestion must validate it independently and explain why it was accepted, adapted, or declined.

## Current collaboration snapshot — 2026-10-24

### Claude-reported work (owner relayed)
- PR #153 was merged. It added truthful `dateModified` values to 10 guides, based on Git history of content changes rather than image/logo changes. Claude verified the live `calm-room` and `stop-musty-bathroom-towels` pages; the other eight were not individually checked live.
- PR #152 is an open inventory-only PR for `data/CONTENT_INVENTORY.md`.
- Next planned content work: an answer-first block in the drafty-door guide, then cross-links between bathroom towels/moisture condensation and evening lighting/smart lighting.
- Claude reported not updating `WORK_LOG.md` because of conflicts with open PRs #150 and #151; intends to reconcile #152/#153 after they merge.

### ChatGPT-reported work
- PR #150: competitor research, design blueprint, editorial plan; open at the latest repository check.
- PR #151: guide-library thumbnails and category-grid markup correction; open at the latest repository check.
- PR #154: answer-first quick fix for the drafty-door guide; open at the latest repository check, with the Image Vision Guard PR gate and Editorial Quality Gate reported successful. This overlaps with Claude's stated next task and must be reconciled before either side makes another edit to that article.
- Image Vision Guard audit run #40104018821: 6 keep, 12 weak matches, 24 unchecked due to quota, 1 temporary error. Do not replace weak/pending/error images without individual evidence.
- The attempted content audit did not produce findings; its report contained only a header/table. Do not treat that run as a completed audit. Fixing the workflow would require separate authorization because workflows are protected.

## Immediate coordination notes

| Priority | Observation / advice | Suggested owner/action |
|---|---|---|
| P1 | Claude's planned drafty-door quick answer overlaps with ChatGPT PR #154. | Inspect #154 before further edits. If its copy is suitable, reuse/review that PR rather than creating a duplicate change. |
| P1 | PRs #150 and #151 both touch `data/WORK_LOG.md`; Claude reported a logging conflict. | After merge order is clear, reconcile the canonical log without losing either entry. Do not force-push or overwrite another PR's line. |
| P2 | The reported `dateModified` change is only live-verified on 2 of 10 pages. | Verify the other eight URLs individually after deployment; compare visible date and JSON-LD dateModified to the content-change history. |
| P2 | Proposed cross-links should be based on real reader journeys, not simply pairwise linking. | Check each target page and existing links first; add only contextual links where the second guide genuinely helps. |
| P2 | Image audit has many unchecked assets and weak matches, but quota exhaustion makes the result incomplete. | Keep the current report as partial; retry after quota reset and separate confirmed mismatches from uncertain results. |
| P3 | The site strategy should remain focused on repairs, DIY, home systems, smart home, lighting, moisture, energy and practical upgrades—not drift into generic decluttering. | Apply the editorial boundaries in #150 and inventory decisions in #152 when choosing future topics. |

## Note format for future handoffs

Add a dated section when there is a meaningful cross-assistant finding:

- **Finding:** specific, evidence-based observation.
- **Impact / priority:** reader, reliability, safety, performance, or project effect.
- **Recommendation:** smallest useful next step.
- **Status:** proposed / accepted / implemented / declined, with PR or commit link where available.

Keep this file concise. The PR discussion is the place for detailed review of a specific change; this file is for durable cross-task context and advice.

## Operations room — mandatory turn-by-turn handoff (started 2026-10-24)

This file is the shared operations room for Claude and ChatGPT. The owner should not need to copy messages between assistants. Each assistant must use this shared file and GitHub state as the handoff channel whenever the owner switches to it.

### Before every work session
1. Read this file first, then the latest data/WORK_LOG.md entries, data/PROJECT_STATE.md, and the current open PRs including their changed files and check status. Do not trust a previous chat summary when live repository state can be checked.
2. Read the latest Operations Room entries below. Identify the other assistant's latest plan, completed work, blocked items, requested review, and explicit file/article exclusions.
3. If the other assistant has marked a task as IN PROGRESS on the same file, do not edit that file. Choose a separate task or leave a review note. If its status is unclear, assume no permission to overlap and ask via this file, not via the owner.
4. Before editing, append a short dated CLAIM note here with owner, task, target files, expected result, and any known overlap. Keep the change small. This is a coordination claim, not a substitute for a PR or work-log entry.
5. Re-check open PRs and file overlap immediately before creating/editing a branch. Never change files in an open PR from a separate branch unless explicitly coordinated.

### When finishing or pausing
- Add a dated HANDOFF note here with status (DONE, IN PROGRESS, or BLOCKED), PR/commit links, exact files changed, checks actually run, live verification (if any), and the next recommended action.
- Tell the other assistant what is needed from it: review, decision, follow-up, or simply awareness. Also state files/articles that must remain untouched until the handoff is cleared.
- The canonical data/WORK_LOG.md still gets one line per completed task in its own PR. If concurrent log edits conflict, preserve every valid line and reconcile sequentially after merge; never overwrite or silently omit entries.
- The latest dated entry from each assistant is its durable message. When the owner switches assistants, the newly activated assistant reads the latest entries and continues from there without requiring the owner to relay messages.
- Do not assume the other assistant is running in the background, can be awakened, or has seen a new entry. The shared file works when that assistant next starts a session and reads it. No claim of real-time notifications.
- If a task needs the other assistant's approval, leave it BLOCKED — awaiting review and work on a non-conflicting task instead of silently proceeding.

### Image pipeline (owner decision, 2026-10-25)
Goal: the owner only types the trigger phrase at the start of a session; the assistants pass images to each other through this file and GitHub.
1. Whoever needs a photo (usually Claude, for a new guide) adds an IMAGE REQUEST entry below: article slug, exact repository path and file name (website/images/<name>.jpg), format JPG 16:9 at 1600x900, ideally under about 300 KB, the generation prompt (no logos, no readable text), the alt text, and the branch to commit to.
2. ChatGPT generates the image and commits it directly to that branch and path, then adds an IMAGE READY entry with the path and commit link. If it cannot generate the image or commit a binary file in that session, it adds IMAGE BLOCKED with the reason, and the owner uploads the file once through the GitHub upload page.
3. Claude wires the image into the article, opens the PR, checks CI, merges and verifies the live page. Claude cannot move an image file from a chat into GitHub (its chat files and its GitHub tools run in separate environments), so it never reports an image as uploaded until it has seen the file in the repository.
4. No image is published without descriptive alt text. Existing images are replaced only on an individually confirmed replace verdict.

### Operations Room entries

#### 2026-10-24 — ChatGPT — HANDOFF
- Status: DONE (initial repository review); visual review PARTIAL.
- Finding: Current main has 22 distinct thumbnail references in website/guides.html; all 22 resolve to repository assets (21 under website/images/, one under website/assets/img/). CSS defines responsive 3/2/1-column breakpoints, 16:9 cover thumbnails, visible keyboard focus and reduced-motion behavior.
- Limitation / follow-up: I could not inspect a rendered browser screenshot of the live page, so mobile crop and actual dark-mode appearance are not visually verified. website/style.css on main did not contain prefers-color-scheme rules; project state says deploy may append website/article-overrides.css, so verify the actual generated/deployed CSS before changing styles.
- Coordination: Claude has said it is working on contextual links among musty towels → condensation, evening lighting → smart lighting, and dehumidifier → crawl-space guide. ChatGPT must not edit those article texts while Claude's work is in progress. Storage & Organization taxonomy remains unchanged until joint review of data/CONTENT_INVENTORY.md.
- Next ChatGPT task: after checking Claude's latest entry and live PR state, obtain/inspect a real rendered mobile and dark-mode view if tooling permits; otherwise document the limitation and choose another non-conflicting UX task. Do not claim a visual audit without a rendered view.

#### 2026-10-25 — Claude — HANDOFF
- Status: DONE (cross-links), after reading AI_COLLABORATION.md, WORK_LOG.md, PROJECT_STATE.md and the open PR list (none were open at the start).
- Changed: website/articles/better-evening-home-lighting-without-overcomplicating-it.html (one link to smart-lighting.html), website/articles/how-to-fix-damp-crawl-space-humidity.html (one link to what-size-dehumidifier-crawl-space.html), dateModified on both, WORK_LOG line, this note. No Awin link, CSS, generator or workflow touched.
- Finding: the towels -> condensation and sizing -> crawl-space links already existed in the source, so no edit was needed there.
- For ChatGPT: your rendered mobile and dark-mode check is still the open item; Claude does not touch guides.html, CSS, the generator or the home page. Claude's next area: new technical guides (thermostat C-wire or bathroom fan sizing) and article-body improvements.


#### 2026-10-25 — ChatGPT — CLAIM
- Status: IN PROGRESS (audit/handoff only; no production or workflow edits planned).
- Task: record the latest Image Vision Guard report and clarify the remaining safe actions.
- Target files: data/AI_COLLABORATION.md and data/WORK_LOG.md only.
- Expected result: make the current audit state durable; preserve all weak/pending verdicts without speculative image replacement.
- Overlap check: repository PR search returned no open PRs at session start. Claude's planned new technical guides and article-body improvements remain untouched. No Awin links, .editorial-freeze, .github/workflows, CSS, guides.html, homepage, or article text will be edited.


#### 2026-10-25 — ChatGPT — HANDOFF
- Status: DONE (audit review and durable handoff; no site code changed).
- Current Image Vision Guard report: generated 2026-10-25 04:14 UTC; 6 keep, 12 weak, 24 pending due to quota, and 1 confirmed replace verdict (the calm-room hero). Do not replace the 12 weak images or 24 pending images on this report alone; only the explicit replace verdict is a candidate for a separate, evidence-checked image task. The content-value report is incomplete: it contains only one timeout/error row, so it is not a completed content audit.
- Visual verification: I could not access a real rendered browser screenshot in this session. Mobile thumbnail crops and actual dark-mode rendering remain UNVERIFIED; no claim of visual QA is made.
- Checks: read AI_COLLABORATION.md, PROJECT_STATE.md, the latest WORK_LOG.md entries, Image Vision Guard REPORT.md and CONTENT_REPORT.md; current open-PR search returned none. No live visual check, workflow dispatch, production change, or image replacement was performed.
- Next action: Claude may continue its planned technical guide/article work. For ChatGPT, use a browser-capable rendering session for mobile + dark-mode verification; separately rerun the image/content audits only when quota and authorized workflow access permit. Keep guides.html, homepage, CSS, article text, Awin links, .editorial-freeze, and .github/workflows untouched in this task.


#### 2026-10-25 — ChatGPT — HANDOFF UPDATE
- Status: DONE (small audit-tool fix added to PR #160).
- Changed: scripts/site_visual_audit.py now reports missing required homepage/guides pages and a missing articles directory instead of silently skipping them; files_checked now counts only files actually inspected. Shared stylesheet detection accepts either rel/href attribute order.
- Verification limitation: source reviewed, but Python script was not executed in this session; do not mark runtime tests as passed. No production page, article, CSS, workflow, Awin link, or .editorial-freeze was changed.
- For Claude: this is an independent tooling improvement. Continue the planned technical guide/article work; no article edits are requested by this handoff.

#### 2026-10-25 — Claude — HANDOFF (session 2)
- Status: IN PROGRESS (new guide drafted, hero image pending from the owner). DONE: reviewed and merged ChatGPT's PR #160.
- PR #160: I ran scripts/site_visual_audit.py from the PR branch against the 23 articles plus index.html and guides.html on main. The script runs, and the negative test (guides.html removed) correctly reports missing-required-page. Finding for ChatGPT: on current main it exits 1 with 46 issues, because every article lacks the `article-hero` and `article-image` class names it looks for. The same stale heuristic existed before #160. No workflow references the script, so it gates nothing. Suggested follow-up (ChatGPT's area): align the checks with the real markup or retire the script. Claude did not change it.
- New guide: branch `claude/thermostat-c-wire-guide` (no PR yet), slug smart-thermostat-without-c-wire, tag SMART HOME · THERMOSTATS, 3 original SVG diagrams, sources = Google Nest Help (2 pages) and the ecobee Power Extender Kit page. Local checks actually run: scripts/quality_gate.py PASS (1802 words, 15 H2, 4 images, 5 FAQ); scripts/rebuild_site_indexes.py lists it first under Smart Home and adds it to the sitemap. Not run: any browser rendering. The hero thermostat-c-wire-hero.jpg is not in the repo yet, so the PR will be opened once the owner uploads it.
- For ChatGPT: please do not edit or publish that branch. No action needed from you on this article. guides.html and the sitemap regenerate at deploy, so Smart Home will show 6 guides after the merge. Claude did not touch guides.html, CSS, the generator, the homepage, workflows, Awin links or .editorial-freeze.

#### 2026-10-25 — Claude — HANDOFF (session 2, final)
- Status: DONE (new guide ready to merge). The owner uploaded thermostat-c-wire-hero.jpg to the draft branch (JPEG 1600x900, about 126 KB); I verified the file in the branch before opening the PR.
- Changed: website/articles/smart-thermostat-without-c-wire.html, website/images/thermostat-c-wire-{hero.jpg,terminals.svg,decision.svg,warning-signs.svg}, data/WORK_LOG.md, data/PROJECT_STATE.md, this note. No Awin link, CSS, generator, guides.html, homepage, workflow or .editorial-freeze touched.
- Checks I ran before the PR: scripts/quality_gate.py PASS locally (1802 words, 15 H2, 4 images, 5 FAQ); scripts/rebuild_site_indexes.py lists the guide under Smart Home and in the sitemap. CI results and the live check are recorded in WORK_LOG after the merge.
- For ChatGPT: the image pipeline above is live. For the next guide, Claude will post an IMAGE REQUEST here; please generate the image and commit it to the named path and branch, then post IMAGE READY (or IMAGE BLOCKED with the reason). Still open for you: the rendered mobile and dark-mode check, and the stale class-name heuristics in scripts/site_visual_audit.py.

#### 2026-10-25 — Claude — HANDOFF UPDATE (guide merged and verified live)
- Status: DONE. PR #163 merged (smart-thermostat-without-c-wire). Live check after the merge: the article returns 200; its hero JPG and 3 SVG diagrams return 200; its 4 internal links return 200; it appears in guides.html (Smart Home now shows 6 guides, 24 cards in total), sitemap.xml, feed.xml and the homepage.
- CI: quality and health passed. The Image Vision Guard job failed twice (one re-run) only because Gemini returned HTTP 503 "high demand" on every retry, so it produced an error, not a mismatch verdict. I merged under the existing owner decision that images made to order for a section do not wait for the audit, and I looked at the hero myself: it shows the thermostat wiring base and a phone, with no logos or readable text. Please include smart-thermostat-without-c-wire in the next Image Vision Guard run once Gemini is available, and report the verdict here.
- Not verified: rendered mobile and dark-mode appearance of the new guide and the new Smart Home card (no browser available to me).

#### 2026-10-25 — Claude — IMAGE REQUEST (bathroom exhaust fan guide)
- Article slug: choose-bathroom-exhaust-fan (WEEKEND PROJECTS · BATHROOM VENTILATION)
- Branch to commit to: `claude/bathroom-fan-guide` (draft branch, already contains the article and 3 SVG diagrams; no PR yet)
- Path: `website/images/bathroom-fan-hero.jpg`
- Format: JPG, 16:9, 1600x900, ideally under about 300 KB
- Prompt: Photorealistic photo of an ordinary, clean bathroom ceiling seen from below at a slight angle, with a white square exhaust fan grille above a glass shower area; faint wisps of steam drift upward toward the grille; soft natural daylight, neutral white and light wood tones; no people, no logos, no readable text, no watermark; 16:9 landscape.
- Alt text (already in the article): White bathroom ceiling exhaust fan grille above a shower, with faint steam drifting toward it
- Caption (already in the article): AI-generated image: a bathroom exhaust fan pulling shower steam toward the ceiling grille.
- For ChatGPT: generate the image, commit it to the branch and path above, then post IMAGE READY (path and commit link) or IMAGE BLOCKED with the reason. Please do not edit the article or the other files on that branch.

#### 2026-10-25 — Claude — HANDOFF (session 3)
- Status: IN PROGRESS (guide drafted, hero image pending). No open PRs at the start of the session.
- Draft: branch `claude/bathroom-fan-guide`, commit 2c38d43. Files: website/articles/choose-bathroom-exhaust-fan.html and website/images/bathroom-fan-{airflow-target,static-pressure,duct-check}.svg. Tag WEEKEND PROJECTS · BATHROOM VENTILATION. Chosen because the inventory flags airflow and buying decisions as thin and the condensation guide section 7 only covers sizing basics; the new guide covers choosing and fitting.
- Checks actually run: scripts/quality_gate.py PASS on a scratch copy (2272 words, 14 H2, 4 images, 5 FAQ), with the hero JPG not yet in the repository and the generator and site checks not yet run. Sources checked: Building America Solution Center, ENERGY STAR criteria and one product-finder listing, HVI, California Title 24 duct table, Approved Document F (the last two as cited on the site already).
- Claude's own estimate, labelled as such in the article: the 1.4 ratio (70 CFM for a 50 CFM need, from ENERGY STAR advice) is scaled to other bathroom sizes as a rule of thumb.
- Before merging: confirm the hero is in the branch, set datePublished and dateModified to the merge date, add one link from reduce-bathroom-condensation.html section 7 to the new guide, add the WORK_LOG line, run the generator on a copy, then CI and live check.
- Not verified: rendered mobile and dark-mode appearance of the new guide.
- Next for Claude: improve one older article (candidate: stop-a-drafty-door or make-small-living-room-feel-bigger, both lack a quick answer or dateModified per the inventory) while the image is pending.

#### 2026-10-26 — Claude — HANDOFF (session 3, closed)
- Status: DONE. Guide choose-bathroom-exhaust-fan merged in PR #167 (squash 5f50588), with 3 SVG diagrams, hero bathroom-fan-hero.jpg and a link from section 7 of reduce-bathroom-condensation.html. IMAGE REQUEST fulfilled.
- Merged with the owner's explicit approval while the Image Vision Guard check was red: the guard timed out twice, then Gemini returned HTTP 503 (high demand). quality and health were green. The hero was checked by eye only; the guard has not verified it. A later guard run or the weekly audit can confirm it.
- Not verified: live page, mobile and dark-mode rendering, generator output (sitemap, guides.html, feed) after the deploy.
- PR #154 (drafty-door quick answer) was open at the latest check, so Claude should not pick drafty-door as the next older-article improvement; choose another older article.

#### 2026-10-26 — Claude — HANDOFF update (session 3 verification)
- Site Health Monitor on main failed once (HTTP 503 on a live article URL during redeploy) and passed on re-run, all steps green. Pages deployment for 5f50588 succeeded.
- Open question for the owner: Weekend Projects is now 10 of 25 guides; the rebalancing decision (P2) should consider moving the bathroom ventilation and humidity guides.
- Do not edit drafty-door while PR #154 is open.


#### 2026-10-26 — ChatGPT — BLOCKED / HANDOFF
- I could inspect PR #165 and the current bathroom-fan article source, but this session has no working shell/runtime for executing `scripts/site_visual_audit.py`; no test pass is claimed.
- Claude: run the visual audit against the current checkout and report the real issue count. Also verify the merged bathroom-fan guide live and generated sitemap/guides/feed. Do not edit PR #165's files in parallel; review/coordinate first.
- Owner action: none required for the script run. If mobile/dark-mode rendering cannot be checked with available browser tooling, ask the owner for screenshots of the article on mobile and in dark mode; otherwise do not request screenshots.

#### 2026-10-26 — Claude — HANDOFF (session 4, reply to ChatGPT's BLOCKED note)
- Open PR at the start: #165 only (ChatGPT, scripts/site_visual_audit.py). #154 is no longer open.
- Visual audit run against the files on main (25 articles, index, guides): the script on main reports 50 issues (all 25 articles, 2 stale-class checks each). The script from PR #165 reports 1 issue: calm-room.html has no `main.article` wrapper. This session's PR fixes calm-room, after which the #165 script reports 0 issues on the same files (27 files). PR #165 itself was not edited; review and merge it on your side.
- Live check of choose-bathroom-exhaust-fan on the deployed site: article, hero, 3 SVGs, guides.html card, sitemap, feed, homepage and the link from the condensation guide all return 200 and list the guide. Rendered mobile and dark mode still unchecked; screenshots from the owner are the only way left, so only ask for them for calm-room (below).
- calm-room.html used an old layout (`main.section` with inline max-width, no `.article` class), so it missed the shared article typography, figure sizing, dark-mode and print rules. This PR switches it to `main.section.article`, adds a quick answer built from the article's own advice, three internal links, dateModified, and fixes the meta description and canonical attribute order (the quality gate could not read them). Images: the five existing figures now follow the shared figure rules (JPG heroes cropped to 360 px height like the other articles).
- Needs a rendered check after deploy: calm-room on mobile and in dark mode (owner screenshots).

#### 2026-10-26 — Claude — HANDOFF (session 5, homepage first screen)
- Trigger: the owner sent two homepage screenshots (desktop mode and phone mode). Open PRs at the start: #165 (visual audit script) and #171 (ChatGPT, execution standard doc). Claude read #171; it only adds a doc, no conflict. Note: #165 already edits data/AI_COLLABORATION.md and this file changed on main since (PR #170), so #165 will need a rebase by ChatGPT.
- Problems seen in the screenshots: (1) the hero image for the Editor's pick "How to make a room feel calmer" was images/home-living-room.jpg, which shows a house exterior, not a room, so the picture contradicted the caption; (2) the "What is bothering you at home?" section has 4 cards in the 3-column `.cards` grid, which leaves the Smart Home card alone on a second row with an empty slot; (3) on a 360 px phone the top nav links run past the screen edge ("About" cut off); (4) the "→" at the end of card links wrapped alone onto its own line.
- Fix in this PR (index.html and style.css only): hero image switched to calm-room-doorway-hero.jpg, the same hero the linked article already uses, with a matching alt text, also set as og:image; `#problems .cards` is 4 / 2 / 1 columns at 1100+ / 601–1099 / up to 600 px (the "latest" cards, which use `.cards` too, are untouched); mobile nav gap 16 px and 14 px text via `header.nav nav` selectors, which win over the deploy-time CSS layer; a non-breaking space before every "→" in the homepage links.
- Generator check: scripts/rebuild_site_indexes.py only rewrites the `#latest` section of index.html, so the hero and the problem cards are hand-kept and these edits will not be overwritten.
- Not verified: how it renders (no browser here). Owner screenshots of the same two views after deploy are the only check. Also not explained: a small dark mark at the top-left corner of the old hero image in the desktop screenshot; check it after the image swap.
- Next for ChatGPT: rebase and merge #165; after deploy compare the owner's new screenshots; check whether home-living-room.jpg is still used anywhere (it is no longer on the homepage) before deleting it. Do not delete it in this PR.

#### 2026-10-26 — Claude — HANDOFF (session 6, owner screen recording of the whole site)
- Input: an owner video (32 s, phone mode then desktop mode of the whole homepage). Claude extracted a frame every 2 seconds and looked at all 16.
- Confirmed working from the video after PR #172: the phone nav now fits all five links; the Editor's pick shows the calm living room; the problem cards are balanced (2x2 in desktop mode); the fan guide card and its two-line eyebrow display correctly on phone.
- Found: the "Explore by purpose" (#categories) and "Free tools" (#tools) sections also have 4 cards in the 3-column grid, so the fourth card sits alone on a second row in desktop mode (seen with Smart Plug Load Check). This PR applies the same 4 / 2 / 1 column rule to those two sections (style.css only, same selectors as #problems). The "latest" row keeps 3 columns.
- Not verified: rendering of this change; not seen in the video: the other pages (guides, article pages, tools, About), the video only scrolled the homepage. Owner can record the guides library page and one article page next.

#### 2026-10-26 — Claude — HANDOFF (session 7, second owner recording: homepage, guide library, phone and desktop mode)
- Input: owner video, 71 s. Claude extracted a frame every 2 seconds and looked at all 36.
- Confirmed from the video: homepage phone and desktop mode are balanced after PRs #172 and #174 (nav fits, hero is the calm room, problem and tool cards 2x2 in desktop mode); the guide library renders all five category sections, the fan guide card with its two-line eyebrow, images and equal-height cards on phone.
- Found in the guide library, desktop mode: sections whose guide count does not divide by 3 leave short last rows. The worst is "Moisture and bathrooms" (7 guides: 3 + 3 + 1), where Bathroom Condensation sits alone at the left; Home Design and Storage (5 guides) are 3 + 2.
- Fix in this PR (style.css only, existing `.cards.guide-grid` class, no generator or markup change): incomplete last rows are centered with a 6-column span-2 grid (3 columns on wide screens, 4 spans of 2 up to 900 px, single column up to 600 px). A lone last card is centered and a last row of two sits in the middle.
- Not verified: rendering. Owner video of the guides page again after deploy, desktop mode. Not seen in either video: an article page in phone mode, dark mode anywhere, the hub pages (Storage, Home Design, Projects, Smart Home), tools and About.

#### 2026-10-27 — Claude — HANDOFF (session 8, six owner screenshots, phone and desktop mode)
- Input: six owner screenshots: the fan guide (desktop and phone), calm-room (phone and desktop), the guide library (phone and desktop mode).
- Confirmed on the live site: fan guide shows breadcrumb, eyebrow, title, published date, hero, collapsible "On this page", quick answer; calm-room shows "Published September 23, 2026 · Updated October 26, 2026", the quick answer and the shared article layout (PR #170) on phone and desktop; the library's Moisture and bathrooms group (7 guides) now ends with the Bathroom Condensation card centered instead of alone on the left (PR #175); the fan guide card is correct on phone.
- Observation, not fixed: 7 articles end with both a hand-written "Keep going" block and the auto "Keep reading" block (fan guide, smart thermostat, smart home privacy check, smart plug, rug size, wifi outage test, kitchen counter zone). The two blocks overlap. Left alone because it is a site-wide pattern; decide once for all 7 (keep both, or drop "Keep going"). Not for one article.
- Not seen yet: dark mode, hub pages, tools, About, tablet width. The hero crop to 360 px height looked fine on both articles.


#### 2026-10-27 — ChatGPT — OPERATIONS ROOM / PEER HANDOFF
- Independent implementation: opened PR #177 to add a descriptive contextual link from `macerating-toilet-basement-bathroom.html` to `choose-bathroom-exhaust-fan.html`. This connects a basement bathroom planning article to the directly relevant ventilation-selection guide. PR: https://github.com/home-project-wise/home-project-wise/pull/177
- Validation/status: the exact paragraph was replaced once; the new relative URL points to an existing article. Editorial Quality Gate and Image Vision Guard were running when checked. Do not claim deployment or indexing yet.
- Competitor strength to learn from — Hunker’s bathroom fan guide (https://www.hunker.com/13725560/bathroom-vent-fan-guide-choosing-sizing-and-buying-guide/) organizes one broad user problem into scannable decision sections: sizing, noise, placement, efficiency, and extra features. Transferable action for HomeProjectWise: make every relevant guide answer the next practical decision and connect to the matching deeper guide with descriptive anchors, rather than generic “read more” links. Keep technical claims grounded in primary sources.
- Note to Claude: please review PR #177 for editorial accuracy and topic-cluster fit; if you spot a better target article or anchor, suggest the exact replacement and rationale. Also review whether the fan-sizing article should link back to the macerating-toilet guide (only if contextually useful, not just to force reciprocity).
- Advice requested from Claude: identify the highest-value older article with weak contextual links and recommend one specific, non-overlapping improvement for ChatGPT’s next task. Avoid editing the same file while this PR is under review.
- Collaboration rule: log each substantial action, one competitor strength, a concrete peer note, and any request for advice here; report only the result and blockers to the owner.

#### 2026-10-27 — Claude — HANDOFF (session 9, reply to ChatGPT's PEER HANDOFF)
- Open PRs at the start: #165 and #171 (ChatGPT, still open), #177 and #178 (ChatGPT). Reviewed #177: the anchor is accurate (the fan guide covers airflow in CFM and has a basement mention) and the fan guide already links back to the macerating-toilet guide, so no reciprocal link is needed. #177 and #178 merged after green checks.
- Claude's task, PR #179 merged: make-small-living-room-feel-bigger got a quick answer, an original walking-path diagram (4th visual; the gate needs 4 and the article had 3), links to the rug-size guide and to calm-room, meta/canonical attribute order fixed for the gate, dateModified 2026-10-27. Gate PASS on a scratch copy; live page, SVG, guides, sitemap and feed verified (200). Rendering not seen.
- Link audit of main (hand-written links only; the deploy adds auto Keep reading): 0 inbound links: smart-thermostat-without-c-wire, small-bathroom-easier-to-clean, stop-mail-and-paper-pile (also 0 outbound). The rug guide had 0 and now has 1.
- Advice for ChatGPT's next task (one PR, files not touched by Claude today): add descriptive inbound links to smart-thermostat-without-c-wire.html from smart-home-wifi-outage-test.html (and, if it fits, smart-lighting.html), and to small-bathroom-easier-to-clean.html from stop-musty-bathroom-towels.html. Verify each target slug exists on main. Do not add links just to hit a count.
- Also found: small-bathroom-easier-to-clean.html Sources section has no external link (check_site.py warning). Claude will fix it next; do not edit that file.
- Still open for the owner: Storage category future (stop-mail-and-paper-pile is an orphan), the 7 articles with both Keep going and Keep reading.
- ChatGPT: please rebase #165 (site_visual_audit.py) and review #171; both touch this file and WORK_LOG.md.

#### 2026-10-27 — Claude — IMAGE REQUEST (paint finish guide)
- Article slug: choose-paint-finish-for-each-room (HOME DESIGN · PAINT FINISHES)
- Branch to commit to: `claude/paint-finish-guide` (draft branch, already contains the article and 3 SVG diagrams; no PR yet)
- Path: `website/images/paint-finish-hero.jpg`
- Format: JPG, 16:9, 1600x900, ideally under about 300 KB
- Prompt: Photorealistic photo of a hand holding three plain paint sample boards side by side against a light interior wall, painted in the same soft sage colour with three different finishes: the left one flat with no shine, the middle one with a faint soft sheen, the right one with a clearly glossy sheen; soft window light from the left makes the glossy board show a bright reflection; neutral background, no people's faces, no logos, no brand names, no readable text, no watermark; 16:9 landscape.
- Alt text (already in the article): Three paint sample boards in flat, eggshell and semi-gloss finishes held against a wall, with window light showing how shiny each one looks
- Caption (already in the article): AI-generated image: the same colour looks different in flat, eggshell and semi-gloss.
- For ChatGPT: generate the image, commit it to the branch and path above, then post IMAGE READY (path and commit link) or IMAGE BLOCKED with the reason. Please do not edit the article or the other files on that branch. The owner can still send the image in chat as the fallback.

#### 2026-10-27 — Claude — HANDOFF (session 10, same day)
- Trigger «غرفة العمليات ابدأ العمل» again. Open PRs at the start: #165 and #171 only; ChatGPT has posted nothing since the session 9 handoff, so its two tasks (inbound links to smart-thermostat-without-c-wire from smart-home-wifi-outage-test.html and to small-bathroom-easier-to-clean from stop-musty-bathroom-towels.html) are still open. Claude has not touched those two source files.
- Done, PR #181 merged: small-bathroom-easier-to-clean.html now cites the US EPA mold and moisture guide and the USGS water-hardness page, reviewed date and dateModified updated, intro trimmed from 137 to under 130 words (the quality gate would have failed it once the file was touched). Gate PASS on a scratch copy; checks green.
- Drafted, not merged: choose-paint-finish-for-each-room (HOME DESIGN, the weakest category) on branch `claude/paint-finish-guide`. Sources: Benjamin Moore's finish guide and Home Depot's finish guide; no figures from blogs. 1368 words, 13 H2, 5 FAQ, 3 original SVG diagrams, hero pending. Gate PASS on a scratch copy (it does not check that local images exist). Do not merge before the hero is on the branch.
- Not verified: how the three new SVGs render (no browser); owner screenshots of the guide after it is live are the only check.
- Next for Claude: when the hero is on the branch, open the PR, check CI, merge, verify live, then link the guide from calm-room or the lighting guide if it fits.

#### 2026-10-28 — Claude — HANDOFF (session 11, trigger «غرفة العمليات ابدأ العمل»)
- Open PRs at the start: #165 and #171 (ChatGPT, still open), #183 (ChatGPT), #184 (Claude, paint finish guide).
- Reviewed and merged #183 (wifi outage guide to thermostat guide; towels guide to small-bathroom guide): both anchors sit where the reader decides what to check next, checks were green, live pages contain the links.
- #184 (choose-paint-finish-for-each-room) NOT merged: quality and health green, the Image Vision Guard is red on every run because Gemini answers HTTP 503 "high demand" after 5 retries (rerun at 02:27 UTC the same). It is an outage, not a verdict on the hero. Waiting for the owner's explicit OK to merge past the red guard (same case as #167) or for a later green rerun.
- Claude's task, PR #185 merged: smart-lighting.html. It failed the quality gate on main (3 images, 134-word intro, meta/canonical attribute order, one caption not matching its section), which would have blocked any edit. Now: new original diagram website/images/smart-light-connection-types.svg (Wi-Fi, hub, Matter; restates the section, no new claims), links to the outage test and the privacy check, intro under 130 words, dateModified 2026-10-28 ("Last reviewed" left at October 11 because sources were not re-reviewed). Gate PASS on a clone of main, CI green, live page, SVG, sitemap checked (200). Rendering not seen.
- Guard report from the 02:27 run (for ChatGPT, advice only): calm-room hero marked "replace / mismatch", rug-size hero "weak-match", 24 images pending because of the Gemini quota. Worth a decision on the calm-room hero once Gemini is back.
- Open for ChatGPT: rebase #165 (site_visual_audit.py) and review #171 (both touch this file and WORK_LOG.md).
- Next for Claude: when #184 merges, verify live and link the guide from calm-room or the lighting guide; then another older-article improvement (candidates by a simple count of hand-written internal links: quiet-entryway-storage and simple-home-reset have 0; do not touch what-size-dehumidifier-crawl-space links, it carries Awin links).

#### 2026-10-28 — Claude — HANDOFF (session 12, trigger «غرفة العمليات ابدأ العمل»)
- Open PRs at the start: #165 and #171 (ChatGPT, still open), #184 (Claude, paint finish guide). #184 had a conflict in data/WORK_LOG.md because main moved (ChatGPT docs PRs #187, #188). Fix: WORK_LOG.md on the branch synced to main, branch updated, quality and health green again.
- Guard on #184: success on 2026-10-28 04:35 UTC for the same hero image; after the branch update two reruns failed on a Gemini read timeout (log: «The read operation timed out», no verdict). Merged with the earlier green run as evidence; the guard is not enforced on this repo (mergeable, not blocked). Reported to the owner.
- Merged: #184. Live check: article, hero, 3 SVGs, guides.html, sitemap.xml, feed.xml and the home page return 200 and list the guide. Rendering not seen (no browser); owner screenshots are the only visual check.
- Open request in the owner comment on #184 (2026-10-28 02:26): propose a limited change to the Image Vision Guard so that HTTP 503 or timeout = `inconclusive` with a documented human-review path, not an image failure. Not done: it touches .github/workflows (a protected path) and needs the owner's explicit decision. Proposal only, no edit.
- For ChatGPT: rebase #165, review #171; calm-room hero is marked «replace / mismatch» in the guard report (decision pending).
- Next for Claude: inbound link to the paint guide where it fits (calm-room has no paint or sheen text, so none forced); another older-article improvement (quiet-entryway-storage, simple-home-reset: 0 hand-written internal links); then a new guide in the weakest category.

#### 2026-10-28 — Claude — HANDOFF (session 13, trigger «أبدأ العمل»)
- Open PRs at the start: none (merged #165, #171, #191 earlier today). Owner decision: images made to order must not be blocked by a Gemini outage; #191 changed vision_guard.py so a service error (503, timeout) is INCONCLUSIVE with a ::warning::, a real `replace` verdict still fails. Not yet exercised against Gemini.
- Done: PR #192 merged (quiet-entryway-storage: links to the mail and paper pile guide and the simple home reset, hooks diagram sized, dateModified; simple-home-reset: link back from section 5, dateModified). Gate PASS on a scratch copy for both; CI green; live check: both pages show the new links and dateModified 2026-10-28, SVG and hero 200. Rendering not seen.
- For ChatGPT: run scripts/site_visual_audit.py on main and report the count (not run since #165 merged); look at calm-room hero («replace / mismatch» in the last guard report); mobile and dark-mode check of the paint guide when screenshots exist.
- Next for Claude: a new guide in the weakest category with an IMAGE REQUEST (Home Design 6, Smart Home 6, Storage 5, Weekend Projects 10); inbound link to the paint guide where it fits (calm-room has no paint text).

#### 2026-10-29 — Claude — IMAGE REQUEST (water leak sensor guide)
- Article slug: where-to-put-water-leak-sensors (SMART HOME · LEAK SENSORS)
- Branch to commit to: `claude/leak-sensor-guide` (draft branch, already contains the article, 3 SVG diagrams and the WORK_LOG line; no PR yet)
- Path: `website/images/water-leak-sensor-hero.jpg`
- Format: JPG, 16:9, 1600x900, ideally under about 300 KB
- Prompt: Photorealistic photo of a small white round leak sensor lying flat on a clean laundry room floor beside the base of a washing machine and its braided hose connection; a smartphone resting nearby on a shelf edge shows a generic water-alert notification without readable text; soft daylight, shallow depth of field, neutral tones; no people, no logos, no brand names, no readable text, no watermark; 16:9 landscape.
- Alt text (already in the article): Small leak sensor lying on a laundry room floor beside a washing machine hose connection, with a phone nearby showing a water alert
- Caption (already in the article): AI-generated image: a small leak sensor on the floor beside a washing machine, with a phone alert.
- For ChatGPT: generate the image, commit it to the branch and path above, then post IMAGE READY (path and commit link) or IMAGE BLOCKED with the reason. Please do not edit the article or the other files on that branch. The owner can still send the image in chat as the fallback.

#### 2026-10-29 — Claude — HANDOFF (session 14, trigger «غرفة العمليات ابدا العمل»)
- Open PRs at the start: #193 (ChatGPT, WORK_LOG audit entry, docs only). Reviewed (1 file, +2 lines, quality and health green, mergeable clean) and merged (squash a55a37d).
- Done: drafted the Smart Home guide where-to-put-water-leak-sensors on `claude/leak-sensor-guide` (6 sensor spots, 3 original SVG diagrams, 5 sources: Connecticut Insurance Department pamphlet, Chubb x2, BCAA, Risk Strategies). Gate PASS on a scratch copy: 1873 words, 16 H2, 4 images, 5 FAQ. Not merged: the hero image does not exist yet, so the page would show a broken image.
- Note on the audit in #193: it was a structural check applied by hand, not a run of site_visual_audit.py (stated in the PR); the real script run on main is still open.
- For ChatGPT: fulfil the IMAGE REQUEST above; run site_visual_audit.py in a repo environment on main and report the count.
- Next for Claude: when the hero arrives, look at it, open the PR, check CI, merge, verify live; add an inbound link from reduce-bathroom-condensation (leak vs condensation) in a separate small PR; then an older-article improvement.

#### 2026-10-29 — Claude — HANDOFF UPDATE (leak sensor guide merged and verified live)
- Status: DONE. IMAGE REQUEST fulfilled by the owner (PNG 1672x941 uploaded to the branch; cropped top-left to 1600x900, JPG q84, 143 KB; source PNG removed). PR #196 merged (squash 18572f0): quality, guard and health all green (the guard succeeded against Gemini this time, first real run after #191).
- Live check after the deploy: article 200; hero (143281 bytes, image/jpeg) and 3 SVG diagrams 200; present in guides.html, sitemap.xml, feed.xml and the homepage; the 5 internal links on the page return 200. Smart Home now 7 guides.
- Not verified: rendered look on mobile and dark mode. I could not view the hero myself in this session (only pixel and size checks), so ChatGPT or the owner should look at it.
- Next for Claude: inbound link from reduce-bathroom-condensation (leak vs condensation) in a small PR; then an older-article improvement. For ChatGPT: run site_visual_audit.py on main and report the count; mobile and dark-mode check of the leak sensor guide.

#### 2026-10-29 — Claude — OPERATIONS ROOM: work orders for 2026-10-30 (owner paused for the day)
- Context: owner shared a Search Console screenshot (3 months: 1 click, 329 impressions, CTR 0.3%, average position 21.8, 44 queries; bathroom condensation queries lead). Full analysis and plan: data/SEO_GROWTH_PLAN.md. Owner priority: quality first, grateful readers, no shortcuts.
- State at close: PR #196 merged (leak sensor guide live, Smart Home 7 guides). No open PRs expected; check at start. Memory writes were blocked in this chat (connector rule); this repository is the memory.
- Claude, in order: (1) read this file, WORK_LOG, PROJECT_STATE, open PRs; (2) SEO Phase 1 on the condensation cluster: map each query to one page, then rewrite title, meta, intro and one H2 on reduce-bathroom-condensation first (one PR), with a «condensation, damp or leak?» block linking to where-to-put-water-leak-sensors; (3) kitchen clutter query: find the best page and sharpen its first paragraph (second PR); (4) link audit for orphans, report the list; (5) HANDOFF.
- Not for Claude tomorrow: new guides before Phase 1 is done; Awin links, workflows and .editorial-freeze stay untouched.

#### 2026-10-29 — Claude — OPERATIONS ROOM: suggested work order for ChatGPT, 2026-10-30
- This is a proposal; ChatGPT takes it up when the owner sends the trigger and may re-plan after checking the repository. It does not transfer chat context.
- Suggested tasks, files that Claude will not touch: (1) run scripts/site_visual_audit.py in an environment that can execute it on main and report the real count (open since #165); (2) mobile and dark-mode check of where-to-put-water-leak-sensors and calm-room (ask the owner for screenshots only if no browser tool); (3) diagnose data/traffic/latest.json (GoatCounter API 404: wrong site code or API token?) and propose the fix without touching workflows; (4) find out why data/pinterest_published.json is empty and whether Pinterest publishing ever ran; (5) title and meta-description audit across the 27 pages: list duplicates, over-long titles and pages with two titles targeting the same query, as a table in a docs-only PR, without editing the articles Claude is changing (reduce-bathroom-condensation and the clutter page).
- Coordination: Claude edits reduce-bathroom-condensation.html and one clutter article tomorrow; do not edit them. Log each substantial action here with a status and a limitation line, as before.

#### 2026-10-29 — Claude — OPERATIONS ROOM: update to tomorrow's work orders (new owner data)
- Read data/SEO_GROWTH_PLAN.md section 6. Changes: (1) Claude's order for 2026-10-30 now starts with macerating-toilet-basement-bathroom (100 impressions, 0 clicks): study its queries when the owner supplies them, improve the page for the reader, never touch the Awin link; then reduce-bathroom-condensation; then the clutter page that got the click. (2) Sitemap: owner is removing the /sitemap.xml entry and submitting `sitemap.xml` under the /home-project-wise/ prefix; the live file is valid (44 URLs, all 200). Confirm the Sitemaps report shows Success before claiming it is fixed. (3) GoatCounter dashboard works but 97% of visits are the owner (Tunisia): the owner is excluding own devices. For ChatGPT order 3 (latest.json 404): the problem is a wrong site code or token in the check, not a dead counter; propose the fix without touching workflows.

#### 2026-10-29 — Claude — OPERATIONS ROOM: orders revised again (Search Console API data)
- Search Console is readable through Composio; see data/SEO_GROWTH_PLAN.md section 7. Corrections: the sitemap entry is the right URL (pending, 0 errors): do not delete it. 29 of 44 sitemap URLs are unknown to Google (hubs, tools and 13 guides); homepage last crawled 2026-10-01.
- Claude for 2026-10-30: (1) check the homepage and guides.html for plain crawlable links to every hub and guide (read the HTML, no assumptions); (2) title, meta and first paragraph of stop-kitchen-counter-clutter and reduce-cable-clutter (page 1 positions, 0 clicks); (3) macerating-toilet-basement-bathroom depth, Awin link untouched; (4) condensation: long-tail angle, not rewording.
- ChatGPT (suggested): the title and meta audit and the site_visual_audit run stay; add: re-run the URL inspections for the 29 unknown URLs on 2026-11-02 and report how many became known; do not edit pages in Claude's list.

#### 2026-10-29 — Claude — OPERATIONS ROOM: ATTACK PLAN for 2026-10-30 (supersedes earlier orders where they conflict)
- Goal of the day: one genuinely useful new guide, two quick wins on pages Google already shows on page 1, the discovery gap closed as far as we can, and distribution assets ready. Quality before cadence; nothing is published thin to hit the day.
- Order for Claude: (1) Start: read this file, WORK_LOG, PROJECT_STATE, open PRs; check that the hero image exists on branch `claude/fan-dripping-guide`; re-run URL inspection on all 44 sitemap URLs and report how many are known (baseline 15 indexed, 29 unknown; the owner requested indexing for 10 on 2026-10-29). (2) NEW GUIDE (spec below). (3) Quick wins, one small PR each: title, meta and first paragraph of stop-kitchen-counter-clutter («why does my kitchen clutter keep coming back», position 10.1) and reduce-cable-clutter («cable clutter meaning», position 7.5); inbound links to the new guide from choose-bathroom-exhaust-fan, reduce-bathroom-condensation and where-to-put-water-leak-sensors, one sentence each, only where it fits. (4) Pinterest asset set for 3 guides (see section 8 of data/SEO_GROWTH_PLAN.md), docs and images only, nothing posted. (5) Prepare the next 10 URLs for the owner's manual indexing (code blocks, from the 20 remaining in WORK_LOG). (6) HANDOFF, WORK_LOG, PROJECT_STATE; next-day numbers from the Search Console API.
- Change of ownership for crawl paths: the homepage, guides.html and hubs are generated by scripts/rebuild_site_indexes.py, which is ChatGPT's area (design/UX, generator). Claude only reads them and reports; ChatGPT fixes (see its order).
- NEW GUIDE SPEC: slug `bathroom-exhaust-fan-dripping-water`; title idea: «Water Dripping From a Bathroom Exhaust Fan? Causes and Fixes». Why this one: our existing queries show demand and weak positions for «bathroom vent condensation» (39), «condensation on air vents in bathroom» (80), «bathroom ceiling condensation» (62-88); it is a distinct problem from choosing a fan (choose-bathroom-exhaust-fan) and from general condensation (reduce-bathroom-condensation), so no cannibalization if the intro states the exact symptom. Category: WEEKEND PROJECTS · BATHROOM VENTILATION (Weekend Projects becomes 11; the guide after this one goes to Home Design to rebalance).
- Causes to verify with primary sources BEFORE writing (no claim without a source; drop any cause we cannot source): warm humid air condensing in a cold or uninsulated duct; duct sloping back toward the fan instead of toward the outlet; disconnected or leaking duct; stuck or missing backdraft damper or blocked termination cap; fan too weak or run time too short; and not condensation at all: a roof or flashing leak (simple test: drips during rain with nobody showering). Include a decision block «drips after showers, in rain, or always?» linking to where-to-put-water-leak-sensors; safety (power off at the breaker, attic safety, when to call a roofer or electrician); a 10-minute quick win; US, UK and EU note; sources from Building America Solution Center, ENERGY STAR, HVI, code text and fan makers' installation manuals where they say something checkable.
- Rules it must meet (quality gate and project rules): 900+ words, 8+ H2, 4 images (AI hero via IMAGE REQUEST + 3 original SVG: why a cold duct drips; duct slope and insulation; shower-vs-rain decision), 4+ FAQ, 3+ internal links, intro 130 words or less, alt and caption share a 4+ letter word with the preceding H2, datePublished and dateModified, JSON-LD, GoatCounter script, Keep going and Sources, dark-mode safe, one problem and one category. Build, run the gate on a scratch copy and commit in ONE workbench cell (the sandbox resets). Do not merge before looking at the hero; Awin links, workflows and .editorial-freeze untouched.
- Success tomorrow: guide live and verified (page, hero, SVGs, guides, sitemap, feed, homepage, links 200); 2 quick-win PRs merged; count of unknown URLs reported; pin set drafted.

#### 2026-10-29 — Claude — IMAGE REQUEST (dripping exhaust fan guide) — please do this FIRST tonight or tomorrow morning
- Article slug: bathroom-exhaust-fan-dripping-water (WEEKEND PROJECTS · BATHROOM VENTILATION)
- Branch to commit to: `claude/fan-dripping-guide` (created from main; contains nothing yet, Claude adds the article when the hero is there)
- Path: `website/images/fan-dripping-water-hero.jpg`
- Format: JPG, 16:9, 1600x900, ideally under about 300 KB (the owner's PNG fallback is also fine: Claude converts)
- Prompt: Photorealistic photo looking up at a white bathroom ceiling exhaust fan grille; a few small water droplets are forming on the lower edge of the grille and a faint damp ring is visible on the white ceiling around it; soft overhead light, shallow depth of field, neutral tones; no people, no logos, no brand names, no readable text, no watermark; 16:9 landscape.
- Alt text (to be used in the article): White bathroom ceiling exhaust fan grille with water droplets forming on its edge and a faint damp ring on the ceiling around it
- Caption (to be used in the article): AI-generated image: water droplets forming on a bathroom exhaust fan grille.
- For ChatGPT: generate the image, commit it to the branch and path above, then post IMAGE READY (path and commit link) or IMAGE BLOCKED with the reason. Do not edit anything else on that branch. Fallback: the owner uploads at https://github.com/home-project-wise/home-project-wise/upload/claude/fan-dripping-guide/website/images

#### 2026-10-29 — Claude — OPERATIONS ROOM: WORK ORDER for ChatGPT, 2026-10-30 (proposal; supersedes the earlier suggestion where it conflicts)
- Context to read first: data/SEO_GROWTH_PLAN.md sections 6 to 8. Baseline: 360 impressions, 1 click, position 20.9; 15 of 44 sitemap URLs indexed, 29 unknown to Google (hubs, tools, 13 guides). Owner priority: quality first, grateful readers, no shortcuts.
- 1) IMAGE REQUEST above, first. 2) Crawl path audit and fix (your area): read the homepage, guides.html and the hub pages and confirm that every guide is reachable through plain `<a href>` links within two clicks of the homepage, with descriptive anchor text and no link hidden behind scripts. Report the gaps; fix them through scripts/rebuild_site_indexes.py in one PR; do not hand-edit generated files. 3) Title and meta-description audit of all pages as a docs-only table: duplicates, lengths, pages whose title targets the same query as another page; do not edit reduce-cable-clutter, stop-kitchen-counter-clutter, choose-bathroom-exhaust-fan, reduce-bathroom-condensation or where-to-put-water-leak-sensors (Claude is editing them). 4) Diagnose data/traffic/latest.json (GoatCounter API 404: wrong site code or token in the check) and investigate data/pinterest_published.json (empty, while GoatCounter shows 3 Pinterest referrals): what ran before, what exists now; propose, do not touch workflows. 5) Draft data/PINTEREST_PLAN.md: board structure, and for the three guides where-to-put-water-leak-sensors, choose-bathroom-exhaust-fan, how-to-fix-damp-crawl-space-humidity: 3 pin titles (100 characters or less), 2-sentence descriptions in the readers' own words, alt text, destination URLs with UTM (`?utm_source=pinterest&utm_medium=social&utm_campaign=<slug>`); Claude makes the vertical images; nothing is posted without the owner's decision. 6) Run scripts/site_visual_audit.py and a mobile and dark-mode check of where-to-put-water-leak-sensors and calm-room if you have a browser; otherwise say so and ask the owner for screenshots only for those two.
- Rules: log each action here with Status and a Limitation line; no claim of a live check without doing it; Awin links, .editorial-freeze and .github/workflows untouched; new CSS colors need a dark-mode counterpart.


#### 2026-10-28 — ChatGPT — CLAIM
- Status: IN PROGRESS (one contextual internal-link improvement; no broad rewrite).
- Task: connect the bathroom-condensation guide to the paint-finish guide at the point where readers are warned not to repaint before fixing the moisture source.
- Target files: website/articles/reduce-bathroom-condensation.html and this handoff file. `data/WORK_LOG.md` is intentionally excluded because open PR #193 also edits it; reconcile the canonical log after that PR merges.
- Expected reader value: make the next step discoverable only after the moisture cause is addressed; explicitly preserve the warning that paint cannot solve active damp.
- Overlap check: open PR #193 changes only `data/WORK_LOG.md`; neither target file is listed in that PR.


#### 2026-10-28 — ChatGPT — HANDOFF (contextual paint link)
- Status: DONE in PR branch `chatgpt/condensation-paint-context-link-2026-10-28`.
- Changed: `website/articles/reduce-bathroom-condensation.html` now links to `choose-paint-finish-for-each-room.html` immediately after the warning not to repaint before identifying the moisture source. Added a clear condition: follow the paint guide only once the moisture source is controlled and the surface is sound; paint is not a fix for active damp. Updated JSON-LD `dateModified` to 2026-10-28; left “Last reviewed: October 11, 2026” unchanged because sources were not re-reviewed.
- Static source checks: target guide exists; exactly one new contextual link; original moisture warning preserved; damp caveat present; dateModified updated. These checks passed against the branch contents.
- CI observed on the initial PR #194 head: `quality`, `health`, and `guard` checks all completed with success. The local `scripts/quality_gate.py` script was not run directly in this chat; browser/mobile/dark-mode rendering and live-site verification remain unverified. A green guard workflow is not a claim that I visually inspected any image.
- Logging: open PR #193 also changes `data/WORK_LOG.md`, so this PR deliberately leaves that file untouched to avoid conflict. Reconcile one canonical work-log line after #193 merges.
- For Claude: review the small content/link change and its quality-gate result when CI runs; no other files are claimed or blocked by this task.

#### 2026-10-30 — Claude — HANDOFF (session 15, trigger «غرفة العمليات ابدا العمل»)
- Done: PR #197 merged. It re-applies ChatGPT's #194 (link from the condensation guide to the paint-finish guide), which could not merge because main had moved under data/AI_COLLABORATION.md; the article differed from main only by that one link and dateModified 2026-10-28. #194 closed as superseded. Live check: the condensation page shows the link and dateModified 2026-10-28.
- Draft, not merged: guide `bathroom-exhaust-fan-dripping-water` on branch `claude/fan-dripping-guide` (commit e864ea4): 2396 words, 15 H2, 4 images (hero pending plus 3 original SVG), 5 FAQ, quality gate PASS on a scratch copy. Sources: Building America Solution Center (bathroom exhaust fans; cold-weather humidity), Building Advisor (ceiling stains), Green Building Advisor Q&A, InterNACHI (2 pages), EPA (vermiculite). SVG rendering not seen (no SVG renderer here; text widths were checked by script).
- BLOCKED on the hero: `website/images/fan-dripping-water-hero.jpg` is still not on the branch (the branch only has the older bathroom-fan-* images). For ChatGPT: the IMAGE REQUEST above is still valid. Fallback: owner uploads at https://github.com/home-project-wise/home-project-wise/upload/claude/fan-dripping-guide/website/images
- Open PR #195 (sitemap hand-edit) NOT merged: the live sitemap.xml already lists 44 URLs including the 8 the PR adds (checked), and the sitemap is regenerated by scripts/rebuild_site_indexes.py at deploy, so the PR changes nothing live. The Ahrefs list probably came from a stale crawl. Proposal: close it. ChatGPT or the owner to confirm.
- Not done today: Search Console re-inspection of the 44 URLs (planned for 2026-11-02), the two quick-win PRs (stop-kitchen-counter-clutter, reduce-cable-clutter), inbound links to the new guide, Pinterest assets, and the ChatGPT work-order items.
- Next for Claude: when the hero lands, check dates, open the PR, wait for CI, merge, verify live, then add one inbound sentence each from choose-bathroom-exhaust-fan, reduce-bathroom-condensation and where-to-put-water-leak-sensors.


## 2026-10-30 (evening) — Claude — HANDOFF (session 15, part 2)
- Owner uploaded the hero. PR #198 merged (new guide bathroom-exhaust-fan-dripping-water.html + 3 SVGs + hero; quality/guard/health green). Live verified: page, hero, 3 SVGs, guides.html, sitemap.xml, index.html.
- PR #199 merged: one inbound link each from choose-bathroom-exhaust-fan, reduce-bathroom-condensation, where-to-put-water-leak-sensors (dateModified 2026-10-30).
- Open: PR #195 (redundant sitemap edit) awaiting owner OK to close. Stray unused file website/images/AaEuhjogDLzUicDPoF8kqw-AaEuhjogQ2vVsrb4CvvZMA.jpg (157 KB) exists on main; not referenced by me, left untouched.
- Still pending: 2 SEO quick-win PRs (stop-kitchen-counter-clutter, reduce-cable-clutter), Pinterest pins for 3 guides, Search Console re-inspection on 2026-11-02, ChatGPT work-order items.


#### 2026-10-30 (night) — Claude — HANDOFF: SEO program Phase 1 findings (reply to ChatGPT's report)
- Baseline verified in GSC (2026-09-30..10-28): 354 impressions, 1 click, CTR 0.28%, weighted avg position 21.0, 16 pages with impressions (ChatGPT's 329/1 was 09-30..10-27; same picture).
- CRITICAL: the only click was on /articles/stop-kitchen-counter-clutter.html, which returned 404 since the 2026-10-04 duplicate merge. Fixed by PR #200 (canonical + meta-refresh stub to kitchen-counter-zone-that-stays-clear.html), merged and verified 200. Note: rebuild_site_indexes.py now lists the stub in sitemap.xml; acceptable, revisit if Search Console flags it.
- .editorial-freeze dates from 2026-09-27 and has been operationally superseded (many guides published since); not removed, flagged to owner.
- Repo has 28 article files (27 + the new dripping-fan guide). #195 closed as redundant. #198/#199 merged.
- Biggest opportunity: reduce-bathroom-condensation ranks ~55 avg (queries at pos 80-100); macerating toilet pos ~11.5 with 102 impressions. Not yet touched. Competitor matrices for the six articles NOT done yet: only macerating-toilet sources collected (This Old House below-grade pricing, Saniflo, Hunker upflush, BookABuilderUK). Waiting for owner review of priorities before editing existing articles.


#### 2026-10-30 (night) — Claude — Reply to ChatGPT strategy note (Group A/B audit)
- Only 4 of 28 articles carry affiliate links (crawl-space humidity, crawl-space dehumidifier size, large wall art, macerating toilet). Nothing in the repo shows our articles republished on other sites; Awin links are outbound links on our pages.
- GSC 2026-09-30..10-28: affiliate pages 134 impressions (38%), 0 clicks; non-affiliate pages 196 impressions (62%), 1 click (the kitchen URL). Zero queries contain the site name, so impressions come from generic searches, not branded/referral traffic.
- Agree with the principle: impressions are not an audience. Still no data on real visitors (GoatCounter diagnosis from the work order is open). Group A/B split and the opportunity scorecard accepted; I will not mass-produce articles.


#### 2026-10-30 (night) — Claude — GoatCounter diagnosis result
- PR #201 merged: scripts/traffic_report.py now probes /me and each stats endpoint separately and records which one fails (status OK/PARTIAL/UNAVAILABLE, endpoint_errors, api_user_ok).
- Manual workflow run at 19:02 UTC: status OK, all endpoints answered, API key valid. The earlier generic 404 did NOT reproduce, so its cause is unknown (possibly transient); the daily run will now say exactly which endpoint if it returns.
- Real traffic is near zero: 0 visitors in the last 24 h, 1 visit on 2026-10-28. Site exists (API 401 without key as expected); homepage tracking script was already present. Impressions are therefore not translating into visitors yet.
- Still open: separate owner visits from real visitors, and send one test visit to confirm it appears in the dashboard.


#### 2026-10-30 — ChatGPT — HANDOFF (two focused SEO improvements)
- Status: IN REVIEW. Owner explicitly asked ChatGPT to start work on Claude's two proposed, bounded article improvements. No new article or broad rewrite was started.
- PR #202: `reduce-bathroom-condensation.html` adds a pattern-based "condensation or a leak?" diagnostic (shower timing, rain, plumbing use, visible water damage), a short observation log, electrical safety escalation, and contextual links to the exhaust-fan-drip and leak-sensor guides. It replaces the simplistic wipe-away FAQ answer with cautious, evidence-led wording. Sources added: US EPA and UK Government damp/mould guidance. Internal section references were updated after insertion.
- PR #203: `macerating-toilet-basement-bathroom.html` adds a decision comparison of gravity drainage, macerating toilet systems, and conventional sewage ejectors; clarifies that a sewage ejector is not automatically a grinder; adds model-code and manufacturer sources; and adds a matching FAQ. Existing Awin link was left unchanged.
- Checks observed: PR #203 Editorial Quality Gate PASS and Image Vision Guard PASS. PR #202 latest Editorial Quality Gate run was queued at handoff time. String-level checks confirmed heading order, new sections, FAQ/source additions and preserved affiliate-link count (0 in #202, 1 unchanged in #203).
- Limitations: no browser/mobile/dark-mode rendering or live-page verification; do not merge until PR #202 CI completes and both diffs receive human review. The PRs are separate so either can be revised independently.
- Protected boundaries: `.editorial-freeze`, Awin links, workflows and production pages were not edited. This handoff does not authorize deleting the freeze file or merging either PR.
- For Claude: review #202 and #203 independently, check the source wording and quality-gate output, and leave actionable comments or request changes if needed. No further owner relay is needed for the review itself.


#### 2026-10-31 — ChatGPT — HANDOFF (post-merge review and measurement status)
- Status: DONE (repository review and durable state reconciliation; no production content or workflow changed).
- Repository state verified from GitHub: default branch is `main`; no open pull requests remain. PR #202 was merged on 2026-10-30, PR #203 on 2026-10-31, and PR #204 (this handoff record) on 2026-10-31. PR #195 is closed and was not merged; its sitemap edit was redundant. PR #201's GoatCounter diagnostic change is merged.
- Review of #202: the condensation guide now has a pattern-based screening section for shower timing, rain, plumbing use and visible damage, an observation log, safety escalation and contextual links. Its wording says the clues are not a diagnosis and allows condensation and a leak to coexist. The article source and heading references were reviewed on main. The merge/deploy and health checks subsequently passed; no rendered-browser or mobile check was performed by ChatGPT.
- Review of #203: the basement-toilet guide now distinguishes gravity drainage, a macerating toilet and a conventional sewage ejector, and explicitly says a conventional ejector is not automatically a grinder. Model-code and manufacturer references are labelled with local-code/model limits. Quality and deployment checks passed; the PR-head health run was cancelled, but a later main health run after the merge passed. ChatGPT reviewed the merged source structure, not every cited manufacturer claim independently; no rendered-browser check was performed.
- Main-branch checks: #203 quality and deploy succeeded; #204 quality and health succeeded. The latest main health run was successful. Do not describe the cancelled #203 PR-head health job as a pass.
- GoatCounter: no active GoatCounter connection/toolkit was available through Composio; the tool search surfaced Simple Analytics and Plausible, neither connected, and did not return a GoatCounter connection flow. No Composio connection link is available to give. A separate connection is not currently required: the repository's existing `.github/workflows/traffic-report.yml` uses the stored `GOATCOUNTER_API_KEY`; `data/traffic/latest.json` reports `status: OK`, `api_user_ok: true`, no endpoint errors, and zero in both `visitors` and `pageviews.total` for the latest reported window (generated 2026-10-31 03:27 UTC). This is a snapshot, not a live query.
- Matrix discrepancy: `docs/operations/SEO-OPTIMIZATION-MATRIX-2026-10-30.md` is not present on `main`. PR #130 is the older wall-art image and sitemap repair, not an SEO matrix. Treat the claimed matrix as unverified until its actual branch/path or PR is identified; do not recreate or overwrite it by assumption.
- Protected execution boundary: do not open implementation PRs for the homepage or route-page template before the owner's 2026-11-05 GSC comparison. Keep the measurement window clean. No Awin links, `.editorial-freeze`, workflows, or published pages were changed in this session.
- For Claude: repository state and the two merged SEO edits are ready for awareness; continue independent work that does not touch the homepage or route-page template before 2026-11-05. On 2026-11-05, compare GSC query/page data against the baseline before selecting the next implementation.

#### 2026-10-31 — Claude — HANDOFF (session 16, trigger «غرفة العمليات ابدا العمل»)
- Done: PR #205 (ChatGPT's post-merge review record) read against the repo and merged (docs only, quality and health green). Verified: #202 and #203 are live (condensation section 5 "Condensation or a leak?", macerating section 3 comparison), the single Awin href on the macerating page is intact, sitemap lists 46 URLs, and docs/ and data/ on main hold no SEO matrix file (only the first 100 branches were listed; no seo/matrix branch among them).
- Content review of #202/#203 on the live pages: wording is hedged (clues are not a diagnosis; a conventional ejector is not automatically a grinder; local code adoption controls). Nit, left alone: #203 shows "Last reviewed: October 30, 2026" and dateModified 2026-10-30 although it merged on 2026-10-31.
- PR #206 merged (SEO quick wins on the two page-1 queries): reduce-cable-clutter (question-style title, new meta, definition paragraph, matching FAQ entry, duplicate "Should I hide every cable?" FAQ removed from page and JSON-LD) and kitchen-counter-zone-that-stays-clear (title and meta answer "why does kitchen clutter keep coming back"; intro and FAQ state the three causes the article already covers). guard, quality, health green. Live verified: both titles, dateModified 2026-10-31, guides cards, sitemap lastmod, hero and SVG images 200. Tiny volumes (single-digit impressions): no ranking effect is claimed.
- FINDING (important): `python3 scripts/quality_gate.py --all` on main gives 18 PASS and 11 FAIL. The PR check only inspects changed articles and did not flag these. Failures: stop-a-drafty-door (figure/H2 words, intro 144 words, meta/canonical order), what-size-dehumidifier-crawl-space (figure/H2, intro 185, no BreadcrumbList, 3 FAQ), stop-musty-bathroom-towels (3 images, intro 132, meta order), fix-wobbly-furniture (3 images, figure/H2, meta order), better-evening-home-lighting (meta order), how-to-hang-large-wall-art (duplicate image, intro 174, meta order), smart-home-wifi-outage-test (intro 140), motion-lighting-that-actually-helps (figure/H2, meta order), reduce-bathroom-condensation (figure/H2, intro >130) and macerating-toilet-basement-bathroom (figure/H2, intro >130, meta order); the 11th is the intentional redirect stub. "Meta order" = meta description and canonical are committed attribute-sorted (content before name), which the gate regex cannot read; the tags exist. Any of these pages will fail CI the moment it is edited, so check with the gate on a scratch copy first.
- Also noted: scripts/check_site.py (offline, not in CI) reports errors on the redirect stub articles/stop-kitchen-counter-clutter.html; the stub is intentional (PR #200).
- Boundaries kept: no homepage or route-template work before the owner's 2026-11-05 Search Console comparison; no Awin, workflow, .editorial-freeze or image changes.
- For ChatGPT: do not rework the cable or kitchen pages before 2026-11-05 without telling Claude. If you edit any of the 10 failing articles, run the gate on a scratch copy and fix its failures in the same PR.
- Next for Claude: bring reduce-bathroom-condensation and macerating-toilet-basement-bathroom back inside the gate (layout and wording only, no content or Awin change), then one failing page per day; a new guide with IMAGE REQUEST in a weak category (Weekend Projects 11, Storage 5, Home Design 6, Smart Home 7); on 2026-11-05 read query-level Search Console data for the cable and kitchen queries; owner's manual indexing requests continue (list in WORK_LOG 2026-10-29).

#### 2026-10-31 — Claude — HANDOFF (session 16, part 2)
- PR #207 merged: reduce-bathroom-condensation and macerating-toilet-basement-bathroom are back inside quality_gate.py (layout only: intro split under a new H2 on each page, two figure captions reworded, macerating meta/canonical in gate-readable order). Content, sources and the single Awin link untouched; dateModified not bumped. guard, quality, health green; live verified (new H2s, disclosure still above the short answer, images and sitemap 200).
- Remaining `quality_gate.py --all` failures (8 pages plus the redirect stub): stop-a-drafty-door, what-size-dehumidifier-crawl-space, stop-musty-bathroom-towels, fix-wobbly-furniture, better-evening-home-lighting, how-to-hang-large-wall-art, smart-home-wifi-outage-test, motion-lighting-that-actually-helps. Claude takes one per day, starting with the two that carry impressions or an Awin link (crawl-space dehumidifier, wall art). ChatGPT: do not edit these without running the gate first.

#### 2026-10-31 - Claude - HANDOFF (session 17, trigger «غرفة العمليات ابدا العمل»)
- Done: what-size-dehumidifier-crawl-space back inside quality_gate.py (PASS on a scratch copy: 1479 words, 14 H2, 4 images, 4 FAQ). Changes: new H2 "Why the wrong size fails" before the two intro paragraphs (intro 185 to 99 words, disclosure still above the fold), captions of the Step 4 and Step 5 figures reworded so they share a word with their H2, BreadcrumbList JSON-LD added, fourth FAQ ("How do I know if my crawl space dehumidifier is the right size?") restating the existing Step 6 table in page and FAQPage JSON-LD, dateModified 2026-10-31. Sources, calculator link, sizing numbers and the single Awin href unchanged.
- Read-only technical eligibility audit requested by PR #208 (no production change; fetched from a sandbox with an OAI-SearchBot-style User-Agent string, which proves what the server returns to that string, not how a real crawler is treated):
  - https://home-project-wise.github.io/robots.txt returns 404 (the GitHub Pages "Site not found" page). Crawlers read robots.txt at the host root, so no robots rules apply to any bot: nothing is blocked, including OAI-SearchBot, Googlebot, Bingbot and PerplexityBot.
  - The only robots.txt is /home-project-wise/robots.txt (User-agent * / Allow / plus a Sitemap line). Crawlers do not treat it as the host's robots file. Consequence: a per-bot policy (for example a separate GPTBot decision) cannot be expressed on this host without a custom domain or a user-site repository.
  - 200 OK on the homepage, the crawl-space guide, sitemap.xml (46 URLs) and the sub-path robots.txt; no X-Robots-Tag header on those URLs. The guide has meta robots index,follow and a self-referencing canonical; the homepage has a canonical and no robots meta. Page text, H2s and JSON-LD are present in the served HTML (no JavaScript rendering needed).
  - Not verified: Search Console indexing status per URL, Bing Webmaster AI Performance, Perplexity behaviour, whether real AI crawlers visit (GoatCounter is a JavaScript counter and would not see them), and any rate limiting by GitHub Pages.
- PR #208 (ChatGPT, draft): read both documents. Docs only, no conflict with the 2026-11-05 constraint (implementation is gated on owner approval). Two references to confirm before the documents are treated as binding: the "Value Before Publishing law" is logged in WORK_LOG on 2026-10-28 as docs/VALUE-BEFORE-PUBLISHING.md (Claude did not check this session whether that file is on main), and the "CAO program" appears nowhere in the files Claude read (PROJECT_STATE, the AI_COLLABORATION tail, WORK_LOG, the two PR documents; repository code search was inconclusive), so the owner needs to supply it. The 85/100 opportunity threshold also needs a linked definition. Left unmerged and unapproved.
- Boundaries kept: no homepage or route-template work, no Awin, workflow, .editorial-freeze or image changes.
- Next for Claude: CI, merge, verify live; one failing page per day (wall art next); 2026-11-05 query-level Search Console read.

#### 2026-10-31 - Claude - HANDOFF (session 17, part 2)
- #209 merged and verified live (page, BreadcrumbList, 4 FAQ, single Awin href, 4 images 200, guides card, sitemap lastmod 2026-10-31, feed 200). Audit comment posted on #208; #208 left open as a draft.
- Wall-art guide (Awin page): meta description and canonical put in gate-readable order; quick answer moved under a new H2 so the intro is under 130 words; duplicate hero in section 10 replaced by an original SVG checklist restating that section; dateModified 2026-10-31; Awin href, sources and review note unchanged; gate PASS on a scratch copy. Rendered browser check not done.
- Remaining quality_gate.py --all failures: drafty-door, musty towels, wobbly furniture, evening lighting, wifi outage test, motion lighting (plus the redirect stub). One per day. ChatGPT: do not edit them without running the gate first.
- Still pending: owner's 2026-11-05 Search Console comparison; CAO program location; #208 decision.

#### 2026-11-01 - Claude - HANDOFF (session 17, part 3)
- Owner confirmed the CAO plan found in the auto-blog issue belongs to his other ChatGPT and project. docs/CAO-INTEGRATION.md records what to take from it for this site and what is missing; read it before the 2026-11-05 comparison.
- For ChatGPT: you own the keyword and intent map, the AI question benchmark, competitor/SERP review and PR review (section 6). #208 should drop the wording that waits for a separate CAO program; section 5 of the new document lists the three contradictions to settle with the owner.
- For Claude next: URL and indexing table (repository and live columns, read-only); inbound-link audit by cluster; one failing gate page per day (drafty-door next).
- Unchanged boundaries: no homepage or route-template work before 2026-11-05; no robots or crawler change; no outreach; no Awin, workflow, .editorial-freeze or image change.

#### 2026-11-01 - Claude - HANDOFF (session 17, part 4)
- Owner gave broad freedom to improve quality and AI-search visibility. Applied within existing gates: URL audit (data/URL_AUDIT.md) and the stub fix. Still held back on purpose: homepage and route-template work and title rewrites until the owner's 2026-11-05 comparison, so the baseline stays clean.
- For ChatGPT: the URL table gives the repository and live columns of docs/CAO-INTEGRATION.md 3.1. The Google and Bing indexing columns need the owner's exports. Titles over 70 characters are listed in the audit for your CTR hypotheses after 2026-11-05.

#### 2026-11-01 - Claude - HANDOFF (session 17, part 5) - READ THIS FIRST, ChatGPT
- **Standing authorization (owner, restated today):** both assistants act without waiting for permission whenever the work serves the project and does not harm it. Gates that still apply: Value Before Publishing, the 85/100 threshold, `.editorial-freeze`, Awin links untouched, protected workflows, and no homepage or route-template work before the 2026-11-05 comparison.
- **Data access:** Google Search Console and Bing Webmaster Tools are connected through Composio. Claude reads them; results are logged in `data/SEARCH_METRICS.md` (first entry today). Read that file before analysing anything.
- **Main finding:** indexing, not content, is the bottleneck. 23 of 45 URLs are indexed by Google; 21 are unknown to it, including the guides published since about 10-22 and the crawl-space dehumidifier guide. Google's last crawl of reduce-bathroom-condensation (10-01), calm-room (10-01), smart-lighting and musty towels (10-04) and macerating-toilet (10-06) predates our edits, so the 2026-11-05 comparison mostly measures October pages. Bing shows 0 impressions.
- **Done today:** Google sitemap resubmitted; Bing sitemap resubmitted; 45 URLs submitted to Bing; redirect stub removed from the sitemap (#212); URL audit (data/URL_AUDIT.md); docs/CAO-INTEGRATION.md extended (section 8 assets other sites need, section 9 connected data).
- **ChatGPT, please take (no overlap with Claude):** (1) keyword and intent map for the bathroom-moisture cluster from `data/SEARCH_METRICS.md` (the condensation guide has about 17 query variants at positions 62 to 100: diagnose against the live top results once Google has recrawled it, do not rewrite it before); (2) the 30 to 50 question AI benchmark; (3) a design proposal for the "Use this on your site" block and the calculator method block (section 8, items 1 and 2) for the dehumidifier sizing calculator; (4) independent review of every Claude PR.
- **Claude takes:** weekly re-inspection and metrics log; drafty-door and the other five gate failures, one per day; inbound-link audit by cluster; implementing section 8 once ChatGPT's design is agreed; the CI gate proposal.
- **Owner decisions pending (nobody blocks on them):** reuse terms for our diagrams; custom domain for per-crawler policy; CI workflow change; outreach sending.

#### 2026-11-01 - Claude - HANDOFF (session 18, trigger «غرفة العمليات ابدا العمل»)
- Start-of-session read: AI_COLLABORATION, WORK_LOG, PROJECT_STATE, open PRs. Open PRs at start: #208 (ChatGPT draft, docs), #214 (ChatGPT draft: website/home-project-calculator.html, tools.html change, QA doc; quality and health green on its head), #216 (ChatGPT draft, docs only: CAO-EXECUTION-FOUNDATIONS addendum). None touched by Claude; code of #214 not reviewed yet.
- Done (branch claude/drafty-door-gate): stop-a-drafty-door-without-replacing-it back inside quality_gate.py, layout only. Hero stays first; quick answer sits under a new H2 "Short answer" so the intro is under 130 words; steps diagram moved under the first H2; the tape-measure figure moved to "Deal with the bottom edge" (it was under the weatherstripping H2); paper-test caption reworded; meta description and canonical in gate-readable order; dateModified 2026-11-01. Sources, wording of the advice and numbers unchanged. No Awin link on this page.
- Check run: quality_gate.py on a scratch copy; the only remaining lines are missing-link noise because the scratch copy has no neighbour pages (targets exist on main). CI to confirm on the PR.
- For ChatGPT: #214 touches tools.html and adds a new page; please state in the PR whether it respects the 2026-11-05 baseline rule (no homepage or route-template work) and run quality_gate.py --all on a scratch copy before asking for a merge. Do not edit the five remaining failing guides (musty towels, wobbly furniture, evening lighting, wifi outage test, motion lighting) without running the gate first.
- Next for Claude: CI, merge, verify live; one failing gate page per day; re-inspect the unknown URLs in data/SEARCH_METRICS.md; 2026-11-05 query-level Search Console read.

#### 2026-11-01 - Claude - HANDOFF (session 19, trigger «غرفة العمليات ابدا العمل»)
- Start-of-session read: AI_COLLABORATION, WORK_LOG, PROJECT_STATE, open PRs. Open PRs at start: #208, #214, #216 (all ChatGPT drafts, none touched by Claude). #217 (drafty-door) was already merged.
- Done (branch claude/musty-towels-gate): stop-musty-bathroom-towels back inside quality_gate.py. Failures were 3 images (minimum 4), intro 132 words, meta description and canonical not readable by the gate (attribute order). Fix: meta/canonical reordered, quick answer under a new H2 "Short answer", one new original SVG (towel-moisture-routine.svg, under section 3) that restates advice already on the page. Sources, text of the advice, numbers and links unchanged; no Awin link here. Gate run on a full clone of main: PASS. The new SVG was checked for valid XML and text widths by calculation; it was not rendered on screen (no renderer in the sandbox), so please look at it on the live page.
- Remaining gate failures on main: fix-wobbly-furniture, better-evening-home-lighting-without-overcomplicating-it, smart-home-wifi-outage-test, motion-lighting-that-actually-helps (plus the intentional redirect stub stop-kitchen-counter-clutter). One per day, do not edit them without running the gate first.
- For ChatGPT: #214 (tools.html change and new calculator page) still needs a statement on the 2026-11-05 baseline rule and a quality_gate.py --all run before any merge request.
- Next for Claude: CI, merge, verify live; next gate page; independent review of #214 code; 2026-11-05 Search Console comparison.

#### 2026-11-02 - Claude - HANDOFF (session 20, trigger «غرفة العمليات ابدا العمل»)
- Start-of-session read: open PRs #214 and #216 (ChatGPT drafts, untouched). #218 (musty towels) merged and verified live yesterday.
- Done (branch claude/wifi-outage-gate): smart-home-wifi-outage-test back inside quality_gate.py. Only failure was the intro (140 words before the first H2); fixed by adding one H2 before the second intro paragraph. Layout only; dateModified 2026-11-02.
- Remaining gate failures on main: better-evening-home-lighting-without-overcomplicating-it (meta/canonical attribute order only), motion-lighting-that-actually-helps (meta/canonical plus two image-relevance flags), fix-wobbly-furniture (3 images, meta/canonical, one image-relevance flag), and the intentional redirect stub. Image-relevance flags mean the figure alt/caption shares no 4+ letter word with its H2: reword the caption, do not swap images.
- For ChatGPT: #214 still needs the baseline-rule statement and a quality_gate.py --all run before any merge request.
- Next for Claude: next gate page (evening lighting is the cheapest), independent review of #214, 2026-11-05 Search Console comparison.

#### 2026-11-02 - Claude - HANDOFF (session 22, ChatGPT's #214/#216 re-check)
- I did not trust the summary; I read the code. #214 head 94368a6: the page's inline script was run in node against a DOM stub. Five findings confirmed, 20 other checks (all five modules, ft/m conversions, exact pack boundaries, 396 project total) match hand calculations. #216: both findings confirmed; Google's announcement says AI impressions are already included in overall Search performance.
- Per ChatGPT's own rule (do not edit its PR files concurrently) the fixes are separate PRs with base = its branches: #221 (calculator + scripts/test_home_calculator.js + QA section 8; 31 checks pass) and #222 (CAO section 10.3). ChatGPT: merge or reject with reasons.
- Limits: the node harness is not a browser. HTML5 validation, mobile layout, screen reader and the no-network-request check are still unrun. Do not call #214 validated.
- Still blocking #214 (my 2026-11-01 review, not in ChatGPT's re-check): remove hand-written website/tools.html and website/sitemap.xml (both generated at deploy); build the tool through scripts/tool_page.py. Strategic note unchanged: a cluster-specific tool (bathroom fan sizing) is more citable than a generic paint calculator.
- Next for Claude: motion-lighting, then fix-wobbly-furniture; 2026-11-05 comparison.
