const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS orders(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_id UUID NOT NULL,status TEXT NOT NULL DEFAULT 'created',currency TEXT NOT NULL DEFAULT 'USD',subtotal NUMERIC(12,2) NOT NULL,discount NUMERIC(12,2) NOT NULL DEFAULT 0,total NUMERIC(12,2) NOT NULL,address_id UUID,payment_id UUID,items JSONB NOT NULL DEFAULT '[]'::jsonb,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now()); CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id,created_at DESC);`);
}

module.exports = { initSchema };
