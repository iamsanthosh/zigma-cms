import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, signSession, sessionCookieOptions } from '@/lib/auth';

export async function POST(req) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const rows = await query(`SELECT * FROM users WHERE email = ? AND active = 1 LIMIT 1`, [email]);
  const user = rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const token = signSession(user);
  const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  const opts = sessionCookieOptions();
  res.cookies.set(opts.name, token, opts);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const opts = sessionCookieOptions();
  res.cookies.set(opts.name, '', { ...opts, maxAge: 0 });
  return res;
}
