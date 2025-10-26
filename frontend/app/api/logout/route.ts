import { NextResponse } from "next/server";

export async function POST() {
  const resp = NextResponse.json({ ok: true });
  resp.cookies.set("auth_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  return resp;
}
