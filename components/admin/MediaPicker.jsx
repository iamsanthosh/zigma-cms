'use client';
import { useEffect, useState } from 'react';

export default function MediaPicker({ value, onChange, accept = 'image' }) {
  const [open, setOpen] = useState(false);
  const [library, setLibrary] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch(`/api/admin/media?q=`).then((r) => r.json()).then((rows) =>
      setLibrary(rows.filter((r) => (accept === 'video' ? r.type === 'video' : r.type === 'image')))
    );
  }, [open, accept]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'sections');
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const asset = await res.json();
    setUploading(false);
    if (res.ok) {
      onChange({ id: asset.id, url: asset.url, alt: asset.alt_text || '' });
      setOpen(false);
    }
  }

  return (
    <div>
      {value?.url ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          {accept === 'video' ? (
            <video src={value.url} style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 6 }} muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.url} alt="" style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 6 }} />
          )}
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => onChange(null)}>
            Remove
          </button>
        </div>
      ) : (
        <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>No {accept} selected</p>
      )}

      <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setOpen((o) => !o)}>
        {open ? 'Close' : `Choose ${accept}`}
      </button>

      {open && (
        <div className="admin-card" style={{ marginTop: '0.75rem' }}>
          <div className="admin-field">
            <label>Upload new {accept}</label>
            <input type="file" accept={accept === 'video' ? 'video/*' : 'image/*'} onChange={handleUpload} disabled={uploading} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', maxHeight: 260, overflowY: 'auto' }}>
            {library.map((asset) => (
              <button
                type="button"
                key={asset.id}
                onClick={() => {
                  onChange({ id: asset.id, url: asset.url, alt: asset.alt_text || '' });
                  setOpen(false);
                }}
                style={{ border: 'none', padding: 0, cursor: 'pointer' }}
              >
                {asset.type === 'video' ? (
                  <video src={asset.url} style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 6 }} muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.url} alt="" style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 6 }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
