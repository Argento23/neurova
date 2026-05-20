require('dotenv').config({ path: 'c:/Users/Gustavo/Downloads/neurova/adsniper-saas/.env.local' });
const token = process.env.REPLICATE_API_TOKEN;

async function testIdeogram() {
    console.log('Testing official Ideogram via Replicate with Token:', token ? token.substring(0, 5) + '...' : 'NULL');
    try {
        const response = await fetch('https://api.replicate.com/v1/models/ideogram-ai/ideogram-v2/predictions', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: {
                    prompt: 'Typography rendering: "A.I IN MARKETING"',
                    resolution: '1024x1024',
                    style_type: 'Design',
                    magic_prompt_option: 'Auto'
                }
            })
        });

        if (!response.ok) {
            console.log('Failed:', response.status, await response.text());
            return;
        }

        let prediction = await response.json();
        const getUrl = prediction.urls.get;
        console.log('Got Prediction ID:', prediction.id, 'Status:', prediction.status);

        let attempts = 0;
        while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && attempts < 20) {
            await new Promise((r) => setTimeout(r, 2000));
            attempts++;
            const pollResponse = await fetch(getUrl, {
                headers: { Authorization: 'Bearer ' + token }
            });
            prediction = await pollResponse.json();
            console.log('Attempt', attempts, 'Status:', prediction.status);
        }

        console.log('Final Output:', prediction.output);
    } catch (e) {
        console.error('Crash:', e);
    }
}
testIdeogram();
