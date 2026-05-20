/**
 * End-to-End Test — Generates a complete post (text + AI image + uploads to ImgBB)
 * Run: node src/test-all.js
 */
import textGenerator from './generators/text.js';
import imageGenerator from './generators/image.js';
import uploadHost from './publishers/upload-host.js';
import instagramPublisher from './publishers/instagram.js';

async function testAll() {
  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log('  ║  🧪 END-TO-END TEST — Content Factory     ║');
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log('');

  // Step 1: Generate text
  console.log('━━━ STEP 1: Text Generation (Groq) ━━━');
  const post = {
    type: 'tip_practico',
    topic: '3 formas de usar IA para calificar leads automáticamente',
    language: 'es'
  };

  const textContent = await textGenerator.generatePost(post);
  console.log(`✅ Caption: ${textContent.caption.substring(0, 120)}...`);
  console.log(`✅ Hashtags: ${textContent.hashtags.slice(0, 5).join(', ')}...`);
  console.log(`✅ Image Prompt: ${textContent.imagePrompt.substring(0, 80)}...`);
  console.log('');

  // Step 2: Generate AI image
  console.log('━━━ STEP 2: Image Generation (Pollinations AI — FREE) ━━━');
  const imagePath = await imageGenerator.generate(
    textContent.imagePrompt,
    'e2e_test_post',
    'square'
  );
  console.log(`✅ Image saved: ${imagePath}`);
  console.log('');

  // Step 3: Upload to ImgBB
  console.log('━━━ STEP 3: Image Upload (ImgBB) ━━━');
  if (uploadHost.isConfigured()) {
    try {
      const publicUrl = await uploadHost.upload(imagePath);
      console.log(`✅ Public URL: ${publicUrl}`);
      console.log('');

      // Step 4: Check Instagram
      console.log('━━━ STEP 4: Instagram Token Check ━━━');
      if (instagramPublisher.isConfigured()) {
        const tokenCheck = await instagramPublisher.validateToken();
        if (tokenCheck.valid) {
          console.log(`✅ Instagram token VALID — Account: ${tokenCheck.name}`);
          console.log(`   Ready to publish! Use: npm run test:instagram`);
        } else {
          console.log(`⚠️  Instagram token EXPIRED: ${tokenCheck.error}`);
          console.log(`   Need to renew token in .env`);
        }
      } else {
        console.log('⚠️  Instagram not configured in .env (IG_ACCESS_TOKEN)');
      }
    } catch (err) {
      console.log(`❌ ImgBB upload failed: ${err.message}`);
    }
  } else {
    console.log('⚠️  ImgBB not configured — skipping upload test');
  }

  console.log('');
  console.log('  ╔═══════════════════════════════════════════╗');
  console.log('  ║  ✅ END-TO-END TEST COMPLETE               ║');
  console.log('  ╚═══════════════════════════════════════════╝');
  console.log('');
}

testAll().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
