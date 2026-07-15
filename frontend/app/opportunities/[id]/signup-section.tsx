"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY } from "@/lib/auth-context";
import type { Opportunity } from "@/lib/types";

const STATUS_MESSAGE: Record<string, string> = {
  approved: "You're signed up!",
  pending: "Application submitted — pending approval.",
  waitlisted: "You're on the waitlist — we'll sign you up if a spot frees.",
};

export function SignupSection({ opp, onChange }: { opp: Opportunity; onChange: () => void }) {
  const recurring = opp.recurrence !== "one_time";
  const [dateSpots, setDateSpots] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<"all_dates" | "single_date">("all_dates");
  const [singleDate, setSingleDate] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (recurring) api.dateSpots(opp.id).then(setDateSpots).catch(() => undefined);
  }, [opp.id, recurring]);

  async function apply() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setError(null);
    setSubmitting(true);
    try {
      const body = recurring
        ? { subscription_type: mode, ...(mode === "single_date" ? { single_date: singleDate } : {}) }
        : undefined;
      const app = await api.apply(opp.id, token, body);
      setStatus(app.status);
      onChange();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status) {
    return <p className="text-sm font-medium text-primary">{STATUS_MESSAGE[status] ?? status}</p>;
  }

  if (!recurring) {
    const full = opp.spots_remaining <= 0;
    return (
      <div className="flex flex-col gap-2">
        <Button onClick={apply} disabled={submitting}>
          {submitting ? "Applying…" : full ? "Join waitlist" : "Apply"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  const dates = Object.keys(dateSpots);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="signup" checked={mode === "all_dates"} onChange={() => setMode("all_dates")} />
          Subscribe to all dates
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="signup"
            checked={mode === "single_date"}
            onChange={() => setMode("single_date")}
          />
          Sign up for a single date
        </label>
      </div>
      {mode === "single_date" && (
        <select
          value={singleDate}
          onChange={(e) => setSingleDate(e.target.value)}
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
        >
          <option value="">Choose a date…</option>
          {dates.map((d) => (
            <option key={d} value={d} disabled={dateSpots[d] <= 0}>
              {d} ({dateSpots[d]} left)
            </option>
          ))}
        </select>
      )}
      <Button onClick={apply} disabled={submitting || (mode === "single_date" && !singleDate)}>
        {submitting ? "Applying…" : "Apply"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {dates.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Upcoming dates: {dates.slice(0, 5).map((d) => `${d} (${dateSpots[d]} left)`).join(" · ")}
        </p>
      )}
    </div>
  );
}
