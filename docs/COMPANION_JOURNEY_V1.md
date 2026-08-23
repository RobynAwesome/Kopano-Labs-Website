# Companion Journey v1

Status: implementation tranche under the merged KPGS Companion Interaction Protocol.

Canonical authority: `RobynAwesome/Introduction-to-MCP/governance/kpgs-vnext/everyday-mode/COMPANION_INTERACTION_PROTOCOL.md`.

## Purpose

Make the existing Kopano Companion feel continuous across the Systems Atlas without creating separate public AI identities or falsely upgrading a route into tool/provider execution.

Flow:

`USER -> COMPANION -> RTCP ROUTE -> SANITIZED ROUTE SIGNAL -> WORLD CHANGE -> QUEST RECEIPT`

External system navigation remains a separate explicit user action.

## Invariants

1. One companion identity remains in front; product worlds and council specialists stay behind it.
2. RTCP remains authoritative for route selection.
3. A route changes the visible Systems Atlas world but never auto-opens an external domain.
4. Travel animation is presentation only; it cannot imply provider/tool execution.
5. The journey bridge receives only request ID, destination, execution mode, and minimal receipt metadata.
6. Raw request text, council membership, authority paths and truth-boundary internals are excluded from the journey signal.
7. The local quest log stores at most eight sanitized route receipts in browser storage.
8. Raw request text is never written to the quest log.
9. Storage failure must fail soft and cannot break the companion surface.
10. Reduced-motion and mobile users receive an equivalent semantic route status.

## Destination mapping

- `fivesarena` -> FiveS Arena
- `kasilink` -> KasiLink
- `crisisconnect` -> CrisisConnect
- `starfall` -> Starfall Salvage
- `cars4mars` -> Cars4Mars
- `context`, `portfolio`, `kopanolabs`, unknown -> Kopano Context

The mapping activates the existing atlas selector rather than mutating Three.js scene internals directly. This preserves the scene contract and its existing `scene_selected` receipt path.

## Quest receipt schema

`kopano.companion.quest-receipt.v1`

Stored fields:

- request ID;
- destination ID, label and governed state;
- execution claim;
- receipt gate, outcome and adapter ID;
- local creation timestamp.

Not stored:

- raw user request;
- council payload;
- provider secrets;
- authority paths;
- truth-boundary internals.

## Gate

`npm run journey:verify`

The production build runs this gate before TypeScript/Vite compilation. It fails if the sanitized route signal regresses, raw intent is persisted, external navigation becomes automatic, destination mappings disappear, reduced-motion/mobile styles are removed, or destination-specific actions are lost.
