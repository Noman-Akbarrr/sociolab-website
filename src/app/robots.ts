import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Admin is internal-only; never let search engines index it.
        disallow: ["/admin", "/api"],
      },
      // Allow search & AI crawlers (broadly) — enables Sociolab to appear
      // in AI answer engines and standard search results.
      {
        userAgent: "GPTBot,OAI-SearchBot,ChatGPT-User,ClaudeBot,PerplexityBot,Google-Extended,Applebot,CCBot,meta-externalagent,Bytespider",
        allow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}