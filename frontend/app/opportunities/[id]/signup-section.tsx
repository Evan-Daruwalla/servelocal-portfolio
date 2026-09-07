"use client";

import { useEffect, useState } from "react";

import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY } from "@/lib/auth-context";
import { APPLICATION_STATUS_MESSAGE } from "@/lib/status";
import type { Opportunity } from "@/lib/types";

export function SignupSection({ opp, onChange }: { opp: Opportunity; onChange: () => void }) {
  const recurring = opp.recurrence !== "one_time";
  const [dateSpots, setDateSpots] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<"all_dates" | "single_date">("all_dates");
  const [singleDate, setSingleDate] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Was `.catch(() => undefined)`: an empty date list is a REAL state (no dates
    // left), so swallowing the failure made "couldn't load" indistinguishable from
    // it. "Subscribe to all dates" still works either way (audit 2026-09-02).
    if (recurring)
      api
        .dateSpots(opp.id)
        .then(setDateSpots)
        .catch(() => setError("Couldn't load available dates. You can still subscribe to all dates."));
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
    return <p className="progress-label" style={{ color: "var(--green)", fontWeight: 600 }}>{APPLICATION_STATUS_MESSAGE[status] ?? status}</p>;
  }

  if (!recurring) {
    const full = opp.spots_remaining <= 0;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
        <button className="btn-p" type="button" onClick={apply} disabled={submitting}>
          {submitting ? "Applying…" : full ? "Join waitlist" : "Apply"}
        </button>
        {error && <p className="ferr" style={{ marginBottom: 0 }}>{error}</p>}
      </div>
    );
  }

  const dates = Object.keys(dateSpots);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {/* `.fr label` is uppercase-tracked and block — wrong for a radio row, so
            these keep inline layout and take the body font size directly. */}
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".84rem" }}>
          <input type="radio" name="signup" checked={mode === "all_dates"} onChange={() => setMode("all_dates")} />
          Subscribe to all dates
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".84rem" }}>
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
          className="fsel"
          value={singleDate}
          onChange={(e) => setSingleDate(e.target.value)}
        >
          <option value="">Choose a date…</option>
          {dates.map((d) => (
            <option key={d} value={d} disabled={dateSpots[d] <= 0}>
              {d} ({dateSpots[d]} left)
            </option>
          ))}
        </select>
      )}
      <button
        className="btn-p"
        type="button"
        onClick={apply}
        disabled={submitting || (mode === "single_date" && !singleDate)}
      >
        {submitting ? "Applying…" : "Apply"}
      </button>
      {error && <p className="ferr" style={{ marginBottom: 0 }}>{error}</p>}
      {dates.length > 0 && (
        <p className="progress-label">
          Upcoming dates: {dates.slice(0, 5).map((d) => `${d} (${dateSpots[d]} left)`).join(" · ")}
        </p>
      )}
    </div>
  );
}
