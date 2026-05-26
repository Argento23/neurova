import axios from 'axios';

const token = "EAAcoKsEGgwYBRsmz3eseGzqDi64VhFRwnGuoCec7PknTZAMcxHKAnzzQYpeOPQ3hGyZATVg2EJkowLGM4cexIjDVP8GJcGfQvmhXyFHbWrDoKpEDQMjqohmh7h4ecOyR1Rl9i4EpyUf0zApZCVMhApbfxkQd86Ptg3zgvMANdAAD2PssZB3RGbI06cj16dpRpgZDZD";
const phoneId = "1104497082748018";
const version = "v19.0";

async function test() {
  console.log("Testing Meta Cloud API Phone Status...");
  try {
    const res = await axios.get(
      `https://graph.facebook.com/${version}/${phoneId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log("Response:", res.data);
  } catch (err) {
    console.error("Error checking phone status:");
    if (err.response) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

test();
