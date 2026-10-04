import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, projectScopeFilter } from "@/lib/auth/guard";
import { hasSection, isFullAccess } from "@/lib/access";

export async function GET() {
  try {
    const user = await requireUser();
    if (user instanceof NextResponse) return user;
    const full = isFullAccess(user);

    const wantDeals = full || hasSection(user, "deals");
    const wantProjects = full || hasSection(user, "projects");
    const wantTickets = full || hasSection(user, "tickets");
    const wantContacts = full || hasSection(user, "contacts");
    const wantCompanies = full || hasSection(user, "companies");

    const [totalDeals, pipelineValue, activeProjects, openTickets, totalContacts, totalCompanies] =
      await Promise.all([
        wantDeals
          ? prisma.deal.count()
          : Promise.resolve(0),
        wantDeals
          ? prisma.deal.aggregate({ _sum: { value: true } })
          : Promise.resolve({ _sum: { value: null } }),
        wantProjects
          ? prisma.project.count({
              where: {
                AND: [
                  { status: { notIn: ["done", "archived"] } },
                  full ? {} : projectScopeFilter(user.id),
                ],
              },
            })
          : Promise.resolve(0),
        wantTickets
          ? prisma.ticket.count({ where: { status: { notIn: ["resolved", "closed"] } } })
          : Promise.resolve(0),
        wantContacts ? prisma.contact.count() : Promise.resolve(0),
        wantCompanies ? prisma.company.count() : Promise.resolve(0),
      ]);

    return NextResponse.json({
      totalDeals,
      pipelineValue: pipelineValue._sum.value ?? 0,
      activeProjects,
      openTickets,
      totalContacts,
      totalCompanies,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
