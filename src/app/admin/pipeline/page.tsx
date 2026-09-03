import { PipelineClient } from "@/components/admin/crm/PipelineClient";

export const metadata = {
  title: "Pipeline | Sociolab Admin",
  robots: { index: false, follow: false },
};

async function getPipelineData() {
  const res = await fetch("/admin/api/crm/deals?limit=200", { cache: "no-store" });
  return res.json();
}

async function getStages() {
  const res = await fetch("/admin/api/crm/pipeline-stages", { cache: "no-store" });
  return res.json();
}

export default async function PipelinePage() {
  const [data, stagesData] = await Promise.all([getPipelineData(), getStages()]);

  return (
    <div className="px-8 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Pipeline</h1>
        <p className="mt-1 text-sm text-ink/50">Drag and drop deals between stages.</p>
      </div>
      <PipelineClient
        initialDealsByStage={data.dealsByStage}
        initialStages={stagesData.stages}
      />
    </div>
  );
}
