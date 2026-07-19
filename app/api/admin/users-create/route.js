import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, getSessionUser, requireRole } from '@/lib/auth';

export async function POST(req) {
  const user = getSessionUser();
  if (!requireRole(user, ['admin'])) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, email, password, role } = await req.json().catch(() => ({}));
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
  }

  const password_hash = await hashPassword(password);
  await query(
    `INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, ?, 1)`,
    [name, email, password_hash, role === 'admin' ? 'admin' : 'editor']
  );

  return NextResponse.json({ ok: true }, { status: 201 });
}
