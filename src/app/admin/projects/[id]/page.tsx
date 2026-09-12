import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import { isAdmin, isFreelancer } from "@/lib/auth/roles";
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

  const userIsAdmin = isAdmin(user);
  const userIsFreelancer = isFreelancer(user);

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

  const allowedTabs = ["profile", "work", "submissions"];
  if (userIsAdmin) allowedTabs.push("reports");

  const activeTab = allowedTabs.includes(tab) ? tab : "profile";

  return (
    <div className="min-h-screen bg-[#090D16]">
      <ProjectHeader project={project} userRole={user.role} activeTab={activeTab} />
      <div className="px-8 py-6">
        {activeTab === "profile" && <ProjectProfile project={project} userRole={user.role} />}
        {activeTab === "work" && <ProjectWork project={project} userRole={user.role} userId={user.id} />}
        {activeTab === "submissions" && <ProjectSubmissions project={project} userRole={user.role} userId={user.id} />}
        {activeTab === "reports" && <ProjectReports project={project} />}
      </div>
    </div>
  );
}
