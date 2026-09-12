"use client";

import { useState } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  review: "bg-blue-500/20 text-blue-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

export function ProjectSubmissions({
  project,
  userRole,
  userId,
}: {
  project: any;
  userRole: string;
  userId: string;
}) {
  const isFreelancer = userRole === "freelancer";
  const allSubmissions = project.submissions || [];
  const [submissions, setSubmissions] = useState(
    isFreelancer ? allSubmissions.filter((s: any) => s.submitterId === userId) : allSubmissions
  );
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [newSub, setNewSub] = useState({ title: "", description: "", files: "" });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const files = newSub.files.split("\n").map(f => f.trim()).filter(Boolean);
    const res = await fetch("/admin/api/crm/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, title: newSub.title, description: newSub.description, files }),
    });
    if (res.ok) {
      const { submission } = await res.json();
      setSubmissions((prev: any[]) => [submission, ...prev]);
      setShowAdd(false);
      setNewSub({ title: "", description: "", files: "" });
    }
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/admin/api/crm/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSubmissions((prev: any[]) => prev.map(s => s.id === id ? { ...s, status } : s));
    if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status }));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this submission?")) return;
    await fetch(`/admin/api/crm/submissions/${id}`, { method: "DELETE" });
    setSubmissions((prev: any[]) => prev.filter(s => s.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="flex gap-6">
      {/* Submission List */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Submissions</h2>
          <button onClick={() => setShowAdd(true)} className="rounded-[3px] bg-brand px-3 py-1.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
            + New Submission
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded-[3px] border border-dashed border-[#1E293B] bg-[#111827] p-8 text-center">
            <p className="text-sm text-white/50">No submissions yet.</p>
            <button onClick={() => setShowAdd(true)} className="mt-3 text-sm text-brand hover:underline">
              Create your first submission
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {submissions.map((sub: any) => (
              <div
                key={sub.id}
                onClick={() => setSelected(sub)}
                className={`rounded-[3px] border p-4 cursor-pointer transition-colors ${
                  selected?.id === sub.id
                    ? "border-brand bg-brand/5"
                    : "border-[#1E293B] bg-[#111827] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm text-white">{sub.title}</div>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColors[sub.status] || statusColors.pending}`}>
                    {sub.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-white/40">
                  <span>{formatDate(sub.submittedAt)}</span>
                  {sub.files?.length > 0 && <span>{sub.files.length} file{sub.files.length !== 1 ? "s" : ""}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-80 shrink-0 rounded-[3px] border border-[#1E293B] bg-[#111827] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">{selected.title}</h3>
            <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white text-xs">Close</button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs text-white/50 mb-1">Status</div>
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-2 py-1.5 text-sm text-white focus:outline-none focus:border-brand"
              >
                <option value="pending">Pending</option>
                <option value="review">Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {selected.description && (
              <div>
                <div className="text-xs text-white/50 mb-1">Description</div>
                <p className="text-sm text-white/70">{selected.description}</p>
              </div>
            )}

            {selected.files?.length > 0 && (
              <div>
                <div className="text-xs text-white/50 mb-1">Files</div>
                <div className="space-y-1">
                  {selected.files.map((f: string, i: number) => (
                    <a key={i} href={f} target="_blank" rel="noopener noreferrer" className="block text-xs text-brand hover:underline truncate">
                      {f.split("/").pop() || f}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {selected.feedback && (
              <div>
                <div className="text-xs text-white/50 mb-1">Client Feedback</div>
                <p className="text-sm text-white/70">{selected.feedback}</p>
              </div>
            )}

            <div className="pt-2 border-t border-[#1E293B]">
              <button onClick={() => handleDelete(selected.id)} className="text-xs text-red-400 hover:underline">
                Delete Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-white">New Submission</h2>
            <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Title *</label>
                <input type="text" required value={newSub.title} onChange={(e) => setNewSub({ ...newSub, title: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Description</label>
                <textarea value={newSub.description} onChange={(e) => setNewSub({ ...newSub, description: e.target.value })} rows={2} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Files (one URL per line)</label>
                <textarea value={newSub.files} onChange={(e) => setNewSub({ ...newSub, files: e.target.value })} rows={3} placeholder="https://..." className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white hover:border-brand transition-colors">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark transition-colors">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
