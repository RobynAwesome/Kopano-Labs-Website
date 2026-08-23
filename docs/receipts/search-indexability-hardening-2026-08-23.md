# Search Indexability Hardening Receipt — 2026-08-23

## Trigger

Follow-up to merged PR #32 (`SEO: add public entity graph for Kopano Labs and Ama-Phu`) and the earlier Search Console sitemap contract in PR #20.

## Live state observed before this change

- `https://kopanolabs.com/about/` returned HTTP 200 with canonical metadata, `index,follow` and entity JSON-LD.
- `https://kopanolabs.com/entities.json` returned HTTP 200 as `application/json`.
- `https://kopanolabs.com/sitemap.xml` returned HTTP 200 as `application/xml` and contained `/about/`.
- `https://kopanolabs.com/robots.txt` returned HTTP 200, advertised the canonical sitemap and allowed `/about/` plus `/entities.json`.
- `https://kopanolabs.com/evidence.json` returned HTTP 200 as `application/json`, confirming public static artifacts are not currently being swallowed by the SPA fallback.

## Hardening

1. Public discovery now has an explicit invariant: exactly one `Allow: /` in the public `User-agent: *` group.
2. The crawl verifier fails if the site root is blocked, any sitemap/public path falls under a `Disallow`, the canonical sitemap directive drifts, or protected operational prefixes disappear.
3. Generated public route shells now derive their robots directive from route index state.
4. A rendered indexability gate verifies every crawlable/indexed route after Vite build and route-shell generation:
   - no `noindex`;
   - canonical `index,follow` directive;
   - canonical URL;
   - route-manifest title and description.
5. `/adaptive-player/` remains explicitly `noindex,nofollow` until governed promotion because it is a POC-only route and is intentionally absent from the crawl manifest.
6. The structured entity chain now includes `WebSite` and `/about/` `WebPage` nodes linking the Kopano Labs organization, founder and separate Ama-Phu entity.

## Search Console boundary

Repository and deployment controls can prove crawl/index readiness, but they cannot prove Google has accepted a sitemap submission or indexing request. Search Console submission/URL Inspection still requires an external Search Console receipt. No connected Search Console integration was available in this execution lane.

## Governing result

`LIVE_ROUTE -> CRAWL_ALLOWED -> SITEMAP_MEMBER -> RENDERED_INDEXABLE -> GOOGLE_CONTROL_PLANE_PENDING`
