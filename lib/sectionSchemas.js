// Every section `type` maps to a field schema here, matched 1:1 to the
// actual sections in the Zigma static template (hero slider, stat bar,
// why-grid, 5x split-feature bands, legacy timeline, projects, industries,
// testimonials, partners marquee, cert teaser, cta band, footer). The
// admin's DynamicForm reads this to render the right inputs; the public
// SectionRenderer maps `type` to the matching React component.

export const sectionSchemas = {
  header: {
    label: 'Header / Top Bar',
    fields: [
      { name: 'logoText', label: 'Logo text', type: 'text' },
      { name: 'logoSubtext', label: 'Logo subtext', type: 'text' },
      { name: 'ctaLabel', label: 'Header CTA label', type: 'text' },
      { name: 'ctaUrl', label: 'Header CTA link', type: 'url' }
      // Nav links live in the `menus` / `menu-items` resources.
    ]
  },

  hero: {
    label: 'Hero Slider',
    fields: [
      {
        name: 'slides',
        label: 'Slides',
        type: 'repeater',
        fields: [
          { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
          { name: 'headline', label: 'Headline (H1)', type: 'text' },
          { name: 'lead', label: 'Lead paragraph', type: 'textarea' },
          { name: 'ctaLabel', label: 'CTA label', type: 'text' },
          { name: 'ctaUrl', label: 'CTA link', type: 'url' },
          { name: 'tagPillColor', label: 'Tag pill color', type: 'color', help: 'Color for tag pill text on hover for this slide' },
          { name: 'backgroundImage', label: 'Background image', type: 'image' },
          { name: 'backgroundVideo', label: 'Background video (optional)', type: 'video' },
          { name: 'overlayOpacity', label: 'Overlay opacity (0-1)', type: 'number' },
          {
            name: 'tags',
            label: 'Capability tag pills (this slide)',
            type: 'repeater',
            fields: [{ name: 'label', label: 'Label', type: 'text' }]
          }
        ]
      },
      { name: 'autoplaySeconds', label: 'Autoplay interval (seconds)', type: 'number' }
    ]
  },

  ecosystem: {
    label: 'Engineering Ecosystem',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Body copy', type: 'textarea' },
      {
        name: 'capabilities',
        label: 'Capability checklist',
        type: 'repeater',
        fields: [
          { name: 'label', label: 'Label', type: 'text' },
          { name: 'color', label: 'Color (orange/green/cyan)', type: 'text' }
        ]
      },
      { name: 'badgeText', label: 'Badge text (e.g., ISO-ALIGNED PROCESS)', type: 'text' },
      { name: 'badgeLabel', label: 'Badge label', type: 'text' },
      { name: 'ctaLabel', label: 'CTA label', type: 'text' },
      { name: 'ctaUrl', label: 'CTA link', type: 'url' }
    ]
  },

  statBar: {
    label: 'Animated Stat Counter Bar',
    fields: [
      {
        name: 'stats',
        label: 'Stats',
        type: 'repeater',
        fields: [
          { name: 'value', label: 'Target number', type: 'number' },
          { name: 'suffix', label: 'Suffix (e.g. +, %+, MW)', type: 'text' },
          { name: 'label', label: 'Label', type: 'text' },
          { name: 'iconSvgPath', label: 'Icon SVG path data (optional)', type: 'text' }
        ]
      }
    ]
  },

  whyGrid: {
    label: 'Why Us — Icon Card Grid',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Intro copy', type: 'textarea' },
      {
        name: 'cards',
        label: 'Cards',
        type: 'repeater',
        fields: [
          { name: 'index', label: 'Index number (e.g. 01)', type: 'text' },
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' }
        ]
      }
    ]
  },

  splitFeature: {
    label: 'Split Feature Band (image + 4-card feature grid)',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'eyebrowColor', label: 'Eyebrow color', type: 'color' },
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Body copy', type: 'richtext' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'video', label: 'Supporting video (optional)', type: 'video' },
      { name: 'imagePosition', label: 'Image position', type: 'text' }, // 'left' | 'right'
      {
        name: 'features',
        label: 'Feature cards',
        type: 'repeater',
        fields: [
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'iconSvgPath', label: 'Icon SVG path data (optional)', type: 'text' }
        ]
      },
      { name: 'ctaLabel', label: 'CTA label', type: 'text' },
      { name: 'ctaUrl', label: 'CTA link', type: 'url' },
      { name: 'ctaStyle', label: 'CTA style (primary | ghost-dark)', type: 'text' }
    ]
  },

  legacyBand: {
    label: 'Dark Legacy / Milestone Timeline',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'ctaLabel', label: 'CTA label', type: 'text' },
      { name: 'ctaUrl', label: 'CTA link', type: 'url' },
      {
        name: 'milestones',
        label: 'Milestones / timeline',
        type: 'repeater',
        fields: [
          { name: 'year', label: 'Year / label', type: 'text' },
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'isCurrent', label: 'Highlight as "current" milestone', type: 'boolean' }
        ]
      }
    ]
  },

  projectsGrid: {
    label: 'Featured Projects Grid',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'ctaLabel', label: 'Bottom CTA label', type: 'text' },
      { name: 'ctaUrl', label: 'Bottom CTA link', type: 'url' },
      {
        name: 'projects',
        label: 'Project cards',
        type: 'repeater',
        fields: [
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'stat', label: 'Highlight stat line', type: 'text' },
          { name: 'description', label: 'Description', type: 'textarea' },
          { name: 'image', label: 'Image', type: 'image' },
          { name: 'url', label: 'Case study link', type: 'url' }
        ]
      }
    ]
  },

  industriesGrid: {
    label: 'Industries We Serve Grid',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'heading', label: 'Heading', type: 'text' },
      {
        name: 'industries',
        label: 'Industry items',
        type: 'repeater',
        fields: [
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'iconSvgPath', label: 'Icon SVG path data (optional)', type: 'text' }
        ]
      }
    ]
  },

  testimonials: {
    label: 'Testimonial Carousel',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'heading', label: 'Heading', type: 'text' },
      {
        name: 'items',
        label: 'Testimonials',
        type: 'repeater',
        fields: [
          { name: 'quote', label: 'Quote', type: 'textarea' },
          { name: 'name', label: 'Name', type: 'text' },
          { name: 'role', label: 'Role / company', type: 'text' },
          { name: 'photo', label: 'Photo (optional)', type: 'image' }
        ]
      }
    ]
  },

  partnersMarquee: {
    label: 'Partners / Brands Marquee',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'note', label: 'Disclaimer / note text', type: 'textarea' },
      {
        name: 'logos',
        label: 'Partner logos',
        type: 'repeater',
        fields: [
          { name: 'name', label: 'Brand name', type: 'text' },
          { name: 'logo', label: 'Logo image', type: 'image' }
        ]
      }
    ]
  },

  certTeaser: {
    label: 'Certification Teaser Band',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Body copy', type: 'textarea' },
      { name: 'ctaLabel', label: 'CTA label', type: 'text' },
      { name: 'ctaUrl', label: 'CTA link', type: 'url' }
    ]
  },

  ctaBand: {
    label: 'Call-to-Action Band',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Body copy', type: 'textarea' },
      { name: 'primaryCtaLabel', label: 'Primary CTA label', type: 'text' },
      { name: 'primaryCtaUrl', label: 'Primary CTA link', type: 'url' },
      { name: 'secondaryCtaLabel', label: 'Secondary CTA label', type: 'text' },
      { name: 'secondaryCtaUrl', label: 'Secondary CTA link', type: 'url' },
      { name: 'tertiaryCtaLabel', label: 'Tertiary CTA label', type: 'text' },
      { name: 'tertiaryCtaUrl', label: 'Tertiary CTA link', type: 'url' },
      { name: 'backgroundImage', label: 'Background image', type: 'image' },
      { name: 'backgroundVideo', label: 'Background video (optional)', type: 'video' }
    ]
  },

  productsGrid: {
    label: 'Products / Services Grid',
    fields: [
      { name: 'eyebrow', label: 'Eyebrow label', type: 'text' },
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'body', label: 'Intro copy', type: 'textarea' },
      { name: 'source', label: 'Source (products | services | both)', type: 'text' },
      { name: 'tagFilter', label: 'Filter by tag (optional)', type: 'text' },
      { name: 'columns', label: 'Grid columns', type: 'number' }
    ]
  },

  richText: {
    label: 'Freeform Rich Text',
    fields: [{ name: 'body', label: 'Content', type: 'richtext' }]
  }
};

export function getSectionSchema(type) {
  return sectionSchemas[type] || null;
}

export const sectionTypeOptions = Object.entries(sectionSchemas).map(([value, cfg]) => ({
  value,
  label: cfg.label
}));
