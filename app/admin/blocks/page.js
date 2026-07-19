'use client';
import { useEffect, useState } from 'react';
import DynamicForm from '@/components/admin/DynamicForm';
import { sectionTypeOptions, getSectionSchema } from '@/lib/sectionSchemas';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
}

export default function ReusableBlocksAdmin() {
  const [blocks, setBlocks] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    setBlocks(await api('/api/admin/reusable-blocks'));
  }

  useEffect(() => {
    load();
  }, []);

  async function createBlock() {
    const type = sectionTypeOptions[0]?.value;
    const created = await api('/api/admin/reusable-blocks', {
      method: 'POST',
      body: JSON.stringify({ name: 'New reusable block', type, data: {} })
    });
    setEditing(created);
    load();
  }

  async function save(fields) {
    const updated = await api(`/api/admin/reusable-blocks/${editing.id}`, { method: 'PUT', body: JSON.stringify(fields) });
    setEditing(updated);
    load();
  }

  async function remove(block) {
    if (!confirm(`Delete "${block.name}"? Any section still linked to it will fall back to its own local content.`)) return;
    await api(`/api/admin/reusable-blocks/${block.id}`, { method: 'DELETE' });
    setEditing(null);
    load();
  }

  if (editing) {
    const schema = getSectionSchema(editing.type);
    return (
      <div>
        <div className="admin-toolbar">
          <h1 className="admin-h1" style={{ marginBottom: 0 }}>{editing.name}</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="admin-btn admin-btn-ghost" onClick={() => setEditing(null)}>Back to list</button>
            <button className="admin-btn admin-btn-danger" onClick={() => remove(editing)}>Delete</button>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-field">
            <label>Block name (admin-facing)</label>
            <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} onBlur={() => save({ name: editing.name })} />
          </div>
          <div className="admin-field">
            <label>Section type</label>
            <select value={editing.type} onChange={(e) => save({ type: e.target.value, data: {} })}>
              {sectionTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {schema && (
          <div className="admin-card">
            <DynamicForm schema={schema} value={editing.data || {}} onChange={(data) => save({ data })} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>Reusable Blocks</h1>
        <button className="admin-btn admin-btn-primary" onClick={createBlock}>+ New Block</button>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#5B6472', marginBottom: '1rem' }}>
        Build a block once here, then link any page section to it from the section editor&apos;s &ldquo;Use reusable
        block&rdquo; field — editing it here updates every page it&apos;s linked to.
      </p>
      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{getSectionSchema(b.type)?.label || b.type}</td>
                <td>
                  <button className="admin-btn admin-btn-ghost" onClick={() => setEditing(b)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
