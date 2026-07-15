"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { V1Shell } from "@/components/v1/v1-shell";
import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { ApplicationWithOpportunity, HoursWithOpportunity, Opportunity } from "@/lib/types";

const CAT_EMOJI: Record<string, string> = {
  Education: "📚", Environment: "🌱", Health: "🏥", Animals: "🐾",
  "Food & Hunger": "🍎", "Arts & Culture": "🎨", Community: "🤝", STEM: "🔬", Agriculture: "🌾",
};
const CAT_BG: Record<string, string> = {
  Education: "#eef4ff", Environment: "#e8f5ef", Health: "#fdecef", Animals: "#fef3e0",
  "Food & Hunger": "#fef2f2", "Arts & Culture": "#f5edff", Community: "#e8f5ef", STEM: "#fdf5e0", Agriculture: "#eef7e6",
};
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Tab = "listings" | "analytics" | "calendar" | "applicants" | "hours" | "history" | "profile";
type Audience = "all" | "approved" | "pending";

const TABS: { id: Tab; label: string }[] = [
  { id: "listings", label: "📋 My Listings" },
  { id: "analytics", label: "📈 Analytics" },
  { id: "calendar", label: "📅 Calendar" },
  { id: "applicants", label: "👥 Applicants" },
  { id: "hours", label: "✅ Verify Hours" },
  { id: "history", label: "🗂️ Listing History" },
  { id: "profile", label: "🏛️ Org Profile" },
];

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// Module-scope (stable identity) so useMemo deps stay honest — see [opps, nowMs].
const isRecurring = (o: Opportunity) => o.recurrence !== "one_time";
const isExpired = (o: Opportunity, nowMs: number) =>
  !isRecurring(o) && !!o.end_time && new Date(o.end_time).getTime() < nowMs;

export default function OrgDashboardPage() {
  const { user, logout, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("listings");
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [apps, setApps] = useState<ApplicationWithOpportunity[]>([]);
  const [hours, setHours] = useState<HoursWithOpportunity[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Broadcast composer state.
  const [msgOpp, setMsgOpp] = useState<string>("");
  const [msgBody, setMsgBody] = useState("");
  const [msgAudience, setMsgAudience] = useState<Audience>("all");
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState<string | null>(null);

  // Profile form state.
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [savedProfile, setSavedProfile] = useState(false);

  function refresh() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !user) return;
    api.myOpportunities(token).then(setOpps).catch(() => {});
    api.orgApplications(token).then(setApps).catch(() => {});
    api.listHours(token).then(setHours).catch(() => {});
  }

  useEffect(() => {
    if (loading || !user) return;
    setEmailNotifs(user.email_notifications);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const now = new Date();
  const nowMs = now.getTime();
  const activeOpps = useMemo(() => opps.filter((o) => !isExpired(o, nowMs)), [opps, nowMs]);
  const historyOpps = useMemo(
    () => opps.filter((o) => isExpired(o, nowMs)).sort((a, b) => +new Date(b.end_time) - +new Date(a.end_time)),
    [opps, nowMs],
  );
  const pending = apps.filter((a) => a.status === "pending");

  // Month grid for the calendar tab.
  const gridStart = new Date(now.getFullYear(), now.getMonth(), 1);
  gridStart.setDate(1 - gridStart.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });

  async function decide(id: string, action: "approve" | "reject") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setBusyId(id);
    setError(null);
    try {
      await api.decideApplication(id, action, token);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  }

  async function verify(id: string, action: "approve" | "deny") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setBusyId(id);
    setError(null);
    try {
      await api.verifyHours(id, action, token);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFeature(o: Opportunity) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setBusyId(o.id);
    try {
      await api.setFeatured(o.id, !o.featured, token);
      refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update the listing.");
    } finally {
      setBusyId(null);
    }
  }

  async function sendBroadcast() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !msgOpp || !msgBody.trim()) return;
    setBroadcasting(true);
    setBroadcastMsg(null);
    try {
      const { sent } = await api.broadcast(msgOpp, msgBody.trim(), msgAudience, token);
      setBroadcastMsg(`Sent to ${sent} applicant${sent === 1 ? "" : "s"}.`);
      setMsgBody("");
    } catch (err) {
      setBroadcastMsg(err instanceof ApiError ? err.message : "Failed to send.");
    } finally {
      setBroadcasting(false);
    }
  }

  async function saveProfile() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    try {
      await api.updateMe(token, { email_notifications: emailNotifs });
      setSavedProfile(true);
      setTimeout(() => setSavedProfile(false), 2500);
    } catch {
      /* non-fatal */
    }
  }

  function exportRoster() {
    const rows = [["Student", "Email", "Opportunity", "Date", "Hours", "Status"]];
    for (const h of hours)
      rows.push([h.student_name ?? "", h.student_email ?? "", h.opportunity.title, h.occurrence_date ?? "", String(h.hours), h.status]);
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "volunteer-roster.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return null;
  if (!user || user.role !== "org") {
    return (
      <V1Shell>
        <div className="detail-wrap">
          <p style={{ color: "var(--muted)" }}>Only organization accounts have a dashboard.</p>
        </div>
      </V1Shell>
    );
  }

  const planLabel = user.plan === "pro" ? "Pro" : "Community";
  const maxActive = user.plan === "pro" ? "∞" : "3";

  function listingCard(o: Opportunity, inHistory: boolean) {
    const loc = (o.location || "").toLowerCase();
    const fmt = (o.format || "").toLowerCase();
    const pip = fmt === "remote" || loc.includes("remote")
      ? <span className="format-pip remote">🌐 Remote</span>
      : fmt === "hybrid" || loc.includes("hybrid")
        ? <span className="format-pip hybrid">🔀 Hybrid</span>
        : <span className="format-pip inperson">📍 In-Person</span>;
    const appCount = apps.filter((a) => a.opportunity_id === o.id).length;
    return (
      <div key={o.id} className={`opp-card${o.featured ? " featured" : ""}`}>
        <div className="oc-top">
          <div className="oc-avatar" style={{ background: CAT_BG[o.category] || "#e8f5ef" }}>{CAT_EMOJI[o.category] || "🏛️"}</div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {o.featured && <span className="badge badge-featured">★ Featured</span>}
            {inHistory
              ? <span className="badge badge-denied" style={{ opacity: 0.7 }}>Expired</span>
              : <span className={`badge ${o.active ? "badge-verified" : "badge-denied"}`}>{o.active ? "Active" : "Inactive"}</span>}
            {isRecurring(o) && <span className="badge badge-skill" style={{ fontSize: ".65rem" }}>🔄 {o.recurrence === "weekly" ? "Weekly" : "Monthly"}</span>}
          </div>
        </div>
        <Link href={`/opportunities/${o.id}`} className="oc-title">{o.title}</Link>
        <div style={{ marginBottom: 6 }}>{pip}</div>
        <div className="oc-meta" style={{ marginTop: 4 }}>
          <span>📅 {fmtDate(o.start_time)}</span>
          <span>⏱ {o.duration_hours} hrs</span>
          <span>👥 {o.spots_remaining}/{o.spots_available}</span>
        </div>
        <div className="oc-footer">
          <span style={{ fontSize: ".73rem", color: "var(--muted)" }}>{appCount} volunteers</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {!inHistory && (
              <>
                <button
                  className="btn-s"
                  style={{ padding: "6px 12px", fontSize: ".75rem" }}
                  onClick={() => { setTab("applicants"); setMsgOpp(o.id); }}
                >💬 Message</button>
                {user!.plan === "pro" ? (
                  <button
                    className="btn-s"
                    style={{ padding: "6px 12px", fontSize: ".75rem", color: "#8a6d1d", borderColor: "var(--gold)" }}
                    disabled={busyId === o.id}
                    onClick={() => toggleFeature(o)}
                  >{o.featured ? "★ Unfeature" : "☆ Feature"}</button>
                ) : (
                  <Link className="btn-s" style={{ padding: "6px 12px", fontSize: ".75rem" }} href="/billing">Upgrade to feature</Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <V1Shell>
      <div className="dash-layout">
        {/* SIDEBAR */}
        <div>
          <div className="dash-sidebar">
            <div className="ds-avatar">{(user.full_name || "O").charAt(0).toUpperCase()}</div>
            <div className="ds-name">{user.full_name || "Organization"}</div>
            <div className="ds-role" style={{ color: "var(--muted)", fontSize: ".73rem", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Organization</div>
            <div className="plan-usage" style={{ marginBottom: 14 }}>
              <strong>{planLabel}</strong> plan · {activeOpps.filter((o) => o.active).length}/{maxActive} active listings
              {user.plan !== "pro" && <><br /><Link href="/billing" style={{ color: "var(--green)" }}>Upgrade to Pro →</Link></>}
            </div>
            <hr className="ds-divider" />
            <div className="ds-stat"><span className="ds-stat-label">Active Listings</span><span className="ds-stat-val big">{activeOpps.filter((o) => o.active).length}</span></div>
            <div className="ds-stat"><span className="ds-stat-label">Total Volunteers</span><span className="ds-stat-val">{apps.length}</span></div>
            <div className="ds-stat"><span className="ds-stat-label">Pending Approvals</span><span className="ds-stat-val">{pending.length}</span></div>
            <hr className="ds-divider" />
            <div className="ds-nav">
              {TABS.map((t) => (
                <button key={t.id} className={`ds-link${tab === t.id ? " on" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>
              ))}
              <button className="ds-link" onClick={logout}>↪ Log Out</button>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="dash-main">
          {error && <div className="ferr" style={{ display: "block" }}>{error}</div>}

          {tab === "listings" && (
            <div className="tab-panel on">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <h1 className="dash-h" style={{ marginBottom: 0 }}>My Listings</h1>
                <Link className="btn-p" style={{ padding: "10px 20px", fontSize: ".85rem" }} href="/opportunities/new">＋ Add Listing</Link>
              </div>
              <div className="cards-grid">
                {activeOpps.length ? activeOpps.map((o) => listingCard(o, false)) : (
                  <div className="empty"><div className="empty-icon">📋</div>No listings yet. Click ＋ Add Listing to get started.</div>
                )}
              </div>
            </div>
          )}

          {tab === "analytics" && (
            <div className="tab-panel on">
              <h1 className="dash-h" style={{ marginBottom: 6 }}>Analytics</h1>
              <p style={{ fontSize: ".83rem", color: "var(--muted)", fontWeight: 300, marginBottom: 18 }}>How your listings are performing — applications and fill rates across your active opportunities.</p>
              {activeOpps.length ? (
                <table className="tbl">
                  <thead><tr><th>Listing</th><th>Applicants</th><th>Spots filled</th></tr></thead>
                  <tbody>
                    {activeOpps.map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.title}</strong></td>
                        <td>{apps.filter((a) => a.opportunity_id === o.id).length}</td>
                        <td>{o.spots_available - o.spots_remaining}/{o.spots_available}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty"><div className="empty-icon">📈</div>Post a listing to start collecting analytics.</div>
              )}
              <div style={{ marginTop: 16, padding: "14px 16px", background: "var(--gold-pale, #fdf7e3)", border: "1px solid var(--gold)", borderRadius: 8, fontSize: ".83rem", color: "var(--dark)" }}>
                ⭐ <strong>Go further with Pro:</strong> unlimited listings, featured placement at the top of search, and volunteer roster exports.
              </div>
            </div>
          )}

          {tab === "calendar" && (
            <div className="tab-panel on">
              <h1 className="dash-h">Events Calendar</h1>
              <div className="cal-wrap">
                <div className="cal-hdr"><span className="cal-title">{now.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span></div>
                <div className="cal-grid">
                  {DOW.map((d) => <div key={d} className="cal-day-head">{d}</div>)}
                  {days.map((d, i) => {
                    const otherMonth = d.getMonth() !== now.getMonth();
                    const isToday = d.toDateString() === now.toDateString();
                    const evs = activeOpps.filter((o) => new Date(o.start_time).toDateString() === d.toDateString());
                    return (
                      <div key={i} className={`cal-day${otherMonth ? " other-month" : ""}${isToday ? " today" : ""}`}>
                        <div className="cal-date">{d.getDate()}</div>
                        {evs.map((o) => <div key={o.id} className="cal-event" title={o.title}>{o.title}</div>)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "applicants" && (
            <div className="tab-panel on">
              <h1 className="dash-h">Volunteer Applicants</h1>

              {/* Broadcast composer (v2 messaging) */}
              <div className="form-box" style={{ marginBottom: 18 }}>
                <div className="fr">
                  <label>Message a listing’s applicants</label>
                  <select className="fc" value={msgOpp} onChange={(e) => setMsgOpp(e.target.value)}>
                    <option value="">Select a listing…</option>
                    {activeOpps.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                  </select>
                </div>
                <div className="fr">
                  <textarea className="fc" style={{ minHeight: 70 }} value={msgBody} onChange={(e) => setMsgBody(e.target.value)} placeholder="Send an update to your volunteers…" />
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <select className="fc" style={{ width: "auto" }} value={msgAudience} onChange={(e) => setMsgAudience(e.target.value as Audience)}>
                    <option value="all">All applicants</option>
                    <option value="approved">Approved only</option>
                    <option value="pending">Pending only</option>
                  </select>
                  <button className="fsubmit" style={{ marginTop: 0 }} disabled={broadcasting || !msgOpp || !msgBody.trim()} onClick={sendBroadcast}>{broadcasting ? "Sending…" : "Send"}</button>
                  {broadcastMsg && <span style={{ fontSize: ".82rem", color: "var(--muted)" }}>{broadcastMsg}</span>}
                </div>
              </div>

              {apps.length ? (
                <table className="tbl">
                  <thead><tr><th>Student</th><th>Opportunity</th><th>Status</th><th>Applied</th><th></th></tr></thead>
                  <tbody>
                    {apps.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <strong>{a.student_name || "—"}</strong>
                          {a.student_email && <><br /><span style={{ fontSize: ".75rem", color: "var(--muted)" }}>{a.student_email}</span></>}
                        </td>
                        <td style={{ fontSize: ".83rem" }}><strong>{a.opportunity.title}</strong></td>
                        <td><span className={`status-pill sp-${a.status}`}>{a.status}</span></td>
                        <td style={{ fontSize: ".78rem", color: "var(--muted)" }}>{fmtDate(a.created_at)}</td>
                        <td>{a.status === "pending" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn-approve" disabled={busyId === a.id} onClick={() => decide(a.id, "approve")}>✓</button>
                            <button className="btn-reject" disabled={busyId === a.id} onClick={() => decide(a.id, "reject")}>✕</button>
                          </div>
                        )}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty"><div className="empty-icon">👥</div>No applicants yet.</div>
              )}
            </div>
          )}

          {tab === "hours" && (
            <div className="tab-panel on">
              <h1 className="dash-h" style={{ marginBottom: 6 }}>Verify Hours</h1>
              <p style={{ fontSize: ".83rem", color: "var(--muted)", fontWeight: 300, marginBottom: 14 }}>Review and approve or deny volunteer hour requests.</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <button className="btn-s" style={{ padding: "9px 18px", fontSize: ".82rem" }} onClick={exportRoster}>⬇ Export Volunteer Roster (CSV)</button>
              </div>
              {hours.length ? (
                <table className="tbl">
                  <thead><tr><th>Student</th><th>Opportunity</th><th>Date</th><th>Hours</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    {hours.map((h) => (
                      <tr key={h.id}>
                        <td>
                          <strong>{h.student_name || "—"}</strong>
                          {h.student_email && <><br /><span style={{ fontSize: ".75rem", color: "var(--muted)" }}>{h.student_email}</span></>}
                        </td>
                        <td style={{ fontSize: ".83rem" }}><strong>{h.opportunity.title}</strong></td>
                        <td style={{ fontSize: ".78rem" }}>{h.occurrence_date ? fmtDate(h.occurrence_date) : "—"}</td>
                        <td><strong>{h.hours}</strong></td>
                        <td><span className={`status-pill sp-${h.status}`}>{h.status}</span></td>
                        <td>{(h.status === "pending" || h.status === "appealed") && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn-approve" disabled={busyId === h.id} onClick={() => verify(h.id, "approve")}>✓ Verify</button>
                            <button className="btn-reject" disabled={busyId === h.id} onClick={() => verify(h.id, "deny")}>✕ Deny</button>
                          </div>
                        )}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty"><div className="empty-icon">✅</div>No pending hour requests.</div>
              )}
            </div>
          )}

          {tab === "history" && (
            <div className="tab-panel on">
              <h1 className="dash-h" style={{ marginBottom: 6 }}>Listing History</h1>
              <p style={{ fontSize: ".83rem", color: "var(--muted)", fontWeight: 300, marginBottom: 18 }}>One-time listings whose end date has passed. Recurring listings always stay in My Listings.</p>
              <div className="cards-grid">
                {historyOpps.length ? historyOpps.map((o) => listingCard(o, true)) : (
                  <div className="empty"><div className="empty-icon">🗂️</div>No expired listings yet.</div>
                )}
              </div>
            </div>
          )}

          {tab === "profile" && (
            <div className="tab-panel on">
              <h1 className="dash-h">Organization Profile</h1>
              <div className="form-box" style={{ maxWidth: 580 }}>
                <div className="fr"><label>Organization Name</label><input className="fc" defaultValue={user.full_name || ""} /></div>
                <div className="fr"><label>Email</label><input className="fc" defaultValue={user.email} disabled /></div>
                <div className="fr">
                  <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                    <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} style={{ width: 15, height: 15, accentColor: "var(--green)" }} />
                    Email me when I get a notification
                  </label>
                </div>
                <button className="fsubmit" onClick={saveProfile}>Save Changes</button>
                {savedProfile && <span style={{ marginLeft: 12, fontSize: ".82rem", color: "var(--green)" }}>Saved ✓</span>}
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)", display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link className="btn-s" style={{ padding: "9px 18px", fontSize: ".83rem" }} href="/billing">Manage Billing</Link>
                </div>
                <div className="delete-zone" style={{ maxWidth: 580 }}>
                  <h4>⚠️ Delete Account</h4>
                  <p>This will permanently delete your organization account, all listings, applicants, and messages. <strong>This cannot be undone.</strong></p>
                  <button className="btn-s" style={{ color: "var(--red)", borderColor: "var(--red)", padding: "9px 18px", fontSize: ".83rem" }} disabled>Delete Organization Account</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </V1Shell>
  );
}
