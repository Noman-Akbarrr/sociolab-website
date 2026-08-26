import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const activeOnly = request.nextUrl.searchParams.get("active") === "true";

  const members = await prisma.teamMember.findMany({
    where: activeOnly ? { active: true } : {},
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ members });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  let body: {
    name: string;
    role: string;
    bio?: string;
    photo?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
    order?: number;
    active?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.name || !body.role) {
    return NextResponse.json({ error: "Name and role required." }, { status: 400 });
  }

  const member = await prisma.teamMember.create({
    data: {
      name: body.name,
      role: body.role,
      bio: body.bio,
      photo: body.photo,
      linkedin: body.linkedin,
      twitter: body.twitter,
      email: body.email,
      order: body.order || 0,
      active: body.active ?? true,
    },
  });

  return NextResponse.json({ member });
}