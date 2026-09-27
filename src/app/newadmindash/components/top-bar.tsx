"use client";

import { usePathname } from "next/navigation";

const sectionTitles: Record<string, string> = {
  "/newadmindash": "Dashboard",
  "/newadmindash/pipeline": "Pipelines",
  "/newadmindash/deals": "Deals",
  "/newadmindash/contacts": "Contacts",
  "/newadmindash/companies": "Companies",
  "/newadmindash/projects": "Projects",
  "/newadmindash/tickets": "Tickets",
  "/newadmindash/users": "Users",
  "/newadmindash/settings": "Settings",
};

export function TopBar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname();

  const title = Object.entries(sectionTitles).find(([path]) =>
    path === "/newadmindash" ? pathname === path : pathname.startsWith(path)
  )?.[1] || "Dashboard";

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-1.5 text-sm rounded-md border border-gray-200 bg-gray-50 w-56 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors"
          />
        </div>

        <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
          <svg className="w-4.5 h-4.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
