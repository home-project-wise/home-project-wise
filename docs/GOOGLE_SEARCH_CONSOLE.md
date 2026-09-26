# Google Search Console

The repository contains the Google Search Console verification configuration and a live XML sitemap. The homepage includes the verification meta tag, and the site also contains a verification HTML file. `robots.txt` points to the sitemap.

## What can be verified from this repository
- Verification markup/file is present in the deployed source.
- Sitemap is generated at `https://home-project-wise.github.io/home-project-wise/sitemap.xml`.
- New article URLs are included automatically by the Publisher when an article is published.

## Account status
The actual Google Search Console account state (property verified, sitemap processed, indexed URLs, impressions and clicks) is not exposed by GitHub. Do not treat repository presence as proof that Google has verified or indexed the property.

## After account verification
1. Open **Sitemaps** and submit `sitemap.xml`.
2. Use URL Inspection for the homepage and each important new article.
3. Request indexing for ready pages when appropriate.
4. Monitor indexed pages, impressions, clicks and Core Web Vitals.

The daily traffic report must report Search Console numbers only when an authenticated Search Console data source is actually available; otherwise it must say that Search Console data is unavailable.
