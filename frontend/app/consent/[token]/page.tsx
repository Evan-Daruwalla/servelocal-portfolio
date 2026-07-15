"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError, api } from "@/lib/api";
import type { ConsentContext } from "@/lib/types";

export default function ConsentDecisionPage() {
  const params = useParams<{ token: string }>();
  const [ctx, setCtx] = useState<ConsentContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .consentContext(params.token)
      .then(setCtx)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "This link is invalid or has expired.")
      );
  }, [params.token]);

  async function decide(decision: "approve" | "decline") {
    setBusy(true);
    setError(null);
    try {
      const res = await api.decideConsent(params.token, decision);
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
          <CardTitle>Parent / guardian approval</CardTitle>
          <CardDescription>ServeLocal helps students find volunteer opportunities.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {done ? (
            <p className="text-sm">{done}</p>
          ) : ctx ? (
            <>
              <p className="text-sm">
                <span className="font-medium">
                  {ctx.student_first_name} {ctx.student_last_initial}
                  {ctx.student_last_initial ? "." : ""}
                </span>{" "}
                listed you as their parent or guardian. They need your approval before they can sign
                up for any opportunity. You can revoke this at any time.
              </p>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex gap-3">
                <Button onClick={() => decide("approve")} disabled={busy}>
                  Approve
                </Button>
                <Button variant="outline" onClick={() => decide("decline")} disabled={busy}>
                  Decline
                </Button>
              </div>
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
