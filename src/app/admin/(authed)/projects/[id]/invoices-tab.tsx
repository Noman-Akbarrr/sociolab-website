"use client";

import { useState } from "react";
import {
  inputCls,
  invoiceStatusMeta,
  money,
  shortDate,
  StatusChip,
  type ProjectInvoice,
} from "./types";

export function InvoicesTab({
  projectId,
  invoices,
  onInvoicesChange,
}: {
  projectId: string;
  invoices: ProjectInvoice[];
  onInvoicesChange: React.Dispatch<React.SetStateAction<ProjectInvoice[]>>;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    number: "",
    amount: "",
    dueDate: "",
    status: "draft",
  });
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const isOverdue = (inv: ProjectInvoice) =>
    inv.status !== "paid" && inv.status !== "void" && new Date(inv.dueDate) < new Date();

  const total = invoices
    .filter((i) => i.status !== "void")
    .reduce((sum, i) => sum + i.amount, 0);
  const collected = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amount, 0);
  const outstanding = invoices
    .filter((i) => i.status !== "paid" && i.status !== "void")
    .reduce((sum, i) => sum + i.amount, 0);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const amount = Number(createForm.amount);
    if (!amount || amount <= 0 || !createForm.dueDate) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: createForm.number.trim() || undefined,
          amount,
          currency: "PKR",
          dueDate: createForm.dueDate,
          status: createForm.status,
        }),
      });
      if (!res.ok) throw new Error("failed");
      const invoice: ProjectInvoice = await res.json();
      onInvoicesChange((prev) => [...prev, invoice]);
      setCreateForm({ number: "", amount: "", dueDate: "", status: "draft" });
      setShowCreate(false);
    } catch {
      setError("Could not create the invoice.");
    } finally {
      setCreating(false);
    }
  }

  async function patchInvoice(invoice: ProjectInvoice, body: Record<string, unknown>): Promise<boolean> {
    setBusyId(invoice.id);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("failed");
      const updated: ProjectInvoice = await res.json();
      onInvoicesChange((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      return true;
    } catch {
      setError("Could not update the invoice.");
      return false;
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(invoice: ProjectInvoice) {
    if (!confirm(`Delete invoice ${invoice.number}?`)) return;
    setBusyId(invoice.id);
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/invoices/${invoice.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("failed");
      onInvoicesChange((prev) => prev.filter((i) => i.id !== invoice.id));
    } catch {
      setError("Could not delete the invoice.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span>
            Invoiced <strong className="text-gray-800">{money(total)}</strong>
          </span>
          <span>
            Collected <strong className="text-green-600">{money(collected)}</strong>
          </span>
          <span>
            Outstanding <strong className="text-gray-800">{money(outstanding)}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate((v) => !v)}
          className="flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: "#FF5500" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New invoice
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Number</label>
              <input
                className={inputCls}
                value={createForm.number}
                placeholder="Auto"
                onChange={(e) => setCreateForm({ ...createForm, number: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Amount (PKR) *</label>
              <input
                type="number"
                className={inputCls}
                value={createForm.amount}
                placeholder="0"
                onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Due date *</label>
              <input
                type="date"
                className={inputCls}
                value={createForm.dueDate}
                onChange={(e) => setCreateForm({ ...createForm, dueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Status</label>
              <select
                className={inputCls}
                value={createForm.status}
                onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
              </select>
            </div>
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !createForm.amount || !createForm.dueDate}
              className="rounded-md px-3.5 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#FF5500" }}
            >
              {creating ? "Creating…" : "Create invoice"}
            </button>
          </div>
        </form>
      )}

      {error && !showCreate && <p className="mb-3 text-xs text-red-500">{error}</p>}

      {invoices.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
          No invoices yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Invoice</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Due date</th>
                <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => {
                const busy = busyId === inv.id;
                return (
                  <tr key={inv.id} className={isOverdue(inv) ? "bg-red-50/40" : undefined}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {inv.number}
                      {inv.paidAt && (
                        <span className="ml-2 text-[11px] font-normal text-gray-400">
                          paid {shortDate(inv.paidAt)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{money(inv.amount)}</td>
                    <td className="px-4 py-3">
                      <StatusChip meta={invoiceStatusMeta[inv.status]}>
                        {invoiceStatusMeta[inv.status]?.label ?? inv.status}
                      </StatusChip>
                    </td>
                    <td className={`px-4 py-3 text-sm ${isOverdue(inv) ? "font-medium text-red-500" : "text-gray-500"}`}>
                      {shortDate(inv.dueDate)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={inv.status}
                          disabled={busy}
                          onChange={(e) => patchInvoice(inv, { status: e.target.value })}
                          className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-700 focus:border-[#FF5500] focus:outline-none"
                          title="Change status"
                        >
                          {Object.entries(invoiceStatusMeta).map(([value, meta]) => (
                            <option key={value} value={value}>
                              {meta.label}
                            </option>
                          ))}
                        </select>
                        {inv.status !== "paid" && inv.status !== "void" && (
                          <button
                            type="button"
                            onClick={() => patchInvoice(inv, { status: "paid" })}
                            disabled={busy}
                            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-white transition-colors disabled:opacity-50"
                            style={{ backgroundColor: "#059669" }}
                          >
                            {busy ? "…" : "Mark paid"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(inv)}
                          disabled={busy}
                          title="Delete invoice"
                          className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
