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

        // Check if user exists
        const existingUser = await client.sql`
      SELECT id FROM users WHERE email = ${email}
    `;

        if (existingUser.rowCount && existingUser.rowCount > 0) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await client.sql`
      INSERT INTO users (email, password)
      VALUES (${email}, ${hashedPassword})
      RETURNING id, email, created_at
    `;

        const user = result.rows[0];

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
