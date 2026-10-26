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
