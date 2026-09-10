import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { ProjectsList } from "@/components/admin/projects/ProjectsList";

export const metadata = {
  title: "Projects | Sociolab",
  robots: { index: false, follow: false },
};

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin/api/crm/projects?${params}`, {
    headers: { cookie: "" },
  });
  const data = await res.json();

  return (
    <ProjectsList
      initialProjects={data.projects}
      initialTotal={data.total}
      initialPage={data.page}
      initialTotalPages={data.totalPages}
      initialStatus={params.get("status") || ""}
    />
  );
}
