import type { MetadataRoute } from "next";
import { TRAINERS } from "@/lib/data";

const BASE = "https://ironhaus.fit";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/classes", "/trainers", "/pricing", "/join", "/contact"].map(
    (route) => ({
      url: `${BASE}${route}`,
      lastModified: new Date(),
    }),
  );
  const trainerRoutes = TRAINERS.map((t) => ({
    url: `${BASE}/trainers/${t.id}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...trainerRoutes];
}
