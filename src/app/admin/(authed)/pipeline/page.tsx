"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { DashShell } from "../client";
import { PIPELINES } from "../static-data";

export default function PipelineListPage() {
  return (
    <DashShell>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Pipelines</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage your sales pipelines</p>
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
            Create Pipeline
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PIPELINES.map((pipeline, i) => (
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
                      <p className="text-xs text-gray-500 mt-0.5">{pipeline.description}</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-[#FF5500] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-lg font-bold text-gray-800">{pipeline.dealCount}</div>
                    <div className="text-[11px] text-gray-500">Deals</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-800">${(pipeline.totalValue / 1000).toFixed(0)}K</div>
                    <div className="text-[11px] text-gray-500">Total Value</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashShell>
  );
}
