const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS reviews(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),product_id UUID NOT NULL,user_id UUID NOT NULL,rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),title TEXT,body TEXT,status TEXT NOT NULL DEFAULT 'published',created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),UNIQUE(product_id,user_id));`);
}

module.exports = { initSchema };
