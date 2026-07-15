"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { TOKEN_KEY, useAuth } from "@/lib/auth-context";
import { isV1Route } from "@/lib/v1-routes";

export function SiteHeader() {
  const { user, loading, logout } = useAuth();
  const [unread, setUnread] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !user) {
      setUnread(0);
      return;
    }
    api.unreadCount(token).then((r) => setUnread(r.unread)).catch(() => undefined);
  }, [user]);

  if (isV1Route(pathname)) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="" width={30} height={30} className="rounded-md" unoptimized />
            <span className="font-display text-xl text-primary">
              Serve<span className="text-[hsl(156_52%_37%)]">Local</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/discover"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Discover
            </Link>
            <Link
              href="/leaderboard"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Leaderboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <>
              <Link
                href="/notifications"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Notifications{unread > 0 ? ` (${unread})` : ""}
              </Link>
              <Link
                href="/inbox"
                className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground sm:inline"
              >
                Inbox
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
