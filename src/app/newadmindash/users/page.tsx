"use client";

import { motion } from "motion/react";
import { DashShell } from "../client";
import { USERS } from "../static-data";

const roleColors: Record<string, { bg: string; text: string }> = {
  super_admin: { bg: "#FFEBEE", text: "#F44336" },
  admin: { bg: "#E3F2FD", text: "#2196F3" },
  sales_executive: { bg: "#FFF3E0", text: "#FF9800" },
  salesperson: { bg: "#E8F5E9", text: "#4CAF50" },
  freelancer: { bg: "#F3E5F5", text: "#9C27B0" },
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  sales_executive: "Sales Executive",
  salesperson: "Salesperson",
  freelancer: "Freelancer",
};

export default function UsersPage() {
  return (
    <DashShell>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Users</h2>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors" style={{ backgroundColor: "#FF5500" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Add User
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {USERS.map((u) => {
                  const rc = roleColors[u.role] || roleColors.salesperson;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium text-white" style={{ backgroundColor: "#FF5500" }}>
                            {u.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-sm font-medium text-gray-800">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: rc.bg, color: rc.text }}>
                          {roleLabels[u.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">{u.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(u.lastLogin).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashShell>
  );
}
