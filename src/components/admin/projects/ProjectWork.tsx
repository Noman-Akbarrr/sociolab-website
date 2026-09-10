"use client";

import { useState } from "react";

const columns = [
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
];

const priorityLabels: Record<number, string> = { 0: "Low", 1: "Medium", 2: "High", 3: "Urgent" };
const priorityColors: Record<number, string> = {
  0: "bg-white/10 text-white/50",
  1: "bg-blue-500/20 text-blue-400",
  2: "bg-yellow-500/20 text-yellow-400",
  3: "bg-red-500/20 text-red-400",
};

export function ProjectWork({ project }: { project: any }) {
  const [tasks, setTasks] = useState(project.tasks || []);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: 0, assigneeId: "", dueDate: "" });
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  async function updateTaskStatus(taskId: string, newStatus: string) {
    setTasks((prev: any[]) => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    await fetch(`/admin/api/crm/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/admin/api/crm/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, ...newTask }),
    });
    if (res.ok) {
      const { task } = await res.json();
      setTasks((prev: any[]) => [{ ...task, assignee: null }, ...prev]);
      setShowAdd(false);
      setNewTask({ title: "", description: "", priority: 0, assigneeId: "", dueDate: "" });
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm("Delete this task?")) return;
    await fetch(`/admin/api/crm/tasks/${taskId}`, { method: "DELETE" });
    setTasks((prev: any[]) => prev.filter(t => t.id !== taskId));
  }

  function handleDragStart(e: React.DragEvent, taskId: string) {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent, columnKey: string) {
    e.preventDefault();
    if (draggedTask) {
      updateTaskStatus(draggedTask, columnKey);
      setDraggedTask(null);
    }
  }

  function formatDate(d: string | null) {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button onClick={() => setView("kanban")} className={`rounded-[3px] px-3 py-1.5 text-sm font-medium transition-colors ${view === "kanban" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}>
            Kanban
          </button>
          <button onClick={() => setView("list")} className={`rounded-[3px] px-3 py-1.5 text-sm font-medium transition-colors ${view === "list" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}>
            List
          </button>
        </div>
        <button onClick={() => setShowAdd(true)} className="rounded-[3px] bg-brand px-3 py-1.5 text-sm font-bold text-white hover:bg-brand-dark transition-colors">
          + Add Task
        </button>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="grid grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t: any) => t.status === col.key);
            return (
              <div
                key={col.key}
                className="rounded-[3px] border border-[#1E293B] bg-[#090D16] p-3"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.key)}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">{col.label}</span>
                  <span className="text-xs text-white/40">{colTasks.length}</span>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {colTasks.map((task: any) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`rounded-[3px] border border-[#1E293B] bg-[#111827] p-3 cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors ${draggedTask === task.id ? "opacity-50" : ""}`}
                    >
                      <div className="text-sm text-white font-medium mb-1">{task.title}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityColors[task.priority] || priorityColors[0]}`}>
                          {priorityLabels[task.priority] || "Low"}
                        </span>
                        {task.assignee && (
                          <span className="text-[11px] text-white/40">{task.assignee.name}</span>
                        )}
                        {task.dueDate && (
                          <span className="text-[11px] text-white/40">{formatDate(task.dueDate)}</span>
                        )}
                      </div>
                      <div className="mt-2 flex gap-1">
                        {task.status !== "done" && (
                          <button onClick={() => updateTaskStatus(task.id, "done")} className="text-[10px] text-green-400 hover:underline">Complete</button>
                        )}
                        <button onClick={() => handleDeleteTask(task.id)} className="text-[10px] text-red-400 hover:underline ml-auto">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="rounded-[3px] border border-[#1E293B] bg-[#111827] overflow-hidden">
          {tasks.length === 0 ? (
            <p className="p-8 text-center text-sm text-white/50">No tasks yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Task</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Assignee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Due</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {tasks.map((task: any) => (
                  <tr key={task.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-white">{task.title}</td>
                    <td className="px-4 py-3">
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className="rounded-[3px] border border-[#1E293B] bg-[#111827] px-2 py-1 text-xs text-white focus:outline-none focus:border-brand"
                      >
                        {columns.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityColors[task.priority] || priorityColors[0]}`}>
                        {priorityLabels[task.priority] || "Low"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50">{task.assignee?.name || "—"}</td>
                    <td className="px-4 py-3 text-white/50">{formatDate(task.dueDate) || "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteTask(task.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Task Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[3px] bg-[#111827] p-6 shadow-xl">
            <h2 className="font-display text-xl font-semibold text-white">Add Task</h2>
            <form onSubmit={handleAddTask} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Title *</label>
                <input type="text" required value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1">Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} rows={2} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: parseInt(e.target.value) })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand">
                    <option value={0}>Low</option>
                    <option value={1}>Medium</option>
                    <option value={2}>High</option>
                    <option value={3}>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white/60 mb-1">Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="w-full rounded-[3px] border border-[#1E293B] bg-[#111827] px-3 py-2 text-sm text-white focus:outline-none focus:border-brand" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-[3px] border border-[#1E293B] px-4 py-2 text-sm font-bold text-white hover:border-brand transition-colors">Cancel</button>
                <button type="submit" className="rounded-[3px] bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark transition-colors">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
