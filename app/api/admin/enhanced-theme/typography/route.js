import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

// GET /api/admin/enhanced-theme/typography - Get all theme typography
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId') || 1;

    const typography = await query(
      `SELECT * FROM theme_typography WHERE theme_id = ? ORDER BY font_name ASC`,
      [themeId]
    );

    return NextResponse.json(typography || []);

  } catch (error) {
    console.error('Error fetching theme typography:', error);
    return NextResponse.json({ error: 'Failed to fetch typography' }, { status: 500 });
  }
}

// POST /api/admin/enhanced-theme/typography - Create or update typography
export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { themeId, font_name, css_variable, font_family, font_weight, font_size, line_height, letter_spacing, text_transform, google_font_url, is_custom } = body;

    if (!themeId || !font_name || !css_variable || !font_family) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO theme_typography (theme_id, font_name, css_variable, font_family, font_weight, font_size, line_height, letter_spacing, text_transform, google_font_url, is_custom) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE font_family = VALUES(font_family), font_weight = VALUES(font_weight), font_size = VALUES(font_size), line_height = VALUES(line_height), letter_spacing = VALUES(letter_spacing), text_transform = VALUES(text_transform), google_font_url = VALUES(google_font_url), is_custom = VALUES(is_custom)`,
      [themeId, font_name, css_variable, font_family, font_weight || '400', font_size || null, line_height || null, letter_spacing || null, text_transform || null, google_font_url || null, is_custom !== undefined ? is_custom : 0]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });

  } catch (error) {
    console.error('Error saving theme typography:', error);
    return NextResponse.json({ error: 'Failed to save typography' }, { status: 500 });
  }
}

// DELETE /api/admin/enhanced-theme/typography - Delete typography
export async function DELETE(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing typography id' }, { status: 400 });
    }

    await query(`DELETE FROM theme_typography WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting theme typography:', error);
    return NextResponse.json({ error: 'Failed to delete typography' }, { status: 500 });
  }
}
