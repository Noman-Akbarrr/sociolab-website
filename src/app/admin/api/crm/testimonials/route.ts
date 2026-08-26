import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const approvedOnly = request.nextUrl.searchParams.get("approved") === "true";

  const testimonials = await prisma.testimonial.findMany({
    where: approvedOnly ? { approved: true } : {},
    orderBy: { createdAt: "desc" },
    include: {
      caseStudy: { select: { id: true, client: true, slug: true } },
      project: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ testimonials });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    quote: string;
    name: string;
    role: string;
    company?: string;
    photo?: string;
    approved?: boolean;
    caseStudyId?: string;
    projectId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.quote || !body.name || !body.role) {
    return NextResponse.json({ error: "Quote, name, and role required." }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      quote: body.quote,
      name: body.name,
      role: body.role,
      company: body.company,
      photo: body.photo,
      approved: body.approved || false,
      caseStudyId: body.caseStudyId,
      projectId: body.projectId,
    },
  });

  return NextResponse.json({ testimonial });
}