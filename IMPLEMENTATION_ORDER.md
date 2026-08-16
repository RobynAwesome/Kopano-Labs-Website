# Kopano Labs Website — Locked Implementation Order

This file is the execution ladder for https://KopanoLabs.com. New ideas are appended behind existing work unless the owner explicitly changes priority.

## P0 — Production boundary ✅
- Canonical GitHub production source: owner-gated / not yet established.
- Observed implementation/deployment source: `RobynAwesome/Kopano-Labs-Website`.
- Governance/specification authority: `Kopano-Labs/Introduction-to-MCP`.
- Deployment/public proof surfaces: Vercel project `kopano-labs` + `https://KopanoLabs.com`.
- `RobynAwesome/Money-managing-app` is unrelated and must never be used for Kopano Labs website work.
- `RobynAwesome/cars4mars-landingpage` is retired and is not a production dependency.

## P1 — Evolve the website as a product surface — ACTIVE
- Evolve the existing Kopano Labs / Kopano Studio architecture; do not replace it with a parallel redesign.
- Preserve the strongest implementation lineage from `Introduction-to-MCP` without copying unrelated MCP internals.
- Public surface must expose Labs, Systems, Cars4Mars, Proof/ledger, and workspace-oriented interaction.
- Mobile-first, accessible, crawlable, adaptive by hardware/network tier, and visually stronger through meaningful spatial interaction.

## P2 — Source-lineage extraction — ACTIVE
- Extract and preserve website-relevant strategy, brand, Studio, deployment, and public-surface references from `Kopano-Labs/Introduction-to-MCP`.
- Keep a source map in `docs/source-lineage/` so future agents can trace where major website concepts came from.
- Mine `RobynAwesome/Portfolio-MBR`, `RobynAwesome/three.js`, Cars4Mars, Starfall, FiveS, and other visual/artifact repositories before generating substitutes.

## P3 — Cars4Mars evidence surface — ACTIVE
- Preserve `/Cars4Mars/` as a first-class route.
- The submitted DFR-01 package is complete and is **not** a website dependency or public release gate.
- Do not restore, regenerate, reconstruct, or gate production on `/reports/KOPANO_LABS.pdf` unless the owner explicitly changes this decision.
- Separate design state from physical-build evidence.
- Build the public evidence ledger, architecture, video/media, support, and physical-validation surfaces.
- Cars4Mars remains the first discovery/evidence route in the adaptive public map.

## P4 — Production-readiness and indexing gates — ACTIVE
- Keep `sitemap.xml`, `robots.txt`, `release.json`, canonical web metadata, build checks, accessibility baseline, route checks, and source-production parity synchronized from the public route/intention registry.
- `robots.txt` is crawler guidance, not a security boundary.
- `sitemap.xml` is generated from the same route registry used by human adaptive routing.
- No stale repository lineage or retired artifact gates in release metadata.

## P5 — Human verification + first-party telemetry — QUEUED BEHIND P1–P4
- Do not gate the public homepage or crawlers with CAPTCHA.
- Add human verification only to abuse-prone/sensitive actions such as forms, submissions, registrations, authentication, and admin actions.
- Preferred verification: Cloudflare Turnstile or equivalent minimal challenge.
- Add privacy-bounded first-party telemetry: session identifier, timestamp, route, referrer/source, campaign parameters, coarse device/browser class, interaction/conversion events, and verification result.
- Store telemetry in a dedicated database layer selected during implementation.
- Add a private `/admin/telemetry` surface for aggregate traffic and event inspection.
- Do not claim a visitor's real identity unless they voluntarily identify themselves.

## P6 — Extended product workspace
- Expand the public Labs surface toward projects/tasks/artifacts, Forge/cowork flows, Code, scheduled work, connectors/skills, and evidence-aware runtime surfaces where those capabilities are actually implemented.

## Governance
1. Complete the highest active priority before promoting lower-priority work.
2. A lower-priority implementation may be scaffolded but must not displace higher-priority delivery.
3. No implementation claim without a repository, build, deployment, route, or runtime receipt.
4. A blocker must state what is blocked, why it matters, whether it is actually required, and at least one materially different path forward before it stops delivery.
5. Any establishment or change of the canonical production repository requires an explicit owner instruction and an atomic governance migration.
