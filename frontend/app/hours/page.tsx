"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { ApplicationWithOpportunity, HoursWithOpportunity, MyAwards } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending verification",
  verified: "Verified",
  denied: "Denied",
  appealed: "Appeal under review",
};
const SOURCE_LABEL: Record<string, string> = { auto: "Auto-logged", self: "Self-reported", checkin: "Check-in" };
const STATUS_PILL: Record<string, string> = {
  pending: "sp-pending",
  verified: "sp-verified",
  denied: "sp-denied",
  appealed: "sp-waitlisted",
};

export default function MyHoursPage() {
  const { user, loading } = useAuth();
  const [entries, setEntries] = useState<HoursWithOpportunity[]>([]);
  const [awards, setAwards] = useState<MyAwards | null>(null);
  const [apps, setApps] = useState<ApplicationWithOpportunity[]>([]);
  const [fetching, setFetching] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  // self-report + check-in form state
  const [srOpp, setSrOpp] = useState("");
  const [srHours, setSrHours] = useState(1);
  const [srNote, setSrNote] = useState("");
  const [ciOpp, setCiOpp] = useState("");
  const [ciCode, setCiCode] = useState("");
  const [formMsg, setFormMsg] = useState<string | null>(null);

  function refresh() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    api
      .autoLogHours(token)
      .catch(() => undefined)
      .then(() => Promise.all([api.listHours(token), api.myAwards(token), api.myApplications(token)]))
      .then(([hoursData, awardsData, appsData]) => {
        setEntries(hoursData as HoursWithOpportunity[]);
        setAwards(awardsData);
        setApps(appsData);
      })
      .finally(() => setFetching(false));
  }

  useEffect(() => {
    if (!loading) refresh();
  }, [loading]);

  async function appeal(id: string) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setBusyId(id);
    try {
      await api.appealHours(id, "Requesting another review.", token);
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function submitSelfReport(e: FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !srOpp) return;
    setFormMsg(null);
    try {
      await api.selfReportHours({ opportunity_id: srOpp, hours: srHours, note: srNote || undefined }, token);
      setSrNote("");
      setFormMsg("Hours submitted for verification.");
      refresh();
    } catch (err) {
      setFormMsg(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  async function submitCheckin(e: FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !ciOpp || !ciCode) return;
    setFormMsg(null);
    try {
      await api.redeemCheckin(ciOpp, ciCode.trim().toUpperCase(), token);
      setCiCode("");
      setFormMsg("Checked in. Hours verified!");
      refresh();
    } catch (err) {
      setFormMsg(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  if (loading) return null;
  if (!user || user.role !== "student") {
    return (
      <main className="mx-auto max-w-md p-8 text-center">
        <p className="text-muted-foreground">Only student accounts have hours.</p>
      </main>
    );
  }

  const oppOptions = apps.map((a) => ({ id: a.opportunity.id, title: a.opportunity.title }));

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <span className="section-tag">Your activity</span>
        <h1 className="section-title">My Hours</h1>
      </div>

      {awards && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Awards: {awards.verified_hours} verified hours</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1 text-sm">
            {awards.earned.length > 0 ? (
              awards.earned.map((a) => (
                <p key={a.id} className="text-primary">
                  ✓ {a.name}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">No awards earned yet.</p>
            )}
            {awards.next && (
              <p className="text-muted-foreground">
                Next: {awards.next.name} at {awards.next.hours}h ({awards.next.hours - awards.verified_hours}h to go)
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {oppOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Log or check in</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <form onSubmit={submitCheckin} className="flex flex-col gap-2">
              <Label>Check in with a code</Label>
              <div className="flex gap-2">
                <select
                  value={ciOpp}
                  onChange={(e) => setCiOpp(e.target.value)}
                  className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">Opportunity…</option>
                  {oppOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title}
                    </option>
                  ))}
                </select>
                <Input
                  value={ciCode}
                  onChange={(e) => setCiCode(e.target.value)}
                  placeholder="CODE"
                  className="w-28 uppercase"
                />
                <Button type="submit" size="sm" disabled={!ciOpp || !ciCode}>
                  Check in
                </Button>
              </div>
            </form>

            <form onSubmit={submitSelfReport} className="flex flex-col gap-2 border-t pt-4">
              <Label>Self-report hours</Label>
              <div className="flex gap-2">
                <select
                  value={srOpp}
                  onChange={(e) => setSrOpp(e.target.value)}
                  className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">Opportunity…</option>
                  {oppOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title}
                    </option>
                  ))}
                </select>
                <Input
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={srHours}
                  onChange={(e) => setSrHours(Number(e.target.value))}
                  className="w-20"
                />
                <Button type="submit" size="sm" disabled={!srOpp}>
                  Submit
                </Button>
              </div>
              <Input value={srNote} onChange={(e) => setSrNote(e.target.value)} placeholder="Note (optional)" />
            </form>
            {formMsg && <p className="text-sm text-muted-foreground">{formMsg}</p>}
          </CardContent>
        </Card>
      )}

      {fetching && <p className="empty-state">Loading…</p>}
      {!fetching && entries.length === 0 && (
        <div className="empty-state">No hours logged yet. They log automatically once an event passes.</div>
      )}

      <div className="flex flex-col gap-4">
        {entries.map((entry) => (
          <div key={entry.id} className="opp-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="opp-title">{entry.opportunity.title}</h3>
                <p className="opp-org">
                  {entry.hours}h · {SOURCE_LABEL[entry.source] ?? entry.source}
                </p>
                {entry.status === "denied" && entry.deny_note && (
                  <p className="text-[0.78rem] text-muted-foreground">Reason: {entry.deny_note}</p>
                )}
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-2">
                <span className={`status-pill ${STATUS_PILL[entry.status] ?? "sp-pending"}`}>
                  {STATUS_LABEL[entry.status] ?? entry.status}
                </span>
                {entry.status === "denied" && !entry.appealed && (
                  <Button size="sm" variant="outline" disabled={busyId === entry.id} onClick={() => appeal(entry.id)}>
                    Appeal
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
