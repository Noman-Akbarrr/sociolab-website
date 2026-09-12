"use client";

import { usePathname } from "next/navigation";

const sectionNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/pages": "Pages",
  "/admin/pipeline": "Pipelines",
  "/admin/projects": "Projects",
  "/admin/users": "Users",
  "/admin/clients": "Clients",
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  sales_executive: "Sales Executive",
  salesperson: "Salesperson",
  freelancer: "Freelancer",
};

export default function TopBar({ userName, userRole }: { userName: string; userRole: string }) {
  const pathname = usePathname();

  const segment = pathname.split("/").filter(Boolean);
  const section = segment.length >= 2 ? `/${segment[0]}/${segment[1]}` : `/${segment[0] || "admin"}`;
  const pageTitle = sectionNames[section] || "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#1E293B] bg-[#111827] px-8">
      <div className="flex items-center gap-2 text-sm text-white/50">
        <span className="font-medium text-white">Sociolab</span>
        <span>/</span>
        <span>{pageTitle}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white/60">
          {roleLabels[userRole] || userRole}
        </span>
        <span className="text-sm text-white/60">{userName}</span>
      </div>
    </header>
  );
}
