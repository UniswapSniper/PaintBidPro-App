import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Missing email or password' },
                { status: 400 }
            );
        }

        const client = await db.connect();

        // Find user
        const result = await client.sql`
      SELECT * FROM users WHERE email = ${email}
    `;

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const user = result.rows[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // In a real app, generate JWT token here.
        // For now, return user info.

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
