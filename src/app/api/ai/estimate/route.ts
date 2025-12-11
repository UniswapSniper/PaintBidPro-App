import { NextResponse } from 'next/server';

const XAI_API_KEY = process.env.XAI_API_KEY;
const XAI_BASE_URL = 'https://api.x.ai/v1/chat/completions';

export async function POST(request: Request) {
    if (!XAI_API_KEY) {
        return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { type, data, prompt } = body;

        let messages = [];

        if (type === 'text') {
            // Smart Description Generation
            messages = [
                {
                    role: "system",
                    content: "You are an expert professional painting estimator. Your goal is to write clear, concise, and professional 'Scope of Work' descriptions for painting bids. Use industry standard terminology."
                },
                {
                    role: "user",
                    content: `Write a professional Scope of Work for the following project details: ${JSON.stringify(data)}. \n\nInclude preparation steps, priming (if needed), and finish coats. Keep it under 100 words.`
                }
            ];
        } else if (type === 'image') {
            // Image Analysis (Grok Vision)
            // data.image should be base64 string
            messages = [
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${data.image}`,
                                detail: "high",
                            },
                        },
                        {
                            type: "text",
                            text: "Analyze this room for a painting estimate. List 3-5 potential prep work items needed (e.g., patching holes, sanding trim, removing wallpaper) and estimate the complexity level (Low, Medium, High). Return ONLY a JSON object with keys: 'prep_items' (array of strings) and 'complexity' (string). Do not include markdown formatting.",
                        },
                    ],
                },
            ];
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        const response = await fetch(XAI_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAI_API_KEY}`,
            },
            body: JSON.stringify({
                messages: messages,
                model: "grok-beta", // Using grok-beta as requested/assumed for vision
                stream: false,
                temperature: 0.7
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('xAI API Error:', errorText);
            throw new Error(`xAI API responded with ${response.status}: ${errorText}`);
        }

        const json = await response.json();
        const content = json.choices[0].message.content;

        // Parse JSON if it was an image request
        let result = content;
        if (type === 'image') {
            try {
                // Attempt to clean markdown code blocks if present
                const cleanContent = content.replace(/```json\n|\n```/g, '');
                result = JSON.parse(cleanContent);
            } catch (e) {
                console.warn('Failed to parse JSON from AI, returning raw text', e);
            }
        }

        return NextResponse.json({ result });

    } catch (error: any) {
        console.error('AI Route Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
