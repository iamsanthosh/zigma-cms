'use client';

import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';

export default function EnhancedThemePage() {
  const [themeData, setThemeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchThemeData();
  }, []);

  const fetchThemeData = async () => {
    try {
      const response = await fetch('/api/admin/enhanced-theme?themeId=1');
      const data = await response.json();
      setThemeData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching theme data:', error);
      setLoading(false);
    }
  };

  const saveTheme = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/enhanced-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId: 1,
          updates: {
            settings: themeData.settings,
            typography: themeData.typography,
            breakpoints: themeData.breakpoints,
            components: themeData.components,
            sections: themeData.sections,
            animations: themeData.animations,
            svgIcons: themeData.svgIcons
          }
        })
      });
      const result = await response.json();
      if (result.success) {
        setMessage({ type: 'success', text: 'Theme saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save theme' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error saving theme' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const updateSetting = (category, key, value, dataType = 'color') => {
    setThemeData(prev => ({
      ...prev,
      settings: prev.settings.map(s => 
        s.key === key ? { ...s, value, data_type: dataType } : s
      )
    }));
  };

  const updateTypography = (id, field, value) => {
    setThemeData(prev => ({
      ...prev,
      typography: prev.typography.map(t => 
        t.id === id ? { ...t, [field]: value } : t
      )
    }));
  };

  const updateBreakpoint = (id, field, value) => {
    setThemeData(prev => ({
      ...prev,
      breakpoints: prev.breakpoints.map(b => 
        b.id === id ? { ...b, [field]: value } : b
      )
    }));
  };

  const updateComponent = (id, field, value) => {
    setThemeData(prev => ({
      ...prev,
      components: prev.components.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const updateSection = (id, field, value) => {
    setThemeData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    }));
  };

  const updateAnimation = (id, field, value) => {
    setThemeData(prev => ({
      ...prev,
      animations: prev.animations.map(a => 
        a.id === id ? { ...a, [field]: value } : a
      )
    }));
  };

  const updateSvgIcon = (id, field, value) => {
    setThemeData(prev => ({
      ...prev,
      svgIcons: prev.svgIcons.map(i => 
        i.id === id ? { ...i, [field]: value } : i
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading theme settings...</div>
      </div>
    );
  }

  const tabs = [
    { id: 'colors', label: 'Colors', icon: '🎨', count: themeData?.settings?.filter(s => s.category === 'color' || s.category === 'font' || s.category === 'effect' || s.category === 'layout').length || 0 },
    { id: 'typography', label: 'Typography', icon: '🔤', count: themeData?.typography?.length || 0 },
    { id: 'spacing', label: 'Spacing & Layout', icon: '📐', count: themeData?.settings?.filter(s => s.category === 'spacing').length || 0 },
    { id: 'components', label: 'Components', icon: '🧩', count: themeData?.components?.length || 0 },
    { id: 'sections', label: 'Sections', icon: '📄', count: themeData?.sections?.length || 0 },
    { id: 'animations', label: 'Animations', icon: '✨', count: themeData?.animations?.length || 0 },
    { id: 'icons', label: 'SVG Icons', icon: '🖼️', count: themeData?.svgIcons?.length || 0 },
    { id: 'responsive', label: 'Responsive', icon: '📱', count: themeData?.breakpoints?.length || 0 },
  ];

  const colorCategories = {
    color: 'Colors',
    font: 'Fonts',
    spacing: 'Spacing',
    effect: 'Effects',
    layout: 'Layout'
  };

  const groupedSettings = themeData?.settings?.reduce((acc, setting) => {
    if (!acc[setting.category]) acc[setting.category] = [];
    acc[setting.category].push(setting);
    return acc;
  }, {}) || {};

  return (
    <div>
      <div className="admin-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="admin-h1" style={{ marginBottom: 0 }}>Enhanced Theme Settings</h1>
        <button
          onClick={saveTheme}
          disabled={saving}
          className="admin-btn admin-btn-primary"
          style={{ padding: '0.75rem 1.5rem' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-card" style={{ marginBottom: '1rem' }}>
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-btn ${activeTab === tab.id ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700" style={{ minWidth: '20px', textAlign: 'center' }}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="admin-card">
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {Object.entries(groupedSettings).map(([category, settings]) => (
              <div key={category} className="admin-field-group">
                <h3 className="admin-h3 capitalize">
                  {colorCategories[category] || category}
                </h3>
                <div className="admin-grid-3">
                  {settings.filter(s => s.category === category).map(setting => (
                    <div key={setting.key} className="admin-field">
                      <label>{setting.key}</label>
                      <div className="flex gap-2">
                        {setting.data_type === 'color' && (
                          <HexColorPicker
                            color={setting.value}
                            onChange={(color) => updateSetting(category, setting.key, color)}
                            style={{ width: '80px', height: '80px' }}
                          />
                        )}
                        <input
                          type="text"
                          value={setting.value}
                          onChange={(e) => updateSetting(category, setting.key, e.target.value, setting.data_type)}
                          className="flex-1"
                        />
                      </div>
                      {setting.description && (
                        <p className="admin-hint">{setting.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-4">
            {themeData?.typography?.map(font => (
              <div key={font.id} className="admin-field-group">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="admin-h4">{font.font_name}</h4>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={font.is_custom === 1}
                      onChange={(e) => updateTypography(font.id, 'is_custom', e.target.checked ? 1 : 0)}
                    />
                    <span className="text-sm">Custom Font</span>
                  </label>
                </div>
                <div className="admin-grid-3">
                  <div className="admin-field">
                    <label>CSS Variable</label>
                    <input
                      type="text"
                      value={font.css_variable}
                      onChange={(e) => updateTypography(font.id, 'css_variable', e.target.value)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Font Family</label>
                    <input
                      type="text"
                      value={font.font_family}
                      onChange={(e) => updateTypography(font.id, 'font_family', e.target.value)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Font Weight</label>
                    <select
                      value={font.font_weight}
                      onChange={(e) => updateTypography(font.id, 'font_weight', e.target.value)}
                    >
                      <option value="100">100 (Thin)</option>
                      <option value="200">200 (Extra Light)</option>
                      <option value="300">300 (Light)</option>
                      <option value="400">400 (Regular)</option>
                      <option value="500">500 (Medium)</option>
                      <option value="600">600 (Semi Bold)</option>
                      <option value="700">700 (Bold)</option>
                      <option value="800">800 (Extra Bold)</option>
                      <option value="900">900 (Black)</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Font Size</label>
                    <input
                      type="text"
                      value={font.font_size || ''}
                      onChange={(e) => updateTypography(font.id, 'font_size', e.target.value)}
                      placeholder="e.g., 16px"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Line Height</label>
                    <input
                      type="text"
                      value={font.line_height || ''}
                      onChange={(e) => updateTypography(font.id, 'line_height', e.target.value)}
                      placeholder="e.g., 1.5"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Letter Spacing</label>
                    <input
                      type="text"
                      value={font.letter_spacing || ''}
                      onChange={(e) => updateTypography(font.id, 'letter_spacing', e.target.value)}
                      placeholder="e.g., 0.02em"
                    />
                  </div>
                  <div className="admin-field col-span-2">
                    <label>Google Font URL</label>
                    <input
                      type="text"
                      value={font.google_font_url || ''}
                      onChange={(e) => updateTypography(font.id, 'google_font_url', e.target.value)}
                      placeholder="https://fonts.googleapis.com/css2?family=..."
                    />
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded" style={{ border: '1px solid #e5e7eb' }}>
                  <p className="text-sm mb-2 text-gray-600">Preview:</p>
                  <p style={{ 
                    fontFamily: font.font_family, 
                    fontWeight: font.font_weight,
                    fontSize: font.font_size || '16px',
                    lineHeight: font.line_height || '1.5',
                    letterSpacing: font.letter_spacing || 'normal'
                  }}>
                    The quick brown fox jumps over the lazy dog.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'spacing' && (
          <div className="admin-grid-3">
            {themeData?.settings?.filter(s => s.category === 'spacing').map(setting => (
              <div key={setting.key} className="admin-field">
                <label>{setting.key}</label>
                <input
                  type="text"
                  value={setting.value}
                  onChange={(e) => updateSetting('spacing', setting.key, e.target.value, 'size')}
                />
                {setting.description && (
                  <p className="admin-hint">{setting.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'responsive' && (
          <div className="space-y-4">
            {themeData?.breakpoints?.map(bp => (
              <div key={bp.id} className="admin-field-group">
                <h4 className="admin-h4 capitalize">{bp.breakpoint_name}</h4>
                <div className="admin-grid-4">
                  <div className="admin-field">
                    <label>Max Width (px)</label>
                    <input
                      type="number"
                      value={bp.max_width || ''}
                      onChange={(e) => updateBreakpoint(bp.id, 'max_width', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Min Width (px)</label>
                    <input
                      type="number"
                      value={bp.min_width || ''}
                      onChange={(e) => updateBreakpoint(bp.id, 'min_width', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Container Max Width</label>
                    <input
                      type="text"
                      value={bp.container_max_width || ''}
                      onChange={(e) => updateBreakpoint(bp.id, 'container_max_width', e.target.value)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Container Padding</label>
                    <input
                      type="text"
                      value={bp.container_padding || ''}
                      onChange={(e) => updateBreakpoint(bp.id, 'container_padding', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-4">
            {themeData?.components?.map(comp => (
              <div key={comp.id} className="admin-field-group">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="admin-h4">{comp.component_name}</h4>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={comp.is_visible === 1}
                      onChange={(e) => updateComponent(comp.id, 'is_visible', e.target.checked ? 1 : 0)}
                    />
                    <span className="text-sm">Visible</span>
                  </label>
                </div>
                <div className="admin-grid-2">
                  <div className="admin-field">
                    <label>Component Type</label>
                    <select
                      value={comp.component_type}
                      onChange={(e) => updateComponent(comp.id, 'component_type', e.target.value)}
                    >
                      <option value="button">Button</option>
                      <option value="card">Card</option>
                      <option value="section">Section</option>
                      <option value="input">Input</option>
                      <option value="modal">Modal</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>CSS Class</label>
                    <input
                      type="text"
                      value={comp.css_class}
                      onChange={(e) => updateComponent(comp.id, 'css_class', e.target.value)}
                      placeholder=".my-component"
                    />
                  </div>
                </div>
                <div className="admin-field">
                  <label>Styles (JSON)</label>
                  <textarea
                    value={comp.styles || ''}
                    onChange={(e) => updateComponent(comp.id, 'styles', e.target.value)}
                    rows={4}
                    placeholder='{"background": "#fff", "padding": "1rem"}'
                  />
                  <p className="admin-hint">Enter CSS properties as JSON object</p>
                </div>
                <div className="admin-field">
                  <label>HTML Template (optional)</label>
                  <textarea
                    value={comp.html_template || ''}
                    onChange={(e) => updateComponent(comp.id, 'html_template', e.target.value)}
                    rows={2}
 placeholder='<div class="{css_class}">{content}</div>'
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-4">
            {themeData?.sections?.map(section => (
              <div key={section.id} className="admin-field-group">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="admin-h4">{section.section_name}</h4>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={section.is_visible === 1}
                      onChange={(e) => updateSection(section.id, 'is_visible', e.target.checked ? 1 : 0)}
                    />
                    <span className="text-sm">Visible</span>
                  </label>
                </div>
                <div className="admin-grid-3">
                  <div className="admin-field">
                    <label>Section ID</label>
                    <input
                      type="text"
                      value={section.section_id}
                      onChange={(e) => updateSection(section.id, 'section_id', e.target.value)}
                      placeholder="hero"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Background Type</label>
                    <select
                      value={section.background_type}
                      onChange={(e) => updateSection(section.id, 'background_type', e.target.value)}
                    >
                      <option value="color">Color</option>
                      <option value="gradient">Gradient</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Background Value</label>
                    <input
                      type="text"
                      value={section.background_value || ''}
                      onChange={(e) => updateSection(section.id, 'background_value', e.target.value)}
                      placeholder="#ffffff or url(...)"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Background Overlay</label>
                    <input
                      type="text"
                      value={section.background_overlay || ''}
                      onChange={(e) => updateSection(section.id, 'background_overlay', e.target.value)}
                      placeholder="rgba(0,0,0,0.5)"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Padding Top</label>
                    <input
                      type="text"
                      value={section.padding_top}
                      onChange={(e) => updateSection(section.id, 'padding_top', e.target.value)}
                      placeholder="9rem"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Padding Bottom</label>
                    <input
                      type="text"
                      value={section.padding_bottom}
                      onChange={(e) => updateSection(section.id, 'padding_bottom', e.target.value)}
                      placeholder="9rem"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Text Color</label>
                    <input
                      type="text"
                      value={section.text_color || ''}
                      onChange={(e) => updateSection(section.id, 'text_color', e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                <div className="admin-field">
                  <label>Custom CSS</label>
                  <textarea
                    value={section.custom_css || ''}
                    onChange={(e) => updateSection(section.id, 'custom_css', e.target.value)}
                    rows={2}
                    placeholder="Additional CSS rules"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'animations' && (
          <div className="space-y-4">
            {themeData?.animations?.map(anim => (
              <div key={anim.id} className="admin-field-group">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="admin-h4">{anim.animation_name}</h4>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={anim.is_enabled === 1}
                      onChange={(e) => updateAnimation(anim.id, 'is_enabled', e.target.checked ? 1 : 0)}
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                </div>
                <div className="admin-grid-3">
                  <div className="admin-field">
                    <label>CSS Class</label>
                    <input
                      type="text"
                      value={anim.css_class}
                      onChange={(e) => updateAnimation(anim.id, 'css_class', e.target.value)}
                      placeholder=".my-animation"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={anim.duration}
                      onChange={(e) => updateAnimation(anim.id, 'duration', e.target.value)}
                      placeholder="0.3s"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Timing Function</label>
                    <select
                      value={anim.timing_function}
                      onChange={(e) => updateAnimation(anim.id, 'timing_function', e.target.value)}
                    >
                      <option value="ease">ease</option>
                      <option value="linear">linear</option>
                      <option value="ease-in">ease-in</option>
                      <option value="ease-out">ease-out</option>
                      <option value="ease-in-out">ease-in-out</option>
                      <option value="cubic-bezier">cubic-bezier</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Delay</label>
                    <input
                      type="text"
                      value={anim.delay}
                      onChange={(e) => updateAnimation(anim.id, 'delay', e.target.value)}
                      placeholder="0s"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Iteration Count</label>
                    <select
                      value={anim.iteration_count}
                      onChange={(e) => updateAnimation(anim.id, 'iteration_count', e.target.value)}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="infinite">infinite</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Direction</label>
                    <select
                      value={anim.direction}
                      onChange={(e) => updateAnimation(anim.id, 'direction', e.target.value)}
                    >
                      <option value="normal">normal</option>
                      <option value="reverse">reverse</option>
                      <option value="alternate">alternate</option>
                      <option value="alternate-reverse">alternate-reverse</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Fill Mode</label>
                    <select
                      value={anim.fill_mode}
                      onChange={(e) => updateAnimation(anim.id, 'fill_mode', e.target.value)}
                    >
                      <option value="none">none</option>
                      <option value="forwards">forwards</option>
                      <option value="backwards">backwards</option>
                      <option value="both">both</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Play State</label>
                    <select
                      value={anim.play_state}
                      onChange={(e) => updateAnimation(anim.id, 'play_state', e.target.value)}
                    >
                      <option value="running">running</option>
                      <option value="paused">paused</option>
                    </select>
                  </div>
                </div>
                <div className="admin-field">
                  <label>Keyframes</label>
                  <textarea
                    value={anim.keyframes}
                    onChange={(e) => updateAnimation(anim.id, 'keyframes', e.target.value)}
                    rows={4}
                    placeholder="0% { opacity: 0; } 100% { opacity: 1; }"
                  />
                  <p className="admin-hint">CSS keyframes without @keyframes wrapper</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'icons' && (
          <div className="space-y-4">
            {themeData?.svgIcons?.map(icon => (
              <div key={icon.id} className="admin-field-group">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-25 h-25 bg-gray-100 rounded flex items-center justify-center" style={{ border: '1px solid #e5e7eb', width: '100px', height: '100px' }}>
                    <svg
                      viewBox={icon.viewBox}
                      className="w-20 h-20"
                      fill={icon.fill_rule === 'custom' ? icon.custom_fill : (icon.fill_rule === 'currentColor' ? 'currentColor' : 'none')}
                      stroke={icon.stroke_rule === 'custom' ? icon.custom_stroke : (icon.stroke_rule === 'currentColor' ? 'currentColor' : 'none')}
                      strokeWidth={icon.stroke_width}
                      dangerouslySetInnerHTML={{ __html: icon.svg_content }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="admin-h4">{icon.icon_name}</h4>
                    <p className="text-sm text-gray-500">.{icon.icon_class}</p>
                  </div>
                </div>
                <div className="admin-grid-3">
                  <div className="admin-field">
                    <label>Icon Name</label>
                    <input
                      type="text"
                      value={icon.icon_name}
                      onChange={(e) => updateSvgIcon(icon.id, 'icon_name', e.target.value)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>CSS Class</label>
                    <input
                      type="text"
                      value={icon.icon_class}
                      onChange={(e) => updateSvgIcon(icon.id, 'icon_class', e.target.value)}
                    />
                  </div>
                  <div className="admin-field">
                    <label>ViewBox</label>
                    <input
                      type="text"
                      value={icon.viewBox}
                      onChange={(e) => updateSvgIcon(icon.id, 'viewBox', e.target.value)}
                      placeholder="0 0 24 24"
                    />
                  </div>
                  <div className="admin-field">
                    <label>Fill Rule</label>
                    <select
                      value={icon.fill_rule}
                      onChange={(e) => updateSvgIcon(icon.id, 'fill_rule', e.target.value)}
                    >
                      <option value="currentColor">currentColor</option>
                      <option value="none">none</option>
                      <option value="custom">custom</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Custom Fill</label>
                    <input
                      type="text"
                      value={icon.custom_fill || ''}
                      onChange={(e) => updateSvgIcon(icon.id, 'custom_fill', e.target.value)}
                      placeholder="#ffffff"
                      disabled={icon.fill_rule !== 'custom'}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Stroke Rule</label>
                    <select
                      value={icon.stroke_rule}
                      onChange={(e) => updateSvgIcon(icon.id, 'stroke_rule', e.target.value)}
                    >
                      <option value="currentColor">currentColor</option>
                      <option value="none">none</option>
                      <option value="custom">custom</option>
                    </select>
                  </div>
                  <div className="admin-field">
                    <label>Custom Stroke</label>
                    <input
                      type="text"
                      value={icon.custom_stroke || ''}
                      onChange={(e) => updateSvgIcon(icon.id, 'custom_stroke', e.target.value)}
                      placeholder="#000000"
                      disabled={icon.stroke_rule !== 'custom'}
                    />
                  </div>
                  <div className="admin-field">
                    <label>Stroke Width</label>
                    <input
                      type="number"
                      step="0.1"
                      value={icon.stroke_width}
                      onChange={(e) => updateSvgIcon(icon.id, 'stroke_width', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                <div className="admin-field">
                  <label>SVG Content</label>
                  <textarea
                    value={icon.svg_content}
                    onChange={(e) => updateSvgIcon(icon.id, 'svg_content', e.target.value)}
                    rows={3}
 placeholder='<path d="..." />'
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md text-sm z-50 ${
          message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
