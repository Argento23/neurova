import outreachEngine from '../src/sales/outreach-engine.js';
import logger from '../src/logger.js';

async function run() {
  console.log('--- Triggering Manual Outreach Batch ---');
  // We'll run it LIVE (not dry run) for 50 leads
  const result = await outreachEngine.runOutreachBatch({ maxLeads: 50, type: 'new', dryRun: false });
  console.log(`\nOutreach Complete:`);
  console.log(`- Contacted: ${result.contacted}`);
  console.log(`- Failed: ${result.failed}`);
}

run().catch(err => {
  console.error('Outreach failed:', err);
});
