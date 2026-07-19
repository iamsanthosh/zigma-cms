'use client';
import { useState, useEffect } from 'react';
import DynamicForm from './DynamicForm';
import { sectionTypeOptions, getSectionSchema } from '@/lib/sectionSchemas';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
}

export default function SectionList({ pageId, initialSections }) {
  const [sections, setSections] = useState(initialSections);
  const [openId, setOpenId] = useState(null);
  const [addingType, setAddingType] = useState(sectionTypeOptions[0]?.value || '');
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    api('/api/admin/reusable-blocks').then(setBlocks).catch(() => {});
  }, []);

  async function refresh() {
    const rows = await api(`/api/admin/sections?page_id=${pageId}`);
    setSections(rows.sort((a, b) => a.order - b.order));
  }

  async function addSection() {
    const schema = getSectionSchema(addingType);
    await api('/api/admin/sections', {
      method: 'POST',
      body: JSON.stringify({
        page_id: pageId,
        type: addingType,
        name: schema?.label || addingType,
        data: {},
        background_style: 'light',
        order: sections.length,
        visible: 1,
        active: 1
      })
    });
    await refresh();
  }

  async function saveSection(section, data) {
    await api(`/api/admin/sections/${section.id}`, { method: 'PUT', body: JSON.stringify({ data }) });
    await refresh();
  }

  async function toggle(section, field) {
    await api(`/api/admin/sections/${section.id}`, { method: 'PUT', body: JSON.stringify({ [field]: section[field] ? 0 : 1 }) });
    await refresh();
  }

  async function remove(section) {
    if (!confirm(`Delete the "${section.name}" section? This cannot be undone.`)) return;
    await api(`/api/admin/sections/${section.id}`, { method: 'DELETE' });
    await refresh();
  }

  async function linkBlock(section, reusableBlockId) {
    await api(`/api/admin/sections/${section.id}`, {
      method: 'PUT',
      body: JSON.stringify({ reusable_block_id: reusableBlockId || null })
    });
    await refresh();
  }

  async function move(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
    await api('/api/admin/reorder', {
      method: 'POST',
      body: JSON.stringify({ resource: 'sections', order: next.map((s, i) => ({ id: s.id, order: i })) })
    });
  }

  return (
    <div>
      <div className="admin-toolbar">
        <select value={addingType} onChange={(e) => setAddingType(e.target.value)}>
          {sectionTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button className="admin-btn admin-btn-primary" onClick={addSection}>
          + Add Section
        </button>
      </div>

      {sections.map((section, i) => {
        const schema = getSectionSchema(section.type);
        const isOpen = openId === section.id;
        return (
          <div className="admin-card" key={section.id}>
            <div className="admin-repeater-item-head">
              <div>
                <span className="admin-drag-handle">⠿</span>
                <strong>{section.name || schema?.label || section.type}</strong>{' '}
                <span style={{ fontSize: '0.75rem', color: '#8FA3C2' }}>({section.type})</span>{' '}
                <span className={`admin-badge ${section.visible ? 'admin-badge-live' : 'admin-badge-draft'}`}>
                  {section.visible ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => move(i, -1)}>↑</button>
                <button className="admin-btn admin-btn-ghost" onClick={() => move(i, 1)}>↓</button>
                <button className="admin-btn admin-btn-ghost" onClick={() => toggle(section, 'visible')}>
                  {section.visible ? 'Hide' : 'Show'}
                </button>
                <button className="admin-btn admin-btn-ghost" onClick={() => setOpenId(isOpen ? null : section.id)}>
                  {isOpen ? 'Close' : 'Edit'}
                </button>
                <button className="admin-btn admin-btn-danger" onClick={() => remove(section)}>
                  Delete
                </button>
              </div>
            </div>

            {isOpen && schema && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid #E7EBF1', paddingTop: '1rem' }}>
                <div className="admin-field">
                  <label>Content source</label>
                  <select
                    value={section.reusable_block_id || ''}
                    onChange={(e) => linkBlock(section, e.target.value ? Number(e.target.value) : null)}
                  >
                    <option value="">This section&apos;s own content</option>
                    {blocks
                      .filter((b) => b.type === section.type)
                      .map((b) => (
                        <option key={b.id} value={b.id}>
                          Reusable block: {b.name}
                        </option>
                      ))}
                  </select>
                  <p style={{ fontSize: '0.75rem', color: '#8FA3C2', marginTop: '0.25rem' }}>
                    Linking to a reusable block means editing that block (under Reusable Blocks in the sidebar)
                    updates this section everywhere it&apos;s used — the fields below are then read-only here.
                  </p>
                </div>

                {section.reusable_block_id ? (
                  <div className="admin-card" style={{ background: '#F4F6F9', pointerEvents: 'none', opacity: 0.75 }}>
                    <DynamicForm
                      schema={schema}
                      value={blocks.find((b) => b.id === section.reusable_block_id)?.data || {}}
                      onChange={() => {}}
                    />
                  </div>
                ) : (
                  <SectionEditor schema={schema} section={section} onSave={(data) => saveSection(section, data)} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionEditor({ schema, section, onSave }) {
  const [data, setData] = useState(section.data || {});
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave(data);
    setSaving(false);
  }

  return (
    <div>
      <DynamicForm schema={schema} value={data} onChange={setData} />
      <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save Section'}
      </button>
    </div>
  );
}
