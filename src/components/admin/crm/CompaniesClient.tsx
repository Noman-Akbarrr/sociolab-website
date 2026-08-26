"use client";

import { useState } from "react";
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

  async function handleNewCompany(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/admin/api/crm/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCompany, tags: newCompany.tags.split(",").map((t: string) => t.trim()).filter(Boolean) }),
    });
    if (res.ok) {
      setShowNew(false);
      setNewCompany({ name: "", domain: "", industry: "", size: "", website: "", linkedin: "", notes: "", tags: "" });
      fetchCompanies();
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Companies</h1>
          <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
            + New Company
          </button>
        </div>
        <p className="text-sm text-ink/60">Manage your accounts and prospects.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[300px]">
          <input
            type="search"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); fetchCompanies(); }}
            className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-white p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-ink">New Company</h2>
            <form onSubmit={handleNewCompany} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Name *</label>
                <input type="text" required value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink/60 mb-1">Domain</label>
                  <input type="text" value={newCompany.domain} onChange={(e) => setNewCompany({ ...newCompany, domain: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink/60 mb-1">Industry</label>
                  <input type="text" value={newCompany.industry} onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink/60 mb-1">Size</label>
                  <select value={newCompany.size} onChange={(e) => setNewCompany({ ...newCompany, size: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand">
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
                  <label className="block text-xs font-semibold text-ink/60 mb-1">Website</label>
                  <input type="url" value={newCompany.website} onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">LinkedIn</label>
                <input type="url" value={newCompany.linkedin} onChange={(e) => setNewCompany({ ...newCompany, linkedin: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Tags (comma separated)</label>
                <input type="text" value={newCompany.tags} onChange={(e) => setNewCompany({ ...newCompany, tags: e.target.value })} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" placeholder="enterprise, warm-lead, partner" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink/60 mb-1">Notes</label>
                <textarea value={newCompany.notes} onChange={(e) => setNewCompany({ ...newCompany, notes: e.target.value })} rows={3} className="w-full rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)} className="rounded-[3px] border border-line px-4 py-2 text-sm font-bold text-ink transition-colors hover:border-brand">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark">Create Company</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-[3px] border border-line bg-white overflow-hidden">
        {companies.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink/50">No companies yet. Create your first one.</p>
        ) : (
          <ul className="divide-y divide-line">
            {companies.map((company: any) => (
              <li key={company.id} className="flex items-center justify-between gap-4 p-4 hover:bg-mist/50">
                <Link href={`/admin/crm/companies/${company.id}`} className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate font-display text-sm font-semibold text-ink">{company.name}</span>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink/50">
                    {company.domain && <span>{company.domain}</span>}
                    {company.industry && <span>· {company.industry}</span>}
                    {company.size && <span>· {company.size}</span>}
                    <span>· {company._count.deals} deals</span>
                    <span>· {company._count.projects} projects</span>
                    <span>· {company._count.contacts} contacts</span>
                  </div>
                </Link>
                {company.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {company.tags.map((tag: string) => (
                      <span key={tag} className="rounded-full bg-mist px-2 py-0.5 text-[11px] font-medium text-ink/60">{tag}</span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-ink/60">Page {page} of {totalPages} — {total} companies</span>
          <div className="flex gap-2">
            <button onClick={() => { setPage(p => Math.max(1, p - 1)); fetchCompanies(); }} disabled={page === 1 || loading} className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-50">Prev</button>
            <button onClick={() => { setPage(p => Math.min(totalPages, p + 1)); fetchCompanies(); }} disabled={page === totalPages || loading} className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}