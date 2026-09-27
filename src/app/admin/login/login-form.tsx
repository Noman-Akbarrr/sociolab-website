"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [hasUsers, setHasUsers] = useState<boolean | null>(null);
  const [mode, setMode] = useState<"login" | "setup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/admin/api/auth/status")
      .then((r) => r.json())
      .then((d) => {
        setHasUsers(d.hasUsers);
        setMode(d.hasUsers ? "login" : "setup");
      })
      .catch(() => setHasUsers(true));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = mode === "setup" ? "/admin/api/auth/first-admin" : "/admin/api/auth/login";
      const body = mode === "setup" ? { name, email, password } : { email, password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (hasUsers === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F6FA" }}>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F6FA" }}>
      <div className="w-full max-w-sm px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded flex items-center justify-center" style={{ backgroundColor: "#FF5500" }}>
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-semibold text-gray-800 text-lg">Sociolab CRM</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h1 className="text-base font-semibold text-gray-800 mb-1">
            {mode === "setup" ? "Create Admin Account" : "Sign in to Dashboard"}
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            {mode === "setup"
              ? "Set up the first admin account for your CRM"
              : "Enter your credentials to continue"}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "setup" && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-[#FF5500] transition-colors"
                  placeholder="John Doe"
                  autoFocus
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-[#FF5500] transition-colors"
                placeholder="you@company.com"
                autoFocus={mode === "login"}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-white text-gray-800 focus:outline-none focus:border-[#FF5500] transition-colors"
                placeholder={mode === "setup" ? "Min 10 chars, upper, lower, number" : "••••••••"}
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
              {loading ? "Please wait..." : mode === "setup" ? "Create Account" : "Sign In"}
            </button>
          </form>

          {mode === "login" && (
            <p className="text-center text-[11px] text-gray-400 mt-4">
              Only invited users can sign in. Contact your admin.
            </p>
          )}
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          Sociolab Dashboard
        </p>
      </div>
    </div>
  );
}
