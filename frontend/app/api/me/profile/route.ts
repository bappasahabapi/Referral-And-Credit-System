import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const token = cookies().get("auth_token")?.value;
  const decoded: any = token ? jwt.decode(token) : null;
  const body = decoded
    ? { authenticated: true, user: { id: decoded.id, email: decoded.email } }
    : { authenticated: false };

  const res = NextResponse.json(body, { status: 200 });

  res.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  return res;
}
