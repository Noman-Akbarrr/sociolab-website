import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { listPages } from "@/lib/pages";

export const revalidate = 3600;

const CORE_PATHS = new Set([
  "/",
  "/services/paid-acquisition",
  "/services/creative-production",
  "/services/creator-marketing",
  "/case-studies",
  "/about",
  "/contact",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await listPages();

  return pages
    .filter(
      (p) =>
        p.published &&
        !p.path.startsWith("/admin") &&
        !p.path.startsWith("/api") &&
        !p.path.startsWith("/legal"),
    )
    .map((p) => ({
      url: `${site.url}${p.path}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: CORE_PATHS.has(p.path)
        ? ("weekly" as const)
        : p.path.startsWith("/resources/")
          ? ("monthly" as const)
          : ("weekly" as const),
      priority: p.path === "/" ? 1 : CORE_PATHS.has(p.path) ? 0.9 : 0.7,
    }));
}
