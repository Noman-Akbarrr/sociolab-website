import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { getPipelines, getDeals } from "@/lib/crm-store";
import { PipelineGrid } from "@/components/admin/crm/PipelineGrid";

export const metadata = {
  title: "Pipelines | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function PipelinesPage() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const rawPipelines = await getPipelines();
  const pipelines = await Promise.all(
    rawPipelines.map(async (pipeline: any) => {
      const { deals, total } = await getDeals({ pipelineId: pipeline.id, limit: 0 });
      const totalValue = deals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
      return { ...pipeline, dealCount: total, totalValue };
    })
  );

  return (
    <div className="px-8 py-10">
      <PipelineGrid pipelines={pipelines} userRole={user.role} userId={user.id} />
    </div>
  );
}
