// ═══════════════════════════════════════════════════
const TEMPLATES = {
  // ─── HOTEL ───────────────────────────────────
  hotel: {
    es: {
      whatsapp_first: (lead) =>
        `Hola ${lead.name}. Qué excelente nivel tiene ${lead.company || 'su hotel'}. Te escribo rápido porque diseñé una idea de 1 minuto sobre cómo podrían captar reservas directas automáticamente directo desde sus redes sociales sin depender de comisiones.\n\nArmé un ejemplo rápido de cómo se vería para ustedes sin ningún compromiso. ¿Te interesa verlo?`,
      whatsapp_followup: (lead) =>
        `Hola de nuevo ${lead.name}. Solo quería confirmar si pudieron ver mi mensaje anterior. El sistema que armé ya está generándole tráfico y reservas a otros alojamientos. ¿Les sirve que les mande un videíto de 2 minutos mostrando cómo funciona?`,
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
      email_subject: (lead) => `${lead.company} — Sistema cerrado de tráfico y captación`,
      email_body: (lead) =>
        `Hola ${lead.name},\n\nVi el excelente nivel de ${lead.company} y noté una gran oportunidad. Armé un sistema cerrado que genera prospectos usando tráfico orgánico y los califica automáticamente.\n\nTengo un cupo para hacerles una demostración con su propio contenido. ¿Les interesaría verlo sin compromiso?\n\nSaludos,\nGustavo Dornhofer\nGenerArise`
    }
  }
};

// ─── TEMPLATE SELECTOR ─────────────────────────────

function getTemplate(lead, type = 'whatsapp_first') {
  const industry = lead.industry || 'hotel';
  const lang = lead.language || 'es';

  const industryTemplates = TEMPLATES[industry];
  if (!industryTemplates) {
    // Fallback to hotel templates
    return TEMPLATES.hotel[lang]?.[type] || TEMPLATES.hotel.es[type];
  }

  const langTemplates = industryTemplates[lang] || industryTemplates.es || industryTemplates.en;
  if (!langTemplates || !langTemplates[type]) {
    return TEMPLATES.hotel.es[type]; // Ultimate fallback
  }

  return langTemplates[type];
}

function renderMessage(lead, type = 'whatsapp_first') {
  const template = getTemplate(lead, type);
  if (typeof template === 'function') return template(lead);
  return template;
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
