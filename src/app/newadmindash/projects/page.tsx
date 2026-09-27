"use client";

import { motion } from "motion/react";
import { DashShell } from "../client";
import { PROJECTS } from "../static-data";

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#E8F5E9", text: "#4CAF50" },
  kickoff: { bg: "#FFF3E0", text: "#FF9800" },
  paused: { bg: "#F3E5F5", text: "#9C27B0" },
  done: { bg: "#E0E0E0", text: "#616161" },
  archived: { bg: "#F5F5F5", text: "#9E9E9E" },
};

export default function ProjectsPage() {
  return (
    <DashShell>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors" style={{ backgroundColor: "#FF5500" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            New Project
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PROJECTS.map((p) => {
                  const sc = statusColors[p.status] || statusColors.active;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{p.company}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium text-white" style={{ backgroundColor: "#FF5500" }}>
                            {p.assignee.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-xs text-gray-600">{p.assignee}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(p.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(p.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">${p.budget.toLocaleString()}</td>
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
