"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY } from "@/lib/auth-context";
import type { Opportunity } from "@/lib/types";

/** Shown to the owning org: generate a per-date check-in code attendees redeem for hours. */
export function OrgCheckinSection({ opp }: { opp: Opportunity }) {
  const [dates, setDates] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (opp.recurrence === "one_time") {
      const d = new Date(opp.start_time).toISOString().slice(0, 10);
      setDates([d]);
      setDate(d);
      return;
    }
    api
      .dateSpots(opp.id)
      .then((spots) => {
        const keys = Object.keys(spots);
        setDates(keys);
        if (keys.length) setDate(keys[0]);
      })
      .catch(() => undefined);
  }, [opp.id, opp.recurrence, opp.start_time]);

  async function generate() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !date) return;
    setError(null);
    setBusy(true);
    try {
      const res = await api.createCheckinCode(opp.id, date, token);
      setCode(res.code);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Check-in codes</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Generate a code and share it at the event — signed-up volunteers redeem it for instantly-verified hours.
        </p>
        <div className="flex gap-2">
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <Button size="sm" onClick={generate} disabled={busy || !date}>
            {busy ? "…" : "Generate"}
          </Button>
        </div>
        {code && (
          <p className="text-sm">
            Code for {date}: <span className="font-mono text-lg font-semibold tracking-widest">{code}</span>
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
