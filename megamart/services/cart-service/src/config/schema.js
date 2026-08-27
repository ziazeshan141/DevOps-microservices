const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS cart_items(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_id UUID NOT NULL,product_id UUID NOT NULL,quantity INTEGER NOT NULL CHECK(quantity>0),created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),UNIQUE(user_id,product_id)); CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);`);
}

module.exports = { initSchema };
