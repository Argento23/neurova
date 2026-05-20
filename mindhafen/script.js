// =========================================
// MOBILE MENU FUNCTIONALITY
// =========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Open mobile menu
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
});

// Close mobile menu
mobileMenuClose.addEventListener('click', () => {
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
});

// Close menu when clicking on a link
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// =========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =========================================
// FORM SUBMISSION LOGIC (ENHANCED)
// =========================================
const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');

// Webhook URL - Cambiar si usas otro endpoint
const WEBHOOK_URL = "https://manager.generarise.space/webhook/mindhafen-registro";

// SUPABASE CONFIG
const SUPABASE_URL = 'https://gjfsylpbxxfvponhgmhz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZnN5bHBieHhmdnBvbmhnbWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTUwNTgsImV4cCI6MjA4ODMzMTA1OH0.cXkLvik7fHeBX1ecuw0v5RAu1UdHNghQHTmSB4QW3Dw';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

async function saveLeadToSupabase(leadData) {
    if (!supabase) return;
    try {
        await supabase.from('agency_clients').insert({
            name: leadData.name,
            email: leadData.email,
            company: 'MindHafen',
            status: 'pending',
            created_at: new Date().toISOString()
        });
        console.log('✅ Lead guardado en Supabase');
    } catch (e) {
        console.error('Error guardando en Supabase:', e);
    }
}

// TELEGRAM: Alertas manejadas por n8n (server-side). No se exponen credenciales aquí.

// ── VALIDACIÓN ANTI-SPAM ──
function isValidLead(data) {
    // Nombre: mínimo 2 caracteres, no solo números
    if (!data.name || data.name.trim().length < 2 || /^[\d\s]+$/.test(data.name)) return false;
    // Email: formato básico
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return false;
    // Bloquear emails temporales conocidos
    const blockedDomains = ['mailinator.com', 'tempmail.com', 'throwaway.email', 'guerrillamail.com', 'yopmail.com', 'sharklasers.com'];
    const domain = data.email.split('@')[1]?.toLowerCase();
    if (blockedDomains.includes(domain)) return false;
    return true;
}

// Detectar si estamos en local (para testing)
const isLocalTesting = window.location.protocol === 'file:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

if (isLocalTesting) {
    console.warn('⚠️ MODO LOCAL - Los datos se mostrarán en consola pero NO se enviarán al servidor');
}

// Variable global para datos de usuario temporal
let currentUserData = {};

// Función GLOBAL de pago
window.iniciarPagoPremium = async () => {
    console.log('💳 User click: Iniciar Pago Premium');

    // Feedback visual inmediato
    Swal.fire({
        title: 'Conectando...',
        text: 'Generando tu enlace seguro de Mercado Pago',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
    });

    try {
        // Fallback a localStorage si los datos en memoria están vacíos
        const name = currentUserData.name || localStorage.getItem('mindhafen_user_name');
        const email = currentUserData.email || localStorage.getItem('mindhafen_user_email');
        const goal = currentUserData.goal || localStorage.getItem('mindhafen_user_goal');

        const response = await fetch('https://manager.generarise.space/webhook/mindhafen-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({ name, email, goal })
        });

        const paymentData = await response.json();
        console.log('💰 Respuesta:', paymentData);

        const checkoutUrl = paymentData.checkout_url ||
            paymentData.init_point ||
            paymentData.url ||
            paymentData.mp_link;

        if (checkoutUrl) {
            console.log('🚀 Redirigiendo a:', checkoutUrl);
            window.location.assign(checkoutUrl);
        } else {
            Swal.fire('Error', 'No se recibió el link de pago.', 'error');
        }
    } catch (err) {
        console.error('Error Pago:', err);
        Swal.fire('Error', 'Problema de conexión.', 'error');
    }
};

window.processSubmission = async (leadData) => {
    // ── VALIDACIÓN ANTI-SPAM ──
    if (!isValidLead(leadData)) {
        Swal.fire({
            title: 'Datos incompletos',
            text: 'Por favor ingresá un nombre y email válidos.',
            icon: 'warning',
            confirmButtonColor: '#3b82f6',
            background: '#0f172a',
            color: '#f1f5f9'
        });
        return;
    }

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESANDO...';
    submitBtn.disabled = true;

    // LeadData already contains the form values
    leadData.submittedAt = new Date().toISOString();

    // Guardar en Supabase (delegado a n8n)
    console.log('💾 Guardado delegado al servidor');

    // GUARDAR DATOS GLOBALES PARA EL PAGO
    currentUserData = leadData;

    console.log('📤 Datos del formulario:', leadData);

    // 3. MODO LOCAL - Solo aviso en consola
    if (isLocalTesting) {
        console.log('🧪 MODO LOCAL - Saltando envío real al webhook');
    }

    // 4. PRODUCCIÓN - Enviar al webhook
    try {
        console.log('🌐 Enviando a webhook:', WEBHOOK_URL);

        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(leadData),
            mode: 'cors'
        });

        console.log('📥 Respuesta recibida:', response.status, response.statusText);

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Éxito:', result);

            // Guardar datos localmente para retomar el pago luego
            localStorage.setItem('mindhafen_user_name', leadData.name);
            localStorage.setItem('mindhafen_user_email', leadData.email);
            localStorage.setItem('mindhafen_user_goal', leadData.goal);

            Swal.fire({
                title: '¡Bienvenido a la Revolución Mental!',
                html: `
                    <div style="text-align: center;">
                        <img src="assets/welcome_brain.png" 
                             alt="Mental Balance" 
                             style="width: 100%; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                        
                        <p style="font-size: 1.1rem; color: #f1f5f9;">Tu viaje ha comenzado, <strong>${leadData.name}</strong>.</p>
                        <p style="color: #94a3b8; font-size: 0.85rem;">Hemos enviado tu acceso al mail: <strong>${leadData.email}</strong></p>
                        
                        <div style="background: rgba(59, 130, 246, 0.1); padding: 15px; border-radius: 12px; margin: 20px 0; border: 1px solid rgba(59, 130, 246, 0.3);">
                            <h4 style="margin-top: 0; color: #3b82f6; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">🎁 REGALO INMEDIATO:</h4>
                            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                                <a href="downloads/Guia_Descompresion_MindHafen.pdf" download style="text-decoration: none; background: #3b82f6; color: white; padding: 10px 18px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <i class="fas fa-file-pdf"></i> PDF
                                </a>
                                <a href="downloads/Audio_Guia_Descompresion.mp3" download style="text-decoration: none; background: #10b981; color: white; padding: 10px 18px; border-radius: 8px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <i class="fas fa-microphone"></i> AUDIO
                                </a>
                            </div>
                        </div>

                        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 25px 0;">
                        
                        <h3 style="color: #f59e0b; margin-bottom: 10px;">✨ ¿Listo para el Plan Premium?</h3>
                        <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 20px;">Acceso a los 12 módulos avanzados + Mentor IA Personalizado 24/7.</p>
                        
                        <button onclick="iniciarPagoPremium()" style="
                            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                            color: white;
                            width: 100%;
                            padding: 18px;
                            border: none;
                            border-radius: 12px;
                            font-size: 1.1rem;
                            font-weight: 700;
                            cursor: pointer;
                            box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
                            transition: all 0.3s;
                            display: block;">
                            ACTIVAR MI PLAN PREMIUM <i class="fas fa-arrow-right" style="margin-left: 8px;"></i>
                        </button>
                        <p style="margin-top: 15px; font-size: 0.8rem; color: #64748b; cursor: pointer; text-decoration: underline;" onclick="window.location.href='https://generarise.space/panel/'">O continuar al panel gratuito...</p>
                    </div>
                `,
                background: '#0f172a',
                color: '#f1f5f9',
                showConfirmButton: false,
                width: '480px',
                padding: '1.5rem'
            });
            form.reset();

        } else {
            // Error del servidor
            let errorDetail = '';
            try {
                const errorData = await response.json();
                errorDetail = errorData.message || JSON.stringify(errorData);
            } catch {
                errorDetail = await response.text();
            }
            throw new Error(`HTTP ${response.status}: ${errorDetail}`);
        }

    } catch (error) {
        console.error('❌ Error completo:', error);
        let errorMessage = 'Hubo un problema al conectar con el servidor.';
        let errorTitle = 'Algo salió mal';

        if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
            errorTitle = 'Error de Conexión';
            errorMessage = 'No se pudo conectar con el servidor n8n.';
        }

        Swal.fire({
            title: errorTitle,
            text: errorMessage,
            icon: 'error',
            confirmButtonColor: '#3b82f6',
            background: '#0f172a',
            color: '#f1f5f9',
            footer: '<small style="color: #64748b;">Detalle: ' + error.message + '</small>'
        });

    } finally {
        // 5. Restore UI
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
};

// DEBUG: Log cuando el script se carga
console.log('✅ MindHafen Form Script cargado');
console.log('🏠 Entorno:', isLocalTesting ? 'LOCAL (testing)' : 'PRODUCCIÓN');
