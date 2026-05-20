const fetch = require('node-fetch');

async function testSequential() {
    const fullPrompt = 'A cute dog, professional product photography';
    const token = process.env.REPLICATE_API_TOKEN || 'YOUR_REPLICATE_API_TOKEN';

    for(let i=0; i<3; i++) {
        console.log('Generating image', i);
        const response = await fetch('https://api.replicate.com/v1/models/ideogram-ai/ideogram-v2/predictions', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: { prompt: fullPrompt, resolution: '1024x1024' }
            })
        });

        if (!response.ok) {
            console.log('Failed', i, response.status, await response.text());
        } else {
            console.log('Started', i, (await response.json()).id);
        }
    }
}
testSequential();
