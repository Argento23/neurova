import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";

async function run() {
  const businessIds = ["2154282538689160", "2154282528689160"];
  for (const bId of businessIds) {
    console.log(`\n--- Checking Business ID: ${bId} ---`);
    try {
      const res = await axios.get(
        `https://graph.facebook.com/v19.0/${bId}/whatsapp_business_accounts`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log(`Success: Found ${res.data.data?.length} WABAs`);
      console.log(JSON.stringify(res.data, null, 2));
      
      // For each WABA found, list templates
      if (res.data.data) {
        for (const waba of res.data.data) {
          console.log(`  -> Templates for WABA ${waba.id} (${waba.name}):`);
          try {
            const tempRes = await axios.get(
              `https://graph.facebook.com/v19.0/${waba.id}/message_templates`,
              { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log(JSON.stringify(tempRes.data, null, 2));
          } catch (err) {
            console.log(`     Error templates: ${err.response?.data?.error?.message || err.message}`);
          }
        }
      }
    } catch (err) {
      console.log(`Error business accounts: ${err.response?.data?.error?.message || err.message}`);
    }
  }
}

run();
