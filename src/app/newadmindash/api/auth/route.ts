import { NextRequest, NextResponse } from "next/server";

const ESPO_URL = process.env.ESPOCRM_URL || "";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  if (!ESPO_URL) {
    return NextResponse.json({ error: "ESPOCRM_URL not configured" }, { status: 500 });
  }

  try {
    // Authenticate against EspoCRM using Basic Auth
    const credentials = Buffer.from(`${username}:${password}`).toString("base64");

    const res = await fetch(`${ESPO_URL}/api/v1/App/user`, {
      headers: {
        "Authorization": `Basic ${credentials}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const data = await res.json();

    // Create a session cookie with the EspoCRM token
    const response = NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        name: data.user?.name || data.user?.firstName,
      },
    });

    // Store credentials in httpOnly cookie for API calls
    const authValue = Buffer.from(`${username}:${password}`).toString("base64");
    response.cookies.set("espo_auth", authValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    response.cookies.set("espo_user", JSON.stringify({
      id: data.user?.id,
      name: data.user?.name || data.user?.firstName || username,
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to connect to EspoCRM" }, { status: 502 });
  }
}
