"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PipelineGridProps {
  pipelines: any[];
}

export function PipelineGrid({ pipelines: initialPipelines }: PipelineGridProps) {
  const router = useRouter();
  const [pipelines, setPipelines] = useState(initialPipelines);
  const [showNew, setShowNew] = useState(false);
  const [newPipeline, setNewPipeline] = useState({ name: "", description: "", color: "#3b82f6" });
  const [creating, setCreating] = useState(false);

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "PKR", maximumFractionDigits: 0 }).format(cents / 100);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newPipeline.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/admin/api/crm/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPipeline),
      });
      if (res.ok) {
        const data = await res.json();
        setPipelines([...pipelines, { ...data.pipeline, dealCount: 0, totalValue: 0 }]);
        setShowNew(false);
        setNewPipeline({ name: "", description: "", color: "#3b82f6" });
        router.refresh();
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Pipelines</h1>
          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-2 rounded-[3px] bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            + New Pipeline
          </button>
        </div>
        <p className="text-sm text-white/60">Manage your sales pipelines and stages.</p>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-white">New Pipeline</h2>
            <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={newPipeline.name}
                  onChange={(e) => setNewPipeline({ ...newPipeline, name: e.target.value })}
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  placeholder="e.g. Enterprise Sales"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Description</label>
                <textarea
                  value={newPipeline.description}
                  onChange={(e) => setNewPipeline({ ...newPipeline, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
                  placeholder="Optional description"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newPipeline.color}
                    onChange={(e) => setNewPipeline({ ...newPipeline, color: e.target.value })}
                    className="h-10 w-10 cursor-pointer rounded border border-[#1E293B] bg-transparent"
                  />
                  <span className="text-sm text-white/60">{newPipeline.color}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white transition-colors hover:border-brand"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pipelines.map((pipeline) => (
          <button
            key={pipeline.id}
            onClick={() => router.push(`/admin/pipeline/${pipeline.id}`)}
            className="flex flex-col rounded-[3px] border border-[#1E293B] bg-[#111827] text-left transition-all hover:border-brand/50 hover:shadow-lg"
          >
            <div className="h-1 rounded-t-[3px]" style={{ backgroundColor: pipeline.color }} />
            <div className="flex flex-1 flex-col gap-2 p-5">
              <h3 className="font-display text-lg font-bold text-white">{pipeline.name}</h3>
              {pipeline.description && (
                <p className="line-clamp-2 text-sm text-white/50">{pipeline.description}</p>
              )}
              <div className="mt-auto flex items-center justify-between pt-4 text-sm">
                <span className="text-white/60">
                  {pipeline.dealCount} {pipeline.dealCount === 1 ? "deal" : "deals"}
                </span>
                <span className="font-semibold text-white">{formatCurrency(pipeline.totalValue)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {pipelines.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-white/50">No pipelines yet. Create your first one to get started.</p>
        </div>
      )}
    </>
  );
}