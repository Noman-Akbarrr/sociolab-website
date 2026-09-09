import { redirect, notFound } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { getPipeline, getStages, getDeals } from "@/lib/crm-store";
import { PipelineKanban } from "@/components/admin/crm/PipelineKanban";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pipeline = getPipeline(id);
  return {
    title: pipeline ? `${pipeline.name} | Sociolab Admin` : "Pipeline | Sociolab Admin",
    robots: { index: false, follow: false },
  };
}

export default async function PipelineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const pipeline = getPipeline(id);
  if (!pipeline) notFound();

  const stages = getStages(id);
  const { dealsByStage } = getDeals({ pipelineId: id, limit: 100 });

  return (
    <div className="h-full bg-[#090D16]">
      <PipelineKanban
        pipeline={pipeline}
        initialStages={stages}
        initialDealsByStage={dealsByStage}
      />
    </div>
  );
}