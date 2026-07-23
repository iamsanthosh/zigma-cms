import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const themeId = parseInt(id);
    
    // Unset all defaults
    await query(`UPDATE themes SET is_default = 0`);
    
    // Set new default
    await query(`UPDATE themes SET is_default = 1 WHERE id = ?`, [themeId]);
    
    const updatedTheme = await query(
      `SELECT * FROM themes WHERE id = ?`,
      [themeId]
    );

    return NextResponse.json(updatedTheme[0]);
  } catch (error) {
    console.error('Error setting default theme:', error);
    return NextResponse.json({ error: 'Failed to set default theme' }, { status: 500 });
  }
}
