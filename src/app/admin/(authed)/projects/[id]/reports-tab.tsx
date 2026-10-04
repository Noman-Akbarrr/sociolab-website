"use client";

import {
  money,
  shortDate,
  invoiceStatusMeta,
  type ProjectDetail,
  type ProjectTask,
  type ProjectSubmission,
  type ProjectInvoice,
} from "./types";

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</h3>
      {children}
    </section>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "good" | "bad" | "warn" }) {
  const color =
    tone === "good" ? "text-green-600" : tone === "bad" ? "text-red-500" : tone === "warn" ? "text-amber-600" : "text-gray-800";
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-0.5 text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}

export function ReportsTab({
  project,
  tasks,
  submissions,
  invoices,
}: {
  project: ProjectDetail;
  tasks: ProjectTask[];
  submissions: ProjectSubmission[];
  invoices: ProjectInvoice[];
}) {
  const budget = project.budget ?? 0;
  const cost = project.internalCost ?? 0;
  const profit = budget - cost;
  const margin = budget > 0 ? Math.round((profit / budget) * 100) : null;

  const valid = invoices.filter((i) => i.status !== "void");
  const invoiced = valid.reduce((sum, i) => sum + i.amount, 0);
  const collected = valid.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const outstanding = invoiced - collected;
  const overdue = valid.filter(
    (i) => i.status !== "paid" && new Date(i.dueDate) < new Date()
  );
  const overdueAmount = overdue.reduce((sum, i) => sum + i.amount, 0);

  const byTask = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    done: tasks.filter((t) => t.status === "done").length,
  };
  const taskTotal = tasks.length;
  const taskDonePct = taskTotal ? Math.round((byTask.done / taskTotal) * 100) : 0;

  const bySubmission = {
    approved: submissions.filter((s) => s.status === "approved").length,
    review: submissions.filter((s) => s.status === "review").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
    pending: submissions.filter((s) => s.status === "pending").length,
  };

  const schedule = [...valid].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="max-w-5xl space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card title="Money">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Budget (revenue)" value={money(project.budget)} />
            <Stat label="Internal cost" value={money(project.internalCost)} />
            <Stat
              label="Projected profit"
              value={budget || cost ? money(profit) : "—"}
              tone={budget || cost ? (profit >= 0 ? "good" : "bad") : "default"}
            />
            <Stat
              label="Margin"
              value={margin === null ? "—" : `${margin}%`}
              tone={margin === null ? "default" : margin >= 30 ? "good" : margin >= 0 ? "warn" : "bad"}
            />
          </div>
          <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
            Billing: {project.billingType === "time-materials" ? "Time & materials" : project.billingType} · Currency:{" "}
            {project.currency}
          </p>
        </Card>

        <Card title="Invoicing">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Invoiced" value={money(invoiced)} />
            <Stat label="Collected" value={money(collected)} tone="good" />
            <Stat label="Outstanding" value={money(outstanding)} />
            <Stat
              label={`Overdue (${overdue.length})`}
              value={money(overdueAmount)}
              tone={overdue.length ? "bad" : "default"}
            />
          </div>
          <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
            {valid.filter((i) => i.status === "paid").length} of {valid.length} invoices paid
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card title="Task progress">
          {taskTotal === 0 ? (
            <p className="text-sm text-gray-400">No tasks yet.</p>
          ) : (
            <>
              <div className="mb-3 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${taskDonePct}%`, backgroundColor: "#059669" }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">{taskDonePct}%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="rounded-md bg-gray-50 py-2">
                  <p className="text-sm font-semibold text-gray-700">{byTask.todo}</p>
                  <p className="text-[10px] uppercase text-gray-400">To do</p>
                </div>
                <div className="rounded-md bg-blue-50 py-2">
                  <p className="text-sm font-semibold text-blue-700">{byTask["in-progress"]}</p>
                  <p className="text-[10px] uppercase text-blue-400">Active</p>
                </div>
                <div className="rounded-md bg-amber-50 py-2">
                  <p className="text-sm font-semibold text-amber-700">{byTask.review}</p>
                  <p className="text-[10px] uppercase text-amber-400">Review</p>
                </div>
                <div className="rounded-md bg-green-50 py-2">
                  <p className="text-sm font-semibold text-green-700">{byTask.done}</p>
                  <p className="text-[10px] uppercase text-green-400">Done</p>
                </div>
              </div>
            </>
          )}
        </Card>

        <Card title="Work submissions">
          {submissions.length === 0 ? (
            <p className="text-sm text-gray-400">No submissions yet.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="rounded-md bg-green-50 py-2">
                <p className="text-sm font-semibold text-green-700">{bySubmission.approved}</p>
                <p className="text-[10px] uppercase text-green-400">Approved</p>
              </div>
              <div className="rounded-md bg-amber-50 py-2">
                <p className="text-sm font-semibold text-amber-700">{bySubmission.review}</p>
                <p className="text-[10px] uppercase text-amber-400">In review</p>
              </div>
              <div className="rounded-md bg-red-50 py-2">
                <p className="text-sm font-semibold text-red-700">{bySubmission.rejected}</p>
                <p className="text-[10px] uppercase text-red-400">Rejected</p>
              </div>
              <div className="rounded-md bg-gray-50 py-2">
                <p className="text-sm font-semibold text-gray-700">{bySubmission.pending}</p>
                <p className="text-[10px] uppercase text-gray-400">Pending</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card title="Payment schedule">
        {schedule.length === 0 ? (
          <p className="text-sm text-gray-400">No invoices scheduled.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {schedule.map((inv) => {
              const overdueNow = inv.status !== "paid" && new Date(inv.dueDate) < new Date();
              return (
                <li key={inv.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">{inv.number}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: (invoiceStatusMeta[inv.status] ?? invoiceStatusMeta.draft).bg,
                        color: (invoiceStatusMeta[inv.status] ?? invoiceStatusMeta.draft).text,
                      }}
                    >
                      {invoiceStatusMeta[inv.status]?.label ?? inv.status}
                    </span>
                    {overdueNow && <span className="text-[10px] font-semibold text-red-500">OVERDUE</span>}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">{shortDate(inv.dueDate)}</span>
                    <span className="font-semibold text-gray-800">{money(inv.amount)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
