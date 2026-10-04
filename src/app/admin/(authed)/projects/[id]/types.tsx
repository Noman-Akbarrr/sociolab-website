import type { ActivityItem } from "../../components/activity-feed";

export type UserOption = { id: string; name: string; email: string };
export type CompanyOption = { id: string; name: string };

export type ProjectTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: number;
  assigneeId: string | null;
  assignee: UserOption | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type ProjectSubmission = {
  id: string;
  taskId: string | null;
  title: string;
  description: string | null;
  status: string;
  files: string[];
  feedback: string | null;
  submitterId: string | null;
  submittedAt: string;
};

export type ProjectInvoice = {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
};

export type ProjectTicket = {
  id: string;
  number: string;
  subject: string;
  status: string;
  priority: string;
  assignee: UserOption | null;
};

export type ProjectDetail = {
  id: string;
  name: string;
  companyId: string;
  company: CompanyOption | null;
  assigneeId: string | null;
  assignee: UserOption | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  internalCost: number | null;
  currency: string;
  billingType: string;
  description: string | null;
  notes: string | null;
  createdAt: string;
  tasks: ProjectTask[];
  invoices: ProjectInvoice[];
  submissions: ProjectSubmission[];
  activities: ActivityItem[];
  tickets: ProjectTicket[];
  members: { user: UserOption }[];
};

export const TAB_KEYS = ["overview", "tasks", "submissions", "invoices", "reports", "activity"] as const;
export type TabKey = (typeof TAB_KEYS)[number];

export const inputCls =
  "w-full px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-800 bg-gray-50 focus:outline-none focus:border-[#FF5500] focus:bg-white transition-colors";

export function money(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `Rs. ${Math.round(value).toLocaleString()}`;
}

export function shortDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const taskStatusMeta: Record<string, { label: string; bg: string; text: string }> = {
  todo: { label: "To do", bg: "#F3F4F6", text: "#4B5563" },
  "in-progress": { label: "In progress", bg: "#EFF6FF", text: "#2563EB" },
  review: { label: "In review", bg: "#FFFBEB", text: "#B45309" },
  done: { label: "Done", bg: "#ECFDF5", text: "#059669" },
};

export const submissionStatusMeta: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: "Pending", bg: "#F3F4F6", text: "#4B5563" },
  review: { label: "In review", bg: "#FFFBEB", text: "#B45309" },
  approved: { label: "Approved", bg: "#ECFDF5", text: "#059669" },
  rejected: { label: "Rejected", bg: "#FEF2F2", text: "#DC2626" },
};

export const invoiceStatusMeta: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: "Draft", bg: "#F3F4F6", text: "#4B5563" },
  sent: { label: "Sent", bg: "#EFF6FF", text: "#2563EB" },
  paid: { label: "Paid", bg: "#ECFDF5", text: "#059669" },
  overdue: { label: "Overdue", bg: "#FEF2F2", text: "#DC2626" },
  void: { label: "Void", bg: "#F5F5F5", text: "#9E9E9E" },
};

export const projectStatusMeta: Record<string, { label: string; bg: string; text: string }> = {
  kickoff: { label: "Kickoff", bg: "#FFF3E0", text: "#FF9800" },
  active: { label: "Active", bg: "#E8F5E9", text: "#4CAF50" },
  paused: { label: "Paused", bg: "#F3E5F5", text: "#9C27B0" },
  done: { label: "Done", bg: "#E0E0E0", text: "#616161" },
  archived: { label: "Archived", bg: "#F5F5F5", text: "#9E9E9E" },
};

export function StatusChip({
  meta,
  children,
}: {
  meta: { label: string; bg: string; text: string } | undefined;
  children: React.ReactNode;
}) {
  const m = meta ?? { label: String(children), bg: "#F3F4F6", text: "#4B5563" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: m.bg, color: m.text }}
    >
      {children}
    </span>
  );
}
