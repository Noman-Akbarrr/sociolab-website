import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const metadata = {
  title: "CRM Dashboard | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function CRMDashboard() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const stats = store.getDashboardStats(user.id);
  const db = store.__readDb();

  const openDealsValue = db.deals
    .filter((d: any) => {
      const stage = db.pipelineStages.find((s: any) => s.id === d.stageId);
      return stage && !stage.isClosed;
    })
    .reduce((sum: number, d: any) => sum + (d.value || 0), 0);

  const recentDeals = db.deals.slice(0, 5).map((deal: any) => ({
    ...deal,
    company: db.companies.find((c: any) => c.id === deal.companyId),
    stage: db.pipelineStages.find((s: any) => s.id === deal.stageId),
  }));

  const recentActivities = db.activities.slice(0, 10).map((activity: any) => ({
    ...activity,
    user: db.teamMembers.find((u: any) => u.id === activity.userId) || { id: "", name: "Unknown" },
    deal: activity.dealId ? db.deals.find((d: any) => d.id === activity.dealId) : null,
    company: activity.companyId ? db.companies.find((c: any) => c.id === activity.companyId) : null,
    project: activity.projectId ? db.projects.find((p: any) => p.id === activity.projectId) : null,
    ticket: activity.ticketId ? db.tickets.find((t: any) => t.id === activity.ticketId) : null,
  }));

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
  };

  const statsCards = [
    { label: "Total Deals", value: (stats.dealsCount || 0).toString(), href: "/admin/crm/deals", color: "text-brand" },
    { label: "Pipeline Value", value: formatCurrency(openDealsValue || 0), href: "/admin/crm/pipeline", color: "text-brand" },
    { label: "Won This Month", value: (stats.wonDealsThisMonth || 0).toString(), href: "/admin/crm/deals?stage=won", color: "text-green-600" },
    { label: "Active Projects", value: (stats.activeProjects || 0).toString(), href: "/admin/crm/projects", color: "text-blue-600" },
    { label: "Open Tickets", value: (stats.openTickets || 0).toString(), href: "/admin/crm/tickets", color: "text-orange-600" },
    { label: "My Tasks", value: (db.tasks.filter((t: any) => t.assigneeId === user.id && ["todo", "in-progress", "review"].includes(t.status)).length || 0).toString(), href: "/admin/crm/tasks", color: "text-purple-600" },
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
        {statsCards.map((stat) => (
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
                {recentDeals.map((deal: any) => (
                  <li key={deal.id} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                    <Link href={`/admin/crm/deals/${deal.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate font-display text-sm font-semibold text-ink">{deal.title}</span>
                      <span className="truncate text-xs text-ink/50">{deal.company?.name || "Unknown"}</span>
                    </Link>
                    <span
                      className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${
                        deal.stage?.isWon
                          ? "bg-green-100 text-green-700"
                          : deal.stage?.isClosed
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                      style={{ backgroundColor: `${deal.stage?.color}20`, color: deal.stage?.color }}
                    >
                      {deal.stage?.label}
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
                {recentActivities.map((activity: any) => (
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
