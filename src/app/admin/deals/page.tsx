import * as store from "@/lib/crm-store";
import { DealsClient } from "@/components/admin/crm/DealsClient";

export const metadata = {
  title: "Deals | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function DealsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedSearchParams = await searchParams;
  const stageId = (resolvedSearchParams.stageId as string) || "";
  const companyId = (resolvedSearchParams.companyId as string) || "";
  const search = (resolvedSearchParams.search as string) || "";
  const page = parseInt((resolvedSearchParams.page as string) || "1");
  const limit = 20;

  const result = store.getDeals({ stageId, companyId, search, page, limit });
  const stages = store.getStages();
  const companies = store.getCompanies({ limit: 100 }).companies;

  return (
    <div className="px-8 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Deals</h1>
        <p className="mt-1 text-sm text-ink/50">Manage your sales deals.</p>
      </div>
      <DealsClient
        initialDeals={result.deals}
        initialDealsByStage={result.dealsByStage}
        initialStages={stages}
        initialCompanies={companies}
        initialStageFilter={stageId}
        initialSearch={search}
        initialCompanyFilter={companyId}
        initialPage={page}
        initialTotalPages={result.totalPages}
        initialTotal={result.total}
      />
    </div>
  );
}
