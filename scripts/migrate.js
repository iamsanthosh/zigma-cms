/**
 * Runs schema.sql against the configured MySQL database.
 * Usage: npm run db:migrate   (see package.json)
 *
 * Written as a Node script (not a shell-out to the `mysql` CLI) so it works
 * the same way on Hostinger's Node hosting, CI, and any dev machine without
 * assuming the `mysql` binary is on PATH.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  const sqlPath = path.join(__dirname, '..', 'schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true // schema.sql is a batch of many CREATE/ALTER statements
  });

  console.log(`Connected to ${process.env.DB_NAME}@${process.env.DB_HOST}. Running schema.sql...`);
  await conn.query(sql);
  console.log('Schema migration complete.');

  await conn.end();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
