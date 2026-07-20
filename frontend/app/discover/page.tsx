"use client";

import { Clock, Globe, MapPin, RefreshCw, Search, Shuffle, TriangleAlert, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CategoryIcon, getCategoryMeta } from "@/components/v1/category-icon";
import { V1Shell } from "@/components/v1/v1-shell";
import { api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { Opportunity } from "@/lib/types";

const CATEGORIES = ["Education", "Environment", "Health", "Animals", "Food & Hunger", "Arts & Culture", "Community", "STEM", "Agriculture"];
const COMMITMENT: Record<string, string> = { one_time: "One-time", weekly: "Weekly", monthly: "Monthly" };

function relDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const days = Math.round((d.getTime() - now.getTime()) / 86400000);
  if (days < 0) return d.toLocaleDateString();
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function DiscoverPage() {
  const { user } = useAuth();
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadOpps = useCallback(() => {
    setLoading(true);
    setError(false);
    api.listOpportunities({ category: category || undefined })
      .then((data) => { setOpps(data); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => { loadOpps(); }, [loadOpps]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || user?.role !== "student") return;
    api.listSavedIds(token).then((ids) => setSavedIds(new Set(ids))).catch(() => undefined);
  }, [user]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return opps;
    return opps.filter((o) => `${o.title} ${o.org_name} ${o.skills.join(" ")}`.toLowerCase().includes(needle));
  }, [opps, q]);

  function toggleSave(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const next = new Set(savedIds);
    if (next.has(id)) {
      next.delete(id);
      setSavedIds(next);
      api.unsave(id, token).catch(() => undefined);
    } else {
      next.add(id);
      setSavedIds(next);
      api.save(id, token).catch(() => undefined);
    }
  }

  const chips: { cls: string; label: string; clear: () => void }[] = [];
  if (q) chips.push({ cls: "", label: `"${q}"`, clear: () => setQ("") });
  if (category) chips.push({ cls: "fc-cat", label: category, clear: () => setCategory("") });

  return (
    <V1Shell>
      <div className="section">
        <div style={{ marginBottom: 28 }}>
          <div className="sec-tag">Volunteer Opportunities</div>
          <h2 className="sec-title">Find your next opportunity</h2>
          <p className="sec-sub">Browse local organizations and their open opportunities. Filter by category, commitment, and format to find something that fits.</p>
        </div>

        {/* ZIP / DISTANCE FILTER (visual — v2 has no geolocation yet) */}
        <div className="zip-filter-wrap">
          <label><MapPin size={13} strokeWidth={1.75} aria-hidden /> Near ZIP code:</label>
          <input className="zip-input" maxLength={5} placeholder="e.g. 60601" />
          <select className="fsel" style={{ padding: "6px 10px", fontSize: ".82rem" }} defaultValue="15">
            <option value="5">Within 5 mi</option>
            <option value="10">Within 10 mi</option>
            <option value="15">Within 15 mi</option>
            <option value="25">Within 25 mi</option>
            <option value="50">Within 50 mi</option>
          </select>
          <button className="zip-btn">Apply</button>
          <span className="zip-status">Searches cover 15 miles by default. Add a ZIP to narrow it down.</span>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="search-bar">
          <div className="si-wrap" style={{ flex: 2 }}>
            <svg viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              className="si"
              placeholder="Search by role, skill, or organization…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className="fsel" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select className="fsel" defaultValue="">
            <option value="">Any Commitment</option>
            <option>One-time</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
          <select className="fsel" defaultValue="">
            <option value="">In-Person or Remote</option>
            <option value="Remote">Remote</option>
            <option value="In-Person">In-Person</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {chips.length > 0 && (
          <div className="filter-bar">
            {chips.map((c, i) => (
              <span key={i} className={`filter-chip ${c.cls}`}>
                {c.label}
                <button onClick={c.clear} title="Remove filter" aria-label="Remove filter">
                  ✕
                </button>
              </span>
            ))}
            <button className="fc-clear" onClick={() => { setQ(""); setCategory(""); }}>
              Clear all
            </button>
          </div>
        )}

        {/* CARD GRID */}
        {loading ? (
          <div className="cards-grid" aria-busy="true" aria-label="Loading opportunities">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skel-card">
                <div className="skel skel-avatar" style={{ marginBottom: 14 }} />
                <div className="skel skel-line" style={{ width: "70%", height: 16, marginBottom: 10 }} />
                <div className="skel skel-line" style={{ width: "45%", marginBottom: 14 }} />
                <div className="skel skel-line" style={{ width: "100%", marginBottom: 7 }} />
                <div className="skel skel-line" style={{ width: "85%", marginBottom: 16 }} />
                <div className="skel skel-line" style={{ width: "55%" }} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="load-error">
            <div className="empty-icon"><TriangleAlert size={40} strokeWidth={1.75} aria-hidden /></div>
            <div className="ferr">Couldn&apos;t load opportunities. Check your connection and try again.</div>
            <div>
              <button className="btn-s" style={{ padding: "9px 18px", fontSize: ".83rem" }} onClick={loadOpps}>
                Retry
              </button>
            </div>
          </div>
        ) : shown.length === 0 ? (
          <div className="empty">
            <div className="empty-icon"><Search size={40} strokeWidth={1.75} aria-hidden /></div>
            Nothing matches those filters yet. Try widening the search.
          </div>
        ) : (
          <div className="cards-grid">
            {shown.map((o) => {
              const fmt = (o.format || "").toLowerCase();
              const loc = (o.location || "").toLowerCase();
              const isRemote = fmt === "remote" || loc.includes("remote");
              const isHybrid = fmt === "hybrid" || loc.includes("hybrid");
              const fmtCls = isRemote ? "format-remote" : isHybrid ? "format-hybrid" : "";
              const meta = getCategoryMeta(o.category);
              return (
                <Link
                  key={o.id}
                  href={`/opportunities/${o.id}`}
                  className={`opp-card ${fmtCls}${o.featured ? " featured" : ""}`}
                >
                  <div className="oc-top">
                    <div className="oc-avatar" style={{ background: meta.bg, color: meta.fg }}>
                      <CategoryIcon category={o.category} size={20} />
                    </div>
                    <div className="badges-row">
                      {o.featured && <span className="badge badge-featured">★ Featured</span>}
                    </div>
                  </div>
                  <div className="oc-title">{o.title}</div>
                  <div className="oc-org">{o.org_name}</div>
                  <div className="oc-desc">{o.description || ""}</div>
                  <div className="badges-row" style={{ marginBottom: 8 }}>
                    {(o.skills || []).slice(0, 3).map((s) => (
                      <span key={s} className="badge badge-skill">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="oc-meta">
                    <span><MapPin size={13} strokeWidth={1.75} aria-hidden />{o.location || "TBD"}</span>
                    <span><Clock size={13} strokeWidth={1.75} aria-hidden />{o.duration_hours} hrs</span>
                    <span><RefreshCw size={13} strokeWidth={1.75} aria-hidden />{COMMITMENT[o.recurrence] || "One-time"}</span>
                    <span><Users size={13} strokeWidth={1.75} aria-hidden />{o.spots_remaining ?? 0}/{o.spots_available ?? 0} spots</span>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    {isRemote ? (
                      <span className="format-pip remote"><Globe size={12} strokeWidth={1.75} aria-hidden />Remote</span>
                    ) : isHybrid ? (
                      <span className="format-pip hybrid"><Shuffle size={12} strokeWidth={1.75} aria-hidden />Hybrid</span>
                    ) : (
                      <span className="format-pip inperson"><MapPin size={12} strokeWidth={1.75} aria-hidden />In-Person</span>
                    )}
                  </div>
                  <div className="oc-footer">
                    <span style={{ fontSize: ".73rem", color: "var(--muted)" }}>{relDate(o.start_time)}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {(!user || user.role === "student") && (
                        <button
                          className={`icon-heart${savedIds.has(o.id) ? " on" : ""}`}
                          onClick={(e) => toggleSave(e, o.id)}
                          title="Save for later"
                          aria-label="Save opportunity for later"
                        >
                          {savedIds.has(o.id) ? "♥" : "♡"}
                        </button>
                      )}
                      <button className="btn-s" style={{ padding: "7px 14px", fontSize: ".78rem" }}>
                        View &amp; Apply
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </V1Shell>
  );
}
