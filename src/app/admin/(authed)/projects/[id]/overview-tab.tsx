"use client";

import { useState } from "react";
import {
  inputCls,
  type ProjectDetail,
  type UserOption,
  type CompanyOption,
} from "./types";

function formFromProject(p: ProjectDetail) {
  return {
    name: p.name ?? "",
    companyId: p.companyId ?? "",
    assigneeId: p.assigneeId ?? "",
    status: p.status ?? "kickoff",
    startDate: p.startDate ? p.startDate.slice(0, 10) : "",
    endDate: p.endDate ? p.endDate.slice(0, 10) : "",
    budget: p.budget != null ? String(p.budget) : "",
    internalCost: p.internalCost != null ? String(p.internalCost) : "",
    billingType: p.billingType ?? "fixed",
    description: p.description ?? "",
    notes: p.notes ?? "",
  };
}

export function OverviewTab({
  project,
  users,
  companies,
  onSaved,
  readOnly = false,
}: {
  project: ProjectDetail;
  users: UserOption[];
  companies: CompanyOption[];
  onSaved: (project: ProjectDetail) => void;
  /** Freelancers can look at the business info but never touch it. */
  readOnly?: boolean;
}) {
  const [form, setForm] = useState(formFromProject(project));
  const [baseline, setBaseline] = useState(form);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch(`/admin/api/crm/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          companyId: form.companyId,
          assigneeId: form.assigneeId,
          status: form.status,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          budget: form.budget ? Number(form.budget) : null,
          internalCost: form.internalCost ? Number(form.internalCost) : null,
          billingType: form.billingType,
          description: form.description.trim() || null,
          notes: form.notes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("failed");
      const updated: ProjectDetail = await res.json();
      onSaved(updated);
      const next = formFromProject({ ...project, ...updated });
      setForm(next);
      setBaseline(next);
      setSaved(true);
    } catch {
      setError("Could not save the project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-3xl">
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-800">Project details</h2>

        <fieldset disabled={readOnly} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Name *</label>
            <input
              className={inputCls}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Company *</label>
            <select
              className={inputCls}
              value={form.companyId}
              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            >
              <option value="">Select company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Assignee</label>
            <select
              className={inputCls}
              value={form.assigneeId}
              onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
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
            <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
            <select
              className={inputCls}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="kickoff">Kickoff</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="done">Done</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Billing type</label>
            <select
              className={inputCls}
              value={form.billingType}
              onChange={(e) => setForm({ ...form, billingType: e.target.value })}
            >
              <option value="fixed">Fixed</option>
              <option value="retainer">Retainer</option>
              <option value="time-materials">Time &amp; materials</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Start date</label>
            <input
              type="date"
              className={inputCls}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">End date</label>
            <input
              type="date"
              className={inputCls}
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Budget (what we charge, Rs.)</label>
            <input
              type="number"
              className={inputCls}
              value={form.budget}
              placeholder="0"
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
            />
          </div>

          {!readOnly && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Internal cost (what it costs us, Rs.)</label>
              <input
                type="number"
                className={inputCls}
                value={form.internalCost}
                placeholder="0"
                onChange={(e) => setForm({ ...form, internalCost: e.target.value })}
              />
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={form.description}
              placeholder="Scope, goals, deliverables…"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Notes</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={form.notes}
              placeholder="Ideas, branding direction, references, links…"
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </fieldset>

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
      </div>

      {!readOnly && (
        <div className="mt-4 flex items-center justify-end gap-3">
          {saved && !dirty && <span className="text-xs text-green-600">Saved</span>}
          {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
          <button
            type="submit"
            disabled={saving || !dirty}
            className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#FF5500" }}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      )}
    </form>
  );
}
