"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { OrgReviews } from "@/lib/types";

export function ReviewsSection({ orgId }: { orgId: string }) {
  const { user } = useAuth();
  const [data, setData] = useState<OrgReviews | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    api.orgReviews(orgId).then(setData).catch(() => undefined);
  }

  useEffect(load, [orgId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.createReview(orgId, { rating, text }, token);
      setText("");
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Reviews
          {data && data.average_rating != null && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ★ {data.average_rating} ({data.count})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {data && data.reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
        {data?.reviews.map((r) => (
          <div key={r.id} className="border-b pb-2 last:border-0">
            <p className="text-sm font-medium">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)} · {r.author_name}
            </p>
            {r.text && <p className="text-sm text-muted-foreground">{r.text}</p>}
          </div>
        ))}

        {user?.role === "student" && (
          <form onSubmit={onSubmit} className="flex flex-col gap-2 border-t pt-4">
            <label className="text-sm font-medium">Leave a review</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="h-9 w-28 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              placeholder="Share your experience (optional)"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="sm" disabled={submitting} className="self-start">
              {submitting ? "Posting…" : "Post review"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
