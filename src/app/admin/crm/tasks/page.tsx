import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import { TasksClient } from "@/components/admin/crm/TasksClient";

export const metadata = {
  title: "Tasks | Sociolab CRM",
  robots: { index: false, follow: false },
};

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);

  const projectId = params.get("projectId") || "";
  const assigneeId = params.get("assigneeId") || "";
  const status = params.get("status") || "";

  const where: any = {};
  if (projectId) where.projectId = projectId;
  if (assigneeId) where.assigneeId = assigneeId;
  if (status) where.status = status;

  const tasks = await prisma.task.findMany({ where, include: { assignee: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } });

  return (
    <TasksClient
      initialTasks={tasks}
      initialTotal={tasks.length}
      initialPage={1}
      initialTotalPages={1}
      initialProjectId={projectId}
      initialStatus={status}
      initialAssigneeId={assigneeId}
      currentUserId={user.id}
    />
  );
}
