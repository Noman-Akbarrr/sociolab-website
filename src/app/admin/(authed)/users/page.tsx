"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashShell } from "../client";
import { SECTION_KEYS, SECTION_LABELS, isFullAccess, type SectionKey } from "@/lib/access";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  access: string[];
  createdAt: string;
};

const inputCls =
  "w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors text-gray-800";

function SectionCheckboxes({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {SECTION_KEYS.map((key) => {
        const checked = value.includes(key);
        return (
          <label
            key={key}
            className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm cursor-pointer transition-colors ${
              checked
                ? "border-[#FF5500] bg-orange-50 text-gray-800"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() =>
                onChange(
                  checked
                    ? value.filter((k) => k !== key)
                    : [...value, key]
                )
              }
              className="accent-[#FF5500]"
            />
            {SECTION_LABELS[key as SectionKey]}
          </label>
        );
      })}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetUserName, setResetUserName] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    access: [...SECTION_KEYS] as string[],
  });

  const [editAccessUser, setEditAccessUser] = useState<User | null>(null);
  const [editAccess, setEditAccess] = useState<string[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/admin/api/crm/users");
      if (res.ok) setUsers(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const validatePassword = (pw: string): string | null => {
    if (pw.length < 10) return "Must be at least 10 characters";
    if (!/[A-Z]/.test(pw)) return "Must contain an uppercase letter";
    if (!/[a-z]/.test(pw)) return "Must contain a lowercase letter";
    if (!/[0-9]/.test(pw)) return "Must contain a number";
    return null;
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) return;
    const pwErr = validatePassword(form.password);
    if (pwErr) {
      setPasswordError(pwErr);
      return;
    }
    setPasswordError("");
    setSaving(true);
    try {
      const res = await fetch("/admin/api/crm/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          access: form.access,
        }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setForm({ name: "", email: "", password: "", access: [...SECTION_KEYS] });
        fetchUsers();
      } else {
        const data = await res.json();
        setPasswordError(data.error || "Failed to create user");
      }
    } finally {
      setSaving(false);
    }
  };

  const openResetModal = (user: User) => {
    setResetUserId(user.id);
    setResetUserName(user.name);
    setNewPassword("");
    setPasswordError("");
    setShowResetModal(true);
  };

  const handleResetPassword = async () => {
    if (!resetUserId || !newPassword) return;
    const pwErr = validatePassword(newPassword);
    if (pwErr) {
      setPasswordError(pwErr);
      return;
    }
    setPasswordError("");
    setSaving(true);
    try {
      const res = await fetch(`/admin/api/crm/users/${resetUserId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      if (res.ok) {
        setShowResetModal(false);
      } else {
        const data = await res.json();
        setPasswordError(data.error || "Failed to reset password");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`/admin/api/crm/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const openAccessModal = (user: User) => {
    setEditAccessUser(user);
    setEditAccess(user.access ?? []);
  };

  const handleSaveAccess = async () => {
    if (!editAccessUser) return;
    setSaving(true);
    try {
      const res = await fetch(`/admin/api/crm/users/${editAccessUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access: editAccess }),
      });
      if (res.ok) {
        setEditAccessUser(null);
        fetchUsers();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashShell>
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 mb-6">
        <button
          onClick={() => {
            setForm({ name: "", email: "", password: "", access: [...SECTION_KEYS] });
            setPasswordError("");
            setShowCreateModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
          style={{ backgroundColor: "#FF5500" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add User
        </button>
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
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Access</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No users yet</td>
                </tr>
              ) : (
                users.map((u) => {
                  const full = isFullAccess(u);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium text-white"
                            style={{ backgroundColor: "#FF5500" }}
                          >
                            {u.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        {full ? (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-[#FF5500]">
                            Full access
                          </span>
                        ) : (u.access ?? []).length === 0 ? (
                          <span className="text-[10px] text-gray-400">No sections</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {u.access.map((key) => (
                              <span
                                key={key}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                              >
                                {SECTION_LABELS[key as SectionKey] ?? key}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!full && (
                            <button
                              onClick={() => openAccessModal(u)}
                              className="text-gray-400 hover:text-[#FF5500] transition-colors p-1"
                              title="Edit Access"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => openResetModal(u)}
                            className="text-gray-400 hover:text-[#FF5500] transition-colors p-1"
                            title="Reset Password"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
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
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white rounded-lg border border-gray-200 shadow-xl w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Add User</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Password *</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={inputCls}
                    placeholder="Min 10 chars, upper + lower + number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Access — sections this user can see
                  </label>
                  <SectionCheckboxes
                    value={form.access}
                    onChange={(access) => setForm({ ...form, access })}
                  />
                </div>
                {passwordError && (
                  <p className="text-xs text-red-500">{passwordError}</p>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={saving || !form.name || !form.email || !form.password}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  {saving ? "Creating..." : "Add User"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowResetModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white rounded-lg border border-gray-200 shadow-xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Reset Password</h3>
              <p className="text-xs text-gray-500 mb-4">for {resetUserName}</p>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputCls}
                  placeholder="Min 10 chars, upper + lower + number"
                />
              </div>
              {passwordError && (
                <p className="text-xs text-red-500 mt-2">{passwordError}</p>
              )}
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={saving || !newPassword}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  {saving ? "Saving..." : "Reset Password"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {editAccessUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setEditAccessUser(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white rounded-lg border border-gray-200 shadow-xl w-full max-w-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-1">Edit Access</h3>
              <p className="text-xs text-gray-500 mb-4">
                Sections {editAccessUser.name} can open. Projects still require an assignment.
              </p>
              <SectionCheckboxes value={editAccess} onChange={setEditAccess} />
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={() => setEditAccessUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAccess}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  {saving ? "Saving..." : "Save Access"}
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
