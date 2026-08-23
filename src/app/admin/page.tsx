import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth/current";
import { listPages } from "@/lib/pages";
import { groupPages } from "@/lib/admin-groups";
import { NewPageForm } from "./new-page";
import { TwoFactorSetup } from "./two-factor-setup";

export const metadata = {
  title: "Pages | Sociolab Admin",
  robots: { index: false, follow: false },
};

function pageHref(path: string) {
  return `/admin/edit${path === "/" ? "" : path}`;
}

export default async function AdminDashboard() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const groups = groupPages(await listPages());

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Pages
        </h1>
        <p className="text-sm text-ink/60">
          Signed in as {user.name}. Click any page to edit it, or create a new one.
        </p>
      </div>

      {!user.isTwoFactorEnabled ? <TwoFactorSetup /> : null}

      <NewPageForm />

      <div className="mt-12 flex flex-col gap-14">
        {groups.map((group) => (
          <section key={group.key} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
                {group.label}
              </h2>
              <p className="text-xs text-ink/50">{group.hint}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.pages.map((page) => (
                <Link
                  key={page.path}
                  href={pageHref(page.path)}
                  className="group flex flex-col justify-between gap-6 rounded-[3px] border border-line bg-white p-5 transition-colors hover:border-brand"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                      {page.path === "/" ? "Homepage" : page.path}
                    </span>
                    <span className="font-display text-base font-semibold leading-snug text-ink group-hover:text-brand">
                      {page.title || "Untitled page"}
                    </span>
                  </div>
                  <span className="text-xs text-ink/50">
                    {page.updatedAt
                      ? `Edited ${new Date(page.updatedAt).toLocaleString()}`
                      : "Seed content — not edited yet"}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}