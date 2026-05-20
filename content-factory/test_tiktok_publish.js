import tiktokPublisher from './src/publishers/tiktok.js';
import { join } from 'path';

const testVideoPath = join(process.cwd(), 'content-factory', 'output', 'videos', 'test_video_demo.mp4');
const caption = '🚀 Probando publicación 100% automatizada desde GenerArise AI #AI #GenerArise #Tech';

console.log('Iniciando prueba de publicación en TikTok...');
console.log('Video:', testVideoPath);
console.log('Caption:', caption);

async function test() {
  try {
    const publishId = await tiktokPublisher.publishVideo(testVideoPath, caption);
    if (publishId) {
      console.log('✅ ¡PRUEBA EXITOSA! El video se ha publicado en TikTok.');
      console.log('Publish ID:', publishId);
    } else {
      console.log('⚠️ No se pudo publicar. Revisa los logs para más detalles.');
    }
  } catch (err) {
    console.error('❌ Error durante la publicación:');
    console.error(err.response?.data || err.message);
  }
}

test();
