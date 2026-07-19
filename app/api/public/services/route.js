import { NextResponse } from 'next/server';
import { getServices, getItemBySlug } from '@/lib/content';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag') || undefined;
  const slug = searchParams.get('slug');

  if (slug) {
    const item = await getItemBySlug('service', slug);
    if (!item) return NextResponse.json(null, { status: 404 });
    return NextResponse.json({ ...item, _type: 'service' });
  }

  const services = await getServices({ tag });
  return NextResponse.json(services.map((s) => ({ ...s, _type: 'service' })));
}
