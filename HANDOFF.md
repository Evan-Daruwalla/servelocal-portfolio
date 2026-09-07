# Handoff — ServeLocal v2

## Goal

ServeLocal is a volunteer-opportunity platform (students discover/track community service, log
verified hours, earn awards; organizations post opportunities and verify attendance). v2 is a
production-stack rewrite (FastAPI/SQLAlchemy/Postgres backend + Next.js/TypeScript/Tailwind/shadcn
frontend) of the proven v1 zero-dependency Node app (`../ServeLocal website`, GitHub
`Evan-Daruwalla/ServeLocal`). v1 is the behavioral reference; v2's job is launch-critical parity on
a deployable/scalable stack, preserving Evan's documented engineering process (this is a
college-application portfolio piece — the process is the product).

The work is driven by `PRD_ROADMAP.md` (a standing M1–M15 plan). Read that first, then this file.
**Decided by Evan 2026-07-08: the finish line is a real public launch (new M11), not just
launch-readiness.** M5 guardian consent remains the hard gate before any public exposure.

**Last updated: 2026-09-07 (10:41 CDT).**

## Current state (2026-09-07)

**Done:** M1–M10, M12, M13.1–.5, **M14 complete** (site + org analytics), v1 EXACT-COPY,
public-portfolio slice, and four cold audits. **410 backend tests** green on SQLite (+1 Postgres-only capacity-race test =
**411 on real Postgres**, `TEST_DATABASE_URL`); migrations **0001–0028**; 17 route modules; 29
frontend pages; 16 codebase-memory files.

**In flight:** **M13.6 SWR — 16 of 22 pages** converted (`applicants` landed 2026-09-06;
`dashboard` 2026-09-05; `portfolio/[id]` and `opportunities/[id]` 2026-09-03). Page by page, never a sweep: the frontend has no
test runner, so each page's loading / error+retry / empty / data states are browser-verified
individually. *(The old caveat — "`applicants` counts but is only fractionally converted" —
is RETIRED 2026-09-06: its three main loads are now converted too.)*

**CONTRADICTION PARTIALLY RESOLVED (2026-09-03 ~22:18 CDT, pre-mortem E1/E2).**
`EVAN_CONTEXT.md` (compiled 2026-07-22) says ServeLocal is *on hold until 18 for legal
reasons*; this file and the PRD say the finish line is a real public launch (Evan,
2026-07-08). **Evan turns 18 on «redacted-date» — imminent as of 2026-09-07** (DOB «redacted-dob», stated
2026-09-05) — the
"hold until 18" half of the contradiction now has a near-term expiry rather than being
an open question, and Evan's own person-vs-entity/contract-capacity blocker lifts on its
own that date. **Still open, and NOT settled by the birthday:** the platform holds OTHER
people's minors' data (students 12–17) regardless of the operator's age — whether Evan
now WANTS that duty (guardian consent, breach response, data-subject requests, none of
it pausable for exams) — **ANSWERED 2026-09-05: Evan chose LAUNCH FOR REAL** and accepted
the duty; his reason was demonstrated impact in his community. E4 is closed. See
`docs/premortem_2026-09-03_project.md` for the original framing.

**Frontier: M11 public launch, and it is almost entirely BLOCKED-ON-EVAN.** Phase 0
(decisions) closed 2026-08-31. **Phase 1 (legal) is the critical path** — it blocks
launch, nothing blocks it, and its clock belongs to other people. Phase 3 is partly built
(Sentry wired and scrubbed but OFF without a DSN; uptime monitor unbuilt; the backup
restore-drill has never been run for real). A 2026-09-01 pre-mortem found **all seven
launch-blocking risks fail SILENTLY** — no error, no red build — and raised two questions
for a responsible adult rather than a commit.

**Health:** ruff check + format clean; `tsc` clean; eslint **0 errors / 10 warnings** (the
baseline — an 11th is a regression); `npm run build` clean; `npm audit` 0 vulnerabilities.
*(Both numbers corrected 2026-09-07: the format claim was FALSE — three files needed
reformat and CI runs that check as a BLOCKING step — and the eslint baseline said 11
when the real count is 10. Neither had a guard; the third count-drift finding in two days.)*
**DOCKER'S DAEMON IS DOWN** (since 2026-09-06 ~13:40 CDT; this line used to say Docker
was available again, which stopped being true and contradicted this file's own
next-session block). `docker compose up`, the Postgres-only race test, `backup_db.py`
and any `docker build` proof need Evan to restart Docker Desktop.

## Recent history — pointers, not a pile

**This file is the live snapshot. `docs/record_2026-07-16.md` is the history**, and the
root `../docs/Project Record — Full Chronological History.md` is the cross-era arc. Until
2026-09-03 this section was 432 lines of dated entries — 73% of the file — all of which
were already in the record. They were removed after verifying record coverage for every
one; nothing was lost.

| date | what changed | record |
|---|---|---|
| 2026-09-07 | **The public mirror was publishing an internal children's-privacy brief** — `sync_portfolio.py` copied `docs/research/` + `docs/adr/` by FLAT GLOB, so the allowlist degraded to "anything without a credential in it"; both are explicit per-file lists now | II.56 |
| 2026-09-07 | **Account deletion left a minor's free text on disk** — 4 Hours columns + `Message.body` never scrubbed, contradicting the privacy page's own retention caveat | II.56 |
| 2026-09-07 | `frontend/Dockerfile` declared no `ARG` for the two `flags.ts` vars, so **`NEXT_PUBLIC_LEGAL_SIGNOFF_COMPLETE=true` could never clear the draft banner** | II.56 |
| 2026-09-07 | `LICENSE` has never reached the mirror (listed but never staged); Evan's DOB `«redacted-dob»` would have synced — now a REDACTION | II.56 |
| 2026-09-07 | SUPPORT_PROCEDURES P4 policed "under 12" against `MINIMUM_AGE = 13`; ruff-format drift in 3 files while HANDOFF claimed clean | II.56 |
| 2026-09-05 | NT1/NT2 verified by mutation + sentinel build; bins updated with the 4th public surface, the capacity lock, the SQLite no-op | II.48 |
| 2026-09-05 | **Reviews leaked a revoked minor's name** — the 3rd public surface had no live consent re-check | II.47 |
| 2026-09-05 | Capacity oversell: 4 spots-mutating fetches now row-locked. **The lock is a NO-OP on SQLite** — race test is Postgres-gated | II.47 |
| 2026-09-05 | 3 check-then-act throttles → one atomic `core/throttle.py`; old shape let **50 of 50 pass a cap of 10** | II.47 |
| 2026-09-05 | Leaderboard said "Vetted Orgs" while Terms said the opposite (the 2026-09-03 fix missed it) | II.47 |
| 2026-09-03 | **Legal pages: the org-vetting claim was FALSE and is rewritten**; age floor 12 → **13** (COPPA); banner now honours the sign-off flag; placeholder guard added | II.46 |
| 2026-09-03 | Legal-pages pre-mortem: 14 risks, T1 (false vetting claim) found by it | II.46 |
| 2026-09-03 | CI was red 3 runs on `anyio` 4.15.0 vs warnings-as-errors; pinned `anyio==4.14.1` | II.46 |
| 2026-09-06 | `opportunities/[id]` (all 5 files) off shadcn onto the editorial system — the last file mixing BOTH is gone; shadcn consumers 16 → 11 | II.55 |
| 2026-09-06 | M13.6 SWR 15 → **16 of 22**: `applicants`; `hours/org-queue` key now shared with /verify-hours; gained the loading state it never had | II.54 |
| 2026-09-06 | `throttle.py` onto a shared table (0028) — **ONE-replica constraint lifted**; suite 381s → 54s after an autouse-fixture fix | II.53 |
| 2026-09-05 | Rate limiter off process memory onto a shared table (migration 0027); `TURNSTILE_FAIL_OPEN_UNTIL` break-glass | II.52 |
| 2026-09-05 | Degradation analysis + 2 fixes: analytics write moved OFF the event loop; `error`/`global-error`/`not-found` pages added | II.51 |
| 2026-09-05 | M11 row 4: **restore drill RUN for real** (34,040-byte dump, counts matched, drill db dropped) | II.50 |
| 2026-09-05 | M11 row 3: **uptime monitor built** — `/health` polled every ~15 min from GitHub Actions, off the app host | II.50 |
| 2026-09-05 | **Pre-mortem E4 ANSWERED: launch for real.** Evan's DOB «redacted-dob» → operator blocker lifts «redacted-date» | II.50 |
| 2026-09-05 | M13.6 SWR 14 → **15 of 22**: `dashboard`; its auto-log WRITE moved out of the cached read | II.49 |
| 2026-09-03 | CI's 2nd red: `pip-audit` failed on the runner's own pip (PYSEC-2026-3721); added an `Upgrade pip` step | II.46 |
| 2026-09-03 | Whole-project pre-mortem: 14 risks, **top finding is a contradiction between two of our own docs** | II.45 |
| 2026-09-03 | M13.6 SWR 12 → **14 of 22**: `portfolio/[id]` + `opportunities/[id]`, both browser-verified | II.44 |
| 2026-09-03 | `docs/LEGAL_REVIEW_PACKET.md` written for M11 Phase 1 (RED band; the review itself is still Evan's) | II.44 |
| 2026-09-03 | Both cap decisions closed: `security.md` 183 → 150; INDEX cap 25 → 75 globally | II.43 |
| 2026-09-03 | HANDOFF rewritten as a snapshot again | `record_2026-07-16.md`, II.42 |
| 2026-09-03 | Bin caps: `security.md` 240→184 via a new `audit-log.md`; INDEX 53→49 | `49be7ee`, II.41 |
| 2026-09-03 | All 14 bins swept; **`DIRECTORY.md` created** (the map the system required and never had) | `73cd677` |
| 2026-09-03 | LICENSE, data export moved out of the tree, consent allowlist now checks its own reasons, `security.md` split | `b6a57b8`, II.41 |
| 2026-09-03 | **M14.2 DONE** — org analytics; "retention" deleted from pricing rather than faked | `cf4e09f`, II.40 |
| 2026-09-02 | **M14.1's admin section** — the half its done-check required and never got | `578ad70`, II.39 |
| 2026-09-02 | Docs sweep D1–D4: ten findings, two MEDIUMs were our own from the day before | `b948e85` |
| 2026-09-02 | Both-domains `/audit`, 27 findings fixed; **the pattern: our checks verify SHAPE, not TRUTH** | `71c8fbd`, II.37/II.38 |
| 2026-09-02 | `repr(Settings)` leaked every secret — closed in three layers | `3e0ff52` |
| 2026-09-01 | Pre-mortem on the M11 launch; fallback audit, 5 HIGHs | II.34 |
| 2026-08-31 | Phase 0 closed (8 decisions); role-guard consolidation; SWR adopted | II.31/II.32 |

### Workstreams (mapped to PRD milestones)

*(Restored 2026-09-03: the HANDOFF rewrite dropped this table along with the dated-entry
pile it sat beside. It is NOT history — `CLAUDE.md`'s definition of done, `conventions.md`
and `PRD_ROADMAP.md` all require updating it when a milestone's status changes, so four
documents point at it.)*

| Workstream | PRD | Status | Notes |
|---|---|---|---|
| Auth (register/login/me, argon2 + JWT) | pre-M1 | **Done** | `ddd5b0a`; `tests/test_auth.py` |
| Opportunities (post/browse/detail) | pre-M1 | **Done** | `94c185e`; `tests/test_opportunities.py` |
| Applications (apply/withdraw/approve/reject) | pre-M1 | **Done** | `94c185e`; `tests/test_applications.py` |
| Hours (auto-log past + org verify/deny) | pre-M1 | **Done** | `94c185e`; `tests/test_hours.py` |
| Awards (thresholds from verified hours) | pre-M1 | **Done** | `94c185e`; `tests/test_awards.py` |
| Bookmarks (saved opportunities) | M1 | **Done** | `94c185e`; route `/saved` (PRD suggested `/saved-opps`) |
| Doc system bootstrap | M1.1 | **Done** | This file + record + state, 2026-07-07 |
| CI workflow | M1.5 | **Done** | `.github/workflows/ci.yml` — **3 jobs**: backend (ruff check + format, pip-audit, pytest on SQLite), backend-postgres (same suite on real Postgres, added 2026-08-06), frontend (eslint, npm audit, build). **Every step is blocking as of 2026-08-08** — the two dependency-CVE scans were `continue-on-error` until both trees were confirmed at 0; escape hatches documented inline in the workflow |
| Recurring events + waitlist | M2 | **Done** | Weekly/monthly recurrence, subscribe-all/single-date + exclude-date, one-time FIFO waitlist, recurring hours auto-log. 86 tests. 2026-07-08 |
| Hours parity (self-report, appeals, check-in codes) | M3 | **Done** | Self-report + one-time appeals + per-date check-in codes (throttled). 100 tests. 2026-07-08 |
| Email infra + password reset | M4 | **Done** | Resend stub (logged no-op without key) + enumeration-safe reset with `token_version` session invalidation. 107 tests. Live end-to-end verified. 2026-07-08 |
| Guardian consent (LAUNCH GATE) | M5 | **Done** | M5.1 schema (migration 0014) + M5.2 flow (request/approve/decline/revoke, `require_consent` gate on apply+checkin) + M5.3 frontend (DOB/guardian register, pending banner, public guardian pages). 127 tests. Browser click-through not driven (harness). 2026-07-08 |
| Notifications | M6 | **Done** | In-app create/list/read + email delivery on every event (opt-out via `PATCH /auth/me`, `email_notifications` default true, migration 0015) + paginated list. All trigger sites already routed through `create_notification`, so email added in one helper. 131 tests. Browser-verified. 2026-07-09 |
| Messaging | M7 | **Done** | Shared thread (v1 parity) PLUS directed messaging: org→applicant broadcast (audience filter), student inbox, reply — via a nullable `recipient_id` on Message (migration 0016). Shift templates as `OpportunityTemplate` (migration 0017). Minor messaging consent-gated (M5 debt closed). Frontend: inbox, Message-applicants, template use/save. 144 tests. Browser-verified. 2026-07-09 |
| Billing (Stripe test mode) | M8 | **Done** | Plan enforcement (M8.1, migration 0018) + Stripe Checkout/webhook (M8.2, `stripe==11.4.1`, migration 0019) + billing page & featured toggle UI (M8.3). Free = 3-listing cap → 402; pro-only featured. Verified incl. a real test-mode Stripe session. 159 tests, browser-verified. Only remainder: Evan's manual `stripe listen` round-trip for the live webhook (needs `whsec_`). 2026-07-09 |
| Hardening (rate limit, audit log, leaderboard) | M9 | **Done** | Per-IP rate limiting (M9.1: auth 30/min + write 120/min buckets, 429+Retry-After); append-only audit log (M9.2: migration 0020, admin-only `/audit-log`, events on login/reset/consent/plan/hours); leaderboard reconciled to the no-PII spec (M9.3). 171 tests. Single-process limiter → Redis at M11. 2026-07-09. **Amended 2026-08-12 (`92282c6`): the limiter keyed on `request.client.host` — behind a proxy that is the PROXY, so all traffic shared one bucket. Now `client_ip()` + `TRUSTED_PROXY_HOPS` (default 0 = trust nothing; Railway must set 1). Still in-memory/single-process, so keep the api at ONE replica until Redis.** **2026-08-13: that fix had swept only its own call site — `guardian_consent_ip` (approve + revoke) and Turnstile's `remoteip` still read `request.client.host`; all three now use `client_ip_or_none()`. Also M9.2 gained a retention limit: `AUDIT_LOG_RETENTION_DAYS` + `scripts/purge_audit_log.py`, age-only, scheduled by the operator.** **2026-09-05: the limiter's window LEFT process memory for a shared `rate_limit_hits` table (migration 0027) — fixed windows with a weighted look-back, ~4.10 ms median on auth/write only, fails OPEN on a store error. Redis not needed. **2026-09-06: `core/throttle.py` followed it (migration 0028, `throttle_state`) — consent-resend, check-in-fail and password-reset caps all shared, `threading.Lock` gone, atomicity from a row-level UPDATE (~3.17 ms median). **The ONE-replica constraint is LIFTED**; a sweep found no module-level dict/lock/cache left in `app/`.** |
| Deploy readiness | M10 | **Done** | M10.1 `docker compose up --build` VERIFIED by Evan 2026-07-12 — db+api+web all healthy, migrations 0001–0020 applied on real Postgres, uvicorn + Next serving (fixed a missing-`public/` build bug, `bd32540`). M10.2 boot guard + M10.3 runbook (`docs/DEPLOY.md`) + M10.4 docs sync done. Remaining: Evan's browser click-through of localhost:3000. |
| Public launch | M11 | **Prep COMPLETE — all remaining steps BLOCKED-ON-EVAN** | Model-doable work done 2026-07-16 via opus-workers: M11.1a ADR 0001 token-storage (`1c81dc5`, Proposed — sign-off + TTL choice = Evan) + M11.1b Turnstile bot defense env-gated off-by-default (`83c3a06`, 209 tests; keys = Evan) + M11.2 Terms/Privacy DRAFTS (`ce3569c`; placeholders + legal sign-off = Evan) + M11.3-prep railway.json ×2 + DEPLOY_RAILWAY.md runbook (`b2ebb84`; account/domain/secrets = Evan) + M11.4 ADR 0002 billing free-tier-only (`9009382`, Proposed — decision = Evan). M11.5–.7 need accounts/deployment |
| v1 visual parity | M12 | **Done** | Added 2026-07-12 (Evan: match v1's look). M12.1 foundation (`1cdeeea`) + M12.2/M12.3 per-page vocabulary (`67266d5`): opp-card accent bars, badge/status pills, section headers, uppercase form labels, form-box — applied across all 20 routes. Detail-page subcomponents inherit tokens but aren't individually v1-classed (minor follow-up) |
| v1 EXACT-COPY + UI polish | off-roadmap | **Done** | 2026-07-13, Evan-directed. All 17 v1 screens (named-screen count; 19 route patterns incl. 2 dynamic — see the snapshot above) rebuilt in the scoped `.v1` architecture; emil-design-eng polish rounds 1–2 (press feedback, `:focus-visible`, reduced-motion, entrance/stagger/hover). `0dfbaed`→`60495e4` |
| Public portfolio (v1 parity) | off-roadmap | **Done (bonus)** | 2026-07-13. `GET /portfolio/{id}` opt-in (migration 0021, minor consent-gated + name-minimized) + public `/portfolio/[id]` page + `GET /opportunities/mine`. From the /audit follow-up. 189 tests |
| 4-lens audit fixes + repo split | off-roadmap | **Done** | 2026-07-13. Dep bumps (PYSEC clean), gzip, pagination, cache headers, org student identity, name minimization, migration 0022 → 192 tests. v2 → PRIVATE + public `servelocal-portfolio` mirror via `scripts/sync_portfolio.py` |
| Launch-checklist hardening | M13 | **M13.1–.5 Done; M13.6 REOPENED** | 2026-07-16 via opus-workers (3 phases, orchestrator-reviewed). M13.1 CSP/headers (`e5aa990`) + M13.2 deletion/export API (`166fcab`, 200 tests) + M13.3 its UI, E2E-verified (`bd26052`) + M13.4 sitemap/OG (`4879068`) + M13.5 skeletons/retry/tooltips (`dcf87cc`). ~~M13.6 SWR = skipped (Evan 2026-07-15, PRD default)~~ → **M13.6 REVERSED 2026-08-31 (Evan): ADOPT SWR**, and it is the fix for the load/error/retry duplication. **IN PROGRESS: 16 of 22 pages** (`swr@2.5.1` + `lib/use-api.ts`; `6d75394`→`58428b0`; `portfolio/[id]` + `opportunities/[id]` 2026-09-03, `dashboard` 2026-09-05, `applicants` 2026-09-06). **Remaining 6:** `site-header.tsx`, `reviews-section`, `signup-section` (mechanical); `hours` (load starts with a WRITE — needs design, not a swap), `org-checkin-section` (seeds a controlled select from its fetch), `messages-section` (renders a 403 as INVISIBILITY). The two consent-token pages are deliberately NOT converted. *(Count corrected 2026-09-06: the old remaining-list named six items under a heading saying seven remained — it omitted `site-header.tsx`.)* |
| Analytics (site + org), first-party cookieless | M14 | **M14 COMPLETE — M14.1 backend (`1c0b16e`) + admin section (2026-09-02); M14.2 org tab + view counter (2026-09-03)** | Added 2026-08-31 (Evan reversed the 2026-07-15 deferral). Shape (a): our own counters, no third-party script, no cookies, no stored IPs, no per-user browsing trail. M14.1 site counters → M14.2 backs the org Analytics tab (which today under-delivers what the pricing page advertises). Not a launch gate |
| Organization review before listings publish | M15 | **NOT STARTED — no owner, no date** | Added 2026-09-03 from the legal-pages pre-mortem T1: the Terms claimed an admin vetted organizations and nothing did. The CLAIM was fixed the same day (the pages now say plainly that ServeLocal does not vet orgs), so M15 BUILDS the capability rather than closing a doc bug — it does **not** gate M11. M15.1 schema+gate is the first task and is its own sitting: `Opportunity` has no status column, `GET /opportunities/{id}` filters on NOTHING today (`opportunities.py`: "Inactive listings ARE readable by id, on purpose"), and ~20 tests create a listing then read it publicly — one (`test_account_deletion.py:228`) would pass VACUOUSLY. `PRD_ROADMAP.md` also requires a queue-response commitment decided IN M15.1, not after launch. *(Row added 2026-09-07 — the milestone had a PRD section and a next-action entry since 2026-09-03 but no row here; `docs/premortem_2026-09-05_legal-pages.md` NT3 flagged exactly this.)* |
| Duplication consolidation (role guards · status maps · data fetching) | off-roadmap | **2 of 3 done** | 2026-08-31. Role guards → `deps.py` `require_student`/`require_org` (`c56d5d9`, 15 checks, 18 routes proven); status maps → `lib/status.ts` (`55f1694`, 4 copies, 2 domains); data fetching → SWR `useAuthedQuery`/`usePublicQuery` (`6d75394`) **16 of 22 pages, in progress** (2026-09-06) (was "1 of 19" here — a stale figure from 2026-08-31 left in a LIVE table cell while four other places in this file said 11 of 22; recounted and corrected 2026-09-02: `grep -rl "useAuthedQuery\|usePublicQuery" app --include=*.tsx` returns exactly 11) |
| Reviews (student→org ratings) | out of scope | **Done (bonus)** | `94c185e`; PRD marks reviews out of scope — kept at Evan's direction |
| Guardian revoke made retroactive (3 phases) | M5 follow-on | **Done** | 2026-08-11/12, Evan-directed. Phase 1 `4ddaaef` roster withdrawal + spot release + broadcast stop; Phase 2 `5303931` org-side greying via `account_inactive()`; Phase 3 `18a0c6c` guardian export/delete on the manage token (anonymize-in-place). `test_consent_gate_coverage.py` now fails any new write route that is neither gated nor consciously allowlisted. Then `a45be67`: a landing-check found the new `withdrawn` status had NO frontend rendering (the type union type-checked while showing a raw word in a "pending"-coloured pill) — status labels/pills/messages added in both CSS systems. 306 tests at that point (323 now) |

## Design
- **v1 look ported 2026-07-12** (off-roadmap, Evan-directed: "make the frontend look like v1").
  Supersedes the same-day foundation pass (which had used the logo green `#1A6B4A` + Inter — wrong
  targets). Now matches v1's editorial system faithfully: **fonts** Fraunces (serif display, all
  headings + wordmark) + DM Sans (body) via `next/font`; **palette** ported from v1's
  `public/index.html` `:root` — deep green `#175c41` primary, **gold** `#c9a84c` accent, warm
  off-white `#f7f7f1` background, green-tinted text `#21352a`, 6px radius; **touches** two-tone
  "**Serve**Local" wordmark, faint page noise texture, green selection/scrollbar. Shared
  header/footer (`site-header.tsx`/`site-footer.tsx`) + hero (tag pill, italic-emphasis serif
  headline, stat columns) mirror v1. Verified via computed styles (body=DM Sans/#f8f8f2, h1=Fraunces/
  #175e42 — matches v1). Both fonts self-host at BUILD time via a Google fetch — an offline
  `docker build` needs `next/font/local`.
- **Per-page parity complete 2026-07-12 (M12.2/M12.3, `67266d5`)**: v1 component vocabulary lives in
  a `@layer components` block in `app/globals.css` — `.opp-card` (left accent bar), `.badge`/
  `.status-pill` variants, `.section-title`/`.section-tag`, `.form-box`, `.tbl`, `.pill`,
  `.empty-state` — applied across all 20 routes; shared `Label` restyled to v1's uppercase
  micro-label. Detail-page subcomponents inherit tokens but aren't individually v1-classed (minor).
- **Dev gotcha:** `next dev` and `npm run build` share `.next/` — building against a live dev server
  desyncs its manifest (unstyled page + 404 chunks). Restart the dev server after any build.

## Known limitations / notes
- **Built partly off the PRD order.** Leaderboard (M9), notifications (M6), messaging (M7) were
  built before M2–M5 and are thinner than the PRD spec; they'll be upgraded when their milestone
  comes up. Reviews is out-of-scope in the PRD but kept as a bonus (Evan's call, 2026-07-07).
- **Notifications** (M6, 2026-07-09): in-app + email on every event, opt-out toggle, paginated.
  Email is fire-and-forget, dispatched inside `create_notification` before commit (accepted
  at-most-once edge; no outbox — see record 2026-07-09). No `RESEND_API_KEY` yet → logged no-op.
- **Messaging** (M7, 2026-07-09): the shared per-opportunity thread PLUS directed messaging
  (org→applicant broadcast, student inbox, reply) on one table via `recipient_id`; shift templates
  in their own `OpportunityTemplate` table. Minor messaging is consent-gated.
- **Recurring scope reduction:** one application per (opp, user) — a subset of a series is expressed
  via `excluded_dates`, not multiple single-date rows (see record 2026-07-08).
- Not deployed to any host yet, but the full-stack `docker compose up` (Postgres + api + web) is
  verified to boot locally (Evan, 2026-07-12) — including the full 0001–0020 migration chain on
  real Postgres, which the SQLite test suite doesn't exercise. M11 is the actual public deploy.

## Documentation
- `../docs/Project Record — Full Chronological History.md` — **whole-project** (v1 + v2)
  consolidated chronological record, updated on every medium-or-larger change (rendered HTML twin via
  `python -m scripts.render_record_html` from the ServeLocal root). Read for the cross-era arc; the
  files below are the day-to-day v2 sources.
- `PRD_ROADMAP.md` — the standing M1–M15 plan. Source of truth for what to build and in what order.
- `docs/record_2026-07-07.md` — append-only, timestamped build log (the "why"/"how", bugs,
  abandoned approaches). Never edited retroactively. Point-in-time snapshots live inside it —
  the state-doc tier was retired 2026-07-08 (`state_2026-07-07.md` archived there, banner-marked,
  deletion pending Evan's approval); this HANDOFF is the only live snapshot.
- `backend/README.md` (**private-tree only — not shipped to the public
  `servelocal-portfolio` mirror**), `frontend/README.md` — per-subproject stack +
  layout + scope-cut list.
- `docs/API_KEYS.md` — single registry of every key/secret (env var, purpose, milestone, status,
  how to obtain). No real values; those live in gitignored `.env`. The "what Evan must provide" list.

## BLOCKED-ON-EVAN (live list, as of 2026-09-03)

Only open items are listed. **Resolved blockers were removed on 2026-09-03** — their trail
lives in the record and in the dated PRD/ADR entries, and keeping a strike-through history
here is what made this section unreadable. Nothing downstream is guessed or worked around:
everything is built up to the blocked step and stops there.

**The launch critical path**

- **Legal review (M11 Phase 1) — the hard gate.** `[GOVERNING STATE]` and
  `[LEGAL ENTITY NAME]` are unfilled in the Terms/Privacy DRAFTS (both on
  `terms/page.tsx:91` — moved from `:86` by the 2026-09-05 flag-gating edit;
  line, not substance, changed), then an adult/guardian + legal sign-off. The entity question is
  real: operating as a person versus forming one has liability consequences at 17 on a
  platform holding minors' data. **The reviewer must also see** the concrete 12-month
  audit-retention promise (2026-08-13) and the **new sentence added 2026-09-03** saying an
  organization can see totals for its own listings. **The packet that says all of this in
  one place is now `docs/LEGAL_REVIEW_PACKET.md` (2026-09-03)** — routing decision, the
  `cite-scan` output, and a claim-vs-code table. It does not answer anything; it is what the
  reviewer reads. **Now also a boot blocker in code, not just a runbook item**
  (2026-09-03): `LEGAL_SIGNOFF_COMPLETE` in `backend/.env` defaults `false`, and
  production refuses to boot without it (`docs/DEPLOY_RAILWAY.md`
  §check_production_config gotchas). Flip it only once sign-off is real.
- **Answer pre-mortem E4**: now that E2 is resolved (birthday ~«redacted-date»), does Evan
  want the guardian-consent/breach/support duty of real minors' data, or does the
  project stay a documented artifact? One line settles it.
- **The legal pages now say ServeLocal does NOT vet organizations** (2026-09-03) —
  the previous claim that an admin reviewed them was false. Roadmap **M15** builds the
  review; until it ships, the reviewer and any guardian sees the honest sentence.
- **`LEGAL_SIGNOFF_COMPLETE` is now TWO flags** — backend (boot guard) and
  `NEXT_PUBLIC_LEGAL_SIGNOFF_COMPLETE` (removes the draft banner, build-time inlined).
  **Set both or neither**; `backend/tests/test_legal_pages_are_publishable.py` fails if
  either is set while `[… — Evan]` placeholders survive in the pages. **NT1 fixed
  2026-09-05**: a forced `LEGAL_SIGNOFF_COMPLETE=true` CI step was the obvious fix and
  the wrong one — tested locally first, it failed CI permanently since the real
  placeholders are still open. Instead `_assert_none_survive_if_signed_off` is now
  exercised every run against a planted fake placeholder, decoupled from today's real
  content — no CI workflow change needed. Pre-mortem re-run 2026-09-05
  (`docs/premortem_2026-09-05_legal-pages.md`) also **closed T3 for real** — raising `MINIMUM_AGE` to 13 means no
  registrant is a COPPA "child" at all, not just a reworded floor.
- **THE MIRROR IS PUBLISHING AN INTERNAL LEGAL BRIEF, AND STILL IS.** The removal of
  `docs/research/2026-09-03_ccpa-gdpr-coppa-state-minors-privacy-background.md` (32,128
  bytes of open children's-privacy questions, written for a reviewer who has not read
  it) is **committed in the portfolio repo as `5eac677` but NOT pushed** — the
  `trading-guard` hook blocks the push because publishing is Evan's. Until
  `cd D:/ClaudeCode/servelocal-portfolio; git push origin main` runs, **the file is
  live on GitHub**. The cause is fixed in `sync_portfolio.py` (2026-09-07), so no
  future sync re-adds it.
- ~~**DECISION: rewrite the mirror's published history, or not?**~~ **ANSWERED
  2026-09-07: DEFERRED by Evan** — push the tip removal, leave the blob reachable by
  SHA for now. Recorded as a decision, not an oversight. Original framing kept below
  because the full-removal path is still the one to follow if he changes his mind. The tip removal above
  does not remove the blob from history — it stays reachable by commit SHA. A rewrite
  is a force-push on a public repo and is Evan's call alone. Note before deciding: a
  force-push does **not** reliably evict the blob from GitHub's own cache; that needs
  GitHub Support.
- ~~**DECISION: does the exact date «redacted-date» stay public?**~~ **ANSWERED 2026-09-07:
  redact it.** Both the DOB and the 18th-birthday date now stop at the sync boundary
  (`REDACTIONS`, two rules). Already-published copies at mirror `HANDOFF.md:35` / `:312`
  are unaffected — that is the history question above, which Evan deferred.
- **The mirror is also STALE beyond that** (`c61427f`, 2026-09-05) — frontend and docs
  have landed since. `--check` reports 21 differing files. A full
  `python scripts/sync_portfolio.py` + a gated push retires it. Pre-mortem T1.
- **Two pre-mortem questions for a responsible adult** (2026-09-01), not for a commit:
  Evan is 17 with no legal entity, and nobody has asked whether M11 needs real minors at
  all when the stated goal is a portfolio piece.

**Values and accounts**

- Railway account, Postgres provisioning, domain purchase + DNS, and the production secret
  VALUES — runbook: `docs/DEPLOY_RAILWAY.md`. The boot guard's **9 checks over 8 variables** must be satisfied or
  production refuses to start, including `APP_BASE_URL` and `TRUSTED_PROXY_HOPS`.
- **`TRUSTED_PROXY_HOPS=1` on Railway.** Not a secret. At the default `0` behind a proxy
  the whole user base shares one rate-limit bucket and the per-client limit does nothing.
- Turnstile site + secret keys (signup bot defense ships off until set).
- Resend API key + verified sender domain (email is a logged no-op without it, so the M5
  consent invite would report success and deliver nothing).
- `SUPPORT_EMAIL` — waits on the domain. Someone must also read that inbox, and one admin
  account must be promoted by explicit SQL.
- Sentry DSN (an 18+ ToS question, same class as live Stripe).
- **Rotate the test-mode Stripe key** (added 2026-09-03): it rendered into agent output
  during a reproduction. Test-mode, gitignored, never committed — rotating is still yours.
- `stripe listen` round-trips: the webhook one and the hosted-page test payment (M8.2's
  last steps; both need the CLI's `whsec_`).

**Operational**

- **Schedule the monthly audit-log purge** (`python -m scripts.purge_audit_log`). Nothing
  runs it, so the policy's stated 12-month period is a promise kept by hand. Now also listed
  as a claim-vs-reality gap in `docs/LEGAL_REVIEW_PACKET.md` §3 — the reviewer sees it.
- **Run one real backup restore-drill** (`python scripts/backup_db.py --restore-drill`).
  It has only ever been verified by inspection. Docker is back, so it can now be done.
- The **Pro price disagreement**: the pricing page shows $19/mo, `STRIPE_PRO_PRICE_CENTS`
  is $29 (ADR-0002 follow-up #2). Two numbers, one truth needed.

**Decisions still open (small)**

- None. Both bin-cap questions were answered by Evan on 2026-09-03 and are closed:
  `repr(Settings)` compressed (`security.md` 183 → **150**, exactly at the ~150 cap, with
  the full narrative left in the record), and the skill's `INDEX.md` cap raised **25 → 75
  globally** (`project-memory/SKILL.md:304`, `templates.md:201`). Trading's INDEX is 22
  lines, so no other project changed. Record II.43.

---

## Next session — paste this

```
ServeLocal v2 — D:\ClaudeCode\ServeLocal\servelocal-v2

READ IN THIS ORDER, as claims to verify rather than as truth:
  1. HANDOFF.md — the only live snapshot (this file)
  2. PRD_ROADMAP.md — the standing M1–M15 plan; work its next open task
  3. .claude/codebase-memory/INDEX.md, then ONLY the bins your task touches
  4. .claude/codebase-memory/DIRECTORY.md — the map; run its staleness check FIRST
  5. docs/record_2026-07-16.md — the last few entries are the useful context; the
     append-only record beats every snapshot on historical fact

WHERE THINGS STAND (verified against disk 2026-09-07 ~10:17 CDT).
M1-M10, M12, M13.1-.5 and M14 are done: 18 of 23 PRD success criteria, and all 5 open
ones are M11 launch itself - every one needs Evan (legal review, accounts/spend, a real
deploy, a real guardian). NO MODEL-DOABLE WORK TICKS A PRD BOX RIGHT NOW.
410 backend tests green on SQLite (411 on real Postgres); migrations 0001-0028;
M13.6 SWR at 16 of 22. servelocal-v2 on main, **ahead of origin/main —
committed, NOT pushed** (`git status -sb` for the count; neither it nor a HEAD SHA
survives the commit that writes it here, which is why neither is pinned. The
substantive commits are 0a563b4, ee100e6, c8e4889); the root record repo at aa01919.

TODAY MATTERS: Evan turns 18 on «redacted-date» - imminent. That lifts the person-vs-entity
blocker on the Terms (he can be the named operator himself, no adult co-signer). It does
NOT lift the duty: the platform holds other people's minors' data, so guardian consent,
breach notification and a support channel are unchanged, and legal review is still not
optional. Both facts are pinned as dated forward-pointers in PRD_ROADMAP.md (search
"Forward-pointer added 2026-09-06").

HARD CONSTRAINTS
- DOCKER DESKTOP'S DAEMON IS DOWN (as of 2026-09-06 ~13:40 CDT). Postgres is gone, so
  `docker compose up`, the Postgres-only capacity-race test, and backup_db.py cannot run
  until Evan restarts it. The API still boots and answers /health with 503 - that is the
  documented DB-unreachable response, not a bug. For frontend work, run the API on a
  scratch SQLite DB instead (DATABASE_URL="sqlite:///<path>" ENVIRONMENT=development,
  `alembic upgrade head` first).
- Push and mirror-sync need Evan's instruction each time, same as commit - NOT
  blanket-forbidden.
- THE PUBLIC MIRROR IS LEAKING, NOT JUST STALE (2026-09-07). It published
  docs/research/2026-09-03_ccpa-...-minors-privacy-background.md — internal legal gap
  analysis. The removal is committed in the mirror as 5eac677 and BLOCKED on Evan's
  push (`cd D:/ClaudeCode/servelocal-portfolio; git push origin main`); until then it
  is live on GitHub, and a tip removal does NOT clear it from history. The CAUSE is
  fixed: sync_portfolio.py's two flat globs are explicit per-file lists now
  (PUBLIC_RESEARCH / PUBLIC_ADRS), LICENSE is finally staged, and Evan's DOB is a
  REDACTION. Beyond that the mirror is still stale by 21 files; the sync itself is an
  outward-facing publish and is Evan's call. `--check` writes nothing.
- [date-before-timestamp, PowerShell 5.1 uses `;` NOT `&&`, ENVIRONMENT=ci, frontend has no
  test runner, the stop-backend check + its cached-200 trap, FOR UPDATE no-op on SQLite,
  heredoc byte-corruption, git checkout unsafe-restore - unchanged, see file]

NEXT ACTIONS, in priority order
1. M11 LAUNCH SEQUENCE. Rows 3 (uptime monitor) and 4 (restore drill) are DONE. Left:
   row 1 legal review of ToS/Privacy + fill [LEGAL ENTITY NAME]/[GOVERNING STATE]
   (Evan, on/after «redacted-date» - hand over docs/LEGAL_REVIEW_PACKET.md); row 2 domain
   + managed Postgres + Turnstile keys + Sentry DSN (Evan, accounts/spend); row 5 deploy
   with migrations applied by the deploy process (model, after row 2); row 6 a real
   end-to-end run with a real guardian (Evan).
2. M13.6 SWR - 6 UNITS REMAIN. One unit, browser-verified, per sitting.
   MECHANICAL: components/site-header.tsx (converting it also fixes a live bug - marking
   notifications read never tells the header, so the badge stays stale until remount),
   reviews-section, signup-section.
   NEEDS DESIGN: hours - its load starts with a WRITE (POST /hours/auto-log), so a
   straight swap re-POSTs on every focus/reconnect and turns its Retry button into a write
   button; copy the dashboard's answer (mount-once useEffect + useRef guard, revalidate
   only affected keys and only when created > 0) and add the role guard its effect lacks.
   org-checkin-section seeds a controlled <select> from its fetch, so `date` must become
   derived. messages-section renders a 403 as INVISIBILITY, not an error.
3. FINISH THE DESIGN-SYSTEM SPLIT. opportunities/[id] was converted off shadcn 2026-09-06;
   11 files still import @/components/ui/. The editorial system wins on user-facing screens
   (M12 is a ticked criterion) - the shadcn-to-editorial mapping is now in ui.md so the next
   conversion does not re-derive it.
4. M15 org review before listings publish - buildable now, does not gate launch, and it is
   its own sitting: Opportunity has no status column, GET /opportunities/{id} filters on
   NOTHING today, and ~20 existing tests create a listing then immediately read it publicly.
   One (test_account_deletion.py:228) would pass VACUOUSLY. PRD_ROADMAP.md also asks for a
   queue-response commitment as part of M15.1, not after launch.
5. KNOWN DEFECT, UNFIXED: reviews-section swallows its load failure whole
   (.catch(() => undefined)), rendering a blank card on error. Catch it in its M13.6 pass.
```
