const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS inventory(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),product_id UUID NOT NULL UNIQUE,available_qty INTEGER NOT NULL DEFAULT 0 CHECK(available_qty>=0),reserved_qty INTEGER NOT NULL DEFAULT 0 CHECK(reserved_qty>=0),reorder_level INTEGER NOT NULL DEFAULT 0,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now());`);
}

module.exports = { initSchema };
