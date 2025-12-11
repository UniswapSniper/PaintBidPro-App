import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, voice = 'alloy' } = body;

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
        }

        // Call OpenAI TTS API
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'tts-1-hd', // High quality model
                input: text,
                voice: voice, // alloy, echo, fable, onyx, nova, shimmer
                response_format: 'mp3',
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenAI TTS error:', error);
            return NextResponse.json({ error: 'TTS failed' }, { status: 500 });
        }

        // Return audio as base64
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        return NextResponse.json({
            audio: base64Audio,
            format: 'mp3'
        });
    } catch (error) {
        console.error('TTS error:', error);
        return NextResponse.json({ error: 'TTS failed' }, { status: 500 });
    }
}
