import { getPageBySlug } from '@/lib/content';
import SectionRenderer from '@/components/site/SectionRenderer';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateMetadata() {
  const page = await getPageBySlug('home');
  return {
    title: page?.title || 'Zigma Technologies',
    description: 'Engineering Power. Sustaining India\'s Industry.'
  };
}

export default async function HomePage() {
  const page = await getPageBySlug('home');
  if (!page) notFound();

  return <SectionRenderer sections={page.sections} pageThemeId={page.theme_id} />;
}
