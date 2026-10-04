import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSection, requireAdmin, projectScopeFilter } from "@/lib/auth/guard";
import { isFullAccess } from "@/lib/access";

export async function GET() {
  try {
    const gate = await requireSection("projects");
    if (gate instanceof NextResponse) return gate;

    // Non-admin users only ever see the projects assigned to them.
    const projects = await prisma.project.findMany({
      where: isFullAccess(gate) ? {} : projectScopeFilter(gate.id),
      include: {
        company: true,
        assignee: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true, tasks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const gate = await requireAdmin();
    if (gate instanceof NextResponse) return gate;

    const { name, companyId, assigneeId, status, startDate, endDate, budget, description } =
      await req.json();

    if (!name || !companyId) {
      return NextResponse.json({ error: "name and companyId are required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        companyId,
        assigneeId: assigneeId || null,
        status: status || "kickoff",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ?? null,
        currency: "PKR",
        description: description || null,
      },
      include: {
        company: true,
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
