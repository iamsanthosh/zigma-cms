import { getPageBySlug, getAllPublishedSlugs } from '@/lib/content';
import SectionRenderer from '@/components/site/SectionRenderer';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.filter((s) => s && s !== 'home').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};
  return { title: page.title };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();
  return <SectionRenderer sections={page.sections} />;
}
