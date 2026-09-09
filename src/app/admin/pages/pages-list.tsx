"use client";

import { useState } from "react";
import Link from "next/link";
import type { Data } from "@puckeditor/core";
import type { PageGroup } from "@/lib/admin-groups";
import { EditorOverlay } from "@/app/admin/edit/editor-overlay";
import { NewPageForm } from "./new-page";

export function PagesListClient({ groups }: { groups: PageGroup[] }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorPath, setEditorPath] = useState("");
  const [editorData, setEditorData] = useState<Data>({ root: { props: {} }, content: [] });
  const [loading, setLoading] = useState(false);

  async function openPage(path: string) {
    setLoading(true);
    try {
      const res = await fetch(`/admin/api/page?path=${encodeURIComponent(path)}`);
      const json = await res.json();
      setEditorPath(path);
      setEditorData(json.data ?? { root: { props: {} }, content: [] });
      setEditorOpen(true);
    } catch {
      setEditorPath(path);
      setEditorData({ root: { props: {} }, content: [] });
      setEditorOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="px-8 py-10">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-white">Pages</h1>
          <p className="mt-1 text-sm text-white/50">Manage your website pages and blog posts.</p>
        </div>

        <div className="mt-10 flex flex-col gap-10">
          {groups.map((group) => (
            <section key={group.key}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-semibold text-white">{group.label}</h2>
                  <p className="text-xs text-white/50">{group.hint}</p>
                </div>
                <NewPageForm group={group.key} prefix={group.prefix} />
              </div>
              <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] overflow-hidden">
                <ul className="divide-y divide-[#1E293B]">
                  {group.pages.map((page) => (
                    <li key={page.path}>
                      <button
                        onClick={() => openPage(page.path)}
                        disabled={loading}
                        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#1E293B]/50 disabled:opacity-50"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-display text-sm font-semibold text-white">
                            {page.title || "Untitled page"}
                          </span>
                          <span className="font-mono text-xs text-white/40">{page.path}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-white/40">
                            {page.updatedAt
                              ? `Edited ${new Date(page.updatedAt).toLocaleDateString()}`
                              : "Not edited"}
                          </span>
                          <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </div>

      {editorOpen ? (
        <EditorOverlay
          path={editorPath}
          initialData={editorData}
          onClose={() => setEditorOpen(false)}
        />
      ) : null}
    </>
  );
}
