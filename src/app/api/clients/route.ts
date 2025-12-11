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
      SELECT * FROM clients 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

        return NextResponse.json({ clients: rows });
    } catch (error) {
        console.error('Fetch clients error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, name, email, phone, address, notes } = body;

        if (!userId || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await db.connect();

        const { rows } = await client.sql`
      INSERT INTO clients (user_id, name, email, phone, address, notes)
      VALUES (${userId}, ${name}, ${email}, ${phone}, ${address}, ${notes})
      RETURNING *
    `;

        return NextResponse.json({ success: true, client: rows[0] });

    } catch (error) {
        console.error('Create client error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
