import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { ProjectsClient } from "@/components/admin/crm/ProjectsClient";

export const metadata = {
  title: "Projects | Sociolab CRM",
  robots: { index: false, follow: false },
};

async function getProjectsData(searchParams: URLSearchParams) {
  const res = await fetch(`/admin/api/crm/projects?${searchParams}`);
  return res.json();
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);
  const data = await getProjectsData(params);

  return (
    <ProjectsClient
      initialProjects={data.projects}
      initialTotal={data.total}
      initialPage={data.page}
      initialTotalPages={data.totalPages}
      initialStatus={params.get("status") || ""}
    />
  );
}