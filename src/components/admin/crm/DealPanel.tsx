"use client";

import { useState, useEffect } from "react";

interface DealPanelProps {
  dealId: string;
  onClose: () => void;
  onDealUpdated?: () => void;
}

export default function DealPanel({ dealId, onClose, onDealUpdated }: DealPanelProps) {
  const [deal, setDeal] = useState<any>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    fetchDeal();
  }, [dealId]);

  async function fetchDeal() {
    setLoading(true);
    try {
      const res = await fetch(`/admin/api/crm/deals/${dealId}`);
      const data = await res.json();
      setDeal(data.deal);
      setEditForm({
        title: data.deal?.title || "",
        value: data.deal?.value ? String(data.deal.value) : "",
        currency: data.deal?.currency || "PKR",
        probability: data.deal?.probability ?? 10,
        expectedClose: data.deal?.expectedClose?.split("T")[0] || "",
        lostReason: data.deal?.lostReason || "",
        contactName: data.deal?.contactName || "",
        contactEmail: data.deal?.contactEmail || "",
        contactPhone: data.deal?.contactPhone || "",
        address: data.deal?.address || "",
        city: data.deal?.city || "",
        country: data.deal?.country || "",
        source: data.deal?.source || "",
        dealType: data.deal?.dealType || "",
        priority: data.deal?.priority || "medium",
        notes: data.deal?.notes || "",
      });
      // Fetch stages after deal is loaded
      if (data.deal?.pipelineId) {
        try {
          const sRes = await fetch(`/admin/api/crm/pipelines/${data.deal.pipelineId}/stages`);
          if (sRes.ok) {
            const sData = await sRes.json();
            setStages(sData.stages || []);
          }
        } catch {}
      }
    } catch {}
    setLoading(false);
  }

  async function saveEdit() {
    const body: any = {};
    if (editForm.title) body.title = editForm.title;
    if (editForm.value) body.value = parseInt(editForm.value);
    if (editForm.currency) body.currency = editForm.currency;
    if (editForm.probability !== undefined) body.probability = parseInt(editForm.probability);
    if (editForm.expectedClose) body.expectedClose = editForm.expectedClose;
    if (editForm.lostReason !== undefined) body.lostReason = editForm.lostReason;
    body.contactName = editForm.contactName || null;
    body.contactEmail = editForm.contactEmail || null;
    body.contactPhone = editForm.contactPhone || null;
    body.address = editForm.address || null;
    body.city = editForm.city || null;
    body.country = editForm.country || null;
    body.source = editForm.source || null;
    body.dealType = editForm.dealType || null;
    body.priority = editForm.priority || "medium";
    body.notes = editForm.notes || null;

    await fetch(`/admin/api/crm/deals/${dealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setEditing(false);
    fetchDeal();
    onDealUpdated?.();
  }

  async function changeStage(stageId: string) {
    await fetch(`/admin/api/crm/deals/${dealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stageId }),
    });
    fetchDeal();
    onDealUpdated?.();
  }

  async function addNote() {
    if (!noteText.trim()) return;
    setAddingNote(true);
    await fetch("/admin/api/crm/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "note", subject: "Note", body: noteText, dealId }),
    });
    setNoteText("");
    setAddingNote(false);
    fetchDeal();
  }

  async function deleteDeal() {
    if (!confirm("Delete this deal?")) return;
    await fetch(`/admin/api/crm/deals/${dealId}`, { method: "DELETE" });
    onClose();
    onDealUpdated?.();
  }

  function formatValue(value: number, currency: string) {
    const num = value / 100;
    return `${currency} ${num.toLocaleString()}`;
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  if (loading) {
    return (
      <div className="fixed inset-y-0 right-0 z-50 flex w-[480px] items-center justify-center border-l border-[#1E293B] bg-[#111827]">
        <span className="text-sm text-white/50">Loading...</span>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="fixed inset-y-0 right-0 z-50 flex w-[480px] items-center justify-center border-l border-[#1E293B] bg-[#111827]">
        <span className="text-sm text-white/50">Deal not found.</span>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-[480px] flex-col border-l border-[#1E293B] bg-[#111827] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] px-6 py-4">
          <h2 className="font-display text-sm font-semibold text-white truncate pr-4">
            {deal.title}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Deal Info */}
          <div className="border-b border-[#1E293B] px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Details</h3>
              <button
                onClick={() => editing ? saveEdit() : setEditing(true)}
                className="text-xs font-semibold text-brand hover:text-[#FF5500] transition-colors"
              >
                {editing ? "Save" : "Edit Deal"}
              </button>
            </div>

            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-white/50 mb-1">Title</label>
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Value</label>
                    <input
                      type="number"
                      value={editForm.value}
                      onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Currency</label>
                    <select
                      value={editForm.currency}
                      onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                    >
                      <option value="PKR">PKR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Probability (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editForm.probability}
                      onChange={(e) => setEditForm({ ...editForm, probability: e.target.value })}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Expected Close</label>
                    <input
                      type="date"
                      value={editForm.expectedClose}
                      onChange={(e) => setEditForm({ ...editForm, expectedClose: e.target.value })}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Priority</label>
                    <select
                      value={editForm.priority}
                      onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Source</label>
                    <select
                      value={editForm.source}
                      onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                    >
                      <option value="">Select</option>
                      <option value="website">Website</option>
                      <option value="referral">Referral</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="cold-outreach">Cold Outreach</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="event">Event</option>
                      <option value="ad">Advertisement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Deal Type</label>
                    <select
                      value={editForm.dealType}
                      onChange={(e) => setEditForm({ ...editForm, dealType: e.target.value })}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                    >
                      <option value="">Select</option>
                      <option value="new-business">New Business</option>
                      <option value="upsell">Upsell</option>
                      <option value="renewal">Renewal</option>
                      <option value="partnership">Partnership</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">City</label>
                    <input
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      placeholder="Lahore"
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Country</label>
                    <input
                      value={editForm.country}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      placeholder="Pakistan"
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Contact Name</label>
                    <input
                      value={editForm.contactName}
                      onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={editForm.contactEmail}
                      onChange={(e) => setEditForm({ ...editForm, contactEmail: e.target.value })}
                      placeholder="john@acme.com"
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={editForm.contactPhone}
                      onChange={(e) => setEditForm({ ...editForm, contactPhone: e.target.value })}
                      placeholder="+92 300 1234567"
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Address</label>
                  <input
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Office address"
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1">Notes</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={3}
                    placeholder="Deal notes..."
                    className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none resize-none"
                  />
                </div>
                {deal.stage?.isClosed && !deal.stage?.isWon && (
                  <div>
                    <label className="block text-xs text-white/50 mb-1">Lost Reason</label>
                    <textarea
                      value={editForm.lostReason}
                      onChange={(e) => setEditForm({ ...editForm, lostReason: e.target.value })}
                      rows={2}
                      className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white focus:border-brand focus:outline-none"
                    />
                  </div>
                )}
                <button
                  onClick={() => setEditing(false)}
                  className="text-xs text-white/40 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Stage */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Stage</span>
                  <select
                    value={deal.stageId}
                    onChange={(e) => changeStage(e.target.value)}
                    className="rounded-[3px] border border-[#1E293B] bg-[#090D16] px-2 py-1 text-sm text-white focus:border-brand focus:outline-none"
                  >
                    {stages.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                    {stages.length === 0 && <option value={deal.stageId}>{deal.stage?.label}</option>}
                  </select>
                </div>
                {/* Value */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Value</span>
                  <span className="text-sm font-semibold text-white">{formatValue(deal.value, deal.currency)}</span>
                </div>
                {/* Probability */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Probability</span>
                  <span className="text-sm text-white">{deal.probability}%</span>
                </div>
                {/* Expected Close */}
                {deal.expectedClose && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Expected Close</span>
                    <span className="text-sm text-white">{new Date(deal.expectedClose).toLocaleDateString()}</span>
                  </div>
                )}
                {/* Priority */}
                {deal.priority && deal.priority !== "medium" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Priority</span>
                    <span className={`text-sm font-semibold ${
                      deal.priority === "urgent" ? "text-red-400" :
                      deal.priority === "high" ? "text-orange-400" :
                      deal.priority === "low" ? "text-white/40" : "text-white"
                    }`}>{deal.priority}</span>
                  </div>
                )}
                {/* Source */}
                {deal.source && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Source</span>
                    <span className="text-sm text-white capitalize">{deal.source.replace("-", " ")}</span>
                  </div>
                )}
                {/* Deal Type */}
                {deal.dealType && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Type</span>
                    <span className="text-sm text-white capitalize">{deal.dealType.replace("-", " ")}</span>
                  </div>
                )}
                {/* Company */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Company</span>
                  <a href={`/admin/clients/${deal.companyId}`} className="text-sm text-brand hover:underline">
                    {deal.company?.name}
                  </a>
                </div>
                {/* Contact */}
                {deal.contactName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Contact</span>
                    <span className="text-sm text-white">{deal.contactName}</span>
                  </div>
                )}
                {deal.contactEmail && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Email</span>
                    <a href={`mailto:${deal.contactEmail}`} className="text-sm text-brand hover:underline">{deal.contactEmail}</a>
                  </div>
                )}
                {deal.contactPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Phone</span>
                    <a href={`tel:${deal.contactPhone}`} className="text-sm text-brand hover:underline">{deal.contactPhone}</a>
                  </div>
                )}
                {/* Location */}
                {(deal.city || deal.country) && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/50">Location</span>
                    <span className="text-sm text-white">{[deal.city, deal.country].filter(Boolean).join(", ")}</span>
                  </div>
                )}
                {/* Owner */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Owner</span>
                  <span className="text-sm text-white">{deal.owner?.name}</span>
                </div>
                {/* Notes */}
                {deal.notes && (
                  <div className="mt-2 rounded-[3px] border border-[#1E293B] bg-[#090D16] p-3">
                    <span className="text-xs font-semibold text-white/50">Notes</span>
                    <p className="mt-1 text-sm text-white/70 whitespace-pre-wrap">{deal.notes}</p>
                  </div>
                )}
                {/* Lost Reason */}
                {deal.lostReason && (
                  <div className="mt-2 rounded-[3px] border border-red-500/30 bg-red-500/10 p-3">
                    <span className="text-xs font-semibold text-red-400">Lost Reason</span>
                    <p className="mt-1 text-sm text-white/70">{deal.lostReason}</p>
                  </div>
                )}
                {/* Delete */}
                <div className="pt-2">
                  <button onClick={deleteDeal} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    Delete Deal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="px-6 py-5">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Activity</h3>

            {deal.activities && deal.activities.length > 0 ? (
              <div className="space-y-4">
                {deal.activities.map((activity: any) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white">{activity.subject}</p>
                      {activity.body && <p className="mt-1 text-sm text-white/60">{activity.body}</p>}
                      <p className="mt-1 text-xs text-white/40">{timeAgo(activity.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">No activity yet.</p>
            )}

            {/* Add Note */}
            <div className="mt-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full rounded-[3px] border border-[#1E293B] bg-[#090D16] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-brand focus:outline-none"
              />
              <button
                onClick={addNote}
                disabled={!noteText.trim() || addingNote}
                className="mt-2 rounded-[3px] bg-brand px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#FF5500] disabled:opacity-50"
              >
                {addingNote ? "Adding..." : "Add Note"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
