"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { HoursWithOpportunity } from "@/lib/types";

export default function VerifyHoursPage() {
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<HoursWithOpportunity[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load(token: string) {
    api
      .listHours(token)
      .then((data) => setEntries(data as HoursWithOpportunity[]))
      .finally(() => setFetching(false));
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || loading) return;
    load(token);
  }, [loading]);

  async function decide(hoursId: string, action: "approve" | "deny") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setError(null);
    setBusyId(hoursId);
    try {
      await api.verifyHours(hoursId, action, token);
      load(token);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return null;

  if (!user || user.role !== "org") {
    return (
      <main className="mx-auto max-w-md p-8 text-center">
        <p className="text-muted-foreground">Only organization accounts verify hours.</p>
      </main>
    );
  }

  const pending = entries.filter((e) => e.status === "pending" || e.status === "appealed");

  const SOURCE_LABEL: Record<string, string> = { auto: "auto-logged", self: "self-reported", checkin: "check-in" };

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <div>
        <span className="section-tag">Organization</span>
        <h1 className="section-title">Verify Hours</h1>
      </div>

      {fetching && <p className="empty-state">Loading…</p>}
      {!fetching && pending.length === 0 && <div className="empty-state">No hours awaiting verification.</div>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col gap-4">
        {pending.map((entry) => (
          <div key={entry.id} className="opp-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="opp-title">
                  {entry.opportunity.title}
                  {entry.status === "appealed" && <span className="badge badge-pending ml-2">Appealed</span>}
                </h3>
                <p className="opp-org">
                  {entry.hours}h · {SOURCE_LABEL[entry.source] ?? entry.source}
                </p>
                {entry.note && <p className="text-[0.8rem] italic text-muted-foreground">“{entry.note}”</p>}
                {entry.status === "appealed" && entry.appeal_note && (
                  <p className="text-[0.8rem] text-primary">Appeal: {entry.appeal_note}</p>
                )}
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <Button size="sm" disabled={busyId === entry.id} onClick={() => decide(entry.id, "approve")}>
                  Verify
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === entry.id}
                  onClick={() => decide(entry.id, "deny")}
                >
                  Deny
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
