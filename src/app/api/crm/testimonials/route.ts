import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      quote: true,
      name: true,
      role: true,
      company: true,
      photo: true,
      caseStudy: { select: { id: true, client: true, slug: true } },
      project: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ testimonials });
}