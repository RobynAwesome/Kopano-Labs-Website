# PR2 Status

Active branch: `pr2-cars4mars-media-artifact-delivery`

Implemented in this PR:
- deterministic build-time DFR-01 materialization
- exact byte-length and SHA-256 verification
- first-party `/reports/KOPANO_LABS.pdf` delivery
- removal of Google Drive production dependency
- production-gate enforcement for artifact integrity
- Cars4Mars media acceptance policy

Still in this PR before merge:
- validate preview route returns `application/pdf` anonymously
- add a real playable campaign-media layer only if it preserves low-data behavior and evidence labeling
