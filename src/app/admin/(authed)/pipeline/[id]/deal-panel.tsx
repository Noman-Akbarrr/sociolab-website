"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAdminSession } from "@/lib/use-admin-session";
import { roleOf } from "@/lib/access";

export interface PanelActivity {
  id: string;
  type: string;
  subject: string;
  body: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

export interface PanelDeal {
  id: string;
  title: string;
  companyId: string;
  company: { id: string; name: string } | null;
  stageId: string;
  stage: { id: string; name: string; label: string; color: string } | null;
  value: number;
  priority: string;
  ownerId: string;
  owner: { id: string; name: string; email: string } | null;
  source: string | null;
  notes: string | null;
  probability: number;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  expectedClose: string | null;
  createdAt: string;
  activities: PanelActivity[];
}

interface Option {
  id: string;
  name: string;
}

interface StageOption extends Option {
  label: string;
  color: string;
}

interface DealPanelProps {
  dealId: string | null;
  stages: StageOption[];
  onClose: () => void;
  onSaved: (deal: PanelDeal) => void;
  onDeleted: (dealId: string) => void;
}

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]";

const activityMeta: Record<string, { label: string; color: string; bg: string }> = {
  created: { label: "Created", color: "#059669", bg: "#ECFDF5" },
  "stage-changed": { label: "Stage", color: "#2563EB", bg: "#EFF6FF" },
  updated: { label: "Updated", color: "#7C3AED", bg: "#F5F3FF" },
  note: { label: "Note", color: "#B45309", bg: "#FFFBEB" },
  call: { label: "Call", color: "#0F766E", bg: "#F0FDFA" },
  email: { label: "Email", color: "#1D4ED8", bg: "#EFF6FF" },
  meeting: { label: "Meeting", color: "#9333EA", bg: "#FAF5FF" },
  task: { label: "Task", color: "#4B5563", bg: "#F3F4F6" },
};

function toDateInput(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function formFromDeal(data: PanelDeal) {
  return {
    title: data.title,
    companyId: data.companyId ?? "",
    stageId: data.stageId ?? "",
    value: String(data.value ?? 0),
    priority: data.priority ?? "medium",
    ownerId: data.ownerId ?? "",
    probability: String(data.probability ?? 0),
    source: data.source ?? "",
    expectedClose: toDateInput(data.expectedClose),
    contactName: data.contactName ?? "",
    contactEmail: data.contactEmail ?? "",
    contactPhone: data.contactPhone ?? "",
    notes: data.notes ?? "",
  };
}

function formatTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

export function DealPanel({ dealId, stages, onClose, onSaved, onDeleted }: DealPanelProps) {
  const { isFull, managesSales } = useAdminSession();
  // A salesman can nudge their own deal (stage, priority, probability,
  // notes) but nothing else — the rest of the panel is read-only.
  const readOnly = !managesSales;
  const canDelete = managesSales;
  const [deal, setDeal] = useState<PanelDeal | null>(null);
  const [loadState, setLoadState] = useState<{ id: string; state: "ready" | "error" } | null>(null);
  const [companies, setCompanies] = useState<Option[]>([]);
  const [owners, setOwners] = useState<Option[]>([]);
  const [form, setForm] = useState({
    title: "",
    companyId: "",
    stageId: "",
    value: "",
    priority: "medium",
    ownerId: "",
    probability: "",
    source: "",
    expectedClose: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    notes: "",
  });
  const [baseline, setBaseline] = useState(form);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [activities, setActivities] = useState<PanelActivity[]>([]);
  const [logForm, setLogForm] = useState({ type: "note", subject: "", body: "" });
  const [logging, setLogging] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const loadFailed = loadState?.id === dealId && loadState.state === "error";
  const loading = Boolean(dealId) && !loadFailed && (!deal || deal.id !== dealId);

  // Keep the deal's own company/owner selectable even if the lists haven't loaded yet
  const companyOptions = [...companies];
  if (deal?.companyId && !companyOptions.some((c) => c.id === deal.companyId)) {
    companyOptions.push({ id: deal.companyId, name: deal.company?.name ?? "Current company" });
  }
  const ownerOptions = [...owners];
  if (deal?.ownerId && !ownerOptions.some((o) => o.id === deal.ownerId)) {
    ownerOptions.push({ id: deal.ownerId, name: deal.owner?.name ?? "Current owner" });
  }

  useEffect(() => {
    if (!dealId) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/admin/api/crm/deals/${dealId}`);
        if (!res.ok) throw new Error("Failed to load deal");
        const data: PanelDeal = await res.json();
        if (!active) return;
        setDeal(data);
        setActivities(data.activities ?? []);
        const next = formFromDeal(data);
        setForm(next);
        setBaseline(next);
        setSaveError("");
        setLoadState({ id: dealId, state: "ready" });
      } catch (e) {
        console.error(e);
        if (!active) return;
        setLoadState({ id: dealId, state: "error" });
        setSaveError("Couldn't load this deal. Close the panel and try again.");
      }
    })();
    return () => {
      active = false;
    };
  }, [dealId]);

  useEffect(() => {
    if (!dealId) return;
    fetch("/admin/api/crm/companies")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Option[]) => setCompanies(rows.map((c) => ({ id: c.id, name: c.name }))))
      .catch(() => {});
    // Only sales leads/admins pick an owner (and may open the users list).
    if (managesSales) {
      fetch("/admin/api/crm/users")
        .then((r) => (r.ok ? r.json() : []))
        .then((rows: { id: string; name: string; role: string }[]) =>
          setOwners(
            rows
              .filter((u) => isFull || roleOf(u) === "salesman")
              .map((u) => ({ id: u.id, name: u.name }))
          )
        )
        .catch(() => {});
    }
  }, [dealId, managesSales, isFull]);

  useEffect(() => {
    if (!dealId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dealId, onClose]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!dealId || !form.title.trim()) return;
    setSaving(true);
    setSaveError("");
    try {
      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        value: Number(form.value) || 0,
        priority: form.priority,
        probability: Math.max(0, Math.min(100, Number(form.probability) || 0)),
        source: form.source.trim() || null,
        expectedClose: form.expectedClose || null,
        contactName: form.contactName.trim() || null,
        contactEmail: form.contactEmail.trim() || null,
        contactPhone: form.contactPhone.trim() || null,
        notes: form.notes.trim() || null,
      };
      // company / owner are required on the deal — only send them when a real value is picked
      if (form.companyId) payload.companyId = form.companyId;
      if (form.stageId) payload.stageId = form.stageId;
      if (form.ownerId) payload.ownerId = form.ownerId;

      const res = await fetch(`/admin/api/crm/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated: PanelDeal = await res.json();
      setDeal(updated);
      setActivities(updated.activities ?? []);
      const next = formFromDeal(updated);
      setForm(next);
      setBaseline(next);
      onSaved(updated);
    } catch {
      setSaveError("Couldn't save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogActivity(e: React.FormEvent) {
    e.preventDefault();
    if (!dealId || !logForm.subject.trim()) return;
    setLogging(true);
    try {
      const res = await fetch(`/admin/api/crm/deals/${dealId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: logForm.type,
          subject: logForm.subject.trim(),
          body: logForm.body.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to log");
      const activity: PanelActivity = await res.json();
      setActivities((prev) => [activity, ...prev]);
      setLogForm({ type: "note", subject: "", body: "" });
    } catch {
      setSaveError("Couldn't log that activity. Please try again.");
    } finally {
      setLogging(false);
    }
  }

  async function handleDelete() {
    if (!dealId) return;
    if (!confirm("Delete this deal? This cannot be undone.")) return;
    try {
      const res = await fetch(`/admin/api/crm/deals/${dealId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onDeleted(dealId);
      onClose();
    } catch {
      setSaveError("Couldn't delete this deal.");
    }
  }

  return (
    <AnimatePresence>
      {dealId && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            key="panel"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col border-l border-gray-200 bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Deal details"
          >
            {/* Header */}
            <div className="border-b border-gray-200 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {deal?.stage && (
                      <span
                        className="inline-flex items-center rounded px-2 py-0.5 text-[11px] font-medium text-white"
                        style={{ backgroundColor: deal.stage.color }}
                      >
                        {deal.stage.label || deal.stage.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{deal?.priority} priority</span>
                  </div>
                  <h2 className="mt-1.5 truncate text-lg font-semibold text-gray-900">
                    {loading ? "Loading…" : deal?.title ?? "Deal"}
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {deal?.company?.name ?? "No company"} · Rs. {(deal?.value ?? 0).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  title="Close (Esc)"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#FF5500]" />
                </div>
              ) : (
                <>
                  {saveError && (
                    <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                      {saveError}
                    </div>
                  )}

                  <form onSubmit={handleSave} id="deal-details-form" className="space-y-4">
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Details</h3>
                      <div className="space-y-3">
                        <Field label="Title">
                          <input
                            type="text"
                            className={inputCls}
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            disabled={readOnly}
                            required
                          />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Company">
                            <select
                              className={inputCls}
                              value={form.companyId}
                              onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                              disabled={readOnly}
                            >
                              {!form.companyId && <option value="">Select company</option>}
                              {companyOptions.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Stage">
                            <select
                              className={inputCls}
                              value={form.stageId}
                              onChange={(e) => setForm({ ...form, stageId: e.target.value })}
                            >
                              {stages.map((s) => (
                                <option key={s.id} value={s.id}>{s.label || s.name}</option>
                              ))}
                            </select>
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Value (PKR)">
                            <input
                              type="number"
                              min={0}
                              className={inputCls}
                              value={form.value}
                              onChange={(e) => setForm({ ...form, value: e.target.value })}
                              disabled={readOnly}
                            />
                          </Field>
                          <Field label="Priority">
                            <select
                              className={inputCls}
                              value={form.priority}
                              onChange={(e) => setForm({ ...form, priority: e.target.value })}
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {managesSales ? (
                            <Field label="Owner">
                              <select
                                className={inputCls}
                                value={form.ownerId}
                                onChange={(e) => setForm({ ...form, ownerId: e.target.value })}
                              >
                                {!form.ownerId && <option value="">Select owner</option>}
                                {ownerOptions.map((o) => (
                                  <option key={o.id} value={o.id}>{o.name}</option>
                                ))}
                              </select>
                            </Field>
                          ) : (
                            <Field label="Owner">
                              <p className="pt-1.5 text-sm text-gray-700">
                                {deal?.owner?.name ?? "Unassigned"}
                              </p>
                            </Field>
                          )}
                          <Field label="Probability (%)">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              className={inputCls}
                              value={form.probability}
                              onChange={(e) => setForm({ ...form, probability: e.target.value })}
                            />
                          </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Source">
                            <input
                              type="text"
                              className={inputCls}
                              placeholder="Referral, Website…"
                              value={form.source}
                              onChange={(e) => setForm({ ...form, source: e.target.value })}
                              disabled={readOnly}
                            />
                          </Field>
                          <Field label="Expected close">
                            <input
                              type="date"
                              className={inputCls}
                              value={form.expectedClose}
                              onChange={(e) => setForm({ ...form, expectedClose: e.target.value })}
                              disabled={readOnly}
                            />
                          </Field>
                        </div>

                        <div>
                          <p className="mb-2 mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Contact
                          </p>
                          <div className="space-y-3">
                            <Field label="Contact name">
                              <input
                                type="text"
                                className={inputCls}
                                value={form.contactName}
                                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                                disabled={readOnly}
                              />
                            </Field>
                            <div className="grid grid-cols-2 gap-3">
                              <Field label="Email">
                                <input
                                  type="email"
                                  className={inputCls}
                                  value={form.contactEmail}
                                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                                  disabled={readOnly}
                                />
                              </Field>
                              <Field label="Phone">
                                <input
                                  type="text"
                                  className={inputCls}
                                  value={form.contactPhone}
                                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                                  disabled={readOnly}
                                />
                              </Field>
                            </div>
                          </div>
                        </div>

                        <Field label="Notes">
                          <textarea
                            rows={3}
                            className={`${inputCls} resize-none`}
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                          />
                        </Field>
                      </div>
                    </div>
                  </form>

                  {/* Activity */}
                  <div className="mt-7 border-t border-gray-100 pt-5">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Activity</h3>

                    <form onSubmit={handleLogActivity} className="mb-5 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="flex gap-2">
                        <select
                          className={`${inputCls} w-28 shrink-0`}
                          value={logForm.type}
                          onChange={(e) => setLogForm({ ...logForm, type: e.target.value })}
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
                          value={logForm.subject}
                          onChange={(e) => setLogForm({ ...logForm, subject: e.target.value })}
                        />
                      </div>
                      <textarea
                        rows={2}
                        className={`${inputCls} resize-none`}
                        placeholder="Add detail (optional)"
                        value={logForm.body}
                        onChange={(e) => setLogForm({ ...logForm, body: e.target.value })}
                      />
                      <button
                        type="submit"
                        disabled={logging || !logForm.subject.trim()}
                        className="w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                        style={{ backgroundColor: "#FF5500" }}
                      >
                        {logging ? "Logging…" : "Log activity"}
                      </button>
                    </form>

                    {activities.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-400">
                        No activity yet. Log the first touch.
                      </p>
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
                                {a.body && <p className="mt-0.5 break-words text-sm text-gray-500">{a.body}</p>}
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
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-white px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                {canDelete ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    Delete deal
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
                  <button
                    type="button"
                    onClick={() => {
                      const formEl = document.getElementById("deal-details-form");
                      if (formEl instanceof HTMLFormElement) formEl.requestSubmit();
                    }}
                    disabled={saving || !dirty || loading}
                    className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                    style={{ backgroundColor: "#FF5500" }}
                  >
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
