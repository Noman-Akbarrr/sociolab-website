"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TasksClientProps {
  initialTasks: any[];
  initialTotal: number;
  initialPage: number;
  initialTotalPages: number;
  initialProjectId: string;
  initialStatus: string;
  initialAssigneeId: string;
  currentUserId: string;
}

export function TasksClient({ initialTasks, initialTotal, initialPage, initialTotalPages, initialProjectId, initialStatus, initialAssigneeId, currentUserId }: TasksClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [projectId, setProjectId] = useState(initialProjectId);
  const [status, setStatus] = useState(initialStatus);
  const [assigneeId, setAssigneeId] = useState(initialAssigneeId);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/admin/api/crm/projects?limit=100").then(r => r.json()).then(d => setProjects(d.projects));
    fetch("/admin/api/crm/team-members?active=true").then(r => r.json()).then(d => setUsers(d.members));
  }, []);

  async function fetchTasks() {
    setLoading(true);
    const params = new URLSearchParams();
    if (projectId) params.set("projectId", projectId);
    if (status) params.set("status", status);
    if (assigneeId) params.set("assigneeId", assigneeId);
    params.set("page", String(page));
    params.set("limit", "50");
    const res = await fetch(`/admin/api/crm/tasks?${params}`);
    const data = await res.json();
    setTasks(data.tasks);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  async function updateTaskStatus(taskId: string, newStatus: string) {
    const res = await fetch(`/admin/api/crm/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchTasks();
  }

  const statusColors: Record<string, string> = {
    todo: "bg-gray-100 text-gray-700",
    "in-progress": "bg-blue-100 text-blue-700",
    review: "bg-yellow-100 text-yellow-700",
    done: "bg-green-100 text-green-700",
  };

  const priorityColors: Record<number, string> = {
    0: "bg-gray-100 text-gray-700",
    1: "bg-blue-100 text-blue-700",
    2: "bg-yellow-100 text-yellow-700",
    3: "bg-red-100 text-red-700",
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Tasks</h1>
        <p className="text-sm text-ink/60">Manage project tasks and deliverables.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative">
          <select
            value={projectId}
            onChange={(e) => { setProjectId(e.target.value); setPage(1); fetchTasks(); }}
            className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          >
            <option value="">All Projects</option>
            {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="relative">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); fetchTasks(); }}
            className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          >
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="relative">
          <select
            value={assigneeId}
            onChange={(e) => { setAssigneeId(e.target.value); setPage(1); fetchTasks(); }}
            className="rounded-[3px] border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand"
          >
            <option value="">All Assignees</option>
            <option value="mine">{currentUserId === assigneeId ? "My Tasks" : "My Tasks"}</option>
            {users.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </div>

      {/* Kanban view by status */}
      <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
        {["todo", "in-progress", "review", "done"].map((statusKey) => {
          const statusTasks = tasks.filter((t: any) => t.status === statusKey);
          return (
            <div key={statusKey} className="min-w-[300px] max-w-[300px] flex flex-col">
              <div className="flex items-center justify-between rounded-t-[3px] px-4 py-3 text-sm font-bold text-white" style={{ backgroundColor: statusColors[statusKey]?.replace("100", "600").replace("700", "") || "#6b7280" }}>
                <span>{statusKey === "in-progress" ? "In Progress" : statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}</span>
                <span className="text-[11px] opacity-90">{statusTasks.length}</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 rounded-b-[3px] border border-line bg-white p-3 min-h-[500px]">
                {statusTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-ink/40">
                    <p className="text-sm">No tasks</p>
                  </div>
                )}
                {statusTasks.map((task: any) => (
                  <Link
                    key={task.id}
                    href={`/admin/crm/projects/${task.project.id}`}
                    className="group flex flex-col gap-2 rounded-[3px] border border-line bg-white p-3 transition-shadow hover:shadow-md"
                    onClick={(e) => { e.preventDefault(); updateTaskStatus(task.id, statusKey === "todo" ? "in-progress" : statusKey === "in-progress" ? "review" : statusKey === "review" ? "done" : "todo"); }}
                  >
                    <span className="font-display text-sm font-semibold text-ink group-hover:text-brand">{task.title}</span>
                    <div className="flex items-center justify-between text-xs text-ink/50">
                      <span className="truncate">{task.project.name}</span>
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${priorityColors[task.priority] || priorityColors[0]}`}>
                        P{task.priority}
                      </span>
                    </div>
                    {task.assignee && <span className="text-[11px] text-brand">{task.assignee.name}</span>}
                    {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done" && (
                      <span className="text-[11px] text-red-600">Overdue</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}