import { NextResponse } from 'next/server';
import { readToken } from '../_utils';

export async function GET() {
  const token = readToken();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const res = await fetch(`${process.env.BACKEND_URL}/api/dashboard`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
