const fetch = require('node-fetch');

async function simulateFrontendReq() {
    console.log('Simulating frontend request...');
    const body = {
        manual_title: 'SAVE',
        manual_description: 'Test product for typography',
        productUrl: '',
        language: 'en',
        count: 3
    };

    try {
        const resp = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Mock clerk session cookie or use the fact that I overrode admin by email so maybe we don't need auth if we disable it?
                // Wait, without auth() it returns 401. I need to bypass auth for testing or provide a valid session.
            },
            body: JSON.stringify(body)
        });
        const text = await resp.text();
        console.log('Status:', resp.status);
        if (text.length > 500) {
            console.log('Response (truncated):', text.substring(0, 500) + '...');
        } else {
            console.log('Response:', text);
        }
    } catch(e) {
        console.error('Fetch error:', e);
    }
}
simulateFrontendReq();
