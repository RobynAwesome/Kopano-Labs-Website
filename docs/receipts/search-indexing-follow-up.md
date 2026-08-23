# Search Console Follow-up

The website-side crawl and indexability contract is now enforced in CI. The remaining external activation step is Google Search Console itself:

1. keep only `https://kopanolabs.com/sitemap.xml` as the canonical sitemap submission;
2. remove stale/manual HTML-route sitemap submissions if they still exist;
3. URL Inspect `https://kopanolabs.com/` and request indexing;
4. URL Inspect `https://kopanolabs.com/about/` and request indexing;
5. attach the resulting Search Console evidence to this repository before marking Google indexing activation complete.

Do not infer Google index state from HTTP 200, sitemap membership, or repository CI alone.
