const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS prices(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),product_id UUID NOT NULL,currency TEXT NOT NULL DEFAULT 'USD',base_price NUMERIC(12,2) NOT NULL,sale_price NUMERIC(12,2),starts_at TIMESTAMPTZ,ends_at TIMESTAMPTZ,active BOOLEAN NOT NULL DEFAULT true,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now()); CREATE INDEX IF NOT EXISTS idx_prices_product ON prices(product_id,active);`);
}

module.exports = { initSchema };
