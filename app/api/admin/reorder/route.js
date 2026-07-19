import { NextResponse } from 'next/server';
import { withTransaction } from '@/lib/db';
import { getResource } from '@/lib/resources';
import { getSessionUser, requireRole } from '@/lib/auth';

/**
 * Body: { resource: 'sections', order: [{ id: 3, order: 0 }, { id: 1, order: 1 }, ...] }
 * Used by every admin drag-and-drop list (page sections, menu items, product
 * tiles, media gallery order, etc.) so reordering is one shared code path.
 */
export async function POST(req) {
  const user = getSessionUser();
  if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resource: resourceName, order } = await req.json().catch(() => ({}));
  const resource = getResource(resourceName);
  if (!resource || !Array.isArray(order)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  await withTransaction(async (conn) => {
    for (const { id, order: pos } of order) {
      await conn.query(`UPDATE ${resource.table} SET \`order\` = ? WHERE id = ?`, [pos, id]);
    }
  });

  return NextResponse.json({ ok: true });
}
