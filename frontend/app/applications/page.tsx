"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { ApplicationWithOpportunity } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Not accepted",
  waitlisted: "Waitlisted",
};

const STATUS_PILL: Record<string, string> = {
  pending: "sp-pending",
  approved: "sp-approved",
  rejected: "sp-rejected",
  waitlisted: "sp-waitlisted",
};

export default function MyApplicationsPage() {
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithOpportunity[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || loading) return;
    api
      .myApplications(token)
      .then(setApplications)
      .finally(() => setFetching(false));
  }, [loading]);

  if (loading) return null;

  if (!user || user.role !== "student") {
    return (
      <main className="mx-auto max-w-md p-8 text-center">
        <p className="text-muted-foreground">Only student accounts have applications.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <div>
        <span className="section-tag">Your activity</span>
        <h1 className="section-title">My Applications</h1>
      </div>

      {fetching && <p className="empty-state">Loading…</p>}
      {!fetching && applications.length === 0 && (
        <div className="empty-state">You haven&apos;t applied to anything yet.</div>
      )}

      <div className="flex flex-col gap-4">
        {applications.map((app) => (
          <Link key={app.id} href={`/opportunities/${app.opportunity.id}`} className="opp-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="opp-title">{app.opportunity.title}</h3>
                <p className="opp-org">{app.opportunity.org_name}</p>
              </div>
              <span className={`status-pill ${STATUS_PILL[app.status] ?? "sp-pending"}`}>
                {STATUS_LABEL[app.status] ?? app.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
