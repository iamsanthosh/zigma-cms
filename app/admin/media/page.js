'use client';
import { useEffect, useState } from 'react';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) {
    let errorMessage = 'Request failed';
    try {
      const data = await res.json();
      errorMessage = data.error || errorMessage;
    } catch {
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export default function MediaAdmin() {
  const [assets, setAssets] = useState([]);
  const [q, setQ] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try {
      setAssets(await api(`/api/admin/media?q=${encodeURIComponent(q)}`));
    } catch (err) {
      setError(err.message || 'Failed to load media');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'library');
      await fetch('/api/admin/upload', { method: 'POST', body: fd });
    }
    setUploading(false);
    e.target.value = '';
    load();
  }

  async function updateAsset(asset, fields) {
    await api(`/api/admin/media/${asset.id}`, { method: 'PUT', body: JSON.stringify(fields) });
    load();
  }

  async function removeAsset(asset) {
    if (!confirm('Delete this media asset? Sections/products referencing it will show a broken image.')) return;
    await api(`/api/admin/media/${asset.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>Media Library</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input className="admin-search" placeholder="Search alt text / folder…" value={q} onChange={(e) => setQ(e.target.value)} />
          <label className="admin-btn admin-btn-primary">
            {uploading ? 'Uploading…' : '+ Upload'}
            <input type="file" multiple hidden onChange={handleUpload} accept="image/*,video/*" disabled={uploading} />
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
        {assets.map((asset) => (
          <div className="admin-card" key={asset.id} style={{ marginBottom: 0 }}>
            {asset.type === 'video' ? (
              <video src={asset.url} style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 6 }} controls muted />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset.url} alt={asset.alt_text || ''} style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 6 }} />
            )}
            <input
              style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}
              defaultValue={asset.alt_text || ''}
              placeholder="Alt text"
              onBlur={(e) => updateAsset(asset, { alt_text: e.target.value })}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#8FA3C2' }}>{asset.folder}</span>
              <button className="admin-btn admin-btn-danger" onClick={() => removeAsset(asset)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
