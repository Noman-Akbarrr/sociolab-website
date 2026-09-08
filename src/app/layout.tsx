import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { SiteChrome } from "@/components/site-chrome";
import { listResourcePosts } from "@/lib/pages";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Sociolab | Full-Funnel Paid Media & Direct-Response Creative Studio",
    template: "%s | Sociolab — Performance Media & Creative Growth Agency",
  },
  description:
    "Sociolab scales direct-to-consumer and B2B brands through performance Meta & Google ads, in-house direct-response video production, and automated creator seeding.",
  keywords: [
    "performance marketing agency Pakistan",
    "paid media agency",
    "direct-response creative studio",
    "Meta ads agency",
    "Google ads agency",
    "DTC brand growth",
    "B2B lead generation",
    "video production for ads",
    "creator marketing agency",
    "social media marketing agency Pakistan",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: site.url,
    siteName: site.name,
    title: "Sociolab | Full-Funnel Paid Media & Direct-Response Creative Studio",
    description:
      "Eliminate wasted ad spend. We engineer predictable acquisition funnels using data-driven paid advertising, high-converting short-form video, and creator partnerships.",
    images: [
      {
        url: `${site.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sociolab — Performance Media & Creative Growth Agency",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sociolab | Full-Funnel Paid Media & Direct-Response Creative Studio",
    description:
      "Eliminate wasted ad spend. We engineer predictable acquisition funnels using data-driven paid advertising, high-converting short-form video, and creator partnerships.",
    images: [`${site.url}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navPosts = await listResourcePosts(4);

  return (
    <html lang="en" className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0F172A" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "MarketingAgency",
                  "@id": "https://sociolab.com.pk/#organization",
                  "name": "Sociolab",
                  "alternateName": ["Social Lab", "Sociolab Pakistan"],
                  "url": "https://sociolab.com.pk",
                  "logo": "https://sociolab.com.pk/opengraph-image",
                  "image": "https://sociolab.com.pk/opengraph-image",
                  "description": "Sociolab scales direct-to-consumer and B2B brands through performance Meta & Google ads, in-house direct-response video production, and automated creator seeding.",
                  "sameAs": [
                    "https://www.instagram.com/sociolab.official/",
                    "https://www.linkedin.com/company/sociolab-pk",
                    "https://www.facebook.com/sociolab",
                    "https://x.com/sociolab"
                  ],
                  "founder": [
                    {
                      "@type": "Person",
                      "name": "Noman Akbar Khan",
                      "jobTitle": "Co-Founder & Chief Marketing Officer"
                    },
                    {
                      "@type": "Person",
                      "name": "Khizar Farooq",
                      "jobTitle": "Founder & Creative Director"
                    }
                  ],
                  "address": {
                    "@type": "PostalAddress",
                    "addressRegion": "Punjab",
                    "addressCountry": "PK"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "31.5204",
                    "longitude": "74.3587"
                  },
                  "areaServed": {
                    "@type": "Country",
                    "name": "Pakistan"
                  },
                  "priceRange": "$$$",
                  "knowsAbout": [
                    "Performance Marketing",
                    "Meta Ads Management",
                    "Google Ads Management",
                    "Direct-Response Creative Strategy",
                    "Short-Form Video Production",
                    "Influencer Marketing Automation",
                    "Conversion Rate Optimization",
                    "DTC Brand Growth",
                    "B2B Lead Generation",
                    "Creator Marketing"
                  ],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Sociolab Services",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Paid Acquisition",
                          "description": "Performance Meta & Google ads management for DTC and B2B brands"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Creative Production",
                          "description": "In-house direct-response video production and ad creative"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Creator Marketing",
                          "description": "Automated creator seeding and influencer partnership programs"
                        }
                      }
                    ]
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://sociolab.com.pk/#website",
                  "url": "https://sociolab.com.pk",
                  "name": "Sociolab",
                  "description": "Performance Media & Creative Growth Agency",
                  "publisher": {
                    "@id": "https://sociolab.com.pk/#organization"
                  },
                  "inLanguage": "en-PK"
                },
                {
                  "@type": "WebPage",
                  "@id": "https://sociolab.com.pk/#webpage",
                  "url": "https://sociolab.com.pk",
                  "name": "Sociolab | Full-Funnel Paid Media & Direct-Response Creative Studio",
                  "isPartOf": {
                    "@id": "https://sociolab.com.pk/#website"
                  },
                  "about": {
                    "@id": "https://sociolab.com.pk/#organization"
                  },
                  "description": "Sociolab scales direct-to-consumer and B2B brands through performance Meta & Google ads, in-house direct-response video production, and automated creator seeding.",
                  "breadcrumb": {
                    "@id": "https://sociolab.com.pk/#breadcrumb"
                  },
                  "inLanguage": "en-PK",
                  "potentialAction": {
                    "@type": "ReadAction",
                    "target": "https://sociolab.com.pk"
                  }
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": "https://sociolab.com.pk/#breadcrumb",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://sociolab.com.pk"
                    }
                  ]
                }
              ]
            }),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <AnalyticsProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
          >
            Skip to content
          </a>
          <SiteChrome navPosts={navPosts}>{children}</SiteChrome>
        </AnalyticsProvider>
      </body>
    </html>
  );
}