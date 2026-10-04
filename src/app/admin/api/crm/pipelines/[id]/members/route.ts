import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";
import { requirePipelineManager, requireSection, requirePipeline } from "@/lib/auth/guard";
import { isFullAccess, roleOf } from "@/lib/access";

async function loadMembers(pipelineId: string) {
  const members = await prisma.pipelineMember.findMany({
    where: { pipelineId },
    include: { user: { select: { id: true, name: true, email: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });
  return members.map((m) => m.user);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const gate = await requireSection("pipeline");
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;
    const allowed = await requirePipeline(gate, id);
    if (allowed !== true) return allowed;
    return NextResponse.json(await loadMembers(id));
  } catch {
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

// Assign / unassign people to this pipeline. Salesmen only ever get placed
// on pipelines this way — that is what makes a pipeline visible to them.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const gate = await requirePipelineManager();
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;

    const pipeline = await prisma.pipeline.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!pipeline) {
      return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
    }

    const body = await req.json();
    const raw: unknown = body.userIds;
    const requested: string[] = Array.isArray(raw)
      ? [...new Set(raw.filter((u): u is string => typeof u === "string"))]
      : [];

    const validUsers = await prisma.user.findMany({
      where: { id: { in: requested } },
      select: { id: true, name: true, role: true },
    });

    // A sales lead may only hand work to salesmen (plus keeping themselves
    // on the team); admins can pick anyone.
    const allowedUsers = isFullAccess(gate)
      ? validUsers
      : validUsers.filter((u) => roleOf(u) === "salesman" || u.id === gate.id);

    const userIds = allowedUsers.map((u) => u.id);

    await prisma.$transaction([
      prisma.pipelineMember.deleteMany({
        where: { pipelineId: id, userId: { notIn: userIds } },
      }),
      ...userIds.map((userId) =>
        prisma.pipelineMember.upsert({
          where: { pipelineId_userId: { pipelineId: id, userId } },
          update: {},
          create: { pipelineId: id, userId },
        })
      ),
    ]);

    const user = await getServerUser();
    if (userIds.length) {
      await prisma.activity.create({
        data: {
          type: "updated",
          subject: `Pipeline team assigned: ${allowedUsers.map((u) => u.name).join(", ")}`,
          userId: user?.id ?? null,
        },
      });
    }

    return NextResponse.json(await loadMembers(id));
  } catch {
    return NextResponse.json({ error: "Failed to update members" }, { status: 500 });
  }
}
