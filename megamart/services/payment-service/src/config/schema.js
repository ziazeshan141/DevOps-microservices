const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS payments(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),order_id UUID,user_id UUID NOT NULL,amount NUMERIC(12,2) NOT NULL,currency TEXT NOT NULL DEFAULT 'USD',status TEXT NOT NULL DEFAULT 'pending',provider TEXT NOT NULL DEFAULT 'mock',provider_ref TEXT,method TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now());`);
}

module.exports = { initSchema };
