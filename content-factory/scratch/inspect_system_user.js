import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";
const systemUserId = "122104741113299429";

async function inspect() {
  const urls = [
    `https://graph.facebook.com/v19.0/${systemUserId}`,
    `https://graph.facebook.com/v19.0/${systemUserId}/assigned_assets`,
    `https://graph.facebook.com/v19.0/${systemUserId}/assigned_business_asset_groups`,
    `https://graph.facebook.com/v19.0/${systemUserId}/assigned_pages`,
  ];
  
  for (const url of urls) {
    console.log(`\n--- Inspecting URL: ${url} ---`);
    try {
      const res = await axios.get(url, { headers: { 'Authorization': `Bearer ${token}` } });
      console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.log(`Error: ${err.response?.data?.error?.message || err.message}`);
    }
  }
}

inspect();
