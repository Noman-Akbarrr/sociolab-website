import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createToken,
  verifyToken,
  PENDING_COOKIE,
  PENDING_MS,
  SESSION_COOKIE,
  SESSION_MS,
  type SessionPayload,
} from "@/lib/auth/session";
import { verifyTotp } from "@/lib/auth/totp";
import { consumeRecoveryCode } from "@/lib/auth/recovery";
import { getUserById, updateUser } from "@/lib/auth/users";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const pendingToken = request.cookies.get(PENDING_COOKIE)?.value;
  const pending = await verifyToken<SessionPayload>(pendingToken);
  if (!pending || pending.purpose !== "2fa") {
    return NextResponse.json({ error: "Your sign-in has expired. Log in again." }, { status: 401 });
  }

  let code = "";
  let isRecovery = false;
  try {
    const body = await request.json();
    code = typeof body.code === "string" ? body.code.trim() : "";
    isRecovery = Boolean(body.isRecovery);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "Enter your code." }, { status: 400 });
  }

  const user = await getUserById(pending.sub);
  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 401 });
  }

  let valid = false;
  if (isRecovery) {
    const result = await consumeRecoveryCode(user.recoveryCodes, code);
    valid = result.valid;
    if (result.valid) {
      await updateUser(user.id, { recoveryCodes: result.remaining });
    }
  } else if (user.twoFactorSecret) {
    valid = verifyTotp(user.twoFactorSecret, code);
  }

  if (!valid) {
    return NextResponse.json({ error: "That code isn't valid. Try again." }, { status: 401 });
  }

  const session = await createToken({
    sub: user.id,
    purpose: "session",
    exp: Date.now() + SESSION_MS,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });
  response.cookies.set(PENDING_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}