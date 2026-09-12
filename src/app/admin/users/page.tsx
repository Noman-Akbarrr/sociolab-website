"use client";

import { useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isTwoFactorEnabled: boolean;
  createdAt: string;
};

const ROLES = [
  { value: "super_admin", label: "Super Admin", desc: "Full access to everything" },
  { value: "admin", label: "Admin", desc: "Manage users, pipelines, projects" },
  { value: "sales_executive", label: "Sales Executive", desc: "Manage pipelines and deals" },
  { value: "salesperson", label: "Salesperson", desc: "Manage own deals" },
  { value: "freelancer", label: "Freelancer", desc: "Work on assigned projects only" },
];

const roleBadge: Record<string, string> = {
  super_admin: "bg-purple-500/20 text-purple-400",
  admin: "bg-brand/20 text-brand",
  sales_executive: "bg-blue-500/20 text-blue-400",
  salesperson: "bg-green-500/20 text-green-400",
  freelancer: "bg-yellow-500/20 text-yellow-400",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "salesperson" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/admin/api/auth/users");
    if (res.ok) {
      setUsers(await res.json());
    }
    setLoading(false);
  }

  function openAddModal() {
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "salesperson" });
    setError("");
    setShowModal(true);
  }

  function openEditModal(user: User) {
    setEditing(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setError("");
    setShowModal(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/admin/api/auth/users/${editing.id}` : "/admin/api/auth/users";

    const body: Record<string, string> = { name: form.name, email: form.email, role: form.role };
    if (form.password) body.password = form.password;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed");
      return;
    }

    setShowModal(false);
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "salesperson" });
    fetchUsers();
  }

  async function onDelete(id: string, name: string) {
    if (!confirm(`Remove ${name}?`)) return;
    await fetch(`/admin/api/auth/users/${id}`, { method: "DELETE" });
    fetchUsers();
  }

  function getRoleLabel(role: string) {
    return ROLES.find((r) => r.value === role)?.label || role;
  }

  return (
    <div className="px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white">Users</h1>
          <p className="mt-1 text-sm text-white/50">Manage team members and their roles.</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
        >
          + Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="mt-8">
        {loading ? (
          <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-12 text-center">
            <p className="text-sm text-white/50">Loading...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-12 text-center">
            <p className="text-sm text-white/50">No users found.</p>
          </div>
        ) : (
          <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#1E293B] bg-[#090D16]">
                  <th className="px-4 py-3 font-medium text-white/60">User</th>
                  <th className="px-4 py-3 font-medium text-white/60">Role</th>
                  <th className="px-4 py-3 font-medium text-white/60">Status</th>
                  <th className="px-4 py-3 font-medium text-white/60">Joined</th>
                  <th className="px-4 py-3 font-medium text-white/60 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#1E293B] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E293B] text-sm font-bold text-white/60">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-xs text-white/40">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${roleBadge[user.role] || "bg-white/10 text-white/60"}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs text-green-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-white/40 hover:text-brand text-xs mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(user.id, user.name)}
                        className="text-white/40 hover:text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-[3px] bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-white">
                {editing ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded p-1 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-[3px] border border-red-500/30 bg-red-500/10 p-3">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5">Full Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5">Email Address *</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  type="email"
                  required
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5">
                  {editing ? "New Password (leave blank to keep current)" : "Password *"}
                </label>
                <input
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editing ? "Leave blank to keep current" : "Minimum 10 characters"}
                  type="password"
                  required={!editing}
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5">Role *</label>
                <div className="grid grid-cols-1 gap-2">
                  {ROLES.map((r) => (
                    <label
                      key={r.value}
                      className={`flex items-center gap-3 rounded-[3px] border px-3 py-2.5 cursor-pointer transition-colors ${
                        form.role === r.value
                          ? "border-brand bg-brand/10"
                          : "border-[#1E293B] bg-[#090D16] hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={form.role === r.value}
                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        form.role === r.value ? "border-brand" : "border-white/30"
                      }`}>
                        {form.role === r.value && (
                          <div className="h-2 w-2 rounded-full bg-brand" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{r.label}</div>
                        <div className="text-xs text-white/40">{r.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-[3px] border border-[#1E293B] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:border-brand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                >
                  {saving ? "Saving..." : editing ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
