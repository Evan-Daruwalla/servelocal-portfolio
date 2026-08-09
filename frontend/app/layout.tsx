import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import "./v1.css";
import { AuthProvider } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// A nonce is minted per request, so a page prerendered at build time would ship
// inline scripts stamped with a nonce that no longer matches the header — the
// browser would block Next's own bootstrap and the app would not hydrate at all.
// Inheriting down from the root layout opts every route into per-request
// rendering, which is what makes the strict `script-src` in `proxy.ts` viable
// (2026-08-07). Cheap here: every page is a client shell that fetches from the
// API in the browser, so there was no server-side data work being cached.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "ServeLocal",
  description: "Verified community service for students. Free forever.",
  icons: { icon: "/logo.png" },
  openGraph: {
    title: "ServeLocal",
    description: "Verified community service for students. Free forever.",
    siteName: "ServeLocal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable} min-h-screen font-sans antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
