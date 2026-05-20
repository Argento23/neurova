require('dotenv').config({ path: 'c:/Users/Gustavo/Downloads/neurova/adsniper-saas/.env.local' });
const token = process.env.REPLICATE_API_TOKEN;
console.log('Token starts with: ' + (token ? token.substring(0, 5) : 'NULL'));

async function test() {
    try {
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: '389274291583d73f1ff24b74a3f4ca1aefffbbe50ff0fdb3c0ea5df81775f0a0',
                input: {
                    prompt: 'Typography rendering: "HELLO"',
                    resolution: '1024x1024',
                    style_type: 'Design',
                    magic_prompt_option: 'Auto'
                }
            })
        });
        console.log('Status: ' + response.status);
        const data = await response.json();
        console.log(data);
    } catch(e) {
        console.log(e);
    }
}
test();
