import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const rows = await query(
      `SELECT * FROM themes ORDER BY is_default DESC, name ASC`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json({ error: 'Failed to fetch themes' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, slug, description, is_default, is_active } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await query(`UPDATE themes SET is_default = 0`);
    }

    const result = await query(
      `INSERT INTO themes (name, slug, description, is_default, is_active) VALUES (?, ?, ?, ?, ?)`,
      [name, slug, description || null, is_default ? 1 : 0, is_active ? 1 : 0]
    );

    const newTheme = await query(
      `SELECT * FROM themes WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json(newTheme[0], { status: 201 });
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json({ error: 'Failed to create theme' }, { status: 500 });
  }
}
