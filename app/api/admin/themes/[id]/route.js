import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const themeId = parseInt(id);
    const rows = await query(
      `SELECT * FROM themes WHERE id = ?`,
      [themeId]
    );
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const themeId = parseInt(id);
    const body = await request.json();
    const { name, slug, description, is_default, is_active } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await query(`UPDATE themes SET is_default = 0 WHERE id != ?`, [themeId]);
    }

    await query(
      `UPDATE themes SET name = ?, slug = ?, description = ?, is_default = ?, is_active = ? WHERE id = ?`,
      [name, slug, description || null, is_default ? 1 : 0, is_active ? 1 : 0, themeId]
    );

    const updatedTheme = await query(
      `SELECT * FROM themes WHERE id = ?`,
      [themeId]
    );

    return NextResponse.json(updatedTheme[0]);
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const themeId = parseInt(id);
    
    // Check if it's the default theme
    const theme = await query(`SELECT * FROM themes WHERE id = ?`, [themeId]);
    if (theme && theme[0] && theme[0].is_default) {
      return NextResponse.json({ error: 'Cannot delete default theme' }, { status: 400 });
    }

    await query(`DELETE FROM themes WHERE id = ?`, [themeId]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json({ error: 'Failed to delete theme' }, { status: 500 });
  }
}
