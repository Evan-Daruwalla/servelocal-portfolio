"use client";

import { useEffect, useState, type FormEvent } from "react";

import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY } from "@/lib/auth-context";
import type { Message } from "@/lib/types";

/** Renders only if the current user can access the thread (org owner or an applicant).
 * Access is decided by the backend: a 403 on the initial fetch hides the section. */
export function MessagesSection({ opportunityId }: { opportunityId: string }) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [visible, setVisible] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function load() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    api
      .messages(opportunityId, token)
      .then((m) => {
        setMessages(m);
        setVisible(true);
      })
      // Only a 403 means "you can't see this thread". Catching everything hid the
      // whole feature on any timeout or 5xx, contradicting this module's own header
      // comment, with no retry affordance (audit 2026-09-02).
      .catch((err) => {
        // A successful retry sets visible=true, which exits the error branch below —
        // so loadError needs no reset, and resetting it in the effect body would
        // trip react-hooks/set-state-in-effect.
        if (err instanceof ApiError && err.status === 403) setVisible(false);
        else setLoadError(true);
      });
  }

  useEffect(load, [opportunityId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !body.trim()) return;
    setSubmitting(true);
    try {
      await api.postMessage(opportunityId, body, token);
      setBody("");
      load();
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) setVisible(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError && !visible) {
    return (
      <div className="modal-card">
        <div
          className="mbody"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
        >
          <p className="progress-label" style={{ marginTop: 0 }}>Couldn&apos;t load messages.</p>
          <button
            className="btn-s"
            type="button"
            onClick={load}
            style={{ padding: "9px 18px", fontSize: ".83rem" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  if (!visible) return null;

  return (
    <div className="modal-card">
      <div className="mbody" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 className="mtitle" style={{ marginBottom: 0 }}>Messages</h2>
        {messages && messages.length === 0 && (
          <p className="progress-label" style={{ marginTop: 0 }}>No messages yet. Start the conversation.</p>
        )}
        {messages?.map((m) => (
          <div key={m.id} style={{ fontSize: ".84rem", color: "var(--text)" }}>
            <span style={{ fontWeight: 600 }}>{m.sender_name}:</span> <span>{m.body}</span>
          </div>
        ))}
        <form
          onSubmit={onSubmit}
          style={{ display: "flex", gap: 8, borderTop: "1px solid var(--border)", paddingTop: 14 }}
        >
          <input
            className="fsel"
            style={{ flex: 1, cursor: "text" }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a message…"
          />
          <button
            className="btn-p"
            type="submit"
            disabled={submitting || !body.trim()}
            style={{ padding: "9px 18px", fontSize: ".83rem" }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
