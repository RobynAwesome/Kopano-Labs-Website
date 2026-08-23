# robots.txt Contract — 2026-08-23

The public crawler group defaults open with `Allow: /`.

Only these operational prefixes are intentionally blocked:

- `/reports/`
- `/admin/`
- `/api/`
- `/internal/`
- `/private/`
- `/telemetry/`
- `/debug/`

Every `index=true && crawl=true` route and every declared public artifact must remain outside those blocked prefixes. CI fails if that invariant changes.
