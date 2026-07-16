import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Static public routes only. Dynamic /opportunities/<id> URLs are a later follow-up.
const ROUTES = [
  "/",
  "/discover",
  "/leaderboard",
  "/pricing",
  "/for-organizations",
  "/donate",
  "/privacy",
  "/terms",
  "/login",
  "/register",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
  }));
}
