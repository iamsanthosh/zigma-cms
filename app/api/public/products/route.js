import { NextResponse } from 'next/server';
import { getProducts, getItemBySlug } from '@/lib/content';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag') || undefined;
  const slug = searchParams.get('slug');

  if (slug) {
    const item = await getItemBySlug('product', slug);
    if (!item) return NextResponse.json(null, { status: 404 });
    return NextResponse.json({ ...item, _type: 'product' });
  }

  const products = await getProducts({ tag });
  return NextResponse.json(products.map((p) => ({ ...p, _type: 'product' })));
}
