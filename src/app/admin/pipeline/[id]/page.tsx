import { redirect, notFound } from "next/navigation";
import { getServerUser } from "@/lib/auth/current";
import { getPipeline, getStages, getDeals } from "@/lib/crm-store";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/roles";
import { PipelineKanban } from "@/components/admin/crm/PipelineKanban";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pipeline = await getPipeline(id);
  return {
    title: pipeline ? `${pipeline.name} | Sociolab Admin` : "Pipeline | Sociolab Admin",
    robots: { index: false, follow: false },
  };
}

export default async function PipelineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (!user) redirect("/admin/login");

  const { id } = await params;
  const pipeline = await getPipeline(id);
  if (!pipeline) notFound();

  // Non-admin users must be pipeline members
  if (!isAdmin(user)) {
    const isMember = await prisma.pipelineMember.findUnique({
      where: { pipelineId_userId: { pipelineId: id, userId: user.id } },
    });
    if (!isMember) notFound();
  }

  const stages = await getStages(id);
  const { dealsByStage } = await getDeals({ pipelineId: id, limit: 100 });

  // Fetch pipeline members for the deal owner dropdown
  const pipelineMembers = await prisma.pipelineMember.findMany({
    where: { pipelineId: id },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
  });

  return (
    <div className="h-full bg-[#090D16]">
      <PipelineKanban
        pipeline={pipeline}
        initialStages={stages}
        initialDealsByStage={dealsByStage}
        pipelineMembers={pipelineMembers.map((m) => m.user)}
        userRole={user.role}
        userId={user.id}
      />
    </div>
  );
}
