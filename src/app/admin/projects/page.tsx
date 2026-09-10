import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
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

  const status = params.get("status") || "";
  const page = parseInt(params.get("page") || "1");
  const limit = 20;

  const where: any = {};
  if (status) where.status = status;

  const [projects, total, companies, deals] = await Promise.all([
    prisma.project.findMany({
      where,
      include: {
        company: true,
        deal: { select: { id: true, title: true } },
        _count: { select: { tasks: true, invoices: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.project.count({ where }),
    prisma.company.findMany({ orderBy: { name: "asc" }, take: 100 }),
    prisma.deal.findMany({
      include: { company: { select: { name: true } }, stage: { select: { isWon: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return (
    <ProjectsList
      initialProjects={projects}
      initialTotal={total}
      initialPage={page}
      initialTotalPages={Math.ceil(total / limit)}
      initialStatus={status}
      initialCompanies={companies}
      initialDeals={deals}
    />
  );
}
