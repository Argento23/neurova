import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";
const wabaIds = ["1693809771798071", "130884521188398", "1298001715131802", "2008189203124502"];

async function run() {
  for (const id of wabaIds) {
    console.log(`\n=== PHONE NUMBERS FOR WABA ID: ${id} ===`);
    try {
      const res = await axios.get(
        `https://graph.facebook.com/v19.0/${id}/phone_numbers`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error(`Error: ${err.response?.data?.error?.message || err.message}`);
    }
  }
}

run();
