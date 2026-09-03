import { CompaniesClient } from "@/components/admin/crm/CompaniesClient";

export const metadata = {
  title: "Clients | Sociolab Admin",
  robots: { index: false, follow: false },
};

async function getCompaniesData(searchParams: URLSearchParams) {
  const res = await fetch(`/admin/api/crm/companies?${searchParams}`);
  return res.json();
}

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);
  const data = await getCompaniesData(params);

  return (
    <div className="px-8 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Clients</h1>
        <p className="mt-1 text-sm text-ink/50">Manage your client companies and their projects.</p>
      </div>
      <CompaniesClient
        initialCompanies={data.companies}
        initialTotal={data.total}
        initialPage={data.page}
        initialTotalPages={data.totalPages}
        initialSearch={params.get("search") || ""}
      />
    </div>
  );
}
