'use client';
import { useEffect, useState } from 'react';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
}

export default function PagesListPage() {
  const [pages, setPages] = useState([]);
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);
  const [newPage, setNewPage] = useState({ slug: '', title: '', template: 'default' });
  const [error, setError] = useState('');

  async function load() {
    setPages(await api(`/api/admin/pages?q=${encodeURIComponent(q)}`));
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
          <div className="admin-field">
            <label>Title *</label>
            <input value={newPage.title} onChange={(e) => setNewPage({ ...newPage, title: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Slug (URL path — use "home" for the homepage) *</label>
            <input value={newPage.slug} onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })} />
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td>{page.title}</td>
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
                <td style={{ display: 'flex', gap: '0.4rem' }}>
                  <a className="admin-btn admin-btn-ghost" href={`/admin/pages/${page.id}`}>
                    Edit Sections
                  </a>
                  <button className="admin-btn admin-btn-danger" onClick={() => remove(page)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
