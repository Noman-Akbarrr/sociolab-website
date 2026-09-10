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
  const [creating, setCreating] = useState(false);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [addingStage, setAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editingStageLabel, setEditingStageLabel] = useState("");
  const [activeStageMenu, setActiveStageMenu] = useState<string | null>(null);
  const [colorPickerStage, setColorPickerStage] = useState<string | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [deletingDealId, setDeletingDealId] = useState<string | null>(null);

  // Stage drag state — simplified: only track dragging ID and drop target
  const [stageDragging, setStageDragging] = useState<string | null>(null);
  const [stageDropTarget, setStageDropTarget] = useState<string | null>(null);
  const [stageDropSide, setStageDropSide] = useState<"left" | "right">("right");
  const stageDragId = useRef<string | null>(null);

  // Deal drag state
  const [dealDragging, setDealDragging] = useState<{ dealId: string; sourceStageId: string } | null>(null);
  const dealDragRef = useRef<{ dealId: string; sourceStageId: string } | null>(null);

  // New deal form
  const [newDeal, setNewDeal] = useState({
    title: "", companyName: "", contactName: "", contactEmail: "", contactPhone: "",
    value: 0, currency: "PKR", stageId: "", expectedClose: "", address: "", city: "",
    country: "", source: "", dealType: "", priority: "medium", notes: "",
  });

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(cents / 100);

  const totalPipelineValue = dealsByStage.reduce((sum, group) => {
    const openStage = stages.find((s) => s.id === group.stage.id);
    if (openStage?.isClosed) return sum;
    return sum + group.deals.reduce((s: number, d: any) => s + (d.value || 0), 0);
  }, 0);

  const getStageDeals = (stageId: string) =>
    dealsByStage.find((g) => g.stage.id === stageId)?.deals || [];

  function isCloseDateSoon(dateStr: string) {
    if (!dateStr) return false;
    const diff = new Date(dateStr).getTime() - Date.now();
    return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  }

  // Stats
  const allDeals = dealsByStage.flatMap((g) => g.deals);
  const totalDeals = allDeals.length;
  const openDeals = allDeals.filter((d: any) => { const s = stages.find((st) => st.id === d.stageId); return s && !s.isClosed; });
  const openDealCount = openDeals.length;
  const urgentCount = openDeals.filter((d: any) => d.expectedClose && isCloseDateSoon(d.expectedClose)).length;
  const wonDeals = allDeals.filter((d: any) => stages.find((st) => st.id === d.stageId)?.isWon);
  const wonCount = wonDeals.length;

  // ── Stage Reorder (simplified) ──
  function handleStageDragStart(e: React.DragEvent, stageId: string) {
    stageDragId.current = stageId;
    setStageDragging(stageId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", stageId);
    // Minimal ghost
    const el = e.currentTarget.closest("[data-stage-col]") as HTMLElement;
    if (el) {
      const ghost = el.cloneNode(true) as HTMLElement;
      ghost.style.width = "200px";
      ghost.style.opacity = "0.7";
      ghost.style.position = "absolute";
      ghost.style.top = "-9999px";
      ghost.style.pointerEvents = "none";
      document.body.appendChild(ghost);
      e.dataTransfer.setDragImage(ghost, 100, 20);
      requestAnimationFrame(() => document.body.removeChild(ghost));
    }
  }

  function handleHeaderDragOver(e: React.DragEvent, stageId: string) {
    if (!stageDragId.current || stageDragId.current === stageId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setStageDropTarget(stageId);
    // Determine side
    const el = (e.currentTarget as HTMLElement).closest("[data-stage-col]") as HTMLElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      setStageDropSide(e.clientX < rect.left + rect.width / 2 ? "left" : "right");
    }
  }

  function handleHeaderDragLeave(e: React.DragEvent) {
    // Only clear if actually leaving the header (not entering a child)
    const related = e.relatedTarget as HTMLElement;
    if (related && e.currentTarget.contains(related)) return;
    setStageDropTarget(null);
  }

  async function handleHeaderDrop(e: React.DragEvent, targetStageId: string) {
    e.preventDefault();
    e.stopPropagation();
    setStageDropTarget(null);
    setStageDragging(null);
    const draggedId = stageDragId.current;
    if (!draggedId || draggedId === targetStageId) { stageDragId.current = null; return; }

    const ids = stages.map((s) => s.id);
    const fromIdx = ids.indexOf(draggedId);
    const toIdx = ids.indexOf(targetStageId);
    if (fromIdx < 0 || toIdx < 0) { stageDragId.current = null; return; }

    const insertIdx = stageDropSide === "left"
      ? (fromIdx < toIdx ? toIdx - 1 : toIdx)
      : (fromIdx < toIdx ? toIdx : toIdx + 1);

    const newIds = ids.filter((id) => id !== draggedId);
    newIds.splice(insertIdx, 0, draggedId);

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
    stageDragId.current = null;
    router.refresh();
  }

  function handleStageDragEnd() {
    setStageDragging(null);
    setStageDropTarget(null);
    stageDragId.current = null;
  }

  // ── Deal Drag ──
  function handleDealDragStart(e: React.DragEvent, dealId: string, sourceStageId: string) {
    e.stopPropagation();
    dealDragRef.current = { dealId, sourceStageId };
    setDealDragging({ dealId, sourceStageId });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", dealId);
  }

  function handleDealDragEnd() {
    setDealDragging(null);
    setDragOverStage(null);
    dealDragRef.current = null;
  }

  function handleColumnDragOver(e: React.DragEvent, stageId: string) {
    if (!dealDragRef.current) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stageId);
  }

  function handleColumnDragLeave(e: React.DragEvent) {
    const related = e.relatedTarget as HTMLElement;
    if (related && e.currentTarget.contains(related)) return;
    setDragOverStage(null);
  }

  async function handleColumnDrop(e: React.DragEvent, targetStageId: string) {
    e.preventDefault();
    setDragOverStage(null);
    setDealDragging(null);
    const data = dealDragRef.current;
    if (!data) return;
    if (data.sourceStageId === targetStageId) { dealDragRef.current = null; return; }

    const deal = getStageDeals(data.sourceStageId).find((d: any) => d.id === data.dealId);
    if (!deal) return;

    setDealsByStage((prev) =>
      prev.map((g) => {
        if (g.stage.id === data.sourceStageId) return { ...g, deals: g.deals.filter((d: any) => d.id !== data.dealId) };
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
    dealDragRef.current = null;
    router.refresh();
  }

  // ── Stage CRUD ──
  async function handleAddStage() {
    if (!newStageName.trim()) return;
    const res = await fetch(`/admin/api/crm/pipelines/${pipeline.id}/stages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newStageName.toLowerCase().replace(/\s+/g, "-"), label: newStageName, color: "#6b7280", order: stages.length }),
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
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: editingStageLabel }),
    });
    setStages((prev) => prev.map((s) => (s.id === stageId ? { ...s, label: editingStageLabel } : s)));
    setEditingStageId(null);
    router.refresh();
  }

  async function handleDeleteStage(stageId: string) {
    if (!confirm("Delete this stage? Deals will be moved to the first stage.")) return;
    const reassignToId = stages.find((s) => s.id !== stageId)?.id;
    await fetch(`/admin/api/crm/pipelines/${pipeline.id}/stages/${stageId}?reassignToId=${reassignToId || ""}`, { method: "DELETE" });
    setStages((prev) => prev.filter((s) => s.id !== stageId));
    setDealsByStage((prev) => prev.filter((g) => g.stage.id !== stageId));
    setActiveStageMenu(null);
    router.refresh();
  }

  async function handleStageColor(stageId: string, color: string) {
    await fetch(`/admin/api/crm/pipelines/${pipeline.id}/stages/${stageId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ color }),
    });
    setStages((prev) => prev.map((s) => (s.id === stageId ? { ...s, color } : s)));
    setColorPickerStage(null);
  }

  // ── Delete Deal ──
  async function handleDeleteDeal(dealId: string) {
    if (!confirm("Delete this deal? This cannot be undone.")) return;
    await fetch(`/admin/api/crm/deals/${dealId}`, { method: "DELETE" });
    setDealsByStage((prev) => prev.map((g) => ({ ...g, deals: g.deals.filter((d: any) => d.id !== dealId) })));
    setDeletingDealId(null);
    router.refresh();
  }

  // ── Create Deal ──
  function openNewDealModal(stageId?: string) {
    setNewDeal({
      title: "", companyName: "", contactName: "", contactEmail: "", contactPhone: "",
      value: 0, currency: "PKR", stageId: stageId || stages[0]?.id || "",
      expectedClose: "", address: "", city: "", country: "", source: "", dealType: "", priority: "medium", notes: "",
    });
    setShowNewDeal(true);
  }

  async function handleCreateDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!newDeal.title.trim() || !newDeal.stageId) return;
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
            prev.map((g) => g.stage.id === newDeal.stageId
              ? { ...g, deals: [...g.deals, { ...data.deal, company: { name: newDeal.companyName || "Unknown" }, stage }] }
              : g
            )
          );
        }
        setShowNewDeal(false);
        router.refresh();
      }
    } finally { setCreating(false); }
  }

  return (
    <>
      {/* Header */}
      <div className="border-b border-[#1E293B] bg-[#090D16] px-6 py-4">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1">
            <Link href="/admin/pipeline" className="flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-white">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 12L6 8L10 4" /></svg>
              Pipelines
            </Link>
            <h1 className="font-display text-sm font-semibold text-white">{pipeline.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-white/50"><span className="font-semibold text-white">{openDealCount}</span> open</span>
              <span className="text-xs text-white/50"><span className="font-semibold text-white">{totalDeals}</span> total</span>
              <span className="text-xs text-white/50"><span className="font-semibold text-brand">{formatCurrency(totalPipelineValue)}</span> pipeline</span>
              {urgentCount > 0 && <span className="text-xs text-orange-400"><span className="font-semibold">{urgentCount}</span> closing soon</span>}
              {wonCount > 0 && <span className="text-xs text-green-400"><span className="font-semibold">{wonCount}</span> won</span>}
            </div>
          </div>
          <button onClick={() => openNewDealModal()} className="shrink-0 inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
            + New Deal
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto p-6" style={{ minHeight: "calc(100vh - 80px)" }}>
        {stages.map((stage) => {
          const stageDeals = getStageDeals(stage.id);
          const isDragSource = stageDragging === stage.id;
          const isStageDropTarget = stageDropTarget === stage.id && !isDragSource;
          const isDealDropTarget = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              data-stage-col
              className={`flex w-[320px] min-w-[320px] flex-col transition-all duration-150 ${
                isDragSource ? "opacity-40" : ""
              } relative`}
              onDragOver={(e) => handleColumnDragOver(e, stage.id)}
              onDragLeave={handleColumnDragLeave}
              onDrop={(e) => handleColumnDrop(e, stage.id)}
            >
              {/* Drop indicator bar */}
              {isStageDropTarget && (
                <div className={`absolute top-0 bottom-0 w-[3px] bg-brand rounded-full z-20 ${
                  stageDropSide === "left" ? "left-[-2px]" : "right-[-2px]"
                }`} />
              )}

              {/* Column Header — drop target for stage reorder */}
              <div
                className={`flex items-center justify-between rounded-t-[3px] px-4 py-3 transition-all duration-150 ${
                  isStageDropTarget ? "bg-brand/15 ring-2 ring-brand/50" : "bg-[#111827]"
                }`}
                onDragOver={(e) => handleHeaderDragOver(e, stage.id)}
                onDragLeave={handleHeaderDragLeave}
                onDrop={(e) => handleHeaderDrop(e, stage.id)}
              >
                <div className="flex items-center gap-2">
                  {/* Grip — drag source ONLY */}
                  <div
                    draggable
                    onDragStart={(e) => handleStageDragStart(e, stage.id)}
                    onDragEnd={handleStageDragEnd}
                    className={`cursor-grab active:cursor-grabbing select-none ${
                      isDragSource ? "text-brand" : "text-white/30 hover:text-white/60"
                    }`}
                    title="Drag to reorder"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="5" cy="3" r="1.5" /><circle cx="11" cy="3" r="1.5" />
                      <circle cx="5" cy="8" r="1.5" /><circle cx="11" cy="8" r="1.5" />
                      <circle cx="5" cy="13" r="1.5" /><circle cx="11" cy="13" r="1.5" />
                    </svg>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                  {editingStageId === stage.id ? (
                    <input autoFocus value={editingStageLabel} onChange={(e) => setEditingStageLabel(e.target.value)}
                      onBlur={() => handleRenameStage(stage.id)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleRenameStage(stage.id); if (e.key === "Escape") setEditingStageId(null); }}
                      className="bg-transparent text-sm font-bold text-white outline-none border-b border-brand"
                    />
                  ) : (
                    <span className="text-sm font-bold text-white">{stage.label}</span>
                  )}
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/60">{stageDeals.length}</span>
                </div>
                <div className="relative">
                  <button onClick={() => setActiveStageMenu(activeStageMenu === stage.id ? null : stage.id)}
                    className="rounded p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="3" r="1.5" /><circle cx="8" cy="8" r="1.5" /><circle cx="8" cy="13" r="1.5" />
                    </svg>
                  </button>
                  {activeStageMenu === stage.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-[3px] border border-[#1E293B] bg-[#111827] py-1 shadow-xl">
                      <button onClick={() => { setEditingStageId(stage.id); setEditingStageLabel(stage.label); setActiveStageMenu(null); }}
                        className="flex w-full items-center px-3 py-2 text-left text-sm text-white hover:bg-white/5">Rename</button>
                      <button onClick={() => { setColorPickerStage(colorPickerStage === stage.id ? null : stage.id); setActiveStageMenu(null); }}
                        className="flex w-full items-center px-3 py-2 text-left text-sm text-white hover:bg-white/5">Change Color</button>
                      <button onClick={() => handleDeleteStage(stage.id)}
                        className="flex w-full items-center px-3 py-2 text-left text-sm text-red-400 hover:bg-white/5">Delete</button>
                    </div>
                  )}
                  {colorPickerStage === stage.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 rounded-[3px] border border-[#1E293B] bg-[#111827] p-3 shadow-xl">
                      <div className="grid grid-cols-5 gap-2">
                        {["#6b7280","#3b82f6","#8b5cf6","#f59e0b","#22c55e","#ef4444","#06b6d4","#ec4899","#14b8a6","#f97316"].map((c) => (
                          <button key={c} onClick={() => handleStageColor(stage.id, c)}
                            className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${stage.color === c ? "border-white" : "border-transparent"}`}
                            style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Column Body */}
              <div className={`flex flex-1 flex-col gap-2 rounded-b-[3px] border border-t-0 border-[#1E293B] bg-[#090D16] p-2 transition-all duration-150 ${
                isDealDropTarget ? "border-brand/50 bg-brand/5" : ""
              }`}>
                {stageDeals.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center py-8">
                    <p className="text-sm text-white/30">No deals</p>
                  </div>
                ) : (
                  stageDeals.map((deal: any) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDealDragStart(e, deal.id, stage.id)}
                      onDragEnd={handleDealDragEnd}
                      onClick={() => setSelectedDealId(deal.id)}
                      className={`group relative cursor-grab rounded-[3px] border border-[#1E293B] bg-[#111827] p-3 transition-all hover:border-brand/30 hover:shadow-md active:cursor-grabbing ${
                        dealDragging?.dealId === deal.id ? "opacity-50 rotate-1 shadow-xl" : ""
                      }`}
                    >
                      {/* Quick actions */}
                      <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedDealId(deal.id); }}
                          className="rounded bg-[#090D16] p-1 text-white/40 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteDeal(deal.id); }}
                          className="rounded bg-[#090D16] p-1 text-white/40 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>

                      <p className="font-display text-sm font-bold text-white pr-12">{deal.title}</p>
                      <p className="mt-1 text-xs text-white/50">{deal.company?.name || "Unknown"}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{formatCurrency(deal.value)}</span>
                        {deal.expectedClose && (
                          <span className={`text-xs ${isCloseDateSoon(deal.expectedClose) ? "text-orange-400 font-semibold" : "text-white/40"}`}>
                            {new Date(deal.expectedClose).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                      {deal.probability > 0 && deal.probability < 100 && (
                        <div className="mt-2" title={`Win probability: ${deal.probability}%`}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] text-white/40">Win probability</span>
                            <span className="text-[10px] text-white/50">{deal.probability}%</span>
                          </div>
                          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${deal.probability}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <button onClick={() => openNewDealModal(stage.id)}
                  className="mt-1 flex w-full items-center justify-center gap-1 rounded-[3px] border border-dashed border-[#1E293B] py-2 text-xs text-white/40 transition-colors hover:border-brand/50 hover:text-white/60">
                  + Add Deal
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Stage Column */}
        <div className="w-[320px] min-w-[320px]">
          {addingStage ? (
            <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-4">
              <input autoFocus value={newStageName} onChange={(e) => setNewStageName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleAddStage(); if (e.key === "Escape") { setAddingStage(false); setNewStageName(""); } }}
                placeholder="Stage name..." className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              <div className="mt-3 flex gap-2">
                <button onClick={handleAddStage} disabled={!newStageName.trim()}
                  className="flex-1 rounded-[3px] bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-dark disabled:opacity-50">Add</button>
                <button onClick={() => { setAddingStage(false); setNewStageName(""); }}
                  className="flex-1 rounded-[3px] border border-[#1E293B] px-3 py-1.5 text-xs font-bold text-white hover:border-brand">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingStage(true)}
              className="flex w-full items-center justify-center gap-2 rounded-[3px] border border-dashed border-[#1E293B] bg-[#111827]/50 py-16 text-sm text-white/40 transition-colors hover:border-brand/50 hover:text-white/60">
              + Add Stage
            </button>
          )}
        </div>
      </div>

      {/* New Deal Modal */}
      {showNewDeal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-[5vh]">
          <div className="w-full max-w-lg rounded-[3px] bg-[#111827] p-6 shadow-2xl mb-8">
            <h2 className="font-display text-lg font-semibold text-white">New Deal</h2>
            <p className="text-xs text-white/40 mt-0.5">Fill in what you know. Everything is optional except title and stage.</p>

            <form onSubmit={handleCreateDeal} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Deal Title *</label>
                <input type="text" required value={newDeal.title} onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  placeholder="e.g. Website Redesign for Acme Corp"
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Stage *</label>
                  <select required value={newDeal.stageId} onChange={(e) => setNewDeal({ ...newDeal, stageId: e.target.value })}
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value="">Select stage</option>
                    {stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Priority</label>
                  <select value={newDeal.priority} onChange={(e) => setNewDeal({ ...newDeal, priority: e.target.value })}
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Company Name</label>
                <input type="text" value={newDeal.companyName} onChange={(e) => setNewDeal({ ...newDeal, companyName: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
              </div>

              <div className="border-t border-[#1E293B] pt-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Contact Person</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Name</label>
                    <input type="text" value={newDeal.contactName} onChange={(e) => setNewDeal({ ...newDeal, contactName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Email</label>
                    <input type="email" value={newDeal.contactEmail} onChange={(e) => setNewDeal({ ...newDeal, contactEmail: e.target.value })}
                      placeholder="john@acme.com"
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-white/50 mb-1">Phone</label>
                  <input type="tel" value={newDeal.contactPhone} onChange={(e) => setNewDeal({ ...newDeal, contactPhone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
                </div>
              </div>

              <div className="border-t border-[#1E293B] pt-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Deal Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Value</label>
                    <input type="number" value={newDeal.value || ""} onChange={(e) => setNewDeal({ ...newDeal, value: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Currency</label>
                    <select value={newDeal.currency} onChange={(e) => setNewDeal({ ...newDeal, currency: e.target.value })}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                      <option value="PKR">PKR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Expected Close</label>
                    <input type="date" value={newDeal.expectedClose} onChange={(e) => setNewDeal({ ...newDeal, expectedClose: e.target.value })}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Source</label>
                    <select value={newDeal.source} onChange={(e) => setNewDeal({ ...newDeal, source: e.target.value })}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                      <option value="">Select source</option>
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="cold-outreach">Cold Outreach</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="event">Event</option>
                      <option value="ad">Advertisement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-white/50 mb-1">Deal Type</label>
                  <select value={newDeal.dealType} onChange={(e) => setNewDeal({ ...newDeal, dealType: e.target.value })}
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value="">Select type</option>
                    <option value="new-business">New Business</option>
                    <option value="upsell">Upsell</option>
                    <option value="renewal">Renewal</option>
                    <option value="partnership">Partnership</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-[#1E293B] pt-4">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Location</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">City</label>
                    <input type="text" value={newDeal.city} onChange={(e) => setNewDeal({ ...newDeal, city: e.target.value })}
                      placeholder="Lahore"
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Country</label>
                    <input type="text" value={newDeal.country} onChange={(e) => setNewDeal({ ...newDeal, country: e.target.value })}
                      placeholder="Pakistan"
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-white/50 mb-1">Address</label>
                  <input type="text" value={newDeal.address} onChange={(e) => setNewDeal({ ...newDeal, address: e.target.value })}
                    placeholder="Office address"
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand" />
                </div>
              </div>

              <div className="border-t border-[#1E293B] pt-4">
                <label className="block text-xs font-semibold text-white/60 mb-1">Notes</label>
                <textarea rows={3} value={newDeal.notes} onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  placeholder="Any notes about this deal..."
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand resize-none" />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowNewDeal(false)}
                  className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white transition-colors hover:border-brand">Cancel</button>
                <button type="submit" disabled={creating}
                  className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-50">
                  {creating ? "Creating..." : "Create Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Click-away overlays */}
      {(activeStageMenu || colorPickerStage) && (
        <div className="fixed inset-0 z-10" onClick={() => { setActiveStageMenu(null); setColorPickerStage(null); }} />
      )}

      {selectedDealId && (
        <DealPanel dealId={selectedDealId} onClose={() => setSelectedDealId(null)} onDealUpdated={() => { router.refresh(); }} />
      )}
    </>
  );
}
