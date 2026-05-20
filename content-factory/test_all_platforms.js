import config from './src/config.js';
import textGenerator from './src/generators/text.js';
import imageGenerator from './src/generators/image.js';
import videoGenerator from './src/generators/video.js';
import audioGenerator from './src/generators/audio.js';
import instagramPublisher from './src/publishers/instagram.js';
import tiktokPublisher from './src/publishers/tiktok.js';
import youtubePublisher from './src/publishers/youtube.js';
import uploadHost from './src/publishers/upload-host.js';
import pexelsGenerator from './src/generators/pexels.js';

async function testAllPlatforms() {
  console.log('\n🚀 INICIANDO PRUEBA DE PUBLICACIÓN EN LAS 3 REDES 🚀\n');

  try {
    // 1. Crear un post falso
    const post = {
      id: `test_${Date.now()}`,
      type: 'video_corto',
      topic: 'La importancia de automatizar tu negocio con Inteligencia Artificial',
      language: 'es'
    };

    console.log('🧠 1. Generando texto y guion...');
    const textContent = await textGenerator.generatePost(post);
    const script = await textGenerator.generateVideoScript(post.topic, post.language);
    
    console.log('🎥 2. Buscando video de fondo (Pexels)...');
    let bgVideoPath = null;
    try {
      bgVideoPath = await pexelsGenerator.generate(post.topic, post.id);
    } catch (e) {
      console.log('⚠️ Falló Pexels, usando imagen de fondo generada por IA...');
      bgVideoPath = await imageGenerator.generate(textContent.imagePrompt, post.id, 'story');
    }

    console.log('🎙️ 3. Generando voz en off (Edge TTS)...');
    const fullScriptText = `${script.hook}. ${script.points.join('. ')}. ${script.cta}`;
    const audioPath = await audioGenerator.generateVoiceOver(fullScriptText, post.id, post.language);

    console.log('🎬 4. Uniendo todo en un Video (FFmpeg)...');
    const videoPath = await videoGenerator.generate({
      imagePaths: bgVideoPath.endsWith('.mp4') ? null : [bgVideoPath],
      bgVideoPath: bgVideoPath.endsWith('.mp4') ? bgVideoPath : null,
      overlayTexts: script.overlay_texts || [],
      postId: post.id,
      slideDuration: 3,
      format: 'vertical',
      audioPath: audioPath
    });

    console.log(`\n✅ Video generado: ${videoPath}`);
    const caption = `${textContent.caption}\n\n${textContent.hashtags.join(' ')}`;

    // === PUBLICAR ===
    console.log('\n📤 INICIANDO PUBLICACIONES...\n');

    // Instagram (requiere URL pública, usamos ImgBB/UploadHost)
    if (instagramPublisher.isConfigured()) {
      console.log('📱 Publicando en Instagram...');
      try {
        const videoUrl = uploadHost.getVideoUrl(videoPath);
        await instagramPublisher.publishReel(videoUrl, caption);
        console.log('✅ Instagram OK');
      } catch (err) {
        console.log('❌ Falló Instagram:', err.response?.data?.error?.message || err.message);
      }
    } else {
      console.log('⚠️ Instagram no configurado en .env');
    }

    // YouTube
    if (youtubePublisher.isConfigured()) {
      console.log('\n📺 Publicando en YouTube Shorts...');
      try {
        await youtubePublisher.publishShort(videoPath, post.topic, caption, textContent.hashtags);
        console.log('✅ YouTube OK');
      } catch (err) {
        console.log('❌ Falló YouTube:', err.response?.data?.error?.message || err.message);
      }
    } else {
      console.log('⚠️ YouTube no configurado en .env');
    }

    // TikTok
    if (tiktokPublisher.isConfigured()) {
      console.log('\n🎵 Publicando en TikTok...');
      try {
        await tiktokPublisher.publishVideo(videoPath, caption);
        console.log('✅ TikTok OK');
      } catch (err) {
        console.log('❌ Falló TikTok:', err.response?.data?.error?.message || err.message);
      }
    } else {
      console.log('⚠️ TikTok no configurado en .env');
    }

    console.log('\n🎉 ¡PRUEBA FINALIZADA CON ÉXITO! 🎉\n');

  } catch (error) {
    console.error('\n❌ ERROR DURANTE LA PRUEBA:', error);
  }
}

testAllPlatforms();
