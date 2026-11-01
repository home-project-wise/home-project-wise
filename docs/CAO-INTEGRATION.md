# HomeProjectWise: CAO integration, AI-visibility additions and gap list

Date: 2026-11-01. Status: proposed working plan, documentation only. It authorizes no publishing, outreach, crawler or robots change, merge of other PRs, or change to the editorial freeze. The owner's gates stay in force: Value Before Publishing law, the 85/100 opportunity threshold, `.editorial-freeze`, no homepage or route-template implementation before the owner's 2026-11-05 Search Console comparison.

## 1. Provenance (read this first)

- **Source of the ideas.** The owner's other project, Home Organization Ideas (repository `Fadhel-docom/auto-blog`, issue #109), has a plan called CAO, "Competitive Advantage & Organic Growth". That plan describes itself as an internal framework name, not a Google term. It was written for that site (its categories, its pages.dev domain, its `content/posts/` rules).
- **What it is here.** A source of ideas, not a HomeProjectWise specification. Nothing in it is copied as a rule for this site. HomeProjectWise has no CAO document of its own: a search of the repository on 2026-11-01 (file tree and all documentation outside `website/`) found none. The earlier references to a "CAO program" in PR #208 and in the project state therefore mean this document.
- **What this document does.** (a) Compares the CAO ideas with the existing material: PR #208 (`docs/FOUR-GROWTH-ENGINES-ROADMAP.md`, `docs/AI-SEARCH-VISIBILITY-PRIORITY-PLAN.md`) and `data/SEO_GROWTH_PLAN.md`. (b) Lists only what is genuinely missing. (c) Splits the work between Claude and ChatGPT without overlap.

## 2. Coverage map: CAO idea versus what we already have

| CAO idea | Already covered in | Verdict |
|---|---|---|
| Page and query opportunity map | Roadmap 3.1 | Covered; extend with the URL table in section 3.1 |
| Classify pages: improve, diagnose, monitor | Roadmap 3.2 | Covered |
| Conditional CTR experiments, small batches, before/after | Roadmap 4 | Covered |
| Two targeted outreach experiments, no link demands | Roadmap 5.1 | Covered |
| Shareable utility assets, embeds only after demand | Roadmap 5.2, 5.3 | Covered |
| Citation-worthy assets, sources near claims | Roadmap 6.1, 6.2; AI plan 5 | Covered |
| Fixed question set for AI answers, logged monthly | AI plan 4, 7 | Covered |
| Technical eligibility audit | AI plan 3 | Done read-only on 2026-10-31 (see section 4) |
| 30-day phases, success measured by evidence not article count | Roadmap 8, 12 | Covered |
| One page per search intent | `SEO_GROWTH_PLAN` principle 2 | Principle exists, no artifact enforces it (gap 3.2) |
| Weekly "striking distance" routine | `SEO_GROWTH_PLAN` phase 2 | Covered |

## 3. Gaps to add (the genuinely missing parts)

### 3.1 URL and indexing table (extends roadmap 3.1)
One row per URL in the sitemap: in sitemap, HTTP status, canonical matches the URL, robots meta and `X-Robots-Tag`, at least two descriptive inbound HTML links, indexed in Google and Bing, reason if excluded, date checked. Repository and live-fetch columns are Claude's. Indexing columns need the owner's Search Console and Bing exports; where unavailable, write "unavailable", never zero.

### 3.2 Keyword and intent map with a cannibalization rule
A living table, not a keyword list: query or cluster, intent, target page, secondary queries, SERP type, our current page and position (from Search Console only), status. Rule: one primary page per intent; near-duplicate intents are merged into one page, never split into two articles. Never invent volume, difficulty or rank; every figure carries its source and date. Start with the bathroom-moisture cluster, which holds six of the top ten queries in the 2026-10-29 baseline.

### 3.3 Baseline before numeric targets
`SEO_GROWTH_PLAN` section 4 contains numeric targets for end of November (for example more than 100 distinct queries). Label them aspirational. Set real targets only after 28 days of Search Console data from the 2026-10-29 baseline, and compare weekly (impressions, clicks, CTR, position, indexed URLs, new queries) rather than only on 2026-11-05.

### 3.4 "When this does not suit you" block
For guides with safety, moisture, plumbing or electrical limits, add a short block stating when the solution does not apply and when to call a professional. Only where the guide's existing content supports it; no new claims.

### 3.5 Hub and supporting-guide structure
For each cluster, name one hub page, its supporting guides and cross-links, with descriptive anchor text, and record any guide with fewer than two inbound links. This turns the existing internal-link work into a checkable structure.

### 3.6 Quality gate coverage in CI
`scripts/quality_gate.py --all` on main reported 18 PASS and 11 FAIL on 2026-10-31 because the PR check only inspects changed articles. Four of those guides have since been repaired (condensation and macerating toilet on 2026-10-31, crawl space on 2026-10-31, wall art on 2026-11-01); six remain. Proposal for the owner: run `--all` in CI so a regression cannot land unseen. This needs a workflow change, which is protected, so it needs explicit approval.

### 3.7 Per-page AI-citation checklist
Apply to at most three existing pages (AI plan 5). A page passes when it has: a short direct answer near the top; a decision method (if your situation is X, choose Y, because Z); measurements with units and a worked example; a real comparison table where choices exist; ordered steps and a materials list; safety and limits; the "does not suit you" block; primary sources with a review date; text that stays visible HTML (no key facts only inside images or scripts); structured data that matches the visible page and only where the page qualifies. No invented experience, tests or expert quotes.

Pilot candidates, to be decided by Search Console data and the ChatGPT benchmark, not now: `reduce-bathroom-condensation`, `macerating-toilet-basement-bathroom`, `what-size-dehumidifier-crawl-space`.

### 3.8 AI-visibility measurement additions
- Monthly question set: same country, language and wording; results recorded as a dated sample, not a complete measure.
- Separate AI referrals from Google organic and direct in analytics. Whether GoatCounter's referrer list identifies them has not been verified.
- Confirm access to Bing Webmaster Tools and whether its AI Performance report exists for this site; do not assume it.
- A citation counts as success only if the cited page answered correctly and the visit or reach is relevant.

## 4. Technical facts established on 2026-10-31 (read-only)

- `https://home-project-wise.github.io/robots.txt` returns 404, so no crawler is blocked. The only robots.txt is at `/home-project-wise/robots.txt`, which crawlers do not use as the host file.
- Consequence for the AI plan: a separate policy per crawler (OAI-SearchBot versus GPTBot) cannot be expressed on this host. It would need a custom domain. This is an owner decision; nothing is changed meanwhile.
- 200 OK and static HTML (text, H2s and JSON-LD present without JavaScript) on the pages fetched; sitemap lists 46 URLs. Not verified: Google and Bing indexing per URL, real crawler behaviour, rate limits.

## 5. Contradictions to settle (do not resolve silently)

1. `SEO_GROWTH_PLAN` phase 2 proposes growing the bathroom cluster to 7 or 8 guides. The roadmap forbids article batches and the editorial freeze is active. Resolution proposed: any new guide only after an 85/100 score, the Value Before Publishing disclosures and owner approval.
2. Roadmap phase 0 says to inspect the CAO program once supplied. Resolution proposed: this document is the CAO integration; remove the dependency wording from #208.
3. Roadmap 5.1 and the AI plan both plan outreach. Keep a single outreach experiment of two targets, owned by ChatGPT, sent only with owner approval.

## 6. Work split (no two parties on the same file)

**ChatGPT:** keyword and intent map; the 30 to 50 question AI benchmark; competitor and SERP review; analysis of Search Console and Bing exports; page briefs and acceptance criteria; independent PR review.
**Claude:** the URL table (3.1) from repository and live fetches; inbound-link audit and hub structure (3.5); implementing approved page changes in focused PRs with the gate run on a scratch copy; the CI proposal (3.6); state and handoff records.
**Owner:** exports from Search Console and Bing; decisions on the custom domain, the CI change, outreach sending, new guides and the editorial freeze.

## 7. First actions, all within the current constraints

1. Claude: build the URL table with the repository and live columns. Read-only.
2. ChatGPT: draft the keyword and intent map for the bathroom-moisture cluster from the owner's exports.
3. Owner, by 2026-11-05: provide the Search Console comparison; say whether Bing Webmaster Tools is set up; decide the points in section 5.
4. After 2026-11-05: pick the pilot pages and score them with the roadmap rubric before any edit.
