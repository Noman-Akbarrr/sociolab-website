"use client";

import { useState, useEffect } from "react";
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

export function NewDashClient({ stats, error }: { stats: DashboardStats | null; error: string | null }) {
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "opportunities">("overview");

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#090D16" }}>
        <div className="max-w-md w-full mx-auto p-8 rounded-2xl border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Connection Error</h1>
          </div>
          <p className="text-sm text-red-200/70 mb-4">{error}</p>
          <div className="text-xs text-white/40 space-y-1">
            <p>Make sure you&apos;ve set these environment variables:</p>
            <code className="block mt-2 p-3 rounded-lg bg-white/5 text-red-300/80">
              ESPOCRM_URL=https://your-crm-instance.com<br />
              ESPOCRM_API_KEY=your_api_key_here
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#090D16" }}>
        <div className="text-white/50">Loading...</div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Leads", value: stats.leads, color: "#FF5500", icon: "🎯" },
    { label: "Contacts", value: stats.contacts, color: "#059669", icon: "👥" },
    { label: "Accounts", value: stats.accounts, color: "#3B82F6", icon: "🏢" },
    { label: "Opportunities", value: stats.opportunities, color: "#8B5CF6", icon: "💼" },
    { label: "Tasks", value: stats.tasks, color: "#F59E0B", icon: "✅" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#090D16" }}>
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: "#FF5500" }}>
              S
            </div>
            <h1 className="text-lg font-bold text-white">Sociolab Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40">Powered by EspoCRM</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
              NA
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/10 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {(["overview", "leads", "opportunities"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-white" : "text-white/40 hover:text-white/60"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: "#FF5500" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                {statCards.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg">{stat.icon}</span>
                      <span className="text-xs font-mono" style={{ color: stat.color }}>●</span>
                    </div>
                    <div className="text-3xl font-extrabold text-white mb-1">{stat.value.toLocaleString()}</div>
                    <div className="text-xs text-white/40">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Two columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">Recent Leads</h2>
                    <button onClick={() => setActiveTab("leads")} className="text-xs text-[#FF5500] hover:underline">
                      View all
                    </button>
                  </div>
                  {stats.recentLeads.length === 0 ? (
                    <p className="p-8 text-center text-sm text-white/30">No leads yet</p>
                  ) : (
                    <ul className="divide-y divide-white/5">
                      {stats.recentLeads.map((lead: any) => (
                        <li key={lead.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium text-white">
                                {lead.name || `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "Unnamed"}
                              </span>
                              {lead.emailAddress && (
                                <span className="block text-xs text-white/40 mt-0.5">{lead.emailAddress}</span>
                              )}
                            </div>
                            {lead.status && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/50">
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
                <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">Recent Opportunities</h2>
                    <button onClick={() => setActiveTab("opportunities")} className="text-xs text-[#FF5500] hover:underline">
                      View all
                    </button>
                  </div>
                  {stats.recentOpportunities.length === 0 ? (
                    <p className="p-8 text-center text-sm text-white/30">No opportunities yet</p>
                  ) : (
                    <ul className="divide-y divide-white/5">
                      {stats.recentOpportunities.map((opp: any) => (
                        <li key={opp.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium text-white">{opp.name || "Untitled"}</span>
                              {opp.amount && (
                                <span className="block text-xs text-white/40 mt-0.5">
                                  {opp.currency || "USD"} {opp.amount.toLocaleString()}
                                </span>
                              )}
                            </div>
                            {opp.stage && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6]">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white mb-6">All Leads ({stats.leads})</h2>
              {stats.recentLeads.length === 0 ? (
                <div className="text-center py-20 text-white/30">No leads found</div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Name</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Email</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stats.recentLeads.map((lead: any) => (
                        <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3 text-sm text-white">{lead.name || `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "—"}</td>
                          <td className="px-5 py-3 text-sm text-white/50">{lead.emailAddress || "—"}</td>
                          <td className="px-5 py-3">
                            {lead.status && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/50">
                                {lead.status}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-xs text-white/30">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "opportunities" && (
            <motion.div
              key="opportunities"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white mb-6">All Opportunities ({stats.opportunities})</h2>
              {stats.recentOpportunities.length === 0 ? (
                <div className="text-center py-20 text-white/30">No opportunities found</div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Name</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Amount</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Stage</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stats.recentOpportunities.map((opp: any) => (
                        <tr key={opp.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3 text-sm text-white">{opp.name || "—"}</td>
                          <td className="px-5 py-3 text-sm text-white/50">{opp.amount ? `${opp.currency || "USD"} ${opp.amount.toLocaleString()}` : "—"}</td>
                          <td className="px-5 py-3">
                            {opp.stage && (
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6]">
                                {opp.stage}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-xs text-white/30">{opp.createdAt ? new Date(opp.createdAt).toLocaleDateString() : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
