#!/usr/bin/env node
/**
 * Complete database setup script:
 * 1. Drops the database (if exists)
 * 2. Creates fresh database
 * 3. Runs migration (schema.sql)
 * 4. Creates admin user from .env variables
 * 5. Runs seed (default content)
 *
 * Usage: npm run db:setup
 *
 * Required .env variables:
 *   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 *   ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

async function log(message) {
  console.log(`\n✓ ${message}`);
}

async function error(message) {
  console.error(`\n✗ ${message}`);
}

async function dropDatabase() {
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
  await conn.end();
  await log(`Database "${process.env.DB_NAME}" dropped`);
}

async function createDatabase() {
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute(`CREATE DATABASE ${process.env.DB_NAME}`);
  await conn.end();
  await log(`Database "${process.env.DB_NAME}" created`);
}

async function runMigration() {
  const sqlPath = path.join(__dirname, '..', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const conn = await mysql.createConnection({
    ...dbConfig,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  await conn.query(sql);
  await conn.end();
  await log('Schema migration completed');
}

async function createAdminUser() {
  const adminName = process.env.ADMIN_NAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminName || !adminEmail || !adminPassword) {
    throw new Error(
      'Missing admin user credentials in .env:\n' +
      '  - ADMIN_NAME\n' +
      '  - ADMIN_EMAIL\n' +
      '  - ADMIN_PASSWORD'
    );
  }

  const conn = await mysql.createConnection({
    ...dbConfig,
    database: process.env.DB_NAME
  });

  const hash = await bcrypt.hash(adminPassword, 10);
  await conn.execute(
    `INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, 'admin', 1)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin', active = 1`,
    [adminName, adminEmail, hash]
  );

  await conn.end();
  await log(`Admin user created: ${adminEmail}`);
}

async function runSeed() {
  const defaultContent = require('../lib/defaultContent').default;
  
  const conn = await mysql.createConnection({
    ...dbConfig,
    database: process.env.DB_NAME
  });

  console.log('\n📦 Seeding content...');

  // Seed site settings
  if (defaultContent.settings) {
    for (const [key, value] of Object.entries(defaultContent.settings)) {
      await conn.execute(
        `INSERT INTO site_settings (\`key\`, \`value\`) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`,
        [key, typeof value === 'string' ? value : JSON.stringify(value)]
      );
    }
  }

  // Seed menus
  if (defaultContent.menus) {
    for (const menu of defaultContent.menus) {
      await conn.execute(
        `INSERT INTO menus (slug, label, active) VALUES (?, ?, 1)
         ON DUPLICATE KEY UPDATE label = VALUES(label)`,
        [menu.id || menu.slug, menu.name || menu.label]
      );
      const [[menuRow]] = await conn.query(`SELECT id FROM menus WHERE slug = ? OR slug = ?`, [menu.id, menu.slug]);
      if (menuRow) {
        await conn.execute(`DELETE FROM menu_items WHERE menu_id = ?`, [menuRow.id]);

        for (const item of menu.items || []) {
          await insertMenuItemRecursive(conn, menuRow.id, item, null);
        }
      }
    }
  }

  // Seed pages with sections
  if (defaultContent.pages && defaultContent.sections) {
    for (const page of defaultContent.pages) {
      const [pageResult] = await conn.execute(
        `INSERT INTO pages (slug, title, template, visible, active, publish_status)
         VALUES (?, ?, ?, 1, 1, 'published')
         ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        [page.slug, page.title, page.template || 'default']
      );

      const pageId = pageResult.insertId || (await getPageIdBySlug(conn, page.slug));

      // Clear existing sections
      await conn.execute(`DELETE FROM sections WHERE page_id = ?`, [pageId]);

      // Seed hero section to home page
      if (page.slug === 'home') {
        const heroSection = defaultContent.sections.find(s => s.type === 'hero');
        if (heroSection) {
          const [sectionResult] = await conn.execute(
            `INSERT INTO sections (page_id, type, name, data, background_style, \`order\`, visible, active)
             VALUES (?, ?, ?, ?, ?, ?, 1, 1)`,
            [
              pageId,
              heroSection.type,
              'Hero Slider',
              JSON.stringify(heroSection),
              heroSection.backgroundStyle || 'light',
              1
            ]
          );

          // Insert hero slides as items
          if (heroSection.slides) {
            for (let i = 0; i < heroSection.slides.length; i++) {
              await conn.execute(
                `INSERT INTO section_items (section_id, data, \`order\`, visible, active)
                 VALUES (?, ?, ?, 1, 1)`,
                [sectionResult.insertId, JSON.stringify(heroSection.slides[i]), i]
              );
            }
          }
        }

        // Add other sections to home page in order
        let order = 2;
        const homePageSections = defaultContent.sections.filter(s => s.type !== 'hero').sort((a, b) => a.order - b.order);
        for (const section of homePageSections) {
          const [sectionResult] = await conn.execute(
            `INSERT INTO sections (page_id, type, name, data, background_style, \`order\`, visible, active)
             VALUES (?, ?, ?, ?, ?, ?, 1, 1)`,
            [
              pageId,
              section.type,
              section.title || section.slug,
              JSON.stringify(section),
              section.backgroundStyle || 'light',
              order
            ]
          );

          // Insert section items based on type
          if (section.stats) {
            for (let i = 0; i < section.stats.length; i++) {
              await conn.execute(
                `INSERT INTO section_items (section_id, data, \`order\`, visible, active)
                 VALUES (?, ?, ?, 1, 1)`,
                [sectionResult.insertId, JSON.stringify(section.stats[i]), i]
              );
            }
          } else if (section.cards) {
            for (let i = 0; i < section.cards.length; i++) {
              await conn.execute(
                `INSERT INTO section_items (section_id, data, \`order\`, visible, active)
                 VALUES (?, ?, ?, 1, 1)`,
                [sectionResult.insertId, JSON.stringify(section.cards[i]), i]
              );
            }
          } else if (section.items) {
            for (let i = 0; i < section.items.length; i++) {
              await conn.execute(
                `INSERT INTO section_items (section_id, data, \`order\`, visible, active)
                 VALUES (?, ?, ?, 1, 1)`,
                [sectionResult.insertId, JSON.stringify(section.items[i]), i]
              );
            }
          }

          order++;
        }
      }
    }
  }

  await conn.end();
  await log('Database seeding completed');
}

async function insertMenuItemRecursive(conn, menuId, item, parentId) {
  const [result] = await conn.execute(
    `INSERT INTO menu_items (menu_id, parent_id, label, url, column_heading, visible, active, open_in_new)
     VALUES (?, ?, ?, ?, ?, 1, 1, ?)`,
    [menuId, parentId, item.label, item.url || '#', item.columnHeading || null, item.openInNew ? 1 : 0]
  );

  for (const child of item.children || []) {
    await insertMenuItemRecursive(conn, menuId, child, result.insertId);
  }
}

async function getPageIdBySlug(conn, slug) {
  const [[row]] = await conn.query(`SELECT id FROM pages WHERE slug = ?`, [slug]);
  return row?.id;
}

async function main() {
  try {
    console.log('🚀 Starting complete database setup...\n');

    await log('Dropping database...');
    try {
      await dropDatabase();
    } catch (e) {
      console.log('   (Database did not exist, skipping drop)');
    }

    await createDatabase();
    await runMigration();
    await createAdminUser();
    await runSeed();

    console.log('\n✨ Database setup complete!\n');
    console.log('🔐 Admin credentials:');
    console.log(`   Email:    ${process.env.ADMIN_EMAIL}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD}`);
    console.log('\n💡 Next: npm run dev\n');
  } catch (err) {
    await error(`Setup failed: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

main();
