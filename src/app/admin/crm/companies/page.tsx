import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { CompaniesClient } from "@/components/admin/crm/CompaniesClient";

export const metadata = {
  title: "Companies | Sociolab CRM",
  robots: { index: false, follow: false },
};

async function getCompaniesData(searchParams: URLSearchParams) {
  const res = await fetch(`/admin/api/crm/companies?${searchParams}`);
  return res.json();
}

export default async function CompaniesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams(resolvedSearchParams as any);
  const data = await getCompaniesData(params);

  return (
    <CompaniesClient
      initialCompanies={data.companies}
      initialTotal={data.total}
      initialPage={data.page}
      initialTotalPages={data.totalPages}
      initialSearch={params.get("search") || ""}
    />
  );
}