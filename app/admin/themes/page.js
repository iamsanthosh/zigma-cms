'use client';

import { useState, useEffect } from 'react';
import { THEME_CATEGORIES, getDefaultThemeSettings, FONT_OPTIONS } from '@/lib/themeConfig';
import FloatingActionBar from '@/components/admin/FloatingActionBar';

export default function ThemesAdmin() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);
  const [editingSettingsTheme, setEditingSettingsTheme] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_default: false,
    is_active: true
  });
  const [themeSettings, setThemeSettings] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [status, setStatus] = useState('');
  const [initialThemeSettings, setInitialThemeSettings] = useState([]);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/themes');
      if (!res.ok) throw new Error('Failed to load themes');
      const data = await res.json();
      setThemes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadThemeSettings = async (themeId) => {
    try {
      const res = await fetch(`/api/admin/themes/${themeId}/settings`);
      if (!res.ok) throw new Error('Failed to load theme settings');
      const data = await res.json();
      
      // Merge with default settings to ensure all variables exist
      const defaults = getDefaultThemeSettings();
      const merged = defaults.map(defaultSetting => {
        const existing = data.find(s => s.key === defaultSetting.key);
        return existing || defaultSetting;
      });
      
      setThemeSettings(merged);
      setInitialThemeSettings(JSON.stringify(merged));
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTheme 
        ? `/api/admin/themes/${editingTheme.id}`
        : '/api/admin/themes';
      
      const method = editingTheme ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save theme');
      
      setShowModal(false);
      setEditingTheme(null);
      setFormData({ name: '', slug: '', description: '', is_default: false, is_active: true });
      loadThemes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSettingsSubmit = async () => {
    setStatus('');
    try {
      const res = await fetch(`/api/admin/themes/${editingSettingsTheme.id}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: themeSettings })
      });

      if (!res.ok) throw new Error('Failed to save theme settings');
      
      setInitialThemeSettings(JSON.stringify(themeSettings));
      setHasUnsavedChanges(false);
      setShowSettingsModal(false);
      setEditingSettingsTheme(null);
      setThemeSettings([]);
      setStatus('Settings saved successfully!');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      setStatus('Save failed: ' + (err.message || 'Unknown error'));
      setTimeout(() => setStatus(''), 2000);
    }
  };

  const handleEdit = (theme) => {
    setEditingTheme(theme);
    setFormData({
      name: theme.name,
      slug: theme.slug,
      description: theme.description || '',
      is_default: theme.is_default === 1,
      is_active: theme.is_active === 1
    });
    setShowModal(true);
  };

  const handleEditSettings = async (theme) => {
    setEditingSettingsTheme(theme);
    await loadThemeSettings(theme.id);
    setShowSettingsModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this theme?')) return;
    try {
      const res = await fetch(`/api/admin/themes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete theme');
      loadThemes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await fetch(`/api/admin/themes/${id}/set-default`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to set default theme');
      loadThemes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSetGlobal = async (id) => {
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'global_theme_id', value: String(id) })
      });
      if (!res.ok) throw new Error('Failed to set global theme');
      loadThemes();
    } catch (err) {
      setError(err.message);
    }
  };

  const addSetting = () => {
    setThemeSettings([...themeSettings, { key: '', value: '', category: 'color' }]);
  };

  const updateSetting = (index, field, value) => {
    const updated = [...themeSettings];
    updated[index][field] = value;
    setThemeSettings(updated);
  };

  const updateSettingByKey = (key, value) => {
    const updated = themeSettings.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    );
    setThemeSettings(updated);
    setHasUnsavedChanges(JSON.stringify(updated) !== initialThemeSettings);
  };

  const removeSetting = (index) => {
    setThemeSettings(themeSettings.filter((_, i) => i !== index));
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error && typeof error === 'string' && !error.includes('Failed')) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div>
      {showSettingsModal && (
        <FloatingActionBar
          onSave={handleSettingsSubmit}
          hasUnsavedChanges={hasUnsavedChanges}
          status={status}
        />
      )}

      <div className="p-6">
        <div className="admin-toolbar" style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
          <h1 className="admin-h1">Themes</h1>
          <button
            onClick={() => setShowModal(true)}
            className="admin-btn admin-btn-primary"
          >
            New Theme
          </button>
        </div>

      {error && typeof error === 'string' && error.includes('saved') && (
        <div className="admin-card" style={{ backgroundColor: '#d1fae5', color: '#065f46', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Default</th>
              <th>Global</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {themes.map((theme) => (
              <tr key={theme.id}>
                <td className="font-medium">{theme.name}</td>
                <td style={{ color: '#64748b' }}>{theme.slug}</td>
                <td>
                  <span className={`admin-badge ${theme.is_active ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                    {theme.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  {theme.is_default ? (
                    <span style={{ color: '#16a34a' }}>✓ Default</span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(theme.id)}
                      className="admin-link"
                    >
                      Set Default
                    </button>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleSetGlobal(theme.id)}
                    className="admin-link"
                  >
                    Set Global
                  </button>
                </td>
                <td className="text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditSettings(theme)}
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => handleEdit(theme)}
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(theme.id)}
                      className="admin-btn admin-btn-danger"
                      style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="admin-card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 className="admin-h2">
                {editingTheme ? 'Edit Theme' : 'New Theme'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="admin-field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-field">
                  <label>Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="admin-field">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_default}
                      onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Set as default theme
                  </label>
                </div>
                <div className="admin-field">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Active
                  </label>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingTheme(null);
                      setFormData({ name: '', slug: '', description: '', is_default: false, is_active: true });
                    }}
                    className="admin-btn admin-btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                  >
                    {editingTheme ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showSettingsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="admin-card" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 className="admin-h2">
                Edit Settings: {editingSettingsTheme?.name}
              </h2>
              <form onSubmit={handleSettingsSubmit}>
                {Object.entries(THEME_CATEGORIES).map(([categoryKey, categoryConfig]) => (
                  <div key={categoryKey} className="mb-6">
                    <h3 className="font-medium text-lg mb-2" style={{ color: '#374151' }}>
                      {categoryConfig.label}
                    </h3>
                    <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
                      {categoryConfig.description}
                    </p>
                    <div className="admin-grid-2">
                      {categoryConfig.variables.map((variable) => {
                        const setting = themeSettings.find(s => s.key === variable.key);
                        const value = setting?.value || variable.default;
                        
                        return (
                          <div key={variable.key} className="admin-field">
                            <label>{variable.label}</label>
                            {variable.type === 'color' && (
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={value}
                                  onChange={(e) => updateSettingByKey(variable.key, e.target.value)}
                                  style={{ width: '50px', height: '40px', padding: '2px' }}
                                />
                                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => updateSettingByKey(variable.key, e.target.value)}
                                  placeholder={variable.default}
                                />
                              </div>
                            )}
                            {variable.type === 'font' && (
                              <select
                                value={value}
                                onChange={(e) => updateSettingByKey(variable.key, e.target.value)}
                              >
                                {FONT_OPTIONS.map(font => (
                                  <option key={font} value={font}>{font}</option>
                                ))}
                              </select>
                            )}
                            {variable.type === 'select' && (
                              <select
                                value={value}
                                onChange={(e) => updateSettingByKey(variable.key, e.target.value)}
                              >
                                {variable.options.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            )}
                            {variable.type === 'text' && (
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => updateSettingByKey(variable.key, e.target.value)}
                                placeholder={variable.default}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
