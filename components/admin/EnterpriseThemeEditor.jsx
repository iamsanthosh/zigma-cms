'use client';
import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import ThemeLivePreview from './ThemeLivePreview';

export default function EnterpriseThemeEditor() {
  const [theme, setTheme] = useState(null);
  const [colors, setColors] = useState({});
  const [typography, setTypography] = useState({});
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('colors');
  const [selectedColor, setSelectedColor] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const res = await fetch('/api/admin/enterprise-theme');
      if (res.ok) {
        const data = await res.json();
        setTheme(data.theme);
        
        // Organize colors by category
        const colorMap = {};
        data.colors.forEach(c => {
          if (!colorMap[c.color_category]) colorMap[c.color_category] = [];
          colorMap[c.color_category].push(c);
        });
        setColors(colorMap);

        // Organize typography by context
        const typoMap = {};
        data.typography.forEach(t => {
          if (!typoMap[t.usage_context]) typoMap[t.usage_context] = t;
        });
        setTypography(typoMap);
        setVersions(data.versions || []);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const allColors = Object.values(colors).flat();
      const allTypography = Object.values(typography);

      await fetch('/api/admin/enterprise-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme_id: theme.id,
          colors: allColors,
          typography: allTypography,
          create_version: true,
          version_label: `Manual save ${new Date().toLocaleString()}`
        })
      });

      setMessage('Theme saved successfully as draft!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save theme. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!confirm('Publish this theme? This will make it live on the site.')) return;
    
    setSaving(true);
    setMessage('');
    try {
      const allColors = Object.values(colors).flat();
      const allTypography = Object.values(typography);

      await fetch('/api/admin/enterprise-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme_id: theme.id,
          colors: allColors,
          typography: allTypography,
          create_version: true,
          version_label: `Published ${new Date().toLocaleString()}`,
          publish: true
        })
      });

      setMessage('Theme published successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to publish theme. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleRestore(versionId) {
    if (!confirm('Restore this version? Current changes will be replaced.')) return;
    
    try {
      const version = versions.find(v => v.id === versionId);
      if (version && version.theme_config) {
        const config = JSON.parse(version.theme_config);
        
        // Apply restored colors
        if (config.colors) {
          const colorMap = {};
          config.colors.forEach(c => {
            if (!colorMap[c.color_category]) colorMap[c.color_category] = [];
            colorMap[c.color_category].push(c);
          });
          setColors(colorMap);
        }

        // Apply restored typography
        if (config.typography) {
          const typoMap = {};
          config.typography.forEach(t => {
            if (!typoMap[t.usage_context]) typoMap[t.usage_context] = t;
          });
          setTypography(typoMap);
        }

        setMessage('Version restored. Save to apply changes.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Failed to restore version.');
    }
  }

  function handleColorChange(colorId, value) {
    const updatedColors = { ...colors };
    Object.keys(updatedColors).forEach(category => {
      updatedColors[category] = updatedColors[category].map(c => 
        c.id === colorId ? { ...c, color_value: value } : c
      );
    });
    setColors(updatedColors);
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading theme configuration...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', gap: '2rem' }}>
      {/* Editor Panel */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="admin-h1" style={{ marginBottom: 0 }}>Enterprise Theme Editor</h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowVersions(!showVersions)}
              className="admin-btn admin-btn-ghost"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              {showVersions ? 'Hide Versions' : 'View Versions'}
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="admin-btn admin-btn-ghost"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn-ghost"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="admin-btn admin-btn-primary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            background: message.includes('success') ? '#d4edda' : '#f8d7da',
            color: message.includes('success') ? '#155724' : '#721c24',
          }}>
            {message}
          </div>
        )}

        {/* Versions Panel */}
        {showVersions && (
          <div style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'var(--admin-bg)',
            borderRadius: '8px',
            border: '1px solid var(--admin-card-border)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Version History</h3>
            {versions.length === 0 ? (
              <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>
                No versions saved yet. Save changes to create a version.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {versions.map((version) => (
                  <div key={version.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'var(--admin-card-bg)',
                    borderRadius: '6px',
                    border: '1px solid var(--admin-card-border)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        {version.version_label || version.version_number}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                        {new Date(version.created_at).toLocaleString()} · {version.status}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestore(version.id)}
                      className="admin-btn admin-btn-ghost"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          borderBottom: '1px solid var(--admin-card-border)',
          paddingBottom: '0.5rem'
        }}>
          {['colors', 'typography', 'components', 'layout', 'assets'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="admin-btn admin-btn-ghost"
              style={{
                padding: '0.75rem 1.5rem',
                borderBottom: activeTab === tab ? '2px solid var(--admin-primary)' : 'none',
                fontWeight: activeTab === tab ? 600 : 400,
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'colors' && <ColorsEditor colors={colors} onColorChange={handleColorChange} setSelectedColor={setSelectedColor} />}
        {activeTab === 'typography' && <TypographyEditor typography={typography} />}
        {activeTab === 'components' && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Component editor coming soon</div>}
        {activeTab === 'layout' && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Layout editor coming soon</div>}
        {activeTab === 'assets' && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Asset manager coming soon</div>}

        {/* Color Picker Modal */}
        {selectedColor && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setSelectedColor(null)}>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--admin-card-bg)',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
              }}
            >
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
                Edit Color
              </h3>
              <HexColorPicker
                color={selectedColor.value}
                onChange={(color) => handleColorChange(selectedColor.id, color)}
                style={{ width: '250px', height: '250px' }}
              />
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <button
                  onClick={() => setSelectedColor(null)}
                  className="admin-btn admin-btn-primary"
                  style={{ padding: '0.5rem 2rem' }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <ThemeLivePreview colors={colors} typography={typography} />
      )}
    </div>
  );
}

function ColorsEditor({ colors, onColorChange, setSelectedColor }) {
  const categoryLabels = {
    primary: 'Primary Colors',
    secondary: 'Secondary Colors',
    accent: 'Accent Colors',
    neutral: 'Neutral Colors',
    semantic: 'Semantic Colors',
    brand: 'Brand Colors'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {Object.entries(colors).map(([category, colorList]) => (
        <div key={category}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--admin-text-primary)' }}>
            {categoryLabels[category] || category}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {colorList.map(color => (
              <div
                key={color.id}
                onClick={() => setSelectedColor({ id: color.id, value: color.color_value })}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--admin-card-border)',
                  borderRadius: '8px',
                  background: 'var(--admin-card-bg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '60px',
                  borderRadius: '6px',
                  background: color.color_value,
                  marginBottom: '0.75rem',
                  border: '1px solid rgba(0,0,0,0.1)'
                }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {color.color_name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', fontFamily: 'monospace' }}>
                  {color.color_value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TypographyEditor({ typography }) {
  const [editing, setEditing] = useState(null);

  function handleUpdate(context, field, value) {
    setEditing(null);
    // Update typography state and save
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {Object.entries(typography).map(([context, config]) => (
        <div key={context} style={{
          padding: '1.5rem',
          border: '1px solid var(--admin-card-border)',
          borderRadius: '8px',
          background: 'var(--admin-card-bg)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, textTransform: 'capitalize' }}>
              {context}
            </h3>
            <button
              onClick={() => setEditing(context)}
              className="admin-btn admin-btn-ghost"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              Edit
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                Font Family
              </label>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {config.font_family}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                Font Weight
              </label>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {config.font_weight}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                Font Size
              </label>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {config.font_size}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                Line Height
              </label>
              <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {config.line_height}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--admin-bg)', borderRadius: '4px' }}>
            <div style={{
              fontFamily: config.font_family,
              fontWeight: config.font_weight,
              fontSize: config.font_size,
              lineHeight: config.line_height
            }}>
              Sample text in {context} style
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
