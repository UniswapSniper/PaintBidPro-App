import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const client = await db.connect();

        const { rows } = await client.sql`
      SELECT * FROM bids 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

        return NextResponse.json({ bids: rows });
    } catch (error) {
        console.error('Fetch bids error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, client_id, project_name, address, room_dimensions, items, status } = body;

        if (!userId || !project_name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await db.connect();

        try {
            await client.sql`BEGIN`;

            // 1. Create Bid
            const { rows: bidRows } = await client.sql`
        INSERT INTO bids (
          user_id, 
          client_id,
          project_name, 
          address, 
          room_dimensions, 
          total_sq_ft, 
          estimated_cost, 
          status
        )
        VALUES (
          ${userId}, 
          ${client_id || null},
          ${project_name}, 
          ${address}, 
          ${JSON.stringify(room_dimensions)}, 
          ${body.total_sq_ft || 0}, 
          ${body.estimated_cost || 0}, 
          ${status || 'generated'}
        )
        RETURNING *
      `;

            const newBid = bidRows[0];
            const bidId = newBid.id;

            // 2. Insert Items (if any)
            if (items && Array.isArray(items) && items.length > 0) {
                for (const item of items) {
                    await client.sql`
            INSERT INTO bid_items (bid_id, description, quantity, unit_price)
            VALUES (${bidId}, ${item.description}, ${item.quantity}, ${item.unit_price})
          `;
                }
            }

            await client.sql`COMMIT`;

            // 3. Fetch full bid with items (optional, but good for confirmation)
            // For now just return the bid object, frontend has the items
            return NextResponse.json({ success: true, bid: newBid });

        } catch (err) {
            await client.sql`ROLLBACK`;
            throw err;
        }

    } catch (error) {
        console.error('Create bid error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
