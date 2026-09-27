"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    if (email === "admin@sociolab.com" && password === "admin") {
      document.cookie = "newadmindash_session=authenticated; path=/newadmindash; max-age=86400";
      router.push("/newadmindash");
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F6FA" }}>
      <div className="w-full max-w-sm px-4">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: "#FF5500" }}>
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-semibold text-gray-800 text-lg">Sociolab CRM</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h1 className="text-base font-semibold text-gray-800 mb-1">Sign in to Dashboard</h1>
          <p className="text-xs text-gray-500 mb-6">Enter your credentials to continue</p>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors"
                placeholder="admin@sociolab.com"
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
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-60"
              style={{ backgroundColor: "#FF5500" }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#E04B00")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FF5500")}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          Sociolab Dashboard · Powered by Sociolab
        </p>
      </div>
    </div>
  );
}
