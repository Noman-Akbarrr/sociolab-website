"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function VerifyForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isRecovery, setIsRecovery] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/admin/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, isRecovery }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error ?? "That code isn't valid.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
      <div>
        <label htmlFor="code" className="mb-1.5 block text-sm font-semibold text-ink">
          {isRecovery ? "Recovery code" : "Authenticator code"}
        </label>
        <input
          id="code"
          required
          autoFocus
          autoComplete="one-time-code"
          inputMode={isRecovery ? "text" : "numeric"}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={isRecovery ? "XXXX-XXXX" : "000000"}
          className="w-full rounded-[3px] border border-line bg-white px-4 py-3 font-mono text-sm tracking-widest text-ink outline-none transition-colors focus:border-brand"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          setIsRecovery((v) => !v);
          setCode("");
        }}
        className="self-start text-xs font-semibold text-ink/55 underline-offset-2 hover:underline"
      >
        {isRecovery ? "Use authenticator code instead" : "Use a recovery code instead"}
      </button>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-[3px] bg-brand px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}
