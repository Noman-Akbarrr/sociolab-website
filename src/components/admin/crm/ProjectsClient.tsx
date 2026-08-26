"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ProjectsClientProps {
  initialProjects: any[];
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
  initialStatus: string;
}

export function ProjectsClient({ initialProjects, initialTotal, initialPage, initialTotalPages, initialStatus }: ProjectsClientProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", companyId: "", dealId: "", status: "kickoff", budget: 0, billingType: "fixed", description: "" });
  const [companies, setCompanies] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    fetch("/admin/api/crm/companies?limit=100").then(r => r.json()).then(d => setCompanies(d.companies));
    fetch("/admin/api/crm/deals?limit=100").then(r => r.json()).then(d => setDeals(d.deals));
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", String(page));
    params.set("limit", "20");
    const res = await fetch(`/admin/api/crm/projects?${params}`);
    const data = await res.json();
    setProjects(data.projects);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  async function handleNewProject(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/admin/api/crm/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });
    if (res.ok) {
      setShowNew(false);
      setNewProject({ name: "", companyId: "", dealId: "", status: "kickoff", budget: 0, billingType: "fixed", description: "" });
      fetchProjects();
    }
  }

  const statusColors: Record<string, string> = {
    kickoff: "bg-purple-100 text-purple-700",
    active: "bg-blue-100 text-blue-700",
    paused: "bg-yellow-100 text-yellow-700",
    done: "bg-green-100 text-green-700",
    archived: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Projects</h1>
          <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
            + New Project
          </button>
        </div>
        <p className="text-sm text-ink/60">Track delivery projects from kickoff to completion.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); fetchProjects(); }}
            className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          >
            <option value="">All Statuses</option>
            <option value="kickoff">Kickoff</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="done">Done</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-white p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-ink">New Project</h2>
            <form onSubmit={handleNewProject} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Name *</label>
                <input type="text" required value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Company *</label>
                <select required value={newProject.companyId} onChange={(e) => setNewProject({ ...newProject, companyId: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                  <option value="">Select company</option>
                  {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Origin Deal (optional)</label>
                <select value={newProject.dealId} onChange={(e) => setNewProject({ ...newProject, dealId: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                  <option value="">None</option>
                  {deals.filter(d => d.stage.isWon).map((d: any) => <option key={d.id} value={d.id}>{d.title} ({d.company.name})</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink/60 mb-1">Status</label>
                  <select value={newProject.status} onChange={(e) => setNewProject({ ...newProject, status: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                    <option value="kickoff">Kickoff</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink/60 mb-1">Billing Type</label>
                  <select value={newProject.billingType} onChange={(e) => setNewProject({ ...newProject, billingType: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                    <option value="fixed">Fixed</option>
                    <option value="retainer">Retainer</option>
                    <option value="time-materials">Time & Materials</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Budget (USD)</label>
                <input type="number" value={newProject.budget} onChange={(e) => setNewProject({ ...newProject, budget: parseInt(e.target.value) || 0 })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Description</label>
                <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} rows={3} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)} className="rounded-[3px] border border-line px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-brand">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-[3px] border border-line bg-white overflow-hidden">
        {projects.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink/50">No projects yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {projects.map((project: any) => (
              <li key={project.id} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                <Link href={`/admin/crm/projects/${project.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate font-display text-sm font-semibold text-ink">{project.name}</span>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                    <span>{project.company.name}</span>
                    {project.deal && <span>· {project.deal.title}</span>}
                    <span>· {project._count.tasks} tasks</span>
                    <span>· {project._count.invoices} invoices</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${statusColors[project.status] || "bg-gray-100 text-gray-700"}`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-ink/60">Page {page} of {totalPages} — {total} projects</span>
          <div className="flex gap-2">
            <button onClick={() => { setPage(p => Math.max(1, p - 1)); fetchProjects(); }} disabled={page === 1 || loading} className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-50">Prev</button>
            <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); fetchProjects(); }} disabled={page === totalPages || loading} className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}