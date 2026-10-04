"use client";

import { useEffect, useState } from "react";
import { hasSection, isFullAccess, type SectionKey } from "@/lib/access";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  access: string[];
};

export type SessionStatus = {
  hasUsers: boolean;
  user: SessionUser | null;
};

let cached: Promise<SessionStatus | null> | null = null;

/** One status fetch per page load, shared by every consumer. */
function loadStatus(): Promise<SessionStatus | null> {
  if (!cached) {
    cached = fetch("/admin/api/auth/status", { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<SessionStatus>) : null))
      .catch(() => null);
  }
  return cached;
}

export function useAdminSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    loadStatus().then((status) => {
      if (!alive) return;
      setUser(status?.user ?? null);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return {
    user,
    loading,
    isFull: isFullAccess(user),
    can: (section: SectionKey) => hasSection(user, section),
  };
}
