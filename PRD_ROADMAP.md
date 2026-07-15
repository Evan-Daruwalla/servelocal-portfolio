# ServeLocal v2 — PRD & Roadmap

**Written 2026-07-07 by the planning session (Fable 5). Standing document — the executing model
works through TASK BREAKDOWN top to bottom, one task at a time, and checks off SUCCESS CRITERIA.**

**Updated 2026-07-08 (Fable 5, decided by Evan): the finish line is a REAL PUBLIC LAUNCH, not
launch-readiness. M11 added; M10 remains "everything works locally in containers", M11 takes it
live. M5 guardian consent stays the hard gate — no public launch with minors before it.**

**Status 2026-07-09 (execution run, not a scope change — no task text below was altered):
M1–M9 COMPLETE. M10 partial: M10.2 boot guard + M10.3 runbook done, M10.1 Docker artifacts
written but `docker compose up` unverified (no Docker in the dev session — Evan runs it),
M10.4 pending. M8.2's Stripe webhook was signature-verified end to end with locally-signed
events; the hosted-page test-mode payment via `stripe listen` remains Evan's manual step.
175 backend tests green; migrations 0001–0020. M11 is BLOCKED-ON-EVAN at nearly every step
(host, domain/DNS, prod secrets, Resend key, legal sign-off). §3 checkboxes below updated to
match. Details: `docs/record_2026-07-07.md` entries of 2026-07-09.**

**Status 2026-07-11 (M10.4 executed — again not a scope change): M10.4 final docs sync DONE
(HANDOFF refreshed, state-of-the-stack snapshot in the record's 2026-07-11 entry, §3 filled
honestly). M10 is now complete except the `docker compose up` boot verification, which needs
Docker on Evan's side — the §3 M10 box stays unchecked until he runs it. Stripe TEST keys were
supplied by Evan 2026-07-09 (gitignored `backend/.env`), so M8.2's key blocker is cleared; only
his manual `stripe listen` round-trip remains. Frontier: M11.**

**Status 2026-07-12 (M10 closed + one scope ADD): Evan ran `docker compose up --build` — db+api+web
all healthy, migrations 0001–0020 applied on real Postgres, uvicorn + Next serving. That was M10's
last open item → M10 COMPLETE, §3 box checked (one build bug found+fixed en route: missing
`frontend/public/`, `bd32540`). Scope ADD, decided by Evan 2026-07-12: the frontend must match
v1's editorial look — new milestone M12 below (M12.1 already done: fonts/palette/chrome ported,
`1cdeeea`). M12.2–.3 are ordered BEFORE M11.6's soft launch. Frontier: M12 per-page parity, then
M11.**

---

## 1. OBJECTIVE

Drive the ServeLocal v2 rewrite from "core domain shipped" to a launchable product.

ServeLocal connects students with community-service opportunities: students discover
opportunities, apply, log verified hours, and earn nationally recognized awards; organizations
post opportunities, manage applicants, and verify attendance. Students are **free forever**;
organizations have free/paid plans.

v2 is a production-stack rewrite (FastAPI/SQLAlchemy/Postgres backend + Next.js/TypeScript/
Tailwind/shadcn frontend) of the proven v1 zero-dependency Node app. v1 already implements the
full feature set and is the behavioral reference; v2's job is to reach launch-critical parity
on a stack that can be deployed and scaled, while preserving Evan's documented engineering
process (this project is a college-application portfolio piece — the process is the product).

Outcome when this plan is done: v2 **live in production on servelocal.org** with the core loop
(discover → apply → attend → verify → awards), recurring events, guardian consent for minors (the
legal/ethical launch gate), notifications, messaging, and billing — plus tests, docs, and CI at
the standard v1 set. Decided by Evan 2026-07-08: ship publicly, not just launch-ready.

## 2. CONTEXT

### What exists (verified 2026-07-07)

- **Location**: `D:\ClaudeCode\ServeLocal\servelocal-v2\` — monorepo, `backend/` + `frontend/`.
- **Backend** (FastAPI + SQLAlchemy 2.0 + Alembic + Postgres, SQLite for tests):
  - Shipped end-to-end: auth (register/login/me, argon2 + JWT), opportunities
    (post/browse/detail, org-role gate, pagination-ready), applications (apply/withdraw/
    approve/reject, `spots_remaining` tracking), hours (auto-log from past approved
    applications, org verify/deny), awards (thresholds in `app/core/awards.py`, ported from v1).
  - Layout: `app/main.py`, `app/core/` (config, security, awards), `app/db/` (session, base),
    `app/models/`, `app/schemas/`, `app/api/routes/` (health, auth, opportunities,
    applications, hours, awards), `app/api/router.py`, `app/api/deps.py`.
  - Migrations `0001`–`0005` in `alembic/versions/` (users, opportunities, applications, hours,
    saved_opportunities).
  - Tests: `backend/tests/` — pytest against an in-memory SQLite fixture (`conftest.py`), one
    file per route module, 38 tests at last count.
- **Frontend** (Next.js App Router + TS + Tailwind + shadcn/ui):
  - Pages: home, login, register, discover, opportunities/new, opportunities/[id],
    applications, applicants, hours, verify-hours.
  - `lib/api.ts` (fetch wrapper), `lib/auth-context.tsx`, `lib/types.ts`, `components/ui/`
    (button, card, input, label).
- **In-flight, half-done**: bookmarks/saved opportunities — model `app/models/saved_opportunity.py`
  and migration `0005` exist; **no route, no schema, no frontend**.
- **Reference implementation**: v1 at `D:\ClaudeCode\ServeLocal\ServeLocal website\` — its
  `CLAUDE.md` documents every feature's semantics (waitlist FIFO, check-in codes, guardian
  consent, plans, etc.) and `docs/guardian-consent-spec.md` is the full consent spec (ADR-0010).
  Read v1 for behavior; do NOT copy v1 code or conventions into v2 (different stacks by design).

### Not yet ported from v1 (backend README is the authoritative cut list)

Recurring events (weekly/monthly subscriptions, exclude-date, waitlist promotion),
self-reported hours + appeals, check-in codes, bookmarks (half-done), notifications, messaging,
org plans/billing, reviews, leaderboard, guardian consent, TOTP MFA, password reset,
admin/audit log.

*(2026-07-11 note — list kept for history: everything above shipped across M1–M9 by 2026-07-09,
except TOTP MFA, which §4 keeps out of scope. Reviews and leaderboard had shipped pre-PRD in the
`94c185e` batch; the audit log landed at M9.2 with an admin-only endpoint, no admin UI, per spec.)*

### Must not break

- The 38+ existing backend tests and the existing route/model/schema layering.
- The migration chain — never edit an applied migration; always add a new revision.
- Model registration pattern: new models are imported in `app/models/__init__.py`, NOT
  `app/db/base.py` (circular import — see comment in `base.py`).
- The v1 repo. Nothing in this plan touches `ServeLocal website/` except reading it.
- Auth semantics: `spots_remaining` bookkeeping on approve/reject/withdraw; org-role gates.

## 3. SUCCESS CRITERIA

The plan is complete when every box checks. Verify each with the command given.

- [x] `cd backend && pytest` — green, with new tests for every feature added by this plan.
- [x] `cd frontend && npm run build` — clean production build, no type errors.
- [x] `cd frontend && npm run lint` — clean.
- [x] CI workflow exists and runs backend pytest + frontend build on push (M1.5).
- [x] Bookmarks work end to end: student hearts an opportunity in Discover, sees it in a Saved
      view, unhearts it (M1).
- [x] An org can create a weekly or monthly opportunity; a student can subscribe to all dates or
      sign up for a single date, and exclude individual dates (M2).
- [x] A full one-time opportunity waitlists new applicants and auto-promotes FIFO when a spot
      frees (M2).
- [x] A student can self-report hours; an org can approve/deny; a denied entry can be appealed
      once (M3).
- [x] An org can generate a per-date check-in code; a student with an approved signup redeems it
      for instantly-verified hours; redemption is throttled (M3).
- [x] Password reset works end to end without account enumeration (M4).
- [x] A student under 18 cannot apply/check-in until a guardian approves via emailed link;
      a guardian can revoke at any time; an 18+ student is never gated (M5).
- [x] Users receive in-app notifications for application decisions, hour verifications, and
      messages; each notification also sends email unless the user opted out (M6).
- [x] An org can message all applicants of an opportunity in bulk; students see a message
      inbox (M7).
- [x] An org can upgrade free → pro through Stripe **test mode** checkout and the plan's limits
      (active-listing count, featured slots) are enforced (M8). *(2026-07-09: limits + checkout + signature-verified webhook proven; the hosted-page test payment via `stripe listen` is Evan's manual step.)*
- [x] Rate limiting protects auth and write endpoints; security-relevant actions append to an
      audit table; a public leaderboard exposes only first name + last initial (M9).
- [x] `docker compose up` boots the full stack locally; a deploy runbook exists; anything
      needing Evan's accounts is marked BLOCKED-ON-EVAN, not silently skipped (M10). *(2026-07-12: Evan ran `docker compose up --build` — all three containers healthy, API applied migrations 0001–0020 on real Postgres and served uvicorn, web ready. One build bug found + fixed en route: missing `frontend/public/` broke the web image's COPY, fixed with `public/.gitkeep` (`bd32540`). Browser click-through of localhost:3000 is Evan's final confirm.)*
- [x] `HANDOFF.md` and the record exist in `servelocal-v2/` and reflect reality (M1, maintained
      throughout; the state-doc tier was retired 2026-07-08 — snapshots live inside the record).
- [ ] The app is live in production over TLS on a real domain, backed by managed Postgres, with
      migrations applied by the deploy process (M11).
- [ ] Terms of Service and Privacy Policy pages are live, linked from the footer and signup, and
      accurately describe the guardian-consent flow and data handling for minors (M11).
- [ ] Signup has bot defense (CAPTCHA/Turnstile) and a documented token-storage decision (ADR:
      keep localStorage or move to HttpOnly cookies) implemented before launch (M11).
- [ ] Production error tracking and uptime monitoring are wired; prod Postgres has scheduled
      backups with a documented restore path (M11).
- [ ] A real person can register, get guardian consent, apply, and log verified hours on the
      production site — verified end to end and recorded (M11).
- [ ] Every page renders in v1's editorial system — Fraunces/DM Sans, v1 palette, and v1 component
      treatments (cards, badges, forms, tables) — browser-verified against the v1 reference (M12,
      added 2026-07-12; M12.1 foundation/chrome/homepage done that day, `1cdeeea`).

## 4. CONSTRAINTS

- **Stack is fixed**: FastAPI + SQLAlchemy 2.0 + Alembic + Postgres backend; Next.js + TS +
  Tailwind + shadcn frontend. No new frameworks. New Python/npm dependencies only when a task
  explicitly names one.
- **Students are free forever.** No plan/billing logic may ever gate a student feature.
- **v1 is read-only reference.** Match v1 *behavior* (semantics, edge cases), not v1 *code*.
- **Frontend follows the editorial visual language**: solid color fills, tight border radii,
  calm/minimal motion. No gradient-heavy heroes, no glassmorphism, no bouncy animation, nothing
  that reads as generic-AI design.
- **Surgical changes**: every changed line traces to the current task. No drive-by refactors.
- **Migrations**: one Alembic revision per schema change, autogenerated then reviewed; never
  edit applied revisions.
- **Testing**: every new route module gets its own `backend/tests/test_<module>.py`; bug fixes
  get a regression test first. The SQLite fixture in `conftest.py` is the test harness — don't
  require live Postgres for tests.
- **Docs cadence** (Evan's standard): append-only record + HANDOFF.md, absolute dates only
  ("2026-07-07", never "today"). Update after every meaningful batch; if the cadence slips,
  catch up and note the slip honestly. (State-doc tier retired 2026-07-08 — big shifts get a
  snapshot section inside the record entry; never create `docs/state_*.md`.)
- **Commits**: this document authorizes committing after each completed, green task with a
  descriptive message. Do NOT push without Evan's instruction.
- **NEVER fabricate**: test results, feature status, or data. If something fails or is skipped,
  the record says so.
- **Out of scope for this plan**: reviews/ratings (beyond what already shipped), TOTP MFA, B2B2C
  district distribution, portfolio virality, performance/load work. Do not start these even if
  convenient. (2026-07-08: HttpOnly-cookie decision and CAPTCHA moved INTO scope at M11 —
  a public launch with minors doesn't get to defer them. Live Stripe: see M11.4 — Stripe
  requires account holders to be 18+, so live billing is deferred or guardian-held; launching
  with orgs on the free tier only is the recommended path.)

### Environment (Windows 11 dev box)

- PowerShell 5.1: no `&&` chaining; use `;` or separate commands. Git Bash available.
- Backend venv: `backend\.venv\Scripts\activate` (or invoke `backend\.venv\Scripts\python.exe`
  / `pytest.exe` directly). Docker available for Postgres.
- Never rewrite JSON/data files with PowerShell (UTF-16 corruption). Use Node or Python scripts.
- Avoid inline `node -e` with arrow functions/quotes — write a temp `.js` file instead.

## 5. MILESTONES

| # | Milestone | Goal |
|---|---|---|
| M1 | Baseline & hygiene | Finish in-flight bookmarks, bootstrap the doc system, add CI. Clean starting line. |
| M2 | Recurring events + waitlist | Close the biggest domain gap vs v1 — the event model orgs actually need. |
| M3 | Hours parity | Self-reported hours + appeals; check-in codes. Completes the verified-hours loop. |
| M4 | Email + password reset | Shared email infrastructure, then the first flow that uses it. |
| M5 | Guardian consent | The launch gate. No public launch with minor users before this is live. |
| M6 | Notifications | In-app + email delivery — the loop later features depend on. |
| M7 | Messaging | Org→applicant bulk messaging + student inbox (Track 2 #2 from v1's roadmap). |
| M8 | Billing (test mode) | Org free/pro plans enforced, Stripe test-mode checkout. Live keys are Evan's. |
| M9 | Hardening | Rate limiting, audit log, leaderboard. |
| M10 | Deploy readiness | Containerized stack, runbook, human-gated launch steps. |
| M11 | Public launch | The site is live on a real domain with real users. Added 2026-07-08 (Evan's decision: ship, don't stop at ready). |
| M12 | v1 visual parity | Frontend adopts v1's editorial design system end to end. Added 2026-07-12 (Evan: "make the frontend look like the servelocal v1 frontend"). M12.2–.3 land BEFORE M11.6's soft launch. |

Order is deliberate: M2–M3 before consent because consent gating must cover check-in and
recurring signups (building it first would mean re-touching it every milestone). M4 before M5–M6
because consent and notifications both need email. Billing after messaging per v1's council-
reviewed roadmap (revenue only matters once orgs are retained). M11 last: nothing goes public
before M5 (consent) and M9 (hardening) are proven, and M11's account-level steps are Evan's.

## 6. TASK BREAKDOWN

Conventions used below: "backend feature slice" means model (`app/models/x.py` + registration in
`app/models/__init__.py`) → Alembic revision → schemas (`app/schemas/x.py`) → route module
(`app/api/routes/x.py` + mount in `app/api/router.py`) → tests (`backend/tests/test_x.py`).
"Frontend slice" means types in `lib/types.ts` → API calls in `lib/api.ts` → page/component →
verify in the browser with zero console errors. Every task ends with: run `pytest` (backend) or
`npm run build` (frontend), commit.

### M1 — Baseline & hygiene

1. **Bootstrap the doc system.** Create `servelocal-v2/HANDOFF.md` (goal, current state,
   workstream table), `servelocal-v2/docs/record_2026-07-07.md` (append-only build log, first
   entry = adopting this PRD), `servelocal-v2/docs/state_2026-07-07.md` (snapshot). Model the
   structure on `../ServeLocal website/HANDOFF.md` and its docs. Done when all three files exist
   and describe the actual current state (from §2 above, verified against the code).
2. **Verify the baseline is green.** Run `pytest` in `backend/` and `npm run lint` +
   `npm run build` in `frontend/`. Fix nothing else; if something is already broken, fix only
   that and log it in the record. Done when all three commands pass.
3. **Finish bookmarks — backend.** Model + migration already exist (`saved_opportunity.py`,
   revision 0005). Add `app/schemas/` entries if needed, a route module
   `app/api/routes/saved_opportunities.py` with `GET /saved-opps` (caller's saved list, student
   only) and `PUT`/`DELETE /saved-opps/{opp_id}` (toggle semantics matching v1's
   `PATCH /api/saved-opps/:oppId`), mount it, and write `tests/test_saved_opportunities.py`
   (save, list, unsave, 403 for orgs, 404 for bad opp id). Done when pytest is green.
4. **Finish bookmarks — frontend.** Heart toggle on Discover cards and the opportunity detail
   page; a "Saved" view for students (either `app/saved/page.tsx` or a tab within an existing
   student page — match whichever navigation pattern the frontend already uses). Done when the
   flow works in the browser against the local backend with no console errors.
5. **Add CI.** `.github/workflows/ci.yml` at the `servelocal-v2` repo root: job 1 = backend
   pytest (Python 3.12, pip install from `backend/requirements.txt`), job 2 = frontend
   `npm ci && npm run lint && npm run build`. SQLite fixture means no Postgres service needed.
   Done when the workflow file is valid (run `act` if available, otherwise verify by reading
   carefully — note in the record that first real run happens on next push).
6. **Docs checkpoint.** Append record entry, update HANDOFF workstream table. (Repeat this after
   every milestone; not restated below.)

### M2 — Recurring events + waitlist

Read v1 semantics first: `../ServeLocal website/CLAUDE.md` §Key Concepts (Opportunities,
Recurring events, Waitlist) and the relevant handlers in v1 `server.js`.

1. **Schema: recurrence on Opportunity.** Add `recurrence` (`one_time`/`weekly`/`monthly`),
   day-of-week / day-of-month fields, and a series end date to `app/models/opportunity.py` +
   migration + schema updates. Existing rows default to `one_time`. Done: migration applies
   up/down cleanly on a scratch DB, pytest green.
2. **Schema: application subscription shape.** Extend `app/models/application.py` with
   `subscription_type` (`all_dates`/`single_date`), `single_date`, `excluded_dates` (JSON array)
   + migration. Done: same bar as task 1.
3. **Occurrence expansion utility.** `app/core/occurrences.py`: given an opportunity and a date
   window, return concrete occurrence dates honoring recurrence rules and a subscription's
   exclusions. **Anchor all date math to one timezone** — v1 has a documented UTC/local mixing
   bug; do not port it. Unit tests in `tests/test_occurrences.py` covering weekly, monthly,
   exclusions, and month-end edge cases (e.g. day-31 in a 30-day month). Done: tests green.
4. **Routes: subscribe / single-date signup / exclude-date.** Extend the apply flow: subscribing
   to all dates vs one date; `PATCH` to exclude/re-include a date on an existing application.
   Auto-approval and `spots_remaining` semantics must respect per-date capacity for recurring
   opps (follow v1's behavior). Tests for each path. Done: pytest green.
5. **Waitlist.** One-time opportunities only (v1 rule): when full, new applications get
   `status='waitlisted'`; on any spot freeing (reject/withdraw), promote the oldest waitlisted
   application FIFO. Implement promotion as a function called from the three freeing paths, with
   tests: fills → waitlists → withdraw → auto-promotes correct (oldest) applicant. Done: pytest
   green.
6. **Frontend: recurring creation + signup.** Opportunity create form gains recurrence fields;
   detail page shows upcoming dates; students choose subscribe-all vs single-date and can
   exclude dates; waitlisted state is visible ("You're #N on the waitlist" needs only status,
   position optional). Done: full flow verified in browser.
7. **Hours auto-log for recurring.** Extend `POST /hours/auto-log` to create one pending Hours
   row **per past occurrence date** (using the occurrence utility, honoring exclusions), with a
   dedup key equivalent to v1's `autoKey` (`user:opp:date`). Tests: reruns are no-ops; excluded
   dates don't log. Done: pytest green.

### M3 — Hours parity

1. **Self-reported hours.** New endpoint for students to submit hours against an opportunity
   they participated in (or a free-text org name + supervisor email, matching v1's scope —
   check v1 first and port the simpler variant if v1's supervisor-email verification is heavy;
   log the scope decision in the record). Status `pending`; org (or supervisor) verifies/denies
   via the existing verify route. Tests. Done: pytest green.
2. **Appeals.** A student may appeal a denied Hours row exactly once: `POST /hours/{id}/appeal`
   with a note → status `appealed` → org re-decides (verify/deny final). Schema change +
   migration + tests (can't appeal twice, can't appeal verified rows). Done: pytest green.
3. **Check-in codes — backend.** Per-occurrence-date 6-char codes on an opportunity
   (org-generated, `POST /opportunities/{id}/checkin-codes`), student redemption
   `POST /checkin` requiring an approved signup for that date → instantly-verified Hours row.
   Per-user guess throttle (10 fails / 15 min, in-memory is fine for now — note it in the
   record). Codes never appear in public opportunity responses. Tests incl. throttle + wrong
   code + unapproved student. Done: pytest green.
4. **Frontend: hours + check-in.** Student hours page gains self-report form, appeal button on
   denied rows, and a check-in code entry; org verify-hours page shows appealed rows
   distinctly; org opportunity view gets code generation. Done: verified in browser.

### M4 — Email + password reset

1. **Email infrastructure.** `app/core/email.py`: a `send_email(to, subject, body)` that is a
   logged no-op without an API key and sends via Resend's HTTP API when `RESEND_API_KEY` is set
   (env-driven via `core/config.py`; add to `.env.example`). No new heavy dependency — use
   `httpx` if already present, otherwise stdlib. Fire-and-forget: email failure never fails the
   request. Unit test with the no-op path. Done: pytest green. (Obtaining a real key is
   BLOCKED-ON-EVAN; everything downstream works with the stub.)
2. **Password reset.** `POST /auth/forgot` (always returns 200 — no account enumeration;
   stores a sha256-hashed single-use token, 1h TTL; throttled 3 req/15 min per identity) →
   email with reset link → `POST /auth/reset` (validates token, sets new argon2 hash,
   invalidates existing sessions — add a `token_version` int to User bumped on reset and
   checked in `get_current_user`). Migration + tests (token single-use, expiry, enumeration-
   safe response, old JWT rejected after reset). Done: pytest green.
3. **Frontend: forgot/reset pages.** `app/forgot/page.tsx` + `app/reset/page.tsx` (token from
   query param). Done: flow works in browser with the logged no-op email (read token from
   backend log in dev).

### M5 — Guardian consent (LAUNCH GATE)

Port the v1 spec: read `../ServeLocal website/docs/guardian-consent-spec.md` (ADR-0010) fully
before starting. The invariants that must survive the port:

- Age is recomputed live from `dob` — an 18+ student is **never** gated; a pending minor who
  turns 18 is unblocked automatically with no migration.
- Consent gates: apply/subscribe, check-in, messaging (when M7 lands, the gate must already
  cover it — build the gate as a reusable dependency).
- Guardian can revoke at any time (the kill switch); revocation re-gates immediately.

1. **Schema + model.** `dob` on User (register collects it), consent state (guardian email,
   status pending/approved/declined/revoked, hashed token, timestamps) — own table or User
   columns, follow the v1 spec's shape. Migration + tests. Done: pytest green.
2. **Consent flow — backend.** Request-consent endpoint (sends guardian email via M4 infra),
   public token-based approve/decline endpoint, token-based manage/revoke endpoint, and a
   `require_consent` FastAPI dependency applied to apply/checkin routes. Tests: minor blocked
   pre-consent, unblocked post-approval, re-blocked on revoke, 18+ never blocked, aging-into-18
   unblocks. Done: pytest green.
3. **Frontend.** Register collects DOB; student dashboard shows consent status + resend;
   public guardian pages (approve/decline and manage/revoke) reachable from email links without
   login. Done: full flow in browser using logged email links.

### M6 — Notifications

1. **Backend slice.** `Notification` model (user_id, type, text, link, read flag, created_at)
   + migration; `create_notification(user, ...)` helper that also fires `send_email` unless
   `user.email_notifications` is false (new bool, default true, migration); wire the helper
   into: application approved/rejected, waitlist promotion, hours verified/denied/appealed,
   consent approved/revoked. Routes: list own notifications (paginated), mark read, and the
   email opt-out toggle on a profile/settings endpoint. Tests. Done: pytest green.
2. **Frontend slice.** Notification bell + dropdown (unread count, mark-read on open), settings
   toggle for email opt-out. Editorial styling — no bounce. Done: verified in browser.

### M7 — Messaging

1. **Backend slice.** `Message` model (opportunity-scoped, sender, recipient(s), body,
   created_at) + migration. Org endpoint: bulk-message all (or filtered: approved/pending)
   applicants of an owned opportunity — one call, N messages, N notifications via M6. Student
   endpoint: list own messages (inbox, paginated); reply to an org message. Consent gate covers
   minor messaging (dependency from M5 already exists). Tests incl. authorization (only owned
   opps, only own inbox). Done: pytest green.
2. **Shift templates.** Org can save an opportunity as a template and create a new opportunity
   pre-filled from one (`Template` model or a `is_template` flag — pick the simpler, record the
   choice). Tests. Done: pytest green.
3. **Frontend slice.** Org: "Message applicants" on the applicants page + template save/use on
   the create form. Student: inbox page with unread state. Done: verified in browser.

### M8 — Billing (Stripe TEST MODE only)

Read the `stripe-best-practices` skill notes if available in the session. Never handle raw card
data; Stripe Checkout only. Live keys and real charges are BLOCKED-ON-EVAN — everything below
runs against Stripe test mode with test keys in `.env` (even test keys are Evan's to create:
the first task is blocked until he supplies them).

1. **Plan enforcement (no Stripe yet).** `plan` field on org users (`free`/`pro`) + migration.
   Enforce v1's limits: free = 3 active listings; pro = unlimited + up to 3 featured listings
   (`featured` flag on Opportunity, pro-only, surfaces first in Discover ordering). Tests:
   4th listing blocked on free, featured blocked on free, ordering. Done: pytest green.
   (This task needs no Stripe account — do it immediately.)
2. **Stripe checkout + webhook.** BLOCKED-ON-EVAN for test keys. `POST /billing/checkout`
   creates a Checkout Session for the pro subscription; webhook endpoint verifies signatures
   and flips `plan` on `checkout.session.completed` / downgrades on subscription cancellation.
   Config via env (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`). Tests mock the Stripe client.
   Done: pytest green + a record entry showing a test-mode checkout completed locally (Stripe
   CLI webhook forwarding).
3. **Frontend.** Org billing page: current plan, upgrade button → Checkout redirect, downgrade
   state handling. Featured toggle on owned listings (pro only). Done: verified in browser
   against test mode.

### M9 — Hardening

1. **Rate limiting.** Per-IP token-bucket middleware (in-memory; note single-process limitation
   in the record) with tighter buckets on `/auth/*` and write methods. Tests: burst gets 429.
   Done: pytest green.
2. **Audit log.** Append-only `audit_log` table + `append_audit(actor, action, target, meta)`
   called from: login, password reset, consent decisions, plan changes, hour verifications,
   MFA-relevant events if any. Admin-only list endpoint (add an `is_admin` flag, seeded via env
   var, no admin UI needed). Tests. Done: pytest green.
3. **Leaderboard.** Public `GET /leaderboard`: top students by verified hours, exposing ONLY
   first name + last initial (v1 privacy rule). Cache-friendly. Frontend page. Tests assert no
   other PII in the response. Done: pytest green + browser check.

### M10 — Deploy readiness

1. **Full-stack compose + frontend Dockerfile.** Backend already has a Dockerfile; add one for
   the frontend and a root `docker-compose.yml` running Postgres + API + frontend. Done:
   `docker compose up` from `servelocal-v2/` serves the working app on localhost.
2. **Production config audit.** Verify: no default secrets bootable in prod (refuse to start if
   `JWT_SECRET`-equivalent is the dev default), CORS restricted via env, `.env.example`
   documents every knob, secrets never logged. Done: checklist in the record with evidence.
3. **Deploy runbook.** `docs/DEPLOY.md`: chosen-host-agnostic steps (container registry, managed
   Postgres, env vars, Alembic migrate on release, domain/TLS). Mark explicitly
   BLOCKED-ON-EVAN: host/account choice, domain purchase/DNS, production secrets, Resend key,
   Stripe live keys. Done: runbook exists; blocked items listed, not guessed.
4. **Final docs sync.** HANDOFF updated, record entry closing the plan (with a full
   state-of-the-stack snapshot section), success-criteria checklist (§3) filled in honestly.

### M11 — Public launch (added 2026-07-08)

Every task below that needs an account, a purchase, or a legal judgment is BLOCKED-ON-EVAN at
that step: the model prepares everything up to the blocked step, then reports exactly what Evan
must do. Nothing in this milestone is guessed, faked, or worked around.

1. **Pre-launch security pass.** (a) Token-storage ADR: document the choice between the current
   client-stored JWT and an HttpOnly-cookie session for launch; implement whichever the ADR
   concludes (if cookies: CSRF protection comes with it). (b) Signup bot defense: integrate
   Cloudflare Turnstile (or equivalent free CAPTCHA) on register + forgot-password — code and
   tests against a stub key; real site key BLOCKED-ON-EVAN. Done: ADR written and implemented,
   pytest green, signup rejects missing/invalid CAPTCHA tokens when enabled by env.
2. **Legal pages.** `app/terms/page.tsx` + `app/privacy/page.tsx`, linked from footer and
   register. Drafted for a platform whose users include minors: data collected, guardian-consent
   flow, revocation, data deletion contact, no-under-13 policy (the register flow must enforce
   the minimum age the policy states). Mark the drafts DRAFT — final review/signoff is
   BLOCKED-ON-EVAN (and a guardian/adult — Evan is a minor operating a service for minors; that
   review is not optional). Done: pages render, linked, drafts flagged for review in HANDOFF.
3. **Production infrastructure.** Choose host (the Railway plugin is already installed and is
   the default candidate — Evan confirms or overrides), provision managed Postgres, set env
   secrets (JWT secret, DB URL, Resend key, CAPTCHA keys), configure the deploy to run
   `alembic upgrade head` on release, point `servelocal.org` DNS + TLS at it. Account creation,
   domain purchase/DNS, and secrets are BLOCKED-ON-EVAN; the model writes all config/IaC and a
   step-by-step runbook first. Done: production URL serves the app over TLS; health endpoint
   green; record entry with evidence.
4. **Live email + billing decision.** Resend production key + domain verification
   (BLOCKED-ON-EVAN) so consent/notification email actually delivers. Billing: **Stripe requires
   account holders to be 18+** — verify current terms, then either (a) launch orgs on the free
   Community tier only and enable live Stripe when Evan turns 18 (RECOMMENDED — zero payment
   liability at launch), or (b) a guardian-held Stripe account now. Evan decides; the PRD's
   default is (a). Done: email delivers on production; billing decision recorded as an ADR.
5. **Monitoring + prod data safety.** Error tracking (Sentry free tier or host-native —
   account BLOCKED-ON-EVAN), uptime monitor on `/api/v1/health`, scheduled Postgres backups
   with a documented + drilled restore path (restore to scratch, verify row counts). Done:
   a test error appears in the tracker; one restore drill recorded.
6. **Soft launch.** Seed production with Evan's real org contacts (1–2 orgs, BLOCKED-ON-EVAN
   for outreach) or Evan's own school club; run one real cohort through register → consent →
   apply → attend → verify → hours. Fix only what breaks; log everything in the record. Done:
   at least one real verified-hours row exists in production, created by a real user.
7. **Launch docs sync.** Final HANDOFF sync + record entry declaring the site LIVE (with date
   and a full launch-state snapshot section), and the §3 checklist filled honestly. The v1
   `DEPLOY.txt`/meta-tag "aspirational" notes get a pointer that v2 is the live product.

### M12 — v1 visual parity (added 2026-07-12, Evan-directed)

The design source of truth is v1's `../ServeLocal website/public/index.html` `<style>` block
(lines ~27–715): tokens in `:root`, component classes below it. Port *treatments* into v2's
Tailwind/shadcn idiom — don't copy CSS verbatim, and don't invent new design. The editorial
constraints in §4 stay binding. M12.2–.3 must land before M11.6 (soft launch); M12 and M11.1–.5
are otherwise independent and may interleave.

1. **Foundation: fonts, palette, chrome, homepage.** Fraunces (display) + DM Sans (body) via
   `next/font`; v1 `:root` palette as shadcn tokens (green `#175c41`, gold `#c9a84c`, warm
   off-white bg, 6px radius); noise texture, green selection/scrollbar; two-tone Fraunces
   wordmark in a sticky header + footer; v1-style hero (tag pill, italic-emphasis serif headline,
   stat columns). **DONE 2026-07-12** (`61e42ad` foundation, superseded same-day by the faithful
   port `1cdeeea`) — record entries of 2026-07-12.
2. **Discover + opportunity cards.** Port v1's `.opp-card` treatment (left accent bar that
   deepens on hover, avatar tile, title/org/desc hierarchy, meta row, footer border, `.badge`
   pill styles incl. skill/verified/remote/pending variants) and the `.search-bar`/`.si`/`.fsel`
   input styling onto the Discover grid and opportunity detail. Done-check: side-by-side
   browser compare with v1 Discover; lint + build clean; zero console errors.
3. **Forms, tables, dashboards.** Port v1's form language (`.form-box`, uppercase field labels,
   `.fc` focus ring, `.chip` rows) to login/register/post-opportunity/self-report; v1's badge +
   row treatments to applications/hours/verify-hours/applicants/inbox/notifications/billing/
   leaderboard. Done-check: every routed page browser-verified in the v1 system; lint + build
   clean; record entry with honest gaps if any page is deferred.

## 7. HANDOFF NOTES

**Read first, in order:** this file → `servelocal-v2/HANDOFF.md` (after M1.1 creates it) →
`backend/README.md` → `frontend/README.md`. For any feature's intended behavior, read v1's
`CLAUDE.md` (§Key Concepts) and, for consent, v1's `docs/guardian-consent-spec.md`.

**Work order:** M1 → M11 strictly. Within a milestone, tasks in order. One task per sitting;
finish (tests green + commit + record entry) before starting the next. If a task turns out to be
wrong-sized or blocked, log it in the record and move on only if independent. *(Amended
2026-07-12: M12 was added out of numeric order — it interleaves with M11.1–.5 but M12.2–.3 must
complete before M11.6's soft launch.)*

**Gotchas that will bite you:**

- New SQLAlchemy models register in `app/models/__init__.py` — importing them in `db/base.py`
  creates a circular import. Import **order** matters there (relationships to Opportunity).
- Tests run on SQLite; dev runs on Postgres (Docker). JSON columns and date handling can differ —
  if a JSON/array column behaves oddly, test both, and prefer types that work on both
  (SQLAlchemy `JSON`, not Postgres-only `JSONB`, unless a migration already set the precedent).
- Alembic autogenerate misses some changes (server defaults, enum alterations) — always read the
  generated revision before applying.
- Timezone: v1 has a known UTC/local mixing bug in recurring-date math. v2 must anchor
  occurrence keys to a single timezone from day one (M2.3). Do not copy v1's date code.
- Never gate student features behind plans. Never expose check-in codes, guardian tokens, reset
  tokens, or full names (leaderboard) in API responses — mirror v1's `publicOpp`/`safeUser`
  stripping discipline in the pydantic response schemas.
- Windows shell: PowerShell 5.1 has no `&&`; don't rewrite data files with PowerShell (encoding
  corruption); avoid inline `node -e`.
- The frontend design bar is the editorial language (solid fills, tight radii, calm motion).
  When in doubt, plainer is better — anything that looks like a generic AI-generated site is
  wrong.
- Commit after each green task (authorized by this document). Never push and never touch Evan's
  accounts without his instruction; deploys happen only inside M11's tasks with Evan executing
  the account-level steps. Anything marked BLOCKED-ON-EVAN stays blocked until he acts — report
  it, don't work around it.
- Docs are part of done: record entry per task (WHAT/WHY/HOW, absolute dates), HANDOFF table per
  milestone; scope shifts get a snapshot section inside the record entry (state-doc tier retired
  2026-07-08). Honest failures beat silent skips — this repo's documentation trail is a
  college-application artifact.
