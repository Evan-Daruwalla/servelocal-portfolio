"use client";

import { useEffect, useState, type FormEvent } from "react";

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

  // `.modal-card` + `.mbody`, matching the Featured panel this page already renders
  // as a sibling — not `.form-box`, so the two cards on one screen agree.
  return (
    <div className="modal-card">
      <div className="mbody" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <h2 className="mtitle" style={{ marginBottom: 0 }}>
          Reviews
          {data && data.average_rating != null && (
            <span style={{ marginLeft: 8, fontSize: ".82rem", fontWeight: 400, color: "var(--muted)" }}>
              ★ {data.average_rating} ({data.count})
            </span>
          )}
        </h2>
        {data && data.reviews.length === 0 && <p className="progress-label" style={{ marginTop: 0 }}>No reviews yet.</p>}
        {data?.reviews.map((r) => (
          <div key={r.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 10 }}>
            <p style={{ fontSize: ".84rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)} · {r.author_name}
            </p>
            {r.text && <p className="progress-label" style={{ marginTop: 4 }}>{r.text}</p>}
          </div>
        ))}

        {user?.role === "student" && (
          <form
            onSubmit={onSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 16 }}
          >
            <div className="fr" style={{ marginBottom: 0 }}>
              <label htmlFor="review-rating">Leave a review</label>
            </div>
            <select
              id="review-rating"
              className="fsel"
              style={{ width: 140 }}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <textarea
              className="fsel"
              style={{ width: "100%", resize: "vertical", cursor: "text" }}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              placeholder="Share your experience (optional)"
            />
            {error && <p className="ferr" style={{ marginBottom: 0 }}>{error}</p>}
            <button
              className="btn-p"
              type="submit"
              disabled={submitting}
              style={{ alignSelf: "flex-start", padding: "9px 18px", fontSize: ".83rem" }}
            >
              {submitting ? "Posting…" : "Post review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
