import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

// GET /api/admin/enhanced-theme/breakpoints - Get all theme breakpoints
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId') || 1;

    const breakpoints = await query(
      `SELECT * FROM theme_breakpoints WHERE theme_id = ? ORDER BY breakpoint_name ASC`,
      [themeId]
    );

    return NextResponse.json(breakpoints || []);

  } catch (error) {
    console.error('Error fetching theme breakpoints:', error);
    return NextResponse.json({ error: 'Failed to fetch breakpoints' }, { status: 500 });
  }
}

// POST /api/admin/enhanced-theme/breakpoints - Create or update a breakpoint
export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { themeId, breakpoint_name, max_width, min_width, container_max_width, container_padding, custom_css } = body;

    if (!themeId || !breakpoint_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO theme_breakpoints (theme_id, breakpoint_name, max_width, min_width, container_max_width, container_padding, custom_css) 
       VALUES (?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE max_width = VALUES(max_width), min_width = VALUES(min_width), container_max_width = VALUES(container_max_width), container_padding = VALUES(container_padding), custom_css = VALUES(custom_css)`,
      [themeId, breakpoint_name, max_width || null, min_width || null, container_max_width || null, container_padding || null, custom_css || null]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });

  } catch (error) {
    console.error('Error saving theme breakpoint:', error);
    return NextResponse.json({ error: 'Failed to save breakpoint' }, { status: 500 });
  }
}

// DELETE /api/admin/enhanced-theme/breakpoints - Delete a breakpoint
export async function DELETE(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing breakpoint id' }, { status: 400 });
    }

    await query(`DELETE FROM theme_breakpoints WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting theme breakpoint:', error);
    return NextResponse.json({ error: 'Failed to delete breakpoint' }, { status: 500 });
  }
}
