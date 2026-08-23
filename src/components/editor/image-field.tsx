"use client";

import { useRef, useState } from "react";

export function ImageField({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("/admin/api/upload", { method: "POST", body: form });
      const json = await res.json();
      if (res.ok) {
        onChange(json.url);
      } else {
        setError(json.error ?? "Upload failed.");
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label ? <span className="text-xs font-semibold text-ink/70">{label}</span> : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-16 w-24 rounded-[3px] border border-line bg-mist object-cover"
          />
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-[3px] bg-ink px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-left text-xs font-semibold text-red-600 hover:underline"
            >
              Remove image
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-[3px] border-2 border-dashed border-line bg-mist px-3 py-4 text-xs font-semibold text-ink/60 transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "+ Upload image"}
        </button>
      )}
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="…or paste an image URL"
        className="w-full rounded-[3px] border border-line bg-white px-3 py-2 font-mono text-xs text-ink outline-none placeholder:text-ink/35 focus:border-brand"
      />
      {error ? <span className="text-xs font-semibold text-red-600">{error}</span> : null}
    </div>
  );
}