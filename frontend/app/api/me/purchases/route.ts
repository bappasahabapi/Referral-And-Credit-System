import { NextRequest, NextResponse } from "next/server";
import { readToken } from "../_utils";

export async function POST(req: NextRequest) {
  const token = readToken();
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const res = await fetch(`${process.env.BACKEND_URL}/api/purchases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
