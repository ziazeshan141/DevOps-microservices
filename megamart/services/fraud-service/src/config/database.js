const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.on('error', (err) => console.error('Unexpected PostgreSQL pool error', err));

async function query(text, params) {
  return pool.query(text, params);
}

async function ready() {
  await pool.query('SELECT 1');
  return true;
}

module.exports = { pool, query, ready };
