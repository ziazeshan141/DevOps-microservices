const { query } = require('./database');

async function initSchema() {
  await query(`
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS user_profiles (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), auth_user_id UUID NOT NULL UNIQUE, email TEXT NOT NULL, full_name TEXT, phone TEXT, avatar_url TEXT,
 preferences JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now());
`);
}

module.exports = { initSchema };
