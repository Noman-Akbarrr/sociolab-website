import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      shortDesc: true,
      href: true,
      price: true,
      period: true,
      featured: true,
      features: true,
      icon: true,
    },
  });

  return NextResponse.json({ services });
}