import SectionRenderer from '@/components/site/SectionRenderer';

export const revalidate = 60;

export const metadata = {
  title: 'Products & Services | Zigma Technologies',
  description: 'Solar EPC, industrial UPS, battery solutions, and 24×7 AMC — explore what Zigma builds and maintains.'
};

export default function ProductsServicesPage() {
  const section = {
    id: 'products-services-page',
    type: 'productsGrid',
    background_style: 'light',
    data: {
      eyebrow: 'PRODUCTS & SERVICES',
      heading: 'Everything we build and maintain',
      body: 'From solar EPC to industrial power protection and ongoing AMC — browse the full catalog and click any tile for full specifications.',
      source: 'both',
      columns: 3
    }
  };

  return <SectionRenderer sections={[section]} />;
}
