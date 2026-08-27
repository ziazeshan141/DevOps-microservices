const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS wishlist_items(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_id UUID NOT NULL,product_id UUID NOT NULL,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),UNIQUE(user_id,product_id));`);
}

module.exports = { initSchema };
