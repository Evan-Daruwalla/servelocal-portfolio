# Codebase memory — servelocal-v2 (INDEX)

Read this file, then ONLY the bins your task touches. Input/auth/secrets/rendering → always load
`security.md`; hot paths → `performance.md`. Bin facts are claims: if the code disagrees, trust the
code, fix the bin, note the correction. Absolute dates; nothing invented.

**Scope: servelocal-v2 ONLY** (FastAPI/SQLAlchemy/Postgres + Next.js/TS). v1 (`../../ServeLocal
website`, zero-dependency Node) is a DIFFERENT stack — its facts never apply here.

Bins (last-updated):
- `security.md` — auth/tokens, consent gate (incl. messaging), **public-portfolio privacy**, rate limiting, audit log, billing webhook, boot guard. (2026-07-13)
- `architecture.md` — layout, **two visual systems (`.v1` scoped + shadcn)**, migration chain 0001–**0021**, Next 15.5.20, **Docker verified/available**, message/template shapes. (2026-07-13)
- `features.md` — milestone status (**M1–M10 + M12 + v1-copy + public-portfolio done**) + feature semantics. (2026-07-13)
- `conventions.md` — **two visual systems + UI-polish rules**, feature-slice pattern, status codes (402/409/503), verification reality (Docker on, CDP clicks work async). (2026-07-13)
- `gotchas.md` — **anim-clock freeze in hidden pane**, route order, include_router, CDP/React verify (refined), SQLite tz loss, raw-body webhook, middleware order, .next clobber. (2026-07-13)
- `performance.md` — test/dev DB split, single-process throttles, broadcast fan-out, occurrence recompute. (2026-07-09)

Cross-bin invariants (always true):
- **Students are free forever** — no plan/billing logic may gate a student feature.
- **Never expose in a read schema**: check-in codes, guardian/reset/consent tokens, full last names.
- **Age is recomputed live from `dob`** every gate check — never store/derive an "is minor" flag.
- **Public exposure is opt-in + minor-minimized**: the public portfolio needs `portfolio_public`
  (minor opt-in consent-gated), and a minor's public name is first + last-initial only (like the
  leaderboard). A private/unknown id returns a uniform 404 — never leak existence.
- **One Alembic revision per schema change; never edit an applied revision.**
- **Only the Stripe webhook flips `User.plan`** — no self-serve upgrade endpoint, ever (M8).
- **The audit log is append-only** — rows are never updated or deleted (M9.2).
