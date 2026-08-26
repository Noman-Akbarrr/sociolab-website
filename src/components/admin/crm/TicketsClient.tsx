"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TicketsClientProps {
  initialTickets: any[];
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
  initialStatus: string;
}

export function TicketsClient({ initialTickets, initialTotal, initialPage, initialTotalPages, initialStatus }: TicketsClientProps) {
  const [tickets, setTickets] = useState(initialTickets);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", companyId: "", contactId: "", projectId: "", priority: "medium" });
  const [companies, setCompanies] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/admin/api/crm/companies?limit=100").then(r => r.json()).then(d => setCompanies(d.companies));
    fetch("/admin/api/crm/projects?limit=100").then(r => r.json()).then(d => setProjects(d.projects));
  }, []);

  async function fetchTickets() {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", String(page));
    params.set("limit", "20");
    const res = await fetch(`/admin/api/crm/tickets?${params}`);
    const data = await res.json();
    setTickets(data.tickets);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  async function handleNewTicket(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/admin/api/crm/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket),
    });
    if (res.ok) {
      setShowNew(false);
      setNewTicket({ subject: "", description: "", companyId: "", contactId: "", projectId: "", priority: "medium" });
      fetchTickets();
    }
  }

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
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Tickets</h1>
          <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
            + New Ticket
          </button>
        </div>
        <p className="text-sm text-ink/60">Track client support requests and internal issues.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); fetchTickets(); }}
            className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="waiting-client">Waiting Client</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-white p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-ink">New Ticket</h2>
            <form onSubmit={handleNewTicket} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Subject *</label>
                <input type="text" required value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Description *</label>
                <textarea required value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} rows={4} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Company *</label>
                <select required value={newTicket.companyId} onChange={(e) => setNewTicket({ ...newTicket, companyId: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                  <option value="">Select company</option>
                  {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Contact (optional)</label>
                <select value={newTicket.contactId} onChange={(e) => setNewTicket({ ...newTicket, contactId: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                  <option value="">None</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Project (optional)</label>
                <select value={newTicket.projectId} onChange={(e) => setNewTicket({ ...newTicket, projectId: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                  <option value="">None</option>
                  {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Priority</label>
                <select value={newTicket.priority} onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)} className="rounded-[3px] border border-line px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-brand">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-[3px] border border-line bg-white overflow-hidden">
        {tickets.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink/50">No tickets yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {tickets.map((ticket: any) => (
              <li key={ticket.id} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                <Link href={`/admin/crm/tickets/${ticket.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-brand">{ticket.number}</span>
                    <span className="truncate font-display text-sm font-semibold text-ink">{ticket.subject}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                    <span>{ticket.company.name}</span>
                    {ticket.contact && <span>· {ticket.contact.firstName} {ticket.contact.lastName}</span>}
                    {ticket.project && <span>· {ticket.project.name}</span>}
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${statusColors[ticket.status] || "bg-gray-100 text-gray-700"}`}>
                      {ticket.status.replace("-", " ")}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${priorityColors[ticket.priority] || priorityColors.medium}`}>
                      {ticket.priority}
                    </span>
                    <span>{ticket._count.messages} msgs</span>
                  </div>
                </Link>
                {ticket.assignee && <span className="text-xs text-ink/50">{ticket.assignee.name}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-ink/60">Page {page} of {totalPages} — {total} tickets</span>
          <div className="flex gap-2">
            <button onClick={() => { setPage(p => Math.max(1, p - 1)); fetchTickets(); }} disabled={page === 1 || loading} className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-50">Prev</button>
            <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); fetchTickets(); }} disabled={page === totalPages || loading} className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}