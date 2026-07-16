# architecture — servelocal-v2

Last updated 2026-07-13.

## Stack
**Dependencies + pinned versions → `dependencies.md`** (canonical). In brief:
FastAPI + SQLAlchemy 2.0 (**sync** sessions) + Alembic + PostgreSQL (dev) /
in-memory SQLite (tests); Next.js (App Router) + React 19 + TypeScript +
Tailwind 3 + shadcn/ui.

## Two frontend visual layers (BOTH live — know which a route uses)
- **Scoped `.v1` exact-copy (2026-07-13, the 13 v1 screens):** v1's raw CSS ported VERBATIM into
  `frontend/app/v1.css` under a `.v1` wrapper (all vars on `.v1{}`, every rule `.v1 …`-prefixed, 0
  unscoped rules, keyframes `v1`-namespaced) so it can't collide with shadcn's HSL tokens of the same
  name (`--border`/`--muted`/`--card`). Each converted page renders inside `<V1Shell>`
  (`components/v1/v1-shell.tsx` — v1's exact nav+footer + the `.v1` root). `lib/v1-routes.ts`
  `isV1Route(pathname)` lists the converted routes (+ regex for dynamic `/opportunities/<id>` and
  `/portfolio/<id>`); the global `SiteHeader`/`SiteFooter` return null on those to avoid double chrome.
- **shadcn-token pages (M12):** the `@layer components` classes in `globals.css` (see conventions.md).
  Routes NOT in `isV1Route` still use these. Don't mix the two systems on one page.

## Backend layout
- `app/main.py` app factory (runs `check_production_config`, registers `RateLimitMiddleware` before
  CORS) → `app/api/router.py` mounts every feature router under `/api/v1`.
- `app/core/` (config, security, awards, occurrences, consent, email, rate_limit); `app/db/`
  (session, base); `app/models/`, `app/schemas/`, `app/services/` (notifications, enrollment,
  checkin, password_reset, audit), `app/api/routes/`, `app/api/deps.py`.
- **Models register in `app/models/__init__.py`** — NEVER import them in `app/db/base.py` (circular
  import; see the comment in base.py). Import ORDER matters (relationships reference Opportunity).
- `app/core/config.py` anchors `.env` via `Path(__file__)`, not cwd — so uvicorn works from any dir.
  Settings incl. RESEND_API_KEY / EMAIL_FROM / APP_BASE_URL / CONSENT_TOKEN_TTL_HOURS /
  STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET / STRIPE_PRO_PRICE_CENTS / RATE_LIMIT_* /
  ADMIN_EMAILS. `check_production_config` raises on dev defaults in production (M10.2).
- One table, two shapes (M7): `messages.recipient_id` NULL = shared thread post, set = directed
  (inbox). Templates live in their OWN table (`opportunity_templates`, JSON `data` blob) so they
  never leak into opportunity queries.

## Frontend layout
- `lib/api.ts` (typed fetch wrapper + `ApiError`), `lib/auth-context.tsx` (AuthProvider/useAuth;
  token in localStorage under exported `TOKEN_KEY`; `login`/`register`/`refresh`/`logout`),
  `lib/types.ts`, `components/ui/` (hand-vendored button/card/input/label).
- NEXT_PUBLIC_API_URL (default `http://localhost:8000/api/v1`) is where the client hits the backend.

## Migrations
**Migration chain 0001–0022, Alembic rules, and schema conventions → `data.md`**
(canonical).

## Deploy shape (M10 COMPLETE — `docker compose up` verified by Evan 2026-07-12)
- 3 containers: Postgres + API + web (frontend/Dockerfile, multi-stage → Next
  `output: "standalone"`); root `docker-compose.yml`. **NEXT_PUBLIC_* vars are baked into the
  client bundle at BUILD time** — each needs an ARG/ENV pair in frontend/Dockerfile (API_URL,
  APP_URL, TURNSTILE_SITE_KEY as of 2026-07-16) AND a compose `build.args`/Railway service-var.
- **Migrations are NOT in the api image** (corrected 2026-07-16; supersedes the "entrypoint runs
  alembic on boot" claim): backend/Dockerfile CMD is uvicorn-only; `alembic upgrade head` runs via
  docker-compose's `command:` override locally, and via `deploy.preDeployCommand` in
  `backend/railway.json` on Railway. Any OTHER deploy target must wire migrations explicitly.
- **Docker IS available in the dev session now** (2026-07-13; the old "no Docker in dev" note is
  obsolete). Iterate with `docker compose build web && docker compose up -d web` (rebuild the image —
  the web/api images bake code at build time, so a rebuild is required to pick up changes).
  All services back: `docker compose up -d`.
- Runbooks: `docs/DEPLOY.md` (compose) + `docs/DEPLOY_RAILWAY.md` (Railway config-as-code,
  2026-07-16 — per-service railway.json, DATABASE_URL needs `postgresql+psycopg://` scheme);
  secret inventory: `docs/API_KEYS.md` (registry only, never values).
