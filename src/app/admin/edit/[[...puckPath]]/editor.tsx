"use client";

import "@puckeditor/core/puck.css";
import { useState } from "react";
import { Puck } from "@puckeditor/core";
import type { Data } from "@puckeditor/core";
import config from "@/puck.config";
import { ImageField } from "@/components/editor/image-field";
import { ColorField } from "@/components/editor/color-field";

export function PuckEditor({ path, initialData }: { path: string; initialData: Data }) {
  const [status, setStatus] = useState<{ kind: "idle" | "saving" | "ok" | "error"; text: string }>({
    kind: "idle",
    text: "",
  });

  return (
    <div className="relative h-[calc(100vh-3.5rem)]">
      <div className="pointer-events-none fixed top-16 left-1/2 z-50 -translate-x-1/2">
        {status.kind === "ok" ? (
          <span className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-bold text-white">
            {status.text}
          </span>
        ) : status.kind === "error" ? (
          <span className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white">
            {status.text}
          </span>
        ) : status.kind === "saving" ? (
          <span className="rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-white">
            {status.text}
          </span>
        ) : null}
      </div>
      <Puck
        config={config}
        data={initialData}
        overrides={{
          fieldTypes: { image: ImageField, color: ColorField } as any,
        }}
        onPublish={async (data) => {
          setStatus({ kind: "saving", text: "Saving…" });
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
  );
}