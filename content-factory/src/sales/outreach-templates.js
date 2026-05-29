// ═══════════════════════════════════════════════════
const TEMPLATES = {
  // ─── HOTEL ───────────────────────────────────
  hotel: {
    es: {
      whatsapp_first: (lead) =>
        `Hola ${lead.name}. Qué excelente nivel tiene ${lead.company || 'su hotel'}. Te escribo rápido porque diseñé una idea de 1 minuto sobre cómo podrían captar reservas directas automáticamente directo desde sus redes sociales sin depender de comisiones.\n\nArmé un ejemplo rápido de cómo se vería para ustedes sin ningún compromiso. ¿Te interesa verlo?`,
      whatsapp_followup: (lead) =>
        `Hola de nuevo ${lead.name}. Solo quería confirmar si pudieron ver mi mensaje anterior. El sistema que armé ya está generándole tráfico y reservas a otros alojamientos. ¿Les sirve que les mande un videíto de 2 minutos mostrando cómo funciona?`,
      whatsapp_second: (lead) =>
        `Hola ${lead.name}. Como te comentaba, te paso el link para ver la demo personalizada de reservas que armamos para ${lead.company || 'su hotel'}: https://generarise.space/demo-hotel\n\nAhí podés ver cómo el asistente virtual responde consultas e integra reservas directas sin comisiones. ¿Pudiste mirarlo?`,
      whatsapp_third: (lead) =>
        `Hola ${lead.name}. Para poder darte el reporte exacto de viabilidad para ${lead.company || 'su hotel'}, te paso el link para completar la auditoría rápida de 2 minutos: https://generarise.space/auditoria\n\nCon esto nuestro equipo te arma el plan a medida. ¿Te sirve que lo revisemos?`,
      whatsapp_closing: (lead) =>
        `Hola ${lead.name}. Un gusto conversar con vos. Te dejo el link para formalizar el inicio del onboarding y activar el asistente de IA para ${lead.company || 'su hotel'}: https://generarise.space/onboarding\n\nCualquier duda técnica con la facturación avisame por acá.`,
      email_subject: (lead) => `${lead.company || 'Su hotel'} — Tráfico y reservas automáticas`,
      email_body: (lead) =>
        `Hola ${lead.name},\n\nVi el excelente trabajo que hacen en ${lead.company} y noté una gran oportunidad para aumentar sus reservas directas (sin pagarle comisiones a Booking).\n\nArmé un sistema cerrado que genera contenido viral para su hotel y atiende consultas 24/7, convirtiendo seguidores en huéspedes automáticamente.\n\nTengo un cupo de prueba esta semana para hacerles una demostración con su propio contenido. ¿Les interesaría verlo sin compromiso?\n\nSaludos,\nGustavo Dornhofer\nGenerArise`,
      linkedin_intro: (lead) =>
        `Hola ${lead.name}, un gusto. Admiro el nivel de ${lead.company}. Armé un sistema cerrado que genera tráfico orgánico y automatiza reservas para hoteles. Me gustaría conectar para mostrarte cómo funciona. ¡Un saludo!`
    },
    en: {
      whatsapp_first: (lead) =>
        `Hi ${lead.name}. Your work at ${lead.company || 'your hotel'} looks amazing. I built a closed system that generates viral traffic and captures direct bookings 24/7, so you can focus purely on guest experience. I have a trial spot open to show you how it works. Interested?`,
      whatsapp_followup: (lead) =>
        `Hi again. Just following up on my previous message. Would a quick 2-min video showing how the booking system works be helpful?`,
      whatsapp_second: (lead) =>
        `Hi ${lead.name}. Here is the link to the direct bookings demo personalized for ${lead.company || 'your hotel'}: https://generarise.space/demo-hotel\n\nYou can see how the assistant handles guest inquiries and drives commission-free bookings. Let me know what you think!`,
      whatsapp_third: (lead) =>
        `Hi ${lead.name}. To prepare the technical process audit for ${lead.company || 'your hotel'}, please fill out this quick 2-minute form: https://generarise.space/audit`,
      whatsapp_closing: (lead) =>
        `Hi ${lead.name}. Great connecting with you. Here is the link to complete the onboarding setup for ${lead.company || 'your hotel'}: https://generarise.space/onboarding`,
      email_subject: (lead) => `${lead.company || 'Your hotel'} — Automated traffic and direct bookings`,
      email_body: (lead) =>
        `Hi ${lead.name},\n\nI love what you're doing at ${lead.company}. I built a closed system that generates viral content and handles guest inquiries 24/7, turning traffic into direct bookings automatically.\n\nI have a trial spot open to show you how it works with your own content. Interested in a quick look?\n\nBest,\nGustavo Dornhofer\nGenerArise`
    }
  },

  // ─── INMOBILIARIA ────────────────────────────
  inmobiliaria: {
    es: {
      whatsapp_first: (lead) =>
        `Hola ${lead.name}. Qué excelente portafolio de propiedades tienen en ${lead.company || 'su inmobiliaria'}. Te escribo porque armé una estrategia de 1 minuto para atraer inversores calificados y pre-filtrar consultas automáticamente, para que sus agentes solo hablen con compradores listos.\n\nDiseñé una demo rápida aplicada a su marca. ¿Te interesa verla sin compromiso?`,
      whatsapp_followup: (lead) =>
        `Hola ${lead.name}. Solo quería retomar mi mensaje: el sistema ya está ahorrándole decenas de horas a otros agentes al filtrar curiosos. ¿Les sirve si les mando un video cortito de cómo funciona?`,
      whatsapp_second: (lead) =>
        `Hola ${lead.name}. Como acordamos, te paso la demo del flujo de captación y filtrado de propiedades para ${lead.company || 'su inmobiliaria'}: https://generarise.space/demo-propiedades\n\nVas a ver cómo el sistema pre-califica a los compradores antes de derivarlos a un asesor. ¿Qué te parece?`,
      whatsapp_third: (lead) =>
        `Hola ${lead.name}. Para avanzar con el diagnóstico de optimización digital para ${lead.company || 'su inmobiliaria'}, te comparto el link de la auditoría técnica de procesos: https://generarise.space/auditoria\n\nLleva solo 2 minutos y nos permite diseñar la integración exacta.`,
      whatsapp_closing: (lead) =>
        `Hola ${lead.name}. Un placer saludarte. Te paso por acá el acceso para el alta del servicio y onboarding de la automatización inmobiliaria para ${lead.company || 'su inmobiliaria'}: https://generarise.space/onboarding\n\nQuedo a tu disposición por cualquier consulta.`,
      email_subject: (lead) => `${lead.company} — Tráfico orgánico y filtrado de curiosos`,
      email_body: (lead) =>
        `Hola ${lead.name},\n\nVi el portafolio de propiedades de ${lead.company} y es excelente. Noté que podrían estar atrayendo muchos más inversores si automatizaran la captación.\n\nArmé un sistema cerrado que genera tráfico usando técnicas virales y pre-califica a los interesados (presupuesto, urgencia), para que sus agentes solo hablen con gente lista para comprar.\n\n¿Les interesaría ver una demo rápida de cómo funciona?\n\nSaludos,\nGustavo Dornhofer\nGenerArise`,
      linkedin_intro: (lead) =>
        `Hola ${lead.name}. Un placer conectar. Admiro el portafolio de ${lead.company}. Armé un sistema que genera tráfico y filtra curiosos inmobiliarios automáticamente. Me encantaría conectar y mostrarte los resultados. ¡Saludos!`
    }
  },

  // ─── CLÍNICA / DENTISTA ─────────────────────────────────
  clinica: {
    es: {
      whatsapp_first: (lead) =>
        `Hola ${lead.name}. Qué impecable reputación tiene ${lead.company || 'su clínica'}. Te escribo porque diseñé una idea de 1 minuto para llenar la agenda de turnos con pacientes privados de forma automatizada, optimizando los tiempos de su equipo médico.\n\nArmé un ejemplo sencillo de cómo funcionaría para ustedes. ¿Te interesa verlo sin compromiso?`,
      whatsapp_followup: (lead) =>
        `Hola ${lead.name}. Solo retomo mi mensaje anterior. El sistema ya está ayudando a otras clínicas a eliminar los turnos vacíos (no-shows). ¿Les sirve que les envíe un video de 2 minutos mostrando la plataforma?`,
      whatsapp_second: (lead) =>
        `Hola ${lead.name}. Te comparto el link de la demo del asistente de turnos y recordatorios automáticos adaptado para ${lead.company || 'su clínica'}: https://generarise.space/demo-salud\n\nMuestra cómo reducir ausencias (no-shows) y agendar 24/7 sin sobrecargar a recepción. ¿Pudieron verlo?`,
      whatsapp_third: (lead) =>
        `Hola ${lead.name}. Para estructurar la integración del asistente con la agenda médica de ${lead.company || 'su clínica'}, te paso el link para completar la auditoría rápida de procesos: https://generarise.space/auditoria`,
      whatsapp_closing: (lead) =>
        `Hola ${lead.name}. Adjunto el acceso de onboarding para coordinar la integración técnica y configurar el asistente en la línea de ${lead.company || 'su clínica'}: https://generarise.space/onboarding\n\nCualquier duda técnica me decís.`,
      email_subject: (lead) => `${lead.company} — Agenda llena y eliminación de turnos vacíos`,
      email_body: (lead) =>
        `Hola ${lead.name},\n\nVi el nivel de atención que manejan en ${lead.company} y es destacable. Armé un sistema cerrado diseñado específicamente para salud: atrae pacientes de su ciudad de forma orgánica y automatiza la reserva y confirmación de turnos.\n\nEl objetivo es que los médicos solo se enfoquen en atender, sin perder tiempo en la gestión. Tengo un cupo para mostrarles una prueba. ¿Les interesa?\n\nSaludos,\nGustavo Dornhofer\nGenerArise`,
      linkedin_intro: (lead) =>
        `Hola ${lead.name}. Un gusto saludarte. Vi la excelente gestión en ${lead.company}. Armé un sistema de captación de pacientes y agendas automáticas para salud. Me gustaría conectar para mostrarte cómo funciona. ¡Saludos!`
    }
  },

  // ─── CONTADOR / ABOGADO ─────────────────────
  contador: {
    es: {
      whatsapp_first: (lead) =>
        `Hola ${lead.name}. Qué sólida trayectoria tiene ${lead.company || 'su estudio'}. Te escribo porque diseñé una idea de 1 minuto para automatizar la atención de consultas repetitivas de clientes y filtrar prospectos de alto valor automáticamente.\n\nArmé un borrador rápido de cómo se aplicaría en su estudio. ¿Te interesa verlo sin compromiso?`,
      whatsapp_followup: (lead) =>
        `Hola ${lead.name}. Solo retomo: el sistema puede liberarles más de 40 horas mensuales al filtrar consultas automáticas. ¿Quieren que les mande una demostración rápida por acá?`,
      whatsapp_second: (lead) =>
        `Hola ${lead.name}. Te comparto por acá el link de la demo de automatización de consultas y filtrado de clientes para ${lead.company || 'su estudio'}: https://generarise.space/demo-profesionales\n\nVas a ver cómo atiende consultas recurrentes y te deriva solo casos rentables. ¿Qué te parece?`,
      whatsapp_third: (lead) =>
        `Hola ${lead.name}. Para relevar los cuellos de botella operativos en ${lead.company || 'su estudio'}, te paso el link de la auditoría de procesos digitales: https://generarise.space/auditoria\n\nCon esto diseñamos el flujo exacto.`,
      whatsapp_closing: (lead) =>
        `Hola ${lead.name}. Te comparto el enlace de inicio de onboarding para el set-up técnico del sistema en ${lead.company || 'su estudio'}: https://generarise.space/onboarding\n\nQuedo a disposición por dudas de facturación.`,
      email_subject: (lead) => `${lead.company} — Captación de clientes y filtrado automático`,
      email_body: (lead) =>
        `Hola ${lead.name},\n\nAdmiro el trabajo que hacen en ${lead.company}. Noté que los estudios profesionales pierden demasiado tiempo en la etapa de captación y filtrado de clientes.\n\nArmé un sistema cerrado que atrae prospectos corporativos y responde las consultas iniciales automáticamente, derivándoles solo los casos rentables.\n\n¿Les interesaría ver una prueba gratuita de cómo funciona?\n\nSaludos,\nGustavo Dornhofer\nGenerArise`,
      linkedin_intro: (lead) =>
        `Hola ${lead.name}. Un gusto conectar. Vi tu trayectoria en ${lead.company}. Armé un sistema que automatiza la captación y el filtrado de consultas para estudios profesionales. Me encantaría mostrarte cómo funciona. Un saludo!`
    }
  },

  // ─── ECOMMERCE ─────────────────────────────
  ecommerce: {
    es: {
      whatsapp_first: (lead) =>
        `Hola ${lead.name}. Qué excelente línea de productos tienen en ${lead.company || 'su tienda'}. Te escribo porque diseñé una idea de 1 minuto sobre cómo captar clientes calificados y responder dudas de stock o envíos automáticamente 24/7 para cerrar ventas al instante.\n\nArmé una demo interactiva aplicada a su marca. ¿Te interesa verla sin compromiso?`,
      whatsapp_followup: (lead) =>
        `Hola ${lead.name}. Retomo mi mensaje: el sistema ya está generándole tráfico orgánico y ventas en piloto automático a otras tiendas. ¿Les mando un video cortito para que lo vean en acción?`,
      whatsapp_second: (lead) =>
        `Hola ${lead.name}. Te paso el link de la demo interactiva del recomendador de productos y gestor de FAQ automáticos para ${lead.company || 'su tienda'}: https://generarise.space/demo-ecommerce\n\nVas a ver cómo responde stock y talles ayudando a cerrar el carrito abandonado. ¿Qué opinás?`,
      whatsapp_third: (lead) =>
        `Hola ${lead.name}. Para analizar la tasa de rebote y optimización de conversión de ${lead.company || 'su tienda'}, te comparto el link de la auditoría de ecommerce: https://generarise.space/auditoria\n\nNos ayuda a estimar el retorno de inversión.`,
      whatsapp_closing: (lead) =>
        `Hola ${lead.name}. Te dejo el link de onboarding para integrar el asistente con el catálogo y pasarela de pago de ${lead.company || 'su tienda'}: https://generarise.space/onboarding\n\nQuedamos listos para iniciar.`,
      email_subject: (lead) => `${lead.company} — Tráfico orgánico y ventas en piloto automático`,
      email_body: (lead) =>
        `Hola ${lead.name},\n\nMe encantó la estética de ${lead.company}. Hoy en día, pagar anuncios es cada vez más caro, por eso el tráfico orgánico es clave.\n\nArmé un sistema cerrado que redacta contenido viral para sus redes (optimizando el SEO) y cierra ventas automáticamente respondiendo dudas de stock y talles 24/7.\n\nTengo un cupo para hacerles una demostración gratuita. ¿Les interesaría verlo?\n\nSaludos,\nGustavo Dornhofer\nGenerArise`
    }
  },

  // ─── GIMNASIO / FITNESS ──────────────────────────────
  gimnasio: {
    es: {
      whatsapp_first: (lead) =>
        `Hola ${lead.name}. Qué impecable nivel tiene ${lead.company || 'su centro'}. Te escribo porque armé una idea rápida para atraer nuevos socios de su zona e inscribirlos en clases de prueba automáticamente 24/7.\n\nDiseñé un flujo de ejemplo aplicado a su gimnasio. ¿Te interesa verlo sin compromiso?`,
      whatsapp_followup: (lead) =>
        `Hola ${lead.name}. Retomo: el sistema convierte el tráfico de redes en socios reales al instante. ¿Les sirve que les envíe un video de cómo agenda clases automáticamente?`,
      whatsapp_second: (lead) =>
        `Hola ${lead.name}. Te comparto el link de la demo de reservas y captación de socios para ${lead.company || 'su centro'}: https://generarise.space/demo-fitness\n\nVas a ver cómo agenda clases de prueba y realiza seguimiento de pago automáticamente. ¿Pudieron mirarlo?`,
      whatsapp_third: (lead) =>
        `Hola ${lead.name}. Para relevar la capacidad instalada y picos de asistencia en ${lead.company || 'su centro'}, te dejo por acá la auditoría express: https://generarise.space/auditoria\n\nDiseñamos el flujo de reservas según sus horarios.`,
      whatsapp_closing: (lead) =>
        `Hola ${lead.name}. Te comparto el acceso al onboarding para conectar el sistema de reservas y comenzar a llenar las clases de ${lead.company || 'su centro'}: https://generarise.space/onboarding\n\nCualquier duda, avisame.`,
      email_subject: (lead) => `${lead.company} — Captación de socios en piloto automático`,
      email_body: (lead) =>
        `Hola ${lead.name},\n\nVi el excelente nivel de ${lead.company}. Armé un sistema de crecimiento específico para centros fitness: genera contenido que atrae gente de su zona y los inscribe a clases de prueba de forma automática 24/7.\n\n¿Les interesaría ver una demo rápida de cómo llenamos las clases sin que ustedes muevan un dedo?\n\nSaludos,\nGustavo Dornhofer\nGenerArise`
    }
  },

  // ─── GENERAL / DEFAULT ──────────────────────
  default: {
    es: {
      whatsapp_first: (lead) =>
        `Hola ${lead.name}. Qué excelente trabajo hacen en ${lead.company || 'su negocio'}. Te escribo rápido porque diseñé una idea de 1 minuto sobre cómo captar prospectos calificados orgánicamente y automatizar su atención las 24 horas para que su equipo solo cierre las ventas.\n\nArmé una demo rápida aplicada a su marca. ¿Te interesa verla sin compromiso?`,
      whatsapp_followup: (lead) =>
        `Hola ${lead.name}. Retomo mi mensaje anterior. El sistema ya le está generando prospectos diarios a empresas similares. ¿Quieren que les mande un videíto corto mostrando cómo funciona?`,
      whatsapp_second: (lead) =>
        `Hola ${lead.name}. Te paso el link de la demo de automatización de captación y atención al cliente adaptada para ${lead.company || 'su negocio'}: https://generarise.space/demo-negocios\n\nVas a ver cómo califica y atiende dudas automáticamente 24/7. ¿Qué te parece?`,
      whatsapp_third: (lead) =>
        `Hola ${lead.name}. Para hacer un relevamiento de necesidades en la operación de ${lead.company || 'su negocio'}, te comparto el link de la auditoría de procesos: https://generarise.space/auditoria`,
      whatsapp_closing: (lead) =>
        `Hola ${lead.name}. Te comparto por acá el link para formalizar el inicio del onboarding y activar el asistente de IA para ${lead.company || 'su negocio'}: https://generarise.space/onboarding\n\nCualquier duda, contáctame por aquí.`,
      email_subject: (lead) => `${lead.company} — Sistema cerrado de tráfico y captación`,
      email_body: (lead) =>
        `Hola ${lead.name},\n\nVi el excelente nivel de ${lead.company} y noté una gran oportunidad. Armé un sistema cerrado que genera prospectos usando tráfico orgánico y los califica automáticamente.\n\nTengo un cupo para hacerles una demostración con su propio contenido. ¿Les interesaría verlo sin compromiso?\n\nSaludos,\nGustavo Dornhofer\nGenerArise`,
      linkedin_intro: (lead) =>
        `Hola ${lead.name}. Un gusto conectar. Vi el excelente nivel de ${lead.company}. Armé un sistema cerrado que genera tráfico orgánico y automatiza la captación de clientes. Me encantaría mostrarte cómo funciona. ¡Saludos!`
    }
  }
};

// ─── TEMPLATE SELECTOR ─────────────────────────────

function getTemplate(lead, type = 'whatsapp_first') {
  const industry = lead.industry || 'default';
  const lang = lead.language || 'es';

  // Try industry-specific template first
  const industryTemplates = TEMPLATES[industry];
  if (industryTemplates) {
    const langTemplates = industryTemplates[lang] || industryTemplates.es || industryTemplates.en;
    if (langTemplates && langTemplates[type]) {
      return langTemplates[type];
    }
  }

  // Fallback to default templates
  const defaultTemplates = TEMPLATES.default[lang] || TEMPLATES.default.es;
  if (defaultTemplates && defaultTemplates[type]) {
    return defaultTemplates[type];
  }

  // Ultimate fallback: hotel templates (most complete set)
  const hotelTemplates = TEMPLATES.hotel[lang] || TEMPLATES.hotel.es;
  return hotelTemplates?.[type] || null;
}

function renderMessage(lead, type = 'whatsapp_first') {
  const template = getTemplate(lead, type);
  if (typeof template === 'function') return template(lead);
  if (template) return template;
  // Defensive fallback: never return undefined
  return `Hola ${lead.name || 'amigo/a'}. Qué excelente trabajo hacen en ${lead.company || 'su negocio'}. Te escribo porque tengo una idea rápida de cómo podrían automatizar la captación de clientes. ¿Estarías abierto/a a verla sin compromiso?`;
}

function renderEmailSubject(lead) {
  const template = getTemplate(lead, 'email_subject');
  if (typeof template === 'function') return template(lead);
  return template;
}

function renderEmailBody(lead) {
  const template = getTemplate(lead, 'email_body');
  if (typeof template === 'function') return template(lead);
  return template;
}

function renderLinkedInIntro(lead) {
  const template = getTemplate(lead, 'linkedin_intro');
  if (typeof template === 'function') return template(lead);
  return template;
}

export default { TEMPLATES, getTemplate, renderMessage, renderEmailSubject, renderEmailBody, renderLinkedInIntro };
