import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";
const businessId = "2154282528689160";

async function listBusinessWabas() {
  console.log(`Listando las WhatsApp Business Accounts para el Business ID ${businessId}...`);
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${businessId}/whatsapp_business_accounts`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log("\nWABAs encontradas:");
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("Error al consultar:");
    if (err.response) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

listBusinessWabas();
