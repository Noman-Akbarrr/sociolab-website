import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/current";
import { requireAdmin } from "@/lib/auth/guard";

async function loadMembers(projectId: string) {
  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
  return members.map((m) => m.user);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const gate = await requireAdmin();
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id }, select: { id: true } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(await loadMembers(id));
  } catch {
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

// Assign / unassign people to this project. Only assigned people can be
// seen as part of the project (and only they can get its tasks).
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const gate = await requireAdmin();
    if (gate instanceof NextResponse) return gate;
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await req.json();
    const raw: unknown = body.userIds;
    const requested: string[] = Array.isArray(raw)
      ? [...new Set(raw.filter((u): u is string => typeof u === "string"))]
      : [];

    const validUsers = await prisma.user.findMany({
      where: { id: { in: requested } },
      select: { id: true, name: true },
    });
    const userIds = validUsers.map((u) => u.id);

    await prisma.$transaction([
      prisma.projectMember.deleteMany({
        where: { projectId: id, userId: { notIn: userIds } },
      }),
      ...userIds.map((userId) =>
        prisma.projectMember.upsert({
          where: { projectId_userId: { projectId: id, userId } },
          update: {},
          create: { projectId: id, userId },
        })
      ),
    ]);

    const user = await getServerUser();
    if (userIds.length) {
      await prisma.activity.create({
        data: {
          type: "updated",
          subject: `Project members assigned: ${validUsers.map((u) => u.name).join(", ")}`,
          userId: user?.id ?? null,
          projectId: id,
        },
      });
    }

    return NextResponse.json(await loadMembers(id));
  } catch {
    return NextResponse.json({ error: "Failed to update members" }, { status: 500 });
  }
}
