# Adaptive Player Progressive Update POC

Canonical source: `RobynAwesome/Introduction-to-MCP@6eeb285d0775a7e74ceadc06e32b4068fcfbc595`.

## Bounded claim

An explicit user choice of an **allowed** Adaptive Player rendering profile may be represented as a non-authoritative KPGS Progressive Update. The update records presentation preference only; it cannot increase the device capability ceiling, alter business truth, permissions, governance authority, or production state.

Admitted node: `kopanolabs:adaptive-player:profile:<client-id>`  
Lane: `web.adaptive-player`  
Context route: `kopanolabs.adaptive-player.profile`  
Protocol: `ADAPTIVE_PLAYER_PROFILE_PREFERENCE_V1`  
State class: `non_authoritative`  
Authority effect: `none`  
Boundary: `#NB`

## Mutation evidence

- the merged Adaptive Player POC already proves a single user task across LITE → MOBILE → ENHANCED → IMMERSIVE;
- its capability governor blocks choices above the current device ceiling;
- an update is queued only from the explicit `chooseProfile` action after that gate passes.

`poc_validated=true` therefore means only that this **presentation-preference path** is bounded and tested. It does not assert that automatic device telemetry is canonical truth or that a richer profile is objectively better.

## Offline and receipt boundary

The browser may persist the selected profile and its outbound request queue. It may not manufacture `kpgs.swfus.receipt.v1`. If no configured Progressive Update endpoint answers with a valid canonical receipt, the state remains `pending`.

## Exclusions

Automatic capability detection, auth, account state, infrastructure control, production promotion, estate governance, and any authoritative business mutation are excluded.

`profile preference != capability authority`  
`queued != synchronized`  
`synchronized != canonical authority`
