import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

export async function GET(req, { params }) {
  const user = await getSessionUser();
  if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const [row] = await query('SELECT * FROM sections WHERE id = ?', [id]);
  
  if (!row) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }
  
  return NextResponse.json({
    ...row,
    data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
  });
}

export async function PUT(req, { params }) {
  const user = await getSessionUser();
  if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  
  const allowedFields = ['page_id', 'reusable_block_id', 'type', 'name', 'data', 'background_style', 'order', 'visible', 'active'];
  const updates = {};
  
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = field === 'data' ? JSON.stringify(body[field]) : body[field];
    }
  }
  
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }
  
  const setClause = Object.keys(updates).map(f => `\`${f}\` = ?`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  
  await query(`UPDATE sections SET ${setClause} WHERE id = ?`, values);
  
  const [updatedRow] = await query('SELECT * FROM sections WHERE id = ?', [id]);
  return NextResponse.json({
    ...updatedRow,
    data: typeof updatedRow.data === 'string' ? JSON.parse(updatedRow.data) : updatedRow.data
  });
}

export async function DELETE(req, { params }) {
  const user = await getSessionUser();
  if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await query('DELETE FROM sections WHERE id = ?', [id]);
  
  return NextResponse.json({ success: true });
}
