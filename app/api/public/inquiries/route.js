import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { name, email, phone, message, source_page, related_item_type, related_item_id } = body;

  if (!name || (!email && !phone)) {
    return NextResponse.json({ error: 'Name and at least one of email/phone are required.' }, { status: 400 });
  }

  await query(
    `INSERT INTO inquiries (name, email, phone, message, source_page, related_item_type, related_item_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email || null, phone || null, message || null, source_page || null, related_item_type || null, related_item_id || null]
  );

  return NextResponse.json({ ok: true });
}
