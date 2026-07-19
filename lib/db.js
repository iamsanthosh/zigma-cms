import mysql from 'mysql2/promise';

// A single pooled connection reused across serverless/warm invocations.
// Hostinger's managed Node hosting keeps the process warm between requests,
// so a module-level singleton pool is the right pattern here (no per-request
// connect/disconnect overhead, and it survives Next.js route re-imports in dev
// via the global cache below).

let pool = global.__zigmaPool;

if (!pool) {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    dateStrings: true
  });
  global.__zigmaPool = pool;
}

export const db = pool;

/** Run a query and return just the rows. */
export async function query(sql, params = []) {
  const [rows] = await db.execute(sql, params);
  return rows;
}

/** Run a query inside a transaction; `fn` receives a connection with the same query-shape. */
export async function withTransaction(fn) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const helper = {
      query: async (sql, params = []) => (await conn.execute(sql, params))[0]
    };
    const result = await fn(helper);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
