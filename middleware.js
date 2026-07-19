import { NextResponse } from 'next/server';
import { verifySession, isDevBypassEnabled } from '@/lib/auth';

// NOTE: Next.js middleware runs on the Edge runtime by default, and the
// `jsonwebtoken` package used in lib/auth.js relies on Node's `crypto`
// module, which the Edge runtime does not fully support. If you hit a
// runtime error here after deploying, either (a) swap jsonwebtoken for an
// Edge-compatible JWT library such as `jose`, or (b) run this project with
// the Node.js middleware runtime (`export const runtime = 'nodejs'` below,
// supported in Next.js 14+ as an experimental flag) — whichever is simpler
// for your Hostinger setup.
export const runtime = 'nodejs';

const COOKIE_NAME = process.env.COOKIE_NAME || 'zigma_admin_session';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  if (isDevBypassEnabled()) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? verifySession(token) : null;

  if (!session) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
