const { db } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.development.local' });

async function checkSchema() {
    const client = await db.connect();
    try {
        const result = await client.sql`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name IN ('clients', 'bids', 'bid_items');
        `;
        console.log(JSON.stringify(result.rows, null, 2));
    } catch (error) {
        console.error('Error checking schema:', error);
    } finally {
        client.end();
    }
}

checkSchema();
