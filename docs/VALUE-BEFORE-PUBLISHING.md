# Value Before Publishing — Mandatory Operating Law

**Applies to every page, tool, feature, article, and SEO change in this repository.** It is a release gate, not optional advice.

## The law
Publish only when the work provides a clear, useful answer to a real visitor need and has been checked for accuracy, originality, usability, and discoverability. Technical correctness and indexing readiness are necessary, but they do not by themselves create search value.

## Required process before building
1. **Identify real intent:** State the specific question, task, or problem a visitor is trying to solve. Use credible evidence where available (search results, Search Console/Bing data, customer language, competitor pages, authoritative sources). Label assumptions as assumptions; never invent search volume or demand.
2. **Inspect alternatives:** Review relevant direct competitors or substitutes. Record URLs, review date, useful strengths, shortcomings/gaps, and evidence. Do not claim a full competitor review unless it was completed.
3. **Define the added value:** Write one sentence describing what the visitor will be able to do, understand, decide, or save that is meaningfully useful. Explain why this page/tool is worth choosing over existing alternatives.
4. **Choose a fit-for-purpose format:** Build the thing that best solves the need—calculator, practical guide, comparison, checklist, diagram, or another format. Do not force every topic into an article or a tool.
5. **Plan evidence and limits:** Identify primary/authoritative sources where factual claims matter; define assumptions, calculation methods, uncertainty, safety notes, and limits. Never fabricate tests, figures, prices, quotations, or firsthand experience.

## Mandatory pre-publish gate
- [ ] The target visitor and real problem/question are explicit.
- [ ] The page adds distinct practical value; it is not filler, a thin rewrite, or a near-duplicate made only for SEO.
- [ ] Relevant alternatives were inspected and the differentiator is evidence-based.
- [ ] Facts, formulas, examples, and sources were checked; uncertainty and limitations are clear.
- [ ] The page/tool works on mobile, is accessible enough for its purpose, and has useful empty/error/edge states where applicable.
- [ ] Title, headings, snippet/metadata, canonical/indexability, structured data, sitemap, and internal links are correct where relevant. No keyword stuffing.
- [ ] Tests and quality checks were actually run; untested items are disclosed rather than marked passed.
- [ ] The change has a measurable follow-up plan (e.g. impressions, clicks, engagement/completion, errors, or another suitable signal).

## After publishing
Review real performance data when enough data exists. Improve pages with impressions but weak clicks, pages that attract the wrong intent, confusing or low-use tools, factual drift, and broken links. Do not respond to weak performance by mass-producing similar pages without diagnosing the cause.

## Decision rule
If the visitor benefit, evidence, or meaningful difference from alternatives cannot be explained, **do not publish yet**. Improve the proposal, research it further, or drop it. Publishing and indexing are not success metrics by themselves; visitor value and verified outcomes are.

## PR requirement
Every PR that changes visitor-facing content, functionality, or SEO must state:
- Target need / evidence
- New visitor value
- Differentiation from alternatives
- Verification performed and limitations
- How the result will be measured or revisited

Documentation-only changes may state that no application tests were run and why. Never claim traffic or revenue is guaranteed.
