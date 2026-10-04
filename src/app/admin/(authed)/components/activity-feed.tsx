"use client";

import { useState } from "react";

export interface ActivityItem {
  id: string;
  type: string;
  subject: string;
  body: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

export interface ActivityParent {
  contactId?: string | null;
  companyId?: string | null;
  projectId?: string | null;
  ticketId?: string | null;
  taskId?: string | null;
}

const activityMeta: Record<string, { label: string; color: string; bg: string }> = {
  created: { label: "Created", color: "#059669", bg: "#ECFDF5" },
  updated: { label: "Updated", color: "#7C3AED", bg: "#F5F3FF" },
  deleted: { label: "Deleted", color: "#DC2626", bg: "#FEF2F2" },
  note: { label: "Note", color: "#B45309", bg: "#FFFBEB" },
  call: { label: "Call", color: "#0F766E", bg: "#F0FDFA" },
  email: { label: "Email", color: "#1D4ED8", bg: "#EFF6FF" },
  meeting: { label: "Meeting", color: "#9333EA", bg: "#FAF5FF" },
  task: { label: "Task", color: "#4B5563", bg: "#F3F4F6" },
  "task-created": { label: "Task", color: "#4B5563", bg: "#F3F4F6" },
  "task-status": { label: "Status", color: "#2563EB", bg: "#EFF6FF" },
  "task-assigned": { label: "Assigned", color: "#7C3AED", bg: "#F5F3FF" },
  "task-deleted": { label: "Task", color: "#DC2626", bg: "#FEF2F2" },
  submitted: { label: "Submitted", color: "#B45309", bg: "#FFFBEB" },
  "submission-approved": { label: "Approved", color: "#059669", bg: "#ECFDF5" },
  "submission-rejected": { label: "Rejected", color: "#DC2626", bg: "#FEF2F2" },
  "submission-postponed": { label: "Postponed", color: "#B45309", bg: "#FFFBEB" },
  "invoice-created": { label: "Invoice", color: "#1D4ED8", bg: "#EFF6FF" },
  "invoice-updated": { label: "Invoice", color: "#1D4ED8", bg: "#EFF6FF" },
  "invoice-deleted": { label: "Invoice", color: "#DC2626", bg: "#FEF2F2" },
  "payment-received": { label: "Payment", color: "#059669", bg: "#ECFDF5" },
  "stage-changed": { label: "Stage", color: "#2563EB", bg: "#EFF6FF" },
};

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]";

function formatTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function ActivityFeed({
  activities,
  parent,
  onCreated,
  emptyText = "No activity yet. Log the first touch.",
}: {
  activities: ActivityItem[];
  parent: ActivityParent;
  onCreated: (activity: ActivityItem) => void;
  emptyText?: string;
}) {
  const [type, setType] = useState("note");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/admin/api/crm/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, subject: subject.trim(), body: body.trim() || null, ...parent }),
      });
      if (!res.ok) throw new Error("Failed");
      const created: ActivityItem = await res.json();
      onCreated(created);
      setSubject("");
      setBody("");
    } catch {
      setError("Couldn't save the activity. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-5 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="flex gap-2">
          <select
            className={`${inputCls} w-28 shrink-0`}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="note">Note</option>
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
          </select>
          <input
            type="text"
            className={inputCls}
            placeholder="What happened?"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <textarea
          rows={2}
          className={`${inputCls} resize-none`}
          placeholder="Add detail (optional)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={busy || !subject.trim()}
          className="w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: "#FF5500" }}
        >
          {busy ? "Logging…" : "Log activity"}
        </button>
      </form>

      {activities.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">{emptyText}</p>
      ) : (
        <ol className="space-y-3">
          {activities.map((a) => {
            const meta = activityMeta[a.type] ?? activityMeta.note;
            return (
              <li key={a.id} className="flex gap-3">
                <span
                  className="mt-1 inline-flex h-fit shrink-0 items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: meta.color, backgroundColor: meta.bg }}
                >
                  {meta.label}
                </span>
                <div className="min-w-0 flex-1 border-b border-gray-100 pb-3">
                  <p className="text-sm font-medium text-gray-800">{a.subject}</p>
                  {a.body && <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-500">{a.body}</p>}
                  <p className="mt-1 text-[11px] text-gray-400">
                    {formatTime(a.createdAt)}
                    {a.user ? ` · ${a.user.name}` : ""}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
