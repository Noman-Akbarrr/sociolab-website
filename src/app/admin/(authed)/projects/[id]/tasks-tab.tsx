"use client";

import { useState } from "react";
import {
  inputCls,
  taskStatusMeta,
  shortDate,
  StatusChip,
  type ProjectTask,
  type ProjectSubmission,
  type UserOption,
} from "./types";
import type { ActivityItem } from "../../components/activity-feed";

const priorityMeta = [
  { value: 0, label: "Low", bg: "#ECFDF5", text: "#059669" },
  { value: 1, label: "Medium", bg: "#FFF3E0", text: "#FF9800" },
  { value: 2, label: "High", bg: "#FEF2F2", text: "#DC2626" },
];

function localActivity(type: string, subject: string, body?: string | null): ActivityItem {
  return {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    subject,
    body: body ?? null,
    createdAt: new Date().toISOString(),
    user: null,
  };
}

export function TasksTab({
  projectId,
  tasks,
  users,
  onTasksChange,
  onSubmissionCreated,
  onActivity,
  limited = false,
}: {
  projectId: string;
  tasks: ProjectTask[];
  users: UserOption[];
  onTasksChange: React.Dispatch<React.SetStateAction<ProjectTask[]>>;
  onSubmissionCreated: (submission: ProjectSubmission) => void;
  onActivity: (activity: ActivityItem) => void;
  /** Freelancers only move their own tasks along — no creating or reassigning. */
  limited?: boolean;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    assigneeId: "",
    dueDate: "",
    priority: "0",
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", dueDate: "", priority: "0" });
  const [busyId, setBusyId] = useState<string | null>(null);

  const [submittingTask, setSubmittingTask] = useState<ProjectTask | null>(null);
  const [submitForm, setSubmitForm] = useState({ title: "", description: "", files: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.title.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: createForm.title.trim(),
          description: createForm.description.trim() || null,
          assigneeId: createForm.assigneeId || null,
          dueDate: createForm.dueDate || null,
          priority: Number(createForm.priority),
        }),
      });
      if (!res.ok) throw new Error("failed");
      const task: ProjectTask = await res.json();
      onTasksChange((prev) => [task, ...prev]);
      onActivity(localActivity("task-created", `Task created: ${task.title}${task.assigneeId ? " (assigned)" : ""}`));
      setCreateForm({ title: "", description: "", assigneeId: "", dueDate: "", priority: "0" });
      setShowCreate(false);
    } catch {
      setError("Could not create the task.");
    } finally {
      setCreating(false);
    }
  }

  async function patchTask(task: ProjectTask, body: Record<string, unknown>): Promise<boolean> {
    setBusyId(task.id);
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("failed");
      const updated: ProjectTask = await res.json();
      onTasksChange((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      return true;
    } catch {
      setError("Could not update the task.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(task: ProjectTask) {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    setBusyId(task.id);
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/tasks/${task.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("failed");
      onTasksChange((prev) => prev.filter((t) => t.id !== task.id));
      onActivity(localActivity("task-deleted", `Task deleted: ${task.title}`));
    } catch {
      setError("Could not delete the task.");
    } finally {
      setBusyId(null);
    }
  }

  function openEdit(task: ProjectTask) {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      description: task.description ?? "",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      priority: String(task.priority ?? 0),
    });
  }

  async function saveEdit(task: ProjectTask) {
    const ok = await patchTask(task, {
      title: editForm.title.trim(),
      description: editForm.description.trim() || null,
      dueDate: editForm.dueDate || null,
      priority: Number(editForm.priority),
    });
    if (ok) setEditingId(null);
  }

  function openSubmit(task: ProjectTask) {
    setSubmittingTask(task);
    setSubmitForm({ title: task.title, description: task.description ?? "", files: "" });
  }

  async function handleSubmitWork(e: React.FormEvent) {
    e.preventDefault();
    if (!submittingTask) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: submittingTask.id,
          title: submitForm.title.trim(),
          description: submitForm.description.trim() || null,
          files: submitForm.files
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("failed");
      const submission: ProjectSubmission = await res.json();
      onSubmissionCreated(submission);
      onTasksChange((prev) =>
        prev.map((t) => (t.id === submittingTask.id ? { ...t, status: "review" } : t))
      );
      onActivity(localActivity("submitted", `Submitted for review: ${submission.title}`));
      setSubmittingTask(null);
    } catch {
      setError("Could not submit the work.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {tasks.filter((t) => t.status === "done").length} of {tasks.length} done
        </p>
        {!limited && (
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#FF5500" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add task
          </button>
        )}
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Title *</label>
              <input
                className={inputCls}
                autoFocus
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="What needs to be done?"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Assignee</label>
              <select
                className={inputCls}
                value={createForm.assigneeId}
                onChange={(e) => setCreateForm({ ...createForm, assigneeId: e.target.value })}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Due date</label>
              <input
                type="date"
                className={inputCls}
                value={createForm.dueDate}
                onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Priority</label>
              <select
                className={inputCls}
                value={createForm.priority}
                onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
              >
                {priorityMeta.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
              <textarea
                rows={2}
                className={`${inputCls} resize-none`}
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !createForm.title.trim()}
              className="rounded-md px-3.5 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#FF5500" }}
            >
              {creating ? "Creating…" : "Create task"}
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </form>
      )}

      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
          No tasks yet. Add the first one to get this project moving.
        </p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => {
            const priority = priorityMeta[task.priority] ?? priorityMeta[0];
            const editing = editingId === task.id;
            const busy = busyId === task.id;
            return (
              <li key={task.id} className="rounded-lg border border-gray-200 bg-white p-4">
                {editing ? (
                  <div className="space-y-3">
                    <input
                      className={inputCls}
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                    <textarea
                      rows={2}
                      className={`${inputCls} resize-none`}
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        className={inputCls}
                        value={editForm.dueDate}
                        onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                      />
                      <select
                        className={inputCls}
                        value={editForm.priority}
                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      >
                        {priorityMeta.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveEdit(task)}
                        disabled={busy || !editForm.title.trim()}
                        className="rounded-md px-3.5 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                        style={{ backgroundColor: "#FF5500" }}
                      >
                        {busy ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-gray-800">{task.title}</p>
                        <StatusChip meta={taskStatusMeta[task.status]}>
                          {taskStatusMeta[task.status]?.label ?? task.status}
                        </StatusChip>
                        <span
                          className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                          style={{ backgroundColor: priority.bg, color: priority.text }}
                        >
                          {priority.label}
                        </span>
                      </div>
                      {task.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{task.description}</p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span>Due {shortDate(task.dueDate)}</span>
                        {task.completedAt && <span>Completed {shortDate(task.completedAt)}</span>}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={task.status}
                        disabled={busy}
                        onChange={(e) => patchTask(task, { status: e.target.value })}
                        className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-700 focus:border-[#FF5500] focus:outline-none"
                        title="Change status"
                      >
                        {Object.entries(taskStatusMeta).map(([value, meta]) => (
                          <option key={value} value={value}>
                            {meta.label}
                          </option>
                        ))}
                      </select>
                      {!limited && (
                        <select
                          value={task.assigneeId ?? ""}
                          disabled={busy}
                          onChange={(e) => patchTask(task, { assigneeId: e.target.value || null })}
                          className="max-w-36 truncate rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-700 focus:border-[#FF5500] focus:outline-none"
                          title="Assign"
                        >
                          <option value="">Unassigned</option>
                          {users.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <button
                        type="button"
                        onClick={() => openSubmit(task)}
                        title="Submit work for review"
                        className="rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-[#FF5500] hover:text-[#FF5500]"
                      >
                        Submit work
                      </button>
                      {!limited && (
                        <button
                          type="button"
                          onClick={() => openEdit(task)}
                          title="Edit task"
                          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.863 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.683-12.68z"
                            />
                          </svg>
                        </button>
                      )}
                      {!limited && (
                        <button
                          type="button"
                          onClick={() => handleDelete(task)}
                          disabled={busy}
                          title="Delete task"
                          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {submittingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSubmittingTask(null)}
        >
          <form
            onSubmit={handleSubmitWork}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-xl"
          >
            <h3 className="mb-1 text-sm font-semibold text-gray-800">Submit work for review</h3>
            <p className="mb-4 text-xs text-gray-500">
              The task moves to “In review” until it is approved or rejected.
            </p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Title *</label>
                <input
                  className={inputCls}
                  value={submitForm.title}
                  onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">What was delivered?</label>
                <textarea
                  rows={3}
                  className={`${inputCls} resize-none`}
                  value={submitForm.description}
                  onChange={(e) => setSubmitForm({ ...submitForm, description: e.target.value })}
                  placeholder="Summary of the work, links to previews, notes for the reviewer…"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Files / links (one per line)</label>
                <textarea
                  rows={3}
                  className={`${inputCls} resize-none`}
                  value={submitForm.files}
                  onChange={(e) => setSubmitForm({ ...submitForm, files: e.target.value })}
                  placeholder="https://figma.com/…&#10;https://drive.google.com/…"
                />
              </div>
            </div>
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSubmittingTask(null)}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !submitForm.title.trim()}
                className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#FF5500" }}
              >
                {submitting ? "Submitting…" : "Submit for review"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
