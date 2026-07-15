"use client";

import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError, api } from "@/lib/api";
import { TOKEN_KEY } from "@/lib/auth-context";
import type { Message } from "@/lib/types";

/** Renders only if the current user can access the thread (org owner or an applicant).
 * Access is decided by the backend: a 403 on the initial fetch hides the section. */
export function MessagesSection({ opportunityId }: { opportunityId: string }) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [visible, setVisible] = useState(false);
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
      .catch(() => setVisible(false));
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

  if (!visible) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Messages</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {messages && messages.length === 0 && (
          <p className="text-sm text-muted-foreground">No messages yet — start the conversation.</p>
        )}
        {messages?.map((m) => (
          <div key={m.id} className="text-sm">
            <span className="font-medium">{m.sender_name}:</span> <span>{m.body}</span>
          </div>
        ))}
        <form onSubmit={onSubmit} className="flex gap-2 border-t pt-3">
          <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a message…" />
          <Button type="submit" size="sm" disabled={submitting || !body.trim()}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
