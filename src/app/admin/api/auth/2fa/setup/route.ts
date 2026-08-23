import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import QRCode from "qrcode";
import {
  createToken,
  verifyToken,
  SESSION_COOKIE,
  SESSION_MS,
  type SessionPayload,
} from "@/lib/auth/session";
import { generateSecret, verifyTotp, otpauthUrl } from "@/lib/auth/totp";
import { generateRecoveryCodes } from "@/lib/auth/recovery";
import { getCurrentUser } from "@/lib/auth/current";
import { updateUser } from "@/lib/auth/users";

export const runtime = "nodejs";

const PENDING_SECRET_COOKIE = "sociolab_2fa_pending_secret";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (user.isTwoFactorEnabled) {
    return NextResponse.json({ error: "Two-factor is already enabled." }, { status: 400 });
  }

  let action = "";
  let code = "";
  try {
    const body = await request.json();
    action = typeof body.action === "string" ? body.action : "";
    code = typeof body.code === "string" ? body.code.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (action === "start") {
    const secret = generateSecret();
    const otpauth = otpauthUrl(secret, user.email);
    const qr = await QRCode.toDataURL(otpauth, { width: 240, margin: 1 });

    const token = await createToken({
      sub: user.id,
      purpose: "2fa",
      exp: Date.now() + 1000 * 60 * 10,
    });
    const response = NextResponse.json({ ok: true, otpauth, qr });
    response.cookies.set(PENDING_SECRET_COOKIE, JSON.stringify({ secret, token }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 600,
    });
    return response;
  }

  if (action === "confirm") {
    const stored = request.cookies.get(PENDING_SECRET_COOKIE)?.value;
    if (!stored) {
      return NextResponse.json({ error: "Setup session expired. Start again." }, { status: 400 });
    }
    const pendingSecret = JSON.parse(stored) as { secret: string; token: string };
    const payload = await verifyToken<SessionPayload>(pendingSecret.token);
    if (!payload || payload.sub !== user.id || !verifyTotp(pendingSecret.secret, code)) {
      return NextResponse.json({ error: "That code isn't valid. Try again." }, { status: 401 });
    }

    const { codes, hashes } = generateRecoveryCodes();
    await updateUser(user.id, {
      isTwoFactorEnabled: true,
      twoFactorSecret: pendingSecret.secret,
      recoveryCodes: hashes,
    });

    const session = await createToken({
      sub: user.id,
      purpose: "session",
      exp: Date.now() + SESSION_MS,
    });

    const response = NextResponse.json({ ok: true, recoveryCodes: codes });
    response.cookies.set(PENDING_SECRET_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    response.cookies.set(SESSION_COOKIE, session, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_MS / 1000,
    });
    return response;
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}