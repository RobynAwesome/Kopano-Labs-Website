# Cars4Mars Build State — 18 August 2026

**Observed:** 2026-08-18 19:17 SAST  
**Public projection repository:** `RobynAwesome/Kopano-Labs-Website`  
**Design baseline:** `DFR-01` — 02 August 2026  
**Current physical-build P-step:** `P-001A — wheel / hub interface dimensioning`

## Why this record exists

The project has moved from design/simulation/software evidence into the beginning of physical-design work. That transition is important enough to be recorded explicitly so later website work, design-team work, CAD work and AI-generated material cannot silently reinterpret what physically existed at this moment.

This record is a public/projection receipt. It does not replace the engineering ledger.

## Authority chain

```text
ARC 2026 Rulebook Rev 2.0
        ↓
DFR-01 locked baseline
        ↓
RobynAwesome/Introduction-to-MCP Cars4Mars KPGS contract
        ↓
RobynAwesome/cars4mars-project engineering/evidence ledger
        ↓
KopanoLabs.com /Cars4Mars/ public projection
```

### Pinned receipts

- KPGS Cars4Mars contract: `RobynAwesome/Introduction-to-MCP` PR #78, merged at `a064929dcca43b1d78dc11ff7b289e2d76fbbdb1`.
- Mechanical P-001 contract/evidence: `RobynAwesome/cars4mars-project` PR #5, merged at `e7d5a3d1ef797693e03f382a3c9900bc50de6f6a`.
- P-001 generated-board/lab-session provenance: `RobynAwesome/cars4mars-project` PR #7, merged at `74fa057fed4a5a68ab9a0b9370b5f01b2be954a8`.
- Artifact identity register: `engineering/mechanical/P-001_ARTIFACT_REGISTER.json` in the engineering repository.
- Active engineering work item: `RobynAwesome/cars4mars-project` issue #6.
- Mechanical evidence rows: `C4M-MECH-0001` and `C4M-MECH-0002`.

## DFR-01 constants that stay locked

- exactly six wheels;
- six-wheel skid-steer + passive rocker-bogie;
- 250 mm wheel diameter baseline;
- 700 × 650 × 500 mm target rover envelope;
- 28 kg BOM target / 30 kg engineering load case;
- six Rhino IG52 24 V / 60 rpm / 100 W gearmotors;
- three Cytron MDDS30 motor drivers;
- Teensy 4.1 deterministic drive/safety authority;
- Jetson Orin Nano Super perception authority only;
- RealSense D455 + RPLIDAR A2M12 sensing baseline;
- 24 V 20 Ah LiFePO4 protected-power baseline;
- local Wi-Fi command/video; RFM95W LoRa heartbeat/fail-stop only;
- no LLM, cloud service or public website has motor authority.

The submitted DFR-01 report remains historical design evidence with identity already recorded in `docs/cars4mars/DFR-01.md`. The retired `/reports/KOPANO_LABS.pdf` website route remains retired and is not reactivated by this build transition.

## New observation — HPI d-school lab session

The team now has an active fabrication/design session at the HPI d-school fabrication / 3D lab.

Observed/reported context:

- LightBurn 2 is available in the lab workflow;
- rough drawings/cards are being prepared for design-team handoff;
- small-piece prototyping is preferred over attempting the whole rover at once.

Classification: **facility context / design preparation only**.

It does **not** mean:

- a wheel has been fabricated;
- an axle has been fabricated;
- rocker-bogie hardware exists;
- the rover is assembled;
- physical mobility has been tested;
- Mars readiness has advanced.

## Generated design references admitted at this gate

The 18 August session produced three useful generated design references:

1. Cars4Mars Axle Module Concept Board;
2. Cars4Mars Axle Module Assembly Guide;
3. Cars4Mars Part 1 — Wheel Concept Poster.

Evidence class: **GENERATED DESIGN REFERENCE**.

Their exact byte counts, pixel dimensions and SHA-256 identities are pinned in `P-001_ARTIFACT_REGISTER.json` together with the two HPI d-school session-photo identities. The register is provenance evidence only; the image binaries are not treated as fabrication receipts.

They may support discussion and CAD interpretation. They may not supply hidden measurements, claim fabrication, or overwrite DFR-01.

## P-001 — wheel interface

The physical-design sequence now starts with one wheel rather than the complete rover.

Interface law:

```text
WHEEL BODY
   ↓ removable screw / bolt connection
WHEEL HUB
   ↓ precision shaft + bearing interface
AXLE SHAFT
```

The bare wheel shell is not the intended precision axle-bearing surface.

### Wheel concept admitted

- open-spoke structure;
- central hub mounting face;
- center clearance/bore for the hub stack;
- removable bolt/screw interface;
- replaceable tread-insert pockets around the outer circumference.

### Tread insert purpose

The brown pads shown in the concept are now classified as replaceable traction inserts to be experimentally evaluated for:

- compliance on stones/rough surfaces;
- reduction of rigid-plastic slip;
- whether pocket spacing sheds or traps stones;
- easy replacement without reprinting the whole wheel.

Material candidates are experiments, not final hardware decisions:

- initial wheel-body fit prototype: PLA or PETG;
- traction insert: TPU or another rubber-like material;
- later stronger body candidate: nylon/reinforced filament if the actual printer/process supports it.

## PKA boundary — x changes, y stays fixed

### y / fixed

- six-wheel DFR-01 architecture;
- 250 mm wheel outer-diameter baseline;
- passive rocker-bogie architecture;
- challenge mass/envelope boundaries;
- deterministic motor/safety authority;
- evidence-state truth boundary.

### x / bounded experiment variables

- wheel width;
- spoke count and thickness;
- hub mounting-face diameter;
- center-bore diameter;
- bolt count, PCD and thread;
- axle-shaft diameter;
- bearing stack dimensions;
- tread-pocket count/width/length/depth;
- traction-insert retention method/material;
- printer/process tolerances;
- later rocker/bogie link dimensions.

Unknown `x` values stay `TBD` until deliberately proposed and measured. Generated images cannot promote them to constants.

## Progressive Update state

Cars4Mars inherits the merged KPGS vNext chain:

```text
Adaptive Progressive Updates (APU)
        ↓
Progressive Update
        ↓
#NB
        ↓
bounded CRUD
        ↓
SWFUS
```

Canonical stage order:

1. Telemetry
2. Classification
3. Routing
4. Protocol Selection
5. Invariant Audit
6. POC / FOC Check
7. State Update
8. Distribution

Current P-001 state:

```text
APU = YELLOW
CRUD = HOLD
SWFUS physical-state promotion = NOT REACHED
```

Reason: the concept is coherent, but critical interface dimensions, CAD release, toolpath/slicer evidence and physical coupon receipts are still absent.

SWFUS may synchronize an admitted projection after the gate passes. It is not authority and cannot manufacture proof.

## Black Mask / BlackMass posture

- Black Mask v0.5 remains the pre-flight inspect/proof gate.
- BlackMass sandbox may explore dimensions, materials, interface options and geometry after pre-flight.
- sandbox output stays non-authoritative until a review row and dated artifact exist;
- no fake ACK;
- no production/physical graduation from narrative or generated visuals;
- realism and measurable fit outrank aesthetics.

## Small-piece build sequence

```text
P-001A  dimension wheel/hub interface
    ↓
P-001B  print/fabricate hub + bolt-pattern fit coupon
    ↓
measure + revise
    ↓
P-001C  tread-pocket + flexible-insert coupon
    ↓
measure retention / stone-trapping / damage
    ↓
P-001D  first full 250 mm wheel prototype
    ↓
P-002   wheel hub
    ↓
P-003   axle shaft
    ↓
P-004   bearing housing
    ↓
P-005   mounting bracket
    ↓
P-006   rocker/bogie link
    ↓
P-007   dry assembly
    ↓
P-008   rolling/load prototype
```

## Design-team packet required for P-001A

Bring one bounded packet:

1. rough hand sketch;
2. front view;
3. side view;
4. top or section view;
5. locked 250 mm outer-diameter reference;
6. proposed wheel width;
7. proposed center bore;
8. proposed hub mounting-face diameter;
9. proposed bolt/screw pattern;
10. proposed tread-pocket dimensions;
11. actual available printer/process;
12. actual available prototype material;
13. revision ID + timestamp.

The design team should not infer missing dimensions from the generated poster.

## Part evidence ladder

```text
GENERATED
→ DIMENSIONED
→ CAD_RELEASED
→ SLICED / TOOLPATH_REVIEWED
→ FABRICATED
→ FIT_TESTED
→ ROLL_TESTED
→ LOAD_TESTED
→ ACCEPTED | REVISE
```

System-level DFR-01 evidence remains separate:

`DESIGNED → FUNDED → ORDERED → ASSEMBLED → TESTED → VALIDATED`.

A part-level coupon can be fabricated while the complete rover remains `ASSEMBLED = NOT STARTED`.

## Drift blockers

Hold/reject any projection that:

- changes six wheels to four;
- treats generated dimensions as measured dimensions;
- treats lab access as fabrication;
- treats LightBurn availability as proof of a cut part;
- treats simulation/software CI as physical mobility evidence;
- allows AI/cloud/perception to bypass Teensy safety authority;
- changes a locked DFR-01 constant without an explicit governed design-change record;
- publishes a stronger physical state before the corresponding evidence receipt exists.

## Next proof

**P-001A — dimension the wheel/hub interface.**

The next evidence-bearing update should come from the user's rough drawings/cards and the actual lab process/material information. Only then should the first interface coupon be released for fabrication.
