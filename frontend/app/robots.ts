import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Operator surfaces — nothing here belongs in a search index.
      disallow: ["/admin", "/dashboard", "/applicants", "/inbox", "/notifications"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
