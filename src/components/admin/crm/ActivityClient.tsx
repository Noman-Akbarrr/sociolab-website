"use client";

import { useState } from "react";
import Link from "next/link";

interface ActivityClientProps {
  initialActivities: any[];
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
}

export function ActivityClient({ initialActivities, initialTotal, initialPage, initialTotalPages }: ActivityClientProps) {
  const [activities, setActivities] = useState(initialActivities);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ dealId: "", companyId: "", contactId: "", projectId: "", ticketId: "" });

  async function fetchActivities() {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    params.set("page", String(page));
    params.set("limit", "50");
    const res = await fetch(`/admin/api/crm/activities?${params}`);
    const data = await res.json();
    setActivities(data.activities);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  const typeIcons: Record<string, string> = {
    "note": "📝",
    "call": "📞",
    "email": "📧",
    "meeting": "🤝",
    "deal-created": "💼",
    "deal-stage-changed": "🔄",
    "deal-updated": "✏️",
    "company-created": "🏢",
    "company-updated": "🏢",
    "contact-created": "👤",
    "contact-updated": "👤",
    "project-created": "🚀",
    "project-updated": "🚀",
    "task-created": "✅",
    "task-updated": "✅",
    "ticket-created": "🎫",
    "ticket-updated": "🎫",
    "ticket-message": "💬",
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Activity Feed</h1>
        <p className="text-sm text-white/60">All CRM activity across deals, companies, projects, and tickets.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Filter: deal ID..."
          value={filters.dealId}
          onChange={(e) => setFilters({ ...filters, dealId: e.target.value })}
          className="rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
        />
        <input
          type="text"
          placeholder="Filter: company ID..."
          value={filters.companyId}
          onChange={(e) => setFilters({ ...filters, companyId: e.target.value })}
          className="rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
        />
        <input
          type="text"
          placeholder="Filter: project ID..."
          value={filters.projectId}
          onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
          className="rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
        />
        <input
          type="text"
          placeholder="Filter: ticket ID..."
          value={filters.ticketId}
          onChange={(e) => setFilters({ ...filters, ticketId: e.target.value })}
          className="rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
        />
        <button onClick={() => { setFilters({ dealId: "", companyId: "", contactId: "", projectId: "", ticketId: "" }); fetchActivities(); }} className="rounded-[3px] border border-[#1E293B] px-3 py-2 text-sm text-white transition-colors hover:border-brand">Clear</button>
      </div>

      <div className="mt-6 rounded-[3px] border border-[#1E293B] bg-[#111827] overflow-hidden">
        {activities.length === 0 ? (
          <p className="p-8 text-center text-sm text-white/50">No activity found.</p>
        ) : (
          <ul className="divide-y divide-[#1E293B]">
            {activities.map((activity: any) => (
              <li key={activity.id} className="flex flex-col gap-1 p-4 hover:bg-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{typeIcons[activity.type] || "📌"}</span>
                      <span className="font-display text-sm font-semibold text-white">{activity.subject}</span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/40">{activity.type.replace(/-/g, " ")}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                      <span className="font-mono">{activity.user.name}</span>
                      <span>·</span>
                      <span>{new Date(activity.createdAt).toLocaleString()}</span>
                      {activity.deal && (
                        <>
                          <span>·</span>
                           <Link href="/admin/pipeline" className="text-brand hover:underline">{activity.deal.title}</Link>
                        </>
                      )}
                      {activity.company && (
                        <>
                          <span>·</span>
                          <Link href={`/admin/crm/companies/${activity.company.id}`} className="text-brand hover:underline">{activity.company.name}</Link>
                        </>
                      )}
                      {activity.project && (
                        <>
                          <span>·</span>
                          <Link href={`/admin/crm/projects/${activity.project.id}`} className="text-brand hover:underline">{activity.project.name}</Link>
                        </>
                      )}
                      {activity.ticket && (
                        <>
                          <span>·</span>
                          <Link href={`/admin/crm/tickets/${activity.ticket.id}`} className="text-brand hover:underline">{activity.ticket.number}</Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {activity.body && <p className="ml-6 text-sm text-white/60 line-clamp-3">{activity.body}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-white/60">Page {page} of {totalPages} — {total} activities</span>
          <div className="flex gap-2">
            <button onClick={() => { setPage(p => Math.max(1, p - 1)); fetchActivities(); }} disabled={page === 1 || loading} className="rounded-[3px] border border-[#1E293B] px-3 py-1.5 text-sm text-white disabled:opacity-50">Prev</button>
            <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); fetchActivities(); }} disabled={page === totalPages || loading} className="rounded-[3px] border border-[#1E293B] px-3 py-1.5 text-sm text-white disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}