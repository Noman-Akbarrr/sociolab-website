import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data: Record<string, unknown> = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.role !== undefined) data.role = body.role;

    if (body.password) {
      if (body.password.length < 10) {
        return NextResponse.json({ error: "Password must be at least 10 characters" }, { status: 400 });
      }
      if (!/[A-Z]/.test(body.password)) {
        return NextResponse.json({ error: "Password must contain an uppercase letter" }, { status: 400 });
      }
      if (!/[a-z]/.test(body.password)) {
        return NextResponse.json({ error: "Password must contain a lowercase letter" }, { status: 400 });
      }
      if (!/[0-9]/.test(body.password)) {
        return NextResponse.json({ error: "Password must contain a digit" }, { status: 400 });
      }
      data.passwordHash = await hash(body.password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isTwoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
