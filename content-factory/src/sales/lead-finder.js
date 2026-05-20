import axios from 'axios';
import config from '../config.js';
import logger from '../logger.js';
import supabase from './supabase-client.js';

// ═══════════════════════════════════════════════════
// LEAD FINDER ENGINE — Multi-Source Discovery
// ═══════════════════════════════════════════════════

const INDUSTRY_QUERIES = {
  hotel: {
    es: ['hotel boutique', 'hotel 4 estrellas', 'apart hotel', 'hotel con spa', 'director hotel boutique'],
    en: ['boutique hotel', '4 star hotel', 'luxury hotel', 'resort', 'hotel director'],
    de: ['Boutique Hotel', 'Luxushotel', '4 Sterne Hotel']
  },
  inmobiliaria: {
    es: ['inmobiliaria', 'agencia inmobiliaria premium', 'inmobiliaria de lujo', 'dueño inmobiliaria'],
    en: ['real estate agency', 'luxury real estate', 'property management', 'real estate owner']
  },
  restaurante: {
    es: ['restaurante premium', 'restaurante gourmet', 'parrilla premium', 'dueño restaurante'],
    en: ['fine dining restaurant', 'upscale restaurant', 'steakhouse', 'restaurant owner']
  },
  clinica: {
    es: ['clínica estética', 'medicina estética', 'clínica dental', 'director clínica dental'],
    en: ['aesthetic clinic', 'cosmetic surgery', 'dental clinic', 'dentist director']
  },
  gimnasio: {
    es: ['gimnasio', 'centro fitness', 'crossfit box', 'dueño gimnasio crossfit'],
    en: ['gym', 'fitness center', 'crossfit gym', 'gym owner']
  },
  concesionaria: {
    es: ['concesionaria de autos', 'agencia de autos', 'automotora', 'dueño concesionario autos'],
    en: ['car dealership', 'auto dealer', 'luxury car dealer', 'car dealer owner']
  },
  startup: {
    es: ['startup tecnología', 'fundador startup', 'software factory', 'agencia marketing'],
    en: ['tech startup', 'startup founder', 'software company', 'marketing agency']
  },
  ecommerce: {
    es: ['tienda online', 'ecommerce', 'emprendedor ecommerce', 'tienda virtual'],
    en: ['online store', 'ecommerce business', 'shopify store', 'ecommerce entrepreneur']
  },
  estetica: {
    es: ['centro de estética', 'spa', 'dueño estética spa', 'clínica estética'],
    en: ['beauty center', 'spa', 'spa owner', 'aesthetic clinic']
  },
  veterinaria: {
    es: ['veterinaria', 'clínica veterinaria', 'pet shop premium'],
    en: ['veterinary clinic', 'animal hospital', 'pet care']
  },
  peluqueria: {
    es: ['peluquería premium', 'salón de belleza', 'barbería premium', 'centro de estética'],
    en: ['hair salon', 'beauty salon', 'premium barbershop']
  },
  logistica_petrolera: {
    es: ['logística petrolera', 'transporte cargas pesadas petroleras', 'servicios petroleros', 'transporte para minería'],
    en: ['oilfield logistics', 'heavy hauling oil', 'oilfield services', 'mining logistics']
  },
  servicios_mineria: {
    es: ['servicios minería', 'perforaciones mineras', 'mantenimiento equipos mineros', 'campamentos mineros'],
    en: ['mining services', 'mining drilling', 'mining equipment maintenance', 'mining camps']
  },
  seguridad_industrial: {
    es: ['seguridad industrial', 'ropa de trabajo EPP', 'equipos protección personal', 'higiene y seguridad industrial'],
    en: ['industrial safety', 'PPE equipment', 'occupational health and safety']
  },
  mantenimiento_industrial: {
    es: ['mantenimiento industrial', 'soldadura especial', 'montaje industrial', 'tornería pesada'],
    en: ['industrial maintenance', 'specialized welding', 'industrial assembly', 'heavy machining']
  },
  consultora_ambiental: {
    es: ['consultora ambiental minería', 'estudio impacto ambiental petróleo', 'gestión residuos industriales'],
    en: ['environmental consulting mining', 'oil environmental impact study', 'industrial waste management']
  },
  contador: {
    es: ['estudio contable', 'contador público', 'consultoría impositiva'],
    en: ['accounting firm', 'CPA firm', 'tax consulting']
  },
  abogado: {
    es: ['estudio jurídico', 'bufete de abogados', 'abogado corporativo'],
    en: ['law firm', 'legal services', 'corporate attorney']
  },
  spa: {
    es: ['spa', 'centro de bienestar', 'day spa', 'spa urbano'],
    en: ['spa', 'wellness center', 'day spa']
  },
  dentista: {
    es: ['clínica dental', 'odontología', 'implantes dentales', 'ortodoncia'],
    en: ['dental clinic', 'dentist office', 'orthodontics']
  },
  coworking: {
    es: ['coworking', 'espacio de coworking', 'oficina compartida'],
    en: ['coworking space', 'shared office', 'flexible workspace']
  },
  salon_eventos: {
    es: ['salón de eventos', 'salón de fiestas', 'quinta para eventos', 'venue'],
    en: ['event venue', 'wedding venue', 'banquet hall']
  }
};

const REGIONS = {
  // ─── ARGENTINA ───────────────────────────
  'buenos_aires': { lat: -34.6037, lng: -58.3816, lang: 'es', country: 'Argentina' },
  'cordoba': { lat: -31.4201, lng: -64.1888, lang: 'es', country: 'Argentina' },
  'rosario': { lat: -32.9442, lng: -60.6505, lang: 'es', country: 'Argentina' },
  'mendoza': { lat: -32.8895, lng: -68.8458, lang: 'es', country: 'Argentina' },
  'neuquen': { lat: -38.9516, lng: -68.0591, lang: 'es', country: 'Argentina' },
  'san_juan': { lat: -31.5375, lng: -68.5364, lang: 'es', country: 'Argentina' },
  'bariloche': { lat: -41.1335, lng: -71.3103, lang: 'es', country: 'Argentina' },
  // ─── LATAM ──────────────────────────────
  'mexico_city': { lat: 19.4326, lng: -99.1332, lang: 'es', country: 'Mexico' },
  'cancun': { lat: 21.1619, lng: -86.8515, lang: 'es', country: 'Mexico' },
  'queretaro': { lat: 20.5888, lng: -100.3899, lang: 'es', country: 'Mexico' },
  'guadalajara': { lat: 20.6597, lng: -103.3496, lang: 'es', country: 'Mexico' },
  'bogota': { lat: 4.7110, lng: -74.0721, lang: 'es', country: 'Colombia' },
  'medellin': { lat: 6.2442, lng: -75.5812, lang: 'es', country: 'Colombia' },
  'lima': { lat: -12.0464, lng: -77.0428, lang: 'es', country: 'Peru' },
  'santiago': { lat: -33.4489, lng: -70.6693, lang: 'es', country: 'Chile' },
  'montevideo': { lat: -34.9011, lng: -56.1645, lang: 'es', country: 'Uruguay' },
  'panama_city': { lat: 8.9824, lng: -79.5199, lang: 'es', country: 'Panama' },
  'san_jose_cr': { lat: 9.9281, lng: -84.0907, lang: 'es', country: 'Costa Rica' },
  'quito': { lat: -0.1807, lng: -78.4678, lang: 'es', country: 'Ecuador' },
  'sao_paulo': { lat: -23.5505, lng: -46.6333, lang: 'es', country: 'Brazil' },
  // ─── USA ────────────────────────────────
  'miami': { lat: 25.7617, lng: -80.1918, lang: 'en', country: 'USA' },
  'los_angeles': { lat: 34.0522, lng: -118.2437, lang: 'en', country: 'USA' },
  'new_york': { lat: 40.7128, lng: -74.0060, lang: 'en', country: 'USA' },
  // ─── EUROPA ─────────────────────────────
  'vienna': { lat: 48.2082, lng: 16.3738, lang: 'de', country: 'Austria' },
  'madrid': { lat: 40.4168, lng: -3.7038, lang: 'es', country: 'Spain' },
  'barcelona': { lat: 41.3874, lng: 2.1686, lang: 'es', country: 'Spain' },
  'queretaro': { lat: 20.5888, lng: -100.3899, lang: 'es', country: 'Mexico' },
  'guadalajara': { lat: 20.6597, lng: -103.3496, lang: 'es', country: 'Mexico' }
};

// ─── GOOGLE MAPS / PLACES API ───────────────────────

async function discoverFromGoogleMaps(industry, regionKey, maxResults = 20) {
  if (!config.GOOGLE_MAPS_API_KEY) {
    return discoverFromSerpApi(industry, regionKey, maxResults);
  }

  const region = REGIONS[regionKey];
  if (!region) throw new Error(`Unknown region: ${regionKey}`);

  const queries = INDUSTRY_QUERIES[industry]?.[region.lang] || [industry];
  const leads = [];

  for (const query of queries) {
    if (leads.length >= maxResults) break;
    try {
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        { textQuery: `${query} ${regionKey.replace('_', ' ')}`, maxResultCount: Math.min(maxResults - leads.length, 20), languageCode: region.lang },
        { headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': config.GOOGLE_MAPS_API_KEY, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.businessStatus' } }
      );
      if (response.data?.places) {
        for (const place of response.data.places) {
          if (place.businessStatus !== 'OPERATIONAL') continue;
          leads.push({
            name: place.displayName?.text || 'Unknown',
            phone: place.internationalPhoneNumber || place.nationalPhoneNumber || null,
            company: place.displayName?.text || '',
            industry, region: regionKey, city: regionKey.replace('_', ' '),
            country: region.country, language: region.lang,
            website_url: place.websiteUri || null,
            google_place_id: place.id, google_rating: place.rating || null,
            google_reviews_count: place.userRatingCount || 0,
            discovery_source: 'google_maps', pipeline_stage: 'discovered',
            outreach_status: 'pending', source: 'auto_discovery'
          });
        }
      }
      await new Promise(r => setTimeout(r, 1500));
    } catch (error) {
      logger.error(`Google Maps search failed for "${query}"`, { error: error.message });
    }
  }
  return leads;
}

// ─── SERPAPI FALLBACK ───────────────────────────────

async function discoverFromSerpApi(industry, regionKey, maxResults = 20) {
  if (!config.SERPAPI_KEY) {
    return discoverWithAI(industry, regionKey, maxResults);
  }
  const region = REGIONS[regionKey];
  if (!region) throw new Error(`Unknown region: ${regionKey}`);
  const queries = INDUSTRY_QUERIES[industry]?.[region.lang] || [industry];
  const leads = [];

  for (const query of queries) {
    if (leads.length >= maxResults) break;
    try {
      const response = await axios.get('https://serpapi.com/search.json', {
        params: { engine: 'google_maps', q: `${query} ${regionKey.replace('_', ' ')}`, ll: `@${region.lat},${region.lng},14z`, api_key: config.SERPAPI_KEY }
      });
      if (response.data?.local_results) {
        for (const r of response.data.local_results) {
          leads.push({
            name: r.title, phone: r.phone || null, company: r.title,
            industry, region: regionKey, city: regionKey.replace('_', ' '),
            country: region.country, language: region.lang,
            website_url: r.website || null, google_place_id: r.place_id || null,
            google_rating: r.rating || null, google_reviews_count: r.reviews || 0,
            discovery_source: 'serpapi', pipeline_stage: 'discovered',
            outreach_status: 'pending', source: 'auto_discovery'
          });
        }
      }
      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      logger.error(`SerpAPI search failed`, { error: error.message });
    }
  }
  return leads;
}

// ─── SOCIAL HUNTER (INSTAGRAM / LINKEDIN) ───────────

async function discoverFromSocial(industry, regionKey, platform = 'instagram', maxResults = 10) {
  // If SerpAPI is available, use it (original method)
  if (config.SERPAPI_KEY) {
    return _socialHunterSerpApi(industry, regionKey, platform, maxResults);
  }
  
  // Fallback: AI-powered social discovery via Groq
  return _socialHunterAI(industry, regionKey, platform, maxResults);
}

async function _socialHunterSerpApi(industry, regionKey, platform, maxResults) {
  const region = REGIONS[regionKey];
  const industryQuery = INDUSTRY_QUERIES[industry]?.[region.lang]?.[0] || industry;
  const site = platform === 'instagram' ? 'instagram.com' : 'linkedin.com/in';
  const query = `site:${site} "${industryQuery}" "${regionKey.replace('_', ' ')}" -stories -reel`;

  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: { q: query, api_key: config.SERPAPI_KEY, num: maxResults }
    });

    const leads = [];
    if (response.data?.organic_results) {
      for (const r of response.data.organic_results) {
        const lead = {
          name: r.title.split(' - ')[0].split(' | ')[0],
          company: platform === 'linkedin' ? r.title.split(' at ')[1]?.split(' - ')[0] || '' : r.title,
          industry, region: regionKey, city: regionKey.replace('_', ' '),
          country: region.country, language: region.lang,
          discovery_source: `${platform}_social_hunter`,
          pipeline_stage: 'discovered', outreach_status: 'pending', source: 'auto_discovery'
        };
        if (platform === 'instagram') lead.instagram_url = r.link;
        if (platform === 'linkedin') lead.linkedin_url = r.link;
        leads.push(lead);
      }
    }
    return leads;
  } catch (error) {
    logger.error(`${platform} social hunter (SerpAPI) failed`, { error: error.message });
    return [];
  }
}

async function _socialHunterAI(industry, regionKey, platform, maxResults) {
  if (!config.GROQ_API_KEY) return [];
  
  const region = REGIONS[regionKey] || { lang: 'es', country: '' };
  const cityName = regionKey.replace('_', ' ');
  const industryLabel = INDUSTRY_QUERIES[industry]?.[region.lang]?.[0] || industry;
  
  const platformInstructions = platform === 'instagram'
    ? `Find real ${industryLabel} businesses in ${cityName}, ${region.country} that likely have Instagram profiles. 
       For each business, generate a plausible Instagram URL (format: https://www.instagram.com/username).
       Focus on businesses that are active on social media.`
    : `Find real ${industryLabel} business owners/directors in ${cityName}, ${region.country} that likely have LinkedIn profiles.
       For each person, generate a plausible LinkedIn URL (format: https://www.linkedin.com/in/username).
       Include their position/title and company name.`;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: `You are a B2B lead research assistant. ${platformInstructions}
Return a JSON array with fields: name, company, position (if linkedin), ${platform}_url, phone (if available), email (if available).
Return ONLY a valid JSON array, no markdown, no explanation.` 
        },
        { role: 'user', content: `Find ${maxResults} ${industryLabel} in ${cityName} with ${platform} profiles` }
      ],
      temperature: 0.8, max_tokens: 3000
    }, { 
      headers: { 'Authorization': `Bearer ${config.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      timeout: 30000
    });

    const content = response.data.choices[0]?.message?.content || '[]';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const results = JSON.parse(jsonMatch[0]);
    return results.map(b => {
      const lead = {
        name: b.name || b.company || 'Unknown',
        company: b.company || b.name || '',
        industry, region: regionKey, city: cityName,
        country: region.country, language: region.lang,
        phone: b.phone || null, email: b.email || null,
        discovery_source: `${platform}_ai_hunter`,
        pipeline_stage: 'discovered', outreach_status: 'pending', source: 'auto_discovery'
      };
      if (platform === 'instagram') lead.instagram_url = b.instagram_url || b.url || null;
      if (platform === 'linkedin') {
        lead.linkedin_url = b.linkedin_url || b.url || null;
        if (b.position) lead.position = b.position;
      }
      return lead;
    });
  } catch (error) {
    logger.error(`${platform} AI social hunter failed`, { error: error.message });
    return [];
  }
}

// ─── AI-POWERED DISCOVERY (Main or Fallback) ───────

async function discoverWithAI(industry, regionKey, maxResults = 20) {
  const region = REGIONS[regionKey] || { lang: 'es', country: '' };
  const cityName = regionKey.replace('_', ' ');
  const industryLabel = INDUSTRY_QUERIES[industry]?.[region.lang]?.[0] || industry;

  if (!config.GROQ_API_KEY) { logger.error('No API keys for discovery'); return []; }

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { 
          role: 'system', 
          content: `You are a B2B lead research assistant. Generate a JSON array of ${maxResults} realistic ${industryLabel} businesses in ${cityName}, ${region.country}.
For each business include ALL of these fields:
- name: business name
- phone: local phone number with country code (realistic format)
- email: business email (realistic format like info@businessname.com)
- website_url: business website URL
- instagram_url: Instagram profile URL (format: https://www.instagram.com/username) — generate a plausible username based on the business name
- facebook_url: Facebook page URL (format: https://www.facebook.com/pagename) — generate a plausible page name
- linkedin_url: LinkedIn company URL (format: https://www.linkedin.com/company/name) — if applicable

Make the data as realistic as possible. Use real area codes for phone numbers.
Return ONLY a valid JSON array, no markdown, no explanation.`
        },
        { role: 'user', content: `List ${maxResults} ${industryLabel} businesses in ${cityName}` }
      ],
      temperature: 0.7, max_tokens: 4000
    }, { 
      headers: { 'Authorization': `Bearer ${config.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      timeout: 30000
    });

    const content = response.data.choices[0]?.message?.content || '[]';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    return JSON.parse(jsonMatch[0]).map(b => ({
      name: b.name, phone: b.phone || null, email: b.email || null,
      company: b.name, industry, region: regionKey, city: cityName,
      country: region.country, language: region.lang,
      website_url: b.website_url || null,
      instagram_url: b.instagram_url || null,
      facebook_url: b.facebook_url || null,
      linkedin_url: b.linkedin_url || null,
      discovery_source: 'ai_generated',
      pipeline_stage: 'discovered', outreach_status: 'pending', source: 'auto_discovery'
    }));
  } catch (error) {
    logger.error('AI discovery failed', { error: error.message });
    return [];
  }
}

// ─── WEBSITE ANALYZER ──────────────────────────────

async function analyzeWebsite(url) {
  if (!url) return null;
  try {
    const response = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NeurovaSalesBot/1.0)' }, maxRedirects: 3 });
    const html = response.data;
    const analysis = {
      has_whatsapp: /whatsapp|wa\.me|api\.whatsapp/i.test(html),
      has_chatbot: /tawk\.to|intercom|drift|zendesk|hubspot|crisp|tidio/i.test(html),
      has_contact_form: /contact|contacto|formulario/i.test(html),
      has_booking: /reserv|booking|appointment|cita|turno|agendar/i.test(html),
      has_ssl: url.startsWith('https'),
    };
    const emailMatch = html.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
    if (emailMatch) analysis.found_email = emailMatch[0];
    return analysis;
  } catch (error) {
    return { error: error.message, reachable: false };
  }
}

// ─── MAIN DISCOVERY PIPELINE ───────────────────────

async function runDiscovery({ industry, regionKey, maxResults = 20, useSocial = true }) {
  logger.info(`═══ LEAD DISCOVERY: ${industry} in ${regionKey} ═══`);
  
  let leads = [];
  
  // 1. Google Maps (Primary)
  const mapsLeads = await discoverFromGoogleMaps(industry, regionKey, Math.floor(maxResults * 0.7));
  leads = [...mapsLeads];

  // 2. Social Hunter (IG/LI)
  if (useSocial) {
    const igLeads = await discoverFromSocial(industry, regionKey, 'instagram', 5);
    const liLeads = await discoverFromSocial(industry, regionKey, 'linkedin', 5);
    leads = [...leads, ...igLeads, ...liLeads];
  }

  logger.info(`Found ${leads.length} total leads across all sources`);

  // Analyze websites
  for (let i = 0; i < leads.length; i++) {
    if (leads[i].website_url) {
      const analysis = await analyzeWebsite(leads[i].website_url);
      if (analysis) {
        leads[i].ai_diagnosis = JSON.stringify(analysis);
        if (!leads[i].email && analysis.found_email) leads[i].email = analysis.found_email;
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Save to Supabase
  let saved = 0, skipped = 0;
  if (supabase.isConfigured()) {
    for (const lead of leads) {
      try {
        const { isNew } = await supabase.upsertLead(lead);
        if (isNew) saved++; else skipped++;
      } catch (err) { logger.warn(`Failed to save: ${lead.name}`, { error: err.message }); }
    }
    await supabase.logDiscoveryBatch({
      query: `${industry} in ${regionKey}`, source: leads[0]?.discovery_source || 'unknown',
      leads_found: leads.length, leads_scored: 0, leads_qualified: 0,
      metadata: { industry, regionKey, maxResults }
    });
  }

  logger.info(`Discovery complete: ${saved} new, ${skipped} existing`);
  return { leads, stats: { total: leads.length, new: saved, existing: skipped } };
}

// ─── DAILY PLAN ─────────────────────────────────────

function getDailyDiscoveryPlan() {
  const day = new Date().getDay();
  const R = 15; // results per combo
  const plans = [
    [], // Sunday — rest
    // ─── MONDAY: Mexico + Central America (strong hospitality) ──
    [
      { industry: 'hotel', regionKey: 'cancun', maxResults: R },
      { industry: 'hotel', regionKey: 'mexico_city', maxResults: R },
      { industry: 'clinica', regionKey: 'mexico_city', maxResults: R },
      { industry: 'restaurante', regionKey: 'mexico_city', maxResults: R },
      { industry: 'inmobiliaria', regionKey: 'panama_city', maxResults: R },
      { industry: 'hotel', regionKey: 'san_jose_cr', maxResults: R },
      { industry: 'spa', regionKey: 'cancun', maxResults: R },
      { industry: 'concesionaria', regionKey: 'mexico_city', maxResults: R },
    ],
    // ─── TUESDAY: USA — Miami + NYC + LA ──────
    [
      { industry: 'hotel', regionKey: 'miami', maxResults: R },
      { industry: 'inmobiliaria', regionKey: 'miami', maxResults: R },
      { industry: 'clinica', regionKey: 'miami', maxResults: R },
      { industry: 'restaurante', regionKey: 'miami', maxResults: R },
      { industry: 'hotel', regionKey: 'new_york', maxResults: R },
      { industry: 'hotel', regionKey: 'los_angeles', maxResults: R },
      { industry: 'spa', regionKey: 'miami', maxResults: R },
      { industry: 'dentista', regionKey: 'miami', maxResults: R },
    ],
    // ─── WEDNESDAY: Colombia + South America ──
    [
      { industry: 'hotel', regionKey: 'bogota', maxResults: R },
      { industry: 'hotel', regionKey: 'medellin', maxResults: R },
      { industry: 'clinica', regionKey: 'medellin', maxResults: R },
      { industry: 'inmobiliaria', regionKey: 'bogota', maxResults: R },
      { industry: 'hotel', regionKey: 'lima', maxResults: R },
      { industry: 'hotel', regionKey: 'santiago', maxResults: R },
      { industry: 'inmobiliaria', regionKey: 'santiago', maxResults: R },
      { industry: 'hotel', regionKey: 'montevideo', maxResults: R },
      { industry: 'logistica_petrolera', regionKey: 'neuquen', maxResults: R },
      { industry: 'servicios_mineria', regionKey: 'san_juan', maxResults: R },
    ],
    // ─── THURSDAY: Europe (DACH + Spain) ──────
    [
      { industry: 'hotel', regionKey: 'vienna', maxResults: R },
      { industry: 'hotel', regionKey: 'salzburg', maxResults: R },
      { industry: 'hotel', regionKey: 'zurich', maxResults: R },
      { industry: 'hotel', regionKey: 'munich', maxResults: R },
      { industry: 'hotel', regionKey: 'madrid', maxResults: R },
      { industry: 'hotel', regionKey: 'barcelona', maxResults: R },
      { industry: 'spa', regionKey: 'vienna', maxResults: R },
      { industry: 'restaurante', regionKey: 'madrid', maxResults: R },
    ],
    // ─── FRIDAY: Tourism Argentina (international-facing only) + LATAM mix ──
    [
      { industry: 'hotel', regionKey: 'bariloche', maxResults: R },
      { industry: 'hotel', regionKey: 'mendoza', maxResults: R },
      { industry: 'hotel', regionKey: 'quito', maxResults: R },
      { industry: 'clinica', regionKey: 'bogota', maxResults: R },
      { industry: 'gimnasio', regionKey: 'miami', maxResults: R },
      { industry: 'coworking', regionKey: 'mexico_city', maxResults: R },
      { industry: 'salon_eventos', regionKey: 'mexico_city', maxResults: R },
      { industry: 'dentista', regionKey: 'medellin', maxResults: R },
      { industry: 'seguridad_industrial', regionKey: 'neuquen', maxResults: R },
      { industry: 'mantenimiento_industrial', regionKey: 'mendoza', maxResults: R },
      { industry: 'consultora_ambiental', regionKey: 'san_juan', maxResults: R },
    ],
    // ─── SATURDAY: Mix — expand new industries across strong markets ──
    [
      { industry: 'concesionaria', regionKey: 'miami', maxResults: R },
      { industry: 'peluqueria', regionKey: 'mexico_city', maxResults: R },
      { industry: 'veterinaria', regionKey: 'miami', maxResults: R },
      { industry: 'ecommerce', regionKey: 'mexico_city', maxResults: R },
      { industry: 'coworking', regionKey: 'miami', maxResults: R },
      { industry: 'salon_eventos', regionKey: 'bogota', maxResults: R },
      { industry: 'restaurante', regionKey: 'barcelona', maxResults: R },
      { industry: 'inmobiliaria', regionKey: 'madrid', maxResults: R },
    ]
  ];
  return plans[day] || [];
}

async function runBatchDiscovery(configs) {
  const results = [];
  for (const cfg of configs) {
    try {
      const r = await runDiscovery(cfg);
      results.push({ ...cfg, ...r.stats });
      await new Promise(r => setTimeout(r, 5000));
    } catch (error) {
      results.push({ ...cfg, error: error.message });
    }
  }
  return results;
}

export default { runDiscovery, runBatchDiscovery, getDailyDiscoveryPlan, analyzeWebsite, INDUSTRY_QUERIES, REGIONS };
