const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS media(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),product_id UUID NOT NULL,url TEXT NOT NULL,alt_text TEXT,media_type TEXT NOT NULL DEFAULT 'image',sort_order INTEGER NOT NULL DEFAULT 0,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now()); CREATE INDEX IF NOT EXISTS idx_media_product ON media(product_id,sort_order);`);
}

module.exports = { initSchema };
