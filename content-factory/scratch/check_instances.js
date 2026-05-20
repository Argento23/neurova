import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function checkInstances() {
  try {
    const res = await axios.get(`${process.env.EVOLUTION_API_URL}/instance/fetchInstances`, {
      headers: { 'apikey': process.env.EVOLUTION_API_KEY }
    });
    console.log('Instances:', JSON.stringify(res.data, null, 2));
  } catch (error) {
    console.error('Error fetching instances:', error.response?.data || error.message);
  }
}

checkInstances();
