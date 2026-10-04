import { NextResponse } from "next/server";
import { listUsers } from "@/lib/auth/users";
import { getServerUser } from "@/lib/auth/current";

export async function GET() {
  const users = await listUsers();
  const user = await getServerUser();
  return NextResponse.json({
    hasUsers: users.length > 0,
    user: user
      ? { id: user.id, name: user.name, email: user.email, role: user.role, access: user.access ?? [] }
      : null,
  });
}
