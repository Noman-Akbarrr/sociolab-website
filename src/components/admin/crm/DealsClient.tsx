"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DealsClientProps {
  initialDeals: any[];
  initialDealsByStage: any[];
  initialStages: any[];
  initialCompanies: any[];
  initialStageFilter: string;
  initialSearch: string;
  initialCompanyFilter: string;
  initialPage: number;
  initialTotalPages: number;
  initialTotal: number;
}

export function DealsClient({
  initialDeals,
  initialDealsByStage,
  initialStages,
  initialCompanies,
  initialStageFilter,
  initialSearch,
  initialCompanyFilter,
  initialPage,
  initialTotalPages,
  initialTotal,
}: DealsClientProps) {
  const router = useRouter();
  const [deals, setDeals] = useState(initialDeals);
  const [dealsByStage, setDealsByStage] = useState(initialDealsByStage);
  const [stages] = useState(initialStages);
  const [companies] = useState(initialCompanies);
  const [stageFilter, setStageFilter] = useState(initialStageFilter);
  const [search, setSearch] = useState(initialSearch);
  const [companyFilter, setCompanyFilter] = useState(initialCompanyFilter);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newDeal, setNewDeal] = useState({ title: "", companyId: "", value: 0, stageId: stages[0]?.id || "", contactIds: [] as string[] });

  const formatCurrency = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

  async function fetchDeals() {
    setLoading(true);
    const params = new URLSearchParams();
    if (stageFilter) params.set("stageId", stageFilter);
    if (companyFilter) params.set("companyId", companyFilter);
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("limit", "20");
    const res = await fetch(`/admin/api/crm/deals?${params}`);
    const data = await res.json();
    setDeals(data.deals);
    setDealsByStage(data.dealsByStage);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  async function handleNewDeal(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/admin/api/crm/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDeal),
    });
    if (res.ok) {
      setShowNew(false);
      setNewDeal({ title: "", companyId: "", value: 0, stageId: stages[0]?.id || "", contactIds: [] });
      fetchDeals();
    }
  }

  async function updateDealStage(dealId: string, newStageId: string) {
    const res = await fetch(`/admin/api/crm/deals/${dealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stageId: newStageId }),
    });
    if (res.ok) fetchDeals();
  }

  const viewMode = stageFilter ? "list" : "kanban";

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Deals</h1>
          <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
            + New Deal
          </button>
        </div>
        <p className="text-sm text-ink/60">Manage your sales pipeline. {viewMode === "kanban" ? "Drag deals between stages." : "Filter by stage to see list view."}</p>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative">
          <select
            value={stageFilter}
            onChange={(e) => { setStageFilter(e.target.value); setPage(1); fetchDeals(); }}
            className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          >
            <option value="">All Stages</option>
            {stages.map((s: any) => (
              <option key={s.id} value={s.id} style={{ color: s.color }}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select
            value={companyFilter}
            onChange={(e) => { setCompanyFilter(e.target.value); setPage(1); fetchDeals(); }}
            className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          >
            <option value="">All Companies</option>
            {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <input
            type="search"
            placeholder="Search deals..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); fetchDeals(); }}
            className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      {/* New Deal Modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-white p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-ink">New Deal</h2>
            <form onSubmit={handleNewDeal} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Title *</label>
                <input type="text" required value={newDeal.title} onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Company *</label>
                <select required value={newDeal.companyId} onChange={(e) => setNewDeal({ ...newDeal, companyId: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                  <option value="">Select company</option>
                  {companies.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Value (USD)</label>
                <input type="number" value={newDeal.value} onChange={(e) => setNewDeal({ ...newDeal, value: parseInt(e.target.value) || 0 })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Stage</label>
                <select value={newDeal.stageId} onChange={(e) => setNewDeal({ ...newDeal, stageId: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
                  {stages.map((s: any) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)} className="rounded-[3px] border border-line px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-brand">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark">Create Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pipeline Kanban or List */}
      {viewMode === "kanban" ? (
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage: any) => (
            <div key={stage.id} className="min-w-[320px] max-w-[320px] flex flex-col">
              <div className="flex items-center justify-between rounded-t-[3px] px-4 py-3 text-sm font-bold text-white" style={{ backgroundColor: stage.color }}>
                <span>{stage.label}</span>
                <span className="text-[11px] opacity-80">{dealsByStage.find((d: any) => d.stage.id === stage.id)?.deals.length || 0}</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 rounded-b-[3px] border border-line bg-white p-3 min-h-[400px]">
                {dealsByStage.find((d: any) => d.stage.id === stage.id)?.deals.map((deal: any) => (
                  <Link
                    key={deal.id}
                    href={`/admin/crm/deals/${deal.id}`}
                    className="group flex flex-col gap-2 rounded-[3px] border border-line bg-white p-3 transition-shadow hover:shadow-md"
                    onDragStart={(e) => e.dataTransfer.setData("dealId", deal.id)}
                  >
                    <span className="font-display text-sm font-semibold text-ink group-hover:text-brand">{deal.title}</span>
                    <div className="flex items-center justify-between text-xs text-ink/50">
                      <span>{deal.company.name}</span>
                      <span>{formatCurrency(deal.value)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[3px] border border-line bg-white overflow-hidden">
          {deals.length === 0 ? (
            <p className="p-8 text-center text-sm text-ink/50">No deals found.</p>
          ) : (
            <ul className="divide-y divide-line">
              {deals.map((deal: any) => (
                <li key={deal.id} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                  <Link href={`/admin/crm/deals/${deal.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-display text-sm font-semibold text-ink">{deal.title}</span>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                      <span>{deal.company.name}</span>
                      <span>·</span>
                      <span>{formatCurrency(deal.value)}</span>
                      <span>·</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.1em] ${
                          deal.stage.isWon ? "bg-green-100 text-green-700" : deal.stage.isClosed ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                        }`}
                        style={{ backgroundColor: `${deal.stage.color}20`, color: deal.stage.color }}
                      >
                        {deal.stage.label}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-ink/60">Page {page} of {totalPages} — {total} deals</span>
          <div className="flex gap-2">
            <button onClick={() => { setPage(p => Math.max(1, p - 1)); fetchDeals(); }} disabled={page === 1 || loading} className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-50">Prev</button>
            <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); fetchDeals(); }} disabled={page === totalPages || loading} className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}