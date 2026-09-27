"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { DashShell } from "../client";

interface Pipeline {
  id: string;
  name: string;
  description: string | null;
  color: string;
  stageCount: number;
  dealCount: number;
  createdAt: string;
}

export default function PipelineListPage() {
  const router = useRouter();
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formColor, setFormColor] = useState("#FF5500");
  const [saving, setSaving] = useState(false);

  async function loadPipelines() {
    try {
      const res = await fetch("/admin/api/crm/pipelines");
      if (res.ok) setPipelines(await res.json());
    } catch (e) {
      console.error("Failed to fetch pipelines", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPipelines();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/admin/api/crm/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim(), description: formDesc.trim() || null, color: formColor }),
      });
      if (res.ok) {
        setShowModal(false);
        setFormName("");
        setFormDesc("");
        setFormColor("#FF5500");
        loadPipelines();
      }
    } catch (e) {
      console.error("Failed to create pipeline", e);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this pipeline? Deals in it will be orphaned.")) return;
    try {
      const res = await fetch(`/admin/api/crm/pipelines/${id}`, { method: "DELETE" });
      if (res.ok) loadPipelines();
    } catch (e) {
      console.error("Failed to delete pipeline", e);
    }
  }

  return (
    <DashShell>
    <div>
      <div className="flex items-center justify-between mb-6">
        <div />
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
          style={{ backgroundColor: "#FF5500" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E04B00")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF5500")}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Pipeline
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-[#FF5500] rounded-full animate-spin" />
        </div>
      ) : pipelines.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">No pipelines yet. Create your first one.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelines.map((pipeline, i) => (
            <motion.div
              key={pipeline.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link
                href={`/admin/pipeline/${pipeline.id}`}
                className="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-10 rounded-full" style={{ backgroundColor: pipeline.color }} />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#FF5500] transition-colors">{pipeline.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{pipeline.description || "No description"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(e, pipeline.id)}
                      className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete pipeline"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-[#FF5500] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-lg font-bold text-gray-800">{pipeline.dealCount}</div>
                    <div className="text-[11px] text-gray-500">Deals</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">{pipeline.stageCount}</div>
                    <div className="text-[11px] text-gray-500">Stages</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create Pipeline</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                  placeholder="e.g. Sales Pipeline"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF5500]/30 focus:border-[#FF5500]"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">{formColor}</span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  {saving ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </DashShell>
  );
}
