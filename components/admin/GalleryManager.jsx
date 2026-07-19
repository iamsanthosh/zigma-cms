'use client';
import { useEffect, useState } from 'react';
import MediaPicker from './MediaPicker';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
}

/** itemType: 'product' | 'service'. Manages the item_media join table —
 * every image/video attached here shows up in the public modal popup,
 * in order, with the one marked "background" used as the modal's hero media. */
export default function GalleryManager({ itemType, itemId }) {
  const [rows, setRows] = useState([]);
  const [assetsById, setAssetsById] = useState({});
  const [picking, setPicking] = useState(false);

  async function load() {
    const links = await api(`/api/admin/item-media?item_id=${itemId}`).catch(() => []);
    // The generic list endpoint doesn't filter by item_type, so narrow client-side.
    const filtered = links.filter((l) => l.item_type === itemType && l.item_id === itemId);
    setRows(filtered.sort((a, b) => a.order - b.order));

    const assets = await Promise.all(
      filtered.map((l) => api(`/api/admin/media/${l.media_id}`).catch(() => null))
    );
    setAssetsById(Object.fromEntries(assets.filter(Boolean).map((a) => [a.id, a])));
  }

  useEffect(() => {
    if (itemId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  async function attach(mediaAsset) {
    if (!mediaAsset?.id) return;
    await api('/api/admin/item-media', {
      method: 'POST',
      body: JSON.stringify({ item_type: itemType, item_id: itemId, media_id: mediaAsset.id, role: 'gallery', order: rows.length })
    });
    setPicking(false);
    load();
  }

  async function setRole(row, role) {
    // Only one media item should be the "background" hero — demote any existing one first.
    if (role === 'background') {
      const current = rows.find((r) => r.role === 'background');
      if (current) await api(`/api/admin/item-media/${current.id}`, { method: 'PUT', body: JSON.stringify({ role: 'gallery' }) });
    }
    await api(`/api/admin/item-media/${row.id}`, { method: 'PUT', body: JSON.stringify({ role }) });
    load();
  }

  async function remove(row) {
    await api(`/api/admin/item-media/${row.id}`, { method: 'DELETE' });
    load();
  }

  async function move(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next);
    await api('/api/admin/reorder', {
      method: 'POST',
      body: JSON.stringify({ resource: 'item-media', order: next.map((r, i) => ({ id: r.id, order: i })) })
    });
  }

  return (
    <div className="admin-card">
      <h3 style={{ marginBottom: '0.75rem' }}>Gallery (modal images &amp; videos)</h3>
      <p style={{ fontSize: '0.8rem', color: '#8FA3C2', marginBottom: '1rem' }}>
        Everything added here appears in the tile-click popup. Mark one as &ldquo;Background&rdquo; to use it as the
        modal&apos;s hero image/video; the rest render as a scrollable gallery beneath the description.
      </p>

      {rows.map((row, i) => {
        const asset = assetsById[row.media_id];
        if (!asset) return null;
        return (
          <div key={row.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {asset.type === 'video' ? (
              <video src={asset.url} style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 6 }} muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset.url} alt="" style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 6 }} />
            )}
            <span className={`admin-badge ${row.role === 'background' ? 'admin-badge-live' : 'admin-badge-draft'}`}>
              {row.role === 'background' ? 'Background' : 'Gallery'}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', marginLeft: 'auto' }}>
              <button className="admin-btn admin-btn-ghost" onClick={() => move(i, -1)}>↑</button>
              <button className="admin-btn admin-btn-ghost" onClick={() => move(i, 1)}>↓</button>
              {row.role !== 'background' && (
                <button className="admin-btn admin-btn-ghost" onClick={() => setRole(row, 'background')}>
                  Set as background
                </button>
              )}
              <button className="admin-btn admin-btn-danger" onClick={() => remove(row)}>Remove</button>
            </div>
          </div>
        );
      })}

      <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setPicking((p) => !p)}>
        {picking ? 'Close' : '+ Add image or video'}
      </button>
      {picking && (
        <div style={{ marginTop: '0.75rem' }}>
          <MediaPicker value={null} onChange={attach} accept="image" />
          <div style={{ marginTop: '0.5rem' }}>
            <MediaPicker value={null} onChange={attach} accept="video" />
          </div>
        </div>
      )}
    </div>
  );
}
