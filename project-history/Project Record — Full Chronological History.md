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

- [A — Scheduled daily-audit: an internal COPPA gap analysis is public, and the legal-signoff flag can never reach the build that would clear the banner](#appendix-a---scheduled-daily-audit-an-internal-coppa-gap-analysis-is-public-and-the-legal-signoff-flag-can-never-reach-the-build-that-would-clear-the-banner-2026-09-07-0723-cdt) (09-07)
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
- [II.22 — two-pass cold audit: the M5 launch gate was never wired up (2026-08-05)](#ii22--two-pass-cold-audit-the-m5-launch-gate-was-never-wired-up-2026-08-05)
- [II.23 — second cold audit, graphify, Next 16 + nonce CSP, and the first live proof of the M5 gate (2026-08-06 to 2026-08-07)](#ii23--second-cold-audit-graphify-next-16--nonce-csp-and-the-first-live-proof-of-the-m5-gate-2026-08-06-to-2026-08-07)
- [II.24 — two CRITs on minors' data, then the guardian kill switch made retroactive (2026-08-08 to 2026-08-12)](#ii24--two-crits-on-minors-data-then-the-guardian-kill-switch-made-retroactive-2026-08-08-to-2026-08-12)
- [II.25 — the rate limiter was counting the proxy, and a docstring was describing the opposite of what shipped (2026-08-12)](#ii25--the-rate-limiter-was-counting-the-proxy-and-a-docstring-was-describing-the-opposite-of-what-shipped-2026-08-12)
- [II.26 — a fix that swept only its own call site, and the first retention limit (2026-08-13)](#ii26--a-fix-that-swept-only-its-own-call-site-and-the-first-retention-limit-2026-08-13)
- [II.27 — scheduled daily-audit: the retention cron was already correctly deferred, two items stay pending on Evan (2026-08-16)](#ii27--scheduled-daily-audit-the-retention-cron-was-already-correctly-deferred-two-items-stay-pending-on-evan-2026-08-16)
- [II.28 — the mirror did not self-heal, and the secret guard skipped what it could not decode (2026-08-18)](#ii28--the-mirror-did-not-self-heal-and-the-secret-guard-skipped-what-it-could-not-decode-2026-08-18)
- [II.29 — scheduled daily-audit: the PUBLIC MIRROR was audited, ServeLocal itself was NOT (2026-08-21)](#ii29--scheduled-daily-audit-the-public-mirror-was-audited-servelocal-itself-was-not-2026-08-21)
- [II.30 — scheduled daily-audit: the guardian MANAGE token never expires and rides in the URL path, and II.29's own follow-through never landed (2026-08-25)](#ii30--scheduled-daily-audit-the-guardian-manage-token-never-expires-and-rides-in-the-url-path-and-ii29s-own-follow-through-never-landed-2026-08-25)
- [II.31 — the role-guard consolidation lands, and the near-miss that preceded it becomes a test (2026-08-31)](#ii31--the-role-guard-consolidation-lands-and-the-near-miss-that-preceded-it-becomes-a-test-2026-08-31)
- [II.32 — the rest of 2026-08-31: two more consolidations, eight decisions, SWR, and a sweep that graded the prose (2026-08-31)](#ii32--the-rest-of-2026-08-31-two-more-consolidations-eight-decisions-swr-and-a-sweep-that-graded-the-prose-2026-08-31)
- [II.33 — the five follow-ons, and two bugs that only a mechanism would have found (2026-09-01)](#ii33--the-five-follow-ons-and-two-bugs-that-only-a-mechanism-would-have-found-2026-09-01)
- [II.34 — a pre-mortem, a fallback audit, and two guards that could not fire (2026-09-01)](#ii34--a-pre-mortem-a-fallback-audit-and-two-guards-that-could-not-fire-2026-09-01)
- [II.35 — scheduled daily-audit: the MANAGE-token HIGH is still open, and the audit's own repo-scope premise was wrong (2026-09-01, ~20:14 CDT)](#ii35--scheduled-daily-audit-the-manage-token-high-is-still-open-and-the-audits-own-repo-scope-premise-was-wrong-2026-09-01-2014-cdt)
- [II.36 — the config object printed every secret when it printed itself, and the fix sat green and unlanded (2026-09-02, ~16:29 CDT)](#ii36--the-config-object-printed-every-secret-when-it-printed-itself-and-the-fix-sat-green-and-unlanded-2026-09-02-1629-cdt)
- [II.37 — a both-domains audit: the checks verified shape, not truth (2026-09-02, ~18:14 CDT)](#ii37--a-both-domains-audit-the-checks-verified-shape-not-truth-2026-09-02-1814-cdt)
- [II.38 — the landing-check on II.37's own work: every guard fired, and three of the claims were wrong (2026-09-02, ~19:34 CDT)](#ii38--the-landing-check-on-ii37s-own-work-every-guard-fired-and-three-of-the-claims-were-wrong-2026-09-02-1934-cdt)
- [II.39 — M14.1's other half, and the dev database that could not have served it (2026-09-02, ~23:13 CDT)](#ii39--m141s-other-half-and-the-dev-database-that-could-not-have-served-it-2026-09-02-2313-cdt)
- [II.40 — M14 closes by deleting a claim, not by building one (2026-09-03, ~19:17 CDT)](#ii40--m14-closes-by-deleting-a-claim-not-by-building-one-2026-09-03-1917-cdt)
- [II.41 — the guard that now checks its own reasons, and a licence that would not have reached its readers (2026-09-03, ~19:30 CDT)](#ii41--the-guard-that-now-checks-its-own-reasons-and-a-licence-that-would-not-have-reached-its-readers-2026-09-03-1930-cdt)
- [II.42 — the snapshot had become a changelog, and the check that saved it was not the one in the plan (2026-09-03, ~20:07 CDT)](#ii42--the-snapshot-had-become-a-changelog-and-the-check-that-saved-it-was-not-the-one-in-the-plan-2026-09-03-2007-cdt)
- [II.43 — both cap decisions closed: one section compressed, one cap raised for every project (2026-09-03, ~20:22 CDT)](#ii43--both-cap-decisions-closed-one-section-compressed-one-cap-raised-for-every-project-2026-09-03-2022-cdt)
- [II.44 — two pages that showed the wrong screen on failure, and a legal packet whose value is that it concludes nothing (2026-09-03, ~20:33 CDT)](#ii44--two-pages-that-showed-the-wrong-screen-on-failure-and-a-legal-packet-whose-value-is-that-it-concludes-nothing-2026-09-03-2033-cdt)
- [II.45 — a pre-mortem on the whole project, whose top risk is that two of our own documents disagree (2026-09-03, ~22:14 CDT)](#ii45--a-pre-mortem-on-the-whole-project-whose-top-risk-is-that-two-of-our-own-documents-disagree-2026-09-03-2214-cdt)
- [II.46 — a research brief, a docs audit, and the one artifact of the three that actually blocks something (2026-09-03, ~22:49 CDT)](#ii46--a-research-brief-a-docs-audit-and-the-one-artifact-of-the-three-that-actually-blocks-something-2026-09-03-2249-cdt)
- [II.47 — the pre-mortem re-run: two Tigers genuinely closed, one new one about the safety net that was supposed to catch the next mistake (2026-09-05, ~16:28 CDT)](#ii47--the-pre-mortem-re-run-two-tigers-genuinely-closed-one-new-one-about-the-safety-net-that-was-supposed-to-catch-the-next-mistake-2026-09-05-1628-cdt)
- [II.48 — three legal-page updates, and a count from our own INDEX that did not survive checking (2026-09-05, ~18:46 CDT)](#ii48--three-legal-page-updates-and-a-count-from-our-own-index-that-did-not-survive-checking-2026-09-05-1846-cdt)
- [II.49 — the dashboard converts to SWR, and the write hiding in its loader (2026-09-05, ~19:04 CDT)](#ii49--the-dashboard-converts-to-swr-and-the-write-hiding-in-its-loader-2026-09-05-1904-cdt)
- [II.50 — the backup nobody had run, and a monitor that isn't on the box it watches (2026-09-05, ~19:15 CDT)](#ii50--the-backup-nobody-had-run-and-a-monitor-that-isnt-on-the-box-it-watches-2026-09-05-1915-cdt)
- [II.51 — two failures the app handled badly, one of which the browser caught in the fix itself (2026-09-05, ~22:19 CDT)](#ii51--two-failures-the-app-handled-badly-one-of-which-the-browser-caught-in-the-fix-itself-2026-09-05-2219-cdt)
- [II.52 — a security control that got weaker without erroring, and an off switch built to expire (2026-09-05, ~23:14 CDT)](#ii52--a-security-control-that-got-weaker-without-erroring-and-an-off-switch-built-to-expire-2026-09-05-2314-cdt)
- [II.53 — the last per-process counter goes shared, and a slow test suite turns out to be a correctness bug wearing a costume (2026-09-06, ~00:55 CDT)](#ii53--the-last-per-process-counter-goes-shared-and-a-slow-test-suite-turns-out-to-be-a-correctness-bug-wearing-a-costume-2026-09-06-0055-cdt)
- [II.54 — a page that had never been able to say "still loading", and a list of remaining work that was quietly wrong (2026-09-06, ~13:24 CDT)](#ii54--a-page-that-had-never-been-able-to-say-still-loading-and-a-list-of-remaining-work-that-was-quietly-wrong-2026-09-06-1324-cdt)
- [II.55 — the one screen that was written in two design languages at once (2026-09-06, ~13:44 CDT)](#ii55--the-one-screen-that-was-written-in-two-design-languages-at-once-2026-09-06-1344-cdt)
- [II.56 — three silent failures fixed, and an internal legal brief pulled off the public mirror (2026-09-07, ~10:41 CDT)](#ii56--three-silent-failures-fixed-and-an-internal-legal-brief-pulled-off-the-public-mirror-2026-09-07-1041-cdt)

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
  **[Corrected 2026-08-21 (II.29): the "no remote" half is false and was already
  false when written — `Evan-Daruwalla/servelocal-docs` carries commits from
  2026-07-08. It is a PRIVATE remote (anonymous fetch → HTTP 404), so nothing was
  exposed. Original sentence left standing per append-only.]**

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

## II.22 — two-pass cold audit: the M5 launch gate was never wired up (2026-08-05)

**WHAT.** Ran `/audit` twice. Pass 1 established the tooling baseline. Pass 2 was two cold agents
in parallel with disjoint scopes: a **live-stack** auditor owning the containers (M8 data-at-rest,
live-endpoint M6, G1/G2 executed against real HTTP) and a **static** auditor barred from Docker
(frontend surface, M2 call-site contracts, M1 invariants, M3 error exit-gates, M4, M7, G3/G4).
Docker had been down for weeks and came back mid-session, which is the only reason M8 and live-M6
were reachable at all — pass 1 had to mark them `not swept`. Evan then approved fixing everything
through P2.

**THE CRIT — M5 guardian consent, the documented hard launch gate, did not function end to end.**
`ConsentBanner` was the only caller of `POST /consent/request`, which is the only path that emails
a guardian — and the component was never mounted on any page (`grep` returned exactly one hit: its
own definition, cross-checked with two tools). `register` set `pending` and sent nothing;
`auth.py:114-115` said so in a comment. So **every minor who ever registered landed in a permanent
gate no guardian was ever told about**, while three UI surfaces told the student an email had been
sent. All 215 tests were green the entire time, because every one of them calls the API directly
and never exercises a React component. This is the single most important finding in the project's
history to date: the milestone Evan designated "the hard launch gate: no public launch with minors
before it is live" was shipped, marked complete, and did not work.

Fixed at the chokepoint rather than the symptom: extracted `services/consent_invite.py` and fired
it server-side at the end of `register`, so the gate no longer depends on any UI being mounted.
The banner was mounted too and restyled from shadcn/Tailwind to the v1 `.consent-zone` editorial
language. The three "we emailed your guardian" strings became true, so no copy change was needed.

**OTHER FIXES (22 total).** Production config guard failed OPEN — an exact `!= "production"` test
let `prod`, `Production`, `live` and `staging` boot on the dev `SECRET_KEY`, which forges any
user's JWT; now an explicit fail-closed allowlist, plus `RESEND_API_KEY`/`TURNSTILE_SECRET_KEY`/
32-byte-key checks. `role:"admin"` was self-registerable, skipping dob, `MINIMUM_AGE` and consent
entirely. Self-report hours had no dedupe: 8 concurrent submits produced 8 rows that an org
verified into **11.0 hours and an unearned National Honor Society award**. `require_consent` added
to auto-log/self-report/appeal/exclude-date (a guardian's *revocation* did not stop hours logging).
Idempotent re-verify; `IntegrityError`→409 on concurrent apply; `/health` 503 when the DB is down
(Railway routes on status code); `consent_blocks` fails closed on null dob; consent audit rows now
name the guardian rather than the student and carry IP/UA; audit rows on both hours-minting paths;
rate-limit key sweep; JWT lifetime 7d→24h.

**DECISIONS (Evan, 2026-08-05).** (1) Minimum age stays **12** — the PRD was the sole outlier,
`core/consent.py` and both legal drafts have always said 12; PRD struck in place with a dated
reason, no code changed. (2) The org-deactivate endpoint was added: `Opportunity.active` had four
readers and **zero writers**, so `delete_me` 409'd telling orgs to do something no API call could
do — org account deletion had been permanently unreachable. (3) Declined/revoked consent stays
terminal **for the student**, per v1 ADR-0010's "no auto-retry loop" (a minor must not be able to
spam past a guardian's refusal); the missing half was that same spec's "until support/admin
intervenes", so a new admin-only `POST /consent/admin/{user_id}/reopen` supplies it.

**HOW / corrections to the auditors.** Their proposed hours fix — a partial unique index on
`(opportunity_id, user_id) WHERE occurrence_date IS NULL` — was NOT implemented: it would
permanently block a second self-report for the same opportunity, breaking recurring commitments.
Deduped on the still-unreviewed row instead. Their "the unique constraint is a 100% no-op" was
overstated: check-in and auto-log both set `occurrence_date` and both already dedupe; self-reports
are null by design. The live auditor called the dev Postgres "the production DB" — it is not; the
site is unlaunched. And their `E7` fix (delete the key when empty) would not have worked, since
that key is repopulated on the same request; a periodic sweep was needed.

**VERIFICATION — every fix fed its own trigger, not read.** 8 concurrent `POST /hours`: 8×201 →
11.0h before, `201 + 7×409` and 3.0h after. Revoked minor logging hours: 201 → 403. 8 concurrent
apply: a 500 → none. Consent token minted at registration confirmed in the live DB (probe minors
created *before* the fix show `has_token = f`, after shows `t`). Org deletion: 409 → deactivate →
204. Browser-verified the banner's computed v1 styles, resend round-trip, self-hiding for
non-gated users, and the new `/admin` gate redirecting a non-admin. **256 pytest green** (from
215, +41), now under **warnings-as-errors** — a bare `-W error` had previously collapsed
collection to 0 tests. `ruff` finally wired into CI: its rules were declared in `pyproject.toml`
since M1 but ruff was never installed and CI never ran it, so the project's own Python gate had
always been dead. First real run found 398 violations; 103 were a B008 false positive on FastAPI's
`Depends()` idiom (fixed by config), 72 auto-fixed, 3 real ones fixed by hand, and 242 `E501`
line-length were deferred in writing rather than silently ignored.

**Two mistakes made and corrected during the fix pass, both caught by running things rather than
reading them.** The first `ENVIRONMENT` fix only normalized case and whitespace, so `prod` still
booted on the dev key — the trigger script caught it and it became a fail-closed allowlist. And
the invite service was written to charge the resend throttle, which 429'd a student's very first
retry, exactly when a guardian email lands in spam; seven tests failed and the design choice was
reverted rather than editing the tests around it.

**HONEST OPEN ITEMS (not fixed).** The test suite still runs on in-memory SQLite and never
Postgres — which is precisely why the NULL-unique semantics behind the hours bug went uncaught for
weeks. Recurrence DST/midnight/month-boundary logic in `occurrences.py` was never live-exercised
(every seeded opportunity is `one_time`). `httpOnly`-cookie migration for the JWT is sized large
and not done. `send_email`'s return is still discarded at several call sites. The decline
notification still says "contact support" with no support address behind it (BLOCKED-ON-EVAN).
Screenshot capture remained unavailable all session (the browser pane does not composite frames),
so UI verification was DOM plus computed-style throughout. All ~17 probe accounts created during
the audit were removed afterward, restoring the DB to its exact documented pre-audit row counts.

**STATUS:** M11 is still the only open milestone and still BLOCKED-ON-EVAN, but **M5 now needs
re-validation before M11 ships** — it was believed complete since 2026-07-08 and was not.
Committed as `b1d7e71` plus a follow-up batch.

---

## II.23 — second cold audit, graphify, Next 16 + nonce CSP, and the first live proof of the M5 gate (2026-08-06 to 2026-08-07)

**Covers two days.** The 2026-08-06 work was recorded in v2's own record but never
reached this whole-project file; it is folded in here rather than left as a hole.

**The second cold audit (2026-08-06) found that the previous day's fixes were
partly wrong.** Two cold auditors on disjoint scopes, both weighted toward the
2026-08-05 fix batch — the highest-churn, least-reviewed code in the repo. That
targeting paid for itself:

- **The hours dedupe was keyed on the hours VALUE**, so a "genuinely different
  entry" passed. Submitting `3.01` instead of `3.0` minted a fresh row —
  reproduced at 11 pending rows for one 3-hour shift, verifying to 33.55 hours
  and an unearned NHS award. **The test written the day before encoded the
  bypass**, which is exactly why the suite stayed green over it.
- **`set_active`, added the day before, made a dormant hole reachable.**
  `redeem_checkin` never checked `opp.active`, and check-in mints VERIFIED hours
  with no org review — so a student could credit themselves for a cancelled event.
- **The `ENVIRONMENT` fail-closed fix only covered values you SET.** The default
  was still `"development"`, so omitting the variable skipped the entire guard and
  booted on the dev `SECRET_KEY`.

Plus a separate **CRIT: admin escalation.** `is_platform_admin` granted admin to
any account whose email appeared in `ADMIN_EMAILS`, and registration seeded
`is_admin` from the same list — with **no email verification anywhere in the app**.
Whoever registered a listed address first became a platform admin, with the audit
log (every user's security events, minors included) and consent-reopen. The runbook
told Evan to set `ADMIN_EMAILS` before any account existed — precisely that window.
Admin is now the `is_admin` column only, granted by explicit SQL.

A **graphify refresh** (1594 nodes, 2937 edges, 159 communities) then caught five
codebase-memory bins contradicting each other — three of them freshly created by
the audit fixes, where `security.md` was updated and its siblings were not.

**2026-08-07 — the two "sized large" items, then the audit methods that needed a
running stack.**

**Next 15.5.20 → 16.3.0** took `npm audit` from 5 advisories to **0**. The `next`
vulnerable range covered every 15.x, so the 8 Next advisories had no patch short of
the major. Next 16 removes `next lint`, which WAS the CI lint gate — `npm run lint`
is now `eslint .` over a flat `eslint.config.mjs`. The bump also brought React
Compiler lint rules that flag 12 pre-existing sites; those were set to `warn` with
written reasoning rather than mechanically "fixed", because the main rule is largely
a false positive for an app that keeps its JWT in localStorage: localStorage cannot
be read during render without breaking SSR hydration, so complying literally in
`auth-context.tsx` would have introduced a bug.

**`script-src` no longer carries `'unsafe-inline'`.** A new `frontend/proxy.ts`
mints a per-request nonce; the static CSP was removed from `next.config.mjs`,
because two `Content-Security-Policy` headers are intersected by the browser rather
than overridden. This closes the gap ADR-0001 named as the price of localStorage
tokens — that decision leaned on "no XSS sink exists today", an argument about the
present that one future mistake invalidates. The cost is real and recorded:
`dynamic = "force-dynamic"` in the root layout, moving 28 routes from static
prerender to per-request render, because a nonce cannot exist in build-time HTML.
`style-src` deliberately keeps `'unsafe-inline'` — a nonce covers `<style>` elements
but never `style="..."` attributes, which is what React's `style={{...}}` prop
compiles to.

**M8 (data at rest) and live M6 (endpoint probing) finally ran, and the M5 launch
gate was driven end to end on real Postgres for the first time, in both
directions.** A fresh minor lands in `pending` and is refused on apply, check-in,
auto-log and self-report, and is absent from the public leaderboard; after a real
guardian approval through `POST /consent/{token}` the same calls succeed. An adult
student on the identical endpoint returned 409 "Already applied" — the control
proving those refusals were the gate and not a broken route. That is the
re-validation the 2026-08-05 crit demanded, and it is the first time the gate has
been shown working against a real database rather than inferred from unit tests.

**No new code defects were found.** All six apparent probe failures were wrong
assumptions in the probes themselves — guessed route paths, wrong HTTP method,
wrong field names, and a test address on the reserved `.invalid` TLD that looked
like user enumeration until retried. Recorded because a probe that fails for a dumb
reason and then gets quietly adjusted is how a real finding gets talked away.

**The bin sweep found the day's most operator-dangerous item, and it was
documentation, not code.** `backend/.env.example` still described `ADMIN_EMAILS` as
the "comma-separated emails allowed to read GET /audit-log". It grants nothing —
someone provisioning production would have listed their address and believed they
had admin. `security.md` was contradicting *itself* on the same point, one section
saying admin came from `ADMIN_EMAILS` and another saying that path was closed.

**Two process failures worth keeping.** First, `gotchas.md` had documented since
2026-07-13 that a React re-render after `el.click()` is async and must be read in a
separate call; I read it in the same call, concluded the page had not hydrated, and
briefly believed the new CSP had broken the app. The bin was right and unread.
Second, I ran `date`, the session then sat idle about seven hours, and I carried the
old stamp forward — dating a commit and six code comments 2026-08-06 when the work
happened on 2026-08-07. Caught only because a database row appeared to be
timestamped in the future.

**VERIFY.** 277 pytest green; ruff check + format clean; eslint exit 0; `tsc
--noEmit` clean; `next build` clean; `npm audit` 0 vulnerabilities. Browser-verified
in production mode, dev mode, and through the `output: standalone` Docker image.
Dev DB restored to its documented baseline and verified orphan-free.
## II.24 — two CRITs on minors' data, then the guardian kill switch made retroactive (2026-08-08 to 2026-08-12)

**Three cold audits and a three-phase feature**, spanning the CI-gate work of
2026-08-08 through the revoke build of 2026-08-12.

**The two crits both concerned minors, and one was a half-finished fix of mine.**
`GET /portfolio/{id}` gated on `portfolio_public` alone: consent was checked when
the transcript was PUBLISHED and never again, so a guardian's revoke blocked the
child's new actions while their name, hours and the organizations they served
stayed publicly served. The leaderboard had received exactly this fix on
2026-08-06 — with a comment on it reading "the consent gate covered
`portfolio_public` but not this board" — and the third sibling, which exposes
more than either, was never checked. Separately `min_age` was stored, rendered on
the org's create form, and read by NOTHING: a 12-year-old could join a 16+ build
day, auto-approve, check in and bank verified hours.

**The gate is now machine-enforced.** That contract had been missed three times —
hours routes, leaderboard, portfolio — each caught only by a person reading code.
`test_consent_gate_coverage.py` requires every write route to be either
consent-gated or explicitly allowlisted with a stated reason; it was proven to
catch by adding a fake ungated route, and it later caught a real one on its first
encounter with new work.

**Revoke became retroactive** (Evan's call, three phases). One status change does
the work: moving an application to `withdrawn` removes the student from check-in,
hours auto-log, org lists, thread access, reviews and spot counting simultaneously,
because every one of those filters on `status == "approved"`. The organization
keeps the row — greyed, with a hover reading "This account has been deactivated or
deleted" — because that row is their record of who signed up. The marker
deliberately never says WHY: an org has no business learning a family revoked
consent. And a guardian can now export and erase the account from the emailed
manage link, running the existing anonymize-in-place flow so the org's
verified-service history survives without PII.

**A fourth audit, run by a separate session, found that the first revoke phase had
left two org-side holes** — an org could click Approve and walk a revoke straight
back, and `create_notification` consulted the consent guard at exactly one of its
call sites, so verifying a revoked minor's hours emailed the child.

**Process failures kept, because they are the useful part.** A stale `date` was
carried across a seven-hour gap and mis-dated a commit by a day. Three "tests
green" claims were made against a CI that had been red for three pushes, because
only the local result was ever looked at — the failing test asserted an
environment default that the CI job itself overrides. A hardcoded date in the
recurring-signup tests was found **two days** before it would have started
failing. An auditor's proposed `<main>` landmark fix would have made accessibility
worse, and was caught only by checking the ten routes it claimed were broken and
finding all ten already correct. And an extracted service was first written from
memory with a materially wrong column allowlist, which would have silently changed
what the student data export contains — caught by diffing against the original
before wiring it up.

**A landing-check closed the batch** and found the new `withdrawn` status had no
rendering anywhere in the frontend: a revoked student's own page showed the raw
word in an amber "pending"-coloured pill. It also found a count in shipped source
that had been carried over from another session's summary without being verified.
Both corrected.

Backend tests went 277 → 306 across the batch; the frontend still has no test
runner at all, which is now stated plainly in the testing bin rather than implied
away.


## II.25 — the rate limiter was counting the proxy, and a docstring was describing the opposite of what shipped (2026-08-12)

**The rate limiter had been decorative in every deployment shape the project is
actually headed for.** It keyed on `request.client.host`, which behind a reverse
proxy is the proxy — so all traffic shared one bucket, the auth cap of 30/min was
a GLOBAL cap, and one abusive client could lock out the entire user base while the
per-client limit did nothing. It has been that way since M9 shipped it
(2026-07-09) and passed every test, because tests connect directly.

**The obvious fix was worse than the bug, and that shaped the design.**
`X-Forwarded-For` is attacker-supplied: read it unconditionally and any client can
vary the header per request, mint a fresh bucket each time, and bypass the limiter
completely — trading a shared-bucket DoS for no limiter at all. So the header is
believed only when the deploy states its topology, through a new
`TRUSTED_PROXY_HOPS` (default **0**, trust nothing). Each proxy appends the address
it received from, so with N declared hops the client is the Nth entry from the
right; anything that can't be justified — hops unset, header absent, chain shorter
than declared, an unparseable entry — falls back to the socket address. Five tests,
all red first, the load-bearing one asserting the header is IGNORED by default,
which is the property a careless implementation destroys. 306 → 311 (`92282c6`).

The residual is stated rather than papered over: the limiter is still in-memory
and single-process, so a multi-replica deploy multiplies every limit by the replica
count. This change fixed WHO gets counted, not WHERE the count lives.

**Then a doc pass found the day's own feature described backwards.** The
docstring on `_withdraw_from_rosters` claimed the `withdrawn` status removes a
revoked minor from, among other things, "the org's applicant and hours lists".
Checking all seven claimed surfaces against the code: five true, one unlisted
(hours self-report), and those two false — not near-misses but the **opposite** of
the design shipped hours earlier the same day, where Phase 2 deliberately KEEPS
the row in the org's list, greyed, because the row is the organization's record.
`security.md` carried both statements two bullets apart. Corrected in the three
live copies; the record entries keep the wrong sentence, because append-only means
the correction is a new entry, not an edit.

**The registry gap is the one worth remembering.** `TRUSTED_PROXY_HOPS` had been
documented in `.env.example` and both deploy runbooks but not in `docs/API_KEYS.md`,
the file that calls itself the single list of everything the operator must supply —
the third variable to go missing from that table after `SUPPORT_EMAIL` and
`NEXT_PUBLIC_APP_URL`. It is the most dangerous of the three: wrong, it raises no
error and logs nothing, and the only symptom is a security control quietly not
working.


## II.26 — a fix that swept only its own call site, and the first retention limit (2026-08-13)

**The previous day's rate-limiter fix was a third of itself, and the missing two
thirds were the part that mattered most.** `92282c6` introduced `client_ip()` to
stop keying rate limits on the proxy — and changed the limiter's own call site and
nothing else. Three other places still read `request.client.host` directly: the
two writes to `guardian_consent_ip`, and the `remoteip` handed to Cloudflare
Turnstile.

`guardian_consent_ip` is the evidence that a *specific* guardian approved a
*specific* child. Behind Railway's proxy it would have recorded the same host
address for every family on the platform — a parental-consent record that proves
nothing, with nothing erroring to say so. The Turnstile case inverts the signal
that parameter exists to carry. All three now route through a small
`client_ip_or_none()` wrapper, which differs from the limiter's resolver in one
way: it returns nothing rather than the `"unknown"` sentinel, because a stable
made-up key is right for a bucket and wrong for a record.

This is the project's recurring failure shape, now on its fifth appearance: a
correct fix applied at one call site while its siblings keep the old behaviour.
The consent gate was missed four times that way; `create_notification` consulted
the consent check at one of thirteen invocations; the leaderboard was fixed and
the portfolio was not. The standing rule — fix the chokepoint, then grep its other
callers — was written for exactly this and still had to be applied by hand.

**The audit log got a retention limit, which required admitting the table is not
purely append-only.** It records security events for every user, minors included,
and had none: it grew forever and the privacy policy could only say entries are
"retained". Now `AUDIT_LOG_RETENTION_DAYS` (365, floor 30), a purge that deletes
**by age only** — there is deliberately no path to remove a particular row, which
is the property append-only actually protects — and a policy that states 12
months. Nothing purges automatically: a background job silently deleting
accountability records is the wrong default, so the monthly cron is a launch item.
A stated retention limit nobody enforces is worse than stating none.

**The `min_age` grandfathering question was answered by reading the write path
rather than by writing a backfill.** `min_age` is set at creation and by no other
route, so an org cannot raise the floor under people who already applied; the only
affected rows predate the guard and exist solely in the dev database, because
nothing is deployed. The answer shipped as a test that fails the day a route can
change it on an existing listing.

**A landing-check on the batch returned FIX FIRST and found six things**, of which
two were substantive: this record and its HTML twin had not been touched at all,
and the claim "there is no field-editing route — only `/featured` and `/active`"
was wrong in three places including the source comment the whole grandfathering
argument rests on. There is a third PATCH. The conclusion survived; the
enumeration did not, and it had been written by reading a route list and
generalising.

323 backend tests, up from 311. Docker was down on the dev box, so nothing was
browser-verified and the purge CLI was proven end to end against a scratch SQLite
database instead — stated rather than glossed.

## II.27 — scheduled daily-audit: the retention cron was already correctly deferred, two items stay pending on Evan (2026-08-16)

The `daily-audit` scheduled task ran a cross-project cold audit; Evan replied
"do all." Three findings, zero code fixes here — this was the one project in
the batch where checking first found nothing left to do.

**SL-1 (2 unpushed commits, `5c8e36c`/`500a0da`) — unchanged, awaiting Evan.**
Explicitly flagged in the audit as his call, not covered by "do all": pushing
is a stronger action than fixing, and global standing order is never push
without being told. Still pending.

**SL-2 (audit-log retention has no scheduler wiring it up) — checked, already
correctly handled, no fix applied.** The audit's proposed remediation
("add a Railway cron") assumed the gap was undocumented. It is not:
`servelocal-v2/docs/DEPLOY_RAILWAY.md` §Scheduled jobs already states the
exact command, the recommended `0 4 1 * *` monthly schedule, the `--dry-run`
check, and labels it `[EVAN] to schedule, [PREPARED] command` — because
Railway cron is configured per-service in its dashboard, not in a repo file,
and the service doesn't exist yet (M11 launch is still BLOCKED-ON-EVAN).
Writing a redundant patch here would have been inventing work against a gap
that was already honestly labeled. Nothing changed.

**SL-3 (public mirror stops at II.25, private record has II.26 — now II.27) —
no action needed.** Self-heals on the next `servelocal-portfolio` sync; not a
defect in either repo.

### Status
- SL-1: pending, Evan's call.
- SL-2: verified already correct; withdrawn as a fix target.
- SL-3: not a defect, self-corrects on next sync.

## II.28 — the mirror did not self-heal, and the secret guard skipped what it could not decode (2026-08-18)

**SL-3 in II.27 was closed as "self-heals on the next sync." It did not, because
nothing ever runs the sync.** Six days on, `servelocal-portfolio` still stopped at
II.25. That deferral was reasonable per-finding and wrong as a mechanism: the only
way to learn the mirror had drifted was to run `sync_portfolio.py`, which also
*mutates* it — so nobody ran it to ask. A check with a side effect is a check that
does not get run.

The drift was seven files, and one of them mattered: **`frontend/app/privacy/page.tsx`
in the public mirror still carried the pre-II.26 privacy policy**, without the
12-month audit-log retention statement. Out of 101 shared frontend files it was the
only content divergence — the published policy text for a platform that serves
minors, one edit behind the policy the code enforces. Nothing is deployed, so this
was source on GitHub rather than a served page; that is mitigation, not absolution.
Also stale: `HANDOFF.md`, `docs/record_2026-07-16.md`, both record twins, and two
codebase-memory bins (`INDEX.md`, `features.md` — neither named by the audit; the
new check found them).

**`sync_portfolio.py --check` now answers the question without writing.** It runs
the REAL sync path into a throwaway copy of the mirror and diffs, so the check
cannot drift from what a sync would actually produce. The comparison is
CRLF-normalized, and that is load-bearing rather than tidiness: the mirror is
checked out with CRLF while this tree is LF, so a raw byte diff reports **every**
shared file as drift — a check that always fires is a check nobody reads. Run
against the stale mirror it named exactly 7 files and exited 1; after the sync,
`IN SYNC — 119 files`.

**The secret guard had a fail-open path, in a guard whose entire design is to fail
closed.** `scrub_and_guard()` caught `UnicodeDecodeError`/`ValueError` and
`continue`d, commented "binary-ish; not a doc/source leak surface" — so any file
that is not valid UTF-8 and not in `SKIP_SCAN_SUFFIXES` was **published without
ever being scanned**. Zero such files existed, so this was constructed rather than
observed. Proven by trigger: a UTF-16 `docs/research/_utf16_probe.md` carrying a
live-shaped `sk_live_…` string synced clean before the fix; after it, exit 4 and
`UNSCANNABLE (not valid UTF-8, and its suffix is not in SKIP_SCAN_SUFFIXES)`. The
probe was removed. A genuinely binary type now has to be declared by suffix, by
name, rather than admitted by a decode failure.

**Two README claims were wrong and are outside the sync's reach.** `README.md` is
not in `MANAGED_DIRS`, so no sync would ever have corrected either: it said
"Next.js 15" (both trees have been on `^16.3.0` since 2026-08-07) and framed
`security.md` as the one omitted memory bin when six of twelve are withheld. Fixed
by hand — and worth noting as a category: the file that describes the mirror is the
one file the mirror's own tooling does not maintain.

### Verification
- `python scripts/sync_portfolio.py --check` on the stale mirror: **STALE, 7 files, exit 1**.
- Post-sync re-run: **`IN SYNC — 119 files`, exit 0**.
- Post-sync spot checks: `"12 months"` present 3x in the mirror's privacy page (0 before,
  cross-checked with both `grep` and the Grep tool); record reaches **II.27**; demo password
  still `«redacted-local-demo-pw»` with 0 raw occurrences; `security.md` still absent.
- Fail-closed guard fed its own trigger (above), then the probe deleted and `--check` re-run clean.
- **Not pushed** — Evan authorized the fixes, not a publish. `servelocal-portfolio` is a
  PUBLIC repo; the mirror is committed locally and awaits his push.

### Status
- SL-3 (carried from II.27): **closed**, and its "self-heals" premise retired.
- Mirror in sync as of 2026-08-18 ~09:00 CDT; committed, **not pushed**.

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
| 2026-07-22 | v2 | PRD gains a required GOAL block at the top (skeleton sync) | `588a7c0` |
| 2026-08-05 | v2 | Two-pass cold audit: **M5 consent gate was never wired up** (banner never mounted, register sent nothing) + 21 other P1/P2 fixes; prod guard failed open on `ENVIRONMENT=prod`; hours double-submit minted an unearned award; org deletion was unreachable. 215→256 tests, warnings-as-errors, ruff finally live in CI | `b1d7e71` |
| 2026-08-06 | v2 | Second cold audit: **admin escalation via `ADMIN_EMAILS`** (no email verification anywhere) + the previous day's fixes were partly wrong — hours dedupe keyed on the hours VALUE so `3.01` bypassed it, `redeem_checkin` never checked `opp.active`, `ENVIRONMENT` still defaulted to development. 277 tests | `5d53d42`, `7aff291` |
| 2026-08-07 | v2 | Next 15→16 (**npm audit 5→0**, `next lint` removed → flat eslint config); **`script-src` drops `'unsafe-inline'`** via a per-request nonce in `proxy.ts` (cost: 28 routes static→dynamic); live M8 + M6 — **M5 consent gate proven end to end on real Postgres, both directions**; `.env.example` still claimed `ADMIN_EMAILS` granted admin | `d9b5ccf` + this |
| 2026-08-08 | v2 | CI had been RED for 3 pushes while "tests green" was reported — a test asserted an env default that the CI job overrides; both dependency-CVE scans made blocking after actually running them | `4967672`, `4238e5b`, `536b795` |
| 2026-08-11 | v2 | Third cold audit: **revoke left the minor's public transcript served** (portfolio checked consent only at write time) and **`min_age` was enforced nowhere**; consent gate made machine-enforceable after 3 misses | `6762837` |
| 2026-08-12 | v2 | **Guardian revoke made retroactive** in 3 phases — roster withdrawal + spot release, org-side greying that never says why, guardian export/delete on the manage token. A 4th audit found phase 1 left two org-side holes. 306 tests | `4ddaaef`, `5303931`, `18a0c6c` |
| 2026-08-12 | v2 | **Rate limiter stopped keying on the proxy** — it had been a single GLOBAL bucket behind any reverse proxy since M9; `X-Forwarded-For` now believed only when `TRUSTED_PROXY_HOPS` declares the topology (default 0 = trust nothing). Still in-memory/single-process. 311 tests | `92282c6` |
| 2026-08-12 | v2 | Doc-drift closeout (audit findings 9/10): `_withdraw_from_rosters`'s docstring claimed the revoke removes a student from the org's lists — the **opposite** of the Phase 2 design shipped the same day; `TRUSTED_PROXY_HOPS` was missing from the operator registry | `fe06150` |
| 2026-08-13 | v2 | **The limiter fix had swept only its own call site** — `guardian_consent_ip` (approve + revoke) and Turnstile's `remoteip` still read the proxy, so parental-consent evidence would have been the same address for every family. Fifth appearance of the fix-one-site-miss-the-siblings shape | this entry |
| 2026-08-13 | v2 | **First retention limit on the audit log** (`AUDIT_LOG_RETENTION_DAYS`, age-only purge, policy states 12 months) + `min_age` grandfathering closed by construction. 323 tests; landing-check returned FIX FIRST and caught a wrong route enumeration in 3 places | this entry |
| 2026-08-16 | v2 | Scheduled daily-audit: retention-cron finding checked and found already correctly documented as BLOCKED-ON-EVAN (no fix applied); 2 unpushed commits stay pending his go | this entry |
| 2026-08-31 | v2 | A green 2026-08-25 fix pass found UNCOMMITTED after twelve days — committed with its entry reconstructed from the diff (provenance stated); the `sync_portfolio.py` managed-root-files bug fixed in it means every earlier `--check` on HANDOFF/PRD is suspect | `e98ab4f`, `ccc1396` |
| 2026-08-31 | v2 | **Role-guard consolidation** — 25 inlined role checks classified into four shapes (a regex sweep treating them as one briefly ungated `create_review`; reverted, then rebuilt by hand): 15 pure gates now resolve through `require_student`/`require_org` in `deps.py`; new wrong-role probe on all five consent-gated student routes. 330 tests | II.31 |
| 2026-08-31 | v2 | **Status maps consolidated** to `lib/status.ts` — four copies (not the briefed three) across TWO status domains that merely shared a constant name; a naive three-way merge would have fused application and hours vocabularies. Zero display strings changed | II.32 |
| 2026-08-31 | v2 | **Phase 0 CLOSED — all eight launch decisions answered.** ADRs 0001+0002 stamped ACCEPTED; Pro "coming soon" surface built behind `NEXT_PUBLIC_BILLING_LIVE` (fail-closed); support address, Sentry, consent-IP, SWR and analytics decided — the last two against the model's recommendation | II.32 |
| 2026-08-31 | v2 | **M13.6 reopened and started: SWR adopted** as the fix for 19 hand-rolled fetch pages. `useAuthedQuery` + 1 page converted, which had no `.catch` and showed a false empty state on failure. Verified on a **SQLite-backed local stack** — the first browser verification since Docker went down | II.32 |
| 2026-08-31 | v2 | **`/landing-check`: zero code defects, four wrong numbers in the day's own prose** — plus the whole-project record covering 1 of 5 commits and HANDOFF contradicting itself on M13.6. Tenth run, same ratio: the code lands, the claims drift | II.32 |
| 2026-09-01 | v2 | **Four consent-gated routes gained wrong-role coverage**, and `/hours/{id}/appeal` gained the role gate it never had — safe until now only because `Hours.user_id` is always a student, i.e. a property of the data rather than a stated rule | II.33 |
| 2026-09-01 | v2 | **An unreachable API no longer logs the user out.** `auth-context` cleared the token on ANY `/auth/me` failure, so a dropped connection or a deploy restart destroyed the session | II.33 |
| 2026-09-01 | v2 | **M14.1 site analytics shipped** — `route_hits` counts per (day, route TEMPLATE, method) with no user, IP, session or sub-day time, so it cannot reconstruct one person's path; two tests fail if an identifying column is added. Migration 0025 | II.33 |
| 2026-09-01 | v2 | **Sentry wired, off by default, scrubbed before send.** The test asserting the scrubber is WIRED (not merely correct) caught a crash that would only ever have happened in production: the integration needs `jinja2`, absent → boot failure the moment a real DSN is set | II.33 |
| 2026-09-01 | v2 | **SWR migration to 11 of 22 pages**, and **SIX pages carried the same false-empty-state bug** — the sixth found by a landing-check because the author's own census grepped a token that breaks across lines | II.33 |
| 2026-09-01 | v2 | **Pre-mortem on the M11 soft launch** — 18 risks; all SEVEN launch-blocking Tigers fail silently, and two Elephants (a 17-year-old with no legal entity; whether launch needs real minors at all) are decisions for a responsible adult rather than commits | II.34 |
| 2026-09-01 | v2 | **Fallback audit, 7 cold workers.** `scrub_event` shipped raw guardian tokens and emails through `exception`/`breadcrumbs`; the guardian manage token skipped its own guards at 2 of 4 callers; the boot guard never covered `TRUSTED_PROXY_HOPS`. All fixed; 354 tests | II.34 |
| 2026-09-01 | v2 | **A guard that could never fire**: the first redaction regex compiled its word-boundary escape as a literal backspace byte, so it matched nothing — invisible to `grep`, caught only by re-running the reproduction. The record entry describing it then contained the same byte | II.34 |

## II.29 — scheduled daily-audit: the PUBLIC MIRROR was audited, ServeLocal itself was NOT (2026-08-21)

**Scope, stated first because it is easy to misread.** The 2026-08-21 sweep
classified `ServeLocal` as SKIP-AUDITED (audit II.27 dated 2026-08-16, only 2
non-audit commits after `43722c0`). The project it audited was
`D:\ClaudeCode\servelocal-portfolio` — the **public mirror**, which has no audit
in its own history, ever. This entry lives here because mirror findings have
always been recorded here (II.28 is a mirror entry). **A future sweep that reads
this entry as "ServeLocal was audited on 2026-08-21" is wrong.**

**10 findings, 6 edge cases, nothing fixed** (the sweep is read-only).

**Top finding — the secret guard's abort leaves the secret in the public repo.**
`servelocal-v2/scripts/sync_portfolio.py` `main()` wipes and copies directly into
the live mirror, and only then runs `scrub_and_guard()`. On a violation it prints
"ABORT — secret guard tripped (nothing was committed)" and returns 4 with the
offending file already written into `servelocal-portfolio\`. The message is true
and misleading: the next `git add -A` — which the script itself prints as the
manual publish path, and runs under `--commit` — publishes it. `check_drift()`
already does this correctly, into a tempdir. The same non-atomicity means a crash
between `wipe_managed()` and `copy_frontend()` leaves the mirror gutted.

**Landing-check on the most recent entry** (`servelocal-v2/docs/record_2026-07-16.md`,
2026-08-19 ~17:55 CDT): mirror range `1ed22ae..e5a7235` VERIFIED (5 files, 317
insertions); "119 files" VERIFIED; push `8d22c75..3996577` VERIFIED and on
`origin/main`; the "uncommitted note change, committing next" HONORED (`784d725`).
Two claims did not hold:

1. **"`--check` now reports IN SYNC"** — it reports STALE, exit 1. The mirror is
   missing exactly that entry, because the entry documenting the sync is
   necessarily written after the sync runs. Any session that records a sync ends
   stale by construction.
2. **"Root record repo untouched — it stays LOCAL"** — and this document said the
   same in the 2026-07-09 "First push" entry and in the "What's not in this
   record (honest gaps)" trailer ("has no remote and stays LOCAL by Evan's
   decision"); both are corrected in place as of this entry. This repo has remote `Evan-Daruwalla/servelocal-docs`, 29 commits
   on `origin/master`, first dated 2026-07-08. An anonymous fetch of that repo
   returned HTTP 404 during this 2026-08-21 07:06-07:19 CDT sweep, so it is
   **not publicly readable** —
   this is doc-vs-disk drift, not an exposure. The decision text has been wrong
   for six weeks. **Evan's call: correct the doc, or remove the remote.**

**VERIFY.** Secret scanner clean on the mirror (`--staged` and `--history`, 0
findings); `npm audit` 0 vulnerabilities; `tsc --noEmit` exit 0; `eslint` 12
warnings / 0 errors; mirror `git ls-files` = 119. The mirror carries no personal
email addresses (cross-checked with two grep implementations).

**Consequence of this entry.** The HTML twin is now one entry behind — run
`python scripts/render_record_html.py`, then re-sync the mirror. Do the sync
LAST, after this entry, or finding 3 reproduces immediately.

---

## II.30 — scheduled daily-audit: the guardian MANAGE token never expires and rides in the URL path, and II.29's own follow-through never landed (2026-08-25)

Audit run — 26 findings across `servelocal-v2` (backend + frontend/docs) and the
public mirror, findings only, nothing fixed.

**Top finding — HIGH.** Every guardian consent/manage token is a **URL path
segment** (`app/api/routes/consent.py:203,301,315,338,390,401`), including
`GET /manage/{token}/export` and `POST /manage/{token}/delete`. Unlike
`reset_token_hash` and `guardian_consent_token_hash`, `guardian_manage_token_hash`
(`app/models/user.py:108`) has **no `_expires` column** — and `consent.py:447`
makes the permanence deliberate: "Keep this link. It is the only way to manage
your decision later." So a minor's export-and-delete credential is permanent,
un-rotatable, and lands in every proxy/CDN access log. The model's own comment at
`user.py:91` calls these hashes "single-use", which is false for this one.
Backend adds no `Referrer-Policy` or `Cache-Control: no-store` on these routes.
**Evan's call**, not a patch — this is a launch-gate decision for a platform
serving minors.

**Landing-check on II.29.** Its findings all still reproduce, and its own closing
instruction ("run `render_record_html.py`, then re-sync the mirror") was never
carried out in the four days since:

- II.29 itself is **uncommitted** (` M` on this file) and **absent from the HTML
  twin** — twin last built 2026-08-18 09:00, 52 `<h2>` vs 53 `##` headings.
- `python scripts/sync_portfolio.py --check` → **STALE**, 2 files.
- `servelocal-v2` is **ahead 1** of `origin/main` (`784d725`).
- II.29's top finding is unfixed: `sync_portfolio.py` `main()` still wipes and
  copies into the live mirror at `:328-330` and only runs `scrub_and_guard()` at
  `:339`, returning 4 at `:347` with the offending file already on disk —
  while `check_drift()` at `:249` does the same sequence into a tempdir.

**Mirror.** README:6-9 says rate limiting and auth are "deliberately not
published"; the mirror publishes the thresholds (auth 30/min, writes 120/min),
the backend file:line, and `docs/adr/0001:196`'s "more than one replica silently
multiplies every rate limit by the replica count". Graded high, not crit — nothing
is deployed yet. **Clean:** two independent grep implementations found no live
secret value, no personal email, and no non-public API host in the mirror.

**Counts.** `pytest -q` → **328 passed** (HANDOFF says 327). `ruff` clean;
`pip-audit` no known vulnerabilities. `frontend/README.md` says "Next.js 15";
`package.json` pins `^16.3.0`, and it points at `backend/README.md`, which the
mirror does not ship.

**Guard gaps.** Neither `servelocal-v2` nor `servelocal-portfolio` carries the
record-invariant delegation in `scripts/git-hooks/pre-commit`, and neither has a
`.gitattributes` LF pin (five sibling repos got both). Stale dead copies remain
at `servelocal-v2/.git/hooks/pre-commit` and `ServeLocal/.git/hooks/pre-commit`
— `core.hooksPath` means git never runs them. An abandoned worktree sits at
`.claude/worktrees/dazzling-murdock-5a8c6a`.

Full report in the scheduled daily-audit session output for 2026-08-25.

## II.31 — the role-guard consolidation lands, and the near-miss that preceded it becomes a test (2026-08-31)

Two sessions on one day. The first found the working tree holding twelve days of
foreign green work from 2026-08-25 — including the `sync_portfolio.py` fix for
managed ROOT files, which retroactively taints every earlier `--check` verdict on
`HANDOFF.md`/`PRD_ROADMAP.md` — committed it with a provenance-marked entry
reconstructed from the diff (`e98ab4f`), then designed the role-guard
consolidation, nearly shipped a hole with a regex sweep (`create_review` briefly
lost its student gate when the check-deletion and the dependency-swap didn't
pair), and reverted everything (`ccc1396`).

The second session built it by hand. The 25 inlined role checks are four shapes,
not one: 15 pure caller-role gates (converted — `require_student`/`require_org`,
one definition in `deps.py`), 4 role-AND-ownership conditions, subject-shaped
checks, and 2 bespoke-copy gates (all left alone). The five consent-gated student
routes keep `Depends(require_consent)` in their signatures — the coverage test
detects the launch gate by that exact name — and take the role guard as a
decorator dependency. The near-miss became mechanism: no test had ever sent an
org token at a consent-gated student route, which is exactly why the regex hole
would have shipped green; `tests/test_role_guards.py` now probes all five,
proven red against the reintroduced hole before being trusted. **330 backend
tests green.** Detail: `servelocal-v2/docs/record_2026-07-16.md`, entries of
2026-08-31.

## II.32 — the rest of 2026-08-31: two more consolidations, eight decisions, SWR, and a sweep that graded the prose (2026-08-31)

**Why this entry exists at all is the finding.** II.31 covered the role guards
and said "entries of 2026-08-31", plural. Four more commits followed it and none
reached this document — a project rule (`servelocal-v2/CLAUDE.md` §Definition of
done, item 4: medium-or-larger changes append here) quietly unmet for the rest of
the day. A `/landing-check` sweep caught it. That is the same shape as every
other failure in this record: the code was fine, the account of it was not.

**Status maps → `frontend/lib/status.ts`.** The open item said three files
defined one status vocabulary. Classification first — the lesson of II.31, applied
the same day — found **four** copies across **two** domains: application status
(pending/approved/rejected/waitlisted/withdrawn) and hours status
(pending/verified/denied/appealed), sharing only a constant name. Merging the
three named files, the literal reading of the task, would have fused two
vocabularies. Zero display strings changed; a fifth site (the org-facing
applicants table, which renders raw status words in the organization's own
register) was deliberately left alone.

**Phase 0 closed — eight launch decisions, in one sitting.** ADR 0001 (keep
localStorage-JWT at 24h) and ADR 0002 (launch free-tier-only) stamped ACCEPTED
with dated sections; the Pro upgrade surface became a "launching soon" state
behind `NEXT_PUBLIC_BILLING_LIVE`, default off so the safe state is the unset
one; the pricing page's "Stripe goes live with deployment" line, which a
free-tier launch would have made false on day one, went with it. Support address
= `support@<domain>` (so its value now waits on the domain purchase rather than
on a decision); error tracking = **Sentry**, because host-native logging cannot
see browser errors and this frontend has no test runner; consent-IP precision
kept in full. **Two decisions went against the model's recommendation** and are
recorded as such: adopt SWR rather than build a zero-dependency hook that SWR
would later replace, and **build analytics properly** rather than keep deferring
it — now PRD **M14**, first-party and cookieless, with the deferral's old
constraints (no cookies, no stored IPs, no per-user trail, minors) converted from
reasons-to-wait into build requirements.

**SWR adopted; one page converted; the local stack came back.** `useAuthedQuery`
holds `loading` true while auth hydrates — the precise reason a page can no
longer render "nothing here yet" before knowing whether the fetch failed — and
never retries client errors, since a 403 from the consent gate is a settled
answer and the rate limiter counts every attempt. The pilot page had **no
`.catch` at all**, so a failed load showed a student with applications an empty
state; the 2026-08-11 bug class, in a second file, invisible to a build.
**Docker has been down since mid-August**, so the backend was booted on SQLite
instead (`create_all` + `uvicorn --env-file`) and the flow driven through the
real HTTP API: data renders, an injected 503 produces the error panel and Retry
rather than the false empty state, Retry issues exactly one request and recovers,
and cached data survives an outage. SWR's focus/reconnect revalidation stays
**unverified** — the browser pane pins `visibilityState` to hidden and SWR gates
on it.

**The sweep.** Ten runs in, `/landing-check` again found **zero code defects and
zero mislandings** while every control it planted fired: 18 of 18 guarded routes
403 a wrong-role caller (derived twice, independently), 5 of 5 decorator guards
turn the suite red when removed, the consent-gate coverage test fires on the
exact mechanical-sweep failure that nearly shipped a hole earlier that day, and
the billing flag changes rendered output in both directions. What it found
instead: **four wrong numbers in the day's own record prose** (an unpushed-commit
count of 7 that was 5, "five maps" that are six, a "10 sites" list summing to 13,
"nine files" that are eight plus one), this document missing four of five
commits, and HANDOFF asserting both "M13.6 skipped" and "adopt SWR" twelve lines
apart. All corrected, with the originals left standing.

**Open and honest:** `auth-context` clears the token on any `/auth/me` failure,
so an unreachable API silently logs a user out — reported, unfixed, because auth
behavior on a minors platform deserves its own decision rather than a ride-along
in a refactor. Four consent-gated routes still have no wrong-role coverage. The
public mirror carries absolute local paths in four tracked files, all predating
this session — inherited, not introduced, and still a real disclosure.

## II.33 — the five follow-ons, and two bugs that only a mechanism would have found (2026-09-01)

Evan closed Phase 0 the previous day; this covers the five model-doable items
that followed, done in one run.

**Two were bug fixes with teeth.** `/hours/{id}/appeal` carried no role gate at
all — it was safe only because `Hours.user_id` is always a student, so an
organization fell through to an ownership 404. Safety as a property of the data
rather than a stated rule is the kind that stops holding quietly, so the gate is
now explicit and the test fails without it. And `auth-context` cleared the login
token on *any* `/auth/me` failure, unable to tell "your token is rejected" from
"the server is unreachable" — so a dropped connection or a routine deploy
restart silently signed users out. Both directions are now verified: an outage
keeps the session, a tampered token is still cleared.

**M14.1 built analytics that cannot become surveillance.** The table stores a
count per day, route template and method — no account, no IP, no session, no
user agent, and no time finer than a day. It records that the opportunity page
was opened forty times, never which opportunity or by whom. On a platform whose
users are minors that is the whole design, so it is enforced rather than
described: one test fails if an identifying column is added, another if any code
writes one, and a third proves the stored route is the template and not a
resolved id. Three traps surfaced en route — Alembic autogenerate inventing a
foreign key, a route-template lookup that silently matched nothing because
FastAPI wraps included routers, and an exclusion list that could never match
while its own test passed *vacuously*.

**Sentry went in switched off, and the test that mattered was about wiring, not
correctness.** A scrubber that is never passed to `init()` leaves every
unit test green while real events ship unscrubbed, so the suite asserts the live
client's options. That test caught a failure nothing else would have: the
integration imports a templating module that needs `jinja2`, so with a real DSN
the app would have crashed at boot — in production, and nowhere else.

**The SWR migration reached 11 of 22 pages and found the same bug six times.**
Pages that fetched without a `.catch` fell through to their empty state on
failure: *no bookmarks, no messages, no notifications, no hours awaiting
verification, no verified hours yet*. Each was a lie told to a user whose data
existed. The shared hook makes it structurally impossible — `loading` stays true
until auth resolves, and client errors are never retried.

**The sixth instance was found by a mechanism, not by the author.** A
`/landing-check` sweep re-derived the page census and got a different number:
the original grep looked for `api.` and one page wrote `api` with the method on
the next line, so it never matched and looked converted. The same sweep caught a
blocking CI job already red on an inherited advisory, and two documents
contradicting themselves about whether Sentry was wired. That is the tenth run
of that sweep and the ratio holds: no mislandings, every planted control fired,
and the errors were all in the account of the work rather than the work.

**Left open honestly:** four pages plus four components remain unconverted, with
`hours` singled out because its load begins with a write and would re-fire on
every revalidation; the two guardian-consent token pages are deliberately
excluded. M14.2 needs its own counter — shipping M14.1 falsified the PRD's plan
for it, since template-level counts cannot answer per-opportunity questions.

---

## II.34 — a pre-mortem, a fallback audit, and two guards that could not fire (2026-09-01)

**The pre-mortem asked the question the roadmap could not.** Imagining the soft
launch had failed fourteen days in produced eighteen risks, and one pattern
organised them: **every launch-blocking risk fails silently** — the guardian
email that never sends, the proxy variable left at its default, the retention
cron nobody scheduled, the backup nobody restored, the monitoring nobody turned
on, the support inbox nobody reads. None produces an error, a red build, or a
failing test. A launch checklist that looks for errors passes while all seven
are live.

The uncomfortable half was the elephants. Evan is seventeen and the Terms still
carry an unfilled legal-entity placeholder, so launching with real minors puts
personal liability on a minor. There is one operator, in school, and the breach
runbook's first step names a responsible adult identified nowhere in the
documentation. And the question nobody had written down: **the stated goal is a
college-application portfolio where the process is the product — does that
require real minors at all?** A deployed application exercised by invited adult
testers might satisfy it while creating none of the ongoing duty of care, and it
is the cheapest available mitigation for four of the seven blocking risks. The
recommendation on record is that no launch date be set until an adult answers
that.

**The fallback audit turned the same lens on the code.** Seven cold workers
swept every place the code decides what to do when something is missing,
invalid, or failed. What it found is this project's oldest pattern, still alive:
a correct decision applied at one site and not at its structural twins, five
times, in five unrelated subsystems — twice in code written that same morning.

The worst was in the privacy mechanism itself. `scrub_event` strips personal
data from error reports before they leave for a third party, and it dropped the
request URL for a stated reason: a guardian's permanent revoke token rides in
the URL path. That reasoning was applied to exactly one field. Exception
messages and breadcrumb URLs — structurally identical, just as likely to carry
the same token — went through untouched. Elsewhere the guardian manage token
skipped the two guards its own documentation calls load-bearing at two of four
callers, so a years-old link could still revoke consent for someone who had
since become an adult and pull them off every roster.

**Then the fix contained the same class of bug as the thing it fixed.** The new
redaction pattern was written with a word-boundary escape that landed in the
file as a literal backspace character, so the regex required an unprintable byte
on both sides and could never match anything. It read as protection and was not.
`grep` could not reveal it, because the byte does not render; only printing the
compiled pattern exposed it, and only because the original reproduction was run
again instead of the edit being trusted. The record entry written to explain
that bug then contained the same byte, in the same way, and was found by the
landing-check that followed.

**The landing-check's verdict is the entry's point.** Every new guard fired when
its positive was planted. What had not landed was the documentation: seven
documents still described the boot guard as it was before the change, one
runbook instructed operators to set a variable *after* a deploy that the same
variable now prevents, and another said "no error is raised either way" about a
condition that had just become fatal. The code was right and the account of it
was wrong — the tenth consecutive time that sweep has returned that shape.

---

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

## II.35 — scheduled daily-audit: the MANAGE-token HIGH is still open, and the audit's own repo-scope premise was wrong (2026-09-01, ~20:14 CDT)

**Audit run — 3 findings, top: II.30's guardian MANAGE token (no expiry, rides in the URL path)
is still unfixed on disk, correctly logged as pending Evan's call rather than silently dropped.**

Cold, read-only, budget-constrained (single agent, no fan-out).

## II.35.1 Findings
1. **HIGH, still open.** `backend/app/models/user.py:96-98` and
   `backend/app/api/routes/consent.py:203,293,304,319,345-390` — the token is still permanent,
   multi-use, and carried in the URL path. The model comment now calls this deliberate
   ("see FINDING 1, 2026-08-25 audit") and `consent.py:355` still reads "the manage token never
   expires and never rotates." Unlike II.29, this non-fix is *documented* as a pending launch-gate
   decision. It remains live risk on a platform holding minors' data.
   **BLOCKED-ON-EVAN:** expire+rotate, or accept and record the acceptance.
2. **MEDIUM, process.** `servelocal-v2` carries **12 modified, uncommitted files** (HANDOFF.md,
   PRD_ROADMAP.md, docs/record_2026-07-16.md, backend/.env.example, docs/API_KEYS.md,
   docs/DEPLOY.md, docs/DEPLOY_RAILWAY.md, frontend/app/{applicants,portfolio}/page.tsx,
   frontend/lib/types.ts, 2 codebase-memory bins). Separately, the **root** repo's chronological
   record .md/.html twin has not been committed since **2026-08-18** — ~14 days of uncommitted
   narrative, the exact pattern II.29 flagged in itself. Fix: commit both sets.
3. **Correction to the audit's own premise.** The sweep classified this project using
   `ServeLocal/.git`, which does **not track `servelocal-v2/` at all** (nested repo, no submodule
   wiring). The active repo has commits through today (`6310e35`, 2026-09-01, "Fallback audit
   fixes"). II.31–II.33's code work was never stranded. Any future sweep must read
   `servelocal-v2/.git`, not the root.

## II.35.2 Verified HEALTHY by running it
- `pytest -q` → **354 passed in 153.20s**, matching HANDOFF's claimed count exactly.
- `pytest tests/test_role_guards.py -v` → **5 passed in 2.95s**.
- II.31's role-guard consolidation is real and complete: `require_student`/`require_org` are
  single definitions from one `_role_guard` factory (`backend/app/api/deps.py:67-68`), used at
  6 decorator sites plus 13 `Depends(require_org)` sites. `backend/tests/test_role_guards.py`
  exists, its docstring narrates the real 2026-08-31 near-miss, and it covers all 6 role-gated
  routes plus /apply's bespoke copy and the two relationship-gated messaging routes.
- No personal data or token values were printed at any point in this audit.

## II.35.3 Not checked
`core.hooksPath` configuration in the root repo; the frontend suite (only backend pytest ran);
whether II.34's "2 of 4 callers" manage-token guard fix is itself complete; public-mirror sync
status ("20 commits behind" per the uncommitted HANDOFF diff).

## II.36 — the config object printed every secret when it printed itself, and the fix sat green and unlanded (2026-09-02, ~16:29 CDT)

**Three layers closed a credential-exposure path in the backend config. The
entry that had described this bug the day before named the wrong cause, and the
finished fix then sat uncommitted for a day — the same shape II.35 had just
flagged, repeated by the session that read it.**

**The defect.** `repr(Settings(...))` returned every field value in plain text:
853 characters covering `SECRET_KEY`, both Stripe secrets, `RESEND_API_KEY`,
`TURNSTILE_SECRET_KEY`, `SENTRY_DSN`, and the password embedded in
`DATABASE_URL`. It was not a hypothetical string — during reproduction the
rendered value carried the real `sk_test_…` key out of the gitignored
`backend/.env`.

**The correction comes first, because it is the reusable part.** The
`security.md` bin entry written on 2026-09-01 said an `AttributeError` on
`Settings` renders every value. It does not. The message is exactly
`'Settings' object has no attribute 'X'` and contains nothing else. That entry
had been written from a sweep finding without running it. The first action of
this task was to reproduce the claim, which failed immediately — and the real
mechanism turned out to be worse than the recorded one, not milder. **A finding
recorded without reproduction is not a finding; it is a guess with a citation
format.** Eleventh consecutive sweep in which the code and the account of the
code disagreed.

**Why three layers and not one.** Each covers a shape the others structurally
cannot reach:

- **`Field(repr=False)` on 8 secret-bearing fields** (`backend/app/core/config.py`).
  Values stay plain `str`, so every read site is untouched — only rendering
  changes. `SecretStr` was the obvious alternative and was rejected on
  measurement: 12 of the 33 `monkeypatch.setattr` sites in the suite would
  silently install a bare `str` into a `SecretStr` field, producing tests that
  pass while asserting against the wrong type.
- **Frame-variable scrubbing** (`backend/app/core/observability.py`). Sentry
  collects stack-frame locals by default and writes real values to
  `exception.values[].stacktrace.frames[].vars`. Neither the project's scrubber
  nor Sentry's own reached that path. A dict local arrives as a genuine nested
  dict, so key-name filtering works there — where it cannot work on a repr,
  because **a repr is a string and a string has no keys to match.** That is the
  precise reason field masking is not redundant with frame scrubbing.
- **`include_local_variables=False`** — the chokepoint. It is the only layer
  that reaches the three frames *inside httpx* that bind the Turnstile secret as
  a `data=` parameter. Measured: the secret appeared in four frames, one of them
  ours. Rewriting `turnstile.py`, the intuitive fix at the reported call site,
  would have closed one frame of four and read as complete.

**What was deliberately left open, in-code.** The masking does not cover
`model_dump()` / `model_dump_json()`, which still return plaintext; there are
zero callers of either on settings today and no route returns `Settings`. The
key filter deliberately omits `"s"` — redacting every one-letter local in every
frame is not defensible, and that gap is the stated reason the other two layers
exist. Both are written into the source, not just here.

**VERIFY.** `pytest -q` with `ENVIRONMENT=ci` → **360 passed in 54.35s**.
`ruff check` → all checks passed; `ruff format --check` → 116 files already
formatted. Secret scanner on commit → 0 findings. `repr(settings)` is now 499
characters with no key material. Committed as `3e0ff52` in `servelocal-v2`,
8 files, 449 insertions.

**The process failure, which is the larger one.** The fix above was complete,
green, and **uncommitted** — code and its own record entry and HANDOFF update all
sitting in the working tree together, so the docs and the code would have been
lost as a unit. II.35 had flagged exactly this pattern the previous day, in this
same repo, and the flag did not prevent the recurrence; a human instruction at
the start of the next session did. **A finding that names a risk does not reduce
it. Only a mechanism does, and there is no mechanism here** — nothing fails when
green work goes unlanded, which is precisely why it keeps happening.

This record was itself the proof: last committed **2026-08-18** (`202200e`), it
carried **seven unlanded entries** — II.29 through II.35, 391 lines — for
**15 days**, in a repo whose remote nothing routinely pushes to, so no external
signal existed to notice. Both sets are committed as of this entry.

**BLOCKED-ON-EVAN.** The real test-mode Stripe key rendered into agent output
during reproduction. It is test-mode, gitignored, and was never committed;
whether to rotate it is Evan's call and is not worked around here.

**Known open, unchanged by this entry.** The table of contents above stops at
II.26 — entries II.27 through II.36 have no TOC line. Not a broken anchor (the
renderer's `broken:` count is unaffected), but the TOC no longer describes the
document.

**Two in-place corrections were reverted to land this, and that is a tradeoff,
not a cleanup.** The append-only guard
(`~/.claude/skills/project-memory/hooks/pre-commit-record`, shared by six repos)
blocked this commit: a previous session had corrected two committed claims *in
place* — the 2026-07-13 snapshot's "M13.6 SWR skipped" gained a `[REVERSED
2026-08-31 (II.32)]` marker, and the "What's not in this record" bullet saying
this repo "stays LOCAL — no remote" was rewritten to say it IS pushed to a
private remote. Both annotations preserved the original wording and both were
factually right. The guard is line-based, so it cannot tell an annotation that
keeps the original from an overwrite that destroys it, and it correctly refused
all five modified lines.

**Resolved by restoring the five lines to their committed bytes** (Evan's call,
2026-09-02). Nothing factual is lost: II.29 states the private-remote finding
and II.32 states the SWR reversal, and both entries land in this same commit.
What *is* lost is the forward-pointer — a reader who encounters "stays LOCAL" in
the 2026-07-09 material now gets no marker there that it is stale, and must
reach II.29 to learn it. **A pure mid-file insertion passes the guard; only
modifying an existing line fails it**, which is why the other II.29 annotation
(at the 2026-07-09 entry) survives untouched and these two did not.

The real fix is a guard that permits annotate-in-place when the original text is
retained as a substring. That is a change to a hook executing for six repos and
does not belong inside a record commit. **Not done; open.**


## II.37 — a both-domains audit: the checks verified shape, not truth (2026-09-02, ~18:14 CDT)

**Cold `/audit` across `servelocal-v2` (293 tracked files) and this root repo (6),
seven Sonnet workers under a reconciled file manifest, then the approved fixes.
27 findings. 364 pytest green on SQLite AND on real Postgres 16.**

**The pattern is the finding.** Every mechanism this project built to catch a
defect class works exactly as specified — and the defects live in the prose those
mechanisms accept without checking. Five independent instances:

- The consent-gate guard fails the build when a write route carries no consent
  decision. An entry is a route tuple plus a free-text comment, and **nothing
  tests the comment.** Its comment on `DELETE /apply` said the route reaches "no
  organization"; `consent.py` says the row exists precisely so "the organization
  retains its record". That false premise is what made the day's worst bug
  reachable.
- **This document's own renderer** checks `hrefs - ids` and never `ids - hrefs`,
  so `broken: 0` printed on every commit while **ten entries — II.27 through
  II.36 — were unreachable from the table of contents.** Fixed here: internal
  links 36 → 46.
- The codebase-memory `Last updated` header is documented as the single freshness
  signal; six of twelve headers were older than dated content inside their own
  file.
- The frontend gate is lint + build, which structurally cannot distinguish an
  empty state from a failed one.
- Migration 0025 justified dropping a foreign key by citing a "documented
  convention" that **does not exist** — grep for "reflect" across every bin
  returns zero.

**Two highs, both reproduced rather than reasoned about.** A guardian-revoked
minor could permanently delete the organization's roster record that the revoke
flow deliberately preserves: `withdraw_application` selected the caller's row with
no status filter and deleted it unconditionally. Revoke flips `consent_blocks`,
not `is_active`, so the minor's token still worked. Observed end to end before the
fix — revoke, organization sees one `withdrawn` row, minor calls DELETE, 204,
organization sees nothing. And the **public landing page** showed a permanent
loading ellipsis on any backend failure: no error, no retry, on the first page a
launch visitor sees. Verified in a browser against a genuinely stopped backend.

**Docker returned mid-task and turned one verdict from inference into proof.** The
claim was that `messages.recipient_id` is a foreign key in the ORM, free in the
test suite because it builds the schema with `create_all`, and **absent from every
migration** — so production has no referential integrity and no test can ever
notice. On real Postgres at revision 0025, `\d messages` showed foreign keys on
two columns and none on `recipient_id`. Migration 0026 adds it, named so the
downgrade works, verified up/down/up on both engines. A first attempt to run the
suite "against Postgres" was still silently on SQLite because `conftest.py` keys
on `TEST_DATABASE_URL`, not `DATABASE_URL` — caught by reading the fixture rather
than trusting the run.

**A dependency this repo executes on every commit had no manifest.** The
pre-commit hook runs `render_record_html.py`, which imports `markdown` and fails
CLOSED. The version was whatever sat on the developer's ambient PATH, with no
requirements file anywhere in this repo to pin or roll back to. Now pinned at
`scripts/requirements.txt`. The specific risk is quiet: an upstream change to the
`toc` extension's slug generation would not fail the render, it would silently
mint different anchor ids — and the render's own check cannot see that, which is
the same blind spot that hid the missing TOC entries.

**The audit's own errors are recorded because the method is the point.** Two of
seven shard counts handed to workers were wrong, and both were caught by the
workers rather than by the orchestrator. A relative-churn ranking computed every
ratio as `0.00` because `bc` is not installed, so the first targeting list was
silently ordered by absolute churn — the weak signal, R²=0.052 against 0.811.

**VERIFY.** 364 pytest on SQLite and on Postgres 16. ruff clean; tsc exit 0;
eslint 0 errors; `npm run build` clean. This document: internal links 46, heading
ids 63, `broken: 0`; the append-only guard passes, the TOC additions being a pure
insertion. `servelocal-v2` committed as `71c8fbd` (34 files).

**BLOCKED-ON-EVAN.** Splitting `security.md` (316 lines against a ~150 cap);
whether to move a real account export out of the repo tree; a LICENSE choice for a
repo with a public mirror; and whether the consent allowlist should carry
assertions instead of comments — the last being the one that stops the pattern
above from recurring.


## II.38 — the landing-check on II.37's own work: every guard fired, and three of the claims were wrong (2026-09-02, ~19:34 CDT)

**A fresh agent, given the artifacts and deliberately NOT the author's account of
them, swept the seven unpushed commits from II.37. Verdict on the work: it lands.
Verdict on the prose about it: three false claims, all the author's.**

**The work was verified by ACTIVATION, not by reading.** This is the distinction
the whole sweep exists for. A guard that is present in a diff and a guard that
fires are different facts, and only one of them is protection. So: the new 409 in
`withdraw_application` was fired with its planted positive, and its negative twin
confirmed an ordinary withdrawal still returns 204 — a guard that blocked the
normal path would have been worse than the bug it closed. Both `opp.active`
guards fired. Both Dockerfiles' `USER` directives were reproduced by building and
running the images (uid 10001, uid 1000) rather than trusted as text, because a
`USER` line that breaks a container reads identically in a diff. Migration 0026's
foreign key was watched through its full cycle on Postgres — absent at 0025,
present at 0026, absent after downgrade.

**The three false claims.** The commit message for the audit fixes said five
codebase-memory headers were stale; the real number is six, and the record entry
*inside that same commit* says six — so the commit contradicted itself. The cause
is worth more than the number: one bin was fixed in an earlier step and the other
five by a script, and the message counted the script's batch. HANDOFF asserted "46
internal links" — true when it was written at 18:14 and false nine minutes later,
when II.37 landed in this repo and added its own TOC row. Neither repo's tooling
could have caught that: the claim lives in one repo and the number is a property
of the other. And a twelfth bin, `disclosure.md`, was carrying day-old content
under a stale header — missed by the very sweep that fixed six of its siblings,
because that scan matched the literal string `Last updated` and this file spells
the field differently.

**That last one is the audit's own pattern, turned on the audit.** The scan
verified the form it expected rather than the thing it was for, which is exactly
what II.37 said about the consent allowlist, the record renderer and the frontend
gate. A check keyed to one spelling of a convention cannot see a file that spells
it another way — and it reports clean while doing so.

**The correction was deliberately made forward rather than by amending.** The bad
commit was still unpushed, so amending was available and would have produced a
tidier history. It was refused: II.37, already committed here and append-only,
cites that commit by SHA, and amending would have rewritten the SHA and broken a
cross-repo reference that cannot be edited. A wrong number in a commit message is
the smaller and more honest error.

**The verifier itself broke something and reported it against itself** — it
deleted the project's dev-Postgres container while checking the migration claims,
violating its own governing rule. Recovered: the named volume survived, the
container was recreated, and the schema and revision state were confirmed intact.
"No rows were lost" was specifically NOT claimed, because no pre-deletion count
existed to compare against.

**VERIFY.** Re-derived at 19:34 CDT: internal links 47, heading ids 64,
`broken: 0`, render idempotent. Six stale bins re-derived by reconstructing each
file's pre-fix state. Corrections committed to `servelocal-v2` as `9d686c6`.
Nothing is pushed: a guard blocks model-initiated pushes because a bare push
publishes a whole branch, and two of the five v2 commits predate this session.


## II.39 — M14.1's other half, and the dev database that could not have served it (2026-09-02, ~23:13 CDT)

**The analytics endpoint shipped on 2026-09-01 with seven tests and zero callers.**
M14.1's own task text asked for "a dashboard section on the existing admin screen";
the backend was built, the four done-checks it listed were all backend checks, and the
frontend half was simply never written. The milestone read DONE for a day, was
corrected to PARTIAL on 2026-09-02, and is now genuinely done: `/admin` reads
`GET /analytics/traffic` behind a 7/30/90-day window selector, with a zero-filled
per-day column strip and a table of the top fifteen routes.

**A milestone can pass every check it wrote for itself and still be half-built.** That
is the same shape this project has been finding all week — a gate that verifies the
form it measures and is silent about the rest. Here the done-check list was the
artifact at fault: four items, all backend, for a task whose own sentence named a
frontend deliverable.

**The dev database could not have served the feature, and only running it revealed
that.** The local SQLite stack is the project's sole browser-verification path, and it
held ten tables with no `route_hits` and no `alembic_version` — built by `create_all`
before migration 0025 existed. The endpoint would have returned a server error against
it. Running `alembic upgrade head` would have been the wrong repair: with no version
row it replays from the first migration. The single table was created from model
metadata instead. **No test could have caught this**, because the test fixture builds a
fresh schema from the current models every run; only the persistent database was
behind, and nothing in the suite ever looks at it.

**Two design calls, both Evan's, both reducing what gets added.** The day columns are
CSS divs rather than a charting library: no new dependency, nothing further for the
nonce-CSP to admit, and no motion to exempt from the reduced-motion rule. The columns
run vertically because ninety stacked horizontal rows would be roughly thirteen hundred
pixels tall while ninety columns fit a single strip.

**The wording is a privacy constraint rather than a style preference.** The counter
table has no user, no address, no session and no opportunity column, and the published
privacy policy tells the public these are request counts and nothing else. So the
section says *requests* and never *visitors*, *users* or *views*, and both new types
carry that reasoning in a comment so a later session does not relabel a column on
instinct.

**Verified against a stopped backend, which is the check that matters here.** With the
page open and the API killed, the tile reads an em dash rather than zero, the error
panel and its retry control appear, the table and the bars vanish, and the "no
requests" empty-state copy is correctly withheld — a failure must never be able to
impersonate an empty result. Restarting recovered the page without a reload. The
static gate held its exact baseline of zero errors and eleven warnings; a new warning
would have counted as a regression rather than an acceptable cost.

**Stated rather than glossed:** the empty-window state cannot be reached today, since
loading the admin page generates requests on the very day it queries, so that branch
was reviewed and not executed. And the client-side proof that a non-admin never sends
the request rests on the redirect, the absent section and the held query key, because
the browser's network log is cumulative and could not evidence the negative directly;
the server returns a forbidden response to a student regardless.

**VERIFY.** Committed to `servelocal-v2` as `578ad70` (9 files). Lint 0 errors / 11
warnings, unchanged; production build clean; TypeScript clean; 364 backend tests pass.
Status propagated to every live copy in the same commit, with the grep gate for the
superseded wording returning only the dated historical note, which now carries its own
closed line.


## II.40 — M14 closes by deleting a claim, not by building one (2026-09-03, ~19:17 CDT)

**The org dashboard's Analytics tab now shows real numbers, and the pricing page
advertises one fewer thing than it did this morning. Both halves were the milestone.**

**Two of the three numbers on that tab were wrong, and had been for weeks.** Everything
was computed in the browser from lists fetched for other tabs. "Applicants" counted
every application, including the ones the organization had rejected and the ones a
guardian had withdrawn. "Spots filled" subtracted remaining spots from total spots — and
the backend only maintains remaining spots for one-time listings, because a recurring
event tracks capacity per date. So every recurring listing showed a fabricated fill
figure to the organization running it. Neither number was a lie anyone told; both were
what happens when a display is derived from whatever data the page already had.

**The milestone's own done-check is what made this interesting.** It required that any
metric which cannot be computed honestly be dropped *from the tab and from the pricing
copy*, rather than faked. The pricing page sold "views, fill rates, retention". Views
and fill rate were buildable. **Retention was not.** Nothing in this schema distinguishes
a volunteer who chose to come back from one who simply appears twice, beyond what
"applied to two of our listings" can say — and that is not retention. So the word was
deleted from the pricing page. What ships is the honest, narrower thing it was standing
in for: a count of students with approved signups to two or more of that organization's
listings, labelled as exactly that.

Fill rate got the same treatment at smaller scale. Rather than print a percentage that
means nothing for a recurring listing, the tab shows one only where it is meaningful and
otherwise says so in words.

**Deleting a marketing claim to make a document true is the part worth keeping.** The
project's own disclosure notes had carried this as an open defect for weeks — "copy that
outruns the code is a disclosure defect, not a marketing one." It closed from both ends
at once: two metrics built, one claim removed. The same pass found that analytics was
listed as a paid Pro feature in both the pricing page and the Terms while shipping free
to every organization, and cut it from both.

**The privacy policy needed a sentence and got one.** It promised that aggregate counts
"cannot show what any individual person looked at" — true, and written when the only
counts were site-wide. It did not say an organization can see totals for its own
listings. Shipping the feature without that sentence would have left a live policy
incomplete, so the counters paragraph now says it plainly and on the same terms.

**A counter that could not have worked, caught by a test that asserted a number.** The
new per-listing view counter first opened a database session that binds to the real
configured database, so under test it reached for Postgres while the suite runs on
SQLite. The project's own test configuration already carried the warning, written months
earlier for the site-wide counter: without redirecting that session, the counters would
quietly aim at the wrong database and every analytics assertion would silently test
nothing. **The tests failed loudly instead — because they assert a specific count rather
than merely that the code ran.** The repair moved the session inside the service, so
future counters have one place to redirect rather than one per route that counts.

**What the organization cannot see.** The returning-volunteer figure is a count and
never names. An organization can already see its own applicants, so the risk here was
never the names themselves but the linkage across listings; a list would have created a
fourth place this platform publishes student data, beside the leaderboard, the portfolio
and the applicant lists, where the standing rule is that a change to one is a change to
all three. A test serialises the entire response and fails if any student identifier
appears in it, which is what will make a future "just add the names" change loud.

**VERIFY.** 376 backend tests green (364 before, 12 added); lint held its exact baseline;
build and type-check clean. Against the live local stack: three anonymous views counted
and two views by the listing's own organization correctly not counted. With the backend
stopped, the tab shows its error panel and Retry, with no tiles, no table, and — the
point — not the "post a listing" empty message, so a failure cannot impersonate having
no data. A student gets 403, an anonymous request 401. Committed to `servelocal-v2` as
`cf4e09f`.


## II.41 — the guard that now checks its own reasons, and a licence that would not have reached its readers (2026-09-03, ~19:30 CDT)

**Four standing decisions cleared at once, and the one that matters is the smallest to
describe: a test that verified a decision had been made now verifies part of what the
decision says.**

**The consent-gate coverage test was already a real mechanism.** It fails the build when
a new write route carries no decision about the guardian-consent gate, and it exists
because that gate had been missed three separate times, each caught only by a human
happening to read the right file. But an entry in its allowlist was a route plus a
free-text comment, and **nothing checked the comment**. The September audit measured what
that costs: one route was exempted on the written grounds that it reaches "no
organization", while the very function that creates its rows says they are kept precisely
so the organization retains its record. A guardian-revoked minor could delete the
organization's evidence, and the mechanism built to catch that class of error had approved
it in writing.

Every entry now carries a *kind*, and the kinds a machine can check are checked against
the running application: a route claiming to be organization-only must actually depend on
the organization guard; one claiming to need no authentication must not require a user.
**No test can make prose true.** What this does is reduce the unverifiable remainder to a
single named entry, with a second test that fails if that number grows — so unexamined
prose cannot quietly become the default again.

**The new test's first run found two things, and the first was about the test.** Matching
dependencies by name reported every organization route as unguarded, because the role
guards are closures produced by one factory and are therefore all literally named "guard".
Comparing function identity instead fixes that and, unlike the name check, can tell two
roles apart at all. Five routes then failed honestly: they check role *and* ownership
together inside the handler, which no role-only dependency can express. They are now
classified as exactly that, asserting what is true of them and stating plainly what the
test cannot see.

**The guard was watched firing before it was trusted.** A deliberately false
classification was planted on a route — the same class of false claim the audit had found
— and the test failed on it. A control never observed firing is unverified, whatever its
code says.

**A split reported with its real number.** The security notes had reached 316 lines
against a documented cap of about 150. The guardian-consent material moved verbatim into
its own file, and a line-by-line check confirms nothing was lost. The result is 227 and
113 — **and 227 is still over the cap.** Saying so is the point: closing the remaining gap
means moving the audit-log material as well, and where that belongs is a judgement about
boundaries worth making deliberately rather than as a side effect of this one.

**A licence nobody would have read.** The project had none, which legally means all rights
reserved but says so to no one — a real problem for a repository whose whole purpose is a
public mirror people are invited to read. One was written, retaining rights and explaining
why in the file itself: this is an operable service that handles the personal data of
minors, and an unmodified third-party deployment would collect that data from real
children under someone else's control. Then a check found the gap that would have made the
whole exercise pointless: **the mirror script copies only two root files, and the licence
was not one of them.** It is now on that list. Nothing was published; a sync remains a
separate and deliberate act.

**And a real export left the tree.** A file holding one person's email, full name and date
of birth had been sitting in the repository's documentation folder, protected only by an
ignore rule. It moved outside every repository in the container. An ignore rule is a good
backstop and a poor primary control: a single forcing flag walks straight past it, and the
file sat in a directory the mirror script reads.

**VERIFY.** 378 backend tests green; linting and formatting clean; the frontend gate held
its exact baseline. The split preserved 290 of 290 non-blank lines. The planted false
classification failed the test and was reverted to zero occurrences. Committed to
`servelocal-v2` as `b6a57b8`.

**Left undone on purpose:** rotating a test-mode payment key, which needs an account only
Evan holds. It is reported, not worked around.


## II.42 — the snapshot had become a changelog, and the check that saved it was not the one in the plan (2026-09-03, ~20:07 CDT)

**`HANDOFF.md` is defined as the project's only live snapshot and is the first file any
cold session reads. It had become a changelog: 590 lines, of which 432 — 73% — were
fourteen dated narrative entries, five of them added the same day. Rewritten to 255.**

**The drift is worth naming because it is what a well-intentioned rule produces.** The
documentation system says to update the snapshot every session, and the honest way to do
that looks like appending what changed. Do it fourteen times and the snapshot becomes a
second, worse copy of the record — worse because it is unordered, undated at the section
level, and read first by every session that needs to know what is true *now*. Nobody
decided to make it a changelog; it accreted one entry at a time.

**The deletion was gated, and the gate is the only reason it was safe.** This file is not
append-only — the chronological record is — so trimming it is legitimate *if and only if*
nothing in the trimmed region exists solely there. Every distinct entry date was checked
against the record's own headings before anything was cut: nine dates, none missing. One
appeared orphaned, and that turned out to be the checking script being wrong rather than a
real gap — the entry was dated one day and merely mentioned another in its body.

**Then the verification step caught what the plan itself had missed.** The plan required
grepping for anything that *pointed into* the region being removed, separately from
checking whether its prose survived elsewhere. That grep found a per-milestone status
table sitting immediately after the narrative pile — inside the range marked for deletion,
and referenced by four other documents including the project's own definition of done,
which instructs every session to update it. Its prose existed nowhere else. It was
restored, with a note recording that it is not history, so a future rewrite does not
repeat the mistake.

**That is the transferable part.** Twice in one day a *structural* documentation change
broke something no *content* check could have seen. Whether the words survive somewhere
else is the wrong question when deleting a region of a document; the right one is who
points into it.

**Re-deriving rather than copying caught a stale number.** The plan forbade carrying
figures over from the old file. Recomputing them from disk showed the client-side data
migration standing at twelve of twenty-two pages rather than eleven — a page had been
converted hours earlier as a side effect of other work, and four separate places still
said eleven. Two more places described the roadmap by a milestone range that stopped being
true when a milestone closed that morning.

**The file also, finally, ends with a handoff prompt** — a paste-ready block giving the
next session its read order, the current state in a paragraph, the constraints that
actually bite on this machine, and the next actions in priority order. The documentation
system has required one from the beginning; the file contained no fenced block at all.

**VERIFY.** 590 to 255 lines. Nine entry dates removed, none lacking record coverage.
Seven section headings became nine, the two apparent losses being deliberate re-datings of
the current-state and blocked-on-Evan headings. Status table restored at twenty-eight
rows. Zero carriage returns and zero control bytes. Backend suite green at 378, unmoved by
a change to prose. Committed to `servelocal-v2` as `56c18e1`.

## II.43 — both cap decisions closed: one section compressed, one cap raised for every project (2026-09-03, ~20:22 CDT)

II.41 ended with two questions that were Evan's to answer, not mine: whether to compress a
*fixed* security incident down to its durable facts, and whether a cap that the prescribed bin
set makes unreachable should be raised for every project. He answered both, and both landed.

**`security.md` 183 → 150 lines.** The 47-line `repr(Settings)` section became 13. Four facts
stayed — secrets must never render in a repr (853 characters, a real `sk_test_…` key); the two
carriers (Sentry stack-frame locals, live; `monkeypatch.setattr`'s `!r`, latent at 33 sites);
why the fix needed three layers rather than one (an object serializes into a repr STRING with
no keys to match, a dict stays a dict with no repr to mask, and no single tool covers both);
and that layer 3 alone reaches the three httpx frames binding the Turnstile secret, so
re-enabling frame locals silently reopens part of the hole. The narrative, the wrong-cause
correction, and the `SecretStr` rejection moved to a pointer — after confirming they were
already in the day-file record entry, not on the assumption that they were.

**150 is AT the cap, not under it.** The plan said 149. Getting under would have meant deleting
the knowingly-exposed bullet (`model_dump*()` still returns plaintext; Sentry `context_line`
shows source text), and that bullet is a live trigger condition for revisiting `SecretStr`, not
history. So the file sits exactly at ~150 and the number is stated rather than rounded down.

**The INDEX cap went 25 → 75, globally.** Two lines in the `project-memory` skill, plus the
dated reason written beside the number so the next reader does not have to re-derive it. This
relaxes the standard; it does not resolve the conflict II.41 found — 15 prescribed bins force
15 routing lines before a single invariant, and 75 simply moves the line beyond where the
arithmetic bites. Recorded plainly because a cap raised without its reason is how the previous
one became a permanently violated number nobody read. **Blast radius checked rather than
assumed:** Trading's INDEX is 22 lines over 10 bins and was already compliant, so v2 is the
only project whose memory system this touches.

## II.44 — two pages that showed the wrong screen on failure, and a legal packet whose value is that it concludes nothing (2026-09-03, ~20:33 CDT)

Two unrelated pieces of M11-adjacent work in one sitting, plus the finding that the project's
own highest-value check can be defeated by a cache.

**M13.6 SWR, 12 → 14 of 22.** `portfolio/[id]` and `opportunities/[id]`. Neither was converted
for consistency; each was rendering a false screen. The portfolio page caught *every* failure
into one "this portfolio is private or doesn't exist" state, so a dropped connection accused a
student of having opted out. The opportunity page had no loading state at all and shared one
error string between the page load and the Feature toggle, so either cleared the other. The
4xx/other split uses `error instanceof ApiError` rather than reading `error.status`, because a
network failure throws a raw `TypeError`: the typed cast in `use-api.ts` would have let
`error.status` typecheck while being `undefined` at runtime — the quiet version of the bug
being fixed.

**The standing check silently passed against a stopped server.** "Load a page, stop the
backend, press Retry" is this project's single highest-value check because the frontend has no
test runner. Run on an already-visited URL it proves nothing: the browser HTTP cache replayed
the public-portfolio response and the network log showed `200 OK` from a server that `curl`
could not reach. The check is only meaningful on a URL the browser has never fetched. Redone
that way, both error panels appeared as designed, and the Retry button was separately proven to
dispatch — an earlier recovery had come from SWR's own reconnect revalidation, which would have
credited the button for something it did not do.

**The legal packet (`servelocal-v2/docs/LEGAL_REVIEW_PACKET.md`) answers nothing, deliberately.**
M11 Phase 1 is the launch critical path and is not the model's to close. What the model can do
is make the review possible: the routing decision (RED, escalation forced by matter type at
every score), the deterministic `cite-scan` output verbatim, and a claim-by-claim table mapping
each promise in the public Terms and Privacy Policy to the code that does or does not keep it.
That table is where the value is. It surfaces that the policy's 12-month audit-retention
promise is currently kept by hand because nothing schedules the purge, that account deletion is
anonymize-in-place rather than removal, and that a sentence about organization-level totals was
added the same day and the reviewer has never seen it. One scanner finding — a missing
not-legal-advice disclaimer — is reported as a judgment call rather than quietly fixed, because
suppressing a finding to make a report look clean is how a real one gets lost.

## II.45 — a pre-mortem on the whole project, whose top risk is that two of our own documents disagree (2026-09-03, ~22:14 CDT)

The 2026-09-01 pre-mortem stress-tested the M11 launch. This one, at Evan's direction,
stress-tested the project — the app, the launch, and the reason the project exists — looking
back from 2027-01-01 with applications submitted. **14 risks: 7 Tigers (5 launch-blocking),
3 Paper Tigers, 4 Elephants, 3 flagged for escalation.**

**The top finding is not in the code. Two live documents disagree about whether this project
should be building toward a launch at all.** `EVAN_CONTEXT.md`, compiled 2026-07-22 from
Evan's own interview answers, says ServeLocal is on hold until 18 for legal reasons and ranks
it third of three projects. `HANDOFF.md` and `PRD_ROADMAP.md` say the finish line is a real
public launch, decided 2026-07-08, and that M11 is the frontier. The context file is the
newer document and it says stop. Seven weeks of work has assumed the older one, and neither
document references the other. A related blank: Evan's 18th birthday appears in no project
document, and it is the single fact that decides person-versus-entity — recorded as UNKNOWN
rather than estimated.

**The third escalation is about the work this same session produced.** On 2026-09-01 the
pre-mortem raised two questions for a responsible adult. On 2026-09-03 the session wrote a
legal review packet — a better-formed version of the same ask — and sent it to nobody. A
model can always generate the next artifact for a blocked step; each is individually good
work, and the pile feels like progress while the blocked thing does not move. It is written
into the register against our own output on purpose.

**None of the five blocking Tigers is about the code**, which is the point of running the
exercise at project scope. The public mirror is 15 days stale and still ships a bug the
private tree fixed — an artifact publishing a defect the project already closed. The mirror
carries no backend at all, so a reader sees a Next.js frontend and prose about the FastAPI
service that is most of the engineering. There are 9,295 lines of record behind a 33-line
README and no case study, which means the project's own thesis — that the documented process
is the product — is currently unreadable in the time anyone will give it. The remaining two
are money and time: a $0 spend ceiling against a launch that needs a domain and a host, and a
priority order in which ServeLocal sits third while the flagship has a late-September
deadline, both drawing on the same two-hour sitting.

The recommendation on file is to stop building features until the contradiction is answered.
If the answer is "artifact, not launch," the remaining work is about a week long and contains
no money, no accounts and no adults: sync the mirror, decide whether the backend ships, write
one case study.

## II.46 — a research brief, a docs audit, and the one artifact of the three that actually blocks something (2026-09-03, ~22:49 CDT)

Evan asked `/legal-triage` to explore "everything even remotely connected legally
to the app," then a `/research-brief` on what triage flagged unverified, then
`/audit-docs` on the two live legal pages, then fixes, then this entry.

**Triage: five matters, all RED by forced override** (`minors-data`, `contract`,
`money`, `ip`, `publish`) — routing, not a verdict. **The brief**
(`servelocal-v2/docs/research/2026-09-03_ccpa-gdpr-coppa-state-minors-privacy-background.md`)
found one fact nobody had written down: COPPA's line is under 13, and the
platform's own "under 12" floor still admits 12-year-olds, who are inside it.
CCPA's thresholds ($26.625M revenue / 100k CA records sold-or-shared / 50%
revenue from data) sit far above documented practice; GDPR's targeting test
matches the regulator's own examples of *non*-application for a US-only,
unmarketed site; the Texas SCOPE Act is a live open question, not a settled
non-issue. A cold-assessment pass caught two real problems in the first draft
— a same-source dependency and a false "no interested sources" claim (the
SCOPE Act injunction-scope finding traced to CCIA, the trade group that sued
to block it) — both corrected, plus one follow-up round on five more states
that turned out **not** to work alike (Virginia has no CT/CO-style teen
opt-in at all).

**The docs audit** (`servelocal-v2/docs/audit_2026-09-03_legal-pages.md`), two
cold Sonnet workers plus session re-verification, found the pages accurate
about the product and wrong about themselves: a **high** — registration
forces "I agree" (`auth.py:68`) on a Terms page whose own banner says it
"does not create binding obligations" — plus four mediums (a stale "draft
dated" line despite 5 substantive commits since; a "website or EIN" field
nothing collects; an undisclosed Stripe customer ID; an undisclosed Cloudflare
Turnstile vendor) and several lows, one of which corrected the legal packet's
own claim that only two placeholders existed (a third was at `terms:69`).

**Seven of the eight findings were text.** Applied directly: revision dates,
the EIN sentence, the Stripe/Turnstile disclosures, the consent-verb list
widened from 4 to match the 9 actual `require_consent` call sites, the
notifications-toggle location, and the packet correction.

**The eighth, the high, is now code, not a document.** Evan chose to close it
by gating the app's own boot, not by editing prose: `LEGAL_SIGNOFF_COMPLETE`
joins `check_production_config`'s seven other boot blockers (`app/core/config.py`),
defaulting `false`. Production will not start without it, the same mechanism
that already refuses a dev `SECRET_KEY` or an unset `SUPPORT_EMAIL` — nine
checks over eight variables now, not eight over seven. The loud tripwire test
(`test_boot_guard_check_count_matches_the_docs`) caught every place the count
is written down: `security.md`, `tooling.md`, `INDEX.md`, `DEPLOY_RAILWAY.md`,
`API_KEYS.md`, `.env.example`, plus a new regression test. 379 backend tests
green (378 + 1); `tsc --noEmit` clean on the frontend.

**Why the distinction matters, stated plainly because II.45 raised it directly
against this same session's prior output.** A research brief and an audit
report are artifacts a person has to read and act on — exactly what II.45
named as the failure mode: generating the next document for a blocked step
while the step stays blocked. `LEGAL_SIGNOFF_COMPLETE` is not that. It is a
mechanism that acts whether or not anyone reads this entry: the app will not
serve real registrations in production until a human flips one flag, and
flipping it truthfully requires the two `terms/page.tsx:86` blanks filled and
actual sign-off recorded — the code cannot be fooled by a well-written
document the way a reader can be. One of today's three outputs closes a gap;
the other two are, honestly, more of what II.45 already flagged — read
alongside it, not instead of it. The pre-mortem's harder questions (person-vs-
entity, whether Evan wants this duty at all, the stale public mirror) remain
exactly as open as they were nine hours ago.

**Pre-existing gap noticed, not fixed.** The Summary timeline table's last row
is dated 2026-09-01 (II.34); II.35 through II.45 have no timeline rows despite
the update protocol requiring one per entry. Left as found — out of scope for
this entry, and fixing eleven un-added rows silently would be a bigger,
undiscussed change than what was asked.

**VERIFY.** `ENVIRONMENT=ci .venv/Scripts/python.exe -m pytest -q` in
`servelocal-v2/backend`: 379 passed. `npx tsc --noEmit -p .` in
`servelocal-v2/frontend`: clean. TOC/heading balance for this file checked
before appending: 45 top-level `## II.N` headings, 45 TOC lines (three
`II.35.N` sub-headings inside one entry accounted for, not orphaned). No
commit made this session; commit hash not yet available — cite as "this
entry" per this table's own convention for uncommitted rows.

## II.47 — the pre-mortem re-run: two Tigers genuinely closed, one new one about the safety net that was supposed to catch the next mistake (2026-09-05, ~16:28 CDT)

servelocal-v2 ran `/pre-mortem on the legal docs` — the re-run
`docs/premortem_2026-09-03_legal-pages.md`'s own Follow-up section asked for,
after Evan's `8bfbe56` acted on its T1-T5. Output:
`servelocal-v2/docs/premortem_2026-09-05_legal-pages.md`. Read cold against
the current tree, not the prior document: the age floor, the flag-gated JSX,
the CI workflow's env vars, the M15 roadmap entry and the placeholder set were
each re-checked, not recalled.

**Two of the four prior launch-blocking Tigers are genuinely closed, not
reworded.** T3 (COPPA): raising `MINIMUM_AGE` 12->13 means no honestly-
registered user is a COPPA "child" (under 13) at all, so the verifiable-
parental-consent question T3 raised no longer attaches to anyone the site
admits -- checked against the 2026-09-03 research brief's own FTC FAQ A.12
finding, not asserted. T1 (the false organization-vetting claim): closed, and
checked for leakage -- grepped the rest of the frontend for the same claim,
found none.

**The new finding is about the safety net, not the pages.** `test_
signed_off_pages_have_no_placeholders_left` exists specifically to stop
`LEGAL_SIGNOFF_COMPLETE=true` from shipping with a bracket still in the
governing-law clause. `.github/workflows/ci.yml` never sets that variable in
either pytest step, so every CI run to date has hit the test's early-return,
never its assertion -- the only thing that has ever verified "flag true, no
placeholders" is one manual local run. A green pipeline and a working safety
net are not the same fact. Classified launch-blocking, one CI step to fix.

**The Elephant did not move.** No adult reviewer has been named; both
`[GOVERNING STATE -- Evan]` and `[LEGAL ENTITY NAME -- Evan]` are exactly where
they were on 2026-09-03. Two rounds of real, careful fixes have now landed
around that gap without closing it -- restated as this project's E3/E1,
escalated again.

**VERIFY.** `ENVIRONMENT=ci pytest -q --collect-only`: 394 tests collected
(higher than HANDOFF's stated 388 -- an unrelated, uncommitted capacity-
locking feature sits in the same working tree; not a legal-pages finding).
`gh run list`: the push containing `8bfbe56` is CI-green after four prior
reds. No code changed this session -- the register ends in an action plan
for Evan, matching the 2026-09-03 pre-mortem's own shape.

## II.48 — three legal-page updates, and a count from our own INDEX that did not survive checking (2026-09-05, ~18:46 CDT)

Evan asked to update the Privacy Policy and Terms of Service without naming
the content, so the pages were diffed against what the code actually does.
Three gaps, all the same class and all in the SAFE direction: **the documents
understated protections the code already provides**, each created by a fix
that landed 2026-08-11 -> 2026-09-05 without the prose following it.

**The one that matters is the guardian-rights paragraph.** It described
revoke as forward-only -- "re-blocks the student from applying, messaging
..." -- when revoke has been retroactive since 2026-08-11 and got wider on
2026-09-05: an active application is withdrawn and its spot released to the
next student waiting, and the student's name and reviews stop appearing
publicly, **including the organization's public review count and average
rating, recalculated without them**. A guardian reading the old text would
have learned that revoking stops future actions and nothing about what it
pulls back. The new text says both, plus the honest limit: the organization
keeps its record of hours it already verified, shown as a deactivated
participant without saying why.

The other two: the name-minimization sentence listed the leaderboard and
portfolio and missed reviews; the Terms' content-license paragraph named
deletion as the only way the display license ends, when guardian revocation
is a second trigger for a minor.

**A number from our own bins did not survive being checked.** The options put
to Evan said FOUR public surfaces, quoting `INDEX.md`. Before writing that
into a privacy policy: `grep -rn "first_last_initial" backend/app` returns
leaderboard, portfolio, reviews, and `sender_display_name` (messages).
Org-facing lists run the same consent predicate but **deliberately still show
identity** -- the org keeps its record -- so they are not public surfaces at
all. The policy says three, named individually rather than counted, and
`INDEX.md` was corrected in the same commit. This is the fourth time a
count in this project's own documentation has been wrong in the direction of
sounding more thorough (cf. II.46's boot-guard undercount).

**VERIFY.** `LEGAL_LAST_REVISED` bumped 2026-09-03 -> 2026-09-05, the first
real use of the constant added hours earlier: one edit moved the date in all
four rendered spots, which is what it was built for. `tsc --noEmit` clean;
`test_legal_pages_are_publishable.py` 3 passed; both pages browser-verified
on a fresh dev server with each new passage located by its own text. The two
open placeholders and the sign-off flag were not touched.

## II.49 — the dashboard converts to SWR, and the write hiding in its loader (2026-09-05, ~19:04 CDT)

The student dashboard was the largest page still on the old hand-rolled fetch
shape — the `useEffect` + `useState(loading)` + `useState(error)` idiom that
nineteen pages each wrote slightly differently, and that has already shipped two
real bugs of the same kind. It now uses `useAuthedQuery`. M13.6 goes **14 → 15
of 22 pages**.

The mechanical half was easy: four `Promise.all` fetches become four queries,
reusing keys the other pages already own, so the dashboard and `/portfolio` now
share one cache entry for hours and awards rather than each fetching them.

The interesting half was a write hiding inside a read. `refresh()` began with
`POST /hours/auto-log` — the call that mints pending hours rows for past events
a student was approved for — and only then fetched the four lists. That cannot
go inside an SWR fetcher, because SWR revalidates on window focus and on
reconnect, and each of those would replay the POST. The endpoint is idempotent
(it skips any occurrence date that already has a row), so nothing would
duplicate; but every replay still costs a request against the rate limiter and
writes an audit row on any run that mints something.

The fix is to stop treating it as part of the load at all. It runs once per
mount in its own effect behind a ref guard, and forces a re-read of exactly the
two keys it can affect — hours and awards — and only when the server reports it
actually created something. The common answer is `{"created": 0}`, and in that
case nothing refetches, which makes the new page strictly cheaper than the old
one that always wrote and then always fetched.

Two things were deliberately not done. The combined loading and error flags stay
combined, so every tab still shows one skeleton and one inline error with a
Retry — splitting to per-panel errors is now free but it is a UX change, not a
conversion. And a stale comment that described the old single-`refresh()` shape
was rewritten rather than left to quietly become false.

Verification ran against the real stack and produced the exact predicted network
signature: one GET per key on mount, one auto-log POST, then — because the
fixture had an un-logged past event — a revalidation of hours and awards *only*,
with applications and saved untouched. A tab switch produced zero requests. A
self-report submitted through the form produced its POST, then the four GETs,
and no second auto-log. The stat tiles tracked it: 0/0/0, then 0/6/6 after
auto-log minted two past occurrences, then 0/7/7 after a one-hour self-report. A
clean tab logged no console messages at all. `pytest` stayed at 394 passed, 1
skipped; the frontend's lint count went down by one, because the first draft of
this change introduced a warning and it was fixed rather than copied from the
page that already carries the identical one.

One limit is worth stating rather than smoothing. The focus-revalidation path
was not observed. A synthetic focus event produced no requests, because SWR
gates that path on the tab's visibility state and the automation tab is hidden —
the same shape as the cached-200 trap already recorded in the testing bin. That
the write never replays on revalidation rests on where the code puts it, plus
the self-report run above, not on a watched focus revalidation.

## II.50 — the backup nobody had run, and a monitor that isn't on the box it watches (2026-09-05, ~19:15 CDT)

Evan chose the real launch over the portfolio artifact, and gave a fact that
quietly removes the blocker the last session had built its plan around: he turns
18 on «redacted-date». The objection was never about competence — it was that a
seventeen-year-old cannot be the party offering a binding contract, so someone
else had to be named as operator on the Terms. In three days that is simply no
longer true. What does not move is the duty. The platform still holds minors'
names, guardian emails and activity, so guardian consent, breach notification
and a support channel are the same obligations they were the day before.

Two rows of the launch sequence were unblocked and got done.

The first was a backup script that had existed for weeks and had never once been
run. That is a worse position than having no script, because it reads on every
status page as a solved problem. It now has real output: a 34,040-byte dump,
restored into a throwaway database, three tables counted, the throwaway dropped,
exit zero. Two checks after the fact, because a drill that leaves debris behind
has failed quietly — the database list showed the throwaway gone, and the source
database's own counts matched the restored copy exactly, which is the actual
claim a restore drill makes.

Getting there required refusing an easier road. The Postgres client tools are
not on this Windows machine, and the script exits loudly rather than guessing —
correct behaviour that nonetheless blocks the run. The tempting move was to
shell into the database container and dump from inside it. That would have
produced a valid backup and proved nothing whatsoever about the script, which
was the artifact under test. Instead: a throwaway image with the matching client
tools and Python, attached to the compose network, repo mounted. The version
match is not incidental — an older client refuses to dump a newer server, so
grabbing `postgresql-client` off a generic Python image would have failed in a
confusing way.

The second row was uptime monitoring, and the interesting part is a constraint
that rules out the obvious answer. A checker running on the app host proves
nothing, because the failure it exists to catch is that host being gone. Every
hosted monitor worth having needs an account, and accounts are Evan's to create.
The way through was noticing the project already owns external infrastructure:
the checks now run from GitHub Actions on a fifteen-minute schedule — off the
app host, no new account, no spend.

The probe is deliberately stricter than a ping, for one specific reason. A
response of 200 whose body reports the database as down is treated as an
outage. Load balancers route on the status code, so a monitor that reads only
the code would call a live process over a dead database perfectly healthy — the
exact failure this project already fixed once inside the health endpoint itself.
It also rejects a 200 carrying a non-JSON body, which is what a proxy or
maintenance page looks like when it answers in the app's place.

Two smaller choices are worth naming because both are about a monitor being
trusted rather than merely existing. Before launch, with no production URL
configured, the job explains itself and exits green instead of red; a check that
fails every fifteen minutes for a site that does not exist yet is one that gets
muted well before the day it starts mattering. And the decision logic is split
from the network code, so seven cases run as assertions with no site to call.

The verification included the failure path, not just the happy one: with the API
killed, the probe reported the refused connection and exited non-zero. One case
was left unproven and labelled as such — the 503 branch was not exercised
against a running API with a stopped database, because stopping the shared
database container would have disrupted another session working against it.

The documentation says plainly what this does not buy, which for a monitoring
page matters more than what it does. The schedule is best-effort, not an SLA.
Scheduled workflows switch themselves off after sixty days of repository
inactivity, so a live but quiet project silently stops being watched and nothing
announces it. The entire alert chain is one email to the repository owner. It is
a smoke alarm, not a pager, and the upgrade trigger is written down so replacing
it is a decision rather than a discovery.

The milestone checkbox stays unticked. It bundles error tracking, uptime and
scheduled backups; two of those are now real, and the Sentry key and the
production host's backup schedule both still wait on Evan.

## II.51 — two failures the app handled badly, one of which the browser caught in the fix itself (2026-09-05, ~22:19 CDT)

A walk through how the app behaves when its dependencies fail turned up two
things worth fixing before real users arrive, and both are the same kind of
problem: a failure path nobody had exercised.

The first is a small piece of code with an outsized blast radius. The request
counter that powers the analytics page runs as middleware, and that middleware
is asynchronous while the database library underneath it is not. The write was
therefore happening on the single event loop that serves every concurrent
request — measured at three and a half milliseconds on a healthy local database,
and potentially thirty seconds if the connection pool is exhausted, since that is
how long a request waits for a connection before giving up. Blocking that loop
does not slow one request; it stalls all of them, including requests that never
touch the database at all. The irony is on the record: this module's own
documentation promises that analytics must never cost a user their request, and
it was the piece most able to freeze the whole server. The fix moves the write
to a worker thread, which is one import and one keyword.

One measurement along the way was wrong in a way worth preserving. The first
timing run reported hundredths of a millisecond and would have closed the
investigation as a false alarm. It was invalid: the route being probed was the
health endpoint, which is deliberately excluded from counting, so the function
returned before doing any database work. The cheap measurement agreed with
"nothing to see here," and only re-running it against a counted route showed the
real cost. The regression test got the same treatment — it was proved to fail
against the old code before being trusted, by temporarily putting the blocking
call back and watching the assertion fire.

The second finding needed no measurement at all. The application had no error
page and no page-not-found page of its own — not anywhere. Any unhandled error,
and any mistyped address, dropped the visitor onto the framework's built-in
default: no navigation, no footer, no route back into the site. This had already
been seen earlier in the same session without being recognised for what it was,
when a stale build produced exactly that bare screen. For a service whose users
are students and the parents approving their accounts, it was the one moment of
failure with no design applied to it whatsoever.

Three pages now cover it, and a deliberate decision runs through all three:
none of them display the underlying error text. A thrown error can carry a web
address, a record identifier, or a fragment of somebody's data, and the people
using this service are minors. A short reference code is shown instead, which is
enough to match the incident against the server's own log.

The fix then produced a bug of its own, caught by looking at it rather than by
reasoning about it. Wrapping the not-found page in the site's standard shell put
two navigation bars and two footers on the screen, because the layout only hides
its own chrome on pages it recognises — and an unknown address is by definition
not one of those. The correction splits the two cases along the same rule the
layout already uses, and all four resulting combinations were then driven in a
browser against a production build and counted element by element: exactly one
header and one footer in every case.

Two findings from the same analysis were deliberately left alone and are written
down as open. The rate limiter still keeps its counters in one process's memory,
which means a second copy of the application would double every limit and any
deployment resets them all. And the signup bot check still refuses every
registration when the verification service is unreachable — correct for a bot
gate, but there is no manual override if that service has a bad day.

## II.52 — a security control that got weaker without erroring, and an off switch built to expire (2026-09-05, ~23:14 CDT)

The last two items from the failure walk are closed, and they are opposite
problems: one control that would have quietly stopped working, and one that
worked so absolutely it could take the whole signup flow down with it.

The rate limiter kept its counters in one process's memory. That is correct
while exactly one copy of the application is running and silently wrong the
moment there are two, because each copy keeps its own tally and the effective
limit doubles. Nothing errors. Nothing logs. The control just protects half as
much as everyone believes it does, and the only way to find out is to look. Every
deployment also wiped every window. The counters now live in a table in the
database, so all copies share one view.

Redis is the textbook answer here and was rejected on purpose. It would mean a
new service, a new account, and one more thing waiting on Evan for a launch that
already has several. The database is a hard dependency of every endpoint the
limiter guards, so putting the counters there costs no new infrastructure at all.

The exact sliding window became an approximation — two fixed sixty-second
buckets, with the older one weighted by how much of it is still in view. That is
the standard trade, and it holds the limit tightly enough across a boundary
while replacing a growing list of timestamps with two integers.

Two behaviour changes came with it, and both deserve saying out loud because
neither is neutral. Attempts now count even when they are refused, so hammering
an already-blocked endpoint is no longer free. And if the limiter cannot reach
its store, it lets the request through rather than blocking it. That direction
was chosen deliberately: the limiter sits in front of signing in and resetting a
password, both of which need the very same database, so refusing everything
during a database incident would lock out every user — including a parent
halfway through approving their child's account — while protecting nothing at
all.

There is a trap in a control that fails open, and it applies to the tests as much
as to production: a limiter aimed at a table that does not exist would let
everything through, and every test asserting that a burst gets refused would pass
by never limiting anything. So one test now asserts the counter rows actually
exist and add up, and another writes a row by hand — exactly what a second copy
of the application would leave behind — and requires this copy to honour it.

The second fix runs the other way. The signup bot check refuses anything it
cannot verify, which is correct for a bot gate and means an outage at the
verification provider stops all registration with no way out but a code change.
It now has a break-glass, and the shape of it is the interesting part: it is a
deadline, not a switch. An override you have to remember to turn off is one that
gets left on, so this one expires on its own, and the application refuses to
start in production if the deadline reaches more than a day out — a short window
is incident response, a long one is the gate quietly disabled.

The first version of that override was too clever and would have rescued nothing.
It only covered the case where the server could not reach the verification
service. But a real outage takes the browser widget down too, so the visitor
never receives a token to send, and the request is refused before any network
call happens. Covering that case means admitting what the override actually is
for its duration: an off switch. It still never overrides an explicit rejection —
if the service answers and says this token is bad, that is a fact about the
request, not an outage.

Fixing the limiter also broke a piece of documentation, which is worth recording
because it is the ordinary way documents rot. A neighbouring module's comments
described its own limitation by pointing at the rate limiter as having the same
one. That sentence was true when written and false the moment the limiter was
fixed. It now says the reverse, plainly: that module is the one still stuck in
process memory, so the application must keep running as a single copy until it
gets the same treatment. That work was left undone rather than half-done
quietly.

One more near-miss belongs here. The first performance measurement of the new
limiter came back at two seconds per request, a number that would have killed the
design outright. The database container had stopped; what the measurement
actually captured was a connection timeout, and incidentally proved the
fail-open path works. Restarted, re-measured, four milliseconds. That is the
second time in one sitting that a cheap measurement agreed confidently with the
wrong conclusion.

## II.53 — the last per-process counter goes shared, and a slow test suite turns out to be a correctness bug wearing a costume (2026-09-06, ~00:55 CDT)

The three remaining anti-abuse counters — the cooldown on resending a guardian's
approval email, the lockout after repeated wrong check-in codes, and the cap on
password-reset requests — moved out of one process's memory and into the
database. That finishes what the rate limiter started the day before, and it
removes the last reason the application had to run as a single copy.

The interesting part is why the previous fix was not enough. An audit a day
earlier had found these counters checking a limit and recording an attempt as two
separate steps, with database work in between, which meant fifty simultaneous
callers could all pass a cap of ten. That was fixed with a lock, correctly, and
the lock did exactly what a lock does: it made the counter safe inside one
process. It could never have done more. Two copies of the application each held
their own lock and their own tally, so every limit was quietly worth double.
Atomicity now comes from a single database update statement instead, which both
database engines serialise on their own.

There is a real trade in the new shape and it belongs in the record. The window
is now pinned to the event that opened it rather than sliding forward one
timestamp at a time. For the five-minute resend cooldown the two behave
identically. For a cap of several attempts, the new one frees the whole budget at
once when the window ends rather than freeing slots one by one. What survives
exactly is the property that mattered: someone who is already blocked cannot push
their own lockout further out by hammering, because the anchor never moves while
the window is open.

The concurrency test that caught the original bug had to be rewritten, and
rewriting it surfaced something worth knowing. It had been running against the
suite's shared in-memory database, which hands every thread the same connection —
so a test about fifty threads competing was, underneath, fifty threads politely
queueing. It now uses a real file so each thread gets its own connection. Then the
old broken shape was deliberately put back to confirm the test still catches it:
fourteen of fifty callers passed a cap of ten. Restored, exactly ten pass.

The most expensive lesson came from a number that looked like a performance
problem. After the move, the test suite went from sixty-eight seconds to three
hundred and eighty-one. The timing breakdown pointed at four seconds spent in
*setup*, over and over, in two test files. Both declared their own automatic
cleanup step that did not depend on the fixture which redirects database access
to the test database — so it ran first, reached for the real production database,
and spent four seconds failing to find it. Twice per test, once going in and once
coming out.

The narrow fix was to make two fixtures wait for one other fixture. The real fix
was to make the redirect automatic for every test, covering all four components
that open their own database connections, so ordering stops mattering at all. The
suite now runs in fifty-four seconds — faster than before any of this work
started, because tests that never asked for a web client were also paying that
cost.

Underneath the slowness was a correctness problem, and this is the part worth
carrying forward. These guards are built to fail open: if they cannot reach their
store, they let the request through, because they sit in front of signing in and
resetting a password, which need the same database anyway. That is the right
call in production and a trap in testing. Aimed at a database that is not there,
the throttle allows everything — and every test asserting that a limit engages
passes without any limit ever engaging. A suite can be green and prove nothing.
The automatic redirect is what makes those assertions mean something, which makes
it a correctness fixture that merely happened to show up as a stopwatch reading.

The single-replica restriction is now lifted, and checked rather than assumed: a
sweep of the application code for module-level state, locks and caches comes back
empty. One counter survives, an integer that decides when to clean up expired
rows — it affects housekeeping timing and never a decision about whether someone
is allowed through. The deployment runbook's warning has been struck through and
replaced with a table of what now backs each protection.

## II.54 — a page that had never been able to say "still loading", and a list of remaining work that was quietly wrong (2026-09-06, ~13:24 CDT)

The organization dashboard moved onto the shared data-fetching helper, taking the
migration to sixteen of twenty-two screens. Most of it was mechanical. Two
things about it were not.

The first was found before any code changed. The handoff document said seven
units of work remained and then listed six. The missing one was the site header,
whose unread-notification count is still fetched the old way — and the arithmetic
only balances with it included. That kind of error is cheap to write and
expensive to inherit: the next session would have converted the six named items,
declared the milestone finished, and been wrong. It is corrected in place, and
the correction is the reason to count rather than trust a list.

The second was a gap hiding in the page itself. It had a way to say "something
went wrong" but no way to say "still loading". Until data arrived, its three
lists were empty arrays, so every tab confidently displayed "No listings yet",
"No applicants yet", "No pending hour requests". An organization opening its
dashboard on a slow connection was told, briefly and incorrectly, that it had
nothing. That is precisely the failure this whole migration exists to remove, and
it had been sitting in the page the entire time — the error state had been added
months earlier by an audit, and the loading state simply never was. The page now
shows a loading placeholder, and a failure takes precedence over it, so a broken
load can never be mistaken for a slow one.

There was also a cache key worth getting right rather than convenient. One of the
three loads asks for volunteer hours, and a different screen already asks for the
same data under an established name. The project's own rule says a key names the
data, not the page asking for it, and warns against inventing a third spelling.
Reusing the existing name means the two organization screens now share one cached
copy, so approving hours on either is immediately true on the other rather than
leaving two views to drift apart.

Verification was by counting network requests rather than by looking at the
screen: one request per kind of data on arrival, zero when switching between
tabs, and after approving an hours entry, one write followed by exactly the three
reads it can affect — while the analytics request, which that action cannot
change, stayed untouched. The row then flipped from pending to verified in the
interface, which is what proves the refreshed data actually arrived rather than
merely being requested. The new loading placeholder was caught by sampling the
page every sixty milliseconds during load, which is the only way to observe
something that exists for a fraction of a second.

Two claims are deliberately not made. The shared-key benefit is structural — the
same name in both files — and was not watched happening, because no link connects
those two screens for a click to travel along. And the failure state was not
re-driven, because switching off the backend also switches off the check that
identifies the user, so the page stops at its role guard before any data state
can render; that trap was already hit and recorded during the previous screen's
conversion.

One self-inflicted break belongs here too. Rewriting four display branches by
text substitution opened a bracket in each without closing it, and the type
checker rejected all four within seconds. Cheap to fix, and a fair reminder that
editing structured markup by find-and-replace trades a minute of reading for a
minute of debugging.

## II.55 — the one screen that was written in two design languages at once (2026-09-06, ~13:44 CDT)

The question that started this was whether the project should adopt a popular
component library to keep the interface consistent. It already had it. The
library was installed months ago, sixteen files were using it, and the stack
description in the project's own instructions lists it. So the real situation was
not a choice between having a system and not having one — it was two systems
running side by side, one built from that library and one hand-built to match the
original version of the site.

That second system is not decoration. Making every screen match the original
site's editorial look is a completed milestone with a checkbox next to it, and the
project's standing instructions explicitly rule out the generic modern-app
appearance the library ships by default. For a portfolio piece, looking like
every other portfolio piece is the failure mode. So the answer to "should we
standardise on the library" is no, and the interesting follow-up is which screens
are on the wrong side of the line.

One screen was on both sides at once. The opportunity detail page wrapped itself
in the editorial shell, rendered one panel in the editorial card style, and then
mounted four child sections built entirely from library components — three visual
languages on a single screen, and the only file in the project importing from both
systems. It has now been converted whole: all five files, zero library imports
left in that directory, and the project-wide count of files using the library
drops from sixteen to eleven.

The mapping was taken from the page rather than invented for it. The card style
chosen was the one the page's own Featured panel already used — because two card
styles on one screen is precisely the defect being removed, and picking a
different-but-nicer third would have reproduced it. Buttons, inputs, error text
and muted helper text each had an existing editorial equivalent. One deliberate
exception is recorded in the code: the editorial label style is uppercase and
full-width, which is right above a form field and wrong beside a radio button, so
the two radio rows keep their own inline layout.

Verification was by computed style rather than by screenshot, since the
screenshot tool times out in this environment. The Apply button resolves to the
exact green from the palette definition, the card border to the exact border
colour, and the section headings to the display typeface — all confirmed in the
browser, for both a student's view and the owning organisation's view, with no
leftover library utility classes in the rendered page and no console errors. A
check-in code was generated through one of the converted panels to confirm the
controls still drive their writes rather than merely looking right.

Two honest limits. The container platform stopped partway through, taking the
database with it, so the visual check ran against a temporary file-based database
instead — irrelevant to a change that touches only markup and styling, but worth
saying rather than implying a full-stack run. And the reviews panel still
swallows a failed load entirely, showing a blank card where it should show either
reviews or a message; that is a data-fetching defect belonging to a different
piece of work, and widening this change to catch it would have been the kind of
scope creep the project's own rules forbid.

The remaining eleven files still use the library. They are at least internally
consistent, which the converted screen was not.

# Appendix A - Scheduled daily-audit: an internal COPPA gap analysis is public, and the legal-signoff flag can never reach the build that would clear the banner (2026-09-07 07:23 CDT)
Scheduled `daily-audit` cold sweep of `servelocal-v2` (320 files) plus the public
`servelocal-portfolio` mirror, 9 parallel workers. Findings only — nothing was
changed. Classified ACTIVE: no audit entry inside the 7-day window, 14 commits.

## The public mirror is the worst of it

`servelocal-portfolio` is pushed (`main...origin/main`, no divergence) to
`github.com/Evan-Daruwalla/servelocal-portfolio` under Evan's real name.

- **`docs/research/2026-09-03_ccpa-gdpr-coppa-state-minors-privacy-background.md`
  is public.** 32,128 bytes of internal gap analysis naming which
  children's-privacy-law questions are open on a live product holding
  12-to-17-year-olds' data, written explicitly for the adult legal reviewer —
  i.e. it says on its face that legal review has not happened.
  `LEGAL_REVIEW_PACKET.md` and the Strix pentest runbook it references were
  correctly withheld, so containment is partial, not absent.
- **Root cause, `scripts/sync_portfolio.py:139-145`.** The outer structure is a
  real allowlist (`MANAGED_DIRS`, `MANAGED_ROOT_FILES`, `PUBLIC_BINS`), but
  `docs/research/*.md` and `docs/adr/*.md` are copied by flat glob. Inside those
  two folders the policy degrades to "publish anything unless it matches one of
  five credential regexes" — which is exactly how a document containing no
  credentials got out.
- **`scripts/sync_portfolio.py:53` vs `:135-151` — the mirror has never had a
  LICENSE.** `MANAGED_ROOT_FILES` lists it; there is no `copy2` call for it, and
  `promote_managed()` skips what does not exist. `git log --all --full-history`
  on LICENSE in the mirror is empty, across every sync since the 2026-09-03
  comment claiming it was added.
- **Date of birth, prospective.** The literal `«redacted-dob»` is in the private
  HANDOFF.md and PRD_ROADMAP.md and matches neither `REDACTIONS` (demo password,
  gmail addresses) nor `SECRET_PATTERNS` (JWT/Stripe shapes). `git grep` in the
  mirror returns nothing today; the next sync publishes it. Mirror
  `HANDOFF.md:35` and `:312` already say "Evan turns 18 ~«redacted-date»", which
  fixes the date by arithmetic.

## A launch gate whose removal mechanism cannot fire

`frontend/Dockerfile` declares ARG/ENV for 4 of the 6 `NEXT_PUBLIC_*` vars the
code reads. `NEXT_PUBLIC_BILLING_LIVE` and `NEXT_PUBLIC_LEGAL_SIGNOFF_COMPLETE`
have none. Next.js inlines these at build time and Docker forwards a build arg
only for a declared ARG, so setting `NEXT_PUBLIC_LEGAL_SIGNOFF_COMPLETE=true` as
a Railway variable and rebuilding — what `docs/DEPLOY_RAILWAY.md:299` instructs
— bakes in `undefined`. The Terms/Privacy non-binding-draft banner that flag
exists to remove would never go away, after doing everything the runbook says.

## HEAD does not pass its own CI

`HANDOFF.md:52` claims "ruff check + format clean". Run at HEAD with the pinned
`ruff==0.14.2`: `ruff check .` prints "All checks passed!", but
`ruff format --check .` prints "3 files would be reformatted" —
`app/core/rate_limit.py`, `app/services/checkin.py`, `tests/test_turnstile.py`,
all three touched by the current HEAD commit. `ci.yml:41` runs both, so HEAD
would fail CI. HANDOFF's own cited green range ends 4 commits before HEAD.

## Minors' data, three findings

- `backend/app/services/account.py:125-172` — `anonymize_account` scrubs the user
  row, deletes SavedOpportunity/Notification, and blanks `Message.sender_name`
  and `Review.author_name`. It never touches `backend/app/models/hours.py:46-49`
  (`note`, `supervisor_name`, `deny_note`, `appeal_note`), so free text a minor
  typed survives "delete my account" verbatim against the tombstoned id.
  `Message.body` is likewise retained; only identity is scrubbed. A worker also
  named `Application`; that half is wrong — it has no free-text column.
- `docs/SUPPORT_PROCEDURES.md:76,79` — the admin runbook for a credible underage
  report says "A child under 12" / "if under 12".
  `backend/app/core/consent.py:21` is `MINIMUM_AGE = 13` and
  `frontend/app/terms/page.tsx:46` says 13. A genuinely underage 12-year-old is
  not "under 12", so the procedure as written would not flag them for erasure.
- `docs/DEPLOY_RAILWAY.md:341` — the Scheduled jobs section lists exactly one
  job, `purge_audit_log`. Nothing schedules a backup; grepping `backup_db` across
  `.github/`, that runbook and `railway.json` returns nothing. The only backup
  ever taken was hand-run on 2026-09-05.

## Counts that disagree with each other and with disk

The project's own 2026-09-03 pre-mortem said its top risk was its docs
contradicting each other. Tested directly, and it is right.

- SWR page count: `README.md:17` says 11, `DIRECTORY.md:54` says 14,
  `INDEX.md:20` and `features.md:17` say 16, `HANDOFF.md:26` says 16 while
  `HANDOFF.md:131,133,290` say 14 in the same file. Disk says 15
  (files importing `@/lib/use-api` under `frontend/app`). Five claims, three
  values, none correct.
- The boot guard has THREE stated counts and none of the docs agree.
  `app/core/config.py` has 10 `problems.append` sites over 9 variables, of which
  at most 9 can fire together (two SECRET_KEY checks are if/elif). `DEPLOY.md`
  says 8 checks over 7 variables and omits `LEGAL_SIGNOFF_COMPLETE` entirely, so
  an operator following only it hits a production crash-loop. `HANDOFF.md:239`
  and `PRD_ROADMAP.md:58-59,596` say 9 over 8. `tooling.md` gets the 10-over-9
  count right but then says at most EIGHT fire at once at `:73`. Only
  `security.md:87` states both halves correctly.
- `docs/adr/0001-token-storage-for-launch.md:205` runs the other way — it still
  says the shared-store rate limiter is NOT DONE and warns that "more than one
  replica silently multiplies every rate limit". `core/rate_limit.py` and
  `core/throttle.py` both write shared DB tables now (migrations 0027, 0028), so
  the ADR advertises a launch-blocking multi-replica risk that was closed on
  2026-09-05/06. A stale open risk is as costly here as a stale closed one: it
  argues against a deploy shape that is now safe.
- `DIRECTORY.md` fails its own staleness check: the command it prints returns 10
  added files since commit `b6a57b8`, and nothing flags it. Downstream:
  "11 SQLAlchemy models" (13), "38 test files" (41), the `app/core/` list omits
  `throttle.py`. "16 Pydantic shapes" (15) is a plain miscount, not drift.
- Migration chain: `architecture.md:68` says 0001-0024, `backend/README.md:77`
  says 26 revisions, `HANDOFF.md:24,291` and `PRD_ROADMAP.md:57` say 0001-0026.
  Disk and `data.md` say 0001-0028.
- Test count: `backend/README.md:81` says 364, `HANDOFF.md:22,291` says 394. A
  real run gives 409 passed, 1 skipped, 410 collected.
- `HANDOFF.md:29-31` carries a caveat that the applicants page is "only
  fractionally converted" and "its three main loads do not" use the hook. All
  four loads in `frontend/app/applicants/page.tsx:47-63` use `useAuthedQuery`;
  the caveat outlived the commit that fixed it, two paragraphs above that
  commit's own record line.
- `HANDOFF.md:52` polices the eslint baseline as a regression trigger at
  "11 warnings"; `npm run lint` gives 10.
- `docs/API_KEYS.md:60` ships a self-check command that proves completeness. Run
  now it prints `['TURNSTILE_FAIL_OPEN_UNTIL']`, not `[]`.
- `docs/LEGAL_REVIEW_PACKET.md:32,86,93` date three code changes to 2026-09-03;
  git puts all three in `8bfbe56`, 2026-09-05 16:01 CDT — the same commit that
  wrote those sentences, stamping the premortem's date instead of its own.

## Guards checked, and the two that matter most HELD

No document anywhere claims the Strix pentest was run, and none claims legal
review was completed — both are consistently represented as not yet done. That
was the pair most damaging to get wrong here. `[GOVERNING STATE — Evan]` and
`[LEGAL ENTITY NAME — Evan]` are still literally present at
`frontend/app/terms/page.tsx:91`, exactly as the docs say.

Every id-taking route re-checks ownership, not just authentication (24 route
modules walked). Role checks are centralised in `api/deps.py:82-100`. The JWT
algorithm is pinned and logout genuinely revokes via `token_version`. The
production boot guard was run and really refuses to start on the dev SECRET_KEY.
Zero raw SQL outside a literal `SELECT 1` health check. The migration chain is a
single linear 0001-0028 with one head and no `pass`-only downgrade. Every
requirement is `==`-pinned; CI has no `continue-on-error` or `|| true`; the
Postgres-gated capacity race really does run — `ci.yml:102` sets
`TEST_DATABASE_URL`. `test_consent_gate_coverage.py` mechanically fails any new
write route that is neither gated nor allowlisted. `npm audit`, `pip-audit` and
`tsc --noEmit` are all clean. `MINIMUM_AGE = 13` matches terms and privacy
exactly. The org-vetting false claim is genuinely gone — zero hits for "vetted"
in the frontend.

Two gaps in that coverage: no test proves an EXPIRED access JWT is rejected
(only a garbage one, `test_auth.py:85`), and there is no mechanical sweep proving
every protected route carries an auth dependency — the consent-gate walker
pattern exists and could be reused for it.

## Frontend

`frontend/app/opportunities/[id]/reviews-section.tsx:18` — `.catch` discarding
the error leaves `data` null, so a backend 500 renders identically to an org with
zero reviews. II.55 admitted this on 2026-09-06 as out of scope; still open, and
the three sibling files in that directory all have the branch it lacks.
`dashboard/page.tsx:118-127` and `hours/page.tsx:86-95` have no in-flight guard,
so a double-click fires two POSTs.

Landing-check on II.55 passed clean: 11 files import `@/components/ui`, and the
five files in `opportunities/[id]` contain zero such imports.

## Repo hygiene

`scripts/git-hooks/pre-commit:30` (ServeLocal root) warns and commits UNSCANNED
when the delegated secret scanner is missing. The Autonomous Car copy of the same
hook fails closed at `:35` with an explicit `CAR_ALLOW_UNGATED_COMMIT` opt-out.
Same gate, opposite policy, and `.claude/` is gitignored so nothing
version-controls the difference.

This record has 58 `## II.` heading lines against 55 TOC entries. The balance is
intact — II.35 carries three subsections at `##` level rather than `###`, so any
tool counting entries by that pattern over-counts by three.

## Not swept

`ServeLocal website/` (v1, 3917 files) excluded as FROZEN per the root CLAUDE.md.
It has no `core.hooksPath` set, so commits there are ungated — noted, not
audited. The "22" denominator behind the SWR fraction is never enumerated
anywhere on disk, so which pages remain could not be adjudicated.


## II.56 — three silent failures fixed, and an internal legal brief pulled off the public mirror (2026-09-07, ~10:41 CDT)

The audit sections above this entry found the defects; this entry is what was done
about them, the same day. Every one shared a shape: **a promise recorded in a doc or
a published policy that no code enforced, failing with no error anywhere.**

**The launch gate that could not be opened.** `frontend/Dockerfile` gained `ARG`+`ENV`
for `NEXT_PUBLIC_LEGAL_SIGNOFF_COMPLETE` and `NEXT_PUBLIC_BILLING_LIVE`, plus matching
entries in `docker-compose.yml`'s `web.build.args` and in both runbooks
(`DEPLOY_RAILWAY.md` Step 6, `DEPLOY.md` §4, which had also said "all four are
build-time" and now says six). Proven with two real Next builds and a served page
rather than by reasoning: with the flag set, `/terms` returns
"In effect · last revised 2026-09-07" and no banner; rebuilt with it unset, the same
URL returns "Draft: pending legal review and sign-off". The control run is the half
that makes the first one mean anything. **Unproven and stated as such:** that the
`ARG` forwards under a real `docker build` — Docker's daemon has been down since
2026-09-06 ~13:40 CDT.

**Deletion now erases what a minor actually wrote.** `anonymize_account()` scrubs the
four `Hours` free-text columns (`note`, `supervisor_name`, `deny_note`, `appeal_note`)
and, by a decision taken here rather than deferred, `Message.body` as well. The hours
rows are kept on purpose so an organization's verified-service record survives, which
is precisely the argument for emptying their prose: the row outlives the account. The
privacy page had already promised this — "with your name and identifying details
removed" — so the code had been contradicting the published text, not merely lagging
it. Two clauses were added to `privacy/page.tsx` so the page describes what now
happens, and `LEGAL_LAST_REVISED` moved to 2026-09-07. The new test was sentinel-run
against the pre-fix code and failed alone, on the planted phone number in `Hours.note`.

**The mirror was publishing analysis written for a lawyer who has not read it.** The
32,128-byte children's-privacy background brief reached the public repo because
`sync_portfolio.py` copied `docs/research/` and `docs/adr/` by flat glob — so inside
those two folders a real allowlist degraded into "publish anything that does not match
one of five credential regexes". No credential regex catches a document whose problem
is that it holds no credentials, only open questions about minors' data on a live
platform. Both globs are now explicit per-file lists. The same pass found that
`LICENSE` had been listed as mirrored since 2026-09-03 while no code ever copied it
(the mirror has never carried a license, so it read as all-rights-reserved), and that
Evan's date of birth would have ridden the next sync out — now redacted, while the
separate question of whether the «redacted-date» birthday stays public was left for him
rather than answered on his behalf.

Also: the support runbook's P4 procedure was policing an age floor of 12 against a
`MINIMUM_AGE` of 13, and three backend files failed `ruff format --check` while
HANDOFF claimed format-clean — on a repo whose CI runs that check as a blocking step.

410 backend tests pass (up one), `tsc` clean, eslint 0 errors. Two things are
deliberately not done and are Evan's: the push that actually unpublishes the brief
(committed as `5eac677`, blocked by the publish guard by design, **so the file is
still live on GitHub until he pushes**), and the decision on whether to rewrite the
mirror's published history, where a force-push would still not evict the blob from
GitHub's cache without contacting Support.
