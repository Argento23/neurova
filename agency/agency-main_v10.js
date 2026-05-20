// VERSION 15 - AUTO-LANGUAGE DETECTION + URL PERSISTENCE
// ACTUALIZADO POR ANTIGRAVITY - 2026-04-02 20:00
// ═══════════════════════════════════════════════════════════
// Translations
// ═══════════════════════════════════════════════════════════
const translations = {
    es: {
        // ── NAV & HERO ──
        nav_services: 'Soluciones',
        nav_method: 'Método',
        nav_cta: 'Auditoría Gratis',
        hero_badge: 'Marketing & Sales Automation',
        hero_title_1: 'Escala tu Revenue',
        hero_title_2: 'sin aumentar',
        hero_title_3: 'tus costos',
        hero_subtitle_1: 'Implementamos',
        hero_subtitle_2: 'Sistemas de Venta Automáticos',
        hero_subtitle_3: 'y',
        hero_subtitle_4: 'Agentes de IA',
        hero_subtitle_5: 'que captan, califican y cierran leads 24/7.',
        hero_cta_primary: 'Diagnóstico Estratégico',
        hero_cta_secondary: 'Ver Ecosistema',
        // ── SERVICES ──
        services_title: 'Ecosistema de Crecimiento',
        service1_title: 'Chat Funnels Inteligentes',
        service1_desc: 'No más respuestas genéricas. Agentes que entienden contexto, califican leads y agendan citas directamente en tu calendario.',
        service1_feat1: 'Scoring Automático',
        service1_feat2: 'Manejo de Objeciones',
        service1_feat3: 'Reactuación de Base de Datos',
        service2_badge: 'High Impact',
        service2_title: 'Infraestructura de Revenue',
        service2_desc: 'Conectamos Marketing y Ventas. Si un lead entra, el CRM se actualiza, el equipo recibe alerta y el lead recibe valor.',
        service2_feat1: 'Integración End-to-End',
        service2_feat2: 'Dashboards de Control',
        service2_feat3: 'Atribución de Ventas',
        service3_title: 'Agentes Autónomos B2B',
        service3_desc: 'Empleados digitales que crean listas de prospectos, envían correos personalizados y hacen seguimiento hasta la respuesta.',
        service3_feat1: 'Outbound Automatizado',
        service3_feat2: 'Investigación de Leads',
        service3_feat3: 'Personalización a Escala',
        // ── METHOD ──
        method_title: 'Ingeniería de Ventas',
        method_subtitle: 'Resultados predecibles, no suerte.',
        method_step1_title: 'Diagnóstico',
        method_step1_desc: 'Identificamos cuellos de botella en tu embudo de ventas y operaciones.',
        method_step2_title: 'Implementación',
        method_step2_desc: 'Desplegamos tu sistema de automatización y entrenamos a tus agentes IA.',
        method_step3_title: 'Escalado',
        method_step3_desc: 'Optimizamos métricas (CPL, CAC) para aumentar el volumen de leads cualificados.',
        // ── AUDIT FORM HEADER ──
        audit_badge: 'Diagnóstico Gratuito con IA',
        audit_title: 'Auditoría Inteligente de',
        audit_title_accent: 'Crecimiento',
        audit_subtitle: 'Respondé 4 pasos. Nuestra IA analiza tu negocio y te entrega un diagnóstico con ROI estimado en tiempo real.',
        // ── PROGRESS STEPS ──
        progress_step1: 'Tu Empresa',
        progress_step2: 'Operación',
        progress_step3: 'Tu Industria',
        progress_step4: 'Objetivos',
        // ── STEP 1 ──
        step1_title: 'Sobre Vos y tu Empresa',
        step1_desc: 'Necesitamos conocer quién sos y tu negocio para personalizar el análisis.',
        label_name: 'Nombre Completo *',
        label_role: 'Cargo *',
        label_company: 'Nombre de la Empresa *',
        label_website: 'Sitio Web',
        label_email: 'Email Corporativo *',
        label_phone: 'WhatsApp / Móvil *',
        label_country: 'País *',
        ph_name: 'Tu nombre',
        ph_company: 'Ej: Estudio Contable Sur',
        ph_website: 'https://tuempresa.com',
        ph_email: 'nombre@empresa.com',
        ph_phone: '+54 9 11...',
        opt_select: 'Seleccioná...',
        opt_role_owner: 'Dueño / Fundador',
        opt_role_manager: 'Gerente / Director',
        opt_role_marketing: 'Director de Marketing',
        opt_role_consultant: 'Consultor Independiente',
        opt_role_other: 'Otro',
        opt_country_ar: 'Argentina',
        opt_country_mx: 'México',
        opt_country_es: 'España',
        opt_country_us: 'Estados Unidos',
        opt_country_co: 'Colombia',
        opt_country_cl: 'Chile',
        opt_country_pe: 'Perú',
        opt_country_at: 'Austria',
        opt_country_de: 'Alemania',
        opt_country_other: 'Otro',
        btn_next: 'Siguiente',
        btn_back: 'Atrás',
        // ── STEP 2 ──
        step2_title: 'Tu Operación Actual',
        step2_desc: 'Estos datos nos permiten calcular el impacto real de la automatización en tu caso.',
        label_industry: 'Industria / Rubro *',
        label_years: 'Años en el Mercado *',
        label_employees: 'Empleados *',
        label_revenue: 'Facturación Mensual Aprox. *',
        label_channels: 'Canales de Venta Actuales *',
        label_crm: '¿Usás CRM? *',
        label_msgs: 'Mensajes de clientes/semana',
        ph_industry: 'Tu Sector...',
        ph_years: 'Seleccioná...',
        ph_employees: 'Cantidad...',
        ph_revenue: 'Rango...',
        ph_msgs: 'Ej: 50, 200, 500+',
        opt_ind_realestate: 'Real Estate / Inmobiliaria',
        opt_ind_health: 'Salud / Clínica',
        opt_ind_legal: 'Legal / Abogacía',
        opt_ind_restaurant: 'Restaurante / Gastronomía',
        opt_ind_hotel: 'Hotel / Hospitalidad',
        opt_ind_ecommerce: 'E-commerce / Retail',
        opt_ind_saas: 'SaaS / Tecnología',
        opt_ind_services: 'Servicios B2B',
        opt_ind_gym: 'Gym / Fitness',
        opt_ind_beauty: 'Salón de Belleza / Estética',
        opt_ind_education: 'Educación / Instituto',
        opt_ind_accounting: 'Contabilidad / Finanzas',
        opt_ind_other: 'Otro',
        opt_years_0_1: 'Menos de 1 año',
        opt_years_1_3: '1 a 3 años',
        opt_years_3_5: '3 a 5 años',
        opt_years_5_10: '5 a 10 años',
        opt_years_10: 'Más de 10 años',
        opt_emp_1_5: '1 a 5',
        opt_emp_5_15: '5 a 15',
        opt_emp_15_50: '15 a 50',
        opt_emp_50: 'Más de 50',
        opt_rev_5k: 'Menos de $5.000 USD',
        opt_rev_5_15: '$5.000 - $15.000 USD',
        opt_rev_15_50: '$15.000 - $50.000 USD',
        opt_rev_50_100: '$50.000 - $100.000 USD',
        opt_rev_100: 'Más de $100.000 USD',
        ch_whatsapp: 'WhatsApp',
        ch_instagram: 'Instagram',
        ch_web: 'Web',
        ch_email: 'Email',
        ch_phone: 'Teléfono',
        ch_presencial: 'Presencial',
        ch_marketplace: 'Marketplace',
        opt_crm_yes: 'Sí',
        opt_crm_no: 'No',
        opt_crm_unknown: 'No sé qué es',
        // ── STEP 3 ──
        step3_title: 'Datos Específicos de tu Rubro',
        step3_desc: 'Cuanto más detalle, mejor será tu diagnóstico personalizado.',
        ind_realestate_title: 'Datos Inmobiliaria',
        ind_realestate_properties: 'Propiedades Activas',
        ind_realestate_ticket: 'Ticket Promedio (USD)',
        ind_realestate_ops: 'Operaciones/Mes',
        ind_realestate_source: 'Principal Fuente de Leads',
        ind_health_title: 'Datos Clínica / Salud',
        ind_health_appointments: 'Turnos/Día Promedio',
        ind_health_insurance: 'Obras Sociales',
        ind_health_wait: 'Tiempo de Espera',
        ind_health_noshows: '% No-Shows',
        ind_legal_title: 'Datos Estudio Legal',
        ind_legal_specialty: 'Especialidad Principal',
        ind_legal_consults: 'Consultas Nuevas/Semana',
        ind_legal_fee: 'Honorarios Consulta (USD)',
        ind_legal_source: 'Fuente de Clientes',
        ind_restaurant_title: 'Datos Restaurante',
        ind_restaurant_covers: 'Cubiertos/Día',
        ind_restaurant_ticket: 'Ticket Promedio (USD)',
        ind_restaurant_delivery: '¿Hacen Delivery?',
        ind_restaurant_platforms: 'Plataformas Delivery',
        ind_hotel_title: 'Datos Hotel / Hospitalidad',
        ind_hotel_rooms: 'Habitaciones',
        ind_hotel_occupancy: 'Ocupación Promedio %',
        ind_hotel_rate: 'Precio Noche Promedio (USD)',
        ind_hotel_channels: 'Canales de Reserva',
        ind_ecommerce_title: 'Datos E-commerce',
        ind_ecommerce_orders: 'Pedidos/Mes',
        ind_ecommerce_ticket: 'Ticket Promedio (USD)',
        ind_ecommerce_returns: '% Devoluciones',
        ind_ecommerce_platform: 'Plataforma',
        ind_saas_title: 'Datos SaaS / Tech',
        ind_saas_mrr: 'MRR Actual (USD)',
        ind_saas_churn: 'Churn Mensual %',
        ind_saas_tickets: 'Tickets Soporte/Semana',
        ind_saas_conversion: 'Trial-to-Paid %',
        ind_gym_title: 'Datos Gym / Fitness',
        ind_gym_members: 'Socios Activos',
        ind_gym_retention: 'Tasa de Retención %',
        ind_gym_price: 'Precio Mensual (USD)',
        ind_gym_trial: '¿Ofrecen Clase de Prueba?',
        ind_accounting_title: 'Datos Contabilidad',
        ind_accounting_clients: 'Clientes Activos',
        ind_accounting_fee: 'Honorario Mensual Promedio (USD)',
        ind_accounting_hours: 'Hrs/Semana en Tareas Repetitivas',
        ind_accounting_software: 'Software Contable',
        ind_services_title: 'Datos Servicios B2B',
        ind_services_clients: 'Clientes Activos',
        ind_services_ticket: 'Ticket Promedio (USD)',
        ind_services_cycle: 'Ciclo de Venta (días)',
        ind_services_source: 'Fuente Principal de Leads',
        ind_beauty_title: 'Datos Salón / Estética',
        ind_beauty_bookings: 'Citas/Día Promedio',
        ind_beauty_ticket: 'Ticket Promedio (USD)',
        ind_beauty_cancellations: '% Cancelaciones',
        ind_beauty_online: '¿Agenda Online?',
        ind_education_title: 'Datos Educación',
        ind_education_students: 'Alumnos Activos',
        ind_education_price: 'Precio Mensual (USD)',
        ind_education_inquiries: 'Consultas/Semana',
        ind_education_conversion: '% Conversión Consulta→Inscripción',
        ind_other_title: 'Datos de tu Negocio',
        ind_other_desc: 'Describí tu operación brevemente',
        opt_yes: 'Sí',
        opt_no: 'No',
        opt_select_generic: 'Seleccioná',
        // ── STEP 4 ──
        step4_title: 'El Dolor y el Objetivo',
        step4_desc: 'Esta es la info más importante. Cuanto más honesto seas, mejor será tu diagnóstico.',
        label_pain: '¿Cuál es el cuello de botella que más te cuesta plata? *',
        label_goal: '¿Qué cambiaría todo para tu negocio en 90 días? *',
        label_budget: 'Inversión Mensual Disponible *',
        label_contact_pref: '¿Cómo Preferís que te Contactemos? *',
        ph_pain: 'Ej: Perdemos leads porque tardamos horas en responder WhatsApp...',
        ph_goal: 'Ej: Duplicar la cantidad de leads calificados sin contratar más gente...',
        ph_budget: 'Rango...',
        opt_budget_500: 'Menos de $500 USD',
        opt_budget_500_1k: '$500 - $1.000 USD',
        opt_budget_1k_3k: '$1.000 - $3.000 USD',
        opt_budget_3k_10k: '$3.000 - $10.000 USD',
        opt_budget_10k: 'Más de $10.000 USD',
        opt_contact_whatsapp: 'WhatsApp',
        opt_contact_call: 'Llamada Telefónica',
        opt_contact_email: 'Email',
        btn_submit: 'Generar Mi Diagnóstico Gratis',
        btn_processing: 'Procesando...',
        company_fallback: 'tu empresa',
        // ── RESULT SCREEN ──
        result_analyzing: 'Analizando tu negocio con IA...',
        result_analyzing_sub: 'Estamos cruzando tus datos operativos con benchmarks de tu industria',
        result_ready: 'Diagnóstico Listo',
        result_detected: 'Esto es lo que detectamos para : ',
        result_card_title: 'Análisis Personalizado',
        result_cta_call: 'Agendar Llamada Estratégica',
        result_cta_whatsapp: 'Hablar por WhatsApp',
        result_fallback_title: '¡Datos Recibidos!',
        result_fallback_desc: 'Nuestro equipo está analizando tu caso. Te contactaremos dentro de las próximas',
        result_fallback_hours: '24 horas',
        result_fallback_suffix: 'con tu diagnóstico completo.',
        result_fallback_cta: 'Agendar Llamada Mientras Tanto',
    },
    en: {
        // ── NAV & HERO ──
        nav_services: 'Solutions',
        nav_method: 'Method',
        nav_cta: 'Free Audit',
        hero_badge: 'Marketing & Sales Automation',
        hero_title_1: 'Scale your Revenue',
        hero_title_2: 'without increasing',
        hero_title_3: 'your costs',
        hero_subtitle_1: 'We implement',
        hero_subtitle_2: 'Automated Sales Systems',
        hero_subtitle_3: 'and',
        hero_subtitle_4: 'AI Agents',
        hero_subtitle_5: 'that capture, qualify and close leads 24/7.',
        hero_cta_primary: 'Strategic Diagnosis',
        hero_cta_secondary: 'View Ecosystem',
        // ── SERVICES ──
        services_title: 'Growth Ecosystem',
        service1_title: 'Smart Chat Funnels',
        service1_desc: 'No more generic replies. Agents that understand context, qualify leads and book appointments directly in your calendar.',
        service1_feat1: 'Automatic Scoring',
        service1_feat2: 'Objection Handling',
        service1_feat3: 'Database Re-engagement',
        service2_badge: 'High Impact',
        service2_title: 'Revenue Infrastructure',
        service2_desc: 'We connect Marketing and Sales. When a lead comes in, the CRM updates, the team gets alerted, and the lead receives value.',
        service2_feat1: 'End-to-End Integration',
        service2_feat2: 'Control Dashboards',
        service2_feat3: 'Sales Attribution',
        service3_title: 'Autonomous B2B Agents',
        service3_desc: 'Digital employees that build prospect lists, send personalized emails, and follow up until the response.',
        service3_feat1: 'Automated Outbound',
        service3_feat2: 'Lead Research',
        service3_feat3: 'Personalization at Scale',
        // ── METHOD ──
        method_title: 'Sales Engineering',
        method_subtitle: 'Predictable results, not luck.',
        method_step1_title: 'Diagnosis',
        method_step1_desc: 'We identify bottlenecks in your sales funnel and operations.',
        method_step2_title: 'Implementation',
        method_step2_desc: 'We deploy your automation system and train your AI agents.',
        method_step3_title: 'Scaling',
        method_step3_desc: 'We optimize metrics (CPL, CAC) to increase the volume of qualified leads.',
        // ── AUDIT FORM HEADER ──
        audit_badge: 'Free AI-Powered Diagnosis',
        audit_title: 'Intelligent Growth',
        audit_title_accent: 'Audit',
        audit_subtitle: 'Complete 4 steps. Our AI analyzes your business and delivers a diagnosis with estimated ROI in real time.',
        // ── PROGRESS STEPS ──
        progress_step1: 'Your Company',
        progress_step2: 'Operations',
        progress_step3: 'Your Industry',
        progress_step4: 'Goals',
        // ── STEP 1 ──
        step1_title: 'About You & Your Company',
        step1_desc: 'We need to know who you are and your business to personalize the analysis.',
        label_name: 'Full Name *',
        label_role: 'Position *',
        label_company: 'Company Name *',
        label_website: 'Website',
        label_email: 'Corporate Email *',
        label_phone: 'WhatsApp / Mobile *',
        label_country: 'Country *',
        ph_name: 'Your name',
        ph_company: 'e.g.: Downtown Accounting LLC',
        ph_website: 'https://yourcompany.com',
        ph_email: 'name@company.com',
        ph_phone: '+1 555...',
        opt_select: 'Select...',
        opt_role_owner: 'Owner / Founder',
        opt_role_manager: 'Manager / Director',
        opt_role_marketing: 'Marketing Director',
        opt_role_consultant: 'Independent Consultant',
        opt_role_other: 'Other',
        opt_country_ar: 'Argentina',
        opt_country_mx: 'Mexico',
        opt_country_es: 'Spain',
        opt_country_us: 'United States',
        opt_country_co: 'Colombia',
        opt_country_cl: 'Chile',
        opt_country_pe: 'Peru',
        opt_country_at: 'Austria',
        opt_country_de: 'Germany',
        opt_country_other: 'Other',
        btn_next: 'Next',
        btn_back: 'Back',
        // ── STEP 2 ──
        step2_title: 'Your Current Operations',
        step2_desc: 'This data allows us to calculate the real impact of automation in your case.',
        label_industry: 'Industry *',
        label_years: 'Years in Market *',
        label_employees: 'Employees *',
        label_revenue: 'Approx. Monthly Revenue *',
        label_channels: 'Current Sales Channels *',
        label_crm: 'Do you use a CRM? *',
        label_msgs: 'Client messages/week',
        ph_industry: 'Your Sector...',
        ph_years: 'Select...',
        ph_employees: 'Amount...',
        ph_revenue: 'Range...',
        ph_msgs: 'e.g.: 50, 200, 500+',
        opt_ind_realestate: 'Real Estate',
        opt_ind_health: 'Healthcare / Clinic',
        opt_ind_legal: 'Legal / Law Firm',
        opt_ind_restaurant: 'Restaurant / Gastronomy',
        opt_ind_hotel: 'Hotel / Hospitality',
        opt_ind_ecommerce: 'E-commerce / Retail',
        opt_ind_saas: 'SaaS / Technology',
        opt_ind_services: 'B2B Services',
        opt_ind_gym: 'Gym / Fitness',
        opt_ind_beauty: 'Beauty Salon / Aesthetics',
        opt_ind_education: 'Education / Institute',
        opt_ind_accounting: 'Accounting / Finance',
        opt_ind_other: 'Other',
        opt_years_0_1: 'Less than 1 year',
        opt_years_1_3: '1 to 3 years',
        opt_years_3_5: '3 to 5 years',
        opt_years_5_10: '5 to 10 years',
        opt_years_10: 'More than 10 years',
        opt_emp_1_5: '1 to 5',
        opt_emp_5_15: '5 to 15',
        opt_emp_15_50: '15 to 50',
        opt_emp_50: 'More than 50',
        opt_rev_5k: 'Less than $5,000 USD',
        opt_rev_5_15: '$5,000 - $15,000 USD',
        opt_rev_15_50: '$15,000 - $50,000 USD',
        opt_rev_50_100: '$50,000 - $100,000 USD',
        opt_rev_100: 'More than $100,000 USD',
        ch_whatsapp: 'WhatsApp',
        ch_instagram: 'Instagram',
        ch_web: 'Web',
        ch_email: 'Email',
        ch_phone: 'Phone',
        ch_presencial: 'In-Person',
        ch_marketplace: 'Marketplace',
        opt_crm_yes: 'Yes',
        opt_crm_no: 'No',
        opt_crm_unknown: "I don't know what that is",
        // ── STEP 3 ──
        step3_title: 'Industry-Specific Data',
        step3_desc: 'The more detail you provide, the better your personalized diagnosis will be.',
        ind_realestate_title: 'Real Estate Data',
        ind_realestate_properties: 'Active Properties',
        ind_realestate_ticket: 'Average Ticket (USD)',
        ind_realestate_ops: 'Operations/Month',
        ind_realestate_source: 'Main Lead Source',
        ind_health_title: 'Clinic / Healthcare Data',
        ind_health_appointments: 'Avg. Appointments/Day',
        ind_health_insurance: 'Insurance Providers',
        ind_health_wait: 'Wait Time',
        ind_health_noshows: '% No-Shows',
        ind_legal_title: 'Law Firm Data',
        ind_legal_specialty: 'Main Specialty',
        ind_legal_consults: 'New Consultations/Week',
        ind_legal_fee: 'Consultation Fee (USD)',
        ind_legal_source: 'Client Source',
        ind_restaurant_title: 'Restaurant Data',
        ind_restaurant_covers: 'Covers/Day',
        ind_restaurant_ticket: 'Average Ticket (USD)',
        ind_restaurant_delivery: 'Do you deliver?',
        ind_restaurant_platforms: 'Delivery Platforms',
        ind_hotel_title: 'Hotel / Hospitality Data',
        ind_hotel_rooms: 'Rooms',
        ind_hotel_occupancy: 'Average Occupancy %',
        ind_hotel_rate: 'Average Nightly Rate (USD)',
        ind_hotel_channels: 'Booking Channels',
        ind_ecommerce_title: 'E-commerce Data',
        ind_ecommerce_orders: 'Orders/Month',
        ind_ecommerce_ticket: 'Average Order (USD)',
        ind_ecommerce_returns: '% Returns',
        ind_ecommerce_platform: 'Platform',
        ind_saas_title: 'SaaS / Tech Data',
        ind_saas_mrr: 'Current MRR (USD)',
        ind_saas_churn: 'Monthly Churn %',
        ind_saas_tickets: 'Support Tickets/Week',
        ind_saas_conversion: 'Trial-to-Paid %',
        ind_gym_title: 'Gym / Fitness Data',
        ind_gym_members: 'Active Members',
        ind_gym_retention: 'Retention Rate %',
        ind_gym_price: 'Monthly Price (USD)',
        ind_gym_trial: 'Do you offer a trial class?',
        ind_accounting_title: 'Accounting Data',
        ind_accounting_clients: 'Active Clients',
        ind_accounting_fee: 'Average Monthly Fee (USD)',
        ind_accounting_hours: 'Hrs/Week on Repetitive Tasks',
        ind_accounting_software: 'Accounting Software',
        ind_services_title: 'B2B Services Data',
        ind_services_clients: 'Active Clients',
        ind_services_ticket: 'Average Ticket (USD)',
        ind_services_cycle: 'Sales Cycle (days)',
        ind_services_source: 'Main Lead Source',
        ind_beauty_title: 'Beauty Salon Data',
        ind_beauty_bookings: 'Avg. Appointments/Day',
        ind_beauty_ticket: 'Average Ticket (USD)',
        ind_beauty_cancellations: '% Cancellations',
        ind_beauty_online: 'Online Booking?',
        ind_education_title: 'Education Data',
        ind_education_students: 'Active Students',
        ind_education_price: 'Monthly Price (USD)',
        ind_education_inquiries: 'Inquiries/Week',
        ind_education_conversion: '% Inquiry→Enrollment Conversion',
        ind_other_title: 'Your Business Data',
        ind_other_desc: 'Briefly describe your operation',
        opt_yes: 'Yes',
        opt_no: 'No',
        opt_select_generic: 'Select',
        // ── STEP 4 ──
        step4_title: 'The Pain & The Goal',
        step4_desc: 'This is the most important info. The more honest you are, the better your diagnosis.',
        label_pain: 'What bottleneck is costing you the most money? *',
        label_goal: 'What would change everything for your business in 90 days? *',
        label_budget: 'Available Monthly Investment *',
        label_contact_pref: 'How do you prefer to be contacted? *',
        ph_pain: 'e.g.: We lose leads because we take hours to reply on WhatsApp...',
        ph_goal: 'e.g.: Double the qualified leads without hiring more people...',
        ph_budget: 'Range...',
        opt_budget_500: 'Less than $500 USD',
        opt_budget_500_1k: '$500 - $1,000 USD',
        opt_budget_1k_3k: '$1,000 - $3,000 USD',
        opt_budget_3k_10k: '$3,000 - $10,000 USD',
        opt_budget_10k: 'More than $10,000 USD',
        opt_contact_whatsapp: 'WhatsApp',
        opt_contact_call: 'Phone Call',
        opt_contact_email: 'Email',
        btn_submit: 'Generate My Free Diagnosis',
        btn_processing: 'Processing...',
        company_fallback: 'your company',
        // ── RESULT SCREEN ──
        result_analyzing: 'Analyzing your business with AI...',
        result_analyzing_sub: "We're cross-referencing your operational data with industry benchmarks",
        result_ready: 'Diagnosis Ready',
        result_detected: "Here's what we found for",
        result_card_title: 'Personalized Analysis',
        result_cta_call: 'Schedule Strategy Call',
        result_cta_whatsapp: 'Chat on WhatsApp',
        result_fallback_title: 'Data Received!',
        result_fallback_desc: 'Our team is analyzing your case. We will contact you within the next',
        result_fallback_hours: '24 hours',
        result_fallback_suffix: 'with your complete diagnosis.',
        result_fallback_cta: 'Schedule a Call in the Meantime',
    },
    de: {
        // ── NAV & HERO ──
        nav_services: 'Lösungen',
        nav_method: 'Methode',
        nav_cta: 'Gratis-Audit',
        hero_badge: 'Marketing- & Vertriebsautomatisierung',
        hero_title_1: 'Skalieren Sie Ihren Umsatz',
        hero_title_2: 'ohne Ihre Kosten',
        hero_title_3: 'zu erhöhen',
        hero_subtitle_1: 'Wir implementieren',
        hero_subtitle_2: 'automatisierte Vertriebssysteme',
        hero_subtitle_3: 'und',
        hero_subtitle_4: 'KI-Agenten',
        hero_subtitle_5: 'die Leads 24/7 erfassen, qualifizieren und abschließen.',
        hero_cta_primary: 'Strategische Diagnose',
        hero_cta_secondary: 'Ökosystem ansehen',
        // ── SERVICES ──
        services_title: 'Wachstums-Ökosystem',
        service1_title: 'Intelligente Chat-Funnels',
        service1_desc: 'Keine generischen Antworten mehr. Agenten, die Kontext verstehen, Leads qualifizieren und Termine direkt in Ihren Kalender buchen.',
        service1_feat1: 'Automatisches Scoring',
        service1_feat2: 'Einwandbehandlung',
        service1_feat3: 'Datenbank-Reaktivierung',
        service2_badge: 'High Impact',
        service2_title: 'Revenue-Infrastruktur',
        service2_desc: 'Wir verbinden Marketing und Vertrieb. Wenn ein Lead eingeht, wird das CRM aktualisiert, das Team benachrichtigt und der Lead erhält Mehrwert.',
        service2_feat1: 'End-to-End-Integration',
        service2_feat2: 'Control-Dashboards',
        service2_feat3: 'Vertriebszuordnung',
        service3_title: 'Autonome B2B-Agenten',
        service3_desc: 'Digitale Mitarbeiter, die Interessentenlisten erstellen, personalisierte E-Mails senden und bis zur Antwort nachfassen.',
        service3_feat1: 'Automatisierter Outbound',
        service3_feat2: 'Lead-Recherche',
        service3_feat3: 'Personalisierung im großen Maßstab',
        // ── METHOD ──
        method_title: 'Vertriebsingenieurwesen',
        method_subtitle: 'Vorhersagbare Ergebnisse, kein Zufall.',
        method_step1_title: 'Diagnose',
        method_step1_desc: 'Wir identifizieren Engpässe in Ihrem Vertriebstrichter und Ihrer Betriebsabläufe.',
        method_step2_title: 'Implementierung',
        method_step2_desc: 'Wir deployen Ihr Automatisierungssystem und trainieren Ihre KI-Agenten.',
        method_step3_title: 'Skalierung',
        method_step3_desc: 'Wir optimieren Kennzahlen (CPL, CAC), um das Volumen qualifizierter Leads zu steigern.',
        // ── AUDIT FORM HEADER ──
        audit_badge: 'Kostenlose KI-Diagnose',
        audit_title: 'Intelligentes Wachstums-',
        audit_title_accent: 'Audit',
        audit_subtitle: 'Beantworten Sie 4 Schritte. Unsere KI analysiert Ihr Unternehmen und liefert eine Diagnose mit geschätztem ROI in Echtzeit.',
        // ── PROGRESS STEPS ──
        progress_step1: 'Ihr Unternehmen',
        progress_step2: 'Betrieb',
        progress_step3: 'Ihre Branche',
        progress_step4: 'Ziele',
        // ── STEP 1 ──
        step1_title: 'Über Sie & Ihr Unternehmen',
        step1_desc: 'Wir müssen Sie und Ihr Geschäft kennen, um die Analyse zu personalisieren.',
        label_name: 'Vollständiger Name *',
        label_role: 'Position *',
        label_company: 'Firmenname *',
        label_website: 'Webseite',
        label_email: 'Geschäftliche E-Mail *',
        label_phone: 'WhatsApp / Mobil *',
        label_country: 'Land *',
        ph_name: 'Ihr Name',
        ph_company: 'z.B.: Steuerberatung Müller GmbH',
        ph_website: 'https://ihrfirma.at',
        ph_email: 'name@firma.at',
        ph_phone: '+43 664...',
        opt_select: 'Auswählen...',
        opt_role_owner: 'Inhaber / Gründer',
        opt_role_manager: 'Geschäftsführer / Direktor',
        opt_role_marketing: 'Marketingleiter',
        opt_role_consultant: 'Unabhängiger Berater',
        opt_role_other: 'Andere',
        opt_country_ar: 'Argentinien',
        opt_country_mx: 'Mexiko',
        opt_country_es: 'Spanien',
        opt_country_us: 'Vereinigte Staaten',
        opt_country_co: 'Kolumbien',
        opt_country_cl: 'Chile',
        opt_country_pe: 'Peru',
        opt_country_at: 'Österreich',
        opt_country_de: 'Deutschland',
        opt_country_other: 'Andere',
        btn_next: 'Weiter',
        btn_back: 'Zurück',
        // ── STEP 2 ──
        step2_title: 'Ihr aktueller Betrieb',
        step2_desc: 'Diese Daten ermöglichen es uns, die reale Wirkung der Automatisierung in Ihrem Fall zu berechnen.',
        label_industry: 'Branche *',
        label_years: 'Jahre am Markt *',
        label_employees: 'Mitarbeiter *',
        label_revenue: 'Monatlicher Umsatz ca. *',
        label_channels: 'Aktuelle Vertriebskanäle *',
        label_crm: 'Verwenden Sie ein CRM? *',
        label_msgs: 'Kundennachrichten/Woche',
        ph_industry: 'Ihre Branche...',
        ph_years: 'Auswählen...',
        ph_employees: 'Anzahl...',
        ph_revenue: 'Bereich...',
        ph_msgs: 'z.B.: 50, 200, 500+',
        opt_ind_realestate: 'Immobilien',
        opt_ind_health: 'Gesundheit / Klinik',
        opt_ind_legal: 'Recht / Anwaltskanzlei',
        opt_ind_restaurant: 'Restaurant / Gastronomie',
        opt_ind_hotel: 'Hotel / Gastgewerbe',
        opt_ind_ecommerce: 'E-Commerce / Einzelhandel',
        opt_ind_saas: 'SaaS / Technologie',
        opt_ind_services: 'B2B-Dienstleistungen',
        opt_ind_gym: 'Fitnessstudio',
        opt_ind_beauty: 'Schönheitssalon / Ästhetik',
        opt_ind_education: 'Bildung / Institut',
        opt_ind_accounting: 'Buchhaltung / Finanzen',
        opt_ind_other: 'Andere',
        opt_years_0_1: 'Weniger als 1 Jahr',
        opt_years_1_3: '1 bis 3 Jahre',
        opt_years_3_5: '3 bis 5 Jahre',
        opt_years_5_10: '5 bis 10 Jahre',
        opt_years_10: 'Mehr als 10 Jahre',
        opt_emp_1_5: '1 bis 5',
        opt_emp_5_15: '5 bis 15',
        opt_emp_15_50: '15 bis 50',
        opt_emp_50: 'Mehr als 50',
        opt_rev_5k: 'Weniger als $5.000 USD',
        opt_rev_5_15: '$5.000 - $15.000 USD',
        opt_rev_15_50: '$15.000 - $50.000 USD',
        opt_rev_50_100: '$50.000 - $100.000 USD',
        opt_rev_100: 'Mehr als $100.000 USD',
        ch_whatsapp: 'WhatsApp',
        ch_instagram: 'Instagram',
        ch_web: 'Web',
        ch_email: 'E-Mail',
        ch_phone: 'Telefon',
        ch_presencial: 'Vor Ort',
        ch_marketplace: 'Marktplatz',
        opt_crm_yes: 'Ja',
        opt_crm_no: 'Nein',
        opt_crm_unknown: 'Ich weiß nicht, was das ist',
        // ── STEP 3 ──
        step3_title: 'Branchenspezifische Daten',
        step3_desc: 'Je mehr Details Sie angeben, desto besser wird Ihre personalisierte Diagnose.',
        ind_realestate_title: 'Immobiliendaten',
        ind_realestate_properties: 'Aktive Immobilien',
        ind_realestate_ticket: 'Durchschnittspreis (USD)',
        ind_realestate_ops: 'Transaktionen/Monat',
        ind_realestate_source: 'Hauptquelle für Leads',
        ind_health_title: 'Klinik- / Gesundheitsdaten',
        ind_health_appointments: 'Termine/Tag Durchschnitt',
        ind_health_insurance: 'Versicherungen',
        ind_health_wait: 'Wartezeit',
        ind_health_noshows: '% Nicht-Erscheinen',
        ind_legal_title: 'Anwaltskanzlei-Daten',
        ind_legal_specialty: 'Hauptfachgebiet',
        ind_legal_consults: 'Neue Beratungen/Woche',
        ind_legal_fee: 'Beratungshonorar (USD)',
        ind_legal_source: 'Kundenquelle',
        ind_restaurant_title: 'Restaurant-Daten',
        ind_restaurant_covers: 'Gedecke/Tag',
        ind_restaurant_ticket: 'Durchschnittspreis (USD)',
        ind_restaurant_delivery: 'Bieten Sie Lieferung an?',
        ind_restaurant_platforms: 'Lieferplattformen',
        ind_hotel_title: 'Hotel- / Gastgewerbedaten',
        ind_hotel_rooms: 'Zimmer',
        ind_hotel_occupancy: 'Durchschnittliche Auslastung %',
        ind_hotel_rate: 'Durchschnittlicher Nachtpreis (USD)',
        ind_hotel_channels: 'Buchungskanäle',
        ind_ecommerce_title: 'E-Commerce-Daten',
        ind_ecommerce_orders: 'Bestellungen/Monat',
        ind_ecommerce_ticket: 'Durchschnittliche Bestellung (USD)',
        ind_ecommerce_returns: '% Rücksendungen',
        ind_ecommerce_platform: 'Plattform',
        ind_saas_title: 'SaaS / Tech-Daten',
        ind_saas_mrr: 'Aktueller MRR (USD)',
        ind_saas_churn: 'Monatliche Abwanderung %',
        ind_saas_tickets: 'Support-Tickets/Woche',
        ind_saas_conversion: 'Trial-to-Paid %',
        ind_gym_title: 'Fitnessstudio-Daten',
        ind_gym_members: 'Aktive Mitglieder',
        ind_gym_retention: 'Bindungsrate %',
        ind_gym_price: 'Monatspreis (USD)',
        ind_gym_trial: 'Bieten Sie eine Probestunde an?',
        ind_accounting_title: 'Buchhaltungsdaten',
        ind_accounting_clients: 'Aktive Mandanten',
        ind_accounting_fee: 'Durchschnittliches Monatshonorar (USD)',
        ind_accounting_hours: 'Std./Woche für repetitive Aufgaben',
        ind_accounting_software: 'Buchhaltungssoftware',
        ind_services_title: 'B2B-Dienstleistungsdaten',
        ind_services_clients: 'Aktive Kunden',
        ind_services_ticket: 'Durchschnittspreis (USD)',
        ind_services_cycle: 'Verkaufszyklus (Tage)',
        ind_services_source: 'Hauptquelle für Leads',
        ind_beauty_title: 'Schönheitssalon-Daten',
        ind_beauty_bookings: 'Termine/Tag Durchschnitt',
        ind_beauty_ticket: 'Durchschnittspreis (USD)',
        ind_beauty_cancellations: '% Stornierungen',
        ind_beauty_online: 'Online-Buchung?',
        ind_education_title: 'Bildungsdaten',
        ind_education_students: 'Aktive Schüler',
        ind_education_price: 'Monatspreis (USD)',
        ind_education_inquiries: 'Anfragen/Woche',
        ind_education_conversion: '% Anfrage→Einschreibung',
        ind_other_title: 'Ihre Geschäftsdaten',
        ind_other_desc: 'Beschreiben Sie kurz Ihren Betrieb',
        opt_yes: 'Ja',
        opt_no: 'Nein',
        opt_select_generic: 'Auswählen',
        // ── STEP 4 ──
        step4_title: 'Der Schmerz & Das Ziel',
        step4_desc: 'Dies sind die wichtigsten Informationen. Je ehrlicher Sie sind, desto besser Ihre Diagnose.',
        label_pain: 'Welcher Engpass kostet Sie am meisten Geld? *',
        label_goal: 'Was würde in 90 Tagen alles für Ihr Unternehmen verändern? *',
        label_budget: 'Verfügbare monatliche Investition *',
        label_contact_pref: 'Wie möchten Sie kontaktiert werden? *',
        ph_pain: 'z.B.: Wir verlieren Leads, weil wir stundenlang brauchen um auf WhatsApp zu antworten...',
        ph_goal: 'z.B.: Qualifizierte Leads verdoppeln ohne mehr Personal einzustellen...',
        ph_budget: 'Bereich...',
        opt_budget_500: 'Weniger als $500 USD',
        opt_budget_500_1k: '$500 - $1.000 USD',
        opt_budget_1k_3k: '$1.000 - $3.000 USD',
        opt_budget_3k_10k: '$3.000 - $10.000 USD',
        opt_budget_10k: 'Mehr als $10.000 USD',
        opt_contact_whatsapp: 'WhatsApp',
        opt_contact_call: 'Telefonanruf',
        opt_contact_email: 'E-Mail',
        btn_submit: 'Meine kostenlose Diagnose erstellen',
        btn_processing: 'Wird verarbeitet...',
        company_fallback: 'dein Unternehmen',
        // ── RESULT SCREEN ──
        result_analyzing: 'Ihr Unternehmen wird mit KI analysiert...',
        result_analyzing_sub: 'Wir vergleichen Ihre Betriebsdaten mit Branchen-Benchmarks',
        result_ready: 'Diagnose fertig',
        result_detected: 'Das haben wir für',
        result_card_title: 'Personalisierte Analyse',
        result_cta_call: 'Strategiegespräch vereinbaren',
        result_cta_whatsapp: 'Per WhatsApp chatten',
        result_fallback_title: 'Daten empfangen!',
        result_fallback_desc: 'Unser Team analysiert Ihren Fall. Wir kontaktieren Sie innerhalb der nächsten',
        result_fallback_hours: '24 Stunden',
        result_fallback_suffix: 'mit Ihrer vollständigen Diagnose.',
        result_fallback_cta: 'In der Zwischenzeit Anruf vereinbaren',
    }
};

// ═══════════════════════════════════════════════════════════
// Language management
// ═══════════════════════════════════════════════════════════
// Check URL parameter, then localStorage, then browser language, then default to 'es'
const urlParams = new URLSearchParams(window.location.search);
const langParam = urlParams.get('lang');
const browserLang = (navigator.language || navigator.userLanguage || 'es').substring(0, 2);
const supportedLangs = ['es', 'en', 'de'];

let currentLang = (supportedLangs.includes(langParam) ? langParam : null) 
                  || localStorage.getItem('lang') 
                  || (supportedLangs.includes(browserLang) ? browserLang : 'es');

function switchLanguage(lang) {
    console.log('Switching language to:', lang);
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);

    // Actualizar la URL de forma forzada para asegurar persistencia
    try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        const newUrl = url.pathname + url.search + url.hash;
        window.history.replaceState({ lang: lang }, '', newUrl);
        console.log('URL updated to:', newUrl);
    } catch (err) {
        console.error('URL update failed:', err);
    }

    const langInput = document.getElementById('langInput');
    if (langInput) langInput.value = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    document.querySelectorAll('option[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    const langDisplay = document.getElementById('currentLang');
    if (langDisplay) langDisplay.textContent = lang.toUpperCase();
}

function prefillAuditFormFromURL() {
    try {
        const params = new URLSearchParams(window.location.search);
        const fields = ['name', 'company', 'email', 'phone', 'role', 'country', 'website'];
        
        fields.forEach(field => {
            const val = params.get(field);
            if (val) {
                const el = document.getElementById('audit_' + field);
                if (el) {
                    el.value = decodeURIComponent(val);
                    el.classList.add('prefilled');
                }
            }
        });

        // Caso especial Industria (dispara visibilidad de campos)
        const ind = params.get('industry');
        if (ind) {
            const select = document.getElementById('audit_industry');
            if (select) {
                select.value = ind;
                if (typeof showIndustryFields === 'function') {
                    showIndustryFields(ind);
                }
            }
        }
        
        console.log('✅ Formulario pre-llenado desde URL');
    } catch (e) {
        console.error('Error pre-llenando formulario:', e);
    }
}

// ═══════════════════════════════════════════════════════════
// AUDIT FORM: Multi-Step Navigation
// ═══════════════════════════════════════════════════════════
let currentStep = 1;
const totalSteps = 4;

function updateProgress(step) {
    document.querySelectorAll('.progress-step').forEach(ps => {
        const s = parseInt(ps.dataset.step);
        ps.classList.remove('active', 'done');
        if (s < step) ps.classList.add('done');
        if (s === step) ps.classList.add('active');
    });

    const fill = document.getElementById('progressFill');
    if (fill) {
        const progress = document.getElementById('auditProgress');
        const totalWidth = progress.offsetWidth - 80;
        const pct = ((step - 1) / (totalSteps - 1)) * 100;
        fill.style.width = `calc(${pct}% - 0px)`;
    }
}

function validateStep(stepNum) {
    const stepEl = document.getElementById('step' + stepNum);
    if (!stepEl) return true;

    let valid = true;

    stepEl.querySelectorAll('input[required], select[required], textarea[required]').forEach(field => {
        if (!field.value || field.value.trim() === '') {
            field.classList.add('invalid');
            valid = false;
        } else {
            field.classList.remove('invalid');
        }
    });

    if (stepNum === 2) {
        const checked = stepEl.querySelectorAll('input[name="channels"]:checked');
        if (checked.length === 0) {
            const group = document.getElementById('audit_channels');
            if (group) group.style.outline = '2px solid #ef4444';
            valid = false;
        } else {
            const group = document.getElementById('audit_channels');
            if (group) group.style.outline = 'none';
        }
    }

    if (!valid) {
        stepEl.style.animation = 'none';
        void stepEl.offsetWidth; 
        stepEl.style.animation = 'auditShake .4s ease';
    }

    return valid;
}

function auditNextStep(targetStep) {
    if (!validateStep(currentStep)) return;

    const current = document.getElementById('step' + currentStep);
    const target = document.getElementById('step' + targetStep);
    if (!current || !target) return;

    current.classList.remove('active');
    target.classList.add('active');
    currentStep = targetStep;
    updateProgress(currentStep);

    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function auditPrevStep(targetStep) {
    const current = document.getElementById('step' + currentStep);
    const target = document.getElementById('step' + targetStep);
    if (!current || !target) return;

    current.classList.remove('active');
    target.classList.add('active');
    currentStep = targetStep;
    updateProgress(currentStep);
}

// ═══════════════════════════════════════════════════════════
// Dynamic Industry Fields
// ═══════════════════════════════════════════════════════════
function showIndustryFields(industry) {
    document.querySelectorAll('.industry-fields').forEach(f => f.classList.remove('visible'));
    const target = document.getElementById('fields_' + industry);
    if (target) {
        target.classList.add('visible');
    }
}

// ═══════════════════════════════════════════════════════════
// Collect ALL form data (including dynamic industry fields)
// ═══════════════════════════════════════════════════════════
function sanitizeString(str) {
    if (!str) return '';
    // Eliminar caracteres que puedan romper queries o formatos (opcional, ripgrep etc)
    return str.replace(/[<>]/g, '').trim(); 
}

function collectAuditData() {
    const form = document.getElementById('auditForm');
    const data = {};

    form.querySelectorAll('input[name]:not([type="checkbox"]):not([type="hidden"])').forEach(inp => {
        if (inp.value && inp.value.trim()) {
            data[inp.name] = inp.value.trim();
        }
    });

    form.querySelectorAll('input[type="hidden"]').forEach(inp => {
        data[inp.name] = inp.value;
    });

    form.querySelectorAll('select[name]').forEach(sel => {
        if (sel.value) data[sel.name] = sel.value;
    });

    form.querySelectorAll('textarea[name]').forEach(ta => {
        if (ta.value && ta.value.trim()) {
            let val = ta.value.trim();
            if (ta.name === 'main_pain' || ta.name === 'goal_90_days') val = sanitizeString(val);
            data[ta.name] = val;
        }
    });

    const channels = [];
    form.querySelectorAll('input[name="channels"]:checked').forEach(cb => {
        channels.push(cb.value);
    });
    if (channels.length) data.channels = channels;

    data.submittedAt = new Date().toISOString();

    // 🛡️ PARCHE DE IDIOMA: Inyectando el idioma actual para que viaje a Supremo (n8n y Supabase)
    data.language = currentLang;
    data.idioma = currentLang;
    
    // Sanitizar industria si es select o texto libre
    if (data.industry) data.industry = sanitizeString(data.industry);

    return data;
}

// ═══════════════════════════════════════════════════════════
// Supabase Integration
// ═══════════════════════════════════════════════════════════
const SUPABASE_URL = 'https://gjfsylpbxxfvponhgmhz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZnN5bHBieHhmdnBvbmhnbWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NTUwNTgsImV4cCI6MjA4ODMzMTA1OH0.cXkLvik7fHeBX1ecuw0v5RAu1UdHNghQHTmSB4QW3Dw';

async function saveToSupabase(data) {
    try {
        console.log('🔄 Iniciando saveToSupabase con:', data);
        const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const payload = {
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            company: data.company || '',
            website: data.website || '',
            country: data.country || '',
            role: data.role || '',
            industry: data.industry || '',
            years_in_market: data.years_in_market || '',
            employees: data.employees || '',
            monthly_revenue: data.monthly_revenue || '',
            channels: data.channels || [],
            uses_crm: data.uses_crm || '',
            weekly_messages: data.weekly_messages || '',
            main_pain: data.main_pain || '',
            goal_90_days: data.goal_90_days || '',
            budget: data.budget || '',
            contact_preference: data.contact_preference || '',
            industry_data: data.industry_data || JSON.stringify(Object.fromEntries(Object.entries(data).filter(([k]) => k.startsWith('ind_')))),
            
            // 🛡️ PARCHE DE BASE DE DATOS: Ponemos el ID del idioma (ej _de) al final de origin para que Supabase no rechace la fila.
            source: 'audit_form_v1_' + (data.idioma || 'es'),
            
            status: 'pending'
        };
        
        console.log('📦 Payload a insertar:', payload);
        
        const response = await sb.from('audit_leads').insert([payload]);
        console.log('📥 Respuesta completa de Supabase:', response);

        if (response.error) {
            console.error('❌ Supabase insert error:', response.error);
            return false;
        }
        console.log('✅ Inserción exitosa en Supabase');
        return true;
    } catch (e) {
        console.error('💥 Excepción en saveToSupabase:', e);
        return false;
    }
}

async function updateSupabaseDiagnosis(email, diagnosis) {
    if (!email || !diagnosis) return;
    try {
        const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { error } = await sb.from('audit_leads')
            .update({ ai_diagnosis: diagnosis })
            .eq('email', email)
            .order('created_at', { ascending: false })
            .limit(1);
            
        if (error) console.error('Error actualizando diagnóstico en BD:', error);
        else console.log('✅ Diagnóstico de IA guardado en BD para ' + email);
    } catch (e) {
        console.error('Excepción al actualizar diagnóstico:', e);
    }
}

// ═══════════════════════════════════════════════════════════
// N8N Webhook - AI Audit
// ═══════════════════════════════════════════════════════════
const AUDIT_WEBHOOK_URL = 'https://manager.generarise.space/webhook/audit-lead';

async function requestAIAudit(data) {
    try {
        const response = await fetch(AUDIT_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            return result.proposal || result.auditoria_texto || result.text || null;
        }
        return null;
    } catch (e) {
        console.error('Webhook error:', e);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════
// Form Submission Handler
// ═══════════════════════════════════════════════════════════
async function handleAuditSubmit(e) {
    e.preventDefault();

    if (!validateStep(4)) return;

    const form = document.getElementById('auditForm');
    const result = document.getElementById('auditResult');
    const loader = document.getElementById('resultLoader');
    const content = document.getElementById('resultContent');
    const fallback = document.getElementById('resultFallback');
    const companyEl = document.getElementById('resultCompany');
    const proposalEl = document.getElementById('proposalText');
    const submitBtn = document.getElementById('submitAudit');

    submitBtn.disabled = true;
    const processingText = (translations[currentLang] && translations[currentLang].btn_processing) || 'Procesando...';
    submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> ${processingText}`;

    const data = collectAuditData();
    await saveToSupabase(data);

    form.style.display = 'none';
    result.classList.add('visible');
    loader.style.display = 'block';
    content.style.display = 'none';
    fallback.style.display = 'none';

    document.querySelectorAll('.progress-step').forEach(ps => {
        ps.classList.remove('active');
        ps.classList.add('done');
    });
    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = '100%';

    try {
        console.log('Sending data to n8n:', data);
        const proposal = await requestAIAudit(data);
        console.log('n8n Response:', proposal);

        loader.style.display = 'none';

        if (proposal) {
            const fallbackCompany = (translations[currentLang] && translations[currentLang].company_fallback) || 'tu empresa';
            companyEl.textContent = data.company || fallbackCompany;
            proposalEl.textContent = proposal;
            content.style.display = 'block';
            content.classList.add('visible');
            
            updateSupabaseDiagnosis(data.email, proposal);
        } else {
            console.error('n8n returned no proposal');
            fallback.style.display = 'block';
            fallback.classList.add('visible');
        }
    } catch (err) {
        console.error('Fatal submission error:', err);
        loader.style.display = 'none';
        fallback.style.display = 'block';
        fallback.classList.add('visible');
    }
}

// ═══════════════════════════════════════════════════════════
// DOM Ready
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    try {
        const auditForm = document.getElementById('auditForm');
        if (auditForm) {
            auditForm.addEventListener('submit', handleAuditSubmit);
        }

        document.querySelectorAll('.audit-field input, .audit-field select, .audit-field textarea').forEach(field => {
            field.addEventListener('input', () => field.classList.remove('invalid'));
            field.addEventListener('change', () => field.classList.remove('invalid'));
        });

        if (!document.getElementById('audit-shake-style')) {
            const style = document.createElement('style');
            style.id = 'audit-shake-style';
            style.textContent = `@keyframes auditShake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-6px); } 40%,80% { transform: translateX(6px); } }`;
            document.head.appendChild(style);
        }

        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card, .audit-container').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });

        document.querySelectorAll('.service-card, .glass-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });

        switchLanguage(currentLang);
        prefillAuditFormFromURL();

        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            
            // 🛡️ PARCHE MÓVIL: Fuerza al botón a estar siempre visible y clickeable por encima de todo.
            langToggle.style.position = 'relative';
            langToggle.style.zIndex = '999999';
            langToggle.style.pointerEvents = 'auto';

            langToggle.addEventListener('click', () => {
                const cycle = { es: 'en', en: 'de', de: 'es' };
                const newLang = cycle[currentLang] || 'es';
                switchLanguage(newLang);
            });
        }
    } catch (e) {
        console.error('DOMContentLoaded error (non-fatal):', e);
    }
});
