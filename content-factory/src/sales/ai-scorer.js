import axios from 'axios';
import config from '../config.js';
import logger from '../logger.js';
import supabase from './supabase-client.js';

// ═══════════════════════════════════════════════════
// AI SCORER — Groq-Powered Lead Qualification
// ═══════════════════════════════════════════════════

const SCORING_WEIGHTS = {
  industry_fit: 20,       // Is this a target industry?
  digital_gaps: 25,       // No chatbot/WhatsApp = opportunity
  business_size: 15,      // Reviews/rating indicate volume
  contact_quality: 15,    // Has phone + email + website
  geographic_value: 15,   // High-value region (USA/EU > LATAM)
  urgency_signals: 10     // Signals of need (bad reviews about service, etc.)
};

const INDUSTRY_FIT_SCORES = {
  hotel: 98, inmobiliaria: 96, clinica: 92,
  concesionaria: 94, coworking: 88, salon_eventos: 90,
  restaurante: 70, contador: 82, abogado: 82,
  ecommerce: 75, gym: 60, belleza: 65
};

const REGION_VALUE = {
  miami: 98, vienna: 95, salzburg: 90, madrid: 85,
  buenos_aires: 75, cordoba: 65, mexico_city: 80,
  bogota: 65, lima: 60, santiago: 65, zurich: 95
};

// ─── RULE-BASED SCORING ────────────────────────────

function calculateBaseScore(lead) {
  const breakdown = {};
  let total = 0;

  // 1. Industry Fit (0-20)
  const industryScore = (INDUSTRY_FIT_SCORES[lead.industry] || 50) / 100;
  breakdown.industry_fit = Math.round(industryScore * SCORING_WEIGHTS.industry_fit);
  total += breakdown.industry_fit;

  // 2. Digital Gaps (0-25) — More gaps = more opportunity
  let gapScore = 0;
  let diagnosis = {};
  try { diagnosis = JSON.parse(lead.ai_diagnosis || '{}'); } catch {}

  if (diagnosis.has_whatsapp === false) gapScore += 8;
  if (diagnosis.has_chatbot === false) gapScore += 10;
  if (diagnosis.has_booking === false) gapScore += 5;
  if (diagnosis.reachable === false) gapScore += 2; // Bad website = needs help
  // If no website at all, big opportunity
  if (!lead.website_url) gapScore += 7;

  breakdown.digital_gaps = Math.min(gapScore, SCORING_WEIGHTS.digital_gaps);
  total += breakdown.digital_gaps;

  // 3. Business Size (0-15)
  let sizeScore = 0;
  if (lead.google_reviews_count > 500) sizeScore = 15;
  else if (lead.google_reviews_count > 200) sizeScore = 13;
  else if (lead.google_reviews_count > 100) sizeScore = 11;
  else if (lead.google_reviews_count > 50) sizeScore = 9;
  else if (lead.google_reviews_count > 20) sizeScore = 7;
  else if (lead.google_reviews_count > 5) sizeScore = 4;
  else sizeScore = 2;

  if (lead.google_rating >= 4.5) sizeScore = Math.min(sizeScore + 2, 15);
  breakdown.business_size = sizeScore;
  total += sizeScore;

  // 4. Contact Quality (0-15)
  let contactScore = 0;
  if (lead.phone) contactScore += 5;
  if (lead.email) contactScore += 5;
  if (lead.website_url) contactScore += 3;
  if (lead.ig_username) contactScore += 2;
  breakdown.contact_quality = Math.min(contactScore, SCORING_WEIGHTS.contact_quality);
  total += breakdown.contact_quality;

  // 5. Geographic Value (0-15)
  const regionScore = (REGION_VALUE[lead.region] || 50) / 100;
  breakdown.geographic_value = Math.round(regionScore * SCORING_WEIGHTS.geographic_value);
  total += breakdown.geographic_value;

  // 6. Urgency Signals (0-10)
  let urgencyScore = 0;
  if (lead.google_rating && lead.google_rating < 4.0 && lead.google_reviews_count > 20) urgencyScore += 5;
  if (lead.google_reviews_count > 100 && !lead.website_url) urgencyScore += 3;
  if (diagnosis.has_whatsapp === false && diagnosis.has_chatbot === false) urgencyScore += 2;
  breakdown.urgency_signals = Math.min(urgencyScore, SCORING_WEIGHTS.urgency_signals);
  total += breakdown.urgency_signals;

  return { total: Math.min(total, 100), breakdown };
}

// ─── AI-ENHANCED SCORING ───────────────────────────

async function enhanceScoreWithAI(lead, baseScore) {
  if (!config.GROQ_API_KEY) return baseScore;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: `You are a B2B sales qualification AI for an AI automation agency. Analyze this lead and return a JSON object with:
- "adjustment": number between -15 and +15
- "interest_level": "hot", "warm", "cool", or "cold"
- "main_pain": (1 sentence) focus on if they use basic/dumb automation vs. our advanced AI
- "recommended_approach": (1 sentence) how to pivot them from their current basic bot to Neurova
- "budget_estimate": "high", "medium", or "low"
Return ONLY valid JSON. If they have a basic auto-reply, increase adjustment by +10 as they are prime for an upgrade.`
      }, {
        role: 'user',
        content: `Lead: ${lead.name} | Industry: ${lead.industry} | Region: ${lead.region} (${lead.country}) | Rating: ${lead.google_rating || 'N/A'} | Reviews: ${lead.google_reviews_count || 0} | Website: ${lead.website_url || 'none'} | Has WhatsApp: ${lead.ai_diagnosis ? JSON.parse(lead.ai_diagnosis).has_whatsapp : 'unknown'} | Has chatbot: ${lead.ai_diagnosis ? JSON.parse(lead.ai_diagnosis).has_chatbot : 'unknown'} | Base Score: ${baseScore.total}/100`
      }],
      temperature: 0.3, max_tokens: 300
    }, { headers: { 'Authorization': `Bearer ${config.GROQ_API_KEY}`, 'Content-Type': 'application/json' } });

    const content = response.data.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return baseScore;

    const aiResult = JSON.parse(jsonMatch[0]);
    const adjustment = Math.max(-15, Math.min(15, aiResult.adjustment || 0));

    return {
      total: Math.max(0, Math.min(100, baseScore.total + adjustment)),
      breakdown: { ...baseScore.breakdown, ai_adjustment: adjustment },
      interest_level: aiResult.interest_level || 'cool',
      main_pain: aiResult.main_pain || null,
      recommended_approach: aiResult.recommended_approach || null,
      budget_estimate: aiResult.budget_estimate || 'medium'
    };
  } catch (error) {
    logger.warn('AI scoring enhancement failed', { error: error.message });
    return baseScore;
  }
}

// ─── MAIN SCORING PIPELINE ─────────────────────────

async function scoreLead(lead) {
  const baseScore = calculateBaseScore(lead);
  const enhancedScore = await enhanceScoreWithAI(lead, baseScore);

  const interestMap = { hot: 'hot', warm: 'warm', cool: 'cool', cold: 'cold' };
  const scoreInterest = enhancedScore.total >= 80 ? 'hot' : enhancedScore.total >= 60 ? 'warm' : enhancedScore.total >= 40 ? 'cool' : 'cold';

  return {
    ai_score: enhancedScore.total,
    ai_score_breakdown: enhancedScore.breakdown,
    interest_level: enhancedScore.interest_level || interestMap[scoreInterest] || scoreInterest,
    main_pain: enhancedScore.main_pain || null,
    budget_range: enhancedScore.budget_estimate || null,
    ai_score_updated_at: new Date().toISOString()
  };
}

async function scoreAllPending() {
  logger.info('═══ AI SCORING ENGINE STARTED ═══');

  if (!supabase.isConfigured()) {
    logger.error('Supabase not configured, cannot score leads');
    return { scored: 0, qualified: 0 };
  }

  const unscoredLeads = await supabase.getUnscoredLeads(2000);
  logger.info(`${unscoredLeads.length} leads pending scoring`);

  let scored = 0, qualified = 0;

  for (const lead of unscoredLeads) {
    try {
      const scoreResult = await scoreLead(lead);
      await supabase.updateLead(lead.id, scoreResult);
      scored++;
      if (scoreResult.ai_score >= 70) qualified++;
      logger.info(`Scored ${lead.name}: ${scoreResult.ai_score}/100 (${scoreResult.interest_level})`, { id: lead.id });
      await new Promise(r => setTimeout(r, 400)); // Rate limit Groq (faster throughput)
    } catch (error) {
      logger.error(`Scoring failed for ${lead.name}`, { error: error.message });
    }
  }

  logger.info(`═══ SCORING COMPLETE: ${scored} scored, ${qualified} qualified (70+) ═══`);
  return { scored, qualified };
}

export default { scoreLead, scoreAllPending, calculateBaseScore };
