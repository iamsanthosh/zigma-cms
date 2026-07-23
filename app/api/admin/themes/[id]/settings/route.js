import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const themeId = parseInt(id);
    const rows = await query(
      `SELECT * FROM theme_settings WHERE theme_id = ? ORDER BY category, \`key\` ASC`,
      [themeId]
    );
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    return NextResponse.json({ error: 'Failed to fetch theme settings' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const themeId = parseInt(id);
    const body = await request.json();
    const { settings } = body;

    // Delete existing settings for this theme
    await query(`DELETE FROM theme_settings WHERE theme_id = ?`, [themeId]);

    // Insert new settings
    for (const setting of settings) {
      await query(
        `INSERT INTO theme_settings (theme_id, \`key\`, \`value\`, category) VALUES (?, ?, ?, ?)`,
        [themeId, setting.key, setting.value, setting.category || 'color']
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving theme settings:', error);
    return NextResponse.json({ error: 'Failed to save theme settings' }, { status: 500 });
  }
}
