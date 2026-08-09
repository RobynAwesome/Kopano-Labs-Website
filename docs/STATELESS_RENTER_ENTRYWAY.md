# Stateless Renter Entryway — KopanoLabs.com

This note exists to stop context loss from becoming production drift.

## Entry identity

A newly arrived model, connector, coding agent, browser agent, or automation must assume it has **no reliable internal memory of Kopano Labs production topology** until it verifies the current repository and live surface.

A renter is not the landlord. A model is not the ledger. A tool is not source authority.

## Canonical graph

```text
Kopano-Labs/Introduction-to-MCP
        │
        ├── Schematics / governance / architecture source authority
        │
        ▼
RobynAwesome/Kopano-Labs-Website
        │
        ├── dedicated KopanoLabs.com implementation source
        │
        ▼
Vercel project: kopano-labs
        │
        ▼
https://KopanoLabs.com
```

The website must not require `Introduction-to-MCP` at build or runtime. Governance is extracted into deterministic local production state.

## Namespace lesson

Repository names are not identities without their owners.

`Kopano-Labs/Introduction-to-MCP` and `RobynAwesome/...` are different namespaces. Never search one owner, receive a 404, and generalize the result to another owner.

Always resolve the full pair:

`owner/repository`

## Forbidden source substitutions

These are outside the production dependency graph:

- `RobynAwesome/Money-managing-app` — unrelated fork.
- `RobynAwesome/cars4mars-landingpage` — retired historical repository.

Never remediate them as part of KopanoLabs.com production work.

## Fixed versus changeable state

For production repair, separate the requirement from its implementation.

### Fixed (`y`)

- canonical public domain remains KopanoLabs.com;
- evidence must stay truthful;
- DFR-01 remains a design baseline, not physical proof;
- excluded repositories remain excluded;
- public artifacts must be directly inspectable;
- live proof outranks an AI claim of success.

### Changeable (`x`)

- storage origin;
- routing/rewrite technique;
- component implementation;
- build step;
- deployment mechanism;
- caching strategy.

If `x1` fails, preserve `y` and test `x2`. Do not redefine `y` merely to make the failure disappear.

## Blocker doctrine

A block means the current implementation path did not satisfy the requirement. It does **not** mean there are no other solutions.

Use:

```text
OBSERVE
  ↓
CLASSIFY
  ↓
SAVE verified state
  ↓
KILL proven-bad path
  ↓
TRY materially different x
  ↓
VERIFY live surface
  ↓
REVEAL actual state
```

### Cars4Mars DFR-01 case study

Observed failure:

`/reports/KOPANO_LABS.pdf → 404`

Root cause:

The route was intentionally excluded from the SPA fallback and there was no first-party artifact at the path. Vercel was behaving correctly.

Alternative path tested:

External Vercel rewrite to the already-verified Google Drive copy.

New evidence:

The original 404 disappeared, but Drive introduced 303/302 redirects and eventually an authentication route.

Decision:

**KILL Drive as anonymous production origin.** The requirement remains valid; only the mechanism failed.

Next valid architecture:

First-party deterministic artifact delivery from the production build/repository so the canonical route can return the actual report without external authentication.

The lesson is reusable: **changed error != solved requirement**.

## Evidence hierarchy

When claims conflict, prefer:

1. owner-observable live behavior;
2. current production deployment state;
3. committed deterministic source;
4. governance/source-authority documentation;
5. prior session notes;
6. model recollection or inference.

Unknown state must remain unknown until checked.

## Required live checks for production claims

At minimum:

```text
/
/Cars4Mars/
/reports/KOPANO_LABS.pdf
/robots.txt
/sitemap.xml
/release.json
```

Check the route itself, not only the deployment dashboard.

For the report route, a successful result means the intended document is anonymously reachable. A redirect to authentication is not success.

## Cars4Mars state transitions

Do not infer physical progress from web progress.

```text
DESIGNED      requires versioned design evidence
FUNDED        requires funding instrument / purchase authority
ORDERED       requires PO / invoice / verified donor commitment
ASSEMBLED     requires dated physical assembly/configuration evidence
TESTED        requires footage + conditions + measurements + pass/fail
VALIDATED     requires accepted evidence against the defined gate
```

A website deployment can improve while Cars4Mars remains in the same engineering state.

## Watch behavior

Production monitoring is transition-based, not repetition-based.

Do not send another alert merely because a known unchanged failure is still present. Alert when there is a new regression, recovery, root-cause change, severity change, deployment material change, or verified Cars4Mars evidence transition.

## Closeout test

Before saying `fixed`, `live`, `healthy`, `delivered`, or equivalent, answer all of these from evidence:

- What exact object did I verify?
- Which namespace/repository supplied the source?
- Which deployment is serving production?
- What does the canonical live route return now?
- Did the requirement pass, or did only the error change?
- Did I touch anything outside the production boundary?

If any answer is missing, report the bounded state instead of completion.
