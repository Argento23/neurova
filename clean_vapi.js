const VAPI_PRIVATE_KEY = '563af1ef-d671-4cf8-ae6d-d9da58719361';

async function fixAll() {
  const creds = await fetch('https://api.vapi.ai/credential', {
    headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
  }).then(r => r.json());

  for (const cred of creds) {
    if (cred.provider === 'byo-sip-trunk') {
      console.log('Updating trunk:', cred.id);
      await fetch(`https://api.vapi.ai/credential/${cred.id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outboundAuthenticationPlan: {
            authUsername: '559198-100',
            authPassword: 'Neurova2026!'
          }
        })
      });
    }
  }

  const nums = await fetch('https://api.vapi.ai/phone-number', {
    headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
  }).then(r => r.json());

  let keptOne = false;
  for (const n of nums) {
    if (n.provider === 'byo-phone-number') {
      if (!keptOne) {
        keptOne = true;
        console.log('Updating number:', n.id);
        await fetch(`https://api.vapi.ai/phone-number/${n.id}`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ assistantId: 'd446be03-dfb6-4de6-b83b-9b904af74829' })
        });
      } else {
        console.log('Deleting duplicate number:', n.id);
        await fetch(`https://api.vapi.ai/phone-number/${n.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${VAPI_PRIVATE_KEY}` }
        });
      }
    }
  }
}
fixAll();
