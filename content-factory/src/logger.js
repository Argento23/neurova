import winston from 'winston';
import config from './config.js';
import { join } from 'path';
import { mkdirSync } from 'fs';

// Ensure logs directory exists
try { mkdirSync(config.LOGS_DIR, { recursive: true }); } catch {}

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'content-factory' },
  transports: [
    new winston.transports.File({
      filename: join(config.LOGS_DIR, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 3
    }),
    new winston.transports.File({
      filename: join(config.LOGS_DIR, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5
    })
  ]
});

// Console output in dev/all modes
logger.add(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
      return `${timestamp} [${level}] ${message}${metaStr}`;
    })
  )
}));

export default logger;
