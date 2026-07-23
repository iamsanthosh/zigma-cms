#!/usr/bin/env node
/**
 * Quick fix: POST to admin API to create footer menus
 * Run from: npm run create-menus
 */

const BASE_URL = 'http://localhost:3000';

async function api(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
  return data;
}

async function setup() {
  try {
    console.log('🔄 Creating footer menus via API...\n');

    // Step 1: Get existing menus
    console.log('📋 Fetching existing menus...');
    const menus = await api('GET', '/api/admin/menus');
    console.log(`  Found ${menus.length} menu(s):`, menus.map(m => `${m.slug}`).join(', '));

    // Delete old footer-nav if exists
    const footerNav = menus.find(m => m.slug === 'footer-nav');
    if (footerNav) {
      console.log('\n🗑️  Removing old footer-nav menu...');
      // Delete its items first
      const items = await api('GET', `/api/admin/menu-items?menu_id=${footerNav.id}`);
      for (const item of items) {
        await api('DELETE', `/api/admin/menu-items/${item.id}`);
      }
      // Delete the menu
      await api('DELETE', `/api/admin/menus/${footerNav.id}`);
      console.log('  ✓ Deleted footer-nav');
    }

    // Step 2: Create footer-company menu
    console.log('\n📝 Creating footer-company menu...');
    const companyMenu = await api('POST', '/api/admin/menus', {
      slug: 'footer-company',
      label: 'Footer - Company',
      active: 1
    });
    console.log(`  ✓ Created (ID: ${companyMenu.id})`);

    // Add company items
    const companyItems = [
      { label: 'About Us', url: '/about' },
      { label: 'Careers', url: '/careers' },
      { label: 'Blog', url: '/blog' },
      { label: 'Press', url: '/press' },
    ];
    for (let i = 0; i < companyItems.length; i++) {
      await api('POST', '/api/admin/menu-items', {
        menu_id: companyMenu.id,
        label: companyItems[i].label,
        url: companyItems[i].url,
        order: i,
        visible: 1,
        active: 1
      });
    }
    console.log(`  ✓ Added ${companyItems.length} items`);

    // Step 3: Create footer-capabilities menu
    console.log('\n📝 Creating footer-capabilities menu...');
    const capMenu = await api('POST', '/api/admin/menus', {
      slug: 'footer-capabilities',
      label: 'Footer - Capabilities',
      active: 1
    });
    console.log(`  ✓ Created (ID: ${capMenu.id})`);

    // Add capability items
    const capItems = [
      { label: 'Solar Solutions', url: '/solutions/solar' },
      { label: 'UPS Systems', url: '/solutions/ups' },
      { label: 'Engineering Design', url: '/solutions/engineering' },
      { label: 'Maintenance', url: '/services/maintenance' },
    ];
    for (let i = 0; i < capItems.length; i++) {
      await api('POST', '/api/admin/menu-items', {
        menu_id: capMenu.id,
        label: capItems[i].label,
        url: capItems[i].url,
        order: i,
        visible: 1,
        active: 1
      });
    }
    console.log(`  ✓ Added ${capItems.length} items`);

    console.log('\n✅ Success! All footer menus created.\n');
    console.log('📋 You can now manage these from Admin → Menus & Navigation:');
    console.log('   • main-nav (Header)');
    console.log('   • footer-company (Company column)');
    console.log('   • footer-capabilities (Capabilities column)\n');
    console.log('🌐 Refresh http://localhost:3000/ to see changes');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Your dev server is running (npm run dev)');
    console.error('   2. It\'s accessible at http://localhost:3000');
    console.error('   3. Database is connected');
    process.exit(1);
  }
}

setup();
