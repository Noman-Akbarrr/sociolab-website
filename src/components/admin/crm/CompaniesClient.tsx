"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CompaniesClientProps {
  initialCompanies: any[];
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
  initialSearch: string;
}

export function CompaniesClient({ initialCompanies, initialTotal, initialPage, initialTotalPages, initialSearch }: CompaniesClientProps) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: "", domain: "", industry: "", size: "", website: "", linkedin: "", notes: "", tags: "" });
  const [createError, setCreateError] = useState("");

  async function fetchCompanies() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    params.set("limit", "20");
    const res = await fetch(`/admin/api/crm/companies?${params}`);
    const data = await res.json();
    setCompanies(data.companies);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("page", String(page));
      params.set("limit", "20");
      try {
        const res = await fetch(`/admin/api/crm/companies?${params}`, { signal: controller.signal });
        const data = await res.json();
        setCompanies(data.companies);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch {}
      setLoading(false);
    }
    const timer = setTimeout(load, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [search, page]);

  async function handleNewCompany(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    const res = await fetch("/admin/api/crm/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCompany, tags: newCompany.tags.split(",").map((t: string) => t.trim()).filter(Boolean) }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowNew(false);
      setNewCompany({ name: "", domain: "", industry: "", size: "", website: "", linkedin: "", notes: "", tags: "" });
      fetchCompanies();
    } else {
      setCreateError(data.error || "Failed to create client.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Clients</h1>
          <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Client
          </button>
        </div>
        <p className="text-sm text-white/60">Manage your client companies and their projects.</p>
      </div>

      <div className="mt-6">
        <input
          type="search"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
        />
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6 sm:py-10">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl mb-8">
            <h2 className="font-display text-xl font-semibold text-white">Add Client</h2>
            <p className="text-xs text-white/40 mt-1">Only the company name is required. You can add more details later.</p>
            {createError && (
              <div className="mt-3 rounded-[3px] border border-red-500/30 bg-red-500/10 px-3 py-2">
                <p className="text-xs text-red-400">{createError}</p>
              </div>
            )}
            <form onSubmit={handleNewCompany} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Company Name *</label>
                <input type="text" required value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Domain</label>
                  <input type="text" value={newCompany.domain} onChange={(e) => setNewCompany({ ...newCompany, domain: e.target.value })}
                    placeholder="acme.com"
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Industry</label>
                  <input type="text" value={newCompany.industry} onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                    placeholder="SaaS, E-commerce, etc."
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Size</label>
                  <select value={newCompany.size} onChange={(e) => setNewCompany({ ...newCompany, size: e.target.value })}
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value="">Select</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Website</label>
                  <input type="url" value={newCompany.website} onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                    placeholder="https://acme.com"
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">LinkedIn</label>
                <input type="url" value={newCompany.linkedin} onChange={(e) => setNewCompany({ ...newCompany, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Tags (comma separated)</label>
                <input type="text" value={newCompany.tags} onChange={(e) => setNewCompany({ ...newCompany, tags: e.target.value })}
                  placeholder="enterprise, warm-lead, partner"
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowNew(false); setCreateError(""); }} className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white transition-colors hover:border-brand">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark">Create Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-[3px] border border-[#1E293B] bg-[#111827]" />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="mt-6 rounded-[3px] border border-dashed border-[#1E293B] bg-[#111827]/50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <p className="text-sm text-white/50">{search ? "No clients match your search." : "No clients yet."}</p>
          <button onClick={() => setShowNew(true)} className="mt-3 text-sm font-semibold text-brand hover:text-brand-dark transition-colors">
            Add your first client
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company: any) => (
            <Link
              key={company.id}
              href={`/admin/crm/companies/${company.id}`}
              className="group rounded-[3px] border border-[#1E293B] bg-[#111827] p-5 transition-all hover:border-brand/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand font-bold text-sm">
                  {company.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>{company._count.deals} deals</span>
                  <span>·</span>
                  <span>{company._count.projects} projects</span>
                </div>
              </div>
              <h3 className="mt-3 font-display text-sm font-semibold text-white group-hover:text-brand transition-colors truncate">{company.name}</h3>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-white/50">
                {company.industry && <span>{company.industry}</span>}
                {company.industry && company.size && <span>·</span>}
                {company.size && <span>{company.size}</span>}
                {!company.industry && !company.size && company.domain && <span>{company.domain}</span>}
              </div>
              {company.tags && company.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {company.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/50">{tag}</span>
                  ))}
                  {company.tags.length > 3 && (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/40">+{company.tags.length - 3}</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-white/60">Page {page} of {totalPages} — {total} clients</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading} className="rounded-[3px] border border-[#1E293B] px-3 py-1.5 text-sm text-white disabled:opacity-50">Prev</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading} className="rounded-[3px] border border-[#1E293B] px-3 py-1.5 text-sm text-white disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
