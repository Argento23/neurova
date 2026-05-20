import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL_UNIVERSAL || 'https://manager.agentes.space/webhook/universal-leads';

        const response = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...body,
                timestamp: new Date().toISOString()
            }),
        });

        return NextResponse.json({ success: response.ok });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
