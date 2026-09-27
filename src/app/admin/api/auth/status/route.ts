import { NextResponse } from "next/server";
import { listUsers } from "@/lib/auth/users";

export async function GET() {
  const users = await listUsers();
  return NextResponse.json({ hasUsers: users.length > 0 });
}
