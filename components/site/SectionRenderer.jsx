import Hero from './sections/Hero';
import Ecosystem from './sections/Ecosystem';
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
import Timeline from './sections/Timeline';

const registry = {
  hero: Hero,
  ecosystem: Ecosystem,
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
  richText: RichText,
  timeline: Timeline
};

/** Renders every visible section of a page in order, skipping any unknown/future type gracefully. */
export default function SectionRenderer({ sections }) {
  const aliasMap = {
    projGrid: 'projectsGrid',
    indGrid: 'industriesGrid',
    testimonial: 'testimonials',
    partners: 'partnersMarquee',
    featGrid: 'whyGrid',
    projects: 'projectsGrid',
    industries: 'industriesGrid',
  };

  function normalizeSection(section) {
    const normalizedType = aliasMap[section.type] || section.type;
    const baseData = { ...(section.data || {}), items: section.items || [] };

    // HERO
    if (normalizedType === 'hero') {
      const slides = (baseData.slides || []).map((slide) => ({
        eyebrow: slide.eyebrow || slide.subtitle || slide.tag_label || undefined,
        headline: slide.headline || slide.title || undefined,
        lead: slide.lead || slide.description || undefined,
        ctaLabel: slide.ctaLabel || slide.cta_label || undefined,
        ctaUrl: slide.ctaUrl || slide.cta_url || undefined,
        tagPillColor: slide.tagPillColor || baseData.tagPillHoverColor || baseData.tagPillColor || undefined,
        backgroundImage: slide.backgroundImage || (slide.image_url ? { url: slide.image_url, alt: slide.image_alt || slide.title || '' } : undefined),
        backgroundVideo: slide.backgroundVideo || slide.video || null,
        overlayOpacity: slide.overlayOpacity ?? slide.overlay_opacity ?? undefined,
        tags: (slide.tags && slide.tags.length) ? slide.tags.map(t => (typeof t === 'string' ? { label: t } : { label: t.label || t })) : (slide.tag_label ? [{ label: slide.tag_label }] : [])
      }));
      return { ...baseData, slides };
    }

    // STAT BAR
    if (normalizedType === 'statBar') {
      const statsSrc = baseData.stats || baseData.items || [];
      const stats = (statsSrc || []).map((s) => {
        const numeral = s.numeral || s.value || s.count || '';
        // extract digits and suffix
        const m = /^([\d,\.]+)\s*(.*)$/.exec(String(numeral));
        const value = m ? m[1] : numeral;
        const suffix = m && m[2] ? m[2] : '';
        return { value, suffix: suffix || s.suffix || '', label: s.label || s.title || s.name || '', iconSvgPath: s.iconSvgPath || s.icon || undefined };
      });
      return { ...baseData, stats };
    }

    // SPLIT FEATURE
    if (normalizedType === 'splitFeature') {
      const features = (baseData.features || baseData.cards || baseData.items || []).map((f) => ({
        title: f.title || f.name || f.label || '',
        description: f.description || f.body || '',
        iconSvgPath: f.iconSvgPath || f.icon || undefined
      }));
      const image = baseData.image || (baseData.image_url ? { url: baseData.image_url, alt: baseData.image_alt || '' } : undefined);
      return {
        ...baseData,
        heading: baseData.title || baseData.heading || baseData.subtitle || '',
        body: baseData.description || baseData.body || '',
        eyebrow: baseData.eyebrow || baseData.eyebrowText || '',
        features,
        image
      };
    }

    // WHY GRID / FEATURE GRID
    if (normalizedType === 'whyGrid' || normalizedType === 'featGrid') {
      const cards = (baseData.cards || baseData.items || []).map((c) => ({
        ...c,
        iconSvgPath: c.iconSvgPath || c.icon || undefined
      }));
      return {
        ...baseData,
        heading: baseData.title || baseData.heading || baseData.subtitle || '',
        body: baseData.description || baseData.body || '',
        eyebrow: baseData.eyebrow || '',
        cards
      };
    }

    // PROJECTS GRID
    if (normalizedType === 'projectsGrid' || normalizedType === 'projGrid') {
      const projectsSrc = baseData.cards || baseData.projects || baseData.items || [];
      const projects = projectsSrc.map((p) => {
        const src = p?.data || p || {};
        return {
          title: src.title || src.name || p.title || p.name || '',
          description: src.description || src.body || p.description || p.body || '',
          stat: src.stat || p.stat || '',
          image: src.image || (src.image_url ? { url: src.image_url, alt: src.image_alt || '' } : p.image || (p.image_url ? { url: p.image_url, alt: p.image_alt || '' } : undefined)),
          url: src.link_url || src.link || src.url || p.link_url || p.link || p.url || '#'
        };
      });
      return {
        ...baseData,
        heading: baseData.title || baseData.heading || baseData.subtitle || '',
        projects
      };
    }

    // INDUSTRIES GRID
    if (normalizedType === 'industriesGrid' || normalizedType === 'indGrid') {
      // Data can be in items (from seed) or industries (from admin)
      const itemsSrc = baseData.items || baseData.industries || baseData.cards || [];
      const items = itemsSrc.map((i) => {
        const src = i?.data || i || {};
        return {
          ...src,
          iconSvgPath: src.iconSvgPath || src.icon || i.icon || undefined,
          name: src.name || src.title || i.name || i.title || ''
        };
      });
      return { ...baseData, industries: items };
    }

    // CERT TEASER
    if (normalizedType === 'certTeaser') {
      return {
        ...baseData,
        heading: baseData.title || baseData.heading || '',
        eyebrow: baseData.eyebrow || '',
        body: baseData.subtitle || baseData.body || baseData.description || '',
        ctaLabel: baseData.ctaLabel || baseData.cta_label || baseData.cta || undefined,
        ctaUrl: baseData.ctaUrl || baseData.cta_url || baseData.cta_url || undefined
      };
    }

    // TESTIMONIALS
    if (normalizedType === 'testimonials' || normalizedType === 'testimonial') {
      const slides = baseData.slides || baseData.items || [];
      return { ...baseData, items: slides };
    }

    // PARTNERS
    if (normalizedType === 'partnersMarquee' || normalizedType === 'partners') {
      // Data can be in companies, logos, items, or cards
      const companiesSrc = baseData.companies || baseData.logos || baseData.items || baseData.cards || [];
      // If data.logos already has the right structure, use them directly; otherwise wrap items
      let logos = companiesSrc;
      if (companiesSrc.length && !companiesSrc[0]?.logo && !companiesSrc[0]?.logo_url) {
        // Items don't have logo/logo_url, might need mapping
        logos = companiesSrc.map((c) => ({
          ...c,
          logo: { url: c.logo || c.logo_url || undefined }
        }));
      } else if (companiesSrc.length && companiesSrc[0]?.logo_url && !companiesSrc[0]?.logo) {
        // Have logo_url but not logo object
        logos = companiesSrc.map((c) => ({
          ...c,
          logo: { url: c.logo_url || undefined }
        }));
      } else {
        // Already have logo object or logo property
        logos = companiesSrc.map((c) => ({
          ...c,
          logo: c.logo || (c.logo_url ? { url: c.logo_url } : undefined)
        }));
      }
      return { ...baseData, logos, heading: baseData.title || baseData.heading || '', eyebrow: baseData.eyebrow || '' };
    }

    // TIMELINE
    if (normalizedType === 'timeline') {
      return {
        ...baseData,
        heading: baseData.title || baseData.heading || '',
        body: baseData.description || baseData.body || '',
        eyebrow: baseData.eyebrow || '',
        items: baseData.items || []
      };
    }

    // CTA BAND
    if (normalizedType === 'ctaBand') {
      return {
        ...baseData,
        heading: baseData.title || baseData.heading || '',
        body: baseData.subtitle || baseData.body || baseData.description || '',
        primaryCtaLabel: baseData.cta_primary?.label || undefined,
        primaryCtaUrl: baseData.cta_primary?.url || undefined,
        secondaryCtaLabel: baseData.cta_secondary?.label || undefined,
        secondaryCtaUrl: baseData.cta_secondary?.url || undefined,
        tertiaryCtaLabel: baseData.cta_tertiary?.label || undefined,
        tertiaryCtaUrl: baseData.cta_tertiary?.url || undefined
      };
    }

    // DEFAULT
    return baseData;
  }

  return (
    <>
      {(sections || []).map((section, sectionIndex) => {
        const normalizedType = aliasMap[section.type] || section.type;
        const Component = registry[normalizedType];
        if (!Component) return null;
        const data = normalizeSection(section);
        return (
          <Component
            key={section.id}
            data={data}
            backgroundStyle={section.background_style}
          />
        );
      })}
    </>
  );
}
