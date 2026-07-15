"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { V1Shell } from "@/components/v1/v1-shell";
import { api } from "@/lib/api";
import type { PublicPortfolio } from "@/lib/types";

export default function PublicPortfolioPage() {
  const params = useParams<{ id: string }>();
  const [pf, setPf] = useState<PublicPortfolio | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "unavailable">("loading");

  useEffect(() => {
    api
      .publicPortfolio(params.id)
      .then((d) => {
        setPf(d);
        setState("ok");
      })
      .catch(() => setState("unavailable"));
  }, [params.id]);

  if (state === "loading") {
    return (
      <V1Shell>
        <div className="section" style={{ maxWidth: 680 }}>
          <div className="loading"><div className="spinner" /><div>Loading…</div></div>
        </div>
      </V1Shell>
    );
  }

  if (state === "unavailable" || !pf) {
    return (
      <V1Shell>
        <div className="section" style={{ maxWidth: 620, textAlign: "center" }}>
          <div className="empty">
            <div className="empty-icon">🔒</div>
            This portfolio is private or doesn&apos;t exist. <Link href="/discover">Browse opportunities</Link> instead.
          </div>
        </div>
      </V1Shell>
    );
  }

  const statCard = (n: number, label: string) => (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
      <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--green)" }}>{n}</div>
      <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>{label}</div>
    </div>
  );

  return (
    <V1Shell>
      <div className="section" style={{ maxWidth: 680 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--dark)", marginBottom: 4 }}>{pf.name} — Verified Service Transcript</h2>
          <p style={{ color: "var(--muted)", fontSize: ".88rem" }}>Every hour below was verified by the hosting organization.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28, textAlign: "center" }}>
          {statCard(pf.verified_hours, "Verified Hours")}
          {statCard(pf.organizations, "Organizations")}
          {statCard(pf.awards.length, "Awards Earned")}
        </div>

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: ".92rem", color: "var(--dark)", marginBottom: 10 }}>Hours by Organization</h4>
          <table className="tbl" style={{ fontSize: ".85rem" }}>
            <tbody>
              {pf.hours_by_org.length ? pf.hours_by_org.map((o) => (
                <tr key={o.org_name}>
                  <td style={{ fontWeight: 500 }}>{o.org_name}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "var(--green)" }}>{o.hours} hrs</td>
                </tr>
              )) : (
                <tr><td style={{ color: "var(--muted)" }}>No verified hours yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: ".92rem", color: "var(--dark)", marginBottom: 10 }}>🏆 Awards</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {pf.awards.length ? pf.awards.map((a) => (
              <span key={a.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--green-pale)", border: "1px solid var(--green-mid)", padding: "6px 12px", borderRadius: 100, fontSize: ".78rem", fontWeight: 600, color: "var(--green)" }}>🏆 {a.name}</span>
            )) : (
              <span style={{ color: "var(--muted)", fontSize: ".83rem" }}>No awards yet.</span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
          <button className="btn-s" style={{ padding: "10px 20px" }} onClick={() => window.print()}>🖨 Print</button>
        </div>
      </div>
    </V1Shell>
  );
}
