'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { THEME_PRESETS, ColorUtils, getDefaultThemeSettings } from './themeConfig';

const ThemeContext = createContext(null);

export function ThemeProvider({ children, initialTheme = null, initialPageTheme = null }) {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [pageTheme, setPageTheme] = useState(initialPageTheme);
  const [themeSettings, setThemeSettings] = useState({});
  const [pageThemeSettings, setPageThemeSettings] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeThemeScope, setActiveThemeScope] = useState('global'); // 'global' or 'page'
  const [themeHistory, setThemeHistory] = useState([]);

  // Load theme settings from database or use defaults
  useEffect(() => {
    async function loadThemeSettings() {
      try {
        const response = await fetch('/api/admin/theme-settings');
        if (response.ok) {
          const settings = await response.json();
          const settingsMap = {};
          settings.forEach(setting => {
            settingsMap[setting.key] = setting.value;
          });
          setThemeSettings(settingsMap);
          applyThemeVariables(settingsMap);
        }
      } catch (error) {
        console.error('Failed to load theme settings:', error);
        // Load default settings
        const defaults = getDefaultThemeSettings();
        const defaultsMap = {};
        defaults.forEach(setting => {
          defaultsMap[setting.key] = setting.value;
        });
        setThemeSettings(defaultsMap);
        applyThemeVariables(defaultsMap);
      } finally {
        setIsLoading(false);
      }
    }

    loadThemeSettings();
  }, []);

  // Apply CSS variables to document
  function applyThemeVariables(settings, scope = 'global') {
    const root = document.documentElement;
    const target = scope === 'page' ? document.body : root;
    
    Object.entries(settings).forEach(([key, value]) => {
      target.style.setProperty(key, value);
    });
  }

  // Update a single theme setting
  async function updateThemeSetting(key, value, category, scope = 'global') {
    try {
      const response = await fetch('/api/admin/theme-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, category, scope })
      });

      if (response.ok) {
        if (scope === 'global') {
          const newSettings = { ...themeSettings, [key]: value };
          setThemeSettings(newSettings);
          applyThemeVariables(newSettings, 'global');
          // Auto-save to history
          saveToHistory(newSettings, 'global');
        } else {
          const newSettings = { ...pageThemeSettings, [key]: value };
          setPageThemeSettings(newSettings);
          applyThemeVariables(newSettings, 'page');
          // Auto-save to history
          saveToHistory(newSettings, 'page');
        }
      }
    } catch (error) {
      console.error('Failed to update theme setting:', error);
    }
  }

  // Save theme snapshot to history
  function saveToHistory(settings, scope, name = null) {
    const snapshot = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      name: name || `Snapshot ${new Date().toLocaleString()}`,
      scope,
      settings: { ...settings },
      isDarkMode,
    };

    setThemeHistory(prev => [snapshot, ...prev].slice(0, 20)); // Keep last 20 snapshots
  }

  // Restore theme from history
  function restoreFromHistory(snapshotId) {
    const snapshot = themeHistory.find(s => s.id === snapshotId);
    if (!snapshot) return;

    if (snapshot.scope === 'global') {
      setThemeSettings(snapshot.settings);
      applyThemeVariables(snapshot.settings, 'global');
      setIsDarkMode(snapshot.isDarkMode);
    } else {
      setPageThemeSettings(snapshot.settings);
      applyThemeVariables(snapshot.settings, 'page');
    }
  }

  // Delete history entry
  function deleteFromHistory(snapshotId) {
    setThemeHistory(prev => prev.filter(s => s.id !== snapshotId));
  }

  // Clear all history
  function clearHistory() {
    setThemeHistory([]);
  }

  // Apply a preset theme
  function applyPreset(presetKey, scope = 'global') {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;

    Object.entries(preset.colors).forEach(([key, value]) => {
      updateThemeSetting(key, value, 'colors', scope);
    });
  }

  // Generate color palette from brand color
  function generateFromBrandColor(baseColor, scope = 'global') {
    const palette = ColorUtils.generatePalette(baseColor);
    
    // Map palette to theme variables
    const colorMapping = {
      '--navy-950': palette[950],
      '--navy-900': palette[900],
      '--navy-850': palette[800],
      '--orange': palette[500],
      '--orange-dim': palette[600],
      '--green': palette[400],
      '--green-dim': palette[500],
      '--accent': palette[500],
    };

    Object.entries(colorMapping).forEach(([key, value]) => {
      updateThemeSetting(key, value, 'colors', scope);
    });
  }

  // Toggle dark mode
  function toggleDarkMode() {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Apply dark mode overrides
    if (newDarkMode) {
      document.documentElement.classList.add('dark-mode');
      // Apply dark mode specific overrides
      const darkOverrides = {
        '--admin-bg': '#1A1A1A',
        '--admin-card-bg': '#2A2A2A',
        '--admin-text-primary': '#FFFFFF',
        '--admin-text-secondary': '#B0B0B0',
        '--admin-card-border': '#3A3A3A',
      };
      Object.entries(darkOverrides).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    } else {
      document.documentElement.classList.remove('dark-mode');
      // Revert to saved theme settings
      applyThemeVariables(themeSettings);
    }
  }

  // Set page-specific theme
  function applyPageThemeSettings(settings) {
    setPageThemeSettings(settings);
    applyThemeVariables(settings, 'page');
    setActiveThemeScope('page');
  }

  // Clear page-specific theme (revert to global)
  function clearPageTheme() {
    setPageThemeSettings({});
    setActiveThemeScope('global');
    // Remove page-specific variables from body
    const body = document.body;
    Object.keys(pageThemeSettings).forEach(key => {
      body.style.removeProperty(key);
    });
  }

  // Export theme configuration
  function exportTheme(scope = 'global') {
    const settingsToExport = scope === 'global' ? themeSettings : pageThemeSettings;
    const exportData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      scope,
      settings: settingsToExport,
      isDarkMode,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zigma-theme-${scope}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // Import theme configuration
  async function importTheme(file, scope = 'global') {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      if (importData.settings) {
        Object.entries(importData.settings).forEach(([key, value]) => {
          updateThemeSetting(key, value, 'colors', scope);
        });
        
        if (importData.isDarkMode !== undefined) {
          setIsDarkMode(importData.isDarkMode);
          if (importData.isDarkMode) {
            toggleDarkMode();
          }
        }
      }
    } catch (error) {
      console.error('Failed to import theme:', error);
      throw new Error('Invalid theme file');
    }
  }

  // Reset to default theme
  function resetToDefault(scope = 'global') {
    const defaults = getDefaultThemeSettings();
    const defaultsMap = {};
    defaults.forEach(setting => {
      defaultsMap[setting.key] = setting.value;
    });
    
    if (scope === 'global') {
      setThemeSettings(defaultsMap);
      applyThemeVariables(defaultsMap, 'global');
    } else {
      setPageThemeSettings(defaultsMap);
      applyThemeVariables(defaultsMap, 'page');
    }
  }

  // Validate theme for accessibility
  function validateAccessibility(scope = 'global') {
    const settingsToCheck = scope === 'global' ? themeSettings : pageThemeSettings;
    const issues = [];
    
    // Check critical color contrasts
    const checks = [
      { fg: settingsToCheck['--admin-text-primary'] || '#1E2530', bg: settingsToCheck['--admin-bg'] || '#F4F6F9', name: 'Admin text on background' },
      { fg: settingsToCheck['--white'] || '#FFFFFF', bg: settingsToCheck['--orange'] || '#FF6B1A', name: 'Button text on primary' },
      { fg: settingsToCheck['--graphite-800'] || '#1E2530', bg: settingsToCheck['--white'] || '#FFFFFF', name: 'Body text on white' },
    ];

    checks.forEach(check => {
      const contrast = ColorUtils.checkContrast(check.fg, check.bg);
      if (!contrast.aa) {
        issues.push({
          type: 'contrast',
          severity: 'error',
          message: `${check.name} fails WCAG AA (ratio: ${contrast.ratio})`,
        });
      } else if (!contrast.aaa) {
        issues.push({
          type: 'contrast',
          severity: 'warning',
          message: `${check.name} fails WCAG AAA (ratio: ${contrast.ratio})`,
        });
      }
    });

    return {
      isValid: issues.filter(i => i.severity === 'error').length === 0,
      issues,
    };
  }

  const value = {
    currentTheme,
    pageTheme,
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
    applyPageThemeSettings,
    clearPageTheme,
    saveToHistory,
    restoreFromHistory,
    deleteFromHistory,
    clearHistory,
    exportTheme,
    importTheme,
    resetToDefault,
    validateAccessibility,
    presets: THEME_PRESETS,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
