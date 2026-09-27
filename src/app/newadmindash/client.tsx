"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardStats {
  leads: number;
  contacts: number;
  accounts: number;
  opportunities: number;
  tasks: number;
  recentLeads: any[];
  recentOpportunities: any[];
}

// EspoCRM icon components (SVG matching their style)
function EspoIcon({ name, className = "" }: { name: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    lead: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    contact: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    account: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    opportunity: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    task: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    menu: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    ),
    search: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    bell: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    arrow: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    ),
    plus: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  };
  return icons[name] || null;
}

const tabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "leads", label: "Leads" },
  { key: "opportunities", label: "Opportunities" },
] as const;

export function NewDashClient({ stats, error }: { stats: DashboardStats | null; error: string | null }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads" | "opportunities">("dashboard");

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F6FA" }}>
        <div className="max-w-md w-full mx-auto p-8 rounded-lg bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Connection Error</h1>
          </div>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Set these environment variables:</p>
            <code className="block mt-2 p-3 rounded bg-gray-50 text-gray-700 font-mono text-xs">
              ESPOCRM_URL=https://your-crm.com<br />
              ESPOCRM_API_KEY=your_key
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F6FA" }}>
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { label: "Leads", value: stats.leads, icon: "lead", color: "#5B8DEF", bg: "#EBF2FC" },
    { label: "Contacts", value: stats.contacts, icon: "contact", color: "#5B8DEF", bg: "#EBF2FC" },
    { label: "Accounts", value: stats.accounts, icon: "account", color: "#5B8DEF", bg: "#EBF2FC" },
    { label: "Opportunities", value: stats.opportunities, icon: "opportunity", color: "#4CAF50", bg: "#E8F5E9" },
    { label: "Tasks", value: stats.tasks, icon: "task", color: "#FF9800", bg: "#FFF3E0" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F6FA" }}>
      {/* ── Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-200 flex flex-col z-40">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: "#5B8DEF" }}>
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">EspoCRM</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-50 text-[#5B8DEF] font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <EspoIcon name={tab.key === "dashboard" ? "account" : tab.key === "leads" ? "lead" : "opportunity"} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
              NA
            </div>
            <div className="text-xs">
              <div className="font-medium text-gray-700">Admin</div>
              <div className="text-gray-400">Sociolab</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="ml-60">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-gray-700">
              {tabs.find((t) => t.key === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <EspoIcon name="search" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 text-sm rounded border border-gray-200 bg-gray-50 w-64 focus:outline-none focus:border-[#5B8DEF] focus:bg-white transition-colors"
              />
            </div>
            <button className="relative p-2 rounded hover:bg-gray-50 transition-colors">
              <EspoIcon name="bell" className="w-4 h-4 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                  {statCards.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                          <EspoIcon name={stat.icon} className="w-4.5 h-4.5" />
                        </div>
                        <EspoIcon name="arrow" className="w-3.5 h-3.5 text-gray-300" />
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Two columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Recent Leads */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-700">Recent Leads</h3>
                      <button onClick={() => setActiveTab("leads")} className="text-xs text-[#5B8DEF] hover:underline">
                        View all
                      </button>
                    </div>
                    {stats.recentLeads.length === 0 ? (
                      <p className="p-8 text-center text-sm text-gray-400">No leads yet</p>
                    ) : (
                      <ul className="divide-y divide-gray-50">
                        {stats.recentLeads.map((lead: any) => (
                          <li key={lead.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-[#5B8DEF]">
                                  {(lead.name || lead.firstName || "?")[0]?.toUpperCase()}
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-gray-700 block">
                                    {lead.name || `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "Unnamed"}
                                  </span>
                                  {lead.emailAddress && (
                                    <span className="text-xs text-gray-400">{lead.emailAddress}</span>
                                  )}
                                </div>
                              </div>
                              {lead.status && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                  {lead.status}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Recent Opportunities */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-700">Recent Opportunities</h3>
                      <button onClick={() => setActiveTab("opportunities")} className="text-xs text-[#5B8DEF] hover:underline">
                        View all
                      </button>
                    </div>
                    {stats.recentOpportunities.length === 0 ? (
                      <p className="p-8 text-center text-sm text-gray-400">No opportunities yet</p>
                    ) : (
                      <ul className="divide-y divide-gray-50">
                        {stats.recentOpportunities.map((opp: any) => (
                          <li key={opp.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-medium text-gray-700">{opp.name || "Untitled"}</span>
                                {opp.amount && (
                                  <span className="block text-xs text-gray-400 mt-0.5">
                                    {opp.currency || "USD"} {opp.amount.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {opp.stage && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                                  {opp.stage}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "leads" && (
              <motion.div
                key="leads"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Leads</h2>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded bg-[#5B8DEF] hover:bg-[#4A7CD8] transition-colors">
                    <EspoIcon name="plus" className="w-3.5 h-3.5" />
                    Create
                  </button>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats.recentLeads.length === 0 ? (
                        <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-400">No leads found</td></tr>
                      ) : (
                        stats.recentLeads.map((lead: any) => (
                          <tr key={lead.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-medium text-[#5B8DEF]">
                                  {(lead.name || lead.firstName || "?")[0]?.toUpperCase()}
                                </div>
                                <span className="text-sm text-gray-700">{lead.name || `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "—"}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">{lead.emailAddress || "—"}</td>
                            <td className="px-4 py-3">
                              {lead.status && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{lead.status}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "opportunities" && (
              <motion.div
                key="opportunities"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Opportunities</h2>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded bg-[#5B8DEF] hover:bg-[#4A7CD8] transition-colors">
                    <EspoIcon name="plus" className="w-3.5 h-3.5" />
                    Create
                  </button>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {stats.recentOpportunities.length === 0 ? (
                        <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-400">No opportunities found</td></tr>
                      ) : (
                        stats.recentOpportunities.map((opp: any) => (
                          <tr key={opp.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="px-4 py-3 text-sm text-gray-700">{opp.name || "—"}</td>
                            <td className="px-4 py-3 text-sm text-gray-500">{opp.amount ? `${opp.currency || "USD"} ${opp.amount.toLocaleString()}` : "—"}</td>
                            <td className="px-4 py-3">
                              {opp.stage && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">{opp.stage}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">{opp.createdAt ? new Date(opp.createdAt).toLocaleDateString() : "—"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
