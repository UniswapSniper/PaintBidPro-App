import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File;

        if (!audioFile) {
            return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
        }

        // Create form data for OpenAI
        const openaiFormData = new FormData();
        openaiFormData.append('file', audioFile);
        openaiFormData.append('model', 'whisper-1');
        openaiFormData.append('language', 'en');

        // Call OpenAI Whisper API
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: openaiFormData,
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Whisper error:', error);
            return NextResponse.json({ transcription: '' }, { status: 200 });
        }

        const data = await response.json();
        return NextResponse.json({ transcription: data.text || '' });
    } catch (error) {
        console.error('Transcription error:', error);
        return NextResponse.json({ transcription: '' });
    }
}
