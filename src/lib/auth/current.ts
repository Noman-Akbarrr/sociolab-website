import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, SESSION_COOKIE, type SessionPayload } from "@/lib/auth/session";
import { getUserById, type AdminUser } from "@/lib/auth/users";

export async function getCurrentUser(request: NextRequest): Promise<AdminUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = await verifyToken<SessionPayload>(token);
  if (!payload || payload.purpose !== "session") return null;
  return getUserById(payload.sub);
}

export async function getServerUser(): Promise<AdminUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const payload = await verifyToken<SessionPayload>(token);
  if (!payload || payload.purpose !== "session") return null;
  return getUserById(payload.sub);
}

export function getClientIp(request: NextRequest | Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}