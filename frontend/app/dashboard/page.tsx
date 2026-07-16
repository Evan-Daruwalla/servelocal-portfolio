"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import { V1Shell } from "@/components/v1/v1-shell";
import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { ApplicationWithOpportunity, HoursWithOpportunity, MyAwards, Opportunity } from "@/lib/types";

type Tab = "calendar" | "history" | "log" | "saved" | "awards" | "impact" | "profile" | "account";
const TABS: { id: Tab; label: string }[] = [
  { id: "calendar", label: "📅 Calendar" },
  { id: "history", label: "📋 Hours History" },
  { id: "log", label: "➕ Log Hours" },
  { id: "saved", label: "🔖 Saved" },
  { id: "awards", label: "🏆 Awards" },
  { id: "impact", label: "📊 Impact" },
  { id: "profile", label: "👤 Profile" },
  { id: "account", label: "⚙️ Account" },
];
const HOURS_STATUS: Record<string, [string, string]> = {
  pending: ["sp-pending", "Pending"],
  verified: ["sp-verified", "Verified"],
  denied: ["sp-denied", "Denied"],
  appealed: ["sp-appealed", "Appealed"],
};
const SRC: Record<string, string> = { auto: "Auto", self: "Self-report", checkin: "Check-in" };
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("calendar");
  const [hours, setHours] = useState<HoursWithOpportunity[]>([]);
  const [awards, setAwards] = useState<MyAwards | null>(null);
  const [apps, setApps] = useState<ApplicationWithOpportunity[]>([]);
  const [saved, setSaved] = useState<Opportunity[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  // log-hours form
  const [srOpp, setSrOpp] = useState("");
  const [srHours, setSrHours] = useState(1);
  const [ciOpp, setCiOpp] = useState("");
  const [ciCode, setCiCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  // account section (export + delete)
  const [delConfirm, setDelConfirm] = useState("");
  const [delPassword, setDelPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [acctError, setAcctError] = useState<string | null>(null);

  function refresh() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setDataLoading(false); return; }
    setDataLoading(true);
    setDataError(false);
    api.autoLogHours(token).catch(() => undefined)
      .then(() => Promise.all([api.listHours(token), api.myAwards(token), api.myApplications(token), api.listSaved(token)]))
      .then(([h, a, ap, sv]) => {
        setHours(h as HoursWithOpportunity[]);
        setAwards(a);
        setApps(ap);
        setSaved(sv);
        setDataError(false);
      })
      .catch(() => setDataError(true))
      .finally(() => setDataLoading(false));
  }
  useEffect(() => { if (!loading) refresh(); }, [loading]);

  const stats = useMemo(() => {
    let verified = 0, pending = 0, total = 0;
    for (const h of hours) {
      total += h.hours;
      if (h.status === "verified") verified += h.hours;
      else if (h.status === "pending" || h.status === "appealed") pending += h.hours;
    }
    return { verified, pending, total };
  }, [hours]);

  const oppOptions = apps.map((a) => ({ id: a.opportunity.id, title: a.opportunity.title }));

  async function submitSelfReport(e: FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !srOpp) return;
    setMsg(null);
    try {
      await api.selfReportHours({ opportunity_id: srOpp, hours: srHours }, token);
      setMsg("Hours submitted for verification.");
      refresh();
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }
  async function submitCheckin(e: FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !ciOpp || !ciCode) return;
    setMsg(null);
    try {
      await api.redeemCheckin(ciOpp, ciCode.trim().toUpperCase(), token);
      setCiCode("");
      setMsg("Checked in — hours verified!");
      refresh();
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "Something went wrong.");
    }
  }

  async function downloadExport() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setAcctError(null);
    try {
      const data = await api.exportMe(token);
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "servelocal-data-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setAcctError(err instanceof ApiError ? err.message : "Could not export your data.");
    }
  }
  async function deleteAccount() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setDeleting(true);
    setAcctError(null);
    try {
      await api.deleteMe(delPassword, token);
      logout();
      router.push("/");
    } catch (err) {
      setAcctError(err instanceof ApiError ? err.message : "Could not delete your account.");
      setDeleting(false);
    }
  }

  if (loading) return null;
  if (!user || user.role !== "student") {
    return (
      <V1Shell>
        <div className="section"><p className="sec-sub">Your dashboard is for student accounts.</p></div>
      </V1Shell>
    );
  }

  const initial = (user.full_name || user.email || "?").trim().charAt(0).toUpperCase();

  // calendar month grid (current month) with event dates from applications
  const eventDays = new Set(apps.map((a) => new Date(a.opportunity.start_time).toDateString()));
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(1 - monthStart.getDay());
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });

  // Per-section resilience (M13.5): panels load via one refresh(), so a single
  // skeleton-while-loading + inline error+Retry covers every data tab.
  const sectionError = (
    <div className="load-error">
      <div className="empty-icon">⚠️</div>
      <div className="ferr">Couldn&apos;t load your data. Check your connection and try again.</div>
      <div>
        <button className="btn-s" style={{ padding: "9px 18px", fontSize: ".83rem" }} onClick={refresh}>
          Retry
        </button>
      </div>
    </div>
  );
  const skelPanel = (
    <div className="skel-card" aria-busy="true">
      <div className="skel skel-line" style={{ width: "55%", height: 16, marginBottom: 14 }} />
      <div className="skel skel-line" style={{ width: "100%", marginBottom: 8 }} />
      <div className="skel skel-line" style={{ width: "92%", marginBottom: 8 }} />
      <div className="skel skel-line" style={{ width: "78%" }} />
    </div>
  );
  const skelGrid = (
    <div className="cards-grid" aria-busy="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skel-card">
          <div className="skel skel-line" style={{ width: "70%", height: 16, marginBottom: 10 }} />
          <div className="skel skel-line" style={{ width: "45%", marginBottom: 14 }} />
          <div className="skel skel-line" style={{ width: "60%" }} />
        </div>
      ))}
    </div>
  );

  return (
    <V1Shell>
      <div className="dash-layout">
        {/* SIDEBAR */}
        <div>
          <div className="dash-sidebar">
            <div className="ds-avatar">{initial}</div>
            <div className="ds-name">{user.full_name ?? user.email}</div>
            <div className="ds-role">Student</div>
            <hr className="ds-divider" />
            <div className="ds-stat">
              <span className="ds-stat-label">Verified Hours</span>
              <span className="ds-stat-val big">{stats.verified}</span>
            </div>
            <div className="ds-stat">
              <span className="ds-stat-label">Unverified Hours</span>
              <span className="ds-stat-val">{stats.pending}</span>
            </div>
            <div className="ds-stat">
              <span className="ds-stat-label">Total Logged</span>
              <span className="ds-stat-val">{stats.total}</span>
            </div>
            <hr className="ds-divider" />
            <div className="ds-nav">
              {TABS.map((t) => (
                <button key={t.id} className={`ds-link${tab === t.id ? " on" : ""}`} onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="dash-main">
          {tab === "calendar" && (
            <div>
              <h1 className="dash-h">Calendar</h1>
              {dataError ? sectionError : dataLoading ? skelPanel : (
              <>
              <div className="cal-wrap">
                <div className="cal-hdr">
                  <span className="cal-title">{now.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span>
                </div>
                <div className="cal-grid">
                  {DOW.map((d) => (
                    <div key={d} className="cal-day-head">{d}</div>
                  ))}
                  {days.map((d, i) => {
                    const otherMonth = d.getMonth() !== now.getMonth();
                    const isToday = d.toDateString() === now.toDateString();
                    const evs = apps.filter((a) => new Date(a.opportunity.start_time).toDateString() === d.toDateString());
                    return (
                      <div key={i} className={`cal-day${otherMonth ? " other-month" : ""}${isToday ? " today" : ""}`}>
                        <div className="cal-date">{d.getDate()}</div>
                        {evs.map((a) => (
                          <div key={a.id} className="cal-event" title={a.opportunity.title}>{a.opportunity.title}</div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
              {eventDays.size === 0 && <p className="progress-label" style={{ marginTop: 12 }}>No signups this month — <Link href="/discover">find an opportunity</Link>.</p>}
              </>
              )}
            </div>
          )}

          {tab === "history" && (
            <div>
              <h1 className="dash-h">Hours History</h1>
              {dataError ? sectionError : dataLoading ? skelPanel : hours.length === 0 ? (
                <div className="empty"><div className="empty-icon">📋</div>No hours logged yet — they log automatically once an event passes.</div>
              ) : (
                <table className="tbl">
                  <thead>
                    <tr><th>Opportunity</th><th>Hours</th><th>Source</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {hours.map((h) => (
                      <tr key={h.id}>
                        <td>{h.opportunity.title}</td>
                        <td>{h.hours}</td>
                        <td>{SRC[h.source] ?? h.source}</td>
                        <td><span className={`status-pill ${HOURS_STATUS[h.status]?.[0] ?? "sp-pending"}`}>{HOURS_STATUS[h.status]?.[1] ?? h.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === "log" && (
            <div>
              <h1 className="dash-h">Log Hours</h1>
              {dataError ? sectionError : dataLoading ? skelPanel : oppOptions.length === 0 ? (
                <div className="empty"><div className="empty-icon">➕</div>Apply to an opportunity first, then log or check in here.</div>
              ) : (
                <>
                  <div className="form-box">
                    <form onSubmit={submitCheckin}>
                      <div className="fr"><label>Check in with a code</label></div>
                      <div className="checkin-bar">
                        <select className="fsel" value={ciOpp} onChange={(e) => setCiOpp(e.target.value)}>
                          <option value="">Opportunity…</option>
                          {oppOptions.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                        </select>
                        <input className="fsel" style={{ width: 110, textTransform: "uppercase" }} value={ciCode} onChange={(e) => setCiCode(e.target.value)} placeholder="CODE" />
                        <button className="btn-p" type="submit" style={{ padding: "9px 18px", fontSize: ".82rem" }} disabled={!ciOpp || !ciCode}>Check in</button>
                      </div>
                    </form>
                  </div>
                  <div className="form-box">
                    <form onSubmit={submitSelfReport}>
                      <div className="fr"><label>Self-report hours</label></div>
                      <div className="checkin-bar">
                        <select className="fsel" value={srOpp} onChange={(e) => setSrOpp(e.target.value)}>
                          <option value="">Opportunity…</option>
                          {oppOptions.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
                        </select>
                        <input className="fsel" style={{ width: 80 }} type="number" min={0.5} step={0.5} value={srHours} onChange={(e) => setSrHours(Number(e.target.value))} />
                        <button className="btn-p" type="submit" style={{ padding: "9px 18px", fontSize: ".82rem" }} disabled={!srOpp}>Submit</button>
                      </div>
                    </form>
                  </div>
                  {msg && <p className="progress-label">{msg}</p>}
                </>
              )}
            </div>
          )}

          {tab === "saved" && (
            <div>
              <h1 className="dash-h">Saved</h1>
              {dataError ? sectionError : dataLoading ? skelGrid : saved.length === 0 ? (
                <div className="empty"><div className="empty-icon">🔖</div>No bookmarks yet — tap the heart on any opportunity.</div>
              ) : (
                <div className="cards-grid">
                  {saved.map((o) => (
                    <Link key={o.id} href={`/opportunities/${o.id}`} className="opp-card">
                      <div className="oc-title">{o.title}</div>
                      <div className="oc-org">{o.org_name}</div>
                      <div className="oc-meta"><span>📍 {o.location}</span><span>⏱ {o.duration_hours} hrs</span></div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "awards" && (
            <div>
              <h1 className="dash-h">Awards — {awards?.verified_hours ?? 0} verified hours</h1>
              {dataError ? sectionError : dataLoading ? skelPanel : (
              <>
              {(awards?.earned ?? []).map((a) => (
                <div key={a.id} className="award-card">
                  <div className="award-icon award-achieved">🏆</div>
                  <div className="award-info">
                    <div className="award-name">{a.name}</div>
                    <div className="award-desc">Achieved</div>
                    <div className="progress-bar"><div className="progress-fill done" style={{ width: "100%" }} /></div>
                  </div>
                </div>
              ))}
              {awards?.next && (
                <div className="award-card">
                  <div className="award-icon award-locked">🔒</div>
                  <div className="award-info">
                    <div className="award-name">{awards.next.name}</div>
                    <div className="award-desc">{awards.next.hours - awards.verified_hours}h to go ({awards.next.hours}h)</div>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: `${Math.min(100, (awards.verified_hours / awards.next.hours) * 100)}%` }} /></div>
                  </div>
                </div>
              )}
              {(awards?.earned.length ?? 0) === 0 && !awards?.next && (
                <div className="empty"><div className="empty-icon">🏆</div>Log verified hours to start earning awards.</div>
              )}
              </>
              )}
            </div>
          )}

          {tab === "impact" && (
            <div>
              <h1 className="dash-h">Impact</h1>
              {dataError ? sectionError : dataLoading ? skelPanel : (
              <div className="lb-band">
                <div className="lb-stat"><div className="lb-stat-num">{stats.verified}</div><div className="lb-stat-label">Verified Hours</div></div>
                <div className="lb-stat"><div className="lb-stat-num">{apps.length}</div><div className="lb-stat-label">Opportunities</div></div>
                <div className="lb-stat"><div className="lb-stat-num">{awards?.earned.length ?? 0}</div><div className="lb-stat-label">Awards</div></div>
              </div>
              )}
            </div>
          )}

          {tab === "profile" && (
            <div>
              <h1 className="dash-h">Profile</h1>
              <div className="form-box">
                <div className="ds-stat"><span className="ds-stat-label">Name</span><span className="ds-stat-val">{user.full_name ?? "—"}</span></div>
                <div className="ds-stat"><span className="ds-stat-label">Email</span><span className="ds-stat-val">{user.email}</span></div>
                <div className="ds-stat"><span className="ds-stat-label">Role</span><span className="ds-stat-val">Student</span></div>
              </div>
            </div>
          )}

          {tab === "account" && (
            <div>
              <h1 className="dash-h">Account</h1>
              <div className="form-box">
                <div className="fr"><label>Download my data</label></div>
                <p style={{ fontSize: ".83rem", color: "var(--muted)", fontWeight: 300, marginBottom: 12 }}>Export a copy of your ServeLocal data — profile, applications, hours, messages, reviews, and notifications — as a JSON file.</p>
                <button className="btn-s" style={{ padding: "9px 18px", fontSize: ".83rem" }} onClick={downloadExport}>⬇ Download my data (JSON)</button>
              </div>
              <div className="delete-zone">
                <h4>⚠️ Delete Account</h4>
                <p>
                  Your verified hours are kept for the organizations that recorded them, with your name removed.
                  Everything else — your profile, guardian information, saved items, and notifications — is permanently erased.
                  <strong> This cannot be undone.</strong>
                </p>
                <div className="fr">
                  <label>Type DELETE to confirm</label>
                  <input className="fc" value={delConfirm} onChange={(e) => setDelConfirm(e.target.value)} placeholder="DELETE" />
                </div>
                <div className="fr">
                  <label>Current password</label>
                  <input className="fc" type="password" value={delPassword} onChange={(e) => setDelPassword(e.target.value)} />
                </div>
                {acctError && <div className="ferr" style={{ display: "block" }}>{acctError}</div>}
                <button
                  className="btn-s"
                  style={{ color: "var(--red)", borderColor: "var(--red)", padding: "9px 18px", fontSize: ".83rem" }}
                  disabled={delConfirm !== "DELETE" || !delPassword || deleting}
                  onClick={deleteAccount}
                >{deleting ? "Deleting…" : "Delete my account"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </V1Shell>
  );
}
