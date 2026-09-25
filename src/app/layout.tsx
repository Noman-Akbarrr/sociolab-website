import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { SiteChrome } from "@/components/site-chrome";
import { LenisProvider } from "@/components/lenis-provider";
import "lenis/dist/lenis.css";
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
    default: "Sociolab | Digital Marketing Agency Pakistan",
    template: "%s | Sociolab — Digital Marketing Agency",
  },
  description:
    "Full-service digital marketing agency helping brands grow through performance marketing, social media management, and high-converting websites.",
  keywords: [
    "digital marketing agency Pakistan",
    "performance marketing agency",
    "social media management Pakistan",
    "web development Pakistan",
    "Meta ads agency Pakistan",
    "Google ads agency Pakistan",
    "digital marketing services",
    "social media marketing",
    "website development Pakistan",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: site.url,
    siteName: site.name,
    title: "Sociolab | Digital Marketing Agency Pakistan",
    description:
      "Full-service digital marketing agency helping brands grow through performance marketing, social media management, and high-converting websites.",
    images: [
      {
        url: `${site.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sociolab — Digital Marketing Agency",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sociolab | Digital Marketing Agency Pakistan",
    description:
      "Full-service digital marketing agency helping brands grow through performance marketing, social media management, and high-converting websites.",
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
  return (
    <html lang="en" className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0F172A" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window, document, "clarity", "script", "yf1eli4ta6");`,
          }}
        />
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
                  "description": "Full-service digital marketing agency helping brands grow through performance marketing, social media management, and high-converting websites.",
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
                    "Social Media Management",
                    "Content Creation",
                    "Web Development",
                    "Landing Page Design",
                    "E-Commerce Development",
                    "Digital Marketing Strategy"
                  ],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Sociolab Services",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Performance Marketing",
                          "description": "Data-driven Meta and Google ad campaigns engineered to acquire customers at a profitable cost"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Social Media Management",
                          "description": "Strategic content creation, community management, and growth across Instagram, Facebook, and TikTok"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Web Development",
                          "description": "High-converting websites, landing pages, and e-commerce stores built to turn traffic into customers"
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
                  "description": "Digital Marketing Agency Pakistan",
                  "publisher": {
                    "@id": "https://sociolab.com.pk/#organization"
                  },
                  "inLanguage": "en-PK"
                },
                {
                  "@type": "WebPage",
                  "@id": "https://sociolab.com.pk/#webpage",
                  "url": "https://sociolab.com.pk",
                  "name": "Sociolab | Digital Marketing Agency Pakistan",
                  "isPartOf": {
                    "@id": "https://sociolab.com.pk/#website"
                  },
                  "about": {
                    "@id": "https://sociolab.com.pk/#organization"
                  },
                  "description": "Full-service digital marketing agency helping brands grow through performance marketing, social media management, and high-converting websites.",
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
        <LenisProvider>
          <AnalyticsProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
            >
              Skip to content
            </a>
            <SiteChrome>{children}</SiteChrome>
          </AnalyticsProvider>
        </LenisProvider>
      </body>
    </html>
  );
}