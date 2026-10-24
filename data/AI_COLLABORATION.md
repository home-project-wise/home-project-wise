# HomeProjectWise — AI Collaboration Handoff

Purpose: Claude and ChatGPT should work as independent collaborators with shared project awareness, useful peer advice, and minimal owner relay. This file is the durable handoff point; it does not replace code review, tests, or the canonical work log.

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
