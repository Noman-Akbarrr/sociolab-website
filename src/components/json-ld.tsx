import { site } from "@/lib/site";

export function JsonLd({ path }: { path: string }) {
  const pathParts = path.split("/").filter(Boolean);
  const isRoot = pathParts.length === 0;
  const isService = path.startsWith("/services/");

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

  const breadcrumb = pathParts.length
    ? [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: site.url,
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
          item: site.url,
        },
      ];

  let schema: object;

  if (isRoot) {
    schema = org;
  } else if (isService) {
    const serviceName = path.replace("/services/", "").replace(/-/g, " ");
    schema = {
      ...org,
      "@type": "Service",
      name: serviceName,
    };
  } else {
    schema = {
      ...org,
      "@type": "Blog",
      url: site.url,
      description: site.tagline,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
