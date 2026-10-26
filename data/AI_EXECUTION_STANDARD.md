# Mandatory Peer Execution Standard

**Owner decision: 2026-10-26. Applies to both Claude and ChatGPT on every Home Project Wise session.**

## Binding rules

1. **Work must follow work.** When either assistant finishes a substantial task, the other assistant, at its next activation, must deliver a substantial, independent task of comparable scope and quality—not merely praise, summarize, or explain the first assistant's work.
2. **No spectator sessions.** Each session must end with a tangible result: a code/content change, a meaningful test or verification, an evidence-based review that causes a concrete improvement, or a precise `BLOCKED` handoff. A review alone is not a substitute for an available, non-conflicting implementation task.
3. **Divide by strength, not convenience.** Choose work the active assistant can execute well. Coordinate ownership and avoid overlapping files/articles. If the obvious task is blocked, select another useful task rather than waiting.
4. **Peer review must change outcomes.** Inspect evidence, identify specific risks or opportunities, and give actionable recommendations. The receiving assistant must validate and implement useful recommendations, or record a reasoned decline. Never duplicate work just to match volume.
5. **Comparable effort, honest quality.** Aim for similar meaningful scope—not an arbitrary word, commit, or PR count. Quality, user value, safety, maintainability, accessibility, and search usefulness take priority over speed or superficial parity.
6. **Evidence only.** State exactly which files changed, which checks actually ran, their real outcomes, and what remains unverified. Never claim tests, deployment, indexing, or live rendering succeeded without evidence.
7. **Handoff is mandatory.** Before stopping, leave a concise dated HANDOFF in `data/AI_COLLABORATION.md` with status, deliverable/PR/commit, checks and limitations, the next assistant's concrete task, and files/articles that must not be touched. Add the canonical `data/WORK_LOG.md` entry in the same PR when safe; if that file conflicts, record the conflict and reconcile after the conflicting PR merges.
8. **Blockers do not excuse inactivity.** Record the exact missing access/tool/evidence and its impact, request only the owner's necessary action in at most 2–3 direct lines, and continue on an independent task. Ask for screenshots only when real rendered visual verification is otherwise impossible.
9. **No false promises or forced merges.** Do not promise equal or superior performance in advance; demonstrate it through deliverables. Do not bypass required checks, protected-file rules, or unresolved conflicts to satisfy the cadence.
10. **Trigger phrase.** On `غرفة العمليات ابدأ العمل` (or `غرفة العمليات`), read the current operations room, latest work log and project state, and all open PRs/files/checks; then execute the highest-priority safe task and leave the next handoff. Do not ask the owner to relay prior context.

## Session completion checklist

- [ ] Read current shared state and checked open PR overlap.
- [ ] Chosen and completed a useful, non-overlapping task.
- [ ] Ran available relevant checks and reported only verified results.
- [ ] Left an actionable handoff for the other assistant.
- [ ] Kept the owner report to the minimum necessary.

**Success measure:** the website measurably improves over time through useful content, robust implementation, trustworthy SEO, accessibility, performance, and verified deployment—not through long reports.
