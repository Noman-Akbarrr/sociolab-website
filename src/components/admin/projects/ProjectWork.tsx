"use client";

import { useState, useEffect } from "react";

const statusConfig: Record<string, { label: string; color: string }> = {
  todo: { label: "To Do", color: "text-white/50" },
  "in-progress": { label: "In Progress", color: "text-blue-400" },
  review: { label: "Review", color: "text-yellow-400" },
  done: { label: "Done", color: "text-green-400" },
};

const priorityLabels: Record<number, string> = { 0: "Low", 1: "Medium", 2: "High", 3: "Urgent" };
const priorityColors: Record<number, string> = {
  0: "bg-white/10 text-white/50",
  1: "bg-blue-500/20 text-blue-400",
  2: "bg-yellow-500/20 text-yellow-400",
  3: "bg-red-500/20 text-red-400",
};

export function ProjectWork({
  project,
  userRole,
  userId,
}: {
  project: any;
  userRole: string;
  userId: string;
}) {
  const [tasks, setTasks] = useState(project.tasks || []);
  const canManage = userRole === "super_admin" || userRole === "admin" || userRole === "sales_executive";
  const isFreelancer = userRole === "freelancer";

  const [showAdd, setShowAdd] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", priority: 0, assigneeId: "", dueDate: "" });
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [driveLink, setDriveLink] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/admin/api/auth/users").then(r => r.ok ? r.json() : []).then(data => setUsers(data)).catch(() => {});
  }, []);

  const myTasks = isFreelancer
    ? tasks.filter((t: any) => t.assigneeId === userId)
    : tasks;

  const pendingTasks = myTasks.filter((t: any) => t.status !== "done");
  const completedTasks = myTasks.filter((t: any) => t.status === "done");

  function openAddModal() {
    setEditingTask(null);
    setForm({ title: "", description: "", priority: 0, assigneeId: "", dueDate: "" });
    setShowAdd(true);
  }

  function openEditModal(task: any) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority || 0,
      assigneeId: task.assigneeId || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    });
    setShowAdd(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingTask) {
      await fetch(`/admin/api/crm/tasks/${editingTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/admin/api/crm/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, ...form, status: "todo" }),
      });
    }
    setShowAdd(false);
    setEditingTask(null);
    window.location.reload();
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm("Delete this task?")) return;
    await fetch(`/admin/api/crm/tasks/${taskId}`, { method: "DELETE" });
    window.location.reload();
  }

  async function toggleComplete(taskId: string, currentStatus: string) {
    if (currentStatus === "done") {
      await fetch(`/admin/api/crm/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "todo" }),
      });
      window.location.reload();
    } else {
      setSubmittingTaskId(taskId);
    }
  }

  async function handleSubmission(taskId: string) {
    if (!driveLink.trim()) return;
    const res = await fetch("/admin/api/crm/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        taskId,
        title: tasks.find((t: any) => t.id === taskId)?.title || "Submission",
        description: `Submitted via task completion`,
        files: [driveLink],
        status: "pending",
        submitterId: userId,
      }),
    });
    if (res.ok) {
      await fetch(`/admin/api/crm/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "done" }),
      });
      setSubmittingTaskId(null);
      setDriveLink("");
      window.location.reload();
    }
  }

  function formatDate(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Work Checklist</h2>
          <p className="text-sm text-white/50">{pendingTasks.length} pending · {completedTasks.length} completed</p>
        </div>
        {canManage && (
          <button onClick={openAddModal} className="rounded-[3px] bg-brand px-3 py-1.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
            + Add Task
          </button>
        )}
      </div>

      {/* Pending tasks */}
      <div className="space-y-2">
        {pendingTasks.length === 0 ? (
          <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-8 text-center">
            <p className="text-sm text-white/50">
              {isFreelancer ? "No tasks assigned to you yet." : "No pending tasks."}
            </p>
          </div>
        ) : (
          pendingTasks.map((task: any) => (
            <div key={task.id} className="flex items-center gap-3 rounded-[3px] border border-[#1E293B] bg-[#111827] p-4 hover:border-white/10 transition-colors">
              <button
                onClick={() => toggleComplete(task.id, task.status)}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-white/20 text-white/40 hover:border-green-500 hover:text-green-500 transition-colors"
              >
                {task.status === "done" && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold ${priorityColors[task.priority] || priorityColors[0]}`}>
                    {priorityLabels[task.priority] || "Low"}
                  </span>
                </div>
                {task.description && <p className="text-xs text-white/40 mt-0.5 truncate">{task.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {task.assignee && (
                  <span className="text-[11px] text-white/40 bg-white/5 rounded-full px-2 py-0.5">{task.assignee.name}</span>
                )}
                {task.dueDate && (
                  <span className="text-[11px] text-white/40">{formatDate(task.dueDate)}</span>
                )}
                <span className={`text-[11px] font-medium ${statusConfig[task.status]?.color || "text-white/50"}`}>
                  {statusConfig[task.status]?.label || task.status}
                </span>
                {canManage && (
                  <div className="flex gap-1 ml-1">
                    <button onClick={() => openEditModal(task)} className="text-white/30 hover:text-brand transition-colors" title="Edit">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => handleDeleteTask(task.id)} className="text-white/30 hover:text-red-400 transition-colors" title="Delete">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                )}
                {isFreelancer && task.status !== "done" && (
                  <button
                    onClick={() => setSubmittingTaskId(task.id)}
                    className="rounded bg-brand/20 px-2 py-1 text-[11px] font-bold text-brand hover:bg-brand/30 transition-colors"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Completed</h3>
          <div className="space-y-1">
            {completedTasks.map((task: any) => (
              <div key={task.id} className="flex items-center gap-3 rounded-[3px] border border-[#1E293B] bg-[#111827]/50 p-3 opacity-60">
                <button
                  onClick={() => toggleComplete(task.id, task.status)}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-green-500 bg-green-500/20 text-green-500"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </button>
                <span className="text-sm text-white/50 line-through flex-1">{task.title}</span>
                {task.assignee && (
                  <span className="text-[11px] text-white/30">{task.assignee.name}</span>
                )}
                {canManage && (
                  <button onClick={() => handleDeleteTask(task.id)} className="text-white/20 hover:text-red-400 transition-colors" title="Delete">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Modal (Drive link) */}
      {submittingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-lg font-semibold text-white">Submit Work</h2>
            <p className="text-sm text-white/50 mt-1">Paste your Google Drive link or file URL where your work is saved.</p>
            <input
              type="url"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="mt-4 w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
              autoFocus
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => { setSubmittingTaskId(null); setDriveLink(""); }}
                className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white hover:border-brand"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmission(submittingTaskId)}
                disabled={!driveLink.trim()}
                className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Task Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-white">{editingTask ? "Edit Task" : "Add Task"}</h2>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Title *</label>
                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value={0}>Low</option>
                    <option value={1}>Medium</option>
                    <option value={2}>High</option>
                    <option value={3}>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Due Date</label>
                  <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Assign To</label>
                <select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                  <option value="">Unassigned</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowAdd(false); setEditingTask(null); }} className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white hover:border-brand transition-colors">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark transition-colors">{editingTask ? "Save Changes" : "Add Task"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
