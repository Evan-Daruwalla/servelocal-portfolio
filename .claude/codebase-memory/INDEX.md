# Codebase memory — servelocal-v2 (INDEX)

> **Size: 46 lines against the skill's ~75-line cap** — raised from ~25 on 2026-09-03 (Evan),
> because 15 bins need 15 routing lines before a single invariant is written. Invariants stay
> one line each, reasoning in the owning bin.

Read this file, then ONLY the bins your task touches. Input/auth/secrets/rendering → always load
`security.md`; hot paths → `performance.md`. Bin facts are claims: if the code disagrees, trust the
code, fix the bin, note the correction. Absolute dates; nothing invented.

**Scope: servelocal-v2 ONLY** (FastAPI/SQLAlchemy/Postgres + Next.js/TS). v1 (`../../ServeLocal
website`, zero-dependency Node) is a DIFFERENT stack — its facts never apply here.

Core bins (last-updated):
- `architecture.md` — layout, **two visual systems (`.v1` scoped + shadcn)**, backend/frontend structure, **`proxy.ts` + force-dynamic**, message/template shapes, deploy shape. (deps→dependencies.md, migrations→data.md)
- `features.md` — milestone status (**M1–M10, M12, M13.1–.5, v1-copy, public-portfolio done; M13.6 SWR reopened 14/22 pages; M14 analytics COMPLETE (M14.1 site + M14.2 org); M11 launch BLOCKED-ON-EVAN**) + feature semantics.
- `conventions.md` — feature-slice pattern, **role guards (`require_student`/`require_org`, decorator-vs-signature on consent-gated routes)**, **data fetching via `useAuthedQuery`/`usePublicQuery`**, **capacity paths MUST use `enrollment.get_opportunity_for_update`**, **`lib/status.ts`**, hard rules. (visual/UI-polish→ui.md, verification→testing.md, status codes→data.md)
- `gotchas.md` — **anim-clock freeze in hidden pane**, **plain `<a>` = full page load (invalidates in-tab tests)**, **heredocs eating `\b` into control bytes**, `git checkout` unsafe on a dirty tree, route order, include_router, SQLite tz loss, raw-body webhook, middleware order, .next clobber.
- `performance.md` — test/dev DB split, single-process throttles, broadcast fan-out, occurrence recompute.

Standards bins (the codebase's committed choices, one home each):
*(Per-bin dates were removed 2026-08-19: they disagreed with 5 of 11 bins' own
headers, in both directions. The header inside each bin is the single copy.)*

Cross-bin invariants — ONE LINE each, deliberately (compressed 2026-09-03). Each rule's
reasoning lives in the bin named after it; this list is the rule, not the argument for it.
- **Students are free forever** — no plan/billing logic may gate a student feature. → conventions
- **Never expose in a read schema**: check-in codes, guardian/reset/consent tokens, full last names. → security
- **Age is recomputed live from `dob`** — never store or derive an "is minor" flag. → consent
- **Public exposure is opt-in + minor-minimized**, and an unknown id 404s uniformly. → security, consent
- **One Alembic revision per schema change; never edit an applied revision.** → data
- **Only the Stripe webhook flips `User.plan`** — no self-serve upgrade endpoint, ever. → security
- **A client cache is identity-scoped** — login OR logout drops every entry. → conventions
- **Error reports must not carry user data** (`scrub_event`). → security
- **Site analytics are aggregate-only** — no user, IP, session or user-agent column. → architecture
- **The audit log is append-only**, deleted only by AGE, never a particular row. → audit-log

> *Public mirror: this index is filtered. `DIRECTORY.md`, `audit-log.md`, `consent.md`, `data.md`, `dependencies.md`, `disclosure.md`, `security.md`, `testing.md`, `tooling.md`, `ui.md` are not published — the security bin deliberately so, the rest simply out of scope for the mirror. The private repo carries all of them. Prose CROSS-REFERENCES to those files still appear throughout the bins below: the published bins are byte-identical copies, not rewrites, and silently editing their text to hide the gap would make the public copy disagree with the private one — a worse failure than a dead pointer.*
