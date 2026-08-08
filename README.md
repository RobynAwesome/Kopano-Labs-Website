<div align="center">
  <img src="public/assets/brand/kopano-logo.svg" alt="Kopano Labs" width="520"/>

# Kopano Labs · Public Systems Studio

**The dedicated production source for [KopanoLabs.com](https://kopanolabs.com) — experiments, sovereign systems, Cars4Mars engineering evidence and adaptive public interfaces built from South Africa.**

[![Production](https://img.shields.io/badge/production-kopanolabs.com-22c55e?style=for-the-badge&logo=vercel&logoColor=white)](https://kopanolabs.com)
[![Source](https://img.shields.io/badge/source-RobynAwesome%2FKopano--Labs--Website-111827?style=for-the-badge&logo=github)](https://github.com/RobynAwesome/Kopano-Labs-Website)
[![Cars4Mars](https://img.shields.io/badge/Cars4Mars-primary%20evidence%20route-f97316?style=for-the-badge)](https://kopanolabs.com/Cars4Mars/)

</div>

---

## Mission

Kopano Labs is not intended to behave like a flat portfolio. The public surface is an **adaptive progressive system**: a visitor states what they need, the interface routes them into the right depth, and the same route registry guides search crawlers, humans and CI.

```text
Intent
  ↓
Adaptive route registry
  ├── Human interface
  ├── sitemap.xml
  ├── robots.txt
  └── CI production gates
        ↓
Labs · Systems · Cars4Mars · Proof
```

![Adaptive agent routing](public/assets/diagrams/agent-routing.svg)

---

## Visual system

The rebuild has a fixed design authority rather than inventing a new aesthetic every session:

1. **KRRababalela.com / Portfolio-MBR** — interaction and visual DNA.
2. **Kopano-Labs/Introduction-to-MCP** — product architecture, Studio lineage and intended evolution.
3. **Cars4Mars** — cinematic engineering/evidence layer.
4. **RobynAwesome/three.js + Bookit-5s-Arena** — spatial runtime, R3F/Drei, motion and adaptive implementation patterns.
5. Flat brochure UI is a fallback, never the default.

### Cars4Mars campaign asset

<img src="public/assets/cars4mars/astronaut-campaign.svg" alt="Cars4Mars astronaut campaign artwork" width="760"/>

---

## Runtime stack

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.184-000000?style=for-the-badge&logo=threedotjs&logoColor=white)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-spatial-111827?style=for-the-badge)
![Drei](https://img.shields.io/badge/Drei-3D_helpers-0ea5e9?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-motion-88CE02?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-production-000000?style=for-the-badge&logo=vercel)

</div>

---

## Public experience map

| Route | Purpose | State |
|---|---|---|
| `/` | Adaptive public entry + spatial Kopano systems map | **Implemented** |
| `/labs/` | Experiment discovery and focused entry | **Implemented / evolving** |
| `/systems/` | Operational systems registry | **Implemented / evolving** |
| `/Cars4Mars/` | Primary rover mission and evidence route | **Implemented / evidence expanding** |
| `/proof/` | Source lineage, claims and public build state | **Implemented** |
| `/sitemap.xml` | Generated crawler discovery map | **Implemented** |
| `/robots.txt` | Guided crawler policy, not a blanket block | **Implemented** |
| `/release.json` | Machine-readable production lineage | **Implemented** |

---

## Current capabilities

### Spatial + motion runtime

- React Three Fiber / Drei 3D scene.
- Mars sphere, orbital geometry, node mesh and live system lines.
- Pointer-responsive spatial movement.
- Framer Motion page transitions and interaction choreography.
- GSAP available for scroll/camera timelines and complex sequences.
- `prefers-reduced-motion` handling.
- Save-Data degradation for constrained devices.

### Adaptive discovery

- One route manifest drives human intent routing and crawler discovery.
- Search-oriented intent entry: rover, jobs, experiments, systems, proof.
- Generated `sitemap.xml`.
- Guided `robots.txt`.
- Canonical URLs and route-specific metadata.
- JSON-LD organization metadata.
- Search Console baseline preserved under `docs/`.

### Evidence governance

- Dedicated production repository boundary.
- `Introduction-to-MCP` retained as architecture/source authority rather than production deployment source.
- Cars4Mars is treated as an evidence chain: **design → procure → build → test → publish proof**.
- CI validates route/crawler/source consistency.

---

## Evidence state: do not confuse POC with FOC

### POC — currently present in source

- dedicated KopanoLabs.com repository;
- spatial React/Three runtime;
- adaptive route registry;
- public Labs, Systems, Cars4Mars and Proof routes;
- crawler guidance + generated sitemap;
- Search Console baseline documentation;
- source-lineage documentation;
- branded production assets;
- GitHub production gate.

### Not yet claimed as fully validated

- finished physical Cars4Mars rover;
- complete Cars4Mars field telemetry;
- authenticated public Kopano workspace;
- production visitor database/telemetry dashboard;
- completed human-verification layer;
- all legacy Studio functions migrated into the new public runtime;
- final cross-device visual regression report for every target device tier.

---

## Implementation order

Priority is deliberately fixed so new ideas cannot jump the queue:

1. **P1 — Rebuild public product/visual surface.**
2. **P2 — Preserve and migrate KopanoLabs.com lineage from `Introduction-to-MCP`.**
3. **P3 — Cars4Mars evidence surface + verified report/media.**
4. **P4 — Production, indexing and source-parity gates.**
5. **P5 — Human verification + first-party telemetry/database.**
6. **P6 — Workspace: projects, tasks, artifacts, Forge/Cowork, Code, schedules, skills/connectors.**

See [`IMPLEMENTATION_ORDER.md`](IMPLEMENTATION_ORDER.md) for the governing execution ladder.

---

## Asset registry

| Asset | Role |
|---|---|
| `public/assets/brand/kopano-mark.svg` | app mark, favicon/PWA identity, spatial node identity |
| `public/assets/brand/kopano-logo.svg` | institutional wordmark, README/header identity |
| `public/assets/cars4mars/astronaut-campaign.svg` | Cars4Mars campaign/evidence visual |
| `public/assets/diagrams/agent-routing.svg` | adaptive user → agent → database/API/documents explainer |

Uploaded GIF/MP4 campaign sources are being treated as cinematic source material. Production derivatives should be compressed, labelled by provenance and loaded adaptively rather than forcing multi-megabyte video on every visitor.

---

## Local development

```bash
git clone https://github.com/RobynAwesome/Kopano-Labs-Website.git
cd Kopano-Labs-Website
npm install
npm run dev
```

Production build:

```bash
npm run build
```

The build regenerates crawler policy before TypeScript/Vite compilation.

---

## Source lineage

The public implementation derives from website-facing architecture already created in `Kopano-Labs/Introduction-to-MCP`, especially:

- `kopano-core/studio/`
- `kopano-core/studio/src/pages/LabsPage.tsx`
- `Schematics/02-Strategy/Kopano Rebrand Plan.md`
- `Schematics/02-Strategy/Kopano Brand Identity.md`
- `Schematics/02-Strategy/Kopano Labs Strategy.md`
- `Schematics/01-Mission/Kopano Context Blueprint.md`

`RobynAwesome/Money-managing-app` is unrelated and must never be used as Kopano Labs production source. `RobynAwesome/cars4mars-landingpage` is retired historical lineage, not a production dependency.

---

<div align="center">

### Intent → Route → Evidence → Production

**Built in South Africa. Designed to survive contact with reality.**

</div>
