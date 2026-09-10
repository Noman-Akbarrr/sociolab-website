"use client";

import { useState } from "react";

const invoiceStatusColors: Record<string, string> = {
  draft: "bg-white/10 text-white/50",
  sent: "bg-blue-500/20 text-blue-400",
  paid: "bg-green-500/20 text-green-400",
  overdue: "bg-red-500/20 text-red-400",
  void: "bg-white/5 text-white/30",
};

export function ProjectReports({ project }: { project: any }) {
  const [invoices, setInvoices] = useState(project.invoices || []);
  const [showAdd, setShowAdd] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ amount: "", dueDate: "" });

  const budget = project.budget || 0;
  const totalInvoiced = invoices.reduce((sum: number, inv: any) => sum + inv.amount, 0);
  const totalPaid = invoices.filter((i: any) => i.status === "paid").reduce((sum: number, inv: any) => sum + inv.amount, 0);
  const outstanding = totalInvoiced - totalPaid;

  const tasks = project.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: any) => t.status === "done").length;
  const overdueTasks = tasks.filter((t: any) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "done").length;
  const unpaidInvoices = invoices.filter((i: any) => i.status !== "paid" && i.status !== "void").length;

  const daysElapsed = project.startDate
    ? Math.floor((Date.now() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const formatCents = (cents: number) => `${project.currency} ${(cents / 100).toLocaleString()}`;

  function formatDate(d: string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  async function handleAddInvoice(e: React.FormEvent) {
    e.preventDefault();
    const amount = Math.round(parseFloat(newInvoice.amount) * 100);
    if (isNaN(amount) || amount <= 0) return;

    const now = new Date();
    const year = now.getFullYear();
    const num = invoices.length + 1;
    const number = `INV-${year}-${String(num).padStart(3, "0")}`;

    const res = await fetch("/admin/api/crm/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: project.id,
        number,
        amount,
        currency: project.currency,
        dueDate: newInvoice.dueDate,
      }),
    });
    if (res.ok) {
      const { invoice } = await res.json();
      setInvoices((prev: any[]) => [...prev, invoice]);
      setShowAdd(false);
      setNewInvoice({ amount: "", dueDate: "" });
    }
  }

  async function updateInvoiceStatus(id: string, status: string) {
    await fetch(`/admin/api/crm/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, paidAt: status === "paid" ? new Date().toISOString() : null }),
    });
    setInvoices((prev: any[]) => prev.map(inv => inv.id === id ? { ...inv, status, paidAt: status === "paid" ? new Date().toISOString() : null } : inv));
  }

  const budgetPct = budget > 0 ? Math.min((totalInvoiced / budget) * 100, 100) : 0;
  const paidPct = budget > 0 ? Math.min((totalPaid / budget) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Budget Overview</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-xs text-white/50 mb-1">Budget</div>
            <div className="text-lg font-bold text-white">{budget > 0 ? formatCents(budget) : "—"}</div>
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1">Invoiced</div>
            <div className="text-lg font-bold text-white">{formatCents(totalInvoiced)}</div>
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1">Paid</div>
            <div className="text-lg font-bold text-green-400">{formatCents(totalPaid)}</div>
          </div>
        </div>
        {budget > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/50">
              <span>Invoiced</span>
              <span>{Math.round(budgetPct)}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#1E293B]">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${budgetPct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-white/50">
              <span>Paid</span>
              <span>{Math.round(paidPct)}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#1E293B]">
              <div className="h-full rounded-full bg-green-500" style={{ width: `${paidPct}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Task Progress */}
        <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Task Progress</h2>
          {totalTasks > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Completion</span>
                <span className="text-white font-medium">{Math.round((completedTasks / totalTasks) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#1E293B]">
                <div className="h-full rounded-full bg-brand" style={{ width: `${(completedTasks / totalTasks) * 100}%` }} />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-sm">
                <div className="flex justify-between"><span className="text-white/50">Total</span><span className="text-white">{totalTasks}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Completed</span><span className="text-white">{completedTasks}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Overdue</span><span className="text-red-400">{overdueTasks}</span></div>
                <div className="flex justify-between"><span className="text-white/50">Remaining</span><span className="text-white">{totalTasks - completedTasks}</span></div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-white/50">No tasks created yet.</p>
          )}
        </div>

        {/* Project Health */}
        <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Project Health</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Days Since Start</span>
              <span className="text-white">{daysElapsed || "—"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Overdue Tasks</span>
              <span className={overdueTasks > 0 ? "text-red-400 font-medium" : "text-white"}>{overdueTasks}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Unpaid Invoices</span>
              <span className={unpaidInvoices > 0 ? "text-yellow-400 font-medium" : "text-white"}>{unpaidInvoices}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Outstanding Amount</span>
              <span className={outstanding > 0 ? "text-yellow-400 font-medium" : "text-white"}>{formatCents(outstanding)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[#1E293B]">
          <h2 className="text-sm font-semibold text-white">Invoices</h2>
          <button onClick={() => setShowAdd(true)} className="rounded-[3px] bg-brand px-3 py-1.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
            + Create Invoice
          </button>
        </div>
        {invoices.length === 0 ? (
          <p className="p-8 text-center text-sm text-white/50">No invoices yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E293B]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Paid At</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium">{inv.number}</td>
                  <td className="px-4 py-3 text-white">{formatCents(inv.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${invoiceStatusColors[inv.status] || invoiceStatusColors.draft}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/50">{formatDate(inv.dueDate)}</td>
                  <td className="px-4 py-3 text-white/50">{formatDate(inv.paidAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={inv.status}
                      onChange={(e) => updateInvoiceStatus(inv.id, e.target.value)}
                      className="rounded-[3px] border border-[#1E293B] bg-[#111827] px-2 py-1 text-xs text-white focus:outline-none focus:border-brand"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="void">Void</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Invoice Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-white">Create Invoice</h2>
            <form onSubmit={handleAddInvoice} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Amount ({project.currency}) *</label>
                <input type="number" step="0.01" required value={newInvoice.amount} onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Due Date *</label>
                <input type="date" required value={newInvoice.dueDate} onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white hover:border-brand transition-colors">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark transition-colors">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
