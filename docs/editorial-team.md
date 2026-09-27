# HomeProjectWise Editorial Team

## Coordinated roles
- Planner: selects real reader problems and checks the archive/queue for duplicate angles.
- Gemini Lead Writer: creates structured, useful English drafts.
- Editorial Critic: reviews usefulness, repetition, clarity, unsupported certainty and practical value; failed drafts are revised.
- Image Curator: resolves relevant unused images through a configured provider; invented URLs are forbidden.
- Deterministic Quality Gate: checks structure, depth, images, FAQ, links, schema, tracking and uniqueness.
- Publisher: the only role allowed to move approved queue items to the live site.

## Team rules
The Planner sees the existing queue and archive before selection. The Writer does not publish. The Critic improves the same draft instead of creating a competing article. Image reservations are centralized. Failed checks block publication. The queue is a buffer, not a last-minute emergency list. Runs are idempotent: existing slugs and duplicate images are rejected.

## Provider strategy
Gemini is the primary text engine because GEMINI_API_KEY is configured. The architecture is provider-aware so another generator can be added later without changing publishing.
