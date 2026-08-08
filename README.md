# Kopano Labs Website

Dedicated public source for **https://KopanoLabs.com**.

This repository exists to end the previous source ambiguity. It is the website repository. It is not a fork of an unrelated project and it does not use `RobynAwesome/Money-managing-app` or the retired `RobynAwesome/cars4mars-landingpage` as production dependencies.

## Source lineage

The rebuild was derived from website-facing architecture and implementation already present in `Kopano-Labs/Introduction-to-MCP`, especially:

- `kopano-core/studio/` — existing Kopano Studio React application
- `kopano-core/studio/src/pages/LabsPage.tsx` — Labs runtime surface
- `Schematics/02-Strategy/Kopano Rebrand Plan.md`
- `Schematics/02-Strategy/Kopano Brand Identity.md`
- `Schematics/02-Strategy/Kopano Labs Strategy.md`
- `Schematics/01-Mission/Kopano Context Blueprint.md`
- `Schematics/02-Strategy/Kopano Context Foresight.md`
- deployment/runbook material that references Kopano Labs public surfaces

The organization repository remains the architecture/history authority. This repository is now the clean public-web implementation boundary.

## Rebuild principles

1. **Product surface, not brochure.** The site behaves like a lab/workspace and exposes experiments, systems and proof.
2. **Reality before aesthetics.** Claims must map to artifacts or a clearly labelled evidence state.
3. **South African foundation.** The public identity starts from local constraints and local systems rather than generic AI marketing.
4. **Experiments graduate.** Labs → test → proof → production is visible in the information architecture.
5. **One production source.** Future KopanoLabs.com website changes belong here.

## Local development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Production routes

- `/` — Kopano Labs public Studio
- `/Cars4Mars/` — Cars4Mars mission/evidence surface
- `/robots.txt`
- `/sitemap.xml`
- `/release.json`

## Profile audit input

`RobynAwesome/RobynAwesome` was reviewed during the rebuild. Useful identity signals retained: sovereign/offline-first systems, South African reality, public validation, Kopano Labs as the umbrella. Stale percentages, malformed Markdown/table fragments and overly absolute technology claims were not copied into this site.
