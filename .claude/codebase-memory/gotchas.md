# gotchas — servelocal-v2

Last updated 2026-09-07.

- **A `NEXT_PUBLIC_*` var needs THREE edits, and missing one fails silently.**
  `lib/flags.ts` (or wherever it is read), an `ARG`+`ENV` pair in
  `frontend/Dockerfile` **before** `RUN npm run build`, and an entry in
  `docker-compose.yml`'s `web.build.args`. Docker forwards a build arg only for a
  DECLARED `ARG` and Next inlines these at BUILD time, so an undeclared one is
  dropped without a warning and the code reads `undefined` — the `=== "true"`
  comparison goes false and the feature simply never turns on. Live case:
  `NEXT_PUBLIC_LEGAL_SIGNOFF_COMPLETE` was undeclared until 2026-09-07, so
  following DEPLOY_RAILWAY Step 6 could never clear the legal draft banner, with
  no error in the build log, the app log, or the page (2026-09-07).
- **`/terms` and `/privacy` are `ƒ` dynamic, so there is no prerendered HTML to
  grep** — proving a flag's effect needs `next start` and a request, not a file
  search in `.next/`. And prove it BOTH ways: a page with no banner proves nothing
  until the rebuild WITHOUT the flag shows the banner return (2026-09-07).

- **Every role guard is literally named `guard`.** `require_org` and `require_student`
  are both closures returned by `_role_guard`, so matching a route's dependencies by
  `__name__` reports EVERY org route as unguarded and cannot tell the two roles apart.
  Compare the function OBJECT (`d.call is require_org`), not its name (2026-09-03).
- **`SessionLocal` in a test aims at the real database.** It binds to the configured
  `DATABASE_URL`, and `dependency_overrides` cannot reach code outside the dependency
  system — so a counter or middleware that opens its own session writes to Postgres
  while the suite runs SQLite. Patch it in `conftest.py`; see `testing.md` (2026-09-03).
- **The browser tool's `form_input` does not fire React's `onChange`.** It sets the DOM
  value, so a controlled form still submits EMPTY and the login silently fails. Inject
  a real token into `localStorage` instead when the form is not what you are testing
  (2026-09-02).
- **Browser-pane tab is `visibility:hidden` → CSS animation/transition clocks freeze at t=0**
  (2026-07-13). Reading computed styles "after" an entrance/stagger shows the FROM-frame (e.g.
  `opacity:0`) forever, and a hover transition sticks at its start — NOT a code bug. Fast-forward
  before reading: `el.getAnimations().forEach(a=>a.finish())`, then re-read. Real visible tabs play
  normally. Corollary: never ship a persistent `opacity:0` + `forwards` entrance — use keyframes with
  `backwards` fill so a never-run animation still shows content.
- **Route order: literal before parameterized** — 2026-07-13 added `GET /opportunities/mine` and had
  to declare it BEFORE `/{opportunity_id}` or "mine" is captured as an id (same rule as consent's
  `/request`). FastAPI matches in declaration order.

- **`next-env.d.ts` flip-flops between `next dev` and `next build`** (2026-08-07, Next 16):
  Next rewrites its imports to `./.next/dev/types/...` after a dev run and `./.next/types/...`
  after a build, so the file shows up modified in `git status` depending on which you ran last.
  It is framework-generated ("should not be edited") — do NOT hand-fix it. The committed
  version is the BUILD variant, which is what CI produces; if a dev run dirties it, run
  `npm run build` (or check it out) before committing rather than editing it.
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
- **A heredoc silently ate `\b` and wrote a literal BACKSPACE byte (0x08)** (2026-09-01). A regex
  written as `re.compile(r"\b[A-Za-z0-9_-]{20,}\b")` through a `python - <<'EOF'` heredoc compiled
  to `'\x08[A-Za-z0-9_-]{20,}\x08'` — requiring an unprintable character on both sides, so it
  matched NOTHING while reading as protection. **`grep` cannot show you this**: the byte does not
  render, and the mutated line prints byte-identically to the clean one. Only `repr(pattern)` exposes
  it. The same heredoc then defeated the obvious fix. Build byte-sensitive content with explicit
  values (`bytes([8])`, `chr(92)`) or the Write tool, and after writing any regex that matters, print
  its `repr` and assert it matches a real positive. The record entry describing this bug initially
  contained the same byte. **FIVE occurrences across 2026-09-01/02** — in the
  regex, in the record entry about the regex, in the gotcha about both, and
  twice more while writing bins about it. Every one arrived through a
  `python - <<'EOF'` heredoc. Treat the heredoc as unable to carry a
  backslash escape at all: build such text with explicit byte values
  (`bytes([92, 98])`) or the Write tool, and scan afterwards —
  `bytes([8]) in path.read_bytes()` over every file you touched.
- **`git checkout -- <file>` is NOT a safe restore when the tree is dirty** (2026-09-01). Reverting a
  test mutation that sat on top of an UNCOMMITTED change reverted both — silently wiping a fix made
  minutes earlier. Copy the file aside first and restore from that copy, then prove it with
  `git diff`.
- **`git grep` with a pathspec is only trustworthy from the repo root** (2026-09-01). Run from a
  subdirectory, `git grep -n 'x' -- backend` returns NOTHING (the pathspec does not exist relative to
  cwd) — a false zero that reads exactly like a clean result.
- **A plain `<a>` click is a FULL PAGE LOAD in the Next App Router — only
  `<Link>`/`router.push` navigate softly** (2026-09-02). This invalidated a
  security test and nearly cost a real fix: reproducing a client-cache leak
  needs the JS context to survive an in-tab account switch, and
  `document.createElement("a").click()` destroys that context (and the cache
  with it) before the switch happens. The test passed no matter what the code
  did, and on that false negative the fix was weakened and the bug publicly
  retracted. **Put a `window.__marker` in any test that depends on the page not
  reloading, and assert it survived.** Corollary, worth more than the specific
  bug: *when a test reports "no bug", check that the test could have detected
  one.*
