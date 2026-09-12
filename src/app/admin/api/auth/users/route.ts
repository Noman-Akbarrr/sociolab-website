import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { listUsers, createUser } from "@/lib/auth/users";
import { hashPassword } from "@/lib/auth/password";
import { canManageUsers, isSalesExecutive } from "@/lib/auth/roles";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || (!canManageUsers(user) && !isSalesExecutive(user))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await listUsers();
  const safe = users.map(({ passwordHash, twoFactorSecret, recoveryCodes, ...rest }) => rest);
  return NextResponse.json(safe);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user || !canManageUsers(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }

  const validRoles = ["super_admin", "admin", "sales_executive", "salesperson", "freelancer"];
  if (role && !validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  const created = await createUser({ name, email, passwordHash, role: role || "salesperson" });

  const { passwordHash: _, twoFactorSecret: __, recoveryCodes: ___, ...safe } = created;
  return NextResponse.json(safe, { status: 201 });
}
