import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import * as store from "@/lib/crm-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const activeOnly = request.nextUrl.searchParams.get("active") === "true";

  let members = store.getTeamMembers();
  if (activeOnly) members = members.filter((m: any) => m.active !== false);

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

  const member = store.createTeamMember({
    name: body.name,
    role: body.role,
    bio: body.bio,
    photo: body.photo,
    linkedin: body.linkedin,
    twitter: body.twitter,
    email: body.email,
    order: body.order || 0,
    active: body.active ?? true,
  });

  return NextResponse.json({ member });
}
