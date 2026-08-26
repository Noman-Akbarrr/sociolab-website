import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const caseStudies = await prisma.caseStudy.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      slug: true,
      client: true,
      service: true,
      metric: true,
      result: true,
      data: true,
      publishedAt: true,
    },
  });

  return NextResponse.json({ caseStudies });
}