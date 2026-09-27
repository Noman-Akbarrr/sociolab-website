"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashShell } from "../client";

const tabs = ["Profile", "Password"] as const;

const inputCls =
  "w-full px-3 py-2 text-sm rounded-md border border-gray-200 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors text-gray-800";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"Profile" | "Password">("Profile");

  const [profileName, setProfileName] = useState("Admin");
  const [profileEmail, setProfileEmail] = useState("admin@sociolab.com");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const handleProfileSave = async () => {
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const res = await fetch("/admin/api/auth/status");
      if (res.ok) {
        const data = await res.json();
        if (data.user?.id) {
          const patchRes = await fetch(`/admin/api/crm/users/${data.user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: profileName }),
          });
          if (patchRes.ok) {
            setProfileMsg("Profile updated");
          } else {
            setProfileMsg("Failed to update profile");
          }
        }
      }
    } catch {
      setProfileMsg("Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwError("");
    setPwMsg("");
    if (!currentPw || !newPw || !confirmPw) {
      setPwError("All fields are required");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match");
      return;
    }
    if (newPw.length < 10) {
      setPwError("Password must be at least 10 characters");
      return;
    }
    if (!/[A-Z]/.test(newPw)) {
      setPwError("Password must contain an uppercase letter");
      return;
    }
    if (!/[a-z]/.test(newPw)) {
      setPwError("Password must contain a lowercase letter");
      return;
    }
    if (!/[0-9]/.test(newPw)) {
      setPwError("Password must contain a number");
      return;
    }
    setPwSaving(true);
    try {
      const statusRes = await fetch("/admin/api/auth/status");
      if (statusRes.ok) {
        const data = await statusRes.json();
        if (data.user?.id) {
          const res = await fetch(`/admin/api/crm/users/${data.user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPw }),
          });
          if (res.ok) {
            setPwMsg("Password updated successfully");
            setCurrentPw("");
            setNewPw("");
            setConfirmPw("");
          } else {
            const err = await res.json();
            setPwError(err.error || "Failed to update password");
          }
        }
      }
    } catch {
      setPwError("Failed to update password");
    } finally {
      setPwSaving(false);
    }
  };

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
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white"
                  style={{ backgroundColor: "#FF5500" }}
                >
                  {profileName[0] || "A"}
                </div>
                <button className="text-sm font-medium hover:underline" style={{ color: "#FF5500" }}>
                  Change avatar
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className={inputCls}
                />
              </div>
              {profileMsg && (
                <p className="text-xs text-green-600">{profileMsg}</p>
              )}
              <button
                onClick={handleProfileSave}
                disabled={profileSaving}
                className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#FF5500" }}
              >
                {profileSaving ? "Saving..." : "Save Changes"}
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
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                />
              </div>
              {pwError && <p className="text-xs text-red-500">{pwError}</p>}
              {pwMsg && <p className="text-xs text-green-600">{pwMsg}</p>}
              <button
                onClick={handlePasswordChange}
                disabled={pwSaving}
                className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#FF5500" }}
              >
                {pwSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </DashShell>
  );
}
