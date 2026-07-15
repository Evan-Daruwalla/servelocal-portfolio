"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import type { Notification } from "@/lib/types";

export default function NotificationsPage() {
  const { user, loading, refresh } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [fetching, setFetching] = useState(true);
  const [emailPref, setEmailPref] = useState(true);
  const [savingPref, setSavingPref] = useState(false);

  useEffect(() => {
    if (user) setEmailPref(user.email_notifications);
  }, [user]);

  async function saveEmailPref(next: boolean) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    setSavingPref(true);
    setEmailPref(next); // optimistic
    try {
      await api.updateMe(token, { email_notifications: next });
      await refresh();
    } catch {
      setEmailPref(!next); // revert on failure
    } finally {
      setSavingPref(false);
    }
  }

  function load() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    api
      .notifications(token)
      .then(setNotifications)
      .finally(() => setFetching(false));
  }

  useEffect(() => {
    if (!loading) load();
  }, [loading]);

  async function markRead(id: string) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    await api.markNotificationRead(id, token);
    load();
  }

  async function markAll() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    await api.markAllNotificationsRead(token);
    load();
  }

  if (loading) return null;

  if (!user) {
    return (
      <main className="mx-auto max-w-md p-8 text-center">
        <p className="text-muted-foreground">Please log in to see notifications.</p>
      </main>
    );
  }

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div className="flex items-end justify-between">
        <div>
          <span className="section-tag">Activity</span>
          <h1 className="section-title">Notifications</h1>
        </div>
        {hasUnread && (
          <Button size="sm" variant="outline" onClick={markAll}>
            Mark all read
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="flex items-center justify-between gap-3 py-3">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="email-pref" className="text-sm font-medium">
              Email notifications
            </label>
            <p className="text-sm text-muted-foreground">
              Also email me when I get a notification.
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              id="email-pref"
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={emailPref}
              disabled={savingPref}
              onChange={(e) => saveEmailPref(e.target.checked)}
            />
            {emailPref ? "On" : "Off"}
          </label>
        </CardContent>
      </Card>

      {fetching && <p className="text-muted-foreground">Loading…</p>}
      {!fetching && notifications.length === 0 && (
        <p className="text-muted-foreground">No notifications yet.</p>
      )}

      <div className="flex flex-col gap-2">
        {notifications.map((n) => (
          <Card key={n.id} className={n.read ? "opacity-60" : "border-primary"}>
            <CardContent className="flex items-start justify-between gap-3 py-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">
                  {!n.read && <span className="mr-1 text-primary">●</span>}
                  {n.title}
                </p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
                {n.link && (
                  <Link href={n.link} className="text-xs text-primary underline-offset-4 hover:underline">
                    View
                  </Link>
                )}
              </div>
              {!n.read && (
                <Button size="sm" variant="ghost" onClick={() => markRead(n.id)}>
                  Mark read
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
