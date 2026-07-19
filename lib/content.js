import { query } from './db';
import defaultContent from './defaultContent';

/** Parses the JSON `data` column safely, falling back to {} on bad/legacy rows. */
function parseData(raw) {
  if (!raw) return {};
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
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

function fallbackPage(slug) {
  const normalized = slug || 'home';
  const page = defaultContent.pages.find((p) => p.slug === normalized);
  if (!page) return null;
  return {
    id: 0,
    slug: page.slug,
    title: page.title,
    template: page.template,
    visible: 1,
    active: 1,
    publish_status: 'published',
    sections: page.sections.map((s, i) => ({
      id: `default-${i}`,
      type: s.type,
      name: s.name,
      data: s.data,
      background_style: s.background_style,
      order: i,
      visible: 1,
      active: 1,
      items: []
    }))
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

  const sections = sectionsRaw.map((s) => ({
    ...s,
    data: parseData(s.block_data || s.data),
    items: itemsBySection[s.id] || []
  }));

  // Published page exists but has zero sections (fresh install, admin hasn't
  // added content yet) — still better to show the real template than a
  // blank page.
  if (!sections.length) {
    const fallback = fallbackPage(normalized);
    if (fallback) return { ...page, sections: fallback.sections };
  }

  return { ...page, sections };
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
  if (!menu) return fallbackMenu(slug);

  const items = await safeQuery(
    `SELECT * FROM menu_items WHERE menu_id = ? AND visible = 1 AND active = 1 ORDER BY \`order\` ASC, id ASC`,
    [menu.id],
    []
  );

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
  if (!rows || !rows.length) return { ...defaultContent.siteSettings };

  return rows.reduce((acc, r) => {
    try {
      acc[r.key] = JSON.parse(r.value);
    } catch {
      acc[r.key] = r.value;
    }
    return acc;
  }, {});
}

export async function getThemeSettings() {
  const rows = await safeQuery(`SELECT \`key\`, \`value\` FROM theme_settings`, [], null);
  return rows && rows.length ? rows : defaultContent.themeSettings;
}

export async function getProducts({ tag } = {}) {
  const rows = await safeQuery(
    tag
      ? `SELECT * FROM products WHERE visible = 1 AND active = 1 AND FIND_IN_SET(?, tags) ORDER BY \`order\` ASC`
      : `SELECT * FROM products WHERE visible = 1 AND active = 1 ORDER BY \`order\` ASC`,
    tag ? [tag] : [],
    null
  );

  if (!rows) {
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

  if (!rows) {
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
