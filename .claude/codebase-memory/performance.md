# performance — servelocal-v2

Last updated 2026-09-03.

- **No load/perf work has been done in v2 yet** — explicitly out of scope per PRD §4. (v1 owns the
  scaling history: ADR-0012/0013, the confirmed ~90k-user `Invalid string length` serialization
  ceiling removed via SQLite + verified at 100k users — but that's the DIFFERENT Node stack and does
  not transfer to v2.)
- Tests run on in-memory SQLite via `StaticPool` (one shared connection for the whole test) — fast
  and Postgres-free; dev/prod run on Postgres.
- **NO per-process limit state remains** (2026-09-06). The IP limiter moved to `rate_limit_hits`
  (0027) and the three `Throttle` counters to `throttle_state` (0028), so **the ONE-replica
  constraint is LIFTED** for this reason. Verified by sweep: no module-level dict/list/set, no
  `threading.Lock`, no `lru_cache` anywhere in `app/`. The one survivor is
  `rate_limit._since_sweep`, which decides WHEN to purge expired rows and never a limit decision.
- Both stores **fail OPEN** on a database error — a deliberate availability-over-enforcement
  choice for gates that front login, password reset and consent.
- Occurrence expansion (`app/core/occurrences.py`) has a `_MAX_OCCURRENCES` guard so an unbounded
  recurring window can't blow up. It's uncached, recomputed per request (date_spots, auto-log) —
  fine at launch scale; also the top cross-community bridge in the graphify graph (protect with
  tests if recurrence rules grow).
- Broadcast fan-out (M7, `POST .../messages/broadcast`) is an O(N)-per-recipient loop (one Message
  + one notification/email each) in a single request — acceptable at launch scale; queue it if org
  audiences get large (flagged in the record 2026-07-09).
- **`GET /opportunities/{id}` now WRITES** (M14.2, 2026-09-03): one
  `UPDATE … SET views = views + 1` per detail view, on a separate session, skipped for
  the owning org. UPDATE-in-place rather than read-modify-write so concurrent views
  cannot lose a count. This is the first write on a hot public READ path — if that
  route ever becomes a bottleneck, this is the thing to batch or move off-request.
- `RateLimitMiddleware` (M9.1) now costs a DB round trip on auth/write requests — **measured
  median 4.10 ms, p95 5.49 ms, max 17.77 ms** against local Postgres (2026-09-05). Reads are not
  limited, so they pay nothing. It runs through `run_in_threadpool`, so the cost is a worker
  thread, never the event loop. `Throttle.check_and_record` costs **median 3.17 ms, p95 5.06 ms**
  (2026-09-06) and fires only on consent resend, password reset and check-in redeem — rare paths.
- **A test-fixture ordering trap this created** (2026-09-06): `test_consent.py`'s autouse
  `_clear_resend` calls `reset_all()` and did NOT depend on `client`, so it ran before the session
  redirect and spent **~4.1 s per setup AND per teardown** failing to reach the real Postgres —
  the suite went 68 s → 381 s. Fixed by making the redirect an AUTOUSE conftest fixture; suite is
  now 54 s. A module that opens its own session must be redirected autouse, never inside `client`.
