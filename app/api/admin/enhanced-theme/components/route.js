import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionUser, requireRole } from '@/lib/auth';

// GET /api/admin/enhanced-theme/components - Get all theme components
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId') || 1;
    const componentType = searchParams.get('type');

    let queryStr = `SELECT * FROM theme_components WHERE theme_id = ?`;
    const params = [themeId];

    if (componentType) {
      queryStr += ` AND component_type = ?`;
      params.push(componentType);
    }

    queryStr += ` ORDER BY component_type ASC, component_name ASC`;

    const components = await query(queryStr, params);
    return NextResponse.json(components || []);

  } catch (error) {
    console.error('Error fetching theme components:', error);
    return NextResponse.json({ error: 'Failed to fetch components' }, { status: 500 });
  }
}

// POST /api/admin/enhanced-theme/components - Create or update a component
export async function POST(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { themeId, component_type, component_name, css_class, styles, html_template, is_visible } = body;

    if (!themeId || !component_name || !css_class) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO theme_components (theme_id, component_type, component_name, css_class, styles, html_template, is_visible) 
       VALUES (?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE component_type = VALUES(component_type), styles = VALUES(styles), html_template = VALUES(html_template), is_visible = VALUES(is_visible)`,
      [themeId, component_type || 'other', component_name, css_class, styles || '{}', html_template || null, is_visible !== undefined ? is_visible : 1]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });

  } catch (error) {
    console.error('Error saving theme component:', error);
    return NextResponse.json({ error: 'Failed to save component' }, { status: 500 });
  }
}

// DELETE /api/admin/enhanced-theme/components - Delete a component
export async function DELETE(request) {
  try {
    const user = await getSessionUser();
    if (!requireRole(user)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing component id' }, { status: 400 });
    }

    await query(`DELETE FROM theme_components WHERE id = ?`, [id]);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting theme component:', error);
    return NextResponse.json({ error: 'Failed to delete component' }, { status: 500 });
  }
}
