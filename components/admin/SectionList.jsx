'use client';
import React, { useState, useEffect, useCallback } from 'react';
import DynamicForm from './DynamicForm';
import { sectionTypeOptions, getSectionSchema } from '@/lib/sectionSchemas';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
}

export default function SectionList({ pageId, initialSections, onHasUnsavedChanges }) {
  const [sections, setSections] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [addingType, setAddingType] = useState(sectionTypeOptions[0]?.value || '');
  const [blocks, setBlocks] = useState([]);
  const [sectionData, setSectionData] = useState({}); // Store unsaved section data

  // Load sections on mount
  useEffect(() => {
    refresh();
    api('/api/admin/reusable-blocks').then(setBlocks).catch(() => {});
  }, []);

  async function refresh() {
    const rows = await api(`/api/admin/sections?page_id=${pageId}`);
    setSections(rows.sort((a, b) => a.order - b.order));
    setSectionData({});
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

  async function saveAllSections() {
    for (const [sectionId, data] of Object.entries(sectionData)) {
      await api(`/api/admin/sections/${sectionId}`, { method: 'PUT', body: JSON.stringify({ data }) });
    }
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

  async function duplicate(section) {
    const newSection = {
      page_id: pageId,
      type: section.type,
      name: `${section.name} (copy)`,
      data: section.data,
      background_style: section.background_style,
      order: sections.length,
      visible: section.visible,
      active: section.active,
      reusable_block_id: section.reusable_block_id
    };
    await api('/api/admin/sections', {
      method: 'POST',
      body: JSON.stringify(newSection)
    });
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

  // Handle section data changes with useCallback to prevent infinite loops
  const handleSectionDataChange = useCallback((sectionId, data) => {
    setSectionData(prev => ({ ...prev, [sectionId]: data }));
    if (onHasUnsavedChanges) onHasUnsavedChanges(true);
  }, [onHasUnsavedChanges]);

  // Expose saveAllSections to parent
  useEffect(() => {
    if (onHasUnsavedChanges) {
      window.saveAllSections = saveAllSections;
    }
  }, [sectionData, onHasUnsavedChanges]);

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

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name / Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section, i) => {
            const schema = getSectionSchema(section.type);
            const isOpen = openId === section.id;
            return (
              <React.Fragment key={section.id}>
                <tr>
                  <td>
                    <strong>{section.name || schema?.label || section.type}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#8FA3C2' }}>{section.type}</div>
                  </td>
                  <td>
                    <span className={`admin-badge ${section.visible ? 'admin-badge-live' : 'admin-badge-draft'}`}>
                      {section.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      <button className="admin-btn admin-btn-ghost" onClick={() => move(i, -1)} title="Move up">↑</button>
                      <button className="admin-btn admin-btn-ghost" onClick={() => move(i, 1)} title="Move down">↓</button>
                      <button className="admin-btn admin-btn-ghost" onClick={() => toggle(section, 'visible')}>
                        {section.visible ? 'Hide' : 'Show'}
                      </button>
                      <button className="admin-btn admin-btn-ghost" onClick={() => duplicate(section)}>
                        Duplicate
                      </button>
                      <button className="admin-btn admin-btn-ghost" onClick={() => setOpenId(isOpen ? null : section.id)}>
                        {isOpen ? 'Close' : 'Edit'}
                      </button>
                      <button className="admin-btn admin-btn-danger" onClick={() => remove(section)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                {isOpen && schema && (
                  <tr>
                    <td colSpan="4" style={{ padding: '0', background: 'var(--admin-bg)' }}>
                      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--admin-card-border)', borderBottom: '1px solid var(--admin-card-border)' }}>
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
                          <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginTop: '0.25rem' }}>
                            Linking to a reusable block means editing that block (under Reusable Blocks in the sidebar)
                            updates this section everywhere it&apos;s used — the fields below are then read-only here.
                          </p>
                        </div>

                        {section.reusable_block_id ? (
                          <div className="admin-card" style={{ background: 'var(--admin-bg)', pointerEvents: 'none', opacity: 0.75 }}>
                            <DynamicForm
                              schema={schema}
                              value={blocks.find((b) => b.id === section.reusable_block_id)?.data || {}}
                              onChange={() => {}}
                            />
                          </div>
                        ) : (
                          <SectionEditor
                            key={`${section.id}-${section.type}`}
                            schema={schema}
                            section={section}
                            onDataChange={(data) => handleSectionDataChange(section.id, data)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SectionEditor({ schema, section, onDataChange }) {
  const [data, setData] = useState(section.data || {});

  // Sync data when section changes
  useEffect(() => {
    if (section.data !== undefined) {
      setData(section.data);
    }
  }, [section.id, section.data]);

  if (!data || Object.keys(data).length === 0) {
    return <div style={{ padding: '1rem', color: 'var(--admin-text-muted)' }}>No data available for this section</div>;
  }

  return (
    <div>
      <DynamicForm schema={schema} value={data} onChange={(newData) => {
        setData(newData);
        if (onDataChange) {
          onDataChange(newData);
        }
      }} />
    </div>
  );
}
