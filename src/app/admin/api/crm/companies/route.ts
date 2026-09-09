import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const search = request.nextUrl.searchParams.get("search") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

  const result = await store.getCompanies({ search, page, limit });

  // Add counts
  const companiesWithCounts = await Promise.all(result.companies.map(async (c: any) => ({
    ...c,
    _count: {
      deals: await store.db.deal.count({ where: { companyId: c.id } }),
      projects: await store.db.project.count({ where: { companyId: c.id } }),
      contacts: await store.db.contact.count({ where: { companyId: c.id } }),
      tickets: await store.db.ticket.count({ where: { companyId: c.id } }),
    },
  })));

  return NextResponse.json({ companies: companiesWithCounts, total: result.total, page: result.page, totalPages: result.totalPages });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    name: string;
    domain?: string;
    industry?: string;
    size?: string;
    website?: string;
    linkedin?: string;
    notes?: string;
    tags?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.name) return NextResponse.json({ error: "Name required." }, { status: 400 });

  const company = await store.createCompany({
    name: body.name,
    domain: body.domain,
    industry: body.industry,
    size: body.size,
    website: body.website,
    linkedin: body.linkedin,
    notes: body.notes,
    tags: body.tags || [],
  });

  await store.createActivity({
    type: "company-created",
    subject: `Created company ${company.name}`,
    companyId: company.id,
  }, user.id);

  return NextResponse.json({ company });
}
