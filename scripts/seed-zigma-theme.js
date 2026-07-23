/**
 * Seed Default Zigma Theme
 * Extracted from zigma-technologies-website_v03 (1).html
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedZigmaTheme() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('Seeding Default Zigma Theme...');

    // Update theme name
    await connection.execute(
      `UPDATE themes SET name = 'Zigma Default', slug = 'zigma-default', description = 'Default Zigma Technologies theme extracted from original design' WHERE id = 1`
    );

    // Clear existing colors and typography
    await connection.execute(`DELETE FROM theme_colors WHERE theme_id = 1`);
    await connection.execute(`DELETE FROM theme_typography WHERE theme_id = 1`);
    await connection.execute(`DELETE FROM theme_components WHERE theme_id = 1`);
    await connection.execute(`DELETE FROM theme_layouts WHERE theme_id = 1`);

    // Insert Zigma Colors
    const colors = [
      // Navy colors
      { color_name: 'navy-950', color_value: '#0A1628', color_category: 'primary', shade_level: 950 },
      { color_name: 'navy-900', color_value: '#0F1F3D', color_category: 'primary', shade_level: 900 },
      { color_name: 'navy-850', color_value: '#122647', color_category: 'primary', shade_level: 850 },
      
      // Brand colors
      { color_name: 'orange', color_value: '#FF6B1A', color_category: 'brand', shade_level: 500 },
      { color_name: 'orange-dim', color_value: '#c9540f', color_category: 'brand', shade_level: 600 },
      { color_name: 'green', color_value: '#12B76A', color_category: 'brand', shade_level: 500 },
      { color_name: 'green-dim', color_value: '#0C8A50', color_category: 'brand', shade_level: 600 },
      { color_name: 'cyan', color_value: '#00D4FF', color_category: 'brand', shade_level: 500 },
      { color_name: 'blue', color_value: '#3B82F6', color_category: 'brand', shade_level: 500 },
      { color_name: 'purple', color_value: '#A855F7', color_category: 'brand', shade_level: 500 },
      { color_name: 'yellow', color_value: '#FFC93C', color_category: 'brand', shade_level: 500 },
      
      // Neutral colors
      { color_name: 'white', color_value: '#FFFFFF', color_category: 'neutral', shade_level: 50 },
      { color_name: 'gray-100', color_value: '#F4F6F9', color_category: 'neutral', shade_level: 100 },
      { color_name: 'gray-200', color_value: '#E7EBF1', color_category: 'neutral', shade_level: 200 },
      { color_name: 'graphite-800', color_value: '#1E2530', color_category: 'neutral', shade_level: 800 },
      { color_name: 'graphite-500', color_value: '#5B6472', color_category: 'neutral', shade_level: 500 },
      
      // Semantic colors (mapped from brand)
      { color_name: 'primary', color_value: '#FF6B1A', color_category: 'primary', shade_level: 500 },
      { color_name: 'primary-dark', color_value: '#c9540f', color_category: 'primary', shade_level: 600 },
      { color_name: 'secondary', color_value: '#0F1F3D', color_category: 'secondary', shade_level: 500 },
      { color_name: 'accent', color_value: '#00D4FF', color_category: 'accent', shade_level: 500 },
      { color_name: 'success', color_value: '#12B76A', color_category: 'semantic', shade_level: 500 },
      { color_name: 'warning', color_value: '#FFC93C', color_category: 'semantic', shade_level: 500 },
      { color_name: 'error', color_value: '#FF6B1A', color_category: 'semantic', shade_level: 500 },
      { color_name: 'info', color_value: '#3B82F6', color_category: 'semantic', shade_level: 500 },
      
      // Background colors
      { color_name: 'background-primary', color_value: '#FFFFFF', color_category: 'neutral', shade_level: 50 },
      { color_name: 'background-secondary', color_value: '#F4F6F9', color_category: 'neutral', shade_level: 100 },
      { color_name: 'background-tertiary', color_value: '#E7EBF1', color_category: 'neutral', shade_level: 200 },
      { color_name: 'background-dark', color_value: '#0A1628', color_category: 'neutral', shade_level: 950 },
      
      // Text colors
      { color_name: 'text-primary', color_value: '#1E2530', color_category: 'neutral', shade_level: 800 },
      { color_name: 'text-secondary', color_value: '#5B6472', color_category: 'neutral', shade_level: 500 },
      { color_name: 'text-tertiary', color_value: '#8FA3C2', color_category: 'neutral', shade_level: 400 },
      { color_name: 'text-light', color_value: '#FFFFFF', color_category: 'neutral', shade_level: 50 },
      
      // Border colors
      { color_name: 'border-primary', color_value: '#E7EBF1', color_category: 'neutral', shade_level: 200 },
      { color_name: 'border-secondary', color_value: '#F4F6F9', color_category: 'neutral', shade_level: 100 },
    ];

    for (const color of colors) {
      await connection.execute(
        `INSERT INTO theme_colors (theme_id, color_name, color_value, color_category, shade_level) VALUES (?, ?, ?, ?, ?)`,
        [1, color.color_name, color.color_value, color.color_category, color.shade_level]
      );
    }

    console.log(`✓ Inserted ${colors.length} colors`);

    // Insert Zigma Typography
    const typography = [
      // Display font (headings)
      { font_family: 'Space Grotesk, sans-serif', font_weight: 700, font_size: 'clamp(2.4rem,5.2vw,4.2rem)', line_height: '1.08', letter_spacing: '-0.01em', usage_context: 'heading' },
      { font_family: 'Space Grotesk, sans-serif', font_weight: 700, font_size: 'clamp(2rem,3.6vw,2.9rem)', line_height: '1.08', letter_spacing: '-0.01em', usage_context: 'heading' },
      { font_family: 'Space Grotesk, sans-serif', font_weight: 700, font_size: '1.15rem', line_height: '1.08', letter_spacing: '-0.01em', usage_context: 'display' },
      
      // Body font
      { font_family: 'Inter, sans-serif', font_weight: 400, font_size: '1rem', line_height: '1.6', letter_spacing: '0em', usage_context: 'body' },
      { font_family: 'Inter, sans-serif', font_weight: 500, font_size: '1.02rem', line_height: '1.65', letter_spacing: '0em', usage_context: 'body' },
      { font_family: 'Inter, sans-serif', font_weight: 600, font_size: '0.95rem', line_height: '1.6', letter_spacing: '0em', usage_context: 'button' },
      
      // Mono font (eyebrows, labels, code)
      { font_family: 'IBM Plex Mono, monospace', font_weight: 600, font_size: '0.72rem', line_height: '1.4', letter_spacing: '0.14em', text_transform: 'uppercase', usage_context: 'caption' },
      { font_family: 'IBM Plex Mono, monospace', font_weight: 600, font_size: '0.88rem', line_height: '1.4', letter_spacing: '0.02em', usage_context: 'caption' },
      { font_family: 'IBM Plex Mono, monospace', font_weight: 600, font_size: '1.5rem', line_height: '1.4', letter_spacing: '0em', usage_context: 'display' },
      
      // Navigation
      { font_family: 'Inter, sans-serif', font_weight: 500, font_size: '0.92rem', line_height: '1.5', letter_spacing: '0em', usage_context: 'navigation' },
    ];

    for (const typo of typography) {
      await connection.execute(
        `INSERT INTO theme_typography (theme_id, font_family, font_weight, font_size, line_height, letter_spacing, text_transform, usage_context) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [1, typo.font_family, typo.font_weight, typo.font_size, typo.line_height, typo.letter_spacing, typo.text_transform || 'none', typo.usage_context]
      );
    }

    console.log(`✓ Inserted ${typography.length} typography settings`);

    // Insert Component Styles
    const components = [
      {
        component_name: 'button-primary',
        component_type: 'button',
        style_config: {
          backgroundColor: '#FF6B1A',
          color: '#FFFFFF',
          padding: '0.95rem 1.8rem',
          borderRadius: '2px',
          fontWeight: 600,
          fontSize: '0.95rem',
          transition: 'all 0.25s ease'
        },
        hover_config: {
          backgroundColor: '#c9540f',
          transform: 'translateY(-2px)'
        }
      },
      {
        component_name: 'button-green',
        component_type: 'button',
        style_config: {
          backgroundColor: '#12B76A',
          color: '#FFFFFF',
          padding: '0.95rem 1.8rem',
          borderRadius: '2px',
          fontWeight: 600,
          fontSize: '0.95rem',
          transition: 'all 0.25s ease'
        },
        hover_config: {
          backgroundColor: '#0C8A50',
          transform: 'translateY(-2px)'
        }
      },
      {
        component_name: 'button-ghost',
        component_type: 'button',
        style_config: {
          backgroundColor: 'transparent',
          color: '#FFFFFF',
          padding: '0.95rem 1.8rem',
          borderRadius: '2px',
          fontWeight: 600,
          fontSize: '0.95rem',
          border: '1.5px solid rgba(255,255,255,0.3)',
          transition: 'all 0.25s ease'
        },
        hover_config: {
          borderColor: '#FFFFFF',
          backgroundColor: 'rgba(255,255,255,0.06)'
        }
      },
      {
        component_name: 'card',
        component_type: 'card',
        style_config: {
          backgroundColor: '#FFFFFF',
          padding: '2.6rem 2.2rem',
          borderRadius: '10px',
          border: '1px solid #E7EBF1',
          transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s'
        },
        hover_config: {
          transform: 'translateY(-4px)',
          boxShadow: '0 18px 36px rgba(10,22,40,0.09)',
          borderColor: 'transparent'
        }
      },
      {
        component_name: 'hero',
        component_type: 'hero',
        style_config: {
          backgroundColor: '#0A1628',
          minHeight: '640px',
          padding: '9rem 0'
        }
      },
      {
        component_name: 'banner',
        component_type: 'banner',
        style_config: {
          padding: '9rem 0'
        }
      },
    ];

    for (const comp of components) {
      await connection.execute(
        `INSERT INTO theme_components (theme_id, component_name, component_type, style_config, hover_config) VALUES (?, ?, ?, ?, ?)`,
        [1, comp.component_name, comp.component_type, JSON.stringify(comp.style_config), JSON.stringify(comp.hover_config || {})]
      );
    }

    console.log(`✓ Inserted ${components.length} component styles`);

    // Insert Layout Configurations
    const layouts = [
      {
        layout_name: 'container',
        layout_type: 'container',
        container_config: {
          maxWidth: '1600px',
          padding: '0 3rem'
        },
        responsive_config: {
          tablet: { maxWidth: '100%', padding: '0 2rem' },
          mobile: { maxWidth: '100%', padding: '0 1.4rem' }
        }
      },
      {
        layout_name: 'section-padding',
        layout_type: 'section',
        spacing_config: {
          padding: '9rem 0'
        },
        responsive_config: {
          tablet: { padding: '6rem 0' },
          mobile: { padding: '5rem 0' }
        }
      },
      {
        layout_name: 'grid-3',
        layout_type: 'grid',
        container_config: {
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.7rem'
        },
        responsive_config: {
          tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
          mobile: { gridTemplateColumns: '1fr' }
        }
      },
      {
        layout_name: 'grid-4',
        layout_type: 'grid',
        container_config: {
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.6rem'
        },
        responsive_config: {
          tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
          mobile: { gridTemplateColumns: '1fr' }
        }
      },
    ];

    for (const layout of layouts) {
      await connection.execute(
        `INSERT INTO theme_layouts (theme_id, layout_name, layout_type, container_config, spacing_config, responsive_config) VALUES (?, ?, ?, ?, ?, ?)`,
        [1, layout.layout_name, layout.layout_type, JSON.stringify(layout.container_config || {}), JSON.stringify(layout.spacing_config || {}), JSON.stringify(layout.responsive_config || {})]
      );
    }

    console.log(`✓ Inserted ${layouts.length} layout configurations`);

    console.log('✓ Default Zigma Theme seeded successfully!');
  } catch (error) {
    console.error('Error seeding Zigma theme:', error);
  } finally {
    await connection.end();
  }
}

seedZigmaTheme();
