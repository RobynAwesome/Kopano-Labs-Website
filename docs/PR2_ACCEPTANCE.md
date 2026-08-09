# PR2 Acceptance — Cars4Mars Media + Artifact Delivery

PR2 follows merged PR1. It must not redesign the public surface.

## Required before merge

- `/reports/KOPANO_LABS.pdf` is first-party and anonymous.
- Build materializes exactly 88,367 bytes.
- SHA-256 equals `42842e597020ebc221e363f826c4d9f328dbf2c6bca6c10e80d4f7ff86840855`.
- No Google Drive rewrite remains in Vercel routing.
- Cars4Mars Mission Control still separates design evidence from physical evidence.
- Existing mobile-first PR1 behavior remains intact.
- Media never autoplays on Save-Data / lite experience tiers.

## Media continuation

A user-supplied Cars4Mars astronaut clip has been compressed locally to a 360px / 15fps / 5.2s web loop (126 KiB) for a later commit in this PR. Its source visual is campaign media, not physical rover evidence. It must retain that label and a static fallback.
