"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { TopBar } from "./components/top-bar";

export function DashShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F6FA" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-60">
        <TopBar onMenuToggle={() => setSidebarOpen((p) => !p)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
