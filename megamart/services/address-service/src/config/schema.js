const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS addresses(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_id UUID NOT NULL,label TEXT,recipient_name TEXT NOT NULL,line1 TEXT NOT NULL,line2 TEXT,city TEXT NOT NULL,state TEXT,postal_code TEXT NOT NULL,country TEXT NOT NULL,phone TEXT,is_default BOOLEAN NOT NULL DEFAULT false,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now()); CREATE INDEX IF NOT EXISTS idx_address_user ON addresses(user_id);`);
}

module.exports = { initSchema };
