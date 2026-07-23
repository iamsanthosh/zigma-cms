/**
 * Migration script: Create footer menus
 * Run with: node scripts/create-footer-menus.js
 * 
 * This creates two footer menus from the admin interface:
 * - footer-company: About, Careers, Blog, Press
 * - footer-capabilities: Solar, UPS, Engineering, Maintenance
 */

import { query } from '../lib/db.js';

async function migrate() {
  try {
    console.log('🔄 Creating footer menus...');

    // Delete old footer-nav if it exists
    console.log('  Deleting old footer-nav menu (if exists)...');
    const oldMenu = await query('SELECT id FROM menus WHERE slug = ?', ['footer-nav']);
    if (oldMenu.length > 0) {
      await query('DELETE FROM menu_items WHERE menu_id = ?', [oldMenu[0].id]);
      await query('DELETE FROM menus WHERE slug = ?', ['footer-nav']);
      console.log('  ✓ Deleted old footer-nav');
    }

    // Create footer-company menu
    console.log('  Creating footer-company menu...');
    await query(
      'INSERT INTO menus (slug, label, active) VALUES (?, ?, ?)',
      ['footer-company', 'Footer - Company', 1]
    );
    const [companyMenu] = await query('SELECT id FROM menus WHERE slug = ?', ['footer-company']);
    const companyId = companyMenu.id;

    // Add company menu items
    const companyItems = [
      { label: 'About Us', url: '/about', order: 0 },
      { label: 'Careers', url: '/careers', order: 1 },
      { label: 'Blog', url: '/blog', order: 2 },
      { label: 'Press', url: '/press', order: 3 },
    ];

    for (const item of companyItems) {
      await query(
        'INSERT INTO menu_items (menu_id, label, url, order, visible, active) VALUES (?, ?, ?, ?, ?, ?)',
        [companyId, item.label, item.url, item.order, 1, 1]
      );
    }
    console.log(`  ✓ Created footer-company with ${companyItems.length} items`);

    // Create footer-capabilities menu
    console.log('  Creating footer-capabilities menu...');
    await query(
      'INSERT INTO menus (slug, label, active) VALUES (?, ?, ?)',
      ['footer-capabilities', 'Footer - Capabilities', 1]
    );
    const [capMenu] = await query('SELECT id FROM menus WHERE slug = ?', ['footer-capabilities']);
    const capId = capMenu.id;

    // Add capabilities menu items
    const capItems = [
      { label: 'Solar Solutions', url: '/solutions/solar', order: 0 },
      { label: 'UPS Systems', url: '/solutions/ups', order: 1 },
      { label: 'Engineering Design', url: '/solutions/engineering', order: 2 },
      { label: 'Maintenance', url: '/services/maintenance', order: 3 },
    ];

    for (const item of capItems) {
      await query(
        'INSERT INTO menu_items (menu_id, label, url, order, visible, active) VALUES (?, ?, ?, ?, ?, ?)',
        [capId, item.label, item.url, item.order, 1, 1]
      );
    }
    console.log(`  ✓ Created footer-capabilities with ${capItems.length} items`);

    console.log('\n✅ Footer menus created successfully!');
    console.log('\n📋 You can now manage these menus from Admin → Menus & Navigation:');
    console.log('   1. main-nav (Header navigation)');
    console.log('   2. footer-company (Company column)');
    console.log('   3. footer-capabilities (Capabilities column)');
    console.log('\n🌐 Refresh your site at http://localhost:3000/ to see the changes');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating footer menus:', error.message);
    process.exit(1);
  }
}

migrate();
