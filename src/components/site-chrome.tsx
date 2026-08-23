"use client";

import { usePathname } from "next/navigation";
import { Navbar, type NavPost } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export function SiteChrome({
  children,
  navPosts = [],
}: {
  children: React.ReactNode;
  navPosts?: NavPost[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar posts={navPosts} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}