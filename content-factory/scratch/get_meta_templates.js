import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";
const wabaId = "1693809771798071";

async function getTemplates() {
  console.log("Consultando templates registrados en Meta...");
  try {
    const res = await axios.get(
      `https://graph.facebook.com/v19.0/${wabaId}/message_templates`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log("\nTemplates encontrados:");
    if (res.data && res.data.data) {
      res.data.data.forEach(t => {
        console.log(`- Nombre: "${t.name}" | Idioma: "${t.language}" | Estado: "${t.status}"`);
      });
    } else {
      console.log("No se encontraron templates.");
    }
  } catch (err) {
    console.error("Error al consultar templates:");
    if (err.response) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

getTemplates();
