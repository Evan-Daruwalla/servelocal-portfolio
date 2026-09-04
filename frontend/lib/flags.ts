// Build-time feature flags (NEXT_PUBLIC_* — inlined by Next at build time).

// Gates the Pro upgrade surface (ADR 0002 launch-UI treatment (i), Evan
// 2026-08-31). Default OFF: unset shows "launching soon" and hides the
// checkout path, which is the safe state when the backend has no Stripe keys
// (checkout would 503). Set to "true" only when live billing is enabled —
// ADR 0002 §Follow-ups #3 lists what must be true first.
export const BILLING_LIVE = process.env.NEXT_PUBLIC_BILLING_LIVE === "true";
