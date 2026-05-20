const fs = require('fs');
const filePath = 'c:/Users/Gustavo/Downloads/neurova/adsniper-saas/app/api/generate/route.ts';
let code = fs.readFileSync(filePath, 'utf8');
const lines = code.split(/\r?\n/);

const newLines = \                const fullPrompt = \\\\, professional product photography, 8k, cinematic lighting, high quality, studio setup\\\;

                // 1. TRY IDEOGRAM V2 (Prioritized for Typography)
                try {
                    const ideogramImage = await generateIdeogramImage(fullPrompt);
                    if (ideogramImage) {
                        return { ...ad, generated_image_url: ideogramImage, product_image_fallback: scrapedImage };
                    }
                } catch (e) {
                    console.error(\\\⚠️ Ideogram failed, trying Replicate Flux...\\\);
                }

                // 2. TRY REPLICATE (FLUX)
                try {
                    const replicateResult = await generateReplicateImage(fullPrompt);
                    if (replicateResult && replicateResult.imageUrl) {
                        return { ...ad, generated_image_url: replicateResult.imageUrl, product_image_fallback: scrapedImage };
                    }
                } catch (e) {
                    console.error(\\\⚠️ Replicate failed, trying Pollinations...\\\);
                }\.split('\n');

lines.splice(620, 21, ...newLines);
fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Replaced lines 621 to 641 directly via Node.');
