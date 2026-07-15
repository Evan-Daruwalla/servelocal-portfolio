"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { V1Shell } from "@/components/v1/v1-shell";
import { api } from "@/lib/api";

export default function Home() {
  const [oppCount, setOppCount] = useState<number | null>(null);

  useEffect(() => {
    api.listOpportunities({}).then((o) => setOppCount(o.length)).catch(() => undefined);
  }, []);

  return (
    <V1Shell>
      {/* HERO */}
      <div className="hero">
        <div>
          <div className="hero-tag">Free forever for students — no catch</div>
          <h1>
            Serve your community. <em>Build</em> your future.
          </h1>
          <p>
            ServeLocal connects students with meaningful volunteer opportunities matched to their
            skills and interests — with verified hour tracking, award progress, and a portfolio that
            opens doors.
          </p>
          <div className="hero-btns">
            <Link className="btn-p" href="/discover">
              Browse Opportunities
            </Link>
            <Link className="btn-s" href="/register">
              For Organizations
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hs-num">{oppCount ?? "—"}</div>
              <div className="hs-label">Active Listings</div>
            </div>
            <div>
              <div className="hs-num">Free</div>
              <div className="hs-label">For Students</div>
            </div>
            <div>
              <div className="hs-num">Verified</div>
              <div className="hs-label">Hour Tracking</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mini-card">
            <div className="mc-icon" style={{ background: "#e8f5ef" }}>
              🌱
            </div>
            <div>
              <div className="mc-title">Community Garden Helper</div>
              <div className="mc-sub">Green Roots Org · 1.2 mi</div>
            </div>
            <span className="mc-badge">4 hrs</span>
          </div>
          <div className="mini-card">
            <div className="mc-icon" style={{ background: "#eef4ff" }}>
              📚
            </div>
            <div>
              <div className="mc-title">Youth Literacy Tutor</div>
              <div className="mc-sub">City Library · Remote</div>
            </div>
            <span className="mc-badge">Flexible</span>
          </div>
          <div className="mini-card">
            <div className="mc-icon" style={{ background: "#fdf5e0" }}>
              🔬
            </div>
            <div>
              <div className="mc-title">STEM Workshop Helper</div>
              <div className="mc-sub">Future Engineers · 0.8 mi</div>
            </div>
            <span className="mc-badge">4 hrs</span>
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="marquee-band">
        <div className="marquee-track">
          {[
            "Education", "Environment", "Animals", "Food & Hunger", "Health",
            "Arts & Culture", "STEM", "Community", "Agriculture",
          ]
            .concat([
              "Education", "Environment", "Animals", "Food & Hunger", "Health",
              "Arts & Culture", "STEM", "Community", "Agriculture",
            ])
            .map((c, i) => (
              <span key={i}>{c}</span>
            ))}
        </div>
      </div>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div>
          <div className="sb-num">100%</div>
          <div className="sb-label">Free for students</div>
        </div>
        <div>
          <div className="sb-num">100%</div>
          <div className="sb-label">Easy setup</div>
        </div>
        <div>
          <div className="sb-num">Verified</div>
          <div className="sb-label">Hour tracking</div>
        </div>
        <div>
          <div className="sb-num">Trusted</div>
          <div className="sb-label">Org vetting</div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="section">
        <div className="sec-tag">How it works</div>
        <h2 className="sec-title">From sign-up to award in four steps</h2>
        <div className="hiw-grid" style={{ marginTop: 24 }}>
          <div className="hiw-step">
            <div style={{ fontSize: "1.7rem" }}>🔍</div>
            <h4>Discover &amp; Filter</h4>
            <p>Search by skill, ZIP code, cause, date, or time commitment — every org is vetted before listings go live.</p>
          </div>
          <div className="hiw-step">
            <div style={{ fontSize: "1.7rem" }}>📅</div>
            <h4>Sign Up &amp; Sync</h4>
            <p>One-click signup with conflict warnings, waitlists for full events, and calendar sync to your phone.</p>
          </div>
          <div className="hiw-step">
            <div style={{ fontSize: "1.7rem" }}>✅</div>
            <h4>Verified Hours</h4>
            <p>Hours log automatically after events and supervisors verify them — no more paper signature sheets.</p>
          </div>
          <div className="hiw-step">
            <div style={{ fontSize: "1.7rem" }}>🏆</div>
            <h4>Awards &amp; Portfolio</h4>
            <p>Track NHS and Presidential Award progress, earn endorsements, and export a transcript for applications.</p>
          </div>
        </div>
      </div>

      {/* BENTO */}
      <div className="section">
        <div className="sec-tag">Why ServeLocal</div>
        <h2 className="sec-title">Everything you need to volunteer — and prove it</h2>
        <div className="bento">
          <div className="bento-card feature b-2x2">
            <div className="bi">✅</div>
            <h3>Verified hours, logged automatically</h3>
            <p>Hours log themselves after each event, then supervisors verify them in a tap — no paper signature sheets, no chasing anyone down. Your record stays tamper-proof and export-ready.</p>
            <span className="mc-badge" style={{ alignSelf: "flex-start", marginTop: "auto" }}>
              Tamper-proof records
            </span>
          </div>
          <div className="bento-card">
            <div className="bi">🎯</div>
            <h4>Matched to you</h4>
            <p>Filter by skill, cause, date, and time commitment.</p>
          </div>
          <div className="bento-card">
            <div className="bi">📍</div>
            <h4>Near you</h4>
            <p>Real-time distance from your location or ZIP code.</p>
          </div>
          <div className="bento-card b-2x1">
            <div className="bi">🏆</div>
            <h4>Awards &amp; a portfolio that opens doors</h4>
            <p>Track NHS and Presidential Volunteer Award progress, collect endorsements, and export a transcript for college and job applications.</p>
          </div>
          <div className="bento-card">
            <div className="bi">📅</div>
            <h4>Calendar sync</h4>
            <p>Add shifts to your phone in one tap.</p>
          </div>
          <div className="bento-card">
            <div className="bi">🔔</div>
            <h4>Smart waitlists</h4>
            <p>Auto-promoted the moment a spot frees up.</p>
          </div>
          <div className="bento-card b-2x1">
            <div className="bi">👥</div>
            <h4>Vetted organizations</h4>
            <p>Every organization is reviewed before its listings go live — so you can sign up with confidence.</p>
          </div>
        </div>
      </div>

      {/* PLEDGE */}
      <div className="pledge-band">
        <h2>
          Free for students. <em>Forever.</em>
        </h2>
        <p>
          That&apos;s our pledge. ServeLocal is funded by organization Pro plans and community
          supporters — never by student fees. Every dollar keeps verified volunteering open to every
          student.
        </p>
        <div className="pledge-btns">
          <Link className="btn-gold" href="/register">
            Get Started Free
          </Link>
          <Link className="btn-ghost" href="/leaderboard">
            Community Impact →
          </Link>
        </div>
      </div>
    </V1Shell>
  );
}
