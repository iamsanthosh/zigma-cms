'use client';
import { useEffect, useState } from 'react';
import MediaPicker from '@/components/admin/MediaPicker';
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

const FOOTER_FIELDS = [
  { key: 'footerTagline', label: 'Footer tagline' },
  { key: 'phone', label: 'Phone number' },
  { key: 'email', label: 'Email address' },
  { key: 'emergencyLabel', label: 'Emergency support label' },
  { key: 'emergencyUrl', label: 'Emergency support link' },
  { key: 'copyrightText', label: 'Copyright text' },
  { key: 'footerPoweredByText', label: '"Powered by" text' },
  { key: 'privacyPolicyUrl', label: 'Privacy Policy URL' },
  { key: 'termsUrl', label: 'Terms & Conditions URL' },
];

const FOOTER_FIELDS = [
  { key: 'footerTagline', label: 'Footer tagline' },
  { key: 'phone', label: 'Phone number' },
  { key: 'email', label: 'Email address' },
  { key: 'emergencyLabel', label: 'Emergency support label' },
  { key: 'emergencyUrl', label: 'Emergency support link' },
  { key: 'copyrightText', label: 'Copyright text' },
  { key: 'footerPoweredByText', label: '"Powered by" text' },
  { key: 'privacyPolicyUrl', label: 'Privacy Policy URL' },
  { key: 'termsUrl', label: 'Terms & Conditions URL' },
];

export default function SettingsAdmin() {
  const [settings, setSettings] = useState({});
  const [footerMenus, setFooterMenus] = useState({});
  const [footerItems, setFooterItems] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [status, setStatus] = useState('');
  const router = useUnsavedChanges(hasUnsavedChanges);
  const [initialSettings, setInitialSettings] = useState({});

  async function load() {
    const [siteRows, menusData] = await Promise.all([
      api('/api/admin/site-settings'),
      api('/api/admin/menus'),
    ]);
    const loadedSettings = Object.fromEntries(siteRows.map((r) => [r.key, r.value]));
    setSettings(loadedSettings);
    setInitialSettings(loadedSettings);

    // Filter to get only footer menus
    const fMenus = menusData.filter(m => m.slug.startsWith('footer-'));
    setFooterMenus(Object.fromEntries(fMenus.map((m) => [m.slug, m])));

    // Load items for each footer menu
    for (const menu of fMenus) {
      const items = await api(`/api/admin/menu-items?menu_id=${menu.id}`);
      setFooterItems(prev => ({ ...prev, [menu.slug]: items }));
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);
    setHasUnsavedChanges(hasChanges);
  }, [settings, initialSettings]);

  async function saveSetting(key, value) {
    setSettings((s) => ({ ...s, [key]: value }));
  }


  async function handleSave() {
    setStatus('');
    try {
      // Save all settings
      for (const [key, value] of Object.entries(settings)) {
        await api(`/api/admin/site-settings/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ value }) })
          .catch(() => api('/api/admin/site-settings', { method: 'POST', body: JSON.stringify({ key, value }) }));
      }

      setInitialSettings(settings);
      setHasUnsavedChanges(false);
      setStatus('Saved. Refresh the public site to see changes.');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Save failed: ' + (err.message || 'Unknown error'));
      setTimeout(() => setStatus(''), 3000);
    }
  }

  async function addFooterMenuItem(menuSlug, parentId = null) {
    const menu = footerMenus[menuSlug];
    if (!menu) return;
    const items = footerItems[menuSlug] || [];
    await api('/api/admin/menu-items', {
      method: 'POST',
      body: JSON.stringify({
        menu_id: menu.id,
        parent_id: parentId,
        label: 'New Link',
        url: '#',
        order: items.length,
        visible: 1,
        active: 1
      })
    });
    load();
  }

  async function updateFooterMenuItem(item, fields) {
    await api(`/api/admin/menu-items/${item.id}`, { method: 'PUT', body: JSON.stringify(fields) });
    load();
  }

  async function deleteFooterMenuItem(item) {
    if (!confirm(`Delete "${item.label}"?`)) return;
    await api(`/api/admin/menu-items/${item.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <FloatingActionBar
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        status={status}
      />

      <h1 className="admin-h1">Site &amp; Theme Settings</h1>

      {/* Logo Section */}
      <div className="admin-card">
        <h3 style={{ marginBottom: '1rem' }}>Logo</h3>
        <MediaPicker value={settings.logoImage} onChange={(v) => saveSetting('logoImage', v)} accept="image" />
      </div>

      {/* Header Configuration Section */}
      <div className="admin-card">
        <h3 style={{ marginBottom: '1rem' }}>Header Configuration</h3>
        <p style={{ fontSize: '0.8rem', color: '#8FA3C2', marginBottom: '1rem' }}>
          Configure the site name, tagline, and header call-to-action button that appears in the top navigation.
        </p>
        <div className="admin-grid-2">
          {HEADER_FIELDS.map((f) => (
            <div className="admin-field" key={f.key}>
              <label>{f.label}</label>
              <input
                value={settings[f.key] || ''}
                onChange={(e) => saveSetting(f.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Configuration Section */}
      <div className="admin-card">
        <h3 style={{ marginBottom: '1rem' }}>Footer Configuration</h3>
        <p style={{ fontSize: '0.8rem', color: '#8FA3C2', marginBottom: '1rem' }}>
          Configure all footer content: tagline, contact info, legal links, and branding.
        </p>

        {/* Footer General Settings */}
        <div className="admin-grid-2">
          {FOOTER_FIELDS.map((f) => (
            <div className="admin-field" key={f.key}>
              <label>{f.label}</label>
              <input
                value={settings[f.key] || ''}
                onChange={(e) => saveSetting(f.key, e.target.value)}
                placeholder={f.key === 'footerPoweredByText' ? 'Powered by <strong>Company Name</strong>' : ''}
              />
            </div>
          ))}
        </div>

        {/* Footer Menus Management */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem', marginTop: '0.5rem' }}>Footer Menu Links</h4>

          {/* Footer Company Menu */}
          {footerMenus['footer-company'] && (
            <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.75rem' }}>
                {footerMenus['footer-company'].label}
              </h5>
              <div style={{ marginBottom: '1rem' }}>
                {(footerItems['footer-company'] || []).map((item) => (
                  <MenuItemRow 
                    key={item.id} 
                    item={item} 
                    onSave={(f) => updateFooterMenuItem(item, f)} 
                    onDelete={() => deleteFooterMenuItem(item)} 
                  />
                ))}
              </div>
              <button className="admin-btn admin-btn-ghost" onClick={() => addFooterMenuItem('footer-company')}>
                + Add Link
              </button>
            </div>
          )}

          {/* Footer Capabilities Menu */}
          {footerMenus['footer-capabilities'] && (
            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.75rem' }}>
                {footerMenus['footer-capabilities'].label}
              </h5>
              <div style={{ marginBottom: '1rem' }}>
                {(footerItems['footer-capabilities'] || []).map((item) => (
                  <MenuItemRow 
                    key={item.id} 
                    item={item} 
                    onSave={(f) => updateFooterMenuItem(item, f)} 
                    onDelete={() => deleteFooterMenuItem(item)} 
                  />
                ))}
              </div>
              <button className="admin-btn admin-btn-ghost" onClick={() => addFooterMenuItem('footer-capabilities')}>
                + Add Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Integrations Section */}
      <div className="admin-card">
        <h3 style={{ marginBottom: '1rem' }}>Integrations</h3>
        <div className="admin-field">
          <label>Floating WhatsApp link</label>
          <input
            value={settings.whatsappUrl || ''}
            onChange={(e) => saveSetting('whatsappUrl', e.target.value)}
            placeholder="https://wa.me/919998887777"
          />
        </div>
      </div>
    </div>
  );
}

function MenuItemRow({ item, onSave, onDelete }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
      <input
        style={{ width: 160 }}
        defaultValue={item.label}
        onBlur={(e) => onSave({ label: e.target.value })}
        placeholder="Label"
      />
      <input
        style={{ width: 200 }}
        defaultValue={item.url}
        onBlur={(e) => onSave({ url: e.target.value })}
        placeholder="URL"
      />
      <button className="admin-btn admin-btn-ghost" onClick={() => onSave({ visible: item.visible ? 0 : 1 })}>
        {item.visible ? 'Visible' : 'Hidden'}
      </button>
      <button className="admin-btn admin-btn-danger" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
