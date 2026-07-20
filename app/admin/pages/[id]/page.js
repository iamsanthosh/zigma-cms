'use client';
import { useEffect, useState, use } from 'react';
import SectionList from '@/components/admin/SectionList';
import SeoFields from '@/components/admin/SeoFields';

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

export default function PageEditor({ params }) {
  const { id } = use(params);
  const pageId = id;
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('');

  async function load() {
    const [p, s] = await Promise.all([
      api(`/api/admin/pages/${pageId}`),
      api(`/api/admin/sections?page_id=${pageId}`)
    ]);
    setPage(p);
    setSections(s.sort((a, b) => a.order - b.order));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  async function savePageFields(fields) {
    const updated = await api(`/api/admin/pages/${pageId}`, { method: 'PUT', body: JSON.stringify(fields) });
    setPage(updated);
    setStatus('Saved.');
    setTimeout(() => setStatus(''), 2000);
  }

  async function publish() {
    await api('/api/admin/publish', { method: 'POST', body: JSON.stringify({ entityType: 'page', entityId: Number(pageId), action: 'publish' }) });
    await load();
    setStatus('Published — live on the public site.');
    setTimeout(() => setStatus(''), 3000);
  }

  async function preview() {
    const { previewUrl: url } = await api('/api/admin/publish', {
      method: 'POST',
      body: JSON.stringify({ entityType: 'page', entityId: Number(pageId), action: 'preview' })
    });
    setPreviewUrl(url);
  }

  if (!page) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-toolbar">
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>{page.title}</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {status && <span style={{ fontSize: '0.85rem', color: '#0C8A50' }}>{status}</span>}
          <button className="admin-btn admin-btn-ghost" onClick={preview}>
            Preview
          </button>
          <button className="admin-btn admin-btn-primary" onClick={publish}>
            Publish
          </button>
        </div>
      </div>

      {previewUrl && (
        <div className="admin-card">
          Shareable preview link:{' '}
          <a href={previewUrl} target="_blank" rel="noreferrer">
            {previewUrl}
          </a>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-field">
          <label>Page title</label>
          <input defaultValue={page.title} onBlur={(e) => savePageFields({ title: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Slug</label>
          <input defaultValue={page.slug} onBlur={(e) => savePageFields({ slug: e.target.value })} />
        </div>
      </div>

      <SeoFields entitySeoId={page.seo_id} onSeoIdChange={(seoId) => savePageFields({ seo_id: seoId })} />

      <h2 style={{ margin: '1.5rem 0 1rem', fontFamily: 'var(--font-display)' }}>Sections</h2>
      <SectionList pageId={Number(pageId)} initialSections={sections} />
    </div>
  );
}
