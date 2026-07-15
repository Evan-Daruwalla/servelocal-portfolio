# conventions — servelocal-v2

Last updated 2026-07-13.

## TWO visual systems coexist (2026-07-13) — pick by route
- **`.v1` exact-copy** (the 13 v1 screens): render inside `<V1Shell>`; style from
  `app/v1.css` (scoped `.v1` classes); add the route to `lib/v1-routes.ts`. Full mechanics in
  architecture.md. This is the current default for any screen being made to match v1 exactly.
- **shadcn-token pages (M12):** the `@layer components` classes below. Non-`isV1Route` routes.
- Do NOT mix the two on one page. When converting a page to exact-v1, move it fully into `<V1Shell>`
  and add it to `V1_ROUTES`.

## UI polish conventions (2026-07-13, emil-design-eng + research brief)
Brief: `docs/research/2026-07-13_ui-professional-polish.md`. Applied in `v1.css` + shadcn `Button`:
- Every pressable gets `scale(.97)` on `:active` (~160ms `--ease-out`), gated
  `@media (prefers-reduced-motion: no-preference)`. Never `transition: all` — list exact properties.
- Keyboard focus: `.v1 :is(a,button,summary,[role=button]):focus-visible` → 2px green outline, 2px
  offset (white on dark pledge/footer bands for contrast). When overriding a `:is()` focus rule,
  MATCH the base selector's `:is()` list or specificity loses (bit me: footer rings went
  green-on-green until the override's list was widened).
- `prefers-reduced-motion: reduce` pauses the marquee; keep color/opacity feedback.
- Entrance = `@starting-style` (fade + small rise, ease-out; survives Next's CSS minifier); list
  stagger = keyframes with `backwards` fill (so an un-run animation still shows content — never leave
  content at persistent `opacity:0`). Hover-lift gated `(hover:hover) and (pointer:fine)` too.

## Frontend visual system = v1 parity (M12, 2026-07-12)
The frontend deliberately matches v1's editorial look (`../ServeLocal website/public/index.html`
`<style>` block is the design source of truth). Foundation in `app/globals.css` `:root`: deep green
`#175c41` (`--primary`), gold `#c9a84c` (`--gold`), warm off-white `#f7f7f1` bg, 6px `--radius`;
fonts Fraunces (`--font-display`, all headings via a base rule) + DM Sans (`--font-sans`) through
`next/font`. **Reusable v1 component classes live in a `@layer components` block in globals.css** —
use these, don't reinvent per page: `.opp-card` (card + left accent bar), `.badge`+`.badge-*`,
`.status-pill`+`.sp-*`, `.section-tag`/`.section-title`, `.form-box`, `.field-label`, `.tbl`,
`.pill` (category buttons), `.empty-state`. The shared `components/ui/label.tsx` is already v1's
uppercase micro-label — every `<Label>` inherits it. Shared chrome: `components/site-header.tsx` +
`site-footer.tsx` wrap all pages via `app/layout.tsx`. Editorial rules still bind (no gradients/
glass/bounce). Fonts self-host at BUILD time via a Google fetch → an offline `docker build` needs
`next/font/local`.

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

## Verification reality (record honestly)
Verify writes via the real API / pytest; when a browser click-through wasn't driven, SAY SO.
- **Docker IS available in the dev session (2026-07-13)** — run the real stack and verify against it
  (`docker compose up -d`; rebuild web/api after changes). Set a JWT in `localStorage` under
  `servelocal_token` to verify an authed screen.
- **The CDP screenshot tool times out** (persistent) — verify via `javascript_tool` computed-style
  checks + `read_page` a11y tree + zero-console-errors, not images.
- **Plain `el.click()` DOES reach React handlers** for buttons/links (2026-07-13, e.g. the org Verify
  button + tab switches worked) — but the re-render is async, so read the result in a SEPARATE
  `javascript_tool` call, not the same one. Controlled INPUTS still ignore synthetic `.value` sets
  (use `form_input`/fiber props). CSS animations: the pane's background tab is `visibility:hidden` so
  clocks freeze at t=0 — fast-forward with `getAnimations().forEach(a=>a.finish())` (see gotchas.md).
- Status-code conventions: **402** = needs a paid plan (listing cap, featuring on free), **409** =
  conflict with existing state (featured cap, already-pro), **503** = integration not configured.
