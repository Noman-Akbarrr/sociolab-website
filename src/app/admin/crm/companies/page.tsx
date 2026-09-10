import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";
import { CompaniesClient } from "@/components/admin/crm/CompaniesClient";

export const metadata = {
  title: "Companies | Sociolab CRM",
  robots: { index: false, follow: false },
};

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);

  const search = params.get("search") || "";
  const page = parseInt(params.get("page") || "1");
  const limit = 50;

  const where: any = {};
  if (search) {
    const q = search.toLowerCase();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { industry: { contains: q, mode: "insensitive" } },
    ];
  }

  const [companies, total] = await Promise.all([
    prisma.company.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.company.count({ where }),
  ]);

  return (
    <CompaniesClient
      initialCompanies={companies}
      initialTotal={total}
      initialPage={page}
      initialTotalPages={Math.ceil(total / limit)}
      initialSearch={search}
    />
  );
}
