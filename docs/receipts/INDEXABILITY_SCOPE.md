# Indexability Scope

Public indexed routes are governed by `src/route-manifest.json` where both `index` and `crawl` are true.

The production build must prove:

- canonical sitemap membership;
- robots does not block any indexed route;
- rendered HTML carries `index,follow` and the canonical URL;
- route title and description match the manifest;
- public entity graph markers remain present on `/about/`.

POC-only routes remain excluded until explicit promotion. `/adaptive-player/` is currently the bounded example and must emit `noindex,nofollow` until promoted into the public route manifest.
