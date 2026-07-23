import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

function serializeRow(row) {
  if (!row) return null;
  const out = { ...row };
  if (out.value && typeof out.value === 'string') {
    try {
      out.value = JSON.parse(out.value);
    } catch {
      /* leave as-is */
    }
  }
  return out;
}

export async function GET() {
  const rows = await query(`SELECT \`key\`, \`value\`, updated_at FROM site_settings ORDER BY \`key\` ASC`, []);
  return NextResponse.json(rows.map(serializeRow));
}

export async function POST(req) {
  const user = await getSessionUser();
  if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { key, value } = body;

  if (!key) return NextResponse.json({ error: 'Missing key.' }, { status: 400 });

  let valStr = value;
  if (value != null && typeof value !== 'string') {
    valStr = JSON.stringify(value);
  }

  // INSERT ... ON DUPLICATE KEY UPDATE for key-based table
  await query(
    `INSERT INTO site_settings (\`key\`, \`value\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`,
    [key, valStr]
  );

  const [row] = await query(`SELECT \`key\`, \`value\`, updated_at FROM site_settings WHERE \`key\` = ?`, [key]);
  return NextResponse.json(serializeRow(row), { status: 201 });
}
