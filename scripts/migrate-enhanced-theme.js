// ============================================================
// Enhanced Theme System Migration
// This script adds comprehensive theme customization tables
// ============================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    console.log('Starting enhanced theme migration...');

    // Disable foreign key checks temporarily
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Drop existing theme tables to rebuild with enhanced schema
    await connection.execute('DROP TABLE IF EXISTS theme_component_styles');
    await connection.execute('DROP TABLE IF EXISTS theme_media');
    await connection.execute('DROP TABLE IF EXISTS theme_svg_icons');
    await connection.execute('DROP TABLE IF EXISTS theme_sections');
    await connection.execute('DROP TABLE IF EXISTS theme_animations');
    await connection.execute('DROP TABLE IF EXISTS theme_components');
    await connection.execute('DROP TABLE IF EXISTS theme_typography');
    await connection.execute('DROP TABLE IF EXISTS theme_breakpoints');
    await connection.execute('DROP TABLE IF EXISTS theme_presets');
    await connection.execute('DROP TABLE IF EXISTS page_theme_overrides');
    await connection.execute('DROP TABLE IF EXISTS themes');

    console.log('Dropped existing theme tables');

    // Create enhanced themes table
    await connection.execute(`
      CREATE TABLE themes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        slug VARCHAR(120) NOT NULL UNIQUE,
        description VARCHAR(500) NULL,
        preview_image VARCHAR(500) NULL,
        is_default TINYINT(1) NOT NULL DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    // Create comprehensive theme_settings table for CSS variables
    await connection.execute(`
      CREATE TABLE theme_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme_id INT NOT NULL,
        category ENUM('color', 'font', 'spacing', 'effect', 'layout', 'component', 'animation', 'responsive') NOT NULL DEFAULT 'color',
        \`key\` VARCHAR(120) NOT NULL,
        \`value\` VARCHAR(500) NOT NULL,
        data_type ENUM('color', 'font', 'size', 'number', 'boolean', 'url', 'css') NOT NULL DEFAULT 'color',
        selector VARCHAR(255) NULL,
        description VARCHAR(255) NULL,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_theme_key (theme_id, \`key\`)
      ) ENGINE=InnoDB
    `);

    // Create theme_components table for component-level customization
    await connection.execute(`
      CREATE TABLE theme_components (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme_id INT NOT NULL,
        component_type ENUM('header', 'hero', 'nav', 'button', 'card', 'section', 'footer', 'form', 'modal', 'tooltip', 'badge', 'divider', 'other') NOT NULL,
        component_name VARCHAR(120) NOT NULL,
        css_class VARCHAR(120) NOT NULL,
        styles LONGTEXT NOT NULL,
        html_template LONGTEXT NULL,
        is_visible TINYINT(1) NOT NULL DEFAULT 1,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_component (theme_id, component_name)
      ) ENGINE=InnoDB
    `);

    // Create theme_svg_icons table for SVG icon customization
    await connection.execute(`
      CREATE TABLE theme_svg_icons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme_id INT NOT NULL,
        icon_name VARCHAR(120) NOT NULL,
        icon_class VARCHAR(120) NOT NULL,
        svg_content LONGTEXT NOT NULL,
        viewBox VARCHAR(50) DEFAULT '0 0 24 24',
        fill_rule ENUM('currentColor', 'none', 'custom') DEFAULT 'currentColor',
        stroke_rule ENUM('currentColor', 'none', 'custom') DEFAULT 'none',
        stroke_width DECIMAL(3,2) DEFAULT 1.4,
        custom_fill VARCHAR(50) NULL,
        custom_stroke VARCHAR(50) NULL,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_icon (theme_id, icon_name)
      ) ENGINE=InnoDB
    `);

    // Create theme_sections table for section-level customization
    await connection.execute(`
      CREATE TABLE theme_sections (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme_id INT NOT NULL,
        section_id VARCHAR(120) NOT NULL,
        section_name VARCHAR(120) NOT NULL,
        background_type ENUM('color', 'gradient', 'image', 'video') DEFAULT 'color',
        background_value VARCHAR(500) NULL,
        background_overlay VARCHAR(500) NULL,
        padding_top VARCHAR(50) DEFAULT '9rem',
        padding_bottom VARCHAR(50) DEFAULT '9rem',
        text_color VARCHAR(50) NULL,
        is_visible TINYINT(1) NOT NULL DEFAULT 1,
        custom_css LONGTEXT NULL,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_section (theme_id, section_id)
      ) ENGINE=InnoDB
    `);

    // Create theme_animations table for animation customization
    await connection.execute(`
      CREATE TABLE theme_animations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme_id INT NOT NULL,
        animation_name VARCHAR(120) NOT NULL,
        css_class VARCHAR(120) NOT NULL,
        keyframes LONGTEXT NOT NULL,
        duration VARCHAR(50) DEFAULT '0.3s',
        timing_function VARCHAR(50) DEFAULT 'ease',
        delay VARCHAR(50) DEFAULT '0s',
        iteration_count VARCHAR(50) DEFAULT '1',
        direction VARCHAR(50) DEFAULT 'normal',
        fill_mode VARCHAR(50) DEFAULT 'none',
        play_state VARCHAR(50) DEFAULT 'running',
        is_enabled TINYINT(1) NOT NULL DEFAULT 1,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_animation (theme_id, animation_name)
      ) ENGINE=InnoDB
    `);

    // Create theme_media table for media assets
    await connection.execute(`
      CREATE TABLE theme_media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme_id INT NOT NULL,
        media_id INT NULL,
        role ENUM('logo', 'favicon', 'hero-bg', 'section-bg', 'footer-bg', 'icon', 'pattern', 'other') NOT NULL DEFAULT 'other',
        media_url VARCHAR(500) NULL,
        media_type ENUM('image', 'svg', 'video') NOT NULL DEFAULT 'image',
        alt_text VARCHAR(255) NULL,
        \`order\` INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // Create theme_typography table for font management
    await connection.execute(`
      CREATE TABLE theme_typography (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme_id INT NOT NULL,
        font_name VARCHAR(120) NOT NULL,
        css_variable VARCHAR(120) NOT NULL,
        font_family VARCHAR(255) NOT NULL,
        font_weight VARCHAR(50) DEFAULT '400',
        font_size VARCHAR(50) NULL,
        line_height VARCHAR(50) NULL,
        letter_spacing VARCHAR(50) NULL,
        text_transform VARCHAR(50) NULL,
        google_font_url VARCHAR(500) NULL,
        is_custom TINYINT(1) NOT NULL DEFAULT 0,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_font (theme_id, css_variable)
      ) ENGINE=InnoDB
    `);

    // Create theme_breakpoints table for responsive settings
    await connection.execute(`
      CREATE TABLE theme_breakpoints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme_id INT NOT NULL,
        breakpoint_name ENUM('mobile', 'tablet', 'desktop', 'large-desktop', 'ultra-wide') NOT NULL,
        max_width INT NULL,
        min_width INT NULL,
        container_max_width VARCHAR(50) NULL,
        container_padding VARCHAR(50) NULL,
        custom_css LONGTEXT NULL,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_breakpoint (theme_id, breakpoint_name)
      ) ENGINE=InnoDB
    `);

    // Create theme_presets table for quick style presets
    await connection.execute(`
      CREATE TABLE theme_presets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        theme_id INT NOT NULL,
        preset_name VARCHAR(120) NOT NULL,
        preset_type ENUM('color-scheme', 'component-style', 'layout', 'animation') NOT NULL,
        preset_data LONGTEXT NOT NULL,
        is_default TINYINT(1) NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // Create page_theme_overrides table for page-level theme customization
    await connection.execute(`
      CREATE TABLE page_theme_overrides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_id INT NOT NULL,
        theme_id INT NOT NULL,
        override_config JSON NOT NULL,
        is_active TINYINT(1) DEFAULT 1,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (theme_id) REFERENCES themes(id) ON DELETE CASCADE,
        UNIQUE KEY unique_page_theme (page_id, theme_id),
        INDEX idx_page_id (page_id),
        INDEX idx_theme_id (theme_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Created all enhanced theme tables');

    // Insert default theme
    await connection.execute(`
      INSERT INTO themes (name, slug, description, is_default, is_active)
      VALUES ('Zigma Default Theme', 'zigma-default', 'Default theme based on the original Zigma Technologies design', 1, 1)
    `);

    const themeId = 1;

    // Insert default color settings
    const colors = [
      // Primary colors
      { category: 'color', key: '--navy-950', value: '#0A1628', data_type: 'color', description: 'Darkest navy background' },
      { category: 'color', key: '--navy-900', value: '#0F1F3D', data_type: 'color', description: 'Dark navy background' },
      { category: 'color', key: '--navy-850', value: '#122647', data_type: 'color', description: 'Medium navy background' },
      { category: 'color', key: '--orange', value: '#FF6B1A', data_type: 'color', description: 'Primary accent color' },
      { category: 'color', key: '--orange-dim', value: '#c9540f', data_type: 'color', description: 'Darker orange for hover states' },
      { category: 'color', key: '--green', value: '#12B76A', data_type: 'color', description: 'Green accent color' },
      { category: 'color', key: '--green-dim', value: '#0C8A50', data_type: 'color', description: 'Darker green for hover states' },
      { category: 'color', key: '--yellow', value: '#FFC93C', data_type: 'color', description: 'Yellow accent color' },
      { category: 'color', key: '--cyan', value: '#00D4FF', data_type: 'color', description: 'Cyan accent color' },
      { category: 'color', key: '--blue', value: '#3B82F6', data_type: 'color', description: 'Blue accent color' },
      { category: 'color', key: '--purple', value: '#A855F7', data_type: 'color', description: 'Purple accent color' },
      { category: 'color', key: '--white', value: '#FFFFFF', data_type: 'color', description: 'White color' },
      { category: 'color', key: '--gray-100', value: '#F4F6F9', data_type: 'color', description: 'Light gray background' },
      { category: 'color', key: '--gray-200', value: '#E7EBF1', data_type: 'color', description: 'Medium gray border' },
      { category: 'color', key: '--graphite-800', value: '#1E2530', data_type: 'color', description: 'Dark graphite text' },
      { category: 'color', key: '--graphite-500', value: '#5B6472', data_type: 'color', description: 'Medium graphite text' },
    ];

    for (const color of colors) {
      await connection.execute(
        'INSERT INTO theme_settings (theme_id, category, `key`, `value`, data_type, description) VALUES (?, ?, ?, ?, ?, ?)',
        [themeId, color.category, color.key, color.value, color.data_type, color.description]
      );
    }

    // Insert default font settings
    const fonts = [
      { font_name: 'Display Font', css_variable: '--font-display', font_family: "'Space Grotesk', sans-serif", font_weight: '700', google_font_url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap' },
      { font_name: 'Body Font', css_variable: '--font-body', font_family: "'Inter', sans-serif", font_weight: '400', google_font_url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
      { font_name: 'Mono Font', css_variable: '--font-mono', font_family: "'IBM Plex Mono', monospace", font_weight: '500', google_font_url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&display=swap' },
    ];

    for (const font of fonts) {
      await connection.execute(
        'INSERT INTO theme_typography (theme_id, font_name, css_variable, font_family, font_weight, google_font_url) VALUES (?, ?, ?, ?, ?, ?)',
        [themeId, font.font_name, font.css_variable, font.font_family, font.font_weight, font.google_font_url]
      );
    }

    // Insert default spacing settings
    const spacing = [
      { category: 'spacing', key: '--section-pad', value: '9rem', data_type: 'size', description: 'Default section padding' },
      { category: 'spacing', key: '--container-max-width', value: '1600px', data_type: 'size', description: 'Container max width' },
      { category: 'spacing', key: '--container-padding', value: '3rem', data_type: 'size', description: 'Container horizontal padding' },
    ];

    for (const space of spacing) {
      await connection.execute(
        'INSERT INTO theme_settings (theme_id, category, `key`, `value`, data_type, description) VALUES (?, ?, ?, ?, ?, ?)',
        [themeId, space.category, space.key, space.value, space.data_type, space.description]
      );
    }

    // Insert default breakpoints
    const breakpoints = [
      { breakpoint_name: 'mobile', max_width: 760, min_width: null, container_max_width: '100%', container_padding: '1.4rem' },
      { breakpoint_name: 'tablet', max_width: 1080, min_width: null, container_max_width: '100%', container_padding: '2rem' },
      { breakpoint_name: 'desktop', max_width: 1919, min_width: null, container_max_width: '1600px', container_padding: '3rem' },
      { breakpoint_name: 'large-desktop', max_width: null, min_width: 1920, container_max_width: '1840px', container_padding: '4rem' },
    ];

    for (const bp of breakpoints) {
      await connection.execute(
        'INSERT INTO theme_breakpoints (theme_id, breakpoint_name, max_width, min_width, container_max_width, container_padding) VALUES (?, ?, ?, ?, ?, ?)',
        [themeId, bp.breakpoint_name, bp.max_width, bp.min_width, bp.container_max_width, bp.container_padding]
      );
    }

    console.log('Inserted default theme data');

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Enhanced theme migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

migrate().catch(console.error);
