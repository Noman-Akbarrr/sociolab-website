"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface CompanyAutocompleteProps {
  value: string;
  companyName: string;
  onChange: (companyId: string, companyName: string) => void;
  placeholder?: string;
}

export function CompanyAutocomplete({ value, companyName, onChange, placeholder = "Search or type company name..." }: CompanyAutocompleteProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [newIndustry, setNewIndustry] = useState("");
  const [creating, setCreating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchCompanies = useCallback(async (query: string) => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/admin/api/crm/companies?search=${encodeURIComponent(query)}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.companies || []);
      }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchCompanies(search), 300);
    return () => clearTimeout(timer);
  }, [search, searchCompanies]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as HTMLElement)) {
        setShowDropdown(false);
        setShowCreateNew(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/admin/api/crm/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, domain: newDomain || undefined, industry: newIndustry || undefined, tags: [] }),
      });
      if (res.ok) {
        const data = await res.json();
        onChange(data.company.id, data.company.name);
        setShowDropdown(false);
        setShowCreateNew(false);
        setNewName("");
        setNewDomain("");
        setNewIndustry("");
        setSearch("");
      }
    } finally { setCreating(false); }
  }

  function selectCompany(c: any) {
    onChange(c.id, c.name);
    setSearch("");
    setShowDropdown(false);
  }

  function clearSelection() {
    onChange("", "");
    setSearch("");
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-white/60 mb-1">Company Name</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value ? companyName : search}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange("", "");
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 pr-8 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand"
        />
        {value && (
          <button type="button" onClick={clearSelection} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {showDropdown && !showCreateNew && (
        <div className="absolute z-30 mt-1 w-full rounded-[3px] border border-[#1E293B] bg-[#111827] shadow-xl max-h-60 overflow-y-auto">
          {loading && <div className="px-3 py-2 text-xs text-white/40">Searching...</div>}
          {!loading && results.length > 0 && results.map((c: any) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectCompany(c)}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-white hover:bg-white/5 transition-colors"
            >
              <span className="font-medium">{c.name}</span>
              {c.industry && <span className="text-xs text-white/40">({c.industry})</span>}
            </button>
          ))}
          {!loading && results.length === 0 && search.trim() && (
            <button
              type="button"
              onClick={() => { setNewName(search); setShowCreateNew(true); }}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-brand hover:bg-white/5 transition-colors font-semibold"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Create new client &quot;{search}&quot;
            </button>
          )}
          {!loading && results.length === 0 && !search.trim() && (
            <div className="px-3 py-2 text-xs text-white/40">Type to search clients...</div>
          )}
        </div>
      )}

      {showDropdown && showCreateNew && (
        <div className="absolute z-30 mt-1 w-full rounded-[3px] border border-[#1E293B] bg-[#111827] shadow-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-white">New Client</p>
            <button type="button" onClick={() => { setShowCreateNew(false); setNewName(""); setNewDomain(""); setNewIndustry(""); }}
              className="text-white/40 hover:text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Company name"
              className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
            <input type="text" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} placeholder="Domain (optional)"
              className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
            <input type="text" value={newIndustry} onChange={(e) => setNewIndustry(e.target.value)} placeholder="Industry (optional)"
              className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
            <div className="flex gap-2">
              <button type="submit" disabled={creating || !newName.trim()}
                className="flex-1 rounded-[3px] bg-brand px-3 py-2 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-50">
                {creating ? "Creating..." : "Create & Select"}
              </button>
              <button type="button" onClick={() => { setShowCreateNew(false); setNewName(""); setNewDomain(""); setNewIndustry(""); }}
                className="rounded-[3px] border border-[#1E293B] px-3 py-2 text-xs font-bold text-white hover:border-brand">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
