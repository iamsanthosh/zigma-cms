/**
 * Usage:  node scripts/create-admin.js "Full Name" you@zigma-technologies.com "StrongPassword123!"
 *
 * Run this once after `npm run db:migrate` to create the first login. It
 * hashes the password with bcrypt (same algorithm the app uses at login) and
 * inserts it directly, so you never have to hand-craft a bcrypt hash for
 * scripts/seed.js.
 */
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function main() {
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password) {
    console.error('Usage: node scripts/create-admin.js "Full Name" email password');
    process.exit(1);
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const hash = await bcrypt.hash(password, 10);
  await conn.execute(
    `INSERT INTO users (name, email, password_hash, role, active) VALUES (?, ?, ?, 'admin', 1)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = 'admin', active = 1`,
    [name, email, hash]
  );

  console.log(`Admin user ready: ${email}`);
  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
