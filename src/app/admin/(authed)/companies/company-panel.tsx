"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ActivityFeed, type ActivityItem } from "../components/activity-feed";

export interface PanelCompany {
  id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  size: string | null;
  website: string | null;
  linkedin: string | null;
  notes: string | null;
  tags: string[];
  contacts: { id: string; firstName: string; lastName: string; email: string; title: string | null }[];
  activities: ActivityItem[];
  _count: { deals: number; projects: number; tickets: number };
}

interface CompanyPanelProps {
  companyId: string | null;
  onClose: () => void;
  onSaved: (company: PanelCompany) => void;
  onDeleted: (companyId: string) => void;
}

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]";

function emptyCompany(): PanelCompany {
  return {
    id: "", name: "", domain: null, industry: null, size: null, website: null,
    linkedin: null, notes: null, tags: [], contacts: [], activities: [],
    _count: { deals: 0, projects: 0, tickets: 0 },
  };
}

function formFromCompany(data: PanelCompany) {
  return {
    name: data.name ?? "",
    domain: data.domain ?? "",
    industry: data.industry ?? "",
    size: data.size ?? "",
    website: data.website ?? "",
    linkedin: data.linkedin ?? "",
    notes: data.notes ?? "",
    tags: (data.tags ?? []).join(", "),
  };
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

export function CompanyPanel({ companyId, onClose, onSaved, onDeleted }: CompanyPanelProps) {
  const [company, setCompany] = useState<PanelCompany | null>(null);
  const [loadState, setLoadState] = useState<{ id: string; state: "ready" | "error" } | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [form, setForm] = useState(formFromCompany(emptyCompany()));
  const [baseline, setBaseline] = useState(form);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const loadFailed = loadState?.id === companyId && loadState.state === "error";
  const loading = Boolean(companyId) && !loadFailed && (!company || company.id !== companyId);

  useEffect(() => {
    if (!companyId) return;
    let active = true;
    const empty = formFromCompany(emptyCompany());
    (async () => {
      setCompany(null);
      setLoadState(null);
      setForm(empty);
      setBaseline(empty);
      try {
        const res = await fetch(`/admin/api/crm/companies/${companyId}`);
        if (!res.ok) throw new Error("failed");
        const data: PanelCompany = await res.json();
        if (!active) return;
        setCompany(data);
        setActivities(data.activities ?? []);
        const next = formFromCompany(data);
        setForm(next);
        setBaseline(next);
        setError("");
        setLoadState({ id: companyId, state: "ready" });
      } catch {
        if (!active) return;
        setLoadState({ id: companyId, state: "error" });
      }
    })();
    return () => {
      active = false;
    };
  }, [companyId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!companyId || !form.name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        domain: form.domain.trim() || null,
        industry: form.industry.trim() || null,
        size: form.size || null,
        website: form.website.trim() || null,
        linkedin: form.linkedin.trim() || null,
        notes: form.notes.trim() || null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const res = await fetch(`/admin/api/crm/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      const updated = await res.json();
      setCompany((prev) => (prev ? { ...prev, ...updated } : prev));
      const next = formFromCompany({ ...company!, ...updated });
      setForm(next);
      setBaseline(next);
      onSaved({ ...company!, ...updated });
    } catch {
      setError("Could not save changes — the domain may already belong to another company.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!companyId) return;
    if (!confirm("Delete this company? Contacts, deals and projects linked to it may break.")) return;
    try {
      const res = await fetch(`/admin/api/crm/companies/${companyId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      onDeleted(companyId);
      onClose();
    } catch {
      setError("Could not delete this company — it still has records attached.");
    }
  }

  return (
    <AnimatePresence>
      {companyId && (
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
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col border-l border-gray-200 bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            role="dialog"
            aria-label="Company details"
          >
            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                    style={{ backgroundColor: "#FF5500" }}
                  >
                    {(form.name.slice(0, 2) || "??").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-gray-900">
                      {loading ? "Loading…" : loadFailed ? "Company not found" : form.name}
                    </h2>
                    <p className="truncate text-sm text-gray-500">
                      {form.industry || "No industry set"}
                      {form.size ? ` · ${form.size} employees` : ""}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  title="Close"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {company && !loading && (
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Contacts", value: company.contacts.length },
                    { label: "Deals", value: company._count.deals },
                    { label: "Projects", value: company._count.projects },
                    { label: "Tickets", value: company._count.tickets },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-gray-50 py-2">
                      <div className="text-sm font-bold text-gray-800">{s.value}</div>
                      <div className="text-[10px] uppercase tracking-wide text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading && (
                <div className="flex justify-center py-16">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-[#FF5500] rounded-full animate-spin" />
                </div>
              )}

              {loadFailed && (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-500">Could not load this company.</p>
                </div>
              )}

              {company && !loading && (
                <>
                  <form id="company-details-form" onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Name *" className="col-span-2">
                        <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      </Field>
                      <Field label="Domain">
                        <input className={inputCls} placeholder="example.com" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
                      </Field>
                      <Field label="Industry">
                        <input className={inputCls} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                      </Field>
                      <Field label="Size">
                        <select className={inputCls} value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
                          <option value="">Select size</option>
                          <option value="1-10">1-10</option>
                          <option value="10-50">10-50</option>
                          <option value="50-100">50-100</option>
                          <option value="100-200">100-200</option>
                          <option value="200+">200+</option>
                          <option value="500+">500+</option>
                        </select>
                      </Field>
                      <Field label="Website">
                        <input className={inputCls} placeholder="https://" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                      </Field>
                      <Field label="LinkedIn" className="col-span-2">
                        <input className={inputCls} placeholder="https://linkedin.com/company/…" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
                      </Field>
                      <Field label="Tags" className="col-span-2">
                        <input className={inputCls} placeholder="comma, separated, tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                      </Field>
                      <Field label="Notes" className="col-span-2">
                        <textarea rows={3} className={`${inputCls} resize-none`} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                      </Field>
                    </div>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                  </form>

                  {company.contacts.length > 0 && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Contacts ({company.contacts.length})
                      </h3>
                      <ul className="space-y-1.5">
                        {company.contacts.map((c) => (
                          <li key={c.id} className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-3 py-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-800">
                                {c.firstName} {c.lastName}
                                {c.title ? <span className="font-normal text-gray-500"> · {c.title}</span> : null}
                              </p>
                              <p className="truncate text-xs text-gray-500">{c.email}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Activity</h3>
                    <ActivityFeed
                      activities={activities}
                      parent={{ companyId: company.id }}
                      onCreated={(a) => setActivities((prev) => [a, ...prev])}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 bg-white px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  Delete company
                </button>
                <div className="flex items-center gap-2">
                  {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
                  <button
                    type="button"
                    onClick={() => {
                      const formEl = document.getElementById("company-details-form");
                      if (formEl instanceof HTMLFormElement) formEl.requestSubmit();
                    }}
                    disabled={saving || !dirty || loading || loadFailed}
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
