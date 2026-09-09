"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DealPanel from "./DealPanel";

interface PipelineKanbanProps {
  pipeline: any;
  initialStages: any[];
  initialDealsByStage: any[];
}

export function PipelineKanban({ pipeline, initialStages, initialDealsByStage }: PipelineKanbanProps) {
  const router = useRouter();
  const [stages, setStages] = useState(initialStages);
  const [dealsByStage, setDealsByStage] = useState(initialDealsByStage);
  const [showNewDeal, setShowNewDeal] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [newDeal, setNewDeal] = useState({
    title: "",
    companyId: "",
    value: 0,
    currency: "PKR",
    stageId: "",
    expectedClose: "",
    contactIds: [] as string[],
  });
  const [creating, setCreating] = useState(false);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [addingStage, setAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editingStageLabel, setEditingStageLabel] = useState("");
  const [activeStageMenu, setActiveStageMenu] = useState<string | null>(null);
  const [colorPickerStage, setColorPickerStage] = useState<string | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [stageDragOver, setStageDragOver] = useState<string | null>(null);
  const dragDataRef = useRef<{ dealId: string; sourceStageId: string } | null>(null);
  const stageDragRef = useRef<{ stageId: string } | null>(null);

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(cents / 100);

  const totalPipelineValue = dealsByStage.reduce((sum, group) => {
    const openStage = stages.find((s) => s.id === group.stage.id);
    if (openStage?.isClosed) return sum;
    return sum + group.deals.reduce((s: number, d: any) => s + (d.value || 0), 0);
  }, 0);

  const getStageDeals = (stageId: string) =>
    dealsByStage.find((g) => g.stage.id === stageId)?.deals || [];

  const getStageTotal = (stageId: string) => {
    const deals = getStageDeals(stageId);
    return deals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
  };

  async function fetchCompanies() {
    if (companies.length > 0) return;
    const res = await fetch("/admin/api/crm/companies?limit=100");
    const data = await res.json();
    setCompanies(data.companies || []);
  }

  async function fetchDeals() {
    const res = await fetch(`/admin/api/crm/deals?pipelineId=${pipeline.id}`);
    const data = await res.json();
    if (data.dealsByStage) {
      setDealsByStage(data.dealsByStage);
    }
  }

  function openNewDealModal(stageId?: string) {
    fetchCompanies();
    setNewDeal({
      title: "",
      companyId: "",
      value: 0,
      currency: "PKR",
      stageId: stageId || stages[0]?.id || "",
      expectedClose: "",
      contactIds: [],
    });
    setShowNewDeal(true);
  }

  async function handleCreateDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!newDeal.title.trim() || !newDeal.companyId || !newDeal.stageId) return;
    setCreating(true);
    try {
      const res = await fetch("/admin/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newDeal, pipelineId: pipeline.id }),
      });
      if (res.ok) {
        const data = await res.json();
        const stage = stages.find((s) => s.id === newDeal.stageId);
        if (stage) {
          setDealsByStage((prev) =>
            prev.map((g) =>
              g.stage.id === newDeal.stageId
                ? { ...g, deals: [...g.deals, { ...data.deal, company: companies.find((c) => c.id === newDeal.companyId) || { name: "Unknown" }, stage }] }
                : g
            )
          );
        }
        setShowNewDeal(false);
        router.refresh();
      }
    } finally {
      setCreating(false);
    }
  }

  function handleDragStart(e: React.DragEvent, dealId: string, stageId: string) {
    dragDataRef.current = { dealId, sourceStageId: stageId };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", dealId);
  }

  function handleDragOver(e: React.DragEvent, stageId: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stageId);
  }

  function handleDragLeave() {
    setDragOverStage(null);
  }

  async function handleDrop(e: React.DragEvent, targetStageId: string) {
    e.preventDefault();
    setDragOverStage(null);
    const data = dragDataRef.current;
    if (!data) return;
    if (data.sourceStageId === targetStageId) return;

    const deal = getStageDeals(data.sourceStageId).find((d: any) => d.id === data.dealId);
    if (!deal) return;

    setDealsByStage((prev) =>
      prev.map((g) => {
        if (g.stage.id === data.sourceStageId) {
          return { ...g, deals: g.deals.filter((d: any) => d.id !== data.dealId) };
        }
        if (g.stage.id === targetStageId) {
          const targetStage = stages.find((s) => s.id === targetStageId);
          return { ...g, deals: [...g.deals, { ...deal, stageId: targetStageId, stage: targetStage }] };
        }
        return g;
      })
    );

    await fetch(`/admin/api/crm/deals/${data.dealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stageId: targetStageId }),
    });

    dragDataRef.current = null;
    router.refresh();
  }

  async function handleAddStage() {
    if (!newStageName.trim()) return;
    const res = await fetch(`/admin/api/crm/pipelines/${pipeline.id}/stages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newStageName.toLowerCase().replace(/\s+/g, "-"),
        label: newStageName,
        color: "#6b7280",
        order: stages.length,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setStages([...stages, data.stage]);
      setDealsByStage((prev) => [...prev, { stage: data.stage, deals: [] }]);
      setNewStageName("");
      setAddingStage(false);
      router.refresh();
    }
  }

  async function handleRenameStage(stageId: string) {
    if (!editingStageLabel.trim()) return;
    await fetch(`/admin/api/crm/pipelines/${pipeline.id}/stages/${stageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: editingStageLabel }),
    });
    setStages((prev) => prev.map((s) => (s.id === stageId ? { ...s, label: editingStageLabel } : s)));
    setEditingStageId(null);
    router.refresh();
  }

  async function handleDeleteStage(stageId: string) {
    if (!confirm("Delete this stage? Deals will be moved to the first stage.")) return;
    const reassignToId = stages.find((s) => s.id !== stageId)?.id;
    await fetch(`/admin/api/crm/pipelines/${pipeline.id}/stages/${stageId}?reassignToId=${reassignToId || ""}`, {
      method: "DELETE",
    });
    setStages((prev) => prev.filter((s) => s.id !== stageId));
    setDealsByStage((prev) => prev.filter((g) => g.stage.id !== stageId));
    setActiveStageMenu(null);
    router.refresh();
  }

  async function handleStageColor(stageId: string, color: string) {
    await fetch(`/admin/api/crm/pipelines/${pipeline.id}/stages/${stageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    });
    setStages((prev) => prev.map((s) => (s.id === stageId ? { ...s, color } : s)));
    setColorPickerStage(null);
  }

  function isCloseDateSoon(dateStr: string) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  }

  // Stats for header
  const allDeals = dealsByStage.flatMap((g) => g.deals);
  const totalDeals = allDeals.length;
  const openDeals = allDeals.filter((d: any) => {
    const s = stages.find((st) => st.id === d.stageId);
    return s && !s.isClosed;
  });
  const openDealCount = openDeals.length;
  const urgentDeals = openDeals.filter((d: any) => d.expectedClose && isCloseDateSoon(d.expectedClose));
  const urgentCount = urgentDeals.length;
  const wonDeals = allDeals.filter((d: any) => {
    const s = stages.find((st) => st.id === d.stageId);
    return s?.isWon;
  });
  const wonCount = wonDeals.length;
  const wonValue = wonDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);

  // Stage reorder handlers
  function handleStageDragStart(e: React.DragEvent, stageId: string) {
    stageDragRef.current = { stageId };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `stage:${stageId}`);
  }

  function handleStageDragOver(e: React.DragEvent, stageId: string) {
    e.preventDefault();
    if (!stageDragRef.current || stageDragRef.current.stageId === stageId) return;
    e.dataTransfer.dropEffect = "move";
    setStageDragOver(stageId);
  }

  function handleStageDragLeave() {
    setStageDragOver(null);
  }

  async function handleStageDrop(e: React.DragEvent, targetStageId: string) {
    e.preventDefault();
    setStageDragOver(null);
    if (!stageDragRef.current) return;
    const draggedStageId = stageDragRef.current.stageId;
    if (draggedStageId === targetStageId) { stageDragRef.current = null; return; }

    const currentIds = stages.map((s) => s.id);
    const fromIdx = currentIds.indexOf(draggedStageId);
    const toIdx = currentIds.indexOf(targetStageId);
    if (fromIdx < 0 || toIdx < 0) { stageDragRef.current = null; return; }

    const newIds = [...currentIds];
    newIds.splice(fromIdx, 1);
    newIds.splice(toIdx, 0, draggedStageId);

    // Optimistic update
    const newStages = newIds.map((id, i) => {
      const s = stages.find((st) => st.id === id);
      return s ? { ...s, order: i } : s;
    }).filter(Boolean) as typeof stages;
    setStages(newStages);

    await fetch(`/admin/api/crm/pipelines/${pipeline.id}/stages/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stageIds: newIds }),
    });
    stageDragRef.current = null;
  }

  function handleDealDragStart(e: React.DragEvent, dealId: string, sourceStageId: string) {
    dragDataRef.current = { dealId, sourceStageId };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", dealId);
  }

  return (
    <>
      <div className="border-b border-[#1E293B] bg-[#090D16] px-6 py-4">
        <div className="flex items-start justify-between gap-6">
          {/* Left: Back + Name + Stats */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/pipeline"
                className="flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 12L6 8L10 4" />
                </svg>
                Pipelines
              </Link>
            </div>
            <h1 className="font-display text-base font-semibold text-white">{pipeline.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-white/50">
                <span className="font-semibold text-white">{openDealCount}</span> open
              </span>
              <span className="text-xs text-white/50">
                <span className="font-semibold text-white">{totalDeals}</span> total
              </span>
              <span className="text-xs text-white/50">
                <span className="font-semibold text-brand">{formatCurrency(totalPipelineValue)}</span> pipeline
              </span>
              {urgentCount > 0 && (
                <span className="text-xs text-orange-400">
                  <span className="font-semibold">{urgentCount}</span> closing soon
                </span>
              )}
              {wonCount > 0 && (
                <span className="text-xs text-green-400">
                  <span className="font-semibold">{wonCount}</span> won
                </span>
              )}
            </div>
          </div>

          {/* Right: New Deal button */}
          <button
            onClick={() => openNewDealModal()}
            className="shrink-0 inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            + New Deal
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto p-6" style={{ minHeight: "calc(100vh - 80px)" }}>
        {stages.map((stage) => {
          const stageDeals = getStageDeals(stage.id);
          const stageTotal = getStageTotal(stage.id);
          return (
            <div
              key={stage.id}
              className="flex w-[320px] min-w-[320px] flex-col"
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div
                className={`flex items-center justify-between rounded-t-[3px] px-4 py-3 transition-colors ${
                  stageDragOver === stage.id ? "bg-brand/10 ring-1 ring-brand/50" : "bg-[#111827]"
                }`}
              >
                <div className="flex items-center gap-2">
                  {/* Drag handle for reordering */}
                  <div
                    draggable
                    onDragStart={(e) => handleStageDragStart(e, stage.id)}
                    onDragOver={(e) => handleStageDragOver(e, stage.id)}
                    onDragLeave={handleStageDragLeave}
                    onDrop={(e) => handleStageDrop(e, stage.id)}
                    className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 transition-colors"
                    title="Drag to reorder"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="5" cy="3" r="1.5" />
                      <circle cx="11" cy="3" r="1.5" />
                      <circle cx="5" cy="8" r="1.5" />
                      <circle cx="11" cy="8" r="1.5" />
                      <circle cx="5" cy="13" r="1.5" />
                      <circle cx="11" cy="13" r="1.5" />
                    </svg>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  {editingStageId === stage.id ? (
                    <input
                      autoFocus
                      value={editingStageLabel}
                      onChange={(e) => setEditingStageLabel(e.target.value)}
                      onBlur={() => handleRenameStage(stage.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameStage(stage.id);
                        if (e.key === "Escape") setEditingStageId(null);
                      }}
                      className="bg-transparent text-sm font-bold text-white outline-none border-b border-brand"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">{stage.label}</span>
                  )}
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/60">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActiveStageMenu(activeStageMenu === stage.id ? null : stage.id)}
                    className="rounded p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="3" r="1.5" />
                      <circle cx="8" cy="8" r="1.5" />
                      <circle cx="8" cy="13" r="1.5" />
                    </svg>
                  </button>
                  {activeStageMenu === stage.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-[3px] border border-[#1E293B] bg-[#111827] py-1 shadow-xl">
                      <button
                        onClick={() => {
                          setEditingStageId(stage.id);
                          setEditingStageLabel(stage.label);
                          setActiveStageMenu(null);
                        }}
                        className="flex w-full items-center px-3 py-2 text-left text-sm text-white hover:bg-white/5"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => {
                          setColorPickerStage(colorPickerStage === stage.id ? null : stage.id);
                          setActiveStageMenu(null);
                        }}
                        className="flex w-full items-center px-3 py-2 text-left text-sm text-white hover:bg-white/5"
                      >
                        Change Color
                      </button>
                      <button
                        onClick={() => handleDeleteStage(stage.id)}
                        className="flex w-full items-center px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  {colorPickerStage === stage.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 rounded-[3px] border border-[#1E293B] bg-[#111827] p-3 shadow-xl">
                      <div className="grid grid-cols-5 gap-2">
                        {["#6b7280", "#3b82f6", "#8b5cf6", "#f59e0b", "#22c55e", "#ef4444", "#06b6d4", "#ec4899", "#14b8a6", "#f97316"].map(
                          (c) => (
                            <button
                              key={c}
                              onClick={() => handleStageColor(stage.id, c)}
                              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                                stage.color === c ? "border-white" : "border-transparent"
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`flex flex-1 flex-col gap-2 rounded-b-[3px] border border-t-0 border-[#1E293B] bg-[#090D16] p-2 transition-colors ${
                  dragOverStage === stage.id ? "border-brand/50 bg-brand/5" : ""
                }`}
              >
                {stageDeals.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center py-8">
                    <p className="text-sm text-white/30">No deals</p>
                  </div>
                ) : (
                  stageDeals.map((deal: any) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id, stage.id)}
                      onClick={() => setSelectedDealId(deal.id)}
                      className="cursor-grab rounded-[3px] border border-[#1E293B] bg-[#111827] p-3 transition-all hover:border-brand/30 hover:shadow-md active:cursor-grabbing"
                    >
                      <p className="font-display text-sm font-bold text-white">{deal.title}</p>
                      <p className="mt-1 text-xs text-white/50">{deal.company?.name || "Unknown"}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{formatCurrency(deal.value)}</span>
                        {deal.expectedClose && (
                          <span
                            className={`text-xs ${
                              isCloseDateSoon(deal.expectedClose) ? "text-orange-400 font-semibold" : "text-white/40"
                            }`}
                          >
                            {new Date(deal.expectedClose).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                      {deal.probability > 0 && deal.probability < 100 && (
                        <div className="mt-2">
                          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-brand transition-all"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                          <p className="mt-0.5 text-[10px] text-white/40">{deal.probability}%</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <button
                  onClick={() => openNewDealModal(stage.id)}
                  className="mt-1 flex w-full items-center justify-center gap-1 rounded-[3px] border border-dashed border-[#1E293B] py-2 text-xs text-white/40 transition-colors hover:border-brand/50 hover:text-white/60"
                >
                  + Add Deal
                </button>
              </div>
            </div>
          );
        })}

        <div className="w-[320px] min-w-[320px]">
          {addingStage ? (
            <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-4">
              <input
                autoFocus
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddStage();
                  if (e.key === "Escape") {
                    setAddingStage(false);
                    setNewStageName("");
                  }
                }}
                placeholder="Stage name..."
                className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
              />
              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleAddStage}
                  disabled={!newStageName.trim()}
                  className="flex-1 rounded-[3px] bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-50"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setAddingStage(false);
                    setNewStageName("");
                  }}
                  className="flex-1 rounded-[3px] border border-[#1E293B] px-3 py-1.5 text-xs font-bold text-white hover:border-brand"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingStage(true)}
              className="flex w-full items-center justify-center gap-2 rounded-[3px] border border-dashed border-[#1E293B] bg-[#111827]/50 py-16 text-sm text-white/40 transition-colors hover:border-brand/50 hover:text-white/60"
            >
              + Add Stage
            </button>
          )}
        </div>
      </div>

      {showNewDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-white">New Deal</h2>
            <form onSubmit={handleCreateDeal} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Company *</label>
                <select
                  required
                  value={newDeal.companyId}
                  onChange={(e) => setNewDeal({ ...newDeal, companyId: e.target.value })}
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                >
                  <option value="">Select company</option>
                  {companies.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Value</label>
                  <input
                    type="number"
                    value={newDeal.value}
                    onChange={(e) => setNewDeal({ ...newDeal, value: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Currency</label>
                  <select
                    value={newDeal.currency}
                    onChange={(e) => setNewDeal({ ...newDeal, currency: e.target.value })}
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  >
                    <option value="PKR">PKR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Stage</label>
                <select
                  value={newDeal.stageId}
                  onChange={(e) => setNewDeal({ ...newDeal, stageId: e.target.value })}
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                >
                  {stages.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Expected Close</label>
                <input
                  type="date"
                  value={newDeal.expectedClose}
                  onChange={(e) => setNewDeal({ ...newDeal, expectedClose: e.target.value })}
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewDeal(false)}
                  className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white transition-colors hover:border-brand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(activeStageMenu || colorPickerStage) && (
        <div className="fixed inset-0 z-10" onClick={() => { setActiveStageMenu(null); setColorPickerStage(null); }} />
      )}

      {selectedDealId && (
        <DealPanel
          dealId={selectedDealId}
          onClose={() => setSelectedDealId(null)}
          onDealUpdated={() => {
            router.refresh();
            fetchDeals();
          }}
        />
      )}
    </>
  );
}