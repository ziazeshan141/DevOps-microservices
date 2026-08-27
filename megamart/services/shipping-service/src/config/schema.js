const { query } = require('./database');

async function initSchema() {
  await query(`CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS shipments(id UUID PRIMARY KEY DEFAULT gen_random_uuid(),order_id UUID NOT NULL UNIQUE,user_id UUID NOT NULL,address_id UUID,status TEXT NOT NULL DEFAULT 'created',carrier TEXT NOT NULL DEFAULT 'MegaShip',tracking_number TEXT,estimated_delivery DATE,created_at TIMESTAMPTZ NOT NULL DEFAULT now(),updated_at TIMESTAMPTZ NOT NULL DEFAULT now());`);
}

module.exports = { initSchema };
