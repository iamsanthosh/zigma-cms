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
      // Response body is not JSON, use status text
      errorMessage = res.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export default function PagesListPage() {
  const [pages, setPages] = useState([]);
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);
  const [newPage, setNewPage] = useState({ slug: '', title: '', template: 'default' });
  const [error, setError] = useState('');

  async function load() {
    try {
      setPages(await api(`/api/admin/pages?q=${encodeURIComponent(q)}`));
    } catch (err) {
      setError(err.message || 'Failed to load pages');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function createPage() {
    setError('');
    if (!newPage.slug.trim() || !newPage.title.trim()) {
      setError('Title and slug are both required.');
      return;
    }
    try {
      await api('/api/admin/pages', { method: 'POST', body: JSON.stringify({ ...newPage, visible: 1, active: 1, order: pages.length }) });
      setCreating(false);
      setNewPage({ slug: '', title: '', template: 'default' });
      load();
    } catch (err) {
      setError(err.message?.includes('Duplicate') ? 'That slug is already in use — choose a different one.' : err.message || 'Could not create page.');
    }
  }

  async function toggle(page, field) {
    await api(`/api/admin/pages/${page.id}`, { method: 'PUT', body: JSON.stringify({ [field]: page[field] ? 0 : 1 }) });
    load();
  }

  async function remove(page) {
    if (!confirm(`Delete "${page.title}" and all its sections?`)) return;
    await api(`/api/admin/pages/${page.id}`, { method: 'DELETE' });
    load();
  }

  async function duplicate(page) {
    if (!confirm(`Duplicate "${page.title}"? This will create a new page with all sections copied.`)) return;
    try {
      // Create new page with copied data
      const newPage = await api('/api/admin/pages', {
        method: 'POST',
        body: JSON.stringify({
          title: `${page.title} (copy)`,
          slug: `${page.slug}-copy`,
          template: page.template || 'default',
          visible: 0,
          active: 1,
          order: pages.length
        })
      });

      // Copy all sections from original page
      const sections = await api(`/api/admin/sections?page_id=${page.id}`);
      for (const section of sections) {
        await api('/api/admin/sections', {
          method: 'POST',
          body: JSON.stringify({
            page_id: newPage.id,
            type: section.type,
            name: section.name,
            data: section.data,
            background_style: section.background_style,
            order: section.order,
            visible: section.visible,
            active: section.active,
            reusable_block_id: section.reusable_block_id
          })
        });
      }

      load();
    } catch (err) {
      setError(err.message || 'Failed to duplicate page');
    }
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>Pages</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="admin-search" placeholder="Search pages…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="admin-btn admin-btn-primary" onClick={() => setCreating((c) => !c)}>
            + New Page
          </button>
        </div>
      </div>

      {creating && (
        <div className="admin-card">
          {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Title *</label>
              <input value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Slug (URL path — use "home" for the homepage) *</label>
              <input value={newPage.slug} onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })} />
            </div>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={createPage}>
            Create
          </button>
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td><strong>{page.title}</strong></td>
                <td>/{page.slug === 'home' ? '' : page.slug}</td>
                <td>
                  <span className={`admin-badge ${page.publish_status === 'published' ? 'admin-badge-live' : 'admin-badge-draft'}`}>
                    {page.publish_status}
                  </span>
                </td>
                <td>
                  <button className="admin-btn admin-btn-ghost" onClick={() => toggle(page, 'visible')}>
                    {page.visible ? 'Visible' : 'Hidden'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    <button className="admin-btn admin-btn-ghost" onClick={() => duplicate(page)}>
                      Duplicate
                    </button>
                    <a className="admin-btn admin-btn-ghost" href={`/admin/pages/${page.id}`}>
                      Edit
                    </a>
                    <button className="admin-btn admin-btn-danger" onClick={() => remove(page)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
