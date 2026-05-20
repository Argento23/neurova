import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const baseUrl = 'https://trafic.generarise.space';
const globalApiKey = '429683C4C977415CAAFCCE10F7D57E11';
const testPhone = '17867060744'; // The one that failed

async function testCombinations() {
  const instances = ['Argen-Austria', 'GenerArise'];
  const paths = ['/message/sendText'];

  for (const instance of instances) {
    for (const path of paths) {
      const url = `${baseUrl}${path}/${instance}`;
      console.log(`Testing: ${url}`);
      try {
        const res = await axios.post(url, {
          number: testPhone,
          text: 'Test message from Neurova debug'
        }, {
          headers: { 'apikey': globalApiKey }
        });
        console.log(`✅ Success with ${instance} at ${path}`);
        console.log(res.data);
        return;
      } catch (error) {
        console.log(`❌ Failed: ${instance} at ${path} - Status: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
      }
    }
  }
}

testCombinations();
