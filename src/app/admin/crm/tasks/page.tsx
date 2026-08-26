import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { TasksClient } from "@/components/admin/crm/TasksClient";

export const metadata = {
  title: "Tasks | Sociolab CRM",
  robots: { index: false, follow: false },
};

async function getTasksData(searchParams: URLSearchParams) {
  const res = await fetch(`/admin/api/crm/tasks?${searchParams}`);
  return res.json();
}

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);
  const data = await getTasksData(params);

  return (
    <TasksClient
      initialTasks={data.tasks}
      initialTotal={data.total}
      initialPage={data.page}
      initialTotalPages={data.totalPages}
      initialProjectId={params.get("projectId") || ""}
      initialStatus={params.get("status") || ""}
      initialAssigneeId={params.get("assigneeId") || ""}
      currentUserId={user.id}
    />
  );
}