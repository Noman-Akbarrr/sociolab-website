"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";

interface Company {
  id: string;
  name: string;
  domain: string | null;
  industry: string | null;
  size: string | null;
  website: string | null;
  createdAt: string;
  _count: {
    contacts: number;
    deals: number;
    projects: number;
    tickets: number;
  };
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    domain: "",
    industry: "",
    size: "",
    website: "",
  });

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch("/admin/api/crm/companies");
      if (res.ok) setCompanies(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleCreate = async () => {
    if (!form.name) return;
    await fetch("/admin/api/crm/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        domain: form.domain || null,
        industry: form.industry || null,
        size: form.size || null,
        website: form.website || null,
      }),
    });
    setShowModal(false);
    setForm({ name: "", domain: "", industry: "", size: "", website: "" });
    fetchCompanies();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this company?")) return;
    await fetch(`/admin/api/crm/companies/${id}`, { method: "DELETE" });
    fetchCompanies();
  };

  const filtered = companies.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.industry ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Companies</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
          style={{ backgroundColor: "#FF5500" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Company
        </button>
      </div>

      <input
        type="text"
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white w-full sm:w-64 mb-4 focus:outline-none focus:border-[#FF5500] transition-colors"
      />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Industry</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacts</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Website</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: "#FF5500" }}>
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-800 block">{c.name}</span>
                        {c.domain && <span className="text-[11px] text-gray-400">{c.domain}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.industry ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{c.size ?? "—"}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{c._count.contacts}</td>
                  <td className="px-4 py-3">
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: "#FF5500" }}>
                        {c.domain ?? c.website}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-gray-400">{loading ? "Loading..." : "No companies found"}</p>}
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Add Company</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Domain</label>
                <input type="text" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="example.com"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
                <input type="text" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]">
                  <option value="">Select size</option>
                  <option value="1-10">1-10</option>
                  <option value="10-50">10-50</option>
                  <option value="50-100">50-100</option>
                  <option value="100-200">100-200</option>
                  <option value="200+">200+</option>
                  <option value="500+">500+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                <input type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://"
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={!form.name}
                className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#FF5500" }}>
                Add Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
