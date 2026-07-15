# ServeLocal Frontend (v2)

Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui. The web client
for the ServeLocal v2 rewrite; talks to the FastAPI backend in the sibling `../backend`.

> **Status: core domain + M2–M4 shipped** (updated 2026-07-08). Auth (incl. password reset),
> Discover + opportunity posting (one-time, weekly, monthly), applying/subscribing with
> exclude-dates and waitlists, hours (auto-log per occurrence + self-report + appeals +
> check-in codes + verify), and awards all work end to end against the backend. See
> `backend/README.md` for the exact scope status per slice (no guardian consent, billing,
> or MFA yet; notifications/messaging are early-thin).

## Stack
- **Next.js 15** (App Router, React Server Components)
- **React 19** + **TypeScript**
- **Tailwind CSS 3** (shadcn design tokens in `app/globals.css`)
- **shadcn/ui** — copy-in component library (`components/ui/`)
- **lucide-react** icons

## Quick start
```bash
npm install
cp .env.example .env.local        # point NEXT_PUBLIC_API_URL at the backend
npm run dev                        # http://localhost:3000
```

## Adding shadcn components
The registry is configured in `components.json`. Add components as needed:
```bash
npx shadcn@latest add button card input dialog
```
They land in `components/ui/` and import the `cn()` helper from `@/lib/utils`.

## Layout
```
app/
  layout.tsx           # root layout — wraps children in AuthProvider
  page.tsx             # home: nav links by role, or Log in / Sign up
  login/page.tsx
  register/page.tsx    # includes a student/org role toggle
  discover/page.tsx    # public opportunity browse + category filter
  opportunities/
    [id]/page.tsx       # opportunity detail + student Apply button
    new/page.tsx         # org-only post form
  applications/page.tsx # student: my applications + status
  applicants/page.tsx   # org: approve/reject applicants
  hours/page.tsx         # student: auto-logs on load, lists hours, shows awards progress
  verify-hours/page.tsx  # org: verify/deny pending hours
  globals.css    # Tailwind directives + shadcn CSS variables (light/dark)
components/ui/    # shadcn components — button, input, label, card
lib/
  api.ts           # typed fetch wrapper around the backend (all routes)
  auth-context.tsx # AuthProvider + useAuth(): token in localStorage (TOKEN_KEY, exported), current user
  types.ts         # types matching the backend schemas
  utils.ts         # cn() class-merge helper
components.json   # shadcn config
tailwind.config.ts
```

## Auth
`useAuth()` (from `lib/auth-context.tsx`) exposes `user`, `loading`, `login()`,
`register()`, `logout()`. On mount it reads the token from `localStorage` and calls
`/auth/me` to restore the session; a failed/expired token is cleared silently. Pages
outside the auth context (e.g. the opportunity-apply button) read the token directly via
the exported `TOKEN_KEY` constant.

## Notes
- Uses Tailwind v3 for maximum ecosystem stability. To move to Tailwind v4 later,
  re-run `npx shadcn@latest init` and follow its migration.
- Deployment (future): static/SSR on Vercel, or containerize for AWS Amplify/App Runner,
  GCP Cloud Run, or Azure Static Web Apps / Container Apps. `NEXT_PUBLIC_API_URL` is the
  only required build/runtime var.
