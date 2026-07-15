# gotchas — servelocal-v2

Last updated 2026-07-13.

- **Browser-pane tab is `visibility:hidden` → CSS animation/transition clocks freeze at t=0**
  (2026-07-13). Reading computed styles "after" an entrance/stagger shows the FROM-frame (e.g.
  `opacity:0`) forever, and a hover transition sticks at its start — NOT a code bug. Fast-forward
  before reading: `el.getAnimations().forEach(a=>a.finish())`, then re-read. Real visible tabs play
  normally. Corollary: never ship a persistent `opacity:0` + `forwards` entrance — use keyframes with
  `backwards` fill so a never-run animation still shows content.
- **Route order: literal before parameterized** — 2026-07-13 added `GET /opportunities/mine` and had
  to declare it BEFORE `/{opportunity_id}` or "mine" is captured as an id (same rule as consent's
  `/request`). FastAPI matches in declaration order.

- **`next dev` and `npm run build` share the `.next/` dir** (2026-07-12): running the production
  build while a `next dev` server is live overwrites the chunks it serves from memory → the running
  app suddenly renders UNSTYLED with 404s on `/_next/static/.../layout.css` + chunk files. Not a
  code bug. Fix: restart the dev server after any `npm run build`; don't build against a live dev
  server on the same `.next`.

- **SQLite drops tz** on `DateTime(timezone=True)` columns: when comparing a stored expiry,
  normalize a naive value to UTC before comparing (done in `reset_password` and consent `_expired`).
  Tests run on SQLite, so this bites in tests, not just dev.
- **A new router must be `include_router`'d, not just imported.** 2026-07-08: the consent router was
  imported in `app/api/router.py` but never mounted → every consent call 404'd, and one test passed
  for the WRONG reason (unknown-token 404). After any new route module, confirm a call actually
  resolves.
- **Route order: literal paths before parameterized ones.** In `app/api/routes/consent.py`,
  `/request` and `/manage/{token}` are declared BEFORE the bare `/{token}` so Starlette doesn't
  capture "request"/"manage" as a token.
- **SQLite constraint changes** need `op.batch_alter_table` (recreates the table); a plain
  in-place ALTER fails. Column ADDs are fine without batch (with `server_default` for non-null).
- Prefer SQLAlchemy `JSON`, not Postgres-only `JSONB`, so tests-on-SQLite and dev-on-Postgres agree.
- **Windows shell:** PowerShell 5.1 has no `&&` (use `;` or the Bash tool). Never rewrite JSON/data
  files with PowerShell (UTF-16/BOM corrupts multibyte). Avoid inline `node -e` with quotes/arrows
  (leaves 0-byte junk files). git's `LF→CRLF` warnings on commit are harmless.
- **0-byte junk files** occasionally appear at the backend root or the ServeLocal root from
  shell-quoting accidents (e.g. a stray `MessageResponse`) — harmless, never commit; delete your own
  before committing.
- **Browser-preview CDP + React events** (refined 2026-07-13, supersedes the 2026-07-09 blanket
  "clicks don't reach handlers"): plain `el.click()` DOES fire React button/link `onClick` now (org
  Verify button + dashboard tab switches worked), but the re-render is async — read the result in a
  SEPARATE `javascript_tool` call, not the same one (same-call reads see the pre-render DOM). What
  still fails: controlled INPUTS ignore a synthetic `.value` set — use `form_input` or the fiber prop
  `el[Object.keys(el).find(k=>k.startsWith('__reactProps$'))].onChange({target:{value}})`. Confirm
  resulting state via the real API and record what was actually driven.
- **git-bash `/c/...` paths fail in SQLite URLs** (`unable to open database file`) — use a RELATIVE
  scratch file (`sqlite:///_mig.db`) or a `D:/...` absolute path for alembic scratch runs.
- **`.env` is `NAME=value`** — prose like `Stripe secret key: xxx` is silently ignored by
  pydantic-settings (bit Evan 2026-07-09; fixed by script without echoing the values).
- **Middleware order in `create_app`**: `RateLimitMiddleware` is added BEFORE `CORSMiddleware` so
  CORS wraps it (last-added = outermost) and 429s carry CORS headers. Keep that order.
- **The billing webhook needs the RAW request body** for signature verification — never add
  middleware/deps that consume or re-parse the body before `stripe.Webhook.construct_event` runs.
