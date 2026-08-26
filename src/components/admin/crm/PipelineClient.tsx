"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PipelineClientProps {
  initialDealsByStage: any[];
  initialStages: any[];
}

export function PipelineClient({ initialDealsByStage, initialStages }: PipelineClientProps) {
  const router = useRouter();
  const [dealsByStage, setDealsByStage] = useState(initialDealsByStage);
  const [stages] = useState(initialStages);
  const [draggedDeal, setDraggedDeal] = useState<{ id: string; fromStageId: string } | null>(null);

  const formatCurrency = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);

  const handleDragStart = (e: React.DragEvent, dealId: string, fromStageId: string) => {
    setDraggedDeal({ id: dealId, fromStageId });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, toStageId: string) => {
    e.preventDefault();
    if (!draggedDeal || draggedDeal.fromStageId === toStageId) {
      setDraggedDeal(null);
      return;
    }

    const res = await fetch(`/admin/api/crm/deals/${draggedDeal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stageId: toStageId }),
    });

    if (res.ok) {
      setDealsByStage(prev => prev.map(group => {
        if (group.stage.id === draggedDeal.fromStageId) {
          return { ...group, deals: group.deals.filter((d: any) => d.id !== draggedDeal.id) };
        }
        if (group.stage.id === toStageId) {
          const deal = prev.find(g => g.stage.id === draggedDeal.fromStageId)?.deals.find((d: any) => d.id === draggedDeal.id);
          if (deal) return { ...group, deals: [...group.deals, deal] };
        }
        return group;
      }));
    }
    setDraggedDeal(null);
  };

  const totalPipelineValue = dealsByStage
    .filter(g => !g.stage.isClosed || g.stage.isWon)
    .reduce((sum, g) => sum + g.deals.reduce((s: number, d: any) => s + (d.value || 0), 0), 0);

  const wonValue = dealsByStage
    .find(g => g.stage.isWon)?.deals
    .reduce((sum: number, d: any) => sum + (d.value || 0), 0) || 0;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Pipeline</h1>
          <p className="text-sm text-ink/60">Drag deals between stages. Pipeline value: <span className="font-semibold text-brand">{formatCurrency(totalPipelineValue)}</span> | Won this period: <span className="font-semibold text-green-600">{formatCurrency(wonValue)}</span></p>
        </div>
        <Link href="/admin/crm/deals/new" className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark">
          + New Deal
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4" role="list" aria-label="Pipeline stages">
        {stages.map((stage: any) => {
          const group = dealsByStage.find(g => g.stage.id === stage.id);
          const deals = group?.deals || [];
          const stageValue = deals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
          const isDropTarget = draggedDeal && draggedDeal.fromStageId !== stage.id;

          return (
            <div
              key={stage.id}
              className={`min-w-[320px] max-w-[320px] flex flex-col ${isDropTarget ? "ring-2 ring-brand" : ""}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="flex items-center justify-between rounded-t-[3px] px-4 py-3 text-sm font-bold text-white" style={{ backgroundColor: stage.color }}>
                <span>{stage.label}</span>
                <div className="flex items-center gap-2 text-[11px] opacity-90">
                  <span>{deals.length} deals</span>
                  <span>{formatCurrency(stageValue)}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3 rounded-b-[3px] border border-line bg-white p-3 min-h-[500px]">
                {deals.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-ink/40">
                    <p className="text-sm">No deals</p>
                    <p className="text-xs">Drop deals here</p>
                  </div>
                )}
                {deals.map((deal: any) => (
                  <Link
                    key={deal.id}
                    href={`/admin/crm/deals/${deal.id}`}
                    className={`group flex flex-col gap-2 rounded-[3px] border border-line bg-white p-3 transition-shadow hover:shadow-md ${draggedDeal?.id === deal.id ? "opacity-50" : ""}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id, group.stage.id)}
                  >
                    <span className="font-display text-sm font-semibold text-ink group-hover:text-brand">{deal.title}</span>
                    <div className="flex items-center justify-between text-xs text-ink/50">
                      <span className="truncate">{deal.company.name}</span>
                      <span className="shrink-0">{formatCurrency(deal.value)}</span>
                    </div>
                    {deal.expectedClose && (
                      <span className="text-[11px] text-orange-600">Closes {new Date(deal.expectedClose).toLocaleDateString()}</span>
                    )}
                    {deal.probability < 100 && deal.probability > 0 && (
                      <div className="h-1.5 bg-mist rounded-full overflow-hidden">
                        <div className="h-full bg-brand" style={{ width: `${deal.probability}%` }} />
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}