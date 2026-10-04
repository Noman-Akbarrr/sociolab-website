"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ActivityFeed, type ActivityItem } from "../components/activity-feed";
import { useAdminSession } from "@/lib/use-admin-session";

export interface PanelContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  title: string | null;
  role: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  tags: string[];
  companyId: string | null;
  company: { id: string; name: string } | null;
  activities: ActivityItem[];
}

interface CompanyOption {
  id: string;
  name: string;
}

interface ContactPanelProps {
  contactId: string | null;
  companies: CompanyOption[];
  onClose: () => void;
  onSaved: (contact: PanelContact) => void;
  onDeleted: (contactId: string) => void;
}

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]";

function formFromContact(data: PanelContact) {
  return {
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    title: data.title ?? "",
    companyId: data.companyId ?? "",
    role: data.role ?? "",
    source: data.source ?? "",
    status: data.status ?? "active",
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

export function ContactPanel({ contactId, companies, onClose, onSaved, onDeleted }: ContactPanelProps) {
  const { managesSales } = useAdminSession();
  // Salesmen can look at contacts on their deals but never edit them.
  const readOnly = !managesSales;
  const [contact, setContact] = useState<PanelContact | null>(null);
  const [loadState, setLoadState] = useState<{ id: string; state: "ready" | "error" } | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [form, setForm] = useState(formFromContact({
    id: "", firstName: "", lastName: "", email: "", phone: null, title: null, role: null,
    source: null, status: "active", notes: null, tags: [], companyId: null, company: null, activities: [],
  }));
  const [baseline, setBaseline] = useState(form);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline);
  const loadFailed = loadState?.id === contactId && loadState.state === "error";
  const loading = Boolean(contactId) && !loadFailed && (!contact || contact.id !== contactId);

  useEffect(() => {
    if (!contactId) return;
    let active = true;
    const empty = formFromContact({
      id: "", firstName: "", lastName: "", email: "", phone: null, title: null, role: null,
      source: null, status: "active", notes: null, tags: [], companyId: null, company: null, activities: [],
    });
    (async () => {
      setContact(null);
      setLoadState(null);
      setForm(empty);
      setBaseline(empty);
      try {
        const res = await fetch(`/admin/api/crm/contacts/${contactId}`);
        if (!res.ok) throw new Error("failed");
        const data: PanelContact = await res.json();
        if (!active) return;
        setContact(data);
        setActivities(data.activities ?? []);
        const next = formFromContact(data);
        setForm(next);
        setBaseline(next);
        setError("");
        setLoadState({ id: contactId, state: "ready" });
      } catch {
        if (!active) return;
        setLoadState({ id: contactId, state: "error" });
      }
    })();
    return () => {
      active = false;
    };
  }, [contactId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!contactId || !form.firstName.trim() || !form.email.trim()) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        title: form.title.trim() || null,
        companyId: form.companyId || null,
        role: form.role || null,
        source: form.source || null,
        status: form.status,
        notes: form.notes.trim() || null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      const res = await fetch(`/admin/api/crm/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      const updated: PanelContact = await res.json();
      setContact((prev) => (prev ? { ...prev, ...updated } : updated));
      const next = formFromContact({ ...contact!, ...updated });
      setForm(next);
      setBaseline(next);
      onSaved({ ...contact!, ...updated });
    } catch {
      setError("Could not save changes — the email may already be used by another contact.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!contactId) return;
    if (!confirm("Delete this contact? This cannot be undone.")) return;
    try {
      const res = await fetch(`/admin/api/crm/contacts/${contactId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      onDeleted(contactId);
      onClose();
    } catch {
      setError("Couldn't delete this contact.");
    }
  }

  return (
    <AnimatePresence>
      {contactId && (
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
            transition={{ type: "tween", duration: 0.25 }}
            role="dialog"
            aria-label="Contact details"
          >
            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: "#FF5500" }}
                  >
                    {`${form.firstName?.[0] ?? ""}${form.lastName?.[0] ?? ""}`.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-gray-900">
                      {loading ? "Loading…" : loadFailed ? "Contact not found" : `${form.firstName} ${form.lastName}`.trim()}
                    </h2>
                    <p className="truncate text-sm text-gray-500">
                      {contact?.company?.name ?? "No company"}
                      {form.title ? ` · ${form.title}` : ""}
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
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loading && (
                <div className="flex justify-center py-16">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-[#FF5500] rounded-full animate-spin" />
                </div>
              )}

              {loadFailed && (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-500">Could not load this contact.</p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 text-sm font-medium"
                    style={{ color: "#FF5500" }}
                  >
                    Close
                  </button>
                </div>
              )}

              {contact && !loading && (
                <>
                  <form id="contact-details-form" onSubmit={handleSave} className="space-y-4">
                    <fieldset disabled={readOnly} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="First name *">
                        <input className={inputCls} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                      </Field>
                      <Field label="Last name *">
                        <input className={inputCls} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                      </Field>
                      <Field label="Email *" className="col-span-2">
                        <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      </Field>
                      <Field label="Phone">
                        <input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      </Field>
                      <Field label="Job title">
                        <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                      </Field>
                      <Field label="Company">
                        <select className={inputCls} value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
                          {!form.companyId && <option value="">No company</option>}
                          {companies.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                          {form.companyId && contact.company && !companies.some((c) => c.id === form.companyId) && (
                            <option value={contact.company.id}>{contact.company.name}</option>
                          )}
                        </select>
                      </Field>
                      <Field label="Status">
                        <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                          <option value="active">Active</option>
                          <option value="unsubscribed">Unsubscribed</option>
                          <option value="bounced">Bounced</option>
                        </select>
                      </Field>
                      <Field label="Role">
                        <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                          <option value="">Select role</option>
                          <option value="decision-maker">Decision maker</option>
                          <option value="champion">Champion</option>
                          <option value="influencer">Influencer</option>
                        </select>
                      </Field>
                      <Field label="Source">
                        <select className={inputCls} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                          <option value="">Select source</option>
                          <option value="referral">Referral</option>
                          <option value="cold-outbound">Cold outbound</option>
                          <option value="inbound">Inbound</option>
                          <option value="event">Event</option>
                        </select>
                      </Field>
                      <Field label="Tags" className="col-span-2">
                        <input
                          className={inputCls}
                          placeholder="comma, separated, tags"
                          value={form.tags}
                          onChange={(e) => setForm({ ...form, tags: e.target.value })}
                        />
                      </Field>
                      <Field label="Notes" className="col-span-2">
                        <textarea rows={3} className={`${inputCls} resize-none`} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                      </Field>
                    </div>
                    </fieldset>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                  </form>

                  <div className="mt-7 border-t border-gray-100 pt-5">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Activity</h3>
                    <ActivityFeed
                      activities={activities}
                      parent={{ contactId: contact.id }}
                      onCreated={(a) => setActivities((prev) => [a, ...prev])}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 bg-white px-5 py-3">
              <div className="flex items-center justify-between gap-3">
                {readOnly ? (
                  <span className="text-xs text-gray-400">View only</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    Delete contact
                  </button>
                )}
                <div className="flex items-center gap-2">
                  {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        const formEl = document.getElementById("contact-details-form");
                        if (formEl instanceof HTMLFormElement) formEl.requestSubmit();
                      }}
                      disabled={saving || !dirty || loading || loadFailed}
                      className="rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
                      style={{ backgroundColor: "#FF5500" }}
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
