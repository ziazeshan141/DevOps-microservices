const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS fraud_checks(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_id UUID,order_id UUID,amount NUMERIC(12,2),score INTEGER NOT NULL,decision TEXT NOT NULL,reasons JSONB NOT NULL DEFAULT '[]'::jsonb,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now());`);
}

module.exports = { initSchema };
