# NOW — Kopano Labs Website Living Evolution Ledger

**Status:** ACTIVE  
**Owner:** Kholofelo Robyn Rababalela  
**Purpose:** shared cross-window coordination ledger for every Forge/stateless-renter working on KopanoLabs.com  
**Canonical startup:** `canonical.md` -> `Kopano-Labs/Introduction-to-MCP` Main Brain first

> This file is the repository's living coordination surface. Do not replace completed work with a new interpretation. Append, evolve, tick, prove.

## Operating law

Before any change:

- [x] Start in `Kopano-Labs/Introduction-to-MCP`.
- [x] Read Main Brain audit entry and current `Now.md`.
- [x] Read this repository's `canonical.md`.
- [ ] Re-fetch latest `main` immediately before each mutation.
- [ ] Re-read the exact target file immediately before each mutation.
- [ ] Check whether another Forge/window changed the same target or invariant.
- [ ] Preserve existing implementation unless owner instruction explicitly authorizes replacement/deletion/redesign.

After any change:

- [ ] Build/typecheck/lint/test as applicable.
- [ ] Validate the affected route/surface/artifact.
- [ ] Record the commit SHA or runtime receipt here.
- [ ] Tick only what is actually complete.
- [ ] Add newly discovered work below; do not silently erase unfinished or historical work.

---

## Current observed state — 2026-08-12

### Repository/runtime

- Observed implementation repository: `RobynAwesome/Kopano-Labs-Website`.
- Main Brain / governance authority: `Kopano-Labs/Introduction-to-MCP`.
- Last website evolution commit observed before this ledger: `6a02b10cf6e6835c6fd5fe1a12da6425ddd9bf63` — `evolve studio into interactive systems atlas`.
- Canonical renter law added: `b484507abb2f191e3a6784606d3f70cbc46e06f6`.
- Living cross-window ledger added: `33275e54eb786306fd5f7e458f322f7f9622fc44`.
- `AGENTS.md` now requires Main Brain -> `canonical.md` -> `now.md` -> latest target-file grounding before mutation: `8fc30a9e26d886b16843cba4a9e1cbe4f7c341f3`.
- Runtime stack: React 19 + Vite 8 + TypeScript 7 + Three.js + React Three Fiber + Drei + Framer Motion + GSAP.
- Current spatial surfaces include `KopanoScene`, `SystemAtlas`, Cars4Mars rover visuals, FOC, estate navigation, Light/Dark/Crazy modes and adaptive runtime logic.

### Current visual POC already present

- FiveS Arena -> interactive Three.js football field.
- Kopano Context -> rotating orchestration mesh.
- KasiLink -> spatial opportunity/network nodes.
- CrisisConnect -> radar/sweep scene.
- Starfall Salvage -> asteroid/salvage field.
- Cars4Mars -> rover rig / mission world.
- Homepage -> existing spatial Kopano scene + current-work surfaces + Cars4Mars film.

These are foundations to evolve, not placeholders to delete and replace.

### Current known blockers / drift

- [ ] **Canonical repository contradiction:** some files say canonical GitHub production source is unestablished/null while `docs/SOURCE_AUTHORITY.md` calls `RobynAwesome/Kopano-Labs-Website` the dedicated production website source. Do not resolve by model inference; owner authority must establish final wording.
- [x] **Generated discovery drift repaired:** `/content/` is synchronized through committed `public/robots.txt` and `public/sitemap.xml`. Receipts: `4d91f5b611048aaf44887dc9a57b58dd2596e484`, `99ad7c939b197493dc0e6ae09055ae64142d5b43`.
- [ ] **Dependency determinism:** no committed npm lockfile observed; CI uses `npm install`; package ranges use carets.
- [ ] **Documentation parity:** README still advertises TypeScript 5.9 while `package.json` uses TypeScript 7.0.2; public route documentation does not yet fully reflect `/content/`.
- [x] **Initial adaptive 3D parity:** `experienceRuntime.ts` now exports one governed experience profile and `SystemAtlas` consumes it to reduce geometry, particles, lighting intensity, DPR and continuous animation across `full/balanced/lite`, Save-Data and reduced-motion states. Receipts: `d853ead8e0151695bdef1bc8006802cabfe1ab1d`, `4ad28b66da7e458e1432566a504eb5be4fbce5ff`.
- [ ] **Rendered validation:** production CI strongly validates machine artifacts and source strings but has no committed rendered visual-regression/browser test lane yet.
- [ ] **Bundle size:** latest validated build still reports ~1.41 MB JS (~410 KB gzip) and a >500 KB chunk warning; richer 3D evolution must improve code-splitting rather than simply stacking more runtime weight.

### Cross-window telemetry — context only, not repository truth

- Personalized Intelligence/project context confirms other Forge windows are working on the same website lineage and carrying the same instruction: preserve the existing React/Three.js/Framer Motion runtime; improve rather than replace.
- Another active context has discussed a future `/Google-Startups/` presentation route inside the existing site rather than a separate Three.js application. That route is **not present in current `main`** at this ledger update, so treat it as WATCH/context until a real repository mutation and receipt exists.
- Cross-window memory is not allowed to override `main`; every arriving Forge must reconcile memory against this file and the current repository before mutation.

---

# EVOLUTION — Visual-first Kopano World

## Immutable direction

We are not redesigning KopanoLabs.com from scratch.

We are evolving the existing site so the user understands systems primarily through motion, spatial interaction, 3D objects, live state and visual evidence; text explains only what the visual layer cannot communicate safely.

`EXISTING ARCHITECTURE -> DEEPER WORLD -> MORE INTERACTION -> MORE PROOF`

Never:

`EXISTING ARCHITECTURE -> DELETE -> GENERIC NEW WEBSITE`

### Fixed visual/source hierarchy

- [x] `KRRababalela.com` / `RobynAwesome/Portfolio-MBR` = visual and interaction DNA.
- [x] `Kopano-Labs/Introduction-to-MCP` = product architecture, Studio lineage, governance and system vocabulary.
- [x] Cars4Mars = cinematic engineering/evidence layer.
- [x] `RobynAwesome/three.js` + visual/artifact repositories = spatial/shader/particle/transition toolbox.
- [x] Flat cards = fallback/secondary information language, not the default expression.

---

## P0 — Canonical coordination and production truth

- [x] Add root `canonical.md` establishing Main Brain-first renter law.  
  Receipt: `b484507abb2f191e3a6784606d3f70cbc46e06f6`
- [x] Add root `now.md` as living cross-window checklist / coordination ledger.  
  Receipt: `33275e54eb786306fd5f7e458f322f7f9622fc44`
- [x] Make `AGENTS.md` explicitly require `canonical.md` + `now.md` before any mutation.  
  Receipt: `8fc30a9e26d886b16843cba4a9e1cbe4f7c341f3`
- [x] Synchronize generated `/content/` discovery state into `robots.txt` + `sitemap.xml`.  
  Receipts: `4d91f5b611048aaf44887dc9a57b58dd2596e484`, `99ad7c939b197493dc0e6ae09055ae64142d5b43`
- [x] Re-run/verify the complete production gate after synchronization and spatial-runtime evolution.  
  Gate: GitHub Actions `production-gate` run `31590971907` on `ec00091bd7b25566bf5fd2d2849acaa126a25065` -> **SUCCESS**.
- [ ] Resolve canonical GitHub production-source wording only through explicit owner authority; then propagate atomically across governance/release/source documents.
- [ ] Introduce deterministic dependency install path (`package-lock.json`/equivalent + locked CI) only after validating it against the current TypeScript 7/Vite stack.
- [ ] Bring README runtime/version/route claims back into parity with actual source.

---

## P1 — One persistent spatial operating layer

Goal: stop treating Three.js as decorative canvases inside pages and evolve it into a shared visual operating layer that survives navigation and expresses system state.

- [ ] Define one persistent R3F Canvas/world host.
- [ ] Route state drives camera state rather than remounting unrelated scenes.
- [ ] System selection morphs/transitions the world instead of simply replacing a page card.
- [ ] Keep semantic HTML/content underneath/alongside the spatial layer for crawlability and accessibility.
- [x] Framer Motion owns UI choreography in the current implementation.
- [x] GSAP owns existing scroll choreography; future camera timelines remain proof-gated.
- [x] React/R3F owns current stateful world objects.
- [x] Bind the current hero mesh, systems atlas and Cars4Mars rover to one route-aware `kpgs.scene_contract.v1` with local receipts, tier budgets and hidden-page render pause.  
  Receipt: PR #11 / branch `agent/kpgs-spatial-conductor`; Vercel preview `dpl_8n77JBgdTjJr4xfBcKJPzjskAqSR`.
- [x] Preserve direct canonical routes (`/`, `/systems/`, `/labs/`, `/Cars4Mars/`, `/FOC/`, `/proof/`, `/content/`).

### Device tiers

- [x] `full` -> richer geometry, particles, lighting and continuous world motion in `SystemAtlas`.
- [x] `balanced` -> reduced particle count/DPR/lighting pressure in `SystemAtlas`.
- [x] `lite` / Save-Data -> reduced geometry/DPR, no decorative sparkles, and no continuous scene animation where Save-Data is active.
- [x] `prefers-reduced-motion` -> `SystemAtlas` preserves the scene and manual interaction without continuous animation.
- [ ] Apply the same governed profile consistently to every future persistent-world/route scene so no new subsystem bypasses the tier law.
- [ ] Do not hide core content or evidence in WebGL-only surfaces.

---

## P2 — System worlds

### FiveS Arena — football as an interface

Existing POC: procedural 3D pitch + players + moving ball + `FivesArenaFeed`.

- [x] Preserve the current pitch.
- [ ] Evolve pitch into a miniature navigable arena rather than a card illustration.
- [ ] Bind visual state to real/minimal fixture data where an existing API is available.
- [ ] Animate fixture/score/team state as visual state, not decorative random motion.
- [ ] Click/tap fixture/player/field state -> actual FiveS route/action.
- [ ] Add bounded crowd/stadium/lighting depth without harming mobile tiers.

### CrisisConnect — telemetry becomes visible

Existing POC: radar rings + sweep + alert marker.

- [x] Preserve radar language.
- [ ] Evolve toward geospatial/terrain crisis visualization.
- [ ] Severity controls pulse/radius/altitude/camera urgency.
- [ ] GPS/report telemetry creates visual events rather than explanatory cards.
- [ ] Keep field evidence and privacy boundaries truthful.

### KasiLink — opportunity network

Existing POC: connected spatial nodes/blocks.

- [x] Preserve network metaphor.
- [ ] Evolve into people/business/service/opportunity nodes.
- [ ] Show opportunity packets/routes moving through the mesh when backed by real state.
- [ ] Low-data lane remains useful without WebGL dependence.

### Starfall Salvage — playable proof

Existing POC: rotating asteroid/salvage field.

- [x] Preserve asteroid field.
- [ ] Add one bounded playable interaction inside KopanoLabs.com.
- [ ] Pointer/touch movement influences craft/field state.
- [ ] Salvage target interaction routes to the actual Starfall product.
- [ ] Do not rebuild the full game inside the website.

### Cars4Mars — cinematic engineering world

Existing POC: procedural rover rig + mission UI + evidence routes.

- [x] Preserve current evidence model and mission-control architecture.
- [x] Preserve procedural rover as low-detail fallback/LOD foundation.
- [x] Preserve and expose the human-in-the-loop phone/laptop command-interface POC alongside engineering test modes.  
  Receipt: website PR #10, `src/components/MarsRoverScene.tsx`.
- [x] Add deterministic DFR-01 grade, traction, heartbeat-loss and parameter-sensitivity simulation modes to the existing Three.js rover.  
  Engineering source: `RobynAwesome/cars4mars-project@88c7f37115b78df276756425600944abe36d649d`; engineering gate `31900861521` SUCCESS.
- [x] Expose model assumptions and fail states visually while preserving the permanent `MODEL EVIDENCE ≠ PHYSICAL VALIDATION` boundary.  
  Website proof gate: `production-gate` run `31901071476` SUCCESS.
- [ ] Full mode: richer rover model/rig.
- [ ] Terrain + wheel articulation + path planning visualization.  
  Current partial state: terrain/manual articulation already exists and the 45° grade test ramp is now visualized; path-planning visualization remains open.
- [ ] Sensor/perception rays only when explicitly represented as design/simulation, never physical test evidence.
- [ ] Dust/lighting/camera choreography tied to mission state.
- [x] Keep `DESIGNED -> FUNDED -> ORDERED -> ASSEMBLED -> TESTED -> VALIDATED` evidence transitions separate from visual simulation.

### Kopano Context — spatial Main Brain

Existing POC: rotating connected mesh.

- [x] Preserve orchestration mesh.
- [ ] Visualize context packets entering the system.
- [ ] Show classification/routing/node activation.
- [ ] Make POC/FOC/BlackMask-style governance visually legible without turning internal claims into fake runtime evidence.
- [ ] Use animation to explain orchestration flow faster than paragraphs.

---

## P3 — Motion as meaning

- [ ] Page/route transitions communicate system movement rather than generic fade-only transitions.
- [ ] Hover/touch response reveals hierarchy/state.
- [ ] Scroll changes camera or world state only when it explains progression.
- [ ] Motion duration/easing remains consistent with the existing Portfolio-MBR visual DNA.
- [ ] No animation exists merely because a library is installed.
- [ ] Crazy mode can push shaders/particles/parallax further, while Light/Dark remain intentional experiences rather than palette swaps only.

---

## P4 — Asset and artifact mining before generation

Before generating any new visual asset:

- [ ] Audit `RobynAwesome/Portfolio-MBR` for reusable interaction/motion patterns.
- [ ] Audit `RobynAwesome/three.js` for reusable examples/shaders/loaders/controls.
- [ ] Audit visual/artifact repositories in the user's estate before inventing replacements.
- [ ] Audit Cars4Mars source assets and distinguish concept art from physical evidence.
- [ ] Audit Starfall assets before creating any new game visual.
- [ ] Audit FiveS branding/fixtures/assets before creating football substitutes.
- [ ] Record imported/reused asset provenance in the website repository.

Rule: **find -> inspect -> reuse/adapt -> only then generate if genuinely missing.**

---

## P5 — Performance + visual proof gates

- [ ] Split large 3D/runtime chunks with dynamic imports/lazy loading.
- [ ] Establish budgets for JS, scene draw calls/triangles, texture sizes and initial route payload.
- [ ] Add browser-rendered smoke tests for all public routes.
- [ ] Add screenshot/visual regression baselines for desktop + representative mobile widths.
- [ ] Test `full`, `balanced`, `lite`, Save-Data and reduced-motion states in rendered-browser CI.
- [ ] Validate no horizontal overflow/orientation regressions.
- [x] Validate SEO/canonical/robots/sitemap artifacts after the first evolution tranche; run `31590971907` passed all discovery/canonical gates.
- [x] Validate Cars4Mars evidence source checks remain truthful after the first evolution tranche; run `31590971907` passed the Cars4Mars evidence gate.

---

## P6 — Visual-language outcome gate

The evolution is not complete merely because Three.js exists.

It is complete only when:

- [ ] a visitor can identify the major Kopano systems visually before reading long copy;
- [ ] every major system has a distinct interactive/spatial identity;
- [ ] the visual state communicates real product/evidence state where available;
- [ ] the site feels like one coherent Kopano world rather than unrelated 3D demos;
- [ ] low-end South African devices still receive a complete usable experience;
- [ ] the public site remains crawlable and indexable;
- [ ] the owner can recognize the site as an evolution of existing work rather than an AI replacement design.

---

# New idea intake

Every new website idea goes below this line first. Do not silently displace existing priorities.

Format:

`- [ ] IDEA — description | source/window | fixed constraints | intended proof`

---

# Receipts / cross-window handoff

| Date | Window/actor | Mutation | Receipt | Validation |
|---|---|---|---|---|
| 2026-08-12 | Forge checker | Added Main Brain-first `canonical.md` | `b484507abb2f191e3a6784606d3f70cbc46e06f6` | GitHub create-file success |
| 2026-08-12 | Forge checker | Added living `now.md` evolution/checklist ledger | `33275e54eb786306fd5f7e458f322f7f9622fc44` | GitHub create-file success |
| 2026-08-12 | Forge checker | Bound `AGENTS.md` startup to Main Brain + canonical + now | `8fc30a9e26d886b16843cba4a9e1cbe4f7c341f3` | Source check later GREEN in run `31590971907` |
| 2026-08-12 | Forge checker | Synchronized `/content/` robots + sitemap discovery artifacts | `4d91f5b611048aaf44887dc9a57b58dd2596e484`, `99ad7c939b197493dc0e6ae09055ae64142d5b43` | Generated-discovery checks GREEN |
| 2026-08-12 | Forge checker | Exported one governed adaptive experience profile | `d853ead8e0151695bdef1bc8006802cabfe1ab1d` | TypeScript/Vite build GREEN |
| 2026-08-12 | Forge checker | Made `SystemAtlas` respect full/balanced/lite, Save-Data and reduced-motion tiers | `4ad28b66da7e458e1432566a504eb5be4fbce5ff` | TypeScript/Vite build GREEN |
| 2026-08-12 | Forge checker | Removed stale CI assertion and expanded current route/spatial governance gates | `ec00091bd7b25566bf5fd2d2849acaa126a25065` | `production-gate` run `31590971907` SUCCESS |

| 2026-08-15 | Codex | Added bounded Cars4Mars concept references, FOC CONNECTED signal and deterministic POC contract | PR #8 / preview branch `fix/cars4mars-poc-validation-2026-08-15` | Production-gate run `31874454665` SUCCESS; Vercel preview READY |
| 2026-08-15 | Forge | Added auditable DFR-01 simulations to the existing Three.js rover while preserving human-drive mode and evidence boundaries | PR #10 / source head `5f7a334c84116ee7f4ce8a406940e9c10499ace1` / engineering source `88c7f37115b78df276756425600944abe36d649d` | Website production-gate `31901071476` SUCCESS; engineering evidence gate `31900861521` SUCCESS |
| 2026-08-16 | Codex | Added adaptive KPGS spatial conductor across existing Three.js surfaces; preserved current scenes and evidence boundaries | PR #11 / head `fa467569cf0b428c5f2def9764b5c860db92b999` | Vercel READY `dpl_8n77JBgdTjJr4xfBcKJPzjskAqSR`; production-gate run `31952599621` SUCCESS; convergence + Cars4Mars gates PASS |

## Handoff rule

Any Forge/window arriving after this point must:

1. read `canonical.md`;
2. read this file;
3. fetch the latest `main`;
4. continue from unchecked work instead of reconstructing the website from chat memory;
5. append its receipt after validated work.