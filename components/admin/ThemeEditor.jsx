'use client';
import { useState } from 'react';
import { useTheme } from '@/lib/ThemeProvider';
import { THEME_CATEGORIES, THEME_PRESETS, ColorUtils, ExportUtils } from '@/lib/themeConfig';

export default function ThemeEditor() {
  const {
    themeSettings,
    pageThemeSettings,
    isDarkMode,
    isLoading,
    activeThemeScope,
    setActiveThemeScope,
    themeHistory,
    updateThemeSetting,
    applyPreset,
    generateFromBrandColor,
    toggleDarkMode,
    exportTheme,
    importTheme,
    resetToDefault,
    validateAccessibility,
    applyPageThemeSettings,
    saveToHistory,
    restoreFromHistory,
    deleteFromHistory,
    clearHistory,
    presets,
  } = useTheme();

  const [activeCategory, setActiveCategory] = useState('colors');
  const [brandColor, setBrandColor] = useState('#FF6B1A');
  const [validation, setValidation] = useState(null);
  const [showPresets, setShowPresets] = useState(false);
  const [showHarmony, setShowHarmony] = useState(false);
  const [showColorBlindness, setShowColorBlindness] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [harmonyType, setHarmonyType] = useState('complementary');
  const [colorBlindnessType, setColorBlindnessType] = useState('protanopia');
  const [exportFormat, setExportFormat] = useState('json');

  const handleColorChange = (key, value) => {
    updateThemeSetting(key, value, activeCategory, activeThemeScope);
  };

  const handlePresetApply = (presetKey) => {
    applyPreset(presetKey, activeThemeScope);
    setShowPresets(false);
  };

  const handleBrandColorGenerate = () => {
    generateFromBrandColor(brandColor, activeThemeScope);
  };

  const handleHarmonyGenerate = () => {
    const harmonyColors = ColorUtils.generateHarmony(brandColor, harmonyType);
    const colorMapping = {
      '--navy-950': harmonyColors[0],
      '--orange': harmonyColors[1],
      '--green': harmonyColors[2] || harmonyColors[0],
      '--cyan': harmonyColors[3] || harmonyColors[1],
      '--accent': harmonyColors[1],
    };
    Object.entries(colorMapping).forEach(([key, value]) => {
      if (value) updateThemeSetting(key, value, 'colors');
    });
  };

  const handleColorBlindnessSimulate = () => {
    Object.entries(themeSettings).forEach(([key, value]) => {
      if (key.startsWith('--') && typeof value === 'string' && value.startsWith('#')) {
        const simulated = ColorUtils.simulateColorBlindness(value, colorBlindnessType);
        updateThemeSetting(key, simulated, 'colors');
      }
    });
  };

  const handleValidate = () => {
    const result = validateAccessibility();
    setValidation(result);
  };

  const handleExport = (format) => {
    if (format === 'json') {
      exportTheme();
    } else {
      let content = '';
      let filename = '';
      let mimeType = 'text/plain';

      switch (format) {
        case 'tailwind':
          content = ExportUtils.toTailwind(themeSettings);
          filename = 'tailwind.config.json';
          mimeType = 'application/json';
          break;
        case 'scss':
          content = ExportUtils.toSCSS(themeSettings);
          filename = 'theme.scss';
          mimeType = 'text/x-scss';
          break;
        case 'css':
          content = ExportUtils.toCSS(themeSettings);
          filename = 'theme.css';
          mimeType = 'text/css';
          break;
        case 'figma':
          content = ExportUtils.toFigma(themeSettings);
          filename = 'figma-theme.json';
          mimeType = 'application/json';
          break;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
    setShowExportOptions(false);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await importTheme(file);
      } catch (error) {
        alert('Failed to import theme: ' + error.message);
      }
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to the default theme? This cannot be undone.')) {
      resetToDefault(activeThemeScope);
    }
  };

  const handleSaveSnapshot = () => {
    const name = prompt('Enter a name for this theme snapshot:');
    if (name) {
      const settings = activeThemeScope === 'global' ? themeSettings : pageThemeSettings;
      saveToHistory(settings, activeThemeScope, name);
    }
  };

  const handleRestoreSnapshot = (snapshotId) => {
    if (confirm('Restore this theme snapshot? Current settings will be replaced.')) {
      restoreFromHistory(snapshotId);
    }
  };

  const handleDeleteSnapshot = (snapshotId) => {
    if (confirm('Delete this theme snapshot?')) {
      deleteFromHistory(snapshotId);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-card">
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <span style={{ marginLeft: '1rem' }}>Loading theme settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-toolbar">
        <h2 className="admin-h2" style={{ marginBottom: 0 }}>Theme Editor</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="admin-btn admin-btn-ghost" onClick={() => setShowPresets(!showPresets)}>
            {showPresets ? 'Hide Presets' : 'Apply Preset'}
          </button>
          <button className="admin-btn admin-btn-ghost" onClick={() => setShowHarmony(!showHarmony)}>
            Color Harmony
          </button>
          <button className="admin-btn admin-btn-ghost" onClick={() => setShowColorBlindness(!showColorBlindness)}>
            Color Blindness
          </button>
          <button className="admin-btn admin-btn-ghost" onClick={() => setShowHistory(!showHistory)}>
            History ({themeHistory.length})
          </button>
          <button className="admin-btn admin-btn-ghost" onClick={handleValidate}>
            Validate
          </button>
          <button className="admin-btn admin-btn-ghost" onClick={() => setShowExportOptions(!showExportOptions)}>
            Export
          </button>
          <label className="admin-btn admin-btn-ghost" style={{ cursor: 'pointer' }}>
            Import
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
          <button className="admin-btn admin-btn-ghost" onClick={handleReset}>
            Reset
          </button>
          <button
            className={`admin-btn ${isDarkMode ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            onClick={toggleDarkMode}
          >
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* Validation Results */}
      {validation && (
        <div className={`admin-card ${validation.isValid ? 'admin-alert-success' : 'admin-alert-error'}`} style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>
            {validation.isValid ? '✅ Theme passes accessibility checks' : '⚠️ Theme has accessibility issues'}
          </h3>
          {validation.issues.length > 0 && (
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              {validation.issues.map((issue, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>
                  <strong>{issue.severity}:</strong> {issue.message}
                </li>
              ))}
            </ul>
          )}
          <button
            className="admin-btn admin-btn-ghost"
            onClick={() => setValidation(null)}
            style={{ marginTop: '0.5rem' }}
          >
            Close
          </button>
        </div>
      )}

      {/* Presets Panel */}
      {showPresets && (
        <div className="admin-card" style={{ marginBottom: '1rem', background: 'var(--admin-bg)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Theme Presets</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(presets).map(([key, preset]) => (
              <button
                key={key}
                className="admin-btn admin-btn-ghost"
                onClick={() => handlePresetApply(key)}
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  border: '1px solid var(--admin-card-border)',
                  borderRadius: 'var(--admin-radius-md)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {Object.values(preset.colors).slice(0, 5).map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        background: color,
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontWeight: 600 }}>{preset.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Harmony Panel */}
      {showHarmony && (
        <div className="admin-card" style={{ marginBottom: '1rem', background: 'var(--admin-bg)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Color Harmony Generator</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div className="admin-field" style={{ marginBottom: 0, minWidth: '200px' }}>
              <label>Base Color</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  style={{ width: '50px', height: '38px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div className="admin-field" style={{ marginBottom: 0 }}>
              <label>Harmony Type</label>
              <select value={harmonyType} onChange={(e) => setHarmonyType(e.target.value)}>
                <option value="complementary">Complementary</option>
                <option value="analogous">Analogous</option>
                <option value="triadic">Triadic</option>
                <option value="splitComplementary">Split Complementary</option>
                <option value="tetradic">Tetradic</option>
                <option value="monochromatic">Monochromatic</option>
              </select>
            </div>
            <button className="admin-btn admin-btn-primary" onClick={handleHarmonyGenerate}>
              Generate Harmony
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            Generates color harmonies based on color theory principles
          </p>
        </div>
      )}

      {/* Color Blindness Panel */}
      {showColorBlindness && (
        <div className="admin-card" style={{ marginBottom: '1rem', background: 'var(--admin-bg)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Color Blindness Simulation</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div className="admin-field" style={{ marginBottom: 0 }}>
              <label>Type</label>
              <select value={colorBlindnessType} onChange={(e) => setColorBlindnessType(e.target.value)}>
                <option value="protanopia">Protanopia (Red-blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                <option value="tritanopia">Tritanopia (Blue-blind)</option>
                <option value="achromatopsia">Achromatopsia (Complete)</option>
              </select>
            </div>
            <button className="admin-btn admin-btn-primary" onClick={handleColorBlindnessSimulate}>
              Simulate
            </button>
            <button className="admin-btn admin-btn-ghost" onClick={resetToDefault}>
              Reset Colors
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
            Simulates how your theme appears to users with different types of color blindness
          </p>
        </div>
      )}

      {/* Export Options Panel */}
      {showExportOptions && (
        <div className="admin-card" style={{ marginBottom: '1rem', background: 'var(--admin-bg)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Export Theme</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="admin-btn admin-btn-ghost" onClick={() => handleExport('json')}>
              JSON
            </button>
            <button className="admin-btn admin-btn-ghost" onClick={() => handleExport('tailwind')}>
              Tailwind Config
            </button>
            <button className="admin-btn admin-btn-ghost" onClick={() => handleExport('scss')}>
              SCSS
            </button>
            <button className="admin-btn admin-btn-ghost" onClick={() => handleExport('css')}>
              CSS
            </button>
            <button className="admin-btn admin-btn-ghost" onClick={() => handleExport('figma')}>
              Figma
            </button>
          </div>
        </div>
      )}

      {/* Theme History Panel */}
      {showHistory && (
        <div className="admin-card" style={{ marginBottom: '1rem', background: 'var(--admin-bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: 0 }}>Theme History</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="admin-btn admin-btn-primary" onClick={handleSaveSnapshot}>
                Save Snapshot
              </button>
              {themeHistory.length > 0 && (
                <button className="admin-btn admin-btn-danger" onClick={clearHistory}>
                  Clear All
                </button>
              )}
            </div>
          </div>
          {themeHistory.length === 0 ? (
            <p style={{ color: 'var(--admin-text-muted)', padding: '1rem 0' }}>
              No theme snapshots saved yet. Click "Save Snapshot" to save the current theme state.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {themeHistory.map((snapshot) => (
                <div
                  key={snapshot.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'var(--admin-card-bg)',
                    border: '1px solid var(--admin-card-border)',
                    borderRadius: 'var(--admin-radius-md)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{snapshot.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                      {new Date(snapshot.timestamp).toLocaleString()} · {snapshot.scope}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className="admin-btn admin-btn-ghost"
                      onClick={() => handleRestoreSnapshot(snapshot.id)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Restore
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      onClick={() => handleDeleteSnapshot(snapshot.id)}
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brand Color Generator */}
      <div className="admin-card" style={{ marginBottom: '1rem', background: 'var(--admin-bg)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Generate from Brand Color</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="admin-field" style={{ marginBottom: 0, minWidth: '200px' }}>
            <label>Brand Color</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                style={{ width: '50px', height: '38px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={handleBrandColorGenerate}>
            Generate Palette
          </button>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginTop: '0.5rem' }}>
          Automatically generates a complete color palette based on your brand color
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ marginRight: '1rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--admin-text-secondary)' }}>
          Scope:
        </div>
        <button
          className={`admin-btn ${activeThemeScope === 'global' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          onClick={() => setActiveThemeScope('global')}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          Global
        </button>
        <button
          className={`admin-btn ${activeThemeScope === 'page' ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
          onClick={() => setActiveThemeScope('page')}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
        >
          Page
        </button>
        <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
          {activeThemeScope === 'global' ? 'Affects entire site' : 'Affects current page only'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {Object.entries(THEME_CATEGORIES).map(([key, category]) => (
          <button
            key={key}
            className={`admin-btn ${activeCategory === key ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
            onClick={() => setActiveCategory(key)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Theme Variables */}
      <div className="admin-grid-2">
        {THEME_CATEGORIES[activeCategory]?.variables.map((variable) => (
          <div key={variable.key} className="admin-field">
            <label>
              {variable.label}
              {variable.type === 'select' && (
                <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  {variable.options?.join(', ')}
                </span>
              )}
            </label>
            {variable.type === 'color' && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={themeSettings[variable.key] || variable.default}
                  onChange={(e) => handleColorChange(variable.key, e.target.value)}
                  style={{ width: '50px', height: '38px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={themeSettings[variable.key] || variable.default}
                  onChange={(e) => handleColorChange(variable.key, e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            )}
            {variable.type === 'select' && (
              <select
                value={themeSettings[variable.key] || variable.default}
                onChange={(e) => handleColorChange(variable.key, e.target.value)}
              >
                {variable.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
            {variable.type === 'number' && (
              <input
                type="number"
                value={themeSettings[variable.key] || variable.default}
                onChange={(e) => handleColorChange(variable.key, e.target.value)}
                style={{ width: '100%' }}
              />
            )}
            {variable.type === 'font' && (
              <select
                value={themeSettings[variable.key] || variable.default}
                onChange={(e) => handleColorChange(variable.key, e.target.value)}
              >
                <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'IBM Plex Mono', monospace">IBM Plex Mono</option>
                <option value="system-ui, -apple-system, sans-serif">System UI</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Open Sans', sans-serif">Open Sans</option>
                <option value="'Montserrat', sans-serif">Montserrat</option>
                <option value="'Poppins', sans-serif">Poppins</option>
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Live Preview Section */}
      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--admin-card-border)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Live Preview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Button Preview */}
          <div className="admin-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Buttons</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button className="admin-btn admin-btn-primary">Primary</button>
              <button className="admin-btn admin-btn-ghost">Ghost</button>
              <button className="admin-btn admin-btn-danger">Danger</button>
              <button className="admin-btn admin-btn-success">Success</button>
            </div>
          </div>

          {/* Card Preview */}
          <div className="admin-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Cards & Text</h4>
            <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Primary Text</div>
            <div style={{ marginBottom: '0.5rem', color: 'var(--admin-text-secondary)' }}>Secondary Text</div>
            <div style={{ color: 'var(--admin-text-muted)' }}>Muted Text</div>
          </div>

          {/* Input Preview */}
          <div className="admin-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Inputs</h4>
            <div className="admin-field">
              <label>Text Input</label>
              <input type="text" placeholder="Enter text..." />
            </div>
            <div className="admin-field">
              <label>Select</label>
              <select>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
