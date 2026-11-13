"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Bare routes render with no header or footer: the admin panel manages its
  // own chrome, and the TikTok OAuth callback is an end-of-flow screen the
  // user should close, not a page to browse from.
  const isAdmin = pathname.startsWith("/admin");
  const isTikTokConnect = pathname.startsWith("/tiktok");

  if (isAdmin || isTikTokConnect) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main id="main" className="flex-1 site-root">
        {children}
      </main>
      <Footer />
    </>
  );
}
