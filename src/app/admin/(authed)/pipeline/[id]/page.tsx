"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { DashShell } from "../../client";
import { DealPanel, type PanelDeal } from "./deal-panel";

interface PipelineOwner {
  id: string;
  name: string;
  email: string;
}

interface PipelineCompany {
  id: string;
  name: string;
}

interface PipelineStage {
  id: string;
  name: string;
  label: string;
  order: number;
  color: string;
  isClosed: boolean;
  isWon: boolean;
}

interface PipelineDeal {
  id: string;
  title: string;
  value: number;
  priority: string;
  companyId: string;
  company: PipelineCompany | null;
  stageId: string;
  owner: PipelineOwner | null;
  expectedClose: string | null;
  source: string | null;
}

interface PipelineData {
  id: string;
  name: string;
  description: string | null;
  color: string;
  stages: PipelineStage[];
  deals: PipelineDeal[];
}

interface Company {
  id: string;
  name: string;
}

const priorityColors: Record<string, string> = {
  high: "#F44336",
  medium: "#FF9800",
  low: "#4CAF50",
};

/** Pick black/white text that stays readable on any stage color. */
function readableText(hex: string | null | undefined): string {
  if (!hex) return "#FFFFFF";
  let c = hex.replace("#", "").trim();
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  if (c.length !== 6) return "#FFFFFF";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma > 0.62 ? "#111827" : "#FFFFFF";
}

function StageIconButton({
  title,
  onClick,
  color,
  hoverBg,
  children,
}: {
  title: string;
  onClick: () => void;
  color: string;
  hoverBg: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
      style={{ color }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      {children}
    </button>
  );
}

function DealCard({
  deal,
  index,
  onOpen,
}: {
  deal: PipelineDeal;
  index: number;
  onOpen: (id: string) => void;
}) {
  return (
    <Draggable draggableId={`deal-${deal.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          role="button"
          tabIndex={0}
          onClick={() => {
            if (snapshot.isDragging) return;
            onOpen(deal.id);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") onOpen(deal.id);
          }}
          title="Open deal"
          className={`mb-2 cursor-grab rounded-lg border bg-white p-3 transition-shadow active:cursor-grabbing ${
            snapshot.isDragging
              ? "shadow-lg ring-2 ring-[#FF5500]/20 opacity-90"
              : "border-gray-200 hover:border-[#FF5500]/40 hover:shadow-sm"
          }`}
        >
          <div className="mb-2 flex items-start justify-between">
            <h4 className="text-sm font-medium leading-tight text-gray-800">{deal.title}</h4>
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: priorityColors[deal.priority] ?? "#9CA3AF" }}
              />
              <button
                type="button"
                title="Open deal details"
                onClick={(e) => {
                  e.stopPropagation();
                  if (snapshot.isDragging) return;
                  onOpen(deal.id);
                }}
                className="shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-orange-50 hover:text-[#FF5500]"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.863 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.683-12.68z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="mb-2 text-xs text-gray-500">{deal.company?.name ?? "—"}</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">Rs. {deal.value.toLocaleString()}</span>
            <div className="flex items-center gap-1.5">
              {deal.owner && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[8px] font-medium text-gray-600">
                  {deal.owner.name.split(" ").map((n) => n[0]).join("")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default function PipelineDetailPage() {
  const params = useParams();
  const pipelineId = params.id as string;

  const [pipeline, setPipeline] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);

  // Pipeline edit modal
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [pipeForm, setPipeForm] = useState({ name: "", description: "", color: "#FF5500" });
  const [pipeSaving, setPipeSaving] = useState(false);

  // Modals
  const [showStageModal, setShowStageModal] = useState(false);
  const [stageFormName, setStageFormName] = useState("");
  const [stageFormColor, setStageFormColor] = useState("#6B7280");
  const [stageSaving, setStageSaving] = useState(false);

  const [showDealModal, setShowDealModal] = useState(false);
  const [dealForm, setDealForm] = useState({ title: "", companyId: "", value: "", priority: "medium", source: "", expectedClose: "" });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [dealSaving, setDealSaving] = useState(false);

  // Deal side panel
  const [openDealId, setOpenDealId] = useState<string | null>(null);
  const suppressClickRef = useRef(false);

  const loadData = useCallback(async () => {
    try {
      const res = await fetch(`/admin/api/crm/pipelines/${pipelineId}`);
      if (res.ok) {
        const data = await res.json();
        setPipeline(data);
      }
    } catch (e) {
      console.error("Failed to load pipeline", e);
    } finally {
      setLoading(false);
    }
  }, [pipelineId]);

  useEffect(() => {
    let active = true;
    (async () => {
      // Deep link from the Deals list: /admin/pipeline/:id?deal=<dealId>
      const dealParam = new URLSearchParams(window.location.search).get("deal");
      if (active && dealParam) setOpenDealId(dealParam);
      try {
        const res = await fetch(`/admin/api/crm/pipelines/${pipelineId}`);
        if (res.ok) {
          const data = await res.json();
          if (active) setPipeline(data);
        }
      } catch (e) {
        console.error("Failed to load pipeline", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [pipelineId]);

  async function loadCompanies() {
    try {
      const res = await fetch("/admin/api/crm/companies");
      if (res.ok) setCompanies(await res.json());
    } catch (e) {
      console.error("Failed to load companies", e);
    }
  }

  function openDealModal() {
    loadCompanies();
    setDealForm({ title: "", companyId: "", value: "", priority: "medium", source: "", expectedClose: "" });
    setShowDealModal(true);
  }

  function openDealPanel(id: string) {
    if (suppressClickRef.current) return;
    setOpenDealId(id);
  }

  function handleDealSaved(updated: PanelDeal) {
    setPipeline((prev) =>
      prev ? { ...prev, deals: prev.deals.map((d) => (d.id === updated.id ? updated : d)) } : prev
    );
  }

  function handleDealDeleted(dealId: string) {
    setPipeline((prev) => (prev ? { ...prev, deals: prev.deals.filter((d) => d.id !== dealId) } : prev));
  }

  // Deal DnD between stages only
  async function onDragEnd(result: DropResult) {
    if (!pipeline) return;
    const { source, destination, draggableId } = result;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 250);
    if (!destination) return;

    if (!draggableId.startsWith("deal-")) return;

    const dealId = draggableId.replace("deal-", "");
    const sourceStageId = source.droppableId;
    const destStageId = destination.droppableId;
    if (sourceStageId === destStageId && source.index === destination.index) return;

    const newStageId = destStageId;
    const updatedDeals = pipeline.deals.map((d) =>
      d.id === dealId ? { ...d, stageId: newStageId } : d
    );
    setPipeline({ ...pipeline, deals: updatedDeals });

    try {
      await fetch(`/admin/api/crm/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageId: newStageId }),
      });
    } catch (e) {
      console.error("Failed to move deal", e);
      loadData();
    }
  }

  // Move stage via arrow buttons
  async function moveStage(stageId: string, direction: "left" | "right") {
    if (!pipeline) return;
    const idx = pipeline.stages.findIndex((s) => s.id === stageId);
    if (idx < 0) return;
    const swapIdx = direction === "left" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= pipeline.stages.length) return;

    const newStages = [...pipeline.stages];
    [newStages[idx], newStages[swapIdx]] = [newStages[swapIdx], newStages[idx]];
    const newStageIds = newStages.map((s) => s.id);

    setPipeline({ ...pipeline, stages: newStages });

    try {
      await fetch(`/admin/api/crm/pipelines/${pipelineId}/stages/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stageIds: newStageIds }),
      });
    } catch (e) {
      console.error("Failed to reorder stages", e);
      loadData();
    }
  }

  // Edit pipeline
  function openPipelineModal() {
    if (!pipeline) return;
    setPipeForm({
      name: pipeline.name,
      description: pipeline.description ?? "",
      color: pipeline.color,
    });
    setShowPipelineModal(true);
  }

  async function handleEditPipeline(e: React.FormEvent) {
    e.preventDefault();
    if (!pipeForm.name.trim()) return;
    setPipeSaving(true);
    try {
      const res = await fetch(`/admin/api/crm/pipelines/${pipelineId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pipeForm.name.trim(),
          description: pipeForm.description.trim() || null,
          color: pipeForm.color,
        }),
      });
      if (res.ok) {
        setShowPipelineModal(false);
        loadData();
      }
    } catch (e) {
      console.error("Failed to update pipeline", e);
    } finally {
      setPipeSaving(false);
    }
  }

  // Create stage
  async function handleCreateStage(e: React.FormEvent) {
    e.preventDefault();
    if (!stageFormName.trim()) return;
    setStageSaving(true);
    try {
      const res = await fetch(`/admin/api/crm/pipelines/${pipelineId}/stages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: stageFormName.trim(), color: stageFormColor }),
      });
      if (res.ok) {
        setShowStageModal(false);
        setStageFormName("");
        setStageFormColor("#6B7280");
        loadData();
      }
    } catch (e) {
      console.error("Failed to create stage", e);
    } finally {
      setStageSaving(false);
    }
  }

  // Delete stage
  async function handleDeleteStage(stageId: string) {
    if (!confirm("Delete this stage? Deals will move to the first remaining stage.")) return;
    try {
      const res = await fetch(`/admin/api/crm/pipelines/${pipelineId}/stages/${stageId}`, { method: "DELETE" });
      if (res.ok) loadData();
    } catch (e) {
      console.error("Failed to delete stage", e);
    }
  }

  // Create deal
  async function handleCreateDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!dealForm.title.trim() || !dealForm.companyId || !pipeline?.stages.length) return;
    setDealSaving(true);
    try {
      const stageId = pipeline.stages[0].id;
      const res = await fetch("/admin/api/crm/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: dealForm.title.trim(),
          companyId: dealForm.companyId,
          pipelineId,
          stageId,
          value: dealForm.value ? Number(dealForm.value) : 0,
          priority: dealForm.priority,
          source: dealForm.source || null,
          expectedClose: dealForm.expectedClose || null,
        }),
      });
      if (res.ok) {
        setShowDealModal(false);
        setDealForm({ title: "", companyId: "", value: "", priority: "medium", source: "", expectedClose: "" });
        loadData();
      }
    } catch (e) {
      console.error("Failed to create deal", e);
    } finally {
      setDealSaving(false);
    }
  }

  if (loading) {
    return (
      <DashShell>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-[#FF5500] rounded-full animate-spin" />
        </div>
      </DashShell>
    );
  }

  if (!pipeline) {
    return (
      <DashShell>
        <div className="text-center py-20 text-gray-400 text-sm">Pipeline not found</div>
      </DashShell>
    );
  }

  const totalValue = pipeline.deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <DashShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-10 w-1.5 rounded-full" style={{ backgroundColor: pipeline.color }} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900">{pipeline.name}</h1>
              <button
                type="button"
                onClick={openPipelineModal}
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#FF5500]"
                title="Edit pipeline"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.863 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.683-12.68z"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {pipeline.description ? `${pipeline.description} · ` : ""}
              <span className="font-semibold text-gray-800">{pipeline.deals.length}</span> deals ·{" "}
              <span className="font-semibold text-gray-800">Rs. {totalValue.toLocaleString()}</span> total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStageModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Stage
          </button>
          <button
            onClick={openDealModal}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
            style={{ backgroundColor: "#FF5500" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Deal
          </button>
        </div>
      </div>

      <DragDropContext
        onDragStart={() => {
          suppressClickRef.current = true;
        }}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipeline.stages.map((stage, stageIdx) => {
            const stageDeals = pipeline.deals.filter((d) => d.stageId === stage.id);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            const txt = readableText(stage.color);
            const light = txt === "#111827";
            const hoverBg = light ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.20)";
            const badgeBg = light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.20)";
            return (
              <div
                key={stage.id}
                className="min-w-[280px] w-[280px] shrink-0 rounded-lg"
              >
                {/* Stage header */}
                <div
                  className="rounded-t-lg px-3 py-2 flex items-center justify-between"
                  style={{ backgroundColor: stage.color, color: txt }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stage.name}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: badgeBg }}
                    >
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium mr-1 opacity-80">
                      Rs. {stageValue.toLocaleString()}
                    </span>
                    {stageIdx > 0 && (
                      <StageIconButton
                        title="Move left"
                        onClick={() => moveStage(stage.id, "left")}
                        color={txt}
                        hoverBg={hoverBg}
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </StageIconButton>
                    )}
                    {stageIdx < pipeline.stages.length - 1 && (
                      <StageIconButton
                        title="Move right"
                        onClick={() => moveStage(stage.id, "right")}
                        color={txt}
                        hoverBg={hoverBg}
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </StageIconButton>
                    )}
                    <StageIconButton
                      title="Delete stage"
                      onClick={() => handleDeleteStage(stage.id)}
                      color={txt}
                      hoverBg={hoverBg}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </StageIconButton>
                  </div>
                </div>

                {/* Droppable deal area */}
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-b-lg min-h-[200px] p-2 transition-colors ${
                        snapshot.isDraggingOver ? "bg-orange-50" : "bg-gray-50"
                      }`}
                    >
                      {stageDeals.map((deal, index) => (
                        <DealCard key={deal.id} deal={deal} index={index} onOpen={openDealPanel} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Deal side panel */}
      <DealPanel
        dealId={openDealId}
        stages={pipeline.stages}
        onClose={() => setOpenDealId(null)}
        onSaved={handleDealSaved}
        onDeleted={handleDealDeleted}
      />

      {/* Edit Pipeline Modal */}
      {showPipelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowPipelineModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Pipeline</h3>
            <form onSubmit={handleEditPipeline} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={pipeForm.name}
                  onChange={(e) => setPipeForm({ ...pipeForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                  placeholder="e.g. Sales Pipeline"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={pipeForm.description}
                  onChange={(e) => setPipeForm({ ...pipeForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={pipeForm.color}
                    onChange={(e) => setPipeForm({ ...pipeForm, color: e.target.value })}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">{pipeForm.color}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPipelineModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pipeSaving || !pipeForm.name.trim()}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  {pipeSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Stage Modal */}
      {showStageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowStageModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Stage</h3>
            <form onSubmit={handleCreateStage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={stageFormName}
                  onChange={(e) => setStageFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                  placeholder="e.g. Negotiation"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={stageFormColor}
                    onChange={(e) => setStageFormColor(e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">{stageFormColor}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStageModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={stageSaving || !stageFormName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  {stageSaving ? "Adding..." : "Add Stage"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {showDealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDealModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Deal</h3>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={dealForm.title}
                  onChange={(e) => setDealForm({ ...dealForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                  placeholder="e.g. Website Redesign"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <select
                  value={dealForm.companyId}
                  onChange={(e) => setDealForm({ ...dealForm, companyId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                >
                  <option value="">Select company</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value (PKR)</label>
                <input
                  type="number"
                  value={dealForm.value}
                  onChange={(e) => setDealForm({ ...dealForm, value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={dealForm.priority}
                  onChange={(e) => setDealForm({ ...dealForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <input
                  type="text"
                  value={dealForm.source}
                  onChange={(e) => setDealForm({ ...dealForm, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                  placeholder="e.g. Website, Referral"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
                <input
                  type="date"
                  value={dealForm.expectedClose}
                  onChange={(e) => setDealForm({ ...dealForm, expectedClose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDealModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dealSaving || !dealForm.title.trim() || !dealForm.companyId}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  {dealSaving ? "Creating..." : "Create Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashShell>
  );
}
