import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "CRM Dashboard | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function CRMDashboard() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  let dbConnected = true;
  let dealsCount = 0;
  let openDealsValue = { _sum: { value: 0 } } as { _sum: { value: number | null } };
  let wonDealsThisMonth = 0;
  let activeProjects = 0;
  let openTickets = 0;
  let myTasks = 0;
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
      prisma.task.count({
        where: { assigneeId: user.id, status: { in: ["todo", "in-progress", "review"] } },
      }),
      prisma.deal.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { company: true, stage: true },
      }),
      prisma.activity.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } }, deal: { select: { id: true, title: true } }, company: { select: { id: true, name: true } }, project: { select: { id: true, name: true } }, ticket: { select: { id: true, number: true, subject: true } } },
      }),
    ]);

    [dealsCount, openDealsValue, wonDealsThisMonth, activeProjects, openTickets, myTasks, recentDeals, recentActivities] = results;
  } catch (error) {
    console.error("Database connection error:", error);
    dbConnected = false;
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
  };

  if (!dbConnected) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            CRM Dashboard
          </h1>
          <p className="text-sm text-ink/60">
            Sales pipeline, projects, tickets & tasks — all in one place.
          </p>
        </div>
        <div className="mt-8 rounded-[3px] border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-3">
            <svg className="size-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <h2 className="font-display text-lg font-semibold text-amber-800">Database not connected</h2>
              <p className="text-sm text-amber-700 mt-1">
                The CRM requires a PostgreSQL database. Please add your <code className="font-mono bg-amber-100 px-1 rounded">DATABASE_URL</code> to the <code className="font-mono bg-amber-100 px-1 rounded">.env</code> file.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="/admin/crm/deals" className="rounded-[3px] border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand">Try Deals</a>
                <a href="/admin/crm/companies" className="rounded-[3px] border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand">Try Companies</a>
                <a href="/admin/crm/projects" className="rounded-[3px] border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand">Try Projects</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Deals", value: dealsCount.toString(), href: "/admin/crm/deals", color: "text-brand" },
    { label: "Pipeline Value", value: formatCurrency(openDealsValue._sum.value || 0), href: "/admin/crm/pipeline", color: "text-brand" },
    { label: "Won This Month", value: wonDealsThisMonth.toString(), href: "/admin/crm/deals?stage=won", color: "text-green-600" },
    { label: "Active Projects", value: activeProjects.toString(), href: "/admin/crm/projects", color: "text-blue-600" },
    { label: "Open Tickets", value: openTickets.toString(), href: "/admin/crm/tickets", color: "text-orange-600" },
    { label: "My Tasks", value: myTasks.toString(), href: "/admin/crm/tasks", color: "text-purple-600" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          CRM Dashboard
        </h1>
        <p className="text-sm text-ink/60">
          Sales pipeline, projects, tickets & tasks — all in one place.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex flex-col gap-2 rounded-[3px] border border-line bg-white p-5 transition-colors hover:border-brand"
          >
            <span className="text-xs text-ink/50">{stat.label}</span>
            <span className={`font-display text-2xl font-semibold ${stat.color} group-hover:text-brand`}>
              {stat.value}
            </span>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/crm/deals/new"
          className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
        >
          + New Deal
        </Link>
        <Link
          href="/admin/crm/companies/new"
          className="inline-flex items-center gap-2 rounded-[3px] border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand"
        >
          + New Company
        </Link>
        <Link
          href="/admin/crm/projects/new"
          className="inline-flex items-center gap-2 rounded-[3px] border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand"
        >
          + New Project
        </Link>
        <Link
          href="/admin/crm/tickets/new"
          className="inline-flex items-center gap-2 rounded-[3px] border border-line bg-white px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand"
        >
          + New Ticket
        </Link>
      </div>

      {/* Recent Deals & Activity */}
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Recent Deals */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">Recent Deals</h2>
            <Link href="/admin/crm/deals" className="text-xs font-semibold text-brand hover:underline">View all</Link>
          </div>
          <div className="rounded-[3px] border border-line bg-white overflow-hidden">
            {recentDeals.length === 0 ? (
              <p className="p-8 text-center text-sm text-ink/50">No deals yet. Create your first one.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recentDeals.map((deal) => (
                  <li key={deal.id} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                    <Link href={`/admin/crm/deals/${deal.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate font-display text-sm font-semibold text-ink">{deal.title}</span>
                      <span className="truncate text-xs text-ink/50">{deal.company.name}</span>
                    </Link>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${
                        deal.stage.isWon
                          ? "bg-green-100 text-green-700"
                          : deal.stage.isClosed
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
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

        {/* Recent Activity */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold tracking-tight text-ink">Recent Activity</h2>
            <Link href="/admin/crm/activity" className="text-xs font-semibold text-brand hover:underline">View all</Link>
          </div>
          <div className="rounded-[3px] border border-line bg-white overflow-hidden">
            {recentActivities.length === 0 ? (
              <p className="p-8 text-center text-sm text-ink/50">No activity yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="flex flex-col gap-1 p-4 hover:bg-mist/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="font-display text-sm font-semibold text-ink">{activity.subject}</span>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                          <span className="font-mono">{activity.user.name}</span>
                          <span>·</span>
                          <span>{new Date(activity.createdAt).toLocaleString()}</span>
                          {activity.deal && (
                            <>
                              <span>·</span>
                              <Link href={`/admin/crm/deals/${activity.deal.id}`} className="text-brand hover:underline">
                                {activity.deal.title}
                              </Link>
                            </>
                          )}
                          {activity.company && (
                            <>
                              <span>·</span>
                              <Link href={`/admin/crm/companies/${activity.company.id}`} className="text-brand hover:underline">
                                {activity.company.name}
                              </Link>
                            </>
                          )}
                          {activity.project && (
                            <>
                              <span>·</span>
                              <Link href={`/admin/crm/projects/${activity.project.id}`} className="text-brand hover:underline">
                                {activity.project.name}
                              </Link>
                            </>
                          )}
                          {activity.ticket && (
                            <>
                              <span>·</span>
                              <Link href={`/admin/crm/tickets/${activity.ticket.id}`} className="text-brand hover:underline">
                                {activity.ticket.number}
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.1em] text-ink/40">
                        {activity.type.replace(/-/g, " ")}
                      </span>
                    </div>
                    {activity.body && <p className="text-sm text-ink/60 line-clamp-2">{activity.body}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}