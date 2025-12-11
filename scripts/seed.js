const { db } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.development.local' });

async function seed() {
  const client = await db.connect();

  try {
    // Enable UUID extension
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create users table
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log(`Created "users" table`);

    // Create clients table
    await client.sql`
      CREATE TABLE IF NOT EXISTS clients (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log(`Created "clients" table`);

    // Create bids table
    await client.sql`
      CREATE TABLE IF NOT EXISTS bids (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        client_id UUID REFERENCES clients(id),
        project_name TEXT NOT NULL,
        address TEXT,
        room_dimensions JSONB,
        total_sq_ft NUMERIC,
        estimated_cost NUMERIC,
        status TEXT CHECK (status IN ('draft', 'generated', 'sent', 'accepted')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log(`Created "bids" table`);

    // Insert a test user
    const { rows } = await client.sql`
      INSERT INTO users (email, password)
      VALUES ('demo@example.com', 'password123')
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING id;
    `;
    const userId = rows[0].id;
    console.log(`Seeded "users"`);

    // Insert test client
    await client.sql`
      INSERT INTO clients (user_id, name, email, phone, address, notes)
      VALUES 
      (${userId}, 'John Doe', 'john@example.com', '555-0123', '742 Evergreen Terrace', 'Needs exterior repaint'),
      (${userId}, 'Jane Smith', 'jane@test.com', '555-0199', '123 Maple Dr', 'Interior trim work')
    `;
    console.log(`Seeded "clients"`);

    // Only insert a bid if we just created the user or found one
    // Note: This is a simple check. If user exists, we might simulate linking a bid.
    // For now, simple connection check is good.

    console.log(`Database seeded successfully`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.end();
  }
}

seed();
