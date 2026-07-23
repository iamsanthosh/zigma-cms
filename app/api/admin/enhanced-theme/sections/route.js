import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

// GET /api/admin/enhanced-theme/sections - Get all theme sections
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId') || 1;

    const sections = await query(
      `SELECT * FROM theme_sections WHERE theme_id = ? ORDER BY section_name ASC`,
      [themeId]
    );

    return NextResponse.json(sections || []);

  } catch (error) {
    console.error('Error fetching theme sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

// POST /api/admin/enhanced-theme/sections - Create or update a section
export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { themeId, section_id, section_name, background_type, background_value, background_overlay, padding_top, padding_bottom, text_color, is_visible, custom_css } = body;

    if (!themeId || !section_id || !section_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO theme_sections (theme_id, section_id, section_name, background_type, background_value, background_overlay, padding_top, padding_bottom, text_color, is_visible, custom_css) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE background_type = VALUES(background_type), background_value = VALUES(background_value), background_overlay = VALUES(background_overlay), padding_top = VALUES(padding_top), padding_bottom = VALUES(padding_bottom), text_color = VALUES(text_color), is_visible = VALUES(is_visible), custom_css = VALUES(custom_css)`,
      [themeId, section_id, section_name, background_type || 'color', background_value || null, background_overlay || null, padding_top || '9rem', padding_bottom || '9rem', text_color || null, is_visible !== undefined ? is_visible : 1, custom_css || null]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });

  } catch (error) {
    console.error('Error saving theme section:', error);
    return NextResponse.json({ error: 'Failed to save section' }, { status: 500 });
  }
}

// DELETE /api/admin/enhanced-theme/sections - Delete a section
export async function DELETE(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing section id' }, { status: 400 });
    }

    await query(`DELETE FROM theme_sections WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting theme section:', error);
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
  }
}
