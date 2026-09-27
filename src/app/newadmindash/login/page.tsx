"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewDashLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/newadmindash/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/newadmindash");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F6FA" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: "#5B8DEF" }}>
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="font-semibold text-gray-800 text-lg">EspoCRM</span>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h1 className="text-base font-semibold text-gray-800 mb-1">Sign in to Dashboard</h1>
          <p className="text-xs text-gray-500 mb-6">Enter your EspoCRM credentials to continue</p>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#5B8DEF] focus:bg-white transition-colors"
                placeholder="admin"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#5B8DEF] focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium text-white rounded transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#5B8DEF" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#4A7CD8")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#5B8DEF")}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          Powered by EspoCRM · Sociolab Dashboard
        </p>
      </div>
    </div>
  );
}
