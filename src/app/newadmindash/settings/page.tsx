"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashShell } from "../client";

const tabs = ["Profile", "Password", "Team"] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"Profile" | "Password" | "Team">("Profile");

  return (
    <DashShell>
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Settings</h2>

        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-[#FF5500]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="settings-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: "#FF5500" }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "Profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white rounded-lg border border-gray-200 p-6 max-w-lg"
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white" style={{ backgroundColor: "#FF5500" }}>
                    A
                  </div>
                  <button className="text-sm font-medium hover:underline" style={{ color: "#FF5500" }}>Change avatar</button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Admin"
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="admin@sociolab.com"
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors"
                  />
                </div>
                <button
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "Password" && (
            <motion.div
              key="password"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white rounded-lg border border-gray-200 p-6 max-w-lg"
            >
              <h3 className="text-sm font-semibold text-gray-800 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "Team" && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-lg"
            >
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">Team Members</h3>
                <button className="text-xs font-medium hover:underline" style={{ color: "#FF5500" }}>Invite</button>
              </div>
              <div className="divide-y divide-gray-50">
                {[
                  { name: "Ali Ahmed", email: "ali@sociolab.com", role: "Super Admin" },
                  { name: "Sara Khan", email: "sara@sociolab.com", role: "Admin" },
                  { name: "Bilal Raza", email: "bilal@sociolab.com", role: "Sales Executive" },
                ].map((m) => (
                  <div key={m.email} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-medium text-white" style={{ backgroundColor: "#FF5500" }}>
                        {m.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{m.role}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashShell>
  );
}
