import type { Metadata } from "next";
import { Manrope, Space_Grotesk, Unbounded } from "next/font/google";
import { site } from "@/lib/site";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { SiteChrome } from "@/components/site-chrome";
import { listResourcePosts } from "@/lib/pages";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
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
    <html lang="en" className={`${manrope.variable} ${unbounded.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0F172A" />
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