const db = require('./lib/db.js');

async function checkSections() {
  try {
    const sections = await db.query('SELECT id, type, slug, name, data FROM sections WHERE type LIKE ? OR type LIKE ?', ['%testimonial%', '%partners%']);
    console.log('Testimonial/Partner sections from DB:');
    console.log(JSON.stringify(sections, null, 2));
    
    // Also check all sections
    const allSections = await db.query('SELECT id, type, slug, name FROM sections ORDER BY \`order\`');
    console.log('\nAll sections:');
    console.log(JSON.stringify(allSections, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkSections();
