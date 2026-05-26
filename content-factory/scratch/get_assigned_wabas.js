import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";
const systemUserId = "122104741113299429";

async function run() {
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${systemUserId}/assigned_whatsapp_business_accounts`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log("Assigned WhatsApp Business Accounts:");
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error:", err.response?.data?.error?.message || err.message);
  }
}

run();
