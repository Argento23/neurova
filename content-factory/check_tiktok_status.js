import tiktokPublisher from './src/publishers/tiktok.js';

const publishId = 'v_pub_file~v2-1.7636074093221120008';

async function check() {
  console.log('Checking status for:', publishId);
  try {
    const status = await tiktokPublisher._checkStatus(publishId, 1);
    console.log('Status check result:', status);
  } catch (err) {
    console.error('Error checking status:', err.response?.data || err.message);
  }
}

check();
