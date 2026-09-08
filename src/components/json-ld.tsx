import { site } from "@/lib/site";

export function JsonLd({ path }: { path: string }) {
  const pathParts = path.split("/").filter(Boolean);
  const isRoot = pathParts.length === 0;
  const isService = path.startsWith("/services/");

  if (isRoot) {
    return null;
  }

  if (isService) {
    const serviceName = path.replace("/services/", "").replace(/-/g, " ");
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": serviceName.charAt(0).toUpperCase() + serviceName.slice(1),
      "url": `${site.url}${path}`,
      "provider": {
        "@id": "https://sociolab.com.pk/#organization"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Pakistan"
      },
      "serviceType": "Marketing Service",
      "description": `Professional ${serviceName} services by Sociolab — Performance Media & Creative Growth Agency.`
    };
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema, null, 2) }}
      />
    );
  }

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "url": `${site.url}${path}`,
    "name": path.replace(/\//g, " ").replace(/-/g, " ").trim() || "Sociolab Resources",
    "description": site.tagline,
    "publisher": {
      "@id": "https://sociolab.com.pk/#organization"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema, null, 2) }}
    />
  );
}
