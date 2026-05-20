import { mkdirSync } from 'fs';
import config, { validateConfig } from './config.js';
import logger from './logger.js';
import { startScheduler, generateContent, publishContent } from './scheduler.js';
import { startDashboard } from './dashboard/server.js';

// Ensure directories exist
[config.OUTPUT_DIR, config.IMAGES_DIR, config.VIDEOS_DIR, config.LOGS_DIR].forEach(dir => {
  try { mkdirSync(dir, { recursive: true }); } catch {}
});

// ═══════════════════════════════════════════════════
// GENERARISE CONTENT FACTORY — Entry Point
// ═══════════════════════════════════════════════════

async function main() {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║                                              ║');
  console.log('  ║   ⚡ GENERARISE CONTENT FACTORY v1.0         ║');
  console.log('  ║   Autonomous AI Content Engine                ║');
  console.log('  ║                                              ║');
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');

  // Validate configuration
  const { warnings, errors, isValid } = validateConfig();

  if (warnings.length > 0) {
    console.log('  ⚠️  Warnings:');
    warnings.forEach(w => console.log(`     - ${w}`));
    console.log('');
  }

  if (!isValid) {
    console.log('  ❌ Critical errors:');
    errors.forEach(e => console.log(`     - ${e}`));
    console.log('\n  Fix the errors above in your .env file and restart.');
    process.exit(1);
  }

  // Check for CLI flags
  const args = process.argv.slice(2);

  if (args.includes('--simulate-day')) {
    // Simulate a full day: generate + publish
    console.log('  🧪 SIMULATION MODE — Running full day cycle...\n');
    await generateContent();
    console.log('\n  ⏳ Waiting 5s before publishing...\n');
    await new Promise(r => setTimeout(r, 5000));
    await publishContent();
    console.log('\n  ✅ Simulation complete!');
    process.exit(0);
  }

  if (args.includes('--generate')) {
    console.log('  🧠 Manual generation mode...\n');
    await generateContent();
    process.exit(0);
  }

  if (args.includes('--publish')) {
    console.log('  📤 Manual publish mode...\n');
    await publishContent();
    process.exit(0);
  }

  // Normal mode: Start everything
  logger.info('Starting Content Factory in production mode...');

  // Start the dashboard
  startDashboard();

  // Start the scheduler
  startScheduler();

  // If --dev flag, also trigger immediate generation for testing
  if (args.includes('--dev')) {
    logger.info('Dev mode: Triggering immediate content generation...');
    setTimeout(() => generateContent(), 3000);
  }

  logger.info(`✅ Content Factory is running!`);
  logger.info(`📊 Dashboard: http://localhost:${config.DASHBOARD_PORT}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
