"use client";

import "@puckeditor/core/puck.css";
import { useState } from "react";
import { Puck } from "@puckeditor/core";
import type { Data } from "@puckeditor/core";
import config from "@/puck.config";
import { ImageField } from "@/components/editor/image-field";
import { ColorField } from "@/components/editor/color-field";

export function EditorOverlay({
  path,
  initialData,
  onClose,
}: {
  path: string;
  initialData: Data;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "ok" | "error"; text: string }>({
    kind: "idle",
    text: "",
  });

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#0F172A]">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#1E293B] bg-[#111827] px-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-[3px] px-3 py-1.5 text-sm font-medium text-white/70 transition-colors hover:bg-[#1E293B] hover:text-white"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/50">{path}</span>
          {status.kind !== "idle" ? (
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                status.kind === "ok"
                  ? "bg-green-600 text-white"
                  : status.kind === "error"
                    ? "bg-red-600 text-white"
                    : "bg-[#1E293B] text-white"
              }`}
            >
              {status.text}
            </span>
          ) : null}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Puck
          config={config}
          data={initialData}
          overrides={{
            fieldTypes: { image: ImageField, color: ColorField } as any,
          }}
          onPublish={async (data) => {
            setStatus({ kind: "saving", text: "Saving..." });
            try {
              const root = data.root?.props as { title?: string; description?: string } | undefined;
              const res = await fetch("/admin/api/page", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  path,
                  title: root?.title ?? "",
                  description: root?.description ?? "",
                  data,
                }),
              });
              const json = await res.json();
              if (res.ok) {
                setStatus({ kind: "ok", text: "Saved — live on the site." });
              } else {
                setStatus({ kind: "error", text: json.error ?? "Save failed." });
              }
            } catch {
              setStatus({ kind: "error", text: "Save failed." });
            }
          }}
        />
      </div>
    </div>
  );
}
