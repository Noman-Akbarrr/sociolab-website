"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { DashShell } from "../../client";
import { DEALS, STAGES, type Deal } from "../../static-data";

interface Stage {
  id: string;
  name: string;
  color: string;
}

function DealCard({ deal, index }: { deal: Deal; index: number }) {
  const priorityColors: Record<string, string> = {
    high: "#F44336",
    medium: "#FF9800",
    low: "#4CAF50",
  };

  return (
    <Draggable draggableId={deal.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border border-gray-200 p-3 mb-2 cursor-grab active:cursor-grabbing transition-shadow ${
            snapshot.isDragging ? "shadow-lg ring-2 ring-[#FF5500]/20" : "hover:shadow-sm"
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-800 leading-tight">{deal.title}</h4>
            <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: priorityColors[deal.priority] }} />
          </div>
          <div className="text-xs text-gray-500 mb-2">{deal.company}</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">${deal.value.toLocaleString()}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-medium text-gray-600">
                {deal.owner.split(" ").map((n) => n[0]).join("")}
              </div>
              {deal.closeDate && (
                <span className="text-[10px] text-gray-400">
                  {new Date(deal.closeDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default function PipelineDetailPage() {
  const [deals, setDeals] = useState<Deal[]>(DEALS);

  const dealsByStage = STAGES.map((stage) => ({
    ...stage,
    deals: deals.filter((d) => d.stage === stage.name),
  }));

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStage = destination.droppableId;
    setDeals((prev) =>
      prev.map((d) => (d.id === draggableId ? { ...d, stage: newStage } : d))
    );
  }

  return (
    <DashShell>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Sales Pipeline</h2>
            <p className="text-sm text-gray-500 mt-0.5">Drag deals between stages to update</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{deals.length}</span> deals ·{" "}
              <span className="font-semibold text-gray-800">
                ${deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
              </span>{" "}
              total
            </div>
            <button
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
            {dealsByStage.map((stage) => (
              <div key={stage.id} className="min-w-[280px] w-[280px] shrink-0">
                {/* Stage header */}
                <div className="rounded-t-lg px-3 py-2 flex items-center justify-between" style={{ backgroundColor: stage.color }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{stage.name}</span>
                    <span className="text-xs text-white/70 bg-white/20 px-1.5 py-0.5 rounded">
                      {stage.deals.length}
                    </span>
                  </div>
                  <span className="text-xs text-white/80 font-medium">
                    ${stage.deals.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                  </span>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={stage.name}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-b-lg min-h-[200px] p-2 transition-colors ${
                        snapshot.isDraggingOver ? "bg-orange-50" : "bg-gray-50"
                      }`}
                    >
                      {stage.deals.map((deal, index) => (
                        <DealCard key={deal.id} deal={deal} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </DashShell>
  );
}
