import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("espo_auth");
  response.cookies.delete("espo_user");
  return response;
}
