/** @type {import('next').NextConfig} */

// Origin of the backend API (scheme + host + port, no path), derived from the
// public API URL by dropping the /api/v1 suffix — needed for connect-src below.
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1").origin;
  } catch {
    return "http://localhost:8000";
  }
})();

const isDev = process.env.NODE_ENV === "development";

// Restores the CSP layer v1 had (ADR-0014) in v2's Next idiom. 'unsafe-eval' is
// only allowed in dev (Next's HMR needs it); production must never ship it.
// Cloudflare Turnstile (signup bot defense, M11.1) loads its script AND runs its
// challenge in an iframe, so it needs both script-src and frame-src for its origin.
const turnstile = "https://challenges.cloudflare.com";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${turnstile}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self' ${apiOrigin}`,
  `frame-src 'self' ${turnstile}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig = {
  // Emit a self-contained server bundle (.next/standalone) for a small Docker image (M10.1).
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Browsers only honor HSTS over HTTPS, so this is inert on local http
          // and takes effect automatically once prod TLS is live (M11.3). No
          // `preload` — that's a hard-to-undo registry commitment, Evan's call.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
