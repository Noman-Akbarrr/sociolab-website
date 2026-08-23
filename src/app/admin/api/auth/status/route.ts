import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/current";
import { listUsers } from "@/lib/auth/users";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  return NextResponse.json({
    configured: (await listUsers()).length > 0,
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          isTwoFactorEnabled: user.isTwoFactorEnabled,
        }
      : null,
  });
}