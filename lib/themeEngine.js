/**
 * Enterprise Theme Engine
 * 
 * A comprehensive theme system supporting:
 * - Multi-level configuration (global, page, section, component)
 * - Design tokens (colors, fonts, spacing, borders, shadows, transitions)
 * - Responsive device-specific settings
 * - Dark/light mode support
 * - Version control and rollback
 * - Live preview
 * - Draft/publish workflow
 */

// ============================================================
// THEME CONFIGURATION DATA STRUCTURE
// ============================================================

export const THEME_CONFIG_STRUCTURE = {
  // Global theme configuration
  global: {
    // Color system
    colors: {
      primary: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
        950: '#172554',
      },
      secondary: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
        950: '#020617',
      },
      accent: {
        50: '#F0F9FF',
        100: '#E0F2FE',
        200: '#BAE6FD',
        300: '#7DD3FC',
        400: '#38BDF8',
        500: '#0EA5E9',
        600: '#0284C7',
        700: '#0369A1',
        800: '#075985',
        900: '#0C4A6E',
        950: '#082F49',
      },
      semantic: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
    },

    // Typography system
    typography: {
      fontFamilies: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      fontWeights: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      lineHeights: {
        none: 1,
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },

    // Spacing system (8pt grid)
    spacing: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
    },

    // Border radius
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },

    // Shadows
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    },

    // Transitions
    transitions: {
      duration: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms',
      },
      easing: {
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },

    // Z-index scale
    zIndex: {
      hide: -1,
      auto: 'auto',
      base: 0,
      docked: 10,
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skipLink: 1600,
      toast: 1700,
      tooltip: 1800,
    },
  },

  // Component-level configurations
  components: {
    button: {
      variants: {
        primary: {
          backgroundColor: 'primary.500',
          color: 'white',
          padding: 'spacing.3 spacing.6',
          borderRadius: 'borderRadius.md',
          fontWeight: 'fontWeights.semibold',
          transition: 'all 0.2s ease-in-out',
          hover: {
            backgroundColor: 'primary.600',
            transform: 'translateY(-1px)',
          },
          active: {
            transform: 'translateY(0)',
          },
        },
        secondary: {
          backgroundColor: 'secondary.100',
          color: 'secondary.700',
          padding: 'spacing.3 spacing.6',
          borderRadius: 'borderRadius.md',
          fontWeight: 'fontWeights.semibold',
          transition: 'all 0.2s ease-in-out',
          hover: {
            backgroundColor: 'secondary.200',
          },
        },
        ghost: {
          backgroundColor: 'transparent',
          color: 'primary.500',
          padding: 'spacing.3 spacing.6',
          borderRadius: 'borderRadius.md',
          fontWeight: 'fontWeights.semibold',
          transition: 'all 0.2s ease-in-out',
          hover: {
            backgroundColor: 'primary.50',
          },
        },
      },
      sizes: {
        sm: {
          padding: 'spacing.2 spacing.4',
          fontSize: 'fontSizes.sm',
        },
        md: {
          padding: 'spacing.3 spacing.6',
          fontSize: 'fontSizes.base',
        },
        lg: {
          padding: 'spacing.4 spacing.8',
          fontSize: 'fontSizes.lg',
        },
      },
    },

    card: {
      backgroundColor: 'white',
      borderRadius: 'borderRadius.lg',
      padding: 'spacing.6',
      boxShadow: 'shadows.md',
      border: '1px solid',
      borderColor: 'secondary.200',
      hover: {
        boxShadow: 'shadows.lg',
        transform: 'translateY(-2px)',
      },
    },

    input: {
      backgroundColor: 'white',
      borderRadius: 'borderRadius.md',
      padding: 'spacing.3 spacing.4',
      border: '1px solid',
      borderColor: 'secondary.300',
      fontSize: 'fontSizes.base',
      transition: 'all 0.2s ease-in-out',
      focus: {
        borderColor: 'primary.500',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      },
      error: {
        borderColor: 'semantic.error',
      },
    },

    modal: {
      backgroundColor: 'white',
      borderRadius: 'borderRadius.xl',
      padding: 'spacing.8',
      boxShadow: 'shadows.xl',
      maxWidth: '600px',
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropBlur: '4px',
      },
    },
  },

  // Layout configurations
  layout: {
    container: {
      maxWidth: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      padding: {
        mobile: 'spacing.4',
        tablet: 'spacing.6',
        desktop: 'spacing.8',
      },
    },
    grid: {
      columns: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        6: 6,
        12: 12,
      },
      gap: {
        sm: 'spacing.4',
        md: 'spacing.6',
        lg: 'spacing.8',
      },
    },
    section: {
      padding: {
        sm: 'spacing.8',
        md: 'spacing.12',
        lg: 'spacing.16',
        xl: 'spacing.24',
      },
    },
  },

  // Animation configurations
  animations: {
    fade: {
      in: {
        keyframes: [
          { opacity: 0 },
          { opacity: 1 },
        ],
        duration: '300ms',
        easing: 'ease-out',
      },
      out: {
        keyframes: [
          { opacity: 1 },
          { opacity: 0 },
        ],
        duration: '200ms',
        easing: 'ease-in',
      },
    },
    slide: {
      up: {
        keyframes: [
          { transform: 'translateY(20px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        duration: '300ms',
        easing: 'ease-out',
      },
      down: {
        keyframes: [
          { transform: 'translateY(-20px)', opacity: 0 },
          { transform: 'translateY(0)', opacity: 1 },
        ],
        duration: '300ms',
        easing: 'ease-out',
      },
    },
    scale: {
      in: {
        keyframes: [
          { transform: 'scale(0.95)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        duration: '200ms',
        easing: 'ease-out',
      },
    },
  },

  // Responsive breakpoints
  breakpoints: {
    mobile: '0px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },

  // Dark mode configuration
  darkMode: {
    enabled: true,
    colors: {
      primary: {
        50: '#1E3A8A',
        100: '#1E40AF',
        200: '#1D4ED8',
        300: '#2563EB',
        400: '#3B82F6',
        500: '#60A5FA',
        600: '#93C5FD',
        700: '#BFDBFE',
        800: '#DBEAFE',
        900: '#EFF6FF',
        950: '#F0F9FF',
      },
      background: {
        primary: '#0F172A',
        secondary: '#1E293B',
        tertiary: '#334155',
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#CBD5E1',
        tertiary: '#94A3B8',
      },
    },
  },
};

// ============================================================
// THEME ENGINE CLASS
// ============================================================

export class ThemeEngine {
  constructor(config = THEME_CONFIG_STRUCTURE) {
    this.config = config;
    this.cache = new Map();
    this.subscribers = new Set();
  }

  /**
   * Get theme configuration for a specific scope
   * @param {string} scope - 'global', 'page', 'section', or 'component'
   * @param {number} id - ID of the page/section/component
   * @returns {Object} Merged theme configuration
   */
  getTheme(scope = 'global', id = null) {
    const cacheKey = `${scope}-${id}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let theme = { ...this.config.global };

    // Merge page-level overrides
    if (scope === 'page' || scope === 'section' || scope === 'component') {
      theme = this.mergeOverrides(theme, 'page', id);
    }

    // Merge section-level overrides
    if (scope === 'section' || scope === 'component') {
      theme = this.mergeOverrides(theme, 'section', id);
    }

    // Merge component-level overrides
    if (scope === 'component') {
      theme = this.mergeOverrides(theme, 'component', id);
    }

    this.cache.set(cacheKey, theme);
    return theme;
  }

  /**
   * Merge overrides into base theme
   * @param {Object} baseTheme - Base theme configuration
   * @param {string} scope - Override scope
   * @param {number} id - ID for the scope
   * @returns {Object} Merged theme
   */
  mergeOverrides(baseTheme, scope, id) {
    // This would fetch from database in production
    // For now, return base theme
    return baseTheme;
  }

  /**
   * Apply theme to DOM as CSS variables
   * @param {Object} theme - Theme configuration
   * @param {HTMLElement} element - Target element (default: document.documentElement)
   */
  applyTheme(theme, element = document.documentElement) {
    // Apply colors
    this.applyColors(theme.colors, element);

    // Apply typography
    this.applyTypography(theme.typography, element);

    // Apply spacing
    this.applySpacing(theme.spacing, element);

    // Apply other tokens
    this.applyTokens(theme, element);

    // Notify subscribers
    this.notifySubscribers(theme);
  }

  /**
   * Apply color tokens as CSS variables
   */
  applyColors(colors, element) {
    Object.entries(colors).forEach(([category, colorSet]) => {
      if (typeof colorSet === 'object' && !colorSet.startsWith) {
        Object.entries(colorSet).forEach(([key, value]) => {
          const varName = `--color-${category}-${key}`;
          element.style.setProperty(varName, value);
        });
      } else {
        const varName = `--color-${category}`;
        element.style.setProperty(varName, colorSet);
      }
    });
  }

  /**
   * Apply typography tokens as CSS variables
   */
  applyTypography(typography, element) {
    Object.entries(typography).forEach(([category, values]) => {
      if (typeof values === 'object') {
        Object.entries(values).forEach(([key, value]) => {
          const varName = `--typography-${category}-${key}`;
          if (Array.isArray(value)) {
            element.style.setProperty(varName, value.join(', '));
          } else {
            element.style.setProperty(varName, value);
          }
        });
      }
    });
  }

  /**
   * Apply spacing tokens as CSS variables
   */
  applySpacing(spacing, element) {
    Object.entries(spacing).forEach(([key, value]) => {
      const varName = `--spacing-${key}`;
      element.style.setProperty(varName, value);
    });
  }

  /**
   * Apply other design tokens as CSS variables
   */
  applyTokens(theme, element) {
    const tokenCategories = ['borderRadius', 'shadows', 'transitions', 'zIndex'];
    
    tokenCategories.forEach(category => {
      if (theme[category]) {
        Object.entries(theme[category]).forEach(([key, value]) => {
          const varName = `--${category}-${key}`;
          element.style.setProperty(varName, value);
        });
      }
    });
  }

  /**
   * Get CSS variable value
   * @param {string} varName - CSS variable name
   * @returns {string} Variable value
   */
  getToken(varName) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }

  /**
   * Set CSS variable value
   * @param {string} varName - CSS variable name
   * @param {string} value - Variable value
   */
  setToken(varName, value) {
    document.documentElement.style.setProperty(varName, value);
    this.notifySubscribers();
  }

  /**
   * Subscribe to theme changes
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers of theme changes
   */
  notifySubscribers(theme) {
    this.subscribers.forEach(callback => callback(theme));
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Export theme as JSON
   * @returns {string} JSON string
   */
  exportTheme() {
    return JSON.stringify(this.config, null, 2);
  }

  /**
   * Import theme from JSON
   * @param {string} json - JSON string
   */
  importTheme(json) {
    try {
      this.config = JSON.parse(json);
      this.clearCache();
      this.applyTheme(this.config.global);
    } catch (error) {
      console.error('Failed to import theme:', error);
      throw new Error('Invalid theme JSON');
    }
  }

  /**
   * Generate CSS from theme configuration
   * @returns {string} CSS string
   */
  generateCSS() {
    let css = ':root {\n';

    // Generate color variables
    Object.entries(this.config.global.colors).forEach(([category, colorSet]) => {
      if (typeof colorSet === 'object' && !colorSet.startsWith) {
        Object.entries(colorSet).forEach(([key, value]) => {
          css += `  --color-${category}-${key}: ${value};\n`;
        });
      } else {
        css += `  --color-${category}: ${colorSet};\n`;
      }
    });

    // Generate other variables
    const tokenCategories = ['spacing', 'borderRadius', 'shadows', 'transitions', 'zIndex'];
    tokenCategories.forEach(category => {
      Object.entries(this.config.global[category]).forEach(([key, value]) => {
        css += `  --${category}-${key}: ${value};\n`;
      });
    });

    css += '}\n';
    return css;
  }
}

// ============================================================
// THEME PRESETS
// ============================================================

export const THEME_PRESETS = {
  enterprise: {
    name: 'Enterprise',
    description: 'Professional enterprise theme',
    config: THEME_CONFIG_STRUCTURE,
  },
  modern: {
    name: 'Modern',
    description: 'Clean modern theme',
    config: {
      ...THEME_CONFIG_STRUCTURE,
      global: {
        ...THEME_CONFIG_STRUCTURE.global,
        colors: {
          ...THEME_CONFIG_STRUCTURE.global.colors,
          primary: {
            500: '#8B5CF6',
            600: '#7C3AED',
          },
        },
      },
    },
  },
  minimal: {
    name: 'Minimal',
    description: 'Minimalist black and white theme',
    config: {
      ...THEME_CONFIG_STRUCTURE,
      global: {
        ...THEME_CONFIG_STRUCTURE.global,
        colors: {
          primary: {
            500: '#000000',
            600: '#000000',
          },
          secondary: {
            500: '#FFFFFF',
            600: '#F5F5F5',
          },
        },
      },
    },
  },
};

// Export singleton instance
export const themeEngine = new ThemeEngine();
