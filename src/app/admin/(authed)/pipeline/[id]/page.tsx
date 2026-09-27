"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";

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

function DealCard({ deal, index }: { deal: PipelineDeal; index: number }) {
  return (
    <Draggable draggableId={`deal-${deal.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border border-gray-200 p-3 mb-2 cursor-grab active:cursor-grabbing transition-shadow ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-[#FF5500]/20 opacity-90" : "hover:shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-800 leading-tight">{deal.title}</h4>
            <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: priorityColors[deal.priority] ?? "#9CA3AF" }} />
          </div>
          <div className="text-xs text-gray-500 mb-2">{deal.company?.name ?? "—"}</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">Rs. {deal.value.toLocaleString()}</span>
            <div className="flex items-center gap-1.5">
              {deal.owner && (
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-medium text-gray-600">
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

  // Modals
  const [showStageModal, setShowStageModal] = useState(false);
  const [stageFormName, setStageFormName] = useState("");
  const [stageFormColor, setStageFormColor] = useState("#6B7280");
  const [stageSaving, setStageSaving] = useState(false);

  const [showDealModal, setShowDealModal] = useState(false);
  const [dealForm, setDealForm] = useState({ title: "", companyId: "", value: "", priority: "medium", source: "", expectedClose: "" });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [dealSaving, setDealSaving] = useState(false);

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
    loadData();
  }, [loadData]);

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
    if (pipeline?.stages.length) {
      setDealForm({ title: "", companyId: "", value: "", priority: "medium", source: "", expectedClose: "" });
    }
    setShowDealModal(true);
  }

  // Stage reorder via DnD
  async function onDragEnd(result: DropResult) {
    if (!pipeline) return;
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Stage reorder
    if (draggableId.startsWith("stage-")) {
      const stageId = draggableId.replace("stage-", "");
      if (source.index === destination.index) return;
      const newStageIds = pipeline.stages.map((s) => s.id);
      newStageIds.splice(source.index, 1);
      newStageIds.splice(destination.index, 0, stageId);
      const reordered = newStageIds.map((id) => pipeline.stages.find((s) => s.id === id)!);
      setPipeline({ ...pipeline, stages: reordered });
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
      return;
    }

    // Deal move
    if (draggableId.startsWith("deal-")) {
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
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-[#FF5500] rounded-full animate-spin" />
      </div>
    );
  }

  if (!pipeline) {
    return <div className="text-center py-20 text-gray-400 text-sm">Pipeline not found</div>;
  }

  const totalValue = pipeline.deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div />
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{pipeline.deals.length}</span> deals ·{" "}
            <span className="font-semibold text-gray-800">Rs. {totalValue.toLocaleString()}</span> total
          </div>
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E04B00")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF5500")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Deal
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipeline.stages.map((stage) => {
            const stageDeals = pipeline.deals.filter((d) => d.stageId === stage.id);
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
            return (
              <Draggable key={stage.id} draggableId={`stage-${stage.id}`} index={stage.order}>
                {(prov, snap) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    className={`min-w-[280px] w-[280px] shrink-0 rounded-lg ${snap.isDragging ? "shadow-xl opacity-95" : ""}`}
                  >
                    {/* Stage header */}
                    <div
                      className="rounded-t-lg px-3 py-2 flex items-center justify-between cursor-grab active:cursor-grabbing"
                      style={{ backgroundColor: stage.color }}
                      {...prov.dragHandleProps}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{stage.name}</span>
                        <span className="text-xs text-white/70 bg-white/20 px-1.5 py-0.5 rounded">
                          {stageDeals.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/80 font-medium">
                          Rs. {stageValue.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleDeleteStage(stage.id)}
                          className="p-0.5 rounded text-white/50 hover:text-white hover:bg-white/20 transition-colors"
                          title="Delete stage"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
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
                            <DealCard key={deal.id} deal={deal} index={index} />
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                )}
              </Draggable>
            );
          })}
        </div>
      </DragDropContext>

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
    </div>
  );
}
