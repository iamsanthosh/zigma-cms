'use client';
import { useEffect, useState } from 'react';
import MediaPicker from './MediaPicker';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
}

/**
 * Manages one seo_metadata row and keeps the parent record's `seo_id`
 * pointed at it. Used identically from the page editor and the
 * product/service editor — SEO fields are the same shape everywhere.
 *
 * `entitySeoId`   — current seo_id on the parent row (may be null)
 * `onSeoIdChange` — called once, right after the first save, with the new
 *                   seo_metadata id, so the caller can persist it onto the
 *                   parent record (pages.seo_id / products.seo_id / ...)
 */
export default function SeoFields({ entitySeoId, onSeoIdChange }) {
  const [seo, setSeo] = useState({ meta_title: '', meta_description: '', canonical_url: '', no_index: 0, og_image: null });
  const [seoId, setSeoId] = useState(entitySeoId || null);
  const [saved, setSaved] = useState('');

  useEffect(() => {
    if (entitySeoId) {
      api(`/api/admin/seo-metadata/${entitySeoId}`).then(async (row) => {
        let og_image = null;
        if (row.og_image_id) {
          const asset = await api(`/api/admin/media/${row.og_image_id}`).catch(() => null);
          if (asset) og_image = { id: asset.id, url: asset.url };
        }
        setSeo({
          meta_title: row.meta_title || '',
          meta_description: row.meta_description || '',
          canonical_url: row.canonical_url || '',
          no_index: row.no_index || 0,
          og_image
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entitySeoId]);

  async function save(fields) {
    const next = { ...seo, ...fields };
    setSeo(next);
    const payload = {
      meta_title: next.meta_title,
      meta_description: next.meta_description,
      canonical_url: next.canonical_url,
      no_index: next.no_index,
      og_image_id: next.og_image?.id || null
    };

    if (seoId) {
      await api(`/api/admin/seo-metadata/${seoId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      const created = await api('/api/admin/seo-metadata', { method: 'POST', body: JSON.stringify(payload) });
      setSeoId(created.id);
      onSeoIdChange?.(created.id);
    }
    setSaved('Saved.');
    setTimeout(() => setSaved(''), 1500);
  }

  return (
    <div className="admin-card">
      <h3 style={{ marginBottom: '0.75rem' }}>SEO</h3>
      {saved && <p style={{ color: '#0C8A50', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{saved}</p>}
      <div className="admin-field">
        <label>Meta title</label>
        <input value={seo.meta_title} onChange={(e) => setSeo({ ...seo, meta_title: e.target.value })} onBlur={() => save({})} />
      </div>
      <div className="admin-field">
        <label>Meta description</label>
        <textarea value={seo.meta_description} onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })} onBlur={() => save({})} />
      </div>
      <div className="admin-field">
        <label>Canonical URL</label>
        <input value={seo.canonical_url} onChange={(e) => setSeo({ ...seo, canonical_url: e.target.value })} onBlur={() => save({})} />
      </div>
      <div className="admin-field">
        <label>
          <input
            type="checkbox"
            checked={!!seo.no_index}
            onChange={(e) => save({ no_index: e.target.checked ? 1 : 0 })}
            style={{ width: 'auto', marginRight: '0.5rem' }}
          />
          Exclude from search engines (noindex)
        </label>
      </div>
      <div className="admin-field">
        <label>Social share image (OG image)</label>
        <MediaPicker value={seo.og_image} onChange={(v) => save({ og_image: v })} accept="image" />
      </div>
    </div>
  );
}
