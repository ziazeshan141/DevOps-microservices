const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS promotions(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),code TEXT NOT NULL UNIQUE,description TEXT,discount_type TEXT NOT NULL CHECK(discount_type IN('percent','fixed')),value NUMERIC(12,2) NOT NULL,min_order_amount NUMERIC(12,2) DEFAULT 0,max_discount NUMERIC(12,2),starts_at TIMESTAMPTZ,ends_at TIMESTAMPTZ,active BOOLEAN NOT NULL DEFAULT true,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now());`);
}

module.exports = { initSchema };
