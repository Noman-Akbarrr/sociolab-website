import Link from "next/link";
import { listPages } from "@/lib/pages";
import { groupPages } from "@/lib/admin-groups";
import { NewPageForm } from "./new-page";

export const metadata = {
  title: "Pages | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function PagesList() {
  const groups = groupPages(await listPages());

  return (
    <div className="px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Pages</h1>
          <p className="mt-1 text-sm text-ink/50">Manage your website pages and blog posts.</p>
        </div>
        <NewPageForm />
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {groups.map((group) => (
          <section key={group.key}>
            <div className="mb-4">
              <h2 className="font-display text-lg font-semibold text-ink">{group.label}</h2>
              <p className="text-xs text-ink/50">{group.hint}</p>
            </div>
            <div className="rounded-[3px] border border-line bg-white overflow-hidden">
              <ul className="divide-y divide-line">
                {group.pages.map((page) => (
                  <li key={page.path}>
                    <Link
                      href={`/admin/edit${page.path === "/" ? "" : page.path}`}
                      className="flex items-center justify-between p-4 hover:bg-mist/50 transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-display text-sm font-semibold text-ink group-hover:text-brand">
                          {page.title || "Untitled page"}
                        </span>
                        <span className="font-mono text-xs text-ink/40">{page.path}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-ink/40">
                          {page.updatedAt
                            ? `Edited ${new Date(page.updatedAt).toLocaleDateString()}`
                            : "Not edited"}
                        </span>
                        <svg className="w-4 h-4 text-ink/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
