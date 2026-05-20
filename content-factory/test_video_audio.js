import audioGenerator from './src/generators/audio.js';
import imageGenerator from './src/generators/image.js';
import videoGenerator from './src/generators/video.js';

async function test() {
  console.log("1. Generando imagen con IA...");
  const img = await imageGenerator.generate("futuristic dashboard neon lights", "test_video_demo", "story");
  
  console.log("2. Generando voz en off...");
  const aud = await audioGenerator.generateVoiceOver("Hola Gustavo. Este es un video de prueba generado de manera cien por ciento automática con Inteligencia Artificial. Síguenos para más contenido.", "test_video_demo", "es");
  
  console.log("3. Mezclando imagen, texto, voz y música en FFmpeg...");
  const vid = await videoGenerator.generate({
    imagePaths: [img],
    overlayTexts: ["Hola Gustavo", "Video Automático", "Con IA", "Síguenos"],
    postId: "test_video_demo",
    audioPath: aud
  });
  
  console.log("✅ ¡Video listo! Puedes verlo en:", vid);
}

test().catch(console.error);
