'use client';
import { useEffect, useState } from 'react';
import DynamicForm from '@/components/admin/DynamicForm';
import FloatingActionBar from '@/components/admin/FloatingActionBar';
import { sectionTypeOptions, getSectionSchema } from '@/lib/sectionSchemas';
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

export default function ReusableBlocksAdmin() {
  const [blocks, setBlocks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [status, setStatus] = useState('');
  const router = useUnsavedChanges(hasUnsavedChanges);

  async function load() {
    try {
      setBlocks(await api('/api/admin/reusable-blocks'));
    } catch (err) {
      setError(err.message || 'Failed to load blocks');
    }
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

  async function handleSave() {
    await save(editing);
  }

  async function save(fields) {
    const updated = await api(`/api/admin/reusable-blocks/${editing.id}`, { method: 'PUT', body: JSON.stringify(fields) });
    setEditing(updated);
    setHasUnsavedChanges(false);
    setStatus('Saved.');
    setTimeout(() => setStatus(''), 2000);
    load();
  }

  async function duplicate(block) {
    const duplicated = await api('/api/admin/reusable-blocks', {
      method: 'POST',
      body: JSON.stringify({ name: `${block.name} (copy)`, type: block.type, data: block.data })
    });
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
        <FloatingActionBar
          onSave={handleSave}
          hasUnsavedChanges={hasUnsavedChanges}
          status={status}
          extraButtons={
            <>
              <button className="admin-btn admin-btn-ghost" onClick={() => setEditing(null)}>Back to list</button>
              <button className="admin-btn admin-btn-danger" onClick={() => remove(editing)}>Delete</button>
            </>
          }
        />

        <div className="admin-toolbar">
          <h1 className="admin-h1" style={{ marginBottom: 0 }}>{editing.name}</h1>
        </div>

        <div className="admin-card">
          <div className="admin-grid-2">
            <div className="admin-field">
              <label>Block name (admin-facing)</label>
              <input value={editing.name} onChange={(e) => { setEditing({ ...editing, name: e.target.value }); setHasUnsavedChanges(true); }} />
            </div>
            <div className="admin-field">
              <label>Section type</label>
              <select value={editing.type} onChange={(e) => { setEditing({ ...editing, type: e.target.value, data: {} }); setHasUnsavedChanges(true); }}>
                {sectionTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {schema && (
          <div className="admin-card">
            <DynamicForm schema={schema} value={editing.data || {}} onChange={(data) => { setEditing({ ...editing, data }); setHasUnsavedChanges(true); }} />
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b) => (
              <tr key={b.id}>
                <td><strong>{b.name}</strong></td>
                <td>{getSectionSchema(b.type)?.label || b.type}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button className="admin-btn admin-btn-ghost" onClick={() => duplicate(b)}>Duplicate</button>
                    <button className="admin-btn admin-btn-ghost" onClick={() => setEditing(b)}>Edit</button>
                    <button className="admin-btn admin-btn-danger" onClick={() => remove(b)}>Delete</button>
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
