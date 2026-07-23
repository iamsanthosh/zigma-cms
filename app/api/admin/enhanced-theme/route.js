import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

// GET /api/admin/enhanced-theme - Get complete theme data
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId') || 1;

    // Get theme basic info
    const theme = await query(
      `SELECT * FROM themes WHERE id = ?`,
      [themeId]
    );

    if (!theme.length) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    // Get all theme settings (colors, fonts, spacing, etc.)
    const settings = await query(
      `SELECT * FROM theme_settings WHERE theme_id = ? ORDER BY category ASC, \`key\` ASC`,
      [themeId]
    );

    // Get theme components
    const components = await query(
      `SELECT * FROM theme_components WHERE theme_id = ? ORDER BY component_type ASC, component_name ASC`,
      [themeId]
    );

    // Get theme SVG icons
    const svgIcons = await query(
      `SELECT * FROM theme_svg_icons WHERE theme_id = ? ORDER BY icon_name ASC`,
      [themeId]
    );

    // Get theme sections
    const sections = await query(
      `SELECT * FROM theme_sections WHERE theme_id = ? ORDER BY section_name ASC`,
      [themeId]
    );

    // Get theme animations
    const animations = await query(
      `SELECT * FROM theme_animations WHERE theme_id = ? ORDER BY animation_name ASC`,
      [themeId]
    );

    // Get theme typography
    const typography = await query(
      `SELECT * FROM theme_typography WHERE theme_id = ? ORDER BY font_name ASC`,
      [themeId]
    );

    // Get theme breakpoints
    const breakpoints = await query(
      `SELECT * FROM theme_breakpoints WHERE theme_id = ? ORDER BY breakpoint_name ASC`,
      [themeId]
    );

    // Get theme presets
    const presets = await query(
      `SELECT * FROM theme_presets WHERE theme_id = ? ORDER BY preset_name ASC`,
      [themeId]
    );

    // Get theme media
    const media = await query(
      `SELECT tm.*, ma.url, ma.alt_text, ma.type 
       FROM theme_media tm 
       LEFT JOIN media_assets ma ON tm.media_id = ma.id 
       WHERE tm.theme_id = ? ORDER BY tm.role ASC, tm.order ASC`,
      [themeId]
    );

    return NextResponse.json({
      theme: theme[0],
      settings: settings || [],
      components: components || [],
      svgIcons: svgIcons || [],
      sections: sections || [],
      animations: animations || [],
      typography: typography || [],
      breakpoints: breakpoints || [],
      presets: presets || [],
      media: media || []
    });

  } catch (error) {
    console.error('Error fetching enhanced theme data:', error);
    return NextResponse.json({ error: 'Failed to fetch theme data' }, { status: 500 });
  }
}

// POST /api/admin/enhanced-theme - Update multiple theme settings at once
export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { themeId, updates } = body;

    if (!themeId || !updates) {
      return NextResponse.json({ error: 'Missing themeId or updates' }, { status: 400 });
    }

    // Handle different types of updates
    const results = {};

    if (updates.settings && Array.isArray(updates.settings)) {
      for (const setting of updates.settings) {
        await query(
          `INSERT INTO theme_settings (theme_id, category, \`key\`, \`value\`, data_type, selector, description) 
           VALUES (?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), data_type = VALUES(data_type), selector = VALUES(selector), description = VALUES(description)`,
          [themeId, setting.category, setting.key, setting.value, setting.data_type, setting.selector || null, setting.description || null]
        );
      }
      results.settings = 'updated';
    }

    if (updates.components && Array.isArray(updates.components)) {
      for (const component of updates.components) {
        await query(
          `INSERT INTO theme_components (theme_id, component_type, component_name, css_class, styles, html_template, is_visible) 
           VALUES (?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE component_type = VALUES(component_type), styles = VALUES(styles), html_template = VALUES(html_template), is_visible = VALUES(is_visible)`,
          [themeId, component.component_type, component.component_name, component.css_class, component.styles, component.html_template || null, component.is_visible !== undefined ? component.is_visible : 1]
        );
      }
      results.components = 'updated';
    }

    if (updates.svgIcons && Array.isArray(updates.svgIcons)) {
      for (const icon of updates.svgIcons) {
        await query(
          `INSERT INTO theme_svg_icons (theme_id, icon_name, icon_class, svg_content, viewBox, fill_rule, stroke_rule, stroke_width, custom_fill, custom_stroke) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE svg_content = VALUES(svg_content), viewBox = VALUES(viewBox), fill_rule = VALUES(fill_rule), stroke_rule = VALUES(stroke_rule), stroke_width = VALUES(stroke_width), custom_fill = VALUES(custom_fill), custom_stroke = VALUES(custom_stroke)`,
          [themeId, icon.icon_name, icon.icon_class, icon.svg_content, icon.viewBox || '0 0 24 24', icon.fill_rule || 'currentColor', icon.stroke_rule || 'none', icon.stroke_width || 1.4, icon.custom_fill || null, icon.custom_stroke || null]
        );
      }
      results.svgIcons = 'updated';
    }

    if (updates.sections && Array.isArray(updates.sections)) {
      for (const section of updates.sections) {
        await query(
          `INSERT INTO theme_sections (theme_id, section_id, section_name, background_type, background_value, background_overlay, padding_top, padding_bottom, text_color, is_visible, custom_css) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE background_type = VALUES(background_type), background_value = VALUES(background_value), background_overlay = VALUES(background_overlay), padding_top = VALUES(padding_top), padding_bottom = VALUES(padding_bottom), text_color = VALUES(text_color), is_visible = VALUES(is_visible), custom_css = VALUES(custom_css)`,
          [themeId, section.section_id, section.section_name, section.background_type || 'color', section.background_value || null, section.background_overlay || null, section.padding_top || '9rem', section.padding_bottom || '9rem', section.text_color || null, section.is_visible !== undefined ? section.is_visible : 1, section.custom_css || null]
        );
      }
      results.sections = 'updated';
    }

    if (updates.animations && Array.isArray(updates.animations)) {
      for (const animation of updates.animations) {
        await query(
          `INSERT INTO theme_animations (theme_id, animation_name, css_class, keyframes, duration, timing_function, delay, iteration_count, direction, fill_mode, play_state, is_enabled) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE keyframes = VALUES(keyframes), duration = VALUES(duration), timing_function = VALUES(timing_function), delay = VALUES(delay), iteration_count = VALUES(iteration_count), direction = VALUES(direction), fill_mode = VALUES(fill_mode), play_state = VALUES(play_state), is_enabled = VALUES(is_enabled)`,
          [themeId, animation.animation_name, animation.css_class, animation.keyframes, animation.duration || '0.3s', animation.timing_function || 'ease', animation.delay || '0s', animation.iteration_count || '1', animation.direction || 'normal', animation.fill_mode || 'none', animation.play_state || 'running', animation.is_enabled !== undefined ? animation.is_enabled : 1]
        );
      }
      results.animations = 'updated';
    }

    if (updates.typography && Array.isArray(updates.typography)) {
      for (const font of updates.typography) {
        await query(
          `INSERT INTO theme_typography (theme_id, font_name, css_variable, font_family, font_weight, font_size, line_height, letter_spacing, text_transform, google_font_url, is_custom) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE font_family = VALUES(font_family), font_weight = VALUES(font_weight), font_size = VALUES(font_size), line_height = VALUES(line_height), letter_spacing = VALUES(letter_spacing), text_transform = VALUES(text_transform), google_font_url = VALUES(google_font_url), is_custom = VALUES(is_custom)`,
          [themeId, font.font_name, font.css_variable, font.font_family, font.font_weight || '400', font.font_size || null, font.line_height || null, font.letter_spacing || null, font.text_transform || null, font.google_font_url || null, font.is_custom !== undefined ? font.is_custom : 0]
        );
      }
      results.typography = 'updated';
    }

    if (updates.breakpoints && Array.isArray(updates.breakpoints)) {
      for (const bp of updates.breakpoints) {
        await query(
          `INSERT INTO theme_breakpoints (theme_id, breakpoint_name, max_width, min_width, container_max_width, container_padding, custom_css) 
           VALUES (?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE max_width = VALUES(max_width), min_width = VALUES(min_width), container_max_width = VALUES(container_max_width), container_padding = VALUES(container_padding), custom_css = VALUES(custom_css)`,
          [themeId, bp.breakpoint_name, bp.max_width || null, bp.min_width || null, bp.container_max_width || null, bp.container_padding || null, bp.custom_css || null]
        );
      }
      results.breakpoints = 'updated';
    }

    return NextResponse.json({ success: true, results }, { status: 200 });

  } catch (error) {
    console.error('Error updating enhanced theme:', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}
