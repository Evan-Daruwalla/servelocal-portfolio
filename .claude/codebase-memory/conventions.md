# conventions — servelocal-v2

Last updated 2026-07-13.

## Visual / UI standards → `ui.md` (canonical)
Editorial language, the two coexisting visual systems (`.v1` scoped vs shadcn —
don't mix on one page), palette/fonts, the `@layer components` v1 class library,
and the emil-design-eng micro-interaction polish rules all live in **`ui.md`**.
Shared chrome (`components/site-header.tsx`/`site-footer.tsx`) wraps all pages
via `app/layout.tsx`.

## Backend feature slice (in this order)
model (`app/models/x.py` + register in `app/models/__init__.py`) → Alembic revision (autogenerate
then read it) → schema (`app/schemas/x.py`) → route module (`app/api/routes/x.py` + **`include_router`
in `app/api/router.py`**) → tests (`backend/tests/test_x.py`).

## Frontend slice
types in `lib/types.ts` → calls in `lib/api.ts` → page/component → verify in the browser (zero
console errors). `useSearchParams` must sit under a `<Suspense>` boundary or the static build fails
(`/reset` does this). Dynamic route params use `useParams` (no Suspense needed).

## Hard rules
- Response schemas strip secrets (see `security.md`). Students free forever — no plan gate on a
  student feature.
- Editorial visual language: solid color fills, tight border radii, calm/minimal motion; no
  gradient-heavy heroes, no glassmorphism, no bounce. When in doubt, plainer is better.
- Surgical changes only — every changed line traces to the current task; match existing style.
- **Definition of done:** backend `pytest` green (+ new migration up/down/up) AND frontend
  `npm run lint` + `npm run build` clean AND browser-verify UI AND a record entry AND HANDOFF
  workstream row updated if a milestone's status changed.
- Commit after each completed green task (the PRD authorizes it). **NEVER push without Evan.**
- BLOCKED-ON-EVAN (keys/accounts/purchases/legal) is reported, never worked around or faked.

## Verification reality → `testing.md`; status codes → `data.md`
Browser/CDP verification reality (Docker available, CDP screenshot times out,
async React `el.click()`, controlled-input handling, hidden-pane anim freeze) is
canonical in **`testing.md`**; the 402/409/503 status-code contract is in
**`data.md`**. Always record honestly what was actually driven.
