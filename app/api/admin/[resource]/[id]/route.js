import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getResource } from '@/lib/resources';
import { getSessionUser, requireRole } from '@/lib/auth';

function serializeRow(row, resource) {
  const out = { ...row };
  for (const field of resource.json) {
    if (out[field] != null && typeof out[field] === 'string') {
      try {
        out[field] = JSON.parse(out[field]);
      } catch {
        /* leave as-is */
      }
    }
  }
  return out;
}

function prepareWrite(body, resource) {
  const values = {};
  for (const field of resource.fields) {
    if (!(field in body)) continue;
    let val = body[field];
    if (resource.json.includes(field) && val != null && typeof val !== 'string') {
      val = JSON.stringify(val);
    }
    values[field] = val;
  }
  return values;
}

export async function GET(_req, { params }) {
  const resource = getResource(params.resource);
  if (!resource) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });
  const pk = resource.primaryKey || 'id';
  const [row] = await query(`SELECT * FROM ${resource.table} WHERE \`${pk}\` = ?`, [params.id]);
  if (!row) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(serializeRow(row, resource));
}

export async function PUT(req, { params }) {
  const user = getSessionUser();
  if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resource = getResource(params.resource);
  if (!resource) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const values = prepareWrite(body, resource);
  const columns = Object.keys(values);
  if (!columns.length) return NextResponse.json({ error: 'No valid fields provided.' }, { status: 400 });

  const pk = resource.primaryKey || 'id';
  const setClause = columns.map((c) => `\`${c}\` = ?`).join(', ');
  await query(`UPDATE ${resource.table} SET ${setClause} WHERE \`${pk}\` = ?`, [...Object.values(values), params.id]);

  const [row] = await query(`SELECT * FROM ${resource.table} WHERE \`${pk}\` = ?`, [params.id]);
  return NextResponse.json(serializeRow(row, resource));
}

export async function DELETE(_req, { params }) {
  const user = getSessionUser();
  if (!requireRole(user, ['admin'])) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resource = getResource(params.resource);
  if (!resource) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });

  const pk = resource.primaryKey || 'id';
  await query(`DELETE FROM ${resource.table} WHERE \`${pk}\` = ?`, [params.id]);
  return NextResponse.json({ ok: true });
}
