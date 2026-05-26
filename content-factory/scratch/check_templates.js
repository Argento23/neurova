import templates from '../src/sales/outreach-templates.js';

const mockLead = {
  name: 'Juan Perez',
  company: 'Hotel Central',
  industry: 'hotel',
  language: 'es'
};

console.log('Testing hotel ES templates:');
console.log('First:', templates.renderMessage(mockLead, 'whatsapp_first'));
console.log('Second:', templates.renderMessage(mockLead, 'whatsapp_second'));
console.log('Third:', templates.renderMessage(mockLead, 'whatsapp_third'));
console.log('Closing:', templates.renderMessage(mockLead, 'whatsapp_closing'));

const mockInmoLead = {
  name: 'Maria Gomez',
  company: 'Gomez Propiedades',
  industry: 'inmobiliaria',
  language: 'es'
};

console.log('\nTesting inmobiliaria ES templates:');
console.log('Second:', templates.renderMessage(mockInmoLead, 'whatsapp_second'));
console.log('Third:', templates.renderMessage(mockInmoLead, 'whatsapp_third'));
console.log('Closing:', templates.renderMessage(mockInmoLead, 'whatsapp_closing'));
