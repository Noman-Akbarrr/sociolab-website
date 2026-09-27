"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { DashShell } from "../client";

interface Owner {
  id: string;
  name: string;
  email: string;
}

interface Deal {
  id: string;
  title: string;
  value: number;
  priority: string;
  source: string | null;
  notes: string | null;
  expectedClose: string | null;
  createdAt: string;
  company: { id: string; name: string } | null;
  stage: { id: string; name: string; color: string | null } | null;
  owner: Owner | null;
}

interface Company {
  id: string;
  name: string;
}

interface Pipeline {
  id: string;
  name: string;
}

interface PipelineStage {
  id: string;
  name: string;
  color: string | null;
}

const stageColors: Record<string, string> = {
  Lead: "#9CA3AF",
  Qualified: "#5B8DEF",
  Proposal: "#FF9800",
  Negotiation: "#9C27B0",
  "Closed Won": "#4CAF50",
  Lost: "#F44336",
};

const priorityColors: Record<string, string> = {
  high: "#F44336",
  medium: "#FF9800",
  low: "#4CAF50",
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [form, setForm] = useState({
    title: "",
    companyId: "",
    pipelineId: "",
    stageId: "",
    value: "",
    priority: "medium",
    source: "",
    expectedClose: "",
    notes: "",
  });

  const fetchDeals = useCallback(async () => {
    try {
      const res = await fetch("/admin/api/crm/deals");
      if (res.ok) setDeals(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
    fetch("/admin/api/crm/companies").then((r) => r.ok && r.json()).then(setCompanies);
    fetch("/admin/api/crm/pipelines").then((r) => r.ok && r.json()).then(setPipelines);
  }, [fetchDeals]);

  useEffect(() => {
    if (!form.pipelineId) { setStages([]); return; }
    fetch(`/admin/api/crm/pipelines/${form.pipelineId}/stages`)
      .then((r) => r.ok && r.json())
      .then((s) => { setStages(s); setForm((f) => ({ ...f, stageId: "" })); });
  }, [form.pipelineId]);

  const handleCreate = async () => {
    if (!form.title || !form.companyId || !form.pipelineId || !form.stageId) return;
    await fetch("/admin/api/crm/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        companyId: form.companyId,
        pipelineId: form.pipelineId,
        stageId: form.stageId,
        value: form.value ? Number(form.value) : 0,
        priority: form.priority,
        source: form.source || null,
        expectedClose: form.expectedClose || null,
        notes: form.notes || null,
      }),
    });
    setShowModal(false);
    setForm({ title: "", companyId: "", pipelineId: "", stageId: "", value: "", priority: "medium", source: "", expectedClose: "", notes: "" });
    fetchDeals();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this deal?")) return;
    await fetch(`/admin/api/crm/deals/${id}`, { method: "DELETE" });
    fetchDeals();
  };

  const allStages = ["all", ...new Set(deals.map((d) => d.stage?.name).filter(Boolean))] as string[];

  const filtered = deals.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = !search || d.title.toLowerCase().includes(q) || (d.company?.name ?? "").toLowerCase().includes(q);
    const matchStage = stageFilter === "all" || d.stage?.name === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <DashShell>
    <div>
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
          style={{ backgroundColor: "#FF5500" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Deal
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search deals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white w-full sm:w-64 focus:outline-none focus:border-[#FF5500] transition-colors"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-gray-200 bg-white focus:outline-none focus:border-[#FF5500] transition-colors"
        >
          {allStages.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All Stages" : s}</option>
          ))}
        </select>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deal</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-800">{deal.title}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{deal.company?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">Rs. {(deal.value ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: (stageColors[deal.stage?.name ?? ""] || "#9CA3AF") + "20",
                        color: stageColors[deal.stage?.name ?? ""] || "#9CA3AF",
                      }}
                    >
                      {deal.stage?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColors[deal.priority] || "#9CA3AF" }} />
                      <span className="text-xs text-gray-600 capitalize">{deal.priority}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium text-white" style={{ backgroundColor: "#FF5500" }}>
                        {(deal.owner?.name ?? "?").split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-xs text-gray-600">{deal.owner?.name ?? "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(deal.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(deal.id)} className="text-gray-400 hover:text-red-500 transition-colors">
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
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-gray-400">{loading ? "Loading..." : "No deals found"}</p>
        )}
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-800">Create Deal</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company *</label>
                <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]">
                  <option value="">Select company</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pipeline *</label>
                  <select value={form.pipelineId} onChange={(e) => setForm({ ...form, pipelineId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]">
                    <option value="">Select pipeline</option>
                    {pipelines.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Stage *</label>
                  <select value={form.stageId} onChange={(e) => setForm({ ...form, stageId: e.target.value })}
                    disabled={!form.pipelineId}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500] disabled:bg-gray-50">
                    <option value="">{form.pipelineId ? "Select stage" : "Select pipeline first"}</option>
                    {stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Value (PKR)</label>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder="0" className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Source</label>
                  <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]">
                    <option value="">Select source</option>
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="cold-outreach">Cold Outreach</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Expected Close Date</label>
                  <input type="date" value={form.expectedClose} onChange={(e) => setForm({ ...form, expectedClose: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:border-[#FF5500] resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreate} disabled={!form.title || !form.companyId || !form.pipelineId || !form.stageId}
                className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#FF5500" }}>
                Create Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashShell>
  );
}
