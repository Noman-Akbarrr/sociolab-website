import { NextResponse } from "next/server";
import { requireUser, requireAdmin } from "@/lib/auth/guard";
import { sanitizeAccess } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function GET() {
  const gate = await requireUser();
  if (gate instanceof NextResponse) return gate;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        access: true,
        isTwoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (gate instanceof NextResponse) return gate;

  try {
    const { name, email, password, role, access } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 10) {
      return NextResponse.json({ error: "Password must be at least 10 characters" }, { status: 400 });
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: "Password must contain an uppercase letter" }, { status: 400 });
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json({ error: "Password must contain a lowercase letter" }, { status: 400 });
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ error: "Password must contain a digit" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    // Everyone outside the main account starts as a member with only the
    // sections the admin ticked.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role === "admin" || role === "super_admin" ? role : "member",
        access: sanitizeAccess(access),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        access: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
