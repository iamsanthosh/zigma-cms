import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

// GET /api/admin/enhanced-theme/animations - Get all theme animations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId') || 1;

    const animations = await query(
      `SELECT * FROM theme_animations WHERE theme_id = ? ORDER BY animation_name ASC`,
      [themeId]
    );

    return NextResponse.json(animations || []);

  } catch (error) {
    console.error('Error fetching theme animations:', error);
    return NextResponse.json({ error: 'Failed to fetch animations' }, { status: 500 });
  }
}

// POST /api/admin/enhanced-theme/animations - Create or update an animation
export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { themeId, animation_name, css_class, keyframes, duration, timing_function, delay, iteration_count, direction, fill_mode, play_state, is_enabled } = body;

    if (!themeId || !animation_name || !css_class || !keyframes) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO theme_animations (theme_id, animation_name, css_class, keyframes, duration, timing_function, delay, iteration_count, direction, fill_mode, play_state, is_enabled) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE keyframes = VALUES(keyframes), duration = VALUES(duration), timing_function = VALUES(timing_function), delay = VALUES(delay), iteration_count = VALUES(iteration_count), direction = VALUES(direction), fill_mode = VALUES(fill_mode), play_state = VALUES(play_state), is_enabled = VALUES(is_enabled)`,
      [themeId, animation_name, css_class, keyframes, duration || '0.3s', timing_function || 'ease', delay || '0s', iteration_count || '1', direction || 'normal', fill_mode || 'none', play_state || 'running', is_enabled !== undefined ? is_enabled : 1]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });

  } catch (error) {
    console.error('Error saving theme animation:', error);
    return NextResponse.json({ error: 'Failed to save animation' }, { status: 500 });
  }
}

// DELETE /api/admin/enhanced-theme/animations - Delete an animation
export async function DELETE(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing animation id' }, { status: 400 });
    }

    await query(`DELETE FROM theme_animations WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting theme animation:', error);
    return NextResponse.json({ error: 'Failed to delete animation' }, { status: 500 });
  }
}
