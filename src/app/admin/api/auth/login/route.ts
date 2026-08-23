import { NextResponse } from "next/server";
import {
  createToken,
  PENDING_COOKIE,
  PENDING_MS,
  SESSION_COOKIE,
  SESSION_MS,
} from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { getUserByEmail } from "@/lib/auth/users";
import {
  isLocked,
  lockRemainingMs,
  recordFailedAttempt,
  resetFailedAttempts,
  checkIpThrottle,
} from "@/lib/auth/rate-limit";
import { getClientIp } from "@/lib/auth/current";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkIpThrottle(ip)) {
    return NextResponse.json(
      { error: "Too many attempts from this network. Try again in an hour." },
      { status: 429 },
    );
  }

  let email = "";
  let password = "";
  try {
    const body = await request.json();
    email = typeof body.email === "string" ? body.email.trim() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (isLocked(user)) {
    const minutes = Math.ceil(lockRemainingMs(user) / 60000);
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` },
      { status: 423 },
    );
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    const result = await recordFailedAttempt(user);
    if (result.locked) {
      return NextResponse.json(
        { error: "Too many attempts. Account locked for 15 minutes." },
        { status: 423 },
      );
    }
    return NextResponse.json(
      {
        error: "Invalid email or password.",
        remainingAttempts: result.remainingAttempts,
      },
      { status: 401 },
    );
  }

  await resetFailedAttempts(user);

  const response = NextResponse.json({
    ok: true,
    twoFactor: user.isTwoFactorEnabled,
    name: user.name,
  });

  if (user.isTwoFactorEnabled) {
    const pending = await createToken({
      sub: user.id,
      purpose: "2fa",
      exp: Date.now() + PENDING_MS,
    });
    response.cookies.set(PENDING_COOKIE, pending, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: PENDING_MS / 1000,
    });
  } else {
    const session = await createToken({
      sub: user.id,
      purpose: "session",
      exp: Date.now() + SESSION_MS,
    });
    response.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MS / 1000,
    });
  }

  return response;
}