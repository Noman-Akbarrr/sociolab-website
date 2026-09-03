"use client";

import { usePathname } from "next/navigation";

const sectionNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/pages": "Pages",
  "/admin/pipeline": "Pipeline",
  "/admin/deals": "Deals",
  "/admin/people": "People",
  "/admin/clients": "Clients",
};

export default function TopBar({ userName }: { userName: string }) {
  const pathname = usePathname();

  const segment = pathname.split("/").filter(Boolean);
  const section = segment.length >= 2 ? `/${segment[0]}/${segment[1]}` : `/${segment[0] || "admin"}`;
  const pageTitle = sectionNames[section] || "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-8">
      <div className="flex items-center gap-2 text-sm text-ink/50">
        <span className="font-medium text-ink">Sociolab</span>
        <span>/</span>
        <span>{pageTitle}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-ink/60">{userName}</span>
      </div>
    </header>
  );
}
