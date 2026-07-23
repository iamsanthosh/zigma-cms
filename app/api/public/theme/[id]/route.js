import { getThemeById, getThemeSettingsByThemeId, getThemeMedia, getThemeComponentStyles } from '@/lib/content';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const themeId = parseInt(id);
    
    if (!themeId || isNaN(themeId)) {
      return NextResponse.json({ error: 'Invalid theme ID' }, { status: 400 });
    }

    const theme = await getThemeById(themeId);
    if (!theme) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    const [settings, media, componentStyles] = await Promise.all([
      getThemeSettingsByThemeId(themeId),
      getThemeMedia(themeId),
      getThemeComponentStyles(themeId)
    ]);

    return NextResponse.json({
      ...theme,
      settings,
      media,
      componentStyles
    });
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}
