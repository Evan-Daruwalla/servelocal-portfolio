# Codebase memory — servelocal-v2 (INDEX)

Read this file, then ONLY the bins your task touches. Input/auth/secrets/rendering → always load
`security.md`; hot paths → `performance.md`. Bin facts are claims: if the code disagrees, trust the
code, fix the bin, note the correction. Absolute dates; nothing invented.

**Scope: servelocal-v2 ONLY** (FastAPI/SQLAlchemy/Postgres + Next.js/TS). v1 (`../../ServeLocal
website`, zero-dependency Node) is a DIFFERENT stack — its facts never apply here.

Core bins (last-updated):
- `architecture.md` — layout, **two visual systems (`.v1` scoped + shadcn)**, backend/frontend structure, **`proxy.ts` + force-dynamic**, message/template shapes, deploy shape. (deps→dependencies.md, migrations→data.md)
- `features.md` — milestone status (**M1–M10 + M12 + M13 + v1-copy + public-portfolio done; M11 launch BLOCKED-ON-EVAN**) + feature semantics.
- `conventions.md` — feature-slice pattern, hard rules. (visual/UI-polish→ui.md, verification→testing.md, status codes→data.md)
- `gotchas.md` — **anim-clock freeze in hidden pane**, route order, include_router, CDP/React verify (refined), SQLite tz loss, raw-body webhook, middleware order, .next clobber.
- `performance.md` — test/dev DB split, single-process throttles, broadcast fan-out, occurrence recompute.

Standards bins (the codebase's committed choices, one home each):
*(Per-bin dates were removed 2026-08-19: they disagreed with 5 of 11 bins' own
headers, in both directions. The header inside each bin is the single copy.)*

Cross-bin invariants (always true):
- **Students are free forever** — no plan/billing logic may gate a student feature.
- **Never expose in a read schema**: check-in codes, guardian/reset/consent tokens, full last names.
- **Age is recomputed live from `dob`** every gate check — never store/derive an "is minor" flag.
- **Public exposure is opt-in + minor-minimized**: the public portfolio needs `portfolio_public`
  (minor opt-in consent-gated), and a minor's public name is first + last-initial only (like the
  leaderboard). A private/unknown id returns a uniform 404 — never leak existence.
- **One Alembic revision per schema change; never edit an applied revision.**
- **Only the Stripe webhook flips `User.plan`** — no self-serve upgrade endpoint, ever (M8).
- **The audit log is append-only** — rows are never updated, and deleted ONLY by age
  via `purge_expired_audit_log` enforcing `AUDIT_LOG_RETENTION_DAYS` (M9.2; the one
  sanctioned exception, 2026-08-13 — see security.md §Audit-log retention). There is
  deliberately no path to delete a PARTICULAR row; that is the part this protects.

> *Public mirror: this index is filtered. `data.md`, `dependencies.md`, `security.md`, `testing.md`, `tooling.md`, `ui.md` are not published — the security bin deliberately so, the rest simply out of scope for the mirror. The private repo carries all of them. Prose CROSS-REFERENCES to those files still appear throughout the bins below: the published bins are byte-identical copies, not rewrites, and silently editing their text to hide the gap would make the public copy disagree with the private one — a worse failure than a dead pointer.*
