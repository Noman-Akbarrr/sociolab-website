"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useAdminSession } from "@/lib/use-admin-session";

interface Stats {
  totalDeals: number;
  pipelineValue: number;
  activeProjects: number;
  openTickets: number;
  totalContacts: number;
  totalCompanies: number;
}

interface Deal {
  id: string;
  title: string;
  value: number;
  company: { name: string };
  stage: { name: string; color: string };
  owner: { name: string };
  createdAt: string;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: { name: string } | null;
}

function StatIcon({ name }: { name: string }) {
  const cls = "w-5 h-5";
  const icons: Record<string, React.ReactElement> = {
    deals: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    pipeline: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>,
    won: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    projects: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>,
    tickets: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>,
    contacts: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
    companies: <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
  };
  return icons[name] || null;
}

const stageColors: Record<string, string> = {};

export function DashboardView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { can, loading: sessionLoading } = useAdminSession();

  const showDeals = can("deals");
  const showProjects = can("projects");
  const showTickets = can("tickets");
  const showContacts = can("contacts");
  const showCompanies = can("companies");

  useEffect(() => {
    if (sessionLoading) return;
    let active = true;
    async function load() {
      try {
        const [statsRes, dealsRes, contactsRes] = await Promise.all([
          fetch("/admin/api/crm/stats"),
          showDeals ? fetch("/admin/api/crm/deals") : Promise.resolve(null),
          showContacts ? fetch("/admin/api/crm/contacts") : Promise.resolve(null),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (dealsRes?.ok) setDeals(await dealsRes.json());
        if (contactsRes?.ok) setContacts(await contactsRes.json());
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [sessionLoading, showDeals, showContacts]);

  const statCards = stats
    ? [
        ...(showDeals
          ? [
              { label: "Total Deals", value: stats.totalDeals, icon: "deals", color: "#FF5500", bg: "#FFF3E0" },
              { label: "Pipeline Value", value: `Rs. ${(stats.pipelineValue / 1000).toFixed(0)}K`, icon: "pipeline", color: "#FF5500", bg: "#FFF3E0" },
            ]
          : []),
        ...(showProjects
          ? [{ label: "Active Projects", value: stats.activeProjects, icon: "projects", color: "#FF9800", bg: "#FFF3E0" }]
          : []),
        ...(showTickets
          ? [{ label: "Open Tickets", value: stats.openTickets, icon: "tickets", color: "#F44336", bg: "#FFEBEE" }]
          : []),
        ...(showContacts
          ? [{ label: "Contacts", value: stats.totalContacts, icon: "contacts", color: "#4CAF50", bg: "#E8F5E9" }]
          : []),
        ...(showCompanies
          ? [{ label: "Companies", value: stats.totalCompanies, icon: "companies", color: "#9C27B0", bg: "#F3E5F5" }]
          : []),
      ]
    : [];

  const recentDeals = deals.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#FF5500] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                <div style={{ color: stat.color }}><StatIcon name={stat.icon} /></div>
              </div>
              <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {showDeals && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Recent Deals</h3>
            <Link href="/admin/pipeline" className="text-xs font-medium hover:underline" style={{ color: "#FF5500" }}>View all</Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {recentDeals.map((deal) => (
              <li key={deal.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700 block">{deal.title}</span>
                    <span className="text-xs text-gray-400">{deal.company?.name ?? "—"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-700 block">Rs. {deal.value.toLocaleString()}</span>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: (deal.stage?.color ?? "#9CA3AF") + "20", color: deal.stage?.color ?? "#9CA3AF" }}
                    >
                      {deal.stage?.name ?? "—"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
            {recentDeals.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-gray-400">No deals yet</li>
            )}
          </ul>
        </div>
        )}

        {showContacts && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Recent Contacts</h3>
            <Link href="/admin/contacts" className="text-xs font-medium hover:underline" style={{ color: "#FF5500" }}>View all</Link>
          </div>
          <ul className="divide-y divide-gray-50">
            {recentContacts.map((contact) => (
              <li key={contact.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ backgroundColor: "#FF5500" }}>
                      {contact.firstName[0]}{contact.lastName[0]}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">{contact.firstName} {contact.lastName}</span>
                      <span className="text-xs text-gray-400">{contact.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {contact.company?.name ?? "—"}
                  </span>
                </div>
              </li>
            ))}
            {recentContacts.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-gray-400">No contacts yet</li>
            )}
          </ul>
        </div>
        )}
      </div>
    </div>
  );
}
