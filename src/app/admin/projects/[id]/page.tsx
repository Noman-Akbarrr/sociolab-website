import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import { ProjectHeader } from "@/components/admin/projects/ProjectHeader";
import { ProjectProfile } from "@/components/admin/projects/ProjectProfile";
import { ProjectWork } from "@/components/admin/projects/ProjectWork";
import { ProjectSubmissions } from "@/components/admin/projects/ProjectSubmissions";
import { ProjectReports } from "@/components/admin/projects/ProjectReports";

export const metadata = {
  title: "Project | Sociolab",
  robots: { index: false, follow: false },
};

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const tab = (resolvedSearchParams.tab as string) || "profile";

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      company: true,
      assignee: { select: { id: true, name: true, email: true } },
      deal: { select: { id: true, title: true, value: true, currency: true, contactEmail: true } },
      tasks: {
        include: { assignee: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
      },
      invoices: { orderBy: { createdAt: "desc" } },
      submissions: { orderBy: { submittedAt: "desc" } },
      activities: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { tasks: true, invoices: true, submissions: true, tickets: true } },
    },
  });

  if (!project) redirect("/admin/projects");

  return (
    <div className="min-h-screen bg-[#090D16]">
      <ProjectHeader project={project} />
      <div className="px-8 py-6">
        {tab === "profile" && <ProjectProfile project={project} />}
        {tab === "work" && <ProjectWork project={project} />}
        {tab === "submissions" && <ProjectSubmissions project={project} />}
        {tab === "reports" && <ProjectReports project={project} />}
        {!["profile", "work", "submissions", "reports"].includes(tab) && <ProjectProfile project={project} />}
      </div>
    </div>
  );
}
