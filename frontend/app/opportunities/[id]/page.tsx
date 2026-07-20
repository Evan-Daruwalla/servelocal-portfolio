"use client";

import { CalendarDays, Clock, Globe, MapPin, RefreshCw, Shuffle, Timer, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { V1Shell } from "@/components/v1/v1-shell";
import { Button } from "@/components/ui/button";
import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { Opportunity } from "@/lib/types";
import { MessagesSection } from "./messages-section";
import { OrgCheckinSection } from "./org-checkin-section";
import { ReviewsSection } from "./reviews-section";
import { SignupSection } from "./signup-section";

const RECURRENCE_LABEL: Record<string, string> = {
  one_time: "One-time",
  weekly: "Weekly",
  monthly: "Monthly",
};

function fmtDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function OpportunityDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [featuring, setFeaturing] = useState(false);

  async function toggleFeatured() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !opp) return;
    setFeaturing(true);
    setError(null);
    try {
      await api.setFeatured(opp.id, !opp.featured, token);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update the listing.");
    } finally {
      setFeaturing(false);
    }
  }

  function load() {
    api
      .getOpportunity(params.id)
      .then(setOpp)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load this opportunity."));
  }

  useEffect(load, [params.id]);

  const loc = (opp?.location || "").toLowerCase();
  const fmt = opp?.format || "";
  const isRemote = fmt.toLowerCase() === "remote" || loc.includes("remote");
  const isHybrid = fmt.toLowerCase() === "hybrid" || loc.includes("hybrid");
  const isRecurring = opp?.recurrence !== "one_time";

  return (
    <V1Shell>
      <Link href="/discover" className="back-link">
        ← Back to Opportunities
      </Link>

      {error && <div className="detail-wrap"><p style={{ color: "var(--red)" }}>{error}</p></div>}

      {opp && (
        <div className="detail-wrap">
          <div className="modal-card">
            <div className="mhdr">
              <div className="mtitle">{opp.title}</div>
              <div className="msub">{opp.org_name}</div>
            </div>
            <div className="mbody">
              <div className="badges-row" style={{ marginBottom: 14 }}>
                {opp.featured && <span className="badge badge-featured">★ Featured</span>}
                <span className="badge badge-verified">Open to All</span>
              </div>

              <div style={{ marginBottom: 12 }}>
                {isRemote ? (
                  <span className="format-pip remote" style={{ fontSize: ".8rem", padding: "4px 12px" }}><Globe size={12} strokeWidth={1.75} aria-hidden />Remote</span>
                ) : isHybrid ? (
                  <span className="format-pip hybrid" style={{ fontSize: ".8rem", padding: "4px 12px" }}><Shuffle size={12} strokeWidth={1.75} aria-hidden />Hybrid</span>
                ) : (
                  <span className="format-pip inperson" style={{ fontSize: ".8rem", padding: "4px 12px" }}><MapPin size={12} strokeWidth={1.75} aria-hidden />In-Person</span>
                )}
              </div>

              <div className="detail-grid">
                <div><MapPin size={14} strokeWidth={1.75} aria-hidden /> <strong>Location:</strong> {opp.location}</div>
                <div><CalendarDays size={14} strokeWidth={1.75} aria-hidden /> <strong>Start:</strong> {fmtDateTime(opp.start_time)}</div>
                <div><Clock size={14} strokeWidth={1.75} aria-hidden /> <strong>End:</strong> {fmtDateTime(opp.end_time)}</div>
                <div><Timer size={14} strokeWidth={1.75} aria-hidden /> <strong>Duration:</strong> {opp.duration_hours} hours</div>
                <div><RefreshCw size={14} strokeWidth={1.75} aria-hidden /> <strong>Commitment:</strong> {RECURRENCE_LABEL[opp.recurrence]}</div>
                {!isRecurring && (
                  <div><Users size={14} strokeWidth={1.75} aria-hidden /> <strong>Spots:</strong> {opp.spots_remaining}/{opp.spots_available} remaining</div>
                )}
              </div>

              <div className="detail-label">Description</div>
              <p className="detail-desc">{opp.description}</p>

              {opp.skills.length > 0 && (
                <>
                  <div className="detail-label">Skills Needed</div>
                  <div className="badges-row" style={{ marginBottom: 16 }}>
                    {opp.skills.map((s) => (
                      <span key={s} className="badge badge-skill">
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {user?.role === "student" && <SignupSection opp={opp} onChange={load} />}
            </div>
          </div>

          {user?.role === "org" && user.id === opp.org_id && (
            <div className="modal-card" style={{ marginTop: 16 }}>
              <div className="mbody" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--dark)", fontSize: ".9rem" }}>Featured listing</div>
                  <div style={{ fontSize: ".8rem", color: "var(--muted)" }}>
                    {user.plan === "pro" ? "Featured listings appear first in Discover (up to 3)." : "Upgrade to Pro to feature this listing."}
                  </div>
                </div>
                {user.plan === "pro" ? (
                  <Button size="sm" variant={opp.featured ? "outline" : "default"} disabled={featuring} onClick={toggleFeatured}>
                    {opp.featured ? "Unfeature" : "Feature"}
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/billing">Upgrade</Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            {user?.role === "org" && user.id === opp.org_id && <OrgCheckinSection opp={opp} />}
            <MessagesSection opportunityId={opp.id} />
            <ReviewsSection orgId={opp.org_id} />
          </div>
        </div>
      )}
    </V1Shell>
  );
}
