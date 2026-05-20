import audioGenerator from './src/generators/audio.js';
import pexelsGenerator from './src/generators/pexels.js';
import videoGenerator from './src/generators/video.js';

async function test() {
  console.log("1. Buscando video B-Roll en Pexels...");
  const bgVideo = await pexelsGenerator.generate("business", "test_pexels_demo");
  
  console.log("2. Generando voz en off con Microsoft Edge TTS...");
  const aud = await audioGenerator.generateVoiceOver("Hola Gustavo. Ahora los videos tienen fondos reales descargados de Pexels automáticamente. La calidad se ve increíble.", "test_pexels_demo", "es");
  
  console.log("3. Mezclando video, texto, voz y música en FFmpeg...");
  const vid = await videoGenerator.generate({
    bgVideoPath: bgVideo,
    overlayTexts: ["Hola Gustavo", "Fondos reales", "Alta calidad", "Automático"],
    postId: "test_pexels_demo",
    audioPath: aud
  });
  
  console.log("✅ ¡Video de Pexels listo! Puedes verlo en:", vid);
}

test().catch(console.error);
