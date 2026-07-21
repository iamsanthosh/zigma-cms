const mysql = require('mysql2/promise');

(async () => {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'zigma',
    password: 'devpassword',
    database: 'zigma'
  });

  try {
    const conn = await pool.getConnection();
    
    // Get sections count and details
    const [sections] = await conn.query('SELECT id, type, name, `order` FROM sections ORDER BY `order`');
    console.log(`Total sections in DB: ${sections.length}\n`);
    
    sections.forEach((s, i) => {
      console.log(`[${i + 1}] Order: ${s.order}, Type: ${s.type}, Name: ${s.name}`);
    });
    
    conn.release();
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
})();
