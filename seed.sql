-- ============================================================
-- Zigma Website Builder — seed data
-- Populates the CMS so the first `next build` renders a homepage
-- matching the original static template's content. Run AFTER
-- schema.sql (npm run db:migrate) via: npm run db:seed
-- Then create your login with: npm run create-admin -- "Name" email pass
-- ============================================================

-- ---------------- site settings ----------------
INSERT INTO site_settings (`key`, `value`) VALUES
  ('siteName', '"Zigma Technologies"'),
  ('tagline', '"POWER & ENERGY ENGINEERING"'),
  ('phone', '"+91-98765-43210"'),
  ('email', '"info@zigma-technologies.com"'),
  ('emergencyPillText', '"24x7 Emergency Support"'),
  ('emergencyPillUrl', '"tel:+919876543210"'),
  ('headerCtaLabel', '"Get a Quote"'),
  ('headerCtaUrl', '"#contact"'),
  ('footerTagline', '"Engineering power infrastructure for Indian industry since 2006 — Solar EPC, Industrial UPS, Battery Solutions, and 24x7 AMC."'),
  ('emergencyLabel', '"24x7 Emergency Line"'),
  ('emergencyUrl', '"tel:+919876543210"'),
  ('copyrightText', '"© 2026 Zigma Technologies. All rights reserved."'),
  ('newsletterEnabled', 'true'),
  ('socialLinks', '[{"platform":"linkedin","url":"https://linkedin.com"},{"platform":"instagram","url":"https://instagram.com"},{"platform":"youtube","url":"https://youtube.com"}]')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- ---------------- theme settings (design tokens) ----------------
INSERT INTO theme_settings (`key`, `value`, category) VALUES
  ('--orange', '#FF6B1A', 'color'),
  ('--navy-950', '#0A1628', 'color'),
  ('--gray-100', '#F4F6F9', 'color'),
  ('--gray-200', '#E7EBF1', 'color'),
  ('--cyan', '#2AA9D6', 'color'),
  ('--green', '#1FA05C', 'color')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- ---------------- menus ----------------
INSERT INTO menus (slug, label, active) VALUES
  ('primary-nav', 'Primary Navigation', 1),
  ('footer-company', 'Footer — Company', 1),
  ('footer-capabilities', 'Footer — Capabilities', 1)
ON DUPLICATE KEY UPDATE label = VALUES(label);

SET @primary := (SELECT id FROM menus WHERE slug = 'primary-nav');
SET @footer_company := (SELECT id FROM menus WHERE slug = 'footer-company');
SET @footer_caps := (SELECT id FROM menus WHERE slug = 'footer-capabilities');

INSERT INTO menu_items (menu_id, parent_id, label, url, column_heading, `order`, visible, active) VALUES
  (@primary, NULL, 'Who We Are', '#why', NULL, 0, 1, 1),
  (@primary, NULL, 'What We Do', '#generate', NULL, 1, 1, 1),
  (@primary, NULL, 'Projects', '#projects', NULL, 2, 1, 1),
  (@primary, NULL, 'Industries', '#industries', NULL, 3, 1, 1),
  (@primary, NULL, 'Contact', '#contact', NULL, 4, 1, 1);

SET @whoweare := (SELECT id FROM menu_items WHERE menu_id=@primary AND label='Who We Are');
INSERT INTO menu_items (menu_id, parent_id, label, url, column_heading, `order`, visible, active) VALUES
  (@primary, @whoweare, 'About Zigma', '#why', 'Company', 0, 1, 1),
  (@primary, @whoweare, '20-Year Legacy', '#legacy', 'Company', 1, 1, 1),
  (@primary, @whoweare, 'Leadership', '#', 'Company', 2, 1, 1);

INSERT INTO menu_items (menu_id, parent_id, label, url, `order`, visible, active) VALUES
  (@footer_company, NULL, 'About Us', '#why', 0, 1, 1),
  (@footer_company, NULL, 'Careers', '#', 1, 1, 1),
  (@footer_company, NULL, 'Contact', '#contact', 2, 1, 1),
  (@footer_caps, NULL, 'Solar EPC', '#generate', 0, 1, 1),
  (@footer_caps, NULL, 'Power Protection', '#protect', 1, 1, 1),
  (@footer_caps, NULL, 'AMC & Maintenance', '#maintain', 2, 1, 1),
  (@footer_caps, NULL, 'Engineering Design', '#engineering-design', 3, 1, 1);

-- ---------------- homepage ----------------
INSERT INTO pages (slug, title, template, visible, active, `order`, publish_status) VALUES
  ('home', 'Zigma Technologies | Engineering Power. Sustaining India\'s Industry.', 'default', 1, 1, 0, 'published')
ON DUPLICATE KEY UPDATE title = VALUES(title);

SET @home := (SELECT id FROM pages WHERE slug = 'home');

INSERT INTO sections (page_id, type, name, data, background_style, `order`, visible, active) VALUES
(@home, 'hero', 'Hero — Home', JSON_OBJECT(
  'autoplaySeconds', 6,
  'tags', JSON_ARRAY(
    JSON_OBJECT('label','Solar EPC & Power Plants'),
    JSON_OBJECT('label','Rooftop, Industrial & Commercial Solar'),
    JSON_OBJECT('label','Solar AMC & O&M'),
    JSON_OBJECT('label','Green Energy Solutions')
  ),
  'slides', JSON_ARRAY(
    JSON_OBJECT(
      'eyebrow', '◆ RENEWABLE ENERGY · SUSTAINABLE FUTURE',
      'headline', 'Smart Solar with Sustainable Energy Future',
      'lead', 'Complete Solar EPC, engineering, installation, monitoring, and long-term maintenance solutions for commercial, industrial, and utility-scale projects.',
      'ctaLabel', 'Explore Solar Solutions',
      'ctaUrl', '#generate'
    )
  )
), 'dark', 0, 1, 1),

(@home, 'statBar', 'Stat Counters', JSON_OBJECT(
  'stats', JSON_ARRAY(
    JSON_OBJECT('value',20,'suffix','+','label','Years of Engineering Legacy'),
    JSON_OBJECT('value',500,'suffix','+','label','Projects Delivered'),
    JSON_OBJECT('value',150,'suffix','MW','label','Solar Capacity Installed'),
    JSON_OBJECT('value',24,'suffix','x7','label','Emergency Support')
  )
), 'light', 1, 1, 1),

(@home, 'splitFeature', 'Why Zigma', JSON_OBJECT(
  'eyebrow', 'WHY ZIGMA',
  'heading', 'Two decades engineering power Indian industry depends on',
  'body', 'From rooftop solar to industrial UPS and 24x7 AMC, Zigma designs, builds, and maintains the power infrastructure that keeps plants running.',
  'imagePosition', 'right',
  'bullets', JSON_ARRAY(
    JSON_OBJECT('text','In-house engineering & design team'),
    JSON_OBJECT('text','Pan-India project execution'),
    JSON_OBJECT('text','Certified, safety-first installation crews')
  ),
  'ctaLabel', 'About Zigma', 'ctaUrl', '#why'
), 'light', 2, 1, 1),

(@home, 'splitFeature', 'Generate — Solar', JSON_OBJECT(
  'eyebrow', 'GENERATE',
  'heading', 'Solar EPC from design to commissioning',
  'body', 'Rooftop, ground-mount, and floating solar plants engineered for maximum yield and a fast payback.',
  'imagePosition', 'left',
  'ctaLabel', 'Talk to our solar team', 'ctaUrl', '#contact'
), 'iceblue', 3, 1, 1),

(@home, 'splitFeature', 'Protect — Power Backup', JSON_OBJECT(
  'eyebrow', 'PROTECT',
  'heading', 'Industrial UPS & power protection',
  'body', 'Zero-downtime backup power systems engineered around your plant''s critical load profile.',
  'imagePosition', 'right'
), 'light', 4, 1, 1),

(@home, 'splitFeature', 'Maintain — AMC', JSON_OBJECT(
  'eyebrow', 'MAINTAIN',
  'heading', '24x7 AMC & preventive maintenance',
  'body', 'Scheduled servicing, thermal imaging, and rapid-response breakdown cover across every system we install.',
  'imagePosition', 'left'
), 'iceblue', 5, 1, 1),

(@home, 'splitFeature', 'Experts', JSON_OBJECT(
  'eyebrow', 'EXPERTS',
  'heading', 'A team of certified power engineers',
  'body', 'Electrical, mechanical, and controls engineers with decades of combined industrial experience.',
  'imagePosition', 'right'
), 'light', 6, 1, 1),

(@home, 'splitFeature', 'Engineering Design', JSON_OBJECT(
  'eyebrow', 'ENGINEERING & DESIGN',
  'heading', 'Outsourced engineering design services',
  'body', 'Electrical schematics, load studies, and detailed engineering packages delivered on your timeline.',
  'imagePosition', 'left'
), 'iceblue', 7, 1, 1),

(@home, 'legacyBand', 'Legacy', JSON_OBJECT(
  'eyebrow', '20-YEAR LEGACY',
  'heading', 'Two decades of engineering milestones',
  'body', 'From a single-city electrical contractor to a pan-India power engineering firm.',
  'milestones', JSON_ARRAY(
    JSON_OBJECT('year','2006','title','Founded','description','Zigma Technologies established as an electrical contracting firm.'),
    JSON_OBJECT('year','2014','title','Solar EPC launched','description','Entered rooftop and industrial solar EPC.'),
    JSON_OBJECT('year','2026','title','150MW milestone','description','Crossed 150MW of installed solar capacity.')
  )
), 'dark', 8, 1, 1),

(@home, 'projectsGrid', 'Projects', JSON_OBJECT(
  'eyebrow', 'PROJECTS',
  'heading', 'Recent work',
  'projects', JSON_ARRAY()
), 'light', 9, 1, 1),

(@home, 'industriesGrid', 'Industries', JSON_OBJECT(
  'eyebrow', 'INDUSTRIES WE SERVE',
  'heading', 'Built for the sectors that can''t afford downtime',
  'industries', JSON_ARRAY(
    JSON_OBJECT('name','Manufacturing','description','Continuous-process power reliability.'),
    JSON_OBJECT('name','Data Centers','description','Zero-downtime critical power design.'),
    JSON_OBJECT('name','Healthcare','description','Compliant, redundant backup power.'),
    JSON_OBJECT('name','Commercial Real Estate','description','Rooftop solar & efficient power distribution.')
  )
), 'gray', 10, 1, 1),

(@home, 'productsGrid', 'Products & Services', JSON_OBJECT(
  'eyebrow', 'PRODUCTS & SERVICES',
  'heading', 'Explore what we build and maintain',
  'source', 'both',
  'columns', 3
), 'light', 11, 1, 1),

(@home, 'ctaBand', 'Contact CTA', JSON_OBJECT(
  'heading', 'Ready to engineer your next power project?',
  'body', 'Talk to our team about solar EPC, industrial power protection, or a maintenance contract.',
  'primaryCtaLabel', 'Request a Quote', 'primaryCtaUrl', '#contact',
  'secondaryCtaLabel', 'Call Us', 'secondaryCtaUrl', 'tel:+919876543210'
), 'light', 12, 1, 1);

-- ---------------- sample products & services ----------------
INSERT INTO products (slug, title, subtitle, description, specifications, price_label, tags, cta_label, cta_url, `order`, visible, active) VALUES
('rooftop-solar-epc', 'Rooftop Solar EPC', 'Commercial & industrial rooftop solar', 'End-to-end rooftop solar EPC — design, procurement, installation, and grid connection.', JSON_ARRAY(JSON_OBJECT('label','Capacity range','value','10kW – 5MW'),JSON_OBJECT('label','Warranty','value','25-year panel performance')), 'Custom quote', 'solar,epc,rooftop', 'Request a Quote', '#contact', 0, 1, 1),
('industrial-ups', 'Industrial UPS Systems', 'Zero-downtime backup power', 'Modular UPS systems sized to your critical load with N+1 redundancy options.', JSON_ARRAY(JSON_OBJECT('label','Capacity range','value','10kVA – 1MVA')), 'Custom quote', 'ups,power-protection', 'Talk to an Engineer', '#contact', 1, 1, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO services (slug, title, subtitle, description, specifications, price_label, tags, cta_label, cta_url, `order`, visible, active) VALUES
('solar-amc', 'Solar AMC & O&M', '24x7 monitoring and preventive maintenance', 'Annual maintenance contracts covering cleaning, thermal imaging, and rapid-response repairs.', JSON_ARRAY(JSON_OBJECT('label','Response time','value','< 24 hours')), 'From ₹2/kW/month', 'amc,solar,maintenance', 'Get AMC Pricing', '#contact', 0, 1, 1),
('engineering-design', 'Engineering Design Services', 'Outsourced electrical engineering', 'Load studies, single-line diagrams, and detailed engineering packages for EPC contractors.', JSON_ARRAY(), 'Custom quote', 'engineering,design', 'Discuss a Project', '#contact', 1, 1, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);
