import aiScorer from '../src/sales/ai-scorer.js';
import logger from '../src/logger.js';

async function run() {
  console.log('--- Triggering Manual Lead Scoring ---');
  const result = await aiScorer.scoreAllPending();
  console.log(`\nScoring Complete:`);
  console.log(`- Scored: ${result.scored}`);
  console.log(`- Qualified (70+): ${result.qualified}`);
}

run().catch(err => {
  console.error('Scoring failed:', err);
});
