import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const token = cookies().get('auth_token')?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 200 });

  const decoded: any = jwt.decode(token);
  const user = decoded ? { id: decoded.id, email: decoded.email } : null;
  return NextResponse.json({ authenticated: true, user }, { status: 200 });
}
