import axios from 'axios';
import config from '../config.js';
import logger from '../logger.js';

/**
 * Telegram Notifier — Sends daily reports and alerts.
 * Create a bot via @BotFather, get the token.
 * Get your chat_id by sending /start to @userinfobot.
 */
class TelegramNotifier {
  constructor() {
    this.token = config.TELEGRAM_BOT_TOKEN;
    this.chatId = config.TELEGRAM_CHAT_ID;
    this.apiBase = `https://api.telegram.org/bot${this.token}`;
  }

  isConfigured() {
    return !!(this.token && this.chatId);
  }

  /**
   * Send a text message
   */
  async send(message) {
    if (!this.isConfigured()) {
      logger.debug('Telegram not configured, skipping notification');
      return;
    }

    try {
      await axios.post(`${this.apiBase}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      }, { timeout: 10000 });
    } catch (error) {
      logger.error('Telegram send failed', { error: error.message });
    }
  }

  /**
   * Send daily report
   */
  async sendDailyReport(stats) {
    const now = new Date().toLocaleString('es-AR', { timeZone: config.TIMEZONE });

    const message = `
📊 <b>REPORTE DIARIO — ${config.BRAND_NAME} Content Factory</b>
🕐 ${now}

<b>📅 Hoy:</b>
✅ Publicados: ${stats.today.published}
⏳ Pendientes: ${stats.today.pending}
🔄 Generando: ${stats.today.generating}
✔️ Listos: ${stats.today.ready}
❌ Errores: ${stats.today.error}

<b>📈 Esta semana:</b>
📸 Total publicados: ${stats.thisWeek.published}

<b>💾 Sistema:</b>
📁 Total posts en calendario: ${stats.total}
🟢 Estado: Operativo
    `.trim();

    await this.send(message);
  }

  /**
   * Send error alert
   */
  async sendAlert(title, error) {
    const message = `
🚨 <b>ALERTA — ${config.BRAND_NAME} Content Factory</b>

<b>${title}</b>
❌ Error: <code>${error}</code>

⏰ ${new Date().toLocaleString('es-AR', { timeZone: config.TIMEZONE })}
    `.trim();

    await this.send(message);
  }

  /**
   * Send publish confirmation
   */
  async sendPublishConfirmation(platform, postType, topic) {
    const emojis = {
      instagram: '📸',
      tiktok: '🎵',
      youtube: '📺'
    };

    const message = `
${emojis[platform] || '📤'} <b>PUBLICADO en ${platform.toUpperCase()}</b>

📝 Tipo: ${postType}
💡 Tema: ${topic}
⏰ ${new Date().toLocaleTimeString('es-AR', { timeZone: config.TIMEZONE })}
    `.trim();

    await this.send(message);
  }
}

const telegramNotifier = new TelegramNotifier();
export default telegramNotifier;
