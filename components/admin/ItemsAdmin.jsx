'use client';
import { useEffect, useState } from 'react';
import MediaPicker from './MediaPicker';
import SeoFields from './SeoFields';
import GalleryManager from './GalleryManager';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
}

const empty = {
  slug: '', title: '', subtitle: '', description: '', specifications: [],
  price_label: '', tags: '', cta_label: '', cta_url: '', visible: 1, active: 1, order: 0
};

/** `resource` is 'products' or 'services' — the two tables are identical in shape. */
export default function ItemsAdmin({ resource, label }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null); // null = list view, {} = new, {...} = editing
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  async function load(query = q) {
    setItems(await api(`/api/admin/${resource}?q=${encodeURIComponent(query)}`));
  }

  useEffect(() => {
    load(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function save() {
    setError('');
    if (!editing.title?.trim()) {
      setError('Title is required.');
      return;
    }
    if (!editing.slug?.trim()) {
      setError('Slug is required.');
      return;
    }

    const payload = { ...editing };
    const isNew = !payload.id;
    delete payload.id;
    delete payload.thumbnail_id; // set separately via thumbnail picker below
    if (editing.thumbnail?.id) payload.thumbnail_id = editing.thumbnail.id;

    try {
      if (isNew) {
        await api(`/api/admin/${resource}`, { method: 'POST', body: JSON.stringify(payload) });
      } else {
        await api(`/api/admin/${resource}/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      }
      setEditing(null);
      load();
    } catch (err) {
      // Most likely cause: the slug UNIQUE constraint on products/services.
      setError(err.message?.includes('Duplicate') ? 'That slug is already in use — choose a different one.' : err.message || 'Save failed.');
    }
  }

  async function remove(item) {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await api(`/api/admin/${resource}/${item.id}`, { method: 'DELETE' });
    load();
  }

  async function toggle(item, field) {
    await api(`/api/admin/${resource}/${item.id}`, { method: 'PUT', body: JSON.stringify({ [field]: item[field] ? 0 : 1 }) });
    load();
  }

  if (editing) {
    return (
      <ItemForm
        resource={resource}
        item={editing}
        error={error}
        onChange={setEditing}
        onSave={save}
        onCancel={() => { setEditing(null); setError(''); }}
      />
    );
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>{label}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="admin-search" placeholder={`Search ${label.toLowerCase()}…`} value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...empty })}>
            + New {label.slice(0, -1)}
          </button>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price / model</th>
              <th>Tags</th>
              <th>Visible</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.price_label}</td>
                <td>{item.tags}</td>
                <td>
                  <button className="admin-btn admin-btn-ghost" onClick={() => toggle(item, 'visible')}>
                    {item.visible ? 'Visible' : 'Hidden'}
                  </button>
                </td>
                <td style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className="admin-btn admin-btn-ghost" onClick={() => setEditing({ ...item, specifications: item.specifications || [] })}>
                    Edit
                  </button>
                  <button className="admin-btn admin-btn-danger" onClick={() => remove(item)}>
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

function ItemForm({ resource, item, error, onChange, onSave, onCancel }) {
  const set = (fields) => onChange({ ...item, ...fields });
  const specs = item.specifications || [];

  return (
    <div>
      <div className="admin-toolbar">
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>{item.id ? `Edit: ${item.title}` : 'New item'}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="admin-btn admin-btn-primary" onClick={onSave}>Save</button>
        </div>
      </div>

      {error && (
        <div className="admin-card" style={{ borderColor: '#f3c3c3', background: '#FEF4F4', color: '#c0392b' }}>
          {error}
        </div>
      )}

      <div className="admin-card">
        <div className="admin-field">
          <label>Title *</label>
          <input value={item.title} onChange={(e) => set({ title: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Slug (used in the product/service URL) *</label>
          <input value={item.slug} onChange={(e) => set({ slug: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Subtitle</label>
          <input value={item.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Description</label>
          <textarea value={item.description || ''} onChange={(e) => set({ description: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Price / pricing model (free text)</label>
          <input value={item.price_label || ''} onChange={(e) => set({ price_label: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Tags (comma-separated)</label>
          <input value={item.tags || ''} onChange={(e) => set({ tags: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>CTA label</label>
          <input value={item.cta_label || ''} onChange={(e) => set({ cta_label: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>CTA link</label>
          <input value={item.cta_url || ''} onChange={(e) => set({ cta_url: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Order</label>
          <input type="number" value={item.order || 0} onChange={(e) => set({ order: Number(e.target.value) })} />
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: '0.75rem' }}>Thumbnail (tile image)</h3>
        <MediaPicker value={item.thumbnail} onChange={(v) => set({ thumbnail: v })} accept="image" />
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: '0.75rem' }}>Specifications</h3>
        {specs.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              placeholder="Label"
              value={s.label || ''}
              onChange={(e) => {
                const next = [...specs];
                next[i] = { ...next[i], label: e.target.value };
                set({ specifications: next });
              }}
            />
            <input
              placeholder="Value"
              value={s.value || ''}
              onChange={(e) => {
                const next = [...specs];
                next[i] = { ...next[i], value: e.target.value };
                set({ specifications: next });
              }}
            />
            <button className="admin-btn admin-btn-danger" onClick={() => set({ specifications: specs.filter((_, si) => si !== i) })}>
              Remove
            </button>
          </div>
        ))}
        <button className="admin-btn admin-btn-primary" onClick={() => set({ specifications: [...specs, { label: '', value: '' }] })}>
          + Add specification
        </button>
      </div>

      {item.id ? (
        <GalleryManager itemType={resource === 'services' ? 'service' : 'product'} itemId={item.id} />
      ) : (
        <p style={{ fontSize: '0.8rem', color: '#8FA3C2' }}>
          Save this item first, then come back to attach gallery images and videos for the popup modal.
        </p>
      )}

      {item.id && (
        <SeoFields
          entitySeoId={item.seo_id}
          onSeoIdChange={(seoId) => fetch(`/api/admin/${resource}/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seo_id: seoId })
          })}
        />
      )}
    </div>
  );
}
