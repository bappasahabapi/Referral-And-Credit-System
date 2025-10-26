import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protect these routes if no auth_token cookie
const protectedPaths = [/^\/dashboard(.*)/, /^\/referrals(.*)/, /^\/purchase(.*)/];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPaths.some((re) => re.test(pathname));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('auth_token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/referrals/:path*', '/purchase/:path*']
};
