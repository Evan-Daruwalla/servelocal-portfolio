"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { Opportunity } from "@/lib/types";

export default function SavedPage() {
  const { user, loading } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || loading) return;
    api
      .listSaved(token)
      .then(setOpportunities)
      .finally(() => setFetching(false));
  }, [loading]);

  if (loading) return null;

  if (!user || user.role !== "student") {
    return (
      <main className="mx-auto max-w-md p-8 text-center">
        <p className="text-muted-foreground">Only student accounts have bookmarks.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <div>
        <span className="section-tag">Your activity</span>
        <h1 className="section-title">Saved</h1>
      </div>

      {fetching && <p className="empty-state">Loading…</p>}
      {!fetching && opportunities.length === 0 && (
        <div className="empty-state">No bookmarks yet. Tap the heart on any opportunity.</div>
      )}

      <div className="flex flex-col gap-4">
        {opportunities.map((opp) => (
          <Link key={opp.id} href={`/opportunities/${opp.id}`} className="opp-card">
            <h3 className="opp-title">{opp.title}</h3>
            <p className="opp-org">
              {opp.org_name} · {opp.category} · {opp.location}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
