"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProjectsListProps {
  initialProjects: any[];
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
  initialStatus: string;
  initialCompanies: any[];
  initialDeals: any[];
  userRole: string;
  userId: string;
}

export function ProjectsList({ initialProjects, initialTotal, initialPage, initialTotalPages, initialStatus, initialCompanies, initialDeals, userRole, userId }: ProjectsListProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", companyId: "", dealId: "", status: "kickoff", budget: 0, billingType: "fixed", description: "" });
  const companies = initialCompanies;
  const deals = initialDeals;

  const canManageProjects = userRole === "super_admin" || userRole === "admin";
  const canManageMembers = userRole === "super_admin" || userRole === "admin";

  // Edit state
  const [editTarget, setEditTarget] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", status: "kickoff", budget: 0, billingType: "fixed", description: "" });
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Members modal state
  const [membersTarget, setMembersTarget] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);

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

  function openEditModal(project: any) {
    setEditTarget(project);
    setEditForm({
      name: project.name,
      status: project.status,
      budget: project.budget || 0,
      billingType: project.billingType || "fixed",
      description: project.description || "",
    });
  }

  async function handleEditSave() {
    if (!editTarget) return;
    setSaving(true);
    const res = await fetch(`/admin/api/crm/projects/${editTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setSaving(false);
    if (res.ok) {
      setEditTarget(null);
      fetchProjects();
    }
  }

  async function handleDelete() {
    if (!deleteTarget || deleteConfirmText !== deleteTarget.name) return;
    setDeleting(true);
    const res = await fetch(`/admin/api/crm/projects/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      setDeleteTarget(null);
      setDeleteConfirmText("");
      fetchProjects();
    }
  }

  async function openMembersModal(project: any) {
    setMembersTarget(project);
    setLoadingMembers(true);
    try {
      const [membersRes, usersRes] = await Promise.all([
        fetch(`/admin/api/crm/projects/members?projectId=${project.id}`),
        fetch("/admin/api/auth/users"),
      ]);
      const membersData = membersRes.ok ? await membersRes.json() : [];
      const usersData = usersRes.ok ? await usersRes.json() : [];
      setMembers(membersData);
      setAllUsers(usersData);
    } catch {}
    setLoadingMembers(false);
  }

  async function addMember() {
    if (!selectedUserId || !membersTarget) return;
    const res = await fetch("/admin/api/crm/projects/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: membersTarget.id, userId: selectedUserId }),
    });
    if (res.ok) {
      const user = allUsers.find((u: any) => u.id === selectedUserId);
      if (user) setMembers([...members, { user }]);
      setSelectedUserId("");
    }
  }

  async function removeMember(uId: string) {
    if (!membersTarget) return;
    const res = await fetch("/admin/api/crm/projects/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: membersTarget.id, userId: uId }),
    });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.user.id !== uId));
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
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Projects</h1>
          {canManageProjects && (
            <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
              + New Project
            </button>
          )}
        </div>
        <p className="text-sm text-white/60">Track delivery projects from kickoff to completion.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
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
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-white">New Project</h2>
            <form onSubmit={handleNewProject} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Name *</label>
                <input type="text" required value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Company *</label>
                <select required value={newProject.companyId} onChange={(e) => setNewProject({ ...newProject, companyId: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                  <option value="">Select company</option>
                  {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Origin Deal (optional)</label>
                <select value={newProject.dealId} onChange={(e) => setNewProject({ ...newProject, dealId: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                  <option value="">None</option>
                  {deals.filter(d => d.stage?.isWon).map((d: any) => <option key={d.id} value={d.id}>{d.title} ({d.company?.name})</option>)}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Status</label>
                  <select value={newProject.status} onChange={(e) => setNewProject({ ...newProject, status: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value="kickoff">Kickoff</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Billing Type</label>
                  <select value={newProject.billingType} onChange={(e) => setNewProject({ ...newProject, billingType: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value="fixed">Fixed</option>
                    <option value="retainer">Retainer</option>
                    <option value="time-materials">Time & Materials</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Budget (USD)</label>
                <input type="number" value={newProject.budget} onChange={(e) => setNewProject({ ...newProject, budget: parseInt(e.target.value) || 0 })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Description</label>
                <textarea value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} rows={3} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)} className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white transition-colors hover:border-brand">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-white">Edit Project</h2>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Status</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value="kickoff">Kickoff</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="done">Done</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Billing Type</label>
                  <select value={editForm.billingType} onChange={(e) => setEditForm({ ...editForm, billingType: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value="fixed">Fixed</option>
                    <option value="retainer">Retainer</option>
                    <option value="time-materials">Time & Materials</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setEditTarget(null)} className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white hover:border-brand">Cancel</button>
              <button onClick={handleEditSave} disabled={saving} className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-lg font-semibold text-white">Delete Project</h2>
            <p className="mt-2 text-sm text-white/60">
              Are you sure you want to delete <span className="font-semibold text-white">{deleteTarget.name}</span>?
            </p>
            <div className="mt-3 rounded-[3px] border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-xs text-red-400">This will permanently delete all tasks, submissions, and data in this project.</p>
            </div>
            <div className="mt-4">
              <label className="block text-xs text-white/50 mb-1">Type <span className="font-semibold text-white">{deleteTarget.name}</span> to confirm:</label>
              <input type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)} className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500" autoFocus />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => { setDeleteTarget(null); setDeleteConfirmText(""); }} className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white hover:border-brand">Cancel</button>
              <button onClick={handleDelete} disabled={deleteConfirmText !== deleteTarget.name || deleting} className="rounded-[3px] bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {deleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {membersTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-lg font-semibold text-white">Manage Members — {membersTarget.name}</h2>
            <p className="text-sm text-white/50 mt-1">Only assigned members can see this project and be assigned tasks within it.</p>
            {loadingMembers ? (
              <div className="mt-6 space-y-2">{[1, 2].map((i) => <div key={i} className="h-10 animate-pulse rounded bg-white/5" />)}</div>
            ) : (
              <>
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                  {members.length === 0 ? (
                    <p className="text-sm text-white/40 py-4 text-center">No members assigned yet. All users can access by default.</p>
                  ) : (
                    members.map((m: any) => (
                      <div key={m.user.id} className="flex items-center justify-between rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-white">{m.user.name}</p>
                          <p className="text-[11px] text-white/40">{m.user.email}</p>
                        </div>
                        <button onClick={() => removeMember(m.user.id)} className="rounded p-1 text-white/30 hover:text-red-400 transition-colors" title="Remove member">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} className="flex-1 rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value="">Select a user...</option>
                    {allUsers.filter((u: any) => !members.some((m: any) => m.user.id === u.id)).map((u: any) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role.replace(/_/g, " ")})</option>
                    ))}
                  </select>
                  <button onClick={addMember} disabled={!selectedUserId} className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50">Add</button>
                </div>
              </>
            )}
            <div className="mt-4 flex justify-end">
              <button onClick={() => { setMembersTarget(null); setMembers([]); }} className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white hover:border-brand">Done</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-[3px] border border-[#1E293B] bg-[#111827] overflow-hidden">
        {projects.length === 0 ? (
          <p className="p-8 text-center text-sm text-white/50">No projects yet.</p>
        ) : (
          <ul className="divide-y divide-[#1E293B]">
            {projects.map((project: any) => (
              <li key={project.id} className="flex items-center justify-between gap-4 p-4 hover:bg-white/5">
                <Link href={`/admin/projects/${project.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate font-display text-sm font-semibold text-white">{project.name}</span>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                    <span>{project.company?.name}</span>
                    {project.deal && <span>· {project.deal.title}</span>}
                    <span>· {project._count?.tasks ?? 0} tasks</span>
                    <span>· {project._count?.invoices ?? 0} invoices</span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${statusColors[project.status] || "bg-gray-100 text-gray-700"}`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
                {canManageProjects && (
                  <div className="flex items-center gap-1 shrink-0">
                    {canManageMembers && (
                      <button onClick={() => openMembersModal(project)} className="rounded p-1.5 text-white/30 transition-colors hover:bg-brand/10 hover:text-brand" title="Manage members">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                      </button>
                    )}
                    <button onClick={() => openEditModal(project)} className="rounded p-1.5 text-white/30 transition-colors hover:bg-brand/10 hover:text-brand" title="Edit project">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => { setDeleteTarget(project); setDeleteConfirmText(""); }} className="rounded p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400" title="Delete project">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-white/60">Page {page} of {totalPages} — {total} projects</span>
          <div className="flex gap-2">
            <button onClick={() => { setPage(p => Math.max(1, p - 1)); }} disabled={page === 1 || loading} className="rounded-[3px] border border-[#1E293B] px-3 py-1.5 text-sm text-white disabled:opacity-50">Prev</button>
            <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); }} disabled={page === totalPages || loading} className="rounded-[3px] border border-[#1E293B] px-3 py-1.5 text-sm text-white disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
