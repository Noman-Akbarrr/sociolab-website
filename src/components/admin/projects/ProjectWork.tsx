"use client";

import { useState } from "react";

const statusConfig: Record<string, { label: string; color: string }> = {
  todo: { label: "To Do", color: "text-white/50" },
  "in-progress": { label: "In Progress", color: "text-blue-400" },
  review: { label: "Review", color: "text-yellow-400" },
  done: { label: "Done", color: "text-green-400" },
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
  const tasks = project.tasks || [];
  const canManage = userRole === "super_admin" || userRole === "admin" || userRole === "sales_executive";
  const isFreelancer = userRole === "freelancer";

  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: 0, dueDate: "" });
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [driveLink, setDriveLink] = useState("");

  const myTasks = isFreelancer
    ? tasks.filter((t: any) => t.assigneeId === userId)
    : tasks;

  const pendingTasks = myTasks.filter((t: any) => t.status !== "done");
  const completedTasks = myTasks.filter((t: any) => t.status === "done");

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/admin/api/crm/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, ...newTask, status: "todo" }),
    });
    if (res.ok) {
      setShowAdd(false);
      setNewTask({ title: "", description: "", priority: 0, dueDate: "" });
      window.location.reload();
    }
  }

  async function toggleComplete(taskId: string, currentStatus: string) {
    const newStatus = currentStatus === "done" ? "todo" : "done";
    await fetch(`/admin/api/crm/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    window.location.reload();
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
        description: `Submitted via task tick`,
        files: [driveLink],
        status: "pending",
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
          <button onClick={() => setShowAdd(true)} className="rounded-[3px] bg-brand px-3 py-1.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
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
                <p className="text-sm font-medium text-white">{task.title}</p>
                {task.description && <p className="text-xs text-white/40 mt-0.5 truncate">{task.description}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {task.assignee && (
                  <span className="text-[11px] text-white/40">{task.assignee.name}</span>
                )}
                {task.dueDate && (
                  <span className="text-[11px] text-white/40">{formatDate(task.dueDate)}</span>
                )}
                <span className={`text-[11px] font-medium ${statusConfig[task.status]?.color || "text-white/50"}`}>
                  {statusConfig[task.status]?.label || task.status}
                </span>
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
                <span className="text-sm text-white/50 line-through">{task.title}</span>
                {task.assignee && (
                  <span className="text-[11px] text-white/30 ml-auto">{task.assignee.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {submittingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-lg font-semibold text-white">Submit Work</h2>
            <p className="text-sm text-white/50 mt-1">Paste your Google Drive link or file URL.</p>
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

      {/* Add Task Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-white">Add Task</h2>
            <form onSubmit={handleAddTask} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Title *</label>
                <input type="text" required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} rows={2} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Due Date</label>
                <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white hover:border-brand transition-colors">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark transition-colors">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
