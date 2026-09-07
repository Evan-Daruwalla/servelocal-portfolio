"use client";

import { useEffect, useState } from "react";

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
      // Was `.catch(() => undefined)`: a failed dateSpots left dates=[] and date="",
      // which silently disables Generate below with no explanation — the org sees a
      // dead control for a real event happening that day (audit 2026-09-02).
      .catch(() => setError("Couldn't load this listing's dates. Reload to try again."));
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
    <div className="modal-card">
      <div className="mbody" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 className="mtitle" style={{ marginBottom: 0 }}>Check-in codes</h2>
        <p className="progress-label" style={{ marginTop: 0 }}>
          Generate a code and share it at the event. Signed-up volunteers redeem it for instantly-verified hours.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <select
            className="fsel"
            style={{ flex: 1 }}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <button
            className="btn-p"
            type="button"
            onClick={generate}
            disabled={busy || !date}
            style={{ padding: "9px 18px", fontSize: ".83rem" }}
          >
            {busy ? "…" : "Generate"}
          </button>
        </div>
        {code && (
          <p style={{ fontSize: ".84rem", color: "var(--text)", margin: 0 }}>
            Code for {date}:{" "}
            <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "1.05rem", fontWeight: 700, letterSpacing: ".18em", color: "var(--green)" }}>
              {code}
            </span>
          </p>
        )}
        {error && <p className="ferr" style={{ marginBottom: 0 }}>{error}</p>}
      </div>
    </div>
  );
}
