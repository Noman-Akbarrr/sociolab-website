"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { DashShell } from "../client";
import { ContactPanel } from "./contact-panel";
import type { PanelContact } from "./contact-panel";

interface Company {
  id: string;
  name: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  title: string | null;
  role: string | null;
  source: string | null;
  status: string | null;
  createdAt: string;
  company: Company | null;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [openContactId, setOpenContactId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyId: "",
    title: "",
    role: "",
    source: "",
    status: "active",
  });

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch("/admin/api/crm/contacts");
      if (res.ok) setContacts(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
    fetch("/admin/api/crm/companies").then((r) => r.ok && r.json()).then(setCompanies);
  }, [fetchContacts]);

  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.email) return;
    await fetch("/admin/api/crm/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || null,
        companyId: form.companyId || null,
        title: form.title || null,
        role: form.role || null,
        source: form.source || null,
        status: form.status,
      }),
    });
    setShowModal(false);
    setForm({ firstName: "", lastName: "", email: "", phone: "", companyId: "", title: "", role: "", source: "", status: "active" });
    fetchContacts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    await fetch(`/admin/api/crm/contacts/${id}`, { method: "DELETE" });
    fetchContacts();
  };

  const handlePanelSaved = (updated: PanelContact) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === updated.id
          ? { ...c, ...updated, company: updated.company ?? c.company }
          : c
      )
    );
  };

  const handlePanelDeleted = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = contacts.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  return (
    <DashShell>
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
          style={{ backgroundColor: "#FF5500" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Contact
        </button>
      </div>

      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white w-full sm:w-64 mb-4 focus:outline-none focus:border-[#FF5500] transition-colors"
      />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setOpenContactId(c.id)}
                  title="Open contact"
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium text-white" style={{ backgroundColor: "#FF5500" }}>
                        {c.firstName[0]}{c.lastName[0]}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-800">{c.firstName} {c.lastName}</span>
                        {c.title && <span className="block text-[11px] text-gray-400">{c.title}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.company?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      c.status === "active" ? "bg-green-50 text-green-700" :
                      c.status === "unsubscribed" ? "bg-gray-100 text-gray-600" :
                      c.status === "bounced" ? "bg-orange-50 text-orange-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{c.status ?? "active"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenContactId(c.id);
                        }}
                        title="Edit contact"
                        className="p-1.5 rounded text-gray-400 hover:text-[#FF5500] hover:bg-orange-50 transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.863 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.683-12.68z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(c.id);
                        }}
                        title="Delete contact"
                        className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-gray-400">{loading ? "Loading..." : "No contacts found"}</p>}
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Add Contact</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                  <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                  <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]">
                  <option value="">Select company</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]">
                    <option value="">Select role</option>
                    <option value="decision-maker">Decision Maker</option>
                    <option value="champion">Champion</option>
                    <option value="influencer">Influencer</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Source</label>
                  <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]">
                    <option value="">Select source</option>
                    <option value="referral">Referral</option>
                    <option value="cold-outbound">Cold Outbound</option>
                    <option value="inbound">Inbound</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]">
                    <option value="active">Active</option>
                    <option value="unsubscribed">Unsubscribed</option>
                    <option value="bounced">Bounced</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={!form.firstName || !form.lastName || !form.email}
                className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#FF5500" }}>
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
      <ContactPanel
        contactId={openContactId}
        companies={companies}
        onClose={() => setOpenContactId(null)}
        onSaved={handlePanelSaved}
        onDeleted={handlePanelDeleted}
      />
    </div>
    </DashShell>
  );
}
