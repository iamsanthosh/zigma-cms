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
        /* leave as-is if not valid JSON */
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

export async function GET(req, { params }) {
  const { resource } = await params;
  const resourceConfig = getResource(resource);
  if (!resourceConfig) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const pageIdFilter = searchParams.get('page_id');
  const sectionIdFilter = searchParams.get('section_id');
  const menuIdFilter = searchParams.get('menu_id');
  const itemIdFilter = searchParams.get('item_id');

  const where = [];
  const values = [];

  if (q && resourceConfig.searchable.length) {
    where.push(`(${resourceConfig.searchable.map((c) => `${c} LIKE ?`).join(' OR ')})`);
    resourceConfig.searchable.forEach(() => values.push(`%${q}%`));
  }
  if (pageIdFilter && resourceConfig.fields.includes('page_id')) {
    where.push('page_id = ?');
    values.push(pageIdFilter);
  }
  if (sectionIdFilter && resourceConfig.fields.includes('section_id')) {
    where.push('section_id = ?');
    values.push(sectionIdFilter);
  }
  if (menuIdFilter && resourceConfig.fields.includes('menu_id')) {
    where.push('menu_id = ?');
    values.push(menuIdFilter);
  }
  if (itemIdFilter && resourceConfig.fields.includes('item_id')) {
    where.push('item_id = ?');
    values.push(itemIdFilter);
  }

  const sql = `SELECT * FROM ${resourceConfig.table} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY ${resourceConfig.orderBy}`;
  const rows = await query(sql, values);
  return NextResponse.json(rows.map((r) => serializeRow(r, resourceConfig)));
}

export async function POST(req, { params }) {
  const user = await getSessionUser();
  if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resource } = await params;
  const resourceConfig = getResource(resource);
  if (!resourceConfig) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const values = prepareWrite(body, resourceConfig);

  const columns = Object.keys(values);
  if (!columns.length) return NextResponse.json({ error: 'No valid fields provided.' }, { status: 400 });

  const columnList = columns.map((c) => `\`${c}\``).join(', ');
  const placeholders = columns.map(() => '?').join(', ');
  const sql = `INSERT INTO ${resourceConfig.table} (${columnList}) VALUES (${placeholders})`;
  const result = await query(sql, Object.values(values));

  const pk = resourceConfig.primaryKey || 'id';
  const idValue = resourceConfig.primaryKey ? values[resourceConfig.primaryKey] : result.insertId;
  const [row] = await query(`SELECT * FROM ${resourceConfig.table} WHERE \`${pk}\` = ?`, [idValue]);
  return NextResponse.json(serializeRow(row, resourceConfig), { status: 201 });
}
