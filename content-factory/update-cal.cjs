const fs = require('fs');
const path = 'data/calendar.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Eliminar 'tiktok' de tipos que no son video_corto
data.weekTemplate.forEach(day => {
  day.slots.forEach(slot => {
    if (slot.type !== 'video_corto' && slot.platforms.includes('tiktok')) {
      slot.platforms = slot.platforms.filter(p => p !== 'tiktok');
    }
  });
  
  // Agregar un slot de video_corto si no existe
  const hasVideo = day.slots.some(s => s.type === 'video_corto');
  if (!hasVideo) {
    day.slots.push({
      time: '18:00',
      type: 'video_corto',
      platforms: ['instagram', 'facebook', 'tiktok', 'youtube'],
      language: 'es'
    });
  }
});

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Updated calendar.json');
