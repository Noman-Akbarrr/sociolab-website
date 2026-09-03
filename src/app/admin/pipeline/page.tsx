import * as store from "@/lib/crm-store";
import { PipelineClient } from "@/components/admin/crm/PipelineClient";

export const metadata = {
  title: "Pipeline | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function PipelinePage() {
  const result = store.getDeals({});
  const stages = store.getStages();

  const dealsByStage = stages.map((stage: any) => ({
    stage,
    deals: result.deals.filter((d: any) => d.stageId === stage.id),
  }));

  return (
    <div className="px-8 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Pipeline</h1>
        <p className="mt-1 text-sm text-ink/50">Drag and drop deals between stages.</p>
      </div>
      <PipelineClient
        initialDealsByStage={dealsByStage}
        initialStages={stages}
      />
    </div>
  );
}
