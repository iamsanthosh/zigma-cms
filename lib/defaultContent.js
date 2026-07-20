// ============================================================
// Default / seed content — sourced directly from the original
// static Zigma Technologies template (zigma-technologies-website_v03.html)
// so both `npm run db:seed` and the no-DB fallback render pixel-accurate
// text content. Update this file, not schema.sql, when the template copy
// changes — it's the one place the real wording lives.
// ============================================================

const siteSettings = {
  logoImage: null,
  siteName: 'Zigma Technologies',
  tagline: 'POWER & ENERGY ENGINEERING',
  phone: '+91 12345 67890',
  email: 'info@zigma-technologies.com',
  headerCtaLabel: 'Get a Quote',
  headerCtaUrl: '#contact',
  footerTagline:
    "Engineering power infrastructure for Indian industry since 2006 — Solar EPC, Industrial UPS, Battery Solutions, and 24×7 AMC.",
  emergencyLabel: '24×7 Emergency Line',
  emergencyUrl: '#',
  copyrightText: '© 2026 Zigma Technologies. All rights reserved.',
  newsletterEnabled: true,
  socialLinks: [
    { platform: 'facebook', url: '#' },
    { platform: 'instagram', url: '#' },
    { platform: 'linkedin', url: '#' },
    { platform: 'x', url: '#' },
    { platform: 'youtube', url: '#' }
  ]
};

const themeSettings = [
  { key: '--orange', value: '#FF6B1A', category: 'color' },
  { key: '--navy-950', value: '#0A1628', category: 'color' },
  { key: '--gray-100', value: '#F4F6F9', category: 'color' },
  { key: '--gray-200', value: '#E7EBF1', category: 'color' },
  { key: '--cyan', value: '#2AA9D6', category: 'color' },
  { key: '--green', value: '#1FA05C', category: 'color' }
];

// Primary nav: 6 top-level items, two of which (Who We Are / What We Do)
// are true multi-column mega-menus, matching the original header exactly.
const primaryNav = {
  slug: 'primary-nav',
  label: 'Primary Navigation',
  items: [
    {
      label: 'Who We Are',
      url: '#why',
      children: [
        { label: 'About Zigma', url: '#why', column_heading: 'Company' },
        { label: '20-Year Legacy', url: '#legacy', column_heading: 'Company' },
        { label: 'Leadership', url: '#', column_heading: 'Company' },
        { label: 'Quality & Safety', url: '#', column_heading: 'Standards' },
        { label: 'Certifications', url: '#', column_heading: 'Standards' },
        { label: 'Careers', url: '#careers', column_heading: 'Team' },
        { label: 'Engineering Bench', url: '#', column_heading: 'Team' }
      ]
    },
    {
      label: 'What We Do',
      url: '#generate',
      children: [
        { label: 'Solar EPC', url: '#generate', column_heading: 'Generate' },
        { label: 'Solar AMC', url: '#generate', column_heading: 'Generate' },
        { label: 'Industrial UPS', url: '#protect', column_heading: 'Protect & Power' },
        { label: 'Battery Solutions', url: '#protect', column_heading: 'Protect & Power' },
        { label: 'Power Quality', url: '#protect', column_heading: 'Protect & Power' },
        { label: 'O&M / AMC', url: '#maintain', column_heading: 'Maintain' },
        { label: 'Remote Monitoring', url: '#maintain', column_heading: 'Maintain' },
        { label: 'Power Electronics', url: '#experts', column_heading: 'Engineering' },
        { label: 'Engineering Design', url: '#engineering-design', column_heading: 'Engineering' }
      ]
    },
    { label: 'Industries', url: '#industries', children: [] },
    { label: 'Projects', url: '#projects', children: [] },
    { label: 'Products', url: '/products-services', children: [] },
    { label: 'Innovation', url: '#', children: [] }
  ]
};

const footerCompanyMenu = {
  slug: 'footer-company',
  label: 'Company',
  items: [
    { label: 'About Zigma', url: '#why' },
    { label: '20-Year Legacy', url: '#legacy' },
    { label: 'Careers', url: '#' },
    { label: 'Insights', url: '#' },
    { label: 'Sitemap', url: 'https://zigma-technologies.com/#' },
    { label: 'Blog', url: '#' }
  ]
};

const footerCapabilitiesMenu = {
  slug: 'footer-capabilities',
  label: 'Capabilities',
  items: [
    { label: 'Solar EPC', url: '#' },
    { label: 'Industrial UPS', url: '#' },
    { label: 'Battery Solutions', url: '#' },
    { label: 'Energy Management', url: '#' }
  ]
};

const menus = [primaryNav, footerCompanyMenu, footerCapabilitiesMenu];

// ---------------- homepage sections, in template order ----------------
const homeSections = [
  {
    type: 'hero',
    name: 'Hero Slider',
    background_style: 'dark',
    data: {
      autoplaySeconds: 6,
      slides: [
        {
          eyebrow: '◆ EST. 2006 — TWO DECADES OF ENGINEERING',
          headline: '20+ Years of Engineering Excellence',
          lead: "Built on a Legacy of Trust. Driven by Service & Innovation. Powering industries with reliable power, solar, and engineering solutions for over two decades.",
          ctaLabel: 'Discover Our Legacy',
          ctaUrl: '#legacy',
          tags: [
            { label: 'Trusted Engineering Partner' },
            { label: 'Industrial Power Solutions' },
            { label: 'Reliability' },
            { label: 'Customer-Centric Service' }
          ]
        },
        {
          eyebrow: '◆ ZERO DOWNTIME · MISSION-CRITICAL POWER',
          headline: 'Reliable Power. Preserved Productivity. Zero Downtime.',
          lead: 'Integrated UPS, battery, and power continuity solutions engineered to protect critical operations, maximize uptime, and ensure uninterrupted business performance.',
          ctaLabel: 'Explore Power Continuity',
          ctaUrl: '#protect',
          tags: [
            { label: 'UPS Sales, AMC & Repair' },
            { label: 'Industrial UPS Solutions' },
            { label: 'Inverter & Battery Backup' },
            { label: 'Power Quality Solutions' }
          ]
        },
        {
          eyebrow: '◆ RENEWABLE ENERGY · SUSTAINABLE FUTURE',
          headline: 'Smart Solar with Sustainable Energy Future',
          lead: 'Complete Solar EPC, engineering, installation, monitoring, and long-term maintenance solutions for commercial, industrial, and utility-scale projects.',
          ctaLabel: 'Explore Solar Solutions',
          ctaUrl: '#generate',
          tags: [
            { label: 'Solar EPC & Power Plants' },
            { label: 'Rooftop, Industrial & Commercial Solar' },
            { label: 'Solar AMC & O&M' },
            { label: 'Green Energy Solutions' }
          ]
        },
        {
          eyebrow: '◆ ENGINEERING DESIGN & TECHNICAL SERVICES',
          headline: 'Engineering Expertise Beyond Boundaries',
          lead: 'Delivering precision engineering design, technical consulting, project support, and outsourced engineering services for industrial, infrastructure, and energy projects.',
          ctaLabel: 'Explore Engineering Services',
          ctaUrl: '#experts',
          tags: [
            { label: 'Electrical Engineering Design' },
            { label: 'CAD Drafting & Documentation' },
            { label: 'Technical Consulting' },
            { label: 'Engineering Outsourcing' }
          ]
        },
        {
          eyebrow: '◆ SMART, SUSTAINABLE & FUTURE-READY',
          headline: 'Building the Future-Ready Energy Ecosystem',
          lead: 'Building intelligent, sustainable, and future-ready power, renewable energy, and industrial infrastructure solutions for a smarter tomorrow.',
          ctaLabel: 'Talk to an Engineer',
          ctaUrl: '#contact',
          tags: [
            { label: 'Smart Energy & Digital Monitoring' },
            { label: 'Predictive Maintenance' },
            { label: 'AI-Driven Power Management' },
            { label: 'IoT Integration' }
          ]
        }
      ]
    }
  },
  {
    type: 'statBar',
    name: 'Stat Counter Bar',
    background_style: 'dark',
    data: {
      stats: [
        { value: 20, suffix: '+', label: 'Years Experience' },
        { value: 1500, suffix: '+', label: 'Projects Delivered' },
        { value: 1200, suffix: '+', label: 'Satisfied Clients' },
        { value: 25, suffix: '+', label: 'Industries We Serve' },
        { value: 100, suffix: '+', label: 'Certified Engineers' },
        { value: 99, suffix: '%+', label: 'Client Satisfaction' }
      ]
    }
  },
  {
    type: 'whyGrid',
    name: 'Why Zigma',
    background_style: 'light',
    data: {
      eyebrow: 'WHY ZIGMA',
      heading:
        "Power infrastructure fails at the seams — between vendors, between contracts, between \"someone else's problem.\"",
      body: 'Zigma exists to remove the seams.',
      cards: [
        { index: '01', title: '20-Year Engineering Bench', description: "Teams who've solved this exact failure before, not first-time installers." },
        { index: '02', title: 'One Partner, Full Stack', description: 'Generation, protection, storage, and maintenance under a single accountable roof.' },
        { index: '03', title: 'Certified & Compliant', description: 'Engineers trained to IS/IEC standards, safety-first execution on every site.' },
        { index: '04', title: '24×7 Response Commitment', description: 'A dedicated emergency line and SLA-bound response windows, not a ticket queue.' },
        { index: '05', title: 'Built for Scale', description: 'From a single rooftop system to multi-MW industrial EPC, without changing partners.' },
        { index: '06', title: 'Nationwide, Locally Accountable', description: 'Pan-India project delivery backed by regional service teams.' }
      ]
    }
  },
  {
    type: 'splitFeature',
    name: 'Generate — Solar Green Energy',
    background_style: 'iceblue',
    data: {
      eyebrow: 'GENERATE',
      eyebrowColor: '#1FA05C',
      heading: 'Solar Green Energy Solutions',
      body: 'Designing and delivering intelligent solar energy systems that maximize performance, efficiency, sustainability, and long-term return on investment for commercial, industrial, institutional, and utility-scale projects.',
      imagePosition: 'right',
      ctaLabel: 'Explore Solar Solutions',
      ctaUrl: '#contact',
      ctaStyle: 'primary',
      features: [
        { title: 'Solar EPC Engineering', description: 'Complete engineering, procurement, construction, and commissioning for rooftop, ground-mounted, and utility-scale solar power projects.' },
        { title: 'Solar Design & Detailed Engineering', description: 'Electrical design, system sizing, string layouts, load calculations, SLDs, and optimized solar plant engineering.' },
        { title: 'Energy Storage & Hybrid Systems', description: 'Battery energy storage, hybrid solar integration, backup power, and intelligent energy management solutions.' },
        { title: 'Monitoring & Performance Optimization', description: 'Remote monitoring, analytics, predictive diagnostics, and performance optimization to maximize energy generation.' }
      ]
    }
  },
  {
    type: 'splitFeature',
    name: 'Protect — Power Continuity',
    background_style: 'light',
    data: {
      eyebrow: 'PROTECT',
      eyebrowColor: '#FF6B1A',
      heading: 'Power Continuity Solutions',
      body: 'Delivering reliable and uninterrupted power infrastructure through advanced UPS systems, battery solutions, critical power engineering, and electrical protection systems.',
      imagePosition: 'left',
      ctaLabel: 'Protect Your Business',
      ctaUrl: '#contact',
      ctaStyle: 'primary',
      features: [
        { title: 'UPS Systems & Critical Power', description: 'Reliable online UPS solutions for mission-critical operations across commercial and industrial facilities.' },
        { title: 'Battery Backup Solutions', description: 'High-performance battery banks, energy storage, replacement, testing, and lifecycle management.' },
        { title: 'Electrical Distribution Systems', description: 'LV panels, switchgear, power distribution, protection coordination, and electrical infrastructure engineering.' },
        { title: 'Power Quality & Monitoring', description: 'Advanced monitoring, harmonic analysis, surge protection, power quality improvement, and preventive diagnostics.' }
      ]
    }
  },
  {
    type: 'splitFeature',
    name: 'Maintain — Engineering Operations',
    background_style: 'iceblue',
    data: {
      eyebrow: 'MAINTAIN',
      eyebrowColor: '#2AA9D6',
      heading: 'Engineering Operations & Lifecycle Services',
      body: 'Comprehensive operation, maintenance, asset management, and engineering support services that ensure maximum system reliability and operational efficiency.',
      imagePosition: 'right',
      ctaLabel: 'Discover Engineering Services',
      ctaUrl: '#contact',
      ctaStyle: 'primary',
      features: [
        { title: 'Operations & Maintenance (O&M)', description: 'Preventive and corrective maintenance for solar plants, electrical infrastructure, UPS systems, and industrial assets.' },
        { title: 'Annual Maintenance Contracts (AMC)', description: 'Flexible AMC programs providing scheduled inspections, maintenance, and priority technical support.' },
        { title: 'Remote Monitoring & Diagnostics', description: '24×7 system monitoring, predictive maintenance, fault detection, and performance reporting.' },
        { title: 'Engineering Support Services', description: 'Technical audits, troubleshooting, modernization, retrofits, documentation, and lifecycle engineering support.' }
      ]
    }
  },
  {
    type: 'splitFeature',
    name: 'Experts — Industrial & Power Electronics',
    background_style: 'light',
    data: {
      eyebrow: 'EXPERTISE',
      eyebrowColor: '#2AA9D6',
      heading: 'Experts in Industrial & Power Electronics',
      body: 'Deep engineering expertise in rectifiers, converters, drives, and industrial power electronics — the foundational layer behind every protection system we build.',
      imagePosition: 'left',
      ctaLabel: 'Talk to Our Power Electronics Team',
      ctaUrl: '#contact',
      ctaStyle: 'ghost-dark',
      features: [
        { title: 'Rectifiers & Converters', description: 'Precision-engineered AC-DC and DC-DC conversion systems built for demanding industrial duty cycles.' },
        { title: 'Drives & Motor Control', description: 'Variable frequency drives and motor control systems tuned for efficiency and reliability at scale.' },
        { title: 'Power Electronics Consulting', description: 'Design reviews, failure analysis, and specification support from engineers who build this equipment.' },
        { title: 'Inverter Installation & Service', description: 'On-site inverter installation, commissioning, repair, and service support across major solar and industrial brands.' }
      ]
    }
  },
  {
    type: 'splitFeature',
    name: 'Engineering — Design & Development',
    background_style: 'iceblue',
    data: {
      eyebrow: 'ENGINEERING',
      eyebrowColor: '#FF6B1A',
      heading: 'Engineering Design & Development Engineering',
      body: "From concept to commissioning — our engineering bench designs, models, and validates every system before it's ever installed on-site.",
      imagePosition: 'right',
      ctaLabel: 'Discuss Your Engineering Project',
      ctaUrl: '#contact',
      ctaStyle: 'primary',
      features: [
        { title: 'Electrical Design & Detailed Engineering', description: 'Single-line diagrams, load calculations, and detailed electrical design engineered for your exact site conditions.' },
        { title: 'Prototyping & Product Development', description: 'Rapid prototyping and iterative development to prove out new power system designs before scale-up.' },
        { title: 'Technical Drawings & Documentation', description: 'CAD layouts, schematics, and as-built documentation delivered to a standard your team can act on.' },
        { title: 'Testing, Commissioning & Validation', description: 'Factory and site acceptance testing, commissioning, and performance validation before handover.' }
      ]
    }
  },
  {
    type: 'legacyBand',
    name: '20-Year Legacy Timeline',
    background_style: 'dark',
    data: {
      eyebrow: '20-YEAR LEGACY',
      heading: "Twenty years isn't a number. It's a track record.",
      ctaLabel: 'Read Our Full Story',
      ctaUrl: '#',
      milestones: [
        { year: '2006', title: 'Founded', description: 'Zigma Technologies founded, focused on industrial electrical and power backup services.' },
        { year: '2010s', title: 'UPS & AMC Expansion', description: 'Expansion into UPS sales, service, and structured Annual Maintenance Contracts across manufacturing clients.' },
        { year: '2015+', title: 'Solar Division', description: 'Entry into Solar EPC as renewable energy adoption accelerates among Indian industry.' },
        { year: '2020+', title: 'Full Power Lifecycle', description: 'Battery solutions, power quality, and energy management added — completing the integrated offering.' },
        { year: 'Today', title: '1,000+ Projects', description: 'Pan-India service footprint and a new phase of expansion into large-scale industrial solar.', isCurrent: true },
        { year: "What's Next", title: 'Future Vision', description: "Scaling engineering capacity to serve India's next decade of industrial energy demand." }
      ]
    }
  },
  {
    type: 'projectsGrid',
    name: 'Featured Projects',
    background_style: 'light',
    data: {
      eyebrow: 'PROOF, NOT PROMISES',
      heading: 'Featured projects',
      ctaLabel: 'View All Projects',
      ctaUrl: '#',
      projects: [
        { title: 'Textile Manufacturing Plant, Gujarat', stat: '↓ 38% grid dependency · 6.1-yr payback', description: '1.2 MW rooftop solar EPC engineered for a high-load textile facility.', url: '#' },
        { title: 'Multi-Specialty Hospital, Pune', stat: 'Zero downtime across 3 years', description: 'Industrial UPS and battery backup engineered for critical-care continuity.', url: '#' },
        { title: 'IT Park Campus, Bengaluru', stat: '22% energy cost reduction, year one', description: 'Full energy audit and monitoring dashboard rollout across a 6-building campus.', url: '#' }
      ]
    }
  },
  {
    type: 'industriesGrid',
    name: 'Industries We Serve',
    background_style: 'gray',
    data: {
      eyebrow: 'INDUSTRIES',
      heading: 'Engineering that understands your industry.',
      industries: [
        { name: 'Data Centers & IT Parks' },
        { name: 'Digital Infrastructure' },
        { name: 'Government & Public Sector' },
        { name: 'Manufacturing & Automotive' },
        { name: 'Airport & Metro Infrastructure' },
        { name: 'Solar Power Plants' },
        { name: 'Industrial Infrastructure' },
        { name: 'Hospitality & Hotels' },
        { name: 'MSMEs & Small-Scale Industries' },
        { name: 'Telecom & Communication' },
        { name: 'Smart Cities & Utilities' },
        { name: 'Special Economic Zones (SEZ)' },
        { name: 'Warehouse & Logistics' },
        { name: 'Power & Energy Infrastructure' },
        { name: 'Oil & Gas Refineries' },
        { name: 'Healthcare & Hospitals' },
        { name: 'Educational Institutions' },
        { name: 'Residential Communities' },
        { name: 'Commercial Real Estate' },
        { name: 'Corporate Campuses' },
        { name: 'Solar & Renewable Energy' },
        { name: 'Banking & Financial Services' },
        { name: 'Engineering, Procurement & Construction (EPC)' },
        { name: 'Utility Infrastructure (Power, Water & Telecom)' }
      ]
    }
  },
  {
    type: 'testimonials',
    name: 'Testimonials',
    background_style: 'dark',
    data: {
      eyebrow: 'TESTIMONIALS',
      heading: "Trusted by the people who can't afford downtime.",
      items: [
        {
          quote: "When our UPS failed at 2 AM, Zigma's engineer was on-site before our own maintenance team could even respond. That's twenty years of reliability, not luck.",
          name: 'Rajesh Iyer',
          role: 'Plant Head, Precision Auto Components'
        },
        {
          quote: 'They did not just install our rooftop solar system — they sat with our facilities team and rebuilt our entire load management approach.',
          name: 'Dr. Anita Menon',
          role: 'Facility Director, Sunrise Multi-Specialty Hospital'
        },
        {
          quote: 'We evaluated four EPC vendors. Zigma was the only one that came back with load calculations instead of a quotation.',
          name: 'Vikram Sharma',
          role: 'Operations Head, Meridian Textiles'
        }
      ]
    }
  },
  {
    type: 'certTeaser',
    name: 'Certification Teaser',
    background_style: 'dark',
    data: {
      eyebrow: 'CERTIFICATIONS',
      heading: 'Certified Excellence. Trusted Performance.',
      body: 'OEM authorizations, ISO certification, and engineering partnerships that back every project we deliver.',
      ctaLabel: 'View Our Certifications',
      ctaUrl: '#'
    }
  },
  {
    type: 'productsGrid',
    name: 'Products & Services',
    background_style: 'light',
    data: {
      eyebrow: 'PRODUCTS & SERVICES',
      heading: 'Explore what we build and maintain',
      body: 'Browse our solar, power protection, and maintenance offerings — click any tile for full specifications.',
      source: 'both',
      columns: 3
    }
  },
  {
    type: 'ctaBand',
    name: 'Contact CTA',
    background_style: 'light',
    data: {
      heading: "Let's build India's next 20 years of reliable power.",
      body: "Whether it's a single rooftop system or a multi-site industrial rollout, our engineers will size it right the first time.",
      primaryCtaLabel: 'Get Free Consultation',
      primaryCtaUrl: '#',
      secondaryCtaLabel: 'Talk to an Engineer',
      secondaryCtaUrl: 'tel:+911234567890',
      tertiaryCtaLabel: 'Download Company Profile',
      tertiaryCtaUrl: '#'
    }
  }
];

const pages = [
  {
    slug: 'home',
    title: "Zigma Technologies | Engineering Power. Sustaining India's Industry.",
    template: 'default',
    sections: homeSections
  }
];

const products = [
  {
    slug: 'rooftop-solar-epc',
    title: 'Rooftop Solar EPC',
    subtitle: 'Commercial & industrial rooftop solar',
    description: 'End-to-end rooftop solar EPC — design, procurement, installation, and grid connection, engineered for maximum yield.',
    specifications: [
      { label: 'Capacity range', value: '10kW – 5MW' },
      { label: 'Warranty', value: '25-year panel performance' }
    ],
    price_label: 'Custom quote',
    tags: 'solar,epc,rooftop',
    cta_label: 'Request a Quote',
    cta_url: '#contact'
  },
  {
    slug: 'industrial-ups',
    title: 'Industrial UPS Systems',
    subtitle: 'Zero-downtime backup power',
    description: 'Modular UPS systems sized to your critical load with N+1 redundancy options.',
    specifications: [{ label: 'Capacity range', value: '10kVA – 1MVA' }],
    price_label: 'Custom quote',
    tags: 'ups,power-protection',
    cta_label: 'Talk to an Engineer',
    cta_url: '#contact'
  }
];

const services = [
  {
    slug: 'solar-amc',
    title: 'Solar AMC & O&M',
    subtitle: '24×7 monitoring and preventive maintenance',
    description: 'Annual maintenance contracts covering cleaning, thermal imaging, and rapid-response repairs.',
    specifications: [{ label: 'Response time', value: '< 24 hours' }],
    price_label: 'From ₹2/kW/month',
    tags: 'amc,solar,maintenance',
    cta_label: 'Get AMC Pricing',
    cta_url: '#contact'
  },
  {
    slug: 'engineering-design',
    title: 'Engineering Design Services',
    subtitle: 'Outsourced electrical engineering',
    description: 'Load studies, single-line diagrams, and detailed engineering packages for EPC contractors.',
    specifications: [],
    price_label: 'Custom quote',
    tags: 'engineering,design',
    cta_label: 'Discuss a Project',
    cta_url: '#contact'
  }
];

module.exports = { siteSettings, themeSettings, menus, pages, products, services };
