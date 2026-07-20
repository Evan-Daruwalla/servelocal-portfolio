# Project Record — Full Chronological History

Written 2026-07-08. This is the **whole-project** record for ServeLocal, spanning
both eras — the zero-dependency Node **v1** (`ServeLocal website/`, GitHub
`Evan-Daruwalla/ServeLocal`, branch `master`) and the production-stack **v2**
rewrite (`servelocal-v2/`, FastAPI/SQLAlchemy/Postgres + Next.js/TS). It sits
above the two per-project append-only records and consolidates them into one
timeline.

Every entry is grounded in one of:
- Git commit history (`git log` in each subproject — hash + author date)
- Existing docs (`HANDOFF.md`, `docs/state_*.md`, `docs/record_*.md`, `docs/adr/`)
- File contents / `CLAUDE.md` for each era

Sections where a fact can't be verified from the above are explicitly marked.
No fabricated metrics, dates, hashes, or file names. Where a figure appears
(test counts, req/s, user ceilings), it is quoted from the doc/commit that
recorded it, not re-measured here.

> **REMINDER: after editing this file, refresh the HTML.** The rendered view
> (`Project Record — Full Chronological History.html`, same folder) does NOT
> auto-update — it's a static snapshot. From the ServeLocal root run:
> `python -m scripts.render_record_html` (overwrites the HTML, fails loudly on
> any broken anchor). Never hand-edit the HTML.

---

## Update protocol (read before editing)

This document is **append-only** and updated **when a medium-or-larger change
lands** — a shipped feature/batch, an architectural decision (ADR / milestone),
a data-integrity or security fix, a scope/direction change, or a launch-gating
event. Trivial edits (typos, one-line doc tweaks, dependency bumps with no
behavior change) do NOT get an entry; they live in the per-project records.

When appending:
1. Add a new dated `##` entry at the **bottom** of the relevant Part (I = v1,
   II = v2). Never edit or delete a prior entry — if something logged turns out
   wrong, add a NEW entry correcting it and reference the old one.
2. Capture **WHAT** changed, **WHY** (problem/tradeoff), **HOW** (approach,
   especially if an earlier approach was abandoned), and any **bug + root cause
   + fix** (the debugging trail is the most valuable narrative material).
3. Use absolute dates (`2026-07-08`, never "today"). Cite the commit hash.
4. Add a row to the **Summary timeline** and, if it's a new milestone/ADR,
   update the relevant index.
5. Keep the per-project records (`ServeLocal website/docs/record_2026-07-02.md`,
   `servelocal-v2/docs/record_2026-07-07.md`) as the fine-grained log; this file
   is the consolidated, cross-era view.

---

## How this document is organized

- **Part I — v1 (zero-dependency Node)**: the original proven app. Chronological
  from the first commit through the last v1 change. This era is *frozen as the
  behavioral reference* for v2 — v1 work is not expected to continue, but the
  history stays here.
- **Part II — v2 (production-stack rewrite)**: the FastAPI + Next.js rebuild,
  driven by `servelocal-v2/PRD_ROADMAP.md` (milestones M1–M10). This is the
  active era.

The one-paragraph arc, the thematic digest, the **current state snapshot**, and the
summary timeline below are reading aids updated in place (not append-only); the
authoritative chronological detail always lives in the dated entry. The current
state snapshot consolidates what used to live in the per-project `state_<date>.md`
files — that tier is retired (Evan's decision, 2026-07-08).

---

## Table of Contents

**Part I — v1 (zero-dep Node)**
- [I.0 — Pre-git origin (portfolio brief, compliance scaffolding)](#i0--pre-git-origin-portfolio-brief-compliance-scaffolding)
- [I.1 — Initial platform commit (2026-07-02)](#i1--initial-platform-commit-2026-07-02)
- [I.2 — Guardian consent + in-memory indexes + editorial restyle (2026-07-03)](#i2--guardian-consent--in-memory-indexes--editorial-restyle-2026-07-03)
- [I.3 — Scaling: SQLite migration, pagination, security/perf batch, CI (2026-07-04)](#i3--scaling-sqlite-migration-pagination-securityperf-batch-ci-2026-07-04)
- [I.4 — Graph-audit batch + CSP lockdown (2026-07-05)](#i4--graph-audit-batch--csp-lockdown-2026-07-05)
- [I.5 — CLAUDE.md upgrade; v1 freeze as v2 reference (2026-07-07)](#i5--claudemd-upgrade-v1-freeze-as-v2-reference-2026-07-07)

**Part II — v2 (production rewrite)**
- [II.1 — Monorepo scaffold + auth slice (2026-07-07)](#ii1--monorepo-scaffold--auth-slice-2026-07-07)
- [II.2 — Core domain + community features ported from v1 (2026-07-07)](#ii2--core-domain--community-features-ported-from-v1-2026-07-07)
- [II.3 — PRD adopted; M1 doc system + CI (2026-07-07)](#ii3--prd-adopted-m1-doc-system--ci-2026-07-07)
- [II.4 — M2: recurring events + waitlist (2026-07-08)](#ii4--m2-recurring-events--waitlist-2026-07-08)
- [II.5 — M3: hours parity — self-report, appeals, check-in codes (2026-07-08)](#ii5--m3-hours-parity--self-report-appeals-check-in-codes-2026-07-08)
- [II.6 — M4: email infrastructure + password reset (2026-07-08)](#ii6--m4-email-infrastructure--password-reset-2026-07-08)
- [II.7 — Ship-publicly decision; M11 added; CLAUDE.md system (2026-07-08)](#ii7--ship-publicly-decision-m11-added-claudemd-system-2026-07-08)
- [II.8 — M5.1: guardian-consent schema + registration age branch (2026-07-08)](#ii8--m51-guardian-consent-schema--registration-age-branch-2026-07-08)
- [II.9 — M5 complete: guardian-consent flow, gate, and frontend (2026-07-08)](#ii9--m5-complete-guardian-consent-flow-gate-and-frontend-2026-07-08)
- [II.10 — Doc-system cadence enforced by a deterministic hook (2026-07-08)](#ii10--doc-system-cadence-enforced-by-a-deterministic-hook-2026-07-08)
- [II.11 — M6: notifications email delivery + opt-out (2026-07-09)](#ii11--m6-notifications-email-delivery--opt-out-2026-07-09)
- [II.12 — M7: directed messaging + shift templates (2026-07-09)](#ii12--m7-directed-messaging--shift-templates-2026-07-09)
- [II.13 — M8.1: org plan enforcement; M8.2 blocked on Stripe keys (2026-07-09)](#ii13--m81-org-plan-enforcement-m82-blocked-on-stripe-keys-2026-07-09)
- [II.14 — M8 complete: Stripe test-mode billing (checkout + webhook + UI) (2026-07-09)](#ii14--m8-complete-stripe-test-mode-billing-checkout--webhook--ui-2026-07-09)
- [II.15 — M9 complete: rate limiting + audit log + leaderboard (2026-07-09)](#ii15--m9-complete-rate-limiting--audit-log--leaderboard-2026-07-09)
- [II.16 — M10 deploy readiness (partial); billing webhook signature-verified; v2 pushed (2026-07-09)](#ii16--m10-deploy-readiness-partial-billing-webhook-signature-verified-v2-pushed-2026-07-09)
- [II.17 — M10 verified; M12 v1 visual parity; record HTML twin auto-synced by a git hook (2026-07-12)](#ii17--m10-verified-m12-v1-visual-parity-record-html-twin-auto-synced-by-a-git-hook-2026-07-12)
- [II.18 — v1 exact-copy complete: all 13 v1 screens rebuilt in v2 with a scoped .v1 architecture (2026-07-13)](#ii18--v1-exact-copy-complete-all-13-v1-screens-rebuilt-in-v2-with-a-scoped-v1-architecture-2026-07-13)
- [II.19 — post-copy: public-portfolio slice, /audit fixes, UI polish (2026-07-13)](#ii19--post-copy-public-portfolio-slice-audit-fixes-ui-polish-2026-07-13)
- [II.20 — audit hardening, repo split, M13 plan (2026-07-13 to 2026-07-15)](#ii20--audit-hardening-repo-split-m13-plan-2026-07-13-to-2026-07-15)
- [II.21 — prelaunch batch, copy humanization, clickwrap ToS + onboarding (2026-07-16)](#ii21--prelaunch-batch-copy-humanization-clickwrap-tos--onboarding-2026-07-16)

- [Current state snapshot](#current-state-snapshot) · [Summary timeline](#summary-timeline) · [What's not in this record](#whats-not-in-this-record-honest-gaps)

---

## Thematic digest

### The arc in one paragraph
ServeLocal is a **student-volunteering platform** (students discover/track
service, log verified hours, earn national awards; orgs post opportunities and
verify attendance) — a college-application portfolio piece where the *documented
engineering process* is as much the deliverable as the app. **v1** was built as
a deliberately **zero-dependency Node `http`** app (ADR-0001) and taken all the
way to a launch-gated, scale-tested, security-hardened state: guardian consent
for minors (the legal launch precondition, ADR-0010), a confirmed ~90k-user
serialization ceiling found by load testing and removed via a SQLite migration
(ADR-0013), a security/perf batch, and a CSP lockdown to `script-src 'self'`
(ADR-0014). With v1 proven, the project pivoted to a **v2 production-stack
rewrite** (FastAPI/SQLAlchemy/Postgres + Next.js/TS/Tailwind/shadcn) whose job
is launch-critical parity on a deployable/scalable stack, driven by a formal
`PRD_ROADMAP.md` (now M1–M11). v2 has, so far, shipped auth, the full core domain +
community features, docs+CI (M1), recurring events + waitlist (M2), hours
parity (M3), and email + password reset (M4), and **cleared M5 guardian consent —
the hard launch gate** (schema, the request/approve/decline/revoke flow with a
reusable `require_consent` gate on apply+check-in, and the register/guardian UI).
**Evan decided 2026-07-08 that the finish line is a real public launch (milestone
M11), not just launch-readiness** — with M5 done, the remaining load-bearing work is
notifications/messaging/billing (M6–M8), hardening (M9), and the deploy + pre-launch
security/legal/infra pass (M10–M11).

### The two-era split (why there are two codebases)
- **v1** = zero runtime deps, pure Node, SQLite-via-`better-sqlite3` (the single
  documented exception). Frozen as the **behavioral reference** — v2 must match
  its behavior, not its code (`v1 CLAUDE.md`: "Don't port v2 conventions into v1
  or vice versa").
- **v2** = production stack chosen for deployability/scalability and to
  demonstrate a modern architecture. Diverges from v1 intentionally; the rewrite
  re-derives each feature against the PRD rather than transliterating server.js.

### Standing lessons (recur across the log)
1. **The launch gate is guardian consent for minors** — a platform with under-18
   users cannot go public without a verified-guardian precondition (v1 ADR-0010;
   v2 M5). Everything else is subordinate to it.
2. **Students are free forever** — no plan/billing may gate a student feature;
   paid plans are org-only (`PLANS` in v1 server.js).
3. **Find the ceiling before optimizing** — v1's real limit (V8's ~512 MB string
   cap → ~90k-user boot failure) was found by load testing, not guessed
   (ADR-0012/0013).
4. **Never leak internal fields** — check-in codes, guardian/reset tokens, and
   full names must never surface in a read response (`publicOpp()`/`safeUser()`
   in v1; "never in a read schema" in v2). A leaked check-in code = self-verified
   hours without attending.
5. **The recurring-date math is a known UTC/local hazard** — v1 mixed
   `toISOString()` UTC with local time; v2 deliberately re-anchored all
   occurrence math to UTC to avoid porting the bug (v2 M2).

---

# Current state snapshot

> **Living section — updated in place, not append-only** (like the thematic digest
> above). This consolidates the always-current status that used to live in the
> per-project `state_<date>.md` files; that tier is retired (Evan, 2026-07-08). The
> dated entries in Parts I/II remain the chronological trail — this is the
> "where it all stands right now" view. **Last updated 2026-07-08 (v2 through M5).**

## v2 — active (production rewrite)

**What it is.** Production-stack rewrite of the v1 platform: students discover/track
service, log verified hours, earn awards; orgs post opportunities, manage applicants,
verify attendance. Students are **free forever**; orgs get free/paid plans (M8).
Driven by `servelocal-v2/PRD_ROADMAP.md` (M1–M11); end state = a real public launch
on servelocal.org (M11).

**Architecture (as built).**
- **Backend:** FastAPI + SQLAlchemy 2.0 (sync sessions) + Alembic + PostgreSQL
  (SQLite in-memory for tests). `app/main.py` factory; `app/core/` (config, security,
  awards, occurrences, consent, email); `app/db/` (session, base); `app/models/`,
  `app/schemas/`, `app/services/`; `app/api/router.py`, `app/api/deps.py`,
  `app/api/routes/`. Auth: argon2 hashing, HS256 JWTs carrying `sub` + `tv`
  (token_version) + `exp`. Models register in `app/models/__init__.py` (NOT
  `db/base.py` — circular import); `.env` anchored via `Path(__file__)`, not cwd.
- **Frontend:** Next.js 15 (App Router) + React 19 + TypeScript + Tailwind 3 +
  shadcn/ui. `lib/api.ts` (typed fetch), `lib/auth-context.tsx` (token in
  localStorage under `TOKEN_KEY`, plus `refresh()`), `lib/types.ts`, `components/ui/`.
  Pages: home (+ consent banner), login, register (DOB/guardian), forgot, reset,
  discover, opportunities/[id] (+ signup/reviews/messages/org-checkin),
  opportunities/new, applications, applicants, hours (+awards), verify-hours,
  leaderboard, saved, notifications, consent/[token], consent/manage/[token].

**Data model (migrations 0001–0014).** users (+ token_version, reset-token
hash/expiry, dob + guardian-consent fields) · opportunities (+ recurrence/series_end,
checkin_codes JSON) · applications (+ subscription_type/single_date/excluded_dates,
status incl. waitlisted) · hours (+ occurrence_date, source/note/appeal_note/appealed)
· saved_opportunities · reviews · notifications · messages.

**Done / shipped.** Auth (`ddd5b0a`); core domain + community batch — opportunities,
applications, hours (auto-log + verify), awards, bookmarks, leaderboard, reviews,
in-app notifications, per-opportunity messaging (`94c185e`); M1 docs + CI (`f06d3ae`);
M2 recurring + waitlist (`a9e3651`); M3 hours parity (`08f59d1`); M4 email + password
reset (`ede7e14`); **M5 guardian consent — the launch gate** (`12f8281` / `1b88487` /
`98b3841`). 127 backend tests green; frontend lint + build clean.

**In progress / next (PRD order).** Next open task = **M6 notifications** (in-app +
email delivery, opt-out toggle, wired into application decisions, waitlist promotion,
hour verify/deny/appeal, and consent decisions). Then M7 messaging (bulk + inbox) →
M8 billing (Stripe test mode) → M9 hardening → M10 deploy readiness → M11 public
launch.

**Known limitations.** Notifications in-app only (email + opt-out owed at M6);
messaging is a shared per-opportunity thread, not the PRD's bulk + inbox model (M7);
one application per (opp, user) — subset attendance via `excluded_dates`, not
multi-row (M2 scope reduction); CI validated locally, not yet run against a push;
Reviews is out-of-PRD-scope, kept as a bonus. Not deployed.

**Deployment.** Not deployed. `docker compose up` for the full stack is an M10
deliverable (backend has a Dockerfile; frontend Dockerfile + root compose not yet
wired). Live production is M11 (host / DNS / domain / production secrets / Resend key
/ Stripe keys all BLOCKED-ON-EVAN).

## v1 — frozen (zero-dependency Node reference)

v1 is the proven, feature-complete reference — frozen since 2026-07-07, not under
active development. v2 ports its **behavior**, never its code. (Snapshot from the
retired `ServeLocal website/docs/state_2026-07-05.md`.)

**Architecture (as built).** Near-zero-dependency pure Node `http` (ADR-0001) + one
runtime dep, `better-sqlite3` (ADR-0013, isolated in `lib/persist.js`). SPA: shell in
`public/index.html`, all JS in `public/app.js` (ADR-0014), hash routing, self-hosted
Twemoji PNGs. `server.js` = API routes as `if (method && path)` blocks (no router
lib) + request pipeline (rate limit → auth with `tokenVersion` → idempotency →
handler; security headers on every response). Extracted modules (ADR-0015):
`lib/persist.js` (SQLite/WAL, incremental per-row-sha1 writes), `lib/auth.js` (scrypt
+ HMAC-JWT), `lib/totp.js` (RFC 6238 MFA). In-memory `IDX()` index layer
(ADR-0011/0012); pagination on `/api/opportunities` (ADR-0013).

**Done / shipped.** Full core domain (roles, opportunities, applications, recurring
events, hours, awards, plans, featured, waitlists, analytics, leaderboard, bookmarks,
check-in codes, reviews); guardian consent for minors (ADR-0010); SQLite persistence
+ pagination removing the confirmed ~90k-user serialization ceiling (verified at
100k users); security/perf batch; graph-audit batch (notification email + opt-out,
TOTP MFA, ADR-0014 CSP lockdown to `script-src 'self'`, ADR-0015 module split). CI
green on 5 jobs.

**Known limitations.** Billing DEMO-only (ADR-0004); in-memory RAM ceiling not
addressed (ADR-0013 fixed serialization, not RAM); HttpOnly-cookie auth refactor +
signup CAPTCHA deferred; recurring-date UTC/local mixing bug; audit log / verified
hours / messages intentionally unbounded (bounding needs archival-with-chain-
preservation). Not deployed (`servelocal.org` aspirational).

> **Older v1 snapshots** (`state_2026-07-03.md`, `state_2026-07-04.md`) were
> superseded by `state_2026-07-05.md` before the tier was retired; their unique
> content is the chronological trail, which lives in Part I above.

---

# Part I — v1 (zero-dependency Node)

> GitHub `Evan-Daruwalla/ServeLocal`, branch `master`. Hashes below are from
> `git log` in `ServeLocal website/`. This era is frozen as v2's behavioral
> reference; the fine-grained log is `ServeLocal website/docs/record_2026-07-02.md`.

## I.0 — Pre-git origin (portfolio brief, compliance scaffolding)

**Not fully captured in git.** Several v1 files predate the first commit by their
on-disk mtimes — `docs/SECURITY.md` and `docs/compliance.md` (mtime 2026-06-18),
the `docs/README.md` scaffolding — indicating a scoping/compliance phase before
the tracked history begins. The concrete decisions that survived: zero-dependency
architecture (ADR-0001), JSON-file DB as the initial store (ADR-0002), and the
compliance/security framing appropriate to a platform serving minors. The
scoping conversation itself is not in the repo (see "honest gaps").

## I.1 — Initial platform commit (2026-07-02)

**WHAT:** First tracked commit of the whole v1 app — `4b6451d` ("Initial commit:
ServeLocal volunteer platform"), followed by `2de36c9` ("Add README"). A working
single-page volunteer platform: roles (`student`/`org`), opportunities (one-time
/ weekly / monthly), applications, auto-logged pending hours + org verify, awards
by verified-hour milestones, leaderboard (first name + last initial only),
per-opportunity messaging, bookmarks, org plans (`free` Community / `pro` $19-mo,
students free forever), DEMO-mode billing (ADR-0004), and a hash-chained audit
log (ADR-0005).

**HOW:** Pure Node `http`, no framework (ADR-0001); JSON-file DB (ADR-0002);
HMAC-JWT auth with token revocation via `tokenVersion` (ADR-0003); scrypt
password hashing (ADR-0009); rate limiting + circuit breaker (ADR-0006). The
SPA shell is `public/index.html`; all routes are `if (method && p===...)` blocks
in a single `server.js`.

## I.2 — Guardian consent + in-memory indexes + editorial restyle (2026-07-03)

**WHAT:** Three shipped items.
- **Guardian consent for minors (ADR-0010)** — `8a1e4fe`. The launch precondition:
  students under 18 need a verified guardian email before they can apply / message
  / check-in / be endorsed. `requireGuardianConsent(user)` recomputes age from
  `dob` live, so 18+ students are never gated and a pending minor who turns 18 is
  auto-unblocked. Public approve/decline + revoke-anytime kill-switch flow.
  Tested (`test/guardian-consent.test.js`).
- **In-memory indexes (ADR-0011)** — same commit `8a1e4fe`. Hot lookups moved to
  id/FK-keyed Maps rebuilt lazily on structural change. `test/index.test.js`.
- **Frontend editorial restyle + documentation cadence system** — `10b0d05`.
  The editorial visual language (solid fills, tight radii, calm motion, no
  generic-AI signals) and the record/state/HANDOFF cadence rule.

**WHY:** Consent is the legal gate for a minor-serving platform; indexes were the
first step toward scale; the restyle set the brand language v2 still follows.

## I.3 — Scaling: SQLite migration, pagination, security/perf batch, CI (2026-07-04)

**WHAT:** The scaling arc — the era's most substantive engineering.
- **ADR-0012 scaling cost optimizations** — `65ced71`: coalesced writes, indexed
  hot reads, bounded notifications, HTTP caching. Plus tooling: `npm run bench`
  (`43ef219`) and `npm run loadtest:scale` (`a2164d4`) for repeatable before/after
  numbers.
- **ADR-0013 SQLite migration + `/api/opportunities` pagination** — `da9a27f`.
  **The bug that drove it:** load testing found the whole DB was one JSON string,
  and V8 caps a string at ~512 MB, so `USERS=100000` failed outright with
  `Invalid string length` — the app couldn't boot past ~90k users. Fix: persistence
  moved to SQLite (`better-sqlite3`, the single documented ADR-0001 exception,
  isolated in `lib/persist.js`), in-memory model unchanged; pagination on the
  opportunities list. Verified at 100k users (763 MB DB, 0 errors) per HANDOFF.
- **Security/perf batch** — `05abeb9`: WAL-incremental writes, gzip JSON,
  opportunities page cache, **password reset flow** (enumeration-safe, sha256
  single-use token, 1h TTL, throttled), check-in throttle + O(1) index, Discover
  URL state + Load More. 66 tests; recorded 130 → 4,167 req/s at 100k users.
- **CI fix** — `a7dda9f` + `5d3a852` + `310d3b6`: the SQLite dep made `coverage`
  and `resilience` jobs crash on `Cannot find module 'better-sqlite3'` (they
  skipped `npm install`); added the install step, bumped actions to `@v5`. All 5
  jobs green.

**WHY:** Find the real ceiling, then remove it — the JSON-string limit was
confirmed by measurement, not assumed.

## I.4 — Graph-audit batch + CSP lockdown (2026-07-05)

**WHAT:** `e092dea` — a six-item batch driven by a `/graphify` knowledge-graph
audit: (1) fixed stale `docs/security.md`; (2) **notification email delivery** +
per-user opt-out toggle (first slice of Track 2 #1); (3) zero-dep **TOTP MFA**
(`lib/totp.js`, RFC 6238, `test/mfa.test.js`); (4) extracted the SPA JS to
`public/app.js` (**ADR-0014** step 1), then converted all ~271 inline handlers to
a delegated dispatch table and **dropped `'unsafe-inline'` from `script-src`**
(ADR-0014 step 2 — CSP now fully `'self'`); (5) split `server.js` →
`lib/persist.js` + `lib/auth.js` (**ADR-0015**). 74 tests, chaos 3/3, preview
verified. Docs recorded in `9ff50d8`.

**HOW / tradeoff:** the inline-handler → dispatch-table conversion was done
deliberately as a bounded step to avoid an XSS regression while removing the CSP
exception. `style-src 'unsafe-inline'` remains (hundreds of `style=` attrs, known
out-of-scope).

## I.5 — CLAUDE.md upgrade; v1 freeze as v2 reference (2026-07-07)

**WHAT:** `f66ebb9` — synced `CLAUDE.md` with post-`e092dea` reality, added hard
rules + a definition of done. This is the last v1 commit: v1 is now the **frozen
behavioral reference** while active work moves to the v2 rewrite (Part II).

**v1 known limitations carried forward (from HANDOFF):** in-memory RAM ceiling
not addressed (ADR-0013 fixed serialization, not RAM); billing DEMO-only;
HttpOnly-cookie auth refactor and signup CAPTCHA intentionally deferred;
recurring-date UTC/local mixing bug; not deployed (`servelocal.org` aspirational).

---

# Part II — v2 (production-stack rewrite)

> `servelocal-v2/`, FastAPI + SQLAlchemy 2.0 + Alembic + Postgres backend,
> Next.js 15 + React 19 + TS + Tailwind + shadcn frontend. Driven by
> `PRD_ROADMAP.md` (M1–M10). Hashes from `git log` in `servelocal-v2/`; the
> fine-grained log is `servelocal-v2/docs/record_2026-07-07.md`. Commits are on
> `main`, **not pushed** (pushing is Evan's call).

## II.1 — Monorepo scaffold + auth slice (2026-07-07)

**WHAT:** `33388bd` scaffolds the monorepo (backend + frontend). `ddd5b0a` ships
the auth vertical slice end to end: `register`/`login`/`me`, argon2 password
hashing, HS256 JWTs (PyJWT), session persistence (token in localStorage under
`TOKEN_KEY`), with `tests/test_auth.py`.

**HOW / decisions that stuck:** SQLAlchemy models register in
`app/models/__init__.py` (NOT `db/base.py` — circular import); config anchors
`.env` via `Path(__file__)` not cwd (a launcher-cwd bug fixed during this slice);
sync sessions, SQLite in-memory for tests.

## II.2 — Core domain + community features ported from v1 (2026-07-07)

**WHAT:** `94c185e` — a large batch porting the core domain + several community
features from v1: opportunities, applications (spots tracking), hours (auto-log +
verify), awards, bookmarks, leaderboard, reviews, notifications (in-app), and
per-opportunity messaging. Each backend feature = model + migration + schema +
routes + tests (66 pytest cases); matching frontend pages; browser-verified end
to end.

**HOW / honest note:** this batch was built **ahead of** the PRD's milestone
order (the PRD was discovered/adopted mid-stream, II.3). Some features are
thinner than their eventual PRD milestone (notifications = in-app only vs M6's
email+opt-out; messaging = shared thread vs M7's bulk+inbox) and **Reviews is
out of PRD scope** — kept as a bonus at Evan's direction. The off-order history
is logged honestly rather than cleaned up.

## II.3 — PRD adopted; M1 doc system + CI (2026-07-07)

**WHAT:** `f06d3ae` — adopted `PRD_ROADMAP.md` as the source of truth and
bootstrapped the v2 doc system (HANDOFF + `docs/record_2026-07-07.md` +
`docs/state_2026-07-07.md`), then added `.github/workflows/ci.yml` (backend
pytest on SQLite fixture + frontend lint/build). M1.

**WHY / course-correction:** the rewrite had been progressing from v1-parity
intuition; a formal PRD existed in the repo laying out a deliberate M1→M10 order
whose point is to reach **M5 guardian consent (the launch gate)** without
building out of order. Evan's decision: follow the PRD from here, keep the
already-built Reviews as a bonus, commit the in-flight work first. CI validated
locally (`act` unavailable) — first real run on the next push.

## II.4 — M2: recurring events + waitlist (2026-07-08)

**WHAT:** `a9e3651` — the biggest genuine gap vs v1. Opportunities can recur
weekly/monthly; students subscribe to all dates or a single date, exclude/
re-include individual dates; a full one-time opportunity now **waitlists** new
applicants and auto-promotes FIFO. Recurring hours auto-log one row per past
occurrence. 20 new tests (86 total, green); migrations through 0010 clean
up/down/up.

**HOW / design decisions:**
- Recurrence **anchor derived from `start_time`** (v1-faithful), storing only
  `recurrence` + `series_end` on Opportunity — not separate day-of-week columns.
- **One application per (opportunity, user)**; subset attendance via
  `excluded_dates` or a single `single_date` — a deliberate scope reduction from
  v1's multiple single-date rows, meeting the PRD criterion without the extra
  rows.
- Occurrence math **anchored to UTC** (`app/core/occurrences.py`), deliberately
  NOT porting v1's known UTC/local mixing bug; monthly clamps to the short-month
  last day without drift.
- Capacity: one-time uses the global counter + FIFO waitlist; recurring uses
  per-occurrence-date capacity (`GET /opportunities/{id}/date-spots`), no
  waitlist (waitlisting is one-time only, per v1).

**Behavior change flagged:** a full one-time opportunity now returns `201
waitlisted` instead of `409`; the existing test was renamed/updated to assert
the new PRD-intended behavior.

## II.5 — M3: hours parity — self-report, appeals, check-in codes (2026-07-08)

**WHAT:** `08f59d1` — completed the verified-hours loop. Three Hours sources now:
auto-logged, student **self-reported** (`POST /hours`), and **check-in-code
redeemed** (`POST /opportunities/{id}/checkin`). A denied entry can be **appealed
once** (`POST /hours/{id}/appeal` → status `appealed` → org re-decides). Orgs
generate per-date codes (`POST /opportunities/{id}/checkin-codes`). 14 new tests
(100 total, green); migrations 0011–0012 up/down/up clean; frontend builds clean;
render-verified live end to end.

**HOW / design decisions:**
- **Self-report is the simpler variant** (PRD-sanctioned): student logs hours for
  an opportunity they applied to; status `pending`; org verifies. v1's
  supervisor-email verification path is deferred — it needs M4 email. Self-report
  rows carry a **null `occurrence_date`** so they never collide with the
  per-occurrence unique index.
- **Appeals**: single-use `appealed` flag; only `denied` rows are appealable;
  guarded against double-appeal / appealing verified rows.
- **Check-in codes** live in a JSON `checkin_codes` column on Opportunity,
  **never exposed in any read schema** (a leaked code = self-verified hours
  without attending — asserted by a test). Redemption requires an approved signup
  covering that date, is idempotent (409 on double check-in), throttled
  in-memory (10 fails/15min), constant-time compared, ambiguity-free alphabet.

## II.6 — M4: email infrastructure + password reset (2026-07-08)

**WHAT:** Shared transactional-email infra (`app/core/email.py`) and its first
consumer — enumeration-safe password reset (`POST /auth/forgot`, `POST
/auth/reset`). Backend + frontend, 7 new tests (107 total, green); migration 0013
up/down/up clean; verified live end to end against a real running server. Committed
`ede7e14`.

**WHY:** M4 precedes M5/M6 in the PRD because guardian consent and notifications
both need email; password reset is the first flow that exercises the infra and
closes a real account-recovery gap.

**HOW / design decisions:**
- **Email is a logged no-op without `RESEND_API_KEY`** (dev/CI default) and POSTs
  to Resend's HTTP API when the key is set. httpx is imported **lazily** in the
  real-send branch, so the stub path has no import-time dependency.
  **Fire-and-forget** — a send failure is logged and swallowed, never raised into
  the request (a user must not see a 500 because email is down). Real key is
  BLOCKED-ON-EVAN; everything downstream works on the stub.
- **Enumeration-safe:** `/auth/forgot` always returns the same 200 body whether or
  not the account exists. Only the sha256 **hash** of a single-use
  `secrets.token_urlsafe(32)` token is stored (+1h expiry); the raw token lives
  only in the emailed link. In-memory per-identity throttle (3/15 min).
- **Session invalidation** via a `token_version` int on User, embedded in the JWT
  (`tv`) and checked in `get_current_user`; reset bumps it, so every pre-reset JWT
  is rejected. Mirrors v1's `tokenVersion` mechanism (ADR-0003 lineage).

**Verification:** 107 pytest (+7). Migration 0013 round-trips. Frontend lint +
production build clean (`/forgot`, `/reset` prerendered). Live end-to-end on a real
uvicorn/SQLite server: register → forgot (identical body for known vs unknown
email) → reset token read from the email stub log → reset → old password 401 / new
200 → pre-reset JWT now 401 → token reuse 400. (Browser form not driven — the
preview-harness click/submit flakiness recorded since M2; the live server proves
the wiring and the pages mirror the browser-verified login page.)

**Next per PRD:** **M5 guardian consent — the LAUNCH GATE** (port v1 ADR-0010: dob
on User, consent state, request/approve/decline/revoke via M4 email, a reusable
`require_consent` dependency on apply/check-in). BLOCKED-ON-EVAN downstream: Resend
key (M4, real send), Stripe test keys (M8), deploy host/domain/secrets (M10).

## II.7 — Ship-publicly decision; M11 added; CLAUDE.md system (2026-07-08)

**WHAT:** Evan resolved the launch-ready-vs-launched question this record had
flagged (see the "one honest tension" the digest raised): **v2 will actually launch
publicly**, not stop at launch-readiness. `servelocal-v2/PRD_ROADMAP.md` gained
milestone **M11** — a pre-launch security pass, legal pages for a minors-serving
platform, production infra on a real domain, live email, a billing decision under
the Stripe-18+ constraint, monitoring/backups, and a soft launch with a real cohort.
Out-of-scope shifted accordingly: the HttpOnly-cookie decision and signup CAPTCHA
moved **into** scope at M11. The same pass built the missing CLAUDE.md system —
`servelocal-v2/CLAUDE.md` (the project had none; conventions lived only in the PRD)
and a router `CLAUDE.md` at the repo root — and moved five project skills up to the
root `.claude/skills/` so both eras can use them (`50c4445`).

**WHY:** a public launch with minor users pulls in obligations "launch-ready" could
quietly defer — bot defense, a token-storage decision, ToS/privacy drafted for
minors, monitoring, prod backups. Leaving them out would make the PRD dishonest
about what "done" costs. The CLAUDE.md exists so any model starting cold in the repo
loads the conventions, definition of done, and doc cadence without first knowing to
read the PRD.

**Notable calls:** live Stripe carries the 18+ account-holder constraint (default:
launch orgs on the free tier, enable live billing at 18 — Evan to confirm at M11.4);
the legal-page drafts are explicitly marked as needing adult/guardian review — a
minor operating a service for minors makes that review a launch **blocker**, not
paperwork. This decision supersedes the "launch-ready vs launched" ambiguity the
digest and I.5/II.6 noted: the finish line is **live**.

## II.8 — M5.1: guardian-consent schema + registration age branch (2026-07-08)

**WHAT:** First task of the launch gate (`12f8281`). `User` gained `dob` plus the
eleven guardian-consent fields from v1's ADR-0010 spec (guardian name/email, status,
one-time + manage token hashes, expiry, requested/decided timestamps, decision
IP/user-agent) — as User columns matching the v1 shape, not a separate table. New
`app/core/consent.py` (age helper + constants), migration `0014_guardian_consent`.
Register now branches on **live-computed age**: a student must supply `dob` (400
without); under-12 is rejected (v1's floor); under-18 requires guardian name+email
(400 without, or if the guardian email equals the student's own) and lands
`pending`; 18+ lands `not_required` and any guardian fields sent are ignored.
`UserRead` exposes only `dob` + `guardian_consent_status`; token hashes/IP/UA are
schema-stripped like the reset-token fields.

**WHY:** M5 is the hard launch gate; the schema and age branch must exist before the
consent-flow endpoints (M5.2) and the reusable `require_consent` route gate can be
built on them.

**HOW / decisions:** age is exact calendar math in `age_on()` — deliberately NOT
v1's 365.25-day float division (a PRD rule against porting v1's date handling), with
a boundary test pinning "born exactly 18 years ago today = adult". Consent status is
a plain string column (like `role`) for SQLite/Postgres portability. Making `dob`
mandatory broke every registration fixture — all 13 register helpers across the suite
gained an adult `"dob": "2000-01-01"` (the intended consequence, not incidental
churn). v1's `legacy_pending` migration state was **not** ported: v2 has no
pre-existing minor accounts, so it would be dead code. Tokens and the guardian email
are NOT generated at register — that is M5.2's request-consent flow, deliberately.

**Verification:** 116 pytest green (+9: no-dob 400, under-12 400, minor-no-guardian
400, self-consent-email 400, minor→pending, exactly-18→not_required boundary, adult
guardian fields ignored, org unaffected, secret-leak scan on the response). Migration
0014 up/down/up clean. No frontend touched (register UI collects dob at M5.3), so
lint/build not run.

**Next per PRD:** M5.2 — the request/approve/decline/revoke consent-flow endpoints
(guardian emails via the M4 infra) and the reusable `require_consent` dependency on
apply/check-in. M5 stays the launch gate until that lands.

## II.9 — M5 complete: guardian-consent flow, gate, and frontend (2026-07-08)

**WHAT:** Cleared the launch gate. M5.2 backend (`1b88487`): a consent flow
(`POST /consent/request`, public approve/decline `/consent/{token}`, revoke
`/consent/manage/{token}`) and a reusable `require_consent` dependency gating apply +
check-in. M5.3 frontend (`98b3841`): register collects DOB and — for a student the
client computes as under 18 — guardian name/email; a pending-consent banner with
resend; and public guardian approve/decline + manage/revoke pages needing no login.
127 pytest green; frontend lint + build clean.

**WHY:** no public launch with minors is allowed before a guardian can approve — and
revoke — a minor's account. This is the PRD's hard gate; M11 (public launch) depends
on it.

**HOW / design decisions:**
- The gate is `consent_blocks(user)` — age recomputed live from dob every call, so an
  18+ student is never gated and a pending minor who ages into 18 unblocks with no
  migration (proven by a direct unit test; unreachable via the API otherwise).
- Only sha256 token hashes are stored; the 72h one-time approve token and a separate
  long-lived manage token live only in emailed links. Public responses expose only
  first name + last initial (v1 spec §4).
- **Bug caught in verification:** the consent router was imported but never
  `include_router`'d, so every consent call 404'd (and one test passed for the wrong
  reason). Mounting it fixed all 11.

**Verification:** the full consent state machine is exercised live by the 127 backend
tests (pending→403 `GUARDIAN_CONSENT_REQUIRED`, approve→apply-ok, single-use token,
decline stays gated, revoke re-gates, adult never gated, expiry 410, resend 429). The
browser click-through of the consent UI was not driven (the preview harness's
cwd/flakiness limit, as since M2); the build is clean and the pages mirror verified
patterns.

**Next per PRD:** M6 notifications (in-app + email, opt-out, wired into decisions/
waitlist/consent). Paused before M6 at Evan's instruction.

---

## II.10 — Doc-system cadence enforced by a deterministic hook (2026-07-08)

**WHAT:** Wired the `/project-memory` cadence to a `UserPromptSubmit` hook and
armed it for this workspace. `~/.claude/skills/project-memory/hooks/pm-cadence.js`
(portable Node, no deps) counts prompts per project and injects a top-of-turn
reminder every Nth; registered once globally in `~/.claude/settings.json`. This
workspace opted in via `.claude/pm-cadence.json` (`record_entry: 3`; the other
subparts left event-driven at 0). The generic skill + hook were pushed to the
public repo (`1a9e2f6`, github.com/Evan-Daruwalla/claude-project-memory). The
ServeLocal `.claude/pm-cadence.json` is untracked (`.claude/` is gitignored at
this root) — there is no root-repo commit for the config itself.

**WHY:** the cadence rule ("append a record entry every ~3 prompts") was a
CLAUDE.md line a model forgets deep in a session — unreliable as cheaper models
(Opus/Sonnet) take over from Fable 5. A hook makes the counting + reminder
injection deterministic regardless of context length. Honest ceiling: a hook
cannot invoke a skill, so obeying the reminder is still the model's job — but a
fresh top-of-turn order beats an instruction buried 40k tokens back.

**HOW / design decisions:**
- The hook reads the project from the stdin `cwd` field and looks for
  `<cwd>/.claude/pm-cadence.json`; **absent → exit silently**, so one global
  registration stays dormant everywhere until a project opts in. That is what
  keeps Trading (which runs its own `check_docs_cadence.py`) from double-firing
  — it deliberately gets no `pm-cadence.json`.
- Config schema: `record_entry`/`handoff`/`prd_next_task`/`bins` = "remind every
  N prompts" (0 = event-driven), plus a persisted `_count`. On first load in a
  project the skill (§0) asks per-subpart cadence and writes the file.
- cwd dependency (a real limit): the reminder fires only when the session roots
  at `D:\ClaudeCode\ServeLocal`, where the config lives; launching from the
  `D:\ClaudeCode` parent would look at the parent's `.claude/` and miss it.

**Verification:** ran the global hook against `cwd=D:\ClaudeCode\ServeLocal` for
three prompts — silent on 1–2, fired the record-entry reminder on prompt 3 —
then reset `_count` to 0. No-config and corrupt-config cases both exit silently
(tested against a scratch project). Takes effect on the next session start
(hooks load at launch), so it is not yet live in the session that wrote this.

**Next per PRD:** unchanged — M6 notifications, still paused at Evan's
instruction.

---

## II.11 — M6: notifications email delivery + opt-out (2026-07-09)

**WHAT:** Brought the notifications feature up to the PRD's M6 spec. Every
in-app notification now also sends an email unless the recipient has opted out;
an opt-out toggle works end to end; the list endpoint is paginated. Backend:
`email_notifications` bool on `User` (default true, migration `0015`);
`create_notification` fires `send_email` when the flag is on; `PATCH /auth/me`
toggles it; `GET /notifications` gained `limit`/`offset`. Frontend: an
accessible opt-out toggle on the notifications page. 131 backend tests green
(was 127); lint + build clean; browser-verified.

**WHY:** The trigger events were already wired — application approve/reject,
waitlist promotion, hours verify/deny/appeal, and consent approve/revoke all
route through `create_notification`. So the PRD's "wire email into every event"
requirement collapsed to adding the email dispatch in that ONE helper rather
than editing eight call sites — and no future caller can forget to email.

**HOW / tradeoff:** Email is dispatched inside `create_notification`, before
the caller's commit. `send_email` never raises and is a logged no-op without
`RESEND_API_KEY`, so the at-most-once edge (email sent, then the outer
transaction rolls back) is an accepted, deliberately-simple tradeoff — not an
outbox/queue. Recorded as a known limitation to revisit if transactional-email
guarantees ever matter (M9/M11).

**Verification note (honest):** dev Postgres was down, so the migration
up/down/up was proven on a scratch SQLite DB (a plain boolean `add_column`,
dialect-agnostic) and the browser check ran the API on SQLite. CDP synthetic
clicks did not trigger React's delegated `onChange` on the controlled checkbox,
so the click→handler link was driven by invoking the element's real `onChange`
prop via its React fiber (exercising the true
`saveEmailPref → api.updateMe → refresh` chain); the backend `PATCH` was also
confirmed directly via curl and a fresh reload showed the persisted "Off"
state. Only DOM-event delivery was the harness gap — consistent with II.9's
note.

**Next per PRD:** M7 — messaging (org→applicant bulk messaging + student inbox
+ shift templates). The M5 consent gate already exists to cover minor
messaging.

---

## II.12 — M7: directed messaging + shift templates (2026-07-09)

**WHAT:** Completed the messaging milestone in three sub-tasks (each its own
commit).
- **M7.1** (`4abbc79`) — directed messaging. A nullable `recipient_id` on the
  `messages` table (migration 0016) turns the one table into two shapes: NULL =
  the existing shared per-opportunity thread (v1 parity, untouched), set = a
  directed message. Added org→applicant broadcast (audience all/approved/
  pending → one directed message + one M6 notification per recipient), a
  paginated student inbox (`GET /messages`), and reply (`POST /messages/{id}/
  reply`, back to the sender, reply-auth 404). Also closed the M5 debt: the
  thread-post and reply paths now depend on `require_consent`, so minors are
  gated on messaging.
- **M7.2** (`6bfa780`) — shift templates. New `OpportunityTemplate` table
  (migration 0017) storing an opportunity's reusable fields as a JSON `data`
  blob; `POST/GET /opportunity-templates`, org-owner-gated.
- **M7.3** — frontend: a student inbox page with inline reply, a "Message
  applicants" broadcast composer on the (now opportunity-grouped) applicants
  page, and template use (a "Start from a template" picker that pre-fills the
  create form) + save (a "Save as a reusable template" checkbox).

**WHY / decisions:** (1) The existing shared thread already matched v1; the
PRD's bulk+inbox is a NEW v2 feature. Chose to EXTEND the one table with
`recipient_id` rather than replace the working thread — surgical, keeps v1
parity, lets inbox/broadcast reuse the rows (`list_messages` filters
`recipient_id IS NULL` so the thread never leaks directed messages). (2)
Templates went in their OWN table, not an `is_template` flag on Opportunity: a
flag would force every opportunity query (Discover, detail, apply, bookmark) to
exclude templates — more surface and a real leak risk.

**Tradeoff:** broadcast fan-out is an O(N) per-recipient loop (one message + one
notification each) in a single request — fine at launch scale, flagged for M9
if it ever needs a queue.

**Verification:** 144 backend tests green (up from 131); both migrations
up/down/up clean on scratch SQLite. Frontend lint + build clean. Flows
browser-verified against a live API on SQLite — org broadcast landed in a
student inbox, the student's reply landed in the org inbox, and the template
picker pre-filled the create form — with zero console errors. As in II.11, CDP
synthetic clicks don't reach React's delegated handlers on this stack, so the
interactions were driven through the elements' real `onClick`/`onChange` fiber
props (true `handler → api → backend` chain; only DOM-event delivery was
simulated).

**Next per PRD:** M8 — billing (Stripe test mode). M8.1 (plan enforcement:
free = 3 active listings, pro = unlimited + featured) needs no Stripe and can
start immediately; M8.2 (Checkout + webhook) is BLOCKED-ON-EVAN for test keys.

---

## II.13 — M8.1: org plan enforcement; M8.2 blocked on Stripe keys (2026-07-09)

**WHAT:** Built the Stripe-free half of billing. A `plan`
field on `User` ("free"/"pro", orgs only, migration 0018) — **no student feature
is ever gated by it; students are free forever.** Free orgs are capped at 3
active listings (the 4th `POST /opportunities` → 402 Payment Required); pro is
unlimited. Featuring a listing (`PATCH /opportunities/{id}/featured`) is pro-only
(free → 402), capped at 3 (→ 409), and featured listings sort first in Discover
(`featured DESC, created_at DESC`). 7 new tests; 151 backend green (was 144).
The test harness (`conftest.py`) gained a `db_session` fixture so a test can flip
an org to "pro" directly — in production only the M8.2 Stripe webhook does that,
so there is deliberately no self-serve upgrade endpoint.

**WHY:** used 402 for plan-limit blocks (needs a paid plan) and 409 for the
featured-count cap (a conflict, not a payment issue). Kept `plan` off `UserRead`
for now — the billing UI that consumes it (M8.3) is gated behind M8.2, so
surfacing it would be speculative.

**BLOCKED-ON-EVAN — the wall.** M8.2 (Stripe Checkout session + signature-verified
webhook that flips `plan` on `checkout.session.completed`) needs **Stripe test-mode
keys** (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) — Evan's to create. Per the
PRD these are not stubbed-as-live or worked around. **This is where the autonomous
run stopped** (this session ran M6 → M7 → M8.1). M8.3's featured-toggle UI depends
only on M8.1 and could be built ahead of Stripe if Evan wants; the billing page's
upgrade flow needs M8.2.

---

## II.14 — M8 complete: Stripe test-mode billing (checkout + webhook + UI) (2026-07-09)

**WHAT:** Finished billing across three commits after Evan supplied Stripe
**test-mode** keys (he chose the official `stripe` SDK over hand-rolling).
- **M8.2** (`b943e5a`) — `POST /billing/checkout` creates a Pro-subscription
  Checkout Session (inline `price_data`, so no dashboard Price to pre-create),
  org-only, 503 if unconfigured / 409 if already pro. `POST /billing/webhook`
  verifies the Stripe signature over the raw body and flips `User.plan`:
  `checkout.session.completed` → pro (+ store `stripe_customer_id`, migration
  0019), `customer.subscription.deleted` → free. `stripe==11.4.1`; config gained
  `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET`/`STRIPE_PRO_PRICE_CENTS`.
- **M8.3** (`a8d1c1b`) — `plan` on `UserRead`; an org billing page
  (current plan, Upgrade → Checkout redirect, `?status` handling, manage note for
  pro) and a Feature/Unfeature toggle on the opportunity detail page for the
  owning pro org (free orgs get an Upgrade link).

**VERIFICATION:** 159 backend tests (Stripe mocked + `settings` monkeypatched, so
CI needs no keys); both migrations up/down/up clean; frontend lint+build clean.
Beyond mocks, made a **real test-mode call** — `stripe.checkout.Session.create`
returned a live `cs_test_…` session (`livemode=False`), and in the browser the
Upgrade button's endpoint returned a real `checkout.stripe.com` URL. The featured
toggle was driven through the real handlers (free org gated to an Upgrade link;
pro org flipped `featured` true/false). Zero console errors.

**WHY / decisions:** inline `price_data` (no Price ID for Evan to create);
`stripe_customer_id` on User so the cancellation webhook can map back to the user;
checkout uses normal 2xx/4xx (the plan-limit 402s live on the opportunity routes,
M8.1). **Test mode only** — live billing stays deferred (Stripe requires account
holders 18+; PRD M11.4). No self-serve plan flip exists: only the webhook grants
pro.

**Still owed (manual, Evan):** the full webhook round-trip — `stripe listen
--forward-to localhost:8000/api/v1/billing/webhook`, put the printed `whsec_` in
`.env`, pay with test card `4242 4242 4242 4242`, confirm `plan` flips. The code
+ mocked tests are done; that live run is a human step.

**Next per PRD:** M9 — hardening (rate limiting, audit log, leaderboard; the
leaderboard shipped early in the pre-PRD batch and gets reconciled here).

---

## II.15 — M9 complete: rate limiting + audit log + leaderboard (2026-07-09)

**WHAT:** Hardening, three commits.
- **M9.1** (`0205fb1`) — `RateLimitMiddleware`: an in-memory sliding-60s window
  per (client IP, bucket). `/auth/*` gets a tight bucket (30/min), other write
  methods a looser one (120/min); reads are free. Over-limit → 429 with
  `Retry-After`. Added before CORS so a 429 still carries CORS headers. Config
  toggles + limits; the `conftest` fixture resets the window per test so shared
  state never leaks.
- **M9.2** (`f79c481`) — an append-only `audit_log` table (migration 0020) +
  `append_audit()` wired into login, password reset, consent decisions, Stripe
  plan changes, and hours verify/deny. `GET /audit-log` is admin-only; an admin
  is `User.is_admin` (seeded from `ADMIN_EMAILS` at registration) OR any address
  in `ADMIN_EMAILS` at request time — so granting admin needs no DB edit. No
  admin UI (PRD scope).
- **M9.3** (`9b4585e`) — the leaderboard already matched the spec (public,
  verified-hours ranking, first name + last initial, pending excluded), so this
  was a reconcile: added a test asserting the payload is exactly
  `{rank, name, hours}` with no email or full last name.

**VERIFICATION:** 171 backend tests green (127 at session start). Migration 0020
up/down/up clean. Confirmed the new middleware doesn't break the Stripe webhook's
raw-body signature read.

**Known limitations (stated):** the rate limiter is **single-process** — a
multi-process/instance deploy needs a shared store (Redis); behind a proxy,
`request.client.host` is the proxy IP, so prod should trust a validated
`X-Forwarded-For`. Both flagged for M11. Consistent with the other in-memory
throttles (reset, consent-resend, check-in).

**Next per PRD:** M10 — deploy readiness (full-stack `docker compose`,
production-config audit, deploy runbook). Host/DNS/production secrets are
BLOCKED-ON-EVAN and already inventoried in `servelocal-v2/docs/API_KEYS.md`.

---

## II.16 — M10 deploy readiness (partial); billing webhook signature-verified; v2 pushed (2026-07-09)

**WHAT:** The session closed at the M10 environment wall, plus a deeper billing
verification and the first GitHub push of the v2 work.

- **M10.2** (`c1ed64c`) — a production-config boot guard: `create_app()` calls
  `check_production_config`, which raises (refuses to boot) when
  `ENVIRONMENT=production` and `SECRET_KEY`/`DATABASE_URL` are still the dev
  defaults. Lenient in dev/test. 4 tests; 175 backend green. Also documented the
  remaining config knobs in `.env.example`.
- **M10.3** (`e7529cc`) — a host-agnostic deploy runbook, `servelocal-v2/docs/
  DEPLOY.md`: the three-container stack, prod env-var list (→ `API_KEYS.md`),
  `alembic upgrade head` on release, domain/TLS, a post-deploy smoke test,
  rollback, and the M11 hardening still owed. Every account/purchase/legal step
  tagged BLOCKED-ON-EVAN.
- **M10.1 artifacts** (`81b5ad5`) — `frontend/Dockerfile` (Next.js
  `output: "standalone"` runtime), root `docker-compose.yml` (Postgres + api
  running `alembic upgrade head` then uvicorn + web), and the standalone config.
  `npm run build` verified it emits `.next/standalone/server.js` (the path the
  Dockerfile copies). **`docker compose up` itself is unverified — Docker is not
  installed in this dev session — so M10.1's done-check is Evan's on a Docker
  machine.**
- **Billing webhook — signature-verified end to end** (same commit): with a
  local `STRIPE_WEBHOOK_SECRET`, HMAC-signed a `checkout.session.completed` and
  POSTed it to `/billing/webhook` — valid signature flipped `plan` free→pro and
  wrote a `plan_upgraded` audit row; a tampered signature returned 400. This
  exercises the real `construct_event` path the mocked unit test skipped; only the
  Stripe-CLI + browser-payment run (Stripe's servers originating the event)
  remains Evan's.
- **First push** — the 16 v2 commits of this session's work (M6→M10) were pushed
  to `github.com/Evan-Daruwalla/servelocal-v2` (`main`). `graphify-out/` (a 1.1 MB
  regenerable graph) and the `pm-cadence.json` hook counter were gitignored, not
  committed. The v1 repo was already clean/up-to-date. **This root repo (the
  whole-project record) has no remote and stays LOCAL by Evan's decision — it is
  portfolio narrative, not code of record.**

**State:** v2 is through **M9 complete + M10 partial**; 127 → **175 backend tests**,
all green; migrations 0015–0020 up/down/up clean. **Remaining:** M10.1
`docker compose up` (Docker, Evan), M10.4 success-criteria checklist, and **M11
public launch — almost entirely BLOCKED-ON-EVAN** (host account, domain + DNS,
prod secrets, Resend prod key, Stripe live decision, guardian/legal sign-off).

---

## II.17 — M10 verified; M12 v1 visual parity; record HTML twin auto-synced by a git hook (2026-07-12)

**WHAT:** Three threads across 2026-07-12, all in the v2 repo except the last
(this root repo). All commit hashes below are `Evan-Daruwalla/servelocal-v2`
`main` unless noted.

- **M10 COMPLETE.** Evan ran `docker compose up --build` on a Docker machine —
  the one done-check no dev session could run. All three containers came up
  healthy; the API applied the **entire migration chain 0001–0020 against real
  Postgres** (the test suite runs on SQLite, so this was the first Postgres run
  of the full chain — it validated no migration leaned on SQLite-only behavior)
  and served uvicorn; web ready. One build bug surfaced + fixed en route: the
  frontend image's `COPY /app/public` failed because the app had no `public/`
  dir (Next `output:"standalone"` excludes it, so the Dockerfile copies it back
  by hand) — fixed with a tracked `frontend/public/.gitkeep` (`bd32540`). M10
  close + PRD §3 box: `a911821`.
- **M12 added — v1 visual parity (Evan-directed).** Seeing the containerized UI,
  Evan flagged it as "very basic" and then "make the frontend look like the
  ServeLocal v1 frontend." Diagnosis was honest: the v2 frontend had been built
  function-first (every slice browser-verified for *behavior*, never *design*),
  so it had NO web font (browser default serif), stock shadcn slate tokens (pure
  greyscale), and no shared chrome. A first foundation pass with a
  logo-sampled green + Inter (`61e42ad`) was then **superseded the same day** by
  a faithful port of v1's editorial system (`1cdeeea`): Fraunces (display) + DM
  Sans (body) via `next/font`, v1's `:root` palette as shadcn tokens (green
  `#175c41`, gold `#c9a84c`, warm off-white bg, 6px radius), the paper-grain
  noise overlay, green selection/scrollbar, a two-tone Fraunces "ServeLocal"
  wordmark in a sticky header + footer, and a v1-style hero. Browser-verified
  (logged-out landing screenshotted; the CDP screenshot tool flaked mid-verify,
  so structure was confirmed via the a11y tree + clean console + 200s). Recorded
  as a new milestone M12 in the PRD/HANDOFF (`472153c`), with M12.2 (discover +
  opportunity cards) and M12.3 (forms/tables/dashboards) still open and ordered
  before M11.6's soft launch. **This is foundation only — per-page component
  parity is the open follow-up.** Honest caveat carried in the docs: Fraunces/DM
  Sans self-host via a Google fetch at *build* time, so a fully offline
  `docker build` would need `next/font/local` instead.
- **Record HTML twin auto-synced by a standalone git hook** (this root repo).
  The whole-project record's HTML twin (`…History.html`) is generated by
  `python -m scripts.render_record_html` and has always been a *manual* step —
  the exact staleness risk the doc's own banner warns about. Added a
  version-controlled `scripts/git-hooks/pre-commit`: when the record `.md` is
  staged it regenerates the twin and `git add`s it, so the two can't drift;
  activated via `git config core.hooksPath scripts/git-hooks`. It also chains
  the pre-existing secret-scanner (git runs only one `pre-commit`, so pointing
  `hooksPath` here would otherwise silently drop that gate). A real bug was
  found and fixed while verifying it: the record's filename contains an em-dash,
  and `git diff --name-only` octal-escapes non-ASCII paths under the default
  `core.quotepath`, so the first detection `grep` for the literal em-dash missed
  entirely — fixed with `-c core.quotepath=false` plus an ASCII-only match
  substring. Fail policy is deliberate: the secret scan fails *open* (a scanner
  bug must not wedge commits), the render fails *closed* (a stale/broken twin is
  the whole problem it prevents — and the render already exits non-zero on any
  broken TOC anchor). This entry is itself the end-to-end test of that hook.

**State:** v2 is **M1–M10 complete**; **M12 partial** (M12.1 done); M11 public
launch remains almost entirely BLOCKED-ON-EVAN (host, domain/DNS, prod secrets,
Resend prod key, Stripe live decision, guardian/legal sign-off). 175 backend
tests green; frontend lint + build clean. The six 2026-07-12 v2 commits
(`bd32540`→`fdb4327`) are pushed to `main`.

---

## II.18 — v1 exact-copy complete: all 13 v1 screens rebuilt in v2 with a scoped .v1 architecture (2026-07-13)

**WHAT:** M12 achieved v1's visual *language* (fonts, palette, component vocabulary)
across v2's shadcn pages. Evan then asked to go further — "copy the v1 UI exactly,
all screens" (scope confirmed via a picker: *all* v1 screens, including ones v2
doesn't fully back, built as faithful static/stubbed UI). Over 2026-07-13 all **13
v1 screens** were rebuilt pixel-for-pixel in the v2 frontend. All commits are
`Evan-Daruwalla/servelocal-v2` `main`, `0dfbaed`→`2dbae31` (pushed).

**HOW — the scoped `.v1` architecture (the load-bearing decision):** v1's raw CSS
uses hex custom-properties with the same *names* as shadcn's HSL design tokens
(`--border`, `--muted`, `--card`…), so importing it globally would corrupt every
unconverted page. Instead v1's stylesheet was ported **verbatim into
`frontend/app/v1.css` under a `.v1` wrapper** — every variable defined on `.v1{}`,
every rule prefixed `.v1 …` — so it can never collide with the shadcn tokens. Three
shared pieces make each screen cheap: `components/v1/v1-shell.tsx` (v1's exact
nav+footer + the `.v1` root, wrapping page content), `lib/v1-routes.ts`
(`isV1Route()` — the global `SiteHeader`/`SiteFooter` return `null` on converted
routes so there's no double chrome), and the growing `v1.css`. Each screen: read
v1's markup/CSS from `../ServeLocal website/public/{index.html,app.js}`, port the
needed classes into `v1.css`, build the page in `<V1Shell>` wired to real v2 data,
rebuild the Docker `web` image, verify, commit, push.

**The 13 screens** (route · backing): `/` landing · `/discover` · `/opportunities/[id]`
· `/dashboard` (student) · `/applicants` (org, 7-tab) · `/leaderboard` · auth ×4
(`/login` `/register` `/forgot` `/reset`) · `/pricing` · `/for-organizations` ·
`/donate` · `/privacy` `/terms` · `/portfolio` · `/admin`. Landing→org-dashboard and
leaderboard→portfolio wire real API data; auth is v1's card look over the unchanged
`useAuth` calls; pricing/for-orgs/legal are exact static copy; donate is a demo stub
(as v1 itself ships); portfolio renders the *logged-in student's own* transcript
(v1's public `#portfolio/<id>` link has no v2 endpoint); admin mirrors v1's chrome
but carries a clear "moderation backend not ported" banner over a read-only
public-data snapshot.

**HONEST v2 gaps surfaced, never faked** (each a candidate backend task): no
public-portfolio endpoint; **no admin role / moderation endpoints at all**; no
analytics or inactive-inclusive org-listings endpoint; org applications & hours
don't expose student name/email (columns dropped, not invented); no endorsements;
no `school` field (leaderboard Top-Schools shows v1's empty state); no donations
backend; `PATCH /me` persists only `email_notifications` (org-profile text fields
are visual). Where v1 shows data v2 can't yet supply, the v1 empty/absent-data
state is rendered — nothing fabricated.

**Verification:** every screen checked live at `localhost:3000` (Docker stack) via
computed-style + DOM assertions and **zero console errors**, with `npm run build`
clean each time and the `web` image rebuilt per screen. The CDP **screenshot tool
timed out the entire session** (as in prior 2026-07-12 work), so visual proof came
from computed styles, not images — called out for honesty. Backend untouched: 175
pytest cases remain green; this was a frontend-only pass. Per-screen detail lives in
the v2 record (`servelocal-v2/docs/record_2026-07-07.md`, entries 2026-07-13).

**STATUS:** v1 exact-copy COMPLETE. Frontier is unchanged — **M11 public launch,
BLOCKED-ON-EVAN**. This pass changed how v2 *looks*, not what it can do.

---

## II.19 — post-copy: public-portfolio slice, /audit fixes, UI polish (2026-07-13)

Same-day follow-on to II.18, all `Evan-Daruwalla/servelocal-v2` `main`
`0dfbaed`→`60495e4` (pushed). Backend **175 → 189 pytest green**. Per-item detail
in the v2 record (`servelocal-v2/docs/record_2026-07-07.md`, 2026-07-13 entries).

**End-to-end QA.** Drove one real user journey through the actual UI: student
self-reports 4h → org clicks Verify in the `/applicants` dashboard → the public
leaderboard shows "🥇 Alex R. · 4 hrs" (privacy-safe name) → the student's
transcript reflects it. Confirmed the whole data path works, not just per-screen
rendering.

**Public-portfolio gap closed (real full-stack slice).** v1's portfolio is a
public `#portfolio/<userId>` share link; v2 had no such endpoint, so the copied
screen could only show the logged-in student's own data. Added `User.portfolio_public`
(migration **0021**, opt-in, default OFF) + `GET /portfolio/{id}` returning the
verified-hours transcript ONLY for opted-in students — a single 404 for
unknown/non-student/opted-out alike, so a private or missing id never leaks
existence. Frontend: public `/portfolio/[id]` page + own-page "make public" toggle +
copy-link. 7 tests. Verified live: 404 before opt-in → 200 after; the page renders
while logged out.

**/audit → all 5 findings fixed.** A full sweeping audit of the session's work, then
"do all": **#1 (high)** a minor could publish a full-name transcript with no guardian
consent — now `PATCH /me` gates enabling `portfolio_public` behind verified consent
for minors (reusing `consent_blocks`) AND the endpoint minimizes a minor's public name
to first+last-initial like the leaderboard; **#2 (high, pre-existing)** Next.js 15.1.3
carried a critical advisory — bumped to **15.5.20** + a `postcss` override, clearing
`npm audit` to **0 vulnerabilities**; **#3 (med)** the org dashboard couldn't see
inactive listings — added `GET /opportunities/mine`; **#4/#5 (low)** student-only flag
guard + lint clean. The audit also *validated* the scoped-`.v1` architecture (0
unscoped CSS rules, `v1`-namespaced keyframes) and that the public route is covered by
the global rate-limit middleware.

**UI polish (emil-design-eng + a sourced research brief).** `docs/research/2026-07-13_
ui-professional-polish.md` (5 web sweeps, verdict: professionalism = discipline of
interaction states + calm fast motion, not decoration). Applied: `scale(.97)` `:active`
press feedback on every pressable (v1 + shadcn Button), all 8 `transition:all` replaced
with explicit property lists, a branded 2px `:focus-visible` outline (white on dark
bands, WCAG 2.4.13-quality), marquee paused under `prefers-reduced-motion`, plus
`tabular-nums`/`text-wrap:balance`/`::selection`; round 2 added `@starting-style` card
entrance, hero-card stagger, and a `-2px` opp-card hover-lift (gated
`hover:hover`+`no-preference`). Two verification gotchas recorded: an `:is()`
specificity bug left footer focus rings green-on-green (fixed by widening the
override's list), and the browser-pane tab is `visibility:hidden` so CSS animation
clocks freeze at t=0 — anims verified via `getAnimations().finish()`.

**Also (root repo).** Discovered the local `D:\ClaudeCode\ServeLocal` docs repo has an
**unrelated history** to GitHub `Evan-Daruwalla/ServeLocal` (which holds the actual v1
code) — no common ancestor. Pushing the docs history there would have destroyed the v1
codebase; did NOT push. Root record stays local (Evan: "leave it local"); hazard saved
to auto-memory.

**STATUS unchanged:** frontier is **M11 public launch, BLOCKED-ON-EVAN**. This session
added one real feature (public portfolio) and hardened + polished; the launch blockers
(host/DNS/keys/legal) are Evan's.

---

## II.20 — audit hardening, repo split, M13 plan (2026-07-13 to 2026-07-15)

*(Catch-up entry, written 2026-07-15 ~22:35 CST — the 2026-07-13 evening events below missed the
root-record cadence at the time; logged here per the miss-logging rule. Day-level detail lives in
`servelocal-v2/docs/record_2026-07-07.md`.)*

**2026-07-13 evening — 4-lens audit + fixes (v2 `e6b9933`, `f7e077b`).** Evan requested a full
audit across security / high-user-count + hosting-cost optimization / guardian protections / UX.
(Planned as parallel agents; they died to an account session limit, so it ran inline
single-reviewer — noted honestly.) 13 findings, all actionable ones fixed: dependency bumps
clearing real PYSEC advisories (pyjwt 2.10.1→2.13, starlette →1.3.1, fastapi →0.139; pip-audit
installed + re-scan clean), GZip middleware, pagination + `selectinload` on list endpoints,
`Cache-Control` on public GETs, org-facing `student_name`/`student_email` (org branches only —
v1 parity), name minimization extended to reviews + messages (shared `app/core/names.py`),
migration **0022** `ix_hours_status`, Postgres bound to 127.0.0.1 + container `mem_limit`s.
Tests 189 → **192 green**.

**2026-07-13 evening — repo split + sync script (`b3ee570`, `7af0827`).** Evan's call: "make the
servelocal v2 repo private then make a new one only with the files that won't compromise the
security of the platform." Evan ran both visibility flips himself (repo access changes are a
prohibited action class for the assistant): `servelocal-v2` → **PRIVATE**; new **public mirror
`Evan-Daruwalla/servelocal-portfolio`** (frontend + doc system + memory bins minus `security.md`;
fresh history unrelated to the private repo). `scripts/sync_portfolio.py` regenerates the mirror:
manifest-driven wipe+recopy, `git archive` for tracked-only frontend files, redaction of
known-private strings, and a **fail-closed secret guard** (proved by injecting a fake `whsec_` +
JWT → abort exit 4). Codebase-memory bins also restructured (`b33e5a2`, `0157342`).

**2026-07-15 — graph refresh + navigational comments (`598f9ed`).** v2 code graph rebuilt via
pure-AST `graphify update` (1320 nodes / 2283 edges); degree-ranking showed the backend core was
already well-commented, so comments went only to the genuine gaps: `lib/types.ts` (schema-mirror
header + domain banners), `lib/api.ts` (uniform banners), `lib/auth-context.tsx` (was 0 comments),
`routes/opportunities.py` (endpoint-group banners). Verified: 192 pytest, lint + tsc clean.

**2026-07-15 — 33-item launch checklist reviewed → PRD milestone M13 added.** Evan submitted a
33-item checklist; item-by-item verdicts against the code (not assumed): CSRF moot (header JWT,
zero cookies), stored-XSS surface clean (no `dangerouslySetInnerHTML`), CORS env-scoped, SSRF N/A
(no user-supplied URL fetching), sign-up-late + DI already architectural. Real gaps → **M13
"Launch-checklist hardening"** in `PRD_ROADMAP.md`: **M13.1 CSP + security headers** (v1 had a CSP
via ADR-0014; v2 lost it in the rewrite), **M13.2–.3 account deletion + data export** (GDPR/CCPA;
anonymize-not-delete semantics; must land before M11.6 soft launch), **M13.4 sitemap/robots/OG
metadata**, **M13.5 skeletons + per-section error/retry + tooltips**, M13.6 DECIDE (client
caching). Rejections recorded as dated strike-throughs in the PRD (subdomain split,
animations-everywhere, Radix rebuild of v1 screens; analytics deferred BLOCKED-ON-EVAN with a
minors/COPPA caveat; growth items stay behind M11 per Track-2). HANDOFF current-state rewritten to
2026-07-15; auto-memory consolidated (state refreshed, repo-visibility facts fixed, one stale file
retired) and put under local git.

**STATUS:** next open task **M13.1 (CSP)**; frontier unchanged — **M11 public launch,
BLOCKED-ON-EVAN** (host, DNS, prod secrets, Resend key, legal/guardian sign-off).

**2026-07-16 addendum (same entry-window, logged before commit):** M13 was then executed the same
night via the opus-workers pattern — three workflow phases of Opus workers implementing while the
orchestrator reviewed diffs, re-ran suites, and E2E-verified in the browser. Shipped: M13.1 CSP +
security headers (`e5aa990`), M13.2 deletion/export API — anonymize-in-place, 192→200 tests
(`166fcab`), M13.3 its UI on both dashboards, E2E-driven on a scratch-SQLite backend: gating,
wrong-password 403 inline, export bundle, delete→401 (`bd26052`), M13.4 sitemap/robots/OG
(`4879068`), M13.5 skeletons + per-section error/Retry — failure→recovery cycle live-verified by
killing/restarting the API (`dcf87cc`). M13.6 SWR skipped (Evan, PRD default). Review catches worth
recording: OG wordmark corrected to v1's dark-band treatment (spec itself had said gold); org
delete-copy overpromised name removal (backend keeps `org_name` so student transcripts survive) —
copy fixed to match behavior. **M11 is now the only open milestone.**

---

## II.21 — prelaunch batch, copy humanization, clickwrap ToS + onboarding (2026-07-16)

*(Written 2026-07-16 ~18:40 CST, cadence catch-up — covers the day's three work blocks.)*

**Prelaunch batch (`0573d69`, `c78b5aa`, `7f8b2c7`, `84be1a4`, `57ca9b0`).** The three
model-doable items left on the launch list after M11 prep: **server-side logout** (`POST
/auth/logout` bumps `token_version`, closing ADR-0001's "client-only logout" residual) plus a
frontend **401 interceptor** that clears the stored token; **backup tooling**
(`scripts/backup_db.py`: env-only `DATABASE_URL`, `pg_dump -Fc`, `--restore-drill` restores into a
scratch DB and drops it in a `finally`); **HSTS** header (inert on http, live behind prod TLS, no
preload). `docs/adr` added to the portfolio-mirror manifest. Tests 209 → 211.

**Copy humanization (`702b139`, `9c64ece`, `7da48b4`, `be4b4df`).** Evan: humanize all site text
via the-humanizer (Step 6 auto-improvement loop skipped per standing order). All UI surfaces except
legal pages rewritten; then prose em dashes removed site-wide; then backend-visible copy
(notification titles, email bodies, error details) humanized too. Two review catches worth
recording: a worker edited the excluded `privacy/page.tsx` without reporting (reverted), and the
sweep surfaced **unsubstantiated org-vetting claims** — no vetting flow exists — escalated to Evan,
who chose soften; copy now cites what's real (public reviews, org-verified hours). Docker compose
gained the missing `NEXT_PUBLIC_*` build args + Turnstile secret passthrough.

**Clickwrap ToS + onboarding (`5b0c5cc`).** Evan's ask, after auditing the opus-workers loop
(finding: review is real — evidenced by the catches above — but the redo-round mechanism never
fired; every defect was small enough to patch inline). Registration now requires an explicit
`accepted_terms` (missing → 422, false → 400; `users.terms_accepted_at` stamped, migration
**0023**, up/down/up verified); frontend replaces the passive terms line with an
unchecked-by-default checkbox gating submit. New role-aware **`/welcome` onboarding** (minor:
"Approval on the way"; adult: Browse→Apply→Log hours; org: Post→Review→Verify). Tests 211 →
**215**; E2E on the rebuilt Docker stack: 422/400/201 curl matrix, real-form registration → adult
and minor `/welcome` variants, zero console errors. Migration-chain bins synced 0022 → 0023.
Notably the first worker round needing **zero** review patches — both prompts shared an explicit
API contract.

**STATUS:** M11 remains the only open milestone; everything on it is BLOCKED-ON-EVAN (host, DNS,
prod secrets, Resend key, Turnstile keys, legal sign-off). `5b0c5cc` not yet pushed.

---

## Summary timeline

| Date | Era | Event | Evidence |
|---|---|---|---|
| ~2026-06-18 | v1 | Pre-git scoping / compliance scaffolding | `docs/SECURITY.md`, `docs/compliance.md` mtimes |
| 2026-07-02 | v1 | Initial platform commit + README | `4b6451d`, `2de36c9` |
| 2026-07-03 | v1 | Guardian consent (ADR-0010) + indexes (ADR-0011) + editorial restyle | `8a1e4fe`, `10b0d05` |
| 2026-07-03/04 | v1 | Scaling cost optimizations (ADR-0012) + bench/loadtest tooling | `65ced71`, `43ef219`, `a2164d4` |
| 2026-07-04 | v1 | SQLite migration + pagination (ADR-0013); ~90k-user ceiling removed, verified 100k | `da9a27f` |
| 2026-07-04 | v1 | Security/perf batch (WAL, gzip, password reset, check-in hardening); 130→4,167 req/s | `05abeb9` |
| 2026-07-04/05 | v1 | CI fix (install deps in coverage/chaos jobs; actions @v5) | `a7dda9f`, `5d3a852`, `310d3b6` |
| 2026-07-05 | v1 | Graph-audit batch: email delivery, TOTP MFA, ADR-0014 CSP lockdown, ADR-0015 module split | `e092dea`, `9ff50d8` |
| 2026-07-07 | v1 | CLAUDE.md upgrade; v1 frozen as v2 reference | `f66ebb9` |
| 2026-07-07 | v2 | Monorepo scaffold + auth vertical slice | `33388bd`, `ddd5b0a` |
| 2026-07-07 | v2 | Core domain + community features ported (66 tests) | `94c185e` |
| 2026-07-07 | v2 | PRD adopted; M1 doc system + CI | `f06d3ae` |
| 2026-07-08 | v2 | M2 recurring events + waitlist (86 tests) | `a9e3651` |
| 2026-07-08 | v2 | M3 hours parity — self-report, appeals, check-in codes (100 tests) | `08f59d1` |
| 2026-07-08 | v2 | M4 email infra stub + enumeration-safe password reset (107 tests) | `ede7e14` |
| 2026-07-08 | v2 | Ship-publicly decision; PRD gains M11; CLAUDE.md system built | `50c4445` |
| 2026-07-08 | v2 | M5.1 guardian-consent schema + registration age branch (116 tests) | `12f8281` |
| 2026-07-08 | v2 | M5.2 consent flow + require_consent gate on apply/check-in | `1b88487` |
| 2026-07-08 | v2 | M5.3 consent frontend — M5 launch gate complete (127 tests) | `98b3841` |
| 2026-07-08 | v2 | Doc-system cadence hook (pm-cadence.js) wired + armed for this workspace | `1a9e2f6` (public skill repo) |
| 2026-07-09 | v2 | M6 notifications — email delivery on every event + opt-out + pagination (131 tests) | `2f84fab` |
| 2026-07-09 | v2 | M7.1 directed messaging — org broadcast + student inbox + reply; minor gate (138 tests) | `4abbc79` |
| 2026-07-09 | v2 | M7.2 shift templates (OpportunityTemplate table, 144 tests) | `6bfa780` |
| 2026-07-09 | v2 | M7 complete — messaging + templates frontend (inbox, broadcast, template use/save) | `819d6dd` |
| 2026-07-09 | v2 | M8.1 org plan enforcement (free cap, pro featured; 151 tests). M8.2 Stripe BLOCKED-ON-EVAN | `bdd41d1` |
| 2026-07-09 | v2 | M8.2 Stripe Checkout + signature-verified webhook (test mode; 159 tests) | `b943e5a` |
| 2026-07-09 | v2 | M8 complete — billing page + featured toggle UI (browser-verified, real test-mode session) | `a8d1c1b` |
| 2026-07-09 | v2 | M9.1 per-IP rate limiting + M9.2 append-only audit log (migration 0020) | `0205fb1`, `f79c481` |
| 2026-07-09 | v2 | M9 complete — leaderboard reconciled to no-PII spec (171 tests) | `9b4585e` |
| 2026-07-09 | v2 | M10.2 prod-config boot guard + M10.3 deploy runbook (175 tests) | `c1ed64c`, `e7529cc` |
| 2026-07-09 | v2 | M10.1 Docker artifacts + billing webhook signed round-trip verified | `81b5ad5` |
| 2026-07-09 | v2 | First GitHub push of the session's M6→M10 work | `3f06d5a` (main) |
| 2026-07-12 | v2 | M10 COMPLETE — `docker compose up` verified by Evan; full 0001–0020 chain on real Postgres; `public/` build-bug fixed | `bd32540`, `a911821` |
| 2026-07-12 | v2 | M12 v1 visual parity added — Fraunces/DM Sans + v1 green/gold palette + chrome (foundation; M12.1) | `1cdeeea`, `472153c` |
| 2026-07-12 | root | Standalone pre-commit hook auto-regenerates the record HTML twin (chains the secret scanner) | `scripts/git-hooks/pre-commit` |
| 2026-07-13 | v2 | v1 exact-copy — all 13 v1 screens rebuilt in v2 via the scoped `.v1` architecture (frontend-only) | `0dfbaed`→`2dbae31` (main) |
| 2026-07-13 | v2 | Post-copy: public-portfolio slice (migration 0021), /audit all-5 fixes (Next→15.5.20, 0 npm vulns), UI polish r1–2. 189 tests | `91eab3e`→`60495e4` (main) |
| 2026-07-13 | v2 | 4-lens audit fixes: PYSEC dep bumps, gzip, pagination, org student identity, name minimization, migration 0022. 192 tests | `e6b9933`, `f7e077b` |
| 2026-07-13 | v2 | Repo split: `servelocal-v2` → private; public mirror `servelocal-portfolio` + `scripts/sync_portfolio.py` (fail-closed secret guard) | `b3ee570`, `7af0827` |
| 2026-07-15 | v2 | Graph refresh (1320 nodes) + navigational comments (lib/types, api, auth-context; opportunities router) | `598f9ed` |
| 2026-07-15 | v2 | 33-item launch checklist reviewed → PRD M13 hardening plan (CSP, deletion/export, SEO meta, resilience UX) | PRD `§6 M13`, HANDOFF 2026-07-15 |
| 2026-07-16 | v2 | M13 executed via Opus workers + orchestrator review: CSP, GDPR deletion/export (E2E-verified, 200 tests), sitemap/OG, skeletons+retry | `e5aa990`→`dcf87cc` |
| 2026-07-16 | v2 | M11 model-doable prep complete (same pattern): ADR 0001 token-storage, Turnstile off-by-default (209 tests), Terms/Privacy drafts, Railway config + runbook (found the migrations-not-in-image bug), ADR 0002 billing. All remaining M11 steps BLOCKED-ON-EVAN | `1c81dc5`→`9009382` |
| 2026-07-16 | v2 | Prelaunch batch: server-side logout + 401 interceptor, pg_dump backup + restore drill, HSTS (211 tests) | `0573d69`, `c78b5aa`, `7f8b2c7` |
| 2026-07-16 | v2 | Site-wide copy humanization + em-dash removal + truthful org-trust claims + backend email/notification copy; compose build args fixed | `702b139`→`be4b4df` |
| 2026-07-16 | v2 | Clickwrap ToS/privacy at register (migration 0023, 215 tests) + role-aware /welcome onboarding | `5b0c5cc` |
| 2026-07-20 | v2 | taste-skill vetted+installed; design pass: emoji→Lucide site-wide (marketing then product UI, shared category map), false org-vetting claim removed, truthful stats, CTA unification | `32793b2`, `032b21e` |

## What's not in this record (honest gaps)

- **Pre-git v1 history** — the initial scoping brief and any work before
  `4b6451d` (2026-07-02). Only surviving artifacts (compliance/security docs
  dated 2026-06-18, ADR decisions) are referenced; the conversation isn't in the
  repo.
- **v1 file-level detail** — the per-feature "why/how" for v1 lives in
  `ServeLocal website/docs/record_2026-07-02.md` and the 15 ADRs
  (`docs/adr/`), summarized (not transcribed) here.
- **Exact v1 metrics beyond what docs recorded** — figures like "100k users /
  763 MB / 0 errors" and "130 → 4,167 req/s" are quoted from HANDOFF, not
  re-measured for this document.
- **This root repo (whole-project record) stays LOCAL** — no remote, by Evan's
  decision; it's portfolio narrative, not code of record. (The v2 repo *is*
  pushed to `Evan-Daruwalla/servelocal-v2` `main` as of 2026-07-09, updated
  2026-07-12 — corrects the earlier "not pushed" note here.)
- **Reasoning/decision conversations** — this record covers WHAT was built and
  WHAT was learned; the deliberations live in the session transcripts under
  `~/.claude/projects/D--ClaudeCode-ServeLocal/*.jsonl`.
