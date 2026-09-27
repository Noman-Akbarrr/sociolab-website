"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { DashShell } from "../client";
import { CONTACTS } from "../static-data";

export default function ContactsPage() {
  const [search, setSearch] = useState("");

  const filtered = CONTACTS.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.firstName.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q);
  });

  return (
    <DashShell>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Contacts</h2>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors" style={{ backgroundColor: "#FF5500" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium text-white" style={{ backgroundColor: "#FF5500" }}>
                          {c.firstName[0]}{c.lastName[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{c.firstName} {c.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.company}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        c.status === "Active" ? "bg-green-50 text-green-700" :
                        c.status === "Inactive" ? "bg-gray-100 text-gray-600" :
                        "bg-orange-50 text-orange-700"
                      }`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="p-8 text-center text-sm text-gray-400">No contacts found</p>}
        </motion.div>
      </div>
    </DashShell>
  );
}
