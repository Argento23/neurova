import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";

const systemUserId = "122104741113299429";
const appId = "2014488929141510"; 
const businessId = "2154282528689160";
const knownWabaId = "1693809771798071";

async function findAllWabas() {
  console.log("=== BÚSQUEDA EXHAUSTIVA DEL WABA ID REAL ===\n");

  // 1. Try system user's assigned assets
  const endpoints = [
    { label: "System User assigned WABAs", url: `https://graph.facebook.com/v19.0/${systemUserId}/assigned_business_asset_groups` },
    { label: "App subscribed WABAs", url: `https://graph.facebook.com/v19.0/${appId}/subscribed_whatsapp_business_accounts` },
    { label: "Business owned WABAs (client)", url: `https://graph.facebook.com/v19.0/${businessId}/client_whatsapp_business_accounts` },
    { label: "System User assigned pages", url: `https://graph.facebook.com/v19.0/${systemUserId}/assigned_pages` },
    { label: "System User assigned ad accounts", url: `https://graph.facebook.com/v19.0/${systemUserId}/assigned_ad_accounts` },
    { label: "WABA info direct", url: `https://graph.facebook.com/v19.0/${knownWabaId}?fields=id,name,currency,timezone_id,business_verification_status,ownership_type,on_behalf_of_business_info` },
  ];

  for (const ep of endpoints) {
    console.log(`--- ${ep.label} ---`);
    try {
      const res = await axios.get(ep.url, {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000
      });
      console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message;
      console.log(`  Error: ${msg}`);
    }
    console.log('');
  }

  // 2. Try to list ALL templates across ALL possible WABAs by querying the known WABA details
  console.log("--- WABA Details (known ID) ---");
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${knownWabaId}?fields=id,name,currency,timezone_id,account_review_status,business_verification_status`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log(`  Error: ${err.response?.data?.error?.message || err.message}`);
  }

  // 3. The real trick: query the phone number to get its WABA
  console.log("\n--- Phone Number -> WABA lookup ---");
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/1104497082748018?fields=id,display_phone_number,verified_name,name_status`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log(`  Error: ${err.response?.data?.error?.message || err.message}`);
  }

  // 4. Check if the WABA has multiple phone numbers (maybe there's another WABA)
  console.log("\n--- Check WABA phone_numbers ---");
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${knownWabaId}/phone_numbers`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log(`Phone numbers in WABA ${knownWabaId}:`);
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.log(`  Error: ${err.response?.data?.error?.message || err.message}`);
  }

  // 5. Try to get the WABA that the template lives in by checking the WhatsApp Manager URL business_id
  console.log("\n--- Business Manager -> WABAs via shared ---");
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${businessId}/owned_whatsapp_business_accounts`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    // Try alternate endpoint
    try {
      const res2 = await axios.get(
        `https://graph.facebook.com/v22.0/${businessId}/owned_whatsapp_business_accounts`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log(JSON.stringify(res2.data, null, 2));
    } catch (err2) {
      console.log(`  Error v19: ${err.response?.data?.error?.message || err.message}`);
      console.log(`  Error v22: ${err2.response?.data?.error?.message || err2.message}`);
    }
  }

  console.log("\n=== BÚSQUEDA COMPLETA ===");
}

findAllWabas();
