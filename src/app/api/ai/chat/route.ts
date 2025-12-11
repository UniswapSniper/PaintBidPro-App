import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { question, context, history } = body;

        const apiKey = process.env.XAI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        const systemPrompt = `You are a friendly, professional AI assistant for PaintBidPro, a painting estimation app. 
You're currently helping a painter scan a room for an estimate. Be conversational, helpful, and brief.
Context: ${context || 'Room scanning in progress'}
Keep responses to 1-2 sentences max. Be encouraging and professional.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(history || []).map((q: string) => ({ role: 'user', content: q })),
            { role: 'user', content: question }
        ];

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages,
                max_tokens: 100,
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || "I'm here to help! What would you like to know?";

        return NextResponse.json({ response: aiResponse });
    } catch (error) {
        console.error('AI Chat error:', error);
        return NextResponse.json({
            response: "I'm having a moment. Let's continue with the scan!"
        });
    }
}
