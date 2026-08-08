# Kopano Labs Design Authority

This file exists to prevent visual drift back into generic flat brochure design.

## Source hierarchy

1. **KRRababalela.com / RobynAwesome/Portfolio-MBR** — primary visual and interaction DNA: motion, overlap, depth, large composition, animated gradients, hover response, staggered reveals, asymmetry and personality.
2. **Kopano-Labs/Introduction-to-MCP** — product architecture, Kopano Studio evolution, Labs strategy, system vocabulary and operating intent.
3. **Cars4Mars** — cinematic engineering/evidence layer. Mars, rover state, mission telemetry and proof should influence the visual system rather than appear as a detached card.
4. **RobynAwesome/three.js and other forked visual repositories** — implementation toolbox for spatial rendering, 3D, shaders, particles, transitions and richer interaction.
5. **Flat cards / conventional marketing sections** — fallback only for accessibility, reduced motion, low-power devices or information-dense secondary views. Never the default design language.

## Non-negotiable implementation rules

- Homepage must feel spatial and alive before it feels like a brochure.
- Motion must communicate hierarchy or state, not exist as decoration only.
- Cars4Mars must be visually integrated into the main Kopano world.
- Adaptive routing remains intact: different visitors receive different depth, not one giant information dump.
- 3D must progressively enhance. Reduced-motion and constrained-device fallbacks must remain usable.
- SEO, sitemap, robots policy and route manifest remain one discovery system; visual richness must not break crawlability.
- Existing implementation lineage in Introduction-to-MCP must be consulted before inventing replacement patterns.

## Current implementation direction

The first spatial layer uses Three.js for a Kopano/Mars scene with mesh nodes, orbit geometry, spatial labels and pointer-reactive depth. It is deliberately built as progressive enhancement on top of the existing route/SEO system.
