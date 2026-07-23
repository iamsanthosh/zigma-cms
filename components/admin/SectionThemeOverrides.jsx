'use client';
import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

export default function SectionThemeOverrides({ sectionId }) {
  const [overrides, setOverrides] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    loadOverrides();
  }, [sectionId]);

  async function loadOverrides() {
    try {
      const res = await fetch(`/api/admin/sections/${sectionId}/theme-overrides`);
      if (res.ok) {
        const data = await res.json();
        setOverrides(data.override_config);
        setEnabled(data.is_active);
      }
    } catch (error) {
      console.error('Failed to load section theme overrides:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      await fetch(`/api/admin/sections/${sectionId}/theme-overrides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme_id: 1,
          override_config: overrides,
          is_active: enabled
        })
      });

      setMessage('Section theme overrides saved successfully!');
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

  function handleLayoutOverride(key, value) {
    if (!overrides) {
      setOverrides({ layout: { [key]: value } });
    } else {
      setOverrides({
        ...overrides,
        layout: {
          ...(overrides.layout || {}),
          [key]: value
        }
      });
    }
  }

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading section theme overrides...</div>;
  }

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="admin-h1" style={{ marginBottom: 0 }}>Section Theme Overrides</h1>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Override global theme settings for this specific section
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
          Enable overrides to customize theme settings for this section
        </div>
      )}

      {enabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Color Overrides */}
          <ColorOverrides
            overrides={overrides?.colors || {}}
            onColorChange={handleColorOverride}
            onRemove={(key) => handleRemoveOverride('color', key)}
            setSelectedColor={setSelectedColor}
          />

          {/* Layout Overrides */}
          <LayoutOverrides
            overrides={overrides?.layout || {}}
            onUpdate={handleLayoutOverride}
          />

          {/* Visibility Override */}
          <VisibilityOverride
            overrides={overrides}
            onUpdate={(visibility) => setOverrides({ ...overrides, visibility })}
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

function ColorOverrides({ overrides, onColorChange, onRemove, setSelectedColor }) {
  const commonColors = [
    { name: 'background-primary', label: 'Section Background' },
    { name: 'text-primary', label: 'Text Color' },
    { name: 'primary', label: 'Accent Color' },
  ];

  return (
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--admin-text-primary)' }}>
        Color Overrides
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {commonColors.map(({ name, label }) => (
          <div
            key={name}
            style={{
              padding: '1rem',
              border: '1px solid var(--admin-card-border)',
              borderRadius: '8px',
              background: 'var(--admin-card-bg)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</label>
              {overrides[name] && (
                <button
                  onClick={() => onRemove(name)}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Remove
                </button>
              )}
            </div>
            <div
              onClick={() => setSelectedColor({ name, value: overrides[name] || '#2563EB' })}
              style={{
                width: '100%',
                height: '48px',
                borderRadius: '6px',
                background: overrides[name] || '#e2e8f0',
                border: '1px solid rgba(0,0,0,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: overrides[name] ? '#ffffff' : '#64748b',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {overrides[name] ? overrides[name] : 'Click to set'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LayoutOverrides({ overrides, onUpdate }) {
  return (
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--admin-text-primary)' }}>
        Layout Overrides
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{
          padding: '1rem',
          border: '1px solid var(--admin-card-border)',
          borderRadius: '8px',
          background: 'var(--admin-card-bg)'
        }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            Padding Top
          </label>
          <input
            type="text"
            value={overrides?.paddingTop || ''}
            onChange={(e) => onUpdate('paddingTop', e.target.value)}
            placeholder="e.g., 2rem"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--admin-card-border)',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
          />
        </div>
        <div style={{
          padding: '1rem',
          border: '1px solid var(--admin-card-border)',
          borderRadius: '8px',
          background: 'var(--admin-card-bg)'
        }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            Padding Bottom
          </label>
          <input
            type="text"
            value={overrides?.paddingBottom || ''}
            onChange={(e) => onUpdate('paddingBottom', e.target.value)}
            placeholder="e.g., 2rem"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--admin-card-border)',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
          />
        </div>
        <div style={{
          padding: '1rem',
          border: '1px solid var(--admin-card-border)',
          borderRadius: '8px',
          background: 'var(--admin-card-bg)'
        }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            Background Image
          </label>
          <input
            type="text"
            value={overrides?.backgroundImage || ''}
            onChange={(e) => onUpdate('backgroundImage', e.target.value)}
            placeholder="Image URL"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid var(--admin-card-border)',
              borderRadius: '4px',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>
    </div>
  );
}

function VisibilityOverride({ overrides, onUpdate }) {
  return (
    <div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--admin-text-primary)' }}>
        Visibility
      </h3>
      <div style={{
        padding: '1rem',
        border: '1px solid var(--admin-card-border)',
        borderRadius: '8px',
        background: 'var(--admin-card-bg)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
          <input
            type="checkbox"
            checked={overrides?.visibility !== false}
            onChange={(e) => onUpdate(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          Show this section
        </label>
      </div>
    </div>
  );
}
