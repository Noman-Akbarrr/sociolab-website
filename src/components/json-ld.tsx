"use client";

import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

export function JsonLd({ puckPath }: { puckPath?: string[] }) {
  const pathname = usePathname();
  const pathParts = (puckPath || []).filter((p) => p);
  const isRoot = pathParts.length === 0;

  // Build Organization schema (site-wide)
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.tagline,
    logo: `${site.url}/opengraph-image`,
    sameAs: [
      site.socials.instagram,
      site.socials.facebook,
      site.socials.x,
      site.socials.linkedin,
    ].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.whatsappNumber.replace(/[^\d]/g, ""),
      contactType: "customer service",
    },
  };

  // Build service schema for service pages
  const isService = pathname.startsWith("/services/");

  // Build breadcrumb for nested pages
  const breadcrumb = pathParts.length
    ? [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${site.url}`,
        },
        ...pathParts.map((part, i) => ({
          "@type": "ListItem",
          position: i + 2,
          name: part.replace(/-/g, " "),
          item: `${site.url}/${pathParts.slice(0, i + 1).join("/")}`,
        })),
      ]
    : [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${site.url}`,
        },
      ];

  // Choose which schema to output
  if (isRoot) {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org, null, 2) }}
      />
    );
  }

  if (isService) {
    const serviceName = pathname.replace("/services/", "").replace(/-/g, " ");
    const serviceSchema = {
      ...org,
      "@type": "Service",
      name: serviceName,
    };
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema, null, 2) }}
      />
    );
  }

  // Default: BlogPosting or generic
  const blogSchema = {
    ...org,
    "@type": "Blog",
    url: site.url,
    description: site.tagline,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema, null, 2) }}
    />
  );
}