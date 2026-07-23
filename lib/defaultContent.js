/**
 * Default Fallback Content
 * Used when database connection fails or no section data is available
 * This ensures the website remains functional even without a database connection
 * 
 * Features:
 * - Complete seed data for all section types extracted from HTML template
 * - Realistic Zigma Technologies content
 * - Fallback mechanism for DB failures
 * - Site settings, menus, and pages included
 */

// Lucide icon SVG path mappings (24x24 viewBox)
const ICON_PATHS = {
  'sun': 'M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6m-17.78 7.78l4.24-4.24m3.08-3.08l4.24-4.24M23 12h-6m-6 0H5',
  'activity': 'M22 12h-4l-3-9H9L6 12H2',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'dollar-sign': 'M12 1v22M17 5H9a4 4 0 0 0 0 8h6a4 4 0 0 1 0 8H7',
  'trending-up': 'M23 6l-9.5 9.5-5-5L1 18',
  'trending-down': 'M23 18l-9.5-9.5-5 5L1 6',
  'layers': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'headphones': 'M20 15c0 4-1 6-5 6h-2c-4 0-5-2-5-6V5c0-4 1-6 5-6h2c4 0 5 2 5 6v10z',
  'edit': 'M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  'bar-chart-2': 'M12 3v18M3 9h18M3 16h18',
  'server': 'M22 2H2v6h20V2zM22 13H2v6h20v-6zM6 6v1M6 17v1',
  'alert-circle': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
  'award': 'M12 15l-8.5 4.5 1.6-9.3L2 7l9.2-1.3L12 0l2.8 5.7 9.2 1.3-7.1 6.2 1.6 9.3z',
  'phone': 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  'expand': 'M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3',
  'check-circle': 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4l-7.07 7.07-3.07-3.07',
  'battery': 'M2 7h16v10H2z M18 9v6M20 8v8',
  'database': 'M12 3C7.58 3 4 4.6 4 6.5v11c0 1.9 3.58 3.5 8 3.5s8-1.6 8-3.5v-11C20 4.6 16.42 3 12 3zm0 5c4.42 0 8-1.6 8-3.5S16.42 4 12 4s-8 1.5-8 3.5 3.58 3.5 8 3.5z',
  'sliders': 'M4 9h16M4 15h16M8 3v4m8 8v4M3 21h18',
  'factory': 'M2 20h20v2H2zM2 10v10h4v-8h2v8h4v-6h2v6h4v-8h2v8h4V10M8 2v6h8V2',
  'hospital': 'M3 9h6V3H3zm8 0h6V3h-6zm8 0h6V3h-6zM3 15h6v-2H3zm8 0h6v-2h-6zm8 0h6v-2h-6zM9 9v12M15 9v12',
  'code': 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  'hotel': 'M2 4h20v16H2z M6 9h2v3H6z M12 9h2v3h-2z M18 9h2v3h-2z M2 4v-2h20v2',
  'book': 'M4 19.5h16a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2zm0 0V6.5M12 4v15',
  'shopping-cart': 'M9 2L6 6H3l2.6 13H19l2.4-12H8m1 5v7m3-7v7',
  'wifi': 'M12 17v.01M5.5 11.5A7 7 0 0 1 18.5 11.5M2 6.5A11 11 0 0 1 22 6.5',
};

function getIconSvgPath(iconName) {
  return ICON_PATHS[iconName] || '';
}

function getIconHtml(iconName) {
  const path = ICON_PATHS[iconName];
  if (!path) return '';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="${path}"/></svg>`;
}

export const defaultContent = {
  sections: [
    // ==================== HERO SLIDER ====================
    {
      id: 'hero-1',
      type: 'hero',
      slug: 'hero-slider',
      order: 1,
      backgroundStyle: 'theme-legacy',
      tagPillHoverColor: '#FF6B1A',
      slides: [
        {
          eyebrow: 'SINCE 2004',
          title: '20 Years of Legacy',
          subtitle: 'Powering India\'s Industrial Growth',
          description: 'Two decades of proven excellence in electrical engineering and power solutions. Trusted by industry leaders across India.',
          cta_label: 'Explore Our Journey',
          cta_url: '#timeline',
          ctaLabel: 'Explore Our Journey',
          ctaUrl: '#timeline',
          tag_label: 'Since 2004',
          tagPillColor: '#FF6B1A',
          tags: [{ label: 'Since 2004' }],
          image_url: '/assets/hero-legacy.svg',
          backgroundImage: { url: '/assets/hero-legacy.svg', alt: 'Zigma legacy' },
          big_numeral: '20+',
        },
        {
          eyebrow: 'POWER CONTINUITY',
          title: 'Uninterruptible Power Continuity',
          subtitle: 'UPS & Power Backup Solutions',
          description: 'Enterprise-grade UPS systems ensuring zero downtime for critical operations. Mission-critical reliability for your business.',
          cta_label: 'UPS Solutions',
          cta_url: '#protect',
          ctaLabel: 'UPS Solutions',
          ctaUrl: '#protect',
          tag_label: 'UPS & Backup',
          tagPillColor: '#0078D4',
          tags: [{ label: 'UPS & Backup' }],
          image_url: '/assets/hero-ups.svg',
          backgroundImage: { url: '/assets/hero-ups.svg', alt: 'UPS systems' },
          big_numeral: '99.9%',
        },
        {
          eyebrow: 'RENEWABLE ENERGY',
          title: 'Solar & Green Energy',
          subtitle: 'Sustainable Power for Tomorrow',
          description: 'Harness the power of the sun. Custom solar solutions reducing carbon footprint and energy costs by up to 70%.',
          cta_label: 'Solar Systems',
          cta_url: '#generate',
          ctaLabel: 'Solar Systems',
          ctaUrl: '#generate',
          tag_label: 'Renewable Energy',
          tagPillColor: '#00D4FF',
          tags: [{ label: 'Renewable Energy' }],
          image_url: '/assets/hero-solar.svg',
          backgroundImage: { url: '/assets/hero-solar.svg', alt: 'Solar panels' },
          big_numeral: '50MW+',
        },
        {
          eyebrow: 'ENGINEERING SERVICES',
          title: 'Engineering Design & Outsourcing',
          subtitle: 'Complete Power System Design',
          description: 'From concept to execution. Expert electrical engineering design services for industrial and commercial projects.',
          cta_label: 'Design Services',
          cta_url: '#maintain',
          ctaLabel: 'Design Services',
          ctaUrl: '#maintain',
          tag_label: 'Electrical Engineering Design',
          tagPillColor: '#6A4CFF',
          tags: [{ label: 'Electrical Engineering Design' }],
          image_url: '/assets/hero-engineering.svg',
          backgroundImage: { url: '/assets/hero-engineering.svg', alt: 'Engineering team' },
          big_numeral: '500+',
        },
        {
          eyebrow: 'SMART INFRASTRUCTURE',
          title: 'Future-Ready Power Solutions',
          subtitle: 'Smart, Scalable, Sustainable',
          description: 'Next-generation power infrastructure. IoT-enabled monitoring and AI-driven optimization for modern enterprises.',
          cta_label: 'Smart Solutions',
          cta_url: '#cta',
          ctaLabel: 'Smart Solutions',
          ctaUrl: '#cta',
          tag_label: 'Future Tech',
          tagPillColor: '#00A86B',
          tags: [{ label: 'Future Tech' }],
          image_url: '/assets/hero-future.svg',
          backgroundImage: { url: '/assets/hero-future.svg', alt: 'Future-ready solutions' },
          big_numeral: 'AI-Ready',
        },
      ],
    },

    // ==================== STAT BAR ====================
    {
      id: 'stat-1',
      type: 'statBar',
      slug: 'key-metrics',
      order: 2,
      stats: [
        { numeral: '20+', label: 'Years of Experience', description: 'Trusted by industry leaders', iconHtml: '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>' },
        { numeral: '500+', label: 'Projects Completed', description: 'Across India', iconHtml: '<svg viewBox="0 0 24 24"><polyline points="23 6 13.46 15.89 8 10.5 1 17.6"></polyline><polyline points="23 6 23 19 1 19"></polyline></svg>' },
        { numeral: '50MW+', label: 'Solar Installed', description: 'Renewable capacity', iconHtml: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3.5 2"></path></svg>' },
        { numeral: '2000+', label: 'Clients Served', description: 'From startups to enterprises', iconHtml: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>' },
      ],
    },

    // ==================== ENGINEERING ECOSYSTEM ====================
    {
      id: 'ecosystem-1',
      type: 'ecosystem',
      slug: 'engineering-ecosystem',
      order: 3.5,
      backgroundColor: '#001F3F',
      eyebrow: 'INTEGRATED SOLUTIONS',
      heading: 'Engineering Ecosystem',
      body: 'A comprehensive integrated ecosystem of power generation, protection, and optimization solutions working in perfect harmony.',
      ecoImage: { url: '/assets/ecosystem-visual.svg', alt: 'Engineering Ecosystem visualization' },
      capabilities: [
        { label: 'Solar Integration', color: 'green' },
        { label: 'Power Backup Systems', color: 'orange' },
        { label: 'Smart Automation', color: 'cyan' },
        { label: 'Energy Optimization', color: 'green' },
        { label: 'Electrical Engineering', color: 'cyan' },
        { label: 'Energy Distribution', color: 'orange' },
      ],
      badgeText: 'ISO-CERTIFIED SYSTEMS',
      badgeLabel: 'Quality Assured',
      ctaLabel: 'Explore Ecosystem',
      ctaUrl: '/contact',
    },

    // ==================== WHY ZIGMA ====================
    {
      id: 'why-1',
      type: 'whyGrid',
      slug: 'why-zigma',
      order: 3,
      eyebrow: 'WHY ZIGMA',
      title: 'Why Zigma Technologies',
      subtitle: 'The Power Behind Your Operations',
      description: 'We combine decades of expertise with cutting-edge technology to deliver power solutions that keep your business running.',
      cards: [
        { title: 'Proven Expertise', description: '20+ years of excellence in electrical engineering and power solutions across diverse industries.', iconSvgPath: getIconSvgPath('award') },
        { title: 'End-to-End Solutions', description: 'From solar installations to UPS systems and engineering design, we handle it all in-house.', iconSvgPath: getIconSvgPath('layers') },
        { title: '24/7 Support', description: 'Round-the-clock technical support and emergency response to keep your systems running smoothly.', iconSvgPath: getIconSvgPath('phone') },
        { title: 'Cost Optimization', description: 'Innovative solutions that reduce energy costs by up to 70% without compromising on reliability.', iconSvgPath: getIconSvgPath('trending-down') },
        { title: 'Scalable Infrastructure', description: 'Solutions that grow with your business. From small setups to large industrial complexes.', iconSvgPath: getIconSvgPath('expand') },
        { title: 'Certified & Compliant', description: 'ISO 9001 certified with full compliance to national and international electrical standards.', iconSvgPath: getIconSvgPath('check-circle') },
      ],
    },

    // ==================== SOLAR (GENERATE) ====================
    {
      id: 'generate-1',
      type: 'splitFeature',
      slug: 'solar-energy',
      order: 4,
      layout: 'img-right',
      eyebrow: 'SUSTAINABLE ENERGY',
      title: 'Generate Clean Power',
      subtitle: 'Solar & Green Energy Solutions',
      description: 'Harness the unlimited power of the sun with our state-of-the-art solar energy systems. Reduce your carbon footprint while maximizing energy efficiency.',
      cta_label: 'Get Solar Quote',
      cta_url: '/contact?service=solar',
      image_url: '/assets/solar-panel.svg',
      features: [
        { title: 'High Efficiency Panels', description: 'Latest monocrystalline technology with 22%+ efficiency ratings', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"></circle><path d="M12 1v6"></path><path d="M12 17v6"></path><path d="M4.22 4.22l4.24 4.24"></path><path d="M15.54 15.54l4.24 4.24"></path><path d="M1 12h6"></path><path d="M17 12h6"></path></svg>' },
        { title: 'Smart Monitoring', description: 'Real-time energy production tracking and performance analytics', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>' },
        { title: 'Grid Integration', description: 'Seamless grid-tied or off-grid system configurations', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>' },
        { title: 'ROI Guarantee', description: 'Guaranteed return on investment within 5-6 years', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 1v22"></path><path d="M17 5H9a4 4 0 0 0 0 8h6a4 4 0 0 1 0 8H7"></path></svg>' },
      ],
    },

    // ==================== UPS (PROTECT) ====================
    {
      id: 'protect-1',
      type: 'splitFeature',
      slug: 'power-backup',
      order: 5,
      layout: 'img-left',
      eyebrow: 'POWER CONTINUITY',
      title: 'Protect Your Operations',
      subtitle: 'Enterprise UPS & Power Backup',
      description: 'Mission-critical power backup solutions ensuring zero downtime for your business. Our UPS systems provide reliable protection 24/7.',
      cta_label: 'UPS Configuration',
      cta_url: '/contact?service=ups',
      image_url: '/assets/ups-system.svg',
      features: [
        { title: 'Instant Switchover', description: 'Zero-transfer-time switching technology for uninterrupted power', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>' },
        { title: '99.9% Uptime', description: 'Industry-leading reliability backed by 24/7 monitoring', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>' },
        { title: 'Modular Design', description: 'Scalable capacity that grows with your power requirements', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>' },
        { title: 'Expert Support', description: 'Dedicated technical team for installation, maintenance, and emergency support', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 15c0 4-1 6-5 6h-2c-4 0-5-2-5-6V5c0-4 1-6 5-6h2c4 0 5 2 5 6v10z"></path><circle cx="12" cy="15" r="1"></circle></svg>' },
      ],
    },

    // ==================== MAINTAIN (ENGINEERING) ====================
    {
      id: 'maintain-1',
      type: 'splitFeature',
      slug: 'engineering-services',
      order: 6,
      layout: 'img-right',
      eyebrow: 'ENGINEERING EXPERTISE',
      title: 'Maintain & Optimize',
      subtitle: 'Engineering Design & Services',
      description: 'Complete electrical engineering solutions from design to commissioning. Our expert team delivers optimal power infrastructure for your specific needs.',
      cta_label: 'Engineering Inquiry',
      cta_url: '/contact?service=engineering',
      image_url: '/assets/engineering-team.svg',
      features: [
        { title: 'Custom Design', description: 'Tailored electrical systems designed for your exact requirements', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>' },
        { title: 'Load Analysis', description: 'Comprehensive energy audits and load profiling for optimization', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><line x1="12" y1="3" x2="12" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="16" x2="21" y2="16"></line></svg>' },
        { title: 'System Integration', description: 'Seamless integration of solar, UPS, and backup systems', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="2" width="20" height="8"></rect><rect x="2" y="13" width="20" height="8"></rect><line x1="6" y1="6" x2="6" y2="6.01"></line><line x1="6" y1="17" x2="6" y2="17.01"></line></svg>' },
        { title: 'Predictive Maintenance', description: 'AI-enabled monitoring to prevent failures before they happen', iconHtml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 2"></path></svg>' },
      ],
    },

    // ==================== STAT BAR 2 ====================
    {
      id: 'stat-2',
      type: 'statBar',
      slug: 'service-excellence',
      order: 7,
      stats: [
        { numeral: '99.9%', label: 'System Uptime', description: 'Guaranteed reliability', iconHtml: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>' },
        { numeral: '500+', label: 'Expert Workforce', description: 'Trained professionals', iconHtml: '<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' },
        { numeral: '₹50Cr+', label: 'Project Value', description: 'Completed', iconHtml: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><circle cx="9" cy="10" r="1"></circle><circle cx="12" cy="10" r="1"></circle><circle cx="15" cy="10" r="1"></circle></svg>' },
        { numeral: '24/7', label: 'Support Available', description: 'Emergency response', iconHtml: '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>' },
      ],
    },

    // ==================== EXPERTS / FEATURES ====================
    {
      id: 'experts-1',
      type: 'featGrid',
      slug: 'technical-capabilities',
      order: 8,
      eyebrow: 'TECHNICAL EXCELLENCE',
      title: 'Our Capabilities',
      subtitle: 'Complete Power Solution Expertise',
      description: 'Leveraging cutting-edge technology and industry best practices',
      cards: [
        { title: 'Solar PV Systems', description: 'Rooftop to utility-scale solar installations with integrated storage', iconSvgPath: getIconSvgPath('sun') },
        { title: 'UPS & Inverters', description: 'High-capacity UPS systems from 5KVA to 1000KVA+', iconSvgPath: getIconSvgPath('battery') },
        { title: 'Energy Storage', description: 'Battery storage solutions for grid stabilization and backup', iconSvgPath: getIconSvgPath('database') },
        { title: 'Load Management', description: 'Intelligent systems to optimize and balance power distribution', iconSvgPath: getIconSvgPath('sliders') },
      ],
    },

    // ==================== TIMELINE ====================
    {
      id: 'timeline-1',
      type: 'timeline',
      slug: 'company-milestone',
      order: 9,
      eyebrow: '20 YEARS JOURNEY',
      title: 'Our Growth Story',
      subtitle: 'From humble beginnings to industry leaders',
      items: [
        { year: 2004, title: 'Founded', description: 'Started with vision to revolutionize power solutions in India', isCurrent: false },
        { year: 2008, title: 'First Solar Installation', description: 'Pioneered solar adoption in commercial sector', isCurrent: false },
        { year: 2012, title: 'ISO Certification', description: 'Achieved ISO 9001 for quality management', isCurrent: false },
        { year: 2016, title: 'National Expansion', description: 'Expanded operations across 15+ Indian states', isCurrent: false },
        { year: 2020, title: 'IoT Integration', description: 'Launched smart monitoring platform for all solutions', isCurrent: false },
        { year: 2024, title: 'AI-Driven Analytics', description: 'Pioneering AI-enabled predictive maintenance', isCurrent: true },
      ],
    },

    // ==================== PROJECTS ====================
    {
      id: 'projects-1',
      type: 'projGrid',
      slug: 'featured-projects',
      order: 10,
      eyebrow: 'CASE STUDIES',
      title: 'Featured Projects',
      subtitle: 'Real-world solutions delivering real results',
      description: 'Discover how we\'ve transformed power infrastructure across industries',
      projects: [
        { title: 'Mumbai Tech Park Solar Retrofit', description: 'Installed 500KW solar system reducing operational costs by 65%', stat: '500 KW Solar Capacity', image: { url: '/assets/project-mumbai.svg', alt: 'Mumbai project' }, tags: [{ label: 'Solar', color: '#00D4FF' }, { label: 'Retrofit', color: '#12B76A' }], url: '/case-studies/mumbai-techpark' },
        { title: 'Bangalore Data Center Backup', description: 'Engineered 2000KVA UPS infrastructure ensuring 99.99% uptime', stat: '2000 KVA UPS System', image: { url: '/assets/project-bangalore.svg', alt: 'Bangalore project' }, tags: [{ label: 'UPS', color: '#FF6B1A' }, { label: 'Data Center', color: '#6A4CFF' }], url: '/case-studies/bangalore-datacenter' },
        { title: 'Pune Manufacturing Facility', description: 'Complete power solution combining solar, UPS, and load management', stat: 'Hybrid System', image: { url: '/assets/project-pune.svg', alt: 'Pune project' }, tags: [{ label: 'Integrated', color: '#FFC93C' }, { label: 'Manufacturing', color: '#00D4FF' }], url: '/case-studies/pune-manufacturing' },
      ],
    },

    // ==================== INDUSTRIES ====================
    {
      id: 'industries-1',
      type: 'indGrid',
      slug: 'served-industries',
      order: 11,
      eyebrow: 'INDUSTRY EXPERTISE',
      heading: 'Sectors We Serve',
      industries: [
        { name: 'Data Centers', iconHtml: getIconHtml('server') },
        { name: 'Manufacturing', iconHtml: getIconHtml('factory') },
        { name: 'Healthcare', iconHtml: getIconHtml('hospital') },
        { name: 'IT & Tech', iconHtml: getIconHtml('code') },
        { name: 'Hospitality', iconHtml: getIconHtml('hotel') },
        { name: 'Education', iconHtml: getIconHtml('book') },
        { name: 'Retail', iconHtml: getIconHtml('shopping-cart') },
        { name: 'Telecom', iconHtml: getIconHtml('wifi') },
      ],
    },

    // ==================== TESTIMONIALS ====================
    {
      id: 'testimonials-1',
      type: 'testimonial',
      slug: 'client-testimonials',
      order: 12,
      eyebrow: 'CLIENT SUCCESS',
      title: 'What Our Clients Say',
      subtitle: 'Real feedback from satisfied partners',
      slides: [
        { quote: 'Zigma\'s solar solution cut our electricity costs by 60% while providing a green alternative. Their support team is exceptional.', person: 'Rajesh Kumar', role: 'Operations Manager, TechCorp India' },
        { quote: 'The UPS system they designed has never let us down. 99.9% uptime means our operations never stop.', person: 'Priya Sharma', role: 'IT Director, FinServe Solutions' },
        { quote: 'From design to installation, Zigma handled everything professionally. Best decision we made for our facility.', person: 'Amit Patel', role: 'Facility Manager, MegaMart Retail' },
        { quote: 'Their engineering expertise solved our complex power distribution challenges. Highly recommended!', person: 'Dr. Vikram Singh', role: 'Chief Engineer, Industries Ltd' },
      ],
    },

    // ==================== PARTNERS ====================
    {
      id: 'partners-1',
      type: 'partners',
      slug: 'industry-partners',
      order: 13,
      eyebrow: 'TRUSTED PARTNERSHIPS',
      title: 'Our Technology Partners',
      subtitle: 'Collaborating with industry leaders to deliver excellence',
      logos: [
        { name: 'SolarTech Global', logo: { url: '/assets/partners/solartech.svg' } },
        { name: 'PowerSys Pro', logo: { url: '/assets/partners/powersys.svg' } },
        { name: 'Energyx Solutions', logo: { url: '/assets/partners/energyx.svg' } },
        { name: 'GridControl Systems', logo: { url: '/assets/partners/gridcontrol.svg' } },
        { name: 'InverterMax', logo: { url: '/assets/partners/invertermax.svg' } },
        { name: 'BatteryTech Global', logo: { url: '/assets/partners/batterytech.svg' } },
      ],
    },

    // ==================== CERTIFICATIONS ====================
    {
      id: 'certs-1',
      type: 'certTeaser',
      slug: 'certifications',
      order: 14,
      eyebrow: 'QUALITY ASSURANCE',
      title: 'Certified Excellence',
      subtitle: 'ISO 9001 Certified | NABET Accredited | IEC Compliant | Bureau of Energy Efficiency Recognized',
      cta_label: 'View All Certifications',
      cta_url: '/certifications',
      ctaLabel: 'View All Certifications',
      ctaUrl: '/certifications',
      body: 'Our commitment to quality is backed by internationally recognized certifications and adherence to strict safety standards.',
    },

    // ==================== CTA BAND ====================
    {
      id: 'cta-1',
      type: 'ctaBand',
      slug: 'call-to-action',
      order: 15,
      title: 'Ready to Power Your Future?',
      subtitle: 'Join hundreds of businesses already benefiting from Zigma\'s innovative solutions',
      ctas: [
        { label: 'Get Free Consultation', url: '/contact', style: 'highlighted' },
        { label: 'View Our Portfolio', url: '/projects', style: 'normal' }
      ]
    },
  ],

  // ==================== PRODUCTS ====================
  products: [
    {
      id: 1,
      slug: 'solar-panel-system',
      title: 'High-Efficiency Solar Panels',
      subtitle: 'Industrial-grade solar solutions',
      description: 'Premium solar panel systems designed for maximum efficiency and durability. Perfect for industrial and commercial applications.',
      price_label: 'Custom Quote',
      tags: 'solar,renewable,power',
      cta_label: 'Get Quote',
      cta_url: '/contact',
      thumbnail_id: 1,
      order: 1,
      visible: 1,
      active: 1,
      specifications: {
        wattage: '300-400W per unit',
        efficiency: '19.5-21%',
        warranty: '25 years',
        panel_type: 'Monocrystalline'
      }
    },
    {
      id: 2,
      slug: 'ups-systems',
      title: 'UPS Power Systems',
      subtitle: 'Reliable backup power solutions',
      description: 'Enterprise-grade UPS systems providing 99.99% uptime protection for critical infrastructure.',
      price_label: 'Custom Quote',
      tags: 'ups,backup,power',
      cta_label: 'Get Quote',
      cta_url: '/contact',
      thumbnail_id: 2,
      order: 2,
      visible: 1,
      active: 1,
      specifications: {
        capacity: '10KVA - 500KVA',
        runtime: '15-30 minutes',
        technology: 'Double Conversion',
        efficiency: '94-96%'
      }
    }
  ],

  // ==================== SERVICES ====================
  services: [
    {
      id: 1,
      slug: 'solar-installation',
      title: 'Solar Installation & Setup',
      subtitle: 'Complete solar system installation',
      description: 'Professional installation of solar systems with full system design consultation and post-installation support.',
      price_label: 'From ₹5,00,000',
      tags: 'solar,installation,setup',
      cta_label: 'Get Started',
      cta_url: '/contact',
      thumbnail_id: 3,
      order: 1,
      visible: 1,
      active: 1,
      specifications: {
        duration: '2-4 weeks',
        team_size: 'Dedicated team',
        warranty: '5 years labor',
        monitoring: 'Lifetime monitoring included'
      }
    },
    {
      id: 2,
      slug: 'maintenance-support',
      title: 'Maintenance & Support',
      subtitle: 'Ongoing system maintenance and support',
      description: 'Annual maintenance contracts with 24/7 emergency support to ensure your systems run at peak performance.',
      price_label: 'From ₹2,000/month',
      tags: 'maintenance,support,service',
      cta_label: 'Learn More',
      cta_url: '/contact',
      thumbnail_id: 4,
      order: 2,
      visible: 1,
      active: 1,
      specifications: {
        response_time: '4 hours',
        coverage: '24x7',
        preventive_checks: 'Quarterly',
        spare_parts: 'Covered'
      }
    }
  ],

  // ==================== SITE SETTINGS ====================
  settings: {
    siteName: 'Zigma Technologies',
    tagline: 'Engineering Power. Sustaining India\'s Industry.',
    phone: '+91 (22) 1234-5678',
    email: 'info@zigma-tech.com',
    headerCtaLabel: 'Get Consultation',
    headerCtaUrl: '/contact',
    footerTagline: 'Trusted by leading businesses across India',
    emergencyLabel: 'Emergency Support',
    emergencyUrl: 'tel:+91-999-888-7777',
    copyrightText: '© 2024 Zigma Technologies. All rights reserved.',
    footerPoweredByText: 'Powered by <strong>JustX Systems</strong>',
    privacyPolicyUrl: '/privacy-policy',
    termsUrl: '/terms',
    whatsappUrl: 'https://wa.me/919998887777',
    logoImage: '/assets/logo.svg',
  },

  // ==================== THEME SETTINGS ====================
  themeSettings: [
    { key: '--orange', value: '#FF6B1A', category: 'color' },
    { key: '--navy-950', value: '#001F3F', category: 'color' },
    { key: '--gray-100', value: '#F3F4F6', category: 'color' },
    { key: '--gray-200', value: '#E5E7EB', category: 'color' },
    { key: '--cyan', value: '#06B6D4', category: 'color' },
    { key: '--green', value: '#10B981', category: 'color' },
  ],

  // ==================== NAVIGATION ====================
  menus: [
    {
      slug: 'main-nav',
      label: 'Main Navigation',
      items: [
        { label: 'Home', url: '/', order: 0 },
        { label: 'Solutions', url: '/#solutions', order: 1 },
        { label: 'About Us', url: '/about', order: 2 },
        { label: 'Services', url: '/services', order: 3 },
        { label: 'Contact', url: '/contact', order: 4 },
      ],
    },

    {
      slug: 'footer-company',
      label: 'Footer - Company',
      items: [
        { label: 'About Us', url: '/about', order: 0 },
        { label: 'Careers', url: '/careers', order: 1 },
        { label: 'Blog', url: '/blog', order: 2 },
        { label: 'Press', url: '/press', order: 3 },
      ],
    },

    {
      slug: 'footer-capabilities',
      label: 'Footer - Capabilities',
      items: [
        { label: 'Solar Solutions', url: '/solutions/solar', order: 0 },
        { label: 'UPS Systems', url: '/solutions/ups', order: 1 },
        { label: 'Engineering Design', url: '/solutions/engineering', order: 2 },
        { label: 'Maintenance', url: '/services/maintenance', order: 3 },
      ],
    },

  ],

  // ==================== PAGES ====================
  pages: [
    { id: 'home', title: 'Home', slug: 'home', template: 'home', content: 'Welcome to Zigma Technologies - Your Partner in Power Excellence' },
    { id: 'about', title: 'About Us', slug: 'about', template: 'page', content: 'Discover our 20+ year journey of innovation and expertise in power solutions' },
    { id: 'services', title: 'Services', slug: 'services', template: 'page', content: 'Comprehensive power solutions: Solar, UPS, Engineering Design, and Maintenance' },
  ],
};

// Attach the top-level sections into the home page so seed script can insert sections
const homeIdx = (defaultContent.pages || []).findIndex((p) => p.slug === 'home');
if (homeIdx >= 0) {
  // Sections in the seed DB expect a specific shape: { type, name, data, background_style, order, visible, active }
  defaultContent.pages[homeIdx].sections = (defaultContent.sections || []).map((s, i) => ({
    id: s.id || `default-${i}`,
    type: s.type,
    name: s.title || s.name || s.slug || s.type,
    data: { ...s },
    background_style: s.backgroundStyle || s.background_style || 'light',
    order: s.order || i,
    visible: 1,
    active: 1,
  }));
}
// Ensure every page object has a sections array (seed script expects iterable)
defaultContent.pages = (defaultContent.pages || []).map((p) => ({
  ...p,
  sections: p.sections || [],
}));

export const siteSettings = defaultContent.settings || {};
export const themeSettings = defaultContent.themeSettings || [];
export const menus = defaultContent.menus || [];
export const pages = defaultContent.pages || [];
export const products = defaultContent.products || [];
export const services = defaultContent.services || [];

export default defaultContent;
