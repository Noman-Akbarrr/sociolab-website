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
    default: "Sociolab — Trend-Native GTM Team",
    template: "%s | Sociolab",
  },
  description:
    "We're the growth team for ambitious brands — producing content, running your social, marketing you, and building your web presence. One team, from trend to WhatsApp.",
  keywords: [
    "social media marketing agency Pakistan",
    "digital marketing agency Pakistan",
    "web development company Pakistan",
    "trend native agency",
    "GTM team",
    "WhatsApp marketing",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: site.url,
    siteName: site.name,
    title: "Sociolab — Trend-Native GTM Team",
    description:
      "Social, marketing, and web — one team, from trend to WhatsApp. We turn attention into customers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sociolab — Trend-Native GTM Team",
    description: "One team, from trend to WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navPosts = await listResourcePosts(4);

  return (
    <html lang="en" className={`${manrope.variable} ${unbounded.variable} ${spaceGrotesk.variable}`}>
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