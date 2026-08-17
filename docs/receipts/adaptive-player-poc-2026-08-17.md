# Adaptive PWA Player POC Receipt — 2026-08-17

**State:** PREVIEW VERIFIED / PRODUCTION NOT PROMOTED  
**Repository:** `RobynAwesome/Kopano-Labs-Website`  
**Branch:** `agent/adaptive-pwa-player-poc`  
**Implementation commit:** `32d7524f8b7284fa5f636c645261ed11682fcb16`  
**Vercel preview deployment:** `dpl_FJUyQeSXJmgQXttGvHPvc8TBUXNx`

## Objective

Prove one mobile-first Adaptive PWA experience can preserve the same user meaning and governance boundary while graduating across four rendering profiles:

`lite -> mobile -> enhanced -> immersive`

## Implemented

- Separate `/adaptive-player/` boot path so the normal Kopano Labs application is not mounted before the player capability decision.
- Existing TypeScript 7 / React 19 / Vite 8 estate retained.
- `lite` profile has a zero-WebGL DOM/CSS scene.
- `mobile`, `enhanced`, and `immersive` profiles lazy-load the Three.js/R3F scene.
- Existing `getExperienceProfile()` signals govern the maximum permitted profile: reduced-motion, Save-Data, CPU cores, memory hint, network class, and viewport width.
- Higher-than-budget profiles fail closed while lower profiles remain selectable.
- Scoped PWA manifest and service worker are restricted to `/adaptive-player/`.
- Navigation has a cached shell fallback after a successful controlled load.
- The player emits local `kpgs.adaptive_player_receipt.v0.1` events for boot, profile selection, blocked profile requests, PWA registration, and install-prompt outcomes.
- The POC route is intentionally absent from the public crawl manifest until promotion is explicitly approved.

## Automated evidence

Vercel build for `dpl_FJUyQeSXJmgQXttGvHPvc8TBUXNx` completed `READY` and passed:

- public asset gate;
- crawl policy generation and verification;
- TypeScript 7 project build;
- Vite 8 production build;
- route-shell generation;
- existing convergence gate;
- existing Cars4Mars POC gate;
- new Adaptive Player POC gate.

New gate output:

```text
Adaptive Player POC verification PASS
Profiles: lite -> mobile -> enhanced -> immersive
Three.js: lazy; lite: zero-WebGL; PWA: scoped; crawl: blocked pending promotion
```

## Bundle evidence

- Adaptive Player application chunk: ~9.04 kB minified / ~3.22 kB gzip.
- Adaptive Player scene chunk: ~2.90 kB / ~1.28 kB gzip.
- Initial shared entry: ~194.26 kB / ~61.49 kB gzip; convergence gate remains below its 400 kB first-paint budget.
- Three/OrbitControls runtime remains deferred (~894.50 kB minified / ~237.88 kB gzip) and does not enter first-paint preload.

## Live preview evidence

`/adaptive-player/` returned HTTP 200 from the Vercel preview and served the dedicated title, description and canonical metadata. Vercel preview protection adds `x-robots-tag: noindex`.

## Explicitly not proven yet

The following must remain `UNVERIFIED` until exercised in a rendered browser/device lane:

- PWA installation on Android/Chrome and iOS/Safari home-screen behavior;
- service-worker offline navigation after first controlled load;
- low/mid/high Android profile selection and performance;
- iPhone/Safari rendering and touch behavior;
- desktop Chrome/Edge rendering;
- real FPS/frame-time budget compliance;
- accessibility browser audit and screen-reader flow;
- visual regression/orientation coverage.

## Governance boundary

`ADAPTIVE RENDERING != WEAKER GOVERNANCE`

Profile selection may change geometry, DPR, animation, input affordances and runtime cost. It may not change canonical business truth, permission scope, evidence meaning or the user's ability to complete the core task.

No production promotion or crawl admission is authorized by this receipt.
