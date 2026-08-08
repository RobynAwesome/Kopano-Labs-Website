# Kopano Labs Website — Locked Implementation Order

This file is the execution ladder for https://KopanoLabs.com. New ideas are appended behind existing work unless the owner explicitly changes priority.

## P0 — Canonical source boundary ✅
- Production website source: `RobynAwesome/Kopano-Labs-Website`
- Ecosystem/specification authority: `Kopano-Labs/Introduction-to-MCP`
- `RobynAwesome/Money-managing-app` is unrelated and must never be used for Kopano Labs website work.
- `RobynAwesome/cars4mars-landingpage` is retired and is not a production dependency.

## P1 — Rebuild the website as a product surface — ACTIVE
- Rebuild from scratch around the actual Kopano Labs / Kopano Studio architecture.
- Preserve the strongest implementation lineage from `Introduction-to-MCP` without copying unrelated MCP internals.
- Public surface must expose Labs, Systems, Cars4Mars, Proof/ledger, and workspace-oriented interaction.
- Mobile-first, accessible, crawlable, and visually stronger than the old Lovable/static surfaces.

## P2 — Source-lineage extraction — ACTIVE
- Extract and preserve all website-relevant strategy, brand, Studio, deployment, and public-surface references from `Kopano-Labs/Introduction-to-MCP`.
- Keep a source map in `docs/source-lineage/` so future agents can trace where every major website concept came from.

## P3 — Cars4Mars evidence surface
- Preserve `/Cars4Mars/` as a first-class route.
- Restore `/reports/KOPANO_LABS.pdf` only from a verified report artifact; never fabricate the PDF.
- Separate design state from physical-build evidence.
- Keep public build/evidence ledger semantics.

## P4 — Production-readiness and indexing gates
- Keep `sitemap.xml`, `release.json`, canonical metadata, build checks, accessibility baseline, route checks, and source-production parity checks.
- `robots.txt` is intentionally absent. Public crawling is allowed by default.
- No stale repository lineage in release metadata.

## P5 — Human verification + first-party telemetry — QUEUED BEHIND P1–P4
- Do not gate the public homepage or crawlers with CAPTCHA.
- Add human verification only to abuse-prone/sensitive actions such as forms, submissions, registrations, protected downloads, authentication, and admin actions.
- Preferred verification: Cloudflare Turnstile or equivalent minimal challenge.
- Add first-party telemetry with privacy-bounded collection: session identifier, timestamp, route, referrer/source, campaign parameters, coarse device/browser class, interaction/conversion events, and verification result.
- Store telemetry in a dedicated database layer (Supabase/Postgres or MongoDB, selected during implementation based on the website runtime).
- Add a private `/admin/telemetry` surface for aggregate traffic and event inspection.
- Do not claim a visitor's real identity unless they voluntarily identify themselves.

## P6 — Extended product workspace
- Expand the public Labs surface toward the existing Studio model: projects/tasks/artifacts, Forge/cowork flows, Code, scheduled work, connectors/skills, and evidence-aware runtime surfaces where those capabilities are actually implemented.

## Governance
1. Complete the highest active priority before promoting lower-priority work.
2. A lower-priority implementation may be scaffolded but must not displace higher-priority delivery.
3. No implementation claim without a repository, build, deployment, route, or runtime receipt.
4. Any change to this ordering requires an explicit owner instruction.
