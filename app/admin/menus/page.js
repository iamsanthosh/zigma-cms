'use client';
import { useEffect, useState } from 'react';
import FloatingActionBar from '@/components/admin/FloatingActionBar';
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

export default function MenusAdmin() {
  const [menus, setMenus] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [status, setStatus] = useState('');
  const router = useUnsavedChanges(hasUnsavedChanges);
  const [initialItems, setInitialItems] = useState([]);

  async function loadMenus() {
    try {
      const rows = await api('/api/admin/menus');
      // Filter to show only main-nav (header menu)
      const headerMenus = rows.filter(m => m.slug === 'main-nav');
      setMenus(headerMenus);
      if (!activeMenu && headerMenus.length) setActiveMenu(headerMenus[0]);
    } catch (err) {
      setError(err.message || 'Failed to load menus');
    }
  }

  async function loadItems(menu) {
    if (!menu) return;
    const rows = await api(`/api/admin/menu-items?menu_id=${menu.id}`);
    const sortedItems = rows.sort((a, b) => a.order - b.order);
    setItems(sortedItems);
    setInitialItems(sortedItems);
  }

  useEffect(() => {
    loadMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadItems(activeMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(items) !== JSON.stringify(initialItems);
    setHasUnsavedChanges(hasChanges);
  }, [items, initialItems]);

  async function addItem(parentId = null) {
    const newItem = {
      menu_id: activeMenu.id,
      parent_id: parentId,
      label: 'New Link',
      url: '#',
      order: items.length,
      visible: 1,
      active: 1
    };
    setItems([...items, { ...newItem, id: `temp-${Date.now()}` }]);
    setHasUnsavedChanges(true);
  }

  function updateItem(item, fields) {
    setItems(items.map(i => i.id === item.id ? { ...i, ...fields } : i));
  }

  function removeItem(item) {
    if (!confirm(`Delete "${item.label}"?`)) return;
    setItems(items.filter(i => i.id !== item.id));
  }

  function duplicateItem(item) {
    const newItem = {
      menu_id: activeMenu.id,
      parent_id: item.parent_id,
      label: `${item.label} (copy)`,
      url: item.url,
      column_heading: item.column_heading,
      order: items.length,
      visible: 0,
      active: 1
    };
    setItems([...items, { ...newItem, id: `temp-${Date.now()}` }]);
    setHasUnsavedChanges(true);
  }

  async function handleSave() {
    setStatus('');
    try {
      // Save all items
      for (const item of items) {
        if (String(item.id).startsWith('temp-')) {
          // New item - create it
          const { id: tempId, ...itemData } = item;
          await api('/api/admin/menu-items', {
            method: 'POST',
            body: JSON.stringify(itemData)
          });
        } else {
          // Existing item - update it
          await api(`/api/admin/menu-items/${item.id}`, { method: 'PUT', body: JSON.stringify(item) });
        }
      }

      // Delete items that were removed
      for (const initialItem of initialItems) {
        if (!items.find(i => i.id === initialItem.id)) {
          await api(`/api/admin/menu-items/${initialItem.id}`, { method: 'DELETE' });
        }
      }

      await loadItems(activeMenu);
      setHasUnsavedChanges(false);
      setStatus('Saved.');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      setStatus('Save failed: ' + (err.message || 'Unknown error'));
      setTimeout(() => setStatus(''), 3000);
    }
  }

  const topLevel = items.filter((i) => !i.parent_id);
  const childrenOf = (id) => items.filter((i) => i.parent_id === id);

  return (
    <div>
      <FloatingActionBar
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        status={status}
      />

      <h1 className="admin-h1">Header Menu &amp; Navigation</h1>
      <p style={{ fontSize: '0.85rem', color: '#8FA3C2', marginBottom: '1.5rem' }}>
        Configure the main navigation menu and submenu structure for the website header. Footer menus are configured in Site &amp; Theme Settings.
      </p>

      {error && <p style={{ color: '#c0392b', marginBottom: '1rem' }}>{error}</p>}

      <div className="admin-toolbar">
        <select
          value={activeMenu?.id || ''}
          onChange={(e) => setActiveMenu(menus.find((m) => m.id === Number(e.target.value)))}
        >
          {menus.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label} ({m.slug})
            </option>
          ))}
        </select>
        {activeMenu && (
          <button className="admin-btn admin-btn-primary" onClick={() => addItem(null)}>
            + Add Link
          </button>
        )}
      </div>

      {topLevel.map((item) => (
        <div className="admin-card" key={item.id}>
          <MenuItemRow item={item} onSave={(f) => updateItem(item, f)} onDelete={() => removeItem(item)} onDuplicate={() => duplicateItem(item)} />
          <div style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#8FA3C2', marginBottom: '0.5rem' }}>
              Mega-menu column links (leave empty for a plain top-level link)
            </div>
            {childrenOf(item.id).map((child) => (
              <div key={child.id} style={{ marginBottom: '0.5rem' }}>
                <MenuItemRow item={child} onSave={(f) => updateItem(child, f)} onDelete={() => removeItem(child)} onDuplicate={() => duplicateItem(child)} compact />
              </div>
            ))}
            <button className="admin-btn admin-btn-ghost" onClick={() => addItem(item.id)}>
              + Add column link
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function MenuItemRow({ item, onSave, onDelete, onDuplicate, compact }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        style={{ width: compact ? 160 : 220 }}
        value={item.label}
        onChange={(e) => onSave({ label: e.target.value })}
        placeholder="Label"
      />
      <input
        style={{ width: compact ? 160 : 220 }}
        value={item.url}
        onChange={(e) => onSave({ url: e.target.value })}
        placeholder="URL"
      />
      {compact && (
        <input
          style={{ width: 160 }}
          value={item.column_heading || ''}
          onChange={(e) => onSave({ column_heading: e.target.value })}
          placeholder="Mega-menu column heading"
        />
      )}
      <button className="admin-btn admin-btn-ghost" onClick={() => onSave({ visible: item.visible ? 0 : 1 })}>
        {item.visible ? 'Visible' : 'Hidden'}
      </button>
      <button className="admin-btn admin-btn-ghost" onClick={onDuplicate}>
        Duplicate
      </button>
      <button className="admin-btn admin-btn-danger" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
