/**
 * Seeds the database from lib/defaultContent.js — the single source of
 * truth for default content, shared with the no-DB fallback in
 * lib/content.js. Safe to re-run: every insert is an upsert, and
 * pages/menus fully replace their child rows on each run so this script
 * always leaves the DB matching defaultContent.js exactly.
 *
 * Usage: npm run db:seed   (see package.json)
 */
require('dotenv').config();
const mysql = require('mysql2/promise');
const { siteSettings, themeSettings, menus, pages, products, services } = require('../lib/defaultContent');

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Seeding site_settings...');
  for (const [key, value] of Object.entries(siteSettings)) {
    await conn.execute(
      `INSERT INTO site_settings (\`key\`, \`value\`) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`,
      [key, JSON.stringify(value)]
    );
  }

  console.log('Seeding theme_settings...');
  for (const t of themeSettings) {
    await conn.execute(
      `INSERT INTO theme_settings (\`key\`, \`value\`, category) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), category = VALUES(category)`,
      [t.key, t.value, t.category]
    );
  }

  console.log('Seeding menus...');
  for (const menu of menus) {
    await conn.execute(
      `INSERT INTO menus (slug, label, active) VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE label = VALUES(label)`,
      [menu.slug, menu.label]
    );
    const [[menuRow]] = await conn.query(`SELECT id FROM menus WHERE slug = ?`, [menu.slug]);
    await conn.execute(`DELETE FROM menu_items WHERE menu_id = ?`, [menuRow.id]);

    let order = 0;
    for (const item of menu.items) {
      const [result] = await conn.execute(
        `INSERT INTO menu_items (menu_id, parent_id, label, url, column_heading, \`order\`, visible, active)
         VALUES (?, NULL, ?, ?, NULL, ?, 1, 1)`,
        [menuRow.id, item.label, item.url, order++]
      );
      const parentId = result.insertId;
      let childOrder = 0;
      for (const child of item.children || []) {
        await conn.execute(
          `INSERT INTO menu_items (menu_id, parent_id, label, url, column_heading, \`order\`, visible, active)
           VALUES (?, ?, ?, ?, ?, ?, 1, 1)`,
          [menuRow.id, parentId, child.label, child.url, child.column_heading || null, childOrder++]
        );
      }
    }
  }

  console.log('Seeding pages + sections...');
  for (const page of pages) {
    await conn.execute(
      `INSERT INTO pages (slug, title, template, visible, active, \`order\`, publish_status)
       VALUES (?, ?, ?, 1, 1, 0, 'published')
       ON DUPLICATE KEY UPDATE title = VALUES(title), template = VALUES(template), publish_status = 'published'`,
      [page.slug, page.title, page.template]
    );
    const [[pageRow]] = await conn.query(`SELECT id FROM pages WHERE slug = ?`, [page.slug]);
    await conn.execute(`DELETE FROM sections WHERE page_id = ?`, [pageRow.id]);

    let order = 0;
    for (const section of page.sections) {
      await conn.execute(
        `INSERT INTO sections (page_id, type, name, data, background_style, \`order\`, visible, active)
         VALUES (?, ?, ?, ?, ?, ?, 1, 1)`,
        [pageRow.id, section.type, section.name, JSON.stringify(section.data), section.background_style, order++]
      );
    }
  }

  console.log('Seeding products...');
  for (const p of products) {
    await conn.execute(
      `INSERT INTO products (slug, title, subtitle, description, specifications, price_label, tags, cta_label, cta_url, \`order\`, visible, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, 1)
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), description=VALUES(description),
         specifications=VALUES(specifications), price_label=VALUES(price_label), tags=VALUES(tags),
         cta_label=VALUES(cta_label), cta_url=VALUES(cta_url)`,
      [p.slug, p.title, p.subtitle, p.description, JSON.stringify(p.specifications), p.price_label, p.tags, p.cta_label, p.cta_url]
    );
  }

  console.log('Seeding services...');
  for (const s of services) {
    await conn.execute(
      `INSERT INTO services (slug, title, subtitle, description, specifications, price_label, tags, cta_label, cta_url, \`order\`, visible, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1, 1)
       ON DUPLICATE KEY UPDATE title=VALUES(title), subtitle=VALUES(subtitle), description=VALUES(description),
         specifications=VALUES(specifications), price_label=VALUES(price_label), tags=VALUES(tags),
         cta_label=VALUES(cta_label), cta_url=VALUES(cta_url)`,
      [s.slug, s.title, s.subtitle, s.description, JSON.stringify(s.specifications), s.price_label, s.tags, s.cta_label, s.cta_url]
    );
  }

  console.log('Seed complete.');
  await conn.end();
}

main().catch((err) => {
  console.error('Seed failed:', err && err.stack ? err.stack : err);
  process.exit(1);
});
