"use client";

import Link from "next/link";

const statusColors: Record<string, string> = {
  kickoff: "bg-purple-100 text-purple-700",
  active: "bg-blue-100 text-blue-700",
  paused: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-700",
};

const priorityLabels: Record<number, string> = {
  0: "Low",
  1: "Medium",
  2: "High",
  3: "Urgent",
};

const priorityColors: Record<number, string> = {
  0: "bg-white/10 text-white/50",
  1: "bg-blue-500/20 text-blue-400",
  2: "bg-yellow-500/20 text-yellow-400",
  3: "bg-red-500/20 text-red-400",
};

export function ProjectProfile({ project }: { project: any }) {
  const company = project.company;
  const tasks = project.tasks || [];
  const invoices = project.invoices || [];
  const activities = project.activities || [];

  const openTasks = tasks.filter((t: any) => t.status !== "done").length;
  const completedTasks = tasks.filter((t: any) => t.status === "done").length;
  const outstandingInvoices = invoices.filter((i: any) => i.status !== "paid" && i.status !== "void").length;
  const openTickets = project._count?.tickets ?? 0;

  const daysElapsed = project.startDate
    ? Math.floor((Date.now() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const formatBudget = (cents: number | null, currency: string) => {
    if (!cents) return "—";
    return `${currency} ${(cents / 100).toLocaleString()}`;
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-4">
          <div className="text-2xl font-bold text-white">{openTasks}</div>
          <div className="text-xs text-white/50">Open Tasks</div>
        </div>
        <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-4">
          <div className="text-2xl font-bold text-white">{completedTasks}</div>
          <div className="text-xs text-white/50">Completed</div>
        </div>
        <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-4">
          <div className="text-2xl font-bold text-white">{outstandingInvoices}</div>
          <div className="text-xs text-white/50">Outstanding Invoices</div>
        </div>
        <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-4">
          <div className="text-2xl font-bold text-white">{openTickets}</div>
          <div className="text-xs text-white/50">Open Tickets</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status + Dates */}
          <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Project Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs text-white/50 mb-1">Status</div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${statusColors[project.status] || "bg-gray-100 text-gray-700"}`}>
                  {project.status}
                </span>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Billing Type</div>
                <div className="text-sm text-white capitalize">{project.billingType?.replace("-", " ") || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Start Date</div>
                <div className="text-sm text-white">{formatDate(project.startDate)}</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">End Date</div>
                <div className="text-sm text-white">{formatDate(project.endDate)}</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Budget</div>
                <div className="text-sm text-white font-medium">{formatBudget(project.budget, project.currency)}</div>
              </div>
              {daysElapsed !== null && (
                <div>
                  <div className="text-xs text-white/50 mb-1">Days Elapsed</div>
                  <div className="text-sm text-white">{daysElapsed} days</div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-5">
              <h2 className="text-sm font-semibold text-white mb-2">Description</h2>
              <p className="text-sm text-white/70 whitespace-pre-wrap">{project.description}</p>
            </div>
          )}

          {/* Origin Deal */}
          {project.deal && (
            <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-5">
              <h2 className="text-sm font-semibold text-white mb-2">Origin Deal</h2>
              <div className="flex items-center gap-3">
                <div className="text-sm text-white">{project.deal.title}</div>
                <div className="text-xs text-white/50">{formatBudget(project.deal.value, project.deal.currency)}</div>
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          {activities.length > 0 && (
            <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-5">
              <h2 className="text-sm font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {activities.slice(0, 10).map((a: any) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                    <div>
                      <div className="text-sm text-white/80">{a.subject}</div>
                      <div className="text-xs text-white/40">
                        {a.user?.name && <span>{a.user.name} · </span>}
                        {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Company Info */}
          {company && (
            <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-5">
              <h2 className="text-sm font-semibold text-white mb-3">Company</h2>
              <div className="space-y-2 text-sm">
                <div className="text-white">{company.name}</div>
                {company.industry && <div className="text-white/50">{company.industry}</div>}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-brand text-xs hover:underline">
                    {company.website}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Task Summary */}
          <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Task Summary</h2>
            <div className="space-y-2">
              {(["todo", "in-progress", "review", "done"] as const).map((status) => {
                const count = tasks.filter((t: any) => t.status === status).length;
                const labels: Record<string, string> = { todo: "To Do", "in-progress": "In Progress", review: "Review", done: "Done" };
                return (
                  <div key={status} className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{labels[status]}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
            {tasks.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#1E293B]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Completion</span>
                  <span className="text-white font-medium">{Math.round((completedTasks / tasks.length) * 100)}%</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-[#1E293B]">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${(completedTasks / tasks.length) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
