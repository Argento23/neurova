fetch('https://api.vapi.ai/phone-number/18d12588-42dc-4209-9006-3c55954a5578', {
    method: 'PATCH',
    headers: { 'Authorization': 'Bearer 563af1ef-d671-4cf8-ae6d-d9da58719361', 'Content-Type': 'application/json' },
    body: JSON.stringify({ assistantId: 'd446be03-dfb6-4de6-b83b-9b904af74829' })
}).then(r=>r.text()).then(console.log);
