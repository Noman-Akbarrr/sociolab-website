import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { DealsClient } from "@/components/admin/crm/DealsClient";

export const metadata = {
  title: "Deals | Sociolab CRM",
  robots: { index: false, follow: false },
};

async function getDealsData(searchParams: URLSearchParams) {
  const stageId = searchParams.get("stageId") || "";
  const companyId = searchParams.get("companyId") || "";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const res = await fetch(`/admin/api/crm/deals?${new URLSearchParams({ stageId, companyId, search, page: String(page), limit: String(limit) })}`);
  return res.json();
}

async function getStages() {
  const res = await fetch("/admin/api/crm/pipeline-stages");
  return res.json();
}

async function getCompanies() {
  const res = await fetch("/admin/api/crm/companies?limit=100");
  return res.json();
}

export default async function DealsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const [data, stagesData, companiesData] = await Promise.all([
    getDealsData(new URLSearchParams(resolvedSearchParams as any)),
    getStages(),
    getCompanies(),
  ]);

  const { deals, dealsByStage, stages, total, page, totalPages } = data;
  const stageFilter = resolvedSearchParams.stageId as string || "";
  const search = resolvedSearchParams.search as string || "";
  const companyFilter = resolvedSearchParams.companyId as string || "";

  return (
    <DealsClient
      initialDeals={deals}
      initialDealsByStage={dealsByStage}
      initialStages={stagesData.stages}
      initialCompanies={companiesData.companies}
      initialStageFilter={stageFilter}
      initialSearch={search}
      initialCompanyFilter={companyFilter}
      initialPage={page}
      initialTotalPages={totalPages}
      initialTotal={total}
    />
  );
}