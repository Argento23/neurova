import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config.js';
import logger from '../logger.js';
import supabase from './supabase-client.js';

// ─── ALEX SALES PERSONALITY LOAD ─────────────────────

async function loadAlexPrompt() {
  const possiblePaths = [
    path.join(process.cwd(), 'ALEX_SALES_PROMPT_V2.md'),
    path.join(process.cwd(), 'content-factory', 'ALEX_SALES_PROMPT_V2.md'),
    path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'ALEX_SALES_PROMPT_V2.md')
  ];

  for (const promptPath of possiblePaths) {
    try {
      const content = await fs.readFile(promptPath, 'utf8');
      if (content && content.includes('IDENTITY')) {
        logger.info(`Loaded Alex Sales Prompt V2 from: ${promptPath}`);
        return content;
      }
    } catch (err) {
      // Try next path
    }
  }

  logger.warn('Could not load ALEX_SALES_PROMPT_V2.md, using comprehensive inline fallback');
  return `# ALEX — NEUROVA AUTHORITY ENGINE (CHAT-OPTIMIZED)

## IDENTITY
You are Alex, an elite AI Sales Partner for Neurova. You handle high-stakes multi-channel chat conversations (WhatsApp/Instagram) with business owners. You are sophisticated, consultative, empathetic, and direct. You are an expert at identifying revenue leaks.

## GRACEFUL EXIT RULE (CRITICAL — READ CAREFULLY)
When you detect a rejection, auto-reply, bot message, or dead conversation, you MUST:
1. Send a SHORT, WARM farewell message (1-2 lines max, friendly and professional)
2. On a SEPARATE NEW LINE after your farewell, add the hidden marker \`---END---\`

⚠️ ABSOLUTE RULES:
- The \`---END---\` marker is for INTERNAL PROCESSING ONLY. The system will strip it before sending.
- NEVER write \`[STOP]\`, \`STOP\`, \`[END]\`, or any other tag inside the visible message text.
- NEVER mention that the conversation is ending in a robotic way.
- Your farewell must sound like a HUMAN saying goodbye warmly.

Triggers for graceful exit:
- "No me interesa" / "Not interested" / "No gracias"
- Automatic replies ("Gracias por contactarnos...")
- Bot responses with menus or URLs
- Out-of-office messages
- No response after your message (follow-up scenario)
- Any form of rejection or disinterest

## CRITICAL RULES
1. **LANGUAGE MIRRORING**: Respond EXCLUSIVELY in the language used by the lead. 
   - English -> English | Spanish -> Spanish | etc.
2. **BREVITY**: Max 2 short paragraphs. Max 50 words per message.
3. **AUTHORITY**: Speak as a peer to the business owner. No "telemarketer" phrases like "Can I have 90 seconds?".
4. **GOAL**: The only goal is a Revenue Audit or a Demo. Do not "over-chat".

## PRICING & BUDGET RULES (CRITICAL)
1. **No Upfront Quotes**: To avoid budget issues, do NOT give firm prices or estimates before an audit.
2. **Strategy**: If they ask for a price, tell them you need them to complete the audit first to provide a firm analysis and budget. Send them this link: https://generarise.space/?lang=es#contacto

## USEFUL LINKS & RESOURCES
- **Video Demo (Para cerrar ventas)**: https://generarise.space/assets/GenerArise.mp4
- **Onboarding / Requerimientos**: https://generarise.space/ONBOARDING_REQUERIMIENTOS.html
- **Contrato**: https://generarise.space/contrato.html

## CONVERSATION FLOW (CHAT)
1. THE ADAPTIVE HOOK: "Hola {{client_name}}. Note un detalle en {{company}}: están dejando consultas sin atender después de hora. ¿Tienen idea de cuánto ingreso se les escapa por ahí?"
2. THE CONSULTATIVE PIVOT: "No pretendo quitarte tiempo. Solo quería mostrarte cómo nuestra IA Employee cubre esos huecos 24/7. Te puedo pasar una demo corta por acá mismo. ¿Te sirve?"
3. THE AUDIT CLOSE: "Buenísimo. Te paso este link para un diagnóstico rápido de 2 min: https://generarise.space/?lang=es#contacto. Ahí vas a ver los números reales para {{company}}. Avisame cuando lo termines."
4. POST-AUDIT: "Excelente. Ya recibí los datos de tu auditoría en nuestro sistema. El siguiente paso es agendar una llamada rápida de 15 min donde te mostraré el ROI proyectado y cómo nuestra IA aplicaría exactamente a tu caso. Podes elegir el horario que mejor te quede acá: https://cal.com/gustavo-a.-dornhofer-nqjqos/auditoria-estrategica-ia/. ¿Qué día te queda mejor?"`;
}

// ─── GENERATE AI RESPONSE ───────────────────────────

export async function generateAIResponse(lead, incomingText) {
  try {
    const rawPrompt = await loadAlexPrompt();

    // Replace context variables in system prompt
    let clientName = lead.name || 'amigo/a';
    if (clientName.toLowerCase().startsWith('lead ') || clientName.toLowerCase().startsWith('ig user')) {
      clientName = 'hola';
    }

    const company = lead.company || 'tu negocio';
    const industry = lead.industry || 'tu sector';
    const diagnosis = lead.main_pain || 'posibles pérdidas de clientes por demoras en respuestas fuera de hora';

    let systemPrompt = rawPrompt
      .replace(/\{\{client_name\}\}/g, clientName)
      .replace(/\{\{company\}\}/g, company)
      .replace(/\{\{industry\}\}/g, industry)
      .replace(/\{\{ai_diagnosis\}\}/g, diagnosis);

    // Fetch conversation history from Supabase outreach log
    let chatHistory = [];
    try {
      const historyLogs = await supabase.getOutreachHistory(lead.id);
      if (historyLogs && historyLogs.length > 0) {
        // Sort ascending (oldest first)
        const sortedLogs = [...historyLogs].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        for (const log of sortedLogs) {
          let content = log.message_preview || '';
          if (log.direction === 'outbound' && content.startsWith('[Template:')) {
            // Clean up template prefix for AI readability
            const parts = content.split(' | ');
            content = parts.length > 1 ? parts.slice(1).join(' | ') : content;
          }
          chatHistory.push({
            role: log.direction === 'inbound' ? 'user' : 'assistant',
            content: content
          });
        }
      }
    } catch (historyErr) {
      logger.warn('Failed to retrieve outreach history for AI context', { error: historyErr.message });
    }

    // Ensure the current incoming message is represented in the chat history
    const lastMsg = chatHistory[chatHistory.length - 1];
    if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== incomingText) {
      chatHistory.push({ role: 'user', content: incomingText });
    }

    // Call Groq API
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...chatHistory.slice(-10) // Send the last 10 messages for rich context without overloading tokens
      ],
      temperature: 0.5, // Lower temperature for more structured B2B consultative conversation
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${config.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    let reply = response.data.choices[0]?.message?.content?.trim() || '';
    if (!reply) {
      throw new Error('Groq returned empty response');
    }

    // Check for the graceful exit rule
    let gracefulExit = false;
    if (reply.includes('---END---')) {
      gracefulExit = true;
      reply = reply.replace('---END---', '').trim();
    }

    return {
      reply,
      gracefulExit
    };

  } catch (error) {
    logger.error('Failed to generate AI auto-response', { error: error.message });
    return null;
  }
}

export default {
  generateAIResponse
};
