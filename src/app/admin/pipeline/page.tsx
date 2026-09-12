import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { getPipelines, getDeals } from "@/lib/crm-store";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/roles";
import { PipelineGrid } from "@/components/admin/crm/PipelineGrid";

export const metadata = {
  title: "Pipelines | Sociolab Admin",
  robots: { index: false, follow: false },
};

export default async function PipelinesPage() {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const userIsAdmin = isAdmin(user);

  let rawPipelines = await getPipelines();

  // Non-admin users only see pipelines they are members of
  if (!userIsAdmin) {
    const memberPipelineIds = await prisma.pipelineMember.findMany({
      where: { userId: user.id },
      select: { pipelineId: true },
    });
    const ids = memberPipelineIds.map((m) => m.pipelineId);
    rawPipelines = rawPipelines.filter((p: any) => ids.includes(p.id));
  }

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
