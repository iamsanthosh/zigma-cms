'use client';
import { useEffect, useState, use } from 'react';
import SectionList from '@/components/admin/SectionList';
import SeoFields from '@/components/admin/SeoFields';
import FloatingActionBar from '@/components/admin/FloatingActionBar';
import PageThemeOverrides from '@/components/admin/PageThemeOverrides';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

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
  const [themes, setThemes] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const router = useUnsavedChanges(hasUnsavedChanges);

  async function load() {
    const [p, s, t] = await Promise.all([
      api(`/api/admin/pages/${pageId}`),
      api(`/api/admin/sections?page_id=${pageId}`),
      api('/api/admin/themes')
    ]);
    setPage(p);
    setSections(s.sort((a, b) => a.order - b.order));
    setThemes(t);
    setHasUnsavedChanges(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  async function savePageFields(fields) {
    const updated = await api(`/api/admin/pages/${pageId}`, { method: 'PUT', body: JSON.stringify(fields) });
    setPage(updated);
    setHasUnsavedChanges(false);
    setStatus('Saved.');
    setTimeout(() => setStatus(''), 2000);
  }

  async function handleSave() {
    const titleInput = document.querySelector('input[defaultvalue]');
    const slugInput = document.querySelectorAll('input')[1];
    const themeSelect = document.querySelector('select[name="theme_id"]');
    
    await savePageFields({
      title: titleInput?.value || page.title,
      slug: slugInput?.value || page.slug,
      theme_id: themeSelect?.value ? parseInt(themeSelect.value) : null
    });
    if (window.saveAllSections) {
      await window.saveAllSections();
    }
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
      <FloatingActionBar
        onSave={handleSave}
        onPreview={preview}
        onPublish={publish}
        hasUnsavedChanges={hasUnsavedChanges}
        status={status}
      />

      <div className="admin-toolbar">
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>{page.title}</h1>
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
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Page title</label>
            <input defaultValue={page.title} onChange={() => setHasUnsavedChanges(true)} />
          </div>
          <div className="admin-field">
            <label>Slug</label>
            <input defaultValue={page.slug} onChange={() => setHasUnsavedChanges(true)} />
          </div>
        </div>
        <div className="admin-field">
          <label>Theme (optional - overrides global theme)</label>
          <select 
            name="theme_id" 
            defaultValue={page.theme_id || ''}
            onChange={() => setHasUnsavedChanges(true)}
          >
            <option value="">Use Global Theme</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name} {theme.is_default ? '(Default)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SeoFields entitySeoId={page.seo_id} onSeoIdChange={(seoId) => { setHasUnsavedChanges(true); }} />

      <h2 style={{ margin: '1.5rem 0 1rem', fontFamily: 'var(--font-display)' }}>Theme Overrides</h2>
      <PageThemeOverrides pageId={Number(pageId)} />

      <h2 style={{ margin: '1.5rem 0 1rem', fontFamily: 'var(--font-display)' }}>Sections</h2>
      <SectionList pageId={Number(pageId)} initialSections={sections} onHasUnsavedChanges={setHasUnsavedChanges} />
    </div>
  );
}
