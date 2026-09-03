import { DealsClient } from "@/components/admin/crm/DealsClient";

export const metadata = {
  title: "Deals | Sociolab Admin",
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
  const resolvedSearchParams = await searchParams;
  const [data, stagesData, companiesData] = await Promise.all([
    getDealsData(new URLSearchParams(resolvedSearchParams as any)),
    getStages(),
    getCompanies(),
  ]);

  const { deals, dealsByStage, total, page, totalPages } = data;
  const stageFilter = resolvedSearchParams.stageId as string || "";
  const search = resolvedSearchParams.search as string || "";
  const companyFilter = resolvedSearchParams.companyId as string || "";

  return (
    <div className="px-8 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Deals</h1>
        <p className="mt-1 text-sm text-ink/50">Manage your sales deals.</p>
      </div>
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
    </div>
  );
}
