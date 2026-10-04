"use client";

import { useState } from "react";
import {
  inputCls,
  submissionStatusMeta,
  taskStatusMeta,
  shortDate,
  StatusChip,
  type ProjectTask,
  type ProjectSubmission,
} from "./types";

export function SubmissionsTab({
  projectId,
  submissions,
  tasks,
  onSubmissionsChange,
  onTasksChange,
  canReview = true,
}: {
  projectId: string;
  submissions: ProjectSubmission[];
  tasks: ProjectTask[];
  onSubmissionsChange: React.Dispatch<React.SetStateAction<ProjectSubmission[]>>;
  onTasksChange: React.Dispatch<React.SetStateAction<ProjectTask[]>>;
  /** Only admins approve, reject, or delete submissions. */
  canReview?: boolean;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ title: "", description: "", taskId: "", files: "" });
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedbackDrafts, setFeedbackDrafts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const reviewCount = submissions.filter((s) => s.status === "review").length;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.title.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: createForm.title.trim(),
          description: createForm.description.trim() || null,
          taskId: createForm.taskId || null,
          files: createForm.files
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("failed");
      const submission: ProjectSubmission = await res.json();
      onSubmissionsChange((prev) => [submission, ...prev]);
      if (submission.taskId) {
        onTasksChange((prev) =>
          prev.map((t) => (t.id === submission.taskId ? { ...t, status: "review" } : t))
        );
      }
      setCreateForm({ title: "", description: "", taskId: "", files: "" });
      setShowCreate(false);
    } catch {
      setError("Could not create the submission.");
    } finally {
      setCreating(false);
    }
  }

  function syncTaskAfterReview(submission: ProjectSubmission, status: string) {
    if (!submission.taskId) return;
    const taskId = submission.taskId;
    onTasksChange((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        if (status === "approved") {
          return { ...t, status: "done", completedAt: new Date().toISOString() };
        }
        return { ...t, status: "in-progress", completedAt: null };
      })
    );
  }

  async function review(submission: ProjectSubmission, status: "approved" | "rejected" | "review") {
    const feedback = (feedbackDrafts[submission.id] ?? submission.feedback ?? "").trim();
    if ((status === "rejected" || status === "review") && !feedback) {
      setError(`Add feedback before ${status === "rejected" ? "rejecting" : "postponing"} this submission.`);
      return;
    }
    setBusyId(submission.id);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, feedback: feedback || null }),
      });
      if (!res.ok) throw new Error("failed");
      const updated: ProjectSubmission = await res.json();
      onSubmissionsChange((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      syncTaskAfterReview(submission, status);
    } catch {
      setError("Could not update the submission.");
    } finally {
      setBusyId(null);
    }
  }

  async function saveFeedback(submission: ProjectSubmission) {
    const feedback = (feedbackDrafts[submission.id] ?? "").trim();
    setBusyId(submission.id);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/submissions/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });
      if (!res.ok) throw new Error("failed");
      const updated: ProjectSubmission = await res.json();
      onSubmissionsChange((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    } catch {
      setError("Could not save the feedback.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(submission: ProjectSubmission) {
    if (!confirm(`Delete submission "${submission.title}"?`)) return;
    setBusyId(submission.id);
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/submissions/${submission.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("failed");
      onSubmissionsChange((prev) => prev.filter((s) => s.id !== submission.id));
    } catch {
      setError("Could not delete the submission.");
    } finally {
      setBusyId(null);
    }
  }

  const taskTitle = (id: string | null) => tasks.find((t) => t.id === id)?.title;

  return (
    <div className="max-w-4xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {reviewCount > 0 ? `${reviewCount} waiting for review` : "Nothing waiting for review"}
        </p>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: "#FF5500" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New submission
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Title *</label>
              <input
                className={inputCls}
                autoFocus
                value={createForm.title}
                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="e.g. Homepage design v1"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Linked task</label>
                <select
                  className={inputCls}
                  value={createForm.taskId}
                  onChange={(e) => setCreateForm({ ...createForm, taskId: e.target.value })}
                >
                  <option value="">None</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Files / links (one per line)</label>
                <input
                  className={inputCls}
                  value={createForm.files}
                  onChange={(e) => setCreateForm({ ...createForm, files: e.target.value })}
                  placeholder="https://…"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
              <textarea
                rows={3}
                className={`${inputCls} resize-none`}
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              />
            </div>
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
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
              {creating ? "Creating…" : "Create submission"}
            </button>
          </div>
        </form>
      )}

      {error && !showCreate && <p className="mb-3 text-xs text-red-500">{error}</p>}

      {submissions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
          No submissions yet. Submit work from a task, or create one here.
        </p>
      ) : (
        <ul className="space-y-3">
          {submissions.map((sub) => {
            const busy = busyId === sub.id;
            const reviewable = sub.status === "review" || sub.status === "pending";
            const draft = feedbackDrafts[sub.id] ?? sub.feedback ?? "";
            return (
              <li key={sub.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-gray-800">{sub.title}</p>
                      <StatusChip meta={submissionStatusMeta[sub.status]}>
                        {submissionStatusMeta[sub.status]?.label ?? sub.status}
                      </StatusChip>
                      {sub.taskId && taskTitle(sub.taskId) && (
                        <span className="text-[11px] text-gray-400">↳ {taskTitle(sub.taskId)}</span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400">{shortDate(sub.submittedAt)}</p>
                    {sub.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">{sub.description}</p>
                    )}
                    {sub.files.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {sub.files.map((file, i) => (
                          <li key={`${sub.id}-f${i}`}>
                            <a
                              href={file}
                              target="_blank"
                              rel="noreferrer"
                              className="break-all text-xs text-[#FF5500] hover:underline"
                            >
                              {file}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {canReview && (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(sub)}
                        disabled={busy}
                        title="Delete submission"
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
                    </div>
                  )}
                </div>

                {canReview && (
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <label className="mb-1 block text-xs font-medium text-gray-500">Reviewer feedback</label>
                  <textarea
                    rows={2}
                    className={`${inputCls} resize-none`}
                    value={draft}
                    disabled={busy}
                    placeholder="What needs changing, or why it is approved…"
                    onChange={(e) => setFeedbackDrafts((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                  />
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => saveFeedback(sub)}
                      disabled={busy || draft === (sub.feedback ?? "")}
                      className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                      Save feedback
                    </button>

                    {reviewable && (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => review(sub, "approved")}
                          disabled={busy}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50"
                          style={{ backgroundColor: "#059669" }}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => review(sub, "rejected")}
                          disabled={busy}
                          className="rounded-md px-3 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50"
                          style={{ backgroundColor: "#DC2626" }}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => review(sub, "review")}
                          disabled={busy}
                          title="Keep it in review — needs another pass"
                          className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 transition-colors disabled:opacity-50"
                        >
                          Postpone
                        </button>
                      </div>
                    )}

                    {sub.status === "approved" && (
                      <span className="text-xs font-medium text-green-600">
                        Linked task {taskTitle(sub.taskId) ? "marked done" : "—"}
                      </span>
                    )}
                    {sub.status === "rejected" && (
                      <span className="text-xs font-medium text-red-500">Sent back to the assignee</span>
                    )}
                  </div>
                </div>
                )}

                {sub.taskId && taskTitle(sub.taskId) && (
                  <p className="mt-2 text-[11px] text-gray-400">
                    Task status:{" "}
                    {taskStatusMeta[tasks.find((t) => t.id === sub.taskId)?.status ?? ""]?.label ?? "—"}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
