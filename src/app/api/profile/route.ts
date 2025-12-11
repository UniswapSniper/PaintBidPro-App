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
      SELECT id, email, company_name, logo_url, default_rate 
      FROM users 
      WHERE id = ${userId}
    `;

        if (rows.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ profile: rows[0] });
    } catch (error) {
        console.error('Fetch profile error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, company_name, logo_url, default_rate } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const client = await db.connect();

        const { rows } = await client.sql`
      UPDATE users 
      SET company_name = ${company_name}, 
          logo_url = ${logo_url}, 
          default_rate = ${default_rate}
      WHERE id = ${userId}
      RETURNING id, email, company_name, logo_url, default_rate
    `;

        return NextResponse.json({ success: true, profile: rows[0] });

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
