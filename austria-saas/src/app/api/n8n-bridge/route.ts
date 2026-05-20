import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Webhook de n8n para Austria (A configurar en el panel de n8n)
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_AUSTRIA || 'https://manager.agentes.space/webhook/austria-leads';

        console.log('📤 Forwarding Austria data to n8n:', body);

        // Enviamos los datos a n8n de forma asíncrona
        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...body,
                timestamp: new Date().toISOString(),
                source: 'Austria-SAAS Chat'
            }),
        });

        if (!response.ok) {
            throw new Error(`n8n responded with ${response.status}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('❌ n8n Bridge Error (Austria):', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
