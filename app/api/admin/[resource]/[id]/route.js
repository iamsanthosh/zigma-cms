import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getResource } from '@/lib/resources';
import { getSessionUser, requireRole } from '@/lib/auth';
import { serializeRow, prepareWrite } from '@/lib/apiHelpers';

export async function GET(_req, { params }) {
  const { resource, id } = await params;
  const resourceConfig = getResource(resource);
  if (!resourceConfig) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });
  const pk = resourceConfig.primaryKey || 'id';
  const [row] = await query(`SELECT * FROM ${resourceConfig.table} WHERE \`${pk}\` = ?`, [id]);
  if (!row) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(serializeRow(row, resourceConfig));
}

export async function PUT(req, { params }) {
  const user = await getSessionUser();
  if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resource, id } = await params;
  const resourceConfig = getResource(resource);
  if (!resourceConfig) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const values = prepareWrite(body, resourceConfig);
  const columns = Object.keys(values);
  if (!columns.length) return NextResponse.json({ error: 'No valid fields provided.' }, { status: 400 });

  const pk = resourceConfig.primaryKey || 'id';
  const setClause = columns.map((c) => `\`${c}\` = ?`).join(', ');
  await query(`UPDATE ${resourceConfig.table} SET ${setClause} WHERE \`${pk}\` = ?`, [...Object.values(values), id]);

  const [row] = await query(`SELECT * FROM ${resourceConfig.table} WHERE \`${pk}\` = ?`, [id]);
  return NextResponse.json(serializeRow(row, resourceConfig));
}

export async function DELETE(_req, { params }) {
  const user = await getSessionUser();
  if (!requireRole(user, ['admin'])) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resource, id } = await params;
  const resourceConfig = getResource(resource);
  if (!resourceConfig) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });

  const pk = resourceConfig.primaryKey || 'id';
  await query(`DELETE FROM ${resourceConfig.table} WHERE \`${pk}\` = ?`, [id]);
  return NextResponse.json({ ok: true });
}
