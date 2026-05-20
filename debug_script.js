
        // ── CONFIG ──────────────────────────────────────────────────────────────────
        const ADMIN_PASSWORD = 'Fran2605**';  // cambiá esta contraseña
        const SUPABASE_URL = 'https://gjfsylpbxxfvponhgmhz.supabase.co';
        // service_role key — acceso total. Seguro porque el Panel está protegido por contraseña.
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZnN5bHBieHhmdnBvbmhnbWh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mjc1NTA1OCwiZXhwIjoyMDg4MzMxMDU4fQ.GoZK0iUS78sx8M_e5i4rMICfnUnlxqmdWypogp-MJlQ';
        // Telnyx API Key (Local config)
        const TELNYX_API_KEY = 'YOUR_TELNYX_API_KEY';
        const PROJECTS = [
            { emoji: '🎨', name: 'AdSíntesis', tech: 'Next.js + Clerk + Supabase', url: 'https://GenerArise.space', desc: 'SaaS de generación de anuncios con IA para Meta Ads, TikTok y YouTube', status: 'active' },
            { emoji: '🤵', name: 'Stefan (VAPI)', tech: 'VAPI · Groq LLM', url: 'https://argenterio.com', desc: 'Asistente de voz SDR para Argenterío — hoteles en Austria', status: 'active' },
            { emoji: '🏹', name: 'Alex (VAPI)', tech: 'VAPI · Groq LLM', url: 'https://GenerArise.space', desc: 'Sales Hunter para GenerArise Agency', status: 'active' },
            { emoji: '🇦🇹', name: 'Argenterío', tech: 'HTML · VPS DatabaseMart', url: 'https://argenterio.com', desc: 'Landing page de consultoría para hoteles en Austria', status: 'active' },
            { emoji: '⚙️', name: 'n8n Automation', tech: 'n8n · Easypanel · Contabo VPS', url: '', desc: 'Workflows: WhatsApp, webhooks, automatización de leads', status: 'active' },
            { emoji: '🏗️', name: 'Cilo', tech: 'HTML · VPS', url: '', desc: 'Propuesta inmobiliaria / arquitectura digital', status: 'pending' },
            { emoji: '🏢', name: 'GenerArise Agency', tech: 'HTML · Cal.com', url: 'https://GenerArise.space', desc: 'Landing de la agencia principal', status: 'active' },
            // Infraestructura VPS
            { emoji: '🖥️', name: 'VPS DatabaseMart (Argenterío)', tech: '2 Cores · 4GB RAM · 60GB SSD · Mensual', url: '', desc: '⚠️ VENCE EN 5 DÍAS — Renovar ya · argenterio.com · IP: 93.127.131.98 · databasemart.com', status: 'expired' },
            { emoji: '🖥️', name: 'VPS Contabo (GenerArise)', tech: 'Cloud VPS 10 SSD · 150GB · €5.90/mes', url: '', desc: 'GenerArise.space · IP: 217.216.52.136 · IPv6 habilitado · Región: US-east · Sistema: 17236', status: 'active' },
        ];
        // ── STATE ───────────────────────────────────────────────────────────────────
        let sb = null;
        let clients = [], services = [], tools = [], alerts = [], audits = [];
        // ── AUTH ────────────────────────────────────────────────────────────────────
        // ── SETTINGS / LOCALSTORAGE ─────────────────────────────────────────────────
        // ── INIT ────────────────────────────────────────────────────────────────────
        // ── RENDER ──────────────────────────────────────────────────────────────────
        let potablesOnly = false;
        // ── AUDITS ──────────────────────────────────────────────────────────────────
        // ── CRUD ────────────────────────────────────────────────────────────────────
        let addClientOpen = false;
        // ── TOOLS CRUD ──────────────────────────────────────────────────────────────
        let addToolOpen = false;
        // ── TABS ────────────────────────────────────────────────────────────────────
        // ── COLD EMAIL OUTREACH (Paso 0 — funciona con fijos y móviles) ──
        // ── COMBO: Llamar + WhatsApp simultáneo ──
        // ── SALES ENGINE ─────────────────────────────────────────────────────────
        let salesLeads = [];
        let callLogs = [];
        let addSalesLeadOpen = false;
        let batchRunning = false;
        // ── ANTI-BAN WHATSAPP SYSTEM v3 (per-region limits) ──
        const WA_DAILY_LIMIT_PER_REGION = 20;  // 20 EU + 20 AM = 40 max
        const WA_MIN_DELAY_MS = 55000;   // 55s min (individual)
        const WA_MAX_DELAY_MS = 120000;  // 2 min max (individual)
        const WA_BATCH_MIN_DELAY = 65000;  // 65s min (batch mode)
        const WA_BATCH_MAX_DELAY = 180000; // 3 min max (batch mode)
        let waLastSendTime = 0;
        let waBatchRunning = false;
        let currentSalesView = 'new';
        let currentSalesRegion = 'all';
        EP 1 (anti-ban: message spinning + long delays) ──
         {
            if (mode === 'selected') {
                const selectedIds = Array.from(document.querySelectorAll('.sales-checkbox:checked')).map(cb => cb.value);
                targets = salesLeads.filter(l => selectedIds.includes(l.id));
                if (!targets.length) { showToast('⚠️ No seleccionaste leads'); return; }
            } else {
                // Modo exclusivo Follow-up: Ya tienen P1 pero no P2
                targets = salesLeads.filter(l => l.step1_sent_at && !l.step2_sent_at && l.phone && !analyzePhoneType(l.phone).disableWa);
                if (!targets.length) { showToast('✅ No hay leads en Stage 1 aptos para Step 2 (Seguimiento)'); return; }
            }
            const toSend = targets.length;
            const estMinutes = Math.ceil(toSend * 1.5);
            if (!confirm(`📤 Enviar Paso 2 (GenerArise Demo) a ${toSend} leads?\n\n⏱️ Tiempo estimado: ~${estMinutes} min`)) return;
            await startBatchProcess('batch_step2', targets, (lead) => getLocalizedMessage('memo', lead));
        }
        // ── BATCH WHATSAPP STEP 1 (anti-ban: message spinning + long delays) ──
        // ── UTILS ───────────────────────────────────────────────────────────────────
        // ── CREDITS ──────────────────────────────────────────────────────────────────
        const CREDIT_PROVIDERS = {
            replicate: { name: 'Replicate', maxBalance: 50 },
            fal:       { name: 'Fal.ai',    maxBalance: 30 },
            vapi:      { name: 'VAPI',       maxBalance: 20 }
        };
        // ── INVOICE GENERATOR ─────────────────────────────────────────────────────
        let invCounter = parseInt(localStorage.getItem('gr_inv_counter') || '1');
        // Initialize invoice preview on load
        document.addEventListener('DOMContentLoaded', () => {
            ['inv-type', 'inv-currency', 'inv-client', 'inv-client-detail'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('input', updateInvPreview);
                if (el) el.addEventListener('change', updateInvPreview);
            });
            updateInvPreview();
            loadSettings();
        });
        // ── BOOT ────────────────────────────────────────────────────────────────────
        if (sessionStorage.getItem('gr_auth') === '1') {
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('app').classList.add('visible');
            init();
        }
        // ── PRICING & PAYMENTS ──────────────────────────────────────────────────────
        const DEFAULT_PRICES = {
            ar: { 
                setup: 150, setup_pro: 450, monthly: 50, 
                setup_link: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=42d2e768bf714485a64dfb87905b7202",
                setup_pro_link: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=42d2e768bf714485a64dfb87905b7202",
                monthly_link: "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=42d2e768bf714485a64dfb87905b7202"
            },
            global: { 
                setup: 550, setup_pro: 1500, monthly: 150, 
                setup_link: "https://www.paypal.com/ncp/payment/RJKDFU3A6BGWG",
                setup_pro_link: "https://www.paypal.com/ncp/payment/MDKY4S3PQM52Q",
                monthly_link: "https://www.paypal.com/webapps/billing/plans/subscribe?plan_id=P-9XU62623JM449080NNHKAAHA"
            }
        };
        // ── AI DRAFTING (GEMINI) ────────────────────────────────────────────────
        const GEMINI_DEFAULT_KEY = 'AIzaSyAcAwQs046WPLLO3vkVVwlRb6R7Lm_L5ZY';
        let aiCurrentLead = null;
        let aiCurrentType = null;
        let aiLastIntent = null;
function login() {
            const pwd = document.getElementById('pwd-input').value;
            if (pwd === ADMIN_PASSWORD) {
                sessionStorage.setItem('gr_auth', '1');
                document.getElementById('auth-screen').style.display = 'none';
                document.getElementById('app').classList.add('visible');
                init();
            } else {
                document.getElementById('auth-error').textContent = 'Contraseña incorrecta';
                document.getElementById('pwd-input').value = '';
            }
        }

function logout() {
            sessionStorage.removeItem('gr_auth');
            location.reload();
        }

function saveSetting(key, value) {
            localStorage.setItem(key, value);
            showToast('✅ Guardado correctamente');
        }

function saveEvolutionConfig() {
            localStorage.setItem('evo_url', document.getElementById('evo-url').value.trim());
            localStorage.setItem('evo_apikey', document.getElementById('evo-apikey').value.trim());
            localStorage.setItem('evo_instance', document.getElementById('evo-instance').value.trim());
            localStorage.setItem('whatsapp_apikey', document.getElementById('whatsapp-apikey').value.trim());
            showToast('✅ Configuración de WhatsApp / Evolution guardada');
        }

function saveEmailConfig() {
            const key = document.getElementById('brevo-key').value.trim();
            const user = document.getElementById('gmail-user').value.trim();
            localStorage.setItem('brevo_key', key);
            localStorage.setItem('gmail_user', user);
            showToast('✅ Configuración de Email guardada');
        }

function loadSettings() {
            const fields = [
                {id: 'vapi-key', key: 'vapi_key'},
                {id: 'vapi-assistant-id', key: 'vapi_assistant_id'},
                {id: 'vapi-assistant-id-eu', key: 'vapi_assistant_id_eu'},
                {id: 'vapi-phone-id', key: 'vapi_phone_id'},
                {id: 'vapi-phone-id-eu', key: 'vapi_phone_id_eu'},
                {id: 'telegram-token', key: 'telegram_token'},
                {id: 'telegram-chat-id', key: 'telegram_chat_id'},
                {id: 'whatsapp-apikey', key: 'whatsapp_apikey'},
                {id: 'evo-url', key: 'evo_url'},
                {id: 'evo-apikey', key: 'evo_apikey'},
                {id: 'evo-instance', key: 'evo_instance'},
                {id: 'brevo-key', key: 'brevo_key'},
                {id: 'gmail-user', key: 'gmail_user'},
                {id: 'gemini-key', key: 'gemini_key'},
            ];
            fields.forEach(f => {
                const val = localStorage.getItem(f.key);
                if (val) {
                    const el = document.getElementById(f.id);
                    if (el) el.value = val;
                }
            });
        }

async function init() {
            try {
                sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                await fetchAll();
                renderProjects();
                
                // Cargar saldo de Telnyx automáticamente
                fetchTelnyxBalance();
            } catch (e) {
                showToast('⚠️ Error conectando a Supabase: ' + e.message);
                renderProjects();
                renderKPIs();
            }
        }

async function fetchAll() {
            try {
                const [cr, sr, tr, ar] = await Promise.all([
                    sb.from('agency_clients').select('*').order('created_at', { ascending: false }),
                    sb.from('agency_services').select('*, client:agency_clients(name,email)').order('end_date', { ascending: true }),
                    sb.from('agency_tools').select('*').order('name'),
                    sb.from('audit_leads').select('*').order('created_at', { ascending: false }),
                ]);
                if (cr.error?.code === '42P01') { showToast('⚠️ Ejecutá schema.sql en Supabase primero'); return; }
                clients = cr.data || [];
                services = sr.data || [];
                tools = tr.data || [];
                audits = ar.data || [];
                await fetchSalesLeads();
                computeAlerts();
                renderAll();
            } catch (e) {
                showToast('Error cargando datos');
            }
        }

function renderAll() {
            renderKPIs();
            renderOverview();
            renderOverviewLeads();
            renderClients();
            renderBilling();
            renderTools();
            renderAlerts();
            renderCredits();
            renderAudits();
            renderSalesCommand();
        }

function renderKPIs() {
            const active = clients.filter(c => c.status === 'active').length;
            const mrr = services.filter(s => s.status === 'active').reduce((sum, s) => {
                const m = s.renewal_type === 'annual' ? s.amount / 12 : s.renewal_type === 'one-time' ? 0 : s.amount;
                return sum + (s.currency === 'ARS' ? m / 1200 : m);
            }, 0);
            const costs = tools.reduce((s, t) => s + (t.monthly_cost_usd || 0), 0);
            document.getElementById('kpi-clients').textContent = active;
            document.getElementById('kpi-mrr').textContent = '$' + mrr.toFixed(0) + ' USD';
            document.getElementById('kpi-costs').textContent = '$' + costs.toFixed(0) + ' USD';
            const margin = mrr - costs;
            const el = document.getElementById('kpi-margin');
            el.textContent = '$' + margin.toFixed(0) + ' USD';
            el.style.color = margin >= 0 ? 'var(--emerald)' : 'var(--red)';
            
            // Hunter Leads counter - includes misplaced hunter leads from Clients tab
            const hunterEl = document.getElementById('kpi-hunter');
            const clientsWithoutServices = clients.filter(c => !services.find(s => s.client_id === c.id));
            if (hunterEl) hunterEl.textContent = (salesLeads ? salesLeads.length : 0) + clientsWithoutServices.length;
        }

function renderOverview() {
            const oc = document.getElementById('overview-clients');
            if (!clients.length) { oc.innerHTML = '<div class="empty"><div class="empty-icon">👥</div>Sin clientes aún</div>'; }
            else {
                oc.innerHTML = clients.slice(0, 5).map(c => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
        <div><div style="font-weight:500">${c.name}</div><div style="font-size:11px;color:var(--muted)">${c.email || c.company || '—'}</div></div>
        <span class="badge badge-${c.status}">${c.status}</span>
      </div>`).join('');
            }

            const oe = document.getElementById('overview-expirations');
            // Combine services and tools to show all upcoming expirations
            const allExpirations = [
                ...services.map(s => ({ name: s.service_name, sub: s.client?.name || 'Servicio', date: s.end_date })),
                ...tools.filter(t => t.end_date).map(t => ({ name: t.name, sub: t.category, date: t.end_date }))
            ].sort((a, b) => new Date(a.date) - new Date(b.date));

            if (!allExpirations.length) { oe.innerHTML = '<div class="empty"><div class="empty-icon">📅</div>Todo al día</div>'; }
            else {
                oe.innerHTML = allExpirations.slice(0, 5).map(exp => {
                    const d = daysUntil(exp.date);
                    const cls = d < 0 ? 'color:var(--red)' : d <= 7 ? 'color:var(--yellow)' : 'color:var(--muted)';
                    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
        <div><div style="font-weight:500">${exp.name}</div><div style="font-size:11px;color:var(--muted)">${exp.sub}</div></div>
        <span style="font-size:11px;${cls}">${d < 0 ? 'Vencido' : d === 0 ? 'Hoy' : d + 'd'}</span>
      </div>`;
                }).join('');
            }
        }

function renderOverviewLeads() {
            const ol = document.getElementById('overview-leads');
            // Combine audits, sales leads, and clients without services (hunter)
            const clientsWithoutServices = clients.filter(c => !services.find(s => s.client_id === c.id));
            const allLeads = [
                ...audits.map(a => ({ name: a.name, source: 'audit', company: a.company, date: a.created_at, phone: a.phone })),
                ...salesLeads.map(l => ({ name: l.name, source: 'sales', company: l.company, date: l.created_at, phone: l.phone })),
                ...clientsWithoutServices.map(c => ({ name: c.name, source: 'hunter_mistake', company: c.company, date: c.created_at, phone: c.phone, id: c.id }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date));

            if (!allLeads.length) { 
                ol.innerHTML = '<div class="empty"><div class="empty-icon">🚀</div>No hay leads nuevos</div>'; 
                return;
            }
            
            ol.innerHTML = allLeads.slice(0, 20).map(l => {
                const region = l.phone ? (detectRegion(l.phone) === 'europe' ? '🇪🇸' : '🇺🇸') : '🌐';
                let sourceBadge = '';
                if (l.source === 'audit') sourceBadge = '<span style="font-size:9px;background:rgba(16,185,129,.1);color:var(--emerald);padding:1px 4px;border-radius:4px;margin-left:4px">WEB AUDIT</span>';
                else if (l.source === 'sales') sourceBadge = '<span style="font-size:9px;background:rgba(124,58,237,.1);color:var(--purple-light);padding:1px 4px;border-radius:4px;margin-left:4px">N8N HUNTER</span>';
                else sourceBadge = '<span style="font-size:9px;background:rgba(239,68,68,.1);color:var(--red);padding:1px 4px;border-radius:4px;margin-left:4px">CORREGIR: EN CLIENTES</span>';
                
                return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
        <div>
            <div style="font-weight:600">${l.name} <span style="font-size:10px;opacity:0.6">${region}</span> ${sourceBadge}</div>
            <div style="font-size:11px;color:var(--muted)">${l.company || 'Sin empresa'} · ${l.source === 'audit' ? 'Inbound' : 'Outbound Cold'}</div>
        </div>
        <div style="text-align:right">
            <div style="font-size:10px;color:var(--muted)">${new Date(l.date).toLocaleDateString('es-AR')}</div>
            <button class="btn btn-ghost" style="padding:2px 8px; font-size:10px; margin-top:2px; height:22px" onclick="showTab('${l.source === 'audit' ? 'audits' : (l.source === 'sales' ? 'sales' : 'clients')}')">Ver ficha</button>
        </div>
      </div>`;
            }).join('') + (allLeads.length > 20 ? `<div style="text-align:center;padding:10px;font-size:11px;color:var(--muted)">Y ${allLeads.length - 20} leads más...</div>` : '');
        }

function renderProjects() {
            document.getElementById('projects-grid').innerHTML = PROJECTS.map(p => `
    <div class="project-card">
      <div class="project-card-top">
        <span class="project-emoji">${p.emoji}</span>
        <span class="badge badge-${p.status}">${p.status}</span>
      </div>
      <div class="project-name">${p.name}</div>
      <div class="project-tech">${p.tech}</div>
      <div style="font-size:12px;color:var(--muted);margin-top:8px">${p.desc}</div>
      ${p.url ? `<a href="${p.url}" target="_blank" class="project-url">🔗 ${p.url.replace('https://', '')}</a>` : ''}
    </div>`).join('');
        }

function clientScore(c) {
            let s = 0;
            // Tiene teléfono válido → más potable
            if (c.phone && c.phone.length > 7) s += 2;
            // Tiene email real (no placeholder)
            if (c.email && !c.email.includes('nodetectado') && !c.email.includes('SIN-EMAIL') && c.email.includes('@')) s += 2;
            // Tiene empresa/proyecto asignado
            if (c.company && c.company.trim() !== '' && c.company !== 'Agencia') s += 1;
            // Tiene notas (indica que la IA encontró info)
            if (c.notes && c.notes.length > 20) s += 1;
            // Notas mencionan keywords de interés
            const notesL = (c.notes || '').toLowerCase();
            if (notesL.includes('whatsapp') || notesL.includes('automatiz') || notesL.includes('interesado') || notesL.includes('responded')) s += 2;
            // Estado pendiente indica lead nuevo sin procesar (mejor que expired)
            if (c.status === 'pending') s += 1;
            if (c.status === 'active') s += 2;
            // Penalizar expirados
            if (c.status === 'expired') s -= 1;
            return Math.max(0, Math.min(10, s));
        }

function clientScoreLevel(score) {
            return score >= 5 ? 'hot' : score >= 3 ? 'warm' : 'cold';
        }

function togglePotablesFilter() {
            potablesOnly = !potablesOnly;
            const btn = document.getElementById('btn-potables');
            if (potablesOnly) {
                btn.style.background = 'rgba(239,68,68,.15)';
                btn.style.borderColor = 'rgba(239,68,68,.5)';
                btn.textContent = '🔥 Potables ON';
            } else {
                btn.style.background = '';
                btn.style.borderColor = 'rgba(239,68,68,.3)';
                btn.textContent = '🔥 Solo Potables';
            }
            renderClients();
        }

function renderClients(filterText = '') {
            const searchEl = document.getElementById('client-search');
            const filter = filterText || (searchEl ? searchEl.value : '');
            let list = clients;
            if (filter && filter !== 'all') {
                list = clients.filter(c => 
                    (c.company || '').toLowerCase().includes(filter.toLowerCase()) || 
                    (c.name || '').toLowerCase().includes(filter.toLowerCase())
                );
            }

            const scored = list.map(c => ({ ...c, _score: clientScore(c) }));
            const hotCount = scored.filter(c => c._score >= 5).length;
            const warmCount = scored.filter(c => c._score >= 3 && c._score < 5).length;
            const coldCount = scored.filter(c => c._score < 3).length;

            const se = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
            se('ckpi-hot', hotCount);
            se('ckpi-warm', warmCount);
            se('ckpi-cold', coldCount);
            se('ckpi-total', scored.length);

            let displayList = potablesOnly ? scored.filter(c => c._score >= 5) : scored;
            displayList.sort((a, b) => b._score - a._score);

            document.getElementById('clients-count').textContent = displayList.length + ' Miembros de Autoridad' + (potablesOnly ? ' (🔥 solo potables)' : '');
            const tbody = document.getElementById('clients-tbody');
            if (!displayList.length) { 
                tbody.innerHTML = '<tr><td colspan="9"><div class="empty" style="padding:60px; color:var(--muted);"><div class="empty-icon" style="font-size:32px; margin-bottom:16px;">👥</div>' + (potablesOnly ? 'No hay leads potables aún — necesitás leads con teléfono + email + datos completos' : 'No hay clientes para este filtro') + '</div></td></tr>'; 
                return; 
            }
            
            tbody.innerHTML = displayList.map(c => {
                const companyStr = String(c.company || 'Investigando...').trim();
                const score = c._score;
                const level = clientScoreLevel(score);
                const phoneStr = String(c.phone || '—');
                const emailStr = String(c.email || '—');
                
                return `
                <tr style="border-bottom:1px solid var(--border); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; text-align:center;"><input type="checkbox" class="client-checkbox" value="${c.id}" onchange="updateBatchButton('client')"></td>
                    <td style="padding:16px;">
                        <span style="background:rgba(255,255,255,0.05); padding:4px 8px; border-radius:6px; font-weight:800; font-family:'Inter', monospace; color:${level==='hot'?'var(--red)':level==='warm'?'var(--yellow)':'var(--sky)'};">
                            ${score} ${level === 'hot' ? '🔥' : level === 'warm' ? '🟡' : '🔵'}
                        </span>
                    </td>
                    <td style="padding:16px;">
                        <div style="font-weight:700; color:white; font-size:14px;">${c.name}</div>
                        <div style="font-size:12px; color:var(--muted); opacity:0.7;">${emailStr}</div>
                    </td>
                    <td style="padding:16px; font-weight:600; color:var(--sky); font-family:'Inter', monospace; font-size:13px;">${companyStr}</td>
                    <td style="padding:16px;">
                        <div style="font-weight:500; font-size:13px;">${phoneStr}</div>
                    </td>
                    <td style="padding:16px;">
                        <span class="badge badge-${c.status}" style="font-size:10px; font-weight:700; text-transform:uppercase;">${c.status}</span>
                    </td>
                    <td style="padding:16px; color:var(--muted); font-size:11px;">${c.created_at ? new Date(c.created_at).toLocaleDateString('es-AR') : '—'}</td>
                    <td style="padding:16px; text-align:right;">
                        <div style="display:flex; gap:6px; justify-content:flex-end; align-items:center;">
                            <button class="btn btn-ghost" style="padding:6px 10px; border:1px solid #22c55e; color:#22c55e; font-size:11px;" onclick="sendWhatsAppLead('${c.id}', 'client', 1)" title="Paso 1: Romper Hielo (Sin Link)">💬 1. Gancho</button>
                            <button class="btn btn-ghost" style="padding:4px 8px; border:1px solid #3b82f6; color:#3b82f6; font-size:11px;" onclick="sendWhatsAppLead('${c.id}', 'client', 2)" title="Paso 2: Enviar Demo/Landing">🔗 2. Demo</button>
                            <button class="btn btn-ghost" style="padding:4px 8px; border:1px solid #f59e0b; color:#f59e0b; font-size:11px;" onclick="sendWhatsAppLead('${c.id}', 'client', 3)" title="Paso 3: Enviar Link de Auditoría">📋 3. Auditoría</button>
                            <button class="btn btn-ghost" style="padding:4px 8px; border:1px solid #a855f7; color:#a855f7; font-size:11px;" onclick="sendInvoiceEmail('${c.id}')" title="Paso 5: Enviar Factura para Cobro">💰 5. Factura</button>
                            <button class="btn btn-ghost" style="padding:6px 8px; border:1px solid rgba(239,68,68,0.1); color:var(--red); font-size:10px; opacity:0.6;" onclick="deleteClient('${c.id}')" title="Eliminar Miembro">🗑️</button>
                        </div>
                    </td>
                </tr>`;
            }).join('');
        }

function renderBilling() {
            document.getElementById('billing-count').textContent = services.length + ' servicios registrados';
            const tbody = document.getElementById('billing-tbody');
            if (!services.length) { tbody.innerHTML = '<tr><td colspan="6"><div class="empty"><div class="empty-icon">💰</div>Sin servicios aún</div></td></tr>'; return; }
            tbody.innerHTML = services.map(s => {
                const d = daysUntil(s.end_date);
                const dcls = d < 0 ? 'color:var(--red)' : d <= 7 ? 'color:var(--yellow)' : 'color:var(--muted)';
                return `<tr>
      <td style="padding-left:16px;font-weight:500">${s.client?.name || '—'}</td>
      <td>${s.service_name}</td>
      <td style="color:var(--emerald);font-family:monospace">${s.amount} ${s.currency}</td>
      <td style="color:var(--muted);text-transform:capitalize">${s.renewal_type}</td>
      <td style="${dcls}">${new Date(s.end_date).toLocaleDateString('es-AR')}${d >= 0 && d <= 7 ? ' (' + d + 'd)' : d < 0 ? ' ⚠️' : ''}</td>
      <td><span class="badge badge-${s.status}">${s.status}</span></td>
    </tr>`;
            }).join('');
        }

function renderTools() {
            const grid = document.getElementById('tools-grid');
            if (!tools.length) { grid.innerHTML = '<div class="empty"><div class="empty-icon">🔧</div>Ejecutá el schema.sql en Supabase para cargar las herramientas</div>'; return; }
            grid.innerHTML = tools.map(t => {
                const expiring = t.end_date && daysUntil(t.end_date) <= 7;
                const lowBalance = t.balance !== null && t.alert_threshold !== null && t.balance <= t.alert_threshold;
                return `<div class="tool-card ${expiring || lowBalance ? 'tool-expiring' : ''}">
      <div class="tool-top">
        <div><div class="tool-name">${t.name}</div><div class="tool-cat">${t.category}</div></div>
        <span class="badge badge-${t.status === 'active' ? 'active' : 'expired'}">${t.status}</span>
      </div>
      ${t.balance !== null ? `<div style="font-size:18px; font-weight:700; color:${lowBalance ? 'var(--red)' : 'var(--emerald)'}; margin:10px 0;"> Saldo: $${t.balance.toFixed(2)}</div>` : ''}
      ${t.notes ? `<div class="tool-notes">${t.notes}</div>` : ''}
      <div class="tool-footer">
        <span style="color:var(--muted)">${t.end_date ? 'Vence: ' + new Date(t.end_date).toLocaleDateString('es-AR') : 'Sin vencimiento'}</span>
        <div style="display:flex;gap:8px;align-items:center">
            <span class="tool-cost">$${t.monthly_cost_usd || 0}/mes</span>
            <button class="btn btn-danger" style="padding:2px 8px" onclick="deleteTool('${t.id}')">🗑️</button>
        </div>
      </div>
    </div>`;
            }).join('');
        }

function renderAlerts() {
            const list = document.getElementById('alerts-list');
            const badge = document.getElementById('alert-badge');
            if (!alerts.length) {
                document.getElementById('alerts-count').textContent = '✅ Todo en orden, sin alertas activas';
                list.innerHTML = '<div class="empty"><div class="empty-icon">✅</div>Sin alertas</div>';
                badge.style.display = 'none';
                document.getElementById('nav-alerts').querySelector('.nav-icon').textContent = '🔔';
                return;
            }
            document.getElementById('alerts-count').textContent = alerts.length + ' alertas activas';
            badge.style.display = 'inline-flex';
            badge.textContent = alerts.length + ' alertas';
            list.innerHTML = alerts.map(a => `
    <div class="alert-item alert-${a.type}">
      <span class="alert-icon">${a.type === 'error' ? '🔴' : '⚠️'}</span>
      <div><div class="alert-msg">${a.msg}</div><div class="alert-detail">${a.detail}</div></div>
    </div>`).join('');
        }

function computeAlerts() {
            alerts = [
                ...services.filter(s => daysUntil(s.end_date) <= 7 && daysUntil(s.end_date) >= 0).map(s => ({ type: 'warning', msg: `Servicio "${s.service_name}" vence en ${daysUntil(s.end_date)} días`, detail: s.client?.name || '—' })),
                ...services.filter(s => daysUntil(s.end_date) < 0 && s.status !== 'expired').map(s => ({ type: 'error', msg: `Servicio "${s.service_name}" VENCIÓ`, detail: s.client?.name || '—' })),
                ...tools.filter(t => t.end_date && daysUntil(t.end_date) <= 7).map(t => ({ type: 'warning', msg: `Herramienta "${t.name}" vence pronto`, detail: t.end_date ? new Date(t.end_date).toLocaleDateString('es-AR') : '' })),
                ...PROJECTS.filter(p => p.name.includes('VPS') && (p.status === 'expired' || p.desc.includes('VENCE'))).map(p => ({ type: p.status === 'expired' ? 'error' : 'warning', msg: `Infraestructura: ${p.name}`, detail: p.desc.split('—')[0].replace('⚠️', '').trim() || 'Requiere revisión' }))
            ];
            // Credit balance alerts
            const creditProviders = ['Replicate', 'Fal.ai', 'VAPI'];
            creditProviders.forEach(name => {
                const tool = tools.find(t => t.name.toLowerCase().includes(name.toLowerCase()));
                if (tool && tool.balance !== null && tool.alert_threshold !== null && tool.balance <= tool.alert_threshold) {
                    const severity = tool.balance <= 0 ? 'error' : 'warning';
                    alerts.push({
                        type: severity,
                        msg: `💳 Créditos ${name} ${tool.balance <= 0 ? 'AGOTADOS' : 'bajos'}: $${tool.balance.toFixed(2)}`,
                        detail: `Umbral: $${tool.alert_threshold.toFixed(2)} — Recargá desde el panel de Créditos`
                    });
                }
            });
        }

function renderAudits() {
            document.getElementById('audits-count').textContent = audits.length + ' flujos de ingresos analizados';
            const tbody = document.getElementById('audits-tbody');
            if (!audits.length) { 
                tbody.innerHTML = '<tr><td colspan="8"><div class="empty" style="padding:60px; color:var(--muted);"><div class="empty-icon" style="font-size:32px; margin-bottom:16px;">📊</div>No se han detectado auditorías en el sistema</div></td></tr>'; 
                return; 
            }
            
            tbody.innerHTML = audits.map(a => {
                const pain = (a.main_pain || '—').substring(0, 50) + ((a.main_pain || '').length > 50 ? '...' : '');
                const budgetVal = a.budget || '—';
                const premiumTag = budgetVal.includes('1500') || budgetVal.includes('3000') || budgetVal.includes('5000') 
                    ? '<span style="background:rgba(16,185,129,0.1); color:var(--emerald); padding:2px 8px; border-radius:100px; font-size:10px; font-weight:700;">HIGH-POTENTIAL</span>' 
                    : '';

                return `
                <tr style="border-bottom:1px solid var(--border); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; text-align:center;"><input type="checkbox" class="audit-checkbox" value="${a.id}" onchange="updateBatchButton('audit')"></td>
                    <td style="padding:16px;">
                        <div style="font-weight:700; color:white; font-size:14px;">${a.name || '—'}</div>
                        <div style="font-size:12px; color:var(--muted); opacity:0.8;">${a.email || '—'}</div>
                    </td>
                    <td style="padding:16px; font-weight:500;">${a.company || '—'}</td>
                    <td style="padding:16px;"><span style="color:var(--sky); font-weight:600; font-size:12px; background:rgba(14,165,233,0.05); padding:4px 10px; border-radius:8px;">${a.industry || 'General'}</span></td>
                    <td style="padding:16px;">
                        <div style="color:var(--emerald); font-weight:800; font-family:'Inter', monospace; font-size:15px;">${budgetVal}</div>
                        ${premiumTag}
                    </td>
                    <td style="padding:16px; color:var(--muted); font-size:12px; max-width:200px;" title="${(a.main_pain || '').replace(/"/g, '&quot;')}">${pain}</td>
                    <td style="padding:16px; color:var(--muted); font-size:11px;">${a.created_at ? new Date(a.created_at).toLocaleDateString('es-AR') : '—'}</td>
                    <td style="padding:16px; text-align:right;">
                        <div style="display:flex; gap:6px; justify-content:flex-end; align-items:center;">
                            <button class="btn btn-primary" style="padding:6px 14px; font-size:11px; background:#a855f7; border:none;" onclick="showReport('${a.id}')" title="Paso 4: Mostrar el Blueprint generado">📄 4. Ver Blueprint</button>
                            <button class="btn btn-ghost" style="padding:4px 10px; border:1px solid #d4af37; color:#d4af37; font-size:11px;" onclick="sendInvoiceEmail('${a.id}', 'audit')" title="Paso 5: Enviar Factura Final">💰 5. Facturar</button>
                            <button class="btn btn-ghost" style="padding:4px 10px; border:1px solid var(--border2); color:white; font-size:11px;" onclick="promoteAuditToClient('${a.id}')" title="Pasar a lista de Clientes">✍️ Promover</button>
                            <button class="btn btn-ghost" style="padding:6px 10px; border:1px solid rgba(239,68,68,0.2); color:var(--red); font-size:11px;" onclick="deleteAudit('${a.id}')" title="Archivar">🗑️</button>
                        </div>
                    </td>
                </tr>`;
            }).join('');
        }

function showAIDiagnosis(id) {
            const audit = audits.find(a => a.id === id);
            if (audit && audit.ai_diagnosis) {
                alert('DIAGNÓSTICO AI para ' + (audit.company || audit.name) + ':\n\n' + audit.ai_diagnosis);
            }
        }

function showReport(id) {
            const audit = audits.find(a => a.id === id);
            if (!audit) return;
            
            document.getElementById('rep-company-name').textContent = audit.company || audit.name || 'Empresa';
            document.getElementById('rep-date').textContent = new Date(audit.created_at).toLocaleDateString();
            document.getElementById('rep-pain').textContent = audit.main_pain || 'Sin detalles especificados';
            document.getElementById('rep-budget').textContent = audit.budget || '$—';
            document.getElementById('rep-diagnosis').textContent = audit.ai_diagnosis || 'Pendiente de análisis detallado por parte de nuestros especialistas.';
            
            const modal = document.getElementById('report-modal');
            modal.style.display = 'flex';
        }

function closeReport() {
            document.getElementById('report-modal').style.display = 'none';
        }

async function promoteAuditToClient(id) {
            const audit = audits.find(a => a.id === id);
            if (!audit) return;
            if (!confirm(`¿Promover "${audit.name}" a cliente activo?`)) return;
            const { error } = await sb.from('agency_clients').insert({
                name: audit.name || '',
                email: audit.email || '',
                phone: audit.phone || '',
                company: audit.company || 'Audit Lead',
                status: 'pending',
                notes: `Industria: ${audit.industry || '—'} | Presupuesto: ${audit.budget || '—'} | Dolor: ${(audit.main_pain || '—').substring(0, 200)}\n\nDIAGNÓSTICO IA:\n${audit.ai_diagnosis || 'No generado'}`
            });
            if (error) { showToast('Error: ' + error.message); return; }
            showToast('✅ ' + audit.name + ' promovido a Clientes');
            await fetchAll();
        }

async function promoteSalesLeadToClient(id) {
            const lead = salesLeads.find(l => l.id === id);
            if (!lead) return;
            if (!confirm(`¿Promover "${lead.name}" a la lista de Clientes?`)) return;
            const { error } = await sb.from('agency_clients').insert({
                name: lead.name || '',
                email: lead.email || '',
                phone: lead.phone || '',
                company: lead.company || 'Agencia',
                status: 'pending',
                notes: `Industria: ${lead.industry || '—'} | Presupuesto: ${lead.budget_range || '—'} | Dolor: ${(lead.main_pain || '—').substring(0, 200)}`
            });
            if (error) { showToast('Error: ' + error.message); return; }
            showToast('✅ Lead promovido a Clientes');
            await fetchAll();
        }

async function deleteAudit(id) {
            if (!confirm('¿Eliminar esta auditoría?')) return;
            await sb.from('audit_leads').delete().eq('id', id);
            showToast('Auditoría eliminada');
            await fetchAll();
        }

function toggleAddClient() {
            addClientOpen = !addClientOpen;
            document.getElementById('add-client-form').style.display = addClientOpen ? 'block' : 'none';
        }

async function saveClient() {
            const name = document.getElementById('f-name').value.trim();
            if (!name) { showToast('⚠️ El nombre es obligatorio'); return; }
            const companySelect = document.getElementById('f-company-select').value;
            const companyInput = document.getElementById('f-company').value.trim();
            const brand = companySelect || companyInput;

            const { error } = await sb.from('agency_clients').insert({
                name, email: document.getElementById('f-email').value,
                phone: document.getElementById('f-phone').value,
                company: brand,
                status: document.getElementById('f-status').value,
                notes: document.getElementById('f-notes').value
            });
            if (error) { showToast('Error: ' + error.message); return; }
            showToast('✅ Cliente guardado');
            toggleAddClient();
            ['f-name', 'f-email', 'f-phone', 'f-company', 'f-notes'].forEach(id => document.getElementById(id).value = '');
            await fetchAll();
        }

async function deleteClient(id) {
            if (!confirm('¿Eliminar este cliente?')) return;
            await sb.from('agency_clients').delete().eq('id', id);
            showToast('Cliente eliminado');
            await fetchAll();
        }

function toggleAllCheckboxes(type, source) {
            const checkboxes = document.querySelectorAll(`.${type}-checkbox`);
            checkboxes.forEach(cb => cb.checked = source.checked);
            updateBatchButton(type);
        }

function updateBatchButton(type) {
            const checked = document.querySelectorAll(`.${type}-checkbox:checked`).length;
            let btnId = '';
            if (type === 'client') btnId = 'btn-delete-selected';
            else if (type === 'audit') btnId = 'btn-delete-audits';
            else if (type === 'sales') btnId = 'btn-delete-sales';
            
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.style.display = checked > 0 ? 'inline-flex' : 'none';
                btn.textContent = `🗑️ Eliminar Selección (${checked})`;
            }
        }

async function deleteSelectedItems(type) {
            const checked = document.querySelectorAll(`.${type}-checkbox:checked`);
            if (checked.length === 0) return;
            if (!confirm(`¿Eliminar ${checked.length} registros seleccionados?`)) return;
            
            showToast(`🗑️ Eliminando ${type}s...`);
            const tableMap = { client: 'agency_clients', audit: 'audit_leads', sales: 'sales_leads' };
            
            for (let i = 0; i < checked.length; i++) {
                await sb.from(tableMap[type]).delete().eq('id', checked[i].value);
            }
            
            const allCheck = document.getElementById(`${type}-select-all`);
            if (allCheck) allCheck.checked = false;
            updateBatchButton(type);
            showToast(`✅ ${checked.length} eliminados`);
            await fetchAll();
        }

async function deleteSelectedClients() { await deleteSelectedItems('client'); }

function toggleAddTool() {
            addToolOpen = !addToolOpen;
            document.getElementById('add-tool-form').style.display = addToolOpen ? 'block' : 'none';
        }

async function saveTool() {
            const name = document.getElementById('t-name').value.trim();
            if (!name) { showToast('⚠️ El nombre es obligatorio'); return; }
            const { error } = await sb.from('agency_tools').insert({
                name,
                category: document.getElementById('t-category').value,
                status: document.getElementById('t-status').value,
                monthly_cost_usd: parseFloat(document.getElementById('t-cost').value) || 0,
                end_date: document.getElementById('t-date').value || null,
                balance: parseFloat(document.getElementById('t-balance').value) || null,
                alert_threshold: parseFloat(document.getElementById('t-threshold').value) || null,
                notes: document.getElementById('t-notes').value
            });
            if (error) { showToast('Error: ' + error.message); return; }
            showToast('✅ Herramienta guardada');
            toggleAddTool();
            ['t-name', 't-category', 't-cost', 't-date', 't-balance', 't-threshold', 't-notes'].forEach(id => document.getElementById(id).value = '');
            await fetchAll();
        }

async function deleteTool(id) {
            if (!confirm('¿Eliminar esta herramienta?')) return;
            await sb.from('agency_tools').delete().eq('id', id);
            showToast('Herramienta eliminada');
            await fetchAll();
        }

function showTab(tab) {
            ['overview', 'projects', 'audits', 'sales', 'clients', 'billing', 'invoices', 'credits', 'tools', 'settings', 'alerts'].forEach(t => {
                const el = document.getElementById('tab-' + t);
                const btn = document.getElementById('nav-' + t);
                if (el) el.style.display = t === tab ? 'block' : 'none';
                if (btn) btn.classList.toggle('active', t === tab);
            });
            if (tab === 'settings') loadPriceSettings();
        }

function fillInvoice(id) {
            const client = clients.find(c => c.id === id);
            if (!client) return;
            showTab('invoices');
            document.getElementById('inv-client').value = client.name;
            document.getElementById('inv-client-detail').value = (client.company || '') + ' ' + (client.email || '');
            updateInvPreview();
            showToast('📋 Datos cargados en el generador de facturas');
        }

async function sendInvoiceEmail(id) {
            const client = clients.find(c => c.id === id);
            if (!client || !client.email) { showToast('⚠️ El cliente no tiene email'); return; }

            const key = localStorage.getItem('brevo_key');
            if (!key) {
                showToast('⚠️ Falta la API Key de Brevo en Configuración');
                showTab('settings');
                return;
            }

            if (!confirm(`¿Enviar aviso de factura a ${client.email}?`)) return;

            showToast('📤 Enviando factura...');
            
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #4f46e5;">Nueva Factura de GenerArise</h2>
                    <p>Hola <strong>${client.name}</strong>,</p>
                    <p>Se ha generado una nueva factura correspondiente a tus servicios activos con <strong>GenerArise AI Agency</strong>.</p>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Concepto:</strong> Servicio de Consultoría/Desarrollo IA</p>
                        <p style="margin: 5px 0 0 0;"><strong>Empresa:</strong> ${client.company || 'Agencia'}</p>
                    </div>
                    <p>Puedes revisar los detalles e iniciar el pago desde nuestro panel de clientes o contactando a tu asesor directo.</p>
                    <p style="margin-top: 30px; font-size: 12px; color: #64748b;">Este es un mensaje automático enviado por el Panel de Control de GenerArise.</p>
                </div>
            `;

            try {
                const res = await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': key,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: { name: "GenerArise AI Agency", email: localStorage.getItem('gmail_user') || "agencia@GenerArise.space" },
                        to: [{ email: client.email, name: client.name }],
                        subject: `📄 Factura Pendiente - GenerArise - ${client.name}`,
                        htmlContent: htmlContent
                    })
                });

                if (res.ok) {
                    showToast('✅ Factura enviada con éxito');
                } else {
                    const err = await res.json();
                    showToast('❌ Error Brevo: ' + (err.message || 'Fallo desconocido'));
                }
            } catch (error) {
                showToast('❌ Error de red: ' + error.message);
            }
        }

async function sendInvoiceFromPreview() {
            const clientName = document.getElementById('inv-client').value.trim();
            const clientDetail = document.getElementById('inv-client-detail').value.trim();
            
            if (!clientName) { showToast('⚠️ Falta el nombre del cliente'); return; }
            
            // Extract email from details
            const emailMatch = clientDetail.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (!emailMatch) { showToast('⚠️ No se detectó un email válido en los detalles'); return; }
            
            const email = emailMatch[0];
            const key = localStorage.getItem('brevo_key');
            if (!key) { showToast('⚠️ Falta API Key de Brevo'); showTab('settings'); return; }

            if (!confirm(`¿Enviar esta factura a ${email}?`)) return;
            
            showToast('📤 Enviando factura...');
            
            // Get total from preview
            const total = document.getElementById('inv-p-total').innerText;
            const itemsHtml = document.getElementById('inv-p-items').innerHTML;

            const htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <h2 style="color: #7c3aed;">GenerArise · Invoice</h2>
                    <p>Hola <strong>${clientName}</strong>,</p>
                    <p>Adjuntamos el detalle de su factura generada el ${new Date().toLocaleDateString()}.</p>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                        <h3 style="margin-top:0; color:#1e293b;">Resumen:</h3>
                        <div style="margin-bottom:15px;">
                            ${total}
                        </div>
                        <p style="font-size:12px; color:#64748b; margin-bottom:0;">
                            Por favor, realice el pago según las condiciones acordadas.
                        </p>
                    </div>
                    <p style="font-size: 11px; color: #94a3b8; margin-top: 30px;">
                        GenerArise AI Agency · Global Operations
                    </p>
                </div>
            `;

            try {
                const res = await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: { 'accept': 'application/json', 'api-key': key, 'content-type': 'application/json' },
                    body: JSON.stringify({
                        sender: { name: "GenerArise", email: localStorage.getItem('gmail_user') || "agencia@GenerArise.space" },
                        to: [{ email: email, name: clientName }],
                        subject: `📄 Factura ${document.getElementById('inv-p-number').innerText} - ${clientName}`,
                        htmlContent: htmlContent
                    })
                });
                if (res.ok) showToast('✅ Factura enviada por email');
                else showToast('❌ Error al enviar');
            } catch (e) { showToast('❌ Error de conexión'); }
        }

async function sendColdEmail(id) {
            const lead = salesLeads.find(l => l.id === id);
            if (!lead || !lead.email || lead.email.includes('nodetectado')) {
                showToast('⚠️ Este lead no tiene email válido');
                return;
            }

            const key = localStorage.getItem('brevo_key');
            if (!key) {
                showToast('⚠️ Falta la API Key de Brevo en Configuración');
                showTab('settings');
                return;
            }

            const lang = detectLanguage(lead.phone || '');
            const user = localStorage.getItem('user_name') || 'Gustavo';
            const n = lead.name || 'there';
            let rawInd = lead.industry || lead.company || '';
            if (rawInd.includes(' - ')) rawInd = rawInd.split(' - ').pop().trim();
            const ind = rawInd || (lang === 'de' ? 'Ihrem Sektor' : lang === 'en' ? 'your industry' : 'tu sector');

            const subjects = {
                es: `${n}, detectamos una oportunidad en ${ind}`,
                en: `${n}, we found a growth opportunity in ${ind}`,
                de: `${n}, wir haben eine Wachstumschance in ${ind} gefunden`,
                pt: `${n}, encontramos uma oportunidade em ${ind}`,
                fr: `${n}, nous avons trouvé une opportunité dans ${ind}`,
                it: `${n}, abbiamo trovato un'opportunità in ${ind}`
            };

            const bodies = {
                es: `<p>Hola <strong>${n}</strong>,</p>
<p>Soy ${user} de <strong>GenerArise</strong>. Estuve analizando empresas del sector <strong>${ind}</strong> y noté algo que podría interesarte.</p>
<p>Desarrollamos una herramienta de IA que automatiza la atención al cliente y el seguimiento de leads las 24 horas, en más de 30 idiomas. Empresas similares a la tuya están ahorrando entre un 40% y 70% del tiempo operativo.</p>
<p><strong>¿Te gustaría ver un demo de 2 minutos?</strong> Es totalmente gratis y sin compromiso.</p>
<p>Saludos,<br>${user}<br>GenerArise AI Agency</p>`,
                en: `<p>Hi <strong>${n}</strong>,</p>
<p>I'm ${user} from <strong>GenerArise</strong>. I've been analyzing companies in <strong>${ind}</strong> and noticed something that could help you.</p>
<p>We built an AI tool that automates customer service and lead follow-up 24/7, in 30+ languages. Similar businesses are saving 40-70% of their operational time.</p>
<p><strong>Would you like to see a 2-minute demo?</strong> It's completely free, no strings attached.</p>
<p>Best,<br>${user}<br>GenerArise AI Agency</p>`,
                de: `<p>Hallo <strong>${n}</strong>,</p>
<p>Ich bin ${user} von <strong>GenerArise</strong>. Ich habe Unternehmen im Bereich <strong>${ind}</strong> analysiert und etwas gefunden, das Sie interessieren könnte.</p>
<p>Wir haben ein KI-Tool entwickelt, das Kundenservice und Lead-Nachverfolgung rund um die Uhr in über 30 Sprachen automatisiert. Ähnliche Unternehmen sparen zwischen 40% und 70% ihrer operativen Zeit.</p>
<p><strong>Möchten Sie eine 2-Minuten-Demo sehen?</strong> Völlig kostenlos und unverbindlich.</p>
<p>Mit freundlichen Grüßen,<br>${user}<br>GenerArise AI Agency</p>`,
                pt: `<p>Olá <strong>${n}</strong>,</p>
<p>Sou ${user} da <strong>GenerArise</strong>. Analisei empresas do setor <strong>${ind}</strong> e encontrei algo que pode te interessar.</p>
<p>Desenvolvemos uma ferramenta de IA que automatiza o atendimento ao cliente e o acompanhamento de leads 24/7, em mais de 30 idiomas.</p>
<p><strong>Gostaria de ver uma demo de 2 minutos?</strong> É totalmente grátis e sem compromisso.</p>
<p>Atenciosamente,<br>${user}<br>GenerArise AI Agency</p>`,
                fr: `<p>Bonjour <strong>${n}</strong>,</p>
<p>Je suis ${user} de <strong>GenerArise</strong>. J'ai analysé des entreprises du secteur <strong>${ind}</strong> et j'ai trouvé quelque chose qui pourrait vous intéresser.</p>
<p>Nous avons développé un outil IA qui automatise le service client et le suivi des prospects 24h/24 dans plus de 30 langues.</p>
<p><strong>Souhaitez-vous voir une démo de 2 minutes ?</strong> C'est entièrement gratuit et sans engagement.</p>
<p>Cordialement,<br>${user}<br>GenerArise AI Agency</p>`,
                it: `<p>Buongiorno <strong>${n}</strong>,</p>
<p>Sono ${user} di <strong>GenerArise</strong>. Ho analizzato aziende nel settore <strong>${ind}</strong> e ho trovato qualcosa che potrebbe interessarle.</p>
<p>Abbiamo sviluppato uno strumento IA che automatizza il servizio clienti e il follow-up dei lead 24/7 in oltre 30 lingue.</p>
<p><strong>Vorrebbe vedere una demo di 2 minuti?</strong> È completamente gratuito e senza impegno.</p>
<p>Cordiali saluti,<br>${user}<br>GenerArise AI Agency</p>`
            };

            const subject = subjects[lang] || subjects.es;
            const body = bodies[lang] || bodies.es;

            const htmlContent = `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow:hidden;">
                    <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 30px; text-align: center;">
                        <h1 style="color: #a5b4fc; margin: 0; font-size: 22px; letter-spacing: 2px;">GENERARISE</h1>
                        <p style="color: #818cf8; margin: 5px 0 0; font-size: 12px;">AI-Powered Business Automation</p>
                    </div>
                    <div style="padding: 30px; color: #1a202c; line-height: 1.7; font-size: 15px; background: #ffffff;">
                        ${body}
                        <div style="text-align: center; margin-top: 25px;">
                            <a href="https://generarise.space/?lang=${lang}#contacto" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">${lang === 'de' ? 'Kostenlose Diagnose anfordern' : lang === 'en' ? 'Request Free Diagnosis' : 'Solicitar Diagnóstico Gratis'}</a>
                        </div>
                    </div>
                    <div style="background: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #eee; font-size: 11px; color: #888;">
                        <p style="margin: 0;">GenerArise AI Agency • <a href="https://generarise.space" style="color:#6366f1; text-decoration:none;">generarise.space</a></p>
                    </div>
                </div>`;

            if (!confirm(`📧 ¿Enviar email frío a ${lead.email}?\n\nAsunto: ${subject}`)) return;
            showToast('📤 Enviando email...');

            try {
                const res = await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: { 'accept': 'application/json', 'api-key': key, 'content-type': 'application/json' },
                    body: JSON.stringify({
                        sender: { name: "GenerArise", email: localStorage.getItem('gmail_user') || "agencia@generarise.space" },
                        to: [{ email: lead.email, name: lead.name || '' }],
                        subject: subject,
                        htmlContent: htmlContent
                    })
                });
                if (res.ok) {
                    showToast('✅ Email enviado con éxito');
                    await sb.from('sales_leads').update({
                        notes: (lead.notes || '') + `\n[EMAIL_SENT ${new Date().toLocaleString('es-AR')}]`,
                        step1_sent_at: lead.step1_sent_at || new Date().toISOString()
                    }).eq('id', lead.id);
                    await fetchSalesLeads(); renderSalesCommand();
                } else {
                    const err = await res.json();
                    showToast('❌ Error Brevo: ' + (err.message || 'Fallo'));
                }
            } catch (e) { showToast('❌ Error de red: ' + e.message); }
        }

function analyzePhoneType(rawPhone) {
            if (!rawPhone || rawPhone === '—') return { icon: '❓', label: 'Sin datos', disableWa: true };
            const clean = rawPhone.replace(/[^\d]/g, '');
            if (clean.length < 8) return { icon: '⚠️', label: 'Roto', disableWa: true };
            
            // Argentina (+54)
            if (clean.startsWith('54')) {
                return { icon: '📱', label: 'Celular (AR)' };
            }
            // España (+34)
            if (clean.startsWith('34')) {
                const local = clean.substring(2);
                if (local.startsWith('6') || local.startsWith('7')) return { icon: '📱', label: 'Móvil (ES)' };
                return { icon: '☎️', label: 'Fijo (ES)', disableWa: true };
            }
            // Austria (+43)
            if (clean.startsWith('43')) {
                const local = clean.substring(2);
                if (local.startsWith('6')) return { icon: '📱', label: 'Móvil (AT)' };
                return { icon: '☎️', label: 'Fijo (AT)', disableWa: true };
            }
            // Alemania (+49)
            if (clean.startsWith('49')) {
                const local = clean.substring(2);
                if (local.startsWith('15') || local.startsWith('16') || local.startsWith('17')) return { icon: '📱', label: 'Móvil (DE)' };
                return { icon: '☎️', label: 'Fijo (DE)', disableWa: true };
            }
            // México (+52)
            if (clean.startsWith('52')) {
                const local = clean.substring(2);
                // Móviles en MX: empiezan con 1 seguido de 10 dígitos, o directamente 10 dígitos con prefijo de celular
                if (local.startsWith('1') && local.length >= 10) return { icon: '📱', label: 'Celular (MX)' };
                if (local.length === 10 && (local.startsWith('55') || local.startsWith('33') || local.startsWith('81'))) return { icon: '📞', label: 'MX (Fijo/Móvil)' };
                return { icon: '☎️', label: 'Fijo (MX)', disableWa: true };
            }
            // Chile (+56)
            if (clean.startsWith('56')) {
                return clean.substring(2).startsWith('9') ? { icon: '📱', label: 'Móvil (CL)' } : { icon: '☎️', label: 'Fijo (CL)', disableWa: true };
            }
            // Colombia (+57)
            if (clean.startsWith('57')) {
                return clean.substring(2).startsWith('3') ? { icon: '📱', label: 'Celular (CO)' } : { icon: '☎️', label: 'Fijo (CO)', disableWa: true };
            }
            // Perú (+51)
            if (clean.startsWith('51')) {
                return clean.substring(2).startsWith('9') ? { icon: '📱', label: 'Móvil (PE)' } : { icon: '☎️', label: 'Fijo (PE)', disableWa: true };
            }
            // Brasil (+55)
            if (clean.startsWith('55')) {
                const local = clean.substring(4); // Skip country + area code
                if (local.startsWith('9') && local.length >= 9) return { icon: '📱', label: 'Celular (BR)' };
                return { icon: '☎️', label: 'Fijo (BR)', disableWa: true };
            }
            // UK (+44)
            if (clean.startsWith('44')) {
                const local = clean.substring(2);
                if (local.startsWith('7') && !local.startsWith('70')) return { icon: '📱', label: 'Mobile (UK)' };
                return { icon: '☎️', label: 'Landline (UK)', disableWa: true };
            }
            // Francia (+33)
            if (clean.startsWith('33')) {
                const local = clean.substring(2);
                if (local.startsWith('6') || local.startsWith('7')) return { icon: '📱', label: 'Mobile (FR)' };
                return { icon: '☎️', label: 'Fixe (FR)', disableWa: true };
            }
            // Italia (+39)
            if (clean.startsWith('39')) {
                const local = clean.substring(2);
                if (local.startsWith('3')) return { icon: '📱', label: 'Cellulare (IT)' };
                return { icon: '☎️', label: 'Fisso (IT)', disableWa: true };
            }
            // Suiza (+41)
            if (clean.startsWith('41')) {
                const local = clean.substring(2);
                if (local.startsWith('7')) return { icon: '📱', label: 'Mobil (CH)' };
                return { icon: '☎️', label: 'Festnetz (CH)', disableWa: true };
            }
            // Portugal (+351)
            if (clean.startsWith('351')) {
                const local = clean.substring(3);
                if (local.startsWith('9')) return { icon: '📱', label: 'Móvel (PT)' };
                return { icon: '☎️', label: 'Fixo (PT)', disableWa: true };
            }
            // USA / Canada (+1) — imposible distinguir fijo de móvil por prefijo
            if (clean.startsWith('1')) {
                return { icon: '📞', label: 'USA/CA (Fijo/Móvil)' };
            }
            
            // Resto del mundo — asumir desconocido
            return { icon: '📞', label: 'Internacional (?)' };
        }

function sanitizePhone(rawPhone) {
            if (!rawPhone) return null;
            const hasPlus = String(rawPhone).trim().startsWith('+');
            let cleanPhone = String(rawPhone).replace(/[^\d]/g, ''); // Solo números por defecto para API
            if (cleanPhone.length < 8) return null;

            // Si no tiene '+' explícito y no empieza con códigos de país internacionales conocidos 
            // (evitar que arruine números de España 34, México 52, etc)
            if (!hasPlus && !cleanPhone.startsWith('34') && !cleanPhone.startsWith('52') && !cleanPhone.startsWith('56') && !cleanPhone.startsWith('57') && !cleanPhone.startsWith('1')) {
                // Lógica específica para Argentina (Local numbers missing country code)
                if ((cleanPhone.startsWith('11') || cleanPhone.startsWith('2') || cleanPhone.startsWith('3')) && cleanPhone.length >= 10 && cleanPhone.length <= 11) {
                    if (!cleanPhone.startsWith('54')) cleanPhone = '549' + cleanPhone;
                }
            }
            
            // Si es Argentina pero falta el 9 de móvil (Evolution API a veces lo requiere)
            if (cleanPhone.startsWith('54') && !cleanPhone.startsWith('549') && cleanPhone.length === 12) {
                cleanPhone = '549' + cleanPhone.substring(2);
            }

            return cleanPhone;
        }

function buildAuditFormLink(params) {
            const base = 'https://GenerArise.space/';
            const lang = params.lang || 'es'; // Default es
            const name = params.name || '';
            const company = params.company || '';
            const industry = params.industry || '';
            
            // Construir querystring con orden específico
            let qs = `lang=${lang}`;
            if (name) qs += `&name=${encodeURIComponent(name)}`;
            if (company) qs += `&company=${encodeURIComponent(company)}`;
            if (industry) qs += `&industry=${encodeURIComponent(industry)}`;
            
            
            return `${base}landing.html?${qs}#audit`;
        }

function validateVapiConfig(region = 'americas') {
            const key = localStorage.getItem('vapi_key');
            let assistantId = localStorage.getItem('vapi_assistant_id');
            let phoneId = localStorage.getItem('vapi_phone_id');

            if (region === 'europe') {
                const asstEu = localStorage.getItem('vapi_assistant_id_eu');
                if (asstEu) assistantId = asstEu;
                
                const phoneEu = localStorage.getItem('vapi_phone_id_eu');
                if (phoneEu) phoneId = phoneEu;
            }

            if (!key || !assistantId || !phoneId) {
                showToast('⚠️ Falta configurar VAPI en "Configuración"');
                showTab('settings');
                return null;
            }
            if (!isUUID(assistantId)) {
                showToast('❌ El Assistant ID (Regional) no es un UUID válido');
                showTab('settings');
                return null;
            }
            if (!isUUID(phoneId)) {
                showToast('❌ El Phone Number ID (Regional) no es un UUID válido.');
                showTab('settings');
                return null;
            }
            return { key, assistantId, phoneId };
        }

async function callLead(id, type = 'client') {
            let item;
            if (type === 'client') item = clients.find(c => c.id === id);
            else if (type === 'sales') item = salesLeads.find(l => l.id === id);
            
            if (!item || !item.phone) { showToast('⚠️ No tiene teléfono'); return; }

            const cleanPhone = sanitizePhone(item.phone);
            if (!cleanPhone) { showToast('⚠️ El teléfono no es válido'); return; }

            const region = detectRegion(cleanPhone);
            const vapi = validateVapiConfig(region);
            if (!vapi) return;

            if (!confirm(`¿Iniciar llamada de calificación a ${item.name} (${cleanPhone})?`)) return;

            // Link de auditoría detallada para Alex (Paso 2)
            const formLink = buildAuditFormLink({ name: item.name, company: item.company, lang: 'es' });

            showToast('🚀 Alex está llamando...');
            try {
                const res = await fetch('https://api.vapi.ai/call', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${vapi.key}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        assistantId: vapi.assistantId,
                        phoneNumberId: vapi.phoneId,
                        customer: { number: cleanPhone },
                        assistantOverrides: {
                            variableValues: {
                                "client_name": item.name,
                                "company": item.company || 'Sin empresa',
                                "client_phone": cleanPhone,
                                "audit_form_link": formLink,
                                "pricing_info": getPricingString(cleanPhone),
                                "context": item.notes || 'Lead del panel. Paso: Calificación.',
                                "industry": 'Por determinar',
                                "budget": 'Por consultar',
                                "pain": 'Descubrir en la llamada'
                            }
                        }
                    })
                });
                const data = await res.json();
                if (res.ok) showToast('✅ Llamada en curso...');
                else {
                    console.error('Vapi Error:', data);
                    showToast(data.message || 'Fallo API Vapi');
                }
            } catch (e) {
                showToast('❌ Error de conexión con Vapi');
            }
        }

async function executeWhatsAppAction(phone, payload) {
            // ── Anti-ban: check daily limit + enforce delay ──
            if (!canSendWhatsApp(phone)) return false;
            await waitAntiBanDelay();

            const apiKey = localStorage.getItem('whatsapp_apikey');
            let evoUrl = localStorage.getItem('evo_url');
            const evoKey = localStorage.getItem('evo_apikey');
            const evoInst = localStorage.getItem('evo_instance');

            if (evoUrl && evoKey && evoInst) {
                // Fix trailing slash
                if (evoUrl.endsWith('/')) evoUrl = evoUrl.slice(0, -1);
                
                const cleanPhoneEvo = phone.replace(/[^\d]/g, ''); 
                try {
                    const res = await fetch(`${evoUrl}/message/sendText/${evoInst}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'apikey': evoKey },
                        body: JSON.stringify({ 
                            number: cleanPhoneEvo, 
                            text: payload.message,
                            options: { delay: 1200, presence: "composing", linkPreview: true }
                        })
                    });
                    if (res.ok) { trackWaSend(phone); showToast(`✅ Enviado vía Evolution API`); return true; }
                    else {
                        const errData = await res.json().catch(() => ({}));
                        console.error('Evolution API Error:', errData);
                        showToast(`❌ Error Evolution API: ${errData.response?.message?.[0] || errData.message || res.statusText}`);
                        return false;
                    }
                } catch (e) { 
                    console.error(e); 
                    showToast('❌ Falló conexión con Evolution API (CORS o Red)'); 
                    return false; 
                }
            } else if (apiKey && apiKey.startsWith('http')) {
                try {
                    const res = await fetch(apiKey, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) { trackWaSend(phone); showToast(`✅ Enviado vía Webhook n8n`); return true; }
                    else { showToast('❌ Error devolvió el Webhook'); return false; }
                } catch (e) { showToast('❌ Falló conexión con Webhook'); return false; }
            }
            return null; // No config
        }

async function testWhatsAppConnection() {
            
            const evoKey = document.getElementById('evo-apikey').value.trim();
            const evoInst = document.getElementById('evo-instance').value.trim();
            
            if (!evoUrl || !evoKey || !evoInst) {
                showToast('⚠️ Completa los datos de Evolution API primero');
                return;
            }

            if (evoUrl.endsWith('/')) evoUrl = evoUrl.slice(0, -1);
            showToast('🧪 Probando conexión con Evolution API...');

            try {
                // Try to take a look at the instance state
                const res = await fetch(`${evoUrl}/instance/connectionState/${evoInst}`, {
                    method: 'GET',
                    headers: { 'apikey': evoKey }
                });
                const data = await res.json();
                if (res.ok && data.instance?.state === 'open') {
                    showToast('✅ Evolution API: Conexión Exitosa (Instancia abierta)');
                    saveSetting('evo_url', evoUrl);
                    saveSetting('evo_apikey', evoKey);
                    saveSetting('evo_instance', evoInst);
                } else if (res.ok) {
                    showToast(`⚠️ Evolution API Conectada, pero instancia está: ${data.instance?.state || 'desconocida'}`);
                } else {
                    showToast('❌ Error al conectar: Verificá URL y API Key');
                }
            } catch (e) {
                console.error(e);
                showToast('❌ Error de red o CORS. Verificá que la URL sea accesible.');
            }
        }

async function sendWhatsAppLead(id, type = 'client', step = 1) {
            try {
                let item;
                if (type === 'client') item = clients.find(c => c.id === id);
                else if (type === 'sales') item = salesLeads.find(l => l.id === id);

                if (!item || !item.phone) { showToast('⚠️ Sin teléfono'); return; }
                if (type === 'sales' && item.last_call_result === 'not_interested') {
                    alert('⛔ BLOQUEO DE SEGURIDAD ANTI-BAN:\nEse prospecto marcó rechazo previamente. Enviar mensajes te expone a reportes en WhatsApp.');
                    return;
                }
                const cleanPhone = sanitizePhone(item.phone);
                if (!cleanPhone) { showToast('⚠️ Teléfono inválido'); return; }

                let msgId = 'hook';
                let link = null;

                if (step === 2) { 
                    msgId = 'demo'; 
                    link = `https://generarise.space/assets/GenerArise.mp4`; // Added primary video link
                } else if (step === 3) { 
                    msgId = 'audit_ask'; 
                    const itemLang = detectLanguage(item.phone || '');
                    link = buildAuditFormLink({ lang: itemLang });
                } else if (step === 5) {
                    msgId = 'closing';
                }

                const wppMsg = getLocalizedMessage(msgId, { 
                    name: item.name, 
                    phone: item.phone, 
                    industry: item.industry || item.company || '',
                    link: link 
                });
                const evoUrl = localStorage.getItem('evo_url');
                
                if (!evoUrl) {
                    const finalMsg = wppMsg + (link ? "\n\n🔗 Acceso: " + link : "");
                    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(finalMsg)}`, '_blank');
                    return;
                }

                if (!confirm(`¿Enviar Paso ${step} a ${item.name}?`)) return;
                showToast(`📤 Enviando Paso ${step}...`);

                await executeWhatsAppAction(cleanPhone, {
                    action: 'send_step_' + step,
                    phone: cleanPhone,
                    message: wppMsg,
                    audit_form_link: link
                });
                
                if (type === 'sales') {
                    if (step === 1) await sb.from('sales_leads').update({ step1_sent_at: new Date().toISOString() }).eq('id', id);
                    if (step === 2) await sb.from('sales_leads').update({ step2_sent_at: new Date().toISOString() }).eq('id', id);
                    await fetchSalesLeads(); renderSalesCommand();
                }
            } catch (err) {
                console.error('JS Error in sendWhatsAppLead:', err);
                showToast('❌ Error crítico en el botón: ' + err.message);
            }
        }

async function callAudit(id) {
            const audit = audits.find(a => a.id === id);
            if (!audit || !audit.phone) { showToast('⚠️ El lead no tiene teléfono'); return; }

            const cleanPhone = sanitizePhone(audit.phone);
            if (!cleanPhone) { showToast('⚠️ Teléfono inválido'); return; }

            const region = detectRegion(cleanPhone);
            const vapi = validateVapiConfig(region);
            if (!vapi) return;

            const formLink = buildAuditFormLink({ name: audit.name, company: audit.company, industry: audit.industry, lang: (audit.country === 'austria' ? 'de' : 'es') });
            const diagSummary = audit.ai_diagnosis ? audit.ai_diagnosis.substring(0, 300) : '';

            if (!confirm(`¿Iniciar llamada de ventas al lead ${audit.name} (${cleanPhone})?`)) return;

            showToast('🚀 Iniciando llamada con contexto completo...');
            try {
                const res = await fetch('https://api.vapi.ai/call', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${vapi.key}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        assistantId: vapi.assistantId,
                        phoneNumberId: vapi.phoneId,
                        customer: { number: cleanPhone },
                        assistantOverrides: {
                            variableValues: {
                                "client_name": audit.name,
                                "company": audit.company || 'Sin empresa especificada',
                                "client_phone": cleanPhone,
                                "audit_form_link": formLink,
                                "industry": audit.industry || 'No especificada',
                                "budget": audit.budget || 'No indicado',
                                "pain": audit.main_pain || 'No indicado',
                                "goal": audit.goal_90_days || 'No indicado',
                                "revenue": audit.monthly_revenue || 'No indicado',
                                "employees": audit.employees || 'No indicado',
                                "ai_diagnosis": diagSummary,
                                "context": `LEAD CALIFICADO. Industria: ${audit.industry || '?'}. Revenue: ${audit.monthly_revenue || '?'}. Empleados: ${audit.employees || '?'}. Presupuesto: ${audit.budget || '?'}. Dolor: ${audit.main_pain || '?'}. Meta 90d: ${audit.goal_90_days || '?'}. ${diagSummary ? 'DIAGNÓSTICO IA: ' + diagSummary : 'Sin diagnóstico IA previo.'}`
                            }
                        }
                    })
                });
                const data = await res.json();
                if (res.ok) showToast('✅ Llamada en curso con contexto completo...');
                else {
                    console.error('Vapi Error:', data);
                    let msg = data.message || 'Fallo API Vapi';
                    if (msg.includes('international calls')) msg = '❌ Necesitás crédito en Vapi para llamadas internacionales.';
                    showToast(msg);
                }
            } catch (e) { showToast('❌ Error de conexión con Vapi'); }
        }

async function sendWhatsAppAudit(id) {
            const audit = audits.find(a => a.id === id);
            if (!audit || !audit.phone) { showToast('⚠️ El lead no tiene teléfono registrado'); return; }

            const cleanPhone = sanitizePhone(audit.phone);
            if (!cleanPhone) { showToast('⚠️ Teléfono inválido'); return; }

            const formLink = buildAuditFormLink({ name: audit.name, company: audit.company, industry: audit.industry, lang: (audit.country === 'austria' ? 'de' : 'es') });
            const diagSnippet = audit.ai_diagnosis ? audit.ai_diagnosis.substring(0, 200) : '';
            const wppMsg = getLocalizedMessage('diagnosis', { name: audit.name, phone: audit.phone, industry: audit.industry, diagSnippet });

            const evoUrl = localStorage.getItem('evo_url');
            const apiKey = localStorage.getItem('whatsapp_apikey');
            
            if (!evoUrl && (!apiKey || !apiKey.startsWith('http'))) {
                const encoded = encodeURIComponent(wppMsg);
                if (confirm(`No tenés API de WhatsApp configurada.\n¿Abrir WhatsApp Web para enviarle el diagnóstico a ${audit.name}?`)) {
                    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${encoded}`, '_blank');
                }
                return;
            }

            if (!confirm(`¿Enviar diagnóstico + formulario por WhatsApp a ${audit.name} (${cleanPhone})?`)) return;
            showToast('📤 Enviando diagnóstico...');

            await executeWhatsAppAction(cleanPhone, {
                action: 'send_audit_diagnosis',
                phone: cleanPhone,
                name: audit.name,
                company: audit.company,
                industry: audit.industry,
                message: wppMsg,
                audit_form_link: formLink,
                ai_diagnosis: audit.ai_diagnosis || ''
            });
        }

async function customWhatsAppMessage(id, type) {
            let item;
            if (type === 'audit') item = audits.find(a => a.id === id);
            else if (type === 'sales') item = salesLeads.find(l => l.id === id);
            else item = clients.find(c => c.id === id);

            if (!item || !item.phone) { showToast('⚠️ No tiene teléfono registrado'); return; }

            const cleanPhone = sanitizePhone(item.phone);
            if (!cleanPhone) { showToast('⚠️ Teléfono inválido'); return; }

            const customMsg = prompt(`Pegá el mensaje a enviar por WhatsApp a ${item.name || 'este contacto'}:`);
            if (!customMsg) return;

            const evoUrl = localStorage.getItem('evo_url');
            const apiKey = localStorage.getItem('whatsapp_apikey');
            
            if (!evoUrl && (!apiKey || !apiKey.startsWith('http'))) {
                const encoded = encodeURIComponent(customMsg);
                if (confirm(`No tenés API de WhatsApp configurada.\n¿Abrir WhatsApp Web para enviar el mensaje a ${item.name}?`)) {
                    window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${encoded}`, '_blank');
                }
                return;
            }

            if (!confirm(`¿Enviar tu mensaje por WhatsApp a ${item.name} (${cleanPhone})?`)) return;
            showToast('📤 Enviando mensaje...');

            await executeWhatsAppAction(cleanPhone, {
                action: 'send_custom_message',
                phone: cleanPhone,
                name: item.name,
                company: item.company || '',
                message: customMsg
            });
        }

async function comboCallWhatsApp(type, id) {
            if (type === 'client') {
                showToast('🔥 Ejecutando llamada + WhatsApp...');
                await Promise.all([callLead(id), sendWhatsAppLead(id)]);
            } else {
                showToast('🔥 Ejecutando llamada + WhatsApp...');
                await Promise.all([callAudit(id), sendWhatsAppAudit(id)]);
            }
        }

async function testTelegram() {
            const token = document.getElementById('telegram-token').value.trim();
            const chatId = document.getElementById('telegram-chat-id').value.trim();
            if (!token || !chatId) { showToast('⚠️ Configurá token y chat id primero (y no dejes espacios)'); return; }
            
            saveSetting('telegram_token', token);
            saveSetting('telegram_chat_id', chatId);
            
            showToast('📤 Enviando mensaje de prueba...');
            try {
                const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chat_id: chatId, text: '⚡ *GenerArise Alert Test*\nConexión exitosa al Panel de Control.', parse_mode: 'Markdown' })
                });
                if (res.ok) showToast('✅ Mensaje de prueba enviado');
                else showToast('❌ Error de Telegram: ' + res.status);
            } catch (e) { showToast('❌ Error de conexión'); }
        }

async function testEmail() {
            const brevoKey = document.getElementById('brevo-key').value.trim();
            const gmailUser = document.getElementById('gmail-user').value.trim();
            if (!brevoKey || !gmailUser) { showToast('⚠️ Configurá Brevo Key y Gmail primero'); return; }

            saveSetting('brevo_key', brevoKey);
            saveSetting('gmail_user', gmailUser);

            showToast('📤 Enviando correo de prueba...');
            const result = await sendEmailNotify('⚡ GenerArise Email Test', `
                <div style="font-family:sans-serif;color:#333;padding:20px;border:1px solid #7c3aed;border-radius:10px;">
                    <h2 style="color:#7c3aed;">Conexión Exitosa</h2>
                    <p>Este es un correo de prueba enviado desde tu Panel de Control de GenerArise.</p>
                    <p>Si recibiste esto, la integración con <strong>Brevo</strong> está funcionando correctamente.</p>
                </div>
            `);
            
            if (result.ok) showToast('✅ Correo de prueba enviado');
            else showToast('❌ ' + result.msg);
        }

async function sendEmailNotify(subject, htmlContent) {
            const brevoKey = localStorage.getItem('brevo_key');
            const gmailUser = localStorage.getItem('gmail_user');
            if (!brevoKey || !gmailUser) return { ok: false, msg: 'Configuración incompleta' };

            try {
                const res = await fetch('https://api.brevo.com/v3/smtp/email', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'api-key': brevoKey,
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        sender: { name: 'GenerArise Panel', email: 'agentes.space@gmail.com' },
                        to: [{ email: gmailUser }],
                        subject: subject,
                        htmlContent: htmlContent
                    })
                });
                if (res.ok) return { ok: true };
                
                const errData = await res.json();
                console.error('Brevo API Error:', errData);
                return { ok: false, msg: errData.message || `Error ${res.status}` };
            } catch (e) {
                console.error('Brevo Connection Error:', e);
                return { ok: false, msg: 'Error de conexión con Brevo' };
            }
        }

async function notifyAllExpirations() {
            if (!alerts.length) { showToast('✅ No hay alertas para notificar'); return; }
            
            const msgTitle = `🔔 Resumen de Alertas GenerArise`;
            const msgBody = alerts.map(a => `${a.type === 'error' ? '🔴' : '⚠️'} ${a.msg} (${a.detail})`).join('\n');
            const msgFull = `${msgTitle}\n\n${msgBody}\n\n🔗 [Ver Panel](https://GenerArise.space/panel/)`;
            
            const htmlBody = `
                <div style="font-family:sans-serif;color:#333;max-width:600px;border:1px solid #ddd;border-radius:8px;padding:20px;">
                    <h2 style="color:#7c3aed;">${msgTitle}</h2>
                    <ul style="line-height:1.6;">
                        ${alerts.map(a => `<li><strong>${a.type === 'error' ? '🔴' : '⚠️'} ${a.msg}</strong>: ${a.detail}</li>`).join('')}
                    </ul>
                    <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
                    <a href="https://GenerArise.space/panel/" style="display:inline-block;background:#7c3aed;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Abrir Panel</a>
                </div>`;

            const token = localStorage.getItem('telegram_token');
            const chatId = localStorage.getItem('telegram_chat_id');
            const waKey = localStorage.getItem('whatsapp_apikey');
            const brevoKey = localStorage.getItem('brevo_key');

            let sentCount = 0;

            // 1. Telegram
            if (token && chatId) {
                try {
                    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: chatId, text: msgFull, parse_mode: 'Markdown' })
                    });
                    if (res.ok) sentCount++;
                } catch (e) { console.error('Telegram Error'); }
            }

            // 2. Email (Brevo)
            if (brevoKey) {
                const ok = await sendEmailNotify(msgTitle, htmlBody);
                if (ok) sentCount++;
            }

            // 3. WhatsApp (Evolution API Placeholder)
            if (waKey) {
                // Simulación o implementación real de Evolution API
                sentCount++; 
            }

            if (sentCount > 0) {
                showToast(`✅ Alertas enviadas por ${sentCount} servicios`);
            } else {
                showToast('⚠️ No se pudo enviar por ningún servicio. Revisá la configuración.');
            }
        }

function getWaDailySends(region) { return parseInt(localStorage.getItem('wa_daily_sends_' + region) || '0'); }

function getWaDailyDate(region) { return localStorage.getItem('wa_daily_date_' + region) || ''; }

function resetWaDailyCounter(region) {
            const today = new Date().toDateString();
            if (getWaDailyDate(region) !== today) { 
                localStorage.setItem('wa_daily_sends_' + region, '0'); 
                localStorage.setItem('wa_daily_date_' + region, today); 
            }
        }

async function startBatchProcess(action, targets, msgGenerator) {
            waBatchRunning = true;
            const bar = document.getElementById('wa-batch-bar');
            const status = document.getElementById('wa-batch-status');
            const progress = document.getElementById('wa-batch-progress');
            const cancelBtn = document.getElementById('wa-batch-cancel');
            if (bar) bar.style.display = 'flex';
            if (cancelBtn) cancelBtn.style.display = 'inline-flex';
            if (progress) progress.style.width = '0%';

            let sent = 0, failed = 0;
            const toSend = targets.length;

            for ( i < toSend; i++) {
                if (!waBatchRunning) { if (status) status.textContent = `⛔ Cancelado. Enviados: ${sent}`; break; }
                const lead = targets[i];
                const cleanPhone = sanitizePhone(lead.phone);
                
                if (status) status.textContent = `📤 ${i + 1}/${toSend}: ${lead.name}...`;
                if (progress) progress.style.width = `${((i + 1) / toSend * 100).toFixed(0)}%`;

                try {
                    const msg = msgGenerator(lead);
                    const result = await executeWhatsAppAction(cleanPhone, {
                        action: action,
                        phone: cleanPhone,
                        message: msg
                    });

                    if (result !== false && result !== null) {
                        sent++;
                        const updateData = {};
                        if (action === 'batch_step1') updateData.step1_sent_at = new Date().toISOString();
                        if (action === 'batch_step2') updateData.step2_sent_at = new Date().toISOString();
                        updateData.whatsapp_sent = true;
                        updateData.notes = (lead.notes || '') + `\n[${action.toUpperCase()} ${new Date().toLocaleString('es-AR')}]`;
                        
                        await sb.from('sales_leads').update(updateData).eq('id', lead.id);
                        if (action === 'batch_step1') lead.step1_sent_at = updateData.step1_sent_at;
                        if (action === 'batch_step2') lead.step2_sent_at = updateData.step2_sent_at;
                    } else {
                        failed++;
                    }
                } catch (e) {
                    console.error("Batch Error:", e);
                    failed++;
                }

                if (i < toSend - 1) await waitAntiBanDelay();
            }

            waBatchRunning = false;
            // Full refresh after batch
            await fetchAll();
            showToast(`✅ Proceso terminado. Enviados: ${sent} | Fallidos: ${failed}`);
            if (status) status.textContent = `✅ Completado: ${sent} enviados.`;
            if (cancelBtn) cancelBtn.style.display = 'none';
        }

function updateStageCounts() {
            const c0 = salesLeads.filter(l => !l.step1_sent_at).length;
            const c1 = salesLeads.filter(l => l.step1_sent_at && !l.step2_sent_at).length;
            const c2 = salesLeads.filter(l => l.step2_sent_at && l.last_call_result !== 'closed').length;
            const c3 = salesLeads.filter(l => l.last_call_result === 'closed').length;
            
            const el0 = document.getElementById('count-stage-0');
            const el1 = document.getElementById('count-stage-1');
            const el2 = document.getElementById('count-stage-2');
            const el3 = document.getElementById('count-stage-3');
            
            if (el0) el0.textContent = c0;
            if (el1) el1.textContent = c1;
            if (el2) el2.textContent = c2;
            if (el3) el3.textContent = c3;
        }

function canSendWhatsApp(phone) {
            const region = detectRegion(phone);
            resetWaDailyCounter(region);
            if (getWaDailySends(region) >= WA_DAILY_LIMIT_PER_REGION) { 
                showToast(`⛔ Límite alcanzado en ${region.toUpperCase()} (${WA_DAILY_LIMIT_PER_REGION} msgs).`); 
                return false; 
            }
            return true;
        }

function trackWaSend(phone) {
            const region = detectRegion(phone);
            resetWaDailyCounter(region);
            
            localStorage.setItem('wa_daily_sends_' + region, String(current + 1));
            waLastSendTime = Date.now();
        }

async function waitAntiBanDelay() {
            const elapsed = Date.now() - waLastSendTime;
            const minD = waBatchRunning ? WA_BATCH_MIN_DELAY : WA_MIN_DELAY_MS;
            const maxD = waBatchRunning ? WA_BATCH_MAX_DELAY : WA_MAX_DELAY_MS;
            const delay = minD + Math.random() * (maxD - minD);
            if (elapsed < delay && waLastSendTime > 0) {
                const wait = Math.ceil((delay - elapsed) / 1000);
                showToast(`⏳ Anti-ban: esperando ${wait}s...`);
                await new Promise(r => setTimeout(r, delay - elapsed));
            }
        }

function detectRegion(phone) {
            if (!phone) return 'americas';
            const clean = String(phone).replace(/[^\d]/g, '');
            // Europe: Spain (34), Germany (49), UK (44), France (33), Italy (39), Portugal (351), Austria (43), Switzerland (41), Belgium (32), Netherlands (31)
            const euCodes = ['34', '49', '44', '33', '39', '351', '43', '41', '32', '31'];
            if (euCodes.some(code => clean.startsWith(code))) return 'europe';
            return 'americas';
        }

function getCountryFlag(phone) {
            if (!phone) return '🏳️';
            const c = String(phone).replace(/[^\d]/g, '');
            if (c.startsWith('34')) return '🇪🇸';
            if (c.startsWith('49')) return '🇩🇪';
            if (c.startsWith('44')) return '🇬🇧';
            if (c.startsWith('33')) return '🇫🇷';
            if (c.startsWith('39')) return '🇮🇹';
            if (c.startsWith('351')) return '🇵🇹';
            if (c.startsWith('1')) return '🇺🇸';
            if (c.startsWith('54')) return '🇦🇷';
            if (c.startsWith('52')) return '🇲🇽';
            if (c.startsWith('56')) return '🇨🇱';
            if (c.startsWith('57')) return '🇨🇴';
            if (c.startsWith('51')) return '🇵🇪';
            if (c.startsWith('55')) return '🇧🇷';
            if (c.startsWith('593')) return '🇪🇨';
            if (c.startsWith('595')) return '🇵🇾';
            if (c.startsWith('598')) return '🇺🇾';
            return detectRegion(phone) === 'europe' ? '🇪🇺' : '🌎';
        }

function getLocalizedMessage(type, data) {
            const lang = detectLanguage(data.phone || '');
            
            
            if (rawInd.includes(' - ')) rawInd = rawInd.split(' - ').pop().trim();
            const ind = rawInd || (lang === 'de' ? 'Ihrer Branche' : lang === 'en' ? 'your industry' : 'tu sector');
            const diag = data.diagSnippet || '';
            const h = new Date().getHours();
            
            // Filtro de Inteligencia Simétrica (Anti-robot)
            const nameLower = n.toLowerCase();
            const indLower = (data.industry || data.company || '').toLowerCase();
            if (n && (nameLower === indLower || indLower.includes(nameLower) || nameLower.includes('hotel') || nameLower.includes('empresa') || nameLower.includes('clinic') || nameLower.trim().length <= 2)) {
                n = ''; 
            }

            const gEs = h < 12 ? 'Buen día' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
            const gEn = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
            const gDe = h < 12 ? 'Guten Morgen' : h < 17 ? 'Guten Tag' : 'Guten Abend';
            const gPt = h < 12 ? 'Bom dia' : h < 19 ? 'Boa tarde' : 'Boa noche';
            const gFr = h < 12 ? 'Bonjour' : 'Bonsoir';
            const gIt = h < 12 ? 'Buongiorno' : 'Buonasera';
            
            const msgs = {
                hook: {
                    es: `${gEs}${n ? ' ' + n : ''} 👋\nSoy Alex de GenerArise. Estuve analizando el sector de ${ind || 'tu rubro'} y veo que la mayoría de los negocios están perdiendo prospectos por la falta de un seguimiento instantáneo 24/7.\nHemos implementado Agentes de IA que filtran y agendan llamadas automáticamente.\n¿Te serviría que te envíe un resumen de 2 minutos de cómo funciona?`,
                    en: `${gEn}${n ? ' ' + n : ''} 👋\nThis is Alex from GenerArise. Analyzing the ${ind || 'industry'} sector, I see most businesses are losing prospects due to a lack of instant 24/7 follow-up.\nWe implement AI Agents that filter and schedule calls automatically.\nWould it be useful if I sent you a 2-minute summary of how it works?`,
                    de: `${gDe}${n ? ' ' + n : ''} 👋\nHier ist Alex von GenerArise. Bei der Analyse des Sektors ${ind || 'Ihrer Branche'} sehe ich, dass die meisten Unternehmen Interessenten verlieren, weil ein sofortiges 24/7-Follow-up fehlt.\nWir implementieren KI-Agenten, die Anrufe automatisch filtern und planen.\nWäre es hilfreich, wenn ich Ihnen eine 2-minütige Zusammenfassung sende, wie das funktioniert?`,
                    pt: `${gPt}${n ? ' ' + n : ''} 👋\nSou o Alex da GenerArise. Analisando o setor de ${ind || 'seu ramo'}, vejo que a maioria dos negócios está perdendo prospectos devido à falta de acompanhamento instantâneo 24/7.\nImplementamos Agentes de IA que filtram e agendam chamadas automaticamente.\nSería útil se eu enviasse um resumo de 2 minutos de como funciona?`,
                    fr: `${gFr}${n ? ' ' + n : ''} 👋\nC'est Alex de GenerArise. En analysant le secteur de ${ind || 'votre industrie'}, je constate que la plupart des entreprises perdent des prospects en raison d'un manque de suivi instantané 24/7.\nNous mettons en place des Agents IA qui filtrent et planifient automáticamente les appels.\nSerait-il utile que je vous envoie un résumé de 2 minutos sur son fonctionnement?`,
                    it: `${gIt}${n ? ' ' + n : ''} 👋\nSono Alex di GenerArise. Analizzando il settore di ${ind || 'suo ambito'}, vedo che la maggior parte delle aziende perde potenziali clienti per la mancanza di un follow-up istantaneo 24/7.\nImplementiamo Agenti IA que filtran y programan llamadas automáticamente.\nLe sería útil si le enviase un resumen de 2 minutos sobre cómo funciona?`
                },
                memo: {
                    es: `¡Genial ${n}, gracias por responder! 🙌\nMira este video corto (2 min) de como nuestra IA Alex atiende leads automáticamente:\n🎬 Video: https://generarise.space/assets/GenerArise.mp4\n📱 Demo WhatsApp: https://generarise.space/demo_whatsapp_arriola.html\n\n¿Crees que algo así te ahorraría tiempo hoy?`,
                    en: `Great ${n}, thanks for replying 🙌\nCheck out this 2-min demo of our AI Alex handling leads automatically:\n🎬 Video: https://generarise.space/assets/GenerArise.mp4\n📱 WhatsApp Demo: https://generarise.space/demo_whatsapp_arriola.html\n\nDo you think this could save you time today?`,
                    de: `Super ${n}, danke für die Rückmeldung 🙌\nSchauen Sie sich dieses kurze Video (2 Min.) an, wie unsere KI Alex Leads automatisch bearbeitet:\n🎬 Video: https://generarise.space/assets/GenerArise.mp4\n📱 WhatsApp Demo: https://generarise.space/demo_whatsapp_arriola.html\n\nGlauben Sie, dass so etwas Ihnen heute Zeit sparen würde?`,
                    pt: `Legal ${n}, obrigado pela resposta 🙌\nVeja este vídeo corto (2 min) de como nossa IA Alex atende leads automaticamente:\n🎬 Vídeo: https://generarise.space/assets/GenerArise.mp4\n📱 Demo WhatsApp: https://generarise.space/demo_whatsapp_arriola.html\n\nVocê acha que algo así te economizaria tempo hoje?`,
                    fr: `Génial ${n}, merci pour votre réponse 🙌\nRegardez cette courte vidéo (2 min) montrant comment notre IA Alex gère les prospects automatiquement:\n🎬 Vidéo : https://generarise.space/assets/GenerArise.mp4\n📱 Démo WhatsApp : https://generarise.space/demo_whatsapp_arriola.html\n\nPensez-vous que cela vous ferait gagner du temps aujourd'hui ?`,
                    it: `Ottimo ${n}, grazie per la risposta 🙌\nGuardi questo breve video (2 min) su come la nostra IA Alex gestisce i lead automaticamente:\n🎬 Video: https://generarise.space/assets/GenerArise.mp4\n📱 Demo WhatsApp: https://generarise.space/demo_whatsapp_arriola.html\n\nPensa che una soluzione del genere le farebbe risparmiare tempo oggi?`
                },
                audit_ask: {
                    es: `Veo que te interesó. Para poder darte el número de ROI exacto que podemos generarte en ${ind}, necesito que completes esta breve auditoría (Sección Contacto): ${data.link || '[LINK]'}\nCon esto te genero tu Blueprint de Crecimiento sin costo.`,
                    en: `Glad you found it interesting! To give you the exact ROI we can generate for your business, please fill out this brief audit (Contact Section): ${data.link || '[LINK]'}\nI'll then generate your Growth Blueprint for free.`,
                    de: `Freut mich, dass es Ihr Interesse geweckt hat! Um Ihnen die genaue ROI-Zahl für ${ind} geben zu können, bitte ich Sie, dieses kurze Audit auszufüllen (Abschnitt Kontakt): ${data.link || '[LINK]'}\nDamit erstelle ich Ihnen kostenlos Ihren Growth Blueprint.`,
                    pt: `Fico feliz que tenha se interesado! Para podermos dar o número exato de ROI que podemos gerar para o seu negócio en ${ind}, preciso que você preencha esta breve auditoria (Seção Contato): ${data.link || '[LINK]'}\nCom isso, geramos seu Blueprint de Crescimento sem custo.`,
                    fr: `Ravi que cela vous ait intéressé ! Pour pouvoir vous donner le chiffre exact du ROI que nous pouvons générer pour ${ind}, je vous prie de remplir ce bref audit (Section Contact) : ${data.link || '[LINK]'}\nAvec cela, je générerai votre Blueprint de Croissance gratuitement.`,
                    it: `Mi fa piacere che le interessi! Per poterle dare il numero esatto di ROI che possiamo generare per ${ind}, ho bisogno che completi questo breve audit (Sezione Contatto): ${data.link || '[LINK]'}\nCon questo genererò il suo Blueprint di Crescita gratuitamente.`
                },
                closing: {
                    es: `¡Excelente noticia! Ya revisamos tu caso y estamos listos para arrancar. ¿Te parece bien que te envíe los detalles de facturación por aquí mismo para activar tu instancia?`,
                    en: `Great news! We've reviewed your case and are ready to start. Is it okay if I send the billing details right here to activate your instance?`,
                    de: `Ausgezeichnete Neuigkeiten! Wir haben Ihren Fall geprüft und sind bereit loszulegen. Ist es für Sie in Ordnung, wenn ich Ihnen die Rechnungsdetails direkt hier schicke, um Ihre Instanz zu aktivieren?`,
                    pt: `Excelente notícia! Já revisamos seu caso e estamos prontos para começar. Tudo bem se eu enviar os detalles de cobrança por aqui mesmo para ativar sua instância?`,
                    fr: `Excellente nouvelle ! Nous avons examiné votre cas et sommes prêts à commencer. Es-tu d'accord pour que je t'envoie les détails de facturation ici même pour activer ton instance ?`,
                    it: `Ottima notizia! Abbiamo esaminato il suo caso e siamo pronti a partire. Le va bene se le invio i dettagli di fatturazione proprio qui per attivare la sua istanza?`
                },
                diagnosis: {
                    de: `${gDe} ${n} 👋\nWir haben Ihre Branche (${ind}) analysiert und wichtige Chancen gefunden.${diag ? '\n\n🤖 *Vorschau:*\n' + diag + '...' : ''}\nAntworten Sie "ZEIGEN" für den vollständigen Bericht.`,
                    pt: `${gPt} ${n} 👋\nAnalisamos seu setor (${ind}) e encontramos oportunidades chave.${diag ? '\n\n🤖 *Prévia:*\n' + diag + '...' : ''}\nResponda "QUERO VER" e compartilho o relatório.`,
                    fr: `${gFr} ${n} 👋\nNous avons analysé votre secteur (${ind}) et trouvé des opportunités clés.${diag ? '\n\n🤖 *Aperçu:*\n' + diag + '...' : ''}\nRépondez "MONTREZ-MOI" pour le rapport complet.`,
                    it: `${gIt} ${n} 👋\nAbbiamo analizzato il suo settore (${ind}) e trovato opportunità importanti.${diag ? '\n\n🤖 *Anteprima:*\n' + diag + '...' : ''}\nRisponda "VOGLIO VEDERLO" per el report completo.`
                },
                follow_up: {
                    es: `${gEs}${n ? ' ' + n : ''} 👋 Soy Alex de GenerArise.\n${data.hasDiag ? 'Analizamos tu sector y detectamos oportunidades.\n' : ''}¿Te interesa que te cuente cómo podemos ayudarte?`,
                    en: `${gEn}${n ? ' ' + n : ''} 👋 This is Alex from GenerArise.\n${data.hasDiag ? 'We analyzed your industry and found growth opportunities.\n' : ''}Would you like to hear how we can help?`,
                    de: `${gDe}${n ? ' ' + n : ''} 👋 Hier ist Alex von GenerArise.\n${data.hasDiag ? 'Wir haben Ihre Branche analysiert und Wachstumschancen entdeckt.\n' : ''}Soll ich Ihnen erklären, wie wir helfen können?`,
                    pt: `${gPt}${n ? ' ' + n : ''} 👋 Aqui é o Alex da GenerArise.\n${data.hasDiag ? 'Analisamos seu setor e identificamos oportunidades.\n' : ''}Quer saber como podemos ajudar?`,
                    fr: `${gFr}${n ? ' ' + n : ''} 👋 C'est Alex de GenerArise.\n${data.hasDiag ? 'Nous avons analysé votre secteur et trouvé des opportunités.\n' : ''}Voulez-vous saber como podemos ajudar?`,
                    it: `${gIt}${n ? ' ' + n : ''} 👋 Sono Alex di GenerArise.\n${data.hasDiag ? 'Abbiamo analizzato il suo settore e trovato opportunità.\n' : ''}Vuole sapere come possiamo aiutarla?`
                }
            };
            const langMsgs = msgs[type] || msgs.hook || {};
            const finalMsg = langMsgs[lang] || langMsgs.es || "Hola!";
            return finalMsg;
        }

function calcScore(l) {
            
            if (l.budget_range && l.budget_range !== '') s += 20;
            if (['$1K-3K','$3K-5K','$5K+'].includes(l.budget_range)) s += 10;
            if (l.main_pain && l.main_pain.length > 10) s += 15;
            if (l.form_completed) s += 20;
            if (l.form_sent && !l.form_completed) s += 5;
            if (l.call_count > 0 && l.last_call_result === 'interested') s += 20;
            if (l.call_count > 0 && l.last_call_result === 'callback') s += 10;
            if (l.ai_diagnosis) s += 10;
            if (l.urgency === 'high') s += 15;
            if (l.urgency === 'medium') s += 8;
            if (l.industry) s += 5;
            return Math.min(100, s);
        }

function getLevel(score) { return score >= 70 ? 'hot' : score >= 35 ? 'warm' : 'cold'; }

function suggestNext(l) {
            if (!l.call_count) return '📞 Primera llamada';
            switch (l.last_call_result) {
                case 'interested': return l.form_sent ? '📅 Agendar demo' : '📊 Enviar form';
                case 'callback': return '🔄 Re-llamar';
                case 'no_answer': return '📞 Reintentar';
                case 'not_interested': return '❄️ Archivar';
                case 'closed': return '✅ Cerrado';
                default: return '📞 Seguimiento';
            }
        }

async function fetchSalesLeads() {
            try {
                const [lr, cr] = await Promise.all([
                    sb.from('sales_leads').select('*').order('lead_score', { ascending: false }),
                    sb.from('sales_call_log').select('*').order('created_at', { ascending: false }).limit(20)
                ]);
                salesLeads = (lr.error && lr.error.code === '42P01') ? [] : (lr.data || []);
                callLogs = (cr.error) ? [] : (cr.data || []);
                // Recalc scores
                for (const l of salesLeads) {
                    const ns = calcScore(l);
                    if (ns !== l.lead_score) {
                        l.lead_score = ns;
                        l.interest_level = getLevel(ns);
                        sb.from('sales_leads').update({ lead_score: ns, interest_level: getLevel(ns) }).eq('id', l.id).then(() => {});
                    }
                }
                salesLeads.sort((a, b) => (b.lead_score || 0) - (a.lead_score || 0));
            } catch(e) { salesLeads = []; callLogs = []; }
        }

function setSalesFilter(view) {
            currentSalesView = view;
            document.querySelectorAll('#sf-new, #sf-funnel, #sf-closed').forEach(b => {
                b.style.background = 'transparent';
                b.style.color = 'var(--text)';
                b.style.borderColor = 'var(--border2)';
            });
            const activeBtn = document.getElementById('sf-' + view);
            if (activeBtn) {
                if (view === 'new') { activeBtn.style.background = 'var(--accent)'; activeBtn.style.color = 'white'; activeBtn.style.borderColor = 'var(--accent)'; }
                else if (view === 'closed') { activeBtn.style.background = 'rgba(16,185,129,0.1)'; activeBtn.style.color = 'var(--emerald)'; activeBtn.style.borderColor = 'var(--emerald)'; }
                else { activeBtn.style.background = 'rgba(59,130,246,0.1)'; activeBtn.style.color = 'var(--sky)'; activeBtn.style.borderColor = 'var(--sky)'; }
            }
            renderSalesCommand();
        }

function setSalesRegion(region) {
            currentSalesRegion = region;
            renderSalesCommand();
        }

function renderSalesCommand() {
            const hot = salesLeads.filter(l => getLevel(calcScore(l)) === 'hot').length;
            const warm = salesLeads.filter(l => getLevel(calcScore(l)) === 'warm').length;
            const cold = salesLeads.filter(l => getLevel(calcScore(l)) === 'cold').length;
            const today = new Date().toDateString();
            const callsToday = callLogs.filter(c => new Date(c.created_at).toDateString() === today).length;
            // Phone quality stats
            const mobileCount = salesLeads.filter(l => l.phone && !analyzePhoneType('+' + String(l.phone).replace('+','')).disableWa).length;
            const landlineCount = salesLeads.filter(l => l.phone && analyzePhoneType('+' + String(l.phone).replace('+','')).disableWa).length;
            const withEmailCount = salesLeads.filter(l => l.email && l.email.trim() !== '' && !l.email.includes('nodetectado')).length;
            const se = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
            se('sales-total', salesLeads.length); se('sales-hot', hot); se('sales-warm', warm); se('sales-cold', cold); se('sales-calls-today', callsToday);
            se('sales-mobile', mobileCount); se('sales-landline', landlineCount); se('sales-with-email', withEmailCount);
            const bb = document.getElementById('batch-bar');
            if (bb) { bb.style.display = hot > 0 ? 'flex' : 'none'; if (hot > 0) se('batch-status', hot + ' leads HOT listos para ejecución'); }
            // WA Batch bar
            const wabb = document.getElementById('wa-batch-bar');
            const unsent = salesLeads.filter(l => !l.step1_sent_at && l.phone).length;
            if (wabb && !waBatchRunning) {
                wabb.style.display = (salesLeads.length > 0) ? 'flex' : 'none';
                const ws = document.getElementById('wa-batch-status');
                if (ws) {
                    if (currentSalesRegion === 'all') {
                        ws.textContent = `${unsent} sin contactar · Seleccioná una Zona Horaria para ver tu límite`;
                    } else {
                        resetWaDailyCounter(currentSalesRegion);
                        const sends = getWaDailySends(currentSalesRegion);
                        ws.textContent = `${unsent} sin contactar en ${currentSalesRegion.toUpperCase()} · ${Math.max(0, WA_DAILY_LIMIT_PER_REGION - sends)} msgs restantes hoy`;
                    }
                }
            }

            const tbody = document.getElementById('sales-tbody');
            if (!tbody) return;

            
            
            // 1. Filtro de Estado (View)
            if (currentSalesView === 'new') {
                filteredLeads = filteredLeads.filter(l => !l.step1_sent_at && l.last_call_result !== 'closed' && l.last_call_result !== 'not_interested');
            } else if (currentSalesView === 'funnel') {
                filteredLeads = filteredLeads.filter(l => (l.step1_sent_at || l.step2_sent_at) && l.last_call_result !== 'closed' && l.last_call_result !== 'not_interested');
            } else if (currentSalesView === 'closed') {
                filteredLeads = filteredLeads.filter(l => l.last_call_result === 'closed');
            }

            // 2. Filtro de Región
            if (currentSalesRegion !== 'all') {
                filteredLeads = filteredLeads.filter(l => {
                    const phoneRegion = detectRegion(l.phone || '');
                    return phoneRegion === currentSalesRegion;
                });
            }

            // 3. Filtro Solo Móviles
            const mobileOnly = document.getElementById('filter-mobile-only');
            if (mobileOnly && mobileOnly.checked) {
                filteredLeads = filteredLeads.filter(l => {
                    if (!l.phone) return false;
                    const phoneStr = '+' + String(l.phone).replace('+', '');
                    return !analyzePhoneType(phoneStr).disableWa;
                });
            }

            // 4. Filtro Con Email
            const hasEmail = document.getElementById('filter-has-email');
            if (hasEmail && hasEmail.checked) {
                filteredLeads = filteredLeads.filter(l => l.email && l.email.trim() !== '' && !l.email.includes('nodetectado'));
            }

            if (!filteredLeads.length) {
                tbody.innerHTML = `<tr><td colspan="10"><div class="empty" style="padding:60px; color:var(--muted);"><div class="empty-icon" style="font-size:32px; margin-bottom:16px;">📞</div>${currentSalesView === 'new' ? 'Sin nuevos prospectos detectados' : 'No hay leads en esta vista'}</div></td></tr>`;
            } else {
                tbody.innerHTML = filteredLeads.map(l => {
                    const score = calcScore(l);
                    const level = getLevel(score);
                    // Add '+' sign visually
                    const phoneStr = '+' + String(l.phone || '').replace('+', '');
                    const region = l.region || detectRegion(phoneStr);
                    const flag = region === 'europe' ? '🇪🇸' : '🇺🇸';
                    const country = phoneStr.startsWith('+43') ? '🇦🇹' : flag;
                    const pType = analyzePhoneType(phoneStr);
                    const waStyle = pType.disableWa ? 'opacity:0.3; cursor:not-allowed;' : '';
                    const waAlert = pType.disableWa ? `alert('Es un ${pType.label}. Enviar WhatsApp a teléfonos fijos o rotos causará errores en Evolution API.')` : null;

                    return `
                    <tr style="border-bottom:1px solid var(--border); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                        <td style="padding:16px; text-align:center;"><input type="checkbox" class="sales-checkbox" value="${l.id}" onchange="updateBatchButton('sales')"></td>
                        <td style="padding:16px;">
                            <span class="score-badge score-${level}">
                                ${score} ${level === 'hot' ? '🔥' : level === 'warm' ? '🟡' : '🔵'}
                            </span>
                        </td>
                        <td style="padding:16px;">
                            <div style="font-weight:700; color:white; font-size:14px;">${l.name || '—'} ${l.step1_sent_at ? '<span title="Paso 1 enviado '+new Date(l.step1_sent_at).toLocaleDateString('es-AR')+'" style="font-size:9px;background:rgba(34,197,94,.15);color:#22c55e;padding:2px 6px;border-radius:4px;margin-left:4px">✅ P1</span>' : '<span title="Sin contactar" style="font-size:9px;background:rgba(100,100,122,.1);color:#64647a;padding:2px 6px;border-radius:4px;margin-left:4px">⬜ P1</span>'}</div>
                            <div style="font-size:12px; color:var(--muted); opacity:0.7;">${l.email || '—'}</div>
                        </td>
                        <td style="padding:16px; font-weight:600; color:var(--sky); font-family:'Inter', monospace; font-size:13px;">${l.company || '—'}</td>
                        <td style="padding:16px;">
                            <div style="font-weight:500; font-size:13px; display:flex; align-items:center; gap:6px;">
                                <span title="${pType.label}">${pType.icon}</span> 
                                <span>${phoneStr} ${country}</span>
                            </div>
                        </td>
                        <td style="padding:16px;">
                            <span style="color:var(--sky); font-weight:600; font-size:12px; background:rgba(14,165,233,0.05); padding:4px 10px; border-radius:8px;">${l.industry || '—'}</span>
                        </td>
                        <td style="padding:16px;">
                            <div style="font-size:11px; color:var(--muted)">${suggestNext(l)}</div>
                        </td>
                        <td style="padding:16px; text-align:right;">
                            <div style="display:flex; gap:6px; justify-content:flex-end; align-items:center; flex-wrap:wrap;">
                                <button class="btn btn-ghost" style="padding:6px 10px; border:1px solid #8b5cf6; color:#8b5cf6; font-size:10px; ${l.email && !l.email.includes('nodetectado') ? '' : 'opacity:0.3; cursor:not-allowed;'}" onclick="${l.email && !l.email.includes('nodetectado') ? `sendColdEmail('${l.id}')` : `alert('Este lead no tiene email válido')`}" title="Paso 0: Email frío vía Brevo (funciona con fijos)">📧 0. Email</button>
                                <button class="btn btn-ghost" style="padding:6px 10px; border:1px solid #22c55e; color:#22c55e; font-size:10px; ${waStyle}" onclick="${waAlert || `sendWhatsAppLead('${l.id}', 'sales', 1)`}" title="Paso 1: Romper hielo (Preguntar permiso)">💬 1. Gancho</button>
                                <button class="btn btn-ghost" style="padding:6px 10px; border:1px solid #3b82f6; color:#3b82f6; font-size:10px; ${waStyle}" onclick="${waAlert || `sendWhatsAppLead('${l.id}', 'sales', 2)`}" title="Paso 2: Enviar Landing de Autoridad">🔗 2. Demo</button>
                                <button class="btn btn-ghost" style="padding:6px 10px; border:1px solid #f59e0b; color:#f59e0b; font-size:10px; ${waStyle}" onclick="${waAlert || `sendWhatsAppLead('${l.id}', 'sales', 3)`}" title="Paso 3: Enviar Link de Auditoría">📋 3. Auditoría</button>
                                <button class="btn btn-ghost" style="padding:4px 6px;font-size:11px;color:#d4af37; border:1px solid #d4af37; ${waStyle}" onclick="${waAlert || `sendWhatsAppLead('${l.id}', 'sales', 5)`}" title="Paso 5: Cierre por WhatsApp">💰 5. Cierre Wpp</button>
                                <button class="btn btn-ghost" style="padding:4px 6px;font-size:11px;color:#d4af37; border:1px solid #d4af37;" onclick="sendInvoiceEmail('${l.id}', 'sales')" title="Paso 5: Enviar Factura Final por Email">📧 5. Email</button>
                                <button class="btn btn-ghost" style="padding:4px 6px;font-size:11px;color:var(--accent)" onclick="openAiDraft('${l.id}', 'sales')" title="IA Draft">🤖 IA</button>
                                <select class="call-result-select" onchange="updateCallResult('${l.id}',this.value)" title="Registrar estado">
                                    <option value="">— Estado —</option>
                                    <option value="interested" ${l.last_call_result==='interested'?'selected':''}>✅ Interesado</option>
                                    <option value="callback" ${l.last_call_result==='callback'?'selected':''}>🔄 Callback</option>
                                    <option value="no_answer" ${l.last_call_result==='no_answer'?'selected':''}>📵 No contestó</option>
                                    <option value="not_interested" ${l.last_call_result==='not_interested'?'selected':''}>❌ No interesado</option>
                                    <option value="closed" ${l.last_call_result==='closed'?'selected':''}>🏆 Cerrado</option>
                                </select>
                                <button class="btn btn-ghost" style="padding:4px 6px; color:var(--red); border:1px solid rgba(239,68,68,0.1); opacity:0.7;" onclick="deleteSalesLead('${l.id}')" title="Eliminar">🗑️</button>
                            </div>
                        </td>
                    </tr>`;
                }).join('');
            }

            // Call log
            const logEl = document.getElementById('call-log-list');
            const logCount = document.getElementById('call-log-count');
            if (logEl) {
                if (!callLogs.length) {
                    logEl.innerHTML = '<div class="empty"><div class="empty-icon">📞</div>Sin llamadas registradas</div>';
                } else {
                    if (logCount) logCount.textContent = callLogs.length + ' llamadas';
                    logEl.innerHTML = callLogs.slice(0, 10).map(c => {
                        const lead = salesLeads.find(l => l.id === c.lead_id);
                        const d = new Date(c.created_at);
                        return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
                            <div><span style="font-weight:500">${lead ? lead.name : 'Lead'}</span> <span style="font-size:11px;color:var(--muted)">· ${c.phone_used || ''}</span></div>
                            <div style="display:flex;gap:12px;align-items:center">
                                <span class="region-tag region-${c.region || 'americas'}">${(c.region||'americas')==='europe'?'🇪🇸':'🇺🇸'}</span>
                                <span style="font-size:11px;color:var(--muted)">${d.toLocaleDateString('es-AR')} ${d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}</span>
                            </div>
                        </div>`;
                    }).join('');
                }
            }
        }

function toggleAddSalesLead() {
            addSalesLeadOpen = !addSalesLeadOpen;
            document.getElementById('add-sales-lead-form').style.display = addSalesLeadOpen ? 'block' : 'none';
        }

async function saveSalesLead() {
            const name = document.getElementById('sl-name').value.trim();
            const phone = document.getElementById('sl-phone').value.trim();
            if (!name || !phone) { showToast('⚠️ Nombre y teléfono son obligatorios'); return; }
            const cleanPhone = sanitizePhone(phone);
            if (!cleanPhone) { showToast('⚠️ Teléfono inválido'); return; }
            const regionSel = document.getElementById('sl-region').value;
            const region = regionSel || detectRegion(cleanPhone);
            const budgetRange = document.getElementById('sl-budget').value;
            const urgency = document.getElementById('sl-urgency').value;
            const pain = document.getElementById('sl-pain').value;
            const data = {
                name, phone: cleanPhone,
                email: document.getElementById('sl-email').value,
                company: document.getElementById('sl-company').value,
                industry: document.getElementById('sl-industry').value,
                region, language: detectLanguage(cleanPhone),
                budget_range: budgetRange, urgency,
                main_pain: pain,
                notes: document.getElementById('sl-notes').value,
                lead_score: 0, interest_level: 'cold', source: 'manual'
            };
            data.lead_score = calcScore(data);
            data.interest_level = getLevel(data.lead_score);
            const { error } = await sb.from('sales_leads').insert(data);
            if (error) { showToast('Error: ' + error.message); return; }
            showToast('✅ Lead guardado');
            toggleAddSalesLead();
            ['sl-name','sl-phone','sl-email','sl-company','sl-industry','sl-pain','sl-notes'].forEach(id => document.getElementById(id).value = '');
            await fetchSalesLeads(); renderSalesCommand();
        }

async function importFromClients() {
            const misplaced = clients.filter(c => !services.find(s => s.client_id === c.id));
            if (!misplaced.length) { showToast('✅ No se detectaron leads del Hunter en Clientes'); return; }
            if (!confirm(`¿Importar ${misplaced.length} prospectos desde la tabla de Clientes hacia Sales Engine?`)) return;
            
            showToast(`⚙️ Procesando ${misplaced.length} importaciones...`);
            
            for (const c of misplaced) {
                const cleanPhone = sanitizePhone(c.phone || '');
                // Check if already in sales leads by strictly sanitizing both sides
                if (cleanPhone && salesLeads.find(l => sanitizePhone(l.phone || '') === cleanPhone)) continue;
                
                const region = detectRegion(cleanPhone);
                const data = {
                    name: c.name || 'Prospecto', phone: cleanPhone, email: c.email || '',
                    company: c.company || '', industry: '', region,
                    language: detectLanguage(cleanPhone), budget_range: '',
                    main_pain: c.notes || '', notes: 'Importado de Clientes (misplaced)',
                    source: 'hunter', lead_score: 0, interest_level: 'cold'
                };
                data.lead_score = calcScore(data);
                data.interest_level = getLevel(data.lead_score);
                const { error } = await sb.from('sales_leads').insert(data);
                if (!error) count++;
            }
            showToast(`✅ ${count} nuevos prospectos importados con éxito`);
            await fetchAll(); // Full refresh to update counters
        }

async function importFromAudits() {
            if (!audits.length) { showToast('✅ No hay auditorías para importar'); return; }
            const newAudits = audits.filter(a => {
                const phone = sanitizePhone(a.phone || '');
                const email = (a.email || '').toLowerCase();
                return !salesLeads.find(l => (phone && l.phone === phone) || (email && email !== '' && (l.email || '').toLowerCase() === email));
            });
            if (!newAudits.length) { showToast('✅ Todas las auditorías ya están en Sales Engine'); return; }
            if (!confirm(`¿Importar ${newAudits.length} leads desde Auditorías al Sales Engine?`)) return;
            showToast(`⚙️ Procesando ${newAudits.length} importaciones...`);
            
            for (const a of newAudits) {
                const cleanPhone = sanitizePhone(a.phone || '');
                const region = detectRegion(cleanPhone);
                const data = {
                    name: a.name || 'Prospecto', phone: cleanPhone, email: a.email || '',
                    company: a.company || '', industry: a.industry || '', region,
                    language: detectLanguage(cleanPhone), budget_range: a.budget || '',
                    main_pain: a.main_pain || '', urgency: a.budget ? 'medium' : 'low',
                    notes: `Importado de Auditorías. Diagnóstico: ${(a.ai_diagnosis || 'N/A').substring(0, 200)}`,
                    ai_diagnosis: a.ai_diagnosis || '',
                    source: 'audit', lead_score: 0, interest_level: 'cold', form_completed: true
                };
                data.lead_score = calcScore(data);
                data.interest_level = getLevel(data.lead_score);
                const { error } = await sb.from('sales_leads').insert(data);
                if (!error) count++;
            }
            showToast(`✅ ${count} leads de auditoría importados`);
            await fetchAll();
        }

async function smartCallSalesLead(id, callOnly) {
            const lead = salesLeads.find(l => l.id === id);
            if (!lead || !lead.phone) { showToast('⚠️ Lead sin teléfono'); return; }
            const vKey = localStorage.getItem('vapi_key');
            const aId = localStorage.getItem('vapi_assistant_id');
            if (!vKey || !aId) { showToast('⚠️ Configurá VAPI en Configuración'); showTab('settings'); return; }
            const region = lead.region || detectRegion(lead.phone);
            const phoneId = getPhoneIdForRegion(region);
            if (!phoneId) { showToast('⚠️ Falta Phone ID para ' + region); showTab('settings'); return; }
            const cleanPhone = sanitizePhone(lead.phone);
            if (!cleanPhone) { showToast('⚠️ Teléfono inválido'); return; }
            if (!confirm(`¿Llamar a ${lead.name} (${cleanPhone})${callOnly ? '' : ' + enviar WhatsApp'}?`)) return;

            const formLink = buildAuditFormLink({ name: lead.name, company: lead.company, industry: lead.industry, lang: 'es' });

            // 1. CALL
            showToast('🚀 Iniciando llamada (' + (region === 'europe' ? '🇪🇸 Europa' : '🇺🇸 Américas') + ')...');
            try {
                const res = await fetch('https://api.vapi.ai/call', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${vKey}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        assistantId: aId, phoneNumberId: phoneId,
                        customer: { number: cleanPhone },
                        assistantOverrides: { variableValues: {
                            client_name: lead.name, company: lead.company || '',
                            industry: lead.industry || '', region: region,
                            budget: lead.budget_range || '', pain: lead.main_pain || '',
                            pricing_info: getPricingString(cleanPhone),
                            ai_diagnosis: (lead.ai_diagnosis || '').substring(0, 300),
                            audit_form_link: formLink, lead_score: String(lead.lead_score || 0),
                            context: `Lead Score: ${lead.lead_score}. Nivel: ${lead.interest_level}. Llamadas previas: ${lead.call_count || 0}. ${lead.last_call_result ? 'Último resultado: ' + lead.last_call_result + '.' : ''} ${lead.notes || ''}`
                        }}
                    })
                });
                const data = await res.json();
                if (res.ok) {
                    showToast('✅ Llamada en curso...');
                    // Log call
                    await sb.from('sales_call_log').insert({ lead_id: lead.id, phone_used: cleanPhone, region, vapi_call_id: data.id || '' });
                    await sb.from('sales_leads').update({ call_count: (lead.call_count || 0) + 1, last_call_at: new Date().toISOString() }).eq('id', lead.id);
                } else {
                    
                    if (msg.includes('international')) msg = '❌ Cargá crédito en Vapi para llamadas internacionales → dashboard.vapi.ai/billing';
                    showToast(msg);
                }
            } catch(e) { showToast('❌ Error de conexión'); }

            // 2. WhatsApp (if not callOnly)
            if (!callOnly && lead.phone) {
                const wppMsg = getLocalizedMessage('follow_up', { name: lead.name, phone: lead.phone, industry: lead.industry, hasDiag: !!lead.ai_diagnosis });
                const apiKey = localStorage.getItem('whatsapp_apikey');
                if (!apiKey) {
                    const encoded = encodeURIComponent(wppMsg);
                    window.open(`https://wa.me/${cleanPhone.replace('+','')}?text=${encoded}`, '_blank');
                } else if (apiKey.startsWith('http')) {
                    fetch(apiKey, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'send_audit_form', phone:cleanPhone, name:lead.name, message:wppMsg, audit_form_link:formLink }) }).catch(() => {});
                }
                await sb.from('sales_leads').update({ whatsapp_sent: true, form_sent: true }).eq('id', lead.id);
            }
            await fetchSalesLeads(); renderSalesCommand();
        }

async function updateCallResult(id, result) {
            if (!result) return;
            if (result === 'not_interested') {
                if (confirm('❌ ¿Eliminar definitivamente este lead por falta de interés?\n\n(Esto lo borra del Cazador y panel para protegerte de reportes de Spam)')) {
                    await sb.from('sales_leads').delete().eq('id', id);
                    showToast('🗑️ Lead eliminado permanentemente');
                    await fetchSalesLeads(); renderSalesCommand();
                    return;
                }
            }
            await sb.from('sales_leads').update({ last_call_result: result }).eq('id', id);
            const lead = salesLeads.find(l => l.id === id);
            if (lead) { lead.last_call_result = result; }
            showToast('📋 Resultado actualizado');
            await fetchSalesLeads(); renderSalesCommand();
        }

async function batchCallHot() {
            const hotLeads = salesLeads.filter(l => getLevel(calcScore(l)) === 'hot' && l.phone);
            if (!hotLeads.length) { showToast('⚠️ No hay leads HOT con teléfono'); return; }
            if (!confirm(`¿Llamar a ${hotLeads.length} leads HOT secuencialmente? (2 min entre cada llamada)`)) return;
            batchRunning = true;
            for ( i < hotLeads.length; i++) {
                if (!batchRunning) break;
                const lead = hotLeads[i];
                document.getElementById('batch-status').textContent = `Llamando ${i+1}/${hotLeads.length}: ${lead.name}...`;
                await smartCallSalesLead(lead.id);
                if (i < hotLeads.length - 1 && batchRunning) {
                    document.getElementById('batch-status').textContent = `Esperando 2 min antes de la siguiente...`;
                    await new Promise(r => setTimeout(r, 120000));
                }
            }
            batchRunning = false;
            document.getElementById('batch-status').textContent = '✅ Blast completado';
            showToast('✅ Batch calling completado');
        }

function getHookVariant(lead) {
            const lang = detectLanguage(lead.phone || '');
            const n = (lead.name || '').split(' ')[0]; // Solo primer nombre = más personal
            // Sanitize: only use industry/company if it looks like an actual sector, not a person's name
            
            // If it contains common name patterns (e.g. 'Juan Pérez - Abogado'), extract the profession part
            if (rawInd.includes(' - ')) rawInd = rawInd.split(' - ').pop().trim();
            const ind = rawInd || (lang === 'de' ? 'Ihrer Branche' : lang === 'en' ? 'your industry' : 'tu sector');
            const user = localStorage.getItem('user_name') || 'Gustavo';
            const h = new Date().getHours();
            const gEs = h < 12 ? 'Buen día' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
            const gEn = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
            const gDe = h < 12 ? 'Guten Morgen' : h < 17 ? 'Guten Tag' : 'Guten Abend';

            const esVariants = [
                `${gEs} ${n} 👋\nTrabajo con empresas de ${ind} y hay algo que noté que podría interesarte. ¿Tenés 2 min?`,
                `${gEs} ${n}, pregunta rápida: ¿en ${ind} siguen atendiendo consultas de clientes a mano o ya automatizaron algo?`,
                `Hola ${n}! Vi que estás en ${ind}. Ayudé a un negocio similar y logramos que una IA atienda el 80% de los mensajes automáticamente. ¿Te suena útil?`,
                `${gEs} ${n} 👋 Soy ${user}. Le armé un sistema de IA a una empresa de ${ind} que les triplicó las respuestas a clientes. ¿Puedo mostrarte cómo funciona? Son 2 min`,
                `Hola ${n}! Pregunta directa: si pudieras tener un asistente que conteste todos tus mensajes de clientes 24/7 en ${ind}... ¿cambiaría algo en tu operación?`,
                `${gEs} ${n}, me especializo en automatizar ventas con IA para ${ind}. ¿Hoy cómo manejan el tema de responder leads que llegan fuera de horario?`,
                `Hola ${n} 👋 Estoy trabajando con negocios de ${ind} en algo que reduce un 70% el tiempo de respuesta a clientes. ¿Te interesa saber más?`,
                `${gEs} ${n}! Consulta rápida: ¿cuántos mensajes de clientes se quedan sin responder por día en ${ind}? Pregunto porque tengo algo concreto para eso`
            ];

            const enVariants = [
                `Hi ${n} 👋 Quick question — does your ${ind} business handle customer inquiries manually or do you use any automation?`,
                `${gEn} ${n}, I help ${ind} companies automate 80% of their lead responses with AI. Would a 2-min demo be worth your time?`,
                `Hey ${n}! I built an AI system for a ${ind} company that tripled their response rate. Curious if it could work for you too?`,
                `${gEn} ${n} 👋 Straight question: if an AI could handle all your ${ind} customer messages 24/7, would that move the needle?`,
                `Hi ${n}, I work with ${ind} companies and noticed something that could save you serious time on client follow-ups. Got 2 min?`,
                `${gEn} ${n}! How do you handle leads that come in after hours in ${ind}? I've been solving that exact problem for similar businesses`,
                `Hey ${n} 👋 I specialize in AI automation for ${ind}. Question: how many customer messages go unanswered daily?`,
                `Hi ${n}, helped a ${ind} company cut their response time by 70% with AI last month. Worth a quick look?`
            ];

            const deVariants = [
                `${gDe} ${n} 👋\nIch arbeite mit Unternehmen im Bereich ${ind} und mir ist etwas aufgefallen, das Sie interessieren könnte. Haben Sie 2 Minuten?`,
                `${gDe} ${n}, kurze Frage: Bearbeiten Sie im Bereich ${ind} Kundenanfragen noch manuell oder nutzen Sie bereits Automatisierung?`,
                `Hallo ${n}! Ich habe gesehen, dass Sie im Bereich ${ind} tätig sind. Ich habe einem ähnlichen Unternehmen geholfen, 80 % der Nachrichten automatisch per KI zu beantworten. Klingt das nützlich?`,
                `${gDe} ${n} 👋 Ich bin ${user}. Ich habe für ein Unternehmen im Bereich ${ind} ein KI-System aufgebaut, das die Antwortrate verdreifacht hat. Darf ich Ihnen zeigen, wie es funktioniert? Dauert 2 Minuten`,
                `Hallo ${n}! Direkte Frage: Wenn ein Assistent all Ihre Kundennachrichten im Bereich ${ind} rund um die Uhr beantworten könnte — würde das etwas ändern?`,
                `${gDe} ${n}, ich bin spezialisiert auf KI-Vertriebsautomatisierung für ${ind}. Wie gehen Sie aktuell mit Anfragen um, die außerhalb der Geschäftszeiten kommen?`,
                `Hallo ${n} 👋 Ich arbeite mit Unternehmen im Bereich ${ind} an einer Lösung, die die Antwortzeit um 70 % reduziert. Möchten Sie mehr erfahren?`,
                `${gDe} ${n}! Kurze Frage: Wie viele Kundennachrichten bleiben im Bereich ${ind} täglich unbeantwortet? Ich frage, weil ich dafür eine konkrete Lösung habe`
            ];

            const variants = lang === 'de' ? deVariants : lang === 'en' ? enVariants : esVariants;
            const base = variants[Math.floor(Math.random() * variants.length)];

            // Micro-variations to make each message unique (critical anti-ban)
            
            if (Math.random() > 0.5) msg = msg.replace('👋', '✋');
            if (lang === 'es') {
                if (Math.random() > 0.7) msg = msg.replace('2 min', 'un minuto');
                if (Math.random() > 0.6) msg = msg.replace('Hola', gEs);
            } else if (lang === 'de') {
                if (Math.random() > 0.7) msg = msg.replace('2 Minuten', 'eine Minute');
                if (Math.random() > 0.6) msg = msg.replace('Hallo', gDe);
            } else if (lang === 'en') {
                if (Math.random() > 0.7) msg = msg.replace('2 min', '1 minute');
            }
            // Random trailing char
            const endings = ['', '.', '!', ' 🙂', ' 💡'];
            msg = msg.trimEnd() + endings[Math.floor(Math.random() * endings.length)];
            return msg;
        }

async function batchSendStep1(mode) {
            
            // Filtramos leads actuales DE LA VISTA RENDERIZADA para no mandar Europa cuando estamos viendo LatAm
            const tbody = document.getElementById('sales-tbody');
            let displayedIds = [];
            if (tbody) {
                const checkboxes = tbody.querySelectorAll('.sales-checkbox');
                displayedIds = Array.from(checkboxes).map(cb => cb.value);
            }
            let validLeads = salesLeads.filter(l => displayedIds.includes(l.id) && l.last_call_result !== 'not_interested');

            if (mode === 'selected') {
                const checked = document.querySelectorAll('.sales-checkbox:checked');
                const ids = Array.from(checked).map(cb => cb.value);
                // Excluir teléfonos fijos/rotos + ya enviados del batch para prevenir baneos y duplicados
                const allSelected = validLeads.filter(l => ids.includes(l.id) && l.phone && !analyzePhoneType(l.phone).disableWa);
                const alreadySent = allSelected.filter(l => l.step1_sent_at);
                targets = allSelected.filter(l => !l.step1_sent_at);
                if (alreadySent.length > 0) showToast(`ℹ️ ${alreadySent.length} lead(s) ya contactados, se omiten automáticamente`);
                if (!targets.length) { showToast('⚠️ Todos los seleccionados ya fueron contactados o no tienen móvil válido'); return; }
            } else {
                // Excluir fijos/rotos + ya enviados automáticamente al mandar a "Todos"
                targets = validLeads.filter(l => !l.step1_sent_at && l.phone && !analyzePhoneType(l.phone).disableWa);
                if (!targets.length) { showToast('✅ No hay leads con número de móvil aptos para Step 1 en esta vista'); return; }
            }

            const evoUrl = localStorage.getItem('evo_url');
            const evoKey = localStorage.getItem('evo_apikey');
            const evoInst = localStorage.getItem('evo_instance');
            if (!evoUrl || !evoKey || !evoInst) {
                showToast('⚠️ Configurá Evolution API primero en Settings');
                showTab('settings');
                return;
            }

            resetWaDailyCounter('europe');
            resetWaDailyCounter('americas');
            const remEU = Math.max(0, WA_DAILY_LIMIT_PER_REGION - getWaDailySends('europe'));
            const remAM = Math.max(0, WA_DAILY_LIMIT_PER_REGION - getWaDailySends('americas'));
            
            
            
            for (const t of targets) {
                const reg = detectRegion(t.phone);
                if (reg === 'europe' && euAdded < remEU) { allowedTargets.push(t); euAdded++; }
                else if (reg === 'americas' && amAdded < remAM) { allowedTargets.push(t); amAdded++; }
            }
            targets = allowedTargets;
            const toSend = targets.length;
            if (toSend <= 0) { showToast(`⛔ Límite alcanzado (${WA_DAILY_LIMIT_PER_REGION} por región). No quedan msgs disponibles para estos leads hoy.`); return; }

            const estMinutes = Math.ceil(toSend * 2.5);
            if (!confirm(`📤 Enviar Paso 1 (Gancho) a ${toSend} leads?\n\n⏱️ Tiempo estimado: ~${estMinutes} minutos\n🛡️ Anti-ban activo: 20 límite por región.\nEU permitidos: ${euAdded} | AM permitidos: ${amAdded}\n✉️ Cada lead recibe un mensaje DIFERENTE (8 variantes + micro-variaciones)\n\n¿Arrancar?`)) return;

            waBatchRunning = true;
            const bar = document.getElementById('wa-batch-bar');
            const status = document.getElementById('wa-batch-status');
            const progress = document.getElementById('wa-batch-progress');
            const cancelBtn = document.getElementById('wa-batch-cancel');
            if (bar) bar.style.display = 'flex';
            if (cancelBtn) cancelBtn.style.display = 'inline-flex';
            if (progress) progress.style.width = '0%';

            

            for ( i < toSend; i++) {
                if (!waBatchRunning) { if (status) status.textContent = `⛔ Cancelado. Enviados: ${sent}`; break; }
                const leadPhone = targets[i].phone;
                if (!canSendWhatsApp(leadPhone)) { if (status) status.textContent = `⛔ Límite diario en ${detectRegion(leadPhone).toUpperCase()}. Enviados: ${sent}`; continue; }

                const lead = targets[i];
                const cleanPhone = sanitizePhone(lead.phone);
                if (!cleanPhone) { failed++; continue; }

                if (status) status.textContent = `📤 ${i + 1}/${toSend}: ${lead.name}...`;
                if (progress) progress.style.width = `${((i + 1) / toSend * 100).toFixed(0)}%`;

                try {
                    const hookMsg = getHookVariant(lead);
                    const result = await executeWhatsAppAction(cleanPhone, {
                        action: 'batch_step1',
                        phone: cleanPhone,
                        message: hookMsg
                    });

                    if (result !== false && result !== null) {
                        sent++;
                        await sb.from('sales_leads').update({
                            step1_sent_at: new Date().toISOString(),
                            whatsapp_sent: true,
                            notes: (lead.notes || '') + `\n[STEP1 ${new Date().toLocaleString('es-AR')}]`
                        }).eq('id', lead.id);
                        lead.step1_sent_at = new Date().toISOString();
                    } else if (result === null) {
                        // No WA config — shouldn't happen since we checked above
                        failed++;
                    } else {
                        failed++;
                    }
                } catch (err) {
                    console.error('Batch step1 error for', lead.name, err);
                    failed++;
                }

                if (status) status.textContent = `✅ ${sent} enviados · ❌ ${failed} fallidos · ${toSend - i - 1} restantes`;
            }

            waBatchRunning = false;
            if (cancelBtn) cancelBtn.style.display = 'none';
            if (progress) progress.style.width = '100%';
            if (status) status.textContent = `✅ Completado: ${sent} enviados, ${failed} fallidos de ${toSend}`;
            showToast(`✅ Blast completado: ${sent} mensajes enviados`);
            await fetchSalesLeads(); renderSalesCommand();
        }

async function deleteSalesLead(id) {
            if (!confirm('¿Eliminar este lead?')) return;
            await sb.from('sales_leads').delete().eq('id', id);
            showToast('Lead eliminado');
            await fetchSalesLeads(); renderSalesCommand();
        }

function daysUntil(d) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const target = new Date(d);
            target.setHours(0, 0, 0, 0);
            return Math.ceil((target - now) / 86400000);
        }

function isUUID(str) {
            const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return regex.test(str);
        }

function showToast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }

function getToolByProvider(provider) {
            const name = CREDIT_PROVIDERS[provider].name;
            return tools.find(t => t.name.toLowerCase().includes(name.toLowerCase()));
        }

function renderCredits() {
            Object.keys(CREDIT_PROVIDERS).forEach(provider => {
                const tool = getToolByProvider(provider);
                const balEl = document.getElementById(provider + '-balance');
                const updEl = document.getElementById(provider + '-updated');
                const barEl = document.getElementById(provider + '-bar');
                const cardEl = document.getElementById('credit-' + provider);
                const threshEl = document.getElementById(provider + '-threshold');
                const kpiEl = document.getElementById('kpi-' + provider);

                if (tool && tool.balance !== null) {
                    const bal = tool.balance;
                    const thresh = tool.alert_threshold || 5;
                    const max = CREDIT_PROVIDERS[provider].maxBalance;
                    const pct = Math.min(100, Math.max(0, (bal / max) * 100));
                    const cls = bal <= 0 ? 'danger' : bal <= thresh ? 'warn' : 'ok';

                    balEl.textContent = '$' + bal.toFixed(2);
                    balEl.className = 'credit-balance ' + cls;

                    barEl.style.width = pct + '%';
                    barEl.className = 'credit-bar ' + cls;

                    cardEl.classList.toggle('low-balance', cls !== 'ok');

                    if (tool.updated_at) {
                        const d = new Date(tool.updated_at);
                        updEl.textContent = '🕐 Actualizado: ' + d.toLocaleDateString('es-AR') + ' ' + d.toLocaleTimeString('es-AR', {hour:'2-digit',minute:'2-digit'});
                    } else {
                        updEl.textContent = '🕐 Saldo registrado en Supabase';
                    }

                    threshEl.value = thresh;

                    // KPI in overview
                    if (kpiEl) {
                        kpiEl.textContent = '$' + bal.toFixed(2);
                        kpiEl.style.color = cls === 'ok' ? 'var(--emerald)' : cls === 'warn' ? 'var(--yellow)' : 'var(--red)';
                    }
                } else {
                    balEl.textContent = '$—';
                    balEl.className = 'credit-balance ok';
                    updEl.textContent = 'Sin datos — Actualizá el saldo manualmente';
                    barEl.style.width = '0%';
                    if (kpiEl) {
                        kpiEl.textContent = 'Sin datos';
                        kpiEl.style.color = 'var(--muted)';
                        kpiEl.style.fontSize = '14px';
                    }
                }
            });
        }

function toggleCreditEdit(provider) {
            const editEl = document.getElementById(provider + '-edit');
            editEl.style.display = editEl.style.display === 'none' ? 'flex' : 'none';
            if (editEl.style.display === 'flex') {
                const tool = getToolByProvider(provider);
                if (tool && tool.balance !== null) {
                    document.getElementById(provider + '-input').value = tool.balance;
                }
                document.getElementById(provider + '-input').focus();
            }
        }

async function saveCredit(provider) {
            const val = parseFloat(document.getElementById(provider + '-input').value);
            if (isNaN(val) || val < 0) { showToast('⚠️ Ingresá un monto válido'); return; }
            const name = CREDIT_PROVIDERS[provider].name;
            let tool = getToolByProvider(provider);

            if (tool) {
                // Update existing
                const updateData = { balance: val };
                // Only include updated_at if you've already run the SQL script
                // For now, we omit it to avoid the "column not found" error
                
                const { error } = await sb.from('agency_tools').update(updateData).eq('id', tool.id);
                if (error) { 
                    if (error.code === '42703') {
                        showToast('⚠️ Error: Falta la columna updated_at. Ejecutá el script SQL proporcionado.');
                    } else {
                        showToast('Error: ' + error.message); 
                    }
                    return; 
                }
            } else {
                // Create new tool entry
                const thresh = parseFloat(document.getElementById(provider + '-threshold').value) || 5;
                const { error } = await sb.from('agency_tools').insert({
                    name: name,
                    category: 'API de IA',
                    status: 'active',
                    monthly_cost_usd: 0,
                    balance: val,
                    alert_threshold: thresh,
                    notes: provider === 'replicate' ? 'Generación de imágenes y video' : provider === 'vapi' ? 'Asistentes de voz AI · ~$0.05/min' : 'Modelos de IA generativa'
                });
                if (error) { showToast('Error: ' + error.message); return; }
            }

            showToast('✅ Saldo de ' + name + ' actualizado a $' + val.toFixed(2));
            toggleCreditEdit(provider);
            await fetchAll();
        }

async function saveThreshold(provider) {
            const val = parseFloat(document.getElementById(provider + '-threshold').value);
            if (isNaN(val) || val < 0) return;
            const tool = getToolByProvider(provider);
            if (!tool) { showToast('⚠️ Primero guardá un saldo para ' + CREDIT_PROVIDERS[provider].name); return; }
            const { error } = await sb.from('agency_tools').update({ alert_threshold: val }).eq('id', tool.id);
            if (error) { showToast('Error: ' + error.message); return; }
            showToast('🔔 Umbral de ' + CREDIT_PROVIDERS[provider].name + ' = $' + val.toFixed(2));
            await fetchAll();
        }

async function fetchTelnyxBalance() {
            try {
                const balEl = document.getElementById('telnyx-balance');
                const updEl = document.getElementById('telnyx-updated');
                const barEl = document.getElementById('telnyx-bar');
                const kpiEl = document.getElementById('kpi-telnyx');
                const cardEl = document.getElementById('credit-telnyx');
                
                updEl.textContent = 'Actualizando desde API...';
                
                const res = await fetch('https://api.telnyx.com/v2/balance', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + TELNYX_API_KEY,
                        'Accept': 'application/json'
                    }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    const bal = parseFloat(data.data.balance);
                    
                    balEl.textContent = '$' + bal.toFixed(2);
                    updEl.textContent = '🕐 Sincronizado: ' + new Date().toLocaleTimeString('es-AR');
                    
                    if (kpiEl) kpiEl.textContent = '$' + bal.toFixed(2);
                    
                    const pct = Math.min(100, Math.max(0, (bal / 50) * 100)); // referencia 50 max
                    barEl.style.width = pct + '%';
                    
                    if (bal <= 5) {
                        balEl.className = 'credit-balance danger';
                        barEl.className = 'credit-bar danger';
                        cardEl.classList.add('low-balance');
                        if (kpiEl) kpiEl.style.color = 'var(--red)';
                    } else if (bal <= 15) {
                        balEl.className = 'credit-balance warn';
                        barEl.className = 'credit-bar warn';
                        cardEl.classList.add('low-balance');
                        if (kpiEl) kpiEl.style.color = 'var(--yellow)';
                    } else {
                        balEl.className = 'credit-balance ok';
                        barEl.className = 'credit-bar ok';
                        cardEl.classList.remove('low-balance');
                        if (kpiEl) kpiEl.style.color = 'var(--emerald)';
                    }
                } else {
                    updEl.textContent = 'Error al sincronizar';
                    showToast('❌ Error de Telnyx API');
                }
            } catch (e) {
                document.getElementById('telnyx-updated').textContent = 'Error de red';
            }
        }

function updateInvPreview() {
            const type = document.getElementById('inv-type').value;
            const currency = document.getElementById('inv-currency').value;
            const client = document.getElementById('inv-client').value || '—';
            const detail = document.getElementById('inv-client-detail').value || '—';
            const notes = document.getElementById('inv-notes').value;
            const sym = currency === 'EUR' ? '€' : '$';

            document.getElementById('inv-p-type').textContent = type.toUpperCase();
            document.getElementById('inv-p-number').textContent = '#GR-' + String(invCounter).padStart(4, '0');
            document.getElementById('inv-p-client').textContent = client;
            document.getElementById('inv-p-detail').textContent = detail;
            document.getElementById('inv-p-notes').textContent = notes;

            const now = new Date();
            document.getElementById('inv-p-date').textContent = now.toLocaleDateString('es-AR');
            document.getElementById('inv-p-stamp-date').textContent = now.toLocaleDateString('es-AR') + ' ' + now.toLocaleTimeString('es-AR', {hour:'2-digit',minute:'2-digit'});

            // Items
            const rows = document.querySelectorAll('#inv-items .inv-item-row');
            let itemsHtml = '<div class="inv-row" style="font-weight:600;color:#64647a;font-size:11px;text-transform:uppercase;letter-spacing:.5px"><span>Servicio</span><span>Monto</span></div>';
            let total = 0;
            rows.forEach(row => {
                const inputs = row.querySelectorAll('input');
                const desc = inputs[0].value || 'Servicio';
                const qty = parseFloat(inputs[1].value) || 1;
                const price = parseFloat(inputs[2].value) || 0;
                const subtotal = qty * price;
                total += subtotal;
                if (desc || price) {
                    itemsHtml += `<div class="inv-row"><span>${desc}${qty > 1 ? ' (×' + qty + ')' : ''}</span><span>${sym}${subtotal.toFixed(2)} ${currency}</span></div>`;
                }
            });
            document.getElementById('inv-p-items').innerHTML = itemsHtml;
            document.getElementById('inv-p-total').innerHTML = `<span>TOTAL</span><span style="font-size:18px">${sym}${total.toFixed(2)} ${currency}</span>`;
        }

function addInvItem() {
            const container = document.getElementById('inv-items');
            const row = document.createElement('div');
            row.className = 'inv-item-row';
            row.style.cssText = 'display:grid;grid-template-columns:1fr 80px 80px 30px;gap:6px;margin-bottom:6px';
            row.innerHTML = `
                <input class="form-input" placeholder="Servicio" oninput="updateInvPreview()">
                <input class="form-input" type="number" placeholder="Cant." value="1" oninput="updateInvPreview()">
                <input class="form-input" type="number" step="0.01" placeholder="Precio" oninput="updateInvPreview()">
                <button class="btn btn-danger" style="padding:2px 8px" onclick="this.parentElement.remove();updateInvPreview()">✕</button>
            `;
            container.appendChild(row);
        }

function printInvoice() {
            const client = document.getElementById('inv-client').value.trim();
            if (!client) { showToast('⚠️ Ingresá el nombre del cliente'); return; }
            updateInvPreview();
            // Increment counter
            invCounter++;
            localStorage.setItem('gr_inv_counter', invCounter);
            // Open print dialog
            window.print();
            showToast('✅ Invoice generado — Usá "Guardar como PDF" en el diálogo de impresión');
        }

function resetInvoice() {
            document.getElementById('inv-client').value = '';
            document.getElementById('inv-client-detail').value = '';
            document.getElementById('inv-notes').value = '';
            document.getElementById('inv-items').innerHTML = `
                <div class="inv-item-row" style="display:grid;grid-template-columns:1fr 80px 80px 30px;gap:6px;margin-bottom:6px">
                    <input class="form-input" placeholder="Servicio *" oninput="updateInvPreview()">
                    <input class="form-input" type="number" placeholder="Cant." value="1" oninput="updateInvPreview()">
                    <input class="form-input" type="number" step="0.01" placeholder="Precio" oninput="updateInvPreview()">
                    <span></span>
                </div>
            `;
            updateInvPreview();
        }

function savePrice(region, field, val) {
            const prices = JSON.parse(localStorage.getItem('prices') || JSON.stringify(DEFAULT_PRICES));
            prices[region][field] = val;
            localStorage.setItem('prices', JSON.stringify(prices));
            showToast(`✅ Precio ${region} ${field} guardado`);
        }

function loadPriceSettings() {
            const prices = JSON.parse(localStorage.getItem('prices') || JSON.stringify(DEFAULT_PRICES));
            const map = {
                'price-ar-setup': prices.ar.setup,
                'price-ar-monthly': prices.ar.monthly,
                'link-ar-setup': prices.ar.setup_link,
                'link-ar-monthly': prices.ar.monthly_link,
                'price-global-setup': prices.global.setup,
                'price-global-pro': prices.global.setup_pro,
                'price-global-monthly': prices.global.monthly,
                'link-global-setup': prices.global.setup_link,
                'link-global-pro': prices.global.setup_pro_link,
                'link-global-monthly': prices.global.monthly_link
            };
            for (const id in map) {
                const el = document.getElementById(id);
                if (el) el.value = map[id] || '';
            }
        }

function getPricingString(phone) {
            const region = detectRegion(phone);
            const lang = detectLanguage(phone);
            const prices = JSON.parse(localStorage.getItem('prices') || JSON.stringify(DEFAULT_PRICES));
            const data = (region === 'europe' || phone.startsWith('+1')) ? prices.global : prices.ar;
            if (lang === 'de') {
                return `Die Preise für Ihre Region:\n- BASIC-Einrichtung: $${data.setup} USD: ${data.setup_link || 'PayPal/MP'}\n- PREMIUM-Einrichtung: $${data.setup_pro} USD: ${data.setup_pro_link || 'PayPal/MP'}\n- Monatliche Wartung: $${data.monthly} USD: ${data.monthly_link || 'PayPal/MP'}`;
            }
            if (lang === 'en') {
                return `Pricing for your region:\n- BASIC setup: $${data.setup} USD: ${data.setup_link || 'PayPal/MP'}\n- PREMIUM setup: $${data.setup_pro} USD: ${data.setup_pro_link || 'PayPal/MP'}\n- Monthly maintenance: $${data.monthly} USD: ${data.monthly_link || 'PayPal/MP'}`;
            }
            return `El precio para tu región es:\n- Alta BASIC de $${data.setup} USD: ${data.setup_link || 'PayPal/MP'}\n- Alta PREMIUM de $${data.setup_pro} USD: ${data.setup_pro_link || 'PayPal/MP'}\n- Mantenimiento mensual de $${data.monthly} USD: ${data.monthly_link || 'PayPal/MP'}`;
        }

function copyPaymentLink(id, type, mode) {
            let item;
            if (type === 'client') item = clients.find(c => c.id === id);
            else item = salesLeads.find(l => l.id === id);
            
            if (!item || !item.phone) { showToast('⚠️ No se pudo encontrar el teléfono'); return; }
            
            const region = detectRegion(item.phone);
            const prices = JSON.parse(localStorage.getItem('prices') || JSON.stringify(DEFAULT_PRICES));
            const data = (region === 'europe' || item.phone.startsWith('+1')) ? prices.global : prices.ar;
            
            
            if (mode === 'setup') link = data.setup_link;
            else if (mode === 'pro') link = data.setup_pro_link;
            else link = data.monthly_link;
            
            if (!link) { showToast('⚠️ No configuraste el link de pago en Configuración'); return; }
            
            navigator.clipboard.writeText(link).then(() => {
                const label = mode === 'setup' ? 'BASIC' : (mode === 'pro' ? 'PREMIUM' : 'MENSUAL');
                showToast(`✅ Link de ALTA ${label} copiado`);
            });
        }

function getGeminiKey() {
            const key = localStorage.getItem('gemini_key');
            return (key ? key.trim() : null) || GEMINI_DEFAULT_KEY;
        }

function openAiDraft(id, type) {
            aiCurrentType = type;
            let item;
            if (type === 'client') item = clients.find(c => c.id === id);
            else item = salesLeads.find(l => l.id === id);
            if (!item) { showToast('⚠️ Lead no encontrado'); return; }
            aiCurrentLead = item;

            const region = detectRegion(String(item.phone || ''));
            const prices = JSON.parse(localStorage.getItem('prices') || JSON.stringify(DEFAULT_PRICES));
            const data = (region === 'europe' || (item.phone || '').startsWith('+1')) ? prices.global : prices.ar;

            document.getElementById('ai-modal-lead').innerHTML = `
                <strong>${item.name || 'Sin nombre'}</strong> · ${item.company || 'Sin empresa'} · ${item.phone || 'Sin teléfono'} · Región: ${region}
                <br>Score: ${item.lead_score || 'N/A'} · Nivel: ${item.interest_level || 'cold'} · Llamadas: ${item.call_count || 0}
                <br>Setup: $${data.setup}/$${data.setup_pro} · Fee: $${data.monthly}/mes
            `;
            document.getElementById('ai-result').style.display = 'none';
            document.getElementById('ai-result').value = '';
            document.getElementById('ai-actions').style.display = 'none';
            document.getElementById('ai-loading').style.display = 'none';
            document.getElementById('ai-modal').style.display = 'flex';
        }

function closeAiModal() {
            document.getElementById('ai-modal').style.display = 'none';
            aiCurrentLead = null;
        }

async function aiGenerate(intent) {
            if (!aiCurrentLead) return;
            aiLastIntent = intent;
            const lead = aiCurrentLead;

            if (intent === 'custom') {
                const customIntent = prompt('Describí brevemente qué tipo de mensaje querés generar:');
                if (!customIntent) return;
                intent = customIntent;
            }

            const phoneRaw = String(lead.phone || '').replace(/[^\d]/g, '');
            const isArgentina = phoneRaw.startsWith('54'); // Argentina es el único que usa MP
            
            const prices = JSON.parse(localStorage.getItem('prices') || JSON.stringify(DEFAULT_PRICES));
            const priceData = isArgentina ? prices.ar : prices.global;

            const intentMap = {
                'primer_contacto': 'FIRST COLD OUTREACH. Do NOT pitch anything. Do NOT mention AI, agency, or services. The ONLY goal is to start a conversation by asking a genuine question about their industry. 2 sentences MAX. No emojis. Example: ask about a specific challenge in their field.',
                'seguimiento': 'FOLLOW-UP to unanswered message. Ultra casual, 1-2 sentences. Do NOT repeat the original pitch. Just check in naturally like a colleague. Add a small piece of value about their industry if possible.',
                'demo_enviada': 'POST-DEMO follow-up. Ask for honest opinion. Use social proof subtly. Create gentle urgency without being pushy. Make it easy to say yes to next step.',
                'cierre': 'CLOSING. Lead showed clear interest. Give ONE clear next step. Include payment link. Create scarcity (limited spots in their region). Make saying YES extremely easy — one sentence to confirm.',
                'recontacto': 'RE-ENGAGEMENT after losing contact. Do NOT apologize. Lead with a relevant industry insight or case study result. Make them curious enough to reply.'
            };

            const contextIntent = intentMap[intent] || `User intent: ${intent}`;

            const lang = detectLanguage(lead.phone || '');
            const region = detectRegion(lead.phone || '');
            let langName = 'ESPAÑOL';
            let langInstruction = 'Escribe en español (usa un estilo natural de WhatsApp, si es de Argentina usa voseo, sino neutro o tú).';
            
            if (lang === 'de') {
                langName = 'GERMAN';
                langInstruction = 'Write the ENTIRE message in GERMAN. Use polite "Sie" form. Conversational but professional.';
            } else if (lang === 'en') {
                langName = 'ENGLISH';
                langInstruction = 'Write the ENTIRE message in ENGLISH. Conversational American business tone.';
            } else if (lang === 'fr') {
                langName = 'FRENCH';
                langInstruction = 'Write the ENTIRE message in FRENCH. Polite "vous" form.';
            } else if (lang === 'pt') {
                langName = 'PORTUGUESE';
                langInstruction = 'Write the ENTIRE message in BRAZILIAN PORTUGUESE. Natural, conversational.';
            } else if (lang === 'it') {
                langName = 'ITALIAN';
                langInstruction = 'Write the ENTIRE message in ITALIAN. Use polite "Lei" form.';
            }
            
            // Contextual override (e.g. Baires Grill - New York -> English)
            const companyLower = String(lead.company || '').toLowerCase();
            if (companyLower.includes('new york') || companyLower.includes('miami') || companyLower.includes('usa') || companyLower.includes('florida')) {
                langName = 'ENGLISH';
                langInstruction = 'Write the ENTIRE message in ENGLISH. Conversational American business tone.';
            }

            // Refinements (handling phones with or without '+')
            const phoneStr = String(lead.phone || '').replace(/[^\d]/g, '');
            if (phoneStr.startsWith('34')) {
                langName = 'ESPAÑOL (ESPAÑA)';
                langInstruction = 'Escribe en español de España (usa "tú", estilo natural conversacional).';
            }
            if (phoneStr.startsWith('54')) {
                langName = 'ESPAÑOL (ARGENTINA)';
                langInstruction = 'Escribe en español rioplatense (Argentina). Usa voseo ("vos", "tenés", "querés"). Tono natural de WhatsApp.';
            }

            const systemPrompt = `You are Alex, a senior sales consultant at GenerArise, an elite AI automation agency.

YOUR #1 JOB: Draft WhatsApp messages that GET REPLIES and CLOSE DEALS.

<CRITICAL_LANGUAGE_RULE>
1. The REQUIRED language for this message is exactly: ${langName}.
2. ${langInstruction}
3. ABSOLUTE PROHIBITION: You are FORBIDDEN from writing in any other language. Even if the lead's name, company, or notes appear to be from a different country (e.g., a Spanish-sounding name like "Baires Grill" in New York), you MUST STILL write the ENTIRE message strictly in ${langName} without exceptions.
</CRITICAL_LANGUAGE_RULE>

## ANTI-BAN RULES (WhatsApp flags spam patterns)
1. NEVER use the same opening twice. Vary greetings.
2. AVOID marketing buzzwords: "exclusive", "limited offer", "act now".
3. Write like a REAL PERSON texting — short sentences, casual natural tone.
4. NEVER use bullet lists or markdown headers (*bold* is fine).
5. First contact: 2 sentences MAX. No emojis (looks automated).
6. Each message must feel handwritten — vary sentence structure.

## CRITICAL RULE: BE DIRECT
- If the lead asks for PRICE → give the CONCRETE price immediately. NEVER say "competitive", "depends", or "I'll send info". Give the number.
- If the lead asks for FEATURES → list them concretely in 3-4 lines. No vagueness.
- If the lead says "get to the point" or seems impatient → give ALL info in ONE message (price + features + next step).
- NEVER ask "can I send you info?" — just SEND the info.
- NEVER respond to a direct question with another question.

## PRICING (give these WHENEVER the lead asks, regardless of intent):
- Basic Setup: $${priceData.setup} USD (one-time) — AI chatbot 24/7 in 30+ languages, WhatsApp + Web, control panel, 30 days support.
- Premium Setup: $${priceData.setup_pro} USD (one-time) — All Basic + AI voice agent, CRM, custom workflows, 90 days support.
- Monthly: $${priceData.monthly} USD/month — Hosting, updates, technical support.
- Payment links: Basic ${priceData.setup_link} | Premium ${priceData.setup_pro_link} | Monthly ${priceData.monthly_link}

## CONVERSION PSYCHOLOGY
- First Contact: Create CURIOSITY only. Ask a genuine industry question. NO pitch.
- Follow-up: Reference something SPECIFIC about their business.
- When they ask price/features: ANSWER FULLY AND IMMEDIATELY. Then offer a free 15-min audit as next step.
- Closing: ONE clear next step. Include payment link.

## MESSAGE STYLE
- Sound human, never robotic or scripted. One idea per message.
- End with an EASY question (answerable in 1 word).
- Sign only as "Alex" in first contacts.`;

            const userPrompt = `LEAD CONTEXT:
- Name: ${lead.name || 'Unknown'}
- Company: ${lead.company || 'N/A'}
- Industry: ${lead.industry || 'N/A'}
- Phone: ${lead.phone || 'N/A'} | Region: ${region}
- Score: ${lead.lead_score || 0}/100 (${lead.interest_level || 'cold'})
- Pain point: ${lead.main_pain || 'unknown'}
- Notes: ${lead.notes || 'none'}

MESSAGE INTENT:
${contextIntent}

CRITICAL: Draft the WhatsApp message based on the intent above. 
Ensure the message is COMPLETELY written in ${langName}. Do not include translations or explanations, strictly just the message text.`;

            document.getElementById('ai-loading').style.display = 'block';
            document.getElementById('ai-result').style.display = 'none';
            document.getElementById('ai-actions').style.display = 'none';

            try {
                const key = getGeminiKey();
                const models = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro', 'gemini-2.0-flash'];
                let text = null;
                let lastError = null;

                for (const model of models) {
                    try {
                        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
                                generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
                            })
                        });
                        
                        const data = await res.json();
                        
                        if (data?.error) {
                            lastError = data.error.message;
                            console.warn(`Gemini error with ${model}:`, lastError);
                            continue;
                        }
                        
                        text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (text) {
                            break;
                        } else {
                            const finishReason = data?.candidates?.[0]?.finishReason;
                            lastError = finishReason ? `Respuesta bloqueada (${finishReason})` : "Respuesta vacía de la API";
                            console.warn(`Empty text from ${model}:`, data);
                            continue;
                        }
                    } catch (modelErr) { 
                        lastError = modelErr.message;
                        console.warn(`Model ${model} connection failed:`, lastError); 
                    }
                }

                if (text) {
                    document.getElementById('ai-result').value = text;
                    document.getElementById('ai-result').style.display = 'block';
                    document.getElementById('ai-actions').style.display = 'flex';
                } else {
                    document.getElementById('ai-result').value = `⚠️ Error de Gemini: ${lastError || 'No se pudo generar el texto'}. \n\nVerificá que tu API Key sea válida y no tenga restricciones de cuota.`;
                    document.getElementById('ai-result').style.display = 'block';
                    document.getElementById('ai-actions').style.display = 'none';
                }
            } catch (e) {
                document.getElementById('ai-result').value = '❌ Error crítico: ' + e.message;
                document.getElementById('ai-result').style.display = 'block';
                document.getElementById('ai-actions').style.display = 'none';
            }
            document.getElementById('ai-loading').style.display = 'none';
        }

function aiRegenerate() {
            if (aiLastIntent) aiGenerate(aiLastIntent);
        }

function aiCopyText() {
            const text = document.getElementById('ai-result').value;
            navigator.clipboard.writeText(text).then(() => showToast('✅ Mensaje copiado al portapapeles'));
        }

async function aiSendWhatsApp() {
            if (!aiCurrentLead || !aiCurrentLead.phone) { showToast('⚠️ Lead sin teléfono'); return; }
            const text = document.getElementById('ai-result').value;
            const cleanPhone = sanitizePhone(aiCurrentLead.phone);
            
            if (!cleanPhone) { showToast('⚠️ Teléfono inválido'); return; }

            const sent = await executeWhatsAppAction(cleanPhone, {
                action: 'send_ai_draft',
                phone: cleanPhone,
                name: aiCurrentLead.name,
                message: text
            });

            if (sent === true) {
                closeAiModal();
            } else if (sent === null) {
                // No API configured — fallback to WhatsApp Web
                const encoded = encodeURIComponent(text);
                window.open(`https://wa.me/${cleanPhone.replace('+', '')}?text=${encoded}`, '_blank');
                closeAiModal();
            }
            // sent === false means API error, keep modal open to retry
        }

