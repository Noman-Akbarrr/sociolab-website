import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const members = await prisma.teamMember.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      role: true,
      bio: true,
      photo: true,
      linkedin: true,
      twitter: true,
      email: true,
    },
  });

  return NextResponse.json({ members });
}