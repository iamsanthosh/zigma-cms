import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

// GET /api/admin/enterprise-theme - Get current theme configuration
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get active theme
    const [theme] = await query(
      `SELECT * FROM themes WHERE is_active = 1 AND is_default = 1 LIMIT 1`
    );

    if (!theme) {
      return NextResponse.json({ error: 'No active theme found' }, { status: 404 });
    }

    // Get all theme colors
    const colors = await query(
      `SELECT * FROM theme_colors WHERE theme_id = ?`,
      [theme.id]
    );

    // Get all theme typography
    const typography = await query(
      `SELECT * FROM theme_typography WHERE theme_id = ?`,
      [theme.id]
    );

    // Get all theme components
    const components = await query(
      `SELECT * FROM theme_components WHERE theme_id = ?`,
      [theme.id]
    );

    // Get all theme layouts
    const layouts = await query(
      `SELECT * FROM theme_layouts WHERE theme_id = ?`,
      [theme.id]
    );

    // Get all theme assets
    const assets = await query(
      `SELECT * FROM theme_assets WHERE theme_id = ?`,
      [theme.id]
    );

    // Get all theme animations
    const animations = await query(
      `SELECT * FROM theme_animations WHERE theme_id = ?`,
      [theme.id]
    );

    // Get theme versions
    const versions = await query(
      `SELECT * FROM theme_versions WHERE theme_id = ? ORDER BY created_at DESC LIMIT 10`,
      [theme.id]
    );

    return NextResponse.json({
      theme,
      colors,
      typography,
      components,
      layouts,
      assets,
      animations,
      versions,
    });
  } catch (error) {
    console.error('Error fetching theme configuration:', error);
    return NextResponse.json({ error: 'Failed to fetch theme configuration' }, { status: 500 });
  }
}

// POST /api/admin/enterprise-theme - Update theme configuration
export async function POST(req) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      theme_id, 
      colors, 
      typography, 
      components, 
      layouts, 
      assets, 
      animations,
      create_version = false,
      version_label,
      publish = false
    } = body;

    if (!theme_id) {
      return NextResponse.json({ error: 'Theme ID is required' }, { status: 400 });
    }

    // Start transaction
    await query('START TRANSACTION');

    try {
      // Update colors
      if (colors && Array.isArray(colors)) {
        for (const color of colors) {
          await query(
            `INSERT INTO theme_colors (theme_id, color_name, color_value, color_category, shade_level, is_dark_mode_variant)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE color_value = VALUES(color_value), color_category = VALUES(color_category)`,
            [theme_id, color.color_name, color.color_value, color.color_category, color.shade_level || null, color.is_dark_mode_variant || 0]
          );
        }
      }

      // Update typography
      if (typography && Array.isArray(typography)) {
        for (const typo of typography) {
          await query(
            `INSERT INTO theme_typography (theme_id, font_family, font_weight, font_size, line_height, letter_spacing, text_transform, text_decoration, font_style, usage_context, responsive_breakpoint)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE font_family = VALUES(font_family), font_weight = VALUES(font_weight), font_size = VALUES(font_size)`,
            [theme_id, typo.font_family, typo.font_weight, typo.font_size, typo.line_height, typo.letter_spacing, typo.text_transform, typo.text_decoration, typo.font_style, typo.usage_context, typo.responsive_breakpoint]
          );
        }
      }

      // Update components
      if (components && Array.isArray(components)) {
        for (const comp of components) {
          await query(
            `INSERT INTO theme_components (theme_id, component_name, component_type, style_config, hover_config, active_config, disabled_config, animation_config, layout_config)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE style_config = VALUES(style_config), hover_config = VALUES(hover_config)`,
            [theme_id, comp.component_name, comp.component_type, JSON.stringify(comp.style_config), JSON.stringify(comp.hover_config || {}), JSON.stringify(comp.active_config || {}), JSON.stringify(comp.disabled_config || {}), JSON.stringify(comp.animation_config || {}), JSON.stringify(comp.layout_config || {})]
          );
        }
      }

      // Update layouts
      if (layouts && Array.isArray(layouts)) {
        for (const layout of layouts) {
          await query(
            `INSERT INTO theme_layouts (theme_id, layout_name, layout_type, container_config, spacing_config, responsive_config, breakpoint_config)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE container_config = VALUES(container_config), spacing_config = VALUES(spacing_config)`,
            [theme_id, layout.layout_name, layout.layout_type, JSON.stringify(layout.container_config || {}), JSON.stringify(layout.spacing_config || {}), JSON.stringify(layout.responsive_config || {}), JSON.stringify(layout.breakpoint_config || {})]
          );
        }
      }

      // Update assets
      if (assets && Array.isArray(assets)) {
        for (const asset of assets) {
          await query(
            `INSERT INTO theme_assets (theme_id, asset_name, asset_type, asset_url, asset_alt, asset_category, usage_context, responsive_variants, optimization_settings)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE asset_url = VALUES(asset_url), asset_alt = VALUES(asset_alt)`,
            [theme_id, asset.asset_name, asset.asset_type, asset.asset_url, asset.asset_alt, asset.asset_category, asset.usage_context, JSON.stringify(asset.responsive_variants || {}), JSON.stringify(asset.optimization_settings || {})]
          );
        }
      }

      // Update animations
      if (animations && Array.isArray(animations)) {
        for (const anim of animations) {
          await query(
            `INSERT INTO theme_animations (theme_id, animation_name, animation_type, duration_ms, easing_function, delay_ms, iteration_count, direction, fill_mode, keyframes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE duration_ms = VALUES(duration_ms), easing_function = VALUES(easing_function)`,
            [theme_id, anim.animation_name, anim.animation_type, anim.duration_ms, anim.easing_function, anim.delay_ms, anim.iteration_count, anim.direction, anim.fill_mode, JSON.stringify(anim.keyframes || {})]
          );
        }
      }

      // Create version if requested
      if (create_version) {
        const versionNumber = `v${Date.now()}`;
        const versionStatus = publish ? 'published' : 'draft';
        await query(
          `INSERT INTO theme_versions (theme_id, version_number, version_label, theme_config, status, created_by)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [theme_id, versionNumber, version_label || `Version ${new Date().toLocaleString()}`, JSON.stringify(body), versionStatus, user?.id || null]
        );

        // If publishing, update theme status
        if (publish) {
          await query(
            `UPDATE themes SET status = 'published' WHERE id = ?`,
            [theme_id]
          );
        }
      }

      await query('COMMIT');

      return NextResponse.json({ success: true, message: publish ? 'Theme published successfully' : 'Theme saved successfully' });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}
