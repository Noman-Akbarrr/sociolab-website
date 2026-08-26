import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Project | Sociolab CRM",
  robots: { index: false, follow: false },
};

async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      company: true,
      deal: { include: { stage: true } },
      tasks: {
        include: { assignee: { select: { id: true, name: true } } },
        orderBy: [{ status: "asc" }, { priority: "desc" }, { dueDate: "asc" }],
      },
      invoices: { orderBy: { createdAt: "desc" } },
      activities: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      testimonial: true,
    },
  });
}

async function getTeamMembers() {
  return prisma.teamMember.findMany({ where: { active: true }, orderBy: { order: "asc" } });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const [project, teamMembers] = await Promise.all([getProject(id), getTeamMembers()]);

  if (!project) notFound();

  const formatCurrency = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

  const tasksByStatus = {
    todo: project.tasks.filter(t => t.status === "todo"),
    "in-progress": project.tasks.filter(t => t.status === "in-progress"),
    review: project.tasks.filter(t => t.status === "review"),
    done: project.tasks.filter(t => t.status === "done"),
  };

  const statusColors: Record<string, string> = {
    todo: "bg-gray-100 text-gray-700",
    "in-progress": "bg-blue-100 text-blue-700",
    review: "bg-yellow-100 text-yellow-700",
    done: "bg-green-100 text-green-700",
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/crm/projects" className="text-sm text-ink/50 hover:underline">&larr; Back to Projects</Link>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">{project.name}</h1>
        </div>
        <select
          defaultValue={project.status}
          onChange={(e) => fetch(`/admin/api/crm/projects/${project.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: e.target.value }) }).then(() => window.location.reload())}
          className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
        >
          <option value="kickoff">Kickoff</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="done">Done</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Project Header */}
      <div className="mb-6 flex flex-col gap-4 rounded-[3px] border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <Link href={`/admin/crm/companies/${project.company.id}`} className="font-display text-lg font-semibold text-ink hover:text-brand">
            {project.company.name}
          </Link>
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/50">
            <span>Budget: <span className="font-semibold text-brand">{formatCurrency(project.budget || 0)}</span></span>
            <span>Type: <span className="font-semibold">{project.billingType}</span></span>
            {project.startDate && <span>Start: <span className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</span></span>}
            {project.endDate && <span>End: <span className="font-semibold">{new Date(project.endDate).toLocaleDateString()}</span></span>}
            {project.deal && <span>From Deal: <Link href={`/admin/crm/deals/${project.deal.id}`} className="font-semibold text-brand hover:underline">{project.deal.title}</Link></span>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Column - Task Board */}
        <div className="lg:col-span-2">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {["todo", "in-progress", "review", "done"].map((status) => {
              const tasks = tasksByStatus[status as keyof typeof tasksByStatus];
              return (
                <div key={status} className="min-w-[300px] max-w-[300px] flex flex-col">
                  <div className="flex items-center justify-between rounded-t-[3px] px-4 py-3 text-sm font-bold text-white" style={{ backgroundColor: statusColors[status]?.replace("100", "600").replace("700", "") || "#6b7280" }}>
                    <span>{status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    <span className="text-[11px] opacity-90">{tasks.length}</span>
                  </div>
                  <div className="flex-1 flex flex-col gap-3 rounded-b-[3px] border border-line bg-white p-3 min-h-[500px]">
                    {tasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-ink/40">
                        <p className="text-sm">No tasks</p>
                      </div>
                    )}
                    {tasks.map((task: any) => (
                      <div key={task.id} className="group flex flex-col gap-2 rounded-[3px] border border-line bg-white p-3 transition-shadow hover:shadow-md">
                        <Link href={`/admin/crm/projects/${project.id}#task-${task.id}`} className="font-display text-sm font-semibold text-ink group-hover:text-brand">{task.title}</Link>
                        <div className="flex items-center justify-between text-xs text-ink/50">
                          {task.assignee && <span className="text-brand">{task.assignee.name}</span>}
                          {task.dueDate && (
                            <span className={new Date(task.dueDate) < new Date() && task.status !== "done" ? "text-red-600" : "text-ink/50"}>
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {task.description && <p className="text-sm text-ink/60 line-clamp-2">{task.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Project Info */}
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Details</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-ink/50">Status</dt>
                <dd className="font-medium capitalize">{project.status}</dd>
              </div>
              <div>
                <dt className="text-ink/50">Budget</dt>
                <dd className="font-semibold text-brand">{formatCurrency(project.budget || 0)}</dd>
              </div>
              <div>
                <dt className="text-ink/50">Billing Type</dt>
                <dd className="font-medium">{project.billingType}</dd>
              </div>
              {project.startDate && (
                <div>
                  <dt className="text-ink/50">Start Date</dt>
                  <dd className="font-medium">{new Date(project.startDate).toLocaleDateString()}</dd>
                </div>
              )}
              {project.endDate && (
                <div>
                  <dt className="text-ink/50">End Date</dt>
                  <dd className="font-medium">{new Date(project.endDate).toLocaleDateString()}</dd>
                </div>
              )}
              <div>
                <dt className="text-ink/50">Tasks</dt>
                <dd className="font-medium">{project.tasks.length} total, {tasksByStatus.done.length} done</dd>
              </div>
              <div>
                <dt className="text-ink/50">Invoices</dt>
                <dd className="font-medium">{project.invoices.length}</dd>
              </div>
            </dl>
          </div>

          {/* Description */}
          {project.description && (
            <div className="rounded-[3px] border border-line bg-white p-5">
              <h3 className="font-display text-sm font-semibold text-ink mb-2">Description</h3>
              <p className="text-sm text-ink/70 whitespace-pre-line">{project.description}</p>
            </div>
          )}

          {/* Invoices */}
          {project.invoices.length > 0 && (
            <div className="rounded-[3px] border border-line bg-white p-5">
              <h3 className="font-display text-sm font-semibold text-ink mb-4">Invoices</h3>
              <div className="space-y-3">
                {project.invoices.map((inv: any) => (
                  <div key={inv.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold">{inv.number}</span>
                      <span className="text-ink/50 ml-2">{formatCurrency(inv.amount)}</span>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      inv.status === "paid" ? "bg-green-100 text-green-700" :
                      inv.status === "overdue" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonial */}
          {project.testimonial && (
            <div className="rounded-[3px] border border-line bg-white p-5">
              <h3 className="font-display text-sm font-semibold text-ink mb-4">Testimonial</h3>
              <blockquote className="font-display text-base font-medium leading-snug text-ink">&ldquo;{project.testimonial.quote}&rdquo;</blockquote>
              <figcaption className="mt-2 text-sm text-ink/60">— {project.testimonial.name}, {project.testimonial.role}</figcaption>
            </div>
          )}

          {/* Add Task Form */}
          <div className="rounded-[3px] border border-line bg-white p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Add Task</h3>
            <form onSubmit={async (e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); await fetch("/admin/api/crm/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: project.id, title: formData.get("title"), description: formData.get("description"), status: "todo", priority: parseInt(formData.get("priority") as string) || 0, assigneeId: formData.get("assigneeId") || null, dueDate: formData.get("dueDate") || null }) }); window.location.reload(); }} className="flex flex-col gap-2">
              <input name="title" required placeholder="Task title" className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              <textarea name="description" rows={2} placeholder="Description (optional)" className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              <div className="grid gap-2 sm:grid-cols-2">
                <select name="priority" className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                  <option value="0">Priority: Low</option>
                  <option value="1">Priority: Medium</option>
                  <option value="2">Priority: High</option>
                  <option value="3">Priority: Urgent</option>
                </select>
                <select name="assigneeId" className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                  <option value="">Unassigned</option>
                  {teamMembers.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <input name="dueDate" type="date" className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              <button type="submit" className="rounded-[3px] bg-brand px-3 py-2 text-sm font-bold text-white hover:bg-brand-dark">Add Task</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}