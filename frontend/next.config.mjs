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
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self' ${apiOrigin}`,
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
        ],
      },
    ];
  },
};

export default nextConfig;
