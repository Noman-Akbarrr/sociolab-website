"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashShell } from "../../client";
import { ActivityFeed, type ActivityItem } from "../../components/activity-feed";
import { OverviewTab } from "./overview-tab";
import { TasksTab } from "./tasks-tab";
import { SubmissionsTab } from "./submissions-tab";
import { InvoicesTab } from "./invoices-tab";
import { ReportsTab } from "./reports-tab";
import {
  TAB_KEYS,
  StatusChip,
  projectStatusMeta,
  shortDate,
  money,
  type TabKey,
  type ProjectDetail,
  type ProjectTask,
  type ProjectSubmission,
  type ProjectInvoice,
  type UserOption,
  type CompanyOption,
} from "./types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [invoices, setInvoices] = useState<ProjectInvoice[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [tab, setTab] = useState<TabKey>("overview");
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoadState("loading");
      try {
        const query = new URLSearchParams(window.location.search).get("tab");
        if (query && (TAB_KEYS as readonly string[]).includes(query)) {
          setTab(query as TabKey);
        }
        const [pRes, uRes, cRes] = await Promise.all([
          fetch(`/admin/api/crm/projects/${projectId}`),
          fetch("/admin/api/crm/users"),
          fetch("/admin/api/crm/companies"),
        ]);
        if (!pRes.ok) throw new Error("failed");
        const data: ProjectDetail = await pRes.json();
        if (!active) return;
        setProject(data);
        setTasks(data.tasks ?? []);
        setSubmissions(data.submissions ?? []);
        setInvoices(data.invoices ?? []);
        setActivities(data.activities ?? []);
        if (uRes.ok) setUsers(await uRes.json());
        if (cRes.ok) setCompanies(await cRes.json());
        setLoadState("ready");
      } catch {
        if (!active) return;
        setLoadState("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [projectId]);

  function switchTab(next: TabKey) {
    setTab(next);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", next);
      window.history.replaceState({}, "", url);
    } catch {
      /* URL sync is best-effort */
    }
  }

  if (loadState === "error") {
    return (
      <DashShell>
        <div className="py-16 text-center">
          <p className="text-sm text-gray-500">Could not load this project.</p>
          <Link href="/admin/projects" className="mt-3 inline-block text-sm font-medium text-[#FF5500]">
            Back to projects
          </Link>
        </div>
      </DashShell>
    );
  }

  const loading = loadState === "loading" || !project;

  const reviewCount = submissions.filter((s) => s.status === "review").length;
  const openTaskCount = tasks.filter((t) => t.status !== "done").length;
  const unpaidInvoices = invoices.filter((i) => i.status !== "paid" && i.status !== "void").length;

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "overview", label: "Overview" },
    { key: "tasks", label: "Tasks", count: tasks.length },
    { key: "submissions", label: "Submissions", count: reviewCount || submissions.length },
    { key: "invoices", label: "Invoices", count: invoices.length },
    { key: "reports", label: "Reports" },
    { key: "activity", label: "Activity", count: activities.length },
  ];

  return (
    <DashShell>
      <div>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href="/admin/projects"
              className="mb-1.5 inline-flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-[#FF5500]"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Projects
            </Link>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-semibold text-gray-900">
                {loading ? "Loading…" : project.name}
              </h1>
              {project && !loading && (
                <StatusChip meta={projectStatusMeta[project.status]}>
                  {projectStatusMeta[project.status]?.label ?? project.status}
                </StatusChip>
              )}
            </div>
            {project && !loading && (
              <p className="mt-1 text-sm text-gray-500">
                {project.company?.name ?? "No company"}
                {project.assignee ? ` · ${project.assignee.name}` : ""}
                {project.startDate ? ` · ${shortDate(project.startDate)} – ${shortDate(project.endDate)}` : ""}
              </p>
            )}
          </div>

          {project && !loading && (
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Budget</p>
                <p className="text-sm font-semibold text-gray-800">{money(project.budget)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Tasks open</p>
                <p className="text-sm font-semibold text-gray-800">
                  {openTaskCount}
                  <span className="font-normal text-gray-400">/{tasks.length}</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-400">In review</p>
                <p className="text-sm font-semibold text-gray-800">{reviewCount}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-400">Unpaid invoices</p>
                <p className="text-sm font-semibold text-gray-800">{unpaidInvoices}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 overflow-x-auto border-b border-gray-200">
          <nav className="flex min-w-max items-end gap-1" aria-label="Project sections">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => switchTab(t.key)}
                  aria-current={active ? "page" : undefined}
                  className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-[#FF5500] text-[#FF5500]"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {t.label}
                  {typeof t.count === "number" && t.count > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                        active ? "bg-orange-50 text-[#FF5500]" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-[#FF5500]" />
          </div>
        ) : (
          <>
            {tab === "overview" && project && (
              <OverviewTab
                project={project}
                users={users}
                companies={companies}
                onSaved={(updated) => setProject((prev) => (prev ? { ...prev, ...updated } : prev))}
              />
            )}

            {tab === "tasks" && (
              <TasksTab
                projectId={projectId}
                tasks={tasks}
                users={users}
                onTasksChange={setTasks}
                onSubmissionCreated={(sub) => setSubmissions((prev) => [sub, ...prev])}
                onActivity={(activity) => setActivities((prev) => [activity, ...prev])}
              />
            )}

            {tab === "submissions" && (
              <SubmissionsTab
                projectId={projectId}
                submissions={submissions}
                tasks={tasks}
                onSubmissionsChange={setSubmissions}
                onTasksChange={setTasks}
              />
            )}

            {tab === "invoices" && (
              <InvoicesTab
                projectId={projectId}
                invoices={invoices}
                onInvoicesChange={setInvoices}
              />
            )}

            {tab === "reports" && project && (
              <ReportsTab project={project} tasks={tasks} submissions={submissions} invoices={invoices} />
            )}

            {tab === "activity" && (
              <div className="max-w-2xl">
                <ActivityFeed
                  activities={activities}
                  parent={{ projectId }}
                  onCreated={(activity) => setActivities((prev) => [activity, ...prev])}
                />
              </div>
            )}
          </>
        )}
      </div>
    </DashShell>
  );
}
