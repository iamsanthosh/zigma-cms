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
  const resource = getResource(params.resource);
  if (!resource) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const pageIdFilter = searchParams.get('page_id');
  const sectionIdFilter = searchParams.get('section_id');
  const menuIdFilter = searchParams.get('menu_id');
  const itemIdFilter = searchParams.get('item_id');

  const where = [];
  const values = [];

  if (q && resource.searchable.length) {
    where.push(`(${resource.searchable.map((c) => `${c} LIKE ?`).join(' OR ')})`);
    resource.searchable.forEach(() => values.push(`%${q}%`));
  }
  if (pageIdFilter && resource.fields.includes('page_id')) {
    where.push('page_id = ?');
    values.push(pageIdFilter);
  }
  if (sectionIdFilter && resource.fields.includes('section_id')) {
    where.push('section_id = ?');
    values.push(sectionIdFilter);
  }
  if (menuIdFilter && resource.fields.includes('menu_id')) {
    where.push('menu_id = ?');
    values.push(menuIdFilter);
  }
  if (itemIdFilter && resource.fields.includes('item_id')) {
    where.push('item_id = ?');
    values.push(itemIdFilter);
  }

  const sql = `SELECT * FROM ${resource.table} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY ${resource.orderBy}`;
  const rows = await query(sql, values);
  return NextResponse.json(rows.map((r) => serializeRow(r, resource)));
}

export async function POST(req, { params }) {
  const user = getSessionUser();
  if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resource = getResource(params.resource);
  if (!resource) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const values = prepareWrite(body, resource);

  const columns = Object.keys(values);
  if (!columns.length) return NextResponse.json({ error: 'No valid fields provided.' }, { status: 400 });

  const columnList = columns.map((c) => `\`${c}\``).join(', ');
  const placeholders = columns.map(() => '?').join(', ');
  const sql = `INSERT INTO ${resource.table} (${columnList}) VALUES (${placeholders})`;
  const result = await query(sql, Object.values(values));

  const pk = resource.primaryKey || 'id';
  const idValue = resource.primaryKey ? values[resource.primaryKey] : result.insertId;
  const [row] = await query(`SELECT * FROM ${resource.table} WHERE \`${pk}\` = ?`, [idValue]);
  return NextResponse.json(serializeRow(row, resource), { status: 201 });
}
