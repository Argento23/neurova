import { createClient } from '@supabase/supabase-js';
import config from './config.js';
import logger from './logger.js';
import { parseCSV } from './utils/csv-parser.js';
import calendarDb from './db/calendar-db.js';
import usersDb from './db/users-db.js';

const supabase = config.SUPABASE_URL && config.SUPABASE_KEY
  ? createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
  : null;

/**
 * Downloads and parses the catalog CSV for a specific user
 */
async function processUserCatalog(user) {
  if (!supabase) return;
  
  logger.info(`Checking catalog for user ${user.id} (${user.email})`);
  
  try {
    // List files in the user's folder
    const { data: files, error: listError } = await supabase.storage
      .from('catalogs')
      .list(user.id);
      
    if (listError) throw listError;
    if (!files || files.length === 0) return; // No catalog uploaded
    
    // Find the latest catalog file
    const catalogFile = files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    if (!catalogFile.name.endsWith('.csv')) return;
    
    const filePath = `${user.id}/${catalogFile.name}`;
    
    // Download file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('catalogs')
      .download(filePath);
      
    if (downloadError) throw downloadError;
    
    const csvText = await fileData.text();
    const products = parseCSV(csvText);
    
    if (products.length === 0) {
      logger.warn(`Catalog for ${user.id} is empty or unparsable`);
      return;
    }
    
    logger.info(`Found ${products.length} products for ${user.id}`);
    
    // Schedule posts for each product
    const today = new Date();
    let scheduledCount = 0;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      // Basic validation: needs at least a title
      const title = product.titulo || product.nombre || product.title || product.name;
      if (!title) continue;
      
      const price = product.precio || product.price || '';
      const currency = product.moneda || product.currency || '$';
      const desc = product.descripcion || product.description || '';
      const image = product.link_imagen || product.imagen || product.image || '';
      
      // Schedule one product per day starting tomorrow
      const postDate = new Date(today);
      postDate.setDate(postDate.getDate() + 1 + i);
      const dateStr = postDate.toISOString().split('T')[0];
      
      const topic = `Producto Destacado: ${title}. ${price ? 'Precio: ' + currency + ' ' + price + '.' : ''} ${desc}`;
      
      // Check if post already exists for this date to avoid duplicates
      // (This is a simplified check, ideally we'd check if this exact product is already scheduled)
      const exists = await calendarDb.postExists(user.id, dateStr, '12:00', 'producto');
      
      if (!exists) {
        await calendarDb.createPost({
          ownerId: user.id,
          date: dateStr,
          publishTime: '12:00', // Default noon
          type: 'producto',
          topic: topic,
          language: user.language || 'es',
          platforms: user.platforms_enabled || ['instagram', 'facebook']
        });
        
        // If the CSV provided an image URL, we can inject it directly so the AI doesn't have to generate one.
        // We'll fetch the created post and update its image_url
        if (image) {
          // get the posts we just created
          const posts = await calendarDb.getUserPosts(user.id, dateStr);
          const newPost = posts.find(p => p.post_type === 'producto' && p.topic === topic);
          if (newPost) {
             await calendarDb.updatePost(newPost.id, { imageUrl: image });
          }
        }
        scheduledCount++;
      }
    }
    
    logger.info(`Scheduled ${scheduledCount} new posts from catalog for user ${user.id}`);
    
  } catch (error) {
    logger.error(`Failed to process catalog for ${user.id}`, { error: error.message });
  }
}

/**
 * Runs the catalog processor for all active users
 */
export async function processAllCatalogs() {
  logger.info('═══ BATCH CATALOG PROCESSING ═══');
  try {
    const users = await usersDb.getActiveUsers();
    for (const user of users) {
      await processUserCatalog(user);
    }
    logger.info('═══ CATALOG PROCESSING COMPLETE ═══');
  } catch (err) {
    logger.error('Failed to run batch catalog processing', { error: err.message });
  }
}
