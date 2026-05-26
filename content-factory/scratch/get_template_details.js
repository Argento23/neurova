import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";
const wabaId = "1693809771798071";

async function getTemplateDetails() {
  console.log("Consultando detalles del template 'neurova_outreach' en Meta...");
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${wabaId}/message_templates`,
      { 
        headers: { 'Authorization': `Bearer ${token}` },
        params: { name: 'neurova_outreach' }
      }
    );
    console.log("\nResultado de Meta:");
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

getTemplateDetails();
