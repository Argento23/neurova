import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { CILO_AI_CONFIG } from '@/data/ai-config';
import { products } from '@/data/products';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Enhance system prompt with current product list for real-time accuracy
        const productListStr = products.map(p => `- ${p.name} (${p.weight || 'N/A'}): ${p.description}`).join('\n');

        const fullSystemPrompt = `${CILO_AI_CONFIG.systemPrompt}\n\nCATÁLOGO ACTUALIZADO:\n${productListStr}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: fullSystemPrompt },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Groq API Error: ${error}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;

        // --- Lead Capture & n8n Bridge Logic ---
        // Simple heuristic: if the AI asks for contact info or says "representante", 
        // or if we detect an intent to buy, we could forward to n8n.
        // For now, let's forward ALL interactions to n8n for monitoring/lead capturing
        try {
            fetch(`${new URL(req.url).origin}/api/n8n-bridge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatHistory: messages,
                    lastUserMessage: messages[messages.length - 1]?.content,
                    assistantResponse: assistantMessage
                }),
            }).catch(err => console.error('Silent n8n Bridge Fail:', err));
        } catch (e) {
            console.error('Lead forwarding failed');
        }

        return NextResponse.json({ message: assistantMessage });

    } catch (error: any) {
        console.error('Cilo AI Chat Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
