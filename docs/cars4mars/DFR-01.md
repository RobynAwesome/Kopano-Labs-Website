# Cars4Mars DFR-01 — Verified Final Design Report

## Artifact identity

- **File:** `KOPANO_LABS.pdf`
- **Title:** Kopano Labs Final Design Report - Cars4Mars African Rover Challenge 2026
- **Team:** Kopano Labs
- **Team Leader / Chief Architect:** Kholofelo Robyn Rababalela
- **Affiliation:** Cape Peninsula University of Technology, South Africa
- **Submitted baseline:** DFR-01
- **Date:** 02 August 2026
- **Length:** 6 pages, A4
- **Bytes:** 88,367
- **SHA-256:** `42842e597020ebc221e363f826c4d9f328dbf2c6bca6c10e80d4f7ff86840855`
- **Public route:** `/reports/KOPANO_LABS.pdf`
- **Delivery:** Vercel rewrite to the verified external source artifact; cached at the production edge.

The artifact was independently materialized from the stored report and its SHA-256 matches `public/release.json` exactly.

## Current-state declaration

DFR-01 is a **design baseline**, not physical rover evidence. At submission the rover was not yet fabricated, integrated or physically tested. Planned components, calculations and diagrams remain design evidence until the corresponding build/test gate produces measured evidence.

## Locked design baseline

- Six-wheel skid-steer with passive rocker-bogie.
- Target envelope: 700 × 650 × 500 mm.
- BOM target: 28 kg; engineering load case: 30 kg.
- Six Rhino IG52 24 V / 60 rpm / 100 W planetary gearmotors.
- Three Cytron MDDS30 motor drivers.
- Teensy 4.1 retains deterministic actuation/safety authority.
- Jetson Orin Nano Super handles perception.
- Intel RealSense D455 + RPLIDAR A2M12 perception sensors.
- 24 V 20 Ah LiFePO4 pack (480 Wh), BMS, 60 A master fuse, contactor, E-stop, separate logic rails.
- Local Wi-Fi for command/video; RFM95W LoRa for heartbeat/fail-stop only.
- KC governance receives state/evidence copies only; no LLM or cloud service has motor authority.

## Evidence state at DFR-01

| Gate | State | Evidence needed to advance |
|---|---|---|
| Designed | **LOCKED** | Versioned DFR-01 architecture and calculations |
| Funded | **PENDING EVIDENCE** | Dated funding instrument / purchase authority |
| Ordered | **NO ORDER EVIDENCE** | PO, invoice or verified donor commitment |
| Assembled | **NOT STARTED** | Dated photographs + configuration/assembly record |
| Tested | **NOT STARTED** | Continuous footage + conditions + measurements + pass/fail decision |

## Near-term gate from the submitted report

**03-10 August 2026:** funding, orders, final BOM, frame, drive and protected power.

Release evidence: approved orders plus loaded forward/reverse drive, turning and emergency-stop evidence.

## Public-site governance

1. The campaign may be cinematic; the engineering claims may not outrun evidence.
2. Generated/campaign imagery is labelled and never presented as physical rover/test evidence.
3. A state transition requires a dated evidence record.
4. Failures stay in the ledger; corrections create a new versioned decision.
5. `/Cars4Mars/` is the canonical public mission record.
6. `/reports/KOPANO_LABS.pdf` is advertised only because the delivered artifact hash matches the verified DFR-01 source.
