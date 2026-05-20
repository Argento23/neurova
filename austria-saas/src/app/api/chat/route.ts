import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import { AUSTRIA_AI_CONFIG } from '@/data/ai-config';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });
    try {
        const { messages, lang } = await req.json();

        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: AUSTRIA_AI_CONFIG.systemPrompt + `\n\nUSER LANGUAGE PREFERENCE: ${lang}` },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const assistantMessage = response.choices[0].message.content;

        // --- Lead Capture & n8n Bridge Logic ---
        try {
            fetch(`${new URL(req.url).origin}/api/n8n-bridge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatHistory: messages.concat({ role: 'assistant', content: assistantMessage }),
                    lastUserMessage: messages[messages.length - 1]?.content,
                    assistantResponse: assistantMessage,
                    lang: lang
                }),
            }).catch(err => console.error('Silent n8n Bridge Fail:', err));
        } catch (e) {
            console.error('Lead forwarding failed');
        }

        return NextResponse.json({ message: assistantMessage });

    } catch (error: any) {
        console.error('Austria AI Chat Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
