import { NextResponse } from 'next/server';
import { getThemeCSS, getActiveThemeId } from '@/lib/themeRenderer';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId') || await getActiveThemeId();
    const pageId = searchParams.get('pageId') || null;

    const css = await getThemeCSS(parseInt(themeId), pageId ? parseInt(pageId) : null);

    return new NextResponse(css, {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'no-cache, no-store, must-revalidate', // No caching for immediate theme changes
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error generating theme CSS:', error);
    return new NextResponse('/* Error generating theme CSS */', {
      status: 500,
      headers: {
        'Content-Type': 'text/css',
      },
    });
  }
}
