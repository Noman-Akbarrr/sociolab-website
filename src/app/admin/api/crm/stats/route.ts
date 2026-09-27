import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalDeals, pipelineValue, activeProjects, openTickets, totalContacts, totalCompanies] =
      await Promise.all([
        prisma.deal.count(),
        prisma.deal.aggregate({ _sum: { value: true } }),
        prisma.project.count({ where: { status: { notIn: ["done", "archived"] } } }),
        prisma.ticket.count({ where: { status: { notIn: ["resolved", "closed"] } } }),
        prisma.contact.count(),
        prisma.company.count(),
      ]);

    return NextResponse.json({
      totalDeals,
      pipelineValue: pipelineValue._sum.value ?? 0,
      activeProjects,
      openTickets,
      totalContacts,
      totalCompanies,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
