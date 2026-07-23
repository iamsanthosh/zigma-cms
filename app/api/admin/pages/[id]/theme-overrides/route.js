import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;
  const pageId = id;

  try {
    // Get page theme overrides
    const overrides = await query(
      'SELECT * FROM page_theme_overrides WHERE page_id = ? AND is_active = 1',
      [pageId]
    );

    // Get global enhanced theme settings as fallback reference
    const settings = await query(
      'SELECT * FROM theme_settings WHERE theme_id = 1 ORDER BY category, `key`'
    );
    const typography = await query(
      'SELECT * FROM theme_typography WHERE theme_id = 1'
    );
    const breakpoints = await query(
      'SELECT * FROM theme_breakpoints WHERE theme_id = 1'
    );
    const components = await query(
      'SELECT * FROM theme_components WHERE theme_id = 1'
    );
    const sections = await query(
      'SELECT * FROM theme_sections WHERE theme_id = 1'
    );
    const animations = await query(
      'SELECT * FROM theme_animations WHERE theme_id = 1'
    );
    const svgIcons = await query(
      'SELECT * FROM theme_svg_icons WHERE theme_id = 1'
    );

    // Parse override config if exists
    let overrideConfig = {};
    if (overrides.length > 0) {
      overrideConfig = JSON.parse(overrides[0].override_config);
    }

    return NextResponse.json({
      overrides: overrideConfig,
      globalTheme: {
        settings,
        typography,
        breakpoints,
        components,
        sections,
        animations,
        svgIcons
      }
    });
  } catch (error) {
    console.error('Error fetching page theme overrides:', error);
    return NextResponse.json({ error: 'Failed to fetch theme overrides' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { id } = await params;
  const pageId = id;

  try {
    const body = await request.json();
    const { overrides } = body;

    await withTransaction(async ({ query: txQuery }) => {
      // Check if override exists
      const existing = await txQuery(
        'SELECT id FROM page_theme_overrides WHERE page_id = ?',
        [pageId]
      );

      if (existing.length > 0) {
        // Update existing
        await txQuery(
          'UPDATE page_theme_overrides SET override_config = ?, updated_at = CURRENT_TIMESTAMP WHERE page_id = ?',
          [JSON.stringify(overrides), pageId]
        );
      } else {
        // Create new
        await txQuery(
          'INSERT INTO page_theme_overrides (page_id, theme_id, override_config, is_active) VALUES (?, 1, ?, 1)',
          [pageId, JSON.stringify(overrides)]
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving page theme overrides:', error);
    return NextResponse.json({ error: 'Failed to save theme overrides' }, { status: 500 });
  }
}
