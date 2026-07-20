'use client';
import { useEffect, useState } from 'react';
import MediaPicker from '@/components/admin/MediaPicker';

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

const SITE_FIELDS = [
  { key: 'logoImage', label: 'Logo image' },
  { key: 'siteName', label: 'Site name' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'phone', label: 'Phone number' },
  { key: 'email', label: 'Email address' },
  { key: 'headerCtaLabel', label: 'Header CTA label' },
  { key: 'headerCtaUrl', label: 'Header CTA link' },
  { key: 'footerTagline', label: 'Footer tagline' },
  { key: 'emergencyLabel', label: 'Footer emergency line label' },
  { key: 'emergencyUrl', label: 'Footer emergency line link' },
  { key: 'copyrightText', label: 'Copyright line' },
  { key: 'whatsappUrl', label: 'Floating WhatsApp link' }
];

const THEME_COLOR_KEYS = ['--orange', '--navy-950', '--gray-100', '--gray-200', '--cyan', '--green'];

export default function SettingsAdmin() {
  const [settings, setSettings] = useState({});
  const [theme, setTheme] = useState({});
  const [saved, setSaved] = useState('');

  async function load() {
    const [siteRows, themeRows] = await Promise.all([api('/api/admin/site-settings'), api('/api/admin/theme-settings')]);
    setSettings(Object.fromEntries(siteRows.map((r) => [r.key, r.value])));
    setTheme(Object.fromEntries(themeRows.map((r) => [r.key, r.value])));
  }

  useEffect(() => {
    load();
  }, []);

  async function saveSetting(key, value) {
    await api(`/api/admin/site-settings/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ value }) })
      .catch(() => api('/api/admin/site-settings', { method: 'POST', body: JSON.stringify({ key, value }) }));
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(`Saved "${key}".`);
    setTimeout(() => setSaved(''), 1500);
  }

  async function saveTheme(key, value) {
    await api(`/api/admin/theme-settings/${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ value }) })
      .catch(() => api('/api/admin/theme-settings', { method: 'POST', body: JSON.stringify({ key, value, category: 'color' }) }));
    setTheme((t) => ({ ...t, [key]: value }));
    setSaved(`Saved "${key}". Refresh the public site to see the new colors.`);
    setTimeout(() => setSaved(''), 2500);
  }

  return (
    <div>
      <h1 className="admin-h1">Site &amp; Theme Settings</h1>
      {saved && <p style={{ color: '#0C8A50', fontSize: '0.85rem', marginBottom: '1rem' }}>{saved}</p>}

      <div className="admin-card">
        <h3 style={{ marginBottom: '1rem' }}>Logo</h3>
        <MediaPicker value={settings.logoImage} onChange={(v) => saveSetting('logoImage', v)} accept="image" />
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: '1rem' }}>General</h3>
        {SITE_FIELDS.map((f) => (
          <div className="admin-field" key={f.key}>
            <label>{f.label}</label>
            <input
              defaultValue={settings[f.key] || ''}
              onBlur={(e) => saveSetting(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: '1rem' }}>Theme colors</h3>
        <p style={{ fontSize: '0.8rem', color: '#8FA3C2', marginBottom: '1rem' }}>
          These map directly onto the CSS custom properties the public template is built with — changing one
          re-colors every section that uses it, site-wide, with zero code changes.
        </p>
        {THEME_COLOR_KEYS.map((key) => (
          <div className="admin-field" key={key}>
            <label>{key}</label>
            <input
              type="color"
              defaultValue={theme[key] || '#FF6B1A'}
              onChange={(e) => saveTheme(key, e.target.value)}
              style={{ width: 80 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
