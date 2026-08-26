import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { PipelineClient } from "@/components/admin/crm/PipelineClient";

export const metadata = {
  title: "Pipeline | Sociolab CRM",
  robots: { index: false, follow: false },
};

async function getPipelineData() {
  const res = await fetch("/admin/api/crm/deals?limit=200");
  return res.json();
}

async function getStages() {
  const res = await fetch("/admin/api/crm/pipeline-stages");
  return res.json();
}

export default async function PipelinePage() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const [data, stagesData] = await Promise.all([getPipelineData(), getStages()]);
  const { dealsByStage, stages } = data;

  return (
    <PipelineClient
      initialDealsByStage={dealsByStage}
      initialStages={stagesData.stages}
    />
  );
}