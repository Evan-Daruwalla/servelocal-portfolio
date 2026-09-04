# performance — servelocal-v2

Last updated 2026-09-03.

- **No load/perf work has been done in v2 yet** — explicitly out of scope per PRD §4. (v1 owns the
  scaling history: ADR-0012/0013, the confirmed ~90k-user `Invalid string length` serialization
  ceiling removed via SQLite + verified at 100k users — but that's the DIFFERENT Node stack and does
  not transfer to v2.)
- Tests run on in-memory SQLite via `StaticPool` (one shared connection for the whole test) — fast
  and Postgres-free; dev/prod run on Postgres.
- **All throttles are in-memory / single-process** (see `security.md`) — the known scaling
  limitation to revisit before any multi-process deploy (a shared store, e.g. Redis). Flagged for
  M9 (hardening) / M11 (launch).
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
- `RateLimitMiddleware` (M9.1) is a per-(IP,bucket) deque sliding window — O(1) amortized per
  request; same single-process caveat as the other throttles → Redis at M11.
