"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { V1Shell } from "@/components/v1/v1-shell";
import { api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { HoursWithOpportunity, MyAwards } from "@/lib/types";

export default function PortfolioPage() {
  const { user, loading } = useAuth();
  const [hours, setHours] = useState<HoursWithOpportunity[]>([]);
  const [awards, setAwards] = useState<MyAwards | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (loading || !user || user.role !== "student" || !token) return;
    setIsPublic(user.portfolio_public);
    api.listHours(token).then(setHours).catch(() => {});
    api.myAwards(token).then(setAwards).catch(() => {});
  }, [loading, user]);

  async function togglepublic(next: boolean) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setIsPublic(next); // optimistic
    try {
      await api.updateMe(token, { portfolio_public: next });
    } catch {
      setIsPublic(!next); // revert on failure
    }
  }

  function copyLink() {
    if (!user) return;
    navigator.clipboard?.writeText(`${window.location.origin}/portfolio/${user.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return null;
  if (!user || user.role !== "student") {
    return (
      <V1Shell>
        <div className="section" style={{ maxWidth: 620, textAlign: "center" }}>
          <div className="empty">
            <div className="empty-icon">🔒</div>
            Your verified-service transcript lives here. <Link href="/login">Log in</Link> as a student to view it.
          </div>
        </div>
      </V1Shell>
    );
  }

  const verified = hours.filter((h) => h.status === "verified");
  const byOrg = new Map<string, number>();
  for (const h of verified) byOrg.set(h.opportunity.org_name, (byOrg.get(h.opportunity.org_name) ?? 0) + h.hours);
  const orgRows = [...byOrg.entries()].sort((a, b) => b[1] - a[1]);
  const totalHours = awards?.verified_hours ?? verified.reduce((s, h) => s + h.hours, 0);
  const earned = awards?.earned ?? [];

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
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--dark)", marginBottom: 4 }}>{user.full_name || "Your"} — Verified Service Transcript</h2>
          <p style={{ color: "var(--muted)", fontSize: ".88rem" }}>Every hour below was verified by the hosting organization.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28, textAlign: "center" }}>
          {statCard(totalHours, "Verified Hours")}
          {statCard(byOrg.size, "Organizations")}
          {statCard(earned.length, "Awards Earned")}
        </div>

        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: ".92rem", color: "var(--dark)", marginBottom: 10 }}>Hours by Organization</h4>
          <table className="tbl" style={{ fontSize: ".85rem" }}>
            <tbody>
              {orgRows.length ? orgRows.map(([org, hrs]) => (
                <tr key={org}>
                  <td style={{ fontWeight: 500 }}>{org}</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "var(--green)" }}>{hrs} hrs</td>
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
            {earned.length ? earned.map((a) => (
              <span key={a.id} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--green-pale)", border: "1px solid var(--green-mid)", padding: "6px 12px", borderRadius: 100, fontSize: ".78rem", fontWeight: 600, color: "var(--green)" }}>🏆 {a.name}</span>
            )) : (
              <span style={{ color: "var(--muted)", fontSize: ".83rem" }}>No awards yet — they unlock automatically as verified hours add up.</span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          <button className="btn-s" style={{ padding: "10px 20px" }} onClick={() => window.print()}>🖨 Print</button>
          {isPublic && <button className="btn-s" style={{ padding: "10px 20px" }} onClick={copyLink}>{copied ? "Copied ✓" : "🔗 Copy Public Link"}</button>}
        </div>

        <div className="form-box" style={{ maxWidth: 520, margin: "22px auto 0" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
            <input type="checkbox" checked={isPublic} onChange={(e) => togglepublic(e.target.checked)} style={{ width: 15, height: 15, marginTop: 3, accentColor: "var(--green)" }} />
            <span style={{ fontSize: ".85rem", color: "var(--text)" }}>
              <strong>Make my transcript public.</strong> Anyone with the link can view your verified hours,
              organizations, and awards — good for college and scholarship applications. Off by default.
            </span>
          </label>
        </div>
      </div>
    </V1Shell>
  );
}
