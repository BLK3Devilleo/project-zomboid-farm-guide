import { queryD1 } from './d1Client';

let isBootstrapped = false;

/**
 * Inicializador DDL Idempotente y Migrador en Caliente para Cloudflare D1.
 * Se ejecuta de forma no bloqueante una sola vez por ciclo de vida del servidor/contenedor.
 */
export async function ensureProductionTables() {
  if (isBootstrapped) return;

  try {
    // 1. Tabla de Votos en Servidores
    await queryD1(`
      CREATE TABLE IF NOT EXISTS server_votes (
        user_id TEXT NOT NULL,
        server_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, server_id),
        FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
      )
    `);

    // 2. Tabla de Reseñas de Servidores (3 Estrellas)
    await queryD1(`
      CREATE TABLE IF NOT EXISTS server_reviews (
        id TEXT PRIMARY KEY,
        server_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_avatar TEXT,
        user_role TEXT DEFAULT 'usuario',
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 3),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE,
        UNIQUE(server_id, user_id)
      )
    `);

    // 3. Tabla de Comentarios Normalizados del Foro
    await queryD1(`
      CREATE TABLE IF NOT EXISTS forum_comments (
        id TEXT PRIMARY KEY,
        thread_id TEXT NOT NULL,
        parent_id TEXT,
        author_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_badge TEXT DEFAULT '[SUPERVIVIENTE]',
        author_color TEXT DEFAULT '#38bdf8',
        content TEXT NOT NULL,
        upvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE
      )
    `);

    // 4. Tabla de Votos Únicos en el Foro
    await queryD1(`
      CREATE TABLE IF NOT EXISTS forum_votes (
        user_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        thread_id TEXT,
        target_type TEXT DEFAULT 'thread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, target_id)
      )
    `);

    // 5. Migraciones en caliente (Auto-reparación de columnas faltantes en tablas existentes)
    try {
      await queryD1("ALTER TABLE server_reviews ADD COLUMN user_role TEXT DEFAULT 'usuario'");
    } catch (e) {
      // Ignorar si la columna ya existe
    }

    try {
      await queryD1("ALTER TABLE server_reviews ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
    } catch (e) {
      // Ignorar si la columna ya existe
    }

    try {
      await queryD1("ALTER TABLE forum_votes ADD COLUMN thread_id TEXT");
    } catch (e) {
      // Ignorar si la columna ya existe
    }

    try {
      await queryD1("ALTER TABLE forum_votes ADD COLUMN target_id TEXT");
    } catch (e) {
      // Ignorar si la columna ya existe
    }

    try {
      await queryD1("ALTER TABLE forum_votes ADD COLUMN target_type TEXT DEFAULT 'thread'");
    } catch (e) {
      // Ignorar si la columna ya existe
    }

    // Sincronizar thread_id <-> target_id para compatibilidad total de votos
    try {
      await queryD1("UPDATE forum_votes SET thread_id = target_id WHERE (thread_id IS NULL OR thread_id = '') AND target_id IS NOT NULL");
    } catch (e) {}

    try {
      await queryD1("UPDATE forum_votes SET target_id = thread_id WHERE (target_id IS NULL OR target_id = '') AND thread_id IS NOT NULL");
    } catch (e) {}

    // Saneamiento de banners locales /uploads/ que quedaron huérfanos tras reiniciar el contenedor
    try {
      await queryD1("UPDATE servers SET banner_url = '/spiffo/spiffo_character.png' WHERE banner_url LIKE '/uploads/%'");
    } catch (e) {}

    // 6. Índices de aceleración
    await queryD1(`CREATE INDEX IF NOT EXISTS idx_server_reviews_server ON server_reviews(server_id)`);
    await queryD1(`CREATE INDEX IF NOT EXISTS idx_forum_comments_thread ON forum_comments(thread_id)`);

    isBootstrapped = true;
  } catch (err) {
    console.warn('Advertencia en ensureProductionTables (D1 Bootstrap):', err.message);
  }
}
