# Google Search Console baseline — 2026-08-08

Source: owner-provided Search Console screenshots captured 2026-08-08.

## Property

`kopanolabs.com`

## Performance baseline

- 3-month clicks: 53
- 3-month impressions: 1.18K
- Average CTR: 4.5%
- Average position: 26.3
- Leading query: `kopano labs` — 38 clicks / 127 impressions
- Other visible queries included `kopano`, `kopano archive`, `buy kopano`, `kopano pricing`, `kopano app`, and `kopano official website`.

## 28-day insight snapshot

- Clicks: 3
- Impressions: 321
- Top content shown: `https://kopanolabs.com/`
- South Africa supplied more than 99% of visible clicks in the country view.

## Indexing baseline

Search Console showed five known pages:

- Indexed: 3
- Not indexed: 2
- Not-indexed reason: `Blocked by robots.txt`
- Search appearance warning: `Indexed, though blocked by robots.txt` on 2 pages
- Sitemap page showed zero submitted sitemaps at capture time.

## Remediation now present in source

1. `robots.txt` welcomes public discovery and guides compliant crawlers to public surfaces.
2. `sitemap.xml` is generated from `src/route-manifest.json`.
3. Cars4Mars is the first discovery route in the generated sitemap.
4. Public route metadata is driven from the same route manifest.
5. Canonical, description, Open Graph and Twitter metadata synchronize with adaptive navigation.
6. CI verifies that route registry, sitemap, robots guidance, adaptive human routing and SEO metadata remain coupled.

## Human action still required in Google Search Console

Submit:

`https://kopanolabs.com/sitemap.xml`

Then request/observe recrawl and validation for the historical robots-blocked URLs. Search Console may retain historical warnings until Google recrawls the affected pages.

## Measurement goal

Treat this snapshot as the before-state. Future indexing changes should be compared against it rather than estimated from public Google search results.
