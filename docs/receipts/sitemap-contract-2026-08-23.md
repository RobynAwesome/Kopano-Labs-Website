# Sitemap Contract — 2026-08-23

The canonical sitemap is `https://kopanolabs.com/sitemap.xml`.

It contains only canonical URLs for routes where the route manifest declares both `index: true` and `crawl: true`. Machine-readable JSON artifacts remain discoverable through `robots.txt` and direct links but are not promoted as canonical HTML search landing pages.

The build rejects HTML masquerading as the sitemap, duplicate URLs, non-canonical origins, URL-count drift and ordering drift.
