"use client";

import { BadgeCheck, Flag, Landmark } from "lucide-react";
import { useEffect, useState } from "react";

import { V1Shell } from "@/components/v1/v1-shell";
import { api } from "@/lib/api";

type Tab = "pending" | "all-orgs" | "reports";

const TABS: { id: Tab; label: string }[] = [
  { id: "pending", label: "Pending Orgs" },
  { id: "all-orgs", label: "All Orgs" },
  { id: "reports", label: "Reports" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [stats, setStats] = useState({ opps: 0, orgs: 0, students: 0 });

  useEffect(() => {
    Promise.all([api.listOpportunities({}), api.leaderboard()])
      .then(([opps, board]) => {
        setStats({ opps: opps.length, orgs: new Set(opps.map((o) => o.org_id)).size, students: board.length });
      })
      .catch(() => {});
  }, []);

  return (
    <V1Shell>
      <div className="section">
        <div className="sec-tag">Admin</div>
        <h2 className="sec-title" style={{ marginBottom: 24 }}>ServeLocal Dashboard</h2>

        {/* Honest banner: v2 has no admin moderation backend yet. */}
        <div className="ferr" style={{ display: "block", background: "#fff8e1", borderColor: "#ffc107", color: "#795548", marginBottom: 24 }}>
          Moderation tools (org approval, reports, audit log) are not yet ported to the v2 backend. This
          screen mirrors v1&apos;s admin layout and shows the read-only platform snapshot below.
        </div>

        <div className="admin-grid">
          <div className="admin-stat"><div className="admin-stat-num">{stats.opps}</div><div className="admin-stat-label">Opportunities</div></div>
          <div className="admin-stat"><div className="admin-stat-num">{stats.orgs}</div><div className="admin-stat-label">Organizations</div></div>
          <div className="admin-stat"><div className="admin-stat-num">{stats.students}</div><div className="admin-stat-label">Ranked Students</div></div>
          <div className="admin-stat"><div className="admin-stat-num">—</div><div className="admin-stat-label">Pending Review</div></div>
        </div>

        <div className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`tab${tab === t.id ? " on" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        <div className="tab-panel on">
          {tab === "pending" && (
            <div className="empty"><div className="empty-icon"><BadgeCheck size={40} strokeWidth={1.75} aria-hidden /></div>Org approval queue requires the v2 admin backend (org review status + approve/reject endpoints). Not yet built.</div>
          )}
          {tab === "all-orgs" && (
            <div className="empty"><div className="empty-icon"><Landmark size={40} strokeWidth={1.75} aria-hidden /></div>The full organization directory requires an admin-scoped listing endpoint in v2. Not yet built.</div>
          )}
          {tab === "reports" && (
            <div className="empty"><div className="empty-icon"><Flag size={40} strokeWidth={1.75} aria-hidden /></div>User reports &amp; the tamper-evident audit log require the v2 admin backend. Not yet built.</div>
          )}
        </div>
      </div>
    </V1Shell>
  );
}
