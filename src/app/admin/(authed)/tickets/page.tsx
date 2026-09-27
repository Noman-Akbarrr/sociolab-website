"use client";

import { motion } from "motion/react";
import { DashShell } from "../client";
import { TICKETS } from "../static-data";

const statusColors: Record<string, { bg: string; text: string }> = {
  open: { bg: "#FFEBEE", text: "#F44336" },
  "in-progress": { bg: "#E3F2FD", text: "#2196F3" },
  "waiting-client": { bg: "#FFF3E0", text: "#FF9800" },
  resolved: { bg: "#E8F5E9", text: "#4CAF50" },
  closed: { bg: "#F5F5F5", text: "#9E9E9E" },
};

const priorityDots: Record<string, string> = {
  high: "#F44336",
  medium: "#FF9800",
  low: "#4CAF50",
};

export default function TicketsPage() {
  return (
    <DashShell>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Tickets</h2>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors" style={{ backgroundColor: "#FF5500" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            New Ticket
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TICKETS.map((t) => {
                  const sc = statusColors[t.status] || statusColors.open;
                  return (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm font-mono font-medium" style={{ color: "#FF5500" }}>{t.number}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{t.subject}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {t.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityDots[t.priority] }} />
                          <span className="text-xs text-gray-600 capitalize">{t.priority}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium text-white" style={{ backgroundColor: "#FF5500" }}>
                            {t.assignee.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-xs text-gray-600">{t.assignee}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.company}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
