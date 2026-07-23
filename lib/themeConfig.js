/**
 * Comprehensive theme configuration schema
 * Defines all CSS variables that can be configured per theme
 * Based on actual CSS variables used in globals.css
 * Following industry-standard design token methodology
 */

// Theme presets - pre-built color schemes for quick setup
export const THEME_PRESETS = {
  default: {
    name: 'Default Zigma',
    description: 'Original Zigma CMS theme with navy and orange accents',
    colors: {
      '--navy-950': '#0A1628',
      '--navy-900': '#0F1F3D',
      '--navy-850': '#122647',
      '--orange': '#FF6B1A',
      '--orange-dim': '#c9540f',
      '--green': '#12B76A',
      '--green-dim': '#0C8A50',
      '--yellow': '#FFC93C',
      '--cyan': '#00D4FF',
      '--white': '#FFFFFF',
      '--gray-100': '#F4F6F9',
      '--gray-200': '#E7EBF1',
      '--graphite-800': '#1E2530',
      '--graphite-500': '#5B6472',
      '--accent': '#00D4FF',
    }
  },
  modern: {
    name: 'Modern Blue',
    description: 'Clean blue-based theme with professional appearance',
    colors: {
      '--navy-950': '#0F172A',
      '--navy-900': '#1E293B',
      '--navy-850': '#334155',
      '--orange': '#3B82F6',
      '--orange-dim': '#2563EB',
      '--green': '#10B981',
      '--green-dim': '#059669',
      '--yellow': '#F59E0B',
      '--cyan': '#06B6D4',
      '--white': '#FFFFFF',
      '--gray-100': '#F8FAFC',
      '--gray-200': '#E2E8F0',
      '--graphite-800': '#1E293B',
      '--graphite-500': '#64748B',
      '--accent': '#3B82F6',
    }
  },
  nature: {
    name: 'Nature Green',
    description: 'Eco-friendly green theme with earthy tones',
    colors: {
      '--navy-950': '#1A2E1A',
      '--navy-900': '#2D4A2D',
      '--navy-850': '#3D5B3D',
      '--orange': '#22C55E',
      '--orange-dim': '#16A34A',
      '--green': '#84CC16',
      '--green-dim': '#65A30D',
      '--yellow': '#EAB308',
      '--cyan': '#14B8A6',
      '--white': '#FFFFFF',
      '--gray-100': '#F0FDF4',
      '--gray-200': '#DCFCE7',
      '--graphite-800': '#1A2E1A',
      '--graphite-500': '#4B5563',
      '--accent': '#22C55E',
    }
  },
  luxury: {
    name: 'Luxury Gold',
    description: 'Premium gold and black theme for luxury brands',
    colors: {
      '--navy-950': '#0A0A0A',
      '--navy-900': '#1A1A1A',
      '--navy-850': '#2A2A2A',
      '--orange': '#D4AF37',
      '--orange-dim': '#B8960C',
      '--green': '#C0C0C0',
      '--green-dim': '#A8A8A8',
      '--yellow': '#FFD700',
      '--cyan': '#E5E4E2',
      '--white': '#FFFFFF',
      '--gray-100': '#F5F5F5',
      '--gray-200': '#E0E0E0',
      '--graphite-800': '#1A1A1A',
      '--graphite-500': '#757575',
      '--accent': '#D4AF37',
    }
  },
  tech: {
    name: 'Tech Purple',
    description: 'Modern tech theme with purple gradients',
    colors: {
      '--navy-950': '#1E1B4B',
      '--navy-900': '#312E81',
      '--navy-850': '#4338CA',
      '--orange': '#8B5CF6',
      '--orange-dim': '#7C3AED',
      '--green': '#10B981',
      '--green-dim': '#059669',
      '--yellow': '#F59E0B',
      '--cyan': '#06B6D4',
      '--white': '#FFFFFF',
      '--gray-100': '#F5F3FF',
      '--gray-200': '#EDE9FE',
      '--graphite-800': '#1E1B4B',
      '--graphite-500': '#6B7280',
      '--accent': '#8B5CF6',
    }
  },
  minimal: {
    name: 'Minimal Gray',
    description: 'Clean minimalist theme with grayscale palette',
    colors: {
      '--navy-950': '#171717',
      '--navy-900': '#262626',
      '--navy-850': '#404040',
      '--orange': '#525252',
      '--orange-dim': '#404040',
      '--green': '#737373',
      '--green-dim': '#525252',
      '--yellow': '#A3A3A3',
      '--cyan': '#525252',
      '--white': '#FFFFFF',
      '--gray-100': '#FAFAFA',
      '--gray-200': '#E5E5E5',
      '--graphite-800': '#171717',
      '--graphite-500': '#737373',
      '--accent': '#404040',
    }
  }
};

// Color palette generator utilities
export const ColorUtils = {
  // Generate a color palette from a base color
  generatePalette: (baseColor, steps = 5) => {
    return {
      50: lighten(baseColor, 0.9),
      100: lighten(baseColor, 0.8),
      200: lighten(baseColor, 0.6),
      300: lighten(baseColor, 0.4),
      400: lighten(baseColor, 0.2),
      500: baseColor,
      600: darken(baseColor, 0.1),
      700: darken(baseColor, 0.2),
      800: darken(baseColor, 0.3),
      900: darken(baseColor, 0.4),
      950: darken(baseColor, 0.5),
    };
  },

  // Generate color harmonies
  generateHarmony: (baseColor, harmonyType) => {
    const hsl = ColorUtils.hexToHsl(baseColor);
    const harmonies = {
      complementary: [hsl],
      analogous: [
        { h: (hsl.h - 30 + 360) % 360, s: hsl.s, l: hsl.l },
        { h: hsl.h, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l },
      ],
      triadic: [
        { h: hsl.h, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l },
      ],
      splitComplementary: [
        { h: hsl.h, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 150) % 360, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 210) % 360, s: hsl.s, l: hsl.l },
      ],
      tetradic: [
        { h: hsl.h, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l },
        { h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l },
      ],
      monochromatic: [
        { h: hsl.h, s: hsl.s, l: Math.min(100, hsl.l + 40) },
        { h: hsl.h, s: hsl.s, l: Math.min(100, hsl.l + 20) },
        { h: hsl.h, s: hsl.s, l: hsl.l },
        { h: hsl.h, s: hsl.s, l: Math.max(0, hsl.l - 20) },
        { h: hsl.h, s: hsl.s, l: Math.max(0, hsl.l - 40) },
      ],
    };

    return (harmonies[harmonyType] || harmonies.complementary).map(c => ColorUtils.hslToHex(c.h, c.s, c.l));
  },

  // Generate gradient from colors
  generateGradient: (colors, direction = 'to right') => {
    return `linear-gradient(${direction}, ${colors.join(', ')})`;
  },

  // Check color contrast for accessibility (WCAG AA/AAA)
  checkContrast: (foreground, background) => {
    const lum1 = getLuminance(foreground);
    const lum2 = getLuminance(background);
    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    
    return {
      ratio: ratio.toFixed(2),
      aaLarge: ratio >= 3, // 18pt+ or 14pt+ bold
      aa: ratio >= 4.5,
      aaaLarge: ratio >= 4.5,
      aaa: ratio >= 7,
    };
  },

  // Simulate color blindness
  simulateColorBlindness: (hex, type) => {
    const rgb = ColorUtils.hexToRgb(hex);
    if (!rgb) return hex;

    const { r, g, b } = rgb;
    let newR = r, newG = g, newB = b;

    switch (type) {
      case 'protanopia':
        // Red-blind
        newR = 0.567 * r + 0.433 * g;
        newG = 0.558 * r + 0.442 * g;
        newB = 0.242 * g + 0.758 * b;
        break;
      case 'deuteranopia':
        // Green-blind
        newR = 0.625 * r + 0.375 * g;
        newG = 0.7 * r + 0.3 * g;
        newB = 0.3 * g + 0.7 * b;
        break;
      case 'tritanopia':
        // Blue-blind
        newR = 0.95 * r + 0.05 * g;
        newG = 0.433 * g + 0.567 * b;
        newB = 0.475 * g + 0.525 * b;
        break;
      case 'achromatopsia':
        // Complete color blindness
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        newR = newG = newB = gray;
        break;
    }

    return ColorUtils.rgbToHex(
      Math.min(255, Math.round(newR)),
      Math.min(255, Math.round(newG)),
      Math.min(255, Math.round(newB))
    );
  },

  // Convert hex to RGB
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // Convert RGB to hex
  rgbToHex: (r, g, b) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },

  // Convert hex to HSL
  hexToHsl: (hex) => {
    const rgb = ColorUtils.hexToRgb(hex);
    if (!rgb) return { h: 0, s: 0, l: 0 };

    let { r, g, b } = rgb;
    r /= 255; g /= 255; b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  },

  // Convert HSL to hex
  hslToHex: (h, s, l) => {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  },
};

// Helper functions for color manipulation
function getLuminance(hex) {
  const rgb = ColorUtils.hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function lighten(hex, percent) {
  // Simple lighten implementation
  const rgb = ColorUtils.hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 + percent;
  const newRgb = {
    r: Math.min(255, Math.round(rgb.r * factor)),
    g: Math.min(255, Math.round(rgb.g * factor)),
    b: Math.min(255, Math.round(rgb.b * factor))
  };
  
  return ColorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

function darken(hex, percent) {
  // Simple darken implementation
  const rgb = ColorUtils.hexToRgb(hex);
  if (!rgb) return hex;
  
  const factor = 1 - percent;
  const newRgb = {
    r: Math.round(rgb.r * factor),
    g: Math.round(rgb.g * factor),
    b: Math.round(rgb.b * factor)
  };
  
  return ColorUtils.rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

export const THEME_CATEGORIES = {
  colors: {
    label: 'Colors',
    description: 'Color palette for the website',
    variables: [
      // Navy colors (dark backgrounds)
      { key: '--navy-950', label: 'Navy 950 (Darkest)', type: 'color', default: '#0A1628' },
      { key: '--navy-900', label: 'Navy 900', type: 'color', default: '#0F1F3D' },
      { key: '--navy-850', label: 'Navy 850', type: 'color', default: '#122647' },
      
      // Primary brand colors
      { key: '--orange', label: 'Primary Orange', type: 'color', default: '#FF6B1A' },
      { key: '--orange-dim', label: 'Primary Orange Dim', type: 'color', default: '#c9540f' },
      
      // Secondary colors
      { key: '--green', label: 'Green', type: 'color', default: '#12B76A' },
      { key: '--green-dim', label: 'Green Dim', type: 'color', default: '#0C8A50' },
      { key: '--yellow', label: 'Yellow', type: 'color', default: '#FFC93C' },
      { key: '--cyan', label: 'Cyan', type: 'color', default: '#00D4FF' },
      
      // Neutral colors
      { key: '--white', label: 'White', type: 'color', default: '#FFFFFF' },
      { key: '--gray-100', label: 'Gray 100', type: 'color', default: '#F4F6F9' },
      { key: '--gray-200', label: 'Gray 200', type: 'color', default: '#E7EBF1' },
      
      // Graphite colors (text/content)
      { key: '--graphite-800', label: 'Graphite 800 (Dark Text)', type: 'color', default: '#1E2530' },
      { key: '--graphite-500', label: 'Graphite 500 (Medium Text)', type: 'color', default: '#5B6472' },
      
      // Accent color (used for highlights)
      { key: '--accent', label: 'Accent Color', type: 'color', default: '#00D4FF' },
      
      // Dynamic colors (used in specific contexts)
      { key: '--tint-color', label: 'Tint Color (Hero Slides)', type: 'color', default: '#00D4FF' },
      { key: '--tag-pill-hover-color', label: 'Tag Pill Hover Color', type: 'color', default: '#00D4FF' },
      { key: '--tag-pill-color', label: 'Tag Pill Color', type: 'color', default: '#00D4FF' },
    ]
  },
  fonts: {
    label: 'Typography',
    description: 'Font families',
    variables: [
      { key: '--font-display', label: 'Display Font', type: 'font', default: "'Space Grotesk', sans-serif" },
      { key: '--font-body', label: 'Body Font', type: 'font', default: "'Inter', sans-serif" },
      { key: '--font-mono', label: 'Mono Font', type: 'font', default: "'IBM Plex Mono', monospace" },
    ]
  },
  spacing: {
    label: 'Spacing',
    description: 'Section padding and layout spacing',
    variables: [
      { key: '--section-pad', label: 'Section Padding', type: 'select', options: ['5rem', '6rem', '7rem', '8rem', '9rem'], default: '9rem' },
    ]
  },
  effects: {
    label: 'Effects',
    description: 'Animation delays and timing',
    variables: [
      { key: '--ants-delay', label: 'Animation Delay (Why Cards)', type: 'select', options: ['0s', '0.5s', '1s', '1.5s', '2s'], default: '0s' },
    ]
  },
  components: {
    label: 'Components',
    description: 'Component-specific style overrides',
    variables: [
      // Buttons
      { key: '--btn-primary-bg', label: 'Button Primary BG', type: 'color', default: '#FF6B1A' },
      { key: '--btn-primary-text', label: 'Button Primary Text', type: 'color', default: '#FFFFFF' },
      { key: '--btn-primary-hover', label: 'Button Primary Hover', type: 'color', default: '#c9540f' },
      { key: '--btn-secondary-bg', label: 'Button Secondary BG', type: 'color', default: '#12B76A' },
      { key: '--btn-secondary-text', label: 'Button Secondary Text', type: 'color', default: '#FFFFFF' },
      { key: '--btn-secondary-hover', label: 'Button Secondary Hover', type: 'color', default: '#0C8A50' },
      
      // Cards
      { key: '--card-bg', label: 'Card Background', type: 'color', default: '#FFFFFF' },
      { key: '--card-border', label: 'Card Border', type: 'color', default: '#E7EBF1' },
      
      // Navigation
      { key: '--nav-bg', label: 'Navigation Background', type: 'color', default: 'rgba(10,22,40,0.0)' },
      { key: '--nav-scrolled-bg', label: 'Navigation Scrolled BG', type: 'color', default: 'rgba(10,22,40,0.92)' },
      { key: '--nav-link-color', label: 'Navigation Link Color', type: 'color', default: '#D6DDE8' },
      { key: '--nav-link-hover', label: 'Navigation Link Hover', type: 'color', default: '#FFFFFF' },
      
      // Footer
      { key: '--footer-bg', label: 'Footer Background', type: 'color', default: '#0D1421' },
      { key: '--footer-text', label: 'Footer Text', type: 'color', default: '#8FA3C2' },
      { key: '--footer-link', label: 'Footer Link', type: 'color', default: '#8FA3C2' },
      { key: '--footer-link-hover', label: 'Footer Link Hover', type: 'color', default: '#FFFFFF' },
    ]
  },
  admin: {
    label: 'Admin Panel',
    description: 'Admin panel theme settings',
    variables: [
      // Admin Backgrounds
      { key: '--admin-bg', label: 'Admin Background', type: 'color', default: '#F4F6F9' },
      { key: '--admin-sidebar-bg', label: 'Admin Sidebar Background', type: 'color', default: '#0A1628' },
      { key: '--admin-sidebar-text', label: 'Admin Sidebar Text', type: 'color', default: '#D6DDE8' },
      { key: '--admin-sidebar-hover', label: 'Admin Sidebar Hover', type: 'color', default: 'rgba(255,255,255,0.08)' },
      
      // Admin Cards
      { key: '--admin-card-bg', label: 'Admin Card Background', type: 'color', default: '#FFFFFF' },
      { key: '--admin-card-border', label: 'Admin Card Border', type: 'color', default: '#E7EBF1' },
      
      // Admin Text
      { key: '--admin-text-primary', label: 'Admin Text Primary', type: 'color', default: '#1E2530' },
      { key: '--admin-text-secondary', label: 'Admin Text Secondary', type: 'color', default: '#5B6472' },
      { key: '--admin-text-muted', label: 'Admin Text Muted', type: 'color', default: '#8FA3C2' },
      
      // Admin Colors
      { key: '--admin-primary', label: 'Admin Primary Color', type: 'color', default: '#FF6B1A' },
      { key: '--admin-primary-hover', label: 'Admin Primary Hover', type: 'color', default: '#c9540f' },
      { key: '--admin-success', label: 'Admin Success Color', type: 'color', default: '#12B76A' },
      { key: '--admin-success-hover', label: 'Admin Success Hover', type: 'color', default: '#0C8A50' },
      { key: '--admin-danger', label: 'Admin Danger Color', type: 'color', default: '#c0392b' },
      { key: '--admin-danger-hover', label: 'Admin Danger Hover', type: 'color', default: '#a93226' },
      
      // Admin Borders & Inputs
      { key: '--admin-border', label: 'Admin Border Color', type: 'color', default: '#E7EBF1' },
      { key: '--admin-border-hover', label: 'Admin Border Hover', type: 'color', default: '#D1D9E6' },
      { key: '--admin-input-bg', label: 'Admin Input Background', type: 'color', default: '#FFFFFF' },
      { key: '--admin-input-border', label: 'Admin Input Border', type: 'color', default: '#E7EBF1' },
      { key: '--admin-input-focus', label: 'Admin Input Focus Color', type: 'color', default: '#00D4FF' },
      
      // Admin Shadows
      { key: '--admin-shadow-sm', label: 'Admin Shadow Small', type: 'color', default: 'rgba(0,0,0,0.05)' },
      { key: '--admin-shadow-md', label: 'Admin Shadow Medium', type: 'color', default: 'rgba(0,0,0,0.07)' },
      { key: '--admin-shadow-lg', label: 'Admin Shadow Large', type: 'color', default: 'rgba(0,0,0,0.1)' },
      
      // Admin Border Radius
      { key: '--admin-radius-sm', label: 'Admin Radius Small', type: 'select', options: ['2px', '4px', '6px', '8px'], default: '4px' },
      { key: '--admin-radius-md', label: 'Admin Radius Medium', type: 'select', options: ['4px', '6px', '8px', '10px'], default: '6px' },
      { key: '--admin-radius-lg', label: 'Admin Radius Large', type: 'select', options: ['8px', '10px', '12px', '16px'], default: '10px' },
      { key: '--admin-radius-xl', label: 'Admin Radius XL', type: 'select', options: ['12px', '16px', '20px', '24px'], default: '12px' },
    ]
  },
  typography: {
    label: 'Typography System',
    description: 'Advanced typography settings with type scales',
    variables: [
      { key: '--type-base-size', label: 'Base Font Size (px)', type: 'number', default: 16 },
      { key: '--type-scale', label: 'Type Scale', type: 'select', options: ['minor-second', 'major-second', 'minor-third', 'major-third', 'perfect-fourth', 'augmented-fourth', 'perfect-fifth', 'golden'], default: 'major-third' },
      { key: '--line-height-tight', label: 'Line Height Tight', type: 'select', options: ['1.1', '1.2', '1.3'], default: '1.1' },
      { key: '--line-height-normal', label: 'Line Height Normal', type: 'select', options: ['1.4', '1.5', '1.6'], default: '1.5' },
      { key: '--line-height-relaxed', label: 'Line Height Relaxed', type: 'select', options: ['1.7', '1.75', '1.8'], default: '1.75' },
      { key: '--letter-spacing-tight', label: 'Letter Spacing Tight', type: 'select', options: ['-0.05em', '-0.025em', '0'], default: '-0.025em' },
      { key: '--letter-spacing-normal', label: 'Letter Spacing Normal', type: 'select', options: ['0', '0.01em', '0.02em'], default: '0' },
      { key: '--letter-spacing-wide', label: 'Letter Spacing Wide', type: 'select', options: ['0.025em', '0.05em', '0.1em'], default: '0.025em' },
    ]
  },
  spacing: {
    label: 'Spacing System',
    description: '8pt grid-based spacing scale',
    variables: [
      { key: '--spacing-base', label: 'Spacing Base (pt)', type: 'select', options: ['4', '8', '12'], default: '8' },
      { key: '--spacing-unit', label: 'Spacing Unit (px)', type: 'number', default: 8 },
    ]
  },
  animation: {
    label: 'Animation System',
    description: 'Motion and easing functions',
    variables: [
      { key: '--ease-default', label: 'Default Easing', type: 'select', options: ['linear', 'ease', 'easeIn', 'easeOut', 'easeInOut', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic'], default: 'easeInOut' },
      { key: '--duration-fast', label: 'Fast Duration (ms)', type: 'number', default: 75 },
      { key: '--duration-normal', label: 'Normal Duration (ms)', type: 'number', default: 150 },
      { key: '--duration-slow', label: 'Slow Duration (ms)', type: 'number', default: 225 },
      { key: '--duration-slower', label: 'Slower Duration (ms)', type: 'number', default: 300 },
    ]
  },
  components: {
    label: 'Component Variants',
    description: 'Pre-built component style variants',
    variables: [
      // Button Variants
      { key: '--btn-variant-1-bg', label: 'Button Variant 1 BG', type: 'color', default: '#FF6B1A' },
      { key: '--btn-variant-1-text', label: 'Button Variant 1 Text', type: 'color', default: '#FFFFFF' },
      { key: '--btn-variant-1-hover', label: 'Button Variant 1 Hover', type: 'color', default: '#c9540f' },
      { key: '--btn-variant-2-bg', label: 'Button Variant 2 BG', type: 'color', default: '#12B76A' },
      { key: '--btn-variant-2-text', label: 'Button Variant 2 Text', type: 'color', default: '#FFFFFF' },
      { key: '--btn-variant-2-hover', label: 'Button Variant 2 Hover', type: 'color', default: '#0C8A50' },
      { key: '--btn-variant-3-bg', label: 'Button Variant 3 BG', type: 'color', default: '#00D4FF' },
      { key: '--btn-variant-3-text', label: 'Button Variant 3 Text', type: 'color', default: '#FFFFFF' },
      { key: '--btn-variant-3-hover', label: 'Button Variant 3 Hover', type: 'color', default: '#00A3CC' },
      
      // Card Variants
      { key: '--card-variant-1-bg', label: 'Card Variant 1 BG', type: 'color', default: '#FFFFFF' },
      { key: '--card-variant-1-border', label: 'Card Variant 1 Border', type: 'color', default: '#E7EBF1' },
      { key: '--card-variant-2-bg', label: 'Card Variant 2 BG', type: 'color', default: '#F8FAFC' },
      { key: '--card-variant-2-border', label: 'Card Variant 2 Border', type: 'color', default: '#E2E8F0' },
      { key: '--card-variant-3-bg', label: 'Card Variant 3 BG', type: 'color', default: '#0A1628' },
      { key: '--card-variant-3-border', label: 'Card Variant 3 Border', type: 'color', default: '#1E3A5F' },
      
      // Badge Variants
      { key: '--badge-variant-1-bg', label: 'Badge Variant 1 BG', type: 'color', default: '#DCF6E8' },
      { key: '--badge-variant-1-text', label: 'Badge Variant 1 Text', type: 'color', default: '#12B76A' },
      { key: '--badge-variant-2-bg', label: 'Badge Variant 2 BG', type: 'color', default: '#FFF1DA' },
      { key: '--badge-variant-2-text', label: 'Badge Variant 2 Text', type: 'color', default: '#FF6B1A' },
      { key: '--badge-variant-3-bg', label: 'Badge Variant 3 BG', type: 'color', default: '#E3F2FD' },
      { key: '--badge-variant-3-text', label: 'Badge Variant 3 Text', type: 'color', default: '#1976D2' },
    ]
  }
};

export const FONT_OPTIONS = [
  "'Space Grotesk', sans-serif",
  "'Inter', sans-serif",
  "'IBM Plex Mono', monospace",
  "system-ui, -apple-system, sans-serif",
  "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Lato, sans-serif",
  "Montserrat, sans-serif",
  "Poppins, sans-serif",
  "Playfair Display, serif",
  "Merriweather, serif",
  "Georgia, serif",
  "ui-monospace, monospace",
  "Fira Code, monospace",
  "JetBrains Mono, monospace",
];

export function getDefaultThemeSettings() {
  const settings = [];
  Object.entries(THEME_CATEGORIES).forEach(([category, config]) => {
    config.variables.forEach(variable => {
      settings.push({
        key: variable.key,
        value: variable.default,
        category: category
      });
    });
  });
  return settings;
}

// Typography scale system (Major Third - 1.25 ratio)
export const TYPE_SCALES = {
  'minor-second': { ratio: 1.067, name: 'Minor Second' },
  'major-second': { ratio: 1.125, name: 'Major Second' },
  'minor-third': { ratio: 1.2, name: 'Minor Third' },
  'major-third': { ratio: 1.25, name: 'Major Third' },
  'perfect-fourth': { ratio: 1.333, name: 'Perfect Fourth' },
  'augmented-fourth': { ratio: 1.414, name: 'Augmented Fourth' },
  'perfect-fifth': { ratio: 1.5, name: 'Perfect Fifth' },
  'golden': { ratio: 1.618, name: 'Golden Ratio' },
};

export const TypographyUtils = {
  generateTypeScale: (baseSize = 16, scaleType = 'major-third') => {
    const scale = TYPE_SCALES[scaleType]?.ratio || 1.25;
    return {
      xs: baseSize / scale ** 3,
      sm: baseSize / scale ** 2,
      base: baseSize,
      lg: baseSize * scale,
      xl: baseSize * scale ** 2,
      '2xl': baseSize * scale ** 3,
      '3xl': baseSize * scale ** 4,
      '4xl': baseSize * scale ** 5,
      '5xl': baseSize * scale ** 6,
    };
  },

  generateLineHeights: () => {
    return {
      tight: 1.1,
      snug: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    };
  },

  generateLetterSpacing: () => {
    return {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    };
  },
};

// Spacing system (8pt grid)
export const SPACING_SCALES = {
  '4pt': { base: 4, name: '4pt Grid' },
  '8pt': { base: 8, name: '8pt Grid' },
  '12pt': { base: 12, name: '12pt Grid' },
};

export const SpacingUtils = {
  generateSpacing: (scaleType = '8pt') => {
    const base = SPACING_SCALES[scaleType]?.base || 8;
    return {
      0: '0',
      1: `${base / 4}px`,
      2: `${base / 2}px`,
      3: `${base * 0.75}px`,
      4: `${base}px`,
      5: `${base * 1.25}px`,
      6: `${base * 1.5}px`,
      8: `${base * 2}px`,
      10: `${base * 2.5}px`,
      12: `${base * 3}px`,
      16: `${base * 4}px`,
      20: `${base * 5}px`,
      24: `${base * 6}px`,
      32: `${base * 8}px`,
      40: `${base * 10}px`,
      48: `${base * 12}px`,
      56: `${base * 14}px`,
      64: `${base * 16}px`,
    };
  },
};

// Animation/motion system
export const EASING_FUNCTIONS = {
  linear: 'cubic-bezier(0, 0, 1, 1)',
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
  easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
  easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',
  easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const AnimationUtils = {
  generateDurations: (base = 150) => {
    return {
      instant: 0,
      fast: base * 0.5,
      normal: base,
      slow: base * 1.5,
      slower: base * 2,
    };
  },

  generateTransitions: (easing = 'easeInOut', duration = 'normal') => {
    const durations = AnimationUtils.generateDurations();
    const easingFn = EASING_FUNCTIONS[easing] || EASING_FUNCTIONS.easeInOut;
    const durationMs = durations[duration] || durations.normal;
    return `${durationMs}ms ${easingFn}`;
  },
};

// Export utilities for different platforms
export const ExportUtils = {
  toTailwind: (themeSettings) => {
    const tailwindConfig = {
      theme: {
        extend: {
          colors: {},
          fontFamily: {},
          spacing: {},
        }
      }
    };

    Object.entries(themeSettings).forEach(([key, value]) => {
      if (key.startsWith('--')) {
        const cleanKey = key.replace('--', '').replace(/-/g, '.');
        if (key.includes('font')) {
          tailwindConfig.theme.extend.fontFamily[cleanKey.replace('font-', '')] = [value, 'sans-serif'];
        } else if (key.includes('navy') || key.includes('gray') || key.includes('graphite') || key.includes('orange') || key.includes('green') || key.includes('yellow') || key.includes('cyan') || key.includes('white')) {
          tailwindConfig.theme.extend.colors[cleanKey] = value;
        }
      }
    });

    return JSON.stringify(tailwindConfig, null, 2);
  },

  toSCSS: (themeSettings) => {
    let scss = ':root {\n';
    Object.entries(themeSettings).forEach(([key, value]) => {
      scss += `  ${key}: ${value};\n`;
    });
    scss += '}';
    return scss;
  },

  toCSS: (themeSettings) => {
    let css = ':root {\n';
    Object.entries(themeSettings).forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
    css += '}';
    return css;
  },

  toFigma: (themeSettings) => {
    const figmaData = {
      name: 'Zigma Theme',
      description: 'Exported from Zigma CMS',
      variables: Object.entries(themeSettings).map(([key, value]) => ({
        id: key.replace('--', ''),
        name: key.replace('--', '').replace(/-/g, ' '),
        value: value,
        type: key.includes('font') ? 'FONT_FAMILY' : 'COLOR',
      }))
    };
    return JSON.stringify(figmaData, null, 2);
  },
};
