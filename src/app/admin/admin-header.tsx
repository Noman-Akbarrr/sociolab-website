"use client";

import { useRouter } from "next/navigation";

export function AdminHeader() {
  const router = useRouter();

  async function logout() {
    await fetch("/admin/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-line bg-ink text-white">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-[4px] bg-brand font-display text-xs font-bold">
            S
          </span>
          <span className="font-display text-sm font-semibold tracking-tight">
            Sociolab <span className="text-white/50">Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-5">
            <a
              href="/admin"
              className="text-xs font-semibold text-white/70 transition-colors hover:text-white"
            >
              Pages
            </a>
            <a
              href="/admin/blog"
              className="text-xs font-semibold text-white/70 transition-colors hover:text-white"
            >
              Blog
            </a>
          </nav>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-white/70 transition-colors hover:text-white"
          >
            View site ↗
          </a>
          <button
            type="button"
            onClick={logout}
            className="rounded-[3px] border border-white/25 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-brand hover:text-brand"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}