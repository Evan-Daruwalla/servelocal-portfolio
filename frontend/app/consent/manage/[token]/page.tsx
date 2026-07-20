"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError, api } from "@/lib/api";
import type { ConsentManageContext } from "@/lib/types";

export default function ConsentManagePage() {
  const params = useParams<{ token: string }>();
  const [ctx, setCtx] = useState<ConsentManageContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api
      .manageContext(params.token)
      .then(setCtx)
      .catch((err) => setError(err instanceof ApiError ? err.message : "This link is invalid."));
  }, [params.token]);

  async function revoke() {
    setBusy(true);
    setError(null);
    try {
      const res = await api.revokeConsent(params.token);
      setDone(res.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Manage your approval</CardTitle>
          <CardDescription>You can revoke your consent at any time.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {done ? (
            <p className="text-sm">{done}</p>
          ) : ctx ? (
            <>
              <p className="text-sm">
                Approval for{" "}
                <span className="font-medium">
                  {ctx.student_first_name} {ctx.student_last_initial}
                  {ctx.student_last_initial ? "." : ""}
                </span>
                . Current status: <span className="font-medium">{ctx.status}</span>.
              </p>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {ctx.status === "revoked" ? (
                <p className="text-sm text-muted-foreground">You&apos;ve already revoked approval.</p>
              ) : !confirming ? (
                <Button variant="outline" onClick={() => setConfirming(true)}>
                  Revoke consent
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button onClick={revoke} disabled={busy}>
                    {busy ? "Revoking…" : "Yes, revoke"}
                  </Button>
                  <Button variant="outline" onClick={() => setConfirming(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
