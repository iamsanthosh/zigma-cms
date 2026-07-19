import Hero from './sections/Hero';
import StatBar from './sections/StatBar';
import WhyGrid from './sections/WhyGrid';
import SplitFeature from './sections/SplitFeature';
import LegacyBand from './sections/LegacyBand';
import ProjectsGrid from './sections/ProjectsGrid';
import Testimonials from './sections/Testimonials';
import IndustriesGrid from './sections/IndustriesGrid';
import PartnersMarquee from './sections/PartnersMarquee';
import CertTeaser from './sections/CertTeaser';
import CtaBand from './sections/CtaBand';
import ProductsGrid from './sections/ProductsGrid';
import RichText from './sections/RichText';

const registry = {
  hero: Hero,
  statBar: StatBar,
  whyGrid: WhyGrid,
  splitFeature: SplitFeature,
  legacyBand: LegacyBand,
  projectsGrid: ProjectsGrid,
  testimonials: Testimonials,
  industriesGrid: IndustriesGrid,
  partnersMarquee: PartnersMarquee,
  certTeaser: CertTeaser,
  ctaBand: CtaBand,
  productsGrid: ProductsGrid,
  richText: RichText
};

/** Renders every visible section of a page in order, skipping any unknown/future type gracefully. */
export default function SectionRenderer({ sections }) {
  return (
    <>
      {(sections || []).map((section) => {
        const Component = registry[section.type];
        if (!Component) return null;
        return (
          <Component
            key={section.id}
            data={{ ...section.data, items: section.items }}
            backgroundStyle={section.background_style}
          />
        );
      })}
    </>
  );
}
