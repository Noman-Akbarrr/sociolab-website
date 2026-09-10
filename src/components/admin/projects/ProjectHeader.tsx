"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Profile", query: "profile" },
  { label: "Work", query: "work" },
  { label: "Submissions", query: "submissions" },
  { label: "Reports", query: "reports" },
];

export function ProjectHeader({ project }: { project: any }) {
  const pathname = usePathname();
  const company = project.company;
  const contactEmail = project.deal?.contactEmail || "";
  const assignee = project.assignee;

  const currentTab = "profile";

  return (
    <div className="border-b border-[#1E293B]">
      {/* Project info row */}
      <div className="flex items-center gap-4 px-8 py-5">
        {/* Company logo */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1E293B] overflow-hidden">
          {company?.logo ? (
            <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-white/60">{company?.name?.charAt(0) || "?"}</span>
          )}
        </div>

        {/* Project name + meta */}
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-semibold text-white truncate">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/50">
            {company && (
              <Link href={`/admin/clients/${company.id}`} className="hover:text-white transition-colors">
                {company.name}
              </Link>
            )}
            <span>·</span>
            <span>Assigned to {assignee?.name || "Unassigned"}</span>
            {contactEmail && (
              <>
                <span>·</span>
                <span>{contactEmail}</span>
              </>
            )}
          </div>
        </div>

        {/* Back link */}
        <Link href="/admin/projects" className="shrink-0 rounded-[3px] border border-[#1E293B] px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:border-white/30 transition-colors">
          All Projects
        </Link>
      </div>

      {/* Tab bar */}
      <nav className="flex gap-0 px-8">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.query;
          return (
            <Link
              key={tab.query}
              href={`/admin/projects/${project.id}?tab=${tab.query}`}
              className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-brand"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
