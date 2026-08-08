# Kopano Labs Website Source Lineage

Canonical website implementation lives in `RobynAwesome/Kopano-Labs-Website`.

The following files in `Kopano-Labs/Introduction-to-MCP` are source authorities or historical implementation donors for the rebuild. They are references, not production dependencies.

## Brand + public identity
- `Schematics/02-Strategy/Kopano Rebrand Plan.md` — ecosystem naming map, visual tokens, public brand direction.
- `Schematics/02-Strategy/Kopano Brand Identity.md` — canonical brand identity, typography, color system, voice, product naming.
- `Schematics/05-Training/Kopano Rebrand Agent Briefing.md` — historical naming/compliance briefing; treat contradictory legacy naming as historical evidence, not current truth.

## Product-studio model
- `Schematics/02-Strategy/Kopano Labs Strategy.md` — Google-Labs-style experiment gallery, SA impact-tool direction, accessibility requirements.
- `Schematics/01-Mission/Kopano Context Blueprint.md` — ecosystem relationship and operating model.
- `Schematics/02-Strategy/Kopano Context Foresight.md` — longer-horizon product architecture.

## Existing Studio implementation
- `kopano-core/studio/src/App.tsx` — existing Studio application shell, Council/Labs/Forge/Console/Admin/Training navigation and runtime integration.
- `kopano-core/studio/src/pages/LabsPage.tsx` — Labs runtime surface, readiness, playbooks, interfaces, tool catalog.
- `kopano-core/studio/src/App.css` — prior Studio visual/runtime design system.
- `kopano-core/kopano/labs_registry.py` — Labs tool/interface registry semantics.
- `kopano-core/kopano/api.py` — API surface used by Studio/runtime implementation.

## Public/deployment evidence
- `public/humans.txt` — historical public-team metadata and provenance.
- `docs/IONOS_DEPLOY_GUIDE.md` — legacy deployment history.
- `docs/swarm-ops/DEPLOYMENT_RUNBOOK.md` — deployment and validation process references.
- `docs/swarm-ops/VERIFIED_ENDPOINTS.md` — historical endpoint validation references.
- `scripts/swarm_remote_proof_urls.sh` / `.ps1` — remote proof/route checking lineage.

## Profile/identity audit donor
- `RobynAwesome/RobynAwesome/README.md` — founder/public identity context only.
- `RobynAwesome/RobynAwesome/GITHUB_PROJECT_MEMORY.md` — repository-boundary and evidence hierarchy.
- `RobynAwesome/RobynAwesome/governance/FORK_LEDGER.md` — fork provenance rules where relevant.

## Excluded from production dependency graph
- `RobynAwesome/Money-managing-app` — unrelated fork; never use as Kopano Labs source.
- `RobynAwesome/cars4mars-landingpage` — retired; historical evidence only.

## Extraction rule
Website-relevant concepts may be copied, rewritten, or reimplemented here. Runtime dependencies remain local to this repository. `Kopano-Labs/Introduction-to-MCP` must never be required at build or runtime for KopanoLabs.com to function.
