import youtubePublisher from './src/publishers/youtube.js';
import tiktokPublisher from './src/publishers/tiktok.js';

async function test() {
  try {
    console.log('Testing TikTok status...');
    const creator = await tiktokPublisher._getCreatorInfo();
    console.log('TikTok OK, Max Duration:', creator.max_video_post_duration_sec);
  } catch (err) {
    console.error('TikTok error:', err.response?.data || err.message);
  }

  try {
    console.log('\nTesting YouTube publish...');
    // We just need a dummy file for the metadata test (the first request is just metadata)
    // Actually we can pass an existing file like 'test.mp3' or something if we just want to see if the first step (metadata) passes or fails.
    // Wait, let's use a real video file if possible. Is there any in content-factory?
    // Let's use any file. We just want to see the 400 error.
    await youtubePublisher.publishShort(
      './package.json', // fake video file to trigger the first metadata API request
      'Short Title',
      'Short Description',
      ['test']
    );
  } catch (err) {
    console.error('YouTube error:', err.response?.data?.error || err.message);
  }
}

test();
