# Rendered Indexability Gate — 2026-08-23

After Vite builds and route shells are generated, CI reads the actual files that will be deployed. For every public indexed route it verifies:

- no `noindex` token;
- canonical `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1` directive;
- exact canonical URL;
- manifest-governed title;
- manifest-governed description.

`/about/` additionally proves the Organization, WebSite, WebPage, founder Person and separate Ama-Phu Organization identifiers are present.
