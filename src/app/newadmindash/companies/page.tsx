"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { DashShell } from "../client";
import { COMPANIES } from "../static-data";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");

  const filtered = COMPANIES.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
  });

  return (
    <DashShell>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Companies</h2>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors" style={{ backgroundColor: "#FF5500" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
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
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Deals</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacts</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Website</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: "#FF5500" }}>
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-800 block">{c.name}</span>
                          <span className="text-[11px] text-gray-400">{c.domain}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.industry}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.size}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.deals}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.contacts}</td>
                    <td className="px-4 py-3">
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: "#FF5500" }}>
                        {c.domain}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="p-8 text-center text-sm text-gray-400">No companies found</p>}
        </motion.div>
      </div>
    </DashShell>
  );
}
