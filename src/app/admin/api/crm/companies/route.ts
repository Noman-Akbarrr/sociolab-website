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

  const result = store.getCompanies({ search, page, limit });
  const db = require("@/lib/crm-store").__readDb ? require("@/lib/crm-store").__readDb() : null;

  // Add counts
  const companiesWithCounts = result.companies.map((c: any) => {
    const allCompanies = require("@/lib/crm-store").__readDb ? require("@/lib/crm-store").__readDb().companies : [];
    const allDeals = require("@/lib/crm-store").__readDb ? require("@/lib/crm-store").__readDb().deals : [];
    const allContacts = require("@/lib/crm-store").__readDb ? require("@/lib/crm-store").__readDb().contacts : [];
    const allTickets = require("@/lib/crm-store").__readDb ? require("@/lib/crm-store").__readDb().tickets : [];
    const allProjects = require("@/lib/crm-store").__readDb ? require("@/lib/crm-store").__readDb().projects : [];
    return {
      ...c,
      _count: {
        deals: allDeals.filter((d: any) => d.companyId === c.id).length,
        projects: allProjects.filter((p: any) => p.companyId === c.id).length,
        contacts: allContacts.filter((ct: any) => ct.companyId === c.id).length,
        tickets: allTickets.filter((t: any) => t.companyId === c.id).length,
      },
    };
  });

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

  const company = store.createCompany({
    name: body.name,
    domain: body.domain,
    industry: body.industry,
    size: body.size,
    website: body.website,
    linkedin: body.linkedin,
    notes: body.notes,
    tags: body.tags || [],
  });

  store.createActivity({
    type: "company-created",
    subject: `Created company ${company.name}`,
    companyId: company.id,
  }, user.id);

  return NextResponse.json({ company });
}
