'use client';
import { useEffect, useState } from 'react';

async function api(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
}

export default function MenusAdmin() {
  const [menus, setMenus] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [items, setItems] = useState([]);

  async function loadMenus() {
    const rows = await api('/api/admin/menus');
    setMenus(rows);
    if (!activeMenu && rows.length) setActiveMenu(rows[0]);
  }

  async function loadItems(menu) {
    if (!menu) return;
    const rows = await api(`/api/admin/menu-items?menu_id=${menu.id}`);
    setItems(rows.sort((a, b) => a.order - b.order));
  }

  useEffect(() => {
    loadMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadItems(activeMenu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu]);

  async function addItem(parentId = null) {
    await api('/api/admin/menu-items', {
      method: 'POST',
      body: JSON.stringify({
        menu_id: activeMenu.id,
        parent_id: parentId,
        label: 'New Link',
        url: '#',
        order: items.length,
        visible: 1,
        active: 1
      })
    });
    loadItems(activeMenu);
  }

  async function updateItem(item, fields) {
    await api(`/api/admin/menu-items/${item.id}`, { method: 'PUT', body: JSON.stringify(fields) });
    loadItems(activeMenu);
  }

  async function removeItem(item) {
    if (!confirm(`Delete "${item.label}"?`)) return;
    await api(`/api/admin/menu-items/${item.id}`, { method: 'DELETE' });
    loadItems(activeMenu);
  }

  const topLevel = items.filter((i) => !i.parent_id);
  const childrenOf = (id) => items.filter((i) => i.parent_id === id);

  return (
    <div>
      <h1 className="admin-h1">Menus &amp; Navigation</h1>

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
          <MenuItemRow item={item} onSave={(f) => updateItem(item, f)} onDelete={() => removeItem(item)} />
          <div style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#8FA3C2', marginBottom: '0.5rem' }}>
              Mega-menu column links (leave empty for a plain top-level link)
            </div>
            {childrenOf(item.id).map((child) => (
              <div key={child.id} style={{ marginBottom: '0.5rem' }}>
                <MenuItemRow item={child} onSave={(f) => updateItem(child, f)} onDelete={() => removeItem(child)} compact />
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

function MenuItemRow({ item, onSave, onDelete, compact }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        style={{ width: compact ? 160 : 220 }}
        defaultValue={item.label}
        onBlur={(e) => onSave({ label: e.target.value })}
        placeholder="Label"
      />
      <input
        style={{ width: compact ? 160 : 220 }}
        defaultValue={item.url}
        onBlur={(e) => onSave({ url: e.target.value })}
        placeholder="URL"
      />
      {compact && (
        <input
          style={{ width: 160 }}
          defaultValue={item.column_heading || ''}
          onBlur={(e) => onSave({ column_heading: e.target.value })}
          placeholder="Mega-menu column heading"
        />
      )}
      <button className="admin-btn admin-btn-ghost" onClick={() => onSave({ visible: item.visible ? 0 : 1 })}>
        {item.visible ? 'Visible' : 'Hidden'}
      </button>
      <button className="admin-btn admin-btn-danger" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
