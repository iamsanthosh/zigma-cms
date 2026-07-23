import { query } from './db';
import defaultContent from './defaultContent';


/** Parses the JSON `data` column safely, falling back to {} on bad/legacy rows. */
function parseData(raw) {
  if (!raw) return {};
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    // If parsed data has features array, check if features are stringified
    if (parsed.features && Array.isArray(parsed.features) && parsed.features[0] && typeof parsed.features[0] === 'string') {
      parsed.features = parsed.features.map(f => typeof f === 'string' ? JSON.parse(f) : f);
    }
    return parsed;
  } catch {
    return {};
  }
}

/**
 * Every exported function below is DB-first, fallback-second: if the query
 * throws (no DB configured yet, connection refused, etc.) or — for the
 * homepage specifically — returns nothing, we fall back to
 * lib/defaultContent.js so the public site still renders the real template
 * content instead of an error page or a blank shell. This is what satisfies
 * "must render exactly like the template even with no DB / no data".
 */
async function safeQuery(sql, params, fallback) {
  try {
    return await query(sql, params);
  } catch (err) {
    console.error('[content] DB query failed, using fallback content:', err.message);
    return fallback;
  }
}

/** Get default content for a section type (for fallback/merge) - prioritize by slug match */
function getDefaultSection(type, slug) {
  if (slug) {
    // Try to find by both type and slug
    const found = defaultContent.sections.find((s) => s.type === type && s.slug === slug);
    return found;
  }
  // Fall back to first match by type only
  const found = defaultContent.sections.find((s) => s.type === type);
  return found;
}

/** Merge DB section with default content items when DB items are missing */
function enrichSectionWithDefaults(dbSection) {
  // Copy section_items from DB into the appropriate features/cards/items/stats field
  const mergedData = { ...dbSection.data };
  
  if (dbSection.type === 'splitFeature') {
    // SplitFeature data can come from either:
    // 1. section.data.features JSON field (preferred - where admin data is saved)
    // 2. section.items table (if configured there)
    // 3. Default content (fallback)
    if (mergedData.features && mergedData.features.length > 0) {
      // Already have features in data JSON - don't override with defaults
    } else if (dbSection.items && dbSection.items.length > 0) {
      mergedData.features = dbSection.items.map(item => ({
        title: item.data?.title || item.title || '',
        description: item.data?.description || item.description || '',
        iconHtml: item.data?.iconHtml || item.iconHtml || ''
      }));
    } else {
      // Fall back to defaults if no items in DB - match by slug for correct default
      const defaultSection = getDefaultSection(dbSection.type, dbSection.slug);
      if (defaultSection?.features) {
        mergedData.features = defaultSection.features;
      }
    }
  } else if (dbSection.type === 'statBar' || dbSection.type === 'stat-bar') {
    // StatBar data can come from either:
    // 1. section.data.stats JSON field (preferred - where admin data is saved)
    // 2. section.items table (if configured there)
    // 3. Default content (fallback)
    if (mergedData.stats && mergedData.stats.length > 0) {
      // Already have stats in data JSON - don't override with defaults
    } else if (dbSection.items && dbSection.items.length > 0) {
      mergedData.stats = dbSection.items.map(item => ({
        label: item.data?.label || item.label || '',
        value: item.data?.value || item.value || '',
        iconHtml: item.data?.iconHtml || item.iconHtml || ''
      }));
    } else {
      const defaultSection = getDefaultSection(dbSection.type);
      if (defaultSection?.stats) {
        mergedData.stats = defaultSection.stats;
      }
    }
  } else if (dbSection.type === 'hero') {
    if (mergedData.slides && mergedData.slides.length > 0) {
      // Data already in mergedData from section.data.slides - don't override
    } else if (dbSection.items && dbSection.items.length > 0) {
      mergedData.slides = dbSection.items;
    } else {
      const defaultSection = getDefaultSection(dbSection.type);
      if (defaultSection?.slides) {
        mergedData.slides = defaultSection.slides;
      }
    }
  } else if (dbSection.type === 'whyGrid') {
    // WhyGrid data can come from either:
    // 1. section.data.cards JSON field (preferred - where admin data is saved)
    // 2. section.items table (if configured there)
    // 3. Default content (fallback)
    if (mergedData.cards && mergedData.cards.length > 0) {
      // Already have cards in data JSON - don't override with defaults
    } else if (dbSection.items && dbSection.items.length > 0) {
      mergedData.cards = dbSection.items;
    } else {
      const defaultSection = getDefaultSection(dbSection.type);
      if (defaultSection?.cards) {
        mergedData.cards = defaultSection.cards;
      }
    }
  } else if ((dbSection.type === 'industriesGrid' || dbSection.type === 'indGrid')) {
    if (mergedData.industries && mergedData.industries.length > 0) {
      // Data already in mergedData from section.data.industries
    } else if (dbSection.items && dbSection.items.length > 0) {
      mergedData.industries = dbSection.items;
    } else {
      const defaultSection = getDefaultSection(dbSection.type);
      if (defaultSection?.industries) {
        mergedData.industries = defaultSection.industries;
      }
    }
  } else if ((dbSection.type === 'testimonials' || dbSection.type === 'testimonial')) {
    // Testimonials data can come from either:
    // 1. section.data.items JSON field (where admin saves data)
    // 2. section.data.slides JSON field (legacy/default structure)
    // 3. section.items table (if configured there)
    // 4. Default content (fallback)
    
    // Prioritize items (admin data) over slides (legacy/default)
    if (mergedData.items && Array.isArray(mergedData.items) && mergedData.items.length > 0) {
      // Already have items in data JSON - don't override with defaults
    } else if (mergedData.slides && Array.isArray(mergedData.slides) && mergedData.slides.length > 0) {
      // Have slides in data JSON, map to items
      mergedData.items = mergedData.slides;
    } else if (dbSection.items && Array.isArray(dbSection.items) && dbSection.items.length > 0) {
      mergedData.items = dbSection.items;
    } else {
      // Fall back to defaults
      const defaultSection = getDefaultSection(dbSection.type, dbSection.slug);
      if (defaultSection?.slides) {
        mergedData.items = defaultSection.slides;
      } else if (defaultSection?.items) {
        mergedData.items = defaultSection.items;
      }
    }
  } else if ((dbSection.type === 'projectsGrid' || dbSection.type === 'projGrid')) {
    // Projects data can come from either:
    // 1. section.items table (if configured there)
    // 2. section.data.projects JSON field (preferred - where admin data is saved)
    if (dbSection.items && dbSection.items.length > 0) {
      mergedData.projects = dbSection.items;
    } else if (mergedData.projects && mergedData.projects.length > 0) {
      // Already have projects in data JSON - don't override with defaults
    } else {
      // Fall back to defaults only if no projects found anywhere
      const defaultSection = getDefaultSection(dbSection.type, dbSection.slug);
      if (defaultSection?.projects) {
        mergedData.projects = defaultSection.projects;
      }
    }
  } else if ((dbSection.type === 'partnersMarquee' || dbSection.type === 'partners')) {
    // Partners data can come from either:
    // 1. section.data.logos JSON field (preferred - where admin data is saved)
    // 2. section.items table (if configured there)
    // 3. Default content (fallback)
    if (mergedData.logos && mergedData.logos.length > 0) {
      // Already have logos in data JSON - don't override with defaults
    } else if (dbSection.items && dbSection.items.length > 0) {
      mergedData.logos = dbSection.items;
    } else {
      const defaultSection = getDefaultSection(dbSection.type);
      if (defaultSection?.logos) {
        mergedData.logos = defaultSection.logos;
      }
    }
  } else if (dbSection.type === 'legacyBand') {
    // LegacyBand data can come from either:
    // 1. section.data.milestones JSON field (preferred - where admin data is saved)
    // 2. section.items table (if configured there)
    // 3. Default content (fallback)
    if (mergedData.milestones && mergedData.milestones.length > 0) {
      // Already have milestones in data JSON - don't override with defaults
    } else if (dbSection.items && dbSection.items.length > 0) {
      mergedData.milestones = dbSection.items;
    } else {
      const defaultSection = getDefaultSection(dbSection.type);
      if (defaultSection?.milestones) {
        mergedData.milestones = defaultSection.milestones;
      }
    }
  } else if (dbSection.type === 'timeline') {
    // Timeline stores items in data.items, not in section_items table
    // Only use defaults if data.items is missing/empty
    if (!mergedData.items || mergedData.items.length === 0) {
      const defaultSection = getDefaultSection(dbSection.type);
      if (defaultSection?.items) {
        mergedData.items = defaultSection.items;
      }
    }
  }

  return {
    ...dbSection,
    data: mergedData
  };
}

function fallbackPage(slug) {
  const normalized = slug || 'home';
  const page = defaultContent.pages.find((p) => p.slug === normalized);
  if (!page) return null;

  // Build sections from the top-level defaultContent.sections (template sections)
  const sectionsSource = defaultContent.sections || [];
  const sections = sectionsSource.map((s, i) => {
    // Normalize data shape expected by components
    const data = { ...s };

    if (s.type === 'hero') {
      data.slides = (s.slides || []).map((slide) => ({
        eyebrow: slide.subtitle || slide.eyebrow || slide.tag_label || undefined,
        headline: slide.title || slide.headline || undefined,
        lead: slide.description || slide.lead || undefined,
        ctaLabel: slide.cta_label || slide.ctaLabel || undefined,
        ctaUrl: slide.cta_url || slide.ctaUrl || undefined,
        tagPillColor: slide.tagPillColor || slide.tagPillColor === '' ? slide.tagPillColor : (s.tagPillHoverColor || s.tagPillColor || undefined),
        backgroundImage: { url: slide.image_url || (slide.backgroundImage && slide.backgroundImage.url) || undefined, alt: slide.image_alt || slide.title || '' },
        backgroundVideo: slide.backgroundVideo || slide.video || null,
        overlayOpacity: slide.overlayOpacity ?? slide.overlay_opacity ?? undefined,
        tags: (slide.tags && slide.tags.length) ? slide.tags.map(t => (typeof t === 'string' ? { label: t } : { label: t.label || t })) : (slide.tag_label ? [{ label: slide.tag_label }] : []),
      }));
    }

    // Map title to heading for sections that use heading in schema but title in default content
    if (s.title && !data.heading) {
      data.heading = s.title;
    }
    if (s.subtitle && !data.body) {
      data.body = s.subtitle;
    }
    if (s.description && !data.body) {
      data.body = s.description;
    }

    // Ensure cards/stats/items are consistent
    if (s.cards && !Array.isArray(data.cards)) data.cards = s.cards;
    if (s.stats && !Array.isArray(data.stats)) data.stats = s.stats;
    if (s.items && !Array.isArray(data.items)) data.items = s.items;
    
    // Handle timeline items
    if (s.type === 'timeline' && s.items && !Array.isArray(data.items)) {
     data.items = s.items;
    }

    return {
      id: `default-${i}`,
      type: s.type,
      name: s.title || s.name || s.slug || s.type,
      data,
      background_style: s.backgroundStyle || s.background_style || 'light',
      order: i,
      visible: 1,
      active: 1,
      // Attach common item arrays if present (slides, stats, cards, items)
      items: data.slides || data.stats || data.cards || data.items || []
    };
  });

  return {
    id: 0,
    slug: page.slug,
    title: page.title,
    template: page.template,
    visible: 1,
    active: 1,
    publish_status: 'published',
    sections
  };
}

export async function getPageBySlug(slug) {
  const normalized = slug || 'home';

  const pages = await safeQuery(
    `SELECT * FROM pages WHERE slug = ? AND visible = 1 AND active = 1 AND publish_status = 'published' LIMIT 1`,
    [normalized],
    null
  );

  // DB unreachable (safeQuery caught) OR DB reachable but this page hasn't
  // been created/published yet — either way, fall back for known slugs so
  // the template's real content still renders.
  if (!pages || !pages[0]) {
    return fallbackPage(normalized);
  }

  const page = pages[0];

  const sectionsRaw = await safeQuery(
    `SELECT s.*, rb.data AS block_data
     FROM sections s
     LEFT JOIN reusable_blocks rb ON rb.id = s.reusable_block_id
     WHERE s.page_id = ? AND s.visible = 1 AND s.active = 1
     ORDER BY s.\`order\` ASC, s.id ASC`,
    [page.id],
    []
  );

  const sectionIds = sectionsRaw.map((s) => s.id);
  let itemsBySection = {};
  if (sectionIds.length) {
    const placeholders = sectionIds.map(() => '?').join(',');
    const items = await safeQuery(
      `SELECT * FROM section_items WHERE section_id IN (${placeholders}) AND visible = 1 AND active = 1 ORDER BY \`order\` ASC, id ASC`,
      sectionIds,
      []
    );
    itemsBySection = items.reduce((acc, item) => {
      (acc[item.section_id] ||= []).push({ ...item, data: parseData(item.data) });
      return acc;
    }, {});
  }

  const sections = sectionsRaw
    .map((s) => {
      const parsed = parseData(s.block_data || s.data);
      if (parsed.features && Array.isArray(parsed.features) && parsed.features[0]) {
        if (typeof parsed.features[0] === 'string') {
          parsed.features = parsed.features.map(f => typeof f === 'string' ? JSON.parse(f) : f);
        }
      }
      return {
        ...s,
        data: parsed,
        items: itemsBySection[s.id] || []
      };
    })
    .map(enrichSectionWithDefaults);  // Merge in defaults when items are missing

  // Published page exists but has zero sections (fresh install, admin hasn't
  // added content yet) — still better to show the real template than a
  // blank page.
  if (!sections.length) {
    const fallback = fallbackPage(normalized);
    if (fallback) return { ...page, sections: fallback.sections };
  }

  return { ...page, sections, theme_id: page.theme_id };
}

export async function getAllPublishedSlugs() {
  const rows = await safeQuery(
    `SELECT slug FROM pages WHERE visible = 1 AND active = 1 AND publish_status = 'published'`,
    [],
    defaultContent.pages.map((p) => ({ slug: p.slug }))
  );
  return rows.map((r) => r.slug);
}

function fallbackMenu(slug) {
  const menu = defaultContent.menus.find((m) => m.slug === slug);
  if (!menu) return null;
  return {
    id: 0,
    slug: menu.slug,
    label: menu.label,
    active: 1,
    items: menu.items.map((item, i) => ({
      id: `default-${i}`,
      label: item.label,
      url: item.url,
      children: (item.children || []).map((child, ci) => ({
        id: `default-${i}-${ci}`,
        label: child.label,
        url: child.url,
        column_heading: child.column_heading || null
      }))
    }))
  };
}

export async function getMenu(slug) {
  const menus = await safeQuery(`SELECT * FROM menus WHERE slug = ? AND active = 1 LIMIT 1`, [slug], null);
  const menu = menus && menus[0];
  
  // If DB query failed, use fallback
  if (!menu) return fallbackMenu(slug);

  const items = await safeQuery(
    `SELECT * FROM menu_items WHERE menu_id = ? AND visible = 1 AND active = 1 ORDER BY \`order\` ASC, id ASC`,
    [menu.id],
    []
  );

  // If menu exists in DB but has no items, try to use defaults as fallback
  if (!items.length) {
    const fallback = fallbackMenu(slug);
    if (fallback) return { ...menu, items: fallback.items };
  }

  const byParent = items.reduce((acc, item) => {
    const key = item.parent_id || 'root';
    (acc[key] ||= []).push(item);
    return acc;
  }, {});

  const attachChildren = (item) => ({ ...item, children: byParent[item.id] || [] });

  return { ...menu, items: (byParent.root || []).map(attachChildren) };
}

export async function getSiteSettings() {
  const rows = await safeQuery(`SELECT \`key\`, \`value\` FROM site_settings`, [], null);
  
  // If DB query failed or returned empty, use defaults
  if (!rows || !rows.length) {
    return { ...defaultContent.settings };
  }

  // Merge DB values with defaults (DB takes precedence)
  const dbSettings = rows.reduce((acc, r) => {
    try {
      acc[r.key] = JSON.parse(r.value);
    } catch {
      acc[r.key] = r.value;
    }
    return acc;
  }, {});
  
  return { ...defaultContent.settings, ...dbSettings };
}

export async function getThemes() {
  const rows = await safeQuery(
    `SELECT * FROM themes WHERE is_active = 1 ORDER BY is_default DESC, name ASC`,
    [],
    []
  );
  return rows || [];
}

export async function getThemeById(themeId) {
  const rows = await safeQuery(
    `SELECT * FROM themes WHERE id = ? AND is_active = 1 LIMIT 1`,
    [themeId],
    null
  );
  return rows && rows[0];
}

export async function getThemeSettingsByThemeId(themeId) {
  const rows = await safeQuery(
    `SELECT \`key\`, \`value\`, category FROM theme_settings WHERE theme_id = ?`,
    [themeId],
    []
  );
  return rows || [];
}

export async function getThemeMedia(themeId) {
  const rows = await safeQuery(
    `SELECT tm.*, ma.url, ma.alt_text, ma.type 
     FROM theme_media tm 
     JOIN media_assets ma ON tm.media_id = ma.id 
     WHERE tm.theme_id = ? 
     ORDER BY tm.role, tm.\`order\` ASC`,
    [themeId],
    []
  );
  return rows || [];
}

export async function getThemeComponentStyles(themeId) {
  // Query the new theme_components table instead of the old theme_component_styles
  const rows = await safeQuery(
    `SELECT * FROM theme_components WHERE theme_id = ? AND is_visible = 1 ORDER BY component_type, component_name ASC`,
    [themeId],
    []
  );
  return rows || [];
}

export async function getGlobalThemeId() {
  const rows = await safeQuery(
    `SELECT \`value\` FROM site_settings WHERE \`key\` = 'global_theme_id' LIMIT 1`,
    [],
    null
  );
  return rows && rows[0] ? parseInt(rows[0].value) : null;
}

export async function getActiveTheme(pageThemeId = null) {
  // Precedence: page theme > global theme > default theme
  let themeId = pageThemeId;
  
  if (!themeId) {
    themeId = await getGlobalThemeId();
  }
  
  if (!themeId) {
    // Get default theme
    const defaultTheme = await safeQuery(
      `SELECT id FROM themes WHERE is_default = 1 AND is_active = 1 LIMIT 1`,
      [],
      null
    );
    themeId = defaultTheme && defaultTheme[0] ? defaultTheme[0].id : null;
  }
  
  if (!themeId) {
    return null;
  }
  
  const theme = await getThemeById(themeId);
  if (!theme) {
    return null;
  }
  
  const [settings, media, componentStyles] = await Promise.all([
    getThemeSettingsByThemeId(themeId),
    getThemeMedia(themeId),
    getThemeComponentStyles(themeId)
  ]);
  
  return {
    ...theme,
    settings,
    media,
    componentStyles
  };
}

export async function getProducts({ tag } = {}) {
  const rows = await safeQuery(
    tag
      ? `SELECT * FROM products WHERE visible = 1 AND active = 1 AND FIND_IN_SET(?, tags) ORDER BY \`order\` ASC`
      : `SELECT * FROM products WHERE visible = 1 AND active = 1 ORDER BY \`order\` ASC`,
    tag ? [tag] : [],
    null
  );

  // If DB query failed or returned empty, use defaults (DB-first, but with sensible fallback)
  if (!rows || !rows.length) {
    const fallback = defaultContent.products.filter((p) => !tag || (p.tags || '').split(',').includes(tag));
    return fallback.map((p, i) => ({ id: `default-${i}`, slug: p.slug, ...p }));
  }

  return rows.map((r) => ({ ...r, specifications: parseData(r.specifications) }));
}

export async function getServices({ tag } = {}) {
  const rows = await safeQuery(
    tag
      ? `SELECT * FROM services WHERE visible = 1 AND active = 1 AND FIND_IN_SET(?, tags) ORDER BY \`order\` ASC`
      : `SELECT * FROM services WHERE visible = 1 AND active = 1 ORDER BY \`order\` ASC`,
    tag ? [tag] : [],
    null
  );

  // If DB query failed or returned empty, use defaults (DB-first, but with sensible fallback)
  if (!rows || !rows.length) {
    const fallback = defaultContent.services.filter((s) => !tag || (s.tags || '').split(',').includes(tag));
    return fallback.map((s, i) => ({ id: `default-${i}`, slug: s.slug, ...s }));
  }

  return rows.map((r) => ({ ...r, specifications: parseData(r.specifications) }));
}

export async function getItemBySlug(type, slug) {
  const table = type === 'service' ? 'services' : 'products';
  const rows = await safeQuery(`SELECT * FROM ${table} WHERE slug = ? AND visible = 1 AND active = 1 LIMIT 1`, [slug], null);
  const item = rows && rows[0];

  if (!item) {
    const source = type === 'service' ? defaultContent.services : defaultContent.products;
    const fallback = source.find((i) => i.slug === slug);
    return fallback ? { id: 0, ...fallback, media: [] } : null;
  }

  const media = await safeQuery(
    `SELECT ma.* FROM item_media im JOIN media_assets ma ON ma.id = im.media_id
     WHERE im.item_type = ? AND im.item_id = ? ORDER BY im.\`order\` ASC`,
    [type, item.id],
    []
  );
  return { ...item, specifications: parseData(item.specifications), media };
}
