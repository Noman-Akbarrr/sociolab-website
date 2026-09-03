import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const metadata = {
  title: "Ticket | Sociolab CRM",
  robots: { index: false, follow: false },
};

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const ticket = store.getTicket(id);
  const teamMembers = store.getTeamMembers();
  const db = store.__readDb();

  if (!ticket) notFound();

  const company = db.companies.find((c: any) => c.id === ticket.companyId);
  const contact = ticket.contactId ? db.contacts.find((c: any) => c.id === ticket.contactId) : null;
  const project = ticket.projectId ? db.projects.find((p: any) => p.id === ticket.projectId) : null;
  const assignee = ticket.assigneeId ? db.teamMembers.find((m: any) => m.id === ticket.assigneeId) : null;
  const messages = db.ticketMessages
    .filter((m: any) => m.ticketId === ticket.id)
    .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const activities = db.activities
    .filter((a: any) => a.ticketId === ticket.id)
    .map((a: any) => ({
      ...a,
      user: db.teamMembers.find((u: any) => u.id === a.userId) || { id: "", name: "Unknown" },
    }))
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 50);

  const statusColors: Record<string, string> = {
    open: "bg-red-100 text-red-700",
    "waiting-client": "bg-yellow-100 text-yellow-700",
    "in-progress": "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-700",
  };

  const priorityColors: Record<string, string> = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/admin/crm/tickets" className="text-sm text-ink/50 hover:underline">&larr; Back to Tickets</Link>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{ticket.subject}</h1>
            <span className="font-mono text-[11px] font-bold text-brand">{ticket.number}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            defaultValue={ticket.status}
            onChange={(e) => fetch(`/admin/api/crm/tickets/${ticket.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: e.target.value }) }).then(() => window.location.reload())}
            className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          >
            <option value="open">Open</option>
            <option value="waiting-client">Waiting Client</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            defaultValue={ticket.priority}
            onChange={(e) => fetch(`/admin/api/crm/tickets/${ticket.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ priority: e.target.value }) }).then(() => window.location.reload())}
            className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Ticket Header */}
      <div className="mb-6 flex flex-col gap-4 rounded-[3px] border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          {company && (
            <Link href={`/admin/crm/companies/${company.id}`} className="font-display text-lg font-semibold text-ink hover:text-brand">
              {company.name}
            </Link>
          )}
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/50">
            {contact && <span>Contact: <span className="font-medium">{contact.firstName} {contact.lastName}</span></span>}
            {project && <span>Project: <Link href={`/admin/crm/projects/${project.id}`} className="font-medium text-brand hover:underline">{project.name}</Link></span>}
            <span>Priority: <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${priorityColors[ticket.priority]}`}>{ticket.priority}</span></span>
            <span>Status: <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${statusColors[ticket.status]}`}>{ticket.status.replace("-", " ")}</span></span>
            {assignee && <span>Assignee: <span className="font-medium">{assignee.name}</span></span>}
            <span>Created: <span className="font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</span></span>
            {ticket.resolvedAt && <span>Resolved: <span className="font-medium">{new Date(ticket.resolvedAt).toLocaleDateString()}</span></span>}
            {ticket.closedAt && <span>Closed: <span className="font-medium">{new Date(ticket.closedAt).toLocaleDateString()}</span></span>}
          </div>
        </div>
        <select
          defaultValue={ticket.assigneeId || ""}
          onChange={(e) => fetch(`/admin/api/crm/tickets/${ticket.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assigneeId: e.target.value || null }) }).then(() => window.location.reload())}
          className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
        >
          <option value="">Unassigned</option>
          {teamMembers.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Description */}
      <div className="mb-6 rounded-[3px] border border-line bg-white p-5">
        <h2 className="font-display text-sm font-semibold text-ink mb-3">Description</h2>
        <p className="text-sm text-ink/70 whitespace-pre-line">{ticket.description}</p>
      </div>

      {/* Thread */}
      <div className="flex flex-col gap-6">
        <div className="rounded-[3px] border border-line bg-white">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">Conversation</h2>
          </div>
          <div className="divide-y divide-line">
            {messages.map((msg: any) => (
              <div key={msg.id} className={`flex flex-col gap-2 p-5 ${msg.internal ? "bg-amber-50 border-l-4 border-amber-400" : ""}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-semibold text-ink">{msg.authorType === "user" ? "Team Member" : "Client"}</span>
                    {msg.internal && <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-700">Internal</span>}
                    <span className="text-xs text-ink/50">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-sm text-ink/70 whitespace-pre-line">{msg.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Message Form */}
        <div className="rounded-[3px] border border-line bg-white p-5">
          <h3 className="font-display text-sm font-semibold text-ink mb-4">Add Message</h3>
          <form onSubmit={async (e) => { e.preventDefault(); const formData = new FormData(e.currentTarget); await fetch(`/admin/api/crm/tickets/${ticket.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: formData.get("body"), internal: formData.get("internal") === "on" }) }); window.location.reload(); }} className="flex flex-col gap-2">
            <textarea name="body" rows={3} required placeholder="Write a message..." className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
            <label className="flex items-center gap-2 text-sm text-ink/70">
              <input name="internal" type="checkbox" className="rounded border-line" />
              Internal note (not visible to client)
            </label>
            <button type="submit" className="w-fit rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark">Send</button>
          </form>
        </div>

        {/* Activity */}
        <div className="rounded-[3px] border border-line bg-white">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">Activity</h2>
          </div>
          <div className="divide-y divide-line">
            {activities.length === 0 ? (
              <p className="p-8 text-center text-sm text-ink/50">No activity yet.</p>
            ) : (
              activities.map((activity: any) => (
                <div key={activity.id} className="flex flex-col gap-1 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="font-display text-sm font-semibold text-ink">{activity.subject}</span>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                        <span className="font-mono">{activity.user.name}</span>
                        <span>·</span>
                        <span>{new Date(activity.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-ink/40">{activity.type.replace(/-/g, " ")}</span>
                  </div>
                  {activity.body && <p className="text-sm text-ink/60">{activity.body}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
