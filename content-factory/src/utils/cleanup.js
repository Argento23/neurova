import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..', '..');

const MAX_AGE_DAYS = 7;
const DIRECTORIES = [
  join(ROOT, 'output', 'videos'),
  join(ROOT, 'output', 'images'),
  join(ROOT, 'output', 'audio'),
  join(ROOT, 'data', 'logs')
];

/**
 * Borra archivos más viejos que MAX_AGE_DAYS en los directorios configurados
 */
export async function cleanupOldFiles() {
  console.log(`\n🧹 Iniciando limpieza de archivos antiguos (más de ${MAX_AGE_DAYS} días)...`);
  
  const now = Date.now();
  const maxAgeMs = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  for (const dir of DIRECTORIES) {
    try {
      const files = await readdir(dir);
      let deletedCount = 0;

      for (const file of files) {
        if (file === '.gitkeep') continue;
        
        const filePath = join(dir, file);
        const fileStat = await stat(filePath);

        if (fileStat.isFile() && (now - fileStat.mtimeMs) > maxAgeMs) {
          await unlink(filePath);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        console.log(`   ✅ [${dir.split(/[\\/]/).pop()}] Borrados ${deletedCount} archivos.`);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`   ❌ Error limpiando ${dir}:`, err.message);
      }
    }
  }
  console.log('✨ Limpieza completada.\n');
}

// Si se ejecuta directamente
if (process.argv[1] === __filename) {
  cleanupOldFiles();
}
