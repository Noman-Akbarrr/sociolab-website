"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { DashShell } from "../client";
import { useAdminSession } from "@/lib/use-admin-session";

type Company = { id: string; name: string };
type User = { id: string; name: string; email: string };
type Project = {
  id: string;
  name: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  currency: string | null;
  description: string | null;
  company: { id: string; name: string } | null;
  assignee: { id: string; name: string; email: string } | null;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#E8F5E9", text: "#4CAF50" },
  kickoff: { bg: "#FFF3E0", text: "#FF9800" },
  paused: { bg: "#F3E5F5", text: "#9C27B0" },
  done: { bg: "#E0E0E0", text: "#616161" },
  archived: { bg: "#F5F5F5", text: "#9E9E9E" },
};

const inputCls =
  "w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors text-gray-800";

export default function ProjectsPage() {
  const router = useRouter();
  const { isFull } = useAdminSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [saving, setSaving] = useState(false);

  const [assignProject, setAssignProject] = useState<Project | null>(null);
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [savingMembers, setSavingMembers] = useState(false);

  const [form, setForm] = useState({
    name: "",
    companyId: "",
    assigneeId: "",
    status: "kickoff",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  });

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/admin/api/crm/projects");
      if (res.ok) setProjects(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openModal = async () => {
    setForm({
      name: "",
      companyId: "",
      assigneeId: "",
      status: "kickoff",
      startDate: "",
      endDate: "",
      budget: "",
      description: "",
    });
    setShowModal(true);
    const [coRes, uRes] = await Promise.all([
      fetch("/admin/api/crm/companies"),
      fetch("/admin/api/crm/users"),
    ]);
    if (coRes.ok) setCompanies(await coRes.json());
    if (uRes.ok) setUsers(await uRes.json());
  };

  const handleCreate = async () => {
    if (!form.name || !form.companyId) return;
    setSaving(true);
    try {
      const res = await fetch("/admin/api/crm/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          companyId: form.companyId,
          assigneeId: form.assigneeId || null,
          status: form.status,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          budget: form.budget ? Number(form.budget) : null,
          description: form.description || null,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        fetchProjects();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/admin/api/crm/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  const openAssignModal = async (p: Project) => {
    setAssignProject(p);
    setMemberIds([]);
    setMembersLoading(true);
    try {
      const [uRes, mRes] = await Promise.all([
        fetch("/admin/api/crm/users"),
        fetch(`/admin/api/crm/projects/${p.id}/members`),
      ]);
      if (uRes.ok) setUsers(await uRes.json());
      if (mRes.ok) {
        const members: User[] = await mRes.json();
        setMemberIds(members.map((m) => m.id));
      }
    } finally {
      setMembersLoading(false);
    }
  };

  const handleSaveMembers = async () => {
    if (!assignProject) return;
    setSavingMembers(true);
    try {
      const res = await fetch(`/admin/api/crm/projects/${assignProject.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: memberIds }),
      });
      if (res.ok) setAssignProject(null);
    } finally {
      setSavingMembers(false);
    }
  };

  return (
    <DashShell>
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 mb-6">
        {isFull && (
        <button
          onClick={openModal}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
          style={{ backgroundColor: "#FF5500" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Project
        </button>
        )}
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
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Timeline</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">Loading...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No projects yet</td>
                </tr>
              ) : (
                projects.map((p) => {
                  const sc = statusColors[p.status] || statusColors.active;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => router.push(`/admin/projects/${p.id}`)}
                      title="Open project"
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.company?.name || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.assignee ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium text-white"
                              style={{ backgroundColor: "#FF5500" }}
                            >
                              {p.assignee.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="text-xs text-gray-600">{p.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {p.startDate
                          ? new Date(p.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          : "—"}{" "}
                        –{" "}
                        {p.endDate
                          ? new Date(p.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {p.budget != null ? `Rs. ${p.budget.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {isFull && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openAssignModal(p);
                            }}
                            className="text-gray-400 hover:text-[#FF5500] transition-colors"
                            title="Assign team"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a7 7 0 0114 0" />
                            </svg>
                          </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/projects/${p.id}`);
                            }}
                            className="text-gray-400 hover:text-[#FF5500] transition-colors"
                            title="Open project"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.863 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.683-12.68z"
                              />
                            </svg>
                          </button>
                          {isFull && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(p.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                          </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white rounded-lg border border-gray-200 shadow-xl w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-4">New Project</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="Project name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Company *</label>
                    <select
                      value={form.companyId}
                      onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                      className={inputCls}
                    >
                      <option value="">Select company</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Assignee</label>
                    <select
                      value={form.assigneeId}
                      onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                      className={inputCls}
                    >
                      <option value="">Select assignee</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={inputCls}
                  >
                    <option value="kickoff">Kickoff</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="done">Done</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Budget (PKR)</label>
                  <input
                    type="number"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className={inputCls}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className={inputCls}
                    rows={3}
                    placeholder="Project description"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving || !form.name || !form.companyId}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  {saving ? "Creating..." : "Create Project"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {assignProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setAssignProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white rounded-lg border border-gray-200 shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Assign Team</h3>
              <p className="text-xs text-gray-500 mb-4">
                {assignProject.name} — tick the people who should work on this project.
                Only they can see it (and receive its tasks).
              </p>
              <div className="space-y-1 max-h-72 overflow-y-auto">
                {membersLoading ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>
                ) : users.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">No users yet</p>
                ) : (
                  users.map((u) => {
                    const checked = memberIds.includes(u.id);
                    return (
                      <label
                        key={u.id}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md border text-sm cursor-pointer transition-colors ${
                          checked
                            ? "border-[#FF5500] bg-orange-50"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setMemberIds((prev) =>
                              checked ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                            )
                          }
                          className="accent-[#FF5500]"
                        />
                        <span className="flex-1 text-gray-800">{u.name}</span>
                        <span className="text-xs text-gray-400">{u.email}</span>
                      </label>
                    );
                  })
                )}
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setAssignProject(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMembers}
                  disabled={savingMembers || membersLoading}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  {savingMembers ? "Saving..." : "Save Team"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </DashShell>
  );
}
