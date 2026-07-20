"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/lib/auth-context";

// Exact v1 nav + footer chrome (transcribed from ../ServeLocal website/public/index.html),
// wrapping page content in the scoped `.v1` root. Every converted screen uses this.
export function V1Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Logged out → send Dashboard to /login (prompt to sign in); logged in → their dash.
  const dashHref =
    user?.role === "org" ? "/applicants" : user?.role === "student" ? "/dashboard" : "/login";

  const nl = (href: string, label: string, active: boolean) => (
    <Link className={`nl${active ? " on" : ""}`} href={href}>
      {label}
    </Link>
  );

  return (
    <div className="v1">
      <nav className="v1-nav" aria-label="Primary">
        <Link href="/" className="nav-logo">
          <Image src="/logo.png" alt="" width={36} height={36} className="brand-logo" unoptimized />
          <span className="nav-wordmark">
            Serve<span>Local</span>
          </span>
        </Link>
        <div className="nav-links">
          {nl("/", "Home", pathname === "/")}
          {nl("/discover", "Find Opportunities", pathname === "/discover")}
          {nl(dashHref, "Dashboard", !!user && pathname === dashHref)}
          {nl("/leaderboard", "Community", pathname === "/leaderboard")}
        </div>
        <div className="nav-right">
          {user ? (
            <>
              {/* Notifications + inbox lived only in the suppressed shadcn header,
                  orphaning both features on v1 screens (audit 2026-07-13 #3). */}
              <Link className="nl" href="/notifications" aria-label="Notifications" title="Notifications">
                <Bell size={17} strokeWidth={1.75} aria-hidden />
              </Link>
              <Link className="nl" href="/inbox">
                Inbox
              </Link>
              <button className="nav-btn nb-outline" onClick={logout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link className="nav-btn nb-outline" href="/login">
                Log In
              </Link>
              <Link className="nav-btn nb-solid" href="/register">
                Sign Up Today
              </Link>
            </>
          )}
        </div>
      </nav>

      {children}

      <footer className="v1-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="nav-wordmark">
              Serve<span>Local</span>
            </span>
            <p>Verified community service for students. Free forever.</p>
          </div>
          <div className="footer-links">
            <Link href="/discover">Find Opportunities</Link>
            <Link href="/leaderboard">Community</Link>
            <Link href="/for-organizations">For Organizations</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/donate">Support Us</Link>
            <Link href="/login">Log In</Link>
          </div>
          <div className="footer-bottom">
            © 2026 ServeLocal · Free forever for students. · <Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
