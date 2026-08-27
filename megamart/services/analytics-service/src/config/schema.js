const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS analytics_events(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),user_id UUID,event_type TEXT NOT NULL,source TEXT,payload JSONB NOT NULL DEFAULT '{}'::jsonb,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now()); CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics_events(event_type,created_at DESC);`);
}

module.exports = { initSchema };
