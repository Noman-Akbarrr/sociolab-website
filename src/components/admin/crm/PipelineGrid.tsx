"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PipelineGridProps {
  pipelines: any[];
  userRole: string;
  userId: string;
}

export function PipelineGrid({ pipelines: initialPipelines, userRole, userId }: PipelineGridProps) {
  const router = useRouter();
  const [pipelines, setPipelines] = useState(initialPipelines);
  const [showNew, setShowNew] = useState(false);
  const [newPipeline, setNewPipeline] = useState({ name: "", description: "", color: "#3b82f6" });
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const canCreatePipeline = userRole === "super_admin" || userRole === "admin" || userRole === "sales_executive";
  const canDeletePipeline = userRole === "super_admin" || userRole === "admin";
  const canManageMembers = userRole === "super_admin" || userRole === "admin" || userRole === "sales_executive";

  // Members modal state
  const [membersTarget, setMembersTarget] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(cents / 100);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newPipeline.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/admin/api/crm/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPipeline),
      });
      if (res.ok) {
        const data = await res.json();
        setPipelines([...pipelines, { ...data.pipeline, dealCount: 0, totalValue: 0 }]);
        setShowNew(false);
        setNewPipeline({ name: "", description: "", color: "#3b82f6" });
        router.refresh();
      }
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget || deleteConfirmText !== deleteTarget.name) return;
    setDeleting(true);
    try {
      const res = await fetch(`/admin/api/crm/pipelines/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        setPipelines((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
        setDeleteConfirmText("");
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  async function openMembersModal(pipeline: any) {
    setMembersTarget(pipeline);
    setLoadingMembers(true);
    try {
      const [membersRes, usersRes] = await Promise.all([
        fetch(`/admin/api/crm/pipelines/members?pipelineId=${pipeline.id}`),
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
    const res = await fetch("/admin/api/crm/pipelines/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pipelineId: membersTarget.id, userId: selectedUserId }),
    });
    if (res.ok) {
      const user = allUsers.find((u: any) => u.id === selectedUserId);
      if (user) setMembers([...members, { user }]);
      setSelectedUserId("");
    }
  }

  async function removeMember(userId: string) {
    if (!membersTarget) return;
    const res = await fetch("/admin/api/crm/pipelines/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pipelineId: membersTarget.id, userId }),
    });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.user.id !== userId));
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Pipelines</h1>
          {canCreatePipeline && (
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
            >
              + New Pipeline
            </button>
          )}
        </div>
        <p className="text-sm text-white/60">Manage your sales pipelines and stages.</p>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-white">New Pipeline</h2>
            <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={newPipeline.name}
                  onChange={(e) => setNewPipeline({ ...newPipeline, name: e.target.value })}
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  placeholder="e.g. Enterprise Sales"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Description</label>
                <textarea
                  value={newPipeline.description}
                  onChange={(e) => setNewPipeline({ ...newPipeline, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  placeholder="Optional description"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newPipeline.color}
                    onChange={(e) => setNewPipeline({ ...newPipeline, color: e.target.value })}
                    className="h-10 w-10 cursor-pointer rounded border border-[#1E293B] bg-transparent"
                  />
                  <span className="text-sm text-white/60">{newPipeline.color}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white transition-colors hover:border-brand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-lg font-semibold text-white">Delete Pipeline</h2>
            <p className="mt-2 text-sm text-white/60">
              Are you sure you want to delete <span className="font-semibold text-white">{deleteTarget.name}</span>?
            </p>
            <div className="mt-3 rounded-[3px] border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-xs text-red-400">
                This will permanently delete all stages, deals, and data in this pipeline. This action cannot be undone.
              </p>
            </div>
            <div className="mt-4">
              <label className="block text-xs text-white/50 mb-1">
                Type <span className="font-semibold text-white">{deleteTarget.name}</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                placeholder={deleteTarget.name}
                autoFocus
              />
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => { setDeleteTarget(null); setDeleteConfirmText(""); }}
                className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white transition-colors hover:border-brand"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirmText !== deleteTarget.name || deleting}
                className="rounded-[3px] bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? "Deleting..." : "Delete Pipeline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {membersTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-lg font-semibold text-white">
              Manage Members — {membersTarget.name}
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Only assigned members can see this pipeline and have deals assigned to them.
            </p>
            {loadingMembers ? (
              <div className="mt-6 space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-10 animate-pulse rounded bg-white/5" />
                ))}
              </div>
            ) : (
              <>
                <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                  {members.length === 0 ? (
                    <p className="text-sm text-white/40 py-4 text-center">No members assigned yet. All admin/sales executives can access by default.</p>
                  ) : (
                    members.map((m: any) => (
                      <div key={m.user.id} className="flex items-center justify-between rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-white">{m.user.name}</p>
                          <p className="text-[11px] text-white/40">{m.user.email}</p>
                        </div>
                        <button
                          onClick={() => removeMember(m.user.id)}
                          className="rounded p-1 text-white/30 hover:text-red-400 transition-colors"
                          title="Remove member"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="flex-1 rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  >
                    <option value="">Select a user...</option>
                    {allUsers
                      .filter((u: any) => !members.some((m: any) => m.user.id === u.id))
                      .map((u: any) => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role.replace(/_/g, " ")})</option>
                      ))}
                  </select>
                  <button
                    onClick={addMember}
                    disabled={!selectedUserId}
                    className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => { setMembersTarget(null); setMembers([]); }}
                className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white transition-colors hover:border-brand"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            className="flex flex-col rounded-[3px] border border-[#1E293B] bg-[#111827] transition-all hover:border-brand/50 hover:shadow-lg"
          >
            <div className="h-1 rounded-t-[3px]" style={{ backgroundColor: pipeline.color }} />
            <button
              onClick={() => router.push(`/admin/pipeline/${pipeline.id}`)}
              className="flex flex-1 flex-col gap-2 p-5 text-left"
            >
              <h3 className="font-display text-base font-bold text-white">{pipeline.name}</h3>
              {pipeline.description && (
                <p className="line-clamp-2 text-sm text-white/50">{pipeline.description}</p>
              )}
              <div className="mt-auto flex items-center justify-between pt-4 text-sm">
                <span className="text-white/60">
                  {pipeline.dealCount} {pipeline.dealCount === 1 ? "deal" : "deals"}
                </span>
                <span className="font-semibold text-white">{formatCurrency(pipeline.totalValue)}</span>
              </div>
            </button>
            {(canDeletePipeline || canManageMembers) && (
              <div className="flex items-center justify-end gap-1 border-t border-[#1E293B] px-5 py-2">
                {canManageMembers && (
                  <button
                    onClick={(e) => { e.stopPropagation(); openMembersModal(pipeline); }}
                    className="rounded p-1.5 text-white/30 transition-colors hover:bg-brand/10 hover:text-brand"
                    title="Manage members"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                    </svg>
                  </button>
                )}
                {canDeletePipeline && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(pipeline); setDeleteConfirmText(""); }}
                    className="rounded p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    title="Delete pipeline"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {pipelines.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-white/50">No pipelines yet. Create your first one to get started.</p>
        </div>
      )}
    </>
  );
}
