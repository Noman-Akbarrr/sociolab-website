import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import { listPages } from "@/lib/pages";
import { groupPages } from "@/lib/admin-groups";

export const metadata = {
  title: "Dashboard | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function Dashboard() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  let dbConnected = true;
  let dealsCount = 0;
  let openDealsValue = { _sum: { value: 0 } } as { _sum: { value: number | null } };
  let wonDealsThisMonth = 0;
  let activeProjects = 0;
  let openTickets = 0;
  let recentDeals: any[] = [];
  let recentActivities: any[] = [];

  try {
    const results = await Promise.all([
      prisma.deal.count(),
      prisma.deal.aggregate({
        where: { stage: { isClosed: false, isWon: false } },
        _sum: { value: true },
      }),
      prisma.deal.count({
        where: {
          stage: { isWon: true },
          closedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
      }),
      prisma.project.count({ where: { status: { in: ["kickoff", "active"] } } }),
      prisma.ticket.count({ where: { status: { in: ["open", "waiting-client", "in-progress"] } } }),
      prisma.deal.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { company: true, stage: true },
      }),
      prisma.activity.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true } },
          deal: { select: { id: true, title: true } },
          company: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
      }),
    ]);

    [dealsCount, openDealsValue, wonDealsThisMonth, activeProjects, openTickets, recentDeals, recentActivities] = results;
  } catch {
    dbConnected = false;
  }

  const pages = await listPages();
  const groups = groupPages(pages);

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

  const stats = [
    { label: "Total Deals", value: dealsCount.toString(), href: "/admin/pipeline", color: "text-brand" },
    { label: "Pipeline Value", value: formatCurrency(openDealsValue._sum.value || 0), href: "/admin/pipeline", color: "text-brand" },
    { label: "Won This Month", value: wonDealsThisMonth.toString(), href: "/admin/deals", color: "text-green-600" },
    { label: "Active Projects", value: activeProjects.toString(), href: "/admin/clients", color: "text-blue-600" },
    { label: "Open Tickets", value: openTickets.toString(), href: "/admin/clients", color: "text-orange-600" },
  ];

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Welcome back, {user.name}
        </h1>
        <p className="mt-1 text-sm text-ink/50">Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats */}
      {dbConnected && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-[3px] border border-line bg-white p-5 transition-colors hover:border-brand"
            >
              <span className="text-xs text-ink/50">{stat.label}</span>
              <span className={`mt-1 block font-display text-2xl font-semibold ${stat.color}`}>
                {stat.value}
              </span>
            </Link>
          ))}
        </div>
      )}

      {!dbConnected && (
        <div className="rounded-[3px] border border-line bg-white p-6">
          <p className="text-sm text-ink/60">
            Database not connected. CRM features require a PostgreSQL connection. Pages and blog work with file storage.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
        >
          + New Page
        </Link>
        <Link
          href="/admin/pipeline"
          className="inline-flex items-center gap-2 rounded-[3px] border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand"
        >
          View Pipeline
        </Link>
        <Link
          href="/admin/clients"
          className="inline-flex items-center gap-2 rounded-[3px] border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand"
        >
          View Clients
        </Link>
      </div>

      {/* Recent Deals & Activity */}
      {dbConnected && (
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Recent Deals</h2>
              <Link href="/admin/deals" className="text-xs font-semibold text-brand hover:underline">
                View all
              </Link>
            </div>
            <div className="rounded-[3px] border border-line bg-white overflow-hidden">
              {recentDeals.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink/50">No deals yet.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {recentDeals.map((deal) => (
                    <li key={deal.id} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                      <Link href={`/admin/deals/${deal.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="truncate font-display text-sm font-semibold text-ink">{deal.title}</span>
                        <span className="truncate text-xs text-ink/50">{deal.company?.name}</span>
                      </Link>
                      <span
                        className="shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em]"
                        style={{ backgroundColor: `${deal.stage.color}20`, color: deal.stage.color }}
                      >
                        {deal.stage.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="font-display text-lg font-semibold text-ink">Recent Activity</h2>
            <div className="rounded-[3px] border border-line bg-white overflow-hidden">
              {recentActivities.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink/50">No activity yet.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {recentActivities.map((a) => (
                    <li key={a.id} className="p-4 hover:bg-mist/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="font-display text-sm font-semibold text-ink">{a.subject}</span>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                            <span>{a.user?.name}</span>
                            <span>&middot;</span>
                            <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                            {a.deal && (
                              <>
                                <span>&middot;</span>
                                <Link href={`/admin/deals/${a.deal.id}`} className="text-brand hover:underline">
                                  {a.deal.title}
                                </Link>
                              </>
                            )}
                            {a.company && (
                              <>
                                <span>&middot;</span>
                                <Link href={`/admin/clients/${a.company.id}`} className="text-brand hover:underline">
                                  {a.company.name}
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-ink/40">
                          {a.type.replace(/-/g, " ")}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Pages Overview */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">Pages</h2>
          <Link href="/admin/pages" className="text-xs font-semibold text-brand hover:underline">
            Manage all
          </Link>
        </div>
        <div className="rounded-[3px] border border-line bg-white overflow-hidden">
          {groups.slice(0, 2).map((group) => (
            <div key={group.key}>
              <div className="border-b border-line bg-mist/50 px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/50">{group.label}</span>
              </div>
              <ul className="divide-y divide-line">
                {group.pages.slice(0, 4).map((page) => (
                  <li key={page.path}>
                    <Link
                      href={`/admin/edit${page.path === "/" ? "" : page.path}`}
                      className="flex items-center justify-between p-4 hover:bg-mist/50"
                    >
                      <div>
                        <span className="font-display text-sm font-semibold text-ink">{page.title || "Untitled"}</span>
                        <span className="ml-2 font-mono text-xs text-ink/40">{page.path}</span>
                      </div>
                      <span className="text-xs text-ink/40">
                        {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "Not edited"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
