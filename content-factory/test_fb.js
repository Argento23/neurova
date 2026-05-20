import facebookPublisher from './src/publishers/facebook.js';

async function testFB() {
  try {
    console.log('Testing FB text publish...');
    const result = await facebookPublisher.publishText('Test post from API for debugging');
    console.log('Success text:', result);

    console.log('Testing FB image publish...');
    const imgResult = await facebookPublisher.publishImage('https://files.catbox.moe/vgmxbq.png', 'Test image post');
    console.log('Success image:', imgResult);
  } catch (error) {
    console.error('Failed:', error.response?.data?.error || error.message);
  }
}

testFB();
