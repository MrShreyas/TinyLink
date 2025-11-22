const { Pool } = require('pg');
require('dotenv').config();

// Use environment variable when available. The provided URL is used as a fallback.
const DATABASE_URL = process.env.DATABASE_URL;

// Configure the pool. Aiven/Postgres typically requires SSL; disable strict
// certificate validation only if you do not have the CA available.
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

async function query(text, params) {
  return pool.query(text, params);
}

async function testConnection() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT 1 AS ok');
    return res.rows[0];
  } finally {
    client.release();
  }
}

async function close() {
  await pool.end();
}

module.exports = {
  pool,
  query,
  testConnection,
  close,
};
