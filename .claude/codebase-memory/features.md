# features — servelocal-v2

Last updated 2026-07-13.

## Milestone status (PRD M1–M11)
- **Done:** M1–M9 (see below), **M10 COMPLETE** (`docker compose up --build` verified by Evan
  2026-07-12 — full stack boots, migrations applied on real Postgres), **M12 v1 visual parity**
  (2026-07-12), and two off-roadmap Evan-directed 2026-07-13 blocks: **v1 EXACT-COPY** (all 13
  screens rebuilt in the scoped `.v1` architecture — see architecture.md/conventions.md) and a
  **public-portfolio slice**. **189 pytest green; migrations 0001–0021. M11 launch = BLOCKED-ON-EVAN
  (host, domain/DNS, prod secrets, Resend key, legal).**
- **Public portfolio (2026-07-13):** `GET /portfolio/{id}` — public verified-service transcript
  (name, verified hours, hours-by-org, awards) for opted-in students only; opt-in via
  `portfolio_public` (migration 0021, minor consent-gated + name-minimized — see security.md).
  Frontend: public `/portfolio/[id]` page + own `/portfolio` toggle + copy-link.
- **Org sees applicant identity (2026-07-13):** `student_name`/`student_email` are populated on
  `GET /applications/org` and the org branch of `GET /hours` ONLY (None on a student's own lists) —
  org-scoped v1 parity, no public exposure; applying is consent-gated so a minor's presence implies
  verified consent. CSV roster export includes them.
- **`GET /opportunities/mine` (2026-07-13):** org-only; returns the org's OWN listings INCLUDING
  inactive/expired (the public list filters `active`). Declared BEFORE `/{opportunity_id}` so "mine"
  isn't captured as an id. Powers the org dashboard's My Listings + Listing History.
- Hardening (M9): (M9.1) `RateLimitMiddleware` (`app/core/rate_limit.py`) — in-memory sliding-60s
  window per (IP, bucket): `/auth/*` 30/min + other writes 120/min; reads free; 429 + Retry-After;
  config `RATE_LIMIT_*`; added before CORS; `reset()` called per test in conftest; SINGLE-PROCESS
  (Redis for multi-proc, M11). (M9.2) `audit_log` table (migration 0020) + `append_audit()` on
  login/password_reset/consent_*/plan_*/hours_* events; admin-only `GET /audit-log`; admin =
  `User.is_admin` (seeded from `ADMIN_EMAILS` at register) OR email in `ADMIN_EMAILS` at request
  time. (M9.3) leaderboard already met the no-PII spec; only added a PII-assertion test.
- Billing UI (M8.3): `plan` is on `UserRead`. `app/billing/page.tsx` (org-only) shows the plan +
  "Upgrade to Pro" (→ `POST /billing/checkout` → redirect to the Stripe URL). Featured toggle lives
  on the opportunity detail page for the owner (pro → Feature/Unfeature via `PATCH
  /opportunities/{id}/featured`; free → an Upgrade link).
- Billing (M8.1+M8.2, done 2026-07-09): `User.plan` "free"/"pro" (orgs only, migration 0018) —
  **never gates a student feature**. Free orgs capped at 3 active listings (4th `POST /opportunities`
  → 402); featuring via `PATCH /opportunities/{id}/featured` is pro-only (free → 402), cap 3 (→ 409),
  featured sorts first in Discover. M8.2: `POST /billing/checkout` (org-only, Stripe subscription
  Checkout Session, inline price_data, → `{url}`; 503 if unconfigured, 409 if already pro) +
  `POST /billing/webhook` (signature-verified via `stripe.Webhook.construct_event` over the RAW body;
  `checkout.session.completed`→pro + store `stripe_customer_id` (migration 0019),
  `customer.subscription.deleted`→free). `stripe==11.4.1`; test-mode keys in `.env`;
  `STRIPE_WEBHOOK_SECRET` from `stripe listen`. Tests mock stripe + monkeypatch `settings`. No
  self-serve plan flip — only the webhook does it. Tests flip plan via the `conftest.py` `db_session`
  fixture.
- Notifications (M6, done 2026-07-09): every domain event calls
  `app/services/notifications.py::create_notification`, which adds the in-app row AND fires
  `send_email` unless `User.email_notifications` is false (opt-out via `PATCH /auth/me`; default
  true, migration 0015). Email is fire-and-forget, sent before the caller's commit (accepted
  at-most-once edge, no outbox). `GET /notifications` is paginated (`limit`/`offset`).
- Messaging (M7, done 2026-07-09): ONE `messages` table, two shapes via nullable `recipient_id` —
  NULL = shared per-opportunity thread (v1 parity, `GET/POST /opportunities/{id}/messages`); set =
  directed. Org broadcast `POST /opportunities/{id}/messages/broadcast` (audience all/approved/
  pending → one directed message + notification per applicant); student inbox `GET /messages`
  (paginated); reply `POST /messages/{id}/reply` (to the original sender; reply-auth 404).
  **Minor messaging is consent-gated** — thread-post + reply depend on `require_consent` (closed the
  M5 debt). `list_messages` filters `recipient_id IS NULL` so the thread never leaks directed msgs.
- Shift templates (M7): `OpportunityTemplate` (own table, migration 0017) — a JSON `data` blob of an
  opportunity's reusable fields (no date/time or runtime fields). `POST/GET /opportunity-templates`,
  org-owner-gated. Create-from-template is a client-side pre-fill of the normal opportunity POST.
- Reviews shipped but is OUT of PRD scope (kept as a bonus at Evan's direction).

## Semantics (match v1 behavior; v1's CLAUDE.md §Key Concepts is the reference)
- Roles: `student` / `org` (+ `admin`). Students free forever.
- Recurrence stored as `recurrence` (one_time/weekly/monthly) + `series_end`; occurrence dates are
  DERIVED from `start_time`, UTC-anchored (`app/core/occurrences.py`) — do NOT port v1's UTC/local
  mixing bug. Monthly clamps to a short month's last day, no drift.
- One Application per (opp, user). Subset attendance via `excluded_dates` on an all-dates sub, or a
  single `single_date` — NOT multiple single-date rows (a scope reduction vs v1).
- Waitlist = one-time opps only; when full a new application is `waitlisted`; FIFO auto-promote on
  withdraw/reject (`app/services/enrollment.py::promote_from_waitlist`).
- Hours have 3 sources: `auto` (one pending row per past occurrence, deduped by occurrence_date),
  `self` (student self-report, null occurrence_date, pending), `checkin` (redeem a per-date code →
  instantly verified). A denied row can be appealed ONCE → `appealed` → org re-decides.
- Check-in codes: per-occurrence-date, org-generated, stored in `checkin_codes` JSON on Opportunity;
  redemption requires an approved signup covering that date + guardian consent; throttled.
- Awards: verified-hour thresholds ported from v1 (`app/core/awards.py`).
- Guardian consent statuses: not_required / pending / verified / declined / revoked.
