const { db } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.development.local' });

console.log('Starting migration script...');

async function migrate() {
  console.log('Connecting to database...');
  const client = await db.connect();
  console.log('Connected.');

  try {
    // Enable uuid-ossp extension if not exists (usually helpful)
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    // Add profile columns to users table
    await client.sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS company_name TEXT,
      ADD COLUMN IF NOT EXISTS logo_url TEXT,
      ADD COLUMN IF NOT EXISTS default_rate NUMERIC;
    `;
    console.log('User profile columns ensured.');

    /* 
       Existing Schema Check:
       clients: id (uuid), user_id (uuid), name, email, phone, address, notes
       bids: id (uuid), user_id (uuid), project_name, status, estimated_cost, etc.
    */

    // 1. Ensure Bids has client_id (UUID)
    await client.sql`
        ALTER TABLE bids 
        ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id);
        `;
    console.log('Bids client_id confirmed.');

    // 2. Create bid_items (referencing bids via UUID)
    await client.sql`
      CREATE TABLE IF NOT EXISTS bid_items (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        bid_id UUID REFERENCES bids(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        quantity NUMERIC DEFAULT 1,
        unit_price NUMERIC DEFAULT 0,
        total NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED
      );
    `;
    console.log(`Table "bid_items" created/ensured.`);

  } catch (error) {
    console.error('Error migrating database:', error);
  } finally {
    await client.end();
  }
}

migrate();
