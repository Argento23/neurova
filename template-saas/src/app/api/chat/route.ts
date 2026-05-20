import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';
import { UNIVERSAL_AI_CONFIG } from '@/data/ai-config';

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
                { role: 'system', content: UNIVERSAL_AI_CONFIG.systemPrompt + `\n\nUSER LANGUAGE: ${lang || 'es'}` },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const assistantMessage = response.choices[0].message.content;

        // Bridge for n8n
        try {
            fetch(`${new URL(req.url).origin}/api/n8n-bridge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatHistory: messages.concat({ role: 'assistant', content: assistantMessage }),
                    lastUserMessage: messages[messages.length - 1]?.content,
                    assistantResponse: assistantMessage,
                    industry: UNIVERSAL_AI_CONFIG.industry
                }),
            }).catch(err => console.error('Silent n8n Bridge Fail:', err));
        } catch (e) { }

        return NextResponse.json({ message: assistantMessage });

    } catch (error: any) {
        console.error('Universal AI Chat Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
