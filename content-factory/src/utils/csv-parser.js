/**
 * src/utils/csv-parser.js
 * Lightweight CSV parser.
 */

export function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    // Regex to match commas outside of quotes
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const values = lines[i].split(regex).map(v => v.trim().replace(/^"|"$/g, ''));
    
    // Allow minor mismatches, but prefer exact length match
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    // Only push if there's actual data
    if (Object.values(row).some(v => v !== '')) {
      results.push(row);
    }
  }

  return results;
}
