import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const COOKIE_NAME = process.env.COOKIE_NAME || 'zigma_admin_session';
const SECRET = process.env.JWT_SECRET;

// ---------------------------------------------------------------
// DEV-MODE SECURITY BYPASS
// ---------------------------------------------------------------
// When running locally (NODE_ENV !== 'production'), the admin is treated as
// already logged in as a synthetic admin user — no login screen, no cookie
// required — so you can iterate on the CMS without fighting auth on every
// restart. This NEVER applies when NODE_ENV === 'production' (e.g. the
// Hostinger deploy), regardless of any other setting, so it can't
// accidentally ship unauthenticated admin access. Set DEV_BYPASS_AUTH=false
// in your local .env if you specifically want to test the real login flow
// while still in development mode.
export function isDevBypassEnabled() {
  return process.env.NODE_ENV !== 'production' && process.env.DEV_BYPASS_AUTH !== 'false';
}

const DEV_USER = { sub: 0, id: 0, email: 'dev@localhost', name: 'Dev Admin (bypass)', role: 'admin' };

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export function signSession(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function verifySession(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

/** Reads + verifies the session cookie in a Server Component / Route Handler. */
export function getSessionUser() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return isDevBypassEnabled() ? DEV_USER : null;
  return verifySession(token) || (isDevBypassEnabled() ? DEV_USER : null);
}

export function sessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  };
}

export const COOKIE = COOKIE_NAME;

/** Role check helper used by protected API routes. */
export function requireRole(user, roles = ['admin', 'editor']) {
  if (!user || !roles.includes(user.role)) {
    return false;
  }
  return true;
}
