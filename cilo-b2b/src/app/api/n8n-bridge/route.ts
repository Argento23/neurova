import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_CILO || 'https://manager.agentes.space/webhook/cilo-leads';

        console.log('📤 Forwarding data to n8n:', body);

        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...body,
                timestamp: new Date().toISOString(),
                source: 'Cilo B2B Chat'
            }),
        });

        if (!response.ok) {
            throw new Error(`n8n error: ${response.status}`);
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('n8n Bridge Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
