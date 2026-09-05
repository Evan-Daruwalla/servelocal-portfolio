// Build-time feature flags (NEXT_PUBLIC_* — inlined by Next at build time).

// Gates the Pro upgrade surface (ADR 0002 launch-UI treatment (i), Evan
// 2026-08-31). Default OFF: unset shows "launching soon" and hides the
// checkout path, which is the safe state when the backend has no Stripe keys
// (checkout would 503). Set to "true" only when live billing is enabled —
// ADR 0002 §Follow-ups #3 lists what must be true first.
export const BILLING_LIVE = process.env.NEXT_PUBLIC_BILLING_LIVE === "true";

// Hides the "pending legal review / not yet in effect" banner on /terms and
// /privacy. Default OFF: unset shows the banner, which is the safe state —
// an un-reviewed document should say so.
//
// This is the FRONTEND half of the backend's LEGAL_SIGNOFF_COMPLETE boot guard
// (app/core/config.py). They were separate until 2026-09-03: production refused
// to boot without the backend flag, so launching REQUIRED setting it, and setting
// it left both pages still telling the user in a gold box that agreeing to them
// created no binding obligations — while registration forced that agreement
// (audit finding F1, pre-mortem T2). Set BOTH at launch, or neither.
export const LEGAL_SIGNOFF_COMPLETE =
  process.env.NEXT_PUBLIC_LEGAL_SIGNOFF_COMPLETE === "true";
