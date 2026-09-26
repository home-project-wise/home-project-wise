# Traffic monitoring

The repository now has a daily `Daily Traffic Report` workflow. It reads GoatCounter through its JSON API when the `GOATCOUNTER_API_KEY` GitHub Actions secret is configured and stores the latest snapshot in `data/traffic/latest.json`.

The report is deliberately fail-honest:
- no API key -> `status: unavailable`; no invented visit number;
- API error -> `status: error`;
- successful API call -> pageview totals, path statistics, referrers and the previous period are stored.

GoatCounter's API supports total statistics, per-path visitor statistics and referral statistics. Search Console data is separate and is not claimed unless an authenticated Search Console data source is available.

## Required secret
Create a GitHub Actions secret named `GOATCOUNTER_API_KEY` using a GoatCounter API key with access to `homeprojectwise.goatcounter.com`.

The site itself does not expose this secret. The workflow only uses it inside the runner.
