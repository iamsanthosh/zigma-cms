/**
 * Migration script: Migrate existing theme_settings to new multi-theme structure
 * 
 * This script:
 * 1. Creates a default theme from existing theme_settings
 * 2. Migrates all existing theme_settings rows to the new theme_settings table
 * 3. Sets the new theme as default and global
 * 
 * Usage: node scripts/migrate-themes.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Starting theme migration...');

  try {
    // Check if themes table exists and has data
    const [themes] = await conn.query(`SELECT COUNT(*) as count FROM themes`);
    if (themes[0].count > 0) {
      console.log('Themes table already has data. Skipping migration.');
      console.log('If you want to re-migrate, please truncate the themes table first.');
      await conn.end();
      return;
    }

    // Check if old theme_settings table has data
    const [oldSettings] = await conn.query(`SELECT COUNT(*) as count FROM theme_settings WHERE theme_id IS NULL`);
    if (oldSettings[0].count === 0) {
      console.log('No legacy theme_settings found. Creating default theme...');
      
      // Create a default theme with no settings
      const [result] = await conn.execute(
        `INSERT INTO themes (name, slug, description, is_default, is_active) VALUES (?, ?, ?, ?, ?)`,
        ['Default Theme', 'default', 'Default theme with no custom settings', 1, 1]
      );
      
      console.log(`Created default theme with ID: ${result.insertId}`);
      
      // Set as global theme
      await conn.execute(
        `INSERT INTO site_settings (\`key\`, \`value\`) VALUES ('global_theme_id', ?) ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`,
        [String(result.insertId)]
      );
      
      console.log('Set as global theme');
      await conn.end();
      return;
    }

    // Get all legacy theme_settings
    const [legacySettings] = await conn.query(`SELECT * FROM theme_settings WHERE theme_id IS NULL`);
    console.log(`Found ${legacySettings.length} legacy theme settings`);

    // Create default theme
    const [themeResult] = await conn.execute(
      `INSERT INTO themes (name, slug, description, is_default, is_active) VALUES (?, ?, ?, ?, ?)`,
      ['Default Theme', 'default', 'Migrated from legacy theme_settings', 1, 1]
    );
    
    const themeId = themeResult.insertId;
    console.log(`Created default theme with ID: ${themeId}`);

    // Migrate settings to new theme_settings table
    for (const setting of legacySettings) {
      await conn.execute(
        `INSERT INTO theme_settings (theme_id, \`key\`, \`value\`, category) VALUES (?, ?, ?, ?)`,
        [themeId, setting.key, setting.value, setting.category || 'color']
      );
    }
    
    console.log(`Migrated ${legacySettings.length} settings to theme ${themeId}`);

    // Set as global theme
    await conn.execute(
      `INSERT INTO site_settings (\`key\`, \`value\`) VALUES ('global_theme_id', ?) ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`)`,
      [String(themeId)]
    );
    
    console.log('Set as global theme');

    // Drop old theme_settings rows (optional - keeping for safety)
    // await conn.execute(`DELETE FROM theme_settings WHERE theme_id IS NULL`);
    // console.log('Cleaned up legacy theme_settings');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await conn.end();
  }
}

main().catch(console.error);
