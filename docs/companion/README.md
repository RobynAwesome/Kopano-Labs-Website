# Kopano Companion — Public Interaction Layer

The companion is the human-facing layer above RTCP. It does not replace RTCP, KPGS or product-local agents.

## Public loop

`YOU -> COMPANION -> GUARD -> SYSTEM -> RECEIPT`

The visitor talks to one companion. Specialist council seats wake behind the interface only when the route needs them.

## Current implementation

- `src/components/RTCPHub.tsx` — companion conversation + existing 3D Round Table world.
- `src/companionRuntime.ts` — plain-language route presentation and execution-claim boundary.
- `src/components/CompanionSecurityGraph.tsx` — interactive safe/breach trust graph.
- `scripts/verify-companion-ux.mjs` — production build gate.
- `docs/receipts/companion-visual-provenance-2026-08-23.md` — asset/fork provenance receipt.

## Truth boundary

`ROUTE_ONLY` is not `PROVIDER_EXECUTED` and is not `TOOL_EXECUTED`.

The public interface must say what actually happened rather than letting animation imply execution.

The security graph is educational. It shows where an invalid path is blocked without teaching an attacker how to breach the system.
