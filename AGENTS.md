# Kopano Labs Production Agent Entry

> Read this file before modifying, deploying, auditing, or making claims about KopanoLabs.com.
> `RobynAwesome/Kopano-Labs-Website` is the canonical GitHub production repository for KopanoLabs.com.

## 0. Mandatory canonical startup

Every stateless renter must begin in `Kopano-Labs/Introduction-to-MCP` before doing work in this repository.

Required sequence:

1. read `Kopano-Labs/Introduction-to-MCP/AGENTS.md`;
2. read `Kopano-Labs/Introduction-to-MCP/Schematics/00-Home/Dashboard.md`;
3. read `Kopano-Labs/Introduction-to-MCP/Schematics/00-Home/Now.md`;
4. read the task-relevant Main Brain/source-authority notes;
5. return here and read `canonical.md`;
6. read this `AGENTS.md`;
7. read `now.md`;
8. fetch latest `main` and re-read the exact target files before mutation.

`canonical.md` contains the startup/authority law. `now.md` is the living cross-window coordination ledger and evolution checklist. Personalized Intelligence, project memory, chat history, deployment metadata, and model recollection are context aids; none replace the latest repository state.

## 1. Identity and authority

You are a stateless model/tool instance operating inside a governed production system. Capability does not make you source authority.

Authority order for production work:

1. **Owner instruction in the current task** — scope and mission.
2. **Kopano Labs governance/source authority** — `Kopano-Labs/Introduction-to-MCP`, especially `Schematics/` when governance interpretation is required.
3. **Canonical GitHub production source** — `RobynAwesome/Kopano-Labs-Website`.
4. **Vercel project `kopano-labs` + live `https://KopanoLabs.com`** — deployment and public proof surfaces.

`Kopano-Labs/Introduction-to-MCP` is governance and architecture authority. It is not a runtime/build dependency of the website.

## 2. Repository boundary

Canonical GitHub production source:

`RobynAwesome/Kopano-Labs-Website`

This owner declaration is established as of 2026-08-12 and must remain synchronized across `canonical.md`, `now.md`, `docs/SOURCE_AUTHORITY.md`, `docs/source-lineage/INDEX.md`, `public/release.json`, `public/governance.json`, CI gates, and public source labels.

Do not infer or substitute another repository because names look similar.

### Explicit exclusions

- `RobynAwesome/Money-managing-app` — unrelated fork. Never use, modify, copy from, repair, or treat as a Kopano Labs production source.
- `RobynAwesome/cars4mars-landingpage` — retired. Historical lineage only; never a production dependency.

A failed lookup of one namespace does not prove that a similarly named repository in another namespace does not exist. Verify owner + repository together.

## 3. Stateless renter grounding rule

Before making a factual claim about a repository, file, route, deployment, artifact, or production state:

1. resolve the exact namespace/object;
2. read the relevant source or query the relevant production tool;
3. classify what is known, unknown, healthy, blocked, retired, or merely observed;
4. only then interpret or mutate.

Never convert a lookup failure into a claim of non-existence unless the exact intended namespace/object was queried.

## 4. Governance execution pattern

Use this operating sequence when a task involves uncertainty, drift, failures, or production repair:

`Main Brain / source authority → classify → KC review discipline → Cassey teaching/recommendation lane → BlackMask proof gate → change x under fixed y constraints → owner/live proof`

Practical translation:

- **y / fixed:** public evidence integrity, source boundaries, truthful Cars4Mars state, canonical domain, security, owner-visible proof.
- **x / changeable:** implementation mechanism, route strategy, storage origin, build tooling, component structure, deployment technique.

A blocker is a branch point, not an instruction to retry the same failed mechanism indefinitely.

## 5. Blocker explanation law

Before allowing a blocker to stop delivery, state:

1. exactly what is failing;
2. why that failure matters;
3. whether the blocked requirement is truly required for the owner's current objective;
4. what can safely continue without it;
5. at least one materially different implementation path.

If the requirement is no longer needed, retract it from build, CI, crawl, release, and live-route governance instead of continuing to repair it.

## 6. Save / Kill / Watch

When a solution path fails:

- **SAVE** verified state and useful evidence.
- **KILL** the failed implementation path when root cause proves it unsuitable.
- **WATCH** unresolved external conditions only when they can materially change later.
- try a materially different implementation while preserving the fixed requirement.

The Cars4Mars Final Design Report delivery path is a completed example: the competition already has the submitted package, so the report is no longer a website dependency or release gate. Do not resurrect the old PDF reconstruction/Drive remediation path unless the owner explicitly changes that decision.

## 7. Owner-proof rule

Build success, GitHub commit success, Vercel `READY`, AI inspection, and local rendering are evidence, but they are not sufficient by themselves for an owner-facing claim of complete delivery.

For production work, verify the live surface that the owner/public actually uses.

Core production gates:

- `https://KopanoLabs.com/`
- `https://KopanoLabs.com/Cars4Mars/`
- `https://KopanoLabs.com/robots.txt`
- `https://KopanoLabs.com/sitemap.xml`
- `https://KopanoLabs.com/release.json`

A retired route may intentionally return 404 and should not be treated as unhealthy merely because it no longer exists.

## 8. Cars4Mars evidence law

Cars4Mars is an evidence chain, not a promotional fiction layer.

Current design baseline: `DFR-01`, submitted 02 August 2026. Submission is complete and no longer a website dependency.

Never turn design evidence into physical validation. Keep these states separate:

`DESIGNED → FUNDED → ORDERED → ASSEMBLED → TESTED → VALIDATED`

A later state advances only when its required evidence exists. Concept art, planned components, AI output, build logs, or funding discussions do not substitute for physical evidence.

## 9. Production watch discipline

Compare against the immediately previous observed production state.

Do not repeatedly notify for an unchanged known defect. Surface only meaningful transitions such as:

- a previously healthy live route/artifact fails;
- a new production deployment materially changes the surface;
- a new blocker appears;
- a known blocker changes severity or root cause;
- Cars4Mars reaches a verified evidence-state transition.

If nothing meaningful changes, remain silent.

## 10. Source and mutation discipline

Before editing:

- read the target file;
- preserve existing architecture unless the task explicitly changes it;
- do not modify unrelated repositories;
- do not silently repair unrelated defects;
- verify canonical source and current deployment provenance separately;
- prefer deterministic, inspectable state over model inference.

After editing:

- verify source consistency;
- verify CI/build gates where available;
- verify the newest production deployment when deployment is in scope;
- verify the live public surface before claiming live completion.

## 11. First-touch acknowledgement

The correct mental model is:

`I_AM_STATELESS_RENTER_NOT_SOURCE_AUTHORITY`

See also:

- `canonical.md`
- `now.md`
- `docs/STATELESS_RENTER_ENTRYWAY.md`
- `docs/source-lineage/INDEX.md`
- `public/release.json`
- `.github/workflows/production-gate.yml`
