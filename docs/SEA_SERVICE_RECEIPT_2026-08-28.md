# SEA Service Production Receipt — 2026-08-28

**Lane:** Search Entity Architecture (SEA)  
**Repository:** `RobynAwesome/Kopano-Labs-Website`  
**Issue:** #39  
**PR:** #40  
**Production merge:** `9184b4cafaed5d406397d23191d898e99b035742`

## What changed

Search Entity Architecture was promoted as a first-class Kopano Labs public service surface while preserving the existing React / Three.js / Framer Motion website architecture.

The production change includes:

- primary-navigation `SEA` route;
- homepage SEA dominance surface after the existing ecosystem introduction;
- dedicated `/SEA/` route;
- normal-user-first and technical buyer/research messaging;
- the SEA six-gate path: `DISCOVER -> IDENTIFY -> DISAMBIGUATE -> RELATE -> RETRIEVE -> VALIDATE`;
- committed `/SEA/` sitemap and robots policy;
- static route shell with canonical metadata;
- `WebPage` + `Service` JSON-LD for Search Entity Architecture;
- production-gate coverage for SEA crawl policy, sitemap, route shell, canonical URL and Service schema.

## Canonical public hooks

- **What does AI think of you?**
- **Make your company machine-understandable.**
- **From indexed to understood.**
- **We don't control AI. We engineer the evidence it can find.**

## Validation receipts

### Pull-request gate

PR #40 head `99347e6d4b65761903dd84c043366996de68e2f9`:

- production-gate run #231: **PASS**;
- experiment-projection-gate run #41: **PASS**;
- Vercel preview: **READY**;
- preview `/SEA/`: HTTP 200 with canonical metadata and SEA `Service` JSON-LD.

The Vercel preview correctly exposed platform-level `x-robots-tag: noindex`; this was not treated as production indexability evidence.

### Production merge gate

Main commit `9184b4cafaed5d406397d23191d898e99b035742`:

- production-gate run #232: **PASS**;
- production Vercel deployment `dpl_37wWvHbDKbfacFL3GryEMrgbPYyw`: **READY**;
- deployment target: **production**;
- deployment Git ref: `main`;
- deployment Git SHA matches the production merge.

### Live production verification

Verified after production deployment:

- `https://kopanolabs.com/SEA/` -> HTTP **200**;
- no production `x-robots-tag: noindex` header observed;
- page-level robots meta -> `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`;
- canonical -> `https://kopanolabs.com/SEA/`;
- title -> `Search Entity Architecture (SEA) — Kopano Labs`;
- SEA `WebPage` JSON-LD present;
- SEA `Service` JSON-LD present with provider `https://kopanolabs.com/#organization`;
- `https://kopanolabs.com/sitemap.xml` -> HTTP **200** and contains `https://kopanolabs.com/SEA/`;
- `https://kopanolabs.com/robots.txt` -> HTTP **200**, contains `Allow: /SEA/`, and points to the public sitemap;
- `https://kopanolabs.com/` -> HTTP **200**, page-level robots meta remains index/follow and no production `x-robots-tag: noindex` was observed.

## Truth boundary

This receipt validates deployment, crawl eligibility, canonical metadata, machine-readable service semantics and automated production gates. It does **not** prove that Google or another provider has indexed `/SEA/`, ranked it, cited it, formed a Knowledge Panel, or changed a generative answer. Those are external machine observations and require later SEA retrieval/revalidation receipts.

## Remaining human QA

Automated/source verification does not replace visual review. Issue #39 should remain the human QA / follow-up surface until the rendered homepage and `/SEA/` route have been inspected on representative desktop and mobile browsers.

## POC / FOC verdict

**POC_VALIDATED:** public SEA service deployment + discovery architecture + production gates.  
**UNKNOWN:** search-engine indexing latency, generative retrieval behavior, client conversion, pricing, recurring-retainer economics.

## Next admissible action

Run the first internal SEA Entity State Audit with a frozen canonical fact set and preserved baseline query receipts, then run one external SME/business pilot before establishing public price bands.
