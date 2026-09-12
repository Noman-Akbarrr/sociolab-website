"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import TopBar from "./top-bar";

export default function AdminLayout({
  children,
  userName,
  userRole,
}: {
  children: React.ReactNode;
  userName: string;
  userRole: string;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-mist">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} role={userRole} />
      <div
        className="transition-[margin] duration-200 ease-in-out"
        style={{ marginLeft: collapsed ? "4rem" : "16rem" }}
      >
        <TopBar userName={userName} userRole={userRole} />
        <main>{children}</main>
      </div>
    </div>
  );
}
