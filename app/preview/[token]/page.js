import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import SectionRenderer from '@/components/site/SectionRenderer';

export const dynamic = 'force-dynamic';

function parse(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
}

export default async function PreviewPage({ params }) {
  const [row] = await query(
    `SELECT * FROM preview_versions WHERE token = ? AND (expires_at IS NULL OR expires_at > NOW()) LIMIT 1`,
    [params.token]
  );
  if (!row) notFound();

  const snapshot = parse(row.snapshot);
  const itemsBySection = (snapshot.items || []).reduce((acc, item) => {
    (acc[item.section_id] ||= []).push({ ...item, data: parse(item.data) });
    return acc;
  }, {});

  const sections = (snapshot.sections || [])
    .filter((s) => s.visible && s.active)
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ ...s, data: parse(s.data), items: itemsBySection[s.id] || [] }));

  return (
    <div>
      <div
        style={{
          background: '#111', color: '#fff', textAlign: 'center', padding: '0.6rem',
          fontFamily: 'monospace', fontSize: '0.8rem', position: 'sticky', top: 0, zIndex: 9999
        }}
      >
        PREVIEW MODE — unpublished draft of &ldquo;{snapshot.page?.title}&rdquo; — not visible to the public
      </div>
      <SectionRenderer sections={sections} />
    </div>
  );
}
