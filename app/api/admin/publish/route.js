import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

async function buildPageSnapshot(pageId) {
  const [page] = await query(`SELECT * FROM pages WHERE id = ?`, [pageId]);
  if (!page) return null;
  const sections = await query(`SELECT * FROM sections WHERE page_id = ? ORDER BY \`order\` ASC`, [pageId]);
  const sectionIds = sections.map((s) => s.id);
  let items = [];
  if (sectionIds.length) {
    const placeholders = sectionIds.map(() => '?').join(',');
    items = await query(`SELECT * FROM section_items WHERE section_id IN (${placeholders})`, sectionIds);
  }
  return { page, sections, items };
}

/**
 * POST body: { entityType: 'page', entityId: 3, action: 'publish' | 'preview' }
 * publish -> snapshots current draft content, stores it in publish_versions,
 *            and flips pages.publish_status to 'published' (what the public
 *            site renderer reads).
 * preview -> snapshots current content into preview_versions behind a random
 *            token and returns a shareable /preview/<token> URL without
 *            touching the published/live content at all.
 */
export async function POST(req) {
  const user = getSessionUser();
  if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { entityType, entityId, action } = await req.json().catch(() => ({}));
  if (entityType !== 'page') {
    return NextResponse.json({ error: 'Only page publish/preview is implemented in this route; extend for product/service if needed.' }, { status: 400 });
  }

  const snapshot = await buildPageSnapshot(entityId);
  if (!snapshot) return NextResponse.json({ error: 'Page not found.' }, { status: 404 });

  if (action === 'preview') {
    const token = nanoid(24);
    await query(
      `INSERT INTO preview_versions (entity_type, entity_id, token, snapshot, expires_at) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
      [entityType, entityId, token, JSON.stringify(snapshot)]
    );
    return NextResponse.json({ ok: true, previewUrl: `/preview/${token}` });
  }

  // default: publish
  await query(
    `INSERT INTO publish_versions (entity_type, entity_id, snapshot, published_by) VALUES (?, ?, ?, ?)`,
    [entityType, entityId, JSON.stringify(snapshot), user.sub]
  );
  await query(`UPDATE pages SET publish_status = 'published' WHERE id = ?`, [entityId]);

  return NextResponse.json({ ok: true });
}
