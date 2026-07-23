import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

// GET /api/admin/enhanced-theme/svg-icons - Get all SVG icons
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId') || 1;

    const icons = await query(
      `SELECT * FROM theme_svg_icons WHERE theme_id = ? ORDER BY icon_name ASC`,
      [themeId]
    );

    return NextResponse.json(icons || []);

  } catch (error) {
    console.error('Error fetching SVG icons:', error);
    return NextResponse.json({ error: 'Failed to fetch SVG icons' }, { status: 500 });
  }
}

// POST /api/admin/enhanced-theme/svg-icons - Create or update an SVG icon
export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { themeId, icon_name, icon_class, svg_content, viewBox, fill_rule, stroke_rule, stroke_width, custom_fill, custom_stroke } = body;

    if (!themeId || !icon_name || !icon_class || !svg_content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO theme_svg_icons (theme_id, icon_name, icon_class, svg_content, viewBox, fill_rule, stroke_rule, stroke_width, custom_fill, custom_stroke) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE svg_content = VALUES(svg_content), viewBox = VALUES(viewBox), fill_rule = VALUES(fill_rule), stroke_rule = VALUES(stroke_rule), stroke_width = VALUES(stroke_width), custom_fill = VALUES(custom_fill), custom_stroke = VALUES(custom_stroke)`,
      [themeId, icon_name, icon_class, svg_content, viewBox || '0 0 24 24', fill_rule || 'currentColor', stroke_rule || 'none', stroke_width || 1.4, custom_fill || null, custom_stroke || null]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });

  } catch (error) {
    console.error('Error saving SVG icon:', error);
    return NextResponse.json({ error: 'Failed to save SVG icon' }, { status: 500 });
  }
}

// DELETE /api/admin/enhanced-theme/svg-icons - Delete an SVG icon
export async function DELETE(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing icon id' }, { status: 400 });
    }

    await query(`DELETE FROM theme_svg_icons WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting SVG icon:', error);
    return NextResponse.json({ error: 'Failed to delete SVG icon' }, { status: 500 });
  }
}
