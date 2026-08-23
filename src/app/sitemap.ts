import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { listPages } from "@/lib/pages";

export const revalidate = 3600;

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
      changeFrequency:
        p.path === "/"
          ? ("weekly" as const)
          : p.path.startsWith("/resources/")
            ? ("monthly" as const)
            : ("monthly" as const),
      priority:
        p.path === "/"
          ? 1
          : p.path.startsWith("/resources/")
            ? 0.6
            : 0.8,
    }));
}