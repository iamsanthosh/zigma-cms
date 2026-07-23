'use client';
import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

export default function PageThemeOverrides({ pageId }) {
  const [overrides, setOverrides] = useState(null);
  const [globalTheme, setGlobalTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    loadOverrides();
  }, [pageId]);

  async function loadOverrides() {
    try {
      const res = await fetch(`/api/admin/pages/${pageId}/theme-overrides`);
      if (res.ok) {
        const data = await res.json();
        setOverrides(data.overrides);
        setGlobalTheme(data.globalTheme);
        setEnabled(Object.keys(data.overrides || {}).length > 0);
      }
    } catch (error) {
      console.error('Failed to load page theme overrides:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      await fetch(`/api/admin/pages/${pageId}/theme-overrides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme_id: 1,
          override_config: overrides,
          is_active: enabled
        })
      });

      setMessage('Page theme overrides saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save overrides. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleColorOverride(colorName, value) {
    if (!overrides) {
      setOverrides({ colors: { [colorName]: value } });
    } else {
      setOverrides({
        ...overrides,
        colors: {
          ...(overrides.colors || {}),
          [colorName]: value
        }
      });
    }
  }

  function handleRemoveOverride(type, key) {
    if (overrides) {
      const newOverrides = { ...overrides };
      if (type === 'color' && newOverrides.colors) {
        delete newOverrides.colors[key];
        if (Object.keys(newOverrides.colors).length === 0) {
          delete newOverrides.colors;
        }
      }
      setOverrides(newOverrides);
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading page theme overrides...</div>;
  }

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="admin-h1" style={{ marginBottom: 0 }}>Page Theme Overrides</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Override global theme settings for this specific page
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Enable Overrides
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn-primary"
            style={{ padding: '0.75rem 1.5rem' }}
          >
            {saving ? 'Saving...' : 'Save Overrides'}
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

      {!enabled && (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          background: 'var(--admin-bg)',
          borderRadius: '8px',
          color: 'var(--admin-text-muted)'
        }}>
          Enable overrides to customize theme settings for this page
        </div>
      )}

      {enabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Color Overrides */}
          <ColorOverrides
            globalColors={globalTheme?.settings || []}
            overrides={overrides?.colors || {}}
            onColorChange={handleColorOverride}
            onRemove={(key) => handleRemoveOverride('color', key)}
            setSelectedColor={setSelectedColor}
          />

          {/* Typography Overrides */}
          <TypographyOverrides
            globalTypography={globalTheme?.typography || []}
            overrides={overrides?.typography || {}}
            onUpdate={(typography) => setOverrides({ ...overrides, typography })}
          />

          {/* Spacing Overrides */}
          <SpacingOverrides
            globalSpacing={globalTheme?.settings?.filter(s => s.category === 'spacing') || []}
            overrides={overrides?.spacing || {}}
            onUpdate={(spacing) => setOverrides({ ...overrides, spacing })}
          />

          {/* Section Overrides */}
          <SectionOverrides
            globalSections={globalTheme?.sections || []}
            overrides={overrides?.sections || {}}
            onUpdate={(sections) => setOverrides({ ...overrides, sections })}
          />
        </div>
      )}

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
              Edit Color Override
            </h3>
            <HexColorPicker
              color={selectedColor.value}
              onChange={(color) => handleColorOverride(selectedColor.name, color)}
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
  );
}

function ColorOverrides({ globalColors, overrides, onColorChange, onRemove, setSelectedColor }) {
  const colorCategories = {
    color: 'Colors',
    font: 'Fonts',
    effect: 'Effects',
    layout: 'Layout'
  };

  const groupedColors = globalColors.reduce((acc, color) => {
    if (!acc[color.category]) acc[color.category] = [];
    acc[color.category].push(color);
    return acc;
  }, {});

  return (
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--admin-text-primary)' }}>
        Color Overrides
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {Object.entries(groupedColors).map(([category, colors]) => (
          <div key={category}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '0.75rem', color: 'var(--admin-text-primary)' }}>
              {colorCategories[category] || category}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {colors.map((color) => (
                <div
                  key={color.key}
                  style={{
                    padding: '1rem',
                    border: '1px solid var(--admin-card-border)',
                    borderRadius: '8px',
                    background: 'var(--admin-card-bg)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--admin-text-muted)' }}>
                      {color.key}
                    </label>
                    {overrides[color.key] && (
                      <button
                        onClick={() => onRemove(color.key)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div
                    onClick={() => setSelectedColor({ name: color.key, value: overrides[color.key] || color.value })}
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '6px',
                      background: overrides[color.key] || color.value,
                      border: '1px solid rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: overrides[color.key] ? '#ffffff' : '#64748b',
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}
                  >
                    {overrides[color.key] ? overrides[color.key] : color.value}
                  </div>
                  {color.description && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem', margin: 0 }}>
                      {color.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypographyOverrides({ globalTypography, overrides, onUpdate }) {
  return (
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--admin-text-primary)' }}>
        Typography Overrides
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {globalTypography.map((font) => (
          <div
            key={font.id}
            style={{
              padding: '1rem',
              border: '1px solid var(--admin-card-border)',
              borderRadius: '8px',
              background: 'var(--admin-card-bg)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{font.font_name}</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                {font.css_variable}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Font Family
                </label>
                <input
                  type="text"
                  defaultValue={font.font_family}
                  readOnly
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', background: 'var(--admin-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Font Weight
                </label>
                <input
                  type="text"
                  defaultValue={font.font_weight}
                  readOnly
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', background: 'var(--admin-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Line Height
                </label>
                <input
                  type="text"
                  defaultValue={font.line_height}
                  readOnly
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', background: 'var(--admin-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpacingOverrides({ globalSpacing, overrides, onUpdate }) {
  return (
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--admin-text-primary)' }}>
        Spacing Overrides
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {globalSpacing.map((spacing) => (
          <div
            key={spacing.key}
            style={{
              padding: '1rem',
              border: '1px solid var(--admin-card-border)',
              borderRadius: '8px',
              background: 'var(--admin-card-bg)'
            }}
          >
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              {spacing.key}
            </label>
            <input
              type="text"
              defaultValue={spacing.value}
              readOnly
              style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', background: 'var(--admin-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '4px' }}
            />
            {spacing.description && (
              <p style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem', margin: 0 }}>
                {spacing.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionOverrides({ globalSections, overrides, onUpdate }) {
  return (
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--admin-text-primary)' }}>
        Section Overrides
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {globalSections.map((section) => (
          <div
            key={section.section_id}
            style={{
              padding: '1rem',
              border: '1px solid var(--admin-card-border)',
              borderRadius: '8px',
              background: 'var(--admin-card-bg)'
            }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>{section.section_name}</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: '0.75rem' }}>
              ID: {section.section_id}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Background
                </label>
                <input
                  type="text"
                  defaultValue={section.background_value || section.background_type}
                  readOnly
                  style={{ width: '100%', padding: '0.3rem', fontSize: '0.75rem', background: 'var(--admin-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--admin-text-muted)', display: 'block', marginBottom: '0.25rem' }}>
                  Padding Top
                </label>
                <input
                  type="text"
                  defaultValue={section.padding_top}
                  readOnly
                  style={{ width: '100%', padding: '0.3rem', fontSize: '0.75rem', background: 'var(--admin-bg)', border: '1px solid var(--admin-card-border)', borderRadius: '4px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
