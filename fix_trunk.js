fetch('https://api.vapi.ai/credential/02c0b37b-892d-4330-a33d-a3493456282d', {
    method: 'PATCH',
    headers: { 'Authorization': 'Bearer 563af1ef-d671-4cf8-ae6d-d9da58719361', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      outboundAuthenticationPlan: {
        authUsername: '559198-100',
        authPassword: 'Neurova2026!'
      }
    })
}).then(r=>r.text()).then(console.log);
