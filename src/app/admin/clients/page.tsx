import { prisma } from "@/lib/prisma";
import { CompaniesClient } from "@/components/admin/crm/CompaniesClient";

export const metadata = {
  title: "Clients | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
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
    <div className="px-8 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Clients</h1>
        <p className="mt-1 text-sm text-ink/50">Manage your client companies and their projects.</p>
      </div>
      <CompaniesClient
        initialCompanies={companies}
        initialTotal={total}
        initialPage={page}
        initialTotalPages={Math.ceil(total / limit)}
        initialSearch={search}
      />
    </div>
  );
}
