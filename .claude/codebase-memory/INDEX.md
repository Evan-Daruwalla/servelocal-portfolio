# Codebase memory — servelocal-v2 (INDEX)

Read this file, then ONLY the bins your task touches. Input/auth/secrets/rendering → always load
`security.md`; hot paths → `performance.md`. Bin facts are claims: if the code disagrees, trust the
code, fix the bin, note the correction. Absolute dates; nothing invented.

**Scope: servelocal-v2 ONLY** (FastAPI/SQLAlchemy/Postgres + Next.js/TS). v1 (`../../ServeLocal
website`, zero-dependency Node) is a DIFFERENT stack — its facts never apply here.

Core bins (last-updated):
- `security.md` — auth/tokens, consent gate (**9 routes**, verified live both directions), **public-portfolio privacy**, rate limiting, audit log, **admin = `is_admin` column ONLY**, billing webhook, fail-closed boot guard, **nonce CSP**. (2026-08-07)
- `architecture.md` — layout, **two visual systems (`.v1` scoped + shadcn)**, backend/frontend structure, **`proxy.ts` + force-dynamic**, message/template shapes, deploy shape. (2026-08-07; deps→dependencies.md, migrations→data.md)
- `features.md` — milestone status (**M1–M10 + M12 + M13 + v1-copy + public-portfolio done; M11 launch BLOCKED-ON-EVAN**) + feature semantics. (2026-08-06)
- `conventions.md` — feature-slice pattern, hard rules. (2026-07-15; visual/UI-polish→ui.md, verification→testing.md, status codes→data.md)
- `gotchas.md` — **anim-clock freeze in hidden pane**, route order, include_router, CDP/React verify (refined), SQLite tz loss, raw-body webhook, middleware order, .next clobber. (2026-07-13)
- `performance.md` — test/dev DB split, single-process throttles, broadcast fan-out, occurrence recompute. (2026-07-09)

Standards bins (the codebase's committed choices, one home each):
- `dependencies.md` — backend/frontend deps + pinned versions + pip-audit + what NOT to add. **Next 16, `eslint.config.mjs` flat config, `npm audit` 0.** (2026-08-07)
- `ui.md` — UI + UX: editorial language, two visual systems, palette/fonts, emil-design-eng polish; UX flows/states/error-UX.
- `testing.md` — **306 tests** on SQLite *and* on real Postgres (`TEST_DATABASE_URL`), warnings-as-errors, migration up/down/up, browser/CDP verification reality. (2026-08-07)
- `data.md` — Alembic migration chain 0001–0024 + rules, schema conventions, API status-code contract.
- `tooling.md` — backend/frontend commands, Docker rebuild flow, config/secrets + fail-closed boot guard, record hooks, shell. (2026-08-07)

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
