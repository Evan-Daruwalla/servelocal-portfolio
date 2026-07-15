"use client";

import Link from "next/link";

import { V1Shell } from "@/components/v1/v1-shell";

export default function ForOrganizationsPage() {
  return (
    <V1Shell>
      <div className="section">
        <div style={{ maxWidth: 680 }}>
          <div className="sec-tag">For Organizations</div>
          <h2 className="sec-title">Reach motivated student volunteers</h2>
          <p className="sec-sub" style={{ maxWidth: 600 }}>
            Post volunteer opportunities, manage your volunteer roster, verify hours, and connect directly with motivated students.
          </p>
        </div>

        <div className="bento" style={{ marginTop: 36, marginBottom: 36 }}>
          <div className="bento-card feature b-2x2">
            <div className="bi">📋</div>
            <h3>Post free listings in minutes</h3>
            <p>Set requirements, spots, dates, and formats, then let motivated students find you. Up to 3 active listings free — unlimited with Pro.</p>
            <span className="mc-badge" style={{ alignSelf: "flex-start", marginTop: "auto" }}>No cost to start</span>
          </div>
          <div className="bento-card"><div className="bi">✅</div><h4>Verify hours</h4><p>Approve volunteer hours from your dashboard — students get verified records instantly.</p></div>
          <div className="bento-card"><div className="bi">💬</div><h4>Message volunteers</h4><p>Push updates, reminders, and changes to signed-up students.</p></div>
          <div className="bento-card b-2x1"><div className="bi">🔒</div><h4>Vetted &amp; trusted</h4><p>Domain-email verification plus admin review keep the platform safe for students.</p></div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn-p" href="/register">Register Your Organization</Link>
          <Link className="btn-s" href="/pricing">View Pricing →</Link>
        </div>
        <p style={{ fontSize: ".8rem", color: "var(--muted)", marginTop: 14 }}>
          Start free with up to 3 active listings. Upgrade to Pro for unlimited listings, featured placement, and analytics.
        </p>
      </div>
    </V1Shell>
  );
}
