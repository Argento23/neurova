import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";
const phoneId = "1104497082748018";

async function findRealWaba() {
  console.log("Consultando la API de Meta para obtener los datos de la cuenta vinculados al Phone ID...");
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${phoneId}?fields=whatsapp_business_account,display_phone_number,verified_name`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log("\nDatos del número de teléfono en Meta:");
    console.log(JSON.stringify(res.data, null, 2));
    
    const realWabaId = res.data.whatsapp_business_account?.id;
    if (realWabaId) {
      console.log(`\n💡 ¡ATENCIÓN! El WABA ID real de esta línea es: ${realWabaId}`);
    }
  } catch (err) {
    console.error("Error al consultar:");
    if (err.response) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

findRealWaba();
