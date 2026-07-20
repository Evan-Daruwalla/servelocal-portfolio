"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";

/** Shown to a signed-in student who isn't yet consent-cleared (pending/declined/
 *  revoked). Lets them resend the guardian email and re-check their status. */
export function ConsentBanner() {
  const { user, refresh } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!user || user.role !== "student") return null;
  const status = user.guardian_consent_status;
  if (status === "not_required" || status === "verified") return null;

  async function resend() {
    setBusy(true);
    setMessage(null);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await api.requestConsent(token ?? "");
      setMessage(res.message);
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : "Couldn't resend the email.");
    } finally {
      setBusy(false);
    }
  }

  const heading =
    status === "pending"
      ? "Waiting on your parent/guardian's approval"
      : status === "declined"
        ? "Your parent/guardian declined approval"
        : "Your parent/guardian's approval was revoked";

  return (
    <div className="w-full max-w-xl rounded-md border border-amber-500/50 bg-amber-500/10 p-4 text-left">
      <p className="text-sm font-medium">{heading}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        You can browse opportunities, but you can&apos;t sign up until a parent or guardian approves
        your account.
        {status === "pending" ? " We emailed them a link." : " Contact support if this was a mistake."}
      </p>
      {status === "pending" && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={resend} disabled={busy}>
            {busy ? "Sending…" : "Resend approval email"}
          </Button>
          <Button variant="outline" onClick={refresh}>
            I&apos;ve been approved. Refresh
          </Button>
        </div>
      )}
      {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
